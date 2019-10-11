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

exports.getOptionNameFromFullName = getOptionNameFromFullName;
exports.getFullOptionName = getFullOptionName;
exports.getTextWithoutSpaces = getTextWithoutSpaces;
exports.isExpectedItem = isExpectedItem;
exports.createItemPathByIndex = createItemPathByIndex;
exports.concatPaths = concatPaths;
