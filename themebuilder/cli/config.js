var path = require("path");
var readFile = require("./adapters/node-file-reader");
var createRecursive = require("./helpers/recursive-path-creator");

var theme = process.env["npm_config_theme_name"] || "generic.light";
var metadataFilePath = process.env["npm_config_metadata_file_path"] || "";
var fileFormat = process.env["npm_config_file_format"] || "less";
var swatchSelector = process.env["npm_config_swatch_selector"];
var out = process.env["npm_config_out"];

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

