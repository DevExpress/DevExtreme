import { wrapToArray } from '@ts/core/utils/m_array';
import type { SafeAppointment } from '@ts/scheduler/types';

import type { ResourceLoader } from '../loader/resource_loader';
import type { ResourceId } from '../loader/types';
import type { GroupLeaf, GroupValues, RawGroupValues } from './types';

export interface AppointmentResource {
  label?: string;
  values: string[];
}

export const getAppointmentGroupValues = (
  rawAppointment: SafeAppointment,
  resources: ResourceLoader[],
): GroupValues => resources
  .reduce<GroupValues>((result, resource) => {
    const ids = resource.idsGetter(rawAppointment);

    if (ids.length) {
      result[resource.resourceIndex] = ids;
    }

    return result;
  }, {});

export const getRawAppointmentGroupValues = (
  rawAppointment: SafeAppointment,
  resources: ResourceLoader[],
): RawGroupValues => resources
  .reduce<Record<string, ResourceId | ResourceId[]>>((result, resource) => {
    const ids = resource.idsGetter(rawAppointment);

    if (ids.length) {
      result[resource.resourceIndex] = resource.allowMultiple ? ids : ids[0];
    }

    return result;
  }, {});

export const getSafeGroupValues = (
  groupValues: RawGroupValues | GroupValues,
): GroupValues => Object
  .entries(groupValues)
  .reduce<GroupValues>((result, [key, value]) => {
    result[key] = wrapToArray(value);
    return result;
  }, {});

export const getAppointmentResources = (
  appointmentGroups: GroupValues,
  resourceById: Record<string, ResourceLoader>,
): AppointmentResource[] => Object
  .entries(appointmentGroups)
  .reduce<AppointmentResource[]>((result, [resourceIndex, resourceIds]) => {
    const resource = resourceById[resourceIndex];
    const resourceData = resource.items.filter((data) => resourceIds.includes(data.id));

    if (resourceData.length) {
      result.push({
        label: resource.resourceName,
        values: resourceData.map((data) => data.text),
      });
    }

    return result;
  }, []);

export const setAppointmentGroupValues = <T extends Record<string, unknown>>(
  item: T,
  resourceById: Record<string, ResourceLoader>,
  groups: Record<string, ResourceId>,
): void => {
  Object.entries(groups).forEach(([resourceIndex, resourceId]) => {
    const resource = resourceById[resourceIndex];
    const value = resource.allowMultiple ? [resourceId] : resourceId;
    resource.idsSetter(item, value);
  });
};

export const getAppointmentGroupIndex = (
  appointmentGroups: GroupValues,
  groupLeafs: GroupLeaf[],
): GroupLeaf['groupIndex'] | undefined => {
  const found = groupLeafs.find((leaf) => Object
    .entries(leaf.grouped)
    .every((
      [resourceIndex, resourceId],
    ) => appointmentGroups[resourceIndex]?.includes(resourceId)));

  return found?.groupIndex;
};
