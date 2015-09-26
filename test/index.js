var test = require('tap').test;
var atDeps = require('..');
var atImport = require('postcss-import');
var postcss = require('postcss');
var path = require('path');
var fs = require('fs');
var fixtures = path.resolve.bind(path, __dirname, 'fixtures');

test('deps', function(t) {
  t.plan(3);
  var src = fixtures('entry.css');
  var expected = fs.readFileSync(fixtures('entry.expected.css'), 'utf8');
  postcss(
    atImport(),
    atDeps({
      onDeps: function (files, srcFile) {
        t.same(
          files.sort(),
          [
            fixtures('node_modules', 'reset', 'index.css'),
            fixtures('style_modules', 'base', 'base.css'),
            fixtures('style_modules', 'colors', 'index.css'),
          ].sort()
        );
        t.equal(srcFile, src);
      },
    })
  )
  .process(
    fs.readFileSync(src, 'utf8'),
    {
      from: src,
    }
  )
  .then(function (result) {
    t.equal(result.css, expected);
  }, function (err) {
    console.log(err);
  });
});

