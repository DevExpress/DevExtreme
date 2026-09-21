/*
 * The SCSS bridge mirrors the generated stylesheets, and tools/tokens/report.ts leans on that
 * without saying so.
 *
 * scss/_design-system/variables/_ds.scss declares no custom property of its own — every line of
 * it is `$x: var(--dxds-x)` — so parseDeclarations reads the largest generated file as an empty
 * one and a bump report never attributes anything to it. That is harmless for exactly one reason:
 * every token the bridge exposes is also declared by a stylesheet the report does read, so a
 * token leaving the package still lands under "Gone from the generated output", against base.scss
 * rather than against the bridge.
 *
 * The reason is structural — getBridgeFiles() is getModeFiles('light'), a subset of the sources
 * the stylesheets are built from — but nothing held it there. Either list could move and leave
 * the report silently blind to `ds.$x` disappearing, which is the failure a consumer's build hits.
 *
 * So the check is on the report's own parser: what it sees in the stylesheets has to cover what
 * the bridge offers. If this fails, the bridge carries something the report cannot see — teach
 * parseDeclarations the `$x: var(--dxds-x)` shape rather than narrowing what is compared here.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

import { parseDeclarations } from '../tools/tokens/report';

const packageRoot = process.cwd();
const generatedRoot = join(packageRoot, 'scss', '_design-system');
const bridgePath = join(generatedRoot, 'variables', '_ds.scss');

if (!existsSync(bridgePath)) {
  throw new Error(`no generated bridge at ${bridgePath} — the gate needs the token build; `
    + 'run `pnpm nx build:tokens devextreme-scss`');
}

const stylesheets = readdirSync(generatedRoot, { withFileTypes: true, recursive: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.scss'))
  .map((entry) => join(entry.parentPath, entry.name))
  .filter((file) => file !== bridgePath)
  .sort();

/* What the report can see: every custom property its own parser finds in the stylesheets. */
const declared = new Set(stylesheets.flatMap(
  (file) => [...parseDeclarations(readFileSync(file, 'utf8')).keys()],
));

/*
 * What the bridge offers, read without assuming the shape of a line. Matching `$x: var(--dxds-x)`
 * would drop anything written differently — a fallback, say — and a dropped line is not compared
 * at all, so the check below would keep passing while covering less. Every non-blank line is
 * taken, and what it reads is whatever token names appear in its value.
 */
const bridge = readFileSync(bridgePath, 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line)
  .map((line) => {
    const declaration = /^(\$[\w-]+)\s*:\s*(.+);$/.exec(line);

    return {
      line,
      variable: declaration?.[1] ?? null,
      tokens: [...(declaration?.[2] ?? '').matchAll(/--dxds-[\w-]+/g)].map(([token]) => token),
    };
  });

/*
 * An empty scan on either side would pass the comparison below while proving nothing, and both
 * sides are generated — a build that stopped early is exactly how that happens.
 */
test('both sides of the mirror were read', () => {
  expect(stylesheets.length).toBeGreaterThan(0);
  expect(declared.size).toBeGreaterThan(0);
  expect(bridge.length).toBeGreaterThan(0);
});

test('every line of the bridge is a declaration', () => {
  expect(bridge.filter(({ variable }) => !variable).map(({ line }) => line)).toEqual([]);
});

/* A bridge variable that reads no token is not a bridge to anything. */
test('every bridge variable reads a token', () => {
  const silent = bridge
    .filter(({ variable, tokens }) => variable && !tokens.length)
    .map(({ variable }) => variable);

  expect(silent).toEqual([]);
});

test('every token the bridge reads is one the report can see', () => {
  const invisible = bridge.flatMap(({ variable, tokens }) => tokens
    .filter((token) => !declared.has(token))
    .map((token) => `${variable} -> ${token}`));

  expect(invisible).toEqual([]);
});
