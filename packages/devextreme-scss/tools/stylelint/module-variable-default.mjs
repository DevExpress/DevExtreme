import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'dx/module-variable-default';

const messages = ruleMessages(ruleName, {
  expected: (name) => `Expected the !default flag on "${name}": without it a value passed through @use … with() is ignored`,
});

const meta = { fixable: true };

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

// A size classified by the px audit is not a knob: the audit's gate accepts a fixed value only
// when a theme sets it or a marker says why it stays, so a marked value is one the theme must not
// pass through @use with(). The marker list is read from the audit's own vocabulary to keep one
// source of truth; the path is package-relative.
const readMarkers = (vocabularyPath) => {
  const { categories } = JSON.parse(readFileSync(join(packageRoot, vocabularyPath), 'utf8'));
  return categories.map(({ marker }) => marker).filter(Boolean);
};

// The marker sits where the px audit writes it: in the declaration's trailing comment, or in the
// comment block directly above it (tools/review/px-audit.mjs reads the same two places).
const classifyingComments = (decl) => {
  const parts = [];
  const trailing = decl.next();
  if (trailing?.type === 'comment' && trailing.source?.start?.line === decl.source?.end?.line) {
    parts.push(trailing.text);
  }

  let node = decl.prev();
  let gap = decl.raws.before ?? '';
  while (node?.type === 'comment' && !/\n\s*\n/.test(gap)) {
    parts.push(node.text);
    gap = node.raws.before ?? '';
    node = node.prev();
  }

  return parts.join('\n');
};

const isConditional = (node) => node.type === 'atrule' && ['if', 'else'].includes(node.name);
const isModuleLevel = (decl) => {
  let node = decl.parent;
  while (isConditional(node)) node = node.parent;
  return node.type === 'root';
};
const hasFlag = (decl, flag) => new RegExp(`!${flag}\\b`, 'i').test(decl.value);
const isNull = (decl) => /^null(\s+!default)?$/.test(decl.value.trim());

const ruleFunction = (primary, secondary) => (root, result) => {
  if (!validateOptions(
    result,
    ruleName,
    { actual: primary, possible: [true] },
    { actual: secondary, possible: { exemptMarkersFrom: [(value) => typeof value === 'string'] }, optional: true },
  )) return;

  const markers = secondary?.exemptMarkersFrom ? readMarkers(secondary.exemptMarkersFrom) : [];
  const isClassified = (decl) => markers.length > 0
    && markers.some((marker) => classifyingComments(decl).includes(marker));

  const assigned = new Set();

  root.walkDecls((decl) => {
    if (!decl.prop.startsWith('$') || !isModuleLevel(decl)) return;

    const reassignment = assigned.has(decl.prop);
    if (decl.parent.type === 'root' && !isNull(decl)) assigned.add(decl.prop);
    if (reassignment || hasFlag(decl, 'default') || hasFlag(decl, 'global')) return;
    if (isClassified(decl)) return;

    report({
      message: messages.expected,
      messageArgs: [decl.prop],
      node: decl,
      result,
      ruleName,
      fix: () => {
        decl.value = `${decl.value} !default`;
        if (decl.raws.value) decl.raws.value = { value: decl.value, raw: `${decl.raws.value.raw} !default` };
      },
    });
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
