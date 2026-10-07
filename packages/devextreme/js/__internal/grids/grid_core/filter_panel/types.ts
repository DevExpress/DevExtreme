import type { CustomOperation, Properties as FilterBuilderProperties } from '@js/ui/filter_builder';
import type { FilterField } from '@ts/grids/grid_core/columns_controller/types';

export type FilterOperationDescriptions = Required<
  NonNullable<FilterBuilderProperties['filterOperationDescriptions']>
>;

export interface FilterTextOptions {
  customOperations: CustomOperation[] | undefined;
  columns: FilterField[];
  filterOperationDescriptions: FilterOperationDescriptions;
  groupOperationDescriptions: Record<string, string>;
}
