import stylelint from 'stylelint';
import type { Rule } from 'stylelint';

import {
  type AtRule, type ChildNode, type Comment, type Container,
  type Declaration, type Node, type Root, parentOf,
} from './node-types.ts';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

interface Chain { branches: AtRule[]; independent: boolean }
type Placement = 'before' | 'after';

const ruleName = 'dx/no-identical-branch-declarations';

const messages = ruleMessages(ruleName, {
  rejected: (name: string, count: number) => `"${name}" has the same value in all ${count} branches of the @if chain; declare it once outside the chain`,
});

const meta = {
  url: 'https://github.com/DevExpress/DevExtreme/blob/main/packages/devextreme-scss/tools/stylelint/no-identical-branch-declarations.ts',
  fixable: true,
};

const isAtRule = (node: Node | undefined): node is AtRule => node?.type === 'atrule';
const isComment = (node: Node | undefined): node is Comment => node?.type === 'comment';
const isElse = (node: Node | undefined): boolean => isAtRule(node) && node.name === 'else';
const isIf = (node: Node | undefined): boolean => isAtRule(node) && node.name === 'if';
const isVariable = (node: Node): node is Declaration => node.type === 'decl' && 'prop' in node
  && typeof node.prop === 'string' && node.prop.startsWith('$');
const isEmpty = (block: Container): boolean => (block.nodes ?? []).length === 0;
const normalise = (value: string): string => value.replace(/\s+/g, ' ').trim();
const isNull = (value: string): boolean => /^null(\s+!default)?$/.test(normalise(value));
const hasDefaultFlag = (value: string): boolean => /!default\b/.test(value);

const childrenOf = (container: Container): ChildNode[] => {
  if (!container.nodes) throw new TypeError(`a ${container.type} without children`);
  return container.nodes;
};
const indentOf = (node: Node): string => /[ \t]*$/.exec(node.raws.before ?? '')?.[0] ?? '';

const localReferences = (value: string): string[] => [...value.matchAll(/(^|[^\w.-])(\$[\w-]+)/g)].map((match) => match[2]);

const equalityTest = (atRule: AtRule): { variable: string; literal: string } | null => {
  const match = /^(\$[\w-]+)\s*==\s*("[^"]*"|'[^']*'|[\w.-]+)$/.exec(atRule.params.trim());
  return match && { variable: match[1], literal: match[2] };
};

const chainOf = (ifRule: AtRule): Chain => {
  const branches = [ifRule];
  let next = ifRule.next();

  while (next && (next.type === 'comment' || isElse(next))) {
    if (isAtRule(next) && isElse(next)) branches.push(next);
    next = next.next();
  }
  if (branches.length > 1) return { branches, independent: false };

  const test = equalityTest(ifRule);
  const literals = new Set([test?.literal]);

  while (test && next && (next.type === 'comment' || isIf(next))) {
    if (isAtRule(next) && isIf(next)) {
      const other = equalityTest(next);
      if (other?.variable !== test.variable || literals.has(other.literal)) break;
      literals.add(other.literal);
      branches.push(next);
    }
    next = next.next();
  }
  return { branches, independent: true };
};

const collectChains = (root: Root): Chain[] => {
  const chains: Chain[] = [];
  const seen = new WeakSet<AtRule>();

  root.walkAtRules('if', (ifRule) => {
    if (seen.has(ifRule)) return;
    const chain = chainOf(ifRule);
    chain.branches.forEach((branch) => seen.add(branch));
    if (chain.branches.length > 1) chains.push(chain);
  });
  return chains.reverse();
};

const directDeclarations = (block: AtRule): Map<string, Declaration> => {
  const byName = new Map<string, Declaration>();
  (block.nodes ?? []).filter(isVariable).forEach((decl) => byName.set(decl.prop, decl));
  return byName;
};

const identicalDeclarations = (branches: AtRule[]): Map<string, Declaration[]> => {
  const [first, ...rest] = branches.map(directDeclarations);
  const identical = new Map<string, Declaration[]>();

  for (const [name, decl] of first) {
    const declarations = [decl, ...rest.map((byName) => byName.get(name))];
    const value = normalise(decl.value);
    if (declarations.every((other): other is Declaration => other !== undefined
      && normalise(other.value) === value)) {
      identical.set(name, declarations);
    }
  }
  return identical;
};

const walkFinds = (
  branches: AtRule[],
  predicate: (decl: Declaration, branch: AtRule) => boolean,
): boolean => branches.some((branch) => {
  let found = false;
  branch.walkDecls((decl) => {
    if (!predicate(decl, branch)) return undefined;
    found = true;
    return false;
  });
  return found;
});

const assignedInside = (branches: AtRule[], name: string): boolean => walkFinds(
  branches,
  (decl) => decl.prop === name,
);

