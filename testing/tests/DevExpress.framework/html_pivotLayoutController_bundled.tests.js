SystemJS.config({
    meta: {
        "/testing/*": { format: "global" },
        "/testing/helpers/jQueryEventsPatch.js": { format: "system" },
        "/testing/helpers/dataPatch.js": { format: "system" },
        "/layouts/*": { format: "global" }
    }
});

define(function(require) {
    require("/artifacts/transpiled/bundles/dx.mobile.js");

    require("/testing/helpers/pointerMock.js");
    require("/testing/helpers/frameworkMocks.js");
    require("/testing/helpers/htmlFrameworkMocks.js");
    require("/testing/helpers/layoutHelper.js");

    require("/layouts/Pivot/PivotLayout.js");

    require("/testing/tests/DevExpress.framework/layoutParts/html_pivotLayoutController.tests.js");
});
