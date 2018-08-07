var $ = require("../../core/renderer"),
    domAdapter = require("../../core/dom_adapter");

var focusable = function(element, tabIndex) {
    if(!visible(element)) {
        return false;
    }
    var nodeName = element.nodeName.toLowerCase(),
        isTabIndexNotNaN = !isNaN(tabIndex),
        isDisabled = element.disabled,
        isDefaultFocus = /^(input|select|textarea|button|object|iframe)$/.test(nodeName),
        isHyperlink = nodeName === "a",
        isFocusable = true,
        isContentEditable = element.isContentEditable;

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

var visible = function(element) {
    var $element = $(element);
    return $element.is(":visible") && $element.css("visibility") !== "hidden" && $element.parents().css("visibility") !== "hidden";
};

module.exports = {
    focusable: function(index, element) {
        return focusable(element, $(element).attr("tabIndex"));
    },
    tabbable: function(index, element) {
        var tabIndex = $(element).attr("tabIndex");
        return (isNaN(tabIndex) || tabIndex >= 0) && focusable(element, tabIndex);
    },
    // note: use this method instead of is(":focus")
    focused: function($element) {
        var element = $($element).get(0);
        return domAdapter.getActiveElement() === element;
    }
};

