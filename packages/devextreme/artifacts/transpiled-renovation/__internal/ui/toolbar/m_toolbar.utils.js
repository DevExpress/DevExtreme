"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleItemFocusableElementTabIndex = toggleItemFocusableElementTabIndex;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const TOOLBAR_ITEMS = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];
const getItemInstance = function ($element) {
  const itemData = $element.data && $element.data();
  const dxComponents = itemData && itemData.dxComponents;
  const widgetName = dxComponents && dxComponents[0];
  return widgetName && itemData[widgetName];
};
function toggleItemFocusableElementTabIndex(context, item) {
  var _itemData$options;
  if (!context) return;
  const $item = context._findItemElementByItem(item);
  if (!$item.length) {
    return;
  }
  const itemData = context._getItemData($item);
  const isItemNotFocusable = !!((_itemData$options = itemData.options) !== null && _itemData$options !== void 0 && _itemData$options.disabled || itemData.disabled || context.option('disabled'));
  const {
    widget
  } = itemData;
  if (widget && TOOLBAR_ITEMS.includes(widget)) {
    const $widget = $item.find(widget.toLowerCase().replace('dx', '.dx-'));
    if ($widget.length) {
      var _itemInstance$_focusT, _itemData$options2;
      const itemInstance = getItemInstance($widget);
      if (!itemInstance) {
        return;
      }
      let $focusTarget = (_itemInstance$_focusT = itemInstance._focusTarget) === null || _itemInstance$_focusT === void 0 ? void 0 : _itemInstance$_focusT.call(itemInstance);
      if (widget === 'dxDropDownButton') {
        $focusTarget = $focusTarget && $focusTarget.find(`.${BUTTON_GROUP_CLASS}`);
      } else {
        $focusTarget = $focusTarget ?? (0, _renderer.default)(itemInstance.element());
      }
      const tabIndex = (_itemData$options2 = itemData.options) === null || _itemData$options2 === void 0 ? void 0 : _itemData$options2.tabIndex;
      if (isItemNotFocusable) {
        $focusTarget.attr('tabIndex', -1);
      } else {
        $focusTarget.attr('tabIndex', tabIndex ?? 0);
      }
    }
  }
}