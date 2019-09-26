SystemJS.config({
    meta: {
        "/testing/*": { format: "global" },
        "/testing/helpers/jQueryEventsPatch.js": { format: "system" },
        "/testing/helpers/ajaxMock.js": { format: "cjs" },
        "/testing/helpers/dataPatch.js": { format: "system" },
        "/artifacts/transpiled/aspnet.js": { format: "global" }
    }
});

define(function(require) {
    window.DevExpress_ui_widget_errors = require("/artifacts/transpiled/ui/widget/ui.errors");
    window.ajaxMock = require("/testing/helpers/ajaxMock.js");
    require("/artifacts/transpiled/bundles/dx.web.js");
    require("/artifacts/transpiled/aspnet.js");
    require("/testing/tests/DevExpress.aspnet/aspnet.tests.js");
});
