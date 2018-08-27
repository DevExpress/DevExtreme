const fs = require("fs");
const path = require("path");

module.exports = (filename, service) => {
    return new Promise((resolve, reject) => {
        if(service) {
            filename = path.join(__dirname, "../..", filename);
        }
        fs.readFile(filename, "utf8", (error, data) => {
            error ? reject(error) : resolve(data);
        });
    });
};
