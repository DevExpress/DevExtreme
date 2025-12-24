/* eslint-disable class-methods-use-this */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import type { ViewType } from '@js/ui/scheduler';
import { formatWeekday } from '@ts/scheduler/r1/utils/index';

import type NotifyScheduler from '../base/m_widget_notify_scheduler';
import type Scheduler from '../m_scheduler';
import type { SafeAppointment } from '../types';
import type { AppointmentDataAccessor } from '../utils/data_accessor/appointment_data_accessor';
import { VIEWS } from '../utils/options/constants_view';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import type { ListEntity } from '../view_model/types';
import SchedulerWorkSpace from './m_work_space';
import type { CellClickArgs, YearCalendarProperties } from './m_year_calendar';
import YearCalendar from './m_year_calendar';

const YEAR_CLASS = 'dx-scheduler-work-space-year';
const YEAR_CALENDARS_CONTAINER_CLASS = 'dx-scheduler-year-calendars-container';
const YEAR_CALENDAR_ITEM_CLASS = 'dx-scheduler-year-calendar-item';

class SchedulerWorkSpaceYear extends SchedulerWorkSpace {
  _calendars: YearCalendar[] = [];

  _$workSpace!: dxElementWrapper;

  get type(): ViewType { return VIEWS.YEAR; }

  _getElementClass(): string { return YEAR_CLASS; }

  _getFormat(): (date: Date) => string { return formatWeekday; }

  _renderTimePanel(): void { return noop(); }

  _renderAllDayPanel(): void { return noop(); }

  _renderDateTable(): void { return noop(); }

  _createAllDayPanelElements(): void { return noop(); }

  _insertAllDayRowsIntoDateTable(): boolean { return false; }

  supportAllDayRow(): boolean { return false; }

  keepOriginalHours(): boolean { return true; }

  getTimePanelWidth(): number { return 0; }

  getWorkSpaceLeftOffset(): number { return 0; }

  isIndicationAvailable(): boolean { return false; }

  getIntervalDuration(): number {
    return dateUtils.dateToMilliseconds('day');
  }

  _getCellCoordinatesByIndex(): { rowIndex: number; columnIndex: number } {
    return { rowIndex: 0, columnIndex: 0 };
  }

  _getCellCount(): number { return 0; }

  _getCells(): dxElementWrapper { return $(); }

  getCellWidth(): number { return 0; }

  getCellHeight(): number { return 0; }

  _needCreateCrossScrolling(): boolean { return false; }

  _focusOutHandler(): void { return noop(); }

  _getScrollCoordinates(): { left: number; top: number } {
    return { left: 0, top: 0 };
  }

  getScrollableContainer() {
    return this.$element();
  }

  _getViewStartByOptions(): Date {
    const currentDate = this.option('currentDate') as Date;
    const yearStart = new Date(currentDate.getFullYear(), 0, 1);
    return dateUtils.trimTime(yearStart) as Date;
  }

  getStartViewDate(): Date {
    return this._getViewStartByOptions();
  }

  getEndViewDate(): Date {
    const yearStart = this.getStartViewDate();
    return new Date(yearStart.getFullYear() + 1, 0, 0, 23, 59, 59);
  }

  getDateRange(): [Date, Date] {
    return [this.getStartViewDate(), this.getEndViewDate()];
  }

  _createWorkSpaceElements(): void {
    if (this._$dateTable && this._$dateTable.length) {
      this._disposeCalendars();
      this._$dateTable.remove();
    }

    if (!this._$workSpace) {
      this._$workSpace = $('<div>').addClass('dx-scheduler-work-space');
      this.$element().append(this._$workSpace);
    }

    this._createCellClickAction();

    const $container = $('<div>').addClass(YEAR_CALENDARS_CONTAINER_CLASS);
    this._calendars = [];

    const currentYear = this.getStartViewDate().getFullYear();
    const firstDayOfWeek = this.option('firstDayOfWeek') as number;
    const hasAppointment = this._createHasAppointmentChecker();
    const getAppointmentColor = this._createGetAppointmentColor();
    const getAppointmentsForDate = this._createGetAppointmentsForDate();
    const showAppointmentTooltip = this._createShowAppointmentTooltip();
    const hideAppointmentTooltip = this._createHideAppointmentTooltip();

    for (let month = 0; month < 12; month++) {
      const $calendarItem = $('<div>').addClass(YEAR_CALENDAR_ITEM_CLASS);
      const monthDate = new Date(currentYear, month, 1);

      const calendarOptions: YearCalendarProperties = {
        date: monthDate,
        firstDayOfWeek,
        showMonthLabel: true,
        hasAppointment,
        getAppointmentColor,
        getAppointmentsForDate,
        showAppointmentTooltip,
        hideAppointmentTooltip,
        onCellClick: (e: CellClickArgs) => {
          this._handleYearCalendarCellClick(e);
        },
      };

      // @ts-expect-error
      const calendar = this._createComponent($calendarItem, YearCalendar, calendarOptions);
      this._calendars.push(calendar);
      $container.append($calendarItem);
    }

    this._$dateTable = $container;
    this._$dateTable.appendTo(this._$workSpace);
  }

  _getSchedulerAndDataAccessors(): {
    scheduler: Scheduler;
    dataAccessors: AppointmentDataAccessor;
  } {
    const notifyScheduler = this.option('notifyScheduler') as NotifyScheduler;
    const { scheduler } = notifyScheduler;
    const dataAccessors = scheduler._dataAccessors;
    return { scheduler, dataAccessors };
  }

  _getDayTimeRange(date: Date): { dayStartTime: number; dayEndTime: number } {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayStartTime = dayStart.getTime();
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const dayEndTime = dayEnd.getTime();
    return { dayStartTime, dayEndTime };
  }

