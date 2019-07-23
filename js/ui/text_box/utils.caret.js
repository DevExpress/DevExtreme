import $ from "../../core/renderer";
import { isDefined } from "../../core/utils/type";
import browser from "../../core/utils/browser";
import domAdapter from "../../core/dom_adapter";

const isFocusingOnCaretChange = browser.msie || browser.safari;

const getCaret = function(input) {
    let range;

    try {
        range = {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    } catch(e) {
        range = {
            start: 0,
            end: 0
        };
    }

    return range;
};

const setCaret = function(input, position) {
    if(!domAdapter.getBody().contains(input)) {
        return;
    }

    try {
        input.selectionStart = position.start;
        input.selectionEnd = position.end;
    } catch(e) { }
};

const caret = function(input, position) {
    input = $(input).get(0);

    if(!isDefined(position)) {
        return getCaret(input);
    }

    // NOTE: IE focuses element input after caret position has changed
    if(isFocusingOnCaretChange && domAdapter.getActiveElement() !== input) {
        return;
    }

    setCaret(input, position);
};

module.exports = caret;
