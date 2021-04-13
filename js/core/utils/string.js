import { isFunction, type } from './type';

export const encodeHtml = (function() {
    const encodeRegExp = [new RegExp('&', 'g'), new RegExp('"', 'g'), new RegExp('\'', 'g'), new RegExp('<', 'g'), new RegExp('>', 'g')];

    return function(str) {
        return String(str)
            .replace(encodeRegExp[0], '&amp;')
            .replace(encodeRegExp[1], '&quot;')
            .replace(encodeRegExp[2], '&#39;')
            .replace(encodeRegExp[3], '&lt;')
            .replace(encodeRegExp[4], '&gt;');
    };
})();


const splitQuad = function(raw) {
    switch(typeof raw) {
        case 'string':
            return raw.split(/\s+/, 4);
        case 'object':
            return [
                raw.x || raw.h || raw.left,
                raw.y || raw.v || raw.top,
                raw.x || raw.h || raw.right,
                raw.y || raw.v || raw.bottom];
        case 'number':
            return [raw];
        default:
            return raw;
    }
};

export const quadToObject = function(raw) {
    const quad = splitQuad(raw);
    let left = parseInt(quad && quad[0], 10);
    let top = parseInt(quad && quad[1], 10);
    let right = parseInt(quad && quad[2], 10);
    let bottom = parseInt(quad && quad[3], 10);

    if(!isFinite(left)) {
        left = 0;
    }
    if(!isFinite(top)) {
        top = left;
    }
    if(!isFinite(right)) {
        right = left;
    }
    if(!isFinite(bottom)) {
        bottom = top;
    }

    return { top: top, right: right, bottom: bottom, left: left };
};

export const format = function() {
    let s = arguments[0];
    const values = [].slice.call(arguments).slice(1);

    if(isFunction(s)) {
        return s.apply(this, values);
    }

    values.forEach(function(value, index) {
        const reg = new RegExp('\\{' + index + '\\}', 'gm');
        if(type(value) === 'string') {
            value = value.replace(/\$/g, '$$$$');
        }
        s = s.replace(reg, value);
    });

    return s;
};

export const replaceAll = (function() {
    const quote = function(str) {
        return (str + '').replace(/([+*?.[^\]$(){}><|=!:])/g, '\\$1'); // lgtm[incomplete-sanitization]
    };

    return function(text, searchToken, replacementToken) {
        return text.replace(new RegExp('(' + quote(searchToken) + ')', 'gi'), replacementToken);
    };
})();

export const isEmpty = (function() {
    const SPACE_REGEXP = /\s/g;

    return function(text) {
        return !text || !text.replace(SPACE_REGEXP, '');
    };
})();

