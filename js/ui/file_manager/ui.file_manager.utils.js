import { each } from '../../core/utils/iterator';

const PATH_SEPARATOR = '/';

const getFileExtension = path => {
    const index = path.lastIndexOf('.');
    return index !== -1 ? path.substr(index) : '';
};

const getName = path => {
    const index = path.lastIndexOf(PATH_SEPARATOR);
    return index !== -1 ? path.substr(index + PATH_SEPARATOR.length) : path;
};

const getParentPath = path => {
    const index = path.lastIndexOf(PATH_SEPARATOR);
    return index !== -1 ? path.substr(0, index) : '';
};

const getPathParts = (path, includeFullPath) => {
    const result = path.split(PATH_SEPARATOR);

    if(includeFullPath) {
        for(let i = 0; i < result.length; i++) {
            result[i] = pathCombine(i === 0 ? '' : result[i - 1], result[i]);
        }
    }

    return result;
};

const pathCombine = function() {
    let result = '';

    each(arguments, (_, arg) => {
        if(arg) {
            if(result) {
                result += PATH_SEPARATOR;
            }

            result += arg;
        }
    });

    return result;
};

const getDisplayFileSize = function(byteSize) {
    const sizesTitles = [ 'B', 'KB', 'MB', 'GB', 'TB' ];
    let index = 0;
    let displaySize = byteSize;
    while(displaySize >= 1024 && index <= sizesTitles.length - 1) {
        displaySize /= 1024;
        index++;
    }
    displaySize = Math.round(displaySize * 10) / 10;
    return `${displaySize} ${sizesTitles[index]}`;
};

module.exports.getFileExtension = getFileExtension;
module.exports.getName = getName;
module.exports.getParentPath = getParentPath;
module.exports.getPathParts = getPathParts;
module.exports.pathCombine = pathCombine;
module.exports.getDisplayFileSize = getDisplayFileSize;
