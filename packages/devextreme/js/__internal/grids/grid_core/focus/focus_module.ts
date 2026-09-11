import type { InternalGridOptions } from '@ts/grids/grid_core/m_types';

import {
  focusDataSourceControllerExtender,
} from './extenders/focus_data_source_controller';
import {
  columns,
  editing,
  FocusController,
  focusDataControllerExtender,
  focusEditorFactoryViewControllerExtender,
  keyboardNavigation,
  rowsView,
} from './m_focus';

type FocusDefaultProperties = 'focusedRowEnabled' | 'autoNavigateToFocusedRow' | 'focusedRowKey' | 'focusedRowIndex' | 'focusedColumnIndex';

export const focusModule = {
  defaultOptions(): Pick<InternalGridOptions, FocusDefaultProperties> {
    return {
      focusedRowEnabled: false,
      autoNavigateToFocusedRow: true,
      focusedRowKey: null,
      focusedRowIndex: -1,
      focusedColumnIndex: -1,
    };
  },
  controllers: {
    focus: FocusController,
  },
  extenders: {
    controllers: {
      keyboardNavigation,
      editorFactory: focusEditorFactoryViewControllerExtender,
      columns,
      data: focusDataControllerExtender,
      dataSource: focusDataSourceControllerExtender,
      editing,
    },
    views: {
      rowsView,
    },
  },
};
