const base = require('../../jest.config.base.js');
const pack = require('./package');

const packageName = pack.name;

module.exports = {
  ...base,
  name: packageName,
  displayName: packageName,
  moduleNameMapper: {
    "^vue$": "vue/dist/vue.cjs",
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};
