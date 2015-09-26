var postcss = require('postcss');
var asyncMap = require('slide').asyncMap;
var path = require('path');
var getp = require('getp');
var resolver = require('custom-resolve');
var mix = require('util-mix');
var nub = require('nub');

module.exports = postcss.plugin(
  'postcss-deps',
  atDeps
);

function atDeps(opts) {
  opts = opts || {};
  var resolve;
  if (typeof opts.resolve === 'function') {
    resolve = opts.resolve;
  } else {
    resolve = resolver(mix(
      {
        packageEntry: 'style',
        extensions: '.css',
        symlinks: true,
      },
      opts.resolve
    ));
  }
  return function (root) {
    var cssID = opts.from || getp(root, 'nodes', 0, 'source', 'input', 'from');
    var srcFile = opts.from || getp(root, 'nodes', 0, 'source', 'input', 'file');
    var basedir = srcFile && path.dirname(srcFile) || process.cwd();
    return new Promise(function (rs, rj) {
      asyncMap(
        detect(root, opts),
        function (info, cb) {
          resolve(
            info[0],
            {
              basedir: info[1] && path.dirname(info[1]) || basedir,
            },
            cb
          );
        },
        function (err, files) {
          if (err) {
            return rj(err);
          }
          if (typeof opts.onDeps === 'function') {
            opts.onDeps(nub(files), cssID);
          }
          rs();
        }
      );
    });
  };
}

function detect(root, opts) {
  var deps = [];
  root.walkAtRules(opts.atRuleName || 'deps', function (rule) {
    deps.push([
      rule.params.replace(/['"]/g, ''),
      getp(rule, 'source', 'input', 'file'),
    ]);
    if (opts.remove !== false) {
      rule.remove();
    }
  });
  return deps;
}

