import domAdapter from '../dom_adapter';
import { toComparable } from './data';
import { isRenderer } from './type';

const hasNegation = function(oldValue, newValue) {
    return (1 / oldValue) === (1 / newValue);
};

export const equals = function(oldValue, newValue) {
    oldValue = toComparable(oldValue, true);
    newValue = toComparable(newValue, true);

    if(oldValue && newValue && isRenderer(oldValue) && isRenderer(newValue)) {
        return newValue.is(oldValue);
    }

    const oldValueIsNaN = oldValue !== oldValue;
    const newValueIsNaN = newValue !== newValue;
    if(oldValueIsNaN && newValueIsNaN) {
        return true;
    }

    if(oldValue === 0 && newValue === 0) {
        return hasNegation(oldValue, newValue);
    }

    if(oldValue === null || typeof oldValue !== 'object' || domAdapter.isElementNode(oldValue)) {
        return oldValue === newValue;
    }

    return false;
};
