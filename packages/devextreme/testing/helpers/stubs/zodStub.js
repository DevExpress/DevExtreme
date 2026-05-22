/**
 * Minimal zod stub for QUnit / SystemJS tests.
 *
 * Uses AMD define() when available (CSP mode) and falls back
 * to global assignment for regular SystemJS (NoCsp mode).
 */

(function() {
    const z = {
        // top-level constructors
        object: function() { return z; },
        string: function() { return z; },
        boolean: function() { return z; },
        number: function() { return z; },
        null: function() { return z; },
        enum: function() { return z; },
        union: function() { return z; },
        array: function() { return z; },
        tuple: function() { return z; },
        literal: function() { return z; },
        record: function() { return z; },
        lazy: function() { return z; },
        // chain modifiers
        optional: function() { return z; },
        nullable: function() { return z; },
        strict: function() { return z; },
        int: function() { return z; },
        // eslint-disable-next-line spellcheck/spell-checker
        nonnegative: function() { return z; },
        positive: function() { return z; },
        min: function() { return z; },
        max: function() { return z; },
        // validation
        safeParse: function() { return { success: true, data: {} }; },
    };

    if(typeof define === 'function') {
        define(function(require, exports) {
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.z = z;
            exports.default = z;
        });
    } else {
        const root = typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : globalThis;
        root.z = z;
        root.zod = z;
    }
})();
