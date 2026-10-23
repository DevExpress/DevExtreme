import type { Rule } from 'stylelint';

export type Root = Parameters<ReturnType<Rule>>[0];
export type Declaration = Parameters<Parameters<Root['walkDecls']>[0]>[0];
export type AtRule = Parameters<Parameters<Root['walkAtRules']>[0]>[0];
export type Comment = Parameters<Parameters<Root['walkComments']>[0]>[0];
export type ChildNode = Parameters<Parameters<Root['each']>[0]>[0];
type Parent = NonNullable<ChildNode['parent'] | Root['parent']>;
type Document = Extract<Parent, { type: 'document' }>;
export type Container = Exclude<Parent, Document>;
export type Node = ChildNode | Container;

const isDocument = (parent: Parent): parent is Document => parent.type === 'document';

export const parentOf = (node: Node): Container => {
  const { parent } = node;
  if (!parent || isDocument(parent)) throw new TypeError(`a ${node.type} node outside a stylesheet`);
  return parent;
};
