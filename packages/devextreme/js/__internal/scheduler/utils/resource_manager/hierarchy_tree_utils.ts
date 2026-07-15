import type { ResourceData } from '../loader/types';

export interface ResourceHierarchyNode {
  data: ResourceData;
  children: ResourceHierarchyNode[];
}

const isRootItem = (
  item: ResourceData,
  nodeById: Map<ResourceData['id'], ResourceHierarchyNode>,
): boolean => {
  const { parentId, id } = item;

  return parentId == null || !nodeById.has(parentId) || parentId === id;
};

// Without this check, a parentId loop (A's parent is B, B's parent is A) causes a stack overflow
const isAncestorCycle = (
  id: ResourceData['id'],
  parentId: ResourceData['id'],
  nodeById: Map<ResourceData['id'], ResourceHierarchyNode>,
): boolean => {
  const visited = new Set<ResourceData['id']>();
  let currentId: ResourceData['id'] | null | undefined = parentId;

  while (currentId != null && !visited.has(currentId)) {
    if (currentId === id) {
      return true;
    }

    visited.add(currentId);
    currentId = nodeById.get(currentId)?.data.parentId;
  }

  return false;
};

export const buildHierarchyTree = (items: ResourceData[]): ResourceHierarchyNode[] => {
  const nodeById = new Map<ResourceData['id'], ResourceHierarchyNode>();
  const attachedAsChild = new Set<ResourceData['id']>();

  items.forEach((data) => {
    nodeById.set(data.id, { data, children: [] });
  });

  items.forEach((data) => {
    if (isRootItem(data, nodeById)) {
      return;
    }

    const node = nodeById.get(data.id);
    const { parentId } = data;

    if (node === undefined || parentId == null) {
      return;
    }

    if (isAncestorCycle(data.id, parentId, nodeById)) {
      return;
    }

    const parent = nodeById.get(parentId);

    if (parent === undefined) {
      return;
    }

    parent.children.push(node);
    attachedAsChild.add(data.id);
  });

  return items
    .filter((data) => !attachedAsChild.has(data.id))
    .map((data) => nodeById.get(data.id))
    .filter((node): node is ResourceHierarchyNode => node !== undefined);
};

export const collectHierarchyLeaves = (
  tree: ResourceHierarchyNode[],
): ResourceData[] => {
  const leaves: ResourceData[] = [];

  const walk = (node: ResourceHierarchyNode): void => {
    if (node.children.length === 0) {
      leaves.push(node.data);
      return;
    }

    node.children.forEach(walk);
  };

  tree.forEach(walk);

  return leaves;
};
