var config = require("./config.js");
var builder = require("./builder.js");
var fs = require("fs");

var filePath = config.cssFolderPath + config.themeName + "." + config.colorScheme.replace(/-/, ".") + ".base" + config.fileExtension;
var baseParameters = ["@base-accent", "@base-text-color", "@base-bg", "@base-border-color", "@base-border-radius"];

builder.buildTheme(config).then(function(result) {
    var content = "",
        metadata = result.compiledMetadata;

    for(var metadataKey in metadata) {
        if(baseParameters.indexOf(metadataKey) !== -1) {
            content += ((config.fileExtension === ".less") ? metadataKey : metadataKey.replace(/@/, "$")) + ": " + metadata[metadataKey] + ";\n";
        }
    }

    fs.writeFile(filePath, content, "utf8", function(error) {
        if(error) throw error;
    });

}).catch(function(error) {
    throw error;
});
