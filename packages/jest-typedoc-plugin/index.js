const { Converter, Application, CommentTag } = require("typedoc");
const tests = require('../devextreme/ctrf/ctrf-report.json')

module.exports.load = function load(application) {
	application.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context) => {
    const iifComment = [
      ...Object.values(context.project.reflections)
    ].find(r => r.name === 'iif' && r.variant === 'signature');

    const iifTests = tests.results.tests.filter((t) => {
      const file = t.filePath.replace('.test.ts', '');
      return file === iifComment.sources[0].fullFileName.replace('.ts', '');
    })

    const specs = iifTests.map((t) => ({
      kind: 'text',
      text: t.name + `\n\n`,
    }));

    iifComment.comment.blockTags.push(new CommentTag('@spec', specs))
  });
}