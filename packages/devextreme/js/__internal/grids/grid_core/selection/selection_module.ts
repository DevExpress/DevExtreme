import type { Properties as DataGridProperties, Selection } from '@js/ui/data_grid';

import { selectionDataControllerExtender } from './extenders/selection_data_controller';
import {
  selectionColumnHeadersViewExtender,
  selectionContextMenuControllerExtender,
  SelectionController,
  selectionRowsViewExtender,
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
        mode: 'none',
        showCheckBoxesMode: 'onClick',
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
      data: selectionDataControllerExtender,
      contextMenu: selectionContextMenuControllerExtender,
    },

    views: {
      columnHeadersView: selectionColumnHeadersViewExtender,
      rowsView: selectionRowsViewExtender,
    },
  },
};
