"use strict";

var window = require("../../core/utils/window").getWindow();

var getSizeByStyles = function(elementStyles, styles) {
    var result = 0;

    styles.forEach(function(style) {
        result += (parseFloat(elementStyles[style]) || 0);
    });

    return result;
};

var getElementBoxParams = function(name, elementStyles) {
    var beforeName = name === "width" ? "Left" : "Top";
    var afterName = name === "width" ? "Right" : "Bottom";

    return {
        padding: getSizeByStyles(elementStyles, ["padding" + beforeName, "padding" + afterName]),
        border: getSizeByStyles(elementStyles, ["border" + beforeName + "Width", "border" + afterName + "Width"]),
        margin: getSizeByStyles(elementStyles, ["margin" + beforeName, "margin" + afterName]),
    };
};

var getBoxSizingOffset = function(name, elementStyles, boxParams) {
    var size = elementStyles[name];

    if(elementStyles.boxSizing === "border-box" && size.length && size[size.length - 1] !== "%") {
        return boxParams.border + boxParams.padding;
    }

    return 0;
};

var getSize = function(element, name, include, ignoreInvisibility) {
    var elementStyles = window.getComputedStyle(element);

    var boxParams = getElementBoxParams(name, elementStyles);

    var clientRect = element.getClientRects().length;
    var boundingClientRect = element.getBoundingClientRect()[name];

    var result = clientRect ? boundingClientRect : 0;

    if(!ignoreInvisibility && elementStyles.display === 'none' && !result) {
        result = getSizeOfVisibleElement(element, name, include);
    }

    if(result <= 0) {
        result = parseFloat(elementStyles[name] || element.style[name]) || 0;

        result -= getBoxSizingOffset(name, elementStyles, boxParams);
    } else {
        result -= boxParams.padding + boxParams.border;
    }

    if(include.paddings) {
        result += boxParams.padding;
    }
    if(include.borders) {
        result += boxParams.border;
    }
    if(include.margins) {
        result += boxParams.margin;
    }

    return result;
};

var testStyles = {
    display: 'block',
    position: "absolute",
    visibility: "hidden"
};

var getSizeOfVisibleElement = function(element, name, include) {
    var originalStyles = {},
        style;

    for(style in testStyles) {
        originalStyles[style] = element.style[style];
        element.style[style] = testStyles[style];
    }

    var result = getSize(element, name, include, true);

    for(style in testStyles) {
        element.style[style] = originalStyles[style];
    }

    return result;
};

exports.getSize = getSize;
exports.getElementBoxParams = getElementBoxParams;
