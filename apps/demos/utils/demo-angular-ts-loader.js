/* global ts, System */

let typescriptLoadPromise;

function ensureTypeScript(parentName) {
  if (typeof ts !== 'undefined') {
    return Promise.resolve(ts);
  }

  if (!typescriptLoadPromise) {
    typescriptLoadPromise = new Promise((resolve, reject) => {
      let scriptUrl;

      try {
        if (typeof System.normalizeSync !== 'function') {
          throw new Error('System.normalizeSync is not available');
        }
        scriptUrl = System.normalizeSync('typescript', parentName);
      } catch (err) {
        reject(err);
        return;
      }

      const script = document.createElement('script');
      script.src = scriptUrl;
      script.onload = () => {
        if (typeof ts === 'undefined') {
          reject(new Error('typescript.js did not define global ts'));
          return;
        }
        resolve(ts);
      };
      script.onerror = () => reject(new Error(`Failed to load TypeScript from ${script.src}`));
      document.head.appendChild(script);
    });
  }

  return typescriptLoadPromise;
}

function getDemoTsCompilerOptions(tsApi, globalOpts = {}) {
  return {
    target: tsApi.ScriptTarget.ES2015,
    module: tsApi.ModuleKind.System,
    moduleResolution: tsApi.ModuleResolutionKind.Bundler,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    ignoreDeprecations: '6.0',
    strict: false,
    ...globalOpts,
  };
}

module.exports.translate = function translate(load) {
  const parentName = load.name || load.address;

  return ensureTypeScript(parentName).then((tsApi) => {
    const globalOpts = (typeof System !== 'undefined' && System.typescriptOptions) || {};
    const loadOpts = load.metadata && load.metadata.typescriptOptions;
    const compilerOptions = loadOpts
      ? { ...getDemoTsCompilerOptions(tsApi, globalOpts), ...loadOpts }
      : getDemoTsCompilerOptions(tsApi, globalOpts);

    const result = tsApi.transpileModule(load.source, { compilerOptions });

    if (result.diagnostics && result.diagnostics.length) {
      const errors = result.diagnostics
        .filter((d) => d.category === tsApi.DiagnosticCategory.Error)
        .map((d) => tsApi.flattenDiagnosticMessageText(d.messageText, '\n'));
      if (errors.length) {
        throw new Error(`TypeScript transpilation failed:\n${errors.join('\n')}`);
      }
    }

    load.metadata.format = 'register';

    return result.outputText;
  });
};
