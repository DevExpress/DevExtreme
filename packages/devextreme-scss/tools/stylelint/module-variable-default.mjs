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

const isConditional = (node) => node.type === 'atrule' && ['if', 'else'].includes(node.name);
const isModuleLevel = (decl) => {
  let node = decl.parent;
  while (isConditional(node)) node = node.parent;
  return node.type === 'root';
};
const hasFlag = (decl, flag) => new RegExp(`!${flag}\\b`, 'i').test(decl.value);
const isNull = (decl) => /^null(\s+!default)?$/.test(decl.value.trim());

const ruleFunction = (primary) => (root, result) => {
  if (!validateOptions(result, ruleName, { actual: primary, possible: [true] })) return;

  const assigned = new Set();

  root.walkDecls((decl) => {
    if (!decl.prop.startsWith('$') || !isModuleLevel(decl)) return;

    const reassignment = assigned.has(decl.prop);
    if (decl.parent.type === 'root' && !isNull(decl)) assigned.add(decl.prop);
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
