import type { GroupLeaf, GroupNode, Resource } from './types';

export const groupResources = (resourceById: Record<string, Resource>, groups: string[]) => {
  const head: GroupNode[] = [{} as GroupNode];
  let leafs: GroupNode[] = head;

  groups.forEach((group) => {
    const resource = resourceById[group];
    const nodes = resource.items.map<GroupNode>((item) => ({
      text: item.text,
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
