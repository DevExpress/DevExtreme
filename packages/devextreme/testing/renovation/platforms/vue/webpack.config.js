const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

module.exports = (dirname) => ({
    mode: 'development',
    entry: {
        button: path.resolve(dirname, './src/button.js'),
        buttons: path.resolve(dirname, './src/buttons.js'),
        buttonLight: path.resolve(dirname, './src/button-light.vue')
    },
    resolve: {
        alias: { vue: path.resolve(dirname, '../../node_modules/vue/dist/vue.esm.js') },
        extensions: ['.js', '.tsx', '.ts', '.vue'],
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                use: [
                    {
                        loader: 'vue-loader',
                    },
                    {
                        loader: '@devextreme-generator/build-helpers/dist/webpack-loader',
                        options: {
                            platform: 'vue',
                        },
                    },
                ],

                exclude: ['/node_modules/'],
            },
            {
                test: /\.vue$/,
                use: ['vue-loader'],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                },
            },

            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader'],
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                    {
                        loader: '@devextreme-generator/build-helpers/dist/webpack-loader',
                        options: {
                            platform: 'vue',
                            defaultOptionsModule:
                                path.resolve(dirname, '../../../jquery-helpers/default_options'),
                        },
                    },
                ],

                exclude: ['/node_modules/'],
            },
        ],
    },

    output: {
        path: path.resolve(dirname, './dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
    },

    plugins: [
        new VueLoaderPlugin(),
    ],
});
