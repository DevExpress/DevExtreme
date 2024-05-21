/* eslint-disable */
export default {
  displayName: 'devextreme-monorepo-tools',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/devextreme-monorepo-tools',
};
