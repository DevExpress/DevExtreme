import { each } from "../../core/utils/iterator";

const PATH_SEPARATOR = "/";

const getFileExtension = path => {
    const index = path.lastIndexOf(".");
    return index !== -1 ? path.substr(index) : "";
};

const getName = path => {
    const index = path.lastIndexOf(PATH_SEPARATOR);
    return index !== -1 ? path.substr(index + PATH_SEPARATOR.length) : path;
};

const getParentPath = path => {
    const index = path.lastIndexOf(PATH_SEPARATOR);
    return index !== -1 ? path.substr(0, index) : "";
};

const getPathParts = (path, includeFullPath) => {
    path = path || "";
    if(path === "" || path === "/") {
        return [];
    }
    const result = [];
    let pathPart = "";

    for(let i = 0; i < path.length; i++) {
        let char = path.charAt(i);
        if(char === PATH_SEPARATOR) {
            const nextChar = path.charAt(i + 1);
            if(nextChar !== PATH_SEPARATOR) {
                if(i !== 0) {
                    result.push(pathPart);
                    pathPart = "";
                }
                char = nextChar;
            }
            i++;
        }
        pathPart += char;
    }

    if(pathPart || !result.length) {
        result.push(pathPart);
    }

    if(includeFullPath) {
        for(let i = 0; i < result.length; i++) {
            result[i] = pathCombine(i === 0 ? "" : result[i - 1], result[i]);
        }
    }

    return result;
};

const getEscapedFileName = function(fileName) {
    return fileName.replace(/\//g, "//");
};

const pathCombine = function() {
    let result = "";

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
    const sizesTitles = [ "B", "KB", "MB", "GB", "TB" ];
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
module.exports.getEscapedFileName = getEscapedFileName;
module.exports.pathCombine = pathCombine;
module.exports.getDisplayFileSize = getDisplayFileSize;
module.exports.PATH_SEPARATOR = PATH_SEPARATOR;
