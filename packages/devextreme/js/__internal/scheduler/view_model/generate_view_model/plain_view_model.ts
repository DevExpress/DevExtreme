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
})[] => viewModel.flatMap((appointment) => appointment.settings.map(
  (setting) => ({
    ...setting,
    itemData: appointment.itemData,
  }),
));