const planMoves = (
  branches: AtRule[],
  identical: Map<string, Declaration[]>,
): { movable: Set<string>; placement: Map<string, Placement> } => {
  const movable = new Set(identical.keys());
  const placement = new Map<string, Placement>();

  const settle = (): void => {
    placement.clear();
    for (const [name, [first]] of identical) {
      if (movable.has(name)) {
        const behind = localReferences(first.value).some((ref) => (
          movable.has(ref) ? placement.get(ref) === 'after' : assignedInside(branches, ref)
        ));
        placement.set(name, behind ? 'after' : 'before');
      }
    }
  };
  const readByStaying = (name: string): boolean => walkFinds(branches, (decl, branch) => (
    !(movable.has(decl.prop) && decl.parent === branch)
      && localReferences(decl.value).includes(name)
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

const earlierDeclaration = (
  parent: Container,
  ifRule: AtRule,
  name: string,
): Declaration | undefined => {
  const siblings = childrenOf(parent);
  const stop = siblings.indexOf(ifRule);
  return (stop === -1 ? siblings : siblings.slice(0, stop))
    .filter(isVariable)
    .filter((sibling) => sibling.prop === name)
    .pop();
};

const declaredBetween = (
  parent: Container,
  after: ChildNode,
  before: ChildNode,
  name: string,
): boolean => childrenOf(parent)
  .slice(parent.index(after) + 1, parent.index(before))
  .some((node) => isVariable(node) && node.prop === name);

const trailingComment = (decl: Declaration): Comment | undefined => {
  const next = decl.next();
  const sameLine = isComment(next) && next.source?.start?.line === decl.source?.end?.line;
  return sameLine ? next : undefined;
};

const trailersAgree = (declarations: Declaration[]): boolean => {
  const texts = declarations.map((decl) => trailingComment(decl)?.text);
  return texts.every((text) => text === texts[0]);
};

const attachedComment = (decl: Declaration): Comment | undefined => {
  const previous = decl.prev();
  const attached = isComment(previous) && !/\n[ \t]*\n/.test(decl.raws.before ?? '');
  return attached ? previous : undefined;
};

const dropEmptyBranches = (branches: AtRule[], independent: boolean): void => {
  if (independent) {
    branches.filter(isEmpty).forEach((branch) => branch.remove());
    return;
  }
  while (branches.length && isEmpty(branches[branches.length - 1])) {
    branches[branches.length - 1].remove();
    branches.pop();
  }
};

const ruleFunction: Rule = (primary) => (root, result) => {
  if (!validateOptions(result, ruleName, { actual: primary, possible: [true] })) return;

  const lastHoisted = new WeakMap<AtRule, Declaration>();

  for (const { branches, independent } of collectChains(root)) {
    const ifRule = branches[0];
    const parent = parentOf(ifRule);
    const identical = identicalDeclarations(branches);
    const { movable, placement } = planMoves(branches, identical);

    for (const [name, declarations] of identical) {
      const [first] = declarations;
      const earlier = earlierDeclaration(parent, ifRule, name);
      const overridden = earlier !== undefined && !isNull(earlier.value);
      const fixable = trailersAgree(declarations)
        && (overridden
          ? declarations.every((decl) => hasDefaultFlag(decl.value))
          : movable.has(name));

      const fix = (): void => {
        const live = branches.filter((branch) => branch.parent);
        const tidy = (): void => {
          dropEmptyBranches(live, independent);
          live.forEach((branch) => {
            const firstChild = branch.first;
            if (branch.parent && firstChild?.type === 'decl') {
              const { before } = firstChild.raws;
              if (before === undefined) throw new TypeError('a declaration without raws.before');
              firstChild.raws.before = before.replace(/^\s*\n/, '\n');
            }
          });
          parent.raws.semicolon = true;
          if (parent.type === 'root' && parent.first) parent.first.raws.before = '';
        };

        const dropDeclarations = (): void => declarations.forEach((decl) => {
          trailingComment(decl)?.remove();
          decl.remove();
        });

        if (overridden) {
          dropDeclarations();
          tidy();
          return;
        }

        const hoisted = first.clone();
        const trailerSource = trailingComment(first);
        const trailer = trailerSource?.clone({ raws: { ...trailerSource.raws, before: ' ' } });
        const references = localReferences(first.value);
        const comment = earlier && attachedComment(earlier);
        dropDeclarations();

        const relocate = (
          insert: (node: ChildNode, previous?: ChildNode) => void,
          gap: string,
        ): void => {
          const indent = indentOf(ifRule);
          const moved = comment?.clone({ raws: { ...comment.raws, before: `${gap}${indent}` } });
          hoisted.raws.before = moved ? `\n${indent}` : `${gap}${indent}`;
          if (moved) insert(moved);
          insert(hoisted, moved);
          if (trailer) parent.insertAfter(hoisted, trailer);
          comment?.remove();
          earlier?.remove();
        };

        if (placement.get(name) === 'after') {
          const anchor = lastHoisted.get(ifRule) ?? live[live.length - 1];
          relocate((node, previous) => { parent.insertAfter(previous ?? anchor, node); }, lastHoisted.has(ifRule) ? '\n' : '\n\n');
          lastHoisted.set(ifRule, hoisted);
        } else if (earlier
          && !references.some((ref) => declaredBetween(parent, earlier, ifRule, ref))) {
          hoisted.raws.before = earlier.raws.before;
          earlier.replaceWith(hoisted);
          if (trailer) parent.insertAfter(hoisted, trailer);
        } else {
          relocate((node, previous) => {
            if (previous) parent.insertAfter(previous, node);
            else parent.insertBefore(ifRule, node);
          }, '\n');
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
