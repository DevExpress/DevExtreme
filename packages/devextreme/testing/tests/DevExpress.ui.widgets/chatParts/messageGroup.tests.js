import $ from 'jquery';

import MessageGroup from '__internal/ui/chat/chat_message_group';
import ChatAvatar from '__internal/ui/chat/chat_avatar';

const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';
const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';

const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="messageGroup"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}) => {
            this.instance = new MessageGroup($('#messageGroup'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('MessageGroup', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof MessageGroup);
        });
    });

    QUnit.module('Time', () => {
        [
            { timestamp: new Date(2021, 9, 17, 21, 34) },
            { timestamp: '2021-10-17T21:34:00' },
            { timestamp: new Date(2021, 9, 17, 21, 34).getTime() },
        ].forEach(({ timestamp }) => {
            QUnit.test('time element should display the time value correctly if the timestamp is presented in different formats', function(assert) {
                this.reinit({
                    items: [{ timestamp }],
                });

                const $time = this.$element.find(`.${CHAT_MESSAGE_TIME_CLASS}`);

                assert.strictEqual($time.length, 1);
                assert.strictEqual($time.text(), '21:34', 'time text is correct');
            });
        });

        QUnit.test('value should be presented in the correct format and taken from the first message in the group', function(assert) {
            const messageTimeFirst = new Date(2021, 9, 17, 21, 34);
            const messageTimeSecond = new Date(2021, 9, 17, 14, 43);

            this.reinit({
                items: [{
                    timestamp: messageTimeFirst,
                }, {
                    timestamp: messageTimeSecond
                }]
            });

            const $time = this.$element.find(`.${CHAT_MESSAGE_TIME_CLASS}`);

            assert.strictEqual($time.text(), '21:34');
        });
    });

    QUnit.module('renderMessage()', () => {
        QUnit.test('new message bubble should be rendered into the group after calling the renderMessage function', function(assert) {
            this.reinit({
                items: [{}, {}, {}],
            });

            let $messageBubble = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.length, 3);

            const newMessage = {
                author: { id: 'MikeID' },
                timestamp: Date.now(),
                text: 'NEW MESSAGE',
            };

            this.instance.renderMessage(newMessage);

            $messageBubble = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.length, 4);
        });
    });

    QUnit.module('Nested avatar component', () => {
        QUnit.test('avatar component should be initialized with correct name property', function(assert) {
            [
                { items: [{}], passedNameValue: undefined },
                { items: [{ author: {} }], passedNameValue: undefined },
                { items: [{ author: undefined }], passedNameValue: undefined },
                { items: [{ author: { name: undefined } }], passedNameValue: undefined },
                { items: [{ author: { name: null } }], passedNameValue: null },
                { items: [{ author: { name: '' } }], passedNameValue: '' },
                { items: [{ author: { name: 888 } }], passedNameValue: 888 },
                { items: [{ author: { name: NaN } }], passedNameValue: NaN },
            ].forEach(({ items, passedNameValue }) => {
                this.reinit({
                    items,
                });

                const avatar = ChatAvatar.getInstance(this.$element.find(`.${CHAT_MESSAGE_AVATAR_CLASS}`));

                assert.deepEqual(avatar.option('name'), passedNameValue);
            });
        });

        QUnit.test('avatar component should be initialized with correct url property', function(assert) {
            [
                { items: [{}], passedUrlValue: undefined },
                { items: [{ author: {} }], passedUrlValue: undefined },
                { items: [{ author: undefined }], passedUrlValue: undefined },
                { items: [{ author: { avatarUrl: undefined } }], passedUrlValue: undefined },
                { items: [{ author: { avatarUrl: null } }], passedUrlValue: null },
                { items: [{ author: { avatarUrl: '' } }], passedUrlValue: '' },
                { items: [{ author: { avatarUrl: ' ' } }], passedUrlValue: '' },
                { items: [{ author: { avatarUrl: 888 } }], passedUrlValue: 888 },
                { items: [{ author: { avatarUrl: NaN } }], passedUrlValue: NaN },
            ].forEach(({ items, passedUrlValue }) => {
                this.reinit({
                    items,
                });

                const avatar = ChatAvatar.getInstance(this.$element.find(`.${CHAT_MESSAGE_AVATAR_CLASS}`));

                assert.deepEqual(avatar.option('url'), passedUrlValue);
            });
        });
    });
});


