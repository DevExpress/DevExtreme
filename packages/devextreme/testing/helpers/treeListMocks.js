let gridBaseMock;

/* global jQuery */
if(typeof define === 'function' && define.amd) {
    define(function(require, exports, module) {
        gridBaseMock = require('./gridBaseMocks.js');

        window.treeListMocks = module.exports = gridBaseMock(
            require('jquery'),
            require('__internal/grids/tree_list/m_core').default,
            null,
            require('__internal/core/utils/m_dom'),
            require('__internal/core/utils/m_common'),
            require('__internal/core/utils/m_type'),
            require('common/data/array_store'),
            'TreeList'
        );
    });
} else {
    gridBaseMock = require('./gridBaseMocks.js');

    jQuery.extend(window, gridBaseMock(
        jQuery,
        DevExpress.require('__internal/grids/tree_list/m_core'),
        null,
        DevExpress.require('__internal/core/utils/m_dom'),
        DevExpress.require('__internal/core/utils/m_common'),
        DevExpress.require('__internal/core/utils/m_type'),
        DevExpress.require('common/data/array_store'),
        'TreeList'
    ));
}
