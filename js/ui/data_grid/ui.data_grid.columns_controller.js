import gridCore from './ui.data_grid.core';
import columnsControllerModule from '../grid_core/ui.grid_core.columns_controller';
import { extend } from '../../core/utils/extend';

gridCore.registerModule('columns', {
    defaultOptions: function() {
        return extend(true, {}, columnsControllerModule.defaultOptions(), {
            /**
            * @name dxDataGridColumn.allowExporting
            * @type boolean
            * @default true
            */
            commonColumnSettings: {
                allowExporting: true
            }
        });
    },
    controllers: columnsControllerModule.controllers
});
