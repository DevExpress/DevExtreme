import { camelize } from './inflector';
import callOnce from './call_once';
import { isNumeric, isString } from './type';
import domAdapter from '../dom_adapter';

const jsPrefixes = ['', 'Webkit', 'Moz', 'O', 'Ms'];
const cssPrefixes = {
    '': '',
    'Webkit': '-webkit-',
    'Moz': '-moz-',
    'O': '-o-',
    'ms': '-ms-'
};
const getStyles = callOnce(function() {
    return domAdapter.createElement('dx').style;
});

const forEachPrefixes = function(prop, callBack) {
    prop = camelize(prop, true);

    let result;

    for(let i = 0, cssPrefixesCount = jsPrefixes.length; i < cssPrefixesCount; i++) {
        const jsPrefix = jsPrefixes[i];
        const prefixedProp = jsPrefix + prop;
        const lowerPrefixedProp = camelize(prefixedProp);

        result = callBack(lowerPrefixedProp, jsPrefix);

        if(result === undefined) {
            result = callBack(prefixedProp, jsPrefix);
        }

        if(result !== undefined) {
            break;
        }
    }

    return result || '';
};

const styleProp = function(name) {
    if(name in getStyles()) {
        return name;
    }

    const originalName = name;
    name = name.charAt(0).toUpperCase() + name.substr(1);
    for(let i = 1; i < jsPrefixes.length; i++) {
        const prefixedProp = jsPrefixes[i].toLowerCase() + name;
        if(prefixedProp in getStyles()) {
            return prefixedProp;
        }
    }

    return originalName;
};

const stylePropPrefix = function(prop) {
    return forEachPrefixes(prop, function(specific, jsPrefix) {
        if(specific in getStyles()) {
            return cssPrefixes[jsPrefix];
        }
    });
};


const pxExceptions = [
    'fillOpacity',
    'columnCount',
    'flexGrow',
    'flexShrink',
    'fontWeight',
    'lineHeight',
    'opacity',
    'zIndex',
    'zoom'
];

const parsePixelValue = function(value) {
    if(isNumeric(value)) {
        return value;
    } else if(isString(value)) {
        return Number(value.replace('px', ''));
    }
    return NaN;
};

const normalizeStyleProp = function(prop, value) {
    if(isNumeric(value) && pxExceptions.indexOf(prop) === -1) {
        value += 'px';
    }

    return value;
};

const setDimensionProperty = function(elements, propertyName, value) {
    if(elements) {
        value = isNumeric(value) ? value += 'px' : value;
        for(let i = 0; i < elements.length; ++i) {
            elements[i].style[propertyName] = value;
        }
    }
};

const setWidth = function(elements, value) {
    setDimensionProperty(elements, 'width', value);
};

const setHeight = function(elements, value) {
    setDimensionProperty(elements, 'height', value);
};

export {
    styleProp,
    stylePropPrefix,
    normalizeStyleProp,
    parsePixelValue,
    setWidth,
    setHeight };
