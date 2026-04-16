import { triggerResizeEvent } from '@js/common/core/events/visibility_change';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getWidth } from '@js/core/utils/size';
import { getWindow } from '@js/core/utils/window';
import type { Properties as PopupProperties, ToolbarItem } from '@js/ui/popup';
import type dxPopup from '@js/ui/popup';
import Popup from '@js/ui/popup/ui.popup';
import { current, isFluent } from '@js/ui/themes';

import { hide as hideLoading, show as showLoading } from '../m_loading';
import type { SafeAppointment } from '../types';
import { AppointmentAdapter } from '../utils/appointment_adapter/appointment_adapter';
import { getRawAppointmentGroupValues } from '../utils/resource_manager/appointment_groups_utils';
import type { AppointmentForm } from './m_form';

export const APPOINTMENT_POPUP_CLASS = 'dx-scheduler-appointment-popup';

const POPUP_FULL_SCREEN_MODE_WINDOW_WIDTH_THRESHOLD = 485;

export interface AppointmentPopupConfig {
  onSave: (appointment: Record<string, unknown>) => PromiseLike<unknown>;
  title: string;
  readOnly: boolean;
}

export class AppointmentPopup {
  scheduler: any;

  form: AppointmentForm;

  // TODO: backing field for popup getter, cannot rename due to name conflict
  private _popup?: dxPopup;

  private customPopupOptions?: PopupProperties;

  state: any;

