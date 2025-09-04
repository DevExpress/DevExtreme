import messageLocalization from '@js/common/core/localization/message';
import type { ColumnChooser } from '@js/common/grids';

export const defaultOptions = {
  columnChooser: {
    enabled: false,
    search: {
      enabled: false,
      timeout: 500,
      editorOptions: {},
    },
    selection: {
      allowSelectAll: false,
      selectByClick: false,
      recursive: false,
    },
    position: undefined,
    sortOrder: undefined,
    mode: 'dragAndDrop',
    width: 250,
    height: 260,
    get title() {
      return messageLocalization.format('dxDataGrid-columnChooserTitle');
    },
    get emptyPanelText() {
      return messageLocalization.format('dxDataGrid-columnChooserEmptyText');
    },
    container: undefined,
  } as ColumnChooser,
};
