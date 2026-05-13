/**
 * Minimal zod stub for QUnit / SystemJS tests.
 *
 * Wrapped in AMD define() so SystemJS CSP-production mode can load it.
 */

define((require, exports) => {
    const z = {};

    [
        // top-level constructors
        'object', 'string', 'boolean', 'number', 'null',
        'enum', 'union', 'array', 'tuple', 'literal', 'record', 'lazy',
        // chain modifiers
        'optional', 'nullable', 'strict',
        'int', 'nonnegative',
        'min', 'max',
        // validation
        'safeParse',
    ].forEach((name) => { z[name] = () => z; });

    Object.defineProperty(exports, '__esModule', { value: true });
    exports.z = z;
    exports.default = z;
});
