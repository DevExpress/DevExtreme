var $ = require("../../core/renderer"),
    isDefined = require("../../core/utils/type").isDefined,
    browser = require("../../core/utils/browser"),
    domAdapter = require("../../core/dom_adapter");

var isFocusingOnCaretChange = browser.msie || browser.safari;

var getCaret = function(input) {
    var range;

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

var setCaret = function(input, position) {
    if(!domAdapter.getBody().contains(input)) {
        return;
    }

    try {
        input.selectionStart = position.start;
        input.selectionEnd = position.end;
    } catch(e) { }
};

var caret = function(input, position) {
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
