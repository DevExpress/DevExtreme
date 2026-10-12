import type { CustomOperation, Properties as FilterBuilderProperties } from '@js/ui/filter_builder';
import type { FilterCustomOperation } from '@ts/filter_builder/types';
import type { FilterField } from '@ts/grids/grid_core/columns_controller/types';

export type FilterOperationDescriptions = Required<
  NonNullable<FilterBuilderProperties['filterOperationDescriptions']>
>;

export interface FilterTextOptions {
  customOperations: (CustomOperation | FilterCustomOperation)[];
  columns: FilterField[];
  filterOperationDescriptions: FilterOperationDescriptions;
  groupOperationDescriptions: Record<string, string>;
}
