var gridBaseMock;

/* global jQuery */
if(typeof define === 'function' && define.amd) {
    define(function(require, exports, module) {
        gridBaseMock = require('./gridBaseMocks.js');

        window.dataGridMocks = module.exports = gridBaseMock(
            require('jquery'),
            require('ui/data_grid/ui.data_grid.core'),
            require('ui/data_grid/ui.data_grid.columns_resizing_reordering'),
            require('core/utils/dom'),
            require('core/utils/common'),
            require('core/utils/type'),
            require('data/array_store'),
            'DataGrid'
        );
    });
} else {
    gridBaseMock = DevExpress.require('./gridBaseMocks.js');

    jQuery.extend(window, gridBaseMock(
        jQuery,
        DevExpress.require('ui/data_grid/ui.data_grid.core'),
        DevExpress.require('ui/data_grid/ui.data_grid.columns_resizing_reordering'),
        DevExpress.require('core/utils/dom'),
        DevExpress.require('core/utils/common'),
        DevExpress.require('core/utils/type'),
        DevExpress.require('data/array_store'),
        'DataGrid'
    ));
}
