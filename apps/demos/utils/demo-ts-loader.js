/* global ts, System */

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

module.exports.translate = (data) => {
  if (ts === undefined) {
    throw new Error('TypeScript is required, but window.ts is not defined!\nInclude typescript.js to page');
  }

  const jsCode = ts.transpileModule(
    data.source,
    {
      compilerOptions: getDemoTsCompilerOptions(),
    },
  ).outputText;

  return `${jsCode}`;
};
