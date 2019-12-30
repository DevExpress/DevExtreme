/* eslint-env node */

const baseConfig = require('./webpack.config.js');

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
            test: /\.jsx$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    'plugins': [
                        ['transform-react-jsx', { 'pragma': 'Preact.h' }]
                    ]
                }
            }
        },
        {
            test: /version\.js$/,
            loader: 'string-replace-loader',
            options: {
                search: '%VERSION%',
                replace: require('./package.json').version,
            }
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    }
}, baseConfig);
