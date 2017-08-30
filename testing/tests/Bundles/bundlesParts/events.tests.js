"use strict";

var $ = require("jquery");
var registerEventCallbacks = require("events/core/event_registrator_callbacks");

var special = {};
registerEventCallbacks.add(function(name, eventObject) {
    special[name] = eventObject;
});


QUnit.test("events", function(assert) {

    $.each([
        "dxclick",

        "dxcontextmenu",

        "dxdblclick",

        "dxdrag",

        "dxhold",

        "dxhoverstart",
        "dxhoverend",

        "dxpointerdown",
        "dxpointerup",
        "dxpointermove",
        "dxpointercancel",
        "dxpointerenter",
        "dxpointerleave",
        "dxpointerover",
        "dxpointerout",

        "dxswipe",

        "dxtransform"
    ], function(_, namespace) {
        assert.ok(special[namespace], namespace + " event present");
    });

});
