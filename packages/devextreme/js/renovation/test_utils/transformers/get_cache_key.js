const crypto = require('crypto');

module.exports = function(fileData, filePath, configStr, transformerFileSrc) {
    return crypto
        .createHash('md5')
        .update(transformerFileSrc)
        .update('\0', 'utf8')
        .update(fileData)
        .update('\0', 'utf8')
        .update(filePath)
        .update('\0', 'utf8')
        .update(configStr)
        .digest('hex');
};
