"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DesktopTooltipStrategy = void 0;
var _support = require("../../../core/utils/support");
var _m_tooltip = _interopRequireDefault(require("../../ui/m_tooltip"));
var _m_tooltip_strategy_base = require("./m_tooltip_strategy_base");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const APPOINTMENT_TOOLTIP_WRAPPER_CLASS = 'dx-scheduler-appointment-tooltip-wrapper';
const MAX_TOOLTIP_HEIGHT = 200;
class DesktopTooltipStrategy extends _m_tooltip_strategy_base.TooltipStrategyBase {
  _prepareBeforeVisibleChanged(dataList) {
    this._tooltip.option('position', {
      my: 'bottom',
      at: 'top',
      boundary: this._getBoundary(dataList),
      offset: this._extraOptions.offset,
      collision: 'fit flipfit'
    });
  }
  _getBoundary(dataList) {
    return this._options.isAppointmentInAllDayPanel(dataList[0].appointment) ? this._options.container : this._options.getScrollableContainer();
  }
  _onShown() {
    super._onShown();
    if (this._extraOptions.isButtonClick) {
      this._list.focus();
      this._list.option('focusedElement', null);
    }
  }
  // @ts-expect-error
  _createListOption(target, dataList) {
    // @ts-expect-error
    const result = super._createListOption(target, dataList);
    // TODO:T724287 this condition is not covered by tests, because touch variable cannot be overridden.
    // In the future, it is necessary to cover the tests
    result.showScrollbar = _support.touch ? 'always' : 'onHover';
    return result;
  }
  _createTooltip(target, dataList) {
    const tooltip = this._createTooltipElement(APPOINTMENT_TOOLTIP_WRAPPER_CLASS);
    return this._options.createComponent(tooltip, _m_tooltip.default, {
      target,
      maxHeight: MAX_TOOLTIP_HEIGHT,
      rtlEnabled: this._extraOptions.rtlEnabled,
      onShown: this._onShown.bind(this),
      contentTemplate: this._getContentTemplate(dataList),
      wrapperAttr: {
        class: APPOINTMENT_TOOLTIP_WRAPPER_CLASS
      }
    });
  }
  _onListRender(e) {
    return this._extraOptions.dragBehavior && this._extraOptions.dragBehavior(e);
  }
  _onListItemContextMenu(e) {
    const contextMenuEventArgs = this._options.createEventArgs(e);
    this._options.onItemContextMenu(contextMenuEventArgs);
  }
}
exports.DesktopTooltipStrategy = DesktopTooltipStrategy;