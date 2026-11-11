import stylistic from '@stylistic/eslint-plugin';
import javascriptConfig from 'eslint-config-devextreme/javascript';
import typescriptConfig from 'eslint-config-devextreme/typescript';
import jestConfig from 'eslint-config-devextreme/jest';

const configDir = import.meta.dirname;

export default [
  {
    ignores: [
      'coverage',
      'dist',
      'src/data/metadata/*',
      'jest.config.js',
    ],
  },
  ...javascriptConfig.map((config) => ({
    ...config,
    files: ['**/*.mjs'],
  })),
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
  ...typescriptConfig.map((config) => ({
    ...config,
    files: ['src/**/*.ts', 'tests/**/*.ts'],
  })),
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: configDir,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'import/extensions': 'off',
      'import/no-relative-packages': 'off',
      'class-methods-use-this': 'warn',
      'prefer-regex-literals': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/member-ordering': 'warn',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
      'require-await': 'warn',
    },
  },
  ...jestConfig.map((config) => ({
    ...config,
    files: ['tests/**/*.ts'],
  })),
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.tests.json',
        tsconfigRootDir: configDir,
      },
    },
    rules: {
      'import/extensions': 'off',
      'import/no-relative-packages': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      'jest/valid-title': 'warn',
      'jest/no-alias-methods': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
    },
  },
];
