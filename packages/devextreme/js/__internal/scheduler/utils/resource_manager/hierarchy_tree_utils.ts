import { getKeyHash } from '@ts/core/utils/m_common';

import type { ResourceData } from '../loader/types';

export interface ResourceHierarchyNode {
  data: ResourceData;
  children: ResourceHierarchyNode[];
}

// ResourceId can be an object, so ids need hashing to be usable as Map/Set keys
const hashOf = (id: ResourceData['id']): string | number => getKeyHash(id) as string | number;

const isRootItem = (
  item: ResourceData,
  nodeByHash: Map<string | number, ResourceHierarchyNode>,
): boolean => {
  const { parentId, id } = item;

  return parentId == null || !nodeByHash.has(hashOf(parentId)) || hashOf(parentId) === hashOf(id);
};

// Without this check, a parentId loop (A's parent is B, B's parent is A) causes a stack overflow
const isAncestorCycle = (
  id: ResourceData['id'],
  parentId: ResourceData['id'],
  nodeByHash: Map<string | number, ResourceHierarchyNode>,
): boolean => {
  const targetHash = hashOf(id);
  const visited = new Set<string | number>();
  let currentId: ResourceData['id'] | null | undefined = parentId;

  while (currentId != null && !visited.has(hashOf(currentId))) {
    if (hashOf(currentId) === targetHash) {
      return true;
    }

    visited.add(hashOf(currentId));
    currentId = nodeByHash.get(hashOf(currentId))?.data.parentId;
  }

  return false;
};

export const buildHierarchyTree = (items: ResourceData[]): ResourceHierarchyNode[] => {
  const nodeByHash = new Map<string | number, ResourceHierarchyNode>();
  const attachedHashes = new Set<string | number>();

  items.forEach((data) => {
    nodeByHash.set(hashOf(data.id), { data, children: [] });
  });

  items.forEach((data) => {
    if (isRootItem(data, nodeByHash)) {
      return;
    }

    const node = nodeByHash.get(hashOf(data.id));
    const { parentId } = data;

    if (node === undefined || parentId == null) {
      return;
    }

    if (isAncestorCycle(data.id, parentId, nodeByHash)) {
      return;
    }

    const parent = nodeByHash.get(hashOf(parentId));

    if (parent === undefined) {
      return;
    }

    parent.children.push(node);
    attachedHashes.add(hashOf(data.id));
  });

  return items
    .filter((data) => !attachedHashes.has(hashOf(data.id)))
    .map((data) => nodeByHash.get(hashOf(data.id)))
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
