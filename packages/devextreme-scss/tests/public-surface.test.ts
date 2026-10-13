import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getThemes } from '../build/theme-options';
import { bundleName, compileBundle } from './compiled-bundles';

jest.setTimeout(600000);

const baselinePath = join(__dirname, 'public-surface.baseline.json');
const journalPath = join(__dirname, '..', 'tools', 'naming', 'public-renames.json');

interface Surface { theme: string; name: string; names: string[] }

interface Group { themes: string[]; names: string[] }

const declarations = (css: string): string[] => [
  ...new Set([...css.matchAll(/(--dx-[a-z0-9-]+)\s*:/g)].map((match) => match[1])),
].sort();

const mostCommon = (lists: string[][]): string[] => {
  const counts = new Map<string, { names: string[]; count: number }>();
  lists.forEach((names) => {
    const key = names.join('\n');
    counts.set(key, { names, count: (counts.get(key)?.count ?? 0) + 1 });
  });
  return [...counts.values()].sort((left, right) => right.count - left.count)[0]?.names ?? [];
};

const grouped = (surfaceOf: Record<string, string[]>): Group[] => {
  const groups = new Map<string, Group>();
  Object.entries(surfaceOf).forEach(([theme, names]) => {
    const key = names.join('\n');
    const group = groups.get(key) ?? { themes: [], names };
    group.themes.push(theme);
    groups.set(key, group);
  });
  return [...groups.values()];
};

const outside = (
  names: Record<string, string[]>,
  reference: Record<string, string[]>,
): string[] => Object.entries(names).flatMap(([theme, list]) => list
  .filter((name) => !(reference[theme] ?? []).includes(name))
  .map((name) => `${theme}: ${name}`));

describe('names the themes publish as custom properties', () => {
  const baseline: Group[] = JSON.parse(readFileSync(baselinePath, 'utf8'));
  const journal: { retired: { name: string }[] } = JSON.parse(readFileSync(journalPath, 'utf8'));
  const retired = new Set(journal.retired.map(({ name }) => name));
  const current: Record<string, string[]> = {};
  const expected: Record<string, string[]> = {};
  let surfaces: Surface[] = [];

  beforeAll(async () => {
    surfaces = await Promise.all(getThemes().map(async (theme) => ({
      theme: theme[0],
      name: bundleName(theme),
      names: declarations(await compileBundle(theme)),
    })));

    [...new Set(surfaces.map(({ theme }) => theme))].forEach((theme) => {
      current[theme] = mostCommon(surfaces
        .filter((surface) => surface.theme === theme)
        .map(({ names }) => names));
      expected[theme] = baseline.find(({ themes }) => themes.includes(theme))?.names ?? [];
    });
  });

  test('every bundle of a theme publishes the same names', () => {
    const differing = surfaces
      .filter(({ theme, names }) => names.join('\n') !== current[theme].join('\n'))
      .map(({ name }) => name);

    expect(differing).toEqual([]);
  });

  const undocumented = (): string[] => outside(expected, current)
    .filter((entry) => !retired.has(entry.slice(entry.indexOf(': ') + 2)));

  test('no name leaves the published surface without a journal entry', () => {
    expect(undocumented()).toEqual([]);
  });

  if (process.env.UPDATE_NAMING_BASELINE === '1') {
    test('baseline regenerated', () => {
      expect(undocumented()).toEqual([]);

      writeFileSync(baselinePath, `${JSON.stringify(grouped(current), null, 2)}\n`);

      expect(Object.values(current).flat().length).toBeGreaterThan(0);
    });
  } else {
    test('every theme is in the baseline', () => {
      expect(Object.keys(current).filter((theme) => !baseline
        .some(({ themes }) => themes.includes(theme)))).toEqual([]);
    });

    test('no name is published without being in the baseline', () => {
      expect(outside(current, expected)).toEqual([]);
    });

    test('every name in the baseline still ships', () => {
      expect(outside(expected, current)).toEqual([]);
    });
  }
});
