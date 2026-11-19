/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable func-names */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-use-before-define */

import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type { ProcessedDataItems } from '@ts/viz/tree_map/tree_map.base';
import TreeMapBase from '@ts/viz/tree_map/tree_map.base';

const proto = TreeMapBase.prototype;

proto._optionChangesMap.idField = proto._optionChangesMap.parentField = 'NODES_CREATE';

proto._processDataSourceItems = function (
  this: TreeMapBase,
  items: ThemeValue[],
): ProcessedDataItems {
  let i;
  const struct = {};
  let currentItem;
  const idField = this._getOption('idField', true);
  const parentField = this._getOption('parentField', true);
  let parentId;
  const rootNodes: ThemeValue[] = [];
  let tmpItems;
  let item;

  if (!idField || !parentField || items.length === 0) {
    return { items, isPlain: false };
  }

  for (i = 0; i < items.length; i += 1) {
    currentItem = items[i];
    parentId = currentItem[parentField];
    if (parentId) {
      struct[parentId] = struct[parentId] || { items: [] };
      tmpItems = struct[parentId].items;
    } else {
      tmpItems = rootNodes;
    }
    tmpItems.push(currentItem);
  }

  treeFiller({ struct, idField }, rootNodes);

  for (item in struct) {
    struct[item] && rootNodes.push(struct[item]);
  }

  return { items: rootNodes, isPlain: true };
};

function treeFiller(context, items): void {
  let currentItem;
  let i;
  const { struct } = context;
  let id;

  for (i = 0; i < items.length; i += 1) {
    currentItem = items[i];
    id = currentItem[context.idField];
    if (struct[id]) {
      currentItem.items = struct[id].items;
      struct[id] = null;
      treeFiller(context, currentItem.items);
    }
  }
}
