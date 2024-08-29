import $ from 'jquery';

import Chat from 'ui/chat';
import MessageList from '__internal/ui/chat/chat_message_list';
import MessageBox from '__internal/ui/chat/chat_message_box';
import keyboardMock from '../../../helpers/keyboardMock.js';

import { isRenderer } from 'core/utils/type';

import config from 'core/config';

const CHAT_HEADER_TEXT_CLASS = 'dx-chat-header-text';
const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';
const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';
const CHAT_MESSAGE_BOX_CLASS = 'dx-chat-message-box';
const CHAT_MESSAGE_BOX_BUTTON_CLASS = 'dx-chat-message-box-button';
const CHAT_MESSAGE_BOX_TEXTAREA_CLASS = 'dx-chat-message-box-text-area';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

const MOCK_CHAT_HEADER_TEXT = 'Chat title';

export const MOCK_COMPANION_USER_ID = 'COMPANION_USER_ID';
export const MOCK_CURRENT_USER_ID = 'CURRENT_USER_ID';
export const NOW = '1721747399083';

export const userFirst = {
    id: MOCK_COMPANION_USER_ID,
    name: 'First',
};

export const userSecond = {
    id: MOCK_CURRENT_USER_ID,
    name: 'Second',
};

export const generateMessages = (length) => {
    const messages = Array.from({ length }, (_, i) => {
        const item = {
            timestamp: NOW,
            author: i % 4 === 0 ? userFirst : userSecond,
            text: String(Math.random()),
        };

        return item;
    });

    return messages;
};

