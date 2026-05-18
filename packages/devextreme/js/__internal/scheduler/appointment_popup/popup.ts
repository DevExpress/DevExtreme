import { triggerResizeEvent } from '@js/common/core/events/visibility_change';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { getWidth } from '@js/core/utils/size';
import { isBoolean } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type {
  Properties as PopupProperties,
  ShowingEvent,
  ToolbarItem,
} from '@js/ui/popup';
import type dxPopup from '@js/ui/popup';
import Popup from '@js/ui/popup/ui.popup';
import type { Properties as SchedulerProperties } from '@js/ui/scheduler';
import { current, isFluent } from '@js/ui/themes';
import errors from '@js/ui/widget/ui.errors';

import { hide as hideLoading, show as showLoading } from '../m_loading';
import type { TimeZoneCalculator } from '../r1/timezone_calculator/calculator';
import type { SafeAppointment } from '../types';
import { AppointmentAdapter } from '../utils/appointment_adapter/appointment_adapter';
import type { AppointmentDataAccessor } from '../utils/data_accessor/appointment_data_accessor';
import { getRawAppointmentGroupValues } from '../utils/resource_manager/appointment_groups_utils';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import type { AppointmentForm } from './form';

export const APPOINTMENT_POPUP_CLASS = 'dx-scheduler-appointment-popup';

const POPUP_FULL_SCREEN_MODE_WINDOW_WIDTH_THRESHOLD = 485;

export interface AppointmentPopupConfig {
  onSave: (appointment: Record<string, unknown>) => PromiseLike<unknown>;
  title: string;
  readOnly: boolean;
}

export interface AppointmentPopupState {
  saveChangesLocker: boolean;
  appointment: {
    data: SafeAppointment | null;
  };
}

interface AppointmentFormOpeningArgs {
  form: AppointmentForm['dxForm'];
  popup: dxPopup;
  appointmentData: SafeAppointment | null;
  cancel: boolean;
}

export interface AppointmentPopupContext {
  dxPopup: Popup;
  updateToolbarForMainGroup: () => void;
  updateToolbarForRecurrenceGroup: () => void;
}

interface AppointmentPopupScheduler {
  getElement: () => dxElementWrapper;
  createComponent: (
    element: dxElementWrapper,
    component: unknown,
    options: unknown,
  ) => unknown;
  focus: () => void;
  getResourceManager: () => ResourceManager;
  getEditingConfig: () => SchedulerProperties['editing'];
  getTimeZoneCalculator: () => TimeZoneCalculator;
  getDataAccessors: () => AppointmentDataAccessor;
  getAppointmentFormOpening: () => (args: AppointmentFormOpeningArgs) => void;
  processActionResult: (
    args: AppointmentFormOpeningArgs,
    callback: (canceled: boolean) => void,
  ) => void;
}

export class AppointmentPopup {
  scheduler: AppointmentPopupScheduler;

  form: AppointmentForm;

  // TODO: backing field for popup getter, cannot rename due to name conflict
  private popupInstance?: Popup;

  private customPopupOptions?: PopupProperties;

  state: AppointmentPopupState;

  private config: AppointmentPopupConfig = {
    onSave: () => Promise.resolve(),
    title: '',
    readOnly: false,
  };

  get popup(): Popup {
    return this.popupInstance as Popup;
  }

  get visible(): boolean {
    return Boolean(this.popupInstance?.option('visible'));
  }

  constructor(scheduler: AppointmentPopupScheduler, form: AppointmentForm) {
    this.scheduler = scheduler;
    this.form = form;

    this.state = {
      saveChangesLocker: false,
      appointment: {
        data: null,
      },
    };
  }

  show(appointment: SafeAppointment, config: AppointmentPopupConfig): void {
    this.state.appointment.data = appointment;
    this.config = config;

    this.disposePopup();

    const popupConfig = this.createPopupConfig();
    this.createPopup(popupConfig);

    if (this.popupInstance) {
      this.popupInstance.show().catch(noop);
    } else {
      throw errors.Error('E1033');
    }
  }

