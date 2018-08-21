#! /usr/bin/env node

const config = require("./config.js");
const builder = require("../modules/builder.js");
const fs = require("fs");

builder.buildTheme(config).then(result => {
    const outputPath = config.out || config.themeName + "." + config.colorScheme.replace(/-/, ".") + ".custom.css";

    fs.writeFile(outputPath, result.css, "utf8", error => {
        if(error) throw error;
    });
}).catch(error => {
    throw error;
});


