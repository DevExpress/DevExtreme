module.exports = {
    'globals': {
        'ts-jest': {
            // eslint-disable-next-line spellcheck/spell-checker
            tsconfig: 'tests/tsconfig.json',
        },
        'DART_TEST': false,
    },
    moduleFileExtensions: [
        'ts',
        'js',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testEnvironment: 'node',
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
