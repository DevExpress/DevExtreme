import $ from 'jquery';
import Chat from 'ui/chat';
import fx from 'animation/fx';

import 'generic_light.css!';

const CHAT_HEADER_TEXT_CLASS = 'dx-chat-header-text';
const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';
const CHAT_MESSAGE_NAME_CLASS = 'dx-chat-message-name';
const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';
const CHAT_MESSAGE_AVATAR_INITIALS_CLASS = 'dx-chat-message-avatar-initials';

const MOCK_CHAT_HEADER_TEXT = 'Chat title';
const MOCK_COMPANION_USER_ID = 'COMPANION_USER_ID';
const MOCK_CURRENT_USER_ID = 'CURRENT_USER_ID';
const NOW = '1721747399083';

const getDateTimeString = (timestamp) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateTime = new Date(Number(timestamp));
    const dateTimeString = dateTime.toLocaleTimeString(undefined, options);

    return dateTimeString;
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

        const userFirst = {
            id: MOCK_COMPANION_USER_ID,
            name: 'First',
        };

        const userSecond = {
            id: MOCK_CURRENT_USER_ID,
            name: 'Second',
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

QUnit.module('Default options', () => {
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
