import { isDefined } from '../../core/utils/type';

export const createItemPathByIndex = (index, isTabs) => `${isTabs ? 'tabs' : 'items'}[${index}]`;

export const concatPaths = (path1, path2) => {
    if(isDefined(path1) && isDefined(path2)) {
        return `${path1}.${path2}`;
    }
    return path1 || path2;
};

export const getTextWithoutSpaces = text => text ? text.replace(/\s/g, '') : undefined;

export const isExpectedItem = (item, fieldName) => item && (item.dataField === fieldName || item.name === fieldName ||
    getTextWithoutSpaces(item.title) === fieldName || (item.itemType === 'group' && getTextWithoutSpaces(item.caption) === fieldName));

export const getFullOptionName = (path, optionName) => `${path}.${optionName}`;

export const getOptionNameFromFullName = fullName => {
    const parts = fullName.split('.');
    return parts[parts.length - 1].replace(/\[\d+]/, '');
};

export const tryGetTabPath = fullPath => {
    const pathParts = fullPath.split('.');
    const resultPathParts = [...pathParts];

    for(let i = pathParts.length - 1; i >= 0; i--) {
        if(isFullPathContainsTabs(pathParts[i])) {
            return resultPathParts.join('.');
        }
        resultPathParts.splice(i, 1);
    }
    return '';
};

export const isFullPathContainsTabs = fullPath => fullPath.indexOf('tabs') > -1;
