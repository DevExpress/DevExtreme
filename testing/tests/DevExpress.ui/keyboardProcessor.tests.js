import $ from "jquery";
import KeyboardProcessor from "ui/widget/ui.keyboard_processor";

const { test } = QUnit;

QUnit.module("keyboardProcessor", {
    beforeEach: () => {
        this.element = $("<div>");
        this.keyName = "downArrow";
        this.ctrlKey = true;
        this.key = "ArrowDown";

        this.event = $.Event("keydown");
        this.event.key = this.key;
        this.event.ctrlKey = this.ctrlKey;
        this.createAssertionHandler = (assert) => {
            return (options) => {
                assert.strictEqual(options.originalEvent, this.event, "the original event is passed to a handler");
                assert.strictEqual(options.keyName, this.keyName, "string key name is passed to the handler");
                assert.strictEqual(options.ctrl, this.ctrlKey, "ctrl status is passed to the handler");
            };
        };
        this.assertionHandlerAssertCount = 3;
    },
    afterEach: () => {
        this.processor.dispose();
        this.element.remove();
    }
}, () => {
    test("keyboardProcessor should invoke process", (assert) => {
        this.processor = new KeyboardProcessor({ element: this.element });
        this.processor.process = (e) => { assert.strictEqual(e, this.event); };
        this.element.trigger(this.event);
    });

    test("Calling process should invoke the handler and pass the original event, key name and ctrl status as arguments", (assert) => {
        this.processor = new KeyboardProcessor({ handler: this.createAssertionHandler(assert) });
        this.processor.process(this.event);
    });

    test("keyboardProcessor should invoke the process of each childProcessor if the handler returns true", (assert) => {
        assert.expect(2 * this.assertionHandlerAssertCount);
        this.processor = new KeyboardProcessor({ element: this.element, handler: function() { return true; } });
        var childProcessorA = this.processor.attachChildProcessor(),
            childProcessorB = this.processor.attachChildProcessor();
        childProcessorA.reinitialize(this.createAssertionHandler(assert));
        childProcessorB.reinitialize(this.createAssertionHandler(assert));
        this.element.trigger(this.event);
    });

    test("Specifying context should invoke handler in it", (assert) => {
        var context = { keyDownHandler: function() { assert.strictEqual(this, context); } };
        this.processor = new KeyboardProcessor({ handler: context.keyDownHandler, context: context });
        this.processor.process(this.event);
    });

    test("keyboardProcessor should process keys it does not know about", (assert) => {
        assert.expect(1);

        const key = "123";

        this.event.key = key;
        this.processor = new KeyboardProcessor({ handler: function(e) { assert.equal(e.key, key, "key code set as key name, if it is unknown"); } });
        this.processor.process(this.event);
    });

    test("keyboardProcessor should not process events from inner target", (assert) => {
        assert.expect(1);

        const key = "12345";
        let fired = false;

        this.event.key = key;
        this.event.target = $("<input>", { 'class': "inner" }).get(0);

        this.processor = new KeyboardProcessor({
            element: this.element,
            focusTarget: this.element,
            handler: function() { fired = true; }
        });

        this.processor.process(this.event);

        assert.ok(!fired, "event was not processed");
    });
});
