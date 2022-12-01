module.exports = {
  parserOptions: {
    createDefaultProgram: true,
    project: './tsconfig.package.json',
    tsconfigRootDir: __dirname,
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
