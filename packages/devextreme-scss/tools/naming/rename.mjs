/*
 * Renames theme variables to the standard, one reviewed batch at a time.
 *
 *   node tools/naming/rename.mjs --check                  # validate the whole mapping
 *   node tools/naming/rename.mjs --apply --batch=C0-toast
 *   node tools/naming/rename.mjs --residue                # no old name survives anywhere
 *
 * The mapping in tools/naming/mapping.json is HAND-AUTHORED per batch and reviewed as a diff: the
 * new name depends on which CSS property the variable feeds (a `-color` that lands in `color:`
 * becomes `content`, one that lands in `background-color` becomes `bg`), and that cannot be derived
 * from the old name. What IS automated is the guard below — the mapping is rejected before anything
 * is written if it could silently change behaviour.
 *
 * A rename cannot change one byte of the compiled CSS. That is the acceptance criterion, and
 * `tests/fluent-next-naming.test.ts` keeps the invariants enforced afterwards.
 */

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
} from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const themeRoot = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const baseRoot = join(packageRoot, 'scss', 'widgets', 'base');
const registries = JSON.parse(readFileSync(join(here, 'registries.json'), 'utf8'));
const mapping = JSON.parse(readFileSync(join(here, 'mapping.json'), 'utf8'));

const NAME_PATTERN = /^\$[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
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
  const opener = /\bwith\s*\(|@include\s+[\w.-]+\s*\(/g;
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
    const position = match.index + match[1].length;
    if (ranges.some(([from, to]) => position >= from && position < to)) return;
    names.add(`$${match[2]}`);
  });
  return names;
};

const themeFiles = walk(themeRoot);
const allFiles = [...themeFiles, ...walk(baseRoot)];

const parseKey = (key) => {
  const separator = key.indexOf(':');
  return separator < 0
    ? { folder: null, from: key }
    : { folder: key.slice(0, separator), from: key.slice(separator + 1) };
};

const entries = Object.entries(mapping.batches).flatMap(([batch, names]) => Object
  .entries(names).map(([key, to]) => ({ batch, ...parseKey(key), to })));

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

const sizeBucket = (name) => {
  if (/text-size/.test(name)) return 'font-size';
  if (/rounding/.test(name)) return 'border-radius';
  if (/text-weight/.test(name)) return 'font-weight';
  if (/font-size/.test(name)) return 'font-size';
  if (/line-height/.test(name)) return 'line-height';
  if (/blur/.test(name)) return 'spacing';
  if (/radius/.test(name)) return 'border-radius';
  if (/(^|-)border(-|$)|border-size/.test(name)) return 'border-width';
  if (/letter-spacing/.test(name)) return 'letter-spacing';
  if (/font-weight/.test(name)) return 'font-weight';
  return 'spacing';
};

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
    if (targets.has(to)) {
      problems.push(`${to}: two sources map to it (${targets.get(to)} and ${from})`);
    }
    targets.set(to, from);

    if (!NAME_PATTERN.test(to)) problems.push(`${to}: does not match the name pattern`);

    if (!ownerOf(to)) problems.push(`${to}: first segment is neither a component nor a concern`);

    const homes = [...new Set(themeFiles
      .filter((file) => declaredIn(file).has(from))
      .map((file) => file.slice(themeRoot.length + 1).split('/')[0]))];
    if (folder && homes.length && !homes.includes(folder)) {
      problems.push(`${folder}:${from}: not declared in ${folder} (found in ${homes.join(', ') || 'nowhere'})`);
    }
    if (!folder && homes.length > 1) {
      problems.push(`${from}: declared in ${homes.join(' and ')} — these are separate variables, rename them per owner`);
    }
    homes.forEach((home) => {
      const expected = registries.components[home];
      const actual = ownerOf(to);
      const systemConcern = registries.systemConcerns.includes(actual);
      if (expected && actual && actual !== expected && !systemConcern) {
        problems.push(`${to}: declared in ${home} (component ${expected}) but named for ${actual}`);
      }
    });

    const isSize = themeFiles.some((file) => file.endsWith('_sizes.scss')
      && (declaredIn(file).has(from) || declaredIn(file).has(to)));
    if (isSize && sizeBucket(from) !== sizeBucket(to)) {
      const actual = valueBucket(from) ?? valueBucket(to);
      if (actual === null) {
        problems.push(`${to}: size bucket changes ${sizeBucket(from)} -> ${sizeBucket(to)} and the value does not settle it`);
      } else if (actual === sizeBucket(from)) {
        problems.push(`${to}: size bucket changes ${sizeBucket(from)} -> ${sizeBucket(to)} while the value is on the ${actual} scale`);
      } else if (actual !== sizeBucket(to)) {
        notes.push(`${to}: value is on the ${actual} scale, neither ${sizeBucket(from)} nor ${sizeBucket(to)}`);
      }
    }

    allFiles.forEach((file) => {
      const content = stripComments(readFileSync(file, 'utf8'));
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
      const declared = declaredIn(modulePath);
      const owns = Object.entries(names)
        .some(([from, to]) => declared.has(from) || declared.has(to));
      if (owns) renamingAliases.add(alias);
    });

    while (index < original.length) {
      let rename = null;

      if (original[index] === '$') {
        const at = index;
        const name = /^\$[a-z0-9_-]+/i.exec(original.slice(at))?.[0];
        const namespaced = at > 0 && original[at - 1] === '.';
        const alias = namespaced
          ? /([a-zA-Z][\w-]*)\.$/.exec(original.slice(0, at))?.[1]
          : null;
        const target = name ? names[name] : undefined;
        const isWithKey = name
          && keyRanges.some(([from, to]) => at >= from && at < to)
          && /^\s*:/.test(original.slice(at + name.length));

        if (target && !isWithKey && (!namespaced || renamingAliases.has(alias))) {
          rename = { target, length: name.length };
        }
      }

      if (rename) {
        output += rename.target;
        index += rename.length;
        changed += 1;
      } else {
        output += original[index];
        index += 1;
      }
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

const residue = () => Object.entries(mapping.batches)
  .flatMap(([batch, names]) => Object.entries(names)
    .map(([key, to]) => ({ ...parseKey(key), to }))
    .filter(({ from, to }) => from !== to)
    .flatMap(({ folder, from }) => themeFiles
      .filter((file) => folder === null
      || file.slice(themeRoot.length + 1).split('/')[0] === folder)
      .filter((file) => {
        const content = stripComments(readFileSync(file, 'utf8'));
        const ranges = withRanges(content);
        const pattern = new RegExp(`\\${from}(?![\\w-])`, 'g');
        return [...content.matchAll(pattern)].some((match) => {
          const inWith = ranges.some(([start, end]) => match.index >= start && match.index < end);
          const isKey = /^\s*:/.test(content.slice(match.index + from.length));
          return !(inWith && isKey);
        });
      })
      .map((file) => `${batch}: ${from} still in ${file.slice(packageRoot.length + 1)}`)));

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
