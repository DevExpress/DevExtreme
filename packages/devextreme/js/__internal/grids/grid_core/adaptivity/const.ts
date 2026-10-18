export const COLUMN_HEADERS_VIEW = 'columnHeadersView' as const;
export const ROWS_VIEW = 'rowsView' as const;
export const FOOTER_VIEW = 'footerView' as const;
export const COLUMN_VIEWS = [COLUMN_HEADERS_VIEW, ROWS_VIEW, FOOTER_VIEW] as const;

export const ADAPTIVE_NAMESPACE = 'dxDataGridAdaptivity';
export const HIDDEN_COLUMNS_WIDTH = 'adaptiveHidden';
export const ADAPTIVE_ROW_TYPE = 'detailAdaptive';

export const CLASSES = {
  itemModified: 'dx-item-modified',
  hiddenColumn: 'hidden-column',
  adaptiveColumnButton: 'adaptive-more',
  commandAdaptive: 'dx-command-adaptive',
  commandAdaptiveHidden: 'dx-command-adaptive-hidden',
  adaptiveDetailRow: 'dx-adaptive-detail-row',
  adaptiveItemText: 'dx-adaptive-item-text',
  lastDataCell: 'dx-last-data-cell',
  revertTooltip: 'revert-tooltip',
};

export const ADAPTIVE_COLUMN_NAME = 'adaptive';

export const EXPAND_ARIA_NAME = 'dxDataGrid-ariaAdaptiveExpand';
export const COLLAPSE_ARIA_NAME = 'dxDataGrid-ariaAdaptiveCollapse';
