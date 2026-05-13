/**
 * Minimal zod-to-json-schema stub for QUnit / SystemJS tests.
 *
 * Wrapped in AMD define() so SystemJS CSP-production mode can load it.
 */

define((require, exports) => {
    const zodToJsonSchema = () => ({ type: 'object' });

    Object.defineProperty(exports, '__esModule', { value: true });
    exports.zodToJsonSchema = zodToJsonSchema;
    exports.default = zodToJsonSchema;
});
