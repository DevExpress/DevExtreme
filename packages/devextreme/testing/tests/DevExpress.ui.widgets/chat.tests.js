import $ from 'jquery';
import Chat from 'ui/chat';
import fx from 'animation/fx';
import keyboardMock from '../../helpers/keyboardMock.js';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';

import 'generic_light.css!';

const CHAT_HEADER_TEXT_CLASS = 'dx-chat-header-text';
const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';
const CHAT_MESSAGE_NAME_CLASS = 'dx-chat-message-name';
const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';
const CHAT_MESSAGE_BUBBLE_LAST_CLASS = 'dx-chat-message-bubble-last';
const CHAT_MESSAGE_AVATAR_INITIALS_CLASS = 'dx-chat-message-avatar-initials';
const CHAT_MESSAGE_BOX_BUTTON_CLASS = 'dx-chat-message-box-button';
const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const SCROLLABLE_CLASS = 'dx-scrollable';

const MOCK_CHAT_HEADER_TEXT = 'Chat title';
const MOCK_COMPANION_USER_ID = 'COMPANION_USER_ID';
const MOCK_CURRENT_USER_ID = 'CURRENT_USER_ID';
const NOW = '1721747399083';
const userFirst = {
    id: MOCK_COMPANION_USER_ID,
    name: 'First',
};
const userSecond = {
    id: MOCK_CURRENT_USER_ID,
    name: 'Second',
};

const getDateTimeString = (timestamp) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateTime = new Date(Number(timestamp));
    const dateTimeString = dateTime.toLocaleTimeString(undefined, options);

    return dateTimeString;
};

