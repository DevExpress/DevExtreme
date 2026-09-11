/*
 * A `dx-data-uri-static` marker claims that a frozen hex literal is the current value of a design
 * token. Nothing else keeps the two in step: the colour has to be a literal because a CSS var()
 * does not resolve inside a data-uri, so the token package can be bumped and the literal will
 * quietly keep the old value while everything around it moves. See
 * scss/widgets/fluent-next/DIVERGENCES.md for why the literals exist at all.
 *
 * The token side is read from the built bundles — the `test` target depends on `build:themes`, so
 * they are fresh here, and a missing bundle fails loudly rather than passing on an empty scan. Only
 * the `:root` scope of a bundle counts: the mode classes carry the opposite mode's values, and a
 * baked literal answers for a page that names no mode.
 *
 * There is nothing to regenerate: a failure means either the literal or the marker is wrong, and
 * which one it is has to be decided by looking at the token.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const packageRoot = process.cwd();
const fluentNext = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');

const MARKER = /^\s*(\$[a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*!default;\s*\/\/\s*dx-data-uri-static:\s*ds\.\$([a-z0-9-]+)(.*)$/;
const MODE_BLOCK = /@if \$mode == "(light|dark)"/;

interface Claim {
  where: string;
  variable: string;
  literal: string;
  token: string;
  mode: 'light' | 'dark';
}

function scssFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return scssFiles(full);
    return entry.name.endsWith('.scss') ? [full] : [];
  });
}

function collectClaims(): Claim[] {
  const claims: Claim[] = [];
  for (const file of scssFiles(fluentNext)) {
    const where = file.slice(fluentNext.length + 1);
    let mode: 'light' | 'dark' | null = null;
    readFileSync(file, 'utf8').split('\n').forEach((line, index) => {
      const block = MODE_BLOCK.exec(line);
      if (block) mode = block[1] as 'light' | 'dark';
      const marker = MARKER.exec(line);
      if (!marker) return;
      const [, variable, literal, token, trailing] = marker;
      const modes: ('light' | 'dark')[] = /mode-invariant/.test(trailing)
        ? ['light', 'dark']
        : [mode ?? 'light'];
      for (const each of modes) {
        claims.push({ where: `${where}:${index + 1}`, variable, literal, token, mode: each });
      }
    });
  }
  return claims;
}

const expand = (hex: string): string => {
  const value = hex.trim().toLowerCase();
  return /^#[0-9a-f]{3}$/.test(value)
    ? `#${[...value.slice(1)].map((c) => c + c).join('')}`
    : value;
};

/*
 * A bundle declares each role more than once: the mode it was built for sits on `:root`, and the
 * opposite mode sits on the `dx-theme-mode-*` classes. A literal baked into
 * a data-uri is what a page with no mode class shows, so only the `:root` scope may answer here —
 * scanning the whole text would hand back whichever block happens to come first.
 */
const rootDeclarations = (css: string): Map<string, string> => {
  const declarations = new Map<string, string>();
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!selector.split(',').some((one) => one.trim() === ':root')) continue;
    for (const [, property, value] of body.matchAll(/(--[a-z0-9-]+):([^;]*)/g)) {
      declarations.set(property, value.trim());
    }
  }
  return declarations;
};

function resolve(declarations: Map<string, string>, property: string, depth = 0): string | null {
  const value = declarations.get(property);
  if (value === undefined) return null;
  const indirect = /^var\((--[a-z0-9-]+)\)$/.exec(value);
  return indirect && depth < 8 ? resolve(declarations, indirect[1], depth + 1) : value;
}

const bundles: Record<string, Map<string, string>> = {};
for (const mode of ['light', 'dark']) {
  const path = join(artifactsCss, `dx.fluent-next.blue.${mode}.css`);
  if (existsSync(path)) bundles[mode] = rootDeclarations(readFileSync(path, 'utf8'));
}

test('every dx-data-uri-static literal still equals the token it names', () => {
  expect(Object.keys(bundles).sort()).toEqual(['dark', 'light']);

  const claims = collectClaims();
  expect(claims.length).toBeGreaterThan(0);

  const drifted = claims.flatMap((claim) => {
    const actual = resolve(bundles[claim.mode], `--dxds-${claim.token}`);
    if (actual === null) {
      return [`${claim.where} ${claim.variable}: ds.$${claim.token} is not in the ${claim.mode} bundle`];
    }
    return expand(actual) === expand(claim.literal)
      ? []
      : [`${claim.where} ${claim.variable} (${claim.mode}): frozen ${expand(claim.literal)}, `
         + `ds.$${claim.token} is now ${expand(actual)}`];
  });

  expect(drifted).toEqual([]);
});
