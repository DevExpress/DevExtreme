import type { InternalGridOptions, Module } from '../m_types';
import { adaptivityColumnsControllerExtender } from './extenders/adaptivity_columns_controller';
import { adaptivityColumnsResizerViewControllerExtender } from './extenders/adaptivity_columns_resizer_view_controller';
import { adaptivityDataControllerExtender } from './extenders/adaptivity_data_controller';
import { adaptivityDraggingHeaderViewControllerExtender } from './extenders/adaptivity_dragging_header_view_controller';
import { adaptivityEditingViewControllerExtender } from './extenders/adaptivity_editing_view_controller';
import { adaptivityEditorFactoryViewControllerExtender } from './extenders/adaptivity_editor_factory_view_controller';
import { adaptivityHeadersKeyboardNavigationViewControllerExtender } from './extenders/adaptivity_headers_keyboard_navigation_view_controller';
import { adaptivityKeyboardNavigationViewControllerExtender } from './extenders/adaptivity_keyboard_navigation_view_controller';
import { adaptivityResizingViewControllerExtender } from './extenders/adaptivity_resizing_view_controller';
import { adaptivityRowsViewExtender } from './extenders/adaptivity_rows_view';
import { AdaptiveColumnsController } from './m_adaptivity';

export const adaptivityModule: Module = {
  defaultOptions(): Pick<InternalGridOptions, 'columnHidingEnabled'> {
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
      columnsResizer: adaptivityColumnsResizerViewControllerExtender,
      draggingHeader: adaptivityDraggingHeaderViewControllerExtender,
      editing: adaptivityEditingViewControllerExtender,
      resizing: adaptivityResizingViewControllerExtender,
      data: adaptivityDataControllerExtender,
      editorFactory: adaptivityEditorFactoryViewControllerExtender,
      columns: adaptivityColumnsControllerExtender,
      keyboardNavigation: adaptivityKeyboardNavigationViewControllerExtender,
      headersKeyboardNavigation: adaptivityHeadersKeyboardNavigationViewControllerExtender,
    },
  },
};
