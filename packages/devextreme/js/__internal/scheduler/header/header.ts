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

import SchedulerCalendar from './calendar';
import type { Direction } from './constants';
import {
  getDateNavigator,
  getTodayButtonOptions,
} from './date_navigator';
import type {
  EventMapHandler,
  HeaderOptions, IntervalOptions,
} from './types';
import {
  getCaption,
  getNextIntervalDate,
  getStep,
  nextWeek,
} from './utils';
import {
  getDropDownViewSwitcher,
  getTabViewSwitcher,
} from './view_switcher';

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
    return this.getCaption().text;
  }

  public getIntervalOptions(date: Date): IntervalOptions {
    const { currentView, firstDayOfWeek, skippedDays } = this.option();
    const step = getStep(currentView.type);

    return {
      date,
      step,
      firstDayOfWeek,
      intervalCount: currentView.intervalCount,
      agendaDuration: currentView.agendaDuration,
      skippedDays,
    };
  }

  public _getDefaultOptions(): HeaderOptions {
    return extend(super._getDefaultOptions(), {
      // TODO: passed via scheduler options as _useShortDateFormat
      _useShortDateFormat: !devices.real().generic || devices.isSimulator(),
    }) as HeaderOptions;
  }

  private createEventMap(): void {
    this.eventMap = new Map([
      ['currentView', []],
      ['views', []],
      ['currentDate', [this.getCalendarOptionUpdater('value')]],
      ['min', [this.getCalendarOptionUpdater('min')]],
      ['max', [this.getCalendarOptionUpdater('max')]],
      ['tabIndex', [this.repaint.bind(this)]],
      ['focusStateEnabled', [this.repaint.bind(this)]],
      ['useDropDownViewSwitcher', [this.repaint.bind(this)]],
      ['indicatorTime', []],
    ] as [string, EventMapHandler[]][]);
  }

  public addEvent(name: string, event: EventMapHandler): void {
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
          (value as []).map((item: ToolbarItem) => this.parseItem(item)),
        );
        break;
      case parts[1] === 'items' && parts.length === 3:
        this.toolbar?.option(optionName, this.parseItem(value as ToolbarItem));
        break;
      default:
        this.toolbar?.option(optionName, value);
    }
  }

  public _init(): void {
    super._init();
    this.createEventMap();

    this.$element().addClass(CLASSES.component);
  }

  public _render(): void {
    super._render();

    this.createEventMap();
    this.renderToolbar();
    this._toggleVisibility();
  }

  private renderToolbar(): void {
    const config = this.createToolbarConfig();

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

  private createToolbarConfig(): SafeSchedulerOptions['toolbar'] {
    const { toolbar } = this.option();
    const parsedItems = toolbar.items.map((element) => this.parseItem(element));

    return {
      ...toolbar,
      items: parsedItems,
    };
  }

  private parseItem(item: ToolbarItem | string): ToolbarItem {
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
          this.renderCalendar();

          return getDateNavigator(this, itemOptions);
        default:
          errors.log(`Unknown default element type: ${itemName}`);
      }
    }

    return extend(true, {}, item) as ToolbarItem;
  }

  private callEvent(event: string, arg: unknown): void {
    const events = this.eventMap.get(event);

    events?.forEach((eventMapHandler) => eventMapHandler(arg));
  }

  public updateCurrentView(view: Required<NormalizedView>): void {
    const { onCurrentViewChange } = this.option();
    onCurrentViewChange(view.name);
  }

  private updateCalendarValueAndCurrentDate(date: Date): void {
    this.updateCurrentDate(date);
    this.calendar?.option('value', date);
  }

  public updateCurrentDate(date: Date): void {
    const { onCurrentDateChange } = this.option();
    onCurrentDateChange(date);
    this.callEvent('currentDate', date);
  }

  private renderCalendar(): void {
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

  private getCalendarOptionUpdater(name: string) {
    return (value: unknown): void => {
      if (this.calendar) {
        this.calendar.option(name, value);
      }
    };
  }

  public getNextDate(direction: Direction, initialDate?: Date): Date {
    const { currentDate } = this.option();
    const date = initialDate ?? currentDate;
    const options = this.getIntervalOptions(date);

    return getNextIntervalDate(options, direction);
  }

  private getDisplayedDate(): Date {
    const { startViewDate, currentView } = this.option();
    const isMonth = currentView.type === 'month';

    return isMonth ? nextWeek(startViewDate) : startViewDate;
  }

  private getCaptionOptions(): IntervalOptions {
    const { currentDate, startViewDate } = this.option();
    let date = currentDate;

    if (startViewDate) {
      date = this.getDisplayedDate();
    }

    date = dateUtils.trimTime(date);

    return this.getIntervalOptions(date);
  }

  public getCaption(): DateNavigatorTextInfo {
    const { customizeDateNavigatorText } = this.option();
    const options = this.getCaptionOptions();
    const useShortDateFormat = this.option()._useShortDateFormat;

    return getCaption(options, Boolean(useShortDateFormat), customizeDateNavigatorText);
  }

  public updateDateByDirection(direction: Direction): void {
    const date = this.getNextDate(direction);

    this.updateCalendarValueAndCurrentDate(date);
  }

  public async showCalendar(e: ItemClickEvent): Promise<void> {
    await this.calendar?.show(e.element);
  }
}

registerComponent('dxSchedulerHeader', SchedulerHeader);
