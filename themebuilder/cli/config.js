var path = require("path");
var readFile = require("./adapters/node-file-reader");
var createRecursive = require("./helpers/recursive-path-creator");
var parseCommandLine = require('minimist');

var config = parseCommandLine(process.argv.slice(2));
var theme = config["theme-name"] || "generic.light";
var metadataFilePath = config["metadata-file-path"] || "";
var fileFormat = config["file-format"] || "less";
var swatchSelector = config["swatch-selector"];
var out = config["out"];

var themeName = theme.split(".")[0];
var colorScheme = theme.split(".")[1] + (theme.split(".")[2] ? "-" + theme.split(".")[2] : "");
var isBootstrap = false;
var bootstrapVersion = 0;

var metadataPromise = metadataFilePath
    ? readFile(metadataFilePath)
    : new Promise(function(resolve) { resolve("{}"); });

switch(path.extname(metadataFilePath)) {
    case ".scss":
        isBootstrap = true;
        bootstrapVersion = 4;
        break;
    case ".less":
        isBootstrap = true;
        bootstrapVersion = 3;
        break;
}

if(out) createRecursive(out);

module.exports = {
    metadataPromise: metadataPromise,
    fileFormat: fileFormat,

    themeName: themeName,
    colorScheme: colorScheme,
    isBootstrap: isBootstrap,
    bootstrapVersion: bootstrapVersion,

    swatchSelector: swatchSelector,
    out: out,

    reader: readFile,
    lessCompiler: require("less/lib/less-node")
};