  _appointmentIntersectsDay(
    appointment: SafeAppointment,
    dataAccessors: AppointmentDataAccessor,
    dayStartTime: number,
    dayEndTime: number,
  ): boolean {
    const startDate = dataAccessors.get('startDate', appointment);
    const endDate = dataAccessors.get('endDate', appointment);

    const start = new Date(startDate);
    const startTime = start.getTime();
    const end = new Date(endDate);
    const endTime = end.getTime();

    return startTime <= dayEndTime && endTime >= dayStartTime;
  }

  _createHasAppointmentChecker(): (date: Date) => boolean {
    const { scheduler, dataAccessors } = this._getSchedulerAndDataAccessors();

    return (date: Date): boolean => {
      const dataSource = scheduler._dataSource.items() as SafeAppointment[];
      const { dayStartTime, dayEndTime } = this._getDayTimeRange(date);

      return dataSource.some((appointment: SafeAppointment) => this._appointmentIntersectsDay(
        appointment,
        dataAccessors,
        dayStartTime,
        dayEndTime,
      ));
    };
  }

  _createGetAppointmentColor(): (date: Date) => Promise<string | undefined> {
    const { scheduler, dataAccessors } = this._getSchedulerAndDataAccessors();
    const getResourceManager = this.option('getResourceManager') as () => ResourceManager;

    return async (date: Date): Promise<string | undefined> => {
      try {
        const dataSource = scheduler._dataSource.items() as SafeAppointment[];
        const { dayStartTime, dayEndTime } = this._getDayTimeRange(date);

        const appointment = dataSource.find(
          (appt: SafeAppointment) => this._appointmentIntersectsDay(
            appt,
            dataAccessors,
            dayStartTime,
            dayEndTime,
          ),
        );

        if (!appointment) {
          return undefined;
        }

        const resourceManager = getResourceManager();

        const color = await resourceManager.getAppointmentColor({
          itemData: appointment,
          groupIndex: 0,
        });

        return color;
      } catch (e) {
        return undefined;
      }
    };
  }

  _createGetAppointmentsForDate() {
    const { scheduler, dataAccessors } = this._getSchedulerAndDataAccessors();

    return (date: Date): SafeAppointment[] => {
      const dataSource = scheduler._dataSource.items() as SafeAppointment[];
      const { dayStartTime, dayEndTime } = this._getDayTimeRange(date);

      return dataSource.filter((appointment: SafeAppointment) => this._appointmentIntersectsDay(
        appointment,
        dataAccessors,
        dayStartTime,
        dayEndTime,
      ));
    };
  }

  _createShowAppointmentTooltip() {
    const { scheduler } = this._getSchedulerAndDataAccessors();
    const getResourceManager = this.option('getResourceManager') as () => ResourceManager;

    return (appointments: SafeAppointment[], target: dxElementWrapper) => {
      if (!appointments || appointments.length === 0) {
        return;
      }

      const resourceManager = getResourceManager();
      const tooltipItems = appointments.map((appointment) => ({
        appointment,
        targetedAppointment: undefined,
        color: resourceManager.getAppointmentColor({
          itemData: appointment,
          groupIndex: 0,
        }),
      }));

      scheduler.showAppointmentTooltipCore(target, tooltipItems);
    };
  }

  _createHideAppointmentTooltip() {
    const { scheduler } = this._getSchedulerAndDataAccessors();

    return (): void => {
      scheduler.hideAppointmentTooltip();
    };
  }

  _createCellClickAction(): void {
    this._cellClickAction = this._createActionByOption('onCellClick', {
      afterExecute: (actionArgs: any) => {
        const args = actionArgs.args[0];
        if (!args.cancel) {
          const { scheduler } = this._getSchedulerAndDataAccessors();
          if (scheduler && scheduler.showAddAppointmentPopup) {
            scheduler.showAddAppointmentPopup(args.cellData, args.cellData.groups || {});
          }
        }
      },
    });
  }

  _handleYearCalendarCellClick(e: CellClickArgs): void {
    const { scheduler } = this._getSchedulerAndDataAccessors();

    const args = {
      cancel: false,
      cellData: e.cellData,
      cellElement: e.cellElement,
      component: scheduler,
      element: this.element(),
      event: e.event,
    };

    this._cellClickAction(args);
  }

  getCellData($cell: dxElementWrapper): ListEntity {
    const $cellElement = $($cell);
    const dateValue = $cellElement.attr('data-value') as string;

    const [year, month, day] = dateValue.split('/').map(Number);
    const clickedDate = new Date(year, month - 1, day);
    const startDate = new Date(clickedDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(clickedDate);
    endDate.setHours(23, 59, 59, 999);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._normalizeCellData({
      startDate,
      endDate,
      groups: {},
      groupIndex: 0,
      allDay: true,
    });
  }

  getWorkArea(): dxElementWrapper {
    return this._$workSpace || this.$element();
  }

  _renderView(): void {
    this._createWorkSpaceElements();
  }

  _getHeaderDate(): Date {
    return this._getViewStartByOptions();
  }

  repaint(): void {
    this._renderView();
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name } = args;

    if (name === 'currentDate' || name === 'firstDayOfWeek') {
      this._disposeCalendars();
      this._renderView();
    } else {
      super._optionChanged(args);
    }
  }

  _disposeCalendars(): void {
    if (this._calendars) {
      this._calendars.forEach((calendar) => {
        calendar?.dispose();
      });
    }
    this._calendars = [];
    if (this._$dateTable) {
      this._$dateTable.empty();
    }
  }

  _dispose(): void {
    this._disposeCalendars();
    super._dispose();
  }
}

export default SchedulerWorkSpaceYear;
