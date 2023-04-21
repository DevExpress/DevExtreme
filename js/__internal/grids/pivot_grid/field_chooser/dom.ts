import $, { dxElementWrapper } from '@js/core/renderer';
import { getOuterWidth } from '@js/core/utils/size';

import { ATTRIBUTES, CLASSES, SORTABLE_CONST } from './const';

// === Drag-N-Drop item render ===

function getTreeViewItem($sourceItem: dxElementWrapper): dxElementWrapper {
  return $sourceItem
    .clone()
    .addClass(CLASSES.area.box)
    .css('width', parseFloat(getOuterWidth($sourceItem)));
}

function getAreaBoxItemArray($sourceItem: dxElementWrapper, target: string): dxElementWrapper {
  const $itemArray = $sourceItem.clone();
  if (target === SORTABLE_CONST.targets.drag) {
    $sourceItem.each((idx, sourceItem) => {
      const width = parseFloat(getOuterWidth(sourceItem));
      $itemArray.eq(idx).css('width', width);
      return true;
    });
  }

  return $itemArray;
}

function getDefaultItem($sourceItem: dxElementWrapper): dxElementWrapper {
  return $('<div>')
    .addClass(CLASSES.area.field)
    .addClass(CLASSES.area.box)
    .text($sourceItem.text());
}

function getItemArray($sourceItem: dxElementWrapper, target: string): dxElementWrapper {
  const isAreaBox = $sourceItem.hasClass(CLASSES.area.box);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isTreeList = ($sourceItem as any).attr(ATTRIBUTES.treeViewItem);

  if (isAreaBox) {
    return getAreaBoxItemArray($sourceItem, target);
  }

  if (isTreeList) {
    return getTreeViewItem($sourceItem);
  }

  return getDefaultItem($sourceItem);
}

function wrapItemsInFieldsContainer($itemArray: dxElementWrapper): dxElementWrapper {
  const $wrappedTmpContainer: dxElementWrapper = $('<div>');

  $itemArray.each((_, item) => {
    const $wrappedItem = $('<div>')
      .addClass(CLASSES.pivotGrid.fieldsContainer)
      .addClass(CLASSES.widget)
      .append($(item));
    $wrappedTmpContainer.append($wrappedItem);
    return true;
  });

  return $wrappedTmpContainer.children();
}

export function dragAndDropItemRender(
  $sourceItem: dxElementWrapper,
  target: string,
): dxElementWrapper {
  const $itemArray = getItemArray($sourceItem, target);

  if (target === SORTABLE_CONST.targets.drag) {
    return wrapItemsInFieldsContainer($itemArray);
  }

  return $itemArray;
}
