"use strict";

var _styles;

var getSizeByStyles = function(styles) {
    var result = 0;

    styles.forEach(function(style) {
        result += (parseFloat(_styles[style]) || 0);
    });

    return result;
};

var getAdditionalParams = function(params) {
    var result = 0;

    if(params.include.paddings) {
        result += params.padding;
    }

    if(params.include.borders) {
        result += params.border;

        if(params.include.margins) {
            result += params.margin;
        }
    }

    return result;
};

var getBoxSizingOffset = function(params) {
    var result = 0;
    var size = _styles[params.name];

    if(_styles.boxSizing === "border-box" && size.length && size[size.length - 1] !== "%") {
        result -= params.padding + params.border;
    }

    return result;
};

var getSize = function(params) {
    var element = params.element;
    var name = params.name;

    var clientRect = element.getClientRects().length;
    var boundingClientRect = element.getBoundingClientRect()[name];

    var result = clientRect ? boundingClientRect : 0;

    if(result <= 0) {
        result = parseFloat(_styles[name] || element.style[name]) || 0;

        result += getBoxSizingOffset(params);
    } else {
        result -= params.padding + params.border;
    }

    return result + getAdditionalParams(params);
};

var getWidth = function(element, include) {
    _styles = window.getComputedStyle(element);

    var params = {
        element: element,
        name: "width",
        include: include || {},
        padding: getSizeByStyles(["paddingLeft", "paddingRight"]),
        border: getSizeByStyles(["borderLeftWidth", "borderRightWidth"]),
        margin: getSizeByStyles(["marginLeft", "marginRight"])
    };

    return getSize(params);
};

var getHeight = function(element, include) {
    _styles = window.getComputedStyle(element);

    var params = {
        element: element,
        name: "height",
        include: include || {},
        padding: getSizeByStyles(["paddingTop", "paddingBottom"]),
        border: getSizeByStyles(["borderTopWidth", "borderBottomWidth"]),
        margin: getSizeByStyles(["marginTop", "marginBottom"])
    };

    return getSize(params);
};

var getBorderAdjustment = function(element, name) {
    _styles = window.getComputedStyle(element);

    if(_styles.boxSizing === "border-box") {
        return 0;
    }

    if(name === "width") {
        return getSizeByStyles(["borderLeftWidth", "borderRightWidth"]);
    } else {
        return getSizeByStyles(["borderTopWidth", "borderBottomWidth"]);
    }
};

exports.getWidth = getWidth;
exports.getHeight = getHeight;
exports.getBorderAdjustment = getBorderAdjustment;
