var path = require('path');
var fs = require('fs');

module.exports = function(filePath) {
    var directoryName = path.dirname(filePath);

    directoryName
        .split(/\\|\//)
        .reduce(function(currentPath, folder) {
            currentPath += folder + path.sep;
            if(!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
            }
            return currentPath;
        }, "");
};

