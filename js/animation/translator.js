const dataUtils = require('../core/element_data');
const type = require('../core/utils/type').type;

const TRANSLATOR_DATA_KEY = 'dxTranslator';
const TRANSFORM_MATRIX_REGEX = /matrix(3d)?\((.+?)\)/;
const TRANSLATE_REGEX = /translate(?:3d)?\((.+?)\)/;

const locate = function($element) {
    const translate = getTranslate($element);

    return {
        left: translate.x,
        top: translate.y
    };
};

const move = function($element, position) {
    const left = position.left;
    const top = position.top;
    let translate;

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
    let result = $element.length ? dataUtils.data($element.get(0), TRANSLATOR_DATA_KEY) : null;

    if(!result) {
        const transformValue = $element.css('transform') || getTranslateCss({ x: 0, y: 0 });
        let matrix = transformValue.match(TRANSFORM_MATRIX_REGEX);
        const is3D = matrix && matrix[1];

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

const resetPosition = function($element, finishTransition) {
    let originalTransition;
    const stylesConfig = {
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

const parseTranslate = function(translateString) {
    let result = translateString.match(TRANSLATE_REGEX);

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

    const xValueString = isPercentValue(translate.x) ? translate.x : translate.x + 'px';
    const yValueString = isPercentValue(translate.y) ? translate.y : translate.y + 'px';

    return 'translate(' + xValueString + ', ' + yValueString + ')';
};

exports.move = move;
exports.locate = locate;
exports.clearCache = clearCache;
exports.parseTranslate = parseTranslate;
exports.getTranslate = getTranslate;
exports.getTranslateCss = getTranslateCss;
exports.resetPosition = resetPosition;
