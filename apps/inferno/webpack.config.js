const path = require('path');

module.exports = {
  mode: "development",
  entry: "./index.tsx",
  output: {
    filename: "bundle.js",
    publicPath: "/js/app/",
    path: path.resolve(__dirname, 'public/js/app')
  },
  devtool: "source-map",
  devServer: {
    port: 9000,
    open: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript'
            ],
            "plugins": [["babel-plugin-inferno", {"imports": true}]]
          },
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ]
      },
    ]
  }
};