import type { SafeAppointment } from '@ts/scheduler/types';

import { getResourceIndex } from '../data_accessor/appointment_resource_data_accessor';
import { ResourceLoader } from '../loader/resource_loader';
import type {
  ResourceConfig,
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
  public resources: ResourceLoader[];

  public resourceById: Record<string, ResourceLoader>;

  public groups: string[];

  public groupsLeafs: GroupLeaf[];

  public groupsTree: GroupNode[];

  constructor(config: ResourceConfig[]) {
    this.resources = [];
    this.resourceById = {};
    this.groups = [];
    this.groupsLeafs = [];
    this.groupsTree = [];

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
