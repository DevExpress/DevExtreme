import type { Appointment } from '../../../../ui/scheduler';
import { getAppointmentColor } from '../../../../ui/scheduler/resources/utils';
import { ResourceProps } from '../props';
import { DataAccessorType } from '../types';

export interface ResourcesConfigType {
  resources: ResourceProps[];
  resourceDataAccessors: DataAccessorType;
  loadedResources: [];
  resourceLoaderMap: unknown;
}

export interface AppointmentColorConfigType {
  groupIndex: number;
  groups: [];
  itemData: Appointment;
}

export const createGetAppointmentColor = (resourceConfig: ResourcesConfigType) => (
  appointmentConfig: AppointmentColorConfigType,
): Promise<string> => getAppointmentColor(
  resourceConfig,
  appointmentConfig,
) as Promise<string>;
