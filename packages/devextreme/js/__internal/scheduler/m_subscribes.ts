import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';

import { getDeltaTime } from './appointments/resizing/get_delta_time';
import { VERTICAL_VIEW_TYPES } from './constants';
import { isAppointmentTakesAllDay } from './r1/utils/base';
import type Scheduler from './scheduler';
import type {
  AppointmentTooltipItem,
  CompactAppointmentOptions,
  SafeAppointment,
  TargetedAppointment,
} from './types';
import { AppointmentAdapter } from './utils/appointment_adapter/appointment_adapter';
import type { DateFormatType } from './utils/get_date_text';
import { getDateFormatType, getDateText } from './utils/get_date_text';
import type { AppointmentItemViewModel } from './view_model/types';

const toMs = dateUtils.dateToMilliseconds;
const isAllDay = (
  scheduler: Scheduler,
  appointmentData: SafeAppointment,
): boolean => {
  const adapter = new AppointmentAdapter(appointmentData, scheduler._dataAccessors);

  if (VERTICAL_VIEW_TYPES.includes(scheduler.currentView.type)) {
    return isAppointmentTakesAllDay(adapter, scheduler.option('allDayPanelMode'));
  }

  return adapter.allDay;
};

const subscribes = {
  isCurrentViewAgenda(this: Scheduler) {
    return this.currentView.type === 'agenda';
  },

  getOption(this: Scheduler, name: string) {
    return this.option(name);
  },

  isVirtualScrolling(this: Scheduler) {
    return this.isVirtualScrolling();
  },

  isGroupedByDate(this: Scheduler) {
    return this.getWorkSpace().isGroupedByDate();
  },

  showAppointmentTooltip(
    this: Scheduler,
    options: { data: SafeAppointment; target: dxElementWrapper },
  ) {
    const targetedAppointment = this.getTargetedAppointment(options.data, options.target);
    this.showAppointmentTooltip(options.data, options.target, targetedAppointment);
  },

  hideAppointmentTooltip(this: Scheduler) {
    this.hideAppointmentTooltip();
  },

  showEditAppointmentPopup(this: Scheduler, options) {
    const targetedData = this.getTargetedAppointment(options.data, options.target);
    this.showAppointmentPopup(options.data, false, targetedData);
  },

  updateAppointmentAfterResize(this: Scheduler, options) {
    const { info } = this._appointments
      .getAppointmentSettings(options.$appointment) as AppointmentItemViewModel;
    const { startDate } = info.sourceAppointment;

    // @ts-expect-error isDeleted: omitted, treated as false
    this.checkRecurringAppointment(options.target, options.data, startDate, () => {
      // eslint-disable-next-line no-void
      void this.updateAppointmentCore(options.target, options.data, function () {
        this._appointments.moveAppointmentBack();
      });
    });
  },

  getUpdatedData(this: Scheduler, rawAppointment) {
    return this.getUpdatedData(rawAppointment);
  },

  updateAppointmentAfterDrag(this: Scheduler, {
    event, element, rawAppointment, isDropToTheSameCell, isDropToSelfScheduler,
  }) {
    const { info } = this._appointments.getAppointmentSettings(element) as AppointmentItemViewModel;
    // NOTE: enrich target appointment with additional data from the source
    // in case of one appointment of series will change
    const targetedRawAppointment = extend({}, rawAppointment, this.getUpdatedData(rawAppointment));

    const fromAllDay = Boolean(rawAppointment.allDay);
    const toAllDay = Boolean(targetedRawAppointment.allDay);
    const isDropBetweenAllDay = this._workSpace.supportAllDayRow() && fromAllDay !== toAllDay;

    const isDragAndDropBetweenComponents = event.fromComponent !== event.toComponent;

    const onCancel = (): void => {
      this._appointments.moveAppointmentBack(event);
    };
    if (!isDropToSelfScheduler && isDragAndDropBetweenComponents) {
      // drop between schedulers
      return;
    }

    if (
      isDropToSelfScheduler
      && (!isDropToTheSameCell || isDragAndDropBetweenComponents || isDropBetweenAllDay)
    ) {
      this.checkRecurringAppointment(
        rawAppointment,
        targetedRawAppointment,
        info.sourceAppointment.startDate,
        () => {
          // eslint-disable-next-line no-void
          void this.updateAppointmentCore(rawAppointment, targetedRawAppointment, onCancel, event);
        },
        // @ts-expect-error isDeleted: undefined is treated as false
        undefined,
        undefined,
        event,
      );
    } else {
      onCancel();
    }
  },

  onDeleteButtonPress(this: Scheduler, options) {
    const targetedData = this.getTargetedAppointment(options.data, $(options.target));
    this.checkAndDeleteAppointment(options.data, targetedData);

    this.hideAppointmentTooltip();
  },

  focusFallbackAfterDelete(this: Scheduler) {
    this.focusFallbackAfterDelete();
  },

  createFormattedDateText(
    this: Scheduler,
    appointment: AppointmentTooltipItem['appointment'],
    targetedAppointmentRaw: TargetedAppointment,
    format?: string,
  ) {
    const targetedAppointment = {
      ...appointment,
      ...targetedAppointmentRaw,
    } as TargetedAppointment;

    const adapter = new AppointmentAdapter(targetedAppointment, this._dataAccessors);
    // pull out time zone converting from appointment adapter for knockout (T947938)
    const startDate = targetedAppointment.displayStartDate || this.timeZoneCalculator.createDate(adapter.startDate, 'toGrid');
    const endDate = targetedAppointment.displayEndDate || this.timeZoneCalculator.createDate(adapter.endDate, 'toGrid');
    const formatType = format
      ?? getDateFormatType(startDate, endDate, adapter.allDay, this.currentView.type);

    return {
      text: adapter.text || messageLocalization.format('dxScheduler-noSubject'),
      formatDate: getDateText(startDate, endDate, formatType as DateFormatType),
    };
  },

  getResizableAppointmentArea(this: Scheduler, options) {
    const { allDay } = options;
    const groups = this.getViewOption('groups');

    if (groups?.length) {
      if (allDay || this.currentView.type === 'month') {
        const horizontalGroupBounds = this._workSpace.getGroupBounds(options.coordinates);
        return {
          // @ts-expect-error getGroupBounds returns bounds whenever the view is grouped
          left: horizontalGroupBounds.left,
          // @ts-expect-error getGroupBounds returns bounds whenever the view is grouped
          right: horizontalGroupBounds.right,
          top: 0,
          bottom: 0,
        };
      }

      if (
        !allDay
        && VERTICAL_VIEW_TYPES.includes(this.currentView.type)
        && this._workSpace.isVerticalGroupedWorkSpace()
      ) {
        const verticalGroupBounds = this._workSpace.getGroupBounds(options.coordinates);
        return {
          left: 0,
          right: 0,
          // @ts-expect-error getGroupBounds returns bounds whenever the view is grouped
          top: verticalGroupBounds.top,
          // @ts-expect-error getGroupBounds returns bounds whenever the view is grouped
          bottom: verticalGroupBounds.bottom,
        };
      }
    }

    return undefined;
  },

  needRecalculateResizableArea(this: Scheduler) {
    return this.getWorkSpace().needRecalculateResizableArea();
  },

  isAllDay(this: Scheduler, appointmentData): boolean {
    return isAllDay(this, appointmentData);
  },

  getDeltaTime(this: Scheduler, e, initialSize, itemData) {
    return getDeltaTime(e, initialSize, {
      viewType: this.currentView.type,
      cellSize: {
        width: this.getWorkSpace().getCellWidth(),
        height: this.getWorkSpace().getCellHeight(),
      },
      // @ts-expect-error SchedulerWorkSpaceLike.option() is untyped
      cellDurationInMinutes: this.getWorkSpace().option('cellDuration'),
      resizableStep: this.getWorkSpace().positionHelper.getResizableStep(),
      isAllDayPanel: isAllDay(this, itemData),
    });
  },

  getCellWidth(this: Scheduler) {
    return this.getWorkSpace().getCellWidth();
  },

  getCellHeight(this: Scheduler) {
    return this.getWorkSpace().getCellHeight();
  },

  needCorrectAppointmentDates(this: Scheduler) {
    return !['month', 'timelineMonth'].includes(this.currentView.type);
  },

  getRenderingStrategyDirection(this: Scheduler) {
    return VERTICAL_VIEW_TYPES.includes(this.currentView.type) ? 'vertical' : 'horizontal';
  },

  updateAppointmentEndDate(this: Scheduler, options: { endDate: Date; isSameDate?: boolean }) {
    const { endDate } = options;
    const endDayHour = this.getViewOption('endDayHour');
    const startDayHour = this.getViewOption('startDayHour');

    let updatedEndDate = endDate;

    if (endDate.getHours() >= endDayHour) {
      updatedEndDate.setHours(endDayHour, 0, 0, 0);
    } else if (
      !options.isSameDate
      && startDayHour > 0
      && (endDate.getHours() * 60 + endDate.getMinutes() < (startDayHour * 60))
    ) {
      updatedEndDate = new Date(updatedEndDate.getTime() - toMs('day'));
      updatedEndDate.setHours(endDayHour, 0, 0, 0);
    }
    return updatedEndDate;
  },

  renderCompactAppointments(this: Scheduler, options: CompactAppointmentOptions): dxElementWrapper {
    return this._compactAppointmentsHelper.render(options);
  },

  clearCompactAppointments(this: Scheduler) {
    this._compactAppointmentsHelper.clear();
  },

  getGroupCount(this: Scheduler) {
    return this._workSpace.getGroupCount();
  },

  mapAppointmentFields(this: Scheduler, config) {
    const { itemData, itemElement, targetedAppointment } = config;
    const targetedData = targetedAppointment || this.getTargetedAppointment(itemData, itemElement);

    return {
      appointmentData: config.itemData,
      appointmentElement: config.itemElement,
      targetedAppointmentData: targetedData,
    };
  },

  dayHasAppointment(this: Scheduler, day, appointment, trimTime) {
    return this.dayHasAppointment(day, appointment, trimTime);
  },

  getLayoutManager(this: Scheduler) {
    return this._layoutManager;
  },

  getAgendaVerticalStepHeight(this: Scheduler) {
    return this.getWorkSpace().getAgendaVerticalStepHeight();
  },

  getAgendaDuration(this: Scheduler) {
    // @ts-expect-error agendaDuration is a view option, not a scheduler option
    return this.getViewOption('agendaDuration');
  },

  getStartViewDate(this: Scheduler) {
    return this.getStartViewDate();
  },

  getEndViewDate(this: Scheduler) {
    return this.getEndViewDate();
  },

  forceMaxAppointmentPerCell(this: Scheduler): unknown {
    // @ts-expect-error Scheduler has no forceMaxAppointmentPerCell method
    return this.forceMaxAppointmentPerCell();
  },

  getTargetedAppointmentData(this: Scheduler, appointment, element) {
    return this.getTargetedAppointment(appointment, element);
  },

  getEndDayHour(this: Scheduler): number {
    // @ts-expect-error SchedulerWorkSpaceLike.option() is untyped
    return this._workSpace.option('endDayHour') || this.option('endDayHour');
  },

  getStartDayHour(this: Scheduler): number {
    // @ts-expect-error SchedulerWorkSpaceLike.option() is untyped
    return this._workSpace.option('startDayHour') || this.option('startDayHour');
  },

  getViewOffsetMs(this: Scheduler) {
    return this.getViewOffsetMs();
  },

  isAdaptive(this: Scheduler) {
    return this.option('adaptivityEnabled');
  },

  removeDroppableCellClass(this: Scheduler) {
    this._workSpace.removeDroppableCellClass();
  },
} as const;

export default subscribes;
export type SubscribeMethods = typeof subscribes;
export type SubscribeKey = keyof typeof subscribes;
