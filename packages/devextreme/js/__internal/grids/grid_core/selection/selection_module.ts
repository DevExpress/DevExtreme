import type { Properties as DataGridProperties, Selection } from '@js/ui/data_grid';

import { dataSelectionExtenderMixin } from './extenders/selection_data_controller';
import {
  columnHeadersSelectionExtenderMixin,
  contextMenu,
  rowsViewSelectionExtenderMixin,
  SelectionController,
} from './m_selection';

interface SelectionModuleOptions {
  selection: {
    maxFilterLengthInRequest: number;
    alwaysSelectByShift: boolean;
  } & Selection;
  selectionFilter: DataGridProperties['selectionFilter'];
  selectedRowKeys: DataGridProperties['selectedRowKeys'];
}

export const selectionModule = {
  defaultOptions(): SelectionModuleOptions {
    return {
      selection: {
        mode: 'none', // "single", "multiple"
        showCheckBoxesMode: 'onClick', // "onLongTap", "always", "none"
        allowSelectAll: true,
        selectAllMode: 'allPages',
        deferred: false,
        maxFilterLengthInRequest: 1500,
        alwaysSelectByShift: false,
      },
      selectionFilter: [],
      selectedRowKeys: [],
    };
  },

  controllers: {
    selection: SelectionController,
  },

  extenders: {
    controllers: {
      data: dataSelectionExtenderMixin,
      contextMenu,
    },

    views: {
      columnHeadersView: columnHeadersSelectionExtenderMixin,
      rowsView: rowsViewSelectionExtenderMixin,
    },
  },
};
