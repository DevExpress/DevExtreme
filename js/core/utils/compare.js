import domAdapter from "../dom_adapter";
import coreDataUtils from "./data";
import typeUtils from "./type";

const valuesEqual = function(oldValue, newValue) {
    oldValue = coreDataUtils.toComparable(oldValue, true);
    newValue = coreDataUtils.toComparable(newValue, true);

    if(oldValue && newValue && typeUtils.isRenderer(oldValue) && typeUtils.isRenderer(newValue)) {
        return newValue.is(oldValue);
    }

    const oldValueIsNaN = oldValue !== oldValue;
    const newValueIsNaN = newValue !== newValue;
    if(oldValueIsNaN && newValueIsNaN) {
        return true;
    }

    if(oldValue === 0 && newValue === 0) {
        return (1 / oldValue) === (1 / newValue);
    }

    if(oldValue === null || typeof oldValue !== "object" || domAdapter.isElementNode(oldValue)) {
        return oldValue === newValue;
    }

    return false;
};

exports.valuesEqual = valuesEqual;
