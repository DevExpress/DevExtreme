import { execFileSync } from 'child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { basename, join } from 'path';

export type Warning = { line: number; rule: string; text: string };
export type Result = { warnings: Warning[]; output: string };
export type Runner = {
  lint: (name: string, source: string) => Result;
  fix: (name: string, source: string) => Result;
};

const packageRoot = process.cwd();
const stylelintBin = join(packageRoot, 'node_modules', '.bin', 'stylelint');

export const scss = (...rows: string[]): string => `${rows.join('\n')}\n`;

export const createRunner = (pluginFile: string, ruleName: string): Runner => {
  const fixture = mkdtempSync(join(tmpdir(), `${basename(pluginFile, '.mjs')}-`));
  const configPath = join(fixture, 'config.json');
  writeFileSync(configPath, JSON.stringify({
    customSyntax: require.resolve('postcss-scss', { paths: [require.resolve('stylelint-scss')] }),
    plugins: [join(packageRoot, 'tools', 'stylelint', pluginFile)],
    rules: { [ruleName]: true },
  }));

  const run = (name: string, source: string, fix: boolean): Result => {
    const file = join(fixture, name);
    const reportFile = join(fixture, `${name}.report.json`);
    writeFileSync(file, source);
    writeFileSync(reportFile, '');
    const args = [file, '--config', configPath, '--formatter', 'json', '--output-file', reportFile, ...(fix ? ['--fix'] : [])];
    try {
      execFileSync(stylelintBin, args, { stdio: 'ignore' });
    } catch (error) {
      if ((error as { status?: number }).status !== 2) throw error;
    }
    const [{ warnings }] = JSON.parse(readFileSync(reportFile, 'utf8') || '[{"warnings":[]}]');
    return {
      warnings: warnings.map(({ line, rule, text }: Warning) => ({ line, rule, text })),
      output: readFileSync(file, 'utf8'),
    };
  };

  return {
    lint: (name, source) => run(name, source, false),
    fix: (name, source) => run(name, source, true),
  };
};
