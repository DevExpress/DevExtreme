"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _guid = _interopRequireDefault(require("../../core/guid"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _ui = _interopRequireDefault(require("../../ui/popover/ui.popover"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TOOLTIP_CLASS = 'dx-tooltip';
const TOOLTIP_WRAPPER_CLASS = 'dx-tooltip-wrapper';
const Tooltip = _ui.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      toolbarItems: [],
      showCloseButton: false,
      enableBodyScroll: true,
      showTitle: false,
      title: null,
      titleTemplate: null,
      onTitleRendered: null,
      bottomTemplate: null,
      preventScrollEvents: false,
      propagateOutsideClick: true
    });
  },
  _render() {
    this.$element().addClass(TOOLTIP_CLASS);
    this.$wrapper().addClass(TOOLTIP_WRAPPER_CLASS);
    this.callBase();
  },
  _renderContent() {
    this.callBase();
    this._toggleAriaAttributes();
  },
  _toggleAriaDescription(showing) {
    const $target = (0, _renderer.default)(this.option('target'));
    const label = showing ? this._contentId : undefined;
    if (!(0, _type.isWindow)($target.get(0))) {
      this.setAria('describedby', label, $target);
    }
  },
  _toggleAriaAttributes() {
    this._contentId = `dx-${new _guid.default()}`;
    this.$overlayContent().attr({
      id: this._contentId
    });
    this._toggleAriaDescription(true);
  }
});
(0, _component_registrator.default)('dxTooltip', Tooltip);
var _default = exports.default = Tooltip;