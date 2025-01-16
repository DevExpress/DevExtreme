import '@js/ui/button_group';
import '@js/ui/drop_down_button';

import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import errors from '@js/core/errors';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import type { dxSchedulerOptions } from '@js/ui/scheduler';
import Toolbar from '@js/ui/toolbar';
import Widget from '@js/ui/widget/ui.widget';
import { viewsUtils } from '@ts/scheduler/r1/utils/index';

import SchedulerCalendar from './m_calendar';
import {
  getDateNavigator,
} from './m_date_navigator';
import {
  getCaption,
  getNextIntervalDate,
  getStep,
  getViewName,
  getViewType,
  nextWeek,
  validateViews,
} from './m_utils';
import {
  getDropDownViewSwitcher,
  getViewSwitcher,
} from './m_view_switcher';

const DEFAULT_ELEMENT = 'defaultElement';
const VIEW_SWITCHER = 'viewSwitcher';
const DATE_NAVIGATOR = 'dateNavigator';

const COMPONENT_CLASS = 'dx-scheduler-header';

export class SchedulerHeader extends Widget<dxSchedulerOptions> {
  currentView: any;

  eventMap: any;

  _toolbar: any;

  _calendar: any;

  get views() {
    return this.option('views');
  }

  get captionText() {
    return this._getCaption().text;
  }

  get intervalOptions() {
    const step = getStep(this.currentView);
    const intervalCount = this.option('intervalCount');
    const firstDayOfWeek = this.option('firstDayOfWeek');
    const agendaDuration = this.option('agendaDuration');

    return {
      step, intervalCount, firstDayOfWeek, agendaDuration,
    };
  }

  _getDefaultOptions() {
    // @ts-expect-error
    return extend(super._getDefaultOptions(), {
      _useShortDateFormat: !devices.real().generic || devices.isSimulator(),
    });
  }

  _createEventMap() {
    this.eventMap = new Map(
      [
        ['currentView', [(view) => {
          this.currentView = viewsUtils.getCurrentView(
            getViewName(view),
            // @ts-expect-error
            this.option('views'),
          );
        }]],
        ['items', [this.repaint.bind(this)]],
        ['views', [validateViews]],
        ['currentDate', [this._getCalendarOptionUpdater('value')]],
        ['min', [this._getCalendarOptionUpdater('min')]],
        ['max', [this._getCalendarOptionUpdater('max')]],
        ['tabIndex', [this.repaint.bind(this)]],
        ['focusStateEnabled', [this.repaint.bind(this)]],
        ['useDropDownViewSwitcher', [this.repaint.bind(this)]],
      ],
    );
  }

  _addEvent(name, event) {
    if (!this.eventMap.has(name)) {
      this.eventMap.set(name, []);
    }

    const events = this.eventMap.get(name);
    this.eventMap.set(name, [...events, event]);
  }

  _optionChanged(args) {
    const { name, value } = args;

    if (this.eventMap.has(name)) {
      const events = this.eventMap.get(name);
      events.forEach((event) => {
        event(value);
      });
    }
  }

  _init() {
    // @ts-expect-error
    super._init();
    this._createEventMap();

    this.$element().addClass(COMPONENT_CLASS);

    this.currentView = viewsUtils.getCurrentView(
      getViewName(this.option('currentView')),
      // @ts-expect-error
      this.option('views'),
    );
  }

  _render() {
    // @ts-expect-error
    super._render();

    this._createEventMap();

    this._renderToolbar();
  }

  _renderToolbar() {
    const config = this._createToolbarConfig();

    const toolbarElement = $('<div>');
    toolbarElement.appendTo(this.$element());

    // @ts-expect-error
    this._toolbar = this._createComponent(toolbarElement, Toolbar, config);
  }

  _createToolbarConfig() {
    const items = this.option('items') as any;

    const parsedItems = items.map((element) => this._parseItem(element));

    return {
      items: parsedItems,
    };
  }

  _parseItem(item) {
    const isDefaultElement = this._isDefaultItem(item);

    if (isDefaultElement) {
      const defaultElementType = item[DEFAULT_ELEMENT];

      switch (defaultElementType) {
        case VIEW_SWITCHER:
          if (this.option('useDropDownViewSwitcher')) {
            return getDropDownViewSwitcher(this, item);
          }

          return getViewSwitcher(this, item);
        case DATE_NAVIGATOR:
          this._renderCalendar();

          return getDateNavigator(this, item);
        default:
          errors.log(`Unknown default element type: ${defaultElementType}`);
          break;
      }
    }

    return item;
  }

  _callEvent(event, arg) {
    if (this.eventMap.has(event)) {
      const events = this.eventMap.get(event);
      events.forEach((event) => event(arg));
    }
  }

  _updateCurrentView(view) {
    const onCurrentViewChange = this.option('onCurrentViewChange') as any;
    onCurrentViewChange(view.name);

    this._callEvent('currentView', view);
  }

  _updateCalendarValueAndCurrentDate(date) {
    this._updateCurrentDate(date);
    this._calendar.option('value', date);
  }

  _updateCurrentDate(date) {
    const onCurrentDateChange = this.option('onCurrentDateChange') as any;
    onCurrentDateChange(date);

    this._callEvent('currentDate', date);
  }

  _renderCalendar() {
    // @ts-expect-error
    this._calendar = this._createComponent('<div>', SchedulerCalendar, {
      value: this.option('currentDate'),
      min: this.option('min'),
      max: this.option('max'),
      firstDayOfWeek: this.option('firstDayOfWeek'),
      focusStateEnabled: this.option('focusStateEnabled'),
      tabIndex: this.option('tabIndex'),
      onValueChanged: (e) => {
        this._updateCurrentDate(e.value);
        this._calendar.hide();
      },
    });

    this._calendar.$element().appendTo(this.$element());
  }

  _getCalendarOptionUpdater(name) {
    return (value) => {
      if (this._calendar) {
        this._calendar.option(name, value);
      }
    };
  }

  _getNextDate(direction, initialDate = null) {
    const date = initialDate ?? this.option('currentDate');
    const options = { ...this.intervalOptions, date };

    return getNextIntervalDate(options, direction);
  }

  _isMonth() {
    const { currentView } = this;
    return getViewType(currentView) === 'month';
  }

  _getDisplayedDate() {
    const startViewDate = this.option('startViewDate');

    if (this._isMonth()) {
      return nextWeek(startViewDate);
    }

    return new Date(startViewDate as any);
  }

  _getCaption() {
    let date = this.option('currentDate');

    if (this.option('startViewDate')) {
      date = this._getDisplayedDate();
    }

    date = dateUtils.trimTime(date);
    const options = { ...this.intervalOptions, date };
    const customizationFunction = this.option('customizeDateNavigatorText');
    const useShortDateFormat = this.option('_useShortDateFormat');

    return getCaption(options, useShortDateFormat, customizationFunction);
  }

  _updateDateByDirection(direction) {
    const date = this._getNextDate(direction);

    this._updateCalendarValueAndCurrentDate(date);
  }

  _showCalendar(e) {
    this._calendar.show(e.element);
  }

  _hideCalendar() {
    this._calendar.hide();
  }

  _isDefaultItem(item) {
    return Object.prototype.hasOwnProperty
      .call(item, DEFAULT_ELEMENT);
  }
}

// @ts-expect-error
registerComponent('dxSchedulerHeader', SchedulerHeader);
