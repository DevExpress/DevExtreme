/* global System */

const {
  ensureTypeScript,
  transpileToSystemRegister,
} = require('demo-ts-shared');

module.exports.translate = function translate(load) {
  const parentName = load.name || load.address;

  return ensureTypeScript(parentName).then((tsApi) => {
    const globalOpts = (typeof System !== 'undefined' && System.typescriptOptions) || {};
    const loadOpts = (load.metadata && load.metadata.typescriptOptions) || {};

    load.metadata.format = 'register';

    return transpileToSystemRegister(tsApi, load.source, loadOpts, globalOpts);
  });
};
