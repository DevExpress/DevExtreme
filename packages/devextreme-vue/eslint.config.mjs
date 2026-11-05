import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import spellcheck from "eslint-plugin-spellcheck";
import i18N from "eslint-plugin-i18n";
import noOnlyTests from "eslint-plugin-no-only-tests";
import stylistic from '@stylistic/eslint-plugin';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import spellCheckConfig from 'eslint-config-devextreme/spell-check';
import typescriptConfig from 'eslint-config-devextreme/typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
    ...spellCheckConfig,
    {
        ignores: ['metadata/*'],
        plugins: {
            import: importPlugin,
            spellcheck,
            'no-only-tests': noOnlyTests,
            i18n: i18N,
        },
    },
    ...typescriptConfig.map(config => ({
        ...config,
        files: ['**/*.ts?(x)'],
        ignores: ['**/*.d.ts'],
    })),
    {
        files: ['**/*.ts?(x)'],
        ignores: ['**/*.d.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                createDefaultProgram: true,
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname,
                ecmaVersion: 6,
                sourceType: "module",
            },
        },
        rules: {
            "prefer-regex-literals": "off",
            "i18n/no-russian-character": ["error", { includeIdentifier: true }],
            "@stylistic/max-len": ["error", { "code": 150 }],
            "@typescript-eslint/no-explicit-any": "warn",
            "spellcheck/spell-checker": "warn",
            "@typescript-eslint/prefer-optional-chain": "warn",
            "@typescript-eslint/no-unsafe-return": "warn",
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/no-use-before-define": "warn",
            "no-param-reassign": "warn",
            "consistent-return": "warn",
            "array-callback-return": "warn",
            "no-underscore-dangle": "warn",
            "no-prototype-builtins": "warn",
            "@typescript-eslint/explicit-module-boundary-types": "warn",
            "no-restricted-syntax": "warn",
            "import/no-cycle": "warn",
            "no-plusplus": "warn",
            "no-continue": "warn",
            "@typescript-eslint/no-dynamic-delete": "warn",
            "no-return-assign": "warn",
            "@typescript-eslint/prefer-nullish-coalescing": "warn",
            "import/no-extraneous-dependencies": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
    ...typescriptConfig.map(config => ({
        ...config,
        files: ["**/*.d.ts"],
    })),
    {
        files: ["**/*.d.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                createDefaultProgram: true,
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname,
                ecmaVersion: 6,
                sourceType: "module",
                ecmaFeatures: { globalReturn: true, jsx: true },
            },
        },
        rules: {
            "i18n/no-russian-character": ["error", { includeIdentifier: true }],
        },
    },
    {
        settings: {
            "import/resolver": {
                node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
            },
        },
    },
];
