/*
 * Wave B of the naming standard (scss/widgets/fluent-next/NAMING.md, rule O6): removes dead imports
 * and dead variables from the theme.
 *
 *   node tools/naming/prune.mjs              # report
 *   node tools/naming/prune.mjs --apply
 *
 * Three classes, all provably output-neutral:
 *
 *   1. a namespaced import of a VARIABLE module (`colors`/`sizes`/`variables`) whose alias is never
 *      referenced. Variable modules emit no CSS, so dropping the `@use` cannot change the output.
 *   2. a `../<widget>/mixins` import pulled in with `as *` from which no mixin is ever `@include`d.
 *   3. a variable declared in the theme and referenced nowhere in the theme or in base — including
 *      the ones declared three times through `@if $size`, which the count-based check in
 *      unused-elements.test.ts cannot see.
 *
 * Deliberately NOT touched: imports without an alias and without `as *` (`@use "../dropDownMenu";`).
 * Those pull a module in for its side effects — its CSS rules — and removing one deletes styles.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const themeRoot = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const baseRoot = join(packageRoot, 'scss', 'widgets', 'base');
const registries = JSON.parse(readFileSync(join(here, 'registries.json'), 'utf8'));

const VARIABLE_MODULES = ['colors', 'sizes', 'variables'];
const exemptFolders = Object.keys(registries.exemptFolders);
const apply = process.argv.includes('--apply');

const walk = (dir) => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
}).filter((file) => file.endsWith('.scss'));

const stripComments = (content) => content
  .replace(/\/\/[^\n\r]*/g, '')
  .split(/\/\*|\*\//)
  .filter((_, index) => index % 2 === 0)
  .join('');

const themeFiles = walk(themeRoot)
  .filter((file) => !exemptFolders.includes(file.slice(themeRoot.length + 1).split('/')[0]));

// ---------------------------------------------------------------------------------------------
// 1 + 2: dead imports
// ---------------------------------------------------------------------------------------------

const mixinNames = (file) => new Set(
  [...readFileSync(file, 'utf8').matchAll(/@mixin\s+([a-zA-Z][\w-]*)/g)].map((match) => match[1]),
);

const deadImports = [];

themeFiles.forEach((file) => {
  const content = stripComments(readFileSync(file, 'utf8'));

  [...content.matchAll(/@use\s+(["'])([^"']+)\1([^;{]*);/g)].forEach((use) => {
    const [statement, , spec, tail] = use;
    const star = /\bas\s+\*/.test(tail);
    const alias = /\bas\s+([a-zA-Z][\w-]*)/.exec(tail)?.[1] ?? null;
    const moduleName = basename(spec);
    const rest = content.slice(0, use.index) + content.slice(use.index + statement.length);

    // Removal is line-based, so a statement spanning several lines would leave a dangling tail.
    // None of the variable-module imports are configured with `with()` today; if that ever changes,
    // this refuses to touch it instead of corrupting the file.
    if (statement.includes('\n')) {
      process.stdout.write(`NOTE  multi-line @use left alone: ${file.slice(themeRoot.length + 1)} -> ${spec}\n`);
      return;
    }

    if (alias && VARIABLE_MODULES.includes(moduleName)) {
      if (!new RegExp(`\\b${alias}\\.`).test(rest)) {
        deadImports.push({ file, statement, spec, reason: `alias ${alias} never referenced` });
      }
      return;
    }

    if (star && moduleName === 'mixins' && spec.startsWith('..')) {
      const modulePath = join(dirname(file), dirname(spec), '_mixins.scss');
      if (!existsSync(modulePath) || modulePath.startsWith(`${baseRoot}/`)) return;
      const provided = mixinNames(modulePath);
      const used = [...provided].some((name) => new RegExp(`@include\\s+${name}\\b`).test(rest));
      if (!used) {
        deadImports.push({ file, statement, spec, reason: 'no mixin from this module is included' });
      }
    }
  });
});

// ---------------------------------------------------------------------------------------------
// 3: dead variables
// ---------------------------------------------------------------------------------------------

const declarationsOf = (content) => {
  const names = new Set();
  const stack = [];
  let index = 0;
  while (index < content.length) {
    const char = content[index];
    if (char === '{') {
      stack.push(/@(if|else|each|for|while)\b[^{]*$/.test(content.slice(Math.max(0, index - 200), index)));
      index += 1;
    } else if (char === '}') {
      stack.pop();
      index += 1;
    } else if (char === '$') {
      const name = /^\$[a-z0-9_-]+/i.exec(content.slice(index))?.[0];
      if (!name) { index += 1; continue; }
      const namespaced = index > 0 && content[index - 1] === '.';
      if (/^\s*:/.test(content.slice(index + name.length)) && !namespaced && stack.every(Boolean)) {
        names.add(name);
      }
      index += name.length;
    } else {
      index += 1;
    }
  }
  return names;
};

const referencedNames = new Set();
[...themeFiles, ...walk(baseRoot)].forEach((file) => {
  const content = stripComments(readFileSync(file, 'utf8'));
  [...content.matchAll(/(?<!ds\.)\$[a-z0-9_-]+/gi)].forEach((match) => {
    const isAssignment = /^\s*:/.test(content.slice(match.index + match[0].length));
    if (!isAssignment) referencedNames.add(match[0]);
  });
});

const deadVariables = [];
themeFiles.forEach((file) => {
  declarationsOf(stripComments(readFileSync(file, 'utf8'))).forEach((name) => {
    if (!referencedNames.has(name)) deadVariables.push({ file, name });
  });
});

// ---------------------------------------------------------------------------------------------
// report / apply
// ---------------------------------------------------------------------------------------------

const byFile = new Map();
deadImports.forEach((entry) => {
  byFile.set(entry.file, { ...(byFile.get(entry.file) ?? { imports: [], variables: [] }) });
  byFile.get(entry.file).imports.push(entry);
});
deadVariables.forEach((entry) => {
  byFile.set(entry.file, byFile.get(entry.file) ?? { imports: [], variables: [] });
  byFile.get(entry.file).variables.push(entry.name);
});

process.stdout.write(`dead imports: ${deadImports.length}, dead variables: ${new Set(deadVariables.map((entry) => entry.name)).size}\n\n`);

[...byFile.entries()].sort().forEach(([file, { imports, variables }]) => {
  const relative = file.slice(themeRoot.length + 1);
  process.stdout.write(`${apply ? 'WRITE' : 'PLAN '} ${relative}\n`);
  imports.forEach(({ spec, reason }) => process.stdout.write(`      import  ${spec}  (${reason})\n`));
  [...new Set(variables)].forEach((name) => process.stdout.write(`      var     ${name}\n`));

  if (!apply) return;

  const lines = readFileSync(file, 'utf8').split('\n');
  const kept = lines.filter((line) => {
    const trimmed = line.trim();
    const isDeadImport = imports.some(({ spec }) => trimmed.startsWith('@use')
      && trimmed.includes(`"${spec}"`));
    const isDeadVariable = variables.some((name) => new RegExp(`^\\$?${name.slice(1)}\\s*:`)
      .test(trimmed.replace(/^\$/, '')));
    return !isDeadImport && !isDeadVariable;
  });
  writeFileSync(file, kept.join('\n'));
});

if (!apply) process.stdout.write('\nrun again with --apply to write\n');
