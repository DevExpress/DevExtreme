import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';

export const createItemPathByIndex = (index, isTabs) => `${isTabs ? 'tabs' : 'items'}[${index}]`;

export const concatPaths = (path1, path2) => {
    if(isDefined(path1) && isDefined(path2)) {
        return `${path1}.${path2}`;
    }
    return path1 || path2;
};

export const getTextWithoutSpaces = text => text ? text.replace(/\s/g, '') : undefined;

export const isEqualToDataFieldOrNameOrTitleOrCaption = (item, fieldName) => {
    if(item) {
        return item.dataField === fieldName
            || item.name === fieldName
            || getTextWithoutSpaces(item.title) === fieldName
            || (item.itemType === 'group' && getTextWithoutSpaces(item.caption) === fieldName);
    }
    return false;
};

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

export const getItemPath = (items, item, isTabs) => {
    const index = items.indexOf(item);
    if(index > -1) {
        return createItemPathByIndex(index, isTabs);
    }
    for(let i = 0; i < items.length; i++) {
        const targetItem = items[i];
        const tabOrGroupItems = targetItem.tabs || targetItem.items;
        if(tabOrGroupItems) {
            const itemPath = getItemPath(tabOrGroupItems, item, targetItem.tabs);
            if(itemPath) {
                return concatPaths(createItemPathByIndex(i, isTabs), itemPath);
            }
        }
    }
};

export function convertToLayoutManagerOptions({ form, $formElement, formOptions, items, validationGroup, extendedLayoutManagerOptions,
    onFieldDataChanged, onContentReady, onDisposing, onFieldItemRendered
}) {
    const baseOptions = {
        form: form,
        items,
        $formElement,
        validationGroup,
        onFieldDataChanged,
        onContentReady,
        onDisposing,
        onFieldItemRendered,
        validationBoundary: formOptions.scrollingEnabled ? $formElement : undefined,
        scrollingEnabled: formOptions.scrollingEnabled,
        showRequiredMark: formOptions.showRequiredMark,
        showOptionalMark: formOptions.showOptionalMark,
        requiredMark: formOptions.requiredMark,
        optionalMark: formOptions.optionalMark,
        requiredMessage: formOptions.requiredMessage,
        screenByWidth: formOptions.screenByWidth,
        layoutData: formOptions.formData,
        labelLocation: formOptions.labelLocation,
        customizeItem: formOptions.customizeItem,
        minColWidth: formOptions.minColWidth,
        showColonAfterLabel: formOptions.showColonAfterLabel,
        onEditorEnterKey: formOptions.onEditorEnterKey,
        labelMode: formOptions.labelMode,
    };

    // cannot use '=' because 'extend' makes special assingment
    const result = extend(baseOptions, {
        isRoot: extendedLayoutManagerOptions.isRoot,
        colCount: extendedLayoutManagerOptions.colCount,
        alignItemLabels: extendedLayoutManagerOptions.alignItemLabels,
        cssItemClass: extendedLayoutManagerOptions.cssItemClass,
        colCountByScreen: extendedLayoutManagerOptions.colCountByScreen,
        onLayoutChanged: extendedLayoutManagerOptions.onLayoutChanged,
        width: extendedLayoutManagerOptions.width
    });
    return result;
}
