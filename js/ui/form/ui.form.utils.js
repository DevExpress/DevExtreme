import { isDefined } from "../../core/utils/type";

const createItemPathByIndex = (index, isTabs) => `${isTabs ? "tabs" : "items"}[${index}]`;

const concatPaths = (path1, path2) => {
    if(isDefined(path1) && isDefined(path2)) {
        return `${path1}.${path2}`;
    }
    return path1 || path2;
};

const getTextWithoutSpaces = text => text ? text.replace(/\s/g, '') : undefined;

const isExpectedItem = (item, fieldName) => item && (item.dataField === fieldName || item.name === fieldName ||
    getTextWithoutSpaces(item.title) === fieldName || (item.itemType === "group" && getTextWithoutSpaces(item.caption) === fieldName));

const getFullOptionName = (path, optionName) => `${path}.${optionName}`;

const getOptionNameFromFullName = fullName => {
    const parts = fullName.split(".");
    return parts[parts.length - 1].replace(/\[\d+]/, "");
};

const getTabPathFromFullPath = fullPath => {
    const pathParts = fullPath.split(".");
    const resultPathParts = [...pathParts];

    for(let i = pathParts.length - 1; i >= 0; i--) {
        if(isFullPathContainsTabs(pathParts[i])) {
            return resultPathParts.join(".");
        }
        resultPathParts.splice(i, 1);
    }
    return "";
};

const isFullPathContainsTabs = fullPath => fullPath.indexOf("tabs") > -1;

exports.getOptionNameFromFullName = getOptionNameFromFullName;
exports.getFullOptionName = getFullOptionName;
exports.getTextWithoutSpaces = getTextWithoutSpaces;
exports.isExpectedItem = isExpectedItem;
exports.createItemPathByIndex = createItemPathByIndex;
exports.concatPaths = concatPaths;
exports.getTabPathFromFullPath = getTabPathFromFullPath;
exports.isFullPathContainsTabs = isFullPathContainsTabs;
