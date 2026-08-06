/*
 * Wave C of the naming standard (scss/widgets/fluent-next/NAMING.md): renames theme variables to the
 * standard, one reviewed batch at a time.
 *
 *   node tools/naming/rename.mjs --check                  # validate the whole mapping
 *   node tools/naming/rename.mjs --apply --batch=C0-toast
 *   node tools/naming/rename.mjs --residue                # no old name survives anywhere
 *
 * The mapping in tools/naming/mapping.json is HAND-AUTHORED per batch and reviewed as a diff: the new
 * name depends on which CSS property the variable feeds (a `-color` that lands in `color:` becomes
 * `content`, one that lands in `background-color` becomes `bg`), and that cannot be derived from the
 * old name. What IS automated is the guard below — the mapping is rejected before anything is written
 * if it could silently change behaviour.
 *
 * A rename cannot change one byte of the compiled CSS. That is the acceptance criterion, and
 * `tests/fluent-next-naming.test.ts` keeps the invariants enforced afterwards.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const themeRoot = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const baseRoot = join(packageRoot, 'scss', 'widgets', 'base');
const registries = JSON.parse(readFileSync(join(here, 'registries.json'), 'utf8'));
const mapping = JSON.parse(readFileSync(join(here, 'mapping.json'), 'utf8'));

const NAME_PATTERN = /^\$[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
/* A variable name can be a prefix of another ($toast-info-bg vs $toast-info-bg-rest), so `\b` is
 * not a boundary here: after `bg` comes `-`, which `\b` happily matches. */
const occurrence = (name) => new RegExp(`\\${name}(?![\\w-])`);

const walk = (dir) => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
}).filter((file) => file.endsWith('.scss'));