  private config: AppointmentPopupConfig = {
    onSave: () => Promise.resolve(),
    title: '',
    readOnly: false,
  };

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
      saveChangesLocker: false,
      appointment: {
        data: null,
      },
    };
  }

  show(appointment, config: AppointmentPopupConfig) {
    this.state.appointment.data = appointment;
    this.config = config;

    this.disposePopup();

    const popupConfig = this.createPopupConfig();
    this.createPopup(popupConfig);

    this._popup!.show();
  }

  hide() {
    this._popup?.hide();
  }

  dispose() {
    this.disposePopup();
  }

  private disposePopup(): void {
    if (this._popup) {
      const $element = this._popup.$element();
      this.form.dispose();
      this._popup.dispose();
      $element.remove();
      this._popup = undefined;
    }
  }

  private createPopup(options): void {
    const popupElement = $('<div>')
      .addClass(APPOINTMENT_POPUP_CLASS)
      .appendTo(this.scheduler.getElement());

    this.scheduler.createComponent(popupElement, Popup, options);
  }

  private createPopupConfig(): PopupProperties {
    const editingConfig = this.scheduler.getEditingConfig();
    const customPopupOptions = editingConfig?.popup ?? {};

    this.customPopupOptions = customPopupOptions;

    const defaultPopupConfig = {
      height: 'auto',
      maxHeight: '90%',
      showCloseButton: false,
      showTitle: false,
      preventScrollEvents: false,
      enableBodyScroll: false,
      _ignorePreventScrollEventsDeprecation: true,
      onInitialized: (e): void => {
        this._popup = e.component;
        customPopupOptions?.onInitialized?.(e);
      },
      onHiding: (e): void => {
        this.scheduler.focus();
        customPopupOptions?.onHiding?.(e);
      },
      contentTemplate: (): dxElementWrapper => {
        this.form.create({
          dxPopup: this.popup,
          updateToolbarForMainGroup: (): void => this.updateToolbarForMainGroup(),
          updateToolbarForRecurrenceGroup: (): void => this.updateToolbarForRecurrenceGroup(),
        });

        return this.form.dxForm.$element();
      },
      onShowing: (e): void => {
        this.onShowing(e);
        customPopupOptions?.onShowing?.(e);
      },
      wrapperAttr: { class: APPOINTMENT_POPUP_CLASS },
    };

    return extend(true, {}, defaultPopupConfig, customPopupOptions, {
      onInitialized: defaultPopupConfig.onInitialized,
      onHiding: defaultPopupConfig.onHiding,
      onShowing: defaultPopupConfig.onShowing,
    }) as PopupProperties;
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

  private createAppointmentAdapter(rawAppointment): AppointmentAdapter {
    return new AppointmentAdapter(
      rawAppointment,
      this.scheduler.getDataAccessors(),
    );
  }

  private updateForm(): void {
    const rawAppointment = this.state.appointment.data;
    const appointmentAdapter = this.createAppointmentAdapter(rawAppointment)
      .clone()
      .calculateDates(this.scheduler.getTimeZoneCalculator(), 'toAppointment');

    const formData = this.createFormData(appointmentAdapter);

    this.form.readOnly = this.config.readOnly;
    this.form.formData = formData;

    this.form.showMainGroup();
  }

  private createFormData(appointmentAdapter: AppointmentAdapter): Record<string, any> {
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

  getMaxWidth(): number | string {
    if (this.customPopupOptions?.maxWidth !== undefined) {
      return this.customPopupOptions.maxWidth;
    }
    if (this.customPopupOptions?.width !== undefined) {
      return this.customPopupOptions.width;
    }
    return isFluent(current()) ? 380 : 420;
  }

  updatePopupFullScreenMode(): void {
    if (this.visible) {
      const isPopupFullScreenNeeded = () => {
        const window = getWindow();
        const width = window && getWidth(window);

        return width < POPUP_FULL_SCREEN_MODE_WINDOW_WIDTH_THRESHOLD;
      };

      const isFullScreen = isPopupFullScreenNeeded();

      this.popup.option('fullScreen', isFullScreen);

      if (this.customPopupOptions?.width !== undefined) {
        this.popup.option('width', this.customPopupOptions.width);
      }

      const maxWidth = this.getMaxWidth();
      this.popup.option('maxWidth', isFullScreen ? '100%' : maxWidth);
    }
  }

  saveChangesAsync(isShowLoadPanel) {
    this.form.saveRecurrenceValue();

    // @ts-expect-error
    const deferred = new Deferred();
    const validation = this.form.dxForm.validate();

    isShowLoadPanel && this.showLoadPanel();

    when(validation?.complete ?? validation).done((validation) => {
      if (validation && !(validation as any).isValid) {
        hideLoading();
        deferred.resolve(false);
        return;
      }

      const adapter = this.createAppointmentAdapter(this.form.formData);
      const clonedAdapter = adapter
        .clone()
        .calculateDates(this.scheduler.getTimeZoneCalculator(), 'fromAppointment');

      this.addMissingDSTTime(adapter, clonedAdapter);

      const appointment = clonedAdapter.source;

      when(this.config.onSave(appointment)).done(deferred.resolve);

      deferred.done(() => {
        hideLoading();
      });
    });

    return deferred.promise();
  }

  private saveButtonClickHandler(e) {
    e.cancel = true;
    this.saveEditDataAsync();
  }

  saveEditDataAsync() {
    // @ts-expect-error
    const deferred = new Deferred();

    if (this.tryLockSaveChanges()) {
      when(this.saveChangesAsync(true)).done(() => {
        this.unlockSaveChanges();
        deferred.resolve();
      });
    }

    return deferred.promise();
  }

  private showLoadPanel() {
    const container = (this.popup as any).$overlayContent();

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
      ? new Date(clonedDate.getTime() + shiftDifference * dateUtils.dateToMilliseconds('hour'))
      : clonedDate;
  }

  private tryApplyCustomToolbarItems(): boolean {
    if (this.customPopupOptions?.toolbarItems) {
      this.popup.option('toolbarItems', this.customPopupOptions.toolbarItems);
      return true;
    }
    return false;
  }

  updateToolbarForMainGroup(): void {
    if (this.tryApplyCustomToolbarItems()) {
      return;
    }

    const toolbarItems: ToolbarItem[] = [{
      toolbar: 'top',
      location: 'before',
      text: this.config.title,
      cssClass: 'dx-toolbar-label',
    }];

    const canSave = !this.form.readOnly;
    if (canSave) {
      toolbarItems.push(
        {
          toolbar: 'top',
          location: 'after',
          options: {
            onClick: (e) => this.saveButtonClickHandler(e),
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

  updateToolbarForRecurrenceGroup(): void {
    if (this.tryApplyCustomToolbarItems()) {
      return;
    }

    const toolbarItems: ToolbarItem[] = [
      {
        toolbar: 'top',
        location: 'before',
        widget: 'dxButton',
        options: {
          icon: 'arrowleft',
          stylingMode: 'text',
          elementAttr: {
            'aria-label': messageLocalization.format('Back'),
          },
          onClick: (): void => {
            this.form.saveRecurrenceValue();
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
    ];

    const canSave = !this.form.readOnly;
    if (canSave) {
      toolbarItems.push({
        toolbar: 'top',
        location: 'after',
        options: {
          onClick: (e) => this.saveButtonClickHandler(e),
          stylingMode: 'contained',
          type: 'default',
          text: messageLocalization.format('dxScheduler-editPopupSaveButtonText'),
        },
        shortcut: 'done',
      } as ToolbarItem);
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
