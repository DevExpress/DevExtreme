import type { template } from '@js/common';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { start as hoverStartEventName } from '@js/common/core/events/hover';
import { addNamespace } from '@js/common/core/events/utils/index';
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import { data as elementData } from '@js/core/element_data';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import coreDateUtils from '@js/core/utils/date';
import dateSerialization from '@js/core/utils/date_serialization';
import type { DxEvent } from '@js/events';
import type {
  CalendarSelectionMode, CalendarZoomLevel, CellTemplateData, DisabledDate,
} from '@js/ui/calendar';
import type { DefaultActionArgs } from '@ts/core/widget/component';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';

const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_CELL_START_CLASS = 'dx-calendar-cell-start';
const CALENDAR_CELL_END_CLASS = 'dx-calendar-cell-end';
const CALENDAR_CELL_START_IN_ROW_CLASS = 'dx-calendar-cell-start-in-row';
const CALENDAR_CELL_END_IN_ROW_CLASS = 'dx-calendar-cell-end-in-row';
const CALENDAR_WEEK_NUMBER_CELL_CLASS = 'dx-calendar-week-number-cell';
const CALENDAR_EMPTY_CELL_CLASS = 'dx-calendar-empty-cell';
const CALENDAR_TODAY_CLASS = 'dx-calendar-today';
const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_CELL_IN_RANGE_CLASS = 'dx-calendar-cell-in-range';
const CALENDAR_CELL_RANGE_HOVER_CLASS = 'dx-calendar-cell-range-hover';
const CALENDAR_CELL_RANGE_HOVER_START_CLASS = 'dx-calendar-cell-range-hover-start';
const CALENDAR_CELL_RANGE_HOVER_END_CLASS = 'dx-calendar-cell-range-hover-end';
const CALENDAR_RANGE_START_DATE_CLASS = 'dx-calendar-range-start-date';
const CALENDAR_RANGE_END_DATE_CLASS = 'dx-calendar-range-end-date';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';
const NOT_WEEK_CELL_SELECTOR = `td:not(.${CALENDAR_WEEK_NUMBER_CELL_CLASS})`;

const CALENDAR_DXCLICK_EVENT_NAME = addNamespace(clickEventName, 'dxCalendar');
const CALENDAR_DXHOVERSTART_EVENT_NAME = addNamespace(hoverStartEventName, 'dxCalendar');

const CALENDAR_DATE_VALUE_KEY = 'dxDateValueKey';

const DAY_INTERVAL = 86400000;

const CURRENT_DATE_TEXT = {
  month: messageLocalization.format('dxCalendar-currentDay'),
  year: messageLocalization.format('dxCalendar-currentMonth'),
  decade: messageLocalization.format('dxCalendar-currentYear'),
  century: messageLocalization.format('dxCalendar-currentYearRange'),
};
const ARIA_LABEL_DATE_FORMAT = 'date';
const SELECTION_MODE = {
  single: 'single',
  multiple: 'multiple',
  range: 'range',
};

export interface CellEvent extends DefaultActionArgs<BaseView> {
  event: DxEvent<KeyboardEvent | MouseEvent | PointerEvent>;
  value: Date;
}

export interface WeekNumberClickEvent extends DefaultActionArgs<BaseView> {
  event: DxEvent<KeyboardEvent | MouseEvent | PointerEvent>;
  rowDates: Date[];
}

export interface BaseViewProperties extends WidgetProperties {
  date: Date;

  value?: Date | Date[];

  min?: Date;

  max?: Date;

  contouredDate?: Date;

  _todayDate: () => Date;

  selectionMode?: CalendarSelectionMode;

  rowCount: number;

  colCount: number;

  disabledDates?: Date[] | ((data: DisabledDate) => boolean);

  zoomLevel?: CalendarZoomLevel;

  maxZoomLevel?: CalendarZoomLevel;

  allowValueSelection: boolean;

  range: Date[];

  hoveredRange: Date[];

  cellTemplate?: template | (
    (itemData: CellTemplateData, itemIndex: number, itemElement: Element) => dxElementWrapper
  );

