import { adjust } from "./math";
const DECIMAL_BASE = 10;

function toFixed(value, precision) {
    const precisionMultiplier = Math.pow(DECIMAL_BASE, precision);
    const roundMultiplier = precisionMultiplier * DECIMAL_BASE;
    const adjustedValue = Math.round(adjust(value * roundMultiplier, precision)) / DECIMAL_BASE;

    return (Math.round(adjustedValue) / precisionMultiplier).toFixed(precision);
}

export {
    toFixed
};
