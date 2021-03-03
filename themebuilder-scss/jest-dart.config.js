module.exports = {
    'globals': {
        'ts-jest': {
            // eslint-disable-next-line spellcheck/spell-checker
            tsconfig: 'tests/tsconfig.json',
        },
        'DART_TEST': true,
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
        '**/tests/**/builder.test.ts',
    ]
};