const generateMessages = (length) => {
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

QUnit.testStart(() => {
    const markup = '<div id="chat"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        const init = (options = {}) => {
            this.$element = $('#chat').dxChat(options);
            this.instance = this.$element.dxChat('instance');
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        const messages = [
            {
                timestamp: NOW,
                author: userFirst,
                text: 'userFirst',
            },
            {
                timestamp: NOW,
                author: userFirst,
                text: 'userFirst',
            },
            {
                timestamp: NOW,
                author: userSecond,
                text: 'userSecond',
            },
        ];

        const options = {
            title: MOCK_CHAT_HEADER_TEXT,
            items: messages,
        };

        init(options);
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Chat initialization', moduleConfig, () => {
    QUnit.test('Chat should be initialized with correct type', function(assert) {
        assert.ok(this.instance instanceof Chat);
    });

    QUnit.test('currentUserId in message list should be equal chat user id', function(assert) {
        const messageList = this.instance._messageList;

        const chatUserId = this.instance.option('user.id');
        const messageListUserId = messageList.option('currentUserId');

        assert.strictEqual(chatUserId, messageListUserId);
    });

    QUnit.test('currentUserId in message list should be changed when user has been changed in runtime', function(assert) {
        const newId = 'new id';

        this.instance.option({ user: { id: newId } });

        const { currentUserId } = this.instance._messageList.option();

        assert.strictEqual(currentUserId, newId);
    });

    QUnit.test('items in message list should be changed when items has been changed in runtime', function(assert) {
        const newItems = [];

        this.instance.option({ items: newItems });

        const { items } = this.instance._messageList.option();

        assert.strictEqual(items, newItems);
    });

    QUnit.test('Message list should run invalidate after changing user in runtime', function(assert) {
        const invalidateStub = sinon.stub(this.instance._messageList, '_invalidate');

        this.instance.option({ user: {} });

        assert.strictEqual(invalidateStub.callCount, 1);
    });

    QUnit.test('Message list should run invalidate after changing items in runtime', function(assert) {
        const invalidateStub = sinon.stub(this.instance._messageList, '_invalidate');

        this.instance.option({ items: [] });

        assert.strictEqual(invalidateStub.callCount, 1);
    });
});

QUnit.module('Header', moduleConfig, () => {
    QUnit.test('Header text element should have correct text', function(assert) {
        const $header = this.$element.find(`.${CHAT_HEADER_TEXT_CLASS}`);

        assert.strictEqual($header.text(), MOCK_CHAT_HEADER_TEXT);
    });

    QUnit.test('Header text element should have correct text after runtime change', function(assert) {
        this.instance.option({ title: 'new title' });

        const $header = this.$element.find(`.${CHAT_HEADER_TEXT_CLASS}`);

        assert.strictEqual($header.text(), 'new title');
    });
});

QUnit.module('Message group', moduleConfig, () => {
    QUnit.test('Message groups should has correct bubble elements count', function(assert) {
        const $firstMessageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(0);
        const $secondMessageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(1);

        const $firstMessageGroupBubbles = $firstMessageGroup.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);
        const $secondMessageGroupBubbles = $secondMessageGroup.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

        assert.strictEqual($firstMessageGroupBubbles.length, 2);
        assert.strictEqual($secondMessageGroupBubbles.length, 1);
    });

    QUnit.test('Avatar should have correct text', function(assert) {
        const $messageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(0);
        const $avatarText = $messageGroup.find(`.${CHAT_MESSAGE_AVATAR_INITIALS_CLASS}`);

        assert.strictEqual($avatarText.text(), 'F');
    });

    QUnit.test('Message group time should be correct', function(assert) {
        const $messageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(0);
        const $time = $messageGroup.find(`.${CHAT_MESSAGE_TIME_CLASS}`);

        assert.strictEqual($time.text(), getDateTimeString(NOW));
    });

    QUnit.test('Message group user name should be correct', function(assert) {
        const $messageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(0);
        const $name = $messageGroup.find(`.${CHAT_MESSAGE_NAME_CLASS}`);

        assert.strictEqual($name.text(), 'First');
    });

    QUnit.test('Message bubble should have correct text', function(assert) {
        const $messageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(0);
        const $bubble = $messageGroup.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`).eq(0);

        assert.strictEqual($bubble.text(), 'userFirst');
    });
});

QUnit.module('renderMessage', moduleConfig, () => {
    QUnit.test('Chat items should be updated after renderMessage has been called', function(assert) {
        const author = {
            id: MOCK_CURRENT_USER_ID,
        };

        const newMessage = {
            author,
            timestamp: NOW,
            text: 'NEW MESSAGE',
        };

        this.instance.renderMessage(newMessage, author);

        const { items } = this.instance.option();
        const lastItem = items[items.length - 1];

        assert.strictEqual(lastItem, newMessage);
    });

    QUnit.test('Message List items should be updated after renderMessage has been called', function(assert) {
        const author = {
            id: MOCK_CURRENT_USER_ID,
        };

        const newMessage = {
            author,
            timestamp: NOW,
            text: 'NEW MESSAGE',
        };

        this.instance.renderMessage(newMessage, author);

        const { items } = this.instance._messageList.option();
        const lastItem = items[items.length - 1];

        assert.strictEqual(lastItem, newMessage);
    });

    QUnit.test('Last Message Group items should be updated if its user ids are equal with new message', function(assert) {
        const author = {
            id: MOCK_CURRENT_USER_ID,
        };

        const newMessage = {
            author,
            timestamp: NOW,
            text: 'NEW MESSAGE',
        };

        const messageGroups = this.instance._messageList._messageGroups;
        const lastMessageGroup = messageGroups[messageGroups.length - 1];
        const lastMessageGroupElement = lastMessageGroup.element();

        assert.strictEqual($(lastMessageGroupElement).find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`).length, 1);

        this.instance.renderMessage(newMessage, author);

        const { items: messages } = lastMessageGroup.option();
        const lastMessage = messages[messages.length - 1];

        assert.strictEqual(lastMessage, newMessage);
        assert.strictEqual($(lastMessageGroupElement).find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`).length, 2);
    });

    QUnit.test('Message Group should be created if its user ids are not equal with new message', function(assert) {
        const author = {
            id: MOCK_COMPANION_USER_ID,
        };

        const newMessage = {
            author,
            timestamp: NOW,
            text: 'NEW MESSAGE',
        };

        const getMessageGroupElements = () => this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`);
        const messageGroups = this.instance._messageList._messageGroups;

        assert.strictEqual(messageGroups.length, 2);
        assert.strictEqual(getMessageGroupElements().length, 2);

        this.instance.renderMessage(newMessage, author);

        assert.strictEqual(messageGroups.length, 3);
        assert.strictEqual(getMessageGroupElements().length, 3);
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

        this.instance.renderMessage(newMessage, author);

        assert.strictEqual(getMessageGroups().length, 1);
    });

    QUnit.test('Last class should be deleted from last bubble after renderMessage', function(assert) {
        const author = {
            id: MOCK_CURRENT_USER_ID,
        };

        const newMessage = {
            author,
            timestamp: NOW,
            text: 'NEW MESSAGE',
        };

        const getLastMessageGroupBubbles = () => {
            const messageGroups = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`);
            const lastMessageGroup = messageGroups[messageGroups.length - 1];
            const $bubbles = $(lastMessageGroup).find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

            return $bubbles;
        };

        let $bubbles = getLastMessageGroupBubbles();
        assert.strictEqual($bubbles.eq($bubbles.length - 1).hasClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS), true);

        this.instance.renderMessage(newMessage, author);

        $bubbles = getLastMessageGroupBubbles();
        assert.strictEqual($bubbles.eq($bubbles.length - 2).hasClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS), false);
    });


    QUnit.test('New bubble should be rendered after renderMessage with correct text', function(assert) {
        const text = 'NEW MESSAGE';
        const author = { id: MOCK_CURRENT_USER_ID };
        const newMessage = {
            author,
            timestamp: NOW,
            text,
        };

        this.instance.renderMessage(newMessage, author);

        const messageGroups = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`);
        const lastMessageGroup = messageGroups[messageGroups.length - 1];
        const $bubbles = $(lastMessageGroup).find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);
        const lastBubble = $bubbles[$bubbles.length - 1];

        assert.strictEqual($(lastBubble).text(), text);
    });
});

