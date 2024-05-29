module.exports = {
    moduleFileExtensions: [
        'ts',
        'js',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            // eslint-disable-next-line spellcheck/spell-checker
            tsconfig: './tsconfig.tests.json',
        }],
    },
    testMatch: [
        '**/tests/**/*.test.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
};
