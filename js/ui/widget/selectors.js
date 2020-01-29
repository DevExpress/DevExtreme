const $ = require('../../core/renderer');
const domAdapter = require('../../core/dom_adapter');

const focusable = function(element, tabIndex) {
    if(!visible(element)) {
        return false;
    }
    const nodeName = element.nodeName.toLowerCase();
    const isTabIndexNotNaN = !isNaN(tabIndex);
    const isDisabled = element.disabled;
    const isDefaultFocus = /^(input|select|textarea|button|object|iframe)$/.test(nodeName);
    const isHyperlink = nodeName === 'a';
    let isFocusable = true;
    const isContentEditable = element.isContentEditable;

    if(isDefaultFocus || isContentEditable) {
        isFocusable = !isDisabled;
    } else {
        if(isHyperlink) {
            isFocusable = element.href || isTabIndexNotNaN;
        } else {
            isFocusable = isTabIndexNotNaN;
        }
    }

    return isFocusable;
};

function visible(element) {
    const $element = $(element);
    return $element.is(':visible') && $element.css('visibility') !== 'hidden' && $element.parents().css('visibility') !== 'hidden';
}

module.exports = {
    focusable: function(index, element) {
        return focusable(element, $(element).attr('tabIndex'));
    },
    tabbable: function(index, element) {
        const tabIndex = $(element).attr('tabIndex');
        return (isNaN(tabIndex) || tabIndex >= 0) && focusable(element, tabIndex);
    },
    // note: use this method instead of is(":focus")
    focused: function($element) {
        const element = $($element).get(0);
        return domAdapter.getActiveElement() === element;
    }
};

