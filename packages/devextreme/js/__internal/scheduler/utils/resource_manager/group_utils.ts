import { isObject } from '@js/core/utils/type';

import type { GroupRenderItem } from '../../types';
import type { ResourceLoader } from '../loader/resource_loader';
import type { ResourceData, ResourceId } from '../loader/types';
import type { GroupLeaf, GroupNode } from './types';

const stringifyId = (id: ResourceId): string => (isObject(id)
  ? JSON.stringify(id)
  : String(id));

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

      // Check if this resource has a parent resource for filtering
      const { parentResource: parentResourceIndex, parentFieldExpr } = resource;

      leafs.forEach((leaf) => {
        let itemsToUse = resource.items;

        // Filter child resource items based on parent resource value
        if (parentResourceIndex && resourceById[parentResourceIndex] && parentFieldExpr) {
          const parentValue = leaf.grouped[parentResourceIndex];

          itemsToUse = resource.items.filter((item) => {
            // Find raw data item by id
            const rawDataItem = resource.data.find((rawItem) => {
              const rawId = resource.dataAccessor.get('id', rawItem);
              return rawId === item.id || (rawItem as Record<string, unknown>).id === item.id;
            });

            if (!rawDataItem) return false;

            // Get parent field value from raw data
            const rawDataRecord = rawDataItem as Record<string, unknown>;
            const itemParentValue = rawDataRecord[parentFieldExpr]
              ?? resource.dataAccessor.get(parentFieldExpr, rawDataItem);

            // Compare with parent value from leaf
            return itemParentValue === parentValue;
          });
        }

        const nodes = itemsToUse.map<GroupNode>((item) => ({
          resourceText: item.text,
          resourceIndex: resource.resourceIndex,
          grouped: { [resource.resourceIndex]: item.id },
          children: [],
        }));

        leaf.children = nodes.map((node) => ({
          ...node,
          grouped: { ...node.grouped, ...leaf.grouped },
        }));
      });

      // Prepare next level leafs
      const nextLeafs: GroupNode[] = [];
      leafs.forEach((leaf) => {
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
    .map(([resourceIndex, resource]) => ({
      ...resource,
      items: resource.items.filter((item) => item.id === leafGroups[resourceIndex]),
    }) as ResourceLoader);
};

const createGroupRenderItem = (
  item: ResourceData,
  resourceIndex: string,
  resourceName?: string,
  rowSpan?: number,
): GroupRenderItem => {
  const result: GroupRenderItem = {
    id: item.id as number | string,
    text: item.text,
    color: item.color,
    key: `${resourceIndex}_${stringifyId(item.id)}`,
    resourceName: resourceName ?? resourceIndex,
    data: {
      id: item.id as number | string,
      text: item.text,
      color: item.color,
    },
  };

  if (rowSpan) {
    result.rowSpan = rowSpan;
  }

  return result;
};

export const createGroupPanelDataFromTree = (
  groupsTree: GroupNode[],
  resourceById: Record<string, ResourceLoader>,
  groups: string[],
  columnCountPerGroup: number,
  groupByDate: boolean,
  baseColSpan: number,
): { groupPanelItems: GroupRenderItem[][]; baseColSpan: number } => {
  const groupPanelItems: GroupRenderItem[][] = [];

  groups.forEach((resourceIndex, groupIndex) => {
    const resource = resourceById[resourceIndex];
    if (!resource) return;

    if (groupIndex === 0) {
      // Parent level: create items with rowSpan based on child count
      const items: GroupRenderItem[] = [];
      const processedItems = new Set<ResourceId>();

      groupsTree.forEach((parentNode) => {
        const itemId = parentNode.grouped[resourceIndex];
        if (itemId !== undefined && !processedItems.has(itemId)) {
          processedItems.add(itemId);
          const item = resource.items.find((i) => i.id === itemId);
          if (item) {
            // Calculate rowSpan as sum of children across all matching parent nodes
            const rowSpan = groupsTree
              .filter((node) => node.grouped[resourceIndex] === itemId)
              .reduce((sum, node) => sum + (node.children?.length ?? 1), 0);

            items.push(createGroupRenderItem(item, resourceIndex, resource.resourceName, rowSpan));
          }
        }
      });

      groupPanelItems.push(items);
    } else {
      // Child levels: collect all unique items
      const uniqueItems = new Map<ResourceId, GroupRenderItem>();

      const collectItems = (nodes: GroupNode[]): void => {
        nodes.forEach((node) => {
          const itemId = node.grouped[resourceIndex];
          if (itemId !== undefined && !uniqueItems.has(itemId)) {
            const item = resource.items.find((i) => i.id === itemId);
            if (item) {
              uniqueItems.set(
                itemId,
                createGroupRenderItem(item, resourceIndex, resource.resourceName),
              );
            }
          }

          if (node.children) {
            collectItems(node.children);
          }
        });
      };

      collectItems(groupsTree);
      groupPanelItems.push(Array.from(uniqueItems.values()));
    }
  });

  return { groupPanelItems, baseColSpan };
};
