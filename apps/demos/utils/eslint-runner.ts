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
    return ['JSDemos/Demos/**/*.@(vue|[tj]s?(x))'];
  }

  const changedFiles: Array<{ filename: string }> | null = getChangedFiles();

  const [current, total] = CONSTEL.split('/').map(Number);

  const demos = fs.readdirSync(path.resolve(process.cwd(), 'JSDemos/Demos'));
  const filteredDemos = demos.filter((_, index) => index % total === current - 1);
  const filteredDemosPatterns = filteredDemos.map((widgetName) => `JSDemos/Demos/${widgetName}/**/*.@(vue|[tj]s?(x))`);

  if (changedFiles != null) {
    const isChangedConfig = changedFiles.some(
      ({ filename }) => filename.includes('eslint') || filename.includes('package-lock.json') || filename.includes('.github'),
    );

    if (isChangedConfig) {
      return filteredDemosPatterns;
    }

    const changedDemos = changedFiles
      .filter((item) => item.filename.startsWith('JSDemos/Demos'))
      .map((item) => {
        const parts = item.filename.split('/');
        return {
          widget: parts[2],
          name: parts[3],
          framework: parts[4],
        };
      })
      .filter(({ widget, name, framework }) => fs.statSync(`JSDemos/Demos/${widget}/${name}/${framework}`).isDirectory())
      .filter(({ widget }) => filteredDemos.includes(widget));

    return changedDemos.map(({ widget, name, framework }) => `JSDemos/Demos/${widget}/${name}/${framework}/**/*.@(vue|[tj]s?(x))`);
  }

  return filteredDemosPatterns;
};

(async () => {
  const eslint = new ESLint({
    cwd: process.cwd(),
  });

  const patterns = getPatterns();
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
