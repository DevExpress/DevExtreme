import $ from '../../core/renderer';
import { isDefined } from '../../core/utils/type';
import devices from '../../core/devices';
import domAdapter from '../../core/dom_adapter';

const { ios, mac } = devices.real();
const isFocusingOnCaretChange = ios || mac;

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

const caret = function(input, position, force = false) {
    input = $(input).get(0);

    if(!isDefined(position)) {
        return getCaret(input);
    }

    // NOTE: AppleWebKit-based browsers focuses element input after caret position has changed
    if(!force && isFocusingOnCaretChange && domAdapter.getActiveElement() !== input) {
        return;
    }

    setCaret(input, position);
};

export default caret;
