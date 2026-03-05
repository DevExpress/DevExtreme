export default {
  displayName: 'nx-infra-plugin',
  preset: '../../jest.config.base.js',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  transformIgnorePatterns: ['node_modules', '\\.js$', '\\.cjs$', '\\.json$'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  resolver: '<rootDir>/jest-resolver.js',
};
