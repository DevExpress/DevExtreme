import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import postcss, { Declaration, Rule } from 'postcss';
import { compileStringAsync, SassString, Value } from 'sass-embedded';

/*
 * A declaration nobody ever sees: the same property is declared again later for every selector
 * of its rule, in the same at-rule context, so the cascade always picks the later one. Base and
 * theme layers grow these when a theme repaints what base already set, and the two layers meet
 * only in a compiled bundle - hence real bundles, not files.
 *
 * A source position is reported only when every one of its emissions, in every bundle, is dead.
 * A mixin repainted at one of its call sites is fine.
 */

jest.setTimeout(300000);

const packageRoot = path.resolve(__dirname, '..');
const scssRoot = path.join(packageRoot, 'scss');
const baselinePath = path.join(__dirname, 'dead-declarations.baseline.json');

type Theme = [theme: string, size: string, color: string, mode?: string];
const { getThemes } = require(path.join(packageRoot, 'build', 'theme-options.cjs')) as {
  getThemes: () => Theme[];
};

interface BaselineEntry {
  file: string;
  property: string;
  selector: string;
  reason: string;
}

interface Position {
  file: string;
  line: number;
  property: string;
  selector: string;
  total: number;
  dead: number;
  winners: Set<string>;
}

interface Emission {
  decl: Declaration;
  rule: Rule;
  keys: string[];
}

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
  const hasEncoding = list.size === 2;
  const encoding = hasEncoding ? list.get(0)!.assertString().text : 'image/svg+xml;charset=UTF-8';
  const file = list.get(hasEncoding ? 1 : 0)!.assertString().text;
  return new SassString(`url("data:${encoding},${path.basename(file)}")`, { quotes: false });
};

const contextOf = (rule: Rule): string | null => {
  let context = '';
  for (let parent = rule.parent; parent && parent.type === 'atrule'; parent = parent.parent) {
    const { name, params } = parent as postcss.AtRule;
    if (/keyframes/.test(name)) return null;
    context = `@${name} ${params} ${context}`;
  }
  return context;
};

const originOf = (decl: Declaration): { file: string; line: number } => {
  const { input, start } = decl.source!;
  const origin = input.origin(start!.line, start!.column);
  if (!origin) return { file: input.file ?? '?', line: start!.line };
  const file = decodeURIComponent((origin.file ?? origin.url).replace(/^file:\/\//, ''));
  return { file: path.relative(packageRoot, file), line: origin.line };
};

const signature = (entry: { file: string; property: string; selector: string }): string => (
  `${entry.file}|${entry.property}|${entry.selector}`
);

const collectDeadPositions = async (): Promise<{ positions: Position[]; bundles: number }> => {
  const positions = new Map<string, Position>();
  let bundles = 0;

  for (const theme of getThemes()) {
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
    bundles += 1;

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
        emission.keys.forEach((key) => {
          const list = byKey.get(key) ?? [];
          list.push(emission);
          byKey.set(key, list);
        });
      });
    });

    const winners = new Map<string, Emission>();
    byKey.forEach((list, key) => {
      const important = list.filter((emission) => emission.decl.important);
      const candidates = important.length ? important : list;
      winners.set(key, candidates[candidates.length - 1]);
    });

    emissions.forEach((emission) => {
      const loses = emission.keys.every((key) => winners.get(key) !== emission);
      const origin = originOf(emission.decl);
      const id = `${origin.file}:${origin.line}:${emission.decl.prop}`;
      const position = positions.get(id) ?? {
        ...origin,
        property: emission.decl.prop,
        selector: emission.rule.selector.replace(/\s+/g, ' ').trim(),
        total: 0,
        dead: 0,
        winners: new Set<string>(),
      };
      position.total += 1;
      if (loses) {
        position.dead += 1;
        const winner = originOf(winners.get(emission.keys[0])!.decl);
        position.winners.add(`${winner.file}:${winner.line}`);
      }
      positions.set(id, position);
    });
  }

  return {
    positions: [...positions.values()].filter((position) => position.dead === position.total),
    bundles,
  };
};

describe('declarations the cascade never renders', () => {
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8')) as BaselineEntry[];
  let dead: Position[] = [];
  let bundles = 0;

  beforeAll(async () => {
    ({ positions: dead, bundles } = await collectDeadPositions());
  });

  test('every theme bundle compiles', () => {
    expect(bundles).toBe(getThemes().length);
  });

  test('every dead declaration is removed or listed in the baseline with a reason', () => {
    const known = new Set(baseline.map(signature));
    const unexpected = dead.filter((position) => !known.has(signature(position)));

    const report = unexpected.map((position) => [
      `${position.file}:${position.line}  ${position.property} on \`${position.selector}\``,
      `    repainted from ${[...position.winners].slice(0, 3).join(', ')}`,
      `    remove it, or add to ${path.relative(packageRoot, baselinePath)} with a reason:`,
      `    ${JSON.stringify({ file: position.file, property: position.property, selector: position.selector })}`,
    ].join('\n'));

    expect(report).toEqual([]);
  });

  test('every baseline entry is still dead', () => {
    const current = new Set(dead.map(signature));
    const stale = baseline.filter((entry) => !current.has(signature(entry)));

    expect(stale.map((entry) => `${entry.file} ${entry.property} on \`${entry.selector}\` renders again - remove the entry`))
      .toEqual([]);
  });
});
