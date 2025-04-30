import { groupResources } from '@ts/scheduler/resources/group_utils';
import type { SafeAppointment } from '@ts/scheduler/types';

import { getAppointmentColor } from './appointment_color_utils';
import {
  type AppointmentResource,
  getAppointmentGroupIndex,
  getAppointmentGroups,
  getAppointmentResources,
} from './appointment_groups_utils';
import { loadResources, prepareResourcesConfig } from './load_utils';
import type {
  GroupLeaf,
  GroupNode,
  Resource,
  ResourceConfig,
} from './types';

export class ResourceManager {
  constructor(
    public options: {
      config: ResourceConfig[];
    },
    private readonly config = prepareResourcesConfig(options.config),
    private resourceById: Record<string, Resource> = {},
    private loadingPromiseMap: Record<string, Promise<Resource>> = {},
    private groupsLeafs: GroupLeaf[] = [],
    private groupsTree: GroupNode[] = [],
  ) {}

  private async load(groupsToLoad: string[], forceReload = false): Promise<void> {
    if (forceReload) {
      this.resourceById = {};
      this.loadingPromiseMap = {};
      this.groupsLeafs = [];
      this.groupsTree = [];
    }

    const newResources = await loadResources(this.config, groupsToLoad, this.loadingPromiseMap);

    newResources.forEach((resource) => {
      this.resourceById[resource.resourceIndex] = resource;
    });
  }

  public async loadGroups(groups: string[], forceReload = false): Promise<void> {
    await this.load(groups, forceReload);

    const { groupTree, groupLeafs } = groupResources(this.resourceById, groups);

    this.groupsLeafs = groupLeafs;
    this.groupsTree = groupTree;
  }

  public getAppointmentGroupIndex(item: SafeAppointment): GroupLeaf['groupIndex'] | undefined {
    const appointmentGroups = getAppointmentGroups(item, this.config);

    return getAppointmentGroupIndex(appointmentGroups, this.groupsLeafs);
  }

  public async loadAppointmentsResources(
    items: SafeAppointment[],
    forceReload = false,
  ): Promise<void> {
    const appointmentGroupsSet = new Set<string>();
    items.forEach((item) => {
      const appointmentGroups = getAppointmentGroups(item, this.config);
      Object.keys(appointmentGroups).forEach((group) => {
        appointmentGroupsSet.add(group);
      });
    });
    const groupsToLoad = Array.from(appointmentGroupsSet.keys());

    await this.load(groupsToLoad, forceReload);
  }

  private async waitForGroupsLoaded(appointmentGroups: string[]): Promise<void> {
    await Promise.all(
      appointmentGroups.map((groupIndex) => this.loadingPromiseMap[groupIndex]),
    );
  }

  public async getAppointmentResources(item: SafeAppointment): Promise<AppointmentResource[]> {
    const appointmentGroups = getAppointmentGroups(item, this.config);

    await this.waitForGroupsLoaded(Object.keys(appointmentGroups));

    return getAppointmentResources(appointmentGroups, this.resourceById);
  }

  public async getAppointmentColor(item: SafeAppointment): Promise<string> {
    const appointmentGroups = getAppointmentGroups(item, this.config);

    await this.waitForGroupsLoaded(Object.keys(appointmentGroups));

    return getAppointmentColor(appointmentGroups, this.resourceById);
  }
}
