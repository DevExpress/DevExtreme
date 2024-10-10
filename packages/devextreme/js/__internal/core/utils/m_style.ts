import domAdapter from '@js/core/dom_adapter';
import callOnce from '@js/core/utils/call_once';
import { camelize } from '@js/core/utils/inflector';
import { isNumeric, isString } from '@js/core/utils/type';

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
    // @ts-expect-error number + string
    value += 'px';
    }

    return value;
};

const setDimensionProperty = function (elements, propertyName, value) {
  if (elements) {
    // @ts-expect-error number + string
    value = isNumeric(value) ? value += 'px' : value;
    for (let i = 0; i < elements.length; ++i) {
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

const setStyle = function(element, styleString, resetStyle = true) {
    if(resetStyle) {
        const styleList = [].slice.call(element.style);
        styleList.forEach((propertyName) => {
            element.style.removeProperty(propertyName);
        });
    }
    styleString.split(';').forEach((style) => {
        const parts = style.split(':').map(stylePart => stylePart.trim());
        if(parts.length === 2) {
            const [property, value] = parts;
            element.style[property] = value;
        }
    });
};

export {
  normalizeStyleProp,
  parsePixelValue,
  setHeight,
  setStyle,
  setWidth,
  styleProp,
  stylePropPrefix,
};
