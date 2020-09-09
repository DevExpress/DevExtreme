import { isDefined } from '../core/utils/type';
import { deepExtendArraySafe } from '../core/utils/object';
import { errors } from './errors';
import ArrayStore from './array_store';

const applyChanges = function(data, changes, keyName, options) {
    const { immutable = true } = isDefined(options) ? options : {};
    let result = [];

    if(!isDefined(data)) {
        return result;
    }

    result = immutable === true ? deepExtendArraySafe(result, data, true) : data;

    if(!isDefined(changes)) {
        return result;
    }

    if(!isDefined(keyName) || keyName.trim().length === 0) {
        errors.Error('W100000');
        return result;
    }

    const store = new ArrayStore({
        key: keyName,
        data: result
    });

    changes.forEach((change) => {
        switch(change.type) {
            case 'insert': {
                store.insert(change.data);
                break;
            }
            case 'update': {
                store.update(change.key, change.data);
                break;
            }
            case 'remove': {
                store.remove(change.key);
                break;
            }
        }
    });

    store.load().done((res) => {
        result = res;
    });

    return result;
};

export default applyChanges;
