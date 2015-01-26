var tools = require("browserify-transform-tools");
var fs = require("fs");
var path = require("path");
var _ = require("lodash-node");

// Returns an array of package objects, with sources resolved absolutely
var getPackageMap = _.once(function (relativeTo, pkgs) {
  relativeTo = path.resolve(relativeTo);
  log("Generating pkgify map relative to", relativeTo);
  var map = _.map(pkgs, function (src, name) {
    var pkg = {
      name: name,
      src: path.resolve(relativeTo, src),
      dir: false
    };
    pkg.depth = pkg.src.split("/").length;
    pkg.regexp = new RegExp("^" + pkg.name);
    var stat = fs.statSync(pkg.src);
    if (stat.isDirectory()) {
      pkg.dir = true;
    }
    return pkg;
  });
  log("Generated pkgify map:", map);
  return map;
});

// Try and find a package for the match
function findPackage(config, match) {
  var map = getPackageMap(config.relativeTo || process.cwd(), config.packages);

  return _.reduce(map, function (prev, pkg) {

    // Resolve using last priority. Priority:
    // 1. package is a file
    // 2. package granularity (done by file depth)
    if (pkg.regexp.test(match) && (!prev || (pkg.dir && prev.dir && pkg.depth >= pkg.depth) || pkg.file)) {
      return pkg;
    } else {
      return prev;
    }

  }, null);
}

// Log function, only used if verbose option is passed in
var verbose = false;
function log() {
  if (verbose) {
    console.log.apply(console, arguments);
  }
}

// Transform function
function transform(args, opts, cb) {
  verbose = opts.config.verbose;

  var oldRequire = args[0];

  // Only look at non-local require statements
  if (oldRequire[0] !== ".") {

    log("Processing", oldRequire, "in", opts.file);

    // Try and find a matching package
    var pkg = findPackage(opts.config, oldRequire);
    if (pkg) {
      var newRequire = oldRequire.replace(pkg.name, pkg.src);
      log("Found pkg for", oldRequire, ":", pkg.name);
      log("Mapping to", newRequire);
      return cb(null, "require(\"" + newRequire + "\")");
    }

  }

  // Default behaviour - just return original
  return cb();
}


// Transform options
var opts = {
  evaluateArguments: true
};

// Export transform
module.exports = tools.makeRequireTransform("pkgify", opts, transform);