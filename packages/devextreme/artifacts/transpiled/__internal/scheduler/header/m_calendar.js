"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _calendar = _interopRequireDefault(require("../../../ui/calendar"));
var _ui = _interopRequireDefault(require("../../../ui/popover/ui.popover"));
var _ui2 = _interopRequireDefault(require("../../../ui/popup/ui.popup"));
var _ui3 = _interopRequireDefault(require("../../../ui/scroll_view/ui.scrollable"));
var _ui4 = _interopRequireDefault(require("../../../ui/widget/ui.widget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const CALENDAR_CLASS = 'dx-scheduler-navigator-calendar';
const CALENDAR_POPOVER_CLASS = 'dx-scheduler-navigator-calendar-popover';
class SchedulerCalendar extends _ui4.default {
  show(target) {
    if (!this._isMobileLayout()) {
      this._overlay.option('target', target);
    }
    this._overlay.show();
  }
  hide() {
    this._overlay.hide();
  }
  _keyboardHandler(opts) {
    var _this$_calendar;
    (_this$_calendar = this._calendar) === null || _this$_calendar === void 0 || _this$_calendar._keyboardHandler(opts);
  }
  _init() {
    // @ts-expect-error
    super._init();
    this.$element();
  }
  _render() {
    // @ts-expect-error
    super._render();
    this._renderOverlay();
  }
  _renderOverlay() {
    // @ts-expect-error
    this.$element().addClass(CALENDAR_POPOVER_CLASS);
    const isMobileLayout = this._isMobileLayout();
    const overlayType = isMobileLayout ? _ui2.default : _ui.default;
    // @ts-expect-error
    this._overlay = this._createComponent(this.$element(), overlayType, {
      contentTemplate: () => this._createOverlayContent(),
      onShown: () => this._calendar.focus(),
      defaultOptionsRules: [{
        device: () => isMobileLayout,
        options: {
          fullScreen: true,
          showCloseButton: false,
          toolbarItems: [{
            shortcut: 'cancel'
          }],
          _ignorePreventScrollEventsDeprecation: true,
          preventScrollEvents: false,
          enableBodyScroll: false
        }
      }]
    });
  }
  _createOverlayContent() {
    const result = (0, _renderer.default)('<div>').addClass(CALENDAR_CLASS);
    // @ts-expect-error
    this._calendar = this._createComponent(result, _calendar.default, this._getCalendarOptions());
    if (this._isMobileLayout()) {
      const scrollable = this._createScrollable(result);
      return scrollable.$element();
    }
    return result;
  }
  _createScrollable(content) {
    // @ts-expect-error
    const result = this._createComponent('<div>', _ui3.default, {
      height: 'auto',
      direction: 'both'
    });
    result.$content().append(content);
    return result;
  }
  _optionChanged(_ref) {
    var _this$_calendar2;
    let {
      name,
      value
    } = _ref;
    switch (name) {
      case 'value':
        (_this$_calendar2 = this._calendar) === null || _this$_calendar2 === void 0 || _this$_calendar2.option('value', value);
        break;
      default:
        break;
    }
  }
  _getCalendarOptions() {
    return {
      value: this.option('value'),
      min: this.option('min'),
      max: this.option('max'),
      firstDayOfWeek: this.option('firstDayOfWeek'),
      focusStateEnabled: this.option('focusStateEnabled'),
      onValueChanged: this.option('onValueChanged'),
      skipFocusCheck: true,
      tabIndex: this.option('tabIndex')
    };
  }
  _isMobileLayout() {
    return !_devices.default.current().generic;
  }
}
// @ts-expect-error
exports.default = SchedulerCalendar;
(0, _component_registrator.default)('dxSchedulerCalendarPopup', SchedulerCalendar);