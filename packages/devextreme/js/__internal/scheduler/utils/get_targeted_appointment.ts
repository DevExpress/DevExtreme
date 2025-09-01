import type { TimeZoneCalculator } from '../r1/timezone_calculator';
import type { SafeAppointment, TargetedAppointment } from '../types';
import type {
  AppointmentAgendaViewModel, AppointmentCollectorViewModel, AppointmentItemViewModel,
} from '../view_model/generate_view_model/types';
import { AppointmentAdapter } from './appointment_adapter/appointment_adapter';
import type { AppointmentDataAccessor } from './data_accessor/appointment_data_accessor';
import { setAppointmentGroupValues } from './resource_manager/appointment_groups_utils';
import { getLeafGroupValues } from './resource_manager/group_utils';
import type { ResourceManager } from './resource_manager/resource_manager';

const setTargetedAppointmentResources = (
  rawAppointment: SafeAppointment,
  settings: Pick<AppointmentAgendaViewModel | AppointmentItemViewModel, 'info' | 'groupIndex'>,
  resourceManager: ResourceManager,
): void => {
  const { groups, resourceById, groupsLeafs } = resourceManager;
  if (groups.length) {
    const cellGroups = getLeafGroupValues(groupsLeafs, settings.groupIndex);
    setAppointmentGroupValues(rawAppointment, resourceById, cellGroups);
  }
};

export const getTargetedAppointment = (
  rawAppointment: SafeAppointment,
  settings: Pick<AppointmentAgendaViewModel | AppointmentItemViewModel, 'info' | 'groupIndex'>
    | AppointmentCollectorViewModel,
  dataAccessor: AppointmentDataAccessor,
  timeZoneCalculator: TimeZoneCalculator,
  resourceManager: ResourceManager,
): TargetedAppointment => {
  const targetedAdapter = new AppointmentAdapter(
    rawAppointment,
    dataAccessor,
  ).clone();

  if (!('info' in settings)) {
    return {
      ...rawAppointment,
      displayStartDate: targetedAdapter.startDate,
      displayEndDate: targetedAdapter.endDate,
    };
  }

  if ('isAgendaModel' in settings && !targetedAdapter.isRecurrent) {
    const { startDate, endDate } = targetedAdapter.getCalculatedDates(timeZoneCalculator, 'toGrid');
    return {
      ...rawAppointment,
      displayStartDate: startDate,
      displayEndDate: endDate,
    };
  }

  const { info } = settings;
  targetedAdapter.startDate = new Date(info.sourceAppointment.startDate);
  targetedAdapter.endDate = new Date(info.sourceAppointment.endDate);

  const rawTargetedAppointment = targetedAdapter.source as SafeAppointment;
  setTargetedAppointmentResources(rawTargetedAppointment, settings, resourceManager);

  return {
    ...rawTargetedAppointment,
    displayStartDate: new Date(info.appointment.startDate),
    displayEndDate: new Date(info.appointment.endDate),
  };
};
