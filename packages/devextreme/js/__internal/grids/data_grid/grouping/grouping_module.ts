import messageLocalization from '@js/common/core/localization/message';
import type { Properties } from '@js/ui/data_grid';
import gridCore from '@ts/grids/data_grid/m_core';

import { groupingColumnsControllerExtender } from './extenders/grouping_columns_controller';
import { groupingDataControllerExtender } from './extenders/grouping_data_controller';
import { groupingEditingControllerExtender } from './extenders/grouping_editing_controller';
import {
  columnHeadersViewExtender,
  GroupingHeaderPanelExtender,
  GroupingRowsViewExtender,
} from './m_grouping';

gridCore.registerModule('grouping', {
  defaultOptions(): Pick<Properties, 'grouping' | 'groupPanel'> {
    return {
      grouping: {
        autoExpandAll: true,
        allowCollapsing: true,
        contextMenuEnabled: true,
        expandMode: 'buttonClick',
        texts: {
          groupContinuesMessage: messageLocalization.format('dxDataGrid-groupContinuesMessage'),
          groupContinuedMessage: messageLocalization.format('dxDataGrid-groupContinuedMessage'),
          groupByThisColumn: messageLocalization.format('dxDataGrid-groupHeaderText'),
          ungroup: messageLocalization.format('dxDataGrid-ungroupHeaderText'),
          ungroupAll: messageLocalization.format('dxDataGrid-ungroupAllText'),
        },
      },
      groupPanel: {
        visible: false,
        emptyPanelText: messageLocalization.format('dxDataGrid-groupPanelEmptyText'),
        allowColumnDragging: true,
      },
    };
  },
  extenders: {
    controllers: {
      data: groupingDataControllerExtender,
      columns: groupingColumnsControllerExtender,
      editing: groupingEditingControllerExtender,
    },
    views: {
      headerPanel: GroupingHeaderPanelExtender,
      rowsView: GroupingRowsViewExtender,
      columnHeadersView: columnHeadersViewExtender,
    },
  },
});
