import $ from 'jquery';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';

import MessageBox from '__internal/ui/chat/chat_message_box';

const CHAT_MESSAGE_BOX_TEXTAREA_CLASS = 'dx-chat-message-box-text-area';
const CHAT_MESSAGE_BOX_BUTTON_CLASS = 'dx-chat-message-box-button';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="messageBox"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}) => {
            this.instance = new MessageBox($('#messageBox'), options);
            this.$element = $(this.instance.$element());

            this.$textArea = this.$element.find(`.${CHAT_MESSAGE_BOX_TEXTAREA_CLASS}`);
            this.$input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

            this.$sendButton = this.$element.find(`.${CHAT_MESSAGE_BOX_BUTTON_CLASS}`);
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
                icon: 'send',
                stylingMode: 'text',
            };
            const sendButton = this.$sendButton.dxButton('instance');

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, sendButton.option(key), `${key} value is correct`);
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

        QUnit.skip('textarea should be cleared when the send button is clicked if the input contains a value consisting only of spaces', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('    ');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(this.$input.val(), '');
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

        QUnit.test('should not be fired when the send button is clicked if the textarea input does not contain a value', function(assert) {
            const onMessageSendStub = sinon.stub();

            this.reinit({ onMessageSend: onMessageSendStub });

            this.$sendButton.trigger('dxclick');

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
            const onMessageSendStub = sinon.stub();

            this.reinit({ onMessageSend: onMessageSendStub });

            keyboardMock(this.$input)
                .focus()
                .type('    ');

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
    });
});
