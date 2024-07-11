"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("../../../ui/toolbar");
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _extend = require("../../../core/utils/extend");
var _ui = _interopRequireDefault(require("../../../ui/popover/ui.popover"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class PopoverFull extends _ui.default {
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      preventScrollEvents: false
    });
  }
  _getToolbarName() {
    return 'dxToolbar';
  }
}
// @ts-expect-error
exports.default = PopoverFull;
PopoverFull.defaultOptions = function (rule) {
  _ui.default.defaultOptions(rule);
};
// @ts-expect-error
(0, _component_registrator.default)('dxPopover', PopoverFull);