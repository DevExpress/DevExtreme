import type { ValidatingEditingControllerExtension } from '@ts/grids/grid_core/validating/types';
import { validatingModule } from '@ts/grids/grid_core/validating/validating_module';

import type { CellBasedEditingController, FormBasedEditingControllerExtension } from '../grid_core/editing/types';
import type { ModuleType } from '../grid_core/types';
import treeListCore from './core';

const editingControllerExtender = (
  Base: ModuleType<CellBasedEditingController & FormBasedEditingControllerExtension>,
): ModuleType<
  CellBasedEditingController
  & FormBasedEditingControllerExtension
  & ValidatingEditingControllerExtension
> => class TreeListEditingControllerExtender
  extends validatingModule.extenders.controllers.editing(Base) {
  public override shouldMoveInvalidRowsToPage(): boolean {
    return false;
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
