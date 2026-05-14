/**
 * Minimal zod-to-json-schema stub for QUnit / SystemJS tests.
 *
 * Uses AMD define() when available (CSP mode) and falls back
 * to global assignment for regular SystemJS (NoCsp mode).
 */

(function() {
    const zodToJsonSchema = function() { return { type: 'object' }; };

    if(typeof define === 'function') {
        define(function(require, exports) {
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.zodToJsonSchema = zodToJsonSchema;
            exports.default = zodToJsonSchema;
        });
    } else {
        const root = typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : globalThis;
        root.zodToJsonSchema = zodToJsonSchema;
    }
})();
