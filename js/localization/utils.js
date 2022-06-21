import { sign } from '../core/utils/math';

const DECIMAL_BASE = 10;

function roundByAbs(value) {
    const valueSign = sign(value);

    return valueSign * Math.round(Math.abs(value));
}

function adjustValue(value, precision) {
    const precisionMultiplier = Math.pow(DECIMAL_BASE, precision);
    const roundMultiplier = precisionMultiplier * DECIMAL_BASE;
    const intermediateValue = (value * roundMultiplier * 0.8 + value * roundMultiplier * 0.2) / DECIMAL_BASE;

    return roundByAbs(intermediateValue) / precisionMultiplier;
}

export function toFixed(value, precision) {
    const valuePrecision = precision || 0;
    const adjustedValue = valuePrecision > 0 ? adjustValue(...arguments) : value;

    return (adjustedValue).toFixed(valuePrecision);
}
