import type { AppointmentDataAccessor } from '@ts/scheduler/utils/data_accessor/appointment_data_accessor';
import { setAppointmentGroupValues } from '@ts/scheduler/utils/resource_manager/appointment_groups_utils';
import { getLeafGroupValues } from '@ts/scheduler/utils/resource_manager/group_utils';
import type { ResourceManager } from '@ts/scheduler/utils/resource_manager/resource_manager';

import type { TargetedAppointment } from '../../types';
import type {
  AppointmentAgendaViewModel,
  AppointmentItemViewModel,
} from '../../view_model/types';

const setTargetedAppointmentResources = (
  targetedAppointment: TargetedAppointment,
  appointmentViewModel: AppointmentAgendaViewModel | AppointmentItemViewModel,
  resourceManager: ResourceManager,
): void => {
  const { groups, resourceById, groupsLeafs } = resourceManager;
  if (groups.length) {
    const cellGroups = getLeafGroupValues(groupsLeafs, appointmentViewModel.groupIndex);
    setAppointmentGroupValues(targetedAppointment, resourceById, cellGroups);
  }
};

// what's the diff between info.appointment and info.sourceAppointment
export const getTargetedAppointment = (
  appointmentViewModel: AppointmentItemViewModel | AppointmentAgendaViewModel,
  dataAccessor: AppointmentDataAccessor,
  resourceManager: ResourceManager,
): TargetedAppointment => {
  const { info, itemData } = appointmentViewModel;

  const displayDates = 'partialDates' in info
    ? info.partialDates
    : info.appointment;

  const targetedAppointment: TargetedAppointment = {
    ...itemData,
    displayStartDate: new Date(displayDates.startDate),
    displayEndDate: new Date(displayDates.endDate),
  };

  dataAccessor.set('startDate', targetedAppointment, new Date(info.sourceAppointment.startDate));
  dataAccessor.set('endDate', targetedAppointment, new Date(info.sourceAppointment.endDate));

  setTargetedAppointmentResources(targetedAppointment, appointmentViewModel, resourceManager);

  return targetedAppointment;
};
