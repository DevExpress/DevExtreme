"use strict";

var $ = require("jquery"),
    support = require("../core/utils/support");

var TRANSLATOR_DATA_KEY = "dxTranslator",
    TRANSFORM_MATRIX_REGEX = /matrix(3d)?\((.+?)\)/,
    TRANSLATE_REGEX = /translate(?:3d)?\((.+?)\)/;

var locate = function($element) {
    var translate = (support.transform)
        ? getTranslate($element)
        : getTranslateFallback($element);

    return {
        left: translate.x,
        top: translate.y
    };
};

var move = function($element, position) {
    if(!support.transform) {
        $element.css(position);
        return;
    }

    var left = position.left,
        top = position.top,
        translate;

    if(left === undefined) {
        translate = getTranslate($element);
        translate.y = top || 0;
    } else if(top === undefined) {
        translate = getTranslate($element);
        translate.x = left || 0;
    } else {
        translate = { x: left || 0, y: top || 0, z: 0 };
        cacheTranslate($element, translate);
    }

    $element.css({
        transform: getTranslateCss(translate)
    });

    if(isPercentValue(left) || isPercentValue(top)) {
        clearCache($element);
    }
};

var isPercentValue = function(value) {
    return $.type(value) === "string" && value[value.length - 1] === "%";
};

var getTranslateFallback = function($element) {
    var result;

    try {
        var originalTop = $element.css("top"),
            originalLeft = $element.css("left");

        var position = $element.position();
        $element.css({ "transform": "none", "top": 0, "left": 0 });
        clearCache($element);
        var finalPosition = $element.position();

        result = {
            x: position.left - finalPosition.left || (parseInt(originalLeft) || 0),
            y: position.top - finalPosition.top || (parseInt(originalTop) || 0)
        };

        $element.css({ "top": originalTop, "left": originalLeft });
    } catch(e) {
        result = { x: 0, y: 0 };
    }

    return result;
};

var getTranslate = function($element) {
    var result = $element.length ? $.data($element.get(0), TRANSLATOR_DATA_KEY) : null;

    if(!result) {
        var transformValue = $element.css("transform") || getTranslateCss({ x: 0, y: 0 }),
            matrix = transformValue.match(TRANSFORM_MATRIX_REGEX),
            is3D = matrix && matrix[1];

        if(matrix) {
            matrix = matrix[2].split(",");
            if(is3D === "3d") {
                matrix = matrix.slice(12, 15);
            } else {
                matrix.push(0);
                matrix = matrix.slice(4, 7);
            }
        } else {
            matrix = [0, 0, 0];
        }

        result = {
            x: parseFloat(matrix[0]),
            y: parseFloat(matrix[1]),
            z: parseFloat(matrix[2])
        };

        cacheTranslate($element, result);
    }

    return result;
};

var cacheTranslate = function($element, translate) {
    if($element.length) {
        $.data($element.get(0), TRANSLATOR_DATA_KEY, translate);
    }
};

var clearCache = function($element) {
    if($element.length) {
        $.removeData($element.get(0), TRANSLATOR_DATA_KEY);
    }
};

var resetPosition = function($element) {
    $element.css({
        left: 0,
        top: 0,
        transform: "none"
    });
    clearCache($element);
};

var parseTranslate = function(translateString) {
    var result = translateString.match(TRANSLATE_REGEX);

    if(!result || !result[1]) {
        return;
    }

    result = result[1].split(",");

    result = {
        x: parseFloat(result[0]),
        y: parseFloat(result[1]),
        z: parseFloat(result[2])
    };

    return result;
};

var getTranslateCss = function(translate) {
    translate.x = translate.x || 0;
    translate.y = translate.y || 0;

    var xValueString = isPercentValue(translate.x) ? translate.x : translate.x + "px";
    var yValueString = isPercentValue(translate.y) ? translate.y : translate.y + "px";

    return "translate(" + xValueString + ", " + yValueString + ")";
};

exports.move = move;
exports.locate = locate;
exports.clearCache = clearCache;
exports.parseTranslate = parseTranslate;
exports.getTranslate = getTranslate;
exports.getTranslateCss = getTranslateCss;
exports.resetPosition = resetPosition;
