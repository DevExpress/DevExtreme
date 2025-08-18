import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isPlainObject } from '@js/core/utils/type';

import { formatDates, getFormatType } from './appointments/m_text_utils';
import { AGENDA_LAST_IN_DATE_APPOINTMENT_CLASS } from './m_classes';
import { utils } from './m_utils';
import { AppointmentAdapter } from './utils/appointment_adapter/appointment_adapter';
import type { AppointmentItemViewModel } from './view_model/generate_view_model/types';

const toMs = dateUtils.dateToMilliseconds;

const subscribes = {
  isCurrentViewAgenda() {
    return this.currentView.type === 'agenda';
  },
  currentViewUpdated(currentView) {
    this.option('currentView', currentView);
  },

  currentDateUpdated(date) {
    this.option('currentDate', date);
  },

  getOption(name) {
    return this.option(name);
  },

  getWorkspaceOption(name) {
    return this.getWorkSpace().option(name);
  },

  isVirtualScrolling() {
    return this.isVirtualScrolling();
  },

  isGroupedByDate() {
    return this.getWorkSpace().isGroupedByDate();
  },

  showAppointmentTooltip(options) {
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

    this._checkRecurringAppointment(options.target, options.data, startDate, () => {
      this._updateAppointment(options.target, options.data, function () {
        this._appointments.moveAppointmentBack();
      });
    });
  },

  getUpdatedData(rawAppointment) {
    return this._getUpdatedData(rawAppointment);
  },

  updateAppointmentAfterDrag({
    event, element, rawAppointment, isDropToTheSameCell, isDropToSelfScheduler,
  }) {
    const { info } = utils.dataAccessors.getAppointmentSettings(element) as AppointmentItemViewModel;
    // NOTE: enrich target appointment with additional data from the source
    // in case of one appointment of series will change
    const targetedRawAppointment = extend({}, rawAppointment, this._getUpdatedData(rawAppointment));

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
      this._checkRecurringAppointment(rawAppointment, targetedRawAppointment, info.sourceAppointment.startDate, () => {
        this._updateAppointment(rawAppointment, targetedRawAppointment, onCancel, event);
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

  getTextAndFormatDate(appointmentRaw, targetedAppointmentRaw, format) { // TODO: rename to createFormattedDateText
    const targetedAppointment = {
      ...appointmentRaw,
      ...targetedAppointmentRaw,
    };
    // pull out time zone converting from appointment adapter for knockout(T947938)
    const adapter = new AppointmentAdapter(targetedAppointment, this._dataAccessors);
    const { startDate, endDate } = adapter.getCalculatedDates(this.timeZoneCalculator, 'toGrid');

    const formatType = format || getFormatType(startDate, endDate, adapter.allDay, this.currentView.type !== 'month');

    return {
      text: adapter.text,
      formatDate: formatDates(startDate, endDate, formatType),
    };
  },

  _createAppointmentTitle(data) {
    if (isPlainObject(data)) {
      return data.text;
    }

    return String(data);
  },

  getResizableAppointmentArea(options) {
    const { allDay } = options;
    const groups = this.getViewOption('groups');

    if (groups?.length) {
      if (allDay || this.getLayoutManager().getRenderingStrategyInstance()._needHorizontalGroupBounds()) {
        const horizontalGroupBounds = this._workSpace.getGroupBounds(options.coordinates);
        return {
          left: horizontalGroupBounds.left,
          right: horizontalGroupBounds.right,
          top: 0,
          bottom: 0,
        };
      }

      if (this.getLayoutManager().getRenderingStrategyInstance()._needVerticalGroupBounds(allDay) && this._workSpace._isVerticalGroupedWorkSpace()) {
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

  isAllDay(appointmentData) {
    return this.getLayoutManager().getRenderingStrategyInstance().isAllDay(appointmentData);
  },

  getDeltaTime(e, initialSize, itemData) {
    return this.getLayoutManager().getRenderingStrategyInstance().getDeltaTime(e, initialSize, itemData);
  },

  getDropDownAppointmentWidth(isAllDay) {
    return this.getLayoutManager()
      .getRenderingStrategyInstance()
      .getDropDownAppointmentWidth(
        this.currentView.intervalCount,
        isAllDay,
      );
  },

  getDropDownAppointmentHeight() {
    return this.getLayoutManager().getRenderingStrategyInstance().getDropDownAppointmentHeight();
  },

  getCellWidth() {
    return this.getWorkSpace().getCellWidth();
  },

  getCellHeight() {
    return this.getWorkSpace().getCellHeight();
  },

  getMaxAppointmentCountPerCellByType(isAllDay) {
    return this.getLayoutManager().getRenderingStrategyInstance()._getMaxAppointmentCountPerCellByType(isAllDay);
  },

  needCorrectAppointmentDates() {
    return this.getLayoutManager().getRenderingStrategyInstance().needCorrectAppointmentDates();
  },

  getRenderingStrategyDirection() {
    return this.getLayoutManager().getRenderingStrategyInstance().getDirection();
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

  renderCompactAppointments(options): dxElementWrapper {
    return this._compactAppointmentsHelper.render(options);
  },

  clearCompactAppointments() {
    this._compactAppointmentsHelper.clear();
  },

  supportCompactDropDownAppointments() {
    return this.getLayoutManager().getRenderingStrategyInstance().supportCompactDropDownAppointments();
  },

  getGroupCount() {
    return this._workSpace._getGroupCount();
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

  onAgendaReady(rows) {
    const $appts = this.getAppointmentsInstance()._itemElements();
    let total = 0;

    const applyClass = function (_, count) {
      const index = count + total - 1;
      $appts.eq(index).addClass(AGENDA_LAST_IN_DATE_APPOINTMENT_CLASS);
      total += count;
    };

    for (let i = 0; i < rows.length; i++) {
      each(rows[i], applyClass);
    }
  },

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

  removeDroppableCellClass() {
    this._workSpace.removeDroppableCellClass();
  },
} as const;

export default subscribes;
export type SubscribeMethods = typeof subscribes;
export type SubscribeKey = keyof typeof subscribes;
