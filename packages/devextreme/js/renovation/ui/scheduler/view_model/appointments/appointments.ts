import type { Appointment } from '../../../../../ui/scheduler';
import { AppointmentsModelType } from '../../model/types';
import { AppointmentViewModelGenerator } from '../../../../../ui/scheduler/appointments/viewModelGenerator';
import { AppointmentsViewModelType } from '../../appointment/types';

export const getAppointmentsViewModel = (
  model: AppointmentsModelType,
  filteredItems: Appointment[],
): AppointmentsViewModelType => {
  const appointmentViewModel = new AppointmentViewModelGenerator();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return appointmentViewModel.generate(
    filteredItems,
    {
      ...model,
      isRenovatedAppointments: true,
    },
  ) as AppointmentsViewModelType;
};
