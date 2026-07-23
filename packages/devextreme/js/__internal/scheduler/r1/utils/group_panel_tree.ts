import { isObject } from '@js/core/utils/type';

import type { GroupItem, GroupPanelTreeNode, GroupRenderItem } from '../../types';
import type { ResourceId } from '../../utils/loader/types';
import type { GroupNode } from '../../utils/resource_manager/types';

export const stringifyId = (id: ResourceId): string => (isObject(id)
  ? JSON.stringify(id)
  : String(id));

const buildGroupPanelData = (node: GroupNode): GroupItem => {
  if (node.resourceData) {
    return node.resourceData as GroupItem;
  }

  const data: GroupItem = { id: node.id, text: node.resourceText };

  if (node.color !== undefined) {
    data.color = node.color;
  }

  return data;
};

const buildGroupPanelNode = (
  node: GroupNode,
  parentKey: string,
): GroupPanelTreeNode => {
  const key = `${parentKey}${node.resourceIndex}_${stringifyId(node.id)}`;
  const children = node.children.map(
    (child) => buildGroupPanelNode(child, `${key}_`),
  );
  const leafCount = children.length === 0
    ? 1
    : children.reduce((sum, child) => sum + child.leafCount, 0);

  return {
    key,
    id: node.id,
    text: node.resourceText,
    color: node.color,
    data: buildGroupPanelData(node),
    resourceIndex: node.resourceIndex,
    leafCount,
    children,
  };
};

export const buildGroupPanelTree = (
  groupsTree: GroupNode[],
): GroupPanelTreeNode[] => groupsTree.map(
  (node) => buildGroupPanelNode(node, ''),
);

export const getGroupPanelTreeDepth = (tree: GroupPanelTreeNode[]): number => {
  if (tree.length === 0) {
    return 0;
  }

  return 1 + Math.max(...tree.map((node) => getGroupPanelTreeDepth(node.children)));
};

export const flattenGroupPanelTreeToRows = (
  tree: GroupPanelTreeNode[],
  maxDepth: number,
  baseColSpan: number,
): GroupRenderItem[][] => {
  const rows: GroupRenderItem[][] = Array.from({ length: maxDepth }, () => []);

  const walk = (node: GroupPanelTreeNode, depth: number): void => {
    const isShallowLeaf = node.children.length === 0 && depth < maxDepth - 1;

    rows[depth].push({
      id: node.id,
      text: node.text,
      color: node.color,
      key: node.key,
      resourceIndex: node.resourceIndex,
      data: node.data,
      colSpan: node.leafCount * baseColSpan,
      ...(isShallowLeaf ? { rowSpan: maxDepth - depth } : {}),
    });

    node.children.forEach((child) => walk(child, depth + 1));
  };

  tree.forEach((node) => walk(node, 0));

  return rows;
};
