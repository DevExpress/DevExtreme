// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const path = require('path');
const resolve = require('resolve');

module.exports = {
    'globals': {
        'ts-jest': {
            tsConfig: './testing/jest/tsconfig.json',
            diagnostics: false, // set to true to enable type checking
        }
    },
    collectCoverageFrom: [
        './js/renovation/**/*.tsx',
        '!./js/renovation/number-box.tsx',
        '!./js/renovation/list.tsx',
        '!./js/renovation/utils/render-template.tsx',
    ],
    coverageDirectory: './testing/jest/code_coverage',
    coverageThreshold: {
        './js/renovation/**/*.tsx': {
            functions: 0, // Should set code coverage to 100%
            statements: 0, // (after start testing declarations)
            lines: 0,
            branches: 0
        }
    },
    roots: ['<rootDir>/testing/jest'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    preset: 'ts-jest',
    setupFiles: [
        path.join(path.resolve('.'), './testing/jest/setup-enzyme.ts'),
    ],
    testMatch: [
        '<rootDir>/testing/jest/**/*.tests.[jt]s?(x)'
    ],
    transform: {
        'test_components.+\\.tsx$': path.resolve('./testing/jest/utils/declaration-transformer.js'),
        '\\.(js|jsx|ts|tsx)$': resolve.sync('ts-jest')
    }
};
