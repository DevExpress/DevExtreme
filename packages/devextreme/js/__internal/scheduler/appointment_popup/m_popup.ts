import { triggerResizeEvent } from '@js/common/core/events/visibility_change';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { Deferred, when } from '@js/core/utils/deferred';
import { getWidth } from '@js/core/utils/size';
import { getWindow } from '@js/core/utils/window';
import type { dxPopupOptions, ToolbarItem } from '@js/ui/popup';
import type dxPopup from '@js/ui/popup';
import Popup from '@js/ui/popup/ui.popup';
import { current, isFluent } from '@js/ui/themes';

import { hide as hideLoading, show as showLoading } from '../m_loading';
import type { SafeAppointment } from '../types';
import { AppointmentAdapter } from '../utils/appointment_adapter/appointment_adapter';
import { getAppointmentGroupValues, getRawAppointmentGroupValues } from '../utils/resource_manager/appointment_groups_utils';
import type { AppointmentForm } from './m_form';

export const APPOINTMENT_POPUP_CLASS = 'dx-scheduler-appointment-popup';

const POPUP_FULL_SCREEN_MODE_WINDOW_WIDTH_THRESHOLD = 460;

const DAY_IN_MS = dateUtils.dateToMilliseconds('day');

export const ACTION_TO_APPOINTMENT = {
  CREATE: 0,
  UPDATE: 1,
  EXCLUDE_FROM_SERIES: 2,
};

export class AppointmentPopup {
  scheduler: any;

  form: AppointmentForm;

  private _popup?: dxPopup;

  state: any;

  get popup(): dxPopup {
    return this._popup as dxPopup;
  }

  get visible(): boolean {
    return Boolean(this._popup?.option('visible'));
  }

  constructor(scheduler: any, form: AppointmentForm) {
    this.scheduler = scheduler;
    this.form = form;

    this.state = {
      action: null,
      lastEditData: null,
      saveChangesLocker: false,
      appointment: {
        data: null,
      },
    };
  }

  show(appointment, config) {
    this.state.appointment.data = appointment;
    this.state.action = config.action;
    this.state.allowSaving = config.allowSaving;
    this.state.excludeInfo = config.excludeInfo;

    if (!this._popup) {
      const popupConfig = this._createPopupConfig();
      this._popup = this._createPopup(popupConfig);
    }

    this._popup.show();
  }

  hide() {
    this._popup?.hide();
  }

  dispose() {
    this.form.dispose();
    this._popup?.dispose();
    this._popup = undefined;
  }

  _createPopup(options): dxPopup {
    const popupElement = $('<div>')
      .addClass(APPOINTMENT_POPUP_CLASS)
      .appendTo(this.scheduler.getElement());

    return this.scheduler.createComponent(popupElement, Popup, options);
  }

  _createPopupConfig() {
    return {
      height: 'auto',
      maxHeight: '90%',
      showCloseButton: false,
      showTitle: false,
      preventScrollEvents: false,
      enableBodyScroll: false,
      _ignorePreventScrollEventsDeprecation: true,
      onHiding: (): void => {
        this.scheduler.focus();
      },
      contentTemplate: (): dxElementWrapper => {
        this.form.create({
          dxPopup: this.popup,
          updateToolbarForMainGroup: (): void => this.updateToolbarForMainGroup(),
          updateToolbarForRecurrenceGroup: (): void => this.updateToolbarForRecurrenceGroup(),
        });

        return this.form.dxForm.$element();
      },
      onShowing: (e): void => this._onShowing(e),
      wrapperAttr: { class: APPOINTMENT_POPUP_CLASS },
    };
  }

