import { getOuterWidth } from '../../../core/utils/size';
import { each } from '../../../core/utils/iterator';
import $ from '../../../core/renderer';
import { SortableConst } from './const';

function getTreeViewItem($sourceItem) {
  return $sourceItem
    .clone()
    .addClass(SortableConst.classes.areaBox)
    .css('width', parseInt(getOuterWidth($sourceItem)));
}

function getAreaBoxItem($sourceItem, target) {
  const $item = $sourceItem.clone();
  if (target === SortableConst.targets.drag) {
    each($sourceItem, (idx, sourceItem) => {
      const width = parseInt(getOuterWidth(sourceItem), 10);
      $item.eq(idx).css('width', width);
    });
  }

  return $item;
}

function getDefaultItem($sourceItem) {
  return $('<div>')
    .addClass(SortableConst.classes.areaField)
    .addClass(SortableConst.classes.areaBox)
    .text($sourceItem.text());
}

function getItem($sourceItem, target) {
  const isAreaBox = $sourceItem.hasClass(SortableConst.classes.areaBox);
  const isTreeList = $sourceItem.attr(SortableConst.attrs.treeViewItem);

  if (isAreaBox) {
    return getAreaBoxItem($sourceItem, target);
  }

  if (isTreeList) {
    return getTreeViewItem($sourceItem);
  }

  return getDefaultItem($sourceItem);
}

function wrapInFieldsContainer($item) {
  return $('<div>')
    .addClass(SortableConst.classes.fieldsContainer)
    .addClass(SortableConst.classes.widget)
    .append($item);
}

export function sortableItemRender($sourceItem, target) {
  const $item = getItem($sourceItem, target);
  return target === SortableConst.targets.drag
    ? wrapInFieldsContainer($item)
    : $item;
}
