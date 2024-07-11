"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dragAndDropItemRender = dragAndDropItemRender;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _size = require("../../../../core/utils/size");
var _const = require("./const");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// === Drag-N-Drop item render ===
function getTreeViewItem($sourceItem) {
  return $sourceItem.clone().addClass(_const.CLASSES.area.box).css('width', parseFloat((0, _size.getOuterWidth)($sourceItem)));
}
function getAreaBoxItemArray($sourceItem, target) {
  const $itemArray = $sourceItem.clone();
  if (target === _const.SORTABLE_CONST.targets.drag) {
    $sourceItem.each((idx, sourceItem) => {
      const width = parseFloat((0, _size.getOuterWidth)(sourceItem));
      $itemArray.eq(idx).css('width', width);
      return true;
    });
  }
  return $itemArray;
}
function getDefaultItem($sourceItem) {
  return (0, _renderer.default)('<div>').addClass(_const.CLASSES.area.field).addClass(_const.CLASSES.area.box).text($sourceItem.text());
}
function getItemArray($sourceItem, target) {
  const isAreaBox = $sourceItem.hasClass(_const.CLASSES.area.box);
  const isTreeList = $sourceItem.attr(_const.ATTRIBUTES.treeViewItem);
  if (isAreaBox) {
    return getAreaBoxItemArray($sourceItem, target);
  }
  if (isTreeList) {
    return getTreeViewItem($sourceItem);
  }
  return getDefaultItem($sourceItem);
}
function wrapItemsInFieldsContainer($itemArray) {
  const $wrappedTmpContainer = (0, _renderer.default)('<div>');
  $itemArray.each((_, item) => {
    const $wrappedItem = (0, _renderer.default)('<div>').addClass(_const.CLASSES.pivotGrid.fieldsContainer).addClass(_const.CLASSES.widget).append((0, _renderer.default)(item));
    $wrappedTmpContainer.append($wrappedItem);
    return true;
  });
  return $wrappedTmpContainer.children();
}
function dragAndDropItemRender($sourceItem, target) {
  const $itemArray = getItemArray($sourceItem, target);
  if (target === _const.SORTABLE_CONST.targets.drag) {
    return wrapItemsInFieldsContainer($itemArray);
  }
  return $itemArray;
}