import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
} from 'fs';
import {
  join, dirname, relative, sep,
} from 'path';

import { stripScssComments } from '../../build/tokens/consumed-tokens.ts';
import {
  type Registries,
  type SourceFile,
  byCodepoint, planPublication, stalePaths, THEME, PUBLIC_FILE, LINKS_FILE, COLLECTOR_PATH,
} from './tier.ts';

const here = import.meta.dirname;
const packageRoot = join(here, '..', '..');
const widgetsRoot = join(packageRoot, 'scss', 'widgets');
const registries: Registries = JSON.parse(readFileSync(join(here, 'registries.json'), 'utf8'));

const walk = (dir: string): string[] => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  if (statSync(absolute).isDirectory()) return walk(absolute);
  return entry.endsWith('.scss') ? [absolute] : [];
});

const toPosix = (absolute: string): string => relative(widgetsRoot, absolute).split(sep).join('/');

const sourceFile = (absolute: string): SourceFile => {
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

const existing = new Map<string, string>();
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
  const stalePathSet = new Set(stale);
  [...plan.files]
    .filter(([path]) => stalePathSet.has(path))
    .sort(([a], [b]) => byCodepoint(a, b))
    .forEach(([path, content]) => {
      const absolute = join(widgetsRoot, path);
      if (!existsSync(dirname(absolute))) {
        throw new Error(`${path}: the folder does not exist`);
      }
      writeFileSync(absolute, content);
      process.stdout.write(`wrote ${path}\n`);
    });
  if (!stale.length) process.stdout.write('component tier is up to date\n');
}
