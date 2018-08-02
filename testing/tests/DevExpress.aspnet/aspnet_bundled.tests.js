SystemJS.config({
    meta: {
        "/testing/*": { format: "global" },
        "/testing/helpers/jQueryEventsPatch.js": { format: "system" },
        "/testing/helpers/dataPatch.js": { format: "system" },
        "/artifacts/transpiled/aspnet.js": { format: "global" }
    }
});

define(function(require) {
    require("/artifacts/transpiled/bundles/dx.web.js");
    require("/artifacts/transpiled/aspnet.js");
    require("/testing/tests/DevExpress.aspnet/aspnet.tests.js");
});
