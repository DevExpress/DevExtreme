import type { ColumnChooser } from '@js/common/grids';
import messageLocalization from '@js/localization/message';

export const CLASSES = {
  columnChooser: 'column-chooser',
  columnChooserButton: 'column-chooser-button',
  columnChooserList: 'column-chooser-list',
  columnChooserPlain: 'column-chooser-plain',
  columnChooserModeDrag: 'column-chooser-mode-drag',
  columnChooserModeSelect: 'column-chooser-mode-select',
  columnChooserItem: 'dx-column-chooser-item',
};

export const ICONS = {
  columnChooser: 'column-chooser',
};

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
