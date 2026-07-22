import type { ResourceId } from '../loader/types';

export type GroupValues = Record<string, ResourceId[]>;
export type RawGroupValues = Record<string, ResourceId | ResourceId[]>;

export interface GroupNode {
  id: ResourceId;
  resourceText: string;
  color?: string;
  resourceIndex: string;
  grouped: Record<string, ResourceId>;
  children: GroupNode[];
}

export interface GroupLeaf extends GroupNode {
  groupIndex: number;
}
