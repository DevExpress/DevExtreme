var fs = require("fs");

module.exports = function(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, "utf8", function(error, data) {
            if(error) reject(error);
            else resolve(data);
        });
    });
};
