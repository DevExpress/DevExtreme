import { triggerResizeEvent } from '@js/common/core/events/visibility_change';
import messageLocalization from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { Deferred, when } from '@js/core/utils/deferred';
import Popup from '@js/ui/popup/ui.popup';
import {
  getMaxWidth,
  getPopupToolbarItems,
  isPopupFullScreenNeeded,
} from '@ts/scheduler/r1/appointment_popup/index';

import { hide as hideLoading, show as showLoading } from '../m_loading';
import { AppointmentAdapter } from '../utils/appointment_adapter/appointment_adapter';
import { getAppointmentGroupValues, getRawAppointmentGroupValues } from '../utils/resource_manager/appointment_groups_utils';

const toMs = dateUtils.dateToMilliseconds;

export const APPOINTMENT_POPUP_CLASS = 'dx-scheduler-legacy-appointment-popup';

const DAY_IN_MS = toMs('day');

const POPUP_CONFIG = {
  height: 'auto',
  maxHeight: '100%',
  showCloseButton: false,
  showTitle: false,
  preventScrollEvents: false,
  enableBodyScroll: false,
  defaultOptionsRules: [
    {
      device: () => devices.current().android,
      options: {
        showTitle: false,
      },
    },
  ],
  _ignorePreventScrollEventsDeprecation: true,
};

export const ACTION_TO_APPOINTMENT = {
  CREATE: 0,
  UPDATE: 1,
  EXCLUDE_FROM_SERIES: 2,
};

export class AppointmentPopup {
  scheduler: any;

  form: any;

  popup: any;

  state: any;

  constructor(scheduler, form) {
    this.scheduler = scheduler;
    this.form = form;
    this.popup = null;

    this.state = {
      action: null,
      lastEditData: null,
      saveChangesLocker: false,
      appointment: {
        data: null,
      },
    };
  }

  get visible() {
    return this.popup ? this.popup.option('visible') : false;
  }

  show(appointment, config) {
    this.state.appointment.data = appointment;
    this.state.action = config.action;
    this.state.excludeInfo = config.excludeInfo;

    if (!this.popup) {
      const popupConfig = this.createPopupConfig();
      this.popup = this.createPopup(popupConfig);
    }

    this.popup.option(
      'toolbarItems',
      getPopupToolbarItems(
        config.isToolbarVisible,
        (e) => this.doneButtonClickHandler(e),
      ),
    );

    this.popup.show();
  }

  hide() {
    this.popup.hide();
  }

  dispose() {
    this.popup?.$element().remove();
  }

  private createPopup(options) {
    const popupElement = $('<div>')
      .addClass(APPOINTMENT_POPUP_CLASS)
      .appendTo(this.scheduler.getElement());

    return this.scheduler.createComponent(popupElement, Popup, options);
  }

  private createPopupConfig() {
    return {
      ...POPUP_CONFIG,
      onHiding: () => this.scheduler.focus(),
      contentTemplate: () => this.createPopupContent(),
      onShowing: (e) => this.onShowing(e),
      wrapperAttr: { class: APPOINTMENT_POPUP_CLASS },
    };
  }

  private onShowing(e) {
    this.updateForm();

    e.component.$overlayContent().attr(
      'aria-label',
      messageLocalization.format('dxScheduler-ariaEditForm'),
    );

    const arg = {
      form: this.form.dxForm,
      popup: this.popup,
      appointmentData: this.state.appointment.data,
      cancel: false,
    };

    this.scheduler.getAppointmentFormOpening()(arg);
    this.scheduler.processActionResult(arg, (canceled) => {
      if (canceled) {
        e.cancel = true;
      } else {
        this.updatePopupFullScreenMode();
      }
    });
  }

  private createPopupContent() {
    this.createForm();
    return this.form.dxForm.$element(); // TODO
  }

  private createFormData(rawAppointment) {
    const appointment = this.createAppointmentAdapter(rawAppointment);
    const resourceManager = this.scheduler.getResourceManager();
    const rawAppointmentGroupValues = getRawAppointmentGroupValues(
      rawAppointment,
      resourceManager.resources,
    );

    return {
      ...rawAppointment,
      ...rawAppointmentGroupValues,
      repeat: Boolean(appointment.recurrenceRule),
    };
  }

  private createForm() {
    const rawAppointment = this.state.appointment.data;
    const formData = this.createFormData(rawAppointment);

    this.form.create(this.triggerResize.bind(this), this.changeSize.bind(this), formData); // TODO
  }

  private isReadOnly(rawAppointment) {
    const appointment = this.createAppointmentAdapter(rawAppointment);

    if (rawAppointment && appointment.disabled) {
      return true;
    }

    if (this.state.action === ACTION_TO_APPOINTMENT.CREATE) {
      return false;
    }

    return !this.scheduler.getEditingConfig().allowUpdating;
  }

  private createAppointmentAdapter(rawAppointment) {
    return new AppointmentAdapter(
      rawAppointment,
      this.scheduler.getDataAccessors(),
    );
  }

  private updateForm() {
    const { data } = this.state.appointment;
    const appointment = this.createFormData(data);
    const formData = this.createAppointmentAdapter(appointment)
      .clone()
      .calculateDates(this.scheduler.getTimeZoneCalculator(), 'toAppointment')
      .source;

    this.form.readOnly = this.isReadOnly(formData);
    this.form.updateFormData(formData);
  }

