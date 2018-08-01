var $ = require("jquery");

QUnit.test("widgets-mobile", function(assert) {

    $.each([
        "dxPanorama",
        "dxPivot",
        "dxSlideOut",
        "dxSlideOutView"
    ], function(_, namespace) {
        assert.ok(DevExpress.ui[namespace], "DevExpress.ui." + namespace + " present");
    });

});
