/* eslint-disable spellcheck/spell-checker */
const { RuleTester } = require('eslint');
const rule = require('./no_direct_preact_signals_core_import');

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
});

ruleTester.run('no-direct-preact-signals-core-import', rule, {
    valid: [
        {
            code: 'import { signal } from \'@preact/signals-core\';',
            filename: '/path/to/core/state_manager/file.ts',
        },
        {
            code: 'import * as SignalsCore from \'@preact/signals-core\';',
            filename: '/path/to/core/state_manager/reactive_primitives/index.ts',
        },
        {
            code: 'import { signal } from \'@ts/core/state_manager/index\';',
            filename: '/path/to/some/component.ts',
        },
        {
            code: 'const signals = import(\'@preact/signals-core\');',
            filename: '/path/to/core/state_manager/file.ts',
        },
        {
            code: 'const signals = require(\'@preact/signals-core\');',
            filename: '/path/to/core/state_manager/file.ts',
        },
    ],

    invalid: [
        {
            code: 'import { signal } from \'@preact/signals-core\';',
            filename: '/path/to/some/component.ts',
            errors: [
                {
                    messageId: 'noDirectImport',
                    type: 'Literal',
                },
            ],
            output: 'import { signal } from "@ts/core/state_manager/index";',
        },
        {
            code: 'import * as SignalsCore from \'@preact/signals-core\';',
            filename: '/path/to/some/component.ts',
            errors: [
                {
                    messageId: 'noDirectImport',
                    type: 'Literal',
                },
            ],
            output: 'import * as SignalsCore from "@ts/core/state_manager/index";',
        },
        {
            code: 'const signals = import(\'@preact/signals-core\');',
            filename: '/path/to/some/component.ts',
            errors: [
                {
                    messageId: 'noDirectImport',
                    type: 'Literal',
                },
            ],
            output: 'const signals = import("@ts/core/state_manager/index");',
        },
        {
            code: 'const signals = require(\'@preact/signals-core\');',
            filename: '/path/to/some/component.ts',
            errors: [
                {
                    messageId: 'noDirectImport',
                    type: 'Literal',
                },
            ],
            output: 'const signals = require("@ts/core/state_manager/index");',
        },
    ],
});

// eslint-disable-next-line no-console
console.log('All tests passed!');
