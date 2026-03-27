import type { SafeAppointment, TargetedAppointment } from '../types';
import type {
  AppointmentAgendaViewModel,
  AppointmentItemViewModel,
  AppointmentViewModelPlain,
} from '../view_model/types';
import type { AppointmentDataAccessor } from './data_accessor/appointment_data_accessor';
import { setAppointmentGroupValues } from './resource_manager/appointment_groups_utils';
import { getLeafGroupValues } from './resource_manager/group_utils';
import type { ResourceManager } from './resource_manager/resource_manager';

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

// TODO<Appointments>: remove first parameter when old impl is removed
export const getTargetedAppointmentFromInfo = (
  rawAppointment: SafeAppointment,
  appointmentViewModel: AppointmentAgendaViewModel | AppointmentItemViewModel,
  dataAccessor: AppointmentDataAccessor,
  resourceManager: ResourceManager,
  usePartialDates = false,
): TargetedAppointment => {
  const { itemData, info } = appointmentViewModel;

  const displayDates = usePartialDates && 'partialDates' in info
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

// TODO<Appointments>: remove first parameter when old impl is removed
export const getTargetedAppointment = (
  rawAppointment: SafeAppointment,
  appointmentViewModel: AppointmentViewModelPlain,
  dataAccessor: AppointmentDataAccessor,
  resourceManager: ResourceManager,
): TargetedAppointment => {
  const { itemData } = appointmentViewModel;
  const startDate = dataAccessor.get('startDate', itemData);
  const endDate = dataAccessor.get('endDate', itemData);

  if (!('info' in appointmentViewModel)) {
    return {
      ...itemData,
      displayStartDate: startDate,
      displayEndDate: endDate,
    };
  }

  return getTargetedAppointmentFromInfo(
    itemData,
    appointmentViewModel,
    dataAccessor,
    resourceManager,
  );
};
