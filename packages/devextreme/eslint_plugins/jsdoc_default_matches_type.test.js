/* eslint-disable spellcheck/spell-checker */
const { RuleTester } = require('eslint');
const tsParser = require('@typescript-eslint/parser');
const rule = require('./jsdoc_default_matches_type');

const ruleTester = new RuleTester({
    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: 'module',
    },
});

ruleTester.run('jsdoc-default-matches-type', rule, {
    valid: [
        {
            code: 'interface dxFooOptions { /** @default null */ foo?: string | null; }',
            filename: 'foo.d.ts',
        },
        {
            code: 'interface dxFooOptions { /** @default false */ foo?: boolean; }',
            filename: 'foo.d.ts',
        },
        {
            code: 'interface dxFooOptions { /** @default undefined */ foo?: string | undefined; }',
            filename: 'foo.d.ts',
        },
        {
            code: 'interface dxFooOptions { /** @docid */ bar?: PopupProperties; }',
            filename: 'foo.d.ts',
        },
        {
            code: 'interface dxFooOptions { /** @docid */ foo?: string; }',
            filename: 'foo.d.ts',
        },
        {
            code: 'interface dxFooOptions { /** @default undefined */ bar?: PopupProperties | undefined; }',
            filename: 'foo.d.ts',
        },
    ],

    invalid: [
        {
            code: 'interface dxFooOptions { /** @default null */ foo?: string; }',
            filename: 'foo.d.ts',
            errors: [{ messageId: 'defaultNullNeedsNull' }],
        },
        {
            code: 'interface dxFooOptions { /** @default false */ foo?: boolean | undefined; }',
            filename: 'foo.d.ts',
            errors: [{ messageId: 'concreteDefaultNoUndefined' }],
        },
        {
            code: 'interface dxFooOptions { /** @default undefined */ foo?: string; }',
            filename: 'foo.d.ts',
            errors: [{ messageId: 'defaultUndefinedNeedsUndefined' }],
        },
        {
            code: 'interface dxFooOptions { /** @default undefined */ bar?: { x?: number; }; }',
            filename: 'foo.d.ts',
            errors: [{ messageId: 'defaultUndefinedNeedsUndefined' }],
        },
    ],
});
