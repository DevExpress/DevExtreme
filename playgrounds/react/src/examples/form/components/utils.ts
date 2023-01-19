import {
  Children, ComponentType, isValidElement, JSXElementConstructor, ReactNode,
} from 'react';

type ChildrenArray = ReturnType<typeof Children.toArray>;

const isNodeOfTypes = (types: ComponentType[]) => (node: ReactNode) => isValidElement(node)
 && types.some((type) => node.type === type);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findNodeByTypes(nodes: ChildrenArray, types: JSXElementConstructor<any>[]) {
  return nodes.find(isNodeOfTypes(types));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterNodesByTypes(nodes: ChildrenArray, types: JSXElementConstructor<any>[]) {
  return nodes.filter(isNodeOfTypes(types));
}
