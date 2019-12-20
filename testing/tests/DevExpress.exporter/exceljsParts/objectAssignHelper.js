import typeUtils from 'core/utils/type';

function assign(target) {
    if(!typeUtils.isDefined(target)) {
        throw new TypeError('Cannot convert first argument to object');
    }

    let clone = Object(target);
    for(let currentIndex = 1; currentIndex < arguments.length; currentIndex++) {
        let source = arguments[currentIndex];
        if(!typeUtils.isDefined(source)) {
            continue;
        }

        let keysArray = Object.keys(Object(source));
        keysArray.forEach((key) => {
            let descriptor = Object.getOwnPropertyDescriptor(source, key);
            if(typeUtils.isDefined(descriptor) && descriptor.enumerable) {
                clone[key] = source[key];
            }
        });
    }
    return clone;
}

function initializeDxObjectAssign() {
    if(!Object.assign) {
        Object.defineProperty(Object, 'isAssignFromDxObjectAssignHelper', {
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

function clearDxObjectAssign() {
    if(Object.assign && Object.isAssignFromDxObjectAssignHelper === true) {
        delete Object.assign;
        delete Object.isAssignFromDxObjectAssignHelper;
    }
}

export { initializeDxObjectAssign, clearDxObjectAssign };