  _onShowing(e) {
    this._updateForm();

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

  _isReadOnly(appointmentAdapter: AppointmentAdapter): boolean {
    if (Boolean(appointmentAdapter.source) && appointmentAdapter.disabled) {
      return true;
    }

    if (this.state.action === ACTION_TO_APPOINTMENT.CREATE) {
      return false;
    }

    return !this.scheduler.getEditingConfig().allowUpdating;
  }

  _createAppointmentAdapter(rawAppointment): AppointmentAdapter {
    return new AppointmentAdapter(
      rawAppointment,
      this.scheduler.getDataAccessors(),
    );
  }

  _updateForm(): void {
    const rawAppointment = this.state.appointment.data;
    const appointmentAdapter = this._createAppointmentAdapter(rawAppointment)
      .clone()
      .calculateDates(this.scheduler.getTimeZoneCalculator(), 'toAppointment');

    const formData = this._createFormData(appointmentAdapter);

    this.form.formData = formData;
    this.form.readOnly = this._isReadOnly(appointmentAdapter);

    this.form.showMainGroup(false);
  }

  _createFormData(appointmentAdapter: AppointmentAdapter): Record<string, any> {
    const { resources } = this.scheduler.getResourceManager();
    const groupValues = getRawAppointmentGroupValues(
      appointmentAdapter.source as SafeAppointment,
      resources,
    );

    const { allDayExpr, recurrenceRuleExpr } = this.scheduler.getDataAccessors().expr;

    return {
      ...appointmentAdapter.source,
      ...groupValues,
      [allDayExpr]: Boolean(appointmentAdapter.allDay),
      [recurrenceRuleExpr]: appointmentAdapter.recurrenceRule,
    };
  }

  triggerResize(): void {
    if (this.popup?.$element()) {
      triggerResizeEvent(this.popup.$element());
    }
  }

  updatePopupFullScreenMode(): void {
    if (this.visible) {
      const isPopupFullScreenNeeded = () => {
        const window = getWindow();
        const width = window && getWidth(window);

        return width < POPUP_FULL_SCREEN_MODE_WINDOW_WIDTH_THRESHOLD;
      };

      const isFullScreen = isPopupFullScreenNeeded();
      const maxWidth = isFluent(current()) ? 380 : 420;

      this.popup.option('fullScreen', isFullScreen);
      this.popup.option('maxWidth', isFullScreen ? '100%' : maxWidth);
    }
  }

  saveChangesAsync(isShowLoadPanel) {
    // @ts-expect-error
    const deferred = new Deferred();
    const validation = this.form.dxForm.validate();

    isShowLoadPanel && this._showLoadPanel();

    when(validation?.complete ?? validation).done((validation) => {
      if (validation && !(validation as any).isValid) {
        hideLoading();
        deferred.resolve(false);
        return;
      }

      const adapter = this._createAppointmentAdapter(this.form.formData);
      const clonedAdapter = adapter
        .clone()
        .calculateDates(this.scheduler.getTimeZoneCalculator(), 'fromAppointment');

      this._addMissingDSTTime(adapter, clonedAdapter);

      const appointment = clonedAdapter.source;

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

  _saveButtonClickHandler(e) {
    e.cancel = true;
    this.saveEditDataAsync();
  }

  saveEditDataAsync() {
    // @ts-expect-error
    const deferred = new Deferred();

    if (this._tryLockSaveChanges()) {
      when(this.saveChangesAsync(true)).done(() => {
        if (this.state.lastEditData) { // TODO
          const adapter = this._createAppointmentAdapter(this.state.lastEditData);

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

        this._unlockSaveChanges();

        deferred.resolve();
      });
    }

    return deferred.promise();
  }

  _showLoadPanel() {
    const container = (this.popup as any).$overlayContent();

    showLoading({
      container,
      position: {
        of: container,
      },
    });
  }

  _tryLockSaveChanges() {
    if (this.state.saveChangesLocker === false) {
      this.state.saveChangesLocker = true;
      return true;
    }
    return false;
  }

  _unlockSaveChanges() {
    this.state.saveChangesLocker = false;
  }

  // NOTE: Fix ticket T1102713
  _addMissingDSTTime(formAppointmentAdapter, clonedAppointmentAdapter) {
    const timeZoneCalculator = this.scheduler.getTimeZoneCalculator();

    clonedAppointmentAdapter.startDate = this._addMissingDSTShiftToDate(
      timeZoneCalculator,
      formAppointmentAdapter.startDate,
      clonedAppointmentAdapter.startDate,
    );

    if (clonedAppointmentAdapter.endDate) {
      clonedAppointmentAdapter.endDate = this._addMissingDSTShiftToDate(
        timeZoneCalculator,
        formAppointmentAdapter.endDate,
        clonedAppointmentAdapter.endDate,
      );
    }
  }

  _addMissingDSTShiftToDate(timeZoneCalculator, originFormDate, clonedDate) {
    const originTimezoneShift = timeZoneCalculator.getOffsets(originFormDate)?.common;
    const clonedTimezoneShift = timeZoneCalculator.getOffsets(clonedDate)?.common;
    const shiftDifference = originTimezoneShift - clonedTimezoneShift;

    return shiftDifference
      ? new Date(clonedDate.getTime() + shiftDifference * dateUtils.dateToMilliseconds('hour'))
      : clonedDate;
  }

  updateToolbarForRecurrenceGroup(): void {
    const toolbarItems: ToolbarItem[] = [
      {
        toolbar: 'top',
        location: 'before',
        widget: 'dxButton',
        options: {
          icon: 'arrowleft',
          stylingMode: 'text',
          onClick: (): void => {
            this.form.showMainGroup();
          },
        },
      },
      {
        toolbar: 'top',
        location: 'before',
        text: messageLocalization.format('dxScheduler-editorLabelRecurrence'),
        cssClass: 'dx-toolbar-label',
      },
      {
        toolbar: 'top',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: messageLocalization.format('dxScheduler-editPopupSaveButtonText'),
          stylingMode: 'contained',
          type: 'default',
          onClick: (e): void => {
            this.form.showMainGroup();
            e.cancel = true;
            this.saveEditDataAsync();
          },
        },
      },
      {
        toolbar: 'top',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: messageLocalization.format('Cancel'),
          stylingMode: 'outlined',
          onClick: (): void => {
            this.hide();
          },
        },
      },
    ];

    this.popup.option('toolbarItems', toolbarItems);
  }

  updateToolbarForMainGroup(): void {
    const isCreating = this.state.action === ACTION_TO_APPOINTMENT.CREATE;
    const formTitleKey = isCreating ? 'dxScheduler-newPopupTitle' : 'dxScheduler-editPopupTitle';

    const toolbarItems: ToolbarItem[] = [{
      toolbar: 'top',
      location: 'before',
      text: messageLocalization.format(formTitleKey),
      cssClass: 'dx-toolbar-label',
    }];

    const canSave = !this.form.readOnly;
    if (canSave) {
      toolbarItems.push(
        {
          toolbar: 'top',
          location: 'after',
          options: {
            onClick: (e) => this._saveButtonClickHandler(e),
            stylingMode: 'contained',
            type: 'default',
            text: messageLocalization.format('dxScheduler-editPopupSaveButtonText'),
          },
          shortcut: 'done',
        } as ToolbarItem,
      );
    }

    toolbarItems.push({
      toolbar: 'top',
      location: 'after',
      shortcut: 'cancel',
      options: {
        stylingMode: 'outlined',
      },
    } as ToolbarItem);

    this.popup.option('toolbarItems', toolbarItems);
  }
}
