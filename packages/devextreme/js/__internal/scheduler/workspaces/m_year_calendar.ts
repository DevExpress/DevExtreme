import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import dateLocalization from '@js/common/core/localization/date';
import registerComponent from '@js/core/component_registrator';
import { getPublicElement } from '@js/core/element';
import type { PropertyType } from '@js/core/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';

import type { SafeAppointment } from '../types';

export interface CellClickArgs {
  cancel?: boolean;
  cellData: {
    startDate: Date;
    endDate: Date;
    startDateUTC?: Date;
    endDateUTC?: Date;
    groups?: string[];
    groupIndex?: number;
    allDay?: boolean;
  };
  cellElement: Element;
  component?: Widget;
  element?: Element;
  event: Event;
}

const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_OTHER_MONTH_CLASS = 'dx-calendar-other-month';
const YEAR_CALENDAR_LABEL_CLASS = 'dx-scheduler-year-calendar-label';
const YEAR_CALENDAR_HAS_APPOINTMENT_CLASS = 'dx-scheduler-year-calendar-has-appointment';

const CALENDAR_DXCLICK_EVENT_NAME = addNamespace(clickEventName, 'dxYearCalendar');
const CALENDAR_POINTERENTER_EVENT_NAME = addNamespace(pointerEvents.enter, 'dxYearCalendar');
const CALENDAR_POINTERLEAVE_EVENT_NAME = addNamespace(pointerEvents.leave, 'dxYearCalendar');

export interface YearCalendarProperties extends WidgetProperties {
  date: Date;
  firstDayOfWeek?: number;
  onCellClick?: (e: CellClickArgs) => void;
  showMonthLabel?: boolean;
  hasAppointment?: (date: Date) => boolean;
  getAppointmentColor?: (date: Date) => Promise<string | undefined>;
  getAppointmentsForDate?: (date: Date) => SafeAppointment[];
  showAppointmentTooltip?: (
    appointments: SafeAppointment[],
    target: dxElementWrapper
  ) => void;
  hideAppointmentTooltip?: () => void;
}

type YearCalendarPropertyType<T, TProp extends string> =
  PropertyType<T, TProp> extends never
    ? never
    : PropertyType<T, TProp> | undefined;

class YearCalendar extends Widget<YearCalendarProperties> {
  readonly _viewName = 'yearCalendar';

  public option(): YearCalendarProperties;
  public option(options: YearCalendarProperties): void;
  public option<TPropertyName extends string>(
    name: TPropertyName
  ): YearCalendarPropertyType<YearCalendarProperties, TPropertyName>;
  public option<TPropertyName extends string>(
    name: TPropertyName,
    value: YearCalendarPropertyType<YearCalendarProperties, TPropertyName>
  ): void;
  public option(...args: unknown[]): YearCalendarProperties | unknown {
    return super.option.apply(this, args);
  }

  _getDefaultOptions(): YearCalendarProperties {
    return {
      ...super._getDefaultOptions(),
      date: new Date(),
      firstDayOfWeek: dateLocalization.firstDayOfWeekIndex(),
      onCellClick: undefined,
      showMonthLabel: true,
      hasAppointment: undefined,
      getAppointmentColor: undefined,
      getAppointmentsForDate: undefined,
      showAppointmentTooltip: undefined,
      hideAppointmentTooltip: undefined,
    };
  }

  _render(): void {
    this.$element().empty();
    this._renderMonthLabel();
    this._renderTable();
    this._renderEvents();
  }

  _renderMonthLabel(): void {
    const showMonthLabel = this.option('showMonthLabel');
    if (showMonthLabel !== false) {
      const date = this.option('date');
      if (!date) return;
      const monthNames = dateLocalization.getMonthNames();
      const monthName = monthNames[date.getMonth()];
      const $label = $('<div>')
        .addClass(YEAR_CALENDAR_LABEL_CLASS)
        .text(monthName);
      this.$element().append($label);
    }
  }

  _renderTable(): void {
    const date = this.option('date');
    if (!date) return;
    const firstDayOfWeek = this.option('firstDayOfWeek') ?? dateLocalization.firstDayOfWeekIndex();

    const $table = $('<table>')
      .attr('role', 'grid')
      .attr('aria-label', `Calendar. Month ${dateLocalization.format(date, 'monthandyear')}`);

    const $thead = $('<thead>');
    const $headerRow = $('<tr>');
    const dayNames = dateLocalization.getDayNames('abbreviated');

    // Rotate day names based on firstDayOfWeek
    const rotatedDayNames = [
      ...dayNames.slice(firstDayOfWeek),
      ...dayNames.slice(0, firstDayOfWeek),
    ];

    rotatedDayNames.forEach((dayName, index) => {
      const dayIndex = (firstDayOfWeek + index) % 7;
      const $th = $('<th>')
        .attr('scope', 'col')
        .attr('abbr', dayNames[dayIndex])
        .text(dayName);
      $headerRow.append($th);
    });

    $thead.append($headerRow);
    $table.append($thead);

    const $tbody = $('<tbody>');
    const days = YearCalendar._getMonthDays(date, firstDayOfWeek);

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    weeks.forEach((weekDays) => {
      const $row = $('<tr>').attr('role', 'row');
      weekDays.forEach((dayDate) => {
        const isOtherMonth = dayDate.getMonth() !== date.getMonth();
        const dayNumber = dayDate.getDate();

        const $cell = $('<td>')
          .addClass(CALENDAR_CELL_CLASS)
          .attr('data-value', YearCalendar._formatDateValue(dayDate))
          .attr('aria-selected', 'false')
          .attr('aria-label', YearCalendar._getAriaLabel(dayDate));

        if (isOtherMonth) {
          $cell.addClass(CALENDAR_OTHER_MONTH_CLASS);
        }

        const $span = $('<span>').text(dayNumber.toString());

        const hasAppointment = this.option('hasAppointment');
        const getAppointmentColor = this.option('getAppointmentColor');

        if (!isOtherMonth && hasAppointment && hasAppointment(dayDate)) {
          $span.addClass(YEAR_CALENDAR_HAS_APPOINTMENT_CLASS);

          if (getAppointmentColor) {
            getAppointmentColor(dayDate).then((color) => {
              if (color) {
                $span.css('background-color', color);
              }
            }).catch(() => {});
          }
        }

        $cell.append($span);
        $row.append($cell);
      });
      $tbody.append($row);
    });

    $table.append($tbody);
    this.$element().append($table);
  }

