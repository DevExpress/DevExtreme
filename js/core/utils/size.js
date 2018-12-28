var window = require("../../core/utils/window").getWindow();
var typeUtils = require("../utils/type");

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

var getSize = function(element, name, include) {
    var elementStyles = window.getComputedStyle(element);

    var boxParams = getElementBoxParams(name, elementStyles);

    var clientRect = element.getClientRects().length;
    var boundingClientRect = element.getBoundingClientRect()[name];

    var result = clientRect ? boundingClientRect : 0;

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

var calculateLimitHeight = function(value, container, offset, defaultValue) {
    if(!value) {
        return defaultValue;
    }

    if(value === "auto" || value === "none" || value === "inherit" || value === "initial") {
        return offset ? defaultValue : value;
    }

    if(typeof value === "string") {
        if(value.indexOf("px") > 0) {
            value = parseInt(value.replace("px", ""));
        } else if(value.indexOf("%") > 0) {
            var containerHeight = typeUtils.isWindow(container) ? container.innerHeight : container.offsetHeight;
            value = parseInt(value.replace("%", "")) * containerHeight / 100;
        } else if(!isNaN(value)) {
            value = parseInt(value);
        }
    }

    if(typeof value === "number") {
        return Math.max(0, value + offset);
    }

    var operationString = offset < 0 ? " - " : " ";

    return "calc(" + value + operationString + Math.abs(offset) + "px)";
};

var calculateMaxHeight = function(value, container, offset) {
    return calculateLimitHeight(value, container, offset, "none");
};

var calculateMinHeight = function(value, container, offset) {
    return calculateLimitHeight(value, container, offset, 0);
};

var getPaddingsHeight = function(element, includeMargin) {
    if(!element) {
        return 0;
    }

    const boxParams = getElementBoxParams("height", window.getComputedStyle(element));

    return boxParams.padding
        + boxParams.border
        + (includeMargin ? boxParams.margin : 0);
};

var getVisibleHeight = function(element) {
    if(element) {
        var boundingClientRect = element.getBoundingClientRect();

        if(boundingClientRect.height) {
            return boundingClientRect.height;
        }
    }

    return 0;
};

exports.getSize = getSize;
exports.getElementBoxParams = getElementBoxParams;
exports.calculateMaxHeight = calculateMaxHeight;
exports.calculateMinHeight = calculateMinHeight;
exports.getPaddingsHeight = getPaddingsHeight;
exports.getVisibleHeight = getVisibleHeight;
