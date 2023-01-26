import type { Appointment } from '../../../../ui/scheduler';
import {
  getAppointmentColor as getDeferredAppointmentColor,
} from '../../../../ui/scheduler/resources/utils';
import { ResourceProps } from '../props';
import { DataAccessorType } from '../types';
import { Group } from '../workspaces/types';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type ResourceMapType = Map<string, Promise<Group[]>>;
export interface ResourcesConfigType {
  resources: ResourceProps[];
  resourcesDataAccessors?: DataAccessorType;
  loadedResources?: Group[];
  resourceLoaderMap: ResourceMapType;
}

export interface AppointmentColorConfigType {
  groupIndex: number;
  groups: string[];
  itemData: Appointment;
}

export const getAppointmentColor = (
  resourceConfig: ResourcesConfigType,
  appointmentConfig: AppointmentColorConfigType,
): Promise<string> => getDeferredAppointmentColor(
  {
    ...resourceConfig,
    dataAccessors: resourceConfig.resourcesDataAccessors,
  },
  appointmentConfig,
) as Promise<string>;
