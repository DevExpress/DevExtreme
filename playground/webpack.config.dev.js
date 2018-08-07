/* eslint-env node */

var baseConfig = require("../webpack.config.js");

module.exports = Object.assign({
    watch: true,
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader'
            }
        }]
    }
}, baseConfig);
