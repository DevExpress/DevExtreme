import { execFileSync } from 'node:child_process';
import {
  cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { getBridgeFiles, THEME_FOLDER } from '../../build/tokens/sources.ts';
import {
  buildAvailableNames,
  collectCustomPropertyReferences,
  collectTokenReferences,
} from '../../build/tokens/consumed-tokens.ts';
import {
  type GeneratedOutput,
  type Report,
  diffGenerated,
  diffNames,
  findLostConsumed,
  parseDeclarations,
  renderPreamble,
  renderReport,
  renderTerminal,
} from './report.ts';

interface FlatTokens { version: string; names: string[] }
interface Manifest { devDependencies: Record<string, string> }
interface Snapshot { files: Map<string, string>; generated: string | null }

const here = import.meta.dirname;
const packageRoot = path.resolve(here, '..', '..');
const repoRoot = path.resolve(packageRoot, '..', '..');
const generatedRoot = path.join(packageRoot, 'scss', '_design-system');
const themeRoot = path.join(packageRoot, 'scss', 'widgets', THEME_FOLDER);
const manifestPath = path.join(packageRoot, 'package.json');
const workspacePath = path.join(repoRoot, 'pnpm-workspace.yaml');
const lockPath = path.join(repoRoot, 'pnpm-lock.yaml');
const PACKAGE = '@devexpress/design-tokens-internal';

const tokensPackage = path.join(packageRoot, 'node_modules', PACKAGE);

const walk = (dir: string, extension: string): string[] => readdirSync(dir, {
  withFileTypes: true, recursive: true,
})
  .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
  .map((entry) => path.join(entry.parentPath, entry.name));

const readFlatTokens = (): FlatTokens => {
  const { version, tokens }: { version: string; tokens: Record<string, unknown> } = JSON.parse(
    readFileSync(path.join(tokensPackage, 'tokens.flat.json'), 'utf8'),
  );

  return { version, names: Object.keys(tokens) };
};

let notedUnbuilt = false;
const readGenerated = (): GeneratedOutput => {
  if (!existsSync(generatedRoot)) {
    if (notedUnbuilt) return new Map();
    notedUnbuilt = true;
    process.stderr.write(`note: ${path.relative(repoRoot, generatedRoot)} is not built yet, so the `
      + 'value diff is empty — run pnpm nx build:tokens devextreme-scss first to get one\n');
    return new Map();
  }
  return new Map(walk(generatedRoot, '.scss').map((file) => [
    path.relative(generatedRoot, file),
    parseDeclarations(readFileSync(file, 'utf8')),
  ]));
};

const readConsumed = (): Set<string> => {
  const consumed = new Set<string>();

  walk(themeRoot, '.scss').forEach((file) => {
    const content = readFileSync(file, 'utf8');
    const source = path.relative(themeRoot, file);

    collectTokenReferences(content, source).forEach((name) => consumed.add(name));
    collectCustomPropertyReferences(content, source).forEach((name) => consumed.add(name));
  });

  return consumed;
};

const plain = Boolean(process.env.NO_COLOR);
const interactive = Boolean(process.stdout.isTTY);
const color = interactive && !plain;

const progressColor = Boolean(process.stderr.isTTY) && !plain;

const show = (report: Report): void => {
  process.stdout.write(interactive
    ? `\n${renderTerminal(report, { color })}`
    : `\n${renderReport(report)}`);
};

const executable = (command: string): [string, string[]] => {
  if (command === 'node') return [process.execPath, []];
  const pnpm = process.env.npm_execpath;
  if (!pnpm) return [command, []];
  const entry = realpathSync(pnpm);
  return /\.[cm]?js$/.test(entry) ? [process.execPath, [entry]] : [entry, []];
};

const run = (command: string, args: string[], cwd: string): boolean => {
  process.stderr.write(`\n$ ${command} ${args.join(' ')}\n`);

  try {
    const [file, prefix] = executable(command);
    execFileSync(file, [...prefix, ...args], {
      cwd,
      stdio: ['inherit', 2, 'inherit'],
      shell: file === command && process.platform === 'win32',
    });

    return true;
  } catch {
    process.stderr.write(`\n${command} ${args.join(' ')} failed — see its output above.\n`);

    return false;
  }
};

const withReleaseAgeExclusion = (yaml: string, version: string): string => {
  const entry = `"${PACKAGE}@${version}"`;
  const existing = new RegExp(`(['"])${PACKAGE.replace(/[/.]/g, '\\$&')}@[^'"]+\\1`);
  if (existing.test(yaml)) return yaml.replace(existing, entry);
  if (!/^minimumReleaseAgeExclude:\n/m.test(yaml)) {
    throw new Error('pnpm-workspace.yaml has no minimumReleaseAgeExclude list to add the package to');
  }
  return yaml.replace(/^minimumReleaseAgeExclude:\n/m, (key) => `${key}  - ${entry}\n`);
};

const setDependency = (version: string): void => {
  const manifest: Manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  manifest.devDependencies[PACKAGE] = version;
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(workspacePath, withReleaseAgeExclusion(readFileSync(workspacePath, 'utf8'), version));
};

const snapshot = (): Snapshot => {
  const files = new Map([manifestPath, workspacePath, lockPath]
    .map((file) => [file, readFileSync(file, 'utf8')]));
  const generated = existsSync(generatedRoot)
    ? path.join(mkdtempSync(path.join(os.tmpdir(), 'tokens-update-')), 'generated')
    : null;
  if (generated) cpSync(generatedRoot, generated, { recursive: true });
  return { files, generated };
};

const restore = ({ files, generated }: Snapshot): void => {
  files.forEach((content, file) => writeFileSync(file, content));
  rmSync(generatedRoot, { recursive: true, force: true });
  if (generated) cpSync(generated, generatedRoot, { recursive: true });
};

const [target] = process.argv.slice(2);

const reportOnly = target === undefined || target === '--report';

if (!reportOnly && !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(target)) {
  process.stderr.write(`"${target}" is not a version\n`
    + 'usage: pnpm run tokens:update [<version>]   # without a version: report only\n');
  process.exit(1);
}
const before = { ...readFlatTokens(), generated: readGenerated() };
const saved = reportOnly ? null : snapshot();

const giveUp = (): never => {
  if (!saved) throw new Error('nothing to roll back: the report-only run touched nothing');
  restore(saved);
  process.stderr.write('\nThe bump failed and was rolled back: package.json, pnpm-workspace.yaml, '
    + `pnpm-lock.yaml and the token layer are as they were (${before.version}).\n`
    + 'node_modules may still hold the new package: pnpm install --frozen-lockfile\n');
  return process.exit(1);
};

const bumpAndReport = (): void => {
  if (!reportOnly) {
    setDependency(target);

    if (!run('pnpm', ['install', '--no-frozen-lockfile'], repoRoot)) {
      giveUp();
    }
  }

  const after = readFlatTokens();
  const summary = {
    package: PACKAGE,
    versionBefore: before.version,
    versionAfter: after.version,
    countBefore: before.names.length,
    countAfter: after.names.length,
    names: diffNames(before.names, after.names),
    lostConsumed: findLostConsumed(
      readConsumed(),
      buildAvailableNames(after.names, new Set(getBridgeFiles())),
    ),
  };

  if (!reportOnly) {
    process.stderr.write(`\n${renderPreamble(summary, { color: progressColor })}\n`);

    if (!run('node', ['build/tokens/build-tokens.ts'], packageRoot)) {
      giveUp();
    }
  }

  const registriesCurrent = reportOnly
    || run('node', ['tools/naming/derive-registries.ts', '--check'], packageRoot);

  const report = { ...summary, output: diffGenerated(before.generated, readGenerated()) };

  show(report);

  if (!reportOnly) {
    const registries = registriesCurrent ? ''
      : 'The registries are stale: after build:themes run pnpm run naming:registries and review '
        + 'tools/naming/registries.json.\n';
    process.stderr.write('\nThis rebuilt the token layer, not the themes — '
      + 'packages/devextreme/artifacts/css still holds the previous bundles.\n'
      + 'Next: pnpm nx build:themes devextreme-scss, then the etalons if any value moved.\n'
      + `${registries}\nCheck \`git diff pnpm-lock.yaml\`: anything in it beyond ${PACKAGE} is pnpm `
      + 'normalising the lockfile, not this bump.\n');
  }
};

try {
  bumpAndReport();
} catch (error) {
  if (reportOnly) throw error;
  process.stderr.write(`\n${(error instanceof Error ? error.stack : undefined) ?? String(error)}\n`);
  giveUp();
}
