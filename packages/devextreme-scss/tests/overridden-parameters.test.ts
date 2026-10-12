import * as fs from 'fs';
import * as path from 'path';
import { getThemes, Theme } from '../build/theme-options.cjs';
import {
  cascadeOf, originOf, packageRoot, parseBundle,
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
const sourceLine = ({ file, line }: { file: string; line: number }): string => {
  if (!sources.has(file)) {
    const full = path.join(packageRoot, file);
    sources.set(file, fs.existsSync(full) ? fs.readFileSync(full, 'utf8').split('\n') : []);
  }
  return sources.get(file)?.[line - 1] ?? '';
};

/*
 * A theme sets a parameter and then paints the same property again, with its own value, on the same
 * selector. The parameter is still published and documented, and setting it moves nothing: the last
 * declaration wins. Only a parametrized loser counts - when the base layer spells a literal there,
 * painting over it is the only way a theme can change that value, and that is ordinary theming.
 * Two declarations carrying the same value are not reported either; they cost bytes, not behaviour.
 */
const findingsOf = async (theme: Theme): Promise<Finding[]> => {
  const { emissions, winners } = cascadeOf(await parseBundle(theme));

  const findings = new Map<string, Finding>();
  emissions.forEach((emission) => {
    if (emission.decl.prop.startsWith('--')) return;
    if (!emission.keys.every((key) => winners.get(key) !== emission)) return;

    const winner = winners.get(emission.keys[0]);
    if (!winner || winner.decl.value.trim() === emission.decl.value.trim()) return;

    const origin = originOf(emission.decl);
    if (!/\$[\w-]+/.test(sourceLine(origin))) return;

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
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8')) as {
    comment: string[];
    entries: BaselineEntry[];
  };
  let findings: Finding[] = [];

  beforeAll(async () => {
    const themes = getThemes();
    const seen = new Map<string, Finding>();
    for (const theme of themes) {
      // Sequential on purpose: compiling every bundle at once would hold them all in the worker.
      // eslint-disable-next-line no-await-in-loop
      const found = await findingsOf(theme);
      found.forEach((finding) => seen.set(signature(finding), finding));
    }
    findings = [...seen.values()]
      .sort((left, right) => signature(left).localeCompare(signature(right)));
  });

  test('no parameter outside the baseline is painted over', () => {
    const known = new Set(baseline.entries.map(signature));
    const report = findings.filter((finding) => !known.has(signature(finding))).map((finding) => [
      `${finding.file}:${finding.line}  ${finding.property} on \`${finding.selector}\` (${finding.theme})`,
      `    painted over by ${finding.paintedOverBy}`,
      '    set the value through the parameter, or stop declaring it here',
    ].join('\n'));

    expect(report).toEqual([]);
  });

  test('every baseline entry is still painted over', () => {
    const current = new Set(findings.map(signature));
    const stale = baseline.entries.filter((entry) => !current.has(signature(entry)));

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
      fs.writeFileSync(baselinePath, `${JSON.stringify({ ...baseline, entries }, null, 2)}\n`);

      expect(entries.length).toBeGreaterThan(0);
    });
  }
});
