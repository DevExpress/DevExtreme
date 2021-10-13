import type { Appointment } from '../../../../../ui/scheduler';
import { AppointmentsModelType } from '../../model/types';
import { AppointmentViewModelGenerator } from '../../../../../ui/scheduler/appointments/viewModelGenerator';
import { AppointmentViewModel } from '../../appointment/types';
import { AppointmentViewModelType } from './types';

export const getAppointmentsViewModel = (
  model: AppointmentsModelType,
  filteredItems: Appointment[],
): AppointmentViewModel[] => {
  const appointmentViewModel = new AppointmentViewModelGenerator();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const result = appointmentViewModel.generate(
    filteredItems,
    {
      ...model,
      isRenovatedAppointments: true,
    },
  ) as AppointmentViewModelType;

  return result.viewModel;
};
