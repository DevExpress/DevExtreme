/*
 * Wave D of the naming standard (scss/widgets/dxdsfluent/NAMING.md, rule O4): removes a cross-folder
 * read by giving the reader its own value instead of the other folder's variable.
 *
 *   node tools/naming/inline-foreign.mjs           # report
 *   node tools/naming/inline-foreign.mjs --apply
 *
 * It only touches the one shape where O4 needs no judgment: a declaration whose ENTIRE value is a
 * single `alias.$foreign` reference, where the provider's own value is a single design token or a
 * literal. Then `$mine: providerAlias.$theirs` becomes `$mine: ds.$token`, which is the same value —
 * so the compiled CSS cannot change — and the coupling is expressed through the token, exactly as O4
 * asks.
 *
 * Everything else is left alone and reported, because it needs a person:
 *   - the provider's value is derived from another variable (inlining would copy a chain, not a value)
 *   - the read is not a plain initialisation (it sits inside a rule, a mixin call or a calc)
 *   - the read is legal under the chassis exception O5, in which case it should STAY: `$mine: ds.$x`
 *     duplicated across a family is exactly the drift the chassis exists to prevent.
 *
 * A token that belongs to another component (`ds.$button-*` read by diagram) is copied as it is and
 * reported: changing it to a semantic role would change the emitted var() name, so it is a mapping
 * question for DIVERGENCES.md, not something this tool may decide.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, basename, resolve } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const themeRoot = join(packageRoot, 'scss', 'widgets', 'dxdsfluent');
const baseline = JSON.parse(
  readFileSync(join(packageRoot, 'tests', 'dxdsfluent-naming.baseline.json'), 'utf8'),
);

const apply = process.argv.includes('--apply');

const walk = (dir) => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
}).filter((file) => file.endsWith('.scss'));

/** `alias` -> folder it resolves to, for one file. */
const aliasFolders = (file, content) => {
  const map = new Map();
  [...content.matchAll(/@use\s+(["'])([^"']+)\1([^;{]*)/g)].forEach(([, , spec, tail]) => {
    const alias = /\bas\s+([a-zA-Z][\w-]*)/.exec(tail)?.[1];
    if (!alias || alias === 'ds') return;
    const modulePath = resolve(dirname(file), spec);
    if (!modulePath.startsWith(`${themeRoot}/`)) return;
    map.set(alias, {
      folder: modulePath.slice(themeRoot.length + 1).split('/')[0],
      candidates: [`${modulePath}.scss`, join(dirname(modulePath), `_${basename(modulePath)}.scss`)],
    });
  });
  return map;
};

/** The right-hand side of `$name` in one of the candidate module files, if it is declared once. */
const providerValue = (candidates, name) => {
  const found = [];
  candidates.filter((candidate) => existsSync(candidate)).forEach((candidate) => {
    const content = readFileSync(candidate, 'utf8');
    [...content.matchAll(new RegExp(`^\\${name}\\s*:\\s*([^;]*);`, 'gm'))]
      .forEach((match) => found.push(match[1].trim()));
  });
  return found.length === 1 ? found[0] : null;
};

const SIMPLE_VALUE = /^(ds\.\$[a-z0-9-]+|#[0-9a-f]{3,8}|transparent|inherit|-?[\d.]+[a-z%]*)( !default)?$/i;

const foreignFor = (folder) => new Set(baseline.foreignReads?.[folder] ?? []);
const inlined = [];
const skipped = [];

walk(themeRoot).forEach((file) => {
  const relative = file.slice(themeRoot.length + 1);
  const folder = relative.split('/')[0];
  if (!relative.includes('/')) return;
  const original = readFileSync(file, 'utf8');
  const aliases = aliasFolders(file, original);
  const foreign = foreignFor(folder);
  let output = original;

  [...original.matchAll(/(?<![\w-])^(\$[a-z0-9-]+)\s*:\s*([a-zA-Z][\w-]*)\.(\$[a-z0-9-]+)(\s*!default)?\s*;$/gm)]
    .forEach((match) => {
      const [statement, own, alias, theirs, bang] = match;
      if (alias === 'ds') return;
      if (!foreign.has(`${alias}.${theirs}`)) return; // chassis-legal or already handled
      const target = aliases.get(alias);
      if (!target) return;
      const value = providerValue(target.candidates, theirs);
      if (value === null) {
        skipped.push(`${relative}: ${own} <- ${alias}.${theirs} (provider declares it ${value === null ? 'more than once or not at all' : ''})`);
        return;
      }
      const bare = value.replace(/\s*!default$/, '');
      if (!SIMPLE_VALUE.test(bare)) {
        skipped.push(`${relative}: ${own} <- ${alias}.${theirs} = ${bare} (not a single token)`);
        return;
      }
      output = output.replace(statement, `${own}: ${bare}${bang ?? ''};`);
      inlined.push(`${relative}: ${own} = ${bare}  (was ${alias}.${theirs})`);
    });

  if (apply && output !== original) writeFileSync(file, output);
});

inlined.forEach((entry) => process.stdout.write(`  ${apply ? 'WRITE' : 'PLAN '} ${entry}\n`));
skipped.forEach((entry) => process.stdout.write(`  SKIP  ${entry}\n`));
process.stdout.write(`\n${apply ? 'inlined' : 'would inline'} ${inlined.length}, left for review ${skipped.length}\n`);
if (!apply && inlined.length) process.stdout.write('run again with --apply to write\n');
