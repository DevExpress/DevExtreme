"use strict";

var eventsEngine = require("events/core/events_engine");
var keyboardMock = require("../../helpers/keyboardMock.js");
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

QUnit.test("triggering 'click' event for checkbox calls native click method", function(assert) {
    var counter = 0;

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    var click = sinon.spy(HTMLElement.prototype, "click");

    var handler = function() { counter++; };

    document.body.appendChild(checkbox);

    eventsEngine.on(checkbox, "click", handler);

    assert.notOk(checkbox.checked);
    eventsEngine.trigger(checkbox, "click");
    assert.ok(checkbox.checked);
    eventsEngine.trigger(checkbox, "click");
    assert.notOk(checkbox.checked);

    assert.equal(counter, 2);
    assert.equal(click.callCount, 2);

    click.restore();

});

QUnit.test(" trigering 'click' event for <a> does not calls native click method", function(assert) {
    var a = document.createElement("a");

    var click = sinon.spy(HTMLElement.prototype, "click");

    document.body.appendChild(a);

    eventsEngine.trigger(a, "click");

    assert.ok(click.notCalled);

    click.restore();
});

QUnit.test("'focusin' and 'focus' events call element.focus, 'focusout' and 'blur' - element.blur", function(assert) {
    var textBox = document.createElement("input");
    textBox.type = "text";

    var focus = sinon.spy(HTMLElement.prototype, "focus");
    var blur = sinon.spy(HTMLElement.prototype, "blur");

    document.body.appendChild(textBox);

    eventsEngine.trigger(textBox, "focusin");
    eventsEngine.trigger(textBox, "focusout");
    eventsEngine.trigger(textBox, "focus");
    eventsEngine.trigger(textBox, "blur");

    // jQuery does not call native focus/blur for focusin/focusout
    if(QUnit.urlParams["nojquery"]) {
        assert.ok(focus.calledTwice);
        assert.ok(blur.calledTwice);
    } else {
        assert.expect(0);
    }

    blur.restore();
    focus.restore();
});

QUnit.test("prevent triggered 'load' event bubbling to body", function(assert) {
    var done = assert.async();
    var image = document.createElement("img");

    eventsEngine.on(image, "load", function() {
        assert.ok(true);
        done();
    });
    eventsEngine.on(document.body, "load", function() {
        assert.ok(false);
    });

    document.body.appendChild(image);

    eventsEngine.trigger(image, "load");

});

QUnit.test("Simulate clicks, check which property", function(assert) {
    var testData = [
        { button: 2, which: 3 },
        { button: 0, which: 1 },
        { button: 1, which: 2 },
    ];
    var i = 0;
    var div = document.createElement("div");
    var handler = function(e) {
        assert.equal(e.which, testData[i].which);
    };

    var fireEvent = function(button) {
        var event = div.ownerDocument.createEvent("MouseEvents");
        event.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, button, null);
        div.dispatchEvent(event);
    };

    document.body.appendChild(div);
    eventsEngine.on(div, "click", handler);

    for(; i < testData.length; i++) {
        fireEvent(testData[i].button);
    }
});

QUnit.test("Simulate tab press, check which property", function(assert) {
    var done = assert.async();
    var input = document.createElement("input");
    input.type = "text";
    var handler = function(e) {
        assert.equal(e.which, 9);
        done();
    };

    document.body.appendChild(input);
    eventsEngine.on(input, "keydown", handler);

    var keyboard = keyboardMock(input);
    keyboard.press("tab");
});

QUnit.test("Event bubbling", function(assert) {
    var fired = {
        focus: 0,
        click: 0,
        load: 0
    };

    var div = document.createElement("div");
    document.body.appendChild(div);

    var handler = function() {
        fired[event]++;
    };

    for(var event in fired) {
        eventsEngine.on(window, event, handler);
        eventsEngine.on(document, event, handler);
        eventsEngine.on(document.body, event, handler);

        eventsEngine.trigger(div, event);
    }

    assert.equal(fired.click, 3);
    assert.equal(fired.load, 0);
    assert.equal(fired.focus, 0);
});
