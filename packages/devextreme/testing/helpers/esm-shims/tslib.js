/**
 * Minimal tslib fallback for QUnit when the package is not hoisted.
 * Covers helpers used by rrule's ESM build.
 */
export function __assign(target) {
    for(let i = 1; i < arguments.length; i++) {
        const source = arguments[i];
        for(const key in source) {
            if(Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

export function __extends(derived, base) {
    Object.setPrototypeOf(derived, base);
    function PrototypeBridge() {
        this.constructor = derived;
    }
    PrototypeBridge.prototype = base === null ? Object.create(base) : base.prototype;
    // eslint-disable-next-line new-cap, no-new
    derived.prototype = new PrototypeBridge();
}

export function __spreadArray(to, from, pack) {
    if(pack || arguments.length === 2) {
        let packed;
        for(let i = 0, length = from.length; i < length; i++) {
            if(packed || !(i in from)) {
                if(!packed) {
                    packed = Array.prototype.slice.call(from, 0, i);
                }
                packed[i] = from[i];
            }
        }
        return to.concat(packed || Array.prototype.slice.call(from));
    }
    return to.concat(from);
}
