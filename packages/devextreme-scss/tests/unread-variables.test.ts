/*
 * Module variables that nothing reads.
 *
 * unused-elements.test.ts asks whether a name appears anywhere, and the value side of a
 * `@use "…" with ($a: $b)` entry is an appearance - so a variable that is only declared and handed
 * onwards looks used even when the module it is handed to never reads it. This file asks where the
 * chain ends: liveness starts at the declarations, mixin arguments and interpolations that read a
 * variable, and spreads backwards through the configure graph, `$b` becoming live only once `$a`
 * is. A chain that ends nowhere is dead in every theme - the value is computed and dropped.
 *
 * Two sass rules the walk has to respect:
 *
 * - a file that loads a module with `as *` and then writes `$x: value` is setting THAT module's
 *   variable rather than declaring its own, which is how a theme sets the base layer's colours;
 * - a variable local to a mixin, a function or a rule is not a module variable at all, so only
 *   what stands at brace and paren depth 0 counts as a declaration.
 *
 * A read this file cannot attribute to one module wakes every module that declares the name: the
 * gate would rather miss a dead variable than name a live one.
 */

import {
  existsSync,
  readdirSync,
  readFileSync,
} from 'fs';
import {
  basename,
  dirname,
  join,
  relative,
  resolve,
} from 'path';

const packageRoot = resolve(__dirname, '..');
const widgetsRoot = join(packageRoot, 'scss', 'widgets');

interface Read { file: string; name: string; namespace?: string }
interface Configure { target: string; name: string; values: Read[]; file: string; line: number }
interface Site { file: string; name: string; line: number }

const walk = (directory: string): string[] => readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walk(path);
    return entry.name.endsWith('.scss') ? [path] : [];
  });

