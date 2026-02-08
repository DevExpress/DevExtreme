import type { FilterValue } from './types';

export interface Options {
  filterValue?: FilterValue | null;
}

export const defaultOptions = {
  filterValue: null,
} as Options;
