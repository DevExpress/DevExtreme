import $ from '../../core/renderer';
import errors from '../widget/ui.errors';
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
    FIELD_ITEM_HELP_TEXT_CLASS,
    FIELD_BUTTON_ITEM_CLASS,
    FIELD_ITEM_CLASS,
    FIELD_ITEM_CONTENT_CLASS,
    FIELD_ITEM_CONTENT_LOCATION_CLASS
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

export function getLabelWidthByText(renderLabelOptions) {
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
}

export function renderLabel({ text, id, location, alignment, labelID = null, markOptions = {} }) {
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
}

export function renderHelpText(helpText, helpID) {
    return $('<div>')
        .addClass(FIELD_ITEM_HELP_TEXT_CLASS)
        .attr('id', helpID)
        .text(helpText);
}

function _renderLabelMark({ isRequiredMark, requiredMark, isOptionalMark, optionalMark }) {
    if(!isRequiredMark && !isOptionalMark) {
        return null;
    }

    return $('<span>')
        .addClass(isRequiredMark ? FIELD_ITEM_REQUIRED_MARK_CLASS : FIELD_ITEM_OPTIONAL_MARK_CLASS)
        .text(String.fromCharCode(160) + (isRequiredMark ? requiredMark : optionalMark));
}

export function convertAlignmentToJustifyContent(verticalAlignment) {
    switch(verticalAlignment) {
        case 'center':
            return 'center';
        case 'bottom':
            return 'flex-end';
        default:
            return 'flex-start';
    }
}

export function convertAlignmentToTextAlign(horizontalAlignment) {
    return isDefined(horizontalAlignment) ? horizontalAlignment : 'right';
}

export function adjustContainerAsButtonItem({ $container, justifyContent, textAlign, cssItemClass, targetColIndex }) {
    // TODO: try to create $container in this function and return it
    $container
        .addClass(FIELD_BUTTON_ITEM_CLASS)
        .css('textAlign', textAlign)
        .addClass(FIELD_ITEM_CLASS)
        .addClass(cssItemClass)
        .addClass(isDefined(targetColIndex) ? 'dx-col-' + targetColIndex : '');

    // TODO: try to avoid changes in $container.parent() and adjust the created $elements only
    $container.parent().css('justifyContent', justifyContent);
}

export function adjustEditorContainer({ $container, labelLocation }) {
    const locationClassSuffix = { right: 'left', left: 'right', top: 'bottom' };
    $container.
        addClass(FIELD_ITEM_CONTENT_CLASS).
        addClass(FIELD_ITEM_CONTENT_LOCATION_CLASS + locationClassSuffix[labelLocation]);
}

export function renderTemplateTo({ $container, template, templateOptions }) {
    template.render({
        model: templateOptions,
        container: $container
    });
}

export function renderComponentTo({ $container, createComponentCallback, componentType, componentOptions, helpID, labelID, isRequired }) {
    const $div = $('<div>').appendTo($container);

    try {
        const result = createComponentCallback($div, componentType, componentOptions);
        result.setAria('describedby', helpID);
        result.setAria('labelledby', labelID);
        result.setAria('required', isRequired);
        return result;
    } catch(e) {
        errors.log('E1035', e.message);
    }
}

