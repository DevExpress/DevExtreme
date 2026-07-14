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

    const parent = nodeById.get(parentId);

    if (parent === undefined) {
      return;
    }

    parent.children.push(node);
    attachedAsChild.add(data.id);
  });

  const roots = items
    .filter((data) => !attachedAsChild.has(data.id))
    .map((data) => nodeById.get(data.id))
    .filter((node): node is ResourceHierarchyNode => node !== undefined);

  if (roots.length === 0 && items.length > 0) {
    return items
      .map((data) => nodeById.get(data.id))
      .filter((node): node is ResourceHierarchyNode => node !== undefined);
  }

  return roots;
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
