import path from 'node:path';
import { fileURLToPath } from 'node:url';
import stylistic from '@stylistic/eslint-plugin';
import typescriptConfig from 'eslint-config-devextreme/typescript';
import jestConfig from 'eslint-config-devextreme/jest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
    {
        ignores: [
            "coverage",
            "dist",
            "src/data/metadata/*",
            "jest.config.js",
        ],
    },
    ...typescriptConfig.map(config => ({
        ...config,
        files: ["src/**/*.ts"],
    })),
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            "@stylistic": stylistic,
        },
        rules: {
            "import/extensions": "off",
            "import/no-relative-packages": "off",
            "class-methods-use-this": "warn",
            "prefer-regex-literals": "warn",
            "@typescript-eslint/prefer-nullish-coalescing": "off",
            "@typescript-eslint/no-unsafe-return": "warn",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/member-ordering": "warn",
            "@typescript-eslint/no-unnecessary-boolean-literal-compare": "off",
        },
    },
    ...jestConfig.map((config) => ({
        ...config,
        files: ["tests/**/*.ts"],
    })),
    {
        files: ["tests/**/*.ts"],
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.tests.json",
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            "import/extensions": "off",
            "import/no-relative-packages": "off",
            "@typescript-eslint/prefer-nullish-coalescing": "off",
            "jest/valid-title": "warn",
            "jest/no-alias-methods": "warn",
            "@typescript-eslint/no-non-null-assertion": "warn",
        },
    },
];
