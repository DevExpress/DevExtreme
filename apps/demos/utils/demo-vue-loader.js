/* global System, translateSFC */

const {
  ensureTypeScript,
  getDemoTsCompilerOptions,
} = require('./demo-ts-shared');

const DX_SYSTEMJS_VUE_BROWSER = 'npm:dx-systemjs-vue-browser/index.js';

let translateSfcModulePromise;

function ensureTranslateSFC() {
  if (typeof translateSFC !== 'undefined') {
    return Promise.resolve();
  }

  if (!translateSfcModulePromise) {
    translateSfcModulePromise = System.import(DX_SYSTEMJS_VUE_BROWSER);
  }

  return translateSfcModulePromise.then(() => {
    if (typeof translateSFC === 'undefined') {
      throw new Error('dx-systemjs-vue-browser did not define translateSFC');
    }
  });
}

module.exports.translate = function translate(load) {
  const parentName = load.name || load.address;

  return ensureTypeScript(parentName)
    .then((tsApi) => ensureTranslateSFC().then(() => {
      const globalOpts = (typeof System !== 'undefined' && System.typescriptOptions) || {};
      const loadOpts = (load.metadata && load.metadata.typescriptOptions) || {};
      const compilerOptions = {
        ...getDemoTsCompilerOptions(tsApi, globalOpts),
        ...loadOpts,
      };

      load.source = translateSFC(load.source, true, { compilerOptions });
      load.metadata.format = 'register';

      return load.source;
    }));
};
