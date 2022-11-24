module.exports = {
  extends: 'devextreme/typescript',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    createDefaultProgram: true,
    project: './tsconfig.package.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'import/exports-last': 'error',
  },
  overrides: [
    {
      files: ['*.ts'],
      env: {
        jest: true,
      },
    },
  ],
};
