module.exports = {
    entry: './testing/test_bundlers/src/index.js',
    output: {
        filename: './artifacts/test_bundlers/dist_webpack/main.js',
    },
    performance: {
        hints: false
    },
    resolve: {
        modules: ['/home/runner/work/DevExtreme/DevExtreme/artifacts/npm/', 'node_modules'],
    },
};
