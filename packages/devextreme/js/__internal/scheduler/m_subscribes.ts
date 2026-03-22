import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';

import { formatDates, getFormatType } from './appointments/m_text_utils';
import { getDeltaTime } from './appointments/resizing/get_delta_time';
import { VERTICAL_VIEW_TYPES } from './constants';
import type Scheduler from './m_scheduler';
import { utils } from './m_utils';
import { isAppointmentTakesAllDay } from './r1/utils/base';
import type {
  AppointmentTooltipItem,
  CompactAppointmentOptions,
  SafeAppointment,
  TargetedAppointment,
} from './types';
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
    return this._scale.isGroupedByDate;
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

  getUpdatedData(rawAppointment) {
    return this.getUpdatedData(rawAppointment);
  },

  updateAppointmentAfterDrag({
    event, element, rawAppointment, isDropToTheSameCell, isDropToSelfScheduler,
  }) {
    const { info } = utils.dataAccessors.getAppointmentSettings(element) as AppointmentItemViewModel;
    const targetedRawAppointment = extend({}, rawAppointment, this.getUpdatedData(rawAppointment));

    const fromAllDay = Boolean(rawAppointment.allDay);
    const toAllDay = Boolean(targetedRawAppointment.allDay);
    const isDropBetweenAllDay = this._scale.supportAllDayRow && fromAllDay !== toAllDay;

    const isDragAndDropBetweenComponents = event.fromComponent !== event.toComponent;

    const onCancel = (): void => {
      this._appointments.moveAppointmentBack(event);
    };
    if (!isDropToSelfScheduler && isDragAndDropBetweenComponents) {
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

  onDeleteButtonPress(options) {
    const targetedData = this.getTargetedAppointment(options.data, $(options.target));
    this.checkAndDeleteAppointment(options.data, targetedData);

    this.hideAppointmentTooltip();
  },

  createFormattedDateText(
    appointment: AppointmentTooltipItem['appointment'],
    targetedAppointmentRaw: AppointmentTooltipItem['targetedAppointment'],
    format?: string,
  ) {
    const targetedAppointment = {
      ...appointment,
      ...targetedAppointmentRaw,
    } as TargetedAppointment;
    const adapter = new AppointmentAdapter(targetedAppointment, this._dataAccessors);
    const startDate = targetedAppointment.displayStartDate || this.timeZoneCalculator.createDate(adapter.startDate, 'toGrid');
    const endDate = targetedAppointment.displayEndDate || this.timeZoneCalculator.createDate(adapter.endDate, 'toGrid');
    const formatType = format ?? getFormatType(startDate, endDate, adapter.allDay, this.currentView.type !== 'month');

    return {
      text: adapter.text || messageLocalization.format('dxScheduler-noSubject'),
      formatDate: formatDates(startDate, endDate, formatType),
    };
  },

  getResizableAppointmentArea(options) {
    const { allDay } = options;
    const groups = this.getViewOption('groups');

    if (groups?.length) {
      if (allDay || this.currentView.type === 'month') {
        const horizontalGroupBounds = this._scale.getGroupBounds(options.coordinates);
        if (horizontalGroupBounds) {
          return {
            left: horizontalGroupBounds.left,
            right: horizontalGroupBounds.right,
            top: 0,
            bottom: 0,
          };
        }
      }

      if (!allDay && VERTICAL_VIEW_TYPES.includes(this.currentView.type) && this._scale.isVerticalGroupedWorkSpace()) {
        const verticalGroupBounds = this._scale.getGroupBounds(options.coordinates);
        if (verticalGroupBounds) {
          return {
            left: 0,
            right: 0,
            top: verticalGroupBounds.top,
            bottom: verticalGroupBounds.bottom,
          };
        }
      }
    }

    return undefined;
  },

  needRecalculateResizableArea() {
    return this._scale.needRecalculateResizableArea();
  },

  isAllDay(appointmentData): boolean {
    return isAllDay(this, appointmentData);
  },

  getDeltaTime(e, initialSize, itemData) {
    return getDeltaTime(e, initialSize, {
      viewType: this.currentView.type,
      cellSize: {
        width: this._scale.getCellWidth(),
        height: this._scale.getCellHeight(),
      },
      cellDurationInMinutes: this._scale.cellDuration,
      resizableStep: this._scale.getResizableStep(),
      isAllDayPanel: isAllDay(this, itemData),
    });
  },

  getCellWidth() {
    return this._scale.getCellWidth();
  },

  getCellHeight() {
    return this._scale.getCellHeight();
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

  renderCompactAppointments(options: CompactAppointmentOptions): dxElementWrapper {
    return this._compactAppointmentsHelper.render(options);
  },

  clearCompactAppointments() {
    this._compactAppointmentsHelper.clear();
  },

  getGroupCount() {
    return this._scale.groupCount;
  },

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
    return this._scale.agendaVerticalStepHeight;
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

  getTargetedAppointmentData(appointment, element) {
    return this.getTargetedAppointment(appointment, element);
  },

  getEndDayHour() {
    return this._scale.endDayHour || this.option('endDayHour');
  },

  getStartDayHour() {
    return this._scale.startDayHour || this.option('startDayHour');
  },

  getViewOffsetMs() {
    return this.getViewOffsetMs();
  },

  isAdaptive() {
    return this.option('adaptivityEnabled');
  },

  removeDroppableCellClass() {
    this._workSpace.removeDroppableCellClass();
  },
} as const;

export default subscribes;
export type SubscribeMethods = typeof subscribes;
export type SubscribeKey = keyof typeof subscribes;
