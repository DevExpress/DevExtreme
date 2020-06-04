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
    collectCoverage: true,
    collectCoverageFrom: [
        './js/renovation/**/*.p.js',
        '!./js/renovation/number-box.p.js',
        '!./js/renovation/select-box.p.js',
    ],
    coverageDirectory: './testing/jest/code_coverage',
    coverageThreshold: {
        './js/renovation/**/*.p.js': {
            functions: 90, // Should set code coverage to 100%
            statements: 90, // (after start testing declarations)
            lines: 100,
            branches: 90
        }
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    preset: 'ts-jest',
    setupFiles: [
        path.join(path.resolve('.'), './testing/jest/setup-enzyme.ts'),
    ],
    testMatch: [
        path.join(path.resolve('.'), './testing/jest/**/*.tests.[jt]s?(x)')
    ],
    transform: {
        '.(js|jsx|ts|tsx)': resolve.sync('ts-jest')
    }
};
