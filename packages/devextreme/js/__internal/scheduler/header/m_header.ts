import '@js/ui/drop_down_button';

import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import errors from '@js/core/errors';
import $ from '@js/core/renderer';
import { getPathParts } from '@js/core/utils/data';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import type { ItemClickEvent } from '@js/ui/button_group';
import type { DateNavigatorTextInfo, ToolbarItem } from '@js/ui/scheduler';
import Toolbar from '@js/ui/toolbar';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import type { NormalizedView, SafeSchedulerOptions } from '@ts/scheduler/utils/options/types';

import type { Direction } from './constants';
import SchedulerCalendar from './m_calendar';
import {
  getDateNavigator,
} from './m_date_navigator';
import {
  getCaption,
  getNextIntervalDate,
  getStep,
  nextWeek,
} from './m_utils';
import {
  getDropDownViewSwitcher,
  getTabViewSwitcher,
} from './m_view_switcher';
import { getTodayButtonOptions } from './today';
import type {
  EventMapHandler, HeaderCalendarOptions,
  HeaderOptions, IntervalOptions,
} from './types';

const CLASSES = {
  component: 'dx-scheduler-header',
  invisible: 'dx-state-invisible',
};
const ITEM_NAMES = {
  today: 'today',
  dateNavigator: 'dateNavigator',
  viewSwitcher: 'viewSwitcher',
};

export class SchedulerHeader extends Widget<HeaderOptions> {
  eventMap!: Map<string, EventMapHandler[]>;

  _toolbar?: Toolbar;

  _calendar?: SchedulerCalendar;

  get captionText(): string {
    return this._getCaption().text;
  }

  getIntervalOptions(date: Date): IntervalOptions {
    const { currentView, firstDayOfWeek } = this.option();
    const step = getStep(currentView.type);

    return {
      date,
      step,
      firstDayOfWeek,
      intervalCount: currentView.intervalCount,
      agendaDuration: currentView.agendaDuration,
    };
  }

  _getDefaultOptions(): HeaderOptions & { _useShortDateFormat: boolean } {
    return extend(super._getDefaultOptions(), {
      _useShortDateFormat: !devices.real().generic || devices.isSimulator(),
    }) as HeaderOptions & { _useShortDateFormat: boolean };
  }

  _createEventMap(): void {
    this.eventMap = new Map([
      ['currentView', []],
      ['views', []],
      ['currentDate', [this._getCalendarOptionUpdater('value')]],
      ['min', [this._getCalendarOptionUpdater('min')]],
      ['max', [this._getCalendarOptionUpdater('max')]],
      ['tabIndex', [this.repaint.bind(this)]],
      ['focusStateEnabled', [this.repaint.bind(this)]],
      ['useDropDownViewSwitcher', [this.repaint.bind(this)]],
      ['indicatorTime', []],
    ] as [string, EventMapHandler[]][]);
  }

  _addEvent(name: string, event: EventMapHandler): void {
    if (!this.eventMap.has(name)) {
      this.eventMap.set(name, []);
    }

    const events = this.eventMap.get(name);
    if (events) {
      this.eventMap.set(name, [...events, event]);
    }
  }

  _optionChanged(args: OptionChanged<HeaderOptions>): void {
    const { name, value } = args;

    if (this.eventMap.has(name)) {
      const events = this.eventMap.get(name);
      events?.forEach((event) => {
        event(value);
      });
    }
  }

  onToolbarOptionChanged(fullName: string, value: unknown): void {
    const parts = getPathParts(fullName);
    const optionName = fullName.replace(/^toolbar\./, '');

    this.option(fullName, value);
    this._toggleVisibility();
    switch (true) {
      case fullName === 'toolbar':
        this.repaint();
        break;
      case fullName === 'toolbar.items':
        this._toolbar?.option(
          'items',
          (value as []).map((item: ToolbarItem) => this._parseItem(item)),
        );
        break;
      case parts[1] === 'items' && parts.length === 3:
        this._toolbar?.option(optionName, this._parseItem(value as ToolbarItem));
        break;
      default:
        this._toolbar?.option(optionName, value);
    }
  }

  _init(): void {
    super._init();
    this._createEventMap();

    this.$element().addClass(CLASSES.component);
  }

  _render(): void {
    super._render();

    this._createEventMap();
    this._renderToolbar();
    this._toggleVisibility();
  }

  _renderToolbar(): void {
    const config = this._createToolbarConfig();

    const toolbarElement = $('<div>');
    toolbarElement.appendTo(this.$element());

    this._toolbar = this._createComponent(toolbarElement, Toolbar, config);
  }

