import $ from '../../../core/renderer';
import { isDefined } from '../../../core/utils/type';
import { isEmpty } from '../../../core/utils/string';

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

function _renderLabelMark({ showRequiredMark, requiredMark, showOptionalMark, optionalMark }) {
    if(!showRequiredMark && !showOptionalMark) {
        return null;
    }

    return $('<span>')
        .addClass(showRequiredMark ? FIELD_ITEM_REQUIRED_MARK_CLASS : FIELD_ITEM_OPTIONAL_MARK_CLASS)
        .text(String.fromCharCode(160) + (showRequiredMark ? requiredMark : optionalMark));
}

export function setLabelWidthByMaxLabelWidth($targetContainer, labelsSelector, labelMarkOptions) {
    const FIELD_ITEM_LABEL_CONTENT_CLASS_Selector = `${labelsSelector} > .${FIELD_ITEM_LABEL_CLASS}:not(.${FIELD_ITEM_LABEL_LOCATION_CLASS}top) > .${FIELD_ITEM_LABEL_CONTENT_CLASS}`;

    const $FIELD_ITEM_LABEL_CONTENT_CLASS_Items = $targetContainer.find(FIELD_ITEM_LABEL_CONTENT_CLASS_Selector);
    const FIELD_ITEM_LABEL_CONTENT_CLASS_Length = $FIELD_ITEM_LABEL_CONTENT_CLASS_Items.length;
    let labelWidth;
    let i;
    let maxWidth = 0;

    for(i = 0; i < FIELD_ITEM_LABEL_CONTENT_CLASS_Length; i++) {
        labelWidth = getLabelWidthByInnerHTML({
        // _hiddenLabelText was introduced in https://hg/mobile/rev/27b4f57f10bb , "dxForm: add alignItemLabelsInAllGroups and fix type script"
        // It's not clear why $labelTexts.offsetWidth doesn't meet the needs
            $FIELD_ITEM_LABEL_CONTENT_CLASS: $FIELD_ITEM_LABEL_CONTENT_CLASS_Items[i],
            location: 'left',
            markOptions: labelMarkOptions
        });
        if(labelWidth > maxWidth) {
            maxWidth = labelWidth;
        }
    }
    for(i = 0; i < FIELD_ITEM_LABEL_CONTENT_CLASS_Length; i++) {
        $FIELD_ITEM_LABEL_CONTENT_CLASS_Items[i].style.width = maxWidth + 'px';
    }
}

function getLabelWidthByInnerHTML(options) {
    const { $FIELD_ITEM_LABEL_CONTENT_CLASS, ...renderLabelOptions } = options;
    const $hiddenContainer = $('<div>')
        .addClass(WIDGET_CLASS)
        .addClass(GET_LABEL_WIDTH_BY_TEXT_CLASS)
        .appendTo('body');

    renderLabelOptions.text = ' '; // space was in initial PR https://hg/mobile/rev/27b4f57f10bb
    const $label = renderLabel(renderLabelOptions).appendTo($hiddenContainer);

    const labelTextElement = $label.find('.' + FIELD_ITEM_LABEL_TEXT_CLASS)[0];

    // this code has slow performance
    // innerHTML was added in https://hg/mobile/rev/3ed89cf230a4 for T350537
    // innerHTML is read from a DOMElement.innerHTML
    labelTextElement.innerHTML = getLabelInnerHTML($FIELD_ITEM_LABEL_CONTENT_CLASS);
    const result = labelTextElement.offsetWidth;

    $hiddenContainer.remove();

    return result;
}

function getLabelInnerHTML($FIELD_ITEM_LABEL_CONTENT_CLASS) {
    const length = $FIELD_ITEM_LABEL_CONTENT_CLASS.children.length;
    let child;
    let result = '';
    let i;

    for(i = 0; i < length; i++) {
        child = $FIELD_ITEM_LABEL_CONTENT_CLASS.children[i];
        // Was introduced in https://hg/mobile/rev/1f81a5afaab3 , "dxForm: fix test cafe tests":
        // It's not clear why "$labelTexts[i].children[0].innerHTML" doesn't meet the needs.
        result = result + (!isEmpty(child.innerText) ? child.innerText : child.innerHTML);
    }

    return result;
}
