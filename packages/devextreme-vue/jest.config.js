const base = require('../../jest.config.base.js');
const pack = require('./package');

const packageName = pack.name;

module.exports = {
  ...base,
  name: packageName,
  displayName: packageName,
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
        tsconfig: '<rootDir>/tsconfig.json',
        diagnostics: false,
      },
    ],
  },
};
