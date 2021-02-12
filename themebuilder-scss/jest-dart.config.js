module.exports = {
    'globals': {
        'ts-jest': {
            tsConfig: 'tests/tsconfig.json',
        },
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
