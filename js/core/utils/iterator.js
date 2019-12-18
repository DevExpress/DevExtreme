const map = (values, callback) => {
    if(Array.isArray(values)) {
        return values.map(callback);
    }

    let result = [];

    for(let key in values) {
        result.push(callback(values[key], key));
    }

    return result;
};

const each = (values, callback) => {
    if(!values) return;

    if('length' in values) {
        for(let i = 0; i < values.length; i++) {
            if(callback.call(values[i], i, values[i]) === false) {
                break;
            }
        }
    } else {
        for(const key in values) {
            if(callback.call(values[key], key, values[key]) === false) {
                break;
            }
        }
    }

    return values;
};

const reverseEach = (array, callback) => {
    if(!array || !('length' in array) || array.length === 0) return;

    for(let i = array.length - 1; i >= 0; i--) {
        if(callback.call(array[i], i, array[i]) === false) {
            break;
        }
    }
};

exports.map = map;
exports.each = each;
exports.reverseEach = reverseEach;
