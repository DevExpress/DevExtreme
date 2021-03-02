module.exports = {
    'globals': {
        'ts-jest': {
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
