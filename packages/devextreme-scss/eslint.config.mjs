import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { changeRulesToStylistic } from 'eslint-migration-utils';
import javascriptConfig from 'eslint-config-devextreme/javascript';
import typescriptConfig from 'eslint-config-devextreme/typescript';
import jestConfig from 'eslint-config-devextreme/jest';

const configDir = import.meta.dirname;

// airbnb-typescript is vendored in its eslintrc form, so its rules still name the
// formatting rules that @typescript-eslint v8 dropped; the mapping moves them to @stylistic.
const toStylistic = (config, files) => {
  const newConfig = { ...config, files };

  if (config.rules) {
    newConfig.rules = changeRulesToStylistic(config.rules);
  }

  return newConfig;
};

const typescriptFor = (files, project) => [
  ...typescriptConfig.map((config) => toStylistic(config, files)),
  {
    files,
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project,
        tsconfigRootDir: configDir,
      },
    },
  },
];

export default [
  {
    // scss/ is stylesheets, and two of its folders (_design-system, bundles) are build output
    // that exists only after a build. stylelint covers that side; nothing here does.
    ignores: ['node_modules/**', 'scss/**'],
  },

  ...javascriptConfig.map((config) => ({ ...config, files: ['**/*.mjs'] })),
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.node,
    },
  },

  ...javascriptConfig.map((config) => ({ ...config, files: ['**/*.cjs'] })),
  {
    files: ['**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      // airbnb bans the directive because a module is strict already; a CommonJS file is not.
      strict: ['error', 'safe'],
    },
  },

  ...typescriptFor(['build/**/*.ts', 'tools/**/*.ts'], './tsconfig.json'),

  ...typescriptFor(['tests/**/*.ts'], './tsconfig.json'),
  ...jestConfig.map((config) => ({ ...config, files: ['tests/**/*.ts'] })),

  {
    // Nothing in this package is published as JavaScript: every .mjs and .ts file here is
    // build tooling, review tooling or a test, so its imports are devDependencies by design.
    files: ['**/*.{mjs,cjs,ts}'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },

  {
    files: ['**/*.mjs'],
    rules: {
      // Node ESM resolves no extensions, so an import of a local .mjs file must spell it out.
      'import/extensions': ['error', 'ignorePackages', { mjs: 'always' }],
      /* eslint-plugin-import still resolves through the legacy node algorithm, which does not read
       * a package's `exports` map; these three publish their entry points that way only. */
      'import/no-unresolved': ['error', {
        ignore: ['^style-dictionary(/|$)', '^safe-ts-transforms-fork$', '^@typescript-eslint/'],
      }],
      // airbnb-base bans for..of because it needs regenerator-runtime in a browser build.
      // Nothing here reaches a browser, and eslint-config-devextreme/typescript already makes
      // that call for the repo's TypeScript, so this mirrors its list instead.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],
    },
  },

  {
    // The same call the build/**/* block of packages/devextreme/eslint.config.mjs makes: these
    // are CLI scripts whose report *is* their console output.
    files: ['tools/**/*.mjs', 'build/**/*.{mjs,cjs}'],
    rules: {
      'no-console': 'off',
    },
  },

  {
    /* Visitors that rewrite the node they are handed: that is the API in all three cases - a
     * stylelint fixer edits the postcss node, a style-dictionary transform edits the token, and
     * the token walker rewrites the tree it parsed. Only these parameter names are exempt. */
    files: [
      'tools/stylelint/*.mjs',
      'build/tokens/transforms.mjs',
      'build/tokens/build-tokens.mjs',
    ],
    rules: {
      'no-param-reassign': ['error', {
        props: true,
        ignorePropertyModificationsFor: ['decl', 'branch', 'token', 'node'],
      }],
    },
  },
];
