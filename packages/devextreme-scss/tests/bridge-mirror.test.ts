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

const declared = new Set(stylesheets.flatMap(
  (file) => [...parseDeclarations(readFileSync(file, 'utf8')).keys()],
));

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

test('both sides of the mirror were read', () => {
  expect(stylesheets.length).toBeGreaterThan(0);
  expect(declared.size).toBeGreaterThan(0);
  expect(bridge.length).toBeGreaterThan(0);
});

test('every line of the bridge is a declaration', () => {
  expect(bridge.filter(({ variable }) => !variable).map(({ line }) => line)).toEqual([]);
});

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
