import type { FilterPanel } from '@js/common/grids';
import messageLocalization from '@js/localization/message';
import type { Properties as FilterBuilderProperties } from '@js/ui/filter_builder';
import type { Properties as PopupProperties } from '@js/ui/popup';

export interface Options {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterPanel?: FilterPanel<any>;
  filterBuilder?: FilterBuilderProperties;
  filterBuilderPopup?: PopupProperties;
}

export const defaultOptions = {
  filterBuilder: {
    groupOperationDescriptions: {
      and: messageLocalization.format('dxFilterBuilder-and'),
      or: messageLocalization.format('dxFilterBuilder-or'),
      notAnd: messageLocalization.format('dxFilterBuilder-notAnd'),
      notOr: messageLocalization.format('dxFilterBuilder-notOr'),
    },
    filterOperationDescriptions: {
      between: messageLocalization.format('dxFilterBuilder-filterOperationBetween'),
      equal: messageLocalization.format('dxFilterBuilder-filterOperationEquals'),
      notEqual: messageLocalization.format('dxFilterBuilder-filterOperationNotEquals'),
      lessThan: messageLocalization.format('dxFilterBuilder-filterOperationLess'),
      lessThanOrEqual: messageLocalization.format('dxFilterBuilder-filterOperationLessOrEquals'),
      greaterThan: messageLocalization.format('dxFilterBuilder-filterOperationGreater'),
      greaterThanOrEqual: messageLocalization.format('dxFilterBuilder-filterOperationGreaterOrEquals'),
      startsWith: messageLocalization.format('dxFilterBuilder-filterOperationStartsWith'),
      contains: messageLocalization.format('dxFilterBuilder-filterOperationContains'),
      notContains: messageLocalization.format('dxFilterBuilder-filterOperationNotContains'),
      endsWith: messageLocalization.format('dxFilterBuilder-filterOperationEndsWith'),
      isBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsBlank'),
      isNotBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsNotBlank'),
    },
  },

  filterPanel: {
    visible: false,
    filterEnabled: true,
    texts: {
      createFilter: messageLocalization.format('dxDataGrid-filterPanelCreateFilter'),
      clearFilter: messageLocalization.format('dxDataGrid-filterPanelClearFilter'),
      filterEnabledHint: messageLocalization.format('dxDataGrid-filterPanelFilterEnabledHint'),
    },
  },

  filterBuilderPopup: {},
} satisfies Options;
