import {
  Children,
  ComponentType,
  isValidElement,
  JSXElementConstructor,
  ReactNode,
} from 'react';

type ChildrenArray = ReturnType<typeof Children.toArray>;

const isNodeOfTypes = (types: ComponentType[]) => (node: ReactNode) => isValidElement(node)
 && types.some((type) => node.type === type);

export function findNodeByTypes(
  nodes: ChildrenArray,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  types: (ComponentType | JSXElementConstructor<any>)[],
) {
  return nodes.find(isNodeOfTypes(types));
}

export function filterNodesByTypes(
  nodes: ChildrenArray,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  types: (ComponentType | JSXElementConstructor<any>)[],
) {
  return nodes.filter(isNodeOfTypes(types));
}
