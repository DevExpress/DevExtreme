/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';
import { ESLint } from 'eslint';

const getChangedFiles = () => {
  const changedFilesPath = process.env.CHANGEDFILEINFOSPATH;

  return fs.existsSync(changedFilesPath) ? JSON.parse(fs.readFileSync(changedFilesPath).toString()) : null;
};

const getPatterns = () => {
  const CONSTEL = process.env.CONSTEL;

  if (CONSTEL == null) {
    console.log('CONSTEL is null');
    return ['Demos/**/*.@(vue|[tj]s?(x))'];
  }

  const changedFiles: Array<{ filename: string }> | null = getChangedFiles();

  const [current, total] = CONSTEL.split('/').map(Number);

  const demos = fs.readdirSync(path.resolve(process.cwd(), 'Demos'));
  const filteredDemos = demos.filter((_, index) => index % total === current - 1);
  const filteredDemosPatterns = filteredDemos.map((widgetName) => `Demos/${widgetName}/**/*.@(vue|[tj]s?(x))`);

  if (changedFiles != null) {
    const isChangedConfig = changedFiles.some(
      ({ filename }) => filename.includes('eslint') || filename.includes('package-lock.json') || filename.includes('.github'),
    );

    if (isChangedConfig) {
      return filteredDemosPatterns;
    }

    console.log('changedFiles', JSON.stringify(changedFiles, null, 2));

    const changedDemos = changedFiles
      .filter((item) => item.filename.startsWith('Demos'))
      .map((item) => {
        const parts = item.filename.split('/');
        return {
          widget: parts[2],
          name: parts[3],
          framework: parts[4],
        };
      })
      .filter(({ widget, name, framework }) => fs.statSync(`Demos/${widget}/${name}/${framework}`).isDirectory())
      .filter(({ widget }) => filteredDemos.includes(widget));

    console.log('changedDemos', JSON.stringify(changedDemos, null, 2));
    return changedDemos.map(({ widget, name, framework }) => `Demos/${widget}/${name}/${framework}/**/*.@(vue|[tj]s?(x))`);
  }

  console.log('filteredDemosPatterns', JSON.stringify(filteredDemosPatterns, null, 2));
  return filteredDemosPatterns;
};

(async () => {
  const eslint = new ESLint({
    cwd: process.cwd(),
  });

  const patterns = getPatterns();
  console.log('PATTERNS', JSON.stringify(patterns, null, 2));
  const results = await eslint.lintFiles(patterns);

  const errors = results.reduce((acc, { errorCount }) => acc + errorCount, 0);

  const formatter = await eslint.loadFormatter('stylish');
  const resultText = formatter.format(results);

  console.log(resultText);
  process.exit(errors);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
