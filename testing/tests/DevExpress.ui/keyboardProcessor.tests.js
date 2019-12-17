import $ from 'jquery';
import KeyboardProcessor from 'ui/widget/ui.keyboard_processor';

const { test } = QUnit;

QUnit.module('keyboardProcessor', {
    beforeEach: () => {
        this.element = $('<div>');
        this.normalizedKeyName = 'downArrow';
        this.ctrlKey = true;
        this.originalKey = 'ArrowDown';

        this.keyDownEvent = $.Event('keydown');
        this.keyDownEvent.key = this.originalKey;
        this.keyDownEvent.ctrlKey = this.ctrlKey;
        this.createAssertionHandler = (assert) => {
            return (options) => {
                assert.strictEqual(options.originalEvent, this.keyDownEvent, 'the original event is passed to a handler');
                assert.strictEqual(options.keyName, this.normalizedKeyName, 'string key name is passed to the handler');
                assert.strictEqual(options.ctrl, this.ctrlKey, 'ctrl status is passed to the handler');
            };
        };
        this.assertionHandlerAssertCount = 3;
    },
    afterEach: () => {
        this.processor.dispose();
        this.element.remove();
    }
}, () => {
    test('keyboardProcessor should invoke process', (assert) => {
        this.processor = new KeyboardProcessor({ element: this.element });
        this.processor.process = (e) => { assert.strictEqual(e, this.keyDownEvent); };
        this.element.trigger(this.keyDownEvent);
    });

    test('Calling process should invoke the handler and pass the original event, key name and ctrl status as arguments', (assert) => {
        this.processor = new KeyboardProcessor({ handler: this.createAssertionHandler(assert) });
        this.processor.process(this.keyDownEvent);
    });

    test('keyboardProcessor should invoke the process of each childProcessor if the handler returns true', (assert) => {
        assert.expect(2 * this.assertionHandlerAssertCount);
        this.processor = new KeyboardProcessor({ element: this.element, handler: function() { return true; } });

        const childProcessorA = this.processor.attachChildProcessor();
        const childProcessorB = this.processor.attachChildProcessor();

        childProcessorA.reinitialize(this.createAssertionHandler(assert));
        childProcessorB.reinitialize(this.createAssertionHandler(assert));
        this.element.trigger(this.keyDownEvent);
    });

    test('Specifying context should invoke handler in it', (assert) => {
        const context = { keyDownHandler: function() { assert.strictEqual(this, context); } };
        this.processor = new KeyboardProcessor({ handler: context.keyDownHandler, context: context });
        this.processor.process(this.keyDownEvent);
    });

    test('keyboardProcessor should process keys it does not know about', (assert) => {
        assert.expect(1);

        const key = '123';

        this.keyDownEvent.key = key;
        this.processor = new KeyboardProcessor({ handler: function(e) { assert.equal(e.key, key, 'key code set as key name, if it is unknown'); } });
        this.processor.process(this.keyDownEvent);
    });

    test('keyboardProcessor should not process events from inner target', (assert) => {
        assert.expect(1);

        const key = '12345';
        const stubHandler = sinon.stub();

        this.keyDownEvent.key = key;
        this.keyDownEvent.target = $('<input>', { 'class': 'inner' }).get(0);

        this.processor = new KeyboardProcessor({
            element: this.element,
            focusTarget: this.element,
            handler: stubHandler
        });

        this.processor._processFunction(this.keyDownEvent);

        assert.ok(stubHandler.notCalled, 'event was not processed');
    });

    test('keyboardProcessor should not process events during IME composition', (assert) => {
        const stubHandler = sinon.stub();

        this.processor = new KeyboardProcessor({
            element: this.element,
            handler: stubHandler
        });

        this.element.trigger($.Event('compositionstart'));
        this.element.trigger(this.keyDownEvent);
        assert.ok(stubHandler.notCalled, 'event was not processed');

        this.element.trigger($.Event('compositionend'));
        this.element.trigger(this.keyDownEvent);
        assert.ok(stubHandler.calledOnce, 'event has been processed');
    });

    test('keyboardProcessor should not process event after compositionend with a \'229\' keycode [MacOS Safari specific behavior]', (assert) => {
        const stubHandler = sinon.stub();

        this.processor = new KeyboardProcessor({
            element: this.element,
            handler: stubHandler
        });

        this.element.trigger($.Event('compositionstart'));
        this.element.trigger(this.keyDownEvent);
        assert.ok(stubHandler.notCalled, 'event was not processed');

        this.element.trigger($.Event('compositionend'));

        const enterComposition = $.Event('keydown');
        enterComposition.key = 'Enter';
        enterComposition.which = 229;

        this.element.trigger(enterComposition);
        assert.ok(stubHandler.notCalled, 'event was not processed');

        enterComposition.which = 13;
        this.element.trigger(enterComposition);
        assert.ok(stubHandler.calledOnce, 'event has been processed');
    });
});
