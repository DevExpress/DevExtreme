import { FlatCompat } from '@eslint/eslintrc';
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import babelParser from '@babel/eslint-parser';
import importPlugin from "eslint-plugin-import";
import spellcheck from "eslint-plugin-spellcheck";
import i18N from "eslint-plugin-i18n";
import noOnlyTests from "eslint-plugin-no-only-tests";
import { rules as stylisticRules } from '@eslint-stylistic/metadata';
import stylistic from '@stylistic/eslint-plugin';
import spellCheckConfig from 'eslint-config-devextreme/spell-check';
import typescriptConfig from 'eslint-config-devextreme/typescript';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

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
    ...spellCheckConfig,
    {
        ignores: ['metadata/*'],
        plugins: {
            import: importPlugin,
            spellcheck,
            'no-only-tests': noOnlyTests,
            i18n: i18N,
            '@stylistic': stylistic,
        },
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
            },
            globals: {
                setInterval: true,
                setTimeout: true,
                clearInterval: true,
                clearTimeout: true,
                require: true,
                module: true,
                exports: true,
            },
        },
        ...importPlugin.flatConfigs.recommended,
        ...js.configs.recommended,
        rules: {
            "i18n/no-russian-character": ["error", { includeIdentifier: true }],
            "block-spacing": "error",
            "comma-spacing": "error",
            "computed-property-spacing": "error",
            "comma-style": ["error", "last"],
            "eqeqeq": ["error", "allow-null"],
            "strict": "error",
            "func-call-spacing": "error",
            "key-spacing": "error",
            "keyword-spacing": ["error", {
                overrides: {
                    catch: { after: false },
                    for: { after: false },
                    if: { after: false },
                    switch: { after: false },
                    while: { after: false },
                },
            }],
            "no-multiple-empty-lines": ["error", { max: 2 }],
            "no-multi-spaces": "error",
            "no-trailing-spaces": "error",
            "no-empty": ["error", { allowEmptyCatch: true }],
            "no-new-func": "error",
            "no-eval": "error",
            "no-undef-init": "error",
            "no-unused-vars": ["error", { args: "none", ignoreRestSiblings: true }],
            "no-extend-native": "error",
            "no-alert": "error",
            "no-console": "error",
            "no-restricted-syntax": ["error", "ForOfStatement"],
            "no-var": "error",
            "no-whitespace-before-property": "error",
            "object-curly-spacing": ["error", "always"],
            "one-var": ["error", "never"],
            "prefer-const": "error",
            "semi-spacing": "error",
            "semi": "error",
            "space-before-blocks": "error",
            "space-before-function-paren": ["error", "never"],
            "space-in-parens": "error",
            "space-infix-ops": "error",
            "space-unary-ops": "error",
            "spaced-comment": ["error", "always", {
                exceptions: ["#DEBUG", "#ENDDEBUG"],
                markers: ["/"],
            }],
            "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
            "curly": ["error", "multi-line", "consistent"],
            "unicode-bom": ["error", "never"],
            "eol-last": ["error", "always"],
            "indent": ["error", 4, {
                SwitchCase: 1,
                MemberExpression: 1,
                CallExpression: { arguments: 1 },
            }],
            "quotes": ["error", "single"],
            "import/named": "error",
            "import/default": "error",
            "import/no-duplicates": "error",
        },
    },
    ...typescriptConfig.map(config => {
      const newConfig = {
        ...config,
        files: ['**/*.ts?(x)'],
        ignores: ['**/*.d.ts'],
      };

      if (config.rules) {
        newConfig.rules = processDevExtremeRules(config.rules);
      }

      return newConfig;
    }),
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
    ...typescriptConfig.map(config => {
        const newConfig = {
            ...config,
            files: ["**/*.d.ts"],
        };

        if (config.rules) {
          newConfig.rules = processDevExtremeRules(config.rules);
        }

        return newConfig;
    }),
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
