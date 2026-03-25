import { mockAppointmentDataAccessor } from '@ts/scheduler/__mock__/appointment_data_accessor.mock';
import { getResourceManagerMock } from '@ts/scheduler/__mock__/resource_manager.mock';
import type { SafeAppointment } from '@ts/scheduler/types';
import type { AppointmentDataAccessor } from '@ts/scheduler/utils/data_accessor/appointment_data_accessor';
import type { ResourceConfig } from '@ts/scheduler/utils/loader/types';
import type { AppointmentAgendaViewModel, AppointmentCollectorViewModel, AppointmentItemViewModel } from '@ts/scheduler/view_model/types';

import { getTargetedAppointment } from '../utils/get_targeted_appointment';
import type { BaseAppointmentProperties } from './base_appointment';

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

export const getBaseMockedAppointmentProperties = <
  TViewModel extends AppointmentItemViewModel | AppointmentAgendaViewModel,
>(options: {
  appointmentData: SafeAppointment;
  viewModel: TViewModel;
  resources?: ResourceConfig[]
}): BaseAppointmentProperties => {
  const resourceManager = getResourceManagerMock(options.resources ?? []);
  const dataAccessor = mockAppointmentDataAccessor;
  const targetedAppointmentData = getTargetedAppointment(
    options.viewModel,
    dataAccessor,
    resourceManager,
  );

  const config: BaseAppointmentProperties = {
    viewModel: options.viewModel,
    targetedAppointmentData,
    appointmentTemplate: 'appointment',
    onAppointmentRendered: () => {},
    getResourceManager: () => resourceManager,
    getDataAccessor: (): AppointmentDataAccessor => mockAppointmentDataAccessor,
  };

  return config;
};
