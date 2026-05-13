/**
 * Minimal zod-to-json-schema stub for QUnit / SystemJS tests.
 *
 * Uses System.register format which works with both regular SystemJS
 * and CSP-production mode (no eval required).
 */

System.register([], (exports) => ({
    execute() {
        const zodToJsonSchema = () => ({ type: 'object' });

        exports('zodToJsonSchema', zodToJsonSchema);
        exports('default', zodToJsonSchema);
        exports('__esModule', true);
    },
}));
