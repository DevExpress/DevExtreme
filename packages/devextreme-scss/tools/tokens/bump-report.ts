import { execFileSync } from 'node:child_process';
import {
  existsSync, readdirSync, readFileSync, writeFileSync,
} from 'node:fs';
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
  renderReport,
  renderTerminal,
} from './report.ts';

interface Installed { version: string; names: string[] }
interface Snapshot extends Installed { generated: Record<string, Record<string, string>> }

const here = import.meta.dirname;
const packageRoot = path.resolve(here, '..', '..');
const repoRoot = path.resolve(packageRoot, '..', '..');
const generatedRoot = path.join(packageRoot, 'scss', '_design-system');
const themeRoot = path.join(packageRoot, 'scss', 'widgets', THEME_FOLDER);
const snapshotPath = path.join(packageRoot, '.tokens-snapshot.json');
const PACKAGE = '@devexpress/design-tokens-internal';

const tokensPackage = path.join(packageRoot, 'node_modules', PACKAGE);

const relative = (file: string): string => path.relative(repoRoot, file);

const walk = (dir: string, extension: string): string[] => readdirSync(dir, {
  withFileTypes: true, recursive: true,
})
  .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
  .map((entry) => path.join(entry.parentPath, entry.name));

const readInstalled = (): Installed => {
  const { version, tokens }: { version: string; tokens: Record<string, unknown> } = JSON.parse(
    readFileSync(path.join(tokensPackage, 'tokens.flat.json'), 'utf8'),
  );

  return { version, names: Object.keys(tokens) };
};

const readGenerated = (): GeneratedOutput => new Map(walk(generatedRoot, '.scss').map((file) => [
  path.relative(generatedRoot, file),
  parseDeclarations(readFileSync(file, 'utf8')),
]));

const toSnapshot = (installed: Installed, generated: GeneratedOutput): Snapshot => ({
  ...installed,
  generated: Object.fromEntries(
    [...generated].map(([file, declarations]) => [file, Object.fromEntries(declarations)]),
  ),
});

const fromSnapshot = ({ generated }: Snapshot): GeneratedOutput => new Map(
  Object.entries(generated)
    .map(([file, declarations]) => [file, new Map(Object.entries(declarations))]),
);

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

const show = (report: Report): void => {
  process.stdout.write(interactive
    ? `\n${renderTerminal(report, { color: !plain })}`
    : `\n${renderReport(report)}`);
};

const run = (script: string, args: string[] = []): boolean => {
  const command = [script, ...args].join(' ');

  process.stderr.write(`\n$ node ${command}\n`);

  try {
    execFileSync(process.execPath, [script, ...args], { cwd: packageRoot, stdio: ['inherit', 2, 'inherit'] });

    return true;
  } catch {
    process.stderr.write(`\nnode ${command} failed — see its output above.\n`);

    return false;
  }
};

const buildTokens = (): boolean => run('build/tokens/build-tokens.ts');

const takeSnapshot = (): void => {
  if (!buildTokens()) {
    process.stderr.write('\nThe installed package does not build, so there is nothing to snapshot.\n');
    process.exit(1);
  }

  const installed = readInstalled();

  writeFileSync(snapshotPath, `${JSON.stringify(toSnapshot(installed, readGenerated()), null, 2)}\n`);
  process.stderr.write(`\n${PACKAGE} ${installed.version} (${installed.names.length} tokens) saved to `
    + `${relative(snapshotPath)}.\nNow bump the package by hand (.claude/skills/fluent-next-tier/tokens-report.md), `
    + 'then: pnpm run tokens:report\n');
};

const report = (): void => {
  const built = buildTokens();
  const snapshot: Snapshot | null = existsSync(snapshotPath)
    ? JSON.parse(readFileSync(snapshotPath, 'utf8'))
    : null;
  const after = readInstalled();
  const before: Installed = snapshot ?? after;

  if (!snapshot) {
    process.stderr.write(`\nNo ${relative(snapshotPath)}: this reports the installed package only. `
      + 'To see what a bump changed, run pnpm run tokens:snapshot before bumping.\n');
  }

  const output = snapshot && built
    ? diffGenerated(fromSnapshot(snapshot), readGenerated())
    : { changed: [], gone: [], appeared: [] };

  show({
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
    output,
  });

  if (!built) {
    process.stderr.write('\nThe token layer did not build, so the value diff above is empty: '
      + 'fix the theme reads first, then run pnpm run tokens:report again.\n');
    process.exit(1);
  }

  const registriesCurrent = run('tools/naming/derive-registries.ts', ['--check']);
  const registries = registriesCurrent ? ''
    : 'The registries are stale: after build:themes run pnpm run naming:registries and review '
      + 'tools/naming/registries.json.\n';

  process.stderr.write('\nThis rebuilt the token layer, not the themes — '
    + 'packages/devextreme/artifacts/css still holds the previous bundles.\n'
    + 'Next: pnpm nx build:themes devextreme-scss, then the etalons if any value moved.\n'
    + `${registries}`);
};

const [mode] = process.argv.slice(2);

if (mode === '--snapshot') {
  takeSnapshot();
} else if (mode === undefined) {
  report();
} else {
  process.stderr.write(`unknown argument "${mode}"\n`
    + 'usage: pnpm run tokens:snapshot   # before the bump\n'
    + '       pnpm run tokens:report     # after it\n');
  process.exit(1);
}
