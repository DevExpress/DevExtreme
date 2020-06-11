SystemJS.config({
    meta: {
        '/testing/qunit/*': { format: 'global' },
        '/testing/qunit/helpers/jQueryEventsPatch.js': { format: 'system' },
        '/testing/qunit/helpers/ajaxMock.js': { format: 'cjs' },
        '/testing/qunit/helpers/dataPatch.js': { format: 'system' },
        '/artifacts/transpiled/aspnet.js': { format: 'global' }
    }
});

define(function(require) {
    window.DevExpress_ui_widget_errors = require('/artifacts/transpiled/ui/widget/ui.errors');
    window.ajaxMock = require('/testing/qunit/helpers/ajaxMock.js');
    require('/artifacts/transpiled/bundles/dx.web.js');
    require('/artifacts/transpiled/aspnet.js');
    require('/testing/qunit/tests/DevExpress.aspnet/aspnet.tests.js');
});