QUnit.module('onMessageSend', moduleConfig, () => {
    QUnit.test('onMessageSend should be called when the send button was clicked if there is text', function(assert) {
        const onMessageSend = sinon.spy();

        const $element = $('#chat').dxChat({ onMessageSend });

        const $textArea = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $button = $element.find(`.${CHAT_MESSAGE_BOX_BUTTON_CLASS}`);

        keyboardMock($textArea).focus().type('new text message');

        $button.trigger('dxclick');

        assert.strictEqual(onMessageSend.callCount, 1);
    });

    QUnit.test('New message should be created after clicking the send button if there is text', function(assert) {
        const text = 'new text message';

        const $textArea = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $button = this.$element.find(`.${CHAT_MESSAGE_BOX_BUTTON_CLASS}`);

        keyboardMock($textArea).focus().type(text);

        $button.trigger('dxclick');

        const $bubbles = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);
        const bubble = $bubbles[$bubbles.length - 1];

        assert.strictEqual($(bubble).text(), text);
    });

    QUnit.test('TextArea text should be empty after clicking the send button if there is text', function(assert) {
        const text = 'new text message';

        const $textArea = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $button = this.$element.find(`.${CHAT_MESSAGE_BOX_BUTTON_CLASS}`);

        keyboardMock($textArea).focus().type(text);

        $button.trigger('dxclick');

        assert.strictEqual(this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`).get(0).value, '');
    });

    QUnit.test('onMessageSend should be called after clicking the send button if there is text', function(assert) {
        const onMessageSend = sinon.spy();

        this.instance.option({ onMessageSend });

        const text = 'new text message';

        const $textArea = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $button = this.$element.find(`.${CHAT_MESSAGE_BOX_BUTTON_CLASS}`);

        keyboardMock($textArea).focus().type(text);

        $button.trigger('dxclick');

        assert.strictEqual(onMessageSend.callCount, 1);
    });

    QUnit.test('onMessageSend should be get correct object after clicking the send button if there is text', function(assert) {
        assert.expect(5);

        const text = 'new text message';

        const $textArea = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $button = this.$element.find(`.${CHAT_MESSAGE_BOX_BUTTON_CLASS}`);

        this.instance.option({
            onMessageSend: ({ component, element, event, message }) => {
                assert.strictEqual(component, this.instance, 'component field is correct');
                assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                assert.strictEqual(event.target, $button.get(0), 'event field is correct');
                assert.strictEqual(message.text, text, 'message field is correct');
            },
        });

        keyboardMock($textArea).focus().type(text);

        $button.trigger('dxclick');
    });

    QUnit.test('New message should be correct after clicking the send button if there is text', function(assert) {
        assert.expect(3);

        const text = 'new text message';

        const $textArea = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $button = this.$element.find(`.${CHAT_MESSAGE_BOX_BUTTON_CLASS}`);

        this.instance.option({
            onMessageSend: ({ message }) => {
                const { author, text: messageText } = message;

                assert.strictEqual(author, this.instance.option('user'), 'author field is correct');
                // eslint-disable-next-line no-prototype-builtins
                assert.strictEqual(message.hasOwnProperty('timestamp'), true, 'timestamp field is set');
                assert.strictEqual(messageText, text, 'text field is correct');
            },
        });

        keyboardMock($textArea).focus().type(text);

        $button.trigger('dxclick');
    });

    QUnit.test('New message should not be created after clicking the send button if there is no text', function(assert) {
        const $button = this.$element.find(`.${CHAT_MESSAGE_BOX_BUTTON_CLASS}`);

        assert.strictEqual(this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`).length, 3);

        $button.trigger('dxclick');

        assert.strictEqual(this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`).length, 3);
    });

    QUnit.test('onMessageSend should not be called after clicking the send button if there is no text', function(assert) {
        const onMessageSend = sinon.spy();

        this.instance.option({ onMessageSend });

        const $button = this.$element.find(`.${CHAT_MESSAGE_BOX_BUTTON_CLASS}`);

        $button.trigger('dxclick');

        assert.strictEqual(onMessageSend.callCount, 0);
    });
});

QUnit.module('Default options', moduleConfig, () => {
    QUnit.test('There is an user id by default if user has not been set', function(assert) {
        const instance = $('#chat').dxChat().dxChat('instance');

        const { user } = instance.option();

        // eslint-disable-next-line no-prototype-builtins
        assert.strictEqual(user.hasOwnProperty('id'), true);
    });

    QUnit.test('User id should be generate as a string if user has not been set', function(assert) {
        const instance = $('#chat').dxChat().dxChat('instance');

        assert.strictEqual(typeof instance.option('user.id') === 'string', true);
    });
});

QUnit.module('Scrolling', moduleConfig, () => {
    QUnit.test('Scrollable should be rendered into Message List', function(assert) {
        const $messageList = this.$element.find(`.${CHAT_MESSAGE_LIST_CLASS}`);
        const $scrollable = $messageList.children(`.${SCROLLABLE_CLASS}`);

        assert.strictEqual($scrollable.length, 1);
    });

    QUnit.test('Scrollable should be scrolled to last message group after init', function(assert) {
        this.reinit({ items: generateMessages(31) });

        const scrollable = this.$element.find(`.${SCROLLABLE_CLASS}`).dxScrollable('instance');
        const scrollTop = scrollable.scrollTop();

        assert.strictEqual(scrollTop !== 0, true);
    });

    QUnit.test('Scrollable should be scrolled to last message group if items canged in runtime', function(assert) {
        this.instance.option({ items: generateMessages(31) });

        const scrollable = this.$element.find(`.${SCROLLABLE_CLASS}`).dxScrollable('instance');
        const scrollTop = scrollable.scrollTop();

        assert.strictEqual(scrollTop !== 0, true);
    });

    [MOCK_CURRENT_USER_ID, MOCK_COMPANION_USER_ID].forEach(id => {
        const isCurrentUser = id === MOCK_CURRENT_USER_ID;
        const textName = `Scrollable should be scrolled to last message group after render ${isCurrentUser ? 'current user' : 'companion'} message`;

        QUnit.test(textName, function(assert) {
            assert.expect(1);

            this.reinit({ items: generateMessages(31) });

            const author = { id };
            const newMessage = {
                author,
                timestamp: NOW,
                text: 'NEW MESSAGE',
            };

            const scrollable = this.$element.find(`.${SCROLLABLE_CLASS}`).dxScrollable('instance');

            scrollable.scrollToElement = ($item) => {
                const messageGroups = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`);
                const lastMessageGroup = messageGroups[messageGroups.length - 1];

                assert.strictEqual($item, lastMessageGroup);
            };

            this.instance.renderMessage(newMessage, author);
        });
    });
});
