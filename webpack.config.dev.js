/* eslint-env node */

const baseConfig = require('./webpack.config.js');
const path = require('path');
const transpileConfig = require('./build/gulp/transpile-config');

module.exports = Object.assign({
    watch: true,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: [
                    {
                        loader: 'babel-loader',
                        options: transpileConfig.cjs,
                    },
                    {
                        loader: 'devextreme-generator/webpack-loader',
                        options: {
                            platform: 'preact',
                            defaultOptionsModule: 'js/core/options/utils',
                            jqueryComponentRegistratorModule: 'js/core/component_registrator',
                            jqueryBaseComponentModule: 'js/renovation/preact_wrapper/component',
                            tsConfig: path.resolve('build/gulp/generator/ts-configs/preact.tsconfig.json')
                        },
                    },
                ],
                exclude: ['/node_modules/'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: transpileConfig.cjs,
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
        extensions: ['.js', '.tsx', '.ts'],
    }
}, baseConfig);
