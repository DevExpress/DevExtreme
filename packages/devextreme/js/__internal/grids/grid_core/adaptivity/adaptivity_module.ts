import type { Module } from '../m_types';
import { adaptivityColumnsExtender } from './extenders/adaptivity_columns';
import { adaptivityColumnsResizerExtender } from './extenders/adaptivity_columns_resizer';
import { adaptivityDataControllerExtender } from './extenders/adaptivity_data_controller';
import { adaptivityDraggingHeaderExtender } from './extenders/adaptivity_dragging_header';
import { adaptivityEditingExtender } from './extenders/adaptivity_editing';
import { adaptivityEditorFactoryExtender } from './extenders/adaptivity_editor_factory';
import { adaptivityHeadersKeyboardNavigationExtender } from './extenders/adaptivity_headers_keyboard_navigation';
import { adaptivityKeyboardNavigationExtender } from './extenders/adaptivity_keyboard_navigation';
import { adaptivityResizingControllerExtender } from './extenders/adaptivity_resizing_controller';
import { adaptivityRowsViewExtender } from './extenders/adaptivity_rows_view';
import { AdaptiveColumnsController } from './m_adaptivity';

export const adaptivityModule: Module = {
  defaultOptions() {
    return {
      columnHidingEnabled: false,
    };
  },
  controllers: {
    adaptiveColumns: AdaptiveColumnsController,
  },
  extenders: {
    views: {
      rowsView: adaptivityRowsViewExtender,
    },
    controllers: {
      columnsResizer: adaptivityColumnsResizerExtender,
      draggingHeader: adaptivityDraggingHeaderExtender,
      editing: adaptivityEditingExtender,
      resizing: adaptivityResizingControllerExtender,
      data: adaptivityDataControllerExtender,
      editorFactory: adaptivityEditorFactoryExtender,
      columns: adaptivityColumnsExtender,
      keyboardNavigation: adaptivityKeyboardNavigationExtender,
      headersKeyboardNavigation: adaptivityHeadersKeyboardNavigationExtender,
    },
  },
};
