/*
 * One command for a design-token package bump, and the report that goes with it.
 *
 *   pnpm run tokens:update 262.24.0   # bump, reinstall, rebuild, regenerate, report
 *   pnpm run tokens:update            # report the installed package, change nothing
 *
 * The four manual steps — edit the dependency, reinstall, rebuild the tokens, regenerate the
 * registries — are the cheap part. It stops there: the themes are not rebuilt, so the CSS bundles on
 * disk still come from the previous package until `nx build:themes` runs. The expensive part is knowing what the new package did, and that
 * is what the report is for: names the theme reads and the package no longer has (the build refuses
 * those), and every generated value that moved. The second list is the one that costs etalon
 * screenshots, so it is printed per file with old and new side by side.
 *
 * What stays manual on purpose: approving the Renovate pull request, and re-recording the etalons.
 * A bot can do neither — our etalons are pixels, and a value change has to be looked at.
 *
 * The install runs with --no-frozen-lockfile, which is the only way to move a pinned dependency, and
 * pnpm takes the opportunity to normalise the rest of the lockfile. Read that diff before committing
 * it: everything beyond this package is pnpm's housekeeping, not part of the bump.
 *
 * Everything here is file system and process; the diffing and the markdown live in report.ts, where
 * tests/tokens-report.test.ts can reach them.
 */

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
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
const PACKAGE = '@devexpress/design-tokens-internal';

/*
 * Resolved as a path, not through `require`: `require.resolve` caches the resolved filename, pnpm
 * keeps the previous version in its store, and the cached path stays readable after an install — so
 * the "after" read would quietly return the package we just replaced.
 */
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

const readGenerated = () => new Map(walk(generatedRoot, '.scss').map((file) => [
  path.relative(generatedRoot, file),
  parseDeclarations(readFileSync(file, 'utf8')),
]));

/* The token names the theme actually reads, in the spelling the package uses. */
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

/*
 * Markdown when the output is going somewhere — a file, a pipe, a pull request — and the terminal
 * view when a person is watching. NO_COLOR is the usual opt-out.
 */
const interactive = process.stdout.isTTY === true;
const color = interactive && !process.env.NO_COLOR;

const show = (report) => {
  process.stdout.write(interactive
    ? `\n${renderTerminal(report, { color })}`
    : `\n${renderReport(report)}`);
};

const run = (command, args, cwd) => {
  process.stdout.write(`\n$ ${command} ${args.join(' ')}\n`);

  try {
    execFileSync(command, args, { cwd, stdio: 'inherit' });

    return true;
  } catch {
    process.stderr.write(`\n${command} ${args.join(' ')} failed — see its output above.\n`);

    return false;
  }
};

const setDependency = (version) => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  manifest.devDependencies[PACKAGE] = version;
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
};

// ---------------------------------------------------------------------------------------------

const [target] = process.argv.slice(2);

/*
 * No argument reports and changes nothing: that is the answer to "what is installed and what does
 * the theme do with it", and it is what someone typing the command without reading it deserves to
 * get. A bump has to be asked for by version.
 */
const reportOnly = target === undefined || target === '--report';

if (!reportOnly && !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(target)) {
  process.stderr.write(`"${target}" is not a version\n`
    + 'usage: pnpm run tokens:update [<version>]   # without a version: report only\n');
  process.exit(1);
}
const before = { ...readFlatTokens(), generated: readGenerated() };

/* Every step that can fail leaves the tree somewhere; each of them says where, and stops. */
const giveUp = (version) => {
  process.stderr.write(`\npackage.json asks for ${version} now.\n`
    + `To go back: pnpm run tokens:update ${before.version}\n`);
  process.exit(1);
};

if (!reportOnly) {
  setDependency(target);

  if (!run('pnpm', ['install', '--no-frozen-lockfile'], repoRoot)) {
    giveUp(target);
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
  /*
   * Said before the rebuild, because the rebuild is what stops on a missing name — and it stops at
   * the first one, having never looked for the others.
   */
  process.stdout.write(`\n${renderPreamble(summary, { color })}\n`);

  const rebuilt = run('node', ['build/tokens/build-tokens.mjs'], packageRoot)
    && run('node', ['tools/naming/derive-registries.mjs'], packageRoot);

  if (!rebuilt) {
    giveUp(after.version);
  }
}

const report = { ...summary, output: diffGenerated(before.generated, readGenerated()) };

show(report);

if (!reportOnly) {
  process.stdout.write('\nThis rebuilt the token layer, not the themes — '
    + 'packages/devextreme/artifacts/css still holds the previous bundles.\n'
    + 'Next: pnpm nx build:themes devextreme-scss, then the etalons if any value moved.\n'
    + `\nCheck \`git diff pnpm-lock.yaml\`: anything in it beyond ${PACKAGE} is pnpm normalising `
    + 'the lockfile, not this bump.\n');
}
