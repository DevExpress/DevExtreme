import { existsSync, readFileSync } from 'fs';
import { dirname, join, normalize } from 'path';
import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'dx/no-unused-use';

const messages = ruleMessages(ruleName, {
  builtIn: (url) => `Nothing reads "${url}"; remove the @use`,
  unread: (url) => `Nothing reads "${url}"; remove the @use, or write @use "${url}"; when the module is loaded for its CSS or its load order`,
});

const meta = { fixable: true };

const resolveModule = (fromFile, url) => {
  const target = normalize(join(dirname(fromFile), url));
  const base = target.split('/').pop();
  return [
    `${target}.scss`,
    join(dirname(target), `_${base}.scss`),
    join(target, '_index.scss'),
    join(target, 'index.scss'),
  ].find((candidate) => existsSync(candidate));
};

const membersCache = new Map();

const membersOf = (file, seen = new Set()) => {
  if (membersCache.has(file)) return membersCache.get(file);
  if (seen.has(file)) return new Set();
  seen.add(file);

  const source = readFileSync(file, 'utf8');
  const members = new Set();
  let depth = 0;
  source.split('\n').forEach((line) => {
    const variable = depth === 0 && line.match(/^\$([\w-]+)\s*:/);
    if (variable) members.add(`$${variable[1]}`);
    const callable = line.match(/^\s*@(mixin|function)\s+([\w-]+)/);
    if (callable) members.add(`${callable[1] === 'mixin' ? '@' : 'fn:'}${callable[2]}`);
    [...line.matchAll(/%([\w-]+)/g)].forEach(([, name]) => members.add(`%${name}`));
    depth += (line.match(/{/g) ?? []).length - (line.match(/}/g) ?? []).length;
  });

  [...source.matchAll(/@forward\s+"([^"]+)"(?:\s+as\s+([\w-]+)\*)?/g)].forEach(([, url, prefix = '']) => {
    if (url.startsWith('sass:')) return;
    const forwarded = resolveModule(file, url);
    if (!forwarded) return;
    membersOf(forwarded, seen).forEach((member) => {
      const [, kind, name] = member.match(/^(\$|@|fn:|%)(.*)$/);
      members.add(kind === '%' ? member : `${kind}${prefix}${name}`);
    });
  });

  membersCache.set(file, members);
  return members;
};

const reads = (text, member) => {
  const [, kind, name] = member.match(/^(\$|@|fn:|%)(.*)$/);
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (kind === '$') return new RegExp(`\\$${escaped}(?![\\w-])`).test(text);
  if (kind === '@') return new RegExp(`@include\\s+${escaped}(?![\\w-])`).test(text);
  if (kind === '%') return new RegExp(`@extend\\s+%${escaped}(?![\\w-])`).test(text);
  return new RegExp(`(?<![\\w$.-])${escaped}\\(`).test(text);
};

const readsNamespace = (text, namespace) => new RegExp(`(?<![\\w-])${namespace}\\.`).test(text);

const ruleFunction = (primary) => (root, result) => {
  if (!validateOptions(result, ruleName, { actual: primary, possible: [true] })) return;

  const file = root.source?.input?.file;
  const source = root.toString();

  root.walkAtRules('use', (atRule) => {
    const parsed = atRule.params.match(/^(["'])([^"']+)\1(?:\s+as\s+([\w*-]+))?\s*(with\b)?/);
    if (!parsed || parsed[4]) return;

    const [, , url, alias] = parsed;
    const rest = source.replace(atRule.toString(), '');

    if (url.startsWith('sass:')) {
      if (alias === '*' || readsNamespace(rest, alias ?? url.slice(5))) return;
      report({
        message: messages.builtIn,
        messageArgs: [url],
        node: atRule,
        result,
        ruleName,
        fix: () => atRule.remove(),
      });
      return;
    }

    if (!alias) return;

    if (alias !== '*') {
      if (readsNamespace(rest, alias)) return;
    } else {
      const module = file && resolveModule(file, url);
      if (!module) return;
      const members = membersOf(module);
      if (!members.size || [...members].some((member) => reads(rest, member))) return;
    }

    report({
      message: messages.unread,
      messageArgs: [url],
      node: atRule,
      result,
      ruleName,
      fix: () => atRule.replaceWith(atRule.clone({ params: `"${url}"` })),
    });
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
