var $ = require("../../core/renderer");

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
            value = parseInt(value.replace("%", "")) * $(container).height() / 100;
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

var calculateMaxHeight = function(value, $container, offset) {
    return calculateLimitHeight(value, $container, offset, "none");
};

var calculateMinHeight = function(value, $container, offset) {
    return calculateLimitHeight(value, $container, offset, 0);
};

var getPaddingsHeight = function($element, includeMargin) {
    return $element && $element.length ? $element.outerHeight(includeMargin || false) - $element.height() : 0;
};

var getVisibleHeight = function($element) {
    return $element && $element.is(":visible") ? $element.get(0).getBoundingClientRect().height : 0;
};

exports.calculateMaxHeight = calculateMaxHeight;
exports.calculateMinHeight = calculateMinHeight;
exports.getPaddingsHeight = getPaddingsHeight;
exports.getVisibleHeight = getVisibleHeight;
