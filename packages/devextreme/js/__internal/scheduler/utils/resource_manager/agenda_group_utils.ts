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
  children: DeprecatedGroupNode[];
}

// TODO(9): Get rid of it as soon as you can
export const convertToOldTree = (tree: GroupNode[]): DeprecatedGroupNode[] => {
  const convert = (item: GroupNode): DeprecatedGroupNode => ({
    name: item.resourceIndex,
    title: item.resourceText,
    value: item.grouped[item.resourceIndex],
    children: item.children.length ? item.children.map(convert) : [],
  });

  return tree.map(convert);
};
