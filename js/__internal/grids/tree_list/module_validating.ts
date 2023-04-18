import { extend } from '@js/core/utils/extend';
import { validatingModule } from '@js/ui/grid_core/ui.grid_core.validating';
import treeListCore from './module_core';

const EditingControllerExtender = extend({}, validatingModule.extenders.controllers.editing);
delete EditingControllerExtender.processItems;
delete EditingControllerExtender.processDataItem;

treeListCore.registerModule('validating', {
  defaultOptions: validatingModule.defaultOptions,
  controllers: validatingModule.controllers,
  extenders: {
    controllers: {
      editing: EditingControllerExtender,
      editorFactory: validatingModule.extenders.controllers.editorFactory,
    },
    views: validatingModule.extenders.views,
  },
});
