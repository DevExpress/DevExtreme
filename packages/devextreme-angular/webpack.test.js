var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)(@angular|esm5)/,
            path.join(__dirname, '../tests'),
            {}
        )
    ],
    resolve: {
        alias: {
          'devextreme-angular': path.resolve(__dirname, 'npm/dist')
        },
        fallback: { "stream": require.resolve("stream-browserify")}
      }
};
