module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [],
  resolve: {
    // 'alias' is required in addition to 'fallback': pnpm hoists a transitive 'stream' npm package
    // (style-dictionary -> @bundled-es-modules/*) that shadows the fallback otherwise
    alias: { stream: require.resolve('stream-browserify') },
    fallback: { stream: require.resolve('stream-browserify') },
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
          use: [
            require.resolve('style-loader'),
            require.resolve('css-loader'),
          ],
        },
      ],
    }],
  },

};
