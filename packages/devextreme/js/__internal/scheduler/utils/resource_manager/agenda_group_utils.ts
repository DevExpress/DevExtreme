import type { ListEntity } from '../../view_model/types';
import type { ResourceLoader } from '../loader/resource_loader';
import type { GroupNode } from './types';

const hasGroupAppointments = (
  resourceById: Record<string, ResourceLoader>,
  appointments: ListEntity[],
  node: GroupNode,
): boolean => {
  const resource = resourceById[node.resourceIndex];
  const value = node.grouped[node.resourceIndex];

  return appointments.some(
    (appointment) => resource.idsGetter(appointment.itemData).includes(value),
  );
};

const filterGroupTree = (
  resourceById: Record<string, ResourceLoader>,
  appointments: ListEntity[],
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
  appointments: ListEntity[],
): GroupNode[] => groupsTree
  .map((node) => filterGroupTree(resourceById, appointments, node))
  .filter(Boolean) as GroupNode[];
