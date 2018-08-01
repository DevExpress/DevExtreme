SystemJS.config({
    meta: {
        "/testing/*": { format: "global" },
        "/testing/helpers/jQueryEventsPatch.js": { format: "system" },
        "/testing/helpers/dataPatch.js": { format: "system" },
        "/layouts/*": { format: "global" }
    }
});

define(function(require) {
    require("common.css!");
    require("android5_light.css!");

    require("/artifacts/transpiled/bundles/dx.mobile.js");

    require("/testing/helpers/frameworkMocks.js");
    require("/testing/helpers/layoutHelper.js");

    require("/layouts/Navbar/NavbarLayout.js");

    require("/testing/tests/DevExpress.framework/layoutParts/html_navbarLayoutController.tests.js");
});
