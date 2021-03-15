SystemJS.config({
    meta: {
        '/testing/*': { format: 'global' },
        '/testing/helpers/jQueryEventsPatch.js': { format: 'system' },
        '/testing/helpers/ajaxMock.js': { format: 'cjs' },
        '/testing/helpers/dataPatch.js': { format: 'system' },
        '/testing/helpers/wrapRenovatedWidget.js': { format: 'cjs' },
        '/testing/helpers/renovationPagerHelper.js': { format: 'cjs' },
        'aspnet.js': { format: 'global' }
    }
});

define(function(require) {
    window.DevExpress_ui_widget_errors = require('ui/widget/ui.errors');
    window.ajaxMock = require('/testing/helpers/ajaxMock.js');
    require('bundles/dx.web.js');
    require('aspnet.js');
    require('/testing/tests/DevExpress.aspnet/aspnet.tests.js');
});
