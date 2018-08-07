var $ = require("jquery");

QUnit.test("framework", function(assert) {

    $.each([
        "dxCommand",
        "Router",
        "StateManager",

        "ViewCache",
        "NullViewCache",
        "ConditionalViewCacheDecorator",
        "CapacityViewCacheDecorator",
        "HistoryDependentViewCacheDecorator",

        "dxCommandContainer",

        "dxView",
        "dxLayout",
        "dxViewPlaceholder",
        "dxContentPlaceholder",
        "dxTransition",
        "dxContent"
    ], function(_, namespace) {
        assert.ok(DevExpress.framework[namespace], "DevExpress.framework." + namespace + " present");
    });

    $.each([
        "HtmlApplication"
    ], function(_, namespace) {
        assert.ok(DevExpress.framework.html[namespace], "DevExpress.framework.html." + namespace + " present");
    });

});
