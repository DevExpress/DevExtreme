import { sign } from "../core/utils/math";

const DECIMAL_BASE = 10;

function roundByAbs(value) {
    const valueSign = sign(value);

    return valueSign * Math.round(Math.abs(value));
}

function toFixed(value, precision) {
    const precisionMultiplier = Math.pow(DECIMAL_BASE, precision);
    const roundMultiplier = precisionMultiplier * DECIMAL_BASE;
    const intermediateValue = roundByAbs(value * roundMultiplier) / DECIMAL_BASE;

    return (roundByAbs(intermediateValue) / precisionMultiplier).toFixed(precision);
}

export {
    toFixed
};
