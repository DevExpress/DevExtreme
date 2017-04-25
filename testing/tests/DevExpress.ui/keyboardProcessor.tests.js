"use strict";

var $ = require("jquery"),
    KeyboardProcessor = require("ui/widget/ui.keyboard_processor");

QUnit.module("keyboardProcessor", {
    beforeEach: function() {
        var that = this;
        this.element = $("<div>");
        this.which = 40;
        this.keyName = "downArrow";
        this.ctrlKey = true;
        this.event = $.Event("keydown");
        this.event.which = this.which;
        this.event.ctrlKey = this.ctrlKey;
        this.createAssertionHandler = function(assert) {
            return function(options) {
                assert.strictEqual(options.originalEvent, that.event, "the original event is passed to a handler");
                assert.strictEqual(options.key, that.keyName, "string key name is passed to the handler");
                assert.strictEqual(options.ctrl, that.ctrlKey, "ctrl status is passed to the handler");
            };
        };
        this.assertionHandlerAssertCount = 3;
    },
    afterEach: function() {
        this.processor.dispose();
        this.element.remove();
    }
});

QUnit.test("keyboardProcessor should invoke process", function(assert) {
    var that = this;
    this.processor = new KeyboardProcessor({ element: this.element });
    this.processor.process = function(e) { assert.strictEqual(e, that.event); };
    this.element.trigger(this.event);
});

QUnit.test("Calling process should invoke the handler and pass the original event, key name and ctrl status as arguments", function(assert) {
    this.processor = new KeyboardProcessor({ handler: this.createAssertionHandler(assert) });
    this.processor.process(this.event);
});

QUnit.test("keyboardProcessor should invoke the process of each childProcessor if the handler returns true", function(assert) {
    assert.expect(2 * this.assertionHandlerAssertCount);
    this.processor = new KeyboardProcessor({ element: this.element, handler: function() { return true; } });
    var childProcessorA = this.processor.attachChildProcessor(),
        childProcessorB = this.processor.attachChildProcessor();
    childProcessorA.reinitialize(this.createAssertionHandler(assert));
    childProcessorB.reinitialize(this.createAssertionHandler(assert));
    this.element.trigger(this.event);
});

QUnit.test("Specifying context should invoke handler in it", function(assert) {
    var context = { keyDownHandler: function() { assert.strictEqual(this, context); } };
    this.processor = new KeyboardProcessor({ handler: context.keyDownHandler, context: context });
    this.processor.process(this.event);
});

QUnit.test("keyboardProcessor should process keys it does not know about", function(assert) {
    assert.expect(1);

    var which = 12345;
    this.event.which = which;
    this.processor = new KeyboardProcessor({ handler: function(e) { assert.equal(e.key, which, "key code set as key name, if it is unknown"); } });
    this.processor.process(this.event);
});

QUnit.test("keyboardProcessor should not process events from inner target", function(assert) {
    assert.expect(1);

    var which = 12345,
        fired = false;
    this.event.which = which;
    this.event.target = $("<input>", { 'class': "inner" }).get(0);
    this.processor = new KeyboardProcessor({
        element: this.element,
        focusTarget: this.element,
        handler: function() { fired = true; }
    });
    this.processor.process(this.event);
    assert.ok(!fired, "event was not processed");
});
