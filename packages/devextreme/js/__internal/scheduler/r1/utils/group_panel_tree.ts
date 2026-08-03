import { getKeyHash } from '@js/core/utils/common';

import type {
  GroupHeaderHierarchy, GroupHeaderPathItem, GroupItem, GroupPanelTreeNode, GroupRenderItem,
} from '../../types';
import type { ResourceId } from '../../utils/loader/types';
import type { GroupNode } from '../../utils/resource_manager/types';
import type { ResourceCellTemplateData } from '../components/types';

export const stringifyId = (id: ResourceId): string => String(getKeyHash(id));

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
  parentPath: GroupHeaderPathItem[],
): GroupPanelTreeNode => {
  const key = `${parentKey}${node.resourceIndex}_${stringifyId(node.id)}`;
  const cell: GroupHeaderPathItem = {
    id: node.id,
    text: node.resourceText,
    color: node.color,
    resourceIndex: node.resourceIndex,
    data: buildGroupPanelData(node),
  };
  const path = [...parentPath, cell];
  const children = node.children.map(
    (child) => buildGroupPanelNode(child, `${key}_`, path),
  );
  const leafCount = children.length === 0
    ? 1
    : children.reduce((sum, child) => sum + child.leafCount, 0);

  return {
    key,
    ...cell,
    path,
    leafCount,
    children,
  };
};

export const buildGroupPanelTree = (
  groupsTree: GroupNode[],
): GroupPanelTreeNode[] => groupsTree.map(
  (node) => buildGroupPanelNode(node, '', []),
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

  const walk = (node: GroupPanelTreeNode, depth: number, isLastColumn: boolean): void => {
    const isLeaf = node.children.length === 0;
    const isShallowLeaf = isLeaf && depth < maxDepth - 1;

    rows[depth].push({
      id: node.id,
      text: node.text,
      color: node.color,
      key: node.key,
      resourceIndex: node.resourceIndex,
      data: node.data,
      isLeaf,
      isLastColumn,
      path: node.path,
      colSpan: node.leafCount * baseColSpan,
      ...(isShallowLeaf ? { rowSpan: maxDepth - depth } : {}),
    });

    node.children.forEach((child, index) => walk(
      child,
      depth + 1,
      isLastColumn && index === node.children.length - 1,
    ));
  };

  tree.forEach((node, index) => walk(node, 0, index === tree.length - 1));

  return rows;
};

const toGroupRenderItem = (
  node: GroupPanelTreeNode,
  baseColSpan: number,
): GroupRenderItem => ({
  id: node.id,
  text: node.text,
  color: node.color,
  key: node.key,
  resourceIndex: node.resourceIndex,
  data: node.data,
  isLeaf: node.children.length === 0,
  path: node.path,
  colSpan: baseColSpan,
});

export const flattenGroupPanelTreeToLeafRows = (
  tree: GroupPanelTreeNode[],
  baseColSpan: number,
): GroupRenderItem[][] => {
  const rows: GroupRenderItem[][] = [];

  const walk = (node: GroupPanelTreeNode, path: GroupRenderItem[]): void => {
    const currentPath = [...path, toGroupRenderItem(node, baseColSpan)];

    if (node.children.length === 0) {
      rows.push(currentPath);
      return;
    }

    node.children.forEach((child) => walk(child, currentPath));
  };

  tree.forEach((node) => walk(node, []));

  return rows;
};

interface GroupHeaderCellInfo extends Partial<GroupHeaderHierarchy> {
  id: ResourceId;
  text?: string;
  color?: string;
  resourceIndex?: string;
  data: GroupItem;
}

export const getResourceCellTemplateData = ({
  id, text, color, data, resourceIndex = '', isLeaf = true, path,
}: GroupHeaderCellInfo): ResourceCellTemplateData => {
  const cellPath = path?.length ? path : [{
    id, text, color, resourceIndex, data,
  }];

  return {
    data,
    id,
    text,
    color,
    resourceIndex,
    isLeaf,
    path: cellPath,
    level: cellPath.length - 1,
  };
};
