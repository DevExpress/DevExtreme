import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getThemes } from '../build/theme-options.cjs';
import { bundleName, compileBundle } from './compiled-bundles';

jest.setTimeout(600000);

const baselinePath = join(__dirname, 'public-surface.baseline.json');

interface Surface { theme: string; name: string; names: string[] }

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

const outside = (
  names: Record<string, string[]>,
  reference: Record<string, string[]>,
): string[] => Object.entries(names).flatMap(([theme, list]) => list
  .filter((name) => !(reference[theme] ?? []).includes(name))
  .map((name) => `${theme}: ${name}`));

describe('names the themes publish as custom properties', () => {
  const baseline: Record<string, string[]> = JSON.parse(readFileSync(baselinePath, 'utf8'));
  const current: Record<string, string[]> = {};
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
    });
  });

  test('every bundle of a theme publishes the same names', () => {
    const differing = surfaces
      .filter(({ theme, names }) => names.join('\n') !== current[theme].join('\n'))
      .map(({ name }) => name);

    expect(differing).toEqual([]);
  });

  if (process.env.UPDATE_NAMING_BASELINE === '1') {
    test('baseline regenerated', () => {
      writeFileSync(baselinePath, `${JSON.stringify(current, null, 2)}\n`);

      expect(Object.values(current).flat().length).toBeGreaterThan(0);
    });
  } else {
    test('no name is published without being in the baseline', () => {
      expect(outside(current, baseline)).toEqual([]);
    });

    test('every name in the baseline still ships', () => {
      expect(outside(baseline, current)).toEqual([]);
    });
  }
});
