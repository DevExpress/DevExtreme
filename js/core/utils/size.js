const window = require('../../core/utils/window').getWindow();
const typeUtils = require('../utils/type');

const SPECIAL_HEIGHT_VALUES = ['auto', 'none', 'inherit', 'initial'];

const getSizeByStyles = function(elementStyles, styles) {
    let result = 0;

    styles.forEach(function(style) {
        result += (parseFloat(elementStyles[style]) || 0);
    });

    return result;
};

const getElementBoxParams = function(name, elementStyles) {
    const beforeName = name === 'width' ? 'Left' : 'Top';
    const afterName = name === 'width' ? 'Right' : 'Bottom';

    return {
        padding: getSizeByStyles(elementStyles, ['padding' + beforeName, 'padding' + afterName]),
        border: getSizeByStyles(elementStyles, ['border' + beforeName + 'Width', 'border' + afterName + 'Width']),
        margin: getSizeByStyles(elementStyles, ['margin' + beforeName, 'margin' + afterName]),
    };
};

const getBoxSizingOffset = function(name, elementStyles, boxParams) {
    const size = elementStyles[name];

    if(elementStyles.boxSizing === 'border-box' && size.length && size[size.length - 1] !== '%') {
        return boxParams.border + boxParams.padding;
    }

    return 0;
};

const getSize = function(element, name, include) {
    const elementStyles = window.getComputedStyle(element);

    const boxParams = getElementBoxParams(name, elementStyles);

    const clientRect = element.getClientRects().length;
    const boundingClientRect = element.getBoundingClientRect()[name];

    let result = clientRect ? boundingClientRect : 0;

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

const getContainerHeight = function(container) {
    return typeUtils.isWindow(container) ? container.innerHeight : container.offsetHeight;
};

const parseHeight = function(value, container) {
    if(value.indexOf('px') > 0) {
        value = parseInt(value.replace('px', ''));
    } else if(value.indexOf('%') > 0) {
        value = parseInt(value.replace('%', '')) * getContainerHeight(container) / 100;
    } else if(!isNaN(value)) {
        value = parseInt(value);
    }

    return value;
};

const getHeightWithOffset = function(value, offset, container) {
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

    const operationString = offset < 0 ? ' - ' : ' ';

    return 'calc(' + value + operationString + Math.abs(offset) + 'px)';
};

const addOffsetToMaxHeight = function(value, offset, container) {
    const maxHeight = getHeightWithOffset(value, offset, container);
    return maxHeight !== null ? maxHeight : 'none';
};

const addOffsetToMinHeight = function(value, offset, container) {
    const minHeight = getHeightWithOffset(value, offset, container);
    return minHeight !== null ? minHeight : 0;
};

const getVerticalOffsets = function(element, withMargins) {
    if(!element) {
        return 0;
    }

    const boxParams = getElementBoxParams('height', window.getComputedStyle(element));

    return boxParams.padding
        + boxParams.border
        + (withMargins ? boxParams.margin : 0);
};

const getVisibleHeight = function(element) {
    if(element) {
        const boundingClientRect = element.getBoundingClientRect();

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
