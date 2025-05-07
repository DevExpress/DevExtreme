let gridBaseMock;

/* global jQuery */
if(typeof define === 'function' && define.amd) {
    define(function(require, exports, module) {
        gridBaseMock = require('./gridBaseMocks.js');

        window.dataGridMocks = module.exports = gridBaseMock(
            require('jquery'),
            require('__internal/grids/data_grid/m_core').default,
            require('__internal/grids/data_grid/module_not_extended/columns_resizing_reordering').default,
            require('__internal/core/utils/m_dom'),
            require('__internal/core/utils/m_common'),
            require('__internal/core/utils/m_type'),
            require('common/data/array_store'),
            'DataGrid'
        );
    });
} else {
    gridBaseMock = DevExpress.require('./gridBaseMocks.js');

    jQuery.extend(window, gridBaseMock(
        jQuery,
        DevExpress.require('__internal/grids/data_grid/m_core'),
        DevExpress.require('__internal/grids/data_grid/module_not_extended/columns_resizing_reordering'),
        DevExpress.require('__internal/core/utils/m_dom'),
        DevExpress.require('__internal/core/utils/m_common'),
        DevExpress.require('__internal/core/utils/m_type'),
        DevExpress.require('common/data/array_store'),
        'DataGrid'
    ));
}
