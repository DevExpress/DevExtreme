import $ from 'jquery';

import 'ui/chat';

QUnit.testStart(function() {
    const markup = '<div id="chat"></div>';

    $('#qunit-fixture').html(markup);
});

const CHAT_CLASS = 'dx-chat';
const CHAT_HEADER_CLASS = 'dx-chat-header';
const CHAT_HEADER_TEXT_CLASS = 'dx-chat-header-text';
const CHAT_MESSAGE_BOX_CLASS = 'dx-chat-message-box';
const CHAT_MESSAGE_BOX_TEXTAREA_CLASS = 'dx-chat-message-box-text-area';
const CHAT_MESSAGE_BOX_BUTTON_CLASS = 'dx-chat-message-box-button';
const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';
const CHAT_MESSAGE_LIST_CONTENT_CLASS = 'dx-chat-message-list-content';
const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS = 'dx-chat-message-group-alignment-start';
const CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS = 'dx-chat-message-group-alignment-end';
const CHAT_MESSAGE_GROUP_INFORMATION_CLASS = 'dx-chat-message-group-information';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';
const CHAT_MESSAGE_NAME_CLASS = 'dx-chat-message-name';
const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';
const CHAT_MESSAGE_BUBBLE_FIRST_CLASS = 'dx-chat-message-bubble-first';
const CHAT_MESSAGE_BUBBLE_LAST_CLASS = 'dx-chat-message-bubble-last';
const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_AVATAR_INITIALS_CLASS = 'dx-chat-message-avatar-initials';

const TEXTAREA_CLASS = 'dx-textarea';
const BUTTON_CLASS = 'dx-button';

const MOCK_COMPANION_USER_ID = 'COMPANION_USER_ID';
const MOCK_CURRENT_USER_ID = 'CURRENT_USER_ID';

const moduleConfig = {
    beforeEach: function() {
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

        const now = Date.now();

        const messages = [
            {
                timestamp: String(now),
                author: userFirst,
                text: 'userFirst',
            },
            {
                timestamp: String(now),
                author: userFirst,
                text: 'userFirst',
            },
            {
                timestamp: String(now),
                author: userFirst,
                text: 'userFirst',
            },
            {
                timestamp: String(now),
                author: userSecond,
                text: 'userSecond',
            },
            {
                timestamp: String(now),
                author: userSecond,
                text: 'userSecond',
            },
            {
                timestamp: String(now),
                author: userSecond,
                text: 'userSecond',
            },
            {
                timestamp: String(now),
                author: userFirst,
                text: 'userFirst',
            },
        ];

        const options = {
            user: userSecond,
            items: messages,
        };

        init(options);
    }
};

