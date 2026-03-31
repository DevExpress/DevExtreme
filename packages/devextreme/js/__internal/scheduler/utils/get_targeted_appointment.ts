// TODO<Appointments>: remove this file after old impl is deleted
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
  rawAppointment: SafeAppointment,
  settings: AppointmentAgendaViewModel | AppointmentItemViewModel,
  resourceManager: ResourceManager,
): void => {
  const { groups, resourceById, groupsLeafs } = resourceManager;
  if (groups.length) {
    const cellGroups = getLeafGroupValues(groupsLeafs, settings.groupIndex);
    setAppointmentGroupValues(rawAppointment, resourceById, cellGroups);
  }
};

export const getTargetedAppointmentFromInfo = (
  rawAppointment: SafeAppointment,
  settings: AppointmentAgendaViewModel | AppointmentItemViewModel,
  dataAccessor: AppointmentDataAccessor,
  resourceManager: ResourceManager,
  usePartialDates = false,
): TargetedAppointment => {
  const { info } = settings;

  const rawTargetedAppointment = { ...rawAppointment } as TargetedAppointment;
  dataAccessor.set('startDate', rawTargetedAppointment, new Date(info.sourceAppointment.startDate));
  dataAccessor.set('endDate', rawTargetedAppointment, new Date(info.sourceAppointment.endDate));
  const displayDates = usePartialDates && 'partialDates' in info
    ? info.partialDates
    : info.appointment;
  rawTargetedAppointment.displayStartDate = new Date(displayDates.startDate);
  rawTargetedAppointment.displayEndDate = new Date(displayDates.endDate);
  setTargetedAppointmentResources(rawTargetedAppointment, settings, resourceManager);

  return rawTargetedAppointment;
};

export const getTargetedAppointment = (
  rawAppointment: SafeAppointment,
  settings: AppointmentViewModelPlain,
  dataAccessor: AppointmentDataAccessor,
  resourceManager: ResourceManager,
): TargetedAppointment => {
  const startDate = dataAccessor.get('startDate', rawAppointment);
  const endDate = dataAccessor.get('endDate', rawAppointment);

  if (!('info' in settings)) {
    return {
      ...rawAppointment,
      displayStartDate: startDate,
      displayEndDate: endDate,
    };
  }

  return getTargetedAppointmentFromInfo(
    rawAppointment,
    settings,
    dataAccessor,
    resourceManager,
  );
};
