/*
 * Regenerates the fluent-next component tier: every `<folder>/_public.scss` (projections of the
 * component's eligible variables, alphabetical) and the collector `_public-tier.scss` (mount points
 * from tools/naming/registries.json). Hand-written relations live next door in `_public-links.scss`
 * and are never touched — the generated file includes them.
 *
 *   node tools/naming/publish.mjs          # regenerates the tier files
 *   node tools/naming/publish.mjs --check  # exit 1 when a committed file is stale or a rule is broken
 *
 * The rules are the ones tests/fluent-next-naming.test.ts enforces; both read them from
 * tools/naming/tier.ts. Needs no built bundle.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, relative, sep } from 'path';
import { fileURLToPath } from 'url';

import { stripScssComments } from '../../build/tokens/consumed-tokens.ts';
import {
  planPublication, stalePaths, THEME, PUBLIC_FILE, LINKS_FILE, COLLECTOR_PATH,
} from './tier.ts';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const widgetsRoot = join(packageRoot, 'scss', 'widgets');
const registries = JSON.parse(readFileSync(join(here, 'registries.json'), 'utf8'));

const walk = (dir) => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  if (statSync(absolute).isDirectory()) return walk(absolute);
  return entry.endsWith('.scss') ? [absolute] : [];
});

const toPosix = (absolute) => relative(widgetsRoot, absolute).split(sep).join('/');

const sourceFile = (absolute) => {
  const path = toPosix(absolute);
  const segments = path.split('/');
  const raw = readFileSync(absolute, 'utf8');
  return {
    path,
    folder: segments.length > 2 ? segments[1] : '',
    raw,
    stripped: stripScssComments(raw, path),
  };
};

const themeFiles = walk(join(widgetsRoot, THEME)).map(sourceFile);
const baseFiles = walk(join(widgetsRoot, 'base')).map(sourceFile);

const existing = new Map();
themeFiles.forEach(({ path, raw }) => {
  if (path.endsWith(`/${PUBLIC_FILE}`) || path.endsWith(`/${LINKS_FILE}`) || path === COLLECTOR_PATH) {
    existing.set(path, raw);
  }
});

const plan = planPublication(themeFiles, baseFiles, registries, existing);

if (plan.problems.length) {
  process.stderr.write(`${plan.problems.map((problem) => `  ${problem}`).join('\n')}\n`);
  process.exit(1);
}

const stale = stalePaths(plan, existing);

if (process.argv.includes('--check')) {
  if (stale.length) {
    process.stderr.write(`${stale.map((path) => `  ${path} is stale`).join('\n')}\nrun pnpm naming:publish\n`);
    process.exit(1);
  }
  process.stdout.write(`component tier is up to date (${plan.files.size} files)\n`);
} else {
  stale.forEach((path) => {
    const absolute = join(widgetsRoot, path);
    if (!existsSync(dirname(absolute))) {
      throw new Error(`${path}: the folder does not exist`);
    }
    writeFileSync(absolute, plan.files.get(path));
    process.stdout.write(`wrote ${path}\n`);
  });
  plan.created.forEach((path) => {
    process.stdout.write(`${path} is new — add the component to packages/devextreme/playground/tier-reachability-audit.html\n`);
  });
  if (!stale.length) process.stdout.write('component tier is up to date\n');
}
