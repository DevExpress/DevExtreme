module.exports = {
  extends: [
    'plugin:@angular-eslint/recommended',
    'plugin:@angular-eslint/template/process-inline-templates',
  ],
  parserOptions: {
    createDefaultProgram: true,
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@angular-eslint/prefer-on-push-component-change-detection': 'error',
  },
  overrides: [
    {
      files: ['*.ts'],
    },
  ],
};
