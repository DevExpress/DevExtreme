import { isString } from '../../core/utils/type';

export function normalizeInputAttrArgs(fullName, value) {
    if(!isString(fullName)) {
        return null;
    }

    const nameParts = fullName.split('.');
    let result = value;

    if(nameParts.length > 1) {
        result = { [nameParts.pop()]: value };
    }

    return result;
}
