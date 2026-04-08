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
  getTodayButtonOptions,
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
import type {
  EventMapHandler,
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

  private toolbar?: Toolbar;

  private calendar?: SchedulerCalendar;

  get captionText(): string {
    return this._getCaption().text;
  }

  public getIntervalOptions(date: Date): IntervalOptions {
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

  public _getDefaultOptions(): HeaderOptions {
    return extend(super._getDefaultOptions(), {
      _useShortDateFormat: !devices.real().generic || devices.isSimulator(),
    }) as HeaderOptions;
  }

  private _createEventMap(): void {
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

  public _addEvent(name: string, event: EventMapHandler): void {
    const events = this.eventMap.get(name) ?? [];
    this.eventMap.set(name, [...events, event]);
  }

  public _optionChanged(args: OptionChanged<HeaderOptions>): void {
    const { name, value } = args;

    const events = this.eventMap.get(name);

    events?.forEach((event) => {
      event(value);
    });
  }

  public onToolbarOptionChanged(fullName: string, value: unknown): void {
    const parts = getPathParts(fullName);
    const optionName = fullName.replace(/^toolbar\./, '');

    this.option(fullName, value);
    this._toggleVisibility();
    switch (true) {
      case fullName === 'toolbar':
        this.repaint();
        break;
      case fullName === 'toolbar.items':
        this.toolbar?.option(
          'items',
          (value as []).map((item: ToolbarItem) => this._parseItem(item)),
        );
        break;
      case parts[1] === 'items' && parts.length === 3:
        this.toolbar?.option(optionName, this._parseItem(value as ToolbarItem));
        break;
      default:
        this.toolbar?.option(optionName, value);
    }
  }

  public _init(): void {
    super._init();
    this._createEventMap();

    this.$element().addClass(CLASSES.component);
  }

  public _render(): void {
    super._render();

    this._createEventMap();
    this._renderToolbar();
    this._toggleVisibility();
  }

  private _renderToolbar(): void {
    const config = this._createToolbarConfig();

    const toolbarElement = $('<div>');
    toolbarElement.appendTo(this.$element());

    this.toolbar = this._createComponent(toolbarElement, Toolbar, config);
  }

  public _toggleVisibility(): void {
    const { toolbar } = this.option();
    const isHeaderShown = toolbar.visible ?? toolbar.items.length;

    if (isHeaderShown) {
      this.$element().removeClass(CLASSES.invisible);
    } else {
      this.$element().addClass(CLASSES.invisible);
    }
  }

  private _createToolbarConfig(): SafeSchedulerOptions['toolbar'] {
    const { toolbar } = this.option();
    const parsedItems = toolbar.items.map((element) => this._parseItem(element));

    return {
      ...toolbar,
      items: parsedItems,
    };
  }

  private _parseItem(item: ToolbarItem | string): ToolbarItem {
    const itemName = typeof item === 'string' ? item : item.name;
    const itemOptions = typeof item === 'string' ? {} : item;

    if (itemName) {
      switch (itemName) {
        case ITEM_NAMES.today:
          return getTodayButtonOptions(this, itemOptions);
        case ITEM_NAMES.viewSwitcher:
          return this.option().useDropDownViewSwitcher
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

  private _callEvent(event: string, arg: unknown): void {
    const events = this.eventMap.get(event);

    events?.forEach((EventMapHandler) => EventMapHandler(arg));
  }

  public _updateCurrentView(view: Required<NormalizedView>): void {
    const { onCurrentViewChange } = this.option();
    onCurrentViewChange(view.name);
  }

  private _updateCalendarValueAndCurrentDate(date: Date): void {
    this.updateCurrentDate(date);
    this.calendar?.option('value', date);
  }

  public updateCurrentDate(date: Date): void {
    const { onCurrentDateChange } = this.option();
    onCurrentDateChange(date);
    this._callEvent('currentDate', date);
  }

  private _renderCalendar(): void {
    const {
      currentDate, min, max, firstDayOfWeek, focusStateEnabled, tabIndex,
    } = this.option();
    this.calendar = this._createComponent('<div>', SchedulerCalendar, {
      value: currentDate,
      min,
      max,
      firstDayOfWeek,
      focusStateEnabled,
      tabIndex,
      onValueChanged: async (e) => {
        this.updateCurrentDate(e.value);
        await this.calendar?.hide();
      },
    });

    this.calendar.$element().appendTo(this.$element());
  }

  private _getCalendarOptionUpdater(name: string) {
    return (value: unknown): void => {
      if (this.calendar) {
        this.calendar.option(name, value);
      }
    };
  }

  public _getNextDate(direction: Direction, initialDate?: Date): Date {
    const { currentDate } = this.option();
    const date = initialDate ?? currentDate;
    const options = this.getIntervalOptions(date);

    return getNextIntervalDate(options, direction);
  }

  private _getDisplayedDate(): Date {
    const { startViewDate, currentView } = this.option();
    const isMonth = currentView.type === 'month';

    return isMonth ? nextWeek(startViewDate) : startViewDate;
  }

  private _getCaptionOptions(): IntervalOptions {
    const { currentDate, startViewDate } = this.option();
    let date = currentDate;

    if (startViewDate) {
      date = this._getDisplayedDate();
    }

    date = dateUtils.trimTime(date);

    return this.getIntervalOptions(date);
  }

  public _getCaption(): DateNavigatorTextInfo {
    const { customizeDateNavigatorText } = this.option();
    const options = this._getCaptionOptions();
    const useShortDateFormat = this.option()._useShortDateFormat;

    return getCaption(options, Boolean(useShortDateFormat), customizeDateNavigatorText);
  }

  public _updateDateByDirection(direction: Direction): void {
    const date = this._getNextDate(direction);

    this._updateCalendarValueAndCurrentDate(date);
  }

  public async _showCalendar(e: ItemClickEvent): Promise<void> {
    await this.calendar?.show(e.element);
  }
}

registerComponent('dxSchedulerHeader', SchedulerHeader);
