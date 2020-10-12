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
        '!./js/renovation/**/*.j.tsx',
        '!./js/renovation/**/__tests__/**/*',
        '!./js/renovation/utils/render_template.tsx',
        '!./js/renovation/ui/list.tsx',
    ],
    coverageDirectory: './js/renovation/code_coverage',
    coverageThreshold: {
        './js/renovation/**/*.tsx': {
            functions: 100, // Should set code coverage to 100%
            statements: 100, // (after start testing declarations)
            lines: 100,
            branches: 100
        }
    },
    roots: ['<rootDir>/js/renovation'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    preset: 'ts-jest',
    setupFiles: [
        path.join(path.resolve('.'), './js/renovation/test_utils/setup_enzyme.ts'),
    ],
    testMatch: [
        '<rootDir>/js/renovation/**/__tests__/**/*.test.[jt]s?(x)'
    ],
    transform: {
        'test_components.+\\.tsx$': path.resolve('./js/renovation/test_utils/transformers/declaration.js'),
        '\\.(js|jsx|ts)$': resolve.sync('ts-jest'),
        '\\.(tsx)$': path.resolve('./js/renovation/test_utils/transformers/tsx.js')
    }
};
