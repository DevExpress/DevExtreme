/* global ts */
module.exports.translate = function (data) {
  if (ts === undefined) {
    throw new Error('TypeScript is required, but window.ts is not defined!\nInclude typescript.js to page');
  }

  const jsCode = ts.transpileModule(
    data.source,
    {
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.None,
    },
  ).outputText;

  return `${jsCode}`;
};
