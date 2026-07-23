import { getKeyHash } from '@js/core/utils/common';

import type { ResourceLoader } from '../loader/resource_loader';
import type { RawResourceData, ResourceId } from '../loader/types';
import type { ResourceHierarchyNode } from './hierarchy_tree_utils';
import type { GroupLeaf, GroupNode } from './types';

const isVirtualRoot = (node: GroupNode): boolean => !node.resourceIndex;

const findRawResourceData = (
  resource: ResourceLoader,
  id: ResourceId,
): RawResourceData | undefined => {
  const idHash = getKeyHash(id);

  return resource.data.find(
    (item) => getKeyHash(resource.dataAccessor.get('id', item)) === idHash,
  );
};

const createFlatResourceNodes = (
  resource: ResourceLoader,
): GroupNode[] => resource.items.map((item, index) => ({
  id: item.id,
  resourceText: item.text,
  color: item.color,
  resourceIndex: resource.resourceIndex,
  grouped: { [resource.resourceIndex]: item.id },
  children: [],
  resourceData: resource.data[index],
}));

const hierarchyToGroupNodes = (
  hierarchyNodes: ResourceHierarchyNode[],
  resource: ResourceLoader,
  parentGrouped: Record<string, ResourceId>,
): GroupNode[] => hierarchyNodes.map((node) => {
  const grouped = { ...parentGrouped, [resource.resourceIndex]: node.data.id };

  return {
    id: node.data.id,
    resourceText: node.data.text,
    color: node.data.color,
    resourceIndex: resource.resourceIndex,
    grouped,
    resourceData: findRawResourceData(resource, node.data.id),
    children: hierarchyToGroupNodes(node.children, resource, grouped),
  };
});

const collectGroupLeaves = (nodes: GroupNode[]): GroupNode[] => {
  const leaves: GroupNode[] = [];

  const walk = (node: GroupNode): void => {
    if (node.children.length === 0) {
      leaves.push(node);
      return;
    }

    node.children.forEach(walk);
  };

  nodes.forEach(walk);

  return leaves;
};

const mergeGroupedIntoTree = (
  node: GroupNode,
  parentGrouped: Record<string, ResourceId>,
): GroupNode => ({
  ...node,
  grouped: { ...parentGrouped, ...node.grouped },
  children: node.children.map((child) => mergeGroupedIntoTree(child, parentGrouped)),
});

const createResourceNodes = (
  resource: ResourceLoader,
): GroupNode[] => {
  if (resource.hasHierarchy) {
    return hierarchyToGroupNodes(resource.hierarchyTree, resource, {});
  }

  return createFlatResourceNodes(resource);
};

const attachResourceNodes = (
  leafs: GroupNode[],
  nodes: GroupNode[],
): GroupNode[] => {
  const nextLeafs: GroupNode[] = [];

  leafs.forEach((leaf) => {
    leaf.children = nodes.map((node) => mergeGroupedIntoTree(node, leaf.grouped));

    leaf.children.forEach((child) => {
      nextLeafs.push(...collectGroupLeaves([child]));
    });
  });

  return nextLeafs;
};

export const groupResources = (resourceById: Record<string, ResourceLoader>, groups: string[]): {
  groupTree: GroupNode[];
  groupLeafs: GroupLeaf[];
} => {
  const validGroups = groups.filter((group) => resourceById[group]);

  if (!validGroups.length) {
    return {
      groupTree: [],
      groupLeafs: [],
    };
  }

  const head: GroupNode[] = [{
    id: '',
    resourceText: '',
    resourceIndex: '',
    grouped: {},
    children: [],
  }];
  let leafs: GroupNode[] = head;

  validGroups.forEach((group) => {
    const resource = resourceById[group];
    const nodes = createResourceNodes(resource);

    if (leafs.length > 0 && isVirtualRoot(leafs[0])) {
      head[0].children = nodes;
      leafs = collectGroupLeaves(nodes);
      return;
    }

    leafs = attachResourceNodes(leafs, nodes);
  });

  const groupLeafs = leafs.map<GroupLeaf>((leaf, index) => ({
    ...leaf,
    groupIndex: index,
  }));

  return {
    groupTree: head[0].children,
    groupLeafs,
  };
};

export const getAllGroupValues = (
  groupsLeafs: GroupLeaf[],
): GroupLeaf['grouped'][] => groupsLeafs.map((group) => group.grouped);

export const getLeafGroupValues = (
  groupsLeafs: GroupLeaf[],
  groupIndex: GroupLeaf['groupIndex'] | undefined,
): GroupLeaf['grouped'] => groupsLeafs.find((group) => group.groupIndex === groupIndex)?.grouped ?? {};

export const getGroupTexts = (
  groups: string[],
  groupsLeafs: GroupLeaf[],
  resourceById: Record<string, ResourceLoader>,
  groupIndex: GroupLeaf['groupIndex'],
): string[] => {
  const leafGroups = getLeafGroupValues(groupsLeafs, groupIndex);
  const textPath = groups.map((resourceIndex) => {
    const resourceId = leafGroups[resourceIndex];
    const resource = resourceById[resourceIndex];

    return resource?.items.find((item) => item.id === resourceId)?.text;
  }).filter(Boolean);

  return textPath as string[];
};

export const getResourcesByGroupIndex = (
  groupsLeafs: GroupLeaf[],
  resourceById: Record<string, ResourceLoader>,
  groupIndex: GroupLeaf['groupIndex'],
): ResourceLoader[] => {
  const leafGroups = getLeafGroupValues(groupsLeafs, groupIndex);

  return Object.entries(resourceById)
    .filter(([resourceIndex]) => leafGroups[resourceIndex] !== undefined)
    .map(([resourceIndex, resource]) => ({
      ...resource,
      items: resource.items.filter((item) => item.id === leafGroups[resourceIndex]),
    }) as ResourceLoader);
};
