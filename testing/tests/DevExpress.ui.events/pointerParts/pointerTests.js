"use strict";

require("events/pointer/touch");
require("events/pointer");
require("events/core/event_registrator");

var $ = require("jquery"),

    nativePointerMock = require("../../../helpers/nativePointerMock.js"),
    noop = require("core/utils/common").noop;

QUnit.module("pointer events", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.$element = $("#element");
    },

    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("touchmove should not have a passive event listener", function(assert) {
    var $element = $("<div style=\"height: 20px; width: 20px;\"></div>").appendTo("#qunit-fixture");
    var element = $element.get(0),
        origAddEventListener = element.addEventListener,
        nonPassiveEvent = false;

    element.addEventListener = function(event, handler, options) {
        if(event === "touchmove" && options && options.passive === false) {
            nonPassiveEvent = true;
        }
    };

    $element.on("dxpointermove", { isNative: true }, noop);

    nativePointerMock($element)
        .start()
        .touchStart()
        .touchMove(0, 50)
        .touchEnd();

    assert.ok(nonPassiveEvent, "event listener for touchmove is not passive");

    element.addEventListener = origAddEventListener;
});
