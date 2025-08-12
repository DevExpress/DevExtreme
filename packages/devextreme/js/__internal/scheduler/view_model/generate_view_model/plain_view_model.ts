import type { SafeAppointment } from '@ts/scheduler/types';

import type {
  AgendaViewModelSettingsOld,
  AppointmentViewModelOld,
  AppointmentViewModelSettingsOld,
} from './types';

export const plainViewModel = (
  viewModel: AppointmentViewModelOld[],
): (AppointmentViewModelSettingsOld & AgendaViewModelSettingsOld & {
  itemData: SafeAppointment;
})[] => {
  const result: (AppointmentViewModelSettingsOld & AgendaViewModelSettingsOld & {
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