  static _getMonthDays(date: Date, firstDayOfWeek: number): Date[] {
    const firstDayOfMonth = dateUtils.getFirstMonthDate(date) as Date;

    // Get first day of the calendar view (may be from previous month)
    const firstDay = YearCalendar._getFirstCellDate(firstDayOfMonth, firstDayOfWeek);

    const days: Date[] = [];

    // Generate 6 weeks of days (42 days total)
    for (let i = 0; i < 42; i += 1) {
      const dayDate = new Date(firstDay);
      dayDate.setDate(firstDay.getDate() + i);
      days.push(dayDate);
    }

    return days;
  }

  static _getFirstCellDate(firstDayOfMonth: Date, firstDayOfWeek: number): Date {
    const firstDay = new Date(firstDayOfMonth);
    let firstMonthDayOffset = firstDayOfWeek - firstDay.getDay();

    if (firstMonthDayOffset >= 0) {
      firstMonthDayOffset -= 7;
    }

    firstDay.setDate(firstDay.getDate() + firstMonthDayOffset);
    return firstDay;
  }

  static _formatDateValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  static _getAriaLabel(date: Date): string {
    const dayNames = dateLocalization.getDayNames();
    const monthNames = dateLocalization.getMonthNames();
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${dayName}, ${monthName} ${day}, ${year}`;
  }

  _renderEvents(): void {
    eventsEngine.off(this.$element(), CALENDAR_DXCLICK_EVENT_NAME);
    eventsEngine.off(this.$element(), CALENDAR_POINTERENTER_EVENT_NAME);
    eventsEngine.off(this.$element(), CALENDAR_POINTERLEAVE_EVENT_NAME);

    eventsEngine.on(this.$element(), CALENDAR_DXCLICK_EVENT_NAME, `.${CALENDAR_CELL_CLASS}`, (e) => {
      const $cell = $(e.currentTarget);
      const dateValue = $cell.attr('data-value');

      if (dateValue) {
        const [year, month, day] = dateValue.split('/').map(Number);
        const clickedDate = new Date(year, month - 1, day);
        const startDate = new Date(clickedDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(clickedDate);
        endDate.setHours(23, 59, 59, 999);

        const onCellClick = this.option('onCellClick');
        if (onCellClick) {
          const cellData = {
            startDate,
            endDate,
            startDateUTC: startDate,
            endDateUTC: endDate,
            groups: [],
            groupIndex: 0,
            allDay: true,
          };
          const clickArgs: CellClickArgs = {
            event: e.originalEvent || e,
            cellElement: getPublicElement($cell),
            cellData,
            cancel: false,
          };
          onCellClick(clickArgs);
        }
      }
    });

    eventsEngine.on(this.$element(), CALENDAR_POINTERENTER_EVENT_NAME, `.${CALENDAR_CELL_CLASS}`, (e) => {
      const $cell = $(e.currentTarget);
      const dateValue = $cell.attr('data-value');

      if (dateValue) {
        const [year, month, day] = dateValue.split('/').map(Number);
        const hoveredDate = new Date(year, month - 1, day);
        const calendarDate = this.option('date');

        if (!calendarDate || hoveredDate.getMonth() !== calendarDate.getMonth()) {
          return;
        }

        const getAppointmentsForDate = this.option('getAppointmentsForDate');
        const showAppointmentTooltip = this.option('showAppointmentTooltip');

        if (getAppointmentsForDate && showAppointmentTooltip) {
          const appointments = getAppointmentsForDate(hoveredDate);
          if (appointments && appointments.length > 0) {
            showAppointmentTooltip(appointments, $cell);
          }
        }
      }
    });

    eventsEngine.on(this.$element(), CALENDAR_POINTERLEAVE_EVENT_NAME, `.${CALENDAR_CELL_CLASS}`, () => {
      const hideAppointmentTooltip = this.option('hideAppointmentTooltip');
      if (hideAppointmentTooltip) {
        hideAppointmentTooltip();
      }
    });
  }

  _optionChanged(args: { name: string; value?: unknown; previousValue?: unknown }): void {
    const { name } = args;

    switch (name) {
      case 'date':
      case 'firstDayOfWeek':
      case 'showMonthLabel':
      case 'hasAppointment':
      case 'getAppointmentColor':
      case 'getAppointmentsForDate':
      case 'showAppointmentTooltip':
      case 'hideAppointmentTooltip':
        this._render();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxYearCalendar', YearCalendar);

export default YearCalendar;
