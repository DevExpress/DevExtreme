/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/js'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    moduleNameMapper: {
        '@js/(.*)': '<rootDir>/js/$1',
        '@ts/(.*)': '<rootDir>/js/__internal/$1',
    },
    modulePathIgnorePatterns: [
        'node_modules'
    ],
    preset: 'ts-jest',
    testMatch: [
        '<rootDir>/js/__internal/grids/new/**/*.test.(ts|tsx)',
    ],
    transform: {
        '\\.[jt]sx?$': ['ts-jest', {
            // eslint-disable-next-line spellcheck/spell-checker
            tsconfig: './js/__internal/tsconfig.json',
            diagnostics: false, // set to true to enable type checking
            isolatedModules: true, // performance optimization https://kulshekhar.github.io/ts-jest/user/config/isolatedModules
            babelConfig: {
                presets: ['@babel/preset-env'],
                plugins: [
                    ['babel-plugin-inferno', { 'imports': true }]
                ]
            }
        }],
    }
};
