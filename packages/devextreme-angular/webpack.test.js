module.exports = {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [],
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
            },
              {
                  test: /\.css$/,
                  use: ['style-loader', 'css-loader']
              }
          ],
      }]
    }

};
