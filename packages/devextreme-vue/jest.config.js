const base = require('../../jest.config.base.js');
const pack = require('./package');

const packageName = pack.name;

module.exports = {
  ...base,
  name: packageName,
  displayName: packageName,
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  transform: {
    '.*': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: {
          noEmitOnError: false,
        },
      },
    ],
  },
  moduleNameMapper: {
    "^vue$": "vue/dist/vue.cjs",
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};
