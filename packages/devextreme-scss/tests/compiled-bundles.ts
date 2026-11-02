import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import postcss, { Declaration, Root, Rule } from 'postcss';
import { compileStringAsync, SassString, Value } from 'sass-embedded';
import { Theme } from '../build/theme-options';

export const packageRoot = path.resolve(__dirname, '..');
const bundlesRoot = path.join(packageRoot, 'scss', 'bundles');

export interface Emission { decl: Declaration; rule: Rule; keys: string[] }

export interface Cascade { emissions: Emission[]; winners: Map<string, Emission> }

export const bundleName = ([theme, size, color, mode]: Theme): string => (
  `dx${theme === 'generic' ? '' : `.${theme}`}.${color}${mode ? `.${mode}` : ''}${size === 'default' ? '' : '.compact'}.scss`
);

const bundleSource = ([theme, size, color, mode]: Theme): string => (
  fs.readFileSync(path.join(packageRoot, 'build', `bundle-template.${theme}.scss`), 'utf8')
    .replace('$COLOR', color)
    .replace('$SIZE', size)
    .replace('$MODE', mode ?? '')
);

const dataUri = (args: Value[]): Value => {
  const parts = args[0].asList.toArray();
  const hasEncoding = parts.length === 2;
  const encoding = hasEncoding ? parts[0].assertString().text : 'image/svg+xml;charset=UTF-8';
  const file = parts[hasEncoding ? 1 : 0].assertString().text;
  return new SassString(`url("data:${encoding},${path.basename(file)}")`, { quotes: false });
};

const compile = (theme: Theme, sourceMap: boolean): ReturnType<typeof compileStringAsync> => (
  compileStringAsync(bundleSource(theme), {
    url: pathToFileURL(path.join(bundlesRoot, bundleName(theme))),
    style: 'expanded',
    sourceMap,
    functions: { 'data-uri($args...)': dataUri },
  })
);

export const compileBundle = async (theme: Theme): Promise<string> => (
  (await compile(theme, false)).css
);

export const parseBundle = async (theme: Theme): Promise<Root> => {
  const compiled = await compile(theme, true);
  return postcss.parse(compiled.css, {
    from: path.join(bundlesRoot, bundleName(theme).replace(/\.scss$/, '.css')),
    map: { prev: compiled.sourceMap as unknown as string },
  });
};

export const mapBundles = <T>(
  themes: Theme[],
  map: (root: Root, theme: Theme) => T,
): Promise<T[]> => themes.reduce<Promise<T[]>>(
  async (previous, theme) => [...await previous, map(await parseBundle(theme), theme)],
  Promise.resolve([]),
);

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

export const cascadeOf = (root: Root): Cascade => {
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

  return { emissions, winners };
};

export const originOf = (decl: Declaration): { file: string; line: number } => {
  const { source } = decl;
  if (!source?.start) return { file: '?', line: 0 };
  const { input, start } = source;
  const origin = input.origin(start.line, start.column);
  if (!origin) return { file: input.file ?? '?', line: start.line };
  const file = decodeURIComponent((origin.file ?? origin.url).replace(/^file:\/\//, ''));
  return { file: path.relative(packageRoot, file), line: origin.line };
};
