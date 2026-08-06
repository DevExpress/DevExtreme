/*
 * Wave A of the naming standard (scss/widgets/fluent-next/NAMING.md, rule O3/O8): converts
 * cross-widget `@use "../<widget>/<module>" as *` imports into namespaced ones and prefixes every
 * reference accordingly.
 *
 *   node tools/naming/destar.mjs --list                    # what would change, per folder
 *   node tools/naming/destar.mjs --apply --folders=toolbar,list
 *   node tools/naming/destar.mjs --apply --all
 *
 * Why this has to happen before ownership work: a top-level `$x:` in a file that pulls a module in
 * with `as *` does not declare a local variable — it MUTATES that module's variable for the whole
 * compilation. So "give every widget its own variable" silently rewrites the provider until the
 * star imports are gone. See NAMING.md, O8.
 *
 * Mixin-only imports (`../<widget>/mixins`) keep `as *` on purpose: they expose mixins, not
 * variables, and namespacing them would mean prefixing every `@include`.
 *
 * A pure de-star cannot change one byte of the compiled CSS. That is the acceptance criterion.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const themeRoot = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const registries = JSON.parse(readFileSync(join(here, 'registries.json'), 'utf8'));

const VARIABLE_MODULES = ['colors', 'sizes', 'variables'];
const exemptFolders = Object.keys(registries.exemptFolders);

const walk = (dir) => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
}).filter((file) => file.endsWith('.scss'));

const stripComments = (content) => content
  .replace(/\/\/[^\n\r]*/g, '')
  .split(/\/\*|\*\//)
  .filter((_, index) => index % 2 === 0)
  .join('');

/** Ranges of `with ( … )` argument lists: their left-hand sides are the base module's parameters. */
const withKeyRanges = (content) => {
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

/** Module-level `$x:` declarations — `@if`/`@each` do not create scope, mixins and rules do. */
const declaredNames = (file) => {
  const content = stripComments(readFileSync(file, 'utf8'));
  const skip = withKeyRanges(content);
  const names = new Set();
  const stack = [];
  let index = 0;

  while (index < content.length) {
    const char = content[index];
    if (char === '{') {
      const before = content.slice(Math.max(0, index - 200), index);
      stack.push(/@(if|else|each|for|while)\b[^{]*$/.test(before));
      index += 1;
    } else if (char === '}') {
      stack.pop();
      index += 1;
    } else if (char === '$') {
      const name = /^\$[a-z0-9_-]+/i.exec(content.slice(index))?.[0];
      if (!name) { index += 1; continue; }
      const namespaced = index > 0 && content[index - 1] === '.';
      const assignment = /^\s*:/.test(content.slice(index + name.length));
      const inSkip = skip.some(([from, to]) => index >= from && index < to);
      if (assignment && !namespaced && !inSkip && stack.every(Boolean)) names.add(name);
      index += name.length;
    } else {
      index += 1;
    }
  }
  return names;
};

const aliasFor = (folder, moduleName) => folder + moduleName[0].toUpperCase() + moduleName.slice(1);

const analyse = (file) => {
  const original = readFileSync(file, 'utf8');
  const ownFolder = file.slice(themeRoot.length + 1).split('/')[0];
  const uses = [...original.matchAll(/@use\s+(["'])([^"']+)\1([^;{]*);/g)];

  const targets = [];
  uses.forEach((use) => {
    const [statement, , spec, tail] = use;
    if (!/\bas\s+\*/.test(tail)) return;

    const moduleName = basename(spec);
    if (!VARIABLE_MODULES.includes(moduleName)) return;

    // Specs are relative to the importing FILE, and widgets like tabs/ have nested folders, so the
    // module path cannot be assumed to sit one level under the theme root.
    const modulePath = join(dirname(file), dirname(spec), `_${moduleName}.scss`);
    if (!modulePath.startsWith(`${themeRoot}/`)) return;

    // A module sitting directly in the theme root (`../sizes`, `../colors`) is the theme-level
    // layer — theme identity plus the cross-cutting values. It is not a widget and keeps `as *`.
    if (dirname(modulePath) === themeRoot) return;

    const folder = modulePath.slice(themeRoot.length + 1).split('/')[0];
    if (folder === ownFolder || registries.systemFolders.includes(folder)) return;
    if (!existsSync(modulePath)) return;

    targets.push({
      statement,
      index: use.index,
      spec,
      modulePath,
      folder,
      moduleName,
      alias: aliasFor(folder, moduleName),
      names: declaredNames(modulePath),
    });
  });

  // The same module can be imported twice in one file (diagram/_index.scss imports ../fieldset/sizes
  // on two consecutive lines). A repeated `@use … as *` of the same module is a no-op, and it cannot
  // be namespaced twice under one alias, so the duplicate is dropped. Counting its names twice would
  // also make every one of them look like it came from two different providers.
  const seen = new Set();
  targets.forEach((target) => {
    if (seen.has(target.modulePath)) {
      target.drop = true;
      target.names = new Set();
    }
    seen.add(target.modulePath);
  });

  return { file, ownFolder, original, targets };
};

const rewrite = ({ file, original, targets }) => {
  if (!targets.length) return null;

  const ownDeclarations = declaredNames(file);
  const provided = new Map(); // name -> [alias]
  targets.forEach(({ alias, names }) => names.forEach((name) => {
    provided.set(name, [...(provided.get(name) ?? []), alias]);
  }));

  // A name this file declares at top level while a de-starred module also declares it is the silent
  // mutation case: today the assignment rewrites the provider's variable. De-starring changes that,
  // so it is not a pure rename and must be looked at by hand.
  const mutations = [...ownDeclarations].filter((name) => provided.has(name));
  const ambiguous = [...provided].filter(([, aliases]) => aliases.length > 1);
  if (mutations.length || ambiguous.length) {
    return { file, skipped: true, mutations, ambiguous: ambiguous.map(([name]) => name) };
  }

  const skip = withKeyRanges(stripComments(original));
  // ranges are computed on stripped content; recompute on the original so offsets line up
  const skipOriginal = withKeyRanges(original);
  const inWithKeys = (position, name) => skipOriginal
    .some(([from, to]) => position >= from && position < to)
    && /^\s*:/.test(original.slice(position + name.length));

  let output = '';
  let index = 0;
  let rewritten = 0;
  let dropped = 0;

  while (index < original.length) {
    const target = targets.find((candidate) => candidate.index === index);
    if (target) {
      if (target.drop) {
        index += target.statement.length;
        if (original[index] === '\n') index += 1; // do not leave a blank line behind
        dropped += 1;
      } else {
        output += target.statement.replace(/\bas\s+\*/, `as ${target.alias}`);
        index += target.statement.length;
      }
      continue;
    }

    const char = original[index];
    if (char === '$') {
      const name = /^\$[a-z0-9_-]+/i.exec(original.slice(index))?.[0];
      const namespaced = index > 0 && original[index - 1] === '.';
      if (name && !namespaced && provided.has(name) && !inWithKeys(index, name)) {
        output += `${provided.get(name)[0]}.${name}`;
        index += name.length;
        rewritten += 1;
        continue;
      }
    }

    output += char;
    index += 1;
  }

  return {
    file, output, rewritten, dropped, imports: targets.length, skipped: false, skip: skip.length,
  };
};

const selected = () => {
  const folders = process.argv.find((argument) => argument.startsWith('--folders='))
    ?.slice('--folders='.length).split(',').filter(Boolean);
  return walk(themeRoot).filter((file) => {
    const folder = file.slice(themeRoot.length + 1).split('/')[0];
    if (exemptFolders.includes(folder)) return false;
    return !folders || folders.includes(folder);
  });
};

const results = selected().map(analyse).map(rewrite).filter(Boolean);
const apply = process.argv.includes('--apply');
let changed = 0;
let touchedReferences = 0;

results.forEach((result) => {
  const relative = result.file.slice(themeRoot.length + 1);
  if (result.skipped) {
    process.stdout.write(`SKIP ${relative}\n`);
    if (result.mutations.length) {
      process.stdout.write(`     declares a name its star-imported module also declares: ${result.mutations.join(', ')}\n`);
    }
    if (result.ambiguous.length) {
      process.stdout.write(`     provided by more than one module: ${result.ambiguous.join(', ')}\n`);
    }
    return;
  }
  changed += 1;
  touchedReferences += result.rewritten;
  const duplicates = result.dropped ? `, ${result.dropped} duplicate import(s) dropped` : '';
  process.stdout.write(`${apply ? 'WRITE' : 'PLAN '} ${relative}: ${result.imports} import(s), ${result.rewritten} reference(s)${duplicates}\n`);
  if (apply) writeFileSync(result.file, result.output);
});

process.stdout.write(`\n${apply ? 'rewrote' : 'would rewrite'} ${changed} file(s), ${touchedReferences} reference(s)\n`);
if (!apply) process.stdout.write('run again with --apply to write\n');
