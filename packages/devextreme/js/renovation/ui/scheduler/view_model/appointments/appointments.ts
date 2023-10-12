import type { Appointment } from '../../../../../ui/scheduler';
import { AppointmentsModelType } from '../../model/types';
import { AppointmentViewModelGenerator } from '../../../../../__internal/scheduler/appointments/m_view_model_generator';
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
      viewOffset: 0,
      isRenovatedAppointments: true,
    },
  ) as AppointmentsViewModelType;
};
