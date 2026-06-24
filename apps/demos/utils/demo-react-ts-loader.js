module.exports.translate = function translate(load) {
  load.metadata = load.metadata || {};
  load.metadata.typescriptOptions = {
    ...(load.metadata.typescriptOptions || {}),
    jsx: 'react',
  };

  return require('demo-ts-loader').translate(load);
};
