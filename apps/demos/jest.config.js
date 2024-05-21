module.exports = {
  testMatch: [
    '**/tests/**/*.test.js',
  ],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '.*visual-tests.*',
  ],
};
