import { EmptyTemplate } from '@ts/core/templates/m_empty_template';
import { mockAppointmentDataAccessor } from '@ts/scheduler/__mock__/appointment_data_accessor.mock';
import type { SafeAppointment, TargetedAppointment } from '@ts/scheduler/types';
import type { AppointmentDataAccessor } from '@ts/scheduler/utils/data_accessor/appointment_data_accessor';

import type { BaseAppointmentProperties } from '../appointment/base_appointment';

export const getBaseAppointmentProperties = (
  appointmentData: SafeAppointment,
  targetedAppointmentData?: TargetedAppointment,
): BaseAppointmentProperties => {
  const normalizedTargetedAppointmentData = targetedAppointmentData ?? {
    ...appointmentData,
    displayStartDate: appointmentData.startDate as Date,
    displayEndDate: appointmentData.endDate as Date,
  };

  const config: BaseAppointmentProperties = {
    appointmentData,
    targetedAppointmentData: normalizedTargetedAppointmentData,
    appointmentTemplate: new EmptyTemplate(),
    onAppointmentRendered: () => {},
    getDataAccessor: (): AppointmentDataAccessor => mockAppointmentDataAccessor,
    getResourceColor: (): Promise<string | undefined> => Promise.resolve(undefined),
  };

  return config;
};
