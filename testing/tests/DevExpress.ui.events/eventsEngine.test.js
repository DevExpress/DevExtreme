"use strict";

var eventsEngine = require("events/core/events_engine");
require("integration/jquery/events");

QUnit.module("namespaces: off");

QUnit.test("Event is not removed if 'off' has extra namespace", function(assert) {

    var done = assert.async();

    var element = document.createElement("div");

    eventsEngine.on(element, "click.ns1.ns2.ns3", function() {
        assert.ok(true);
        done();
    });
    eventsEngine.off(element, "click.ns1.ns2.ns4");
    eventsEngine.trigger(element, "click");
});

QUnit.test("Event is removed for any namespace", function(assert) {

    assert.expect(0);
    var done = assert.async();

    var element = document.createElement("div");

    eventsEngine.on(element, "click.ns1.ns2.ns3", function() {
        assert.ok(true);
        done();
    });

    eventsEngine.on(element, "mousemove.ns1.ns2.ns3", function() {
        assert.ok(true);
        done();
    });
    eventsEngine.off(element, "click.ns1");
    eventsEngine.off(element, "mousemove");

    eventsEngine.trigger(element, "click");
    eventsEngine.trigger(element, "mousemove");
    done();
});

QUnit.module("namespaces: trigger");

QUnit.test("Trigger custom events", function(assert) {

    var done = assert.async();
    assert.expect(4);

    var element = document.createElement("div");

    eventsEngine.on(element, "click.ns1.ns2.ns3", function() {
        assert.ok(true);
    });
    eventsEngine.trigger(element, "click");
    eventsEngine.trigger(element, "click.ns1");
    eventsEngine.trigger(element, "click.ns2");
    eventsEngine.trigger(element, "click.ns2.ns3");
    eventsEngine.trigger(element, "click.custom");
    eventsEngine.trigger(element, "click.ns2.custom");
    done();
});

