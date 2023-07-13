const path = require('path');

module.exports = (dirname) => ({
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                        },
                    },
                    {
                        loader: '@devextreme-generator/build-helpers/dist/webpack-loader',
                        options: {
                            platform: 'react',
                            tsConfig: path.resolve(dirname, './tsconfig.json'),
                        },
                    },
                ],
                exclude: ['/node_modules/'],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.tsx', '.ts'],
        alias: {
            'react-dom': path.resolve(dirname, '../../node_modules/react-dom'),
            'react': path.resolve(dirname, '../../node_modules/react'),
        }
    },
});
