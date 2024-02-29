const resolve = require('resolve');

module.exports = {

  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: "node",
  testMatch: [
    "/**/*.test.[tj]s",
  ],
  transform: {
    '\\.(js|jsx|ts)$': resolve.sync('ts-jest'),
  },
};
