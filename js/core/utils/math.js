import { isExponential } from './type';

const sign = function(value) {
    if(value === 0) {
        return 0;
    }

    return value / Math.abs(value);
};

const fitIntoRange = function(value, minValue, maxValue) {
    const isMinValueUndefined = !minValue && minValue !== 0;
    const isMaxValueUndefined = !maxValue && maxValue !== 0;

    isMinValueUndefined && (minValue = !isMaxValueUndefined ? Math.min(value, maxValue) : value);
    isMaxValueUndefined && (maxValue = !isMinValueUndefined ? Math.max(value, minValue) : value);

    return Math.min(Math.max(value, minValue), maxValue);
};

const inRange = function(value, minValue, maxValue) {
    return value >= minValue && value <= maxValue;
};

function getExponent(value) {
    return Math.abs(parseInt(value.toExponential().split('e')[1]));
}

// T570217
function _isEdgeBug() {
    const value = 0.0003;
    const correctValue = '0.000300';
    const precisionValue = 3;
    return correctValue !== value.toPrecision(precisionValue);
}

function adjust(value, interval) {
    let precision = getPrecision(interval || 0) + 2;
    const separatedValue = value.toString().split('.');
    const sourceValue = value;
    const absValue = Math.abs(value);
    let separatedAdjustedValue;
    const isExponentValue = isExponential(value);
    const integerPart = absValue > 1 ? 10 : 0;

    if(separatedValue.length === 1) {
        return value;
    }

    if(!isExponentValue) {
        if(isExponential(interval)) {
            precision = separatedValue[0].length + getExponent(interval);
        }
        value = absValue;
        value = value - Math.floor(value) + integerPart;
    }

    precision = ((_isEdgeBug() && (getExponent(value) > 6)) || precision > 7) ? 15 : 7; // fix toPrecision() bug in Edge (T570217)

    if(!isExponentValue) {
        separatedAdjustedValue = parseFloat(value.toPrecision(precision)).toString().split('.');
        if(separatedAdjustedValue[0] === integerPart.toString()) {
            return parseFloat(separatedValue[0] + '.' + separatedAdjustedValue[1]);
        }
    }
    return parseFloat(sourceValue.toPrecision(precision));
}

function getPrecision(value) {
    const str = value.toString();

    if(str.indexOf('.') < 0) {
        return 0;
    }

    const mantissa = str.split('.');
    const positionOfDelimiter = mantissa[1].indexOf('e');

    return positionOfDelimiter >= 0 ? positionOfDelimiter : mantissa[1].length;
}

function getRoot(x, n) {
    if(x < 0 && n % 2 !== 1) {
        return NaN;
    }

    const y = Math.pow(Math.abs(x), 1 / n);
    return n % 2 === 1 && x < 0 ? -y : y;
}

function solveCubicEquation(a, b, c, d) {
    const min = 1e-8;
    if(Math.abs(a) < min) {
        a = b; b = c; c = d;
        if(Math.abs(a) < min) {
            a = b; b = c;
            if(Math.abs(a) < min) {
                return [];
            }
            return [-b / a];
        }

        const D2 = b * b - 4 * a * c;
        if(Math.abs(D2) < min) {
            return [-b / (2 * a)];
        } else if(D2 > 0) {
            return [(-b + Math.sqrt(D2)) / (2 * a), (-b - Math.sqrt(D2)) / (2 * a)];
        }
        return [];
    }

    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    let roots;
    let u;

    if(Math.abs(p) < min) {
        roots = [getRoot(-q, 3)];
    } else if(Math.abs(q) < min) {
        roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
    } else {
        const D3 = q * q / 4 + p * p * p / 27;
        if(Math.abs(D3) < min) {
            roots = [-1.5 * q / p, 3 * q / p];
        } else if(D3 > 0) {
            u = getRoot(-q / 2 - Math.sqrt(D3), 3);
            roots = [u - p / (3 * u)];
        } else {
            u = 2 * Math.sqrt(-p / 3);
            const t = Math.acos(3 * q / p / u) / 3;
            const k = 2 * Math.PI / 3;
            roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)];
        }
    }

    for(let i = 0; i < roots.length; i++) {
        roots[i] -= b / (3 * a);
    }

    return roots;
}

function trunc(value) {
    return Math.trunc ? Math.trunc(value) : (value > 0 ? Math.floor(value) : Math.ceil(value));
}

function getRemainderByDivision(dividend, divider, digitsCount) {
    if(divider === parseInt(divider)) {
        return dividend % divider;
    }

    const quotient = roundFloatPart(dividend / divider, digitsCount);
    return (quotient - parseInt(quotient)) * divider;
}

function getExponentLength(value) {
    const valueString = value.toString();

    return valueString.split('.')[1]?.length
        || parseInt(valueString.split('e-')[1])
        || 0;
}

function roundFloatPart(value, digitsCount = 0) {
    return parseFloat(value.toFixed(digitsCount));
}

export {
    sign,
    fitIntoRange,
    inRange,
    adjust,
    getPrecision,
    getExponent,
    getRoot,
    solveCubicEquation,
    trunc,
    roundFloatPart,
    getExponentLength,
    getRemainderByDivision
};
