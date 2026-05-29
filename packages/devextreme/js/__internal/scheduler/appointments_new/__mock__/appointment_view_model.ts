import type { SafeAppointment } from '@ts/scheduler/types';
import type { AppointmentAgendaViewModel, AppointmentCollectorViewModel, AppointmentItemViewModel } from '@ts/scheduler/view_model/types';

export const mockGridViewModel = (
  appointmentData: SafeAppointment,
  partialViewModel?: Partial<AppointmentItemViewModel>,
): AppointmentItemViewModel => {
  const sourceAppointment = {
    allDay: appointmentData.allDay,
    startDate: appointmentData.startDate as Date,
    endDate: appointmentData.endDate as Date,
  };

  const viewModel: AppointmentItemViewModel = {
    itemData: appointmentData,
    allDay: appointmentData.allDay ?? false,
    groupIndex: appointmentData.groupIndex ?? 0,
    sortedIndex: appointmentData.sortedIndex ?? 0,
    info: {
      sourceAppointment,
      appointment: { ...sourceAppointment },
    },
    direction: 'horizontal',
    skipResizing: false,
    level: 0,
    maxLevel: 0,
    empty: false,
    left: 0,
    top: 0,
    height: 0,
    width: 0,
    reduced: undefined,
    partIndex: 0,
    partTotalCount: 0,
    rowIndex: 0,
    columnIndex: 0,
  };

  return {
    ...viewModel,
    ...partialViewModel,
  };
};

export const mockAgendaViewModel = (
  appointmentData: SafeAppointment,
  partialViewModel?: Partial<AppointmentAgendaViewModel>,
): AppointmentAgendaViewModel => {
  const sourceAppointment = {
    allDay: appointmentData.allDay,
    startDate: appointmentData.startDate as Date,
    endDate: appointmentData.endDate as Date,
  };

  const viewModel: AppointmentAgendaViewModel = {
    itemData: appointmentData,
    allDay: appointmentData.allDay ?? false,
    groupIndex: appointmentData.groupIndex ?? 0,
    sortedIndex: appointmentData.sortedIndex ?? 0,
    isAgendaModel: true,
    height: 50,
    width: '100',
    isLastInGroup: appointmentData.isLastInGroup ?? false,
    info: {
      sourceAppointment,
      appointment: { ...sourceAppointment },
      partialDates: { ...sourceAppointment },
    },
  };

  return {
    ...viewModel,
    ...partialViewModel,
  };
};

export const mockAppointmentCollectorViewModel = (
  appointmentData: SafeAppointment,
  partialViewModel?: Partial<AppointmentCollectorViewModel>,
): AppointmentCollectorViewModel => ({
  itemData: appointmentData,
  allDay: appointmentData.allDay ?? false,
  groupIndex: appointmentData.groupIndex ?? 0,
  sortedIndex: appointmentData.sortedIndex ?? 0,
  top: 0,
  left: 0,
  height: 0,
  width: 0,
  isCompact: false,
  items: [mockGridViewModel(appointmentData)],
  ...partialViewModel,
});
