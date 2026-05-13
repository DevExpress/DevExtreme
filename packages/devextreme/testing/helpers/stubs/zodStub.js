/**
 * Minimal zod stub for QUnit / SystemJS tests.
 *
 * Uses System.register format which works with both regular SystemJS
 * and CSP-production mode (no eval required).
 */

System.register([], (exports) => ({
    execute() {
        const z = {
            // top-level constructors
            object: () => z,
            string: () => z,
            boolean: () => z,
            number: () => z,
            null: () => z,
            enum: () => z,
            union: () => z,
            array: () => z,
            tuple: () => z,
            literal: () => z,
            record: () => z,
            lazy: () => z,
            // chain modifiers
            optional: () => z,
            nullable: () => z,
            strict: () => z,
            int: () => z,
            // eslint-disable-next-line spellcheck/spell-checker
            nonnegative: () => z,
            min: () => z,
            max: () => z,
            // validation
            safeParse: () => ({ success: true, data: {} }),
        };

        exports('z', z);
        exports('default', z);
        exports('__esModule', true);
    },
}));
