// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const path = require('path');
const resolve = require('resolve');

module.exports = {
    'globals': {
        'ts-jest': {
            tsConfig: './tsconfig.json',
            diagnostics: false, // set to true to enable type checking
        }
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    preset: 'ts-jest',
    setupFiles: [
        path.join(path.resolve('.'), './testing/renovation/setup-enzyme.js'),
    ],
    testMatch: [
        '**/renovation/**/*.tests.[jt]s?(x)'
    ],
    transform: {
        '.(js|jsx|ts|tsx)': resolve.sync('ts-jest')
    }
};
