import type { TimeZoneCalculator } from '../r1/timezone_calculator';
import type { SafeAppointment, TargetedAppointment } from '../types';
import type {
  AppointmentAgendaViewModel,
  AppointmentItemViewModel,
  AppointmentViewModelPlain,
} from '../view_model/generate_view_model/types';
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
): TargetedAppointment => {
  const { info } = settings;

  const rawTargetedAppointment = { ...rawAppointment } as TargetedAppointment;
  dataAccessor.set('startDate', rawTargetedAppointment, new Date(info.sourceAppointment.startDate));
  dataAccessor.set('endDate', rawTargetedAppointment, new Date(info.sourceAppointment.endDate));
  rawTargetedAppointment.displayStartDate = new Date(info.appointment.startDate);
  rawTargetedAppointment.displayEndDate = new Date(info.appointment.endDate);
  setTargetedAppointmentResources(rawTargetedAppointment, settings, resourceManager);

  return rawTargetedAppointment;
};

export const getTargetedAppointment = (
  rawAppointment: SafeAppointment,
  settings: AppointmentViewModelPlain,
  dataAccessor: AppointmentDataAccessor,
  timeZoneCalculator: TimeZoneCalculator,
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

  if ('isAgendaModel' in settings && !dataAccessor.isRecurrent(rawAppointment)) {
    const rawTargetedAppointment = {
      ...rawAppointment,
      displayStartDate: timeZoneCalculator.createDate(startDate, 'toGrid'),
      displayEndDate: timeZoneCalculator.createDate(endDate, 'toGrid'),
    };

    setTargetedAppointmentResources(rawTargetedAppointment, settings, resourceManager);
    return rawTargetedAppointment;
  }

  return getTargetedAppointmentFromInfo(
    rawAppointment,
    settings,
    dataAccessor,
    resourceManager,
  );
};
