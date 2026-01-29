import type { ResourceId, ResourceData } from '../../utils/loader/types';

export type { ResourceId, ResourceData };
export type GroupValues = Record<string, ResourceId[]>;
export type RawGroupValues = Record<string, ResourceId | ResourceId[]>;

export interface GroupNode {
  resourceText: string;
  resourceIndex: string;
  grouped: Record<string, ResourceId>;
  children: GroupNode[];
}

export interface GroupLeaf extends GroupNode {
  groupIndex: number;
}
