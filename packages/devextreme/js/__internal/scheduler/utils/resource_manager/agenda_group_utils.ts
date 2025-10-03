import type { ListEntity } from '../../view_model/types';
import type { ResourceLoader } from '../loader/resource_loader';
import type { ResourceId } from '../loader/types';
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
    const resourceData = resource?.data
      .find((rItem) => resource.dataAccessor.get('id', rItem) === value);
    const resourceItem = resource?.items
      .find((rItem) => rItem.id === value);

    return {
      data: resourceData,
      name: item.resourceIndex,
      title: item.resourceText,
      value,
      color: resourceItem?.color,
      children: item.children.length ? item.children.map(convert) : [],
    };
  };

  return tree.map(convert);
};
