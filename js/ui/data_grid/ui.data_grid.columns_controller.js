import gridCore from './ui.data_grid.core';
import columnsControllerModule from '../grid_core/ui.grid_core.columns_controller';
import { extend } from '../../core/utils/extend';

gridCore.registerModule('columns', {
    defaultOptions: function() {
        return extend(true, {}, columnsControllerModule.defaultOptions(), {
            commonColumnSettings: {
                allowExporting: true
            }
        });
    },
    controllers: columnsControllerModule.controllers
});