QUnit.module('Render', moduleConfig, () => {
    QUnit.test('Header should be rendered', function(assert) {
        const $header = this.$element.find(`.${CHAT_HEADER_CLASS}`);

        assert.strictEqual($header.length, 1);
    });

    QUnit.test('Header text element should be rendered', function(assert) {
        const $headerText = this.$element.find(`.${CHAT_HEADER_TEXT_CLASS}`);

        assert.strictEqual($headerText.length, 1);
    });

    QUnit.test('Message box should be rendered', function(assert) {
        const $messageBox = this.$element.find(`.${CHAT_MESSAGE_BOX_CLASS}`);

        assert.strictEqual($messageBox.length, 1);
    });

    QUnit.test('Message box textarea should be rendered', function(assert) {
        const $textArea = this.$element.find(`.${TEXTAREA_CLASS}`);

        assert.strictEqual($textArea.length, 1);
    });

    QUnit.test('Message box button should be rendered', function(assert) {
        const $button = this.$element.find(`.${BUTTON_CLASS}`);

        assert.strictEqual($button.length, 1);
    });

    QUnit.test('Message list should be rendered', function(assert) {
        const $messageList = this.$element.find(`.${CHAT_MESSAGE_LIST_CLASS}`);

        assert.strictEqual($messageList.length, 1);
    });

    QUnit.test('Message list content should be rendered', function(assert) {
        const $messageListContent = this.$element.find(`.${CHAT_MESSAGE_LIST_CONTENT_CLASS}`);

        assert.strictEqual($messageListContent.length, 1);
    });

    QUnit.test('Message list content should be rendered if items is empty', function(assert) {
        this.instance.option({ items: [] });
        const $messageListContent = this.$element.find(`.${CHAT_MESSAGE_LIST_CONTENT_CLASS}`);

        assert.strictEqual($messageListContent.length, 1);
    });

    QUnit.test('Message groups should be rendered', function(assert) {
        const $messageGroups = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`);

        assert.strictEqual($messageGroups.length, 3);
    });

    QUnit.test('Avatar should be rendered in first message group', function(assert) {
        const $messageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(0);
        const $avatar = $messageGroup.find(`.${CHAT_MESSAGE_AVATAR_CLASS}`);

        assert.strictEqual($avatar.length, 1);
    });

    QUnit.test('Avatar initials element should be rendered in avatar', function(assert) {
        const $avatar = this.$element.find(`.${CHAT_MESSAGE_AVATAR_CLASS}`).eq(0);
        const $initials = $avatar.find(`.${CHAT_MESSAGE_AVATAR_INITIALS_CLASS}`);

        assert.strictEqual($initials.length, 1);
    });

    QUnit.test('Avatar should not be rendered in second message group', function(assert) {
        const $messageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(1);
        const $avatar = $messageGroup.find(`.${CHAT_MESSAGE_AVATAR_CLASS}`);

        assert.strictEqual($avatar.length, 0);
    });

    QUnit.test('Message group information should be rendered', function(assert) {
        const $messageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(0);
        const $information = $messageGroup.find(`.${CHAT_MESSAGE_GROUP_INFORMATION_CLASS}`);

        assert.strictEqual($information.length, 1);
    });

    QUnit.test('Message group time should be rendered', function(assert) {
        const $messageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(0);
        const $time = $messageGroup.find(`.${CHAT_MESSAGE_TIME_CLASS}`);

        assert.strictEqual($time.length, 1);
    });

    QUnit.test('Message group user name should be rendered', function(assert) {
        const $messageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(0);
        const $name = $messageGroup.find(`.${CHAT_MESSAGE_NAME_CLASS}`);

        assert.strictEqual($name.length, 1);
    });

    QUnit.test('Message bubble should be rendered in message group', function(assert) {
        const $messageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(0);
        const $bubbles = $messageGroup.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

        assert.strictEqual($bubbles.length, 3);
    });
});

QUnit.module('Classes', moduleConfig, () => {
    QUnit.test(`Chat should have ${CHAT_CLASS} class`, function(assert) {
        assert.strictEqual(this.$element.hasClass(CHAT_CLASS), true);
    });

    QUnit.test(`Message box textarea should have ${CHAT_MESSAGE_BOX_TEXTAREA_CLASS} class`, function(assert) {
        const $textArea = this.$element.find(`.${TEXTAREA_CLASS}`);

        assert.strictEqual($textArea.hasClass(CHAT_MESSAGE_BOX_TEXTAREA_CLASS), true);
    });

    QUnit.test(`Message box button should have ${CHAT_MESSAGE_BOX_BUTTON_CLASS} class`, function(assert) {
        const $button = this.$element.find(`.${BUTTON_CLASS}`);

        assert.strictEqual($button.hasClass(CHAT_MESSAGE_BOX_BUTTON_CLASS), true);
    });

    QUnit.test(`First message group should have ${CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS} class`, function(assert) {
        const $messageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(0);

        assert.strictEqual($messageGroup.hasClass(CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS), true);
    });

    QUnit.test(`Second message group should have ${CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS} class`, function(assert) {
        const $messageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(1);

        assert.strictEqual($messageGroup.hasClass(CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS), true);
    });

    QUnit.test('Message bubble should have correct classes', function(assert) {
        const $firstMessageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(0);
        const $bubbles = $firstMessageGroup.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

        assert.strictEqual($bubbles.eq(0).hasClass(CHAT_MESSAGE_BUBBLE_FIRST_CLASS), true);
        assert.strictEqual($bubbles.eq(1).hasClass(CHAT_MESSAGE_BUBBLE_FIRST_CLASS), false);
        assert.strictEqual($bubbles.eq(1).hasClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS), false);
        assert.strictEqual($bubbles.eq(2).hasClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS), true);

        const $lastMessageGroup = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`).eq(2);
        const $bubble = $lastMessageGroup.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

        assert.strictEqual($bubble.hasClass(CHAT_MESSAGE_BUBBLE_FIRST_CLASS), true);
        assert.strictEqual($bubble.hasClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS), true);
    });
});
