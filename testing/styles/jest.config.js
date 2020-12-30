module.exports = {
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleFileExtensions: ['js', 'ts'],
    testMatch: [
        './**/*.test.ts',
    ],
};
