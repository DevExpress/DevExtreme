import { EditingController } from '@ts/grids/grid_core/editing/m_editing';
import { ModuleType } from '@ts/grids/grid_core/m_types';
import { editingControllerValidationExtenderMixin, validatingModule } from '@ts/grids/grid_core/validating/m_validating';

import treeListCore from './m_core';

const editing = (Base: ModuleType<EditingController>) => class EditingTreeListController extends editingControllerValidationExtenderMixin(Base) {
  processItems() {
    // @ts-expect-error
    super.processItems(arguments as any);
  }

  processDataItem() {
    super.processDataItem(arguments);
  }
};

treeListCore.registerModule('validating', {
  defaultOptions: validatingModule.defaultOptions,
  controllers: validatingModule.controllers,
  extenders: {
    controllers: {
      editing,
      editorFactory: validatingModule.extenders.controllers.editorFactory,
    },
    views: validatingModule.extenders.views,
  },
});
