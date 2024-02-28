const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./main.ts",
  output: {
    path: path.resolve(__dirname, 'public/js'),
    publicPath: "/js/",
    filename: "bundle.js",
  },
  devtool: "source-map",
  devServer: {
    port: 9901,
    open: true,
    watchFiles: ['components/*, public/**/*'],
    static: {
      directory: path.resolve(__dirname, 'public'),
    }
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".vue", ".js"],
    alias: {
      'vue$': 'vue/dist/vue.cjs.js'
    },
    plugins: [new TsconfigPathsPlugin({
      configFile: "./tsconfig.json"
    })]
  },
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
        loader: "source-map-loader",
        options: {
          enforce: "pre",
          filterSourceMappingUrl: (url, resourcePath) => {
            return true;
          },
        }
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
  },
  ignoreWarnings: [{
    message: /source-map-loader/,
    module: /node_modules\/rrule/,
  }],
  plugins: [
    new VueLoaderPlugin()
  ]
};
