import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import Calendar from '@js/ui/calendar';
import Popover from '@js/ui/popover/ui.popover';
import Popup from '@js/ui/popup/ui.popup';
import type { dxSchedulerOptions } from '@js/ui/scheduler';
import Scrollable from '@js/ui/scroll_view/ui.scrollable';
import Widget from '@js/ui/widget/ui.widget';

const CALENDAR_CLASS = 'dx-scheduler-navigator-calendar';
const CALENDAR_POPOVER_CLASS = 'dx-scheduler-navigator-calendar-popover';

export default class SchedulerCalendar extends Widget<dxSchedulerOptions> {
  _overlay: any;

  _calendar: any;

  show(target) {
    if (!this._isMobileLayout()) {
      this._overlay.option('target', target);
    }
    this._overlay.show();
  }

  hide() {
    this._overlay.hide();
  }

  _keyboardHandler(opts): void {
    this._calendar?._keyboardHandler(opts);
  }

  _init(): void {
    // @ts-expect-error
    super._init();
    this.$element();
  }

  _render(): void {
    // @ts-expect-error
    super._render();
    this._renderOverlay();
  }

  _renderOverlay(): void {
    this.$element().addClass(CALENDAR_POPOVER_CLASS);

    const isMobileLayout = this._isMobileLayout();

    const overlayType = isMobileLayout ? Popup : Popover;

    // @ts-expect-error
    this._overlay = this._createComponent(this.$element(), overlayType, {
      contentTemplate: () => this._createOverlayContent(),
      onShown: () => this._calendar.focus(),
      defaultOptionsRules: [
        {
          device: () => isMobileLayout,
          options: {
            fullScreen: true,
            showCloseButton: false,
            toolbarItems: [{ shortcut: 'cancel' }],
            _ignorePreventScrollEventsDeprecation: true,
            preventScrollEvents: false,
            enableBodyScroll: false,
          },
        },
      ],
    });
  }

  _createOverlayContent() {
    const result = $('<div>').addClass(CALENDAR_CLASS);
    // @ts-expect-error
    this._calendar = this._createComponent(result, Calendar, this._getCalendarOptions());

    if (this._isMobileLayout()) {
      const scrollable = this._createScrollable(result);
      return scrollable.$element();
    }

    return result;
  }

  _createScrollable(content) {
    // @ts-expect-error
    const result = this._createComponent('<div>', Scrollable, {
      height: 'auto',
      direction: 'both',
    });
    result.$content().append(content);

    return result;
  }

  _optionChanged({ name, value }) {
    switch (name) {
      case 'value':
        this._calendar?.option('value', value);
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
      tabIndex: this.option('tabIndex'),
    };
  }

  _isMobileLayout() {
    return !devices.current().generic;
  }
}

// @ts-expect-error
registerComponent('dxSchedulerCalendarPopup', SchedulerCalendar);
