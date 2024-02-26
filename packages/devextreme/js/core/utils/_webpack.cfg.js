// eslint-disable-next-line import/no-commonjs
const path = require('path');

module.exports = {
    // mode: 'development',
    entry: './js/core/utils/ajax.prev.js',
    // entry: './js/core/utils/ajax.old.js',
    output: {
        // eslint-disable-next-line no-undef
        path: 'C:\\_work_projects\\DevExtreme-monorepos\\packages\\devextreme\\js\\core\\utils', // path.resolve(__dirname, 'packages/devextreme'),
        filename: 'ajax.js',
        library: {
            // do not specify a `name` here
            type: 'umd',
            export: 'default',
        }
    },
};
