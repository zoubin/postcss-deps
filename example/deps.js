var postcss = require('postcss');
var atImport = require('postcss-import');
var atDeps = require('..');
var path = require('path');
var fs = require('fs');

var fixtures = path.resolve.bind(path, __dirname, 'fixtures');
var src = fixtures('entry.css');
var contents = fs.readFileSync(src, 'utf8');
postcss(
  atImport(),
  atDeps({
    onDeps: function (deps) {
      log('Deps Detected:', deps);
    },
  })
)
.process(contents, { from: src })
.then(function (result) {
  log('Original:', contents);
  log('Compiled:', result.css);
})
.catch(function (err) {
  console.log(err);
});

function log(str, c) {
  console.log('\n');
  console.log(str);
  console.log('-'.repeat(str.length));
  console.log(c);
}