// Comments are blanked rather than dropped, so that every reported line number is the real one.
const blank = (text: string): string => text.replace(/[^\n]/g, ' ');
const stripComments = (text: string): string => text
  .replace(/\/\*[\s\S]*?\*\//g, blank)
  .replace(/(^|[^:])(\/\/[^\n]*)/g, (_, before: string, comment: string) => before + blank(comment));

const loadTarget = (fromFile: string, specifier: string): string | null => {
  if (specifier.startsWith('sass:')) return null;
  const path = resolve(dirname(fromFile), specifier);
  const candidates = [
    `${path}.scss`,
    join(dirname(path), `_${basename(path)}.scss`),
    join(path, '_index.scss'),
    join(path, 'index.scss'),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
};

const files = walk(widgetsRoot);
const source = new Map(files.map((file) => [file, stripComments(readFileSync(file, 'utf8'))]));

const declarations = new Map<string, Map<string, number>>();
const namespaces = new Map<string, Map<string, string>>();
const wildcards = new Map<string, string[]>();
const configures: Configure[] = [];
const reads: Read[] = [];

const LOAD = /@(use|forward)\s+["']([^"']+)["']((?:\s+as\s+[\w*-]+)?)\s*(with\s*\()?/g;
const ENTRY = /^\s*\$([\w-]+)\s*:([\s\S]*)$/;
const VARIABLE = /^\$([\w-]+)/;
const NAMESPACED = /([\w-]+)\s*\.\s*$/;

const closingParen = (text: string, from: number): number => {
  let depth = 1;
  let index = from;
  while (index < text.length && depth > 0) {
    if (text[index] === '(') depth += 1;
    if (text[index] === ')') depth -= 1;
    index += 1;
  }
  return index;
};

const splitEntries = (body: string): string[] => {
  const entries: string[] = [];
  let depth = 0;
  let current = '';
  [...body].forEach((character) => {
    if (character === '(') depth += 1;
    if (character === ')') depth -= 1;
    if (character === ',' && depth === 0) {
      entries.push(current);
      current = '';
      return;
    }
    current += character;
  });
  entries.push(current);
  return entries;
};

const valuesOf = (file: string, expression: string): Read[] => [
  ...expression.matchAll(/(?:([\w-]+)\s*\.\s*)?\$([\w-]+)/g),
].map((match) => ({ file, name: match[2], namespace: match[1] }));

files.forEach((file) => {
  const text = source.get(file) ?? '';
  const lineAt = (index: number): number => text.slice(0, index).split('\n').length;
  declarations.set(file, new Map());
  namespaces.set(file, new Map());
  wildcards.set(file, []);
  const withRanges: [number, number][] = [];

  [...text.matchAll(LOAD)].forEach((match) => {
    const [whole, , specifier, tail, opensWith] = match;
    const target = loadTarget(file, specifier);
    const index = match.index ?? 0;
    if (!target) return;

    const alias = /\bas\s+(\*|[\w-]+)/.exec(tail)?.[1];
    if (alias === '*') wildcards.get(file)?.push(target);
    else namespaces.get(file)?.set(alias ?? basename(specifier).replace(/^_/, ''), target);
    if (!opensWith) return;

    const body = closingParen(text, index + whole.length);
    withRanges.push([index, body]);
    splitEntries(text.slice(index + whole.length, body - 1)).forEach((entry) => {
      const parsed = ENTRY.exec(entry);
      if (!parsed) return;
      configures.push({
        target, name: parsed[1], values: valuesOf(file, parsed[2]), file, line: lineAt(index),
      });
    });
  });

  const inWith = (index: number): boolean => withRanges.some(([from, to]) => index >= from && index < to);
  let braces = 0;
  let parens = 0;
  let index = 0;
  while (index < text.length) {
    const character = text[index];
    if (character === '{') braces += 1;
    else if (character === '}') braces = Math.max(0, braces - 1);
    else if (character === '(') parens += 1;
    else if (character === ')') parens = Math.max(0, parens - 1);

    const variable = character === '$' && !inWith(index)
      ? VARIABLE.exec(text.slice(index, index + 80))
      : null;
    if (!variable) {
      index += 1;
    } else {
      const [spelling, name] = variable;
      const declares = /^\s*:/.test(text.slice(index + spelling.length))
        && braces === 0 && parens === 0;
      if (declares) declarations.get(file)?.set(name, lineAt(index));
      else {
        const before = text.slice(Math.max(0, index - 40), index);
        reads.push({ file, name, namespace: NAMESPACED.exec(before)?.[1] });
      }
      index += spelling.length;
    }
  }
});

const wildcardOwner = (file: string, name: string): string | null => {
  const seen = new Set<string>();
  const queue = [...(wildcards.get(file) ?? [])];
  while (queue.length) {
    const candidate = queue.shift();
    if (!candidate || seen.has(candidate)) continue;
    seen.add(candidate);
    if (declarations.get(candidate)?.has(name)) return candidate;
    queue.push(...(wildcards.get(candidate) ?? []));
  }
  return null;
};

// `$x: value` under `@use "m" as *` writes m's variable; it does not declare a second one here.
const writes = new Map<string, string>();
declarations.forEach((names, file) => {
  names.forEach((_, name) => {
    const owner = wildcardOwner(file, name);
    if (owner) writes.set(`${file}\n${name}`, owner);
  });
});
writes.forEach((_, id) => {
  const [file, name] = id.split('\n');
  declarations.get(file)?.delete(name);
});

const declaringModules = (read: Read): string[] => {
  const { file, name, namespace } = read;
  if (namespace) {
    const target = namespaces.get(file)?.get(namespace);
    if (target && declarations.get(target)?.has(name)) return [target];
  }
  if (declarations.get(file)?.has(name)) return [file];
  const owner = wildcardOwner(file, name);
  if (owner) return [owner];
  return files.filter((candidate) => declarations.get(candidate)?.has(name));
};

const key = (file: string, name: string): string => `${file}\n${name}`;
const live = new Set<string>();
const frontier: Site[] = [];
const wake = (file: string, name: string): void => {
  if (live.has(key(file, name))) return;
  live.add(key(file, name));
  frontier.push({ file, name, line: 0 });
};

reads.forEach((read) => declaringModules(read).forEach((file) => wake(file, read.name)));

const byTarget = new Map<string, Configure[]>();
configures.forEach((entry) => {
  const id = key(entry.target, entry.name);
  byTarget.set(id, [...(byTarget.get(id) ?? []), entry]);
});

while (frontier.length) {
  const site = frontier.pop();
  (byTarget.get(key(site?.file ?? '', site?.name ?? '')) ?? []).forEach((entry) => {
    entry.values.forEach((value) => declaringModules(value).forEach((file) => wake(file, value.name)));
  });
}

const dead: Site[] = [];
declarations.forEach((names, file) => {
  names.forEach((line, name) => {
    if (!live.has(key(file, name))) dead.push({ file, name, line });
  });
});

describe('module variables nothing reads', () => {
  test('every declared variable reaches a declaration that reads it', () => {
    const report = dead
      .sort((left, right) => `${left.name}${left.file}`.localeCompare(`${right.name}${right.file}`))
      .map((site) => {
        const configuredBy = configures
          .filter((entry) => entry.target === site.file && entry.name === site.name)
          .map((entry) => `${relative(packageRoot, entry.file)}:${entry.line}`);
        return [
          `${relative(packageRoot, site.file)}:${site.line}  $${site.name}`,
          configuredBy.length
            ? `    set from ${configuredBy.join(', ')}, and read by nothing`
            : '    read by nothing',
          '    remove it together with the entries that set it, or read it where it belongs',
        ].join('\n');
      });

    expect(report).toEqual([]);
  });
});
