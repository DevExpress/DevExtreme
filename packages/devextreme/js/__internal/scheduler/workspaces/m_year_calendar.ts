import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import dateLocalization from '@js/common/core/localization/date';
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';

const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_OTHER_MONTH_CLASS = 'dx-calendar-other-month';
const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const YEAR_CALENDAR_LABEL_CLASS = 'dx-scheduler-year-calendar-label';

const CALENDAR_DXCLICK_EVENT_NAME = addNamespace(clickEventName, 'dxYearCalendar');

interface YearCalendarProperties extends WidgetProperties {
  date: Date;
  firstDayOfWeek?: number;
  onCellClick?: (e: { value: Date }) => void;
  showMonthLabel?: boolean;
}

class YearCalendar extends Widget<YearCalendarProperties> {
  readonly _viewName = 'yearCalendar';

  _getDefaultOptions(): YearCalendarProperties {
    return {
      ...super._getDefaultOptions(),
      date: new Date(),
      firstDayOfWeek: dateLocalization.firstDayOfWeekIndex(),
      onCellClick: undefined,
      showMonthLabel: true,
    };
  }

  _init(): void {
    super._init();
    this._render();
  }

  _render(): void {
    this.$element().empty();
    this._renderMonthLabel();
    this._renderTable();
    this._renderEvents();
  }

  _renderMonthLabel(): void {
    const showMonthLabel = this.option('showMonthLabel') as unknown as boolean | undefined;
    if (showMonthLabel !== false) {
      const date = this.option('date') as unknown as Date;
      const monthNames = dateLocalization.getMonthNames();
      const monthName = monthNames[date.getMonth()];
      const $label = $('<div>')
        .addClass(YEAR_CALENDAR_LABEL_CLASS)
        .text(monthName);
      this.$element().append($label);
    }
  }

  _renderTable(): void {
    const date = this.option('date') as unknown as Date;
    const firstDayOfWeek = (this.option('firstDayOfWeek') as unknown as number | undefined) ?? dateLocalization.firstDayOfWeekIndex();

    const $table = $('<table>')
      .attr('role', 'grid')
      .attr('aria-label', `Calendar. Month ${dateLocalization.format(date, 'monthandyear')}`);

    // Render header with day names
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

    // Render body with days
    const $tbody = $('<tbody>');
    const days = YearCalendar._getMonthDays(date, firstDayOfWeek);

    // Group days into weeks (rows)
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
          $cell.addClass(CALENDAR_OTHER_MONTH_CLASS).addClass(CALENDAR_OTHER_VIEW_CLASS);
        }

        const $span = $('<span>').text(dayNumber.toString());
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
    eventsEngine.on(this.$element(), CALENDAR_DXCLICK_EVENT_NAME, `.${CALENDAR_CELL_CLASS}`, (e) => {
      const $cell = $(e.currentTarget);
      const dateValue = $cell.attr('data-value');

      if (dateValue) {
        const [year, month, day] = dateValue.split('/').map(Number);
        const clickedDate = new Date(year, month - 1, day);

        const onCellClick = this.option('onCellClick') as unknown as ((e: { value: Date }) => void) | undefined;
        if (onCellClick) {
          onCellClick({ value: clickedDate });
        }
      }
    });
  }

  _optionChanged(args: { name: string; value?: unknown; previousValue?: unknown }): void {
    const { name } = args;

    if (name === 'date' || name === 'firstDayOfWeek' || name === 'showMonthLabel') {
      this._render();
    } else {
      super._optionChanged(args);
    }
  }
}

registerComponent('dxYearCalendar', YearCalendar);

export default YearCalendar;
