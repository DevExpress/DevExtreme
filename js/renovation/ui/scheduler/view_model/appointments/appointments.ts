import type { Appointment } from '../../../../../ui/scheduler';
import { AppointmentsModelType } from '../../model/types';
import { AppointmentViewModelType } from './types';
import { AppointmentViewModel } from '../../../../../ui/scheduler/appointments/viewModelGenerator';

export const getAppointmentsViewModel = (
  model: AppointmentsModelType,
  filteredItems: Appointment[],
): AppointmentViewModelType => {
  const appointmentViewModel = new AppointmentViewModel();

  const result = appointmentViewModel.generate(filteredItems, model);

  return result;
};
