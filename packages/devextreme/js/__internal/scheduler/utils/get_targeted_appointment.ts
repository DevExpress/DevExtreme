import type { Appointment } from '@js/ui/scheduler';

import type { TimeZoneCalculator } from '../r1/timezone_calculator';
import type {
  AppointmentAgendaViewModel, AppointmentCollectorViewModel, AppointmentItemViewModel,
} from '../view_model/generate_view_model/types';
import { AppointmentAdapter } from './appointment_adapter/appointment_adapter';
import type { AppointmentDataAccessor } from './data_accessor/appointment_data_accessor';
import { setAppointmentGroupValues } from './resource_manager/appointment_groups_utils';
import { getLeafGroupValues } from './resource_manager/group_utils';
import type { ResourceManager } from './resource_manager/resource_manager';

const setTargetedAppointmentResources = <T extends Appointment>(
  rawAppointment: T,
  settings: Pick<AppointmentAgendaViewModel | AppointmentItemViewModel, 'info' | 'groupIndex'>,
  resourceManager: ResourceManager,
): void => {
  const { groups, resourceById, groupsLeafs } = resourceManager;
  if (groups.length) {
    const cellGroups = getLeafGroupValues(groupsLeafs, settings.groupIndex);
    setAppointmentGroupValues(rawAppointment, resourceById, cellGroups);
  }
};

export const getTargetedAppointment = <T extends Appointment>(
  rawAppointment: T,
  settings: Pick<AppointmentItemViewModel, 'info' | 'groupIndex'>
    | Pick<AppointmentAgendaViewModel, 'info' | 'groupIndex' | 'isAgendaModel'>
    | AppointmentCollectorViewModel,
  dataAccessor: AppointmentDataAccessor,
  timeZoneCalculator: TimeZoneCalculator,
  resourceManager: ResourceManager,
): T & {
  displayStartDate: Date;
  displayEndDate: Date;
} => {
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
    const rawTargetedAppointment = {
      ...rawAppointment,
      displayStartDate: startDate,
      displayEndDate: endDate,
    };

    setTargetedAppointmentResources(rawTargetedAppointment, settings, resourceManager);
    return rawTargetedAppointment;
  }

  const { info } = settings;
  targetedAdapter.startDate = new Date(info.sourceAppointment.startDate);
  targetedAdapter.endDate = new Date(info.sourceAppointment.endDate);

  const rawTargetedAppointment = targetedAdapter.source as T;
  setTargetedAppointmentResources(rawTargetedAppointment, settings, resourceManager);

  return {
    ...rawTargetedAppointment,
    displayStartDate: new Date(info.appointment.startDate),
    displayEndDate: new Date(info.appointment.endDate),
  };
};
