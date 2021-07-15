import $ from '../../core/renderer';
import { isDefined } from '../../core/utils/type';

import {
    WIDGET_CLASS,
    FIELD_ITEM_LABEL_TEXT_CLASS,
    HIDDEN_LABEL_CLASS,
    FIELD_ITEM_OPTIONAL_MARK_CLASS,
    FIELD_ITEM_REQUIRED_MARK_CLASS,
    FIELD_ITEM_LABEL_CONTENT_CLASS,
    FIELD_ITEM_LABEL_LOCATION_CLASS,
    FIELD_ITEM_LABEL_CLASS,
    FIELD_ITEM_CONTENT_WRAPPER_CLASS,
    FIELD_ITEM_HELP_TEXT_CLASS
} from './constants';

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

export const getLabelWidthByText = (renderLabelOptions) => {
    const $hiddenContainer = $('<div>')
        .addClass(WIDGET_CLASS)
        .addClass(HIDDEN_LABEL_CLASS)
        .appendTo('body');

    const $label = renderLabel(renderLabelOptions).appendTo($hiddenContainer);

    const labelTextElement = $label.find('.' + FIELD_ITEM_LABEL_TEXT_CLASS)[0];

    // this code has slow performance
    const result = labelTextElement.offsetWidth;

    $hiddenContainer.remove();

    return result;
};

export const renderLabel = ({ text, id, location, alignment, labelID = null, markOptions = {} }) => {
    if(!isDefined(text) || text.length <= 0) {
        return null;
    }

    return $('<label>')
        .addClass(FIELD_ITEM_LABEL_CLASS + ' ' + FIELD_ITEM_LABEL_LOCATION_CLASS + location)
        .attr('for', id)
        .attr('id', labelID)
        .css('textAlign', alignment)
        .append(
            $('<span>').addClass(FIELD_ITEM_LABEL_CONTENT_CLASS).append(
                $('<span>').addClass(FIELD_ITEM_LABEL_TEXT_CLASS).text(text),
                _renderLabelMark(markOptions)
            )
        );
};

export function renderHelpText({ $target, helpText, isSimpleItem, helpID }) {
    if(helpText && isSimpleItem) {
        $target.wrap(
            // TODO: this code modifies internal elements of the passed '$target' element
            // instead, try to wrap passed '$target' element without changes in internal details
            $('<div>').addClass(FIELD_ITEM_CONTENT_WRAPPER_CLASS)
        );

        return $('<div>')
            .addClass(FIELD_ITEM_HELP_TEXT_CLASS)
            .attr('id', helpID)
            .text(helpText);
    }
}

function _renderLabelMark({ isRequiredMark, requiredMark, isOptionalMark, optionalMark }) {
    if(!isRequiredMark && !isOptionalMark) {
        return null;
    }

    return $('<span>')
        .addClass(isRequiredMark ? FIELD_ITEM_REQUIRED_MARK_CLASS : FIELD_ITEM_OPTIONAL_MARK_CLASS)
        .text(String.fromCharCode(160) + (isRequiredMark ? requiredMark : optionalMark));
}
