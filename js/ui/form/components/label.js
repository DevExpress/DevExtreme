import $ from '../../../core/renderer';
import { isDefined } from '../../../core/utils/type';

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

function _renderLabelMark({ isRequiredMark, requiredMark, isOptionalMark, optionalMark }) {
    if(!isRequiredMark && !isOptionalMark) {
        return null;
    }

    return $('<span>')
        .addClass(isRequiredMark ? FIELD_ITEM_REQUIRED_MARK_CLASS : FIELD_ITEM_OPTIONAL_MARK_CLASS)
        .text(String.fromCharCode(160) + (isRequiredMark ? requiredMark : optionalMark));
}

export function getLabelWidthByInnerHTML(options) {
    const { innerHTML, ...renderLabelOptions } = options;
    const $hiddenContainer = $('<div>')
        .addClass(WIDGET_CLASS)
        .addClass(GET_LABEL_WIDTH_BY_TEXT_CLASS)
        .appendTo('body');

    renderLabelOptions.text = ' '; // space was in initial PR https://hg/mobile/rev/27b4f57f10bb
    const $label = renderLabel(renderLabelOptions).appendTo($hiddenContainer);

    const labelTextElement = $label.find('.' + FIELD_ITEM_LABEL_TEXT_CLASS)[0];

    // this code has slow performance
    // innerHTML was added in https://hg/mobile/rev/3ed89cf230a4 for T350537
    // innerHTML is received from a DOM element (see _getLabelInnerHTML in ui.form.js)
    labelTextElement.innerHTML = innerHTML;
    const result = labelTextElement.offsetWidth;

    $hiddenContainer.remove();

    return result;
}
