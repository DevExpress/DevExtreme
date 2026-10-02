/*
 * One command for a design-token package bump, and the report that goes with it.
 *
 *   pnpm run tokens:update 262.24.0   # bump, reinstall, rebuild, check, report
 *   pnpm run tokens:update            # report the installed package, change nothing
 *   pnpm run tokens:update --report   # the same, stated explicitly
 *
 * The manual steps — edit the dependency and its minimumReleaseAgeExclude entry, reinstall, rebuild
 * the tokens — are the cheap part. It stops there: the themes are not rebuilt, so the CSS bundles
 * on disk still come from the previous package until `nx build:themes` runs, and the registries are
 * only checked, because their rootSelectors gate reads those bundles. The expensive part is
 * knowing what the new package did, and that is what the report is for: names the theme reads and
 * the package no longer has (the build refuses those), and every generated value that moved. The
 * second list is the one that costs etalon screenshots, so it is printed per file with old and new
 * side by side.
 *
 * What stays manual on purpose: approving the Renovate pull request, and re-recording the etalons.
 * A bot can do neither — our etalons are pixels, and a value change has to be looked at.
 *
 * A failed bump puts back what it touched — package.json, pnpm-workspace.yaml, pnpm-lock.yaml and
 * the generated token layer — so the tree is where it was, short of node_modules.
 *
 * The install runs with --no-frozen-lockfile, which is the only way to move a pinned dependency,
 * and pnpm takes the opportunity to normalise the rest of the lockfile. Read that diff before
 * committing it: everything beyond this package is pnpm's housekeeping, not part of the bump.
 *
 * Everything here is file system and process; the diffing and the markdown live in report.ts, where
 * tests/tokens-report.test.ts can reach them.
 */

import { execFileSync } from 'node:child_process';
import {
  cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getBridgeFiles, THEME_FOLDER } from '../../build/tokens/sources.mjs';
import {
  buildAvailableNames,
  collectCustomPropertyReferences,
  collectTokenReferences,
} from '../../build/tokens/consumed-tokens.ts';
import {
  diffGenerated,
  diffNames,
  findLostConsumed,
  parseDeclarations,
  renderPreamble,
  renderReport,
  renderTerminal,
} from './report.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, '..', '..');
const repoRoot = path.resolve(packageRoot, '..', '..');
const generatedRoot = path.join(packageRoot, 'scss', '_design-system');
const themeRoot = path.join(packageRoot, 'scss', 'widgets', THEME_FOLDER);
const manifestPath = path.join(packageRoot, 'package.json');
const workspacePath = path.join(repoRoot, 'pnpm-workspace.yaml');
const lockPath = path.join(repoRoot, 'pnpm-lock.yaml');
const PACKAGE = '@devexpress/design-tokens-internal';

const tokensPackage = path.join(packageRoot, 'node_modules', PACKAGE);

const walk = (dir, extension) => readdirSync(dir, { withFileTypes: true, recursive: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
  .map((entry) => path.join(entry.parentPath, entry.name));

const readFlatTokens = () => {
  const { version, tokens } = JSON.parse(
    readFileSync(path.join(tokensPackage, 'tokens.flat.json'), 'utf8'),
  );

  return { version, names: Object.keys(tokens) };
};

let notedUnbuilt = false;
const readGenerated = () => {
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

const readConsumed = () => {
  const consumed = new Set();

  walk(themeRoot, '.scss').forEach((file) => {
    const content = readFileSync(file, 'utf8');
    const source = path.relative(themeRoot, file);

    collectTokenReferences(content, source).forEach((name) => consumed.add(name));
    collectCustomPropertyReferences(content, source).forEach((name) => consumed.add(name));
  });

  return consumed;
};

const plain = Boolean(process.env.NO_COLOR);
const interactive = process.stdout.isTTY === true;
const color = interactive && !plain;

const progressColor = process.stderr.isTTY === true && !plain;

const show = (report) => {
  process.stdout.write(interactive
    ? `\n${renderTerminal(report, { color })}`
    : `\n${renderReport(report)}`);
};

/*
 * Neither binary is looked up on PATH: `node` is this very process, and `pnpm run` hands its own
 * entry point in npm_execpath. On Windows `pnpm` on PATH is pnpm.cmd, which execFile cannot start
 * without a shell.
 */
const executable = (command) => {
  if (command === 'node') return [process.execPath, []];
  const pnpm = process.env.npm_execpath;
  if (!pnpm) return [command, []];
  const entry = realpathSync(pnpm);
  return /\.[cm]?js$/.test(entry) ? [process.execPath, [entry]] : [entry, []];
};

const run = (command, args, cwd) => {
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

// pnpm refuses a release younger than minimumReleaseAge, so the bump carries its own exclusion
const withReleaseAgeExclusion = (yaml, version) => {
  const entry = `"${PACKAGE}@${version}"`;
  const existing = new RegExp(`(['"])${PACKAGE.replace(/[/.]/g, '\\$&')}@[^'"]+\\1`);
  if (existing.test(yaml)) return yaml.replace(existing, entry);
  if (!/^minimumReleaseAgeExclude:\n/m.test(yaml)) {
    throw new Error('pnpm-workspace.yaml has no minimumReleaseAgeExclude list to add the package to');
  }
  return yaml.replace(/^minimumReleaseAgeExclude:\n/m, (key) => `${key}  - ${entry}\n`);
};

const setDependency = (version) => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  manifest.devDependencies[PACKAGE] = version;
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(workspacePath, withReleaseAgeExclusion(readFileSync(workspacePath, 'utf8'), version));
};

const snapshot = () => {
  const files = new Map([manifestPath, workspacePath, lockPath]
    .map((file) => [file, readFileSync(file, 'utf8')]));
  const generated = existsSync(generatedRoot)
    ? path.join(mkdtempSync(path.join(os.tmpdir(), 'tokens-update-')), 'generated')
    : null;
  if (generated) cpSync(generatedRoot, generated, { recursive: true });
  return { files, generated };
};

const restore = ({ files, generated }) => {
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

const giveUp = () => {
  restore(saved);
  process.stderr.write('\nThe bump failed and was rolled back: package.json, pnpm-workspace.yaml, '
    + `pnpm-lock.yaml and the token layer are as they were (${before.version}).\n`
    + 'node_modules may still hold the new package: pnpm install --frozen-lockfile\n');
  process.exit(1);
};

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

  if (!run('node', ['build/tokens/build-tokens.mjs'], packageRoot)) {
    giveUp();
  }
}

// read-only: the write mode would gate rootSelectors against bundles built from the old package
const registriesCurrent = reportOnly
  || run('node', ['tools/naming/derive-registries.mjs', '--check'], packageRoot);

const report = { ...summary, output: diffGenerated(before.generated, readGenerated()) };

show(report);

// what the package now says about the theme's roles, against the banked decisions
run('node', ['tools/review/roles.mjs', '--report=tools/review/roles.decisions.json'], packageRoot);

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
