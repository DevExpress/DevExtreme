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
        fallback: { "stream": require.resolve("stream-browserify")}
    },
    module: {
      rules: [{
          oneOf: [
            { 
              test: /\.m?js/, // fix:issue: https://github.com/webpack/webpack/issues/11467
              resolve: {
                fullySpecified: false,
              },
            }
          ],
      }]
    }

};
