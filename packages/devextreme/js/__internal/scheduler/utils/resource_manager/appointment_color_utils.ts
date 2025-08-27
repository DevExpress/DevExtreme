import type { SafeAppointment } from '@ts/scheduler/types';

import type { ResourceLoader } from '../loader/resource_loader';
import type { ResourceId } from '../loader/types';
import { getAppointmentGroupValues, getResourceItemById } from './appointment_groups_utils';
import { getLeafGroupValues } from './group_utils';
import type { GroupLeaf } from './types';

/*
 Order:
 1. assigned resource with useColorAsDefault
 2. last resource of assigned groups (in order of grouping)
 3. last resource of assigned resources (in order of resources config)
 4. undefined
 */
export const getPaintedResource = (
  resources: ResourceLoader[],
  appointmentGroups: string[],
  groups: string[],
): ResourceLoader | undefined => {
  const assignedResources = resources
    .filter((resource) => appointmentGroups.includes(resource.resourceIndex));
  const defaultColorResource = assignedResources
    .find((resource) => resource.useColorAsDefault);

  if (defaultColorResource) {
    return defaultColorResource;
  }

  const assignedGroups = groups.filter((group) => appointmentGroups.includes(group));
  const availableGroupedResources = assignedGroups
    .map((group) => assignedResources
      .find((resource) => resource.resourceIndex === group))
    .filter(Boolean);

  return availableGroupedResources.length
    ? availableGroupedResources.at(-1)
    : assignedResources.at(-1);
};

const getResourceColor = (
  resource: ResourceLoader,
  resourceId: ResourceId,
): string | undefined => getResourceItemById(resource, resourceId)?.color;

export const getAppointmentColor = async (
  resources: ResourceLoader[],
  groupsLeafs: GroupLeaf[],
  groups: string[],
  appointmentConfig: {
    itemData: SafeAppointment;
    groupIndex: number;
  },
): Promise<string | undefined> => {
  const { groupIndex, itemData } = appointmentConfig;
  const appointmentGroupValues = getAppointmentGroupValues(itemData, resources);
  const appointmentGroups = Object.keys(appointmentGroupValues);
  const paintedResource = getPaintedResource(
    resources,
    appointmentGroups,
    groups,
  );

  if (!paintedResource) {
    return undefined;
  }

  await paintedResource.load();

  /*
   Order:
   1. resource value of group with groupIndex
   2. resource value of the last value in appointment
   */
  const leafGroupValue = getLeafGroupValues(groupsLeafs, groupIndex);
  const resourceValues = paintedResource.idsGetter(itemData);
  const resourceId = leafGroupValue[paintedResource.resourceIndex] ?? resourceValues[0];

  return getResourceColor(paintedResource, resourceId);
};
