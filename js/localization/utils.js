const DECIMAL_BASE = 10;

function adjustValue(value, precision) {
    const precisionMultiplier = Math.pow(DECIMAL_BASE, precision);
    const roundMultiplier = precisionMultiplier * DECIMAL_BASE;

    return Math.round((value * roundMultiplier) / DECIMAL_BASE) / precisionMultiplier;
}

function toFixed(value, precision) {
    const valuePrecision = precision || 0;
    const adjustedValue = valuePrecision > 0 ? adjustValue(...arguments) : value;

    return (adjustedValue).toFixed(valuePrecision);
}

export {
    toFixed
};
