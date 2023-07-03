define(function(require) {
    window.DevExpress_ui_widget_errors = require('ui/widget/ui.errors');
    window.ajaxMock = require('../../helpers/ajaxMock.js');
    require('bundles/dx.web.js');
    require('aspnet.js');
    require('./aspnet.tests.js');
});
