import { isDefined } from '@js/core/utils/type';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

import treeListCore from '../../m_core';
import type { LoadOperation, NodeByKey, TreeNode } from '../types';

export interface NodesContext {
  rootValue: unknown;
  isFullBranchFilterMode: boolean;
  keyGetter: (data: unknown) => unknown;
  parentIdGetter: (data: unknown) => unknown;
  hasItemsGetter?: (data: unknown) => unknown;
  isChildrenLoaded: Record<string, boolean>;
}

export type ConvertContext = Pick<NodesContext, 'keyGetter' | 'parentIdGetter' | 'rootValue'>;

export type FillNodesContext = Pick<NodesContext, 'hasItemsGetter' | 'isChildrenLoaded' | 'isFullBranchFilterMode'>;

export function convertItemToNode(
  item: unknown,
  nodeByKey: NodeByKey,
  context: ConvertContext,
): TreeNode {
  const key = context.keyGetter(item) as string;
  const itemParentId = context.parentIdGetter(item);
  const parentId = (isDefined(itemParentId) ? itemParentId : context.rootValue) as string;

  const parentNode = nodeByKey[parentId] ?? { key: parentId, children: [] };
  nodeByKey[parentId] = parentNode;

  const node = nodeByKey[key] ?? { key, children: [] };
  nodeByKey[key] = node;

  node.data = item;
  node.parent = parentNode;

  return node;
}

export function createNodesByItems(
  items: RawItemData[],
  visibleItems: RawItemData[] | undefined,
  context: ConvertContext,
): { rootNode?: TreeNode; nodeByKey: NodeByKey } {
  const nodeByKey: NodeByKey = {};
  const visibleByKey: Record<string, boolean> = {};

  visibleItems?.forEach((item) => {
    visibleByKey[context.keyGetter(item) as string] = true;
  });

  for (const item of items) {
    const node = convertItemToNode(item, nodeByKey, context);

    if (node.key === undefined) {
      return { nodeByKey };
    }

    node.visible = !visibleItems || !!visibleByKey[node.key as string];
    if (node.parent) {
      node.parent.children.push(node);
    }
  }

  const rootNode = nodeByKey[context.rootValue as string] ?? {
    key: context.rootValue,
    children: [],
  };

  rootNode.level = -1;

  return { rootNode, nodeByKey };
}

function calculateHasChildren(
  node: TreeNode,
  options: LoadOperation,
  context: FillNodesContext,
): boolean {
  const { parentIds } = options.storeLoadOptions;
  const isFullBranch = context.isFullBranchFilterMode;
  const canUseHasItemsGetter = !!parentIds || !options.storeLoadOptions.filter || isFullBranch;

  const hasItemsFromData = context.hasItemsGetter && canUseHasItemsGetter
    ? context.hasItemsGetter(node.data)
    : undefined;

  if (hasItemsFromData !== undefined) {
    return !!hasItemsFromData;
  }

  const isChildrenLoaded = context.isChildrenLoaded[node.key as string];

  if (!isChildrenLoaded && options.remoteOperations?.filtering && (parentIds || isFullBranch)) {
    return true;
  }

  if (options.loadOptions?.filter && !options.remoteOperations?.filtering && isFullBranch) {
    return !!node.children.length;
  }

  return !!node.hasChildren;
}

// In `fullBranch` mode a node whose children are all filtered out stays collapsed
// and its whole branch becomes visible instead.
function resolveNeedToExpand(node: TreeNode, isFullBranch: boolean): boolean {
  if (!isFullBranch) {
    return true;
  }

  if (node.children.some((child) => child.visible)) {
    return true;
  }

  if (node.children.length) {
    treeListCore.foreachNodes(node.children, (child: TreeNode) => {
      child.visible = true;
    });
  }

  return false;
}

function fillNodesCore(
  nodes: TreeNode[],
  options: LoadOperation,
  context: FillNodesContext,
  expandedRowKeys: unknown[],
  level: number,
): void {
  nodes.forEach((node) => {
    fillNodesCore(node.children, options, context, expandedRowKeys, level + 1);

    node.level = level;
    node.hasChildren = calculateHasChildren(node, options, context);

    if (node.visible && node.hasChildren) {
      const needToExpand = resolveNeedToExpand(node, context.isFullBranchFilterMode);

      if (options.expandVisibleNodes && needToExpand) {
        expandedRowKeys.push(node.key);
      }
    }

    if (node.parent && (node.visible || node.hasChildren)) {
      node.parent.hasChildren = true;
    }
  });
}

export function fillNodes(
  nodes: TreeNode[],
  options: LoadOperation,
  context: FillNodesContext,
): unknown[] {
  const expandedRowKeys: unknown[] = [];

  fillNodesCore(nodes, options, context, expandedRowKeys, 0);

  return expandedRowKeys;
}

function collectVisibleNodes(
  nodes: TreeNode[],
  isRowExpanded: (key: unknown) => boolean,
  result: TreeNode[],
): void {
  nodes.forEach((node) => {
    if (node.visible) {
      result.push(node);
    }

    const shouldDescend = (isRowExpanded(node.key) || !node.visible)
      && node.hasChildren
      && node.children.length > 0;

    if (shouldDescend) {
      collectVisibleNodes(node.children, isRowExpanded, result);
    }
  });
}

export function getVisibleNodes(
  nodes: TreeNode[],
  isRowExpanded: (key: unknown) => boolean,
): TreeNode[] {
  const result: TreeNode[] = [];

  collectVisibleNodes(nodes, isRowExpanded, result);

  return result;
}
