const path = require("path");
const readFile = require("./adapters/node-file-reader");
const createRecursive = require("./helpers/recursive-path-creator");
const parseCommandLine = require('minimist');

let config = parseCommandLine(process.argv.slice(2));
let theme = config["theme-name"] || "generic.light";
let metadataFilePath = config["metadata-file-path"] || "";
let fileFormat = config["file-format"] || "less";
let swatchSelector = config["swatch-selector"];
let out = config["out"];

let themeParts = theme.split(".");
let themeName = themeParts[0];
let colorScheme = themeParts[1] + (themeParts[2] ? "-" + themeParts[2] : "");
let isBootstrap = false;
let bootstrapVersion = 0;

let metadataPromise = metadataFilePath
    ? readFile(metadataFilePath)
    : new Promise(resolve => resolve("{}"));

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

