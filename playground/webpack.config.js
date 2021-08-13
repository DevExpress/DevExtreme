const path = require('path');

module.exports = {
  entry: './entry.js',
  output: {
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      "devextreme": path.resolve(__dirname, "../artifacts/transpiled/")
    }
  }
};
