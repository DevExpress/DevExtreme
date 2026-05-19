import $ from '@js/core/renderer';
import { EmptyTemplate } from '@ts/core/templates/m_empty_template';
import { mockAppointmentDataAccessor } from '@ts/scheduler/__mock__/appointment_data_accessor.mock';
import type { SafeAppointment, TargetedAppointment } from '@ts/scheduler/types';
import type { AppointmentDataAccessor } from '@ts/scheduler/utils/data_accessor/appointment_data_accessor';

import { BaseAppointmentView, type BaseAppointmentViewProperties } from '../appointment/base_appointment';

export const getBaseAppointmentViewProperties = (
  appointmentData: SafeAppointment,
  targetedAppointmentData?: TargetedAppointment,
): BaseAppointmentViewProperties => {
  const normalizedTargetedAppointmentData = targetedAppointmentData ?? {
    ...appointmentData,
    displayStartDate: appointmentData.startDate as Date,
    displayEndDate: appointmentData.endDate as Date,
  };

  const config: BaseAppointmentViewProperties = {
    index: 0,
    tabIndex: 0,
    sortedIndex: 0,
    appointmentData,
    targetedAppointmentData: normalizedTargetedAppointmentData,
    appointmentTemplate: new EmptyTemplate(),
    onRendered: () => {},
    onFocusIn: () => {},
    onFocusOut: () => {},
    onClick: () => {},
    onDblClick: () => {},
    onKeyDown: () => {},
    getDataAccessor: (): AppointmentDataAccessor => mockAppointmentDataAccessor,
    getResourceColor: (): Promise<string | undefined> => Promise.resolve(undefined),
  };

  return config;
};

export const createBaseAppointment = async (
  properties: BaseAppointmentViewProperties,
): Promise<BaseAppointmentView> => {
  const $element = $('.root');

  // @ts-expect-error
  const instance = new BaseAppointmentView($element, properties);

  // Await for resources
  await new Promise(process.nextTick);

  return instance;
};
