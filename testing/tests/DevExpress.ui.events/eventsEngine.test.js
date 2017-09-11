"use strict";

var eventsEngine = require("events/core/events_engine");
require("integration/jquery/events");

QUnit.module("namespaces");

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

QUnit.module("native handler");

QUnit.test("add single native handler for one element, handler removed", function(assert) {
    var element = document.createElement("div");

    var addListener = sinon.spy(HTMLElement.prototype, "addEventListener");
    var delListener = sinon.spy(HTMLElement.prototype, "removeEventListener");

    var handler1 = function() { };
    var handler2 = function() {
        assert.ok(false);
    };

    eventsEngine.on(element, "click.ns1", handler1);
    eventsEngine.on(element, "click", handler2);
    assert.ok(addListener.calledOnce);

    eventsEngine.off(element, "click.ns1", handler1);
    assert.ok(delListener.notCalled);

    eventsEngine.off(element, "click", handler2);
    assert.ok(delListener.calledOnce);

    eventsEngine.trigger(element, "click");

    addListener.restore();
    delListener.restore();
});

