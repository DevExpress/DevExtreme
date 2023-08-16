const { VueLoaderPlugin } = require('vue-loader');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: "./main.ts",
    output: {
      filename: "./public/js/app/bundle.js",
    },
    devtool: "source-map",
    devServer: {
      port: 9901,
      open: true,
      openPage: "public/index.html"
    },
    resolve: {
      extensions: [".webpack.js", ".web.js", ".ts", ".vue", ".js"],
      alias: {
        'vue$': 'vue/dist/vue.cjs.js'
      },
      plugins: [new TsconfigPathsPlugin({
        configFile: "../../tsconfig.json"
      })]
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
          loader: "source-map-loader",
          options: {
            enforce: "pre",
            filterSourceMappingUrl: (url, resourcePath) => {
              if (/vue2-strategy.*/i.test(url)) {
                return false;
              }

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
    plugins: [
      new VueLoaderPlugin()
    ]
  };
