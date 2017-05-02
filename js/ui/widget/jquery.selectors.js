"use strict";

var $ = require("../../core/renderer");

var focusable = function(element, tabIndex) {
    if(!visible(element)) {
        return false;
    }
    var nodeName = element.nodeName.toLowerCase(),
        isTabIndexNotNaN = !isNaN(tabIndex),
        isDisabled = element.disabled,
        isDefaultFocus = /^(input|select|textarea|button|object|iframe)$/.test(nodeName),
        isHyperlink = nodeName === "a",
        isFocusable = true;

    if(isDefaultFocus) {
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
        return focusable(element, $(element).attr("tabindex"));
    },
    tabbable: function(index, element) {
        var tabIndex = $(element).attr("tabindex");
        return (isNaN(tabIndex) || tabIndex >= 0) && focusable(element, tabIndex);
    }
};

