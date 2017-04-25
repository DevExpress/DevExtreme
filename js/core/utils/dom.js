"use strict";

var $ = require("jquery"),
    errors = require("../errors"),
    commonUtils = require("./common");

var resetActiveElement = function() {
    var activeElement = document.activeElement;
    if(activeElement && activeElement !== document.body && activeElement.blur) {
        activeElement.blur();
    }
};

var getSelection = function() {
    if(window.getSelection) return window.getSelection();
    if(document.selection) return document.selection;
    return null;
};

var clearSelection = function() {
    var selection = getSelection();
    if(!selection) return;
    if(selection.type === "Caret") return;

    if(selection.empty) {
        selection.empty();
    } else if(selection.removeAllRanges) {
        selection.removeAllRanges();
    }
};

var closestCommonParent = function(startTarget, endTarget) {
    var $startParents = $(startTarget).parents().addBack(),
        $endParents = $(endTarget).parents().addBack(),

        startingParent = Math.min($startParents.length, $endParents.length) - 1;

    for(var i = startingParent; i >= 0; i--) {
        if($startParents.eq(i).is($endParents.eq(i))) {
            return $startParents.get(i);
        }
    }
};



var triggerVisibilityChangeEvent = function(eventName) {
    var VISIBILITY_CHANGE_SELECTOR = ".dx-visibility-change-handler";

    return function(element) {
        var $element = $(element || "body");

        var $changeHandlers = $element
            .find(VISIBILITY_CHANGE_SELECTOR)
            .add($element.filter(VISIBILITY_CHANGE_SELECTOR));

        $changeHandlers.each(function() {
            $(this).triggerHandler(eventName);
        });
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

    elements.find(selector).addBack(selector).each(function(index, element) {
        var $element = $(element),
            options = getElementOptions(element);

        for(var componentName in options) {
            if(!componentTypes || $.inArray(componentName, componentTypes) > -1) {
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

exports.ready = function(callback) {
    //NOTE: we can't use document.readyState === "interactive" because of ie9/ie10 support
    if(document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
        callback();
        return;
    }

    var loadedCallback = function() {
        callback();
        document.removeEventListener("DOMContentLoaded", loadedCallback);
    };
    document.addEventListener("DOMContentLoaded", loadedCallback);
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
exports.getSelection = getSelection;
exports.uniqueId = uniqueId;
exports.closestCommonParent = closestCommonParent;
exports.clipboardText = clipboardText;
exports.toggleAttr = toggleAttr;
