const path = require('path');

module.exports = {
  mode: 'development',
  entry: './entry.js',
  output: {
    path:path.resolve(__dirname, "../../artifacts/modular"),
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      "devextreme": path.resolve(__dirname, "../../artifacts/transpiled/")
    }
  }
};
