import type { FilterPanel } from '@js/common/grids';
import type { Properties as FilterBuilderProperties } from '@js/ui/filter_builder';
import type { Properties as PopupProperties } from '@js/ui/popup';

export interface Options {

  filterPanel?: FilterPanel;
  filterBuilder?: FilterBuilderProperties;
  filterBuilderPopup?: PopupProperties;
}

export const defaultOptions = {
  filterBuilder: {
    groupOperationDescriptions: {
      and: undefined,
      or: undefined,
      notAnd: undefined,
      notOr: undefined,
    },
    filterOperationDescriptions: {
      between: undefined,
      equal: undefined,
      notEqual: undefined,
      lessThan: undefined,
      lessThanOrEqual: undefined,
      greaterThan: undefined,
      greaterThanOrEqual: undefined,
      startsWith: undefined,
      contains: undefined,
      notContains: undefined,
      endsWith: undefined,
      isBlank: undefined,
      isNotBlank: undefined,
    },
  },

  filterPanel: {
    visible: false,
    filterEnabled: true,
    texts: {
      createFilter: undefined,
      clearFilter: undefined,
      filterEnabledHint: undefined,
    },
  },

  filterBuilderPopup: {},
} satisfies Options;
