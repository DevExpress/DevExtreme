import { extend } from '../../core/utils/extend';
import { isString } from '../../core/utils/type';

export function normalizeInputAttrArgs(fullName, value, previousValue = {}) {
    if(!isString(fullName)) {
        return null;
    }

    const nameParts = fullName.split('.');
    let result = value;

    if(nameParts.length > 1) {
        result = extend({}, previousValue, { [nameParts.pop()]: value });
    }

    return result;
}
