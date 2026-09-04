import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const packageRoot = process.cwd();
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');

const bundleNames = existsSync(artifactsCss)
  ? readdirSync(artifactsCss).filter((n) => /^dx\..*\.css$/.test(n)).sort()
  : [];

if (!bundleNames.length) {
  throw new Error(`no dx.*.css bundles found in ${artifactsCss} — the gate needs the built themes; `
    + 'run `pnpm nx run devextreme-scss:build:themes`');
}

const NOT_A_VALUE = /(--dx[a-z0-9-]*)\s*:\s*(false|true|null)\s*[;}]/g;
const EMPTY_VALUE = /(--dx[a-z0-9-]*)\s*:\s*[;}]/g;

const scan = (pattern: RegExp): string[] => bundleNames.flatMap((name) => {
  const css = readFileSync(join(artifactsCss, name), 'utf8');
  return [...css.matchAll(pattern)].map((m) => `${name}: ${m[1]}: ${m[2] ?? '(empty)'}`);
});

test('no tier variable ships a Sass literal instead of a value', () => {
  expect([...new Set(scan(NOT_A_VALUE))]).toEqual([]);
});

test('no tier variable ships an empty value', () => {
  expect([...new Set(scan(EMPTY_VALUE))]).toEqual([]);
});

const resolve = (css: string, value: string, depth = 0): string => {
  const link = /^var\(\s*(--[a-z0-9-]+)\s*\)$/.exec(value.trim());
  if (!link || depth > 5) return value.trim();
  const target = new RegExp(`${link[1]}\\s*:\\s*([^;}]*)`).exec(css);
  return target ? resolve(css, target[1], depth + 1) : value.trim();
};

const componentOpacities = (css: string): Map<string, string> => {
  const found = new Map<string, string>();
  [...css.matchAll(/(--dx-[a-z0-9-]*opacity[a-z0-9-]*)\s*:\s*([^;}]*)/g)]
    .forEach((m) => found.set(m[1], m[2].trim()));
  return found;
};

test('no component-tier opacity is set to 1', () => {
  const found = bundleNames.flatMap((name) => {
    const css = readFileSync(join(artifactsCss, name), 'utf8');
    return [...componentOpacities(css)]
      .filter(([, value]) => ['1', '1.0'].includes(resolve(css, value)))
      .map(([variable]) => `${name}: ${variable}`);
  });

  expect(found).toEqual([]);
});

test('every component-tier opacity is read by something', () => {
  const found = bundleNames.flatMap((name) => {
    const css = readFileSync(join(artifactsCss, name), 'utf8');
    return [...componentOpacities(css).keys()]
      .filter((variable) => !css.includes(`var(${variable}`))
      .map((variable) => `${name}: ${variable}`);
  });

  expect(found).toEqual([]);
});
