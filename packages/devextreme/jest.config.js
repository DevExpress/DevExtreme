/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    projects: [
        {
            displayName: 'jsdom-tests',
            testEnvironment: '<rootDir>/jsdom-with-timezone.js',
            roots: ['<rootDir>/js'],
            moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
            moduleNameMapper: {
                '@js/(.*)': '<rootDir>/js/$1',
                '@ts/(.*)': '<rootDir>/js/__internal/$1',
                '@preact/signals-core': '<rootDir>/node_modules/@preact/signals-core/dist/signals-core.js'
            },
            modulePathIgnorePatterns: [
                'node_modules'
            ],
            preset: 'ts-jest',
            testMatch: [
                // TODO: change to '<rootDir>/**/*.test.(ts|tsx)' after removing renovation
                '<rootDir>/js/__internal/**/*.test.(ts|tsx)',
            ],
            transform: {
                '\\.[jt]sx?$': ['ts-jest', {
                    // eslint-disable-next-line spellcheck/spell-checker
                    tsconfig: '<rootDir>/js/__internal/tsconfig.json',
                    diagnostics: false, // set to true to enable type checking
                    isolatedModules: true, // performance optimization https://kulshekhar.github.io/ts-jest/user/config/isolatedModules
                    babelConfig: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            ['babel-plugin-inferno', { 'imports': true }]
                        ]
                    }
                }],
            },
        },
        {
            displayName: 'build-scripts-tests',
            testEnvironment: 'node',
            roots: ['<rootDir>/build'],
            moduleFileExtensions: ['js'],
            testMatch: [
                '<rootDir>/build/**/*.test.js',
            ],
        }
    ]
};

