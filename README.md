# postcss-deps
Detect the css dependency graph.

Use `@deps "module"` to indicate the dependency relationship.

## Example

Input:
```
⌘ tree example/fixtures
example/fixtures
├── entry.css
├── entry.expected.css
├── node_modules
│   ├── @style -> ../style_modules
│   └── reset
│       └── index.css
└── style_modules
    ├── base
    │   ├── base.css
    │   └── package.json
    ├── colors
    │   └── index.css
    └── deps
        ├── deps.css
        └── index.css
```

entry.css:

```css
@deps "reset";
@deps "@style/base";
@import "@style/deps";
a {
  color: green;
}

```

deps.css:

```css
@deps "../colors";
a {
  color: red;
}

```

example/deps.js:

```javascript
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

```

output:

```
⌘ node example/deps.js


Deps Detected:
--------------
[ '/Users/zoubin/usr/src/zoubin/postcss-deps/test/fixtures/node_modules/reset/index.css',
  '/Users/zoubin/usr/src/zoubin/postcss-deps/test/fixtures/style_modules/base/base.css',
  '/Users/zoubin/usr/src/zoubin/postcss-deps/test/fixtures/style_modules/colors/index.css' ]


Original:
---------
@deps "reset";
@deps "@style/base";
@import "@style/deps";
a {
  color: green;
}




Compiled:
---------
a {
  color: red;
}
a {
  color: green;
}

```

