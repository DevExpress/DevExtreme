const base = require('../../jest.config.base.js');
const pack = require('./package');

const packageName = pack.name;

module.exports = {
  ...base,
  name: packageName,
  displayName: packageName,
  testPathIgnorePatterns: [
    "component.test.tsx",
    "nested-option.test.tsx",
    "template.test.tsx",
  ],
};
