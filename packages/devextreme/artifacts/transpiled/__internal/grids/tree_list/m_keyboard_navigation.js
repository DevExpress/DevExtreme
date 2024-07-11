"use strict";

var _extend = require("../../../core/utils/extend");
var _m_keyboard_navigation = require("../../grids/grid_core/keyboard_navigation/m_keyboard_navigation");
var _scrollable_a11y = require("../../grids/grid_core/keyboard_navigation/scrollable_a11y");
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const keyboardNavigation = Base => class TreeListKeyboardNavigationControllerExtender extends (0, _scrollable_a11y.keyboardNavigationScrollableA11yExtender)(Base) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _leftRightKeysHandler(eventArgs, _isEditing) {
    const rowIndex = this.getVisibleRowIndex();
    const dataController = this._dataController;
    if (eventArgs.ctrl) {
      const directionCode = this._getDirectionCodeByKey(eventArgs.keyName);
      const key = dataController.getKeyByRowIndex(rowIndex);
      if (directionCode === 'nextInRow') {
        // @ts-expect-error
        dataController.expandRow(key);
      } else {
        // @ts-expect-error
        dataController.collapseRow(key);
      }
    } else {
      return super._leftRightKeysHandler.apply(this, arguments);
    }
  }
};
_m_core.default.registerModule('keyboardNavigation', (0, _extend.extend)(true, {}, _m_keyboard_navigation.keyboardNavigationModule, {
  extenders: {
    controllers: {
      keyboardNavigation
    }
  }
}));