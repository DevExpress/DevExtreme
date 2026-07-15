import { equalByValue } from '@ts/core/utils/m_common';

import type { ResourceData } from '../loader/types';

export interface ResourceHierarchyNode {
  data: ResourceData;
  children: ResourceHierarchyNode[];
}

type PrimitiveId = string | number;

const isPrimitiveId = (id: ResourceData['id']): id is PrimitiveId => typeof id !== 'object' || id === null;

const createIdMap = <T>(): {
  get: (id: ResourceData['id']) => T | undefined;
  has: (id: ResourceData['id']) => boolean;
  set: (id: ResourceData['id'], value: T) => void;
} => {
  const byPrimitiveId = new Map<PrimitiveId, T>();
  const objectEntries: { id: ResourceData['id']; value: T }[] = [];

  const get = (id: ResourceData['id']): T | undefined => (isPrimitiveId(id)
    ? byPrimitiveId.get(id)
    : objectEntries.find((entry) => equalByValue(entry.id, id))?.value);

  return {
    get,
    has: (id: ResourceData['id']): boolean => get(id) !== undefined,
    set: (id: ResourceData['id'], value: T): void => {
      if (isPrimitiveId(id)) {
        byPrimitiveId.set(id, value);
      } else {
        objectEntries.push({ id, value });
      }
    },
  };
};

type NodeMap = ReturnType<typeof createIdMap<ResourceHierarchyNode>>;

const isRootItem = (
  item: ResourceData,
  nodeById: NodeMap,
): boolean => {
  const { parentId, id } = item;

  return parentId == null || !nodeById.has(parentId) || Boolean(equalByValue(parentId, id));
};

// Without this check, a parentId loop (A's parent is B, B's parent is A) causes a stack overflow
const isAncestorCycle = (
  id: ResourceData['id'],
  parentId: ResourceData['id'],
  nodeById: NodeMap,
): boolean => {
  const visited = createIdMap<true>();
  let currentId: ResourceData['id'] | null | undefined = parentId;

  while (currentId != null && !visited.has(currentId)) {
    if (equalByValue(currentId, id)) {
      return true;
    }

    visited.set(currentId, true);
    currentId = nodeById.get(currentId)?.data.parentId;
  }

  return false;
};

export const buildHierarchyTree = (items: ResourceData[]): ResourceHierarchyNode[] => {
  const nodeById = createIdMap<ResourceHierarchyNode>();
  const attachedAsChild = createIdMap<true>();

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
    attachedAsChild.set(data.id, true);
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