  hide(): void {
    if (this.popupInstance) {
      this.popupInstance.hide().catch(noop);
    } else {
      throw errors.Error('E1033');
    }
  }

  dispose(): void {
    this.disposePopup();
  }

  private disposePopup(): void {
    if (this.popupInstance) {
      const $element = this.popupInstance.$element();
      this.form.dispose();
      this.popupInstance.dispose();
      $element.remove();
      this.popupInstance = undefined;
    }
  }

  private createPopup(options: PopupProperties): void {
    const popupElement = $('<div>')
      .addClass(APPOINTMENT_POPUP_CLASS)
      .appendTo(this.scheduler.getElement());

    this.scheduler.createComponent(popupElement, Popup, options);
  }

  private createPopupConfig(): PopupProperties {
    const editingConfig = this.scheduler.getEditingConfig();
    const popupConfig = !isBoolean(editingConfig) ? editingConfig?.popup : undefined;
    const customPopupOptions = popupConfig ?? {};

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
        this.popupInstance = e.component;
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
      onShowing: (e: ShowingEvent): void => {
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

  private onShowing(e): void {
    this.updateForm();

    e.component
      .$overlayContent()
      .attr(
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

  private createFormData(
    appointmentAdapter: AppointmentAdapter,
  ): Record<string, unknown> {
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
      const isPopupFullScreenNeeded = (): boolean => {
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

  saveChangesAsync(isShowLoadPanel = false): Promise<void> {
    this.form.saveRecurrenceValue();

    const validation = this.form.dxForm.validate();

    if (isShowLoadPanel) {
      this.showLoadPanel();
    }

    return Promise.resolve(validation?.complete ?? validation)
      .then((validationResult) => {
        if (!validationResult?.isValid) {
          return undefined;
        }

        const adapter = this.createAppointmentAdapter(this.form.formData);
        const clonedAdapter = adapter
          .clone()
          .calculateDates(this.scheduler.getTimeZoneCalculator(), 'fromAppointment');

        this.addMissingDSTTime(adapter, clonedAdapter);

        const appointment = clonedAdapter.source;

        return this.config.onSave(appointment);
      })
      .then(() => { hideLoading(); })
      .catch(noop);
  }

  private saveButtonClickHandler(e): void {
    e.cancel = true;
    this.saveEditDataAsync().catch(noop);
  }

  private saveEditDataAsync(): Promise<void> {
    if (this.tryLockSaveChanges()) {
      return this.saveChangesAsync(true).then(() => {
        this.unlockSaveChanges();
      });
    }
    return Promise.resolve();
  }

  private showLoadPanel(): void {
    const container = this.popupInstance?.$overlayContent();

    showLoading({
      container,
      position: {
        of: container,
      },
    });
  }

  private tryLockSaveChanges(): boolean {
    if (!this.state.saveChangesLocker) {
      this.state.saveChangesLocker = true;
      return true;
    }
    return false;
  }

  private unlockSaveChanges(): void {
    this.state.saveChangesLocker = false;
  }

  private addMissingDSTTime(
    formAppointmentAdapter: AppointmentAdapter,
    clonedAppointmentAdapter: AppointmentAdapter,
  ): void {
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

  private addMissingDSTShiftToDate(
    timeZoneCalculator: TimeZoneCalculator,
    originFormDate: Date,
    clonedDate: Date,
  ): Date {
    const originTimezoneShift = timeZoneCalculator.getOffsets(
      originFormDate,
      undefined,
    ).common;
    const clonedTimezoneShift = timeZoneCalculator.getOffsets(
      clonedDate,
      undefined,
    ).common;
    const shiftDifference = originTimezoneShift - clonedTimezoneShift;

    return shiftDifference
      ? new Date(
        clonedDate.getTime()
            + shiftDifference * dateUtils.dateToMilliseconds('hour'),
      )
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

    const toolbarItems: ToolbarItem[] = [
      {
        toolbar: 'top',
        location: 'before',
        text: this.config.title,
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
          text: messageLocalization.format(
            'dxScheduler-editPopupSaveButtonText',
          ),
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
          text: messageLocalization.format(
            'dxScheduler-editPopupSaveButtonText',
          ),
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
