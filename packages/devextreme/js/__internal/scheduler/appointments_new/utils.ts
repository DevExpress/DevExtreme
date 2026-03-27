import type {
  AppointmentAgendaViewModel,
  AppointmentCollectorViewModel,
  AppointmentItemViewModel,
  AppointmentViewModelPlain,
} from '../view_model/types';

export const isAgendaAppointmentViewModel = (appointmentViewModel: AppointmentViewModelPlain):
  appointmentViewModel is AppointmentAgendaViewModel => 'isAgendaModel' in appointmentViewModel;

export const isCollectorViewModel = (appointmentViewModel: AppointmentViewModelPlain):
  appointmentViewModel is AppointmentCollectorViewModel => 'isCompact' in appointmentViewModel;

export const isGridAppointmentViewModel = (appointmentViewModel: AppointmentViewModelPlain):
  appointmentViewModel is AppointmentItemViewModel => (
  !isAgendaAppointmentViewModel(appointmentViewModel) && !isCollectorViewModel(appointmentViewModel)
);
