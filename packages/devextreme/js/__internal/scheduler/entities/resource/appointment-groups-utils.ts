import { wrapToArray } from '@ts/core/utils/m_array';
import { equalByValue } from '@ts/core/utils/m_common';
import type { SafeAppointment } from '@ts/scheduler/types';

import type { ResourceLoader } from './loader';
import type { ResourceData, ResourceId } from './types';
import type { GroupLeaf, GroupValues, RawGroupValues } from './types';

export interface AppointmentResource {
  label?: string;
  values: string[];
}

export const getResourceItemById = (
  resource: ResourceLoader,
  resourceId: ResourceId,
): ResourceData | undefined => resource
  .items.find((item) => equalByValue(item.id, resourceId));

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
  appointmentGroupValues: GroupValues,
  resourceById: Record<string, ResourceLoader>,
): AppointmentResource[] => Object
  .entries(appointmentGroupValues)
  .reduce<AppointmentResource[]>((result, [resourceIndex, resourceIds]) => {
    const resource = resourceById[resourceIndex];
    const values = resourceIds
      .map((id) => getResourceItemById(resource, id)?.text)
      .filter(Boolean) as string[];

    if (values.length) {
      result.push({
        label: resource.resourceName,
        values,
      });
    }

    return result;
  }, []);

export const setAppointmentGroupValues = <T extends Record<string, unknown>>(
  item: T,
  resourceById: Record<string, ResourceLoader>,
  groups: Record<string, ResourceId> = {},
): void => {
  Object.entries(groups).forEach(([resourceIndex, resourceId]) => {
    const resource = resourceById[resourceIndex];
    const value = resource.allowMultiple ? [resourceId] : resourceId;
    resource.idsSetter(item, value);
  });
};

export const getAppointmentGroupIndex = (
  appointmentGroupValues: GroupValues,
  groupLeafs: GroupLeaf[],
): GroupLeaf['groupIndex'][] => groupLeafs
  .filter(
    (leaf) => Object
      .entries(leaf.grouped)
      .every((
        [resourceIndex, resourceId],
      ) => appointmentGroupValues[resourceIndex]?.includes(resourceId)),
  ).map((leaf) => leaf.groupIndex);

export const groupAppointmentsByGroupLeafs = (
  resourceById: Record<string, ResourceLoader>,
  groupLeafs: GroupLeaf[],
  appointments: SafeAppointment[],
): SafeAppointment[][] => {
  if (!groupLeafs.length) {
    return [appointments];
  }

  return groupLeafs.map(
    (leaf) => appointments.filter((item) => {
      const appointmentGroupValues = getAppointmentGroupValues(item, Object.values(resourceById));

      return Object
        .entries(leaf.grouped)
        .every((
          [resourceIndex, resourceId],
        ) => appointmentGroupValues[resourceIndex]?.includes(resourceId));
    }),
  );
};
