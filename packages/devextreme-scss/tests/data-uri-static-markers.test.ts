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
      const modes: ('light' | 'dark')[] = trailing.includes('mode-invariant')
        ? ['light', 'dark']
        : [mode ?? 'light'];
      for (const each of modes) {
        claims.push({
          where: `${where}:${index + 1}`,
          variable,
          literal,
          token,
          mode: each,
        });
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

const rootDeclarations = (css: string): Map<string, string> => {
  const declarations = new Map<string, string>();
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selector]) => selector.split(',').some((one) => one.trim() === ':root'))
    .forEach(([, , body]) => {
      [...body.matchAll(/(--[a-z0-9-]+):([^;]*)/g)].forEach(([, property, value]) => {
        declarations.set(property, value.trim());
      });
    });
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
