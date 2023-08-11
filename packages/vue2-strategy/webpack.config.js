module.exports = {
  entry: "./sandbox/main.ts",
  output: {
    filename: "./sandbox/public/js/app/bundle.js",
  },
  devtool: "source-map",
  devServer: {
    port: 9900,
    open: true,
    openPage: "sandbox/public/index.html"
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".vue", ".js"],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: true
        }
      },
      {
        test: /\.js$/,
        use: "source-map-loader",
        enforce: "pre"
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            appendTsSuffixTo: [/\.vue$/],
            compilerOptions: {
              "noImplicitAny": false
            }
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: "url-loader?name=[name].[ext]"
      }
    ]
  }
};
