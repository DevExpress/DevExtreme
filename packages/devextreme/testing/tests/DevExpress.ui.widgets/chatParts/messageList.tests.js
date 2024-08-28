import $ from 'jquery';

import MessageList from '__internal/ui/chat/chat_message_list';
import Scrollable from 'ui/scroll_view/ui.scrollable';
import {
    generateMessages, userFirst, userSecond,
    NOW, MOCK_COMPANION_USER_ID, MOCK_CURRENT_USER_ID
} from './chat.tests.js';
import MessageGroup from '__internal/ui/chat/chat_message_group';

const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';
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

        QUnit.test('should not be any errors if the items contain undefined values', function(assert) {
            const items = [{}, undefined, {}];

            try {
                this.reinit({
                    items,
                });
            } catch(e) {
                assert.ok(false, `error: ${e.message}`);
            } finally {
                const $bubbles = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

                assert.strictEqual($bubbles.length, 3);
            }
        });

        QUnit.test('scrollable should be rendered inside root element', function(assert) {
            assert.ok(Scrollable.getInstance(this.$element.children().first()) instanceof Scrollable);
        });
    });

    QUnit.module('MessageGroup integration', () => {
        QUnit.test('message group component should not be rendered if items is empty', function(assert) {
            const $messageGroups = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`);

            assert.strictEqual($messageGroups.length, 0);
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

        QUnit.test('new message group component should not be rendered when a message with the same user ID is encountered', function(assert) {
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

        QUnit.test('new message group component should be rendered when a new message with a different user ID is added to the data at runtime', function(assert) {
            const items = [
                { author: { id: 'UserID' } },
                { author: { id: 'UserID_1' } },
                { author: { id: 'UserID' } }
            ];

            this.reinit({
                items
            });

            const newMessage = {
                author: { id: 'UserID_1' },
                text: 'NEW MESSAGE',
            };

            this.instance.option({ items: [...items, newMessage] });

            const $messageGroups = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`);

            assert.strictEqual($messageGroups.length, 4);
        });

        QUnit.test('new message group component should not be rendered when a new message with the same user ID is added to the data at runtime', function(assert) {
            const items = [
                { author: { id: 'UserID' } },
                { author: { id: 'UserID_1' } },
                { author: { id: 'UserID' } }
            ];

            this.reinit({
                items
            });

            const newMessage = {
                author: { id: 'UserID' },
                text: 'NEW MESSAGE',
            };

            this.instance.option({ items: [...items, newMessage] });

            const $messageGroups = this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`);

            assert.strictEqual($messageGroups.length, 3);
        });

        QUnit.test('should render a message if the new items value contains a single item', function(assert) {
            this.reinit();

            const newMessage = {
                timestamp: NOW,
                author: userFirst,
                text: 'NEW MESSAGE',
            };

            this.instance.option({ items: [ newMessage ] });

            const $bubbles = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

            assert.strictEqual($bubbles.length, 1);
        });

        QUnit.test('message group should be rendered with start alignment if user.id is not equal message.author.id', function(assert) {
            this.reinit({
                items: [{ author: { id: 'JohnID' } }],
                currentUserId: 'MikeID',
            });

            const messageGroup = MessageGroup.getInstance(this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`));

            assert.strictEqual(messageGroup.option('alignment'), 'start');
        });

        QUnit.test('message group should be rendered with end alignment if user.id is equal message.author.id', function(assert) {
            this.reinit({
                items: [{ author: { id: 'MikeID' } }],
                currentUserId: 'MikeID',
            });

            const messageGroup = MessageGroup.getInstance(this.$element.find(`.${CHAT_MESSAGE_GROUP_CLASS}`));

            assert.strictEqual(messageGroup.option('alignment'), 'end');
        });
    });

    QUnit.module('Items option change', () => {
        QUnit.test('should not be any errors if the new message in items is undefined', function(assert) {
            const newMessage = undefined;
            const items = [{}];

            this.reinit({
                items,
            });

            try {
                this.instance.option('items', [...items, newMessage]);
            } catch(e) {
                assert.ok(false, `error: ${e.message}`);
            } finally {
                assert.ok(true, 'there is no error');
            }
        });
    });

    QUnit.module('Items option change performance', {
        beforeEach: function() {
            const createInvalidateStub = () => {
                this.invalidateStub = sinon.stub(this.instance, '_invalidate');
            };

            this.recreateInvalidateStub = () => {
                createInvalidateStub();
            };

            createInvalidateStub();
        },
        afterEach: function() {
            this.invalidateStub.restore();
        }
    }, function() {
        QUnit.test('should run invalidate after changing user in runtime', function(assert) {
            this.instance.option({ currentUserId: 'newUserID' });

            assert.strictEqual(this.invalidateStub.callCount, 1);
        });

        QUnit.test('Message list should run invalidate if new value is empty', function(assert) {
            this.instance.option({ items: [] });

            assert.strictEqual(this.invalidateStub.callCount, 1);
        });

        QUnit.test('Message list should run invalidate if previousValue is empty and new value is empty', function(assert) {
            this.reinit({});
            this.recreateInvalidateStub();

            this.instance.option({ items: [] });

            assert.strictEqual(this.invalidateStub.callCount, 1);
        });

        QUnit.test('Message list should not run invalidate if previousValue is empty and new value has 1 item', function(assert) {
            this.reinit({});
            this.recreateInvalidateStub();

            const newMessage = {
                timestamp: NOW,
                author: userFirst,
                text: 'NEW MESSAGE',
            };

            this.instance.option({ items: [ newMessage ] });

            assert.strictEqual(this.invalidateStub.callCount, 0);
        });

        QUnit.test('Message list should not run invalidate if 1 new message has been added to items', function(assert) {
            const { items } = this.instance.option();
            const newMessage = {
                timestamp: NOW,
                author: userFirst,
                text: 'NEW MESSAGE',
            };

            this.instance.option({ items: [...items, newMessage] });

            assert.strictEqual(this.invalidateStub.callCount, 0);
        });

        QUnit.test('Message list should run invalidate if new items length is the same as current items length', function(assert) {
            const { items } = this.instance.option();

            const newItems = generateMessages(items.length);

            this.instance.option({ items: newItems });

            assert.strictEqual(this.invalidateStub.callCount, 1);
        });

        QUnit.test('Message list should run invalidate if new items length less than current items length', function(assert) {
            const { items } = this.instance.option();

            const newItems = generateMessages(items.length - 1);

            this.instance.option({ items: newItems });

            assert.strictEqual(this.invalidateStub.callCount, 1);
        });

        QUnit.test('Message list should run invalidate if more than 1 new message has been added to items', function(assert) {
            const { items } = this.instance.option();
            const newMessage = {
                timestamp: NOW,
                author: userFirst,
                text: 'NEW MESSAGE',
            };

            const newItems = [...items, newMessage, newMessage];

            this.instance.option({ items: newItems });

            assert.strictEqual(this.invalidateStub.callCount, 1);
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

                this.instance.option('items', [...items, newMessage]);
            });
        });
    });
});


