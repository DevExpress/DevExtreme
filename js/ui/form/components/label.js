import $ from '../../../core/renderer';
import { isDefined } from '../../../core/utils/type';
import { getLabelMarkText } from '../ui.form.layout_manager.utils';

import {
    WIDGET_CLASS,
    FIELD_ITEM_LABEL_CONTENT_CLASS,
    FIELD_ITEM_LABEL_CLASS,
} from '../constants';

// TODO: exported for tests only
export const GET_LABEL_WIDTH_BY_TEXT_CLASS = 'dx-layout-manager-hidden-label';
export const FIELD_ITEM_REQUIRED_MARK_CLASS = 'dx-field-item-required-mark';
export const FIELD_ITEM_LABEL_LOCATION_CLASS = 'dx-field-item-label-location-';
export const FIELD_ITEM_OPTIONAL_MARK_CLASS = 'dx-field-item-optional-mark';
export const FIELD_ITEM_LABEL_TEXT_CLASS = 'dx-field-item-label-text';

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

function _renderLabelMark(markOptions) {
    const markText = getLabelMarkText(markOptions);
    if(markText === '') {
        return null;
    }

    return $('<span>')
        .addClass(markOptions.isRequiredMark ? FIELD_ITEM_REQUIRED_MARK_CLASS : FIELD_ITEM_OPTIONAL_MARK_CLASS)
        .text(markText);
}

export function getLabelWidthByText(renderLabelOptions) {
    const $hiddenContainer = $('<div>')
        .addClass(WIDGET_CLASS)
        .addClass(GET_LABEL_WIDTH_BY_TEXT_CLASS)
        .appendTo('body');

    const $label = renderLabel(renderLabelOptions).appendTo($hiddenContainer);

    const labelTextElement = $label.find('.' + FIELD_ITEM_LABEL_TEXT_CLASS)[0];

    // this code has slow performance
    const result = labelTextElement.offsetWidth;

    $hiddenContainer.remove();

    return result;
}
