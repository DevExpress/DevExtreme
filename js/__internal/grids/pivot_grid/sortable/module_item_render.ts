/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types  */
import { getOuterWidth } from '@js/core/utils/size';
import { each } from '@js/core/utils/iterator';
import $ from '@js/core/renderer';
import { SortableConst } from './const';

function getTreeViewItem($sourceItem) {
  return $sourceItem
    .clone()
    .addClass(SortableConst.classes.areaBox)
    // eslint-disable-next-line radix
    .css('width', parseFloat(getOuterWidth($sourceItem)));
}

function getAreaBoxItemArray($sourceItem, target) {
  const $itemArray = $sourceItem.clone();
  if (target === SortableConst.targets.drag) {
    each($sourceItem, (idx, sourceItem) => {
      const width = parseFloat(getOuterWidth(sourceItem));
      $itemArray.eq(idx).css('width', width);
    });
  }

  return $itemArray;
}

function getDefaultItem($sourceItem) {
  return $('<div>')
    .addClass(SortableConst.classes.areaField)
    .addClass(SortableConst.classes.areaBox)
    .text($sourceItem.text());
}

function getItemArray($sourceItem, target) {
  const isAreaBox = $sourceItem.hasClass(SortableConst.classes.areaBox);
  const isTreeList = $sourceItem.attr(SortableConst.attrs.treeViewItem);

  if (isAreaBox) {
    return getAreaBoxItemArray($sourceItem, target);
  }

  if (isTreeList) {
    return getTreeViewItem($sourceItem);
  }

  return getDefaultItem($sourceItem);
}

function wrapItemsInFieldsContainer($itemArray) {
  const $wrappedTmpContainer = $('<div>');

  each($itemArray, (_, item) => {
    const $wrappedItem = $('<div>')
      .addClass(SortableConst.classes.fieldsContainer)
      .addClass(SortableConst.classes.widget)
      .append($(item));
    $wrappedTmpContainer.append($wrappedItem);
  });

  return $wrappedTmpContainer.children();
}

export function sortableItemRender($sourceItem, target) {
  const $itemArray = getItemArray($sourceItem, target);

  return target === SortableConst.targets.drag
    ? wrapItemsInFieldsContainer($itemArray)
    : $itemArray;
}