  triggerResize() {
    if (this.popup) {
      triggerResizeEvent(this.popup.$element());
    }
  }

  changeSize(isRecurrence) {
    if (this.popup) {
      const isFullScreen = isPopupFullScreenNeeded();
      const maxWidth = isFullScreen
        ? '100%'
        : getMaxWidth(isRecurrence);
      this.popup.option('fullScreen', isFullScreen);
      this.popup.option('maxWidth', maxWidth);
    }
  }

  updatePopupFullScreenMode() {
    if (this.form.dxForm && this.visible) { // TODO
      const { formData } = this.form;
      const dataAccessors = this.scheduler.getDataAccessors();
      const isRecurrence = dataAccessors.get('recurrenceRule', formData);

      this.changeSize(isRecurrence);
    }
  }

  saveChangesAsync(isShowLoadPanel) {
    // @ts-expect-error
    const deferred = new Deferred();
    const validation = this.form.dxForm.validate();

    isShowLoadPanel && this.showLoadPanel();

    when(validation?.complete || validation).done((validation) => {
      if (validation && !validation.isValid) {
        hideLoading();
        deferred.resolve(false);
        return;
      }

      const { repeat } = this.form.formData;
      const adapter = this.createAppointmentAdapter(this.form.formData);
      const clonedAdapter = adapter
        .clone()
        .calculateDates(this.scheduler.getTimeZoneCalculator(), 'fromAppointment');
      const shouldClearRecurrenceRule = !repeat && Boolean(clonedAdapter.recurrenceRule);

      this.addMissingDSTTime(adapter, clonedAdapter);

      if (shouldClearRecurrenceRule) {
        clonedAdapter.recurrenceRule = '';
      }

      const appointment = clonedAdapter.source;
      delete appointment.repeat; // TODO

      switch (this.state.action) {
        case ACTION_TO_APPOINTMENT.CREATE:
          this.scheduler.addAppointment(appointment).done(deferred.resolve);
          break;
        case ACTION_TO_APPOINTMENT.UPDATE:
          this.scheduler.updateAppointment(this.state.appointment.data, appointment).done(deferred.resolve);
          break;
        case ACTION_TO_APPOINTMENT.EXCLUDE_FROM_SERIES:
          this.scheduler.updateAppointment(this.state.excludeInfo.sourceAppointment, this.state.excludeInfo.updatedAppointment);
          this.scheduler.addAppointment(appointment).done(deferred.resolve);
          break;
        default:
          break;
      }

      deferred.done(() => {
        hideLoading();
        this.state.lastEditData = appointment;
      });
    });

    return deferred.promise();
  }

  private doneButtonClickHandler(e) {
    e.cancel = true;
    this.saveEditDataAsync();
  }

  saveEditDataAsync() {
    // @ts-expect-error
    const deferred = new Deferred();

    if (this.tryLockSaveChanges()) {
      when(this.saveChangesAsync(true)).done(() => {
        if (this.state.lastEditData) { // TODO
          const adapter = this.createAppointmentAdapter(this.state.lastEditData);

          const { startDate, endDate, allDay } = adapter;

          const startTime = startDate.getTime();
          const endTime = endDate.getTime();

          const inAllDayRow = allDay || (endTime - startTime) >= DAY_IN_MS;
          const resourceManager = this.scheduler.getResourceManager();
          const appointmentGroupValues = getAppointmentGroupValues(
            this.state.lastEditData,
            resourceManager.resources,
          );

          this.scheduler.updateScrollPosition(startDate, appointmentGroupValues, inAllDayRow);
          this.state.lastEditData = null;
        }

        this.unlockSaveChanges();

        deferred.resolve();
      });
    }

    return deferred.promise();
  }

  private showLoadPanel() {
    const container = this.popup.$overlayContent();

    showLoading({
      container,
      position: {
        of: container,
      },
    });
  }

  private tryLockSaveChanges() {
    if (this.state.saveChangesLocker === false) {
      this.state.saveChangesLocker = true;
      return true;
    }
    return false;
  }

  private unlockSaveChanges() {
    this.state.saveChangesLocker = false;
  }

  // NOTE: Fix ticket T1102713
  private addMissingDSTTime(formAppointmentAdapter, clonedAppointmentAdapter) {
    const timeZoneCalculator = this.scheduler.getTimeZoneCalculator();

    clonedAppointmentAdapter.startDate = this.addMissingDSTShiftToDate(
      timeZoneCalculator,
      formAppointmentAdapter.startDate,
      clonedAppointmentAdapter.startDate,
    );

    if (clonedAppointmentAdapter.endDate) {
      clonedAppointmentAdapter.endDate = this.addMissingDSTShiftToDate(
        timeZoneCalculator,
        formAppointmentAdapter.endDate,
        clonedAppointmentAdapter.endDate,
      );
    }
  }

  private addMissingDSTShiftToDate(timeZoneCalculator, originFormDate, clonedDate) {
    const originTimezoneShift = timeZoneCalculator.getOffsets(originFormDate)?.common;
    const clonedTimezoneShift = timeZoneCalculator.getOffsets(clonedDate)?.common;
    const shiftDifference = originTimezoneShift - clonedTimezoneShift;

    return shiftDifference
      ? new Date(clonedDate.getTime() + shiftDifference * toMs('hour'))
      : clonedDate;
  }
}
