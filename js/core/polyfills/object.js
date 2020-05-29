const windowUtils = require('../../core/utils/window');

const assign = windowUtils.hasWindow() ? windowUtils.getWindow().Object.assign : Object.assign;

if(!assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target, firstSource) {

            if(target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            const to = Object(target);
            for(let i = 1; i < arguments.length; i++) {
                const nextSource = arguments[i];
                if(nextSource === undefined || nextSource === null) {
                    continue;
                }

                const keysArray = Object.keys(Object(nextSource));
                for(let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if(desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}
