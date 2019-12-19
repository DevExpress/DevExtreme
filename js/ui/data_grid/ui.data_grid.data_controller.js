import gridCore from './ui.data_grid.core';
import errors from '../widget/ui.errors';
import dataSourceAdapterProvider from './ui.data_grid.data_source_adapter';
import dataControllerModule from '../grid_core/ui.grid_core.data_controller';

exports.DataController = dataControllerModule.controllers.data.inherit((function() {
    return {
        _getDataSourceAdapter: function() {
            return dataSourceAdapterProvider;
        },

        _getSpecificDataSourceOption: function() {
            var dataSource = this.option('dataSource');

            if(dataSource && !Array.isArray(dataSource) && this.option('keyExpr')) {
                errors.log('W1011');
            }

            return this.callBase();
        }
    };
})());

gridCore.registerModule('data', {
    /**
    * @name dxDataGridOptions.keyExpr
    * @type string|Array<string>
    * @default undefined
    */
    defaultOptions: dataControllerModule.defaultOptions,
    controllers: {
        data: exports.DataController
    }
});
