"use strict";

var $ = require("../../core/renderer"),
    errors = require("../errors"),
    inArray = require("./array").inArray,
    commonUtils = require("./common");

var resetActiveElement = function() {
    var activeElement = document.activeElement;
    if(activeElement && activeElement !== document.body && activeElement.blur) {
        activeElement.blur();
    }
};

var clearSelection = function() {
    var selection = window.getSelection();
    if(!selection) return;
    if(selection.type === "Caret") return;

    if(selection.empty) {
        selection.empty();
    } else if(selection.removeAllRanges) {
        //T522811
        try {
            selection.removeAllRanges();
        } catch(e) {}
    }
};

var closestCommonParent = function(startTarget, endTarget) {
    var $startTarget = $(startTarget),
        $endTarget = $(endTarget);

    if($startTarget[0] === $endTarget[0]) {
        return $startTarget[0];
    }

    var $startParents = $startTarget.parents(),
        $endParents = $endTarget.parents(),
        startingParent = Math.min($startParents.length, $endParents.length);

    for(var i = -startingParent; i < 0; i++) {
        if($startParents.get(i) === $endParents.get(i)) {
            return $startParents.get(i);
        }
    }
};



var triggerVisibilityChangeEvent = function(eventName) {
    var VISIBILITY_CHANGE_SELECTOR = ".dx-visibility-change-handler";

    return function(element) {
        var $element = $(element || "body");

        var changeHandlers = $element.filter(VISIBILITY_CHANGE_SELECTOR).
            add($element.find(VISIBILITY_CHANGE_SELECTOR));

        for(var i = 0; i < changeHandlers.length; i++) {
            $(changeHandlers[i]).triggerHandler(eventName);
        }
    };
};

var uniqueId = (function() {
    var counter = 0;

    return function(prefix) {
        return (prefix || "") + counter++;
    };
})();


var dataOptionsAttributeName = "data-options";

var getElementOptions = function(element) {
    /* jshint evil:true */
    var optionsString = $(element).attr(dataOptionsAttributeName),
        result;

    if($.trim(optionsString).charAt(0) !== "{") {
        optionsString = "{" + optionsString + "}";
    }
    try {
        result = (new Function("return " + optionsString))();
    } catch(ex) {
        throw errors.Error("E3018", ex, optionsString);
    }
    return result;
};

var createComponents = function(elements, componentTypes) {
    var result = [],
        selector = "[" + dataOptionsAttributeName + "]";

    var $items = elements.find(selector).add(elements.filter(selector));
    $items.each(function(index, element) {
        var $element = $(element),
            options = getElementOptions(element);

        for(var componentName in options) {
            if(!componentTypes || inArray(componentName, componentTypes) > -1) {
                if($element[componentName]) {
                    $element[componentName](options[componentName]);
                    result.push($element[componentName]("instance"));
                }
            }
        }
    });

    return result;
};

var createMarkupFromString = function(str) {
    if(!window.WinJS) {
        return $(str);
    }

    var tempElement = $("<div />");

    // otherwise WinJS browser strips HTML comments required for KO
    window.WinJS.Utilities.setInnerHTMLUnsafe(tempElement.get(0), str);

    return tempElement.contents();
};


var normalizeTemplateElement = function(element) {
    var $element = commonUtils.isDefined(element) && (element.nodeType || element.jquery)
        ? $(element)
        : $("<div>").html(element).contents();

    if($element.length === 1) {
        if($element.is("script")) {
            $element = normalizeTemplateElement($element.html());
        } else if($element.is("table")) {
            $element = $element.children("tbody").contents();
        }
    }

    return $element;
};

var toggleAttr = function($target, attr, value) {
    value ? $target.attr(attr, value) : $target.removeAttr(attr);
};


var clipboardText = function(event, text) {
    var clipboard = (event.originalEvent && event.originalEvent.clipboardData) || window.clipboardData;

    if(arguments.length === 1) {
        return clipboard && clipboard.getData("Text");
    }

    clipboard && clipboard.setData("Text", text);
};


exports.resetActiveElement = resetActiveElement;
exports.createMarkupFromString = createMarkupFromString;
exports.triggerShownEvent = triggerVisibilityChangeEvent("dxshown");
exports.triggerHidingEvent = triggerVisibilityChangeEvent("dxhiding");
exports.triggerResizeEvent = triggerVisibilityChangeEvent("dxresize");
exports.getElementOptions = getElementOptions;
exports.createComponents = createComponents;
exports.normalizeTemplateElement = normalizeTemplateElement;
exports.clearSelection = clearSelection;
exports.uniqueId = uniqueId;
exports.closestCommonParent = closestCommonParent;
exports.clipboardText = clipboardText;
exports.toggleAttr = toggleAttr;
