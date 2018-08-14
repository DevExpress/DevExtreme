#! /usr/bin/env node

const config = require("./config.js");
const builder = require("../modules/builder.js");
const fs = require("fs");

const filePath = config.out || config.themeName + "." + config.colorScheme.replace(/-/, ".") + ".base." + config.fileFormat;
const baseParameters = ["@base-accent", "@base-text-color", "@base-bg", "@base-border-color", "@base-border-radius"];

builder.buildTheme(config).then(result => {
    let content = "";
    let metadata = result.compiledMetadata;

    for(let metadataKey in metadata) {
        if(baseParameters.indexOf(metadataKey) === -1) continue;

        let formatKey = metadataKey;
        if(config.fileFormat === "scss") formatKey = metadataKey.replace("@", "$");
        content += formatKey + ": " + metadata[metadataKey] + ";\n";
    }

    fs.writeFile(filePath, content, "utf8", error => {
        if(error) throw error;
    });

}).catch(error => {
    throw error;
});
