import type { SafeAppointment } from '@ts/scheduler/types';

import type { ResourceLoader } from '../loader/resource_loader';
import type { ResourceId } from '../loader/types';
import type { GroupNode } from './types';

export const reduceResourcesTree = (
  resourceById: Record<string, ResourceLoader>,
  groupsTree: GroupNode[],
  appointments: SafeAppointment[],
): GroupNode[] => {
  const hasGroupAppointments = (node: GroupNode): boolean => {
    const resource = resourceById[node.resourceIndex];
    const value = node.grouped[node.resourceIndex];

    return appointments.some(
      (appointment) => resource.idsGetter(appointment).includes(value),
    );
  };
  const filterGroupTree = (node: GroupNode): GroupNode | undefined => {
    if (!hasGroupAppointments(node)) return undefined;

    return {
      ...node,
      children: node.children.length
        ? node.children
          .map(filterGroupTree)
          .filter(Boolean) as GroupNode[]
        : [],
    };
  };

  return groupsTree
    .map(filterGroupTree)
    .filter(Boolean) as GroupNode[];
};

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
