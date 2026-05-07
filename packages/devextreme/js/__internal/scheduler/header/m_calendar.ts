import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Popover from '@js/ui/popover/ui.popover';
import Popup from '@js/ui/popup/ui.popup';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import type { KeyboardKeyDownEvent } from '@ts/events/core/m_keyboard_processor';
import type { CalendarProperties } from '@ts/ui/calendar/calendar';
import Calendar from '@ts/ui/calendar/calendar';
import Scrollable from '@ts/ui/scroll_view/scrollable';

import type { HeaderCalendarOptions } from './types';

const CALENDAR_CLASS = 'dx-scheduler-navigator-calendar';
const CALENDAR_POPOVER_CLASS = 'dx-scheduler-navigator-calendar-popover';

export default class SchedulerCalendar extends Widget<HeaderCalendarOptions> {
  private overlay?: Popup | Popover;

  private calendar?: Calendar;

  public async show(target: HTMLElement): Promise<void> {
    if (!SchedulerCalendar.isMobileLayout()) {
      this.overlay?.option('target', target);
    }

    await this.overlay?.show();
  }

  public async hide(): Promise<void> {
    await this.overlay?.hide();
  }

  public _keyboardHandler(opts: KeyboardKeyDownEvent): boolean {
    return this.calendar?._keyboardHandler(opts) ?? false;
  }

  public _init(): void {
    super._init();
    this.$element();
  }

  public _render(): void {
    super._render();
    this.renderOverlay();
  }

  private renderOverlay(): void {
    this.$element().addClass(CALENDAR_POPOVER_CLASS);

    const isMobileLayout = SchedulerCalendar.isMobileLayout();

    const overlayConfig = {
      contentTemplate: (): dxElementWrapper => this.createOverlayContent(),
      onShown: (): void => {
        this.calendar?.focus();
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
      this.overlay = this._createComponent(this.$element(), Popup, overlayConfig);
    } else {
      this.overlay = this._createComponent(this.$element(), Popover, overlayConfig);
    }
  }

  private createOverlayContent(): dxElementWrapper {
    const result = $('<div>').addClass(CALENDAR_CLASS);
    this.calendar = this._createComponent(result, Calendar, this.getCalendarOptions());

    if (SchedulerCalendar.isMobileLayout()) {
      const scrollable = this.createScrollable(result);
      return scrollable.$element();
    }

    return result;
  }

  private createScrollable(content: dxElementWrapper): Scrollable {
    const result = this._createComponent('<div>', Scrollable, {
      height: 'auto',
      direction: 'both',
    });
    result.$content().append(content);

    return result;
  }

  public _optionChanged(
    args: OptionChanged<HeaderCalendarOptions>,
  ): void {
    const { name, value } = args;

    switch (name) {
      case 'value':
        this.calendar?.option('value', value);
        break;
      default:
        break;
    }
  }

  private getCalendarOptions(): CalendarProperties {
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

  private static isMobileLayout(): boolean {
    return !devices.current().generic;
  }
}

registerComponent('dxSchedulerCalendarPopup', SchedulerCalendar);
