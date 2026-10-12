import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import postcss, { Declaration, Rule } from 'postcss';
import { compileStringAsync, SassString, Value } from 'sass-embedded';
import { getThemes, Theme } from '../build/theme-options.cjs';

jest.setTimeout(600000);

const packageRoot = path.resolve(__dirname, '..');
const scssRoot = path.join(packageRoot, 'scss');
const baselinePath = path.join(__dirname, 'overridden-parameters.baseline.json');

interface BaselineEntry {
  theme: string;
  file: string;
  property: string;
  selector: string;
  paintedOverBy: string;
}

interface Finding extends BaselineEntry { line: number }

interface Emission { decl: Declaration; rule: Rule; keys: string[] }

const bundleName = ([theme, size, color, mode]: Theme): string => (
  `dx${theme === 'generic' ? '' : `.${theme}`}.${color}${mode ? `.${mode}` : ''}${size === 'default' ? '' : '.compact'}.scss`
);

const bundleSource = ([theme, size, color, mode]: Theme): string => (
  fs.readFileSync(path.join(packageRoot, 'build', `bundle-template.${theme}.scss`), 'utf8')
    .replace('$COLOR', color)
    .replace('$SIZE', size)
    .replace('$MODE', mode ?? '')
);

const dataUri = (args: Value[]): Value => {
  const list = args[0].asList;
  const parts = list.toArray();
  const hasEncoding = parts.length === 2;
  const encoding = hasEncoding ? parts[0].assertString().text : 'image/svg+xml;charset=UTF-8';
  const file = parts[hasEncoding ? 1 : 0].assertString().text;
  return new SassString(`url("data:${encoding},${path.basename(file)}")`, { quotes: false });
};

const contextOf = (rule: Rule): string | null => {
  let context = '';
  let { parent } = rule;
  while (parent && parent.type === 'atrule') {
    const { name, params } = parent as postcss.AtRule;
    if (name.includes('keyframes')) return null;
    context = `@${name} ${params} ${context}`;
    parent = parent.parent;
  }
  return context;
};

const originOf = (decl: Declaration): { file: string; line: number } => {
  const { source } = decl;
  if (!source?.start) return { file: '?', line: 0 };
  const { input, start } = source;
  const origin = input.origin(start.line, start.column);
  if (!origin) return { file: input.file ?? '?', line: start.line };
  const file = decodeURIComponent((origin.file ?? origin.url).replace(/^file:\/\//, ''));
  return { file: path.relative(packageRoot, file), line: origin.line };
};

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
  const name = bundleName(theme);
  const compiled = await compileStringAsync(bundleSource(theme), {
    url: pathToFileURL(path.join(scssRoot, 'bundles', name)),
    style: 'expanded',
    sourceMap: true,
    functions: { 'data-uri($args...)': dataUri },
  });
  const root = postcss.parse(compiled.css, {
    from: path.join(scssRoot, 'bundles', name.replace(/\.scss$/, '.css')),
    map: { prev: compiled.sourceMap as unknown as string },
  });

  const byKey = new Map<string, Emission[]>();
  const emissions: Emission[] = [];
  root.walkRules((rule) => {
    const context = contextOf(rule);
    if (context === null || !rule.selector) return;
    const selectors = rule.selectors.map((selector) => selector.replace(/\s+/g, ' ').trim());
    rule.each((node) => {
      if (node.type !== 'decl') return;
      const emission: Emission = {
        decl: node,
        rule,
        keys: selectors.map((selector) => `${context}${selector}|${node.prop}`),
      };
      emissions.push(emission);
      emission.keys.forEach((key) => byKey.set(key, [...(byKey.get(key) ?? []), emission]));
    });
  });

  const winners = new Map<string, Emission>();
  byKey.forEach((list, key) => {
    const important = list.filter((emission) => emission.decl.important);
    const candidates = important.length ? important : list;
    winners.set(key, candidates[candidates.length - 1]);
  });

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
