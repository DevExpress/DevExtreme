import stylelint from 'stylelint';
import type { Rule } from 'stylelint';

import {
  type AtRule, type Declaration, type Node, parentOf,
} from './node-types.ts';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'dx/module-variable-default';

const messages = ruleMessages(ruleName, {
  expected: (name: string) => `Expected the !default flag on "${name}": without it a value passed through @use … with() is ignored`,
});

const meta = {
  url: 'https://github.com/DevExpress/DevExtreme/blob/main/packages/devextreme-scss/tools/stylelint/module-variable-default.ts',
  fixable: true,
};

const isAtRule = (node: Node): node is AtRule => node.type === 'atrule';
const isConditional = (node: Node): boolean => isAtRule(node) && ['if', 'else'].includes(node.name);
const isModuleLevel = (decl: Declaration): boolean => {
  let node = parentOf(decl);
  while (isConditional(node)) node = parentOf(node);
  return node.type === 'root';
};
const hasFlag = (decl: Declaration, flag: string): boolean => new RegExp(`!${flag}\\b`, 'i').test(decl.value);
const isNull = (decl: Declaration): boolean => /^null(\s+!default)?$/.test(decl.value.trim());

const ruleFunction: Rule = (primary) => (root, result) => {
  if (!validateOptions(result, ruleName, { actual: primary, possible: [true] })) return;

  const assigned = new Set<string>();

  root.walkDecls((decl) => {
    if (!decl.prop.startsWith('$') || !isModuleLevel(decl)) return;

    const reassignment = assigned.has(decl.prop);
    if (parentOf(decl).type === 'root' && !isNull(decl)) assigned.add(decl.prop);
    if (reassignment || hasFlag(decl, 'default') || hasFlag(decl, 'global')) return;

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
