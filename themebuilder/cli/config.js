var path = require("path");

var theme = process.env["npm_config_theme_name"] || "generic.light";
var metadataFilePath = process.env["npm_config_metadata_file_path"] || "";
var fileFormat = process.env["npm_config_file_format"];

var themeName = theme.split(".")[0];
var colorScheme = theme.split(".")[1] + (theme.split(".")[2] ? "-" + theme.split(".")[2] : "");
var isBootstrap = false;
var bootstrapVersion = 0;

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
    metadataFilePath: metadataFilePath,
    fileFormat: fileFormat,

    themeName: themeName,
    colorScheme: colorScheme,
    isBootstrap: isBootstrap,
    bootstrapVersion: bootstrapVersion,

    cssFileName: cssFileName,
    cssFolderPath: cssFolderPath
};

