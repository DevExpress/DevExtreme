/*
 * The CSS -> JS contract (tools/naming/runtime-reads.json): --dx-* names the tier declares only
 * for the runtime to read back. Nothing in a stylesheet reads them, so a rename or a removal on
 * either side is silent - the runtime just falls back to its legacy literal and fluent-next
 * renders the old geometry. This test is where that would show: both ends must still match.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const contract = require('../tools/naming/runtime-reads.json') as {
  variables: { name: string; readBy: string; meaning: string }[];
};

const packageRoot = process.cwd();
const repoRoot = join(packageRoot, '..', '..');
const themeRoot = join(packageRoot, 'scss', 'widgets', 'fluent-next');

// `--dx-grid-ai-confirm-dialog-width` is published from gridBase/_public.scss as
// `--dx-grid-ai-confirm-dialog-width: #{$grid-ai-confirm-dialog-width};`
const publishedNames = (): Set<string> => {
  const collector = readFileSync(join(themeRoot, '_public-tier.scss'), 'utf8');
  const folders = [...collector.matchAll(/@use "([^/"]+)\/public"/g)].map(([, folder]) => folder);
  return new Set(folders.flatMap((folder) => [
    ...readFileSync(join(themeRoot, folder, '_public.scss'), 'utf8').matchAll(/^\s*(--dx-[a-z0-9-]+)\s*:/gm),
  ].map(([, name]) => name)));
};

test('every runtime-read name is still declared by the component tier', () => {
  const published = publishedNames();
  expect(contract.variables.map(({ name }) => name).filter((name) => !published.has(name))).toEqual([]);
});

test('every runtime-read name is still read by the file the contract names', () => {
  const offenders = contract.variables.flatMap(({ name, readBy }) => {
    const file = join(repoRoot, readBy);
    if (!existsSync(file)) return [`${name}: ${readBy} does not exist`];
    return readFileSync(file, 'utf8').includes(`'${name}'`) ? [] : [`${name}: not read in ${readBy}`];
  });
  expect(offenders).toEqual([]);
});

test('the contract is the only place a fluent-next name is read from the runtime', () => {
  // A name read by JS and known to nobody else is exactly the silent failure above; every reader
  // has to register here. The scan is by the file's own literal, so a helper call with a name
  // built from pieces would slip through - do not build names from pieces.
  const listed = new Set(contract.variables.map(({ name }) => name));
  const readers = [...new Set(contract.variables.map(({ readBy }) => readBy))];
  const unlisted = readers.flatMap((readBy) => [
    ...readFileSync(join(repoRoot, readBy), 'utf8').matchAll(/'(--dx-(?!ds-)[a-z0-9-]+)'/g),
  ].map(([, name]) => name).filter((name) => !listed.has(name)).map((name) => `${name} in ${readBy}`));
  expect(unlisted).toEqual([]);
});
