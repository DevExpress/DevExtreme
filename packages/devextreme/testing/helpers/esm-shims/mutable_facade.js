/**
 * Shared helpers for mutable ESM facades used by QUnit stubbing.
 */
export function wrapCtor(api, name) {
    const ExportWrapper = function(...args) {
        const Impl = api[name];
        if(new.target) {
            return new Impl(...args);
        }
        return Impl.apply(this, args);
    };
    Object.defineProperty(ExportWrapper, 'name', { value: name, configurable: true });
    // Point at the live implementation prototype so stubClass(import { X })
    // sees real methods (e.g. vizMocks Tooltip/Title/ExportMenu).
    // Also inherit statics (Class.inherit / redefine / parent / …) so
    // `BaseThemeManager.inherit(...)` keeps working under the facade.
    const Impl = api[name];
    if(typeof Impl === 'function') {
        Object.setPrototypeOf(ExportWrapper, Impl);
        if(Impl.prototype) {
            ExportWrapper.prototype = Impl.prototype;
        }
    }
    return ExportWrapper;
}

/**
 * @param {object} original
 * @param {string} globalKey
 * @param {Record<string, string>} [debugSets] map DEBUG_set_* → api property name
 */
export function createMutableApi(original, globalKey, debugSets = {}) {
    if(globalThis[globalKey]) {
        return globalThis[globalKey];
    }

    const api = { ...original };
    Object.entries(debugSets).forEach(([debugName, propName]) => {
        const originalDebugSet = api[debugName];
        api[debugName] = (value) => {
            api[propName] = value;
            if(typeof originalDebugSet === 'function') {
                originalDebugSet(value);
            }
        };
    });

    globalThis[globalKey] = api;
    return api;
}
