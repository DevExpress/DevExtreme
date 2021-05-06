module.exports = {
    entry: './testing/test_bundlers/src/index.js',
    output: {
        filename: './artifacts/test_bundlers/dist_webpack/main.js',
    },
    resolve: {
        modules: ['./artifacts/npm/devextreme', 'node_modules'],
    },
};
