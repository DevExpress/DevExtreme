import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'dx/no-identical-branch-declarations';

const messages = ruleMessages(ruleName, {
  rejected: (name, count) => `"${name}" has the same value in all ${count} branches of the @if chain; declare it once outside the chain`,
});

const meta = { fixable: true };

const isElse = (node) => node.type === 'atrule' && node.name === 'else';
const isIf = (node) => node.type === 'atrule' && node.name === 'if';
const isVariable = (node) => node.type === 'decl' && node.prop.startsWith('$');
const isEmpty = (block) => (block.nodes ?? []).length === 0;
const normalise = (value) => value.replace(/\s+/g, ' ').trim();
const isNull = (value) => /^null(\s+!default)?$/.test(normalise(value));
const hasDefaultFlag = (value) => /!default\b/.test(value);
const indentOf = (node) => (node.raws.before ?? '').match(/[ \t]*$/)[0];

const localReferences = (value) => [...value.matchAll(/(^|[^\w.-])(\$[\w-]+)/g)].map((match) => match[2]);

const equalityTest = (atRule) => {
  const match = atRule.params.trim().match(/^(\$[\w-]+)\s*==\s*("[^"]*"|'[^']*'|[\w.-]+)$/);
  return match && { variable: match[1], literal: match[2] };
};

const chainOf = (ifRule) => {
  const branches = [ifRule];
  let next = ifRule.next();

  while (next && (next.type === 'comment' || isElse(next))) {
    if (isElse(next)) branches.push(next);
    next = next.next();
  }
  if (branches.length > 1) return { branches, independent: false };

  const test = equalityTest(ifRule);
  const literals = new Set([test?.literal]);

  while (test && next && (next.type === 'comment' || isIf(next))) {
    if (isIf(next)) {
      const other = equalityTest(next);
      if (other?.variable !== test.variable || literals.has(other.literal)) break;
      literals.add(other.literal);
      branches.push(next);
    }
    next = next.next();
  }
  return { branches, independent: true };
};

const collectChains = (root) => {
  const chains = [];
  const seen = new WeakSet();

  root.walkAtRules('if', (ifRule) => {
    if (seen.has(ifRule)) return;
    const chain = chainOf(ifRule);
    chain.branches.forEach((branch) => seen.add(branch));
    if (chain.branches.length > 1) chains.push(chain);
  });
  return chains.reverse();
};

const directDeclarations = (block) => {
  const byName = new Map();
  (block.nodes ?? []).filter(isVariable).forEach((decl) => byName.set(decl.prop, decl));
  return byName;
};

const identicalDeclarations = (branches) => {
  const [first, ...rest] = branches.map(directDeclarations);
  const identical = new Map();

  for (const [name, decl] of first) {
    const declarations = [decl, ...rest.map((byName) => byName.get(name))];
    const value = normalise(decl.value);
    if (declarations.every((other) => other && normalise(other.value) === value)) identical.set(name, declarations);
  }
  return identical;
};

const walkFinds = (branches, predicate) => branches.some((branch) => {
  let found = false;
  branch.walkDecls((decl) => {
    if (!predicate(decl, branch)) return undefined;
    found = true;
    return false;
  });
  return found;
});

const assignedInside = (branches, name) => walkFinds(branches, (decl) => decl.prop === name);

const planMoves = (branches, identical) => {
  const movable = new Set(identical.keys());
  const placement = new Map();

  const settle = () => {
    placement.clear();
    for (const name of movable) {
      const behind = localReferences(identical.get(name)[0].value).some((ref) => (
        movable.has(ref) ? placement.get(ref) === 'after' : assignedInside(branches, ref)
      ));
      placement.set(name, behind ? 'after' : 'before');
    }
  };
  const readByStaying = (name) => walkFinds(branches, (decl, branch) => (
    !(movable.has(decl.prop) && decl.parent === branch) && localReferences(decl.value).includes(name)
  ));

  for (let changed = true; changed;) {
    settle();
    changed = false;
    for (const name of movable) {
      if (placement.get(name) === 'after' && readByStaying(name)) {
        movable.delete(name);
        changed = true;
      }
    }
  }
  return { movable, placement };
};

const earlierDeclaration = (parent, ifRule, name) => {
  let found;
  for (const sibling of parent.nodes) {
    if (sibling === ifRule) break;
    if (isVariable(sibling) && sibling.prop === name) found = sibling;
  }
  return found;
};

const declaredBetween = (parent, after, before, name) => parent.nodes
  .slice(parent.index(after) + 1, parent.index(before))
  .some((node) => isVariable(node) && node.prop === name);

const attachedComment = (decl) => {
  const previous = decl.prev();
  const attached = previous?.type === 'comment' && !/\n[ \t]*\n/.test(decl.raws.before ?? '');
  return attached ? previous : undefined;
};

const dropEmptyBranches = (branches, independent) => {
  if (independent) {
    branches.filter(isEmpty).forEach((branch) => branch.remove());
    return;
  }
  while (branches.length && isEmpty(branches[branches.length - 1])) {
    branches.pop().remove();
  }
};

const ruleFunction = (primary) => (root, result) => {
  if (!validateOptions(result, ruleName, { actual: primary, possible: [true] })) return;

  const lastHoisted = new WeakMap();

  for (const { branches, independent } of collectChains(root)) {
    const ifRule = branches[0];
    const { parent } = ifRule;
    const identical = identicalDeclarations(branches);
    const { movable, placement } = planMoves(branches, identical);

    for (const [name, declarations] of identical) {
      const [first] = declarations;
      const earlier = earlierDeclaration(parent, ifRule, name);
      const overridden = earlier !== undefined && !isNull(earlier.value);
      const fixable = overridden ? declarations.every((decl) => hasDefaultFlag(decl.value)) : movable.has(name);

      const fix = () => {
        const live = branches.filter((branch) => branch.parent);
        const tidy = () => {
          dropEmptyBranches(live, independent);
          parent.raws.semicolon = true;
          if (parent.type === 'root' && parent.first) parent.first.raws.before = '';
        };

        if (overridden) {
          declarations.forEach((decl) => decl.remove());
          tidy();
          return;
        }

        const hoisted = first.clone();
        const references = localReferences(first.value);
        const comment = earlier && attachedComment(earlier);
        declarations.forEach((decl) => decl.remove());

        const relocate = (insert, gap) => {
          const indent = indentOf(ifRule);
          const moved = comment?.clone({ raws: { ...comment.raws, before: `${gap}${indent}` } });
          hoisted.raws.before = moved ? `\n${indent}` : `${gap}${indent}`;
          if (moved) insert(moved);
          insert(hoisted, moved);
          comment?.remove();
          earlier?.remove();
        };

        if (placement.get(name) === 'after') {
          const anchor = lastHoisted.get(ifRule) ?? live[live.length - 1];
          relocate((node, previous) => parent.insertAfter(previous ?? anchor, node), lastHoisted.has(ifRule) ? '\n' : '\n\n');
          lastHoisted.set(ifRule, hoisted);
        } else if (earlier && !references.some((ref) => declaredBetween(parent, earlier, ifRule, ref))) {
          hoisted.raws.before = earlier.raws.before;
          earlier.replaceWith(hoisted);
        } else {
          relocate((node, previous) => (previous ? parent.insertAfter(previous, node) : parent.insertBefore(ifRule, node)), '\n');
        }

        tidy();
      };

      report({
        message: messages.rejected,
        messageArgs: [name, branches.length],
        node: first,
        result,
        ruleName,
        ...(fixable && { fix: { apply: fix, node: parent } }),
      });
    }
  }
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
