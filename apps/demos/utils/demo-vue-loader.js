/* global ts, System, translateSFC */

const DX_SYSTEMJS_VUE_BROWSER = 'npm:dx-systemjs-vue-browser/index.js';

function getDemoTsCompilerOptions() {
  const globalOpts = (typeof System !== 'undefined' && System.typescriptOptions) || {};

  return {
    target: ts.ScriptTarget.ES2015,
    module: ts.ModuleKind.ES2015,
    ignoreDeprecations: '6.0',
    strict: false,
    ...globalOpts,
  };
}

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
  return ensureTranslateSFC().then(() => {
    const loadOpts = load.metadata && load.metadata.typescriptOptions;
    const tsCompilerOptions = loadOpts
      ? { ...getDemoTsCompilerOptions(), ...loadOpts }
      : getDemoTsCompilerOptions();

    load.source = translateSFC(load.source, true, {
      compilerOptions: tsCompilerOptions,
    });
    return load.source;
  });
};
