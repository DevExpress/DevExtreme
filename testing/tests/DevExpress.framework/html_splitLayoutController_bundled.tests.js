"use strict";

SystemJS.config({
    meta: {
        "/testing/*": { format: "global" },
        "/layouts/*": { format: "global" }
    }
});

define(function(require) {
    require("/js/bundles/dx.mobile.js");

    require("/testing/helpers/frameworkMocks.js");
    require("/testing/helpers/htmlFrameworkMocks.js");
    require("/testing/helpers/layoutHelper.js");

    require("/layouts/Empty/EmptyLayout.js");
    require("/layouts/Simple/SimpleLayout.js");
    require("/layouts/Split/SplitLayout.js");

    require("/testing/tests/DevExpress.framework/layoutParts/html_splitLayoutController.tests.js");
});
