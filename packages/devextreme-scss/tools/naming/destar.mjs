/*
 * Converts cross-widget `@use "../<widget>/<module>" as *` imports into namespaced ones and
 * prefixes every reference accordingly.
 *
 *   node tools/naming/destar.mjs                                # report, every folder
 *   node tools/naming/destar.mjs --apply                        # the same, written to disk
 *   node tools/naming/destar.mjs --apply --folders=toolbar,list # only these folders
 *
 * Why this has to happen before ownership work: a top-level `$x:` in a file that pulls a module in
 * with `as *` does not declare a local variable — it MUTATES that module's variable for the whole
 * compilation. So "give every widget its own variable" silently rewrites the provider until the
 * star imports are gone.
 *
 * Mixin-only imports (`../<widget>/mixins`) keep `as *` on purpose: they expose mixins, not
 * variables, and namespacing them would mean prefixing every `@include`.
 *
 * A pure de-star cannot change one byte of the compiled CSS. That is the acceptance criterion.
 */

import {
  readFileSync, writeFileSync, readdirSync, statSync, existsSync,
} from 'fs';
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
      if (!name) {
        index += 1;
      } else {
        const at = index;
        const namespaced = at > 0 && content[at - 1] === '.';
        const assignment = /^\s*:/.test(content.slice(at + name.length));
        const inSkip = skip.some(([from, to]) => at >= from && at < to);
        if (assignment && !namespaced && !inSkip && stack.every(Boolean)) names.add(name);
        index += name.length;
      }
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

    const modulePath = join(dirname(file), dirname(spec), `_${moduleName}.scss`);
    if (!modulePath.startsWith(`${themeRoot}/`)) return;

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

  const seen = new Set();
  const deduped = targets.map((target) => {
    const duplicate = seen.has(target.modulePath);
    seen.add(target.modulePath);
    return duplicate ? { ...target, drop: true, names: new Set() } : target;
  });

  return {
    file, ownFolder, original, targets: deduped,
  };
};

const rewrite = ({ file, original, targets }) => {
  if (!targets.length) return null;

  const ownDeclarations = declaredNames(file);
  const provided = new Map();
  targets.forEach(({ alias, names }) => names.forEach((name) => {
    provided.set(name, [...(provided.get(name) ?? []), alias]);
  }));

  const mutations = [...ownDeclarations].filter((name) => provided.has(name));
  const ambiguous = [...provided].filter(([, aliases]) => aliases.length > 1);
  if (mutations.length || ambiguous.length) {
    return {
      file, skipped: true, mutations, ambiguous: ambiguous.map(([name]) => name),
    };
  }

  const skip = withKeyRanges(stripComments(original));
  const skipOriginal = withKeyRanges(original);
  const inWithKeys = (position, name) => skipOriginal
    .some(([from, to]) => position >= from && position < to)
    && /^\s*:/.test(original.slice(position + name.length));

  let output = '';
  let index = 0;
  let rewritten = 0;
  let dropped = 0;

  while (index < original.length) {
    const at = index;
    const target = targets.find((candidate) => candidate.index === at);
    const char = original[at];
    const name = char === '$' ? /^\$[a-z0-9_-]+/i.exec(original.slice(at))?.[0] : null;
    const namespaced = at > 0 && original[at - 1] === '.';
    const rewritable = name && !namespaced && provided.has(name) && !inWithKeys(at, name);

    if (target && target.drop) {
      index += target.statement.length;
      if (original[index] === '\n') index += 1;
      dropped += 1;
    } else if (target) {
      output += target.statement.replace(/\bas\s+\*/, `as ${target.alias}`);
      index += target.statement.length;
    } else if (rewritable) {
      output += `${provided.get(name)[0]}.${name}`;
      index += name.length;
      rewritten += 1;
    } else {
      output += char;
      index += 1;
    }
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
