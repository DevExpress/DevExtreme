import './ui.data_grid.editor_factory';

import gridCore from './ui.data_grid.core';
import editingModule from '../grid_core/ui.grid_core.editing';
import { extend } from '../../core/utils/extend';

gridCore.registerModule('editing', extend(true, {}, editingModule, {
    extenders: {
        controllers: {
            data: {
                _changeRowExpandCore: function(key) {
                    var editingController = this._editingController;

                    if(Array.isArray(key)) {
                        editingController && editingController.refresh();
                    }

                    this.callBase.apply(this, arguments);
                }
            }
        }
    }
}));
