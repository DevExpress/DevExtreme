module.exports = {
  parserOptions: {
    createDefaultProgram: true,
    project: './tsconfig.package.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'react',
    'react-hooks',
  ],
  extends: ['plugin:react/all'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react/destructuring-assignment': 'off',
    'react/jsx-no-literals': 'off',
    'comma-dangle': ['error', 'only-multiline'],
    'react/function-component-definition': [
      'error', {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/no-multi-comp': 'off',
    'react/jsx-sort-props': 'off',
    'react/jsx-newline': 'off',
    'react/jsx-max-depth': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/require-default-props': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      env: {
        jest: true,
      },
    },
  ],
};
