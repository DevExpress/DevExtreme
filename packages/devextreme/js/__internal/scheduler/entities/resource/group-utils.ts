import type { ResourceLoader } from './loader';
import type { GroupLeaf, GroupNode } from './types';

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
      const nodes = resource.items.map<GroupNode>((item) => ({
        resourceText: item.text,
        resourceIndex: resource.resourceIndex,
        grouped: { [resource.resourceIndex]: item.id },
        children: [],
      }));
      const nextLeafs: GroupNode[] = [];

      leafs.forEach((leaf) => {
        leaf.children = nodes.map((node) => ({
          ...node,
          grouped: { ...node.grouped, ...leaf.grouped },
        }));
        nextLeafs.push(...leaf.children);
      });
      leafs = nextLeafs;
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
    .map(([resourceIndex, resource]) => {
      const filteredResource = {
        ...resource,
        items: resource.items.filter((item) => item.id === leafGroups[resourceIndex]),
      };
      return filteredResource as ResourceLoader;
    });
};
