var config = require("./config.js");
var builder = require("./builder.js");
var fs = require("fs");

builder.buildTheme(config).then(function(result) {
    if(!fs.existsSync(config.cssFolderPath)) {
        fs.mkdirSync(config.cssFolderPath);
    }

    fs.writeFile(config.cssFolderPath + config.cssFileName, result.css, "utf8", function(error) {
        if(error) throw error;
    });
}).catch(function(error) {
    throw error;
});


