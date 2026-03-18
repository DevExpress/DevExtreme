const path = require('path');
const base = require('../../jest.config.base.js');
const pack = require('./package');

const packageName = pack.name;

module.exports = {
  ...base,
  displayName: packageName,
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  moduleNameMapper: {
    "^vue$": "vue/dist/vue.cjs",
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: path.join(__dirname, 'tsconfig.jest.json'),
        tsconfigRootDir: __dirname,
        diagnostics: false,
      },
    ],
  },
};