const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="chat"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}) => {
            this.instance = new Chat($('#chat'), options);
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

QUnit.module('Chat', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof Chat);
        });
    });

    QUnit.module('Default options', () => {
        QUnit.test('user should be set to an object with generated id if property is not passed', function(assert) {
            const { user } = this.instance.option();

            // eslint-disable-next-line no-prototype-builtins
            assert.strictEqual(user.hasOwnProperty('id'), true);
        });

        QUnit.test('User id should be generated as a string if user has not been set', function(assert) {
            assert.strictEqual(typeof this.instance.option('user.id') === 'string', true);
        });
    });

    QUnit.module('Header integration', () => {
        QUnit.test('Header text element should have correct text', function(assert) {
            this.reinit({
                title: MOCK_CHAT_HEADER_TEXT
            });

            const $header = this.$element.find(`.${CHAT_HEADER_TEXT_CLASS}`);

            assert.strictEqual($header.text(), MOCK_CHAT_HEADER_TEXT);
        });

        QUnit.test('Header text element should have correct text after runtime change', function(assert) {
            this.instance.option({ title: 'new title' });

            const $header = this.$element.find(`.${CHAT_HEADER_TEXT_CLASS}`);

            assert.strictEqual($header.text(), 'new title');
        });
    });

    QUnit.module('MessageList integration', () => {
        QUnit.test('passed currentUserId should be equal generated chat.user.id', function(assert) {
            const messageList = MessageList.getInstance(this.$element.find(`.${CHAT_MESSAGE_LIST_CLASS}`));

            const expectedOptions = {
                items: [],
                currentUserId: this.instance.option('user.id'),
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, messageList.option(key), `${key} value is correct`);
            });
        });

        QUnit.test('passed currentUserId should be equal chat.user.id', function(assert) {
            const messages = [{}, {}];

            this.reinit({
                user: {
                    id: 'UserID'
                },
                items: messages
            });

            const messageList = MessageList.getInstance(this.$element.find(`.${CHAT_MESSAGE_LIST_CLASS}`));

            const expectedOptions = {
                items: messages,
                currentUserId: 'UserID',
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, messageList.option(key), `${key} value is correct`);
            });
        });

        QUnit.test('currentUserId should be updated when user has been changed in runtime', function(assert) {
            const newUserID = 'newUserID';

            this.instance.option({ user: { id: newUserID } });

            const messageList = MessageList.getInstance(this.$element.find(`.${CHAT_MESSAGE_LIST_CLASS}`));

            assert.deepEqual(messageList.option('currentUserId'), newUserID, 'currentUserId value is updated');
        });

        QUnit.test('items should be passed to messageList after update', function(assert) {
            const newItems = [{ author: { name: 'Mike' } }, { author: { name: 'John' } }];

            this.instance.option('items', newItems);

            const messageList = MessageList.getInstance(this.$element.find(`.${CHAT_MESSAGE_LIST_CLASS}`));

            assert.deepEqual(messageList.option('items'), newItems, 'items value is updated');
        });
    });

    QUnit.module('Events', () => {
        QUnit.module('onMessageSend', moduleConfig, () => {
            QUnit.test('should be called when the send button was clicked', function(assert) {
                const onMessageSend = sinon.spy();

                this.reinit({ onMessageSend });

                keyboardMock(this.$input)
                    .focus()
                    .type('new text message');

                this.$sendButton.trigger('dxclick');

                assert.strictEqual(onMessageSend.callCount, 1);
            });

            QUnit.test('should get correct arguments after clicking the send button', function(assert) {
                assert.expect(6);

                const text = 'new text message';

                this.instance.option({
                    onMessageSend: ({ component, element, event, message }) => {
                        assert.strictEqual(component, this.instance, 'component field is correct');
                        assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                        assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                        assert.strictEqual(event.type, 'dxclick', 'e.event.type is correct');
                        assert.strictEqual(event.target, this.$sendButton.get(0), 'event field is correct');
                        assert.strictEqual(message.text, text, 'message field is correct');
                    },
                });

                keyboardMock(this.$input).focus().type(text);

                this.$sendButton.trigger('dxclick');
            });

            QUnit.test('should be possible to change at runtime', function(assert) {
                const onMessageSend = sinon.spy();

                this.instance.option({ onMessageSend });

                const text = 'new text message';

                keyboardMock(this.$input)
                    .focus()
                    .type(text);

                this.$sendButton.trigger('dxclick');

                assert.strictEqual(onMessageSend.callCount, 1);
            });

            QUnit.test('new message should be created after clicking the send button', function(assert) {
                const text = 'new text message';

                keyboardMock(this.$input)
                    .focus()
                    .type(text);

                this.$sendButton.trigger('dxclick');

                const $bubbles = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);
                const bubble = $bubbles[$bubbles.length - 1];

                assert.strictEqual($(bubble).text(), text);
            });

            QUnit.test('New message should be correct after clicking the send button', function(assert) {
                assert.expect(3);

                const text = 'new text message';

                this.instance.option({
                    onMessageSend: ({ message }) => {
                        const { author, text: messageText } = message;

                        assert.strictEqual(author, this.instance.option('user'), 'author field is correct');
                        // eslint-disable-next-line no-prototype-builtins
                        assert.strictEqual(message.hasOwnProperty('timestamp'), true, 'timestamp field is set');
                        assert.strictEqual(messageText, text, 'text field is correct');
                    },
                });

                keyboardMock(this.$input)
                    .focus()
                    .type(text);

                this.$sendButton.trigger('dxclick');
            });
        });
    });

    QUnit.module('renderMessage', moduleConfig, () => {
        QUnit.test('should allow calling without arguments without any errors', function(assert) {
            this.reinit();

            try {
                this.instance.renderMessage();
            } catch(e) {
                assert.ok(false, `error: ${e.message}`);
            } finally {
                const { items } = this.instance.option();

                assert.strictEqual(items.length, 1, 'message count is correct');
                assert.deepEqual(items[0], {}, 'message data is correct');
            }
        });

        QUnit.test('Chat items should be updated after renderMessage has been called', function(assert) {
            const author = {
                id: MOCK_CURRENT_USER_ID,
            };

            const newMessage = {
                author,
                timestamp: NOW,
                text: 'NEW MESSAGE',
            };

            this.instance.renderMessage(newMessage);

            const { items } = this.instance.option();
            const lastItem = items[items.length - 1];

            assert.strictEqual(lastItem, newMessage);
        });

        QUnit.test('Message Group should be created if items are empty', function(assert) {
            this.instance.option({ items: [] });

            const author = {
                id: MOCK_CURRENT_USER_ID,
            };

            const newMessage = {
                author,
                timestamp: NOW,
                text: 'NEW MESSAGE',
            };

            const getMessageGroups = () => this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`);

            assert.strictEqual(getMessageGroups().length, 0);

            this.instance.renderMessage(newMessage);

            assert.strictEqual(getMessageGroups().length, 1);
        });

        [
            { text: undefined, },
            { text: 'new message text', },
            { text: '', },
            { text: '    ' }
        ].forEach((renderMessageArgs) => {
            const { text } = renderMessageArgs;

            QUnit.test(`New bubble should be rendered correctly after renderMessage call passed argument ${JSON.stringify(renderMessageArgs)}`, function(assert) {
                this.reinit({
                    items: [{}, {}, {}],
                });

                const author = { id: MOCK_CURRENT_USER_ID };
                const newMessage = {
                    author,
                    text,
                };

                this.instance.renderMessage(newMessage);

                const $bubbles = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

                assert.strictEqual($bubbles.length, 4, 'false');
                assert.strictEqual($bubbles.last().text(), text ? text : '', 'text value is correct');
            });
        });
    });

    QUnit.module('Proxy state options', () => {
        [true, false].forEach(value => {
            QUnit.test('passed state enabled options should be equal chat state enabled options', function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.reinit(options);

                const messageBox = MessageBox.getInstance(this.$element.find(`.${CHAT_MESSAGE_BOX_CLASS}`));

                Object.entries(options).forEach(([key, value]) => {
                    assert.deepEqual(value, messageBox.option(key), `${key} value is correct`);
                });
            });

            QUnit.test('passed state options should be updated when chat state options are changed in runtime', function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.instance.option(options);

                const messageBox = MessageBox.getInstance(this.$element.find(`.${CHAT_MESSAGE_BOX_CLASS}`));

                Object.entries(options).forEach(([key, value]) => {
                    assert.deepEqual(value, messageBox.option(key), `${key} value is correct`);
                });
            });
        });
    });

    QUnit.module('Methods', () => {
        QUnit.test('The textarea input element must be active after the focus() method is invoked', function(assert) {
            this.instance.focus();

            const root = document.querySelector('#qunit-fixture');
            const activeElement = root.shadowRoot ? root.shadowRoot.activeElement : document.activeElement;

            assert.strictEqual(activeElement, this.$input.get(0));
        });
    });
});


