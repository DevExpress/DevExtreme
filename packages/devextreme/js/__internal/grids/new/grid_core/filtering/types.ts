export interface AppliedFilters {
  filterPanel?: unknown;
  headerFilter?: unknown;
  search?: unknown;
}

export type FilterValue = unknown[];

export interface FilterPublicMethods {
  clearFilter: () => void;
}
