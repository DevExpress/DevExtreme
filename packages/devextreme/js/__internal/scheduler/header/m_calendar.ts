import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DateLike } from '@js/ui/calendar';
import Popover from '@js/ui/popover/ui.popover';
import Popup from '@js/ui/popup/ui.popup';
import Widget from '@ts/core/widget/widget';
import type { KeyboardKeyDownEvent } from '@ts/events/core/m_keyboard_processor';
import type { CalendarProperties } from '@ts/ui/calendar/calendar';
import Calendar from '@ts/ui/calendar/calendar';
import Scrollable from '@ts/ui/scroll_view/scrollable';

import type { SchedulerCalendarOptions } from './types';

const CALENDAR_CLASS = 'dx-scheduler-navigator-calendar';
const CALENDAR_POPOVER_CLASS = 'dx-scheduler-navigator-calendar-popover';

export default class SchedulerCalendar extends Widget<SchedulerCalendarOptions> {
  _overlay?: Popup | Popover;

  _calendar?: Calendar;

  async show(target: HTMLElement): Promise<void> {
    if (!SchedulerCalendar._isMobileLayout()) {
      this._overlay?.option('target', target);
    }

    await this._overlay?.show();
  }

  async hide(): Promise<void> {
    await this._overlay?.hide();
  }

  _keyboardHandler(opts: KeyboardKeyDownEvent): boolean {
    this._calendar?._keyboardHandler(opts);
    return true;
  }

  _init(): void {
    super._init();
    this.$element();
  }

  _render(): void {
    super._render();
    this._renderOverlay();
  }

  _renderOverlay(): void {
    this.$element().addClass(CALENDAR_POPOVER_CLASS);

    const isMobileLayout = SchedulerCalendar._isMobileLayout();

    const overlayConfig = {
      contentTemplate: (): dxElementWrapper => this._createOverlayContent(),
      onShown: (): void => {
        this._calendar?.focus();
      },
      defaultOptionsRules: [
        {
          device: (): boolean => isMobileLayout,
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
    };

    if (isMobileLayout) {
      this._overlay = this._createComponent(this.$element(), Popup, overlayConfig);
    } else {
      this._overlay = this._createComponent(this.$element(), Popover, overlayConfig);
    }
  }

  _createOverlayContent(): dxElementWrapper {
    const result = $('<div>').addClass(CALENDAR_CLASS);
    this._calendar = this._createComponent(result, Calendar, this._getCalendarOptions());

    if (SchedulerCalendar._isMobileLayout()) {
      const scrollable = this._createScrollable(result);
      return scrollable.$element();
    }

    return result;
  }

  _createScrollable(content: dxElementWrapper): Scrollable {
    const result = this._createComponent('<div>', Scrollable, {
      height: 'auto',
      direction: 'both',
    });
    result.$content().append(content);

    return result;
  }

  _optionChanged(
    { name, value } : { name: string; value: DateLike | DateLike[] },
  ): void {
    switch (name) {
      case 'value':
        this._calendar?.option('value', value);
        break;
      default:
        break;
    }
  }

  _getCalendarOptions(): CalendarProperties {
    const {
      value, min, max, firstDayOfWeek, focusStateEnabled, tabIndex, onValueChanged,
    } = this.option();
    return {
      value,
      min,
      max,
      firstDayOfWeek,
      focusStateEnabled,
      tabIndex,
      onValueChanged,
      // @ts-expect-error skipFocusCheck is an internal Calendar property
      skipFocusCheck: true,
    };
  }

  static _isMobileLayout(): boolean {
    return !devices.current().generic;
  }
}

registerComponent('dxSchedulerCalendarPopup', SchedulerCalendar);