  onCellClick?: (e: CellEvent) => void;
  onCellHover?: (e: CellEvent) => void;
  onWeekNumberClick?: (e: WeekNumberClickEvent) => void;
}

class BaseView<
  TProperties extends BaseViewProperties = BaseViewProperties,
> extends Widget<TProperties> {
  _$table!: dxElementWrapper;

  $body!: dxElementWrapper;

  _disabledDatesHandler!: ((data: DisabledDate) => boolean);

  _cellClickAction!: (e: CellEvent) => void;

  _cellHoverAction!: (e: CellEvent) => void;

  _weekNumberCellClickAction!: (e: WeekNumberClickEvent) => void;

  _$rangeEndHoverCell!: dxElementWrapper;

  _$rangeStartDateCell!: dxElementWrapper;

  _$rangeEndDateCell!: dxElementWrapper;

  _$rangeCells!: dxElementWrapper[];

  _$hoveredRangeCells!: dxElementWrapper[];

  _$rangeStartHoverCell!: dxElementWrapper;

  _$selectedCells!: dxElementWrapper[];

  _getViewName(): string {
    return 'base';
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      date: new Date(),
      focusStateEnabled: false,
      cellTemplate: null,
      disabledDates: null,
      onCellClick: null,
      onCellHover: null,
      onWeekNumberClick: null,
      rowCount: 3,
      colCount: 4,
      allowValueSelection: true,
      _todayDate: (): Date => new Date(),
    };
  }

  _initMarkup(): void {
    super._initMarkup();

    this._renderImpl();
  }

  _renderImpl(): void {
    this.$element().append(this._createTable());

    this._createDisabledDatesHandler();
    this._renderBody();
    this._renderContouredDate();
    this._renderValue();
    this._renderRange();
    this._renderEvents();
    this._updateTableAriaLabel();
  }

  _getLocalizedWidgetName(): string {
    const localizedWidgetName = messageLocalization.format('dxCalendar-ariaWidgetName');

    return localizedWidgetName;
  }

  _getSingleModeAriaLabel(): string {
    const { value } = this.option();

    const localizedWidgetName = this._getLocalizedWidgetName();
    const formattedDate = dateLocalization
      .format(value as Date | undefined, ARIA_LABEL_DATE_FORMAT);
    // @ts-expect-error ts-error
    const selectedDatesText = messageLocalization.format('dxCalendar-selectedDate', formattedDate);

    const ariaLabel = `${localizedWidgetName}. ${selectedDatesText}`;

    return ariaLabel;
  }

  _getRangeModeAriaLabel(): string {
    const { value } = this.option();

    const localizedWidgetName = this._getLocalizedWidgetName();
    const [startDate, endDate] = value as [Date, Date];

    const formattedStartDate = dateLocalization.format(startDate, ARIA_LABEL_DATE_FORMAT);
    const formattedEndDate = dateLocalization.format(endDate, ARIA_LABEL_DATE_FORMAT);

    const selectedDatesText = startDate && endDate
      // @ts-expect-error ts-error
      ? messageLocalization.format('dxCalendar-selectedDateRange', formattedStartDate, formattedEndDate)
      // @ts-expect-error ts-error
      : messageLocalization.format('dxCalendar-selectedDate', formattedStartDate ?? formattedEndDate);

    const ariaLabel = `${localizedWidgetName}. ${selectedDatesText}`;

    return ariaLabel;
  }

  _getMultipleModeAriaLabel(): string {
    const localizedWidgetName = this._getLocalizedWidgetName();
    const selectedRangesText = this._getMultipleRangesText();

    const ariaLabel = `${localizedWidgetName}. ${selectedRangesText}`;

    return ariaLabel;
  }

  _getMultipleRangesText(): string {
    const { value } = this.option();
    const rangeValue = value as Date[];
    const ranges = coreDateUtils.getRangesByDates(rangeValue.map((date) => new Date(date)));

    if (ranges.length > 2) {
      // @ts-expect-error ts-error
      const dateRangeCountText = messageLocalization.format('dxCalendar-selectedDateRangeCount', ranges.length);

      return dateRangeCountText;
    }

    const selectedDatesText = messageLocalization.format('dxCalendar-selectedDates');
    const rangesText = ranges
      .map((range) => this._getRangeText(range))
      .join(', ');

    const result = `${selectedDatesText}: ${rangesText}`;

    return result;
  }

  _getRangeText(range: [Date | undefined, Date | undefined]): string {
    const [startDate, endDate] = range;

    const formattedStartDate = dateLocalization.format(startDate, ARIA_LABEL_DATE_FORMAT);
    const formattedEndDate = dateLocalization.format(endDate, ARIA_LABEL_DATE_FORMAT);

    const selectedDatesText = startDate && endDate
      // @ts-expect-error ts-error
      ? messageLocalization.format('dxCalendar-selectedMultipleDateRange', formattedStartDate, formattedEndDate)
      : formattedStartDate;

    return `${selectedDatesText}`;
  }

  _getTableAriaLabel(): string {
    const { value, selectionMode } = this.option();

    const isValueEmpty = !value || (Array.isArray(value) && !value.filter(Boolean).length);

    if (isValueEmpty) {
      return this._getLocalizedWidgetName();
    }

    switch (selectionMode) {
      case SELECTION_MODE.single:
        return this._getSingleModeAriaLabel();
      case SELECTION_MODE.range:
        return this._getRangeModeAriaLabel();
      case SELECTION_MODE.multiple:
        return this._getMultipleModeAriaLabel();
      default:
        return this._getSingleModeAriaLabel();
    }
  }

  _updateTableAriaLabel(): void {
    const label = this._getTableAriaLabel();

    this.setAria({ label }, this._$table);
  }

  _createTable(): dxElementWrapper {
    this._$table = $('<table>');

    this.setAria({ role: 'grid' }, this._$table);

    return this._$table;
  }

  _renderBody(): void {
    this.$body = $('<tbody>').appendTo(this._$table);

    const rowData: { cellDate: Date; prevCellDate: Date | null; row: HTMLElement | undefined } = {
      cellDate: this._getFirstCellData(),
      prevCellDate: null,
      row: undefined,
    };

    const { rowCount: rowsCount, colCount: colsCount } = this.option();

    for (let rowIndex = 0, rowCount = rowsCount; rowIndex < rowCount; rowIndex += 1) {
      rowData.row = this._createRow();
      for (let colIndex = 0, colCount = colsCount; colIndex < colCount; colIndex += 1) {
        this._renderCell(rowData, colIndex);
      }

      this._renderWeekNumberCell(rowData);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _renderWeekNumberCell(rowData?: unknown): void {
  }

  _createRow(): HTMLElement {
    const row = domAdapter.createElement('tr');

    this.setAria('role', 'row', $(row));
    this.$body.get(0).appendChild(row);

    return row;
  }

  _createCell(cellDate: Date, cellIndex: number): { cell: HTMLElement; $cell: dxElementWrapper } {
    const cell = domAdapter.createElement('td');
    const $cell = $(cell);

    cell.className = this._getClassNameByDate(cellDate, cellIndex);

    cell.setAttribute('data-value', dateSerialization.serializeDate(cellDate, coreDateUtils.getShortDateFormat()));
    elementData(cell, CALENDAR_DATE_VALUE_KEY, cellDate);

    this.setAria({
      role: 'gridcell',
      selected: false,
      label: this.getCellAriaLabel(cellDate),
    }, $cell);

    return { cell, $cell };
  }

  _renderCell(
    params: { cellDate: Date; prevCellDate: Date | null; row: HTMLElement | undefined },
    cellIndex: number,
  ): void {
    const { cellDate, prevCellDate, row } = params;

    // T425127
    if (prevCellDate) {
      coreDateUtils.fixTimezoneGap(prevCellDate, cellDate);
    }

    params.prevCellDate = cellDate;

    const { cell, $cell } = this._createCell(cellDate, cellIndex);

    const { cellTemplate } = this.option();

    $(row).append(cell);

    if (cellTemplate) {
      // @ts-expect-error ts-error
      cellTemplate.render(this._prepareCellTemplateData(cellDate, cellIndex, $cell));
    } else {
      cell.innerHTML = this._getCellText(cellDate);
    }

    params.cellDate = this._getNextCellData(cellDate);
  }

  _getClassNameByDate(cellDate: Date, cellIndex: number): string {
    let className = CALENDAR_CELL_CLASS;

    if (this._isTodayCell(cellDate)) {
      className += ` ${CALENDAR_TODAY_CLASS}`;
    }

    if (this._isDateOutOfRange(cellDate) || this.isDateDisabled(cellDate)) {
      className += ` ${CALENDAR_EMPTY_CELL_CLASS}`;
    }

    if (this._isOtherView(cellDate)) {
      className += ` ${CALENDAR_OTHER_VIEW_CLASS}`;
    }

    const { selectionMode } = this.option();

    if (selectionMode === SELECTION_MODE.range) {
      if (cellIndex === 0) {
        className += ` ${CALENDAR_CELL_START_IN_ROW_CLASS}`;
      }

      const { colCount } = this.option();

      if (cellIndex === colCount - 1) {
        className += ` ${CALENDAR_CELL_END_IN_ROW_CLASS}`;
      }

      if (this._isStartDayOfMonth(cellDate)) {
        className += ` ${CALENDAR_CELL_START_CLASS}`;
      }

      if (this._isEndDayOfMonth(cellDate)) {
        className += ` ${CALENDAR_CELL_END_CLASS}`;
      }
    }

    return className;
  }

  _prepareCellTemplateData(cellDate: Date, cellIndex: number, $cell: dxElementWrapper): {
    model: CellTemplateData;
    container: Element;
    index: number;
  } {
    const isDateCell = cellDate instanceof Date;
    const text = isDateCell ? this._getCellText(cellDate) : cellDate;
    const date = isDateCell ? cellDate : undefined;
    const view = this._getViewName();

    return {
      model: { text, date, view },
      container: getPublicElement($cell),
      index: cellIndex,
    };
  }

  _renderEvents(): void {
    this._createCellClickAction();

    eventsEngine.off(this._$table, CALENDAR_DXCLICK_EVENT_NAME);
    eventsEngine.on(this._$table, CALENDAR_DXCLICK_EVENT_NAME, NOT_WEEK_CELL_SELECTOR, (e) => {
      if (!$(e.currentTarget).hasClass(CALENDAR_EMPTY_CELL_CLASS)) {
        this._cellClickAction({
          event: e,
          // @ts-expect-error ts-error
          value: $(e.currentTarget).data(CALENDAR_DATE_VALUE_KEY),
        });
      }
    });

    const { selectionMode } = this.option();

    eventsEngine.off(this._$table, CALENDAR_DXHOVERSTART_EVENT_NAME);
    if (selectionMode === SELECTION_MODE.range) {
      this._createCellHoverAction();

      eventsEngine.on(
        this._$table,
        CALENDAR_DXHOVERSTART_EVENT_NAME,
        NOT_WEEK_CELL_SELECTOR,
        (e) => {
          if (!$(e.currentTarget).hasClass(CALENDAR_EMPTY_CELL_CLASS)) {
            this._cellHoverAction({
              event: e,
              // @ts-expect-error ts-error
              value: $(e.currentTarget).data(CALENDAR_DATE_VALUE_KEY),
            });
          }
        },
      );
    }

    if (selectionMode !== SELECTION_MODE.single) {
      this._createWeekNumberCellClickAction();

      eventsEngine.on(this._$table, CALENDAR_DXCLICK_EVENT_NAME, `.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`, (e) => {
        const $row = $(e.currentTarget).closest('tr');

        const firstDateInRow = $row.find(`.${CALENDAR_CELL_CLASS}`).first().data(CALENDAR_DATE_VALUE_KEY);
        const lastDateInRow = $row.find(`.${CALENDAR_CELL_CLASS}`).last().data(CALENDAR_DATE_VALUE_KEY) ;
        const rowDates = [
          ...coreDateUtils.getDatesOfInterval(firstDateInRow, lastDateInRow, DAY_INTERVAL),
          lastDateInRow,
        ];

        this._weekNumberCellClickAction({
          event: e,
          // @ts-expect-error ts-error
          rowDates,
        });
      });
    }
  }

  _createCellClickAction(): void {
    this._cellClickAction = this._createActionByOption('onCellClick');
  }

  _createCellHoverAction(): void {
    this._cellHoverAction = this._createActionByOption('onCellHover');
  }

  _createWeekNumberCellClickAction(): void {
    this._weekNumberCellClickAction = this._createActionByOption('onWeekNumberClick');
  }

  _createDisabledDatesHandler(): void {
    const { disabledDates } = this.option();

    this._disabledDatesHandler = Array.isArray(disabledDates)
      ? this._getDefaultDisabledDatesHandler(disabledDates)
      : disabledDates ?? ((): boolean => false);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getDefaultDisabledDatesHandler(disabledDates: Date[]): (args) => boolean {
    return () => false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isTodayCell(cellDate: Date): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isDateOutOfRange(cellDate: Date): boolean {
    return false;
  }

  isDateDisabled(cellDate: Date): boolean {
    const dateParts = {
      date: cellDate,
      view: this._getViewName(),
    };

    return this._disabledDatesHandler(dateParts as DisabledDate);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isOtherView(cellDate: Date): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isStartDayOfMonth(cellDate: Date): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isEndDayOfMonth(cellDate: Date): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getCellText(cellDate: Date): string {
    return '';
  }

  _getFirstCellData(): Date {
    return new Date();
  }

  _getNextCellData(date: Date): Date {
    return new Date(date);
  }

  _renderContouredDate(contouredDate?: Date | undefined): void {
    const { focusStateEnabled } = this.option();
    if (!focusStateEnabled) {
      return;
    }
    const { contouredDate: currentContouredDate } = this.option();
    const newContouredDate = contouredDate ?? currentContouredDate;

    const $oldContouredCell = this._getContouredCell();
    const $newContouredCell = this._getCellByDate(newContouredDate);

    $oldContouredCell.removeClass(CALENDAR_CONTOURED_DATE_CLASS);
    if (newContouredDate) {
      $newContouredCell.addClass(CALENDAR_CONTOURED_DATE_CLASS);
    }
  }

  _getContouredCell(): dxElementWrapper {
    return this._$table.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);
  }

  _renderValue(): void {
    if (!this.option('allowValueSelection')) {
      return;
    }

    let { value = [] } = this.option();
    if (!Array.isArray(value)) {
      value = [value];
    }

    this._updateSelectedClass(value);
  }

  _updateSelectedClass(value: Date[]): void {
    if (this._isRangeMode() && !this._isMonthView()) {
      return;
    }

    this._$selectedCells?.forEach(($cell: dxElementWrapper) => {
      $cell.removeClass(CALENDAR_SELECTED_DATE_CLASS);
    });

    this._$selectedCells = value.map((date: Date) => this._getCellByDate(date));
    this._$selectedCells.forEach(($cell) => { $cell.addClass(CALENDAR_SELECTED_DATE_CLASS); });
  }

  _renderRange(): void {
    const { allowValueSelection, value = [], range } = this.option();

    if (!allowValueSelection || !this._isRangeMode() || !this._isMonthView()) {
      return;
    }

    this._$rangeCells?.forEach(($cell) => { $cell.removeClass(CALENDAR_CELL_IN_RANGE_CLASS); });
    this._$hoveredRangeCells?.forEach(($cell) => {
      $cell.removeClass(CALENDAR_CELL_RANGE_HOVER_CLASS);
    });
    this._$rangeStartHoverCell?.removeClass(CALENDAR_CELL_RANGE_HOVER_START_CLASS);
    this._$rangeEndHoverCell?.removeClass(CALENDAR_CELL_RANGE_HOVER_END_CLASS);

    this._$rangeStartDateCell?.removeClass(CALENDAR_RANGE_START_DATE_CLASS);
    this._$rangeEndDateCell?.removeClass(CALENDAR_RANGE_END_DATE_CLASS);

    this._$rangeCells = range.map((date) => this._getCellByDate(date));
    this._$rangeStartDateCell = this._getCellByDate(value[0]);
    this._$rangeEndDateCell = this._getCellByDate(value[1]);

    this._$rangeCells.forEach(($cell) => { $cell.addClass(CALENDAR_CELL_IN_RANGE_CLASS); });
    this._$rangeStartDateCell?.addClass(CALENDAR_RANGE_START_DATE_CLASS);
    this._$rangeEndDateCell?.addClass(CALENDAR_RANGE_END_DATE_CLASS);
  }

  _renderHoveredRange(): void {
    const { allowValueSelection, hoveredRange } = this.option();

    if (!allowValueSelection || !this._isRangeMode() || !this._isMonthView()) {
      return;
    }

    this._$hoveredRangeCells?.forEach(($cell) => {
      $cell.removeClass(CALENDAR_CELL_RANGE_HOVER_CLASS);
    });

    this._$rangeStartHoverCell?.removeClass(CALENDAR_CELL_RANGE_HOVER_START_CLASS);
    this._$rangeEndHoverCell?.removeClass(CALENDAR_CELL_RANGE_HOVER_END_CLASS);

    this._$hoveredRangeCells = hoveredRange
      .map((date) => this._getCellByDate(date));

    this._$rangeStartHoverCell = this._getCellByDate(hoveredRange[0]);
    this._$rangeEndHoverCell = this._getCellByDate(hoveredRange[hoveredRange.length - 1]);

    this._$hoveredRangeCells.forEach(($cell) => {
      $cell.addClass(CALENDAR_CELL_RANGE_HOVER_CLASS);
    });

    this._$rangeStartHoverCell?.addClass(CALENDAR_CELL_RANGE_HOVER_START_CLASS);
    this._$rangeEndHoverCell?.addClass(CALENDAR_CELL_RANGE_HOVER_END_CLASS);
  }

  _isMonthView(): boolean {
    const { zoomLevel } = this.option();

    return zoomLevel === 'month';
  }

  _isRangeMode(): boolean {
    const { selectionMode } = this.option();

    return selectionMode === SELECTION_MODE.range;
  }

  _getCurrentDateFormat(): string | null {
    return null;
  }

  getCellAriaLabel(date: Date): string {
    const viewName = this._getViewName();
    const isToday = this._isTodayCell(date);
    const format = this._getCurrentDateFormat();

    const dateRangeText = format
      ? `${dateLocalization.format(date, format)}`
      : this._getCellText(date);

    const ariaLabel = isToday
      ? `${dateRangeText}. ${CURRENT_DATE_TEXT[viewName]}`
      : dateRangeText;

    return ariaLabel;
  }

  _getFirstAvailableDate(): Date {
    const { date, min } = this.option();
    const firstAvailableDate = coreDateUtils.getViewFirstCellDate(
      this._getViewName(),
      date,
    ) ?? date;

    return new Date(min && firstAvailableDate < min ? min : firstAvailableDate);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getCellByDate(contouredDate: Date | undefined): dxElementWrapper {
    return $();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isBoundary(date?: Date): boolean {
    return false;
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { name, value } = args;
    switch (name) {
      case 'value':
        this._renderValue();
        this._updateTableAriaLabel();
        break;
      case 'range':
        this._renderRange();
        break;
      case 'hoveredRange':
        this._renderHoveredRange();
        break;
      case 'contouredDate':
        this._renderContouredDate(value as Date | undefined);
        break;
      case 'onCellClick':
        this._createCellClickAction();
        break;
      case 'onCellHover':
        this._createCellHoverAction();
        break;
      case 'min':
      case 'max':
      case 'disabledDates':
      case 'cellTemplate':
      case 'selectionMode':
        this._invalidate();
        break;
      case '_todayDate':
        this._renderBody();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default BaseView;
