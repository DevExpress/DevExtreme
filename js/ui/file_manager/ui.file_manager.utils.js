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

const getPathParts = path => {
    return path.split(PATH_SEPARATOR);
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

module.exports.getFileExtension = getFileExtension;
module.exports.getName = getName;
module.exports.getParentPath = getParentPath;
module.exports.getPathParts = getPathParts;
module.exports.pathCombine = pathCombine;
