import type { SafeAppointment } from '@ts/scheduler/types';

import type { ResourceLoader } from '../loader/resource_loader';
import type { ResourceId } from '../loader/types';
import { getAppointmentGroupValues } from './appointment_groups_utils';
import { getLeafGroupValues } from './group_utils';
import type { GroupLeaf } from './types';

const filterResourcesByGroups = (
  resources: ResourceLoader[],
  groups: string[],
): ResourceLoader[] => resources.filter((resource) => groups.includes(resource.resourceIndex));

export const getPaintedResource = (
  resources: ResourceLoader[],
  groups: string[],
): ResourceLoader => {
  const newGroups = groups || [];

  const result = resources.find((resource) => resource.useColorAsDefault);

  if (result) {
    return result;
  }

  const newResources = newGroups.length
    ? filterResourcesByGroups(resources, newGroups)
    : resources;

  return newResources[newResources.length - 1];
};

const getResourceColor = (
  resource: ResourceLoader,
  resourceId: ResourceId,
): string | undefined => resource
  .items.find((item) => item.id === resourceId)?.color;

export const getAppointmentColor = async (
  resources: ResourceLoader[],
  groupsLeafs: GroupLeaf[],
  appointmentConfig: {
    itemData: SafeAppointment;
    groupIndex: number;
  },
): Promise<string | undefined> => {
  const { groupIndex, itemData } = appointmentConfig;
  const appointmentGroups = getAppointmentGroupValues(itemData, resources);
  const groups = Object.keys(appointmentGroups);
  const paintedResource = getPaintedResource(resources || [], groups);

  if (paintedResource) {
    if (!paintedResource.isLoaded()) {
      await paintedResource.load();
    }

    const cellGroups = getLeafGroupValues(groupsLeafs, groupIndex);
    const resourceValues = paintedResource.idsGetter(itemData);
    const resourceId = cellGroups[paintedResource.resourceIndex] ?? resourceValues[0];

    return getResourceColor(paintedResource, resourceId);
  }

  return undefined;
};
