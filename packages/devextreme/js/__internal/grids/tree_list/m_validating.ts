/* eslint-disable @typescript-eslint/no-unused-vars */
import { validatingModule } from '@ts/grids/grid_core/validating/validating_module';

import type { CellBasedEditingController } from '../grid_core/editing/m_editing_cell_based';
import type { FormBasedEditingControllerExtension } from '../grid_core/editing/m_editing_form_based';
import type { ModuleType } from '../grid_core/types';
import treeListCore from './core';

const editingControllerExtender = (
  Base: ModuleType<CellBasedEditingController & FormBasedEditingControllerExtension>,
) => class TreeListEditingControllerExtender extends validatingModule.extenders.controllers.editing(Base) {
  public processDataItem(item) {
    super.processDataItemTreeListHack.apply(this, arguments as any);
  }

  public processItems(items, e) {
    return super.processItemsTreeListHack.apply(this, arguments as any);
  }
};

treeListCore.registerModule('validating', {
  defaultOptions: validatingModule.defaultOptions,
  controllers: validatingModule.controllers,
  extenders: {
    controllers: {
      editing: editingControllerExtender,
      editorFactory: validatingModule.extenders.controllers.editorFactory,
    },
    views: validatingModule.extenders.views,
  },
});
