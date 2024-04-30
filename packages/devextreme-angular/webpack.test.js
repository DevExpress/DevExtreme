var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [],
    resolve: {
        alias: {
            'devextreme-angular': path.resolve(__dirname, 'npm/dist'),
        },
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
