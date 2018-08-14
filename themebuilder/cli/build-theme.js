#! /usr/bin/env node

var config = require("./config.js");
var builder = require("../modules/builder.js");
var fs = require("fs");

builder.buildTheme(config).then(result => {
    const outputPath = config.out || config.themeName + "." + config.colorScheme.replace(/-/, ".") + ".custom.css";

    fs.writeFile(outputPath, result.css, "utf8", error => {
        if(error) throw error;
    });
}).catch(error => {
    throw error;
});


