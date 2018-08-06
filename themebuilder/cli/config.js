var path = require("path");

var theme = process.env["npm_config_theme_name"] || "generic.light";
var metadataFilePath = process.env["npm_config_metadata_file_path"] || "";
var fileExtension = process.env["npm_config_file_format"] === "scss" ? ".scss" : ".less";

var themeName = theme.split(".")[0];
var colorScheme = theme.split(".")[1] + (theme.split(".")[2] ? "-" + theme.split(".")[2] : "");
var isBootstrap = path.extname(metadataFilePath) === ".scss" || path.extname(metadataFilePath) === ".less";
var bootstrapVersion = isBootstrap ? (path.extname(metadataFilePath) === ".scss" ? 4 : 3) : 0;

var cssFileName = themeName + "." + colorScheme.replace(/-/, ".") + ".custom.css";
var cssFolderPath = "cli/artifacts/";

module.exports = {
    metadataFilePath: metadataFilePath,
    fileExtension: fileExtension,

    themeName: themeName,
    colorScheme: colorScheme,
    isBootstrap: isBootstrap,
    bootstrapVersion: bootstrapVersion,

    cssFileName: cssFileName,
    cssFolderPath: cssFolderPath
};

