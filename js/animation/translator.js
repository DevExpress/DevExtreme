var dataUtils = require('../core/element_data'),
    type = require('../core/utils/type').type;

var TRANSLATOR_DATA_KEY = 'dxTranslator',
    TRANSFORM_MATRIX_REGEX = /matrix(3d)?\((.+?)\)/,
    TRANSLATE_REGEX = /translate(?:3d)?\((.+?)\)/;

var locate = function($element) {
    var translate = getTranslate($element);

    return {
        left: translate.x,
        top: translate.y
    };
};

var move = function($element, position) {
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
    return type(value) === 'string' && value[value.length - 1] === '%';
};

var getTranslate = function($element) {
    var result = $element.length ? dataUtils.data($element.get(0), TRANSLATOR_DATA_KEY) : null;

    if(!result) {
        var transformValue = $element.css('transform') || getTranslateCss({ x: 0, y: 0 }),
            matrix = transformValue.match(TRANSFORM_MATRIX_REGEX),
            is3D = matrix && matrix[1];

        if(matrix) {
            matrix = matrix[2].split(',');
            if(is3D === '3d') {
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
        dataUtils.data($element.get(0), TRANSLATOR_DATA_KEY, translate);
    }
};

var clearCache = function($element) {
    if($element.length) {
        dataUtils.removeData($element.get(0), TRANSLATOR_DATA_KEY);
    }
};

var resetPosition = function($element, finishTransition) {
    var originalTransition,
        stylesConfig = {
            left: 0,
            top: 0,
            transform: 'none',
        };

    if(finishTransition) {
        originalTransition = $element.css('transition');
        stylesConfig.transition = 'none';
    }

    $element.css(stylesConfig);

    clearCache($element);

    if(finishTransition) {
        $element.get(0).offsetHeight;
        $element.css('transition', originalTransition);
    }
};

var parseTranslate = function(translateString) {
    var result = translateString.match(TRANSLATE_REGEX);

    if(!result || !result[1]) {
        return;
    }

    result = result[1].split(',');

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

    var xValueString = isPercentValue(translate.x) ? translate.x : translate.x + 'px';
    var yValueString = isPercentValue(translate.y) ? translate.y : translate.y + 'px';

    return 'translate(' + xValueString + ', ' + yValueString + ')';
};

exports.move = move;
exports.locate = locate;
exports.clearCache = clearCache;
exports.parseTranslate = parseTranslate;
exports.getTranslate = getTranslate;
exports.getTranslateCss = getTranslateCss;
exports.resetPosition = resetPosition;
