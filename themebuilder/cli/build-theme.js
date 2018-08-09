var config = require("./config.js");
var builder = require("../modules/builder.js");
var fs = require("fs");

builder.buildTheme(config).then(function(result) {
    var outputPath = config.out || config.themeName + "." + config.colorScheme.replace(/-/, ".") + ".custom.css";

    fs.writeFile(outputPath, result.css, "utf8", function(error) {
        if(error) throw error;
    });
}).catch(function(error) {
    throw error;
});


