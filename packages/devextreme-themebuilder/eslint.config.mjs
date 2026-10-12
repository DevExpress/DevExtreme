import path from 'node:path';
import { fileURLToPath } from 'node:url';
// eslint-config-devextreme exports flat configs. FlatCompat treats the ESM
// namespace as a legacy config and rejects its __esModule property.
import typescriptConfig from 'eslint-config-devextreme/typescript';
import jestConfig from 'eslint-config-devextreme/jest';
import stylistic from '@stylistic/eslint-plugin';

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
    ...typescriptConfig.map(config => {
        const newConfig = {
            ...config,
            // Tests also need the TypeScript plugin used by their rule overrides.
            files: ["src/**/*.ts", "tests/**/*.ts"],
        }

        return newConfig;
    }),
    {
        files: ["src/**/*.ts", "tests/**/*.ts"],
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
            // TODO Vinogradov: remove after eslint-config-devextreme rc2 will be released:
            "function-paren-newline": "off",
            "import/extensions": "off",
            "import/no-relative-packages": "off",
            "class-methods-use-this": "warn",
            "prefer-regex-literals": "warn",
            "@typescript-eslint/prefer-nullish-coalescing": "off",
            "@typescript-eslint/no-unsafe-return": "warn",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/member-ordering": "warn",
            "@typescript-eslint/ban-types": "off",
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