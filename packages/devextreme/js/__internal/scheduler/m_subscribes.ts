import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';

import { getDeltaTime } from './appointments/resizing/get_delta_time';
import { getDateFormatType, getDateText } from './appointments_new/utils/get_date_text';
import { VERTICAL_VIEW_TYPES } from './constants';
import type Scheduler from './m_scheduler';
import { isAppointmentTakesAllDay } from './r1/utils/base';
import type {
  AppointmentTooltipItem,
  CompactAppointmentOptions,
  SafeAppointment,
  TargetedAppointment,
} from './types';
import { utils } from './utils';
import { AppointmentAdapter } from './utils/appointment_adapter/appointment_adapter';
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
  isCurrentViewAgenda() {
    return this.currentView.type === 'agenda';
  },

  getOption(name) {
    return this.option(name);
  },

  isVirtualScrolling() {
    return this.isVirtualScrolling();
  },

  isGroupedByDate() {
    return this.getWorkSpace().isGroupedByDate();
  },

  showAppointmentTooltip(options: { data: SafeAppointment; target: dxElementWrapper }) {
    const targetedAppointment = this.getTargetedAppointment(options.data, options.target);
    this.showAppointmentTooltip(options.data, options.target, targetedAppointment);
  },

  hideAppointmentTooltip() {
    this.hideAppointmentTooltip();
  },

  showEditAppointmentPopup(options) {
    const targetedData = this.getTargetedAppointment(options.data, options.target);
    this.showAppointmentPopup(options.data, false, targetedData);
  },

  updateAppointmentAfterResize(options) {
    const { info } = utils.dataAccessors.getAppointmentSettings(options.$appointment) as AppointmentItemViewModel;
    const { startDate } = info.sourceAppointment;

    this.checkRecurringAppointment(options.target, options.data, startDate, () => {
      this.updateAppointmentCore(options.target, options.data, function () {
        this._appointments.moveAppointmentBack();
      });
    });
  },

  // TODO<Appointments>: delete this method when old impl is removed
  getUpdatedData(rawAppointment) {
    return this.getUpdatedData(rawAppointment);
  },

  // TODO<Appointments>: delete this method when old impl is removed
  updateAppointmentAfterDrag({
    event, element, rawAppointment, isDropToTheSameCell, isDropToSelfScheduler,
  }) {
    const { info } = utils.dataAccessors.getAppointmentSettings(element) as AppointmentItemViewModel;
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

    if (isDropToSelfScheduler && (!isDropToTheSameCell || isDragAndDropBetweenComponents || isDropBetweenAllDay)) {
      this.checkRecurringAppointment(rawAppointment, targetedRawAppointment, info.sourceAppointment.startDate, () => {
        this.updateAppointmentCore(rawAppointment, targetedRawAppointment, onCancel, event);
      }, undefined, undefined, event);
    } else {
      onCancel();
    }
  },

  // TODO<Appointments>: delete this method when old impl is removed
  onDeleteButtonPress(options) {
    const targetedData = this.getTargetedAppointment(options.data, $(options.target));
    this.checkAndDeleteAppointment(options.data, targetedData);

    this.hideAppointmentTooltip();
  },

  // TODO<Appointments>: delete this method when old impl is removed
  createFormattedDateText(
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
    const formatType = format ?? getDateFormatType(startDate, endDate, adapter.allDay, this.currentView.type);

    return {
      text: adapter.text || messageLocalization.format('dxScheduler-noSubject'),
      formatDate: getDateText(startDate, endDate, formatType as any),
    };
  },

  getResizableAppointmentArea(options) {
    const { allDay } = options;
    const groups = this.getViewOption('groups');

    if (groups?.length) {
      if (allDay || this.currentView.type === 'month') {
        const horizontalGroupBounds = this._workSpace.getGroupBounds(options.coordinates);
        return {
          left: horizontalGroupBounds.left,
          right: horizontalGroupBounds.right,
          top: 0,
          bottom: 0,
        };
      }

      if (!allDay && VERTICAL_VIEW_TYPES.includes(this.currentView.type) && this._workSpace.isVerticalGroupedWorkSpace()) {
        const verticalGroupBounds = this._workSpace.getGroupBounds(options.coordinates);
        return {
          left: 0,
          right: 0,
          top: verticalGroupBounds.top,
          bottom: verticalGroupBounds.bottom,
        };
      }
    }

    return undefined;
  },

  needRecalculateResizableArea() {
    return this.getWorkSpace().needRecalculateResizableArea();
  },

  isAllDay(appointmentData): boolean {
    return isAllDay(this, appointmentData);
  },

  getDeltaTime(e, initialSize, itemData) {
    return getDeltaTime(e, initialSize, {
      viewType: this.currentView.type,
      cellSize: {
        width: this.getWorkSpace().getCellWidth(),
        height: this.getWorkSpace().getCellHeight(),
      },
      cellDurationInMinutes: this.getWorkSpace().option('cellDuration'),
      resizableStep: this.getWorkSpace().positionHelper.getResizableStep(),
      isAllDayPanel: isAllDay(this, itemData),
    });
  },

  getCellWidth() {
    return this.getWorkSpace().getCellWidth();
  },

  getCellHeight() {
    return this.getWorkSpace().getCellHeight();
  },

  needCorrectAppointmentDates() {
    return !['month', 'timelineMonth'].includes(this.currentView.type);
  },

  getRenderingStrategyDirection() {
    return VERTICAL_VIEW_TYPES.includes(this.currentView.type) ? 'vertical' : 'horizontal';
  },

  updateAppointmentEndDate(options) {
    const { endDate } = options;
    const endDayHour = this.getViewOption('endDayHour');
    const startDayHour = this.getViewOption('startDayHour');

    let updatedEndDate = endDate;

    if (endDate.getHours() >= endDayHour) {
      updatedEndDate.setHours(endDayHour, 0, 0, 0);
    } else if (!options.isSameDate && startDayHour > 0 && (endDate.getHours() * 60 + endDate.getMinutes() < (startDayHour * 60))) {
      updatedEndDate = new Date(updatedEndDate.getTime() - toMs('day'));
      updatedEndDate.setHours(endDayHour, 0, 0, 0);
    }
    return updatedEndDate;
  },

  // TODO<Appointments>: delete this method when old impl is removed
  renderCompactAppointments(options: CompactAppointmentOptions): dxElementWrapper {
    return this._compactAppointmentsHelper.render(options);
  },

  // TODO<Appointments>: delete this method when old impl is removed
  clearCompactAppointments() {
    this._compactAppointmentsHelper.clear();
  },

  getGroupCount() {
    return this._workSpace.getGroupCount();
  },

  // TODO<Appointments>: delete this method when old impl is removed
  mapAppointmentFields(config) {
    const { itemData, itemElement, targetedAppointment } = config;
    const targetedData = targetedAppointment || this.getTargetedAppointment(itemData, itemElement);

    return {
      appointmentData: config.itemData,
      appointmentElement: config.itemElement,
      targetedAppointmentData: targetedData,
    };
  },

  dayHasAppointment(day, appointment, trimTime) {
    return this.dayHasAppointment(day, appointment, trimTime);
  },

  getLayoutManager() {
    return this._layoutManager;
  },

  getAgendaVerticalStepHeight() {
    return this.getWorkSpace().getAgendaVerticalStepHeight();
  },

  getAgendaDuration() {
    return this.getViewOption('agendaDuration');
  },

  getStartViewDate() {
    return this.getStartViewDate();
  },

  getEndViewDate() {
    return this.getEndViewDate();
  },

  forceMaxAppointmentPerCell() {
    return this.forceMaxAppointmentPerCell();
  },

  // TODO<Appointments>: delete this method when old impl is removed
  getTargetedAppointmentData(appointment, element) {
    return this.getTargetedAppointment(appointment, element);
  },

  getEndDayHour() {
    return this._workSpace.option('endDayHour') || this.option('endDayHour');
  },

  getStartDayHour() {
    return this._workSpace.option('startDayHour') || this.option('startDayHour');
  },

  getViewOffsetMs() {
    return this.getViewOffsetMs();
  },

  isAdaptive() {
    return this.option('adaptivityEnabled');
  },

  // TODO<Appointments>: delete this method when old impl is removed
  removeDroppableCellClass() {
    this._workSpace.removeDroppableCellClass();
  },
} as const;

export default subscribes;
export type SubscribeMethods = typeof subscribes;
export type SubscribeKey = keyof typeof subscribes;
