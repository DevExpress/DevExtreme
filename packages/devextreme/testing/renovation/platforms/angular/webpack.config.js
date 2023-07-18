const path = require('path');

module.exports = (dirname) => ({
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js', '.tsx'],
        alias: {
            '@angular/core': path.resolve(dirname, '../../node_modules/@angular/core'),
            '@angular/common': path.resolve(dirname, '../../node_modules/@angular/common'),
            '@angular/forms': path.resolve(dirname, '../../node_modules/@angular/forms')
        }
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [path.resolve(dirname, '../declaration'), path.resolve('./js/renovation')],
                exclude: ['/node_modules/', path.resolve('./js/renovation/component_wrapper')],
                use: [
                    {
                        loader: '@devextreme-generator/build-helpers/dist/webpack-loader',
                        options: {
                            platform: 'angular',
                            tsConfig: path.resolve(dirname, './tsconfig.json'),
                        },
                    },
                ],
            },
            {
                test: /\.ts$/,
                include: [path.resolve(dirname, './src')],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            ignoreDiagnostics: [2614, 2769, 2305],
                            configFile: path.resolve(dirname, './tsconfig.json'),
                        },
                    },
                    'angular2-template-loader',
                ],
            },
            {
                test: /\.html$/,
                use: 'html-loader',
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                use: 'file-loader?name=assets/[name].[hash].[ext]',
            },
            {
                test: /\.css$/,
                include: path.resolve(dirname, './src'),
                use: 'raw-loader',
            },
        ],
    },
    plugins: []
});
