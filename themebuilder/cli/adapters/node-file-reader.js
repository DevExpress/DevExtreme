const fs = require("fs");

module.exports = filename => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf8", (error, data) => {
            if(error) reject(error);
            else resolve(data);
        });
    });
};
