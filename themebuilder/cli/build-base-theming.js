var config = require("./config.js");
var builder = require("../modules/builder.js");
var fs = require("fs");

var filePath = config.cssFolderPath + config.themeName + "." + config.colorScheme.replace(/-/, ".") + ".base." + config.fileFormat;
var baseParameters = ["@base-accent", "@base-text-color", "@base-bg", "@base-border-color", "@base-border-radius"];

builder.buildTheme(config).then(function(result) {
    var content = "",
        metadata = result.compiledMetadata;

    for(var metadataKey in metadata) {
        if(baseParameters.indexOf(metadataKey) === -1) continue;

        var formatKey = metadataKey;
        if(config.fileFormat === "scss") formatKey = metadataKey.replace("@", "$");
        content += formatKey + ": " + metadata[metadataKey] + ";\n";
    }

    fs.writeFile(filePath, content, "utf8", function(error) {
        if(error) throw error;
    });

}).catch(function(error) {
    throw error;
});
