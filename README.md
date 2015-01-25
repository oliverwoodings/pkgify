# pkgify

Pkgify is a [browserify](https://github.com/substack/node-browserify) transform that allows you to rewrite module/package-style `require` calls to local files. It is built using the [browserify-transform-tools](https://github.com/benbria/browserify-transform-tools).

* Clean up your require calls!
* Supports individual files and entire directories
* Simple configuration
* File-type indifferent


## Installation

`npm install --save-dev pkgify`


## Purpose

Say, for example, your project has the following tree structure:

```
myproject
  - /app
    - /views
      - /home
        - index.js
      - /about
        - index.js
    - /models
      - cars.js
    - log.js
```

Normally, if you wanted to access `log.js` and `models/cars.js` from either of the two view files, you would have to do it like so:
```js
var log = require("../../log");
var Cars = require("../../models/cars");
```
With pkgify, however, you can save yourself time and clean up your code so it looks like this:
```js
var log = require("log");
var Cars = require("models/cars");
```

## Usage

Usage is identical to any other `browserify-transform-tools` transforms:

#### package.json
Directly in package.json:

```
{
  "pkgify": {
    "packages": {
      "views": "./app/views",
      "log": "./app/log.js"
    }
  }
}
```

or using referencing a separate JS file in package.json:

```
{
  "pkgify": "./pkgifyConfig.js"
}
```

#### Browserify API

```js
var pkgify = require("pkgify");

b.transform(pkgify, {
  packages: {
    views: "./app/views",
    log: "./app/log.js"
  },
  relativeTo: __dirname
});
```


## Configuration options

#### `packages`
* Type: object
* Required: yes
* Description: A mapping of package names to their source. The source is resolved in relation to the `relativeTo` option and can reference either a file or directory. If a file is specified it's extension must be included.

#### `relativeTo`
* Type: string
* Required: no
* Description: Path to resolve package sources against. If using package.json for configuration, this value will default to the location of the package.json file. If you are using the API, it will default to the location you are configuring from. It is advisable to always explicitly set this option when using the API using `__dirname`.

#### `appliesTo`
* Type: object
* Required: no
* Description: Control what files are processed by the transform. This is an option provided by [browserify-transform-tools](https://github.com/benbria/browserify-transform-tools/wiki/Transform-Configuration#common-configuration).