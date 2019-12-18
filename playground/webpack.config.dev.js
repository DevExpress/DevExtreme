/* eslint-env node */

var baseConfig = require('../webpack.config.js');

module.exports = Object.assign({
    watch: true,
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader'
            }
        },
        {
            test: /version\.js$/,
            loader: 'string-replace-loader',
            options: {
                search: '%VERSION%',
                replace: require('../package.json').version,
            }
        }]
    }
}, baseConfig);