const stripComments = (content) => content
  .replace(/\/\/[^\n\r]*/g, '')
  .split(/\/\*|\*\//)
  .filter((_, index) => index % 2 === 0)
  .join('');

const withRanges = (content) => {
  const ranges = [];
  const opener = /\bwith\s*\(/g;
  let match = opener.exec(content);
  while (match !== null) {
    let depth = 1;
    let index = match.index + match[0].length;
    while (index < content.length && depth > 0) {
      if (content[index] === '(') depth += 1;
      if (content[index] === ')') depth -= 1;
      index += 1;
    }
    ranges.push([match.index, index]);
    match = opener.exec(content);
  }
  return ranges;
};

const declaredIn = (file) => {
  const content = stripComments(readFileSync(file, 'utf8'));
  const ranges = withRanges(content);
  const names = new Set();
  [...content.matchAll(/(^|[\s{;])\$([a-z0-9_-]+)\s*:/gi)].forEach((match) => {
    // A `with()` left-hand side is the configured module's parameter, not a declaration here.
    const position = match.index + match[1].length;
    if (ranges.some(([from, to]) => position >= from && position < to)) return;
    names.add(`$${match[2]}`);
  });
  return names;
};

const themeFiles = walk(themeRoot);
const allFiles = [...themeFiles, ...walk(baseRoot)];

/*
 * A mapping key is either `$name` or `<folder>:$name`. The qualified form exists because two folders
 * can declare the same name as separate variables (dataGrid and pivotGrid both had
 * `$area-field-border-radius`), and one JSON object cannot hold that name twice. A qualified entry is
 * confined to its folder; an unqualified one is refused by the guard if more than one folder declares
 * the name.
 */
const parseKey = (key) => {
  const separator = key.indexOf(':');
  return separator < 0
    ? { folder: null, from: key }
    : { folder: key.slice(0, separator), from: key.slice(separator + 1) };
};

const entries = Object.entries(mapping.batches).flatMap(([batch, names]) => Object
  .entries(names).map(([key, to]) => ({ batch, ...parseKey(key), to })));

// ---------------------------------------------------------------------------------------------
// guard
// ---------------------------------------------------------------------------------------------

/** Names visible in a file through `@use … as *`, i.e. the scope a new name could collide with. */
const starVisibleNames = (file) => {
  const content = stripComments(readFileSync(file, 'utf8'));
  const names = new Set();
  [...content.matchAll(/@use\s+(["'])([^"']+)\1([^;{]*)/g)].forEach(([, , spec, tail]) => {
    if (!/\bas\s+\*/.test(tail)) return;
    const candidates = [
      join(dirname(file), dirname(spec), `_${basename(spec)}.scss`),
      join(dirname(file), dirname(spec), basename(spec), '_index.scss'),
    ];
    const modulePath = candidates.find((candidate) => existsSync(candidate));
    if (modulePath) declaredIn(modulePath).forEach((name) => names.add(name));
  });
  return names;
};

/** The scale a size variable lands on under SIZES_MIGRATION_PLAN.md's name heuristic. */
const sizeBucket = (name) => {
  // Legacy spellings first: `text-size` MEANS font-size (rejected.properties maps it there), and
  // reading it as spacing would make an honest rename look like a scale change.
  if (/text-size/.test(name)) return 'font-size';
  if (/rounding/.test(name)) return 'border-radius';
  if (/text-weight/.test(name)) return 'font-weight';
  if (/font-size/.test(name)) return 'font-size';
  if (/line-height/.test(name)) return 'line-height';
  // "blur radius" is the CSS term for a shadow's blur length and has nothing to do with corners.
  if (/blur/.test(name)) return 'spacing';
  if (/radius/.test(name)) return 'border-radius';
  if (/border.*width|border-size/.test(name)) return 'border-width';
  if (/letter-spacing/.test(name)) return 'letter-spacing';
  if (/font-weight/.test(name)) return 'font-weight';
  return 'spacing';
};

/*
 * The design token(s) a theme variable is actually declared with, across every `@if $size` branch.
 * Used to settle a disagreement between the old and the new name about which scale a value is on:
 * the value itself is the only party to that argument that cannot be wrong.
 */
const valueBucket = (name) => {
  const buckets = new Set();
  themeFiles.forEach((file) => {
    const content = stripComments(readFileSync(file, 'utf8'));
    [...content.matchAll(new RegExp(`(^|[\\s{;])\\${name}\\s*:([^;]*);`, 'gm'))]
      .forEach((match) => [...match[2].matchAll(/ds\.\$([a-z0-9-]+)/g)]
        .forEach(([, token]) => buckets.add(sizeBucket(`$${token}`))));
  });
  return buckets.size === 1 ? [...buckets][0] : null;
};

const componentNames = [...new Set(Object.values(registries.components))]
  .sort((a, b) => b.length - a.length);

const ownerOf = (name) => componentNames
  .find((component) => name.slice(1) === component || name.slice(1).startsWith(`${component}-`))
  ?? registries.systemConcerns.find((concern) => name.slice(1).startsWith(`${concern}-`))
  ?? null;

const notes = [];

const guard = () => {
  const problems = [];
  const renamedAway = new Set(entries.map(({ from }) => from));
  const targets = new Map();

  entries.forEach(({
    batch, folder, from, to,
  }) => {
    // 1. the mapping must be injective
    if (targets.has(to)) {
      problems.push(`${to}: two sources map to it (${targets.get(to)} and ${from})`);
    }
    targets.set(to, from);

    // 2. the new name must be legal for stylelint
    if (!NAME_PATTERN.test(to)) problems.push(`${to}: does not match the name pattern`);

    // 3. the new name must belong to the owner's namespace…
    if (!ownerOf(to)) problems.push(`${to}: first segment is neither a component nor a concern`);

    /*
     * …and specifically to the component of the folder that declares the old name (rule O1), so a
     * batch cannot quietly move a variable into another component's namespace.
     *
     * Every folder that declares the old name has to be checked, not the first one found. Two folders
     * can hold same-named, independent variables with DIFFERENT values — dataGrid and pivotGrid both
     * declared `$area-field-top-bottom-padding`, spacing-20 against spacing-10 in compact — and one
     * rename then drags the second folder's variable into the first one's namespace. Caught only
     * after the fact by a `git diff` showing files the batch had no business touching.
     */
    const homes = [...new Set(themeFiles
      .filter((file) => declaredIn(file).has(from))
      .map((file) => file.slice(themeRoot.length + 1).split('/')[0]))];
    if (folder && homes.length && !homes.includes(folder)) {
      problems.push(`${folder}:${from}: not declared in ${folder} (found in ${homes.join(', ') || 'nowhere'})`);
    }
    if (!folder && homes.length > 1) {
      problems.push(`${from}: declared in ${homes.join(' and ')} — these are separate variables, rename them per owner`);
    }
    homes.forEach((folder) => {
      const expected = registries.components[folder];
      const actual = ownerOf(to);
      if (expected && actual && actual !== expected && !registries.systemConcerns.includes(actual)) {
        problems.push(`${to}: declared in ${folder} (component ${expected}) but named for ${actual}`);
      }
    });

    // 4. the scale a size variable lands on must not change. The heuristic is name-driven, so a
    //    disagreement means one of the two names lies about the value — and a rename never touches
    //    values. Ask the tokens the value is built from: if they agree with the NEW name, the old
    //    name was the liar and the rename fixes it; anything else is a real problem.
    if (sizeBucket(from) !== sizeBucket(to)) {
      // Old name before the batch is applied, new name after it: `--check` has to give the same
      // verdict either side of `--apply`, or a re-run turns a landed batch red.
      const actual = valueBucket(from) ?? valueBucket(to);
      if (actual === null) {
        problems.push(`${to}: size bucket changes ${sizeBucket(from)} -> ${sizeBucket(to)} and the value does not settle it`);
      } else if (actual === sizeBucket(from)) {
        problems.push(`${to}: size bucket changes ${sizeBucket(from)} -> ${sizeBucket(to)} while the value is on the ${actual} scale`);
      } else if (actual !== sizeBucket(to)) {
        // The value agrees with NEITHER name, so it was already on the wrong scale before this
        // rename. That is a token-mapping question for DIVERGENCES.md, not something a rename can
        // cause or fix, and blocking on it would mean the old lie has to be preserved.
        notes.push(`${to}: value is on the ${actual} scale, neither ${sizeBucket(from)} nor ${sizeBucket(to)}`);
      }
    }

    // 5. the new name must be free everywhere, and 6. invisible to any `as *` scope that sees the
    //    old one — otherwise the declaration would silently mutate or lose to a foreign module
    allFiles.forEach((file) => {
      const content = stripComments(readFileSync(file, 'utf8'));
      /*
       * An occurrence of the old name in a `with()` KEY position is not an occurrence of ours: that is
       * the base module's parameter, which this rename must not touch. Counting it made checks 5 and 6
       * fire on 60 already-applied names — the file still mentioned the old spelling as a with() key,
       * and the NEW name was "visible via `as *`" simply because the folder star-imports its own
       * _colors.scss, which is how a widget reads its own variables.
       */
      const keyRanges = withRanges(content);
      const real = [...content.matchAll(new RegExp(`\\${from}(?![\\w-])`, 'g'))].some((match) => {
        const inWith = keyRanges.some(([start, end]) => match.index >= start && match.index < end);
        const isKey = /^\s*:/.test(content.slice(match.index + from.length));
        return !(inWith && isKey);
      });
      if (!real) return;
      if (declaredIn(file).has(to) && !renamedAway.has(to)) {
        problems.push(`${to}: already declared in ${file.slice(packageRoot.length + 1)}`);
      }
      const visible = starVisibleNames(file);
      if (visible.has(to) && !renamedAway.has(to)) {
        problems.push(`${to}: visible via \`as *\` in ${file.slice(packageRoot.length + 1)}`);
      }
    });

    if (!batch) problems.push(`${from}: no batch`);
  });

  /*
   * A theme variable is ALLOWED to share its name with the base parameter it configures — 553 names
   * already do, and it is what `with($x: $x)` looks like once the theme prefix is gone. It only turns
   * dangerous when the same file ALSO pulls that base module in with `as *`, because then the two
   * names live in one scope and the declaration either mutates base's variable or loses to it.
   * Check 6 above catches exactly that case; a blanket "must differ from any base name" rule would
   * instead force unusable names on the whole rename.
   */
  themeFiles.forEach((file) => {
    const content = stripComments(readFileSync(file, 'utf8'));
    const starredBaseModules = [...content.matchAll(/@use\s+(["'])([^"']+)\1([^;{]*)/g)]
      .filter(([, , spec, tail]) => spec.includes('base/') && /\bas\s+\*/.test(tail))
      .map(([, , spec]) => spec);
    if (!starredBaseModules.length) return;

    starredBaseModules.forEach((spec) => {
      const candidates = [
        join(dirname(file), dirname(spec), `_${basename(spec)}.scss`),
        join(dirname(file), dirname(spec), basename(spec), '_index.scss'),
      ];
      const modulePath = candidates.find((candidate) => existsSync(candidate));
      if (!modulePath) return;
      const parameters = declaredIn(modulePath);
      entries.forEach(({ to }) => {
        if (parameters.has(to) && occurrence(to).test(content)) {
          problems.push(`${to}: equals a parameter of ${spec}, which ${file.slice(packageRoot.length + 1)} imports with \`as *\``);
        }
      });
    });
  });

  return problems;
};

// ---------------------------------------------------------------------------------------------
// apply
// ---------------------------------------------------------------------------------------------

const applyBatch = (batch) => {
  const raw = mapping.batches[batch];
  if (!raw) throw new Error(`unknown batch ${batch}; known: ${Object.keys(mapping.batches)}`);

  let touchedFiles = 0;
  let touchedNames = 0;

  themeFiles.forEach((file) => {
    const ownFolder = file.slice(themeRoot.length + 1).split('/')[0];
    const names = Object.fromEntries(Object.entries(raw)
      .map(([key, to]) => [parseKey(key), to])
      .filter(([{ folder }]) => folder === null || folder === ownFolder)
      .map(([{ from }, to]) => [from, to]));
    if (!Object.keys(names).length) return;
    const original = readFileSync(file, 'utf8');
    const keyRanges = withRanges(original);
    let output = '';
    let index = 0;
    let changed = 0;

    // Aliases that resolve to a module declaring one of the renamed names. After wave A every
    // cross-widget read is `alias.$name`, and skipping those leaves the reference pointing at a name
    // that no longer exists — the build then fails with "Undefined variable", or worse, a stale
    // artifact makes a byte-comparison look clean.
    const renamingAliases = new Set();
    [...original.matchAll(/@use\s+(["'])([^"']+)\1([^;{]*)/g)].forEach(([, , spec, tail]) => {
      const alias = /\bas\s+([a-zA-Z][\w-]*)/.exec(tail)?.[1];
      if (!alias) return;
      const candidates = [
        join(dirname(file), dirname(spec), `_${basename(spec)}.scss`),
        join(dirname(file), dirname(spec), basename(spec), '_index.scss'),
      ];
      const modulePath = candidates.find((candidate) => existsSync(candidate));
      if (!modulePath) return;
      // Old AND new names: a batch can be half-applied (the owning module renamed, the namespaced
      // readers not yet), and then the old names are already gone from the module.
      const declared = declaredIn(modulePath);
      const owns = Object.entries(names)
        .some(([from, to]) => declared.has(from) || declared.has(to));
      if (owns) renamingAliases.add(alias);
    });

    while (index < original.length) {
      if (original[index] === '$') {
        const name = /^\$[a-z0-9_-]+/i.exec(original.slice(index))?.[0];
        const namespaced = index > 0 && original[index - 1] === '.';
        const alias = namespaced
          ? /([a-zA-Z][\w-]*)\.$/.exec(original.slice(0, index))?.[1]
          : null;
        const target = name ? names[name] : undefined;
        // a `with()` KEY is the base module's parameter name and must keep its spelling
        const isWithKey = keyRanges.some(([from, to]) => index >= from && index < to)
          && /^\s*:/.test(original.slice(index + (name?.length ?? 0)));

        if (target && !isWithKey && (!namespaced || renamingAliases.has(alias))) {
          output += target;
          index += name.length;
          changed += 1;
          continue;
        }
      }
      output += original[index];
      index += 1;
    }

    if (changed) {
      writeFileSync(file, output);
      touchedFiles += 1;
      touchedNames += changed;
      process.stdout.write(`  ${file.slice(themeRoot.length + 1)}: ${changed} occurrence(s)\n`);
    }
  });

  process.stdout.write(`\nbatch ${batch}: ${touchedFiles} file(s), ${touchedNames} occurrence(s)\n`);
};

/*
 * Only the theme is in scope. `base/**` may legitimately contain the same spelling — sometimes as a
 * parameter this theme configures, sometimes as a mixin argument that has nothing to do with us
 * (base/_speedDialAction.scss takes $button-default-bg as a mixin parameter). Scanning base here
 * produced false survivors that no amount of renaming could ever clear.
 */
const residue = () => Object.entries(mapping.batches).flatMap(([batch, names]) => Object.entries(names)
  .map(([key, to]) => ({ ...parseKey(key), to }))
  // An identity entry ("already correct, recorded for the record") can never disappear.
  .filter(({ from, to }) => from !== to)
  .flatMap(({ folder, from }) => themeFiles
    .filter((file) => folder === null
      || file.slice(themeRoot.length + 1).split('/')[0] === folder)
    .filter((file) => {
      const content = stripComments(readFileSync(file, 'utf8'));
      const ranges = withRanges(content);
      const pattern = new RegExp(`\\${from}(?![\\w-])`, 'g');
      // A surviving occurrence in a `with()` KEY position is not a survivor: that is the base
      // module's parameter name, which this rename must not touch (dataGrid/treeList/pivotGrid
      // configure base with $datagrid-* keys).
      return [...content.matchAll(pattern)].some((match) => {
        const inWith = ranges.some(([start, end]) => match.index >= start && match.index < end);
        const isKey = /^\s*:/.test(content.slice(match.index + from.length));
        return !(inWith && isKey);
      });
    })
    .map((file) => `${batch}: ${from} still in ${file.slice(packageRoot.length + 1)}`)));

// ---------------------------------------------------------------------------------------------

const batchArgument = process.argv.find((argument) => argument.startsWith('--batch='))
  ?.slice('--batch='.length);

if (process.argv.includes('--check')) {
  const problems = guard();
  problems.forEach((problem) => process.stderr.write(`  ${problem}\n`));
  notes.forEach((note) => process.stdout.write(`  NOTE  ${note}\n`));
  process.stdout.write(`${entries.length} mapped name(s), ${problems.length} problem(s), ${notes.length} note(s)\n`);
  process.exit(problems.length ? 1 : 0);
} else if (process.argv.includes('--residue')) {
  const left = residue();
  left.forEach((entry) => process.stderr.write(`  ${entry}\n`));
  process.stdout.write(`${left.length} surviving old name(s)\n`);
  process.exit(left.length ? 1 : 0);
} else if (process.argv.includes('--apply')) {
  const problems = guard();
  if (problems.length) {
    problems.forEach((problem) => process.stderr.write(`  ${problem}\n`));
    process.stderr.write('guard failed, nothing written\n');
    process.exit(1);
  }
  applyBatch(batchArgument);
} else {
  process.stdout.write('usage: --check | --apply --batch=<name> | --residue\n');
}
