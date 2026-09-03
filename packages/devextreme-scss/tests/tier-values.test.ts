import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

/*
 * The component and design-system tiers carry VALUES. Nothing else belongs in them.
 *
 * A Sass switch published by mistake proves the point: `$scheduler-appointment-bg-focused: false`
 * is a build-time flag - base reads it as `@if $fill-focused-appointment` to decide whether a rule
 * exists at all - and _public.scss published it mechanically, so the shipped CSS carried
 * `--dx-scheduler-appointment-bg-focused: false` on every `.dx-scheduler` root. A custom property
 * accepts any token sequence, so the browser said nothing; nothing read the name either, so nothing
 * broke. But the name reads as a colour role while holding a boolean, and the first `var()` to
 * reach for it would produce an invalid declaration that resolves to `unset` in silence.
 *
 * A hard gate rather than a ratchet: at the time of writing no bundle holds such a value, and this
 * shape has no legitimate use - a flag that decides which rules exist cannot be a custom property,
 * because custom properties are resolved long after the rules are emitted.
 */

const packageRoot = process.cwd();
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');

const bundleNames = existsSync(artifactsCss)
  ? readdirSync(artifactsCss).filter((n) => /^dx\..*\.css$/.test(n)).sort()
  : [];

if (!bundleNames.length) {
  throw new Error(`no dx.*.css bundles found in ${artifactsCss} — the gate needs the built themes; `
    + 'run `pnpm nx run devextreme-scss:build:themes`');
}

// A declaration whose whole value is a Sass literal, or nothing at all.
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
