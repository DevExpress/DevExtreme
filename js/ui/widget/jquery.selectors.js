"use strict";

var $ = require("jquery");

var focusable = function(element, tabIndex) {
    var nodeName = element.nodeName.toLowerCase(),
        isTabIndexNotNaN = !isNaN(tabIndex),
        isVisible = visible(element),
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

    return isVisible ? isFocusable : false;
};

var visible = function(element) {
    var $element = $(element);
    return $element.is(":visible") && $element.css("visibility") !== "hidden" && $element.parents().css("visibility") !== "hidden";
};

var icontains = function(elem, text) {
    var result = false;
    $.each($(elem).contents(), function(index, content) {
        if(content.nodeType === 3 && (content.textContent || content.nodeValue || "").toLowerCase().indexOf((text || "").toLowerCase()) > -1) {
            result = true;
            return false;
        }
    });
    return result;
};

$.extend($.expr[':'], {
    "dx-focusable": function(element) {
        return focusable(element, $.attr(element, "tabindex"));
    },

    "dx-tabbable": function(element) {
        var tabIndex = $.attr(element, "tabindex");
        return (isNaN(tabIndex) || tabIndex >= 0) && focusable(element, tabIndex);
    },

    "dx-icontains": $.expr.createPseudo(function(text) {
        return function(elem) {
            return icontains(elem, text);
        };
    })
});

module.exports = {
    focusable: ":dx-focusable",
    tabbable: ":dx-tabbable",
    icontains: ":dx-icontains"
};

