import { jest } from '@jest/globals';
import type { DayOfWeek } from '@js/common';
import $ from '@js/core/renderer';
// eslint-disable-next-line devextreme-custom/no-deferred
import { Deferred } from '@js/core/utils/deferred';

import { mockTimeZoneCalculator } from '../../__mock__/timezone_calculator.mock';
import { AppointmentForm } from '../../appointment_popup/form';
import {
  APPOINTMENT_POPUP_CLASS,
  AppointmentPopup,
} from '../../appointment_popup/popup';
import {
  AppointmentDataAccessor,
} from '../../utils/data_accessor/appointment_data_accessor';
import type { IFieldExpr } from '../../utils/data_accessor/types';
import {
  ResourceManager,
} from '../../utils/resource_manager/resource_manager';
import { PopupModel } from './model/popup';

const DEFAULT_FIELDS: IFieldExpr = {
  startDateExpr: 'startDate',
  endDateExpr: 'endDate',
  startDateTimeZoneExpr: 'startDateTimeZone',
  endDateTimeZoneExpr: 'endDateTimeZone',
  allDayExpr: 'allDay',
  textExpr: 'text',
  descriptionExpr: 'description',
  recurrenceRuleExpr: 'recurrenceRule',
  recurrenceExceptionExpr: 'recurrenceException',
  disabledExpr: 'disabled',
  visibleExpr: 'visible',
};

const DEFAULT_EDITING = {
  allowAdding: true,
  allowUpdating: true,
  allowDeleting: true,
  allowResizing: true,
  allowDragging: true,
};

const DEFAULT_APPOINTMENT = {
  text: 'Test Appointment',
  startDate: new Date(2021, 3, 26, 9, 30),
  endDate: new Date(2021, 3, 26, 11, 0),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolvedDeferred = (): any => {
  // @ts-expect-error
  // eslint-disable-next-line devextreme-custom/no-deferred
  const d = new Deferred();
  d.resolve();
  return d.promise();
};

interface CreateAppointmentPopupOptions {
  appointmentData?: Record<string, unknown>;
  editing?: Record<string, unknown>;
  firstDayOfWeek?: number;
  startDayHour?: number;
  onAppointmentFormOpening?: (...args: unknown[]) => void;
  onSave?: jest.Mock<(appointment: Record<string, unknown>) => PromiseLike<unknown>>;
  title?: string;
  readOnly?: boolean;
  addAppointment?: jest.Mock;
  updateAppointment?: jest.Mock;
}

interface CreateAppointmentPopupResult {
  container: HTMLDivElement;
  popup: AppointmentPopup;
  form: AppointmentForm;
  POM: PopupModel;
  callbacks: {
    addAppointment: jest.Mock;
    updateAppointment: jest.Mock;
    focus: jest.Mock;
    onSave: jest.Mock<(appointment: Record<string, unknown>) => PromiseLike<unknown>>;
  };
  dispose: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createComponent(element: any, Component: any, opts: any): any {
  return new Component($(element), opts);
}

const disposables: (() => void)[] = [];

export const disposeAppointmentPopups = (): void => {
  disposables.forEach((fn) => fn());
  disposables.length = 0;
  document.body.innerHTML = '';
};

export const createAppointmentPopup = async (
  options: CreateAppointmentPopupOptions = {},
): Promise<CreateAppointmentPopupResult> => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const dataAccessors = new AppointmentDataAccessor(DEFAULT_FIELDS, false);
  const resourceManager = new ResourceManager([]);
  const timeZoneCalculator = mockTimeZoneCalculator;
  const editing = { ...DEFAULT_EDITING, ...options.editing };

  const addAppointment = options.addAppointment
    ?? jest.fn(resolvedDeferred);
  const updateAppointment = options.updateAppointment
    ?? jest.fn(resolvedDeferred);
  const focus = jest.fn();
  const onSave = options.onSave
    ?? jest.fn<(appointment: Record<string, unknown>) => PromiseLike<unknown>>(resolvedDeferred);

  const formConfig = {
    dataAccessors,
    editing,
    resourceManager,
    firstDayOfWeek: (options.firstDayOfWeek ?? 0) as DayOfWeek,
    startDayHour: options.startDayHour ?? 0,
    createComponent,
    getCalculatedEndDate: (startDate: Date): Date => {
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);
      return endDate;
    },
  };

  const form = new AppointmentForm(formConfig);

  const noop = (): void => { };

  const popupSchedulerProxy = {
    getElement: (): ReturnType<typeof $> => $(container),
    createComponent,
    focus,
    getResourceManager: (): ResourceManager => resourceManager,
    getEditingConfig: (): typeof editing => editing,
    getTimeZoneCalculator: (): typeof timeZoneCalculator => timeZoneCalculator,
    getDataAccessors: (): AppointmentDataAccessor => dataAccessors,
    getAppointmentFormOpening():
    (...args: unknown[]) => void {
      return options.onAppointmentFormOpening ?? noop;
    },
    processActionResult: (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      arg: any,
      callback: (canceled: boolean) => void,
    ): void => {
      callback(arg.cancel);
    },
    addAppointment,
    updateAppointment,
  };

  const popup = new AppointmentPopup(popupSchedulerProxy, form);

  const appointmentData = options.appointmentData
    ?? { ...DEFAULT_APPOINTMENT };
  const title = options.title ?? 'New Appointment';
  const readOnly = options.readOnly ?? false;

  popup.show(appointmentData, { onSave, title, readOnly });
  await new Promise(process.nextTick);

  const selector = `.dx-overlay-wrapper.${APPOINTMENT_POPUP_CLASS}`;
  const overlayWrapper = document.querySelector(
    selector,
  ) as HTMLDivElement;

  if (!overlayWrapper) {
    throw new Error(
      'AppointmentPopup overlay wrapper not found in DOM',
    );
  }

  const POM = new PopupModel(overlayWrapper);

  const dispose = (): void => {
    popup.dispose();
    container.remove();
  };

  disposables.push(dispose);

  return {
    container,
    popup,
    form,
    POM,
    callbacks: {
      addAppointment,
      updateAppointment,
      focus,
      onSave,
    },
    dispose,
  };
};
