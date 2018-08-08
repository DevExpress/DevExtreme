var path = require("path");
var readFile = require("./adapters/node-file-reader");

var theme = process.env["npm_config_theme_name"] || "generic.light";
var metadataFilePath = process.env["npm_config_metadata_file_path"] || "";
var fileFormat = process.env["npm_config_file_format"];
var swatchSelector = process.env["npm_config_swatch_selector"];

var themeName = theme.split(".")[0];
var colorScheme = theme.split(".")[1] + (theme.split(".")[2] ? "-" + theme.split(".")[2] : "");
var isBootstrap = false;
var bootstrapVersion = 0;

var metadataPromise = readFile(metadataFilePath);

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

var cssFileName = themeName + "." + colorScheme.replace(/-/, ".") + ".custom.css";
var cssFolderPath = "cli/artifacts/";

module.exports = {
    metadataPromise: metadataPromise,
    fileFormat: fileFormat,

    themeName: themeName,
    colorScheme: colorScheme,
    isBootstrap: isBootstrap,
    bootstrapVersion: bootstrapVersion,

    cssFileName: cssFileName,
    cssFolderPath: cssFolderPath,
    swatchSelector: swatchSelector,

    reader: readFile,
    lessCompiler: require("less/lib/less-node")
};

