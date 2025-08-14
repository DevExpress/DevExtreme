import type { SafeAppointment } from '@ts/scheduler/types';

import type {
  AgendaViewModelSettingsInternal,
  AppointmentViewModelInternal,
  AppointmentViewModelSettingsInternal,
} from './types';

export const plainViewModel = (
  viewModel: AppointmentViewModelInternal[],
): (AppointmentViewModelSettingsInternal & AgendaViewModelSettingsInternal & {
  itemData: SafeAppointment;
})[] => {
  const result: (AppointmentViewModelSettingsInternal & AgendaViewModelSettingsInternal & {
    itemData: SafeAppointment;
  })[] = [];

  viewModel.forEach((appointment) => {
    appointment.settings.forEach((setting) => {
      result.push({
        ...setting,
        itemData: appointment.itemData,
      });
    });
  });

  return result;
};
