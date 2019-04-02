function assign(target, firstSource) {
    if(isUndefined(target)) {
        throw new TypeError('Cannot convert first argument to object');
    }

    var to = Object(target);
    for(var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if(isUndefined(nextSource)) {
            continue;
        }

        var keysArray = Object.keys(Object(nextSource));
        for(var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if(desc !== undefined && desc.enumerable) {
                to[nextKey] = nextSource[nextKey];
            }
        }
    }
    return to;
}

function isUndefined(value) {
    return value === undefined || value === null;
}

function initializeObjectAssign() {
    if(!Object.assign) {
        Object.defineProperty(Object, 'isInitializeObjectAssign', {
            value: true,
            writable: true,
            configurable: true
        });

        Object.defineProperty(Object, 'assign', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: assign
        });
    }
}

function clearObjectAssign() {
    if(Object.assign && Object.isInitializeObjectAssign === true) {
        Object.assign = undefined;
        Object.isInitializeObjectAssign = false;
    }
}

export { initializeObjectAssign, clearObjectAssign };
