import type {
  ListEntity,
  SortedIndex,
} from '../types';

export interface LastInGroup {
  isLastInGroup: boolean;
}

export interface AgendaGeometry {
  width: string;
  height: number;
}

export type AgendaEntity = ListEntity
  & AgendaGeometry
  & LastInGroup
  & SortedIndex;
