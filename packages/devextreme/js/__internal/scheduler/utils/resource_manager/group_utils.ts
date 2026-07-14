import type { ResourceLoader } from '../loader/resource_loader';
import type { ResourceId } from '../loader/types';
import type { ResourceHierarchyNode } from './hierarchy_tree_utils';
import type { GroupLeaf, GroupNode } from './types';

const isVirtualRoot = (node: GroupNode): boolean => !node.resourceIndex;

const createFlatResourceNodes = (
  resource: ResourceLoader,
  parentGrouped: Record<string, ResourceId>,
): GroupNode[] => resource.items.map((item) => ({
  resourceText: item.text,
  resourceIndex: resource.resourceIndex,
  grouped: { ...parentGrouped, [resource.resourceIndex]: item.id },
  children: [],
}));

const hierarchyToGroupNodes = (
  hierarchyNodes: ResourceHierarchyNode[],
  resourceIndex: string,
  parentGrouped: Record<string, ResourceId>,
): GroupNode[] => hierarchyNodes.map((node) => {
  const grouped = { ...parentGrouped, [resourceIndex]: node.data.id };

  return {
    resourceText: node.data.text,
    resourceIndex,
    grouped,
    children: hierarchyToGroupNodes(node.children, resourceIndex, grouped),
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
  parentGrouped: Record<string, ResourceId>,
): GroupNode[] => {
  if (resource.hasHierarchy) {
    return hierarchyToGroupNodes(resource.hierarchyTree, resource.resourceIndex, parentGrouped);
  }

  return createFlatResourceNodes(resource, parentGrouped);
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
  if (!groups.length || Object.keys(resourceById).length === 0) {
    return {
      groupTree: [],
      groupLeafs: [],
    };
  }

  const head: GroupNode[] = [{} as GroupNode];
  let leafs: GroupNode[] = head;

  groups
    .filter((group) => resourceById[group])
    .forEach((group) => {
      const resource = resourceById[group];
      const nodes = createResourceNodes(resource, {});

      if (isVirtualRoot(leafs[0])) {
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