  _toggleVisibility(): void {
    const { toolbar } = this.option();
    const isHeaderShown = toolbar.visible
      ?? (toolbar.visible === undefined && toolbar.items.length);

    if (isHeaderShown) {
      this.$element().removeClass(CLASSES.invisible);
    } else {
      this.$element().addClass(CLASSES.invisible);
    }
  }

  _createToolbarConfig(): SafeSchedulerOptions['toolbar'] {
    const { toolbar } = this.option();
    const parsedItems = toolbar.items.map((element) => this._parseItem(element));

    return {
      ...toolbar,
      items: parsedItems,
    };
  }

  _parseItem(item: ToolbarItem | string): ToolbarItem {
    const itemName = typeof item === 'string' ? item : item.name;
    const itemOptions = typeof item === 'string' ? {} : item;

    if (itemName) {
      switch (itemName) {
        case ITEM_NAMES.today:
          return getTodayButtonOptions(this, itemOptions);
        case ITEM_NAMES.viewSwitcher:
          return this.option('useDropDownViewSwitcher')
            ? getDropDownViewSwitcher(this, itemOptions)
            : getTabViewSwitcher(this, itemOptions);
        case ITEM_NAMES.dateNavigator:
          this._renderCalendar();

          return getDateNavigator(this, itemOptions);
        default:
          errors.log(`Unknown default element type: ${itemName}`);
      }
    }

    return extend(true, {}, item) as ToolbarItem;
  }

  _callEvent(event: string, arg: unknown): void {
    if (this.eventMap.has(event)) {
      const events = this.eventMap.get(event);
      if (events) {
        events.forEach((EventMapHandler) => EventMapHandler(arg));
      }
    }
  }

  _updateCurrentView(view: Required<NormalizedView>): void {
    const { onCurrentViewChange } = this.option();
    onCurrentViewChange(view.name);
  }

  _updateCalendarValueAndCurrentDate(date: Date): void {
    this._updateCurrentDate(date);
    this._calendar?.option('value', date);
  }

  _updateCurrentDate(date: Date): void {
    const { onCurrentDateChange } = this.option();
    onCurrentDateChange(date);
    this._callEvent('currentDate', date);
  }

  _renderCalendar(): void {
    const {
      currentDate, min, max, firstDayOfWeek, focusStateEnabled, tabIndex,
    } = this.option();
    this._calendar = this._createComponent('<div>', SchedulerCalendar, {
      value: currentDate,
      min,
      max,
      firstDayOfWeek,
      focusStateEnabled,
      tabIndex,
      onValueChanged: async (e) => {
        this._updateCurrentDate(e.value);
        await this._calendar?.hide();
      },
    });

    this._calendar.$element().appendTo(this.$element());
  }

  _getCalendarOptionUpdater(name: keyof HeaderCalendarOptions) {
    return (value: HeaderCalendarOptions[typeof name]): void => {
      if (this._calendar) {
        this._calendar.option(name, value);
      }
    };
  }

  _getNextDate(direction: Direction, initialDate?: Date): Date {
    const { currentDate } = this.option();
    const date = initialDate ?? currentDate;
    const options = this.getIntervalOptions(date);

    return getNextIntervalDate(options, direction);
  }

  _getDisplayedDate(): Date {
    const { startViewDate, currentView } = this.option();
    const isMonth = currentView.type === 'month';

    return isMonth ? nextWeek(startViewDate) : startViewDate;
  }

  _getCaptionOptions(): IntervalOptions {
    const { currentDate, startViewDate } = this.option();
    let date = currentDate;

    if (startViewDate) {
      date = this._getDisplayedDate();
    }

    date = dateUtils.trimTime(date);

    return this.getIntervalOptions(date);
  }

  _getCaption(): DateNavigatorTextInfo {
    const { customizeDateNavigatorText } = this.option();
    const options = this._getCaptionOptions();
    const useShortDateFormat = this.option('_useShortDateFormat');

    return getCaption(options, Boolean(useShortDateFormat), customizeDateNavigatorText);
  }

  _updateDateByDirection(direction: Direction): void {
    const date = this._getNextDate(direction);

    this._updateCalendarValueAndCurrentDate(date);
  }

  async _showCalendar(e: ItemClickEvent): Promise<void> {
    await this._calendar?.show(e.element);
  }

  async _hideCalendar(): Promise<void> {
    await this._calendar?.hide();
  }
}

registerComponent('dxSchedulerHeader', SchedulerHeader);
