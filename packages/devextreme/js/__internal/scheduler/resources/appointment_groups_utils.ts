import type { SafeAppointment } from '../types';
import type {
  AppointmentResourceGroups, GroupLeaf, Resource, ResourceId, SafeResourceConfig,
} from './types';

export interface AppointmentResource {
  label?: string;
  values: string[];
}

export const getAppointmentGroups = (
  rawAppointment: SafeAppointment,
  resourceConfig: SafeResourceConfig[],
): AppointmentResourceGroups => resourceConfig
  .reduce<AppointmentResourceGroups>((result, config) => {
    result[config.resourceIndex] = config.idGetter(rawAppointment);

    return result;
  }, {});

export const getAppointmentResources = (
  appointmentGroups: AppointmentResourceGroups,
  resourceById: Record<string, Resource>,
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

export const setAppointmentGroups = <T>(
  item: T,
  resourceById: Record<string, Resource>,
  groups: Record<string, ResourceId>,
): void => {
  Object.entries(groups).forEach(([resourceIndex, resourceId]) => {
    const resource = resourceById[resourceIndex];
    const value = resource.allowMultiple ? [resourceId] : resourceId;
    resource.idSetter(item, value);
  });
};

export const getAppointmentGroupIndex = (
  appointmentGroups: AppointmentResourceGroups,
  groupLeafs: GroupLeaf[],
): GroupLeaf['groupIndex'] | undefined => {
  const found = groupLeafs.find((leaf) => Object
    .entries(leaf.grouped)
    .every((
      [resourceIndex, resourceId],
    ) => appointmentGroups[resourceIndex]?.includes(resourceId)));

  return found?.groupIndex;
};
