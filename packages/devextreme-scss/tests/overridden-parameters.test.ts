import * as fs from 'fs';
import * as path from 'path';
import { Root } from 'postcss';
import { getThemes, Theme } from '../build/theme-options';
import {
  cascadeOf, mapBundles, originOf, packageRoot,
} from './compiled-bundles';

jest.setTimeout(600000);

const baselinePath = path.join(__dirname, 'overridden-parameters.baseline.json');

interface BaselineEntry {
  theme: string;
  file: string;
  property: string;
  selector: string;
  paintedOverBy: string;
}

interface Finding extends BaselineEntry { line: number }

const sources = new Map<string, string[]>();
const sourceLines = (file: string): string[] => {
  if (!sources.has(file)) {
    const full = path.join(packageRoot, file);
    sources.set(file, fs.existsSync(full) ? fs.readFileSync(full, 'utf8').split('\n') : []);
  }
  return sources.get(file) ?? [];
};

const mixinArguments = (source: string): string[] => {
  const names: string[] = [];
  const open = /^@mixin\s+[\w-]+\s*\(/.exec(source);
  let depth = 0;
  let argumentStart = true;
  for (let index = open ? open[0].length - 1 : source.length; index < source.length; index += 1) {
    const char = source[index];
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (depth === 0) break;
    if (depth === 1 && char === ',') argumentStart = true;
    if (argumentStart && char === '$') {
      names.push(/^\$[\w-]+/.exec(source.slice(index))?.[0] ?? '');
      argumentStart = false;
    }
  }
  return names;
};

const mixinVariables = (file: string, line: number): Set<string> | undefined => {
  const lines = sourceLines(file).slice(0, line - 1);
  let depth = 0;
  let statement = 0;
  lines.forEach((text, index) => {
    if (depth === 0 && /^[^\s)}]/.test(text)) statement = index;
    depth += (text.match(/{/g) ?? []).length - (text.match(/}/g) ?? []).length;
  });
  if (depth === 0 || !lines[statement].startsWith('@mixin')) return undefined;

  const body = lines.slice(statement);
  const names = new Set(mixinArguments(body.join('\n')));
  body.forEach((text) => {
    const local = /^\s+(\$[\w-]+)\s*:/.exec(text);
    if (local) names.add(local[1]);
  });
  return names;
};

const findingsOf = (root: Root, theme: Theme): Finding[] => {
  const { emissions, winners } = cascadeOf(root);

  const findings = new Map<string, Finding>();
  emissions.forEach((emission) => {
    if (emission.decl.prop.startsWith('--')) return;
    if (!emission.keys.every((key) => winners.get(key) !== emission)) return;

    const winner = winners.get(emission.keys[0]);
    if (!winner || winner.decl.value.trim() === emission.decl.value.trim()) return;

    const origin = originOf(emission.decl);
    const variables = sourceLines(origin.file)[origin.line - 1]
      ?.replace(/\$[\w-]+\s*:/g, '')
      .match(/\$[\w-]+/g) ?? [];
    if (!variables.length) return;
    const mixinScope = mixinVariables(origin.file, origin.line);
    if (mixinScope && variables.every((name) => mixinScope.has(name))) return;

    const paintedOver = originOf(winner.decl);
    const finding: Finding = {
      theme: theme[0],
      file: origin.file,
      line: origin.line,
      property: emission.decl.prop,
      selector: emission.rule.selector.replace(/\s+/g, ' ').trim(),
      paintedOverBy: paintedOver.file,
    };
    findings.set(`${finding.file}|${finding.property}|${finding.selector}`, finding);
  });

  return [...findings.values()];
};

const signature = (entry: BaselineEntry): string => (
  `${entry.theme}|${entry.file}|${entry.property}|${entry.selector}`
);

describe('parameters a theme sets and then paints over', () => {
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8')) as BaselineEntry[];
  let findings: Finding[] = [];

  beforeAll(async () => {
    const found = await mapBundles(getThemes(), findingsOf);
    const seen = new Map(found.flat().map((finding) => [signature(finding), finding]));
    findings = [...seen.values()]
      .sort((left, right) => signature(left).localeCompare(signature(right)));
  });

  test('no parameter outside the baseline is painted over', () => {
    const known = new Set(baseline.map(signature));
    const report = findings.filter((finding) => !known.has(signature(finding))).map((finding) => [
      `${finding.file}:${finding.line}  ${finding.property} on \`${finding.selector}\` (${finding.theme})`,
      `    painted over by ${finding.paintedOverBy}`,
      '    set the value through the parameter, or stop declaring it here',
    ].join('\n'));

    expect(report).toEqual([]);
  });

  test('every baseline entry is still painted over', () => {
    const current = new Set(findings.map(signature));
    const stale = baseline.filter((entry) => !current.has(signature(entry)));

    expect(stale.map((entry) => `${entry.theme} ${entry.file} ${entry.property} on \`${entry.selector}\` renders again - remove the entry`))
      .toEqual([]);
  });

  if (process.env.UPDATE_OVERRIDDEN_BASELINE === '1') {
    test('baseline regenerated', () => {
      const entries = findings.map((finding) => ({
        theme: finding.theme,
        file: finding.file,
        property: finding.property,
        selector: finding.selector,
        paintedOverBy: finding.paintedOverBy,
      }));
      fs.writeFileSync(baselinePath, `${JSON.stringify(entries, null, 2)}\n`);

      expect(entries.length).toBeGreaterThan(0);
    });
  }
});
