import noOnlyTests from 'eslint-plugin-no-only-tests';
import i18N from 'eslint-plugin-i18n';
import babelParser from '@babel/eslint-parser';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';
import { rules as stylisticRules } from '@eslint-stylistic/metadata';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const REMOVED_TYPESCRIPT_RULES = ['@typescript-eslint/no-throw-literal', '@typescript-eslint/ban-types'];

// TODO Salimov: We need to remove this function after updating eslint-config-devextreme
const processDevExtremeRules = devExtremeRules => (
    {
        ...Object.fromEntries(Object
            .entries(devExtremeRules)
            .filter(([key]) => !REMOVED_TYPESCRIPT_RULES.includes(key))
            .map(([key, value]) => {
                const rule = stylisticRules.find((r) => key.includes(r.name));
                const newKey = rule ? `@stylistic/${rule.name}` : key;

                return [newKey, value];
            })
        )
    }
);

export default [
    {
        ignores: [
            'artifacts/*',
            'js/viz/docs/*',
            'node_modules/*',
            'build/*',
            '**/*.j.tsx',
            'playground/*',
            'themebuilder/data/metadata/*',
            'themebuilder-scss/dist/*',
            'themebuilder-scss/coverage/*',
            'themebuilder-scss/src/data/metadata/*',
            'js/bundles/dx.custom.js',
            'testing/jest/utils/transformers/*',
            '**/ts/',
            'js/common/core/localization/cldr-data/*',
            'js/common/core/localization/default_messages.js',
            'js/renovation/*',
        ],
    },
    ...compat.extends('devextreme/spell-check'),
    {
        plugins: {
            'no-only-tests': noOnlyTests,
            i18n: i18N,
        },
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
                },
            },
        },
    },
    {
        ...js.configs.recommended,
        ...importPlugin.flatConfigs.recommended,
        files: ['**/*.js'],
        languageOptions: {
            globals: {
                setInterval: true,
                setTimeout: true,
                clearInterval: true,
                clearTimeout: true,
                require: true,
                module: true,
                exports: true,
            },
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
            },
        },
        rules: {
            'i18n/no-russian-character': ['error', {
                includeIdentifier: true,
            }],
            'block-spacing': 'error',
            'comma-spacing': 'error',
            'computed-property-spacing': 'error',
            'comma-style': ['error', 'last'],
            'eqeqeq': ['error', 'allow-null'],
            'strict': 'error',
            'func-call-spacing': 'error',
            'key-spacing': 'error',
            'keyword-spacing': ['error', {
                overrides: {
                    catch: {
                        after: false,
                    },

                    for: {
                        after: false,
                    },

                    if: {
                        after: false,
                    },

                    switch: {
                        after: false,
                    },

                    while: {
                        after: false,
                    },
                },
            }],
            'no-multiple-empty-lines': ['error', {
                max: 2,
            }],
            'no-multi-spaces': 'error',
            'no-trailing-spaces': 'error',
            'no-empty': ['error', {
                allowEmptyCatch: true,
            }],
            'no-new-func': 'error',
            'no-eval': 'error',
            'no-undef-init': 'error',
            'no-unused-vars': ['error', {
                args: 'none',
                caughtErrors: 'none',
                ignoreRestSiblings: true,
            }],
            'no-extend-native': 'error',
            'no-alert': 'error',
            'no-console': 'error',
            'no-restricted-syntax': ['error', 'ForOfStatement'],
            'no-var': 'error',
            'no-whitespace-before-property': 'error',
            'object-curly-spacing': ['error', 'always'],
            'one-var': ['error', 'never'],
            'prefer-const': 'error',
            'semi-spacing': 'error',
            'semi': 'error',
            'space-before-blocks': 'error',
            'space-before-function-paren': ['error', 'never'],
            'space-in-parens': 'error',
            '@stylistic/space-infix-ops': 'error',
            'space-unary-ops': 'error',
            'spaced-comment': ['error', 'always', {
                exceptions: ['#DEBUG', '#ENDDEBUG'],
                markers: ['/'],
            }],
            '@stylistic/brace-style': ['error', '1tbs', {
                allowSingleLine: true,
            }],
            'curly': ['error', 'multi-line', 'consistent'],
            'unicode-bom': ['error', 'never'],
            'eol-last': ['error', 'always'],
            '@stylistic/indent': ['error', 4, {
                SwitchCase: 1,
                MemberExpression: 1,

                CallExpression: {
                    arguments: 1,
                },
            }],
            'quotes': ['error', 'single'],
            'import/named': 2,
            'import/default': 2,
            'import/no-duplicates': 2,
        },
        plugins: {
            '@stylistic': stylistic,
            'import': importPlugin,
        }
    },
    ...compat.extends('devextreme/typescript').map(config => {
        const newConfig = {
            ...config,
            files: ['**/*.ts?(x)'],
            ignores: ['**/*.d.ts'],
        }

        if (config.rules) {
            newConfig.rules = processDevExtremeRules(config.rules);
        }

        return newConfig;
    }),
    {
        files: ['**/*.ts?(x)'],
        ignores: ['**/*.d.ts'],
        plugins: {
            '@stylistic': stylistic,
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 6,
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            'prefer-regex-literals': 'off',
            'i18n/no-russian-character': ['error', {
                includeIdentifier: true,
            }],
            '@typescript-eslint/no-unused-vars': ['error', {
                "ignoreRestSiblings": true,
                "caughtErrors": 'none',
            }],
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-throw-literal': 'off',
            '@typescript-eslint/switch-exhaustiveness-check': ['error', {
                considerDefaultExhaustiveForUnions: true,
            }],
        },
    },
    ...compat.extends('devextreme/typescript').map(config => {
        const newConfig = {
            ...config,
            files: ['**/*.d.ts'],
        };

        if (config.rules) {
            newConfig.rules = processDevExtremeRules(config.rules);
        }

        return newConfig;
    }),
    {
        files: ['**/*.d.ts'],
        plugins: {
            '@stylistic': stylistic,
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 6,
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
                ecmaFeatures: {
                    globalReturn: true,
                    jsx: true,
                },
            },
        },
        rules: {
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-wrapper-object-types': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            'i18n/no-russian-character': ['error', {
                includeIdentifier: true,
            }],
        }
    },
    //  Rules for QUnit tests
    ...compat.extends('devextreme/qunit').map(config => ({
        ...config,
        files: ['testing/tests/**/*.js', 'testing/helpers/**/*.js'],
    })),
    {
        files: ['testing/tests/**/*.js', 'testing/helpers/**/*.js'],
        rules: {
            'import/no-unresolved': 'off',
            'no-unused-vars': 'warn',
            // TODO Vinogradov: remove after eslint-config-devextreme rc2 will be released:
            'qunit/no-assert-equal': 'off',
            'qunit/no-assert-equal-boolean': 'off',
            'qunit/no-assert-logical-expression': 'off',
            'qunit/no-compare-relation-boolean': 'off',
            'qunit/no-conditional-assertions': 'off',
            'qunit/no-early-return': 'off',
            'qunit/no-negated-ok': 'off',
            'qunit/no-nested-tests': 'off',
        },
    },
    {
        'files': [
            'testing/tests/DevExpress.localization/**/*.js'
        ],
        'rules': {
            'i18n/no-russian-character': 'warn'
        }
    },
    // Rules for js folder
    {
        files: ['js/**/*'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
                },
            },
        },
    },
    {
        files: ['js/**/*.js'],
        rules: {
            'no-restricted-imports': ['error', {
                paths: [{
                    name: 'jquery',
                }, {
                    name: 'angular',
                }, {
                    name: 'knockout',
                }, {
                    name: 'globalize',
                }],

                patterns: ['jquery/*', 'angular/*', 'knockout/*', 'globalize/*'],
            }],
            'import/no-commonjs': 'error',
            'no-restricted-modules': ['error', {
                patterns: ['*.js'],
            }],
        },
    },
    {
        files: ['js/**/*.d.ts'],
        rules: {
            '@typescript-eslint/no-non-null-assertion': 'warn',
            'no-return-await': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/restrict-template-expressions': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unnecessary-condition': 'warn',
            '@typescript-eslint/strict-boolean-expressions': 'warn',
            '@typescript-eslint/unbound-method': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@stylistic/indent': 'off',
            'spaced-comment': 'off',
            '@stylistic/max-len': 'off',
            '@typescript-eslint/method-signature-style': 'off',
            '@typescript-eslint/unified-signatures': 'off',
            '@typescript-eslint/naming-convention': ['error', {
                selector: 'interface',
                format: ['PascalCase', 'camelCase'],
            }, {
                selector: 'class',
                format: ['PascalCase', 'camelCase'],
            }],
            '@typescript-eslint/array-type': 'off',
            'no-irregular-whitespace': 'error',
            'import/named': 'off',
            'import/default': 'off',
            '@typescript-eslint/no-type-alias': 'off',
            '@typescript-eslint/member-ordering': 'off',
            '@typescript-eslint/prefer-readonly-parameter-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/explicit-member-accessibility': 'off',
            '@typescript-eslint/no-unnecessary-type-arguments': 'off',
            '@typescript-eslint/no-magic-numbers': 'off',
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/prefer-interface': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
        },
    },
    // Rules for build folder
    ...compat.extends('plugin:node/recommended').map(config => ({
        ...config,
        files: ['build/**/*'],
    })),
    {
        files: ['build/**/*'],
        languageOptions: {
            globals: {
                ...globals.node,
                console: true,
            },
        },
        rules: {
            'no-console': 'off',
            'node/no-unpublished-require': 'off',
            'node/no-unsupported-features/node-builtins': 'off',
            'node/shebang': 'off',
            'node/no-unsupported-features/es-syntax': 'off',
            'spellcheck/spell-checker': 'off',
        },
    },
    // Rules for js/__internal folder
    {
        files: ['js/__internal/**/*'],
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        languageOptions: {
            globals: {
                ...Object.fromEntries(Object.entries(globals.node).map(([key]) => [key, 'off'])),
            },
        },
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
                },
            },
        },
    },
    {
        files: ['js/__internal/**/*.ts?(x)'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'script',
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: `${__dirname}/js/__internal`,
            },
        },
        rules: {
            '@typescript-eslint/consistent-type-imports': ['error', {
                disallowTypeAnnotations: false,
            }],
            'no-restricted-globals': ['warn', {
                name: 'setTimeout',
                message: 'Use setTimeout only if there is absolutely no another way. If it is, ignore this rule and leave a comment why setTimeout is used here.',
            }, {
                name: 'setInterval',
                message: 'Use setInterval only if there is absolutely no another way. If it is, ignore this rule and leave a comment why setInterval is used here.',
            }],
            'no-restricted-imports': 'off',
            '@typescript-eslint/no-restricted-imports': ['error', {
                patterns: [{
                    group: [
                        '@js/ui/data_grid/*',
                        '@js/ui/pivot_grid/*',
                        '@js/ui/tree_list/*',
                        '@js/ui/grid_core/*',
                    ],
                    message: 'Please use import from TS modules instead.',
                }, {
                    group: ['@js/__internal/*'],
                    message: 'Please use @ts instead.',
                }],
            }],
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'no-param-reassign': ['error', {
                props: false,
            }],
            'no-underscore-dangle': 'off',
            'no-console': ['error', {
                allow: ['warn', 'error'],
            }],
            'class-methods-use-this': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/prefer-ts-expect-error': 'off',
        },
    },
    // Rules for a new TS files
    {
        files: ['js/__internal/**/*.ts?(x)'],
        ignores: ['js/__internal/**/m_*.ts'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'script',
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: `${__dirname}/js/__internal`,
            },
        },
        rules: {
            'max-depth': ['error', 3],
            'no-inner-declarations': ['error', 'both'],
        },
    },
    // Rules for migrated from JS files
    {
        files: ['js/__internal/**/m_*.ts', 'js/__internal/**/module*/**.ts'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'script',
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: `${__dirname}/js/__internal`,
            },
        },
        rules: {
            'no-self-compare': 'warn',
            'no-multi-assign': 'warn',
            'no-param-reassign': 'warn',
            '@stylistic/no-mixed-operators': 'warn',
            'no-nested-ternary': 'warn',
            'no-bitwise': 'warn',
            'no-plusplus': 'warn',
            'no-continue': 'warn',
            'prefer-spread': 'warn',
            'prefer-rest-params': 'warn',
            '@stylistic/max-len': 'warn',
            'consistent-return': 'warn',
            'array-callback-return': 'warn',
            'class-methods-use-this': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/init-declarations': 'warn',
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/no-invalid-this': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/restrict-plus-operands': 'warn',
            '@typescript-eslint/no-use-before-define': 'warn',
            '@typescript-eslint/no-unused-expressions': 'warn',
            '@typescript-eslint/prefer-optional-chain': 'warn',
            '@typescript-eslint/no-this-alias': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/explicit-module-boundary-types': 'warn',
            '@typescript-eslint/no-shadow': 'warn',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-implied-eval': 'warn',
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/prefer-for-of': 'warn',
        },
    },
    // Rules for grid controls
    {
        files: [
            'js/__internal/**/grid_core/**/**.ts?(x)',
            'js/__internal/**/data_grid/**/**.ts?(x)',
            'js/__internal/**/tree_list/**/**.ts?(x)',
        ],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'script',
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: `${__dirname}/js/__internal`,
            },
        },
        rules: {
            '@typescript-eslint/explicit-member-accessibility': ['error', {
                accessibility: 'explicit',
    
                overrides: {
                    constructors: 'off',
                },
            }],
            'no-restricted-syntax': ['error', {
                selector: 'MethodDefinition[kind = \'get\']',
            }, {
                selector: 'MethodDefinition[kind = \'set\']',
            }],
            '@typescript-eslint/lines-between-class-members': 'off',
        },
    },
    // Rules for Jest tests
    {
        files: ['js/__internal/**/*test.ts?(x)'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'script',
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: `${__dirname}/js/__internal`,
            },
        },
        rules: {
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'warn',
            'import/no-extraneous-dependencies': 'off',
        },
    },
    // Rules for migrated core files
    {
        files: ['js/__internal/**/core/**/m_*.ts'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'script',
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: `${__dirname}/js/__internal`,
            },
        },
        rules: {
            'guard-for-in': 'off',
            'no-restricted-syntax': 'off',
            'func-style': 'off',
            '@stylistic/wrap-iife': 'off',
            'prefer-arrow-callback': 'off',
            '@typescript-eslint/prefer-optional-chain': 'off',
            'radix': 'off',
            'object-shorthand': 'off',
        },
    },
];
