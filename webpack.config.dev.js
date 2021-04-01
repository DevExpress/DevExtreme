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
                        loader: '@devextreme-generator/build-helpers/dist/webpack-loader',
                        options: {
                            platform: 'inferno',
                            defaultOptionsModule: 'js/core/options/utils',
                            jqueryComponentRegistratorModule: 'js/core/component_registrator',
                            jqueryBaseComponentModule: 'js/renovation/component_wrapper/component',
                            tsConfig: path.resolve('build/gulp/generator/ts-configs/inferno.tsconfig.json')
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
