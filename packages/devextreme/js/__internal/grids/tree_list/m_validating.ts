/* eslint-disable @typescript-eslint/no-unused-vars */
import { validatingModule } from '@ts/grids/grid_core/validating/m_validating';

import type { EditingController } from '../grid_core/editing/m_editing';
import type { ModuleType } from '../grid_core/m_types';
import treeListCore from './m_core';

const editingControllerExtender = (Base: ModuleType<EditingController>) => class TreeListEditingControllerExtender extends validatingModule.extenders.controllers.editing(Base) {
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
