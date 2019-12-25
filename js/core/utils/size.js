var window = require('../../core/utils/window').getWindow();
var typeUtils = require('../utils/type');

var SPECIAL_HEIGHT_VALUES = ['auto', 'none', 'inherit', 'initial'];

var getSizeByStyles = function(elementStyles, styles) {
    var result = 0;

    styles.forEach(function(style) {
        result += (parseFloat(elementStyles[style]) || 0);
    });

    return result;
};

var getElementBoxParams = function(name, elementStyles) {
    var beforeName = name === 'width' ? 'Left' : 'Top';
    var afterName = name === 'width' ? 'Right' : 'Bottom';

    return {
        padding: getSizeByStyles(elementStyles, ['padding' + beforeName, 'padding' + afterName]),
        border: getSizeByStyles(elementStyles, ['border' + beforeName + 'Width', 'border' + afterName + 'Width']),
        margin: getSizeByStyles(elementStyles, ['margin' + beforeName, 'margin' + afterName]),
    };
};

var getBoxSizingOffset = function(name, elementStyles, boxParams) {
    var size = elementStyles[name];

    if(elementStyles.boxSizing === 'border-box' && size.length && size[size.length - 1] !== '%') {
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

var getContainerHeight = function(container) {
    return typeUtils.isWindow(container) ? container.innerHeight : container.offsetHeight;
};

var parseHeight = function(value, container) {
    if(value.indexOf('px') > 0) {
        value = parseInt(value.replace('px', ''));
    } else if(value.indexOf('%') > 0) {
        value = parseInt(value.replace('%', '')) * getContainerHeight(container) / 100;
    } else if(!isNaN(value)) {
        value = parseInt(value);
    }

    return value;
};

var getHeightWithOffset = function(value, offset, container) {
    if(!value) {
        return null;
    }

    if(SPECIAL_HEIGHT_VALUES.indexOf(value) > -1) {
        return offset ? null : value;
    }

    if(typeUtils.isString(value)) {
        value = parseHeight(value, container);
    }

    if(typeUtils.isNumeric(value)) {
        return Math.max(0, value + offset);
    }

    var operationString = offset < 0 ? ' - ' : ' ';

    return 'calc(' + value + operationString + Math.abs(offset) + 'px)';
};

var addOffsetToMaxHeight = function(value, offset, container) {
    var maxHeight = getHeightWithOffset(value, offset, container);
    return maxHeight !== null ? maxHeight : 'none';
};

var addOffsetToMinHeight = function(value, offset, container) {
    var minHeight = getHeightWithOffset(value, offset, container);
    return minHeight !== null ? minHeight : 0;
};

var getVerticalOffsets = function(element, withMargins) {
    if(!element) {
        return 0;
    }

    var boxParams = getElementBoxParams('height', window.getComputedStyle(element));

    return boxParams.padding
        + boxParams.border
        + (withMargins ? boxParams.margin : 0);
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
exports.addOffsetToMaxHeight = addOffsetToMaxHeight;
exports.addOffsetToMinHeight = addOffsetToMinHeight;
exports.getVerticalOffsets = getVerticalOffsets;
exports.getVisibleHeight = getVisibleHeight;
exports.parseHeight = parseHeight;
