import $ from 'jquery';

import MessageList from '__internal/ui/chat/chat_message_list';
import Scrollable from 'ui/scroll_view/ui.scrollable';
import {
    generateMessages,
    NOW, MOCK_COMPANION_USER_ID, MOCK_CURRENT_USER_ID
} from './chat.tests.js';
import MessageGroup from '__internal/ui/chat/chat_message_group';

const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const SCROLLABLE_CLASS = 'dx-scrollable';


const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="messageList"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}) => {
            this.instance = new MessageList($('#messageList'), options);
            this.$element = $(this.instance.$element());

            this.scrollable = Scrollable.getInstance(this.$element.find(`.${SCROLLABLE_CLASS}`));
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('MessageList', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof MessageList);
        });

        QUnit.test('scrollabel should be rendered inside root element', function(assert) {
            assert.ok(Scrollable.getInstance(this.$element.children().first()) instanceof Scrollable);
        });

        QUnit.test('new message group component should be rendered only when a message with a different user ID is encountered', function(assert) {
            this.reinit({
                items: [
                    { author: { id: 'UserID' } },
                    { author: { id: 'UserID_1' } },
                    { author: { id: 'UserID' } }
                ]
            });

            const $messageGroups = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`);

            assert.strictEqual($messageGroups.length, 3);
        });

        QUnit.test('new message group component should not be rendered when a message with a different user ID is encountered', function(assert) {
            this.reinit({
                items: [
                    { author: { id: 'UserID' } },
                    { author: { id: 'UserID' } },
                    { author: { id: 'UserID' } }
                ]
            });

            const $messageGroups = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`);

            assert.strictEqual($messageGroups.length, 1);
        });

        QUnit.test('essage group component should not be rendered if items is empty', function(assert) {
            const $messageGroups = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`);

            assert.strictEqual($messageGroups.length, 0);
        });
    });

    QUnit.module('Options', function() {
        QUnit.test('should run invalidate after changing user in runtime', function(assert) {
            const invalidateStub = sinon.stub(this.instance, '_invalidate');

            this.instance.option({ currentUserId: 'newUserID' });

            assert.strictEqual(invalidateStub.callCount, 1);
        });

        QUnit.test('should run invalidate after changing items in runtime', function(assert) {
            const invalidateStub = sinon.stub(this.instance, '_invalidate');

            this.instance.option({ items: [] });

            assert.strictEqual(invalidateStub.callCount, 1);
        });
    });

    QUnit.module('Scrollable integration', () => {
        QUnit.test('scrollable component should be initialized with correct options', function(assert) {
            const expectedOptions = {
                useNative: true,
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, this.scrollable.option(key), `${key} value is correct`);
            });
        });

        QUnit.test('Scrollable should be scrolled to last message group after init', function(assert) {
            this.reinit({
                width: 300,
                height: 600,
                items: generateMessages(52)
            });

            const scrollTop = this.scrollable.scrollTop();

            assert.strictEqual(scrollTop !== 0, true);
        });

        QUnit.test('Scrollable should be scrolled to last message group if items changed at runtime', function(assert) {
            this.reinit({
                width: 300,
                height: 500,
            });

            this.instance.option('items', generateMessages(52));

            const scrollable = Scrollable.getInstance(this.$element.find(`.${SCROLLABLE_CLASS}`));
            const scrollTop = scrollable.scrollTop();

            assert.strictEqual(scrollTop !== 0, true);
        });

        [MOCK_CURRENT_USER_ID, MOCK_COMPANION_USER_ID].forEach(id => {
            const isCurrentUser = id === MOCK_CURRENT_USER_ID;
            const textName = `Scrollable should be scrolled to last message group after render ${isCurrentUser ? 'current user' : 'companion'} message`;

            QUnit.test(textName, function(assert) {
                assert.expect(1);
                const items = generateMessages(31);

                this.reinit({ items });

                const author = { id };
                const newMessage = {
                    author,
                    timestamp: NOW,
                    text: 'NEW MESSAGE',
                };

                this.scrollable.scrollToElement = ($item) => {
                    const messageGroups = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`);
                    const lastMessageGroup = messageGroups[messageGroups.length - 1];

                    assert.strictEqual($item, lastMessageGroup);
                };

                this.instance._renderMessage(newMessage, [...items, newMessage], author);
            });
        });
    });

    QUnit.module('MessageGroup integration', () => {
        QUnit.test('message group component should be rendered with start alignment if user.id is not equal message.author.id', function(assert) {
            this.reinit({
                items: [{ author: { id: 'JohnID' } }],
                currentUserId: 'MikeID',
            });

            const messageGroup = MessageGroup.getInstance(this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`));

            assert.strictEqual(messageGroup.option('alignment'), 'start');
        });

        QUnit.test('message group component should be rendered with end alignment if user.id is equal message.author.id', function(assert) {
            this.reinit({
                items: [{ author: { id: 'MikeID' } }],
                currentUserId: 'MikeID',
            });

            const messageGroup = MessageGroup.getInstance(this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`));

            assert.strictEqual(messageGroup.option('alignment'), 'end');
        });
    });
});


