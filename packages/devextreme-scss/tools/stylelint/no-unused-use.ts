import { existsSync, readFileSync } from 'fs';
import { dirname, join, normalize } from 'path';
import stylelint from 'stylelint';
import type { Rule } from 'stylelint';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'dx/no-unused-use';

const messages = ruleMessages(ruleName, {
  builtIn: (url: string) => `Nothing reads "${url}"; remove the @use`,
  unread: (url: string) => `Nothing reads "${url}"; remove the @use, or write @use "${url}"; when the module is loaded for its CSS or its load order`,
});

const meta = {
  url: 'https://github.com/DevExpress/DevExtreme/blob/main/packages/devextreme-scss/tools/stylelint/no-unused-use.ts',
  fixable: true,
};

const resolveModule = (fromFile: string, url: string): string | undefined => {
  const target = normalize(join(dirname(fromFile), url));
  const base = target.split('/').pop() ?? '';
  return [
    `${target}.scss`,
    join(dirname(target), `_${base}.scss`),
    join(target, '_index.scss'),
    join(target, 'index.scss'),
  ].find((candidate) => existsSync(candidate));
};

const membersCache = new Map<string, Set<string>>();

const membersOf = (file: string, seen = new Set<string>()): Set<string> => {
  const cached = membersCache.get(file);
  if (cached) return cached;
  if (seen.has(file)) return new Set();
  seen.add(file);

  const source = readFileSync(file, 'utf8');
  const members = new Set<string>();
  let depth = 0;
  source.split('\n').forEach((line) => {
    const variable = depth === 0 ? /^\$([\w-]+)\s*:/.exec(line) : null;
    if (variable) members.add(`$${variable[1]}`);
    const callable = /^\s*@(mixin|function)\s+([\w-]+)/.exec(line);
    if (callable) members.add(`${callable[1] === 'mixin' ? '@' : 'fn:'}${callable[2]}`);
    (line.match(/%[\w-]+/g) ?? []).forEach((placeholder) => members.add(placeholder));
    depth += (line.match(/{/g) ?? []).length - (line.match(/}/g) ?? []).length;
  });

  const forwardRule = /@forward\s+"([^"]+)"(?:\s+as\s+([\w-]+)\*)?/g;
  let forward = forwardRule.exec(source);
  while (forward) {
    const [, url, prefix = ''] = forward;
    const forwarded = url.startsWith('sass:') ? undefined : resolveModule(file, url);
    if (forwarded) {
      membersOf(forwarded, seen).forEach((member) => {
        const [, kind, name] = /^(\$|@|fn:|%)(.*)$/.exec(member) ?? [];
        members.add(kind === '%' ? member : `${kind}${prefix}${name}`);
      });
    }
    forward = forwardRule.exec(source);
  }

  membersCache.set(file, members);
  return members;
};

const escape = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const reads = (text: string, member: string): boolean => {
  const [, kind, name] = /^(\$|@|fn:|%)(.*)$/.exec(member) ?? [];
  const escaped = escape(name);
  if (kind === '$') return new RegExp(`\\$${escaped}(?![\\w-])`).test(text);
  if (kind === '@') return new RegExp(`@include\\s+${escaped}(?![\\w-])`).test(text);
  if (kind === '%') return new RegExp(`@extend\\s+%${escaped}(?![\\w-])`).test(text);
  return new RegExp(`(?<![\\w$.-])${escaped}\\(`).test(text);
};

const readsNamespace = (text: string, namespace: string): boolean => new RegExp(`(?<![\\w-])${escape(namespace)}\\.`).test(text);

const ruleFunction: Rule = (primary) => (root, result) => {
  if (!validateOptions(result, ruleName, { actual: primary, possible: [true] })) return;

  const file = root.source?.input?.file;
  const source = root.toString();

  root.walkAtRules('use', (atRule) => {
    const parsed = /^(["'])([^"']+)\1(?:\s+as\s+([\w*-]+))?\s*(with\b)?/.exec(atRule.params);
    if (!parsed || parsed[4]) return;

    const [, , url, alias] = parsed;
    const rest = source.replace(atRule.toString(), '');

    if (url.startsWith('sass:')) {
      if (alias === '*' || readsNamespace(rest, alias ?? url.slice(5))) return;
      report({
        message: messages.builtIn(url),
        node: atRule,
        result,
        ruleName,
        fix: () => { atRule.remove(); },
      });
      return;
    }

    if (!alias) return;

    if (alias !== '*') {
      if (readsNamespace(rest, alias)) return;
    } else {
      const module = file ? resolveModule(file, url) : undefined;
      if (!module) return;
      const members = membersOf(module);
      if (!members.size || [...members].some((member) => reads(rest, member))) return;
    }

    report({
      message: messages.unread(url),
      node: atRule,
      result,
      ruleName,
      fix: () => { atRule.replaceWith(atRule.clone({ params: `"${url}"` })); },
    });
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
