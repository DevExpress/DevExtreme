import $ from '../../../core/renderer';
export const FIELD_EMPTY_ITEM_CLASS = 'dx-field-empty-item';

export function renderEmptyItem({ $parent, rootElementCssClassList }) {
    return $('<div>')
        .addClass(FIELD_EMPTY_ITEM_CLASS)
        .html('&nbsp;')
        .addClass(rootElementCssClassList.join(' '))
        .appendTo($parent);
}
