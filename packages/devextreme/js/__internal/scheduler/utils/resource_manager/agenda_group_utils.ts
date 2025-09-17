import type { SafeAppointment } from '@ts/scheduler/types';

import type { ResourceLoader } from '../loader/resource_loader';
import type { ResourceId } from '../loader/types';
import type { GroupNode } from './types';

const hasGroupAppointments = (
  resourceById: Record<string, ResourceLoader>,
  appointments: SafeAppointment[],
  node: GroupNode,
): boolean => {
  const resource = resourceById[node.resourceIndex];
  const value = node.grouped[node.resourceIndex];

  return appointments.some(
    (appointment) => resource.idsGetter(appointment).includes(value),
  );
};

const filterGroupTree = (
  resourceById: Record<string, ResourceLoader>,
  appointments: SafeAppointment[],
  node: GroupNode,
): GroupNode | undefined => {
  if (!hasGroupAppointments(resourceById, appointments, node)) return undefined;

  return {
    ...node,
    children: node.children.length
      ? node.children
        .map((childrenNode) => filterGroupTree(resourceById, appointments, childrenNode))
        .filter(Boolean) as GroupNode[]
      : [],
  };
};

export const reduceResourcesTree = (
  resourceById: Record<string, ResourceLoader>,
  groupsTree: GroupNode[],
  appointments: SafeAppointment[],
): GroupNode[] => groupsTree
  .map((node) => filterGroupTree(resourceById, appointments, node))
  .filter(Boolean) as GroupNode[];

interface DeprecatedGroupNode {
  name: string;
  title: string;
  value: ResourceId;
  color?: string;
  data: unknown;
  children: DeprecatedGroupNode[];
}

// TODO(9): Get rid of it as soon as you can
export const convertToOldTree = (
  resourceById: Record<string, ResourceLoader>,
  tree: GroupNode[],
): DeprecatedGroupNode[] => {
  const convert = (item: GroupNode): DeprecatedGroupNode => {
    const value = item.grouped[item.resourceIndex];
    const resource = resourceById[item.resourceIndex];
    const resourceItem = resource?.items
      .find((rItem) => rItem.id === value);

    return {
      data: resourceItem,
      name: item.resourceIndex,
      title: item.resourceText,
      value,
      color: resourceItem?.color,
      children: item.children.length ? item.children.map(convert) : [],
    };
  };

  return tree.map(convert);
};
