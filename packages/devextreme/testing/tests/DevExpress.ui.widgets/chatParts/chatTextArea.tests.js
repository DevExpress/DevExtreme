import $ from 'jquery';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';

import ChatTextArea from '__internal/ui/chat/message_box/chat_text_area';
import Button from 'ui/button';
import { BUTTON_CLASS } from '__internal/ui/button/button';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new ChatTextArea($('#component'), options);
            this.$element = $(this.instance.$element());
            this.$input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

            const $buttons = this.$element.find(`.${BUTTON_CLASS}`);
            this.$sendButton = $($buttons[$buttons.length - 1]);
            this.sendButton = Button.getInstance(this.$sendButton);
        };

        this.reinit = (options) => {
            this.instance.dispose();
            init(options);
        };

        init();
    }
};

QUnit.module('ChatTextArea', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof ChatTextArea);
        });

        QUnit.test('send button should be initialized with the corresponding configuration', function(assert) {
            const expectedOptions = {
                icon: 'arrowright',
                type: 'default',
                stylingMode: 'contained',
                disabled: true,
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(this.sendButton.option(key), value, `${key} value is correct`);
            });
        });

        QUnit.test('should have correct default options', function(assert) {
            const expectedOptions = {
                stylingMode: 'outlined',
                placeholder: 'Type a message',
                autoResizeEnabled: true,
                maxHeight: '8em',
                valueChangeEvent: 'input'
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(this.instance.option(key), value, `${key} value is correct`);
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

        QUnit.test('textarea should not be cleared when the send button is clicked if the input contains only spaces', function(assert) {
            const emptyValue = '    ';

            keyboardMock(this.$input)
                .focus()
                .type(emptyValue);

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(this.$input.val(), emptyValue);
        });

        QUnit.test('send button should be enabled after entering any character', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('i');

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, false);
        });

        QUnit.test('send button should be disabled after entering any character and clicking the button', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('i');

            this.$sendButton.trigger('dxclick');

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });

        QUnit.test('send button should be disabled after entering only spaces', function(assert) {
            const emptyValue = '    ';

            keyboardMock(this.$input)
                .focus()
                .type(emptyValue);

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });

        QUnit.test('send button should be disabled after entering only line breaks', function(assert) {
            const lineBreakValue = '\n';

            keyboardMock(this.$input)
                .focus()
                .type(lineBreakValue);

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });

        QUnit.test('send button should be disabled after entering character and removing it', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('i')
                .press('backspace');

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });
    });

    QUnit.module('onSend event', () => {
        QUnit.test('should be fired when send button is clicked with valid text', function(assert) {
            const onSendStub = sinon.stub();

            this.reinit({ onSend: onSendStub });

            keyboardMock(this.$input)
                .focus()
                .type('new text message');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onSendStub.callCount, 1);
        });

        QUnit.test('should be fired on enter key if textarea contains valid text', function(assert) {
            const onSendStub = sinon.stub();

            this.reinit({ onSend: onSendStub });

            keyboardMock(this.$input)
                .focus()
                .type('new text message')
                .keyDown('enter')
                .keyUp('enter');

            assert.strictEqual(onSendStub.callCount, 1);
        });

        QUnit.test('should not be fired when send button is clicked if textarea is empty', function(assert) {
            const onSendStub = sinon.stub();

            this.reinit({ onSend: onSendStub });

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onSendStub.callCount, 0);
        });

        QUnit.test('should not be fired on enter key if textarea contains only spaces', function(assert) {
            const onSendStub = sinon.stub();

            this.reinit({ onSend: onSendStub });

            keyboardMock(this.$input)
                .focus()
                .type('   ')
                .keyDown('enter')
                .keyUp('enter');

            assert.strictEqual(onSendStub.callCount, 0);
        });

        QUnit.test('should be possible to update it at runtime', function(assert) {
            const onSendStub = sinon.stub();

            this.instance.option('onSend', onSendStub);

            keyboardMock(this.$input)
                .focus()
                .type('new text message');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onSendStub.callCount, 1);
        });

        QUnit.test('should be fired with correct arguments on button click', function(assert) {
            assert.expect(4);

            const text = 'new text message';

            this.reinit({
                onSend: (e) => {
                    const { component, element, event } = e;

                    assert.strictEqual(component, this.instance, 'component is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is renderer');
                    assert.strictEqual($(element).is(this.$element), true, 'element is correct');
                    assert.strictEqual(event.type, 'dxclick', 'event.type is correct');
                },
            });

            keyboardMock(this.$input).focus().type(text);
            this.$sendButton.trigger('dxclick');
        });

        QUnit.test('should be fired with correct arguments on enter key', function(assert) {
            assert.expect(5);

            const text = 'new text message';

            this.reinit({
                onSend: (e) => {
                    const { component, element, event } = e;

                    assert.strictEqual(component, this.instance, 'component is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is renderer');
                    assert.strictEqual($(element).is(this.$element), true, 'element is correct');
                    assert.strictEqual(event.type, 'keyup', 'event.type is correct');
                    assert.strictEqual(event.target, this.$input.get(0), 'event.target is correct');
                },
            });

            keyboardMock(this.$input)
                .focus()
                .type(text)
                .keyDown('enter')
                .keyUp('enter');
        });
    });

    QUnit.module('Keyboard navigation', () => {
        QUnit.test('textarea should not be cleared on enter if text contains only spaces', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('   ')
                .keyDown('enter')
                .keyUp('enter');

            assert.strictEqual(this.$input.val(), '   ');
        });

        QUnit.test('textarea should be cleared on enter when valid text is entered', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('some text')
                .keyDown('enter')
                .keyUp('enter');

            assert.strictEqual(this.$input.val(), '');
        });

        QUnit.test('enter keydown should be prevented if input has non-space characters', function(assert) {
            const enterKeyDownEvent = $.Event('keydown', { key: 'enter' });

            keyboardMock(this.$input).type('1');

            this.$input.trigger(enterKeyDownEvent);

            assert.ok(enterKeyDownEvent.isDefaultPrevented(), 'default is prevented');
        });

        QUnit.test('enter keydown with Shift should not be prevented', function(assert) {
            const enterKeyDownEvent = $.Event('keydown', { key: 'enter', shiftKey: true });

            keyboardMock(this.$input).focus().type('1');

            this.$input.trigger(enterKeyDownEvent);

            assert.notOk(enterKeyDownEvent.isDefaultPrevented(), 'default is not prevented');
        });

        QUnit.test('enter keydown should not be prevented if text has only spaces', function(assert) {
            const enterKeyDownEvent = $.Event('keydown', { key: 'enter' });

            keyboardMock(this.$input).type('  \n  \n');

            this.$input.trigger(enterKeyDownEvent);

            assert.notOk(enterKeyDownEvent.isDefaultPrevented(), 'default is not prevented');
        });

        QUnit.test('textarea should restore height after enter with multiline text', function(assert) {
            const initialHeight = this.$element.height();

            keyboardMock(this.$input)
                .type('1\n2\n3')
                .keyDown('enter')
                .keyUp('enter');

            assert.roughEqual(this.$element.height(), initialHeight, 0.1, 'height is restored');
        });
    });

    QUnit.module('Proxy state options', () => {
        [true, false].forEach(value => {
            QUnit.test('passed state options should be equal chat textarea state options', function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.reinit(options);

                Object.entries(options).forEach(([key, value]) => {
                    assert.deepEqual(value, this.sendButton.option(key), `button ${key} value is correct`);
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
                });
            });
        });
    });
});
