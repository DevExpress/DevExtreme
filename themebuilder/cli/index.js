#! /usr/bin/env node

/* eslint no-console: 0 */

const config = require("./config.js")(process.argv);
const commands = require("./commands");
const builder = require("../modules/builder.js");
const baseParameters = require("../modules/base-parameters");
const fs = require("fs");

builder.buildTheme(config).then(result => {
    let content = "";

    if(config.command === commands.BUILD_THEME) {
        content = result.css;
        if(result.swatchSelector) {
            console.log(`Use '${result.swatchSelector}' selector for swatch.`);
        }
    } else if(config.command === commands.BUILD_VARS) {
        let metadata = result.compiledMetadata;

        for(let metadataKey in metadata) {
            if(config.base && baseParameters.indexOf(metadataKey) === -1) continue;

            const formatKey = config.fileFormat === "scss" ? metadataKey.replace("@", "$") : metadataKey;
            content += formatKey + ": " + metadata[metadataKey] + ";\n";
        }
    }

    fs.writeFile(config.out, content, "utf8", error => {
        if(error) throw error;
    });

}).catch(error => {
    throw error;
});
