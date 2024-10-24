import $ from 'jquery';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';

import MessageBox, { TYPING_END_DELAY } from '__internal/ui/chat/messagebox';
import TextArea from '__internal/ui/m_text_area';
import Button from 'ui/button';

const CHAT_MESSAGEBOX_TEXTAREA_CLASS = 'dx-chat-messagebox-textarea';
const CHAT_MESSAGEBOX_BUTTON_CLASS = 'dx-chat-messagebox-button';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new MessageBox($('#component'), options);
            this.$element = $(this.instance.$element());

            this.$textArea = this.$element.find(`.${CHAT_MESSAGEBOX_TEXTAREA_CLASS}`);
            this.textArea = TextArea.getInstance(this.$textArea);

            this.$input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

            this.$sendButton = this.$element.find(`.${CHAT_MESSAGEBOX_BUTTON_CLASS}`);
            this.sendButton = Button.getInstance(this.$sendButton);
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('MessageBox', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof MessageBox);
        });

        QUnit.test('send button should be initialized with the corresponding configuration', function(assert) {
            const expectedOptions = {
                icon: 'sendfilled',
                type: 'default',
                stylingMode: 'text',
                disabled: true,
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, this.sendButton.option(key), `${key} value is correct`);
            });
        });

        QUnit.test('TextArea should be initialized with the corresponding configuration', function(assert) {
            const expectedOptions = {
                stylingMode: 'outlined',
                placeholder: 'Type a message',
                autoResizeEnabled: true,
                maxHeight: '8em',
                valueChangeEvent: 'input'
            };

            const textArea = TextArea.getInstance(this.$textArea);

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, textArea.option(key), `textarea ${key} value is correct`);
            });
        });
    });

    QUnit.module('Behavior', () => {
        QUnit.test('textarea should be cleared after clicking the send button', function(assert) {
            const text = 'new text message';

            keyboardMock(this.$input)
                .focus()
                .type(text);

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(this.$input.val(), '');
        });

        QUnit.test('textarea should be cleared when the send button is clicked if the input contains a value consisting only of spaces', function(assert) {
            const emptyValue = '    ';

            keyboardMock(this.$input)
                .focus()
                .type(emptyValue);

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(this.$input.val(), emptyValue);
        });

        QUnit.test('send button should not be disabled after entering any character into input', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('i');

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, false);
        });

        QUnit.test('send button should be disabled after entering any character into input and clicking the button', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('i');

            this.$sendButton.trigger('dxclick');

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });

        QUnit.test('send button should be disabled after entering spacing into input', function(assert) {
            const emptyValue = '    ';

            keyboardMock(this.$input)
                .focus()
                .type(emptyValue);

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });

        QUnit.test('send button should be disabled after adding a line break into input', function(assert) {
            const lineBreakValue = '\n';

            keyboardMock(this.$input)
                .focus()
                .type(lineBreakValue);

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });

        QUnit.test('send button should be disabled after entering any character and then removing it', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('i')
                .press('backspace');

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });
    });

    QUnit.module('onMessageSend event', () => {
        QUnit.test('should be fired when the send button is clicked if the textarea input contains a value', function(assert) {
            const onMessageSendStub = sinon.stub();

            this.reinit({ onMessageSend: onMessageSendStub });

            keyboardMock(this.$input)
                .focus()
                .type('new text message');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onMessageSendStub.callCount, 1);
        });

        QUnit.test('should be fired on enter key if the textarea input contains a value', function(assert) {
            const onMessageSendStub = sinon.stub();

            this.reinit({ onMessageSend: onMessageSendStub });

            keyboardMock(this.$input)
                .focus()
                .type('new text message')
                .keyUp('enter');


            assert.strictEqual(onMessageSendStub.callCount, 1);
        });

        QUnit.test('should not be fired when the send button is clicked if the textarea input does not contain a value', function(assert) {
            const onMessageSendStub = sinon.stub();

            this.reinit({ onMessageSend: onMessageSendStub });

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onMessageSendStub.callCount, 0);
        });

        QUnit.test('should not be fired on enter key if the textarea input does not contain a value (excluding spaces)', function(assert) {
            const onMessageSendStub = sinon.stub();

            this.reinit({ onMessageSend: onMessageSendStub });

            keyboardMock(this.$input)
                .focus()
                .keyUp('enter');

            assert.strictEqual(onMessageSendStub.callCount, 0);

            keyboardMock(this.$input)
                .focus()
                .type('   ')
                .keyUp('enter');

            assert.strictEqual(onMessageSendStub.callCount, 0);
        });

        QUnit.test('should be possible to update it at runtime', function(assert) {
            const eventHandlerStub = sinon.stub();

            this.instance.option('onMessageSend', eventHandlerStub);

            keyboardMock(this.$input)
                .focus()
                .type('text');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(eventHandlerStub.callCount, 1);
        });

        QUnit.test('should not be fired when the send button is clicked if the textarea input contains a value consisting only of spaces', function(assert) {
            const emptyText = '    ';
            const onMessageSendStub = sinon.stub();

            this.reinit({ onMessageSend: onMessageSendStub });

            keyboardMock(this.$input)
                .focus()
                .type(emptyText);

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onMessageSendStub.callCount, 0);
        });

        QUnit.test('should be fired with correct arguments', function(assert) {
            assert.expect(6);

            const text = '  new text message ';

            this.reinit({
                onMessageSend: (e) => {
                    const { component, element, event, text } = e;

                    assert.strictEqual(component, this.instance, 'component field is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                    assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                    assert.strictEqual(event.type, 'dxclick', 'e.event.type is correct');
                    assert.strictEqual(event.target, this.$sendButton.get(0), 'event field is correct');
                    assert.strictEqual(text, text, 'message field is correct');
                },
            });

            keyboardMock(this.$input)
                .focus()
                .type(text);

            this.$sendButton.trigger('dxclick');
        });

        QUnit.test('should be fired with correct arguments when enter is pressed', function(assert) {
            assert.expect(6);

            const text = '  new text message ';

            this.reinit({
                onMessageSend: (e) => {
                    const { component, element, event, text } = e;

                    assert.strictEqual(component, this.instance, 'component field is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                    assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                    assert.strictEqual(event.type, 'keyup', 'e.event.type is correct');
                    assert.strictEqual(event.target, this.$input.get(0), 'event target is correct');
                    assert.strictEqual(text, text, 'message field is correct');
                },
            });

            keyboardMock(this.$input)
                .focus()
                .type(text)
                .keyDown('enter')
                .keyUp('enter');
        });
    });

    QUnit.module('onTypingStart event', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();

            moduleConfig.beforeEach.apply(this, arguments);
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        QUnit.test('should be triggered once if a character is entered in the input', function(assert) {
            const onTypingStartStub = sinon.stub();

            this.reinit({ onTypingStart: onTypingStartStub });

            keyboardMock(this.$input)
                .focus()
                .type('n');

            assert.strictEqual(onTypingStartStub.callCount, 1);
        });

        QUnit.test('should be possible to update it at runtime', function(assert) {
            const onTypingStartStub = sinon.stub();

            this.instance.option('onTypingStart', onTypingStartStub);

            keyboardMock(this.$input)
                .focus()
                .type('n');

            assert.strictEqual(onTypingStartStub.callCount, 1);
        });

        ['', ' ', '\n'].forEach(value => {
            QUnit.test(`should be triggered if an empty character is entered in the input, value is '${value}'`, function(assert) {
                const onTypingStartStub = sinon.stub();

                this.reinit({ onTypingStart: onTypingStartStub });

                keyboardMock(this.$input)
                    .focus()
                    .type(value);

                assert.strictEqual(onTypingStartStub.callCount, 1);
            });
        });

        ['n', 'no'].forEach(value => {
            QUnit.test(`should be triggered if backspace was pressed after value ${value} was entered`, function(assert) {
                const onTypingStartStub = sinon.stub();

                this.reinit({ onTypingStart: onTypingStartStub });

                const keyboard = keyboardMock(this.$input);

                keyboard
                    .focus()
                    .type(value);

                this.clock.tick(TYPING_END_DELAY);

                keyboard.press('backspace');

                assert.strictEqual(onTypingStartStub.callCount, 1);
            });
        });

        QUnit.test('should be triggered only once during continuous typing', function(assert) {
            const onTypingStartStub = sinon.stub();

            this.reinit({ onTypingStart: onTypingStartStub });

            const keyboard = keyboardMock(this.$input);

            keyboard
                .focus()
                .type('n');

            assert.strictEqual(onTypingStartStub.callCount, 1, 'called once');

            keyboard.type('o');

            assert.strictEqual(onTypingStartStub.callCount, 1, 'still called once');

            this.clock.tick(TYPING_END_DELAY - 500);

            keyboard.type('t');

            assert.strictEqual(onTypingStartStub.callCount, 1, 'still called once');

            this.clock.tick(TYPING_END_DELAY + 500);

            keyboard.type('e');

            assert.strictEqual(onTypingStartStub.callCount, 2, 'called again after typing end');
        });

        QUnit.test('should be triggered with correct arguments', function(assert) {
            assert.expect(4);

            this.reinit({
                onTypingStart: (e) => {
                    const { component, element, event } = e;

                    assert.strictEqual(component, this.instance, 'component field is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                    assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                    assert.strictEqual(event.type, 'input', 'e.event.type is correct');
                },
            });

            keyboardMock(this.$input)
                .focus()
                .type('n');
        });
    });

    QUnit.module('onTypingEnd event', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();

            moduleConfig.beforeEach.apply(this, arguments);
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        QUnit.test('should be triggered once if a character is entered in the input', function(assert) {
            const onTypingEndStub = sinon.stub();

            this.reinit({ onTypingEnd: onTypingEndStub });

            const keyboard = keyboardMock(this.$input);

            keyboard
                .focus()
                .type('n');

            assert.strictEqual(onTypingEndStub.callCount, 0, 'is not called immediately after entering');

            this.clock.tick(TYPING_END_DELAY - 500);

            assert.strictEqual(onTypingEndStub.callCount, 0, 'is not called still');

            this.clock.tick(500);

            assert.strictEqual(onTypingEndStub.callCount, 1, 'is called once after delay');
        });

        QUnit.test('should be possible to update it at runtime', function(assert) {
            const onTypingEndStub = sinon.stub();

            this.instance.option('onTypingEnd', onTypingEndStub);

            keyboardMock(this.$input)
                .focus()
                .type('n');

            this.clock.tick(TYPING_END_DELAY);

            assert.strictEqual(onTypingEndStub.callCount, 1);
        });

        QUnit.test('should not be called if the user continues to enter text during the delay', function(assert) {
            const onTypingEndStub = sinon.stub();

            this.reinit({ onTypingEnd: onTypingEndStub });

            const keyboard = keyboardMock(this.$input);

            keyboard
                .focus()
                .type('n');

            this.clock.tick(TYPING_END_DELAY - 10);

            keyboard.type('n');

            this.clock.tick(20);

            assert.strictEqual(onTypingEndStub.callCount, 0, 'is not called');

            this.clock.tick(TYPING_END_DELAY);

            assert.strictEqual(onTypingEndStub.callCount, 1, 'is called once after delay');
        });

        ['', ' ', '\n'].forEach(value => {
            QUnit.test(`should be triggered if an empty character is entered in the input, value is '${value}'`, function(assert) {
                const onTypingEndStub = sinon.stub();

                this.reinit({ onTypingEnd: onTypingEndStub });

                keyboardMock(this.$input)
                    .focus()
                    .type(value);

                this.clock.tick(TYPING_END_DELAY);

                assert.strictEqual(onTypingEndStub.callCount, 1);
            });
        });

        QUnit.test('should be triggered with correct arguments', function(assert) {
            assert.expect(3);

            this.reinit({
                onTypingEnd: (e) => {
                    const { component, element } = e;

                    assert.strictEqual(component, this.instance, 'component field is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                    assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                },
            });

            keyboardMock(this.$input)
                .focus()
                .type('n');

            this.clock.tick(TYPING_END_DELAY);
        });

        QUnit.test('should be called after sending a message', function(assert) {
            const onTypingEndStub = sinon.stub();

            this.reinit({ onTypingEnd: onTypingEndStub });

            keyboardMock(this.$input)
                .focus()
                .type('new text message');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onTypingEndStub.callCount, 1, 'called immediately');
        });
    });

    QUnit.module('Proxy state options', () => {
        [true, false].forEach(value => {
            QUnit.test('passed state options should be equal message box state options', function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.reinit(options);

                Object.entries(options).forEach(([key, value]) => {
                    assert.deepEqual(value, this.sendButton.option(key), `button ${key} value is correct`);
                    assert.deepEqual(value, this.textArea.option(key), `textarea ${key} value is correct`);
                });
            });

            QUnit.test('passed state options should be updated when state options are changed in runtime', function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.instance.option(options);

                Object.entries(options).forEach(([key, value]) => {
                    assert.deepEqual(value, this.sendButton.option(key), `button ${key} value is correct`);
                    assert.deepEqual(value, this.textArea.option(key), `textarea ${key} value is correct`);
                });
            });
        });
    });

    QUnit.module('Keyboard navigation', () => {
        QUnit.test('textarea should not be cleared on enter key if the input contains a value consisting only of spaces', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('   ')
                .keyDown('enter')
                .keyUp('enter');

            assert.strictEqual(this.$input.val(), '   ');
        });

        QUnit.test('textarea should be cleared on enter key when some text is entered', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('some text')
                .keyDown('enter')
                .keyUp('enter');

            assert.strictEqual(this.$input.val(), '');
        });

        QUnit.test('enter keydown event should be prevented if input text has non-space characters', function(assert) {
            const enterKeyDownEvent = $.Event('keydown', { key: 'enter' });

            keyboardMock(this.$input).type('1');

            this.$input.trigger(enterKeyDownEvent);

            assert.ok(enterKeyDownEvent.isDefaultPrevented(), 'empty line is not added before sending');
        });

        QUnit.test('enter keydown event with Shift modificator should not be prevented', function(assert) {
            const enterKeyDownEvent = $.Event('keydown', { key: 'enter', shiftKey: true });

            keyboardMock(this.$input).focus().type('1');

            this.$input.trigger(enterKeyDownEvent);

            assert.notOk(enterKeyDownEvent.isDefaultPrevented(), 'empty line is added when shift is used');
        });

        QUnit.test('enter keydown event should not be prevented if input text consists only from space characters', function(assert) {
            const enterKeyDownEvent = $.Event('keydown', { key: 'enter' });

            keyboardMock(this.$input).type('  \n  \n');

            this.$input.trigger(enterKeyDownEvent);

            assert.notOk(enterKeyDownEvent.isDefaultPrevented(), 'empty line is added');
        });

        QUnit.test('textarea should restore its height after enter press when multiline text was entered', function(assert) {
            const initialTextAreaHeight = this.$textArea.height();

            keyboardMock(this.$input)
                .type('1\n2\n3')
                .keyDown('enter')
                .keyUp('enter');

            assert.roughEqual(this.$textArea.height(), initialTextAreaHeight, 0.1, 'textarea height is restored');
        });
    });
});
