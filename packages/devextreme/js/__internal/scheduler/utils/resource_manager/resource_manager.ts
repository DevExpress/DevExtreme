import type { SafeAppointment } from '@ts/scheduler/types';

import type { ListEntity } from '../../view_model/types';
import { getResourceIndex } from '../data_accessor/appointment_resource_data_accessor';
import { ResourceLoader } from '../loader/resource_loader';
import type {
  ResourceConfig,
  ResourceId,
} from '../loader/types';
import { getAppointmentColor } from './appointment_color_utils';
import type { AppointmentResource } from './appointment_groups_utils';
import {
  getAppointmentGroupValues,
  getAppointmentResources,
} from './appointment_groups_utils';
import { groupResources } from './group_utils';
import type { GroupLeaf, GroupNode } from './types';

export class ResourceManager {
  public resources: ResourceLoader[] = [];

  public resourceById: Record<string, ResourceLoader> = {};

  public groups: string[] = [];

  public groupsLeafs: GroupLeaf[] = [];

  public groupsTree: GroupNode[] = [];

  constructor(config: ResourceConfig[]) {
    config?.filter(getResourceIndex)
      .forEach((item) => {
        const loader = new ResourceLoader(item);
        this.resourceById[loader.resourceIndex] = loader;
        this.resources.push(loader);
      });
  }

  private async load(groupsToLoad: string[], forceReload = false): Promise<void> {
    await Promise.all(groupsToLoad.map(
      (group) => this.resourceById[group]?.load(forceReload),
    ));
  }

  async loadGroupResources(groups: string[] = [], forceReload = false): Promise<void> {
    await this.load(groups, forceReload);

    const { groupTree, groupLeafs } = groupResources(this.resourceById, groups);

    this.groups = groups;
    this.groupsLeafs = groupLeafs;
    this.groupsTree = groupTree;
  }

  public groupCount(): number {
    return this.groupsLeafs.length;
  }

  public filterGroupsByAppointments(appointments: ListEntity[]): void {
    if (!this.groups.length) {
      return;
    }

    // Find all resource values used in appointments
    const usedResourceValues = new Map<string, Set<ResourceId>>();

    appointments.forEach((appointment) => {
      this.groups.forEach((resourceIndex) => {
        const resource = this.resourceById[resourceIndex];
        if (resource) {
          const values = resource.idsGetter(appointment.itemData);
          if (!usedResourceValues.has(resourceIndex)) {
            usedResourceValues.set(resourceIndex, new Set<ResourceId>());
          }
          const resourceValues = usedResourceValues.get(resourceIndex);
          if (resourceValues) {
            values.forEach((value: ResourceId) => {
              resourceValues.add(value);
            });
          }
        }
      });
    });

    // Filter resource dataSources to include only used values
    this.groups.forEach((resourceIndex) => {
      const resource = this.resourceById[resourceIndex];
      if (resource?.items) {
        const usedValues = usedResourceValues.get(resourceIndex);
        if (usedValues && usedValues.size > 0) {
          const filteredItems = resource.items.filter((item) => usedValues.has(item.id));
          resource.items = filteredItems;
        }
      }
    });

    // Rebuild groupsTree and groupsLeafs after filtering resources
    const { groupTree, groupLeafs } = groupResources(this.resourceById, this.groups);
    this.groupsTree = groupTree;
    this.groupsLeafs = groupLeafs;
  }

  public groupResources(): ResourceLoader[] {
    return this.groups
      .map((group) => this.resourceById[group])
      .filter(Boolean);
  }

  public async loadAppointmentsResources(
    items: SafeAppointment[],
    forceReload = false,
  ): Promise<void> {
    const groupsToLoad = Object
      .keys(this.resourceById)
      .filter((resourceIndex) => !this.resourceById[resourceIndex].isLoaded()
        && items.some((item) => this.resourceById[resourceIndex].idsGetter(item).length > 0));

    await this.load(groupsToLoad, forceReload);
  }

  public async getAppointmentColor(
    appointmentConfig: {
      itemData: SafeAppointment;
      groupIndex: number;
    },
  ): Promise<string | undefined> {
    return getAppointmentColor(this.resources, this.groupsLeafs, this.groups, appointmentConfig);
  }

  public async getAppointmentResourcesValues(
    appointment: SafeAppointment,
  ): Promise<AppointmentResource[]> {
    const appointmentGroups = getAppointmentGroupValues(appointment, this.resources);
    const groups = Object.keys(appointmentGroups);

    await this.load(groups);

    return getAppointmentResources(appointmentGroups, this.resourceById);
  }

  public dispose(): void {
    Object.values(this.resourceById).forEach((item) => item.dispose());
  }
}
