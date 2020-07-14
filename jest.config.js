// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const path = require('path');
const resolve = require('resolve');

module.exports = {
    'globals': {
        'ts-jest': {
            tsConfig: './jest.tsconfig.json',
            diagnostics: false, // set to true to enable type checking
        }
    },
    collectCoverageFrom: [
        './js/renovation/**/*.tsx',
        '!./js/renovation/list.tsx',
        '!./js/renovation/utils/render-template.tsx',
    ],
    coverageDirectory: './js/renovation/code_coverage',
    coverageThreshold: {
        './js/renovation/**/*.tsx': {
            functions: 0, // Should set code coverage to 100%
            statements: 0, // (after start testing declarations)
            lines: 0,
            branches: 0
        }
    },
    roots: ['<rootDir>/testing/jest', '<rootDir>/js/renovation'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    preset: 'ts-jest',
    setupFiles: [
        path.join(path.resolve('.'), './testing/jest/setup-enzyme.ts'),
    ],
    testMatch: [
        '<rootDir>/testing/jest/**/*.tests.[jt]s?(x)',
        '<rootDir>/js/renovation/**/*.test.[jt]s?(x)'
    ],
    transform: {
        'test_components.+\\.tsx$': path.resolve('./testing/jest/utils/transformers/declaration-transformer.js'),
        '\\.(js|jsx|ts)$': resolve.sync('ts-jest'),
        '\\.(tsx)$': path.resolve('./testing/jest/utils/transformers/tsx-transformer.js')
    }
};
