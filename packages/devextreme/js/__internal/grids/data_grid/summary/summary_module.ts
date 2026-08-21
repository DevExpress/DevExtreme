import messageLocalization from '@js/common/core/localization/message';
import type { SortByGroupSummaryInfoItem, Summary } from '@js/ui/data_grid';

import gridCore from '../m_core';
import dataSourceAdapterProvider from '../m_data_source_adapter';
import { summaryDataControllerExtender } from './extenders/summary_data_controller';
import {
  dataSourceAdapterExtender, FooterView, summaryEditingControllerExtender,
  summaryRowsViewExtender,
} from './m_summary';

dataSourceAdapterProvider.extend(dataSourceAdapterExtender);

gridCore.registerModule('summary', {
  defaultOptions(): {
    summary: Summary,
    sortByGroupSummaryInfo: SortByGroupSummaryInfoItem[] | undefined
  } {
    return {
      summary: {
        groupItems: undefined,
        totalItems: undefined,
        calculateCustomSummary: undefined,
        skipEmptyValues: true,
        recalculateWhileEditing: false,
        texts: {
          sum: messageLocalization.format('dxDataGrid-summarySum'),
          sumOtherColumn: messageLocalization.format('dxDataGrid-summarySumOtherColumn'),
          min: messageLocalization.format('dxDataGrid-summaryMin'),
          minOtherColumn: messageLocalization.format('dxDataGrid-summaryMinOtherColumn'),
          max: messageLocalization.format('dxDataGrid-summaryMax'),
          maxOtherColumn: messageLocalization.format('dxDataGrid-summaryMaxOtherColumn'),
          avg: messageLocalization.format('dxDataGrid-summaryAvg'),
          avgOtherColumn: messageLocalization.format('dxDataGrid-summaryAvgOtherColumn'),
          count: messageLocalization.format('dxDataGrid-summaryCount'),
        },
      },
      sortByGroupSummaryInfo: undefined,
    };
  },
  views: {
    footerView: FooterView,
  },
  extenders: {
    controllers: {
      data: summaryDataControllerExtender,
      editing: summaryEditingControllerExtender,
    },
    views: {
      rowsView: summaryRowsViewExtender,
    },
  },
});
