import $ from 'jquery';

import MessageList, { MESSAGEGROUP_TIMEOUT } from '__internal/ui/chat/messagelist';
import Scrollable from 'ui/scroll_view/ui.scrollable';
import {
    generateMessages,
    userFirst,
    NOW,
    MOCK_COMPANION_USER_ID,
    MOCK_CURRENT_USER_ID,
} from './chat.tests.js';
import MessageGroup from '__internal/ui/chat/messagegroup';
import localization from 'localization';

const CHAT_MESSAGEGROUP_CLASS = 'dx-chat-messagegroup';
const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';

const CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS = 'dx-chat-messagelist-empty-message';
const CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS = 'dx-chat-messagelist-empty-prompt';

const SCROLLABLE_CLASS = 'dx-scrollable';


const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="messageList"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}, selector = '#messageList') => {
            this.instance = new MessageList($(selector), options);
            this.$element = $(this.instance.$element());

            this.getScrollable = () => Scrollable.getInstance(this.$element.find(`.${SCROLLABLE_CLASS}`));

            this.scrollable = this.getScrollable();
        };

        this.reinit = (options, selector) => {
            this.instance.dispose();

            init(options, selector);
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
                const $bubbles = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);

                assert.strictEqual($bubbles.length, 3);
            }
        });

        QUnit.test('scrollable should be rendered inside root element', function(assert) {
            assert.ok(Scrollable.getInstance(this.$element.children().first()) instanceof Scrollable);
        });

        QUnit.test('Message Group should be rendered in the scrollable content', function(assert) {
            const newMessage = {
                author: { id: MOCK_CURRENT_USER_ID },
                timestamp: NOW,
                text: 'NEW MESSAGE',
            };

            this.reinit({ items: [newMessage] });

            const $messageGroups = $(this.scrollable.content()).find(`.${CHAT_MESSAGEGROUP_CLASS}`);

            assert.strictEqual($messageGroups.length, 1);
        });

        QUnit.test('Message Group should be rendered in the scrollable content after adding 1 new message', function(assert) {
            const newMessage = {
                author: { id: MOCK_CURRENT_USER_ID },
                timestamp: NOW,
                text: 'NEW MESSAGE',
            };

            this.instance.option({ items: [newMessage] });

            const $messageGroups = $(this.scrollable.content()).find(`.${CHAT_MESSAGEGROUP_CLASS}`);

            assert.strictEqual($messageGroups.length, 1);
        });

        QUnit.test('Message Group should be rendered in the scrollable content after adding 1 new message to items', function(assert) {
            const items = generateMessages(52);

            this.reinit({ items });

            const newMessage = {
                author: { id: 'another user' },
                timestamp: NOW,
                text: 'NEW MESSAGE',
            };

            this.instance.option({ items: [...items, newMessage] });

            const $messageGroups = $(this.scrollable.content()).find(`.${CHAT_MESSAGEGROUP_CLASS}`);

            assert.strictEqual($messageGroups.length, 27);
        });

        QUnit.test('Message Group should be rendered in the scrollable content after updating items at runtime', function(assert) {
            this.instance.option({ items: generateMessages(52) });

            const scrollableContent = this.getScrollable().content();
            const $messageGroups = $(scrollableContent).find(`.${CHAT_MESSAGEGROUP_CLASS}`);

            assert.strictEqual($messageGroups.length, 26);
        });
    });

    QUnit.module('MessageGroup integration', () => {
        QUnit.test('message group component should not be rendered if items is empty', function(assert) {
            const $messageGroups = this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`);

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

            const $messageGroups = this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`);

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

            const $messageGroups = this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`);

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

            const $messageGroups = this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`);

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

            const $messageGroups = this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`);

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

            const $bubbles = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);

            assert.strictEqual($bubbles.length, 1);
        });

        QUnit.test('message group should be rendered with start alignment if user.id is not equal message.author.id', function(assert) {
            this.reinit({
                items: [{ author: { id: 'JohnID' } }],
                currentUserId: 'MikeID',
            });

            const messageGroup = MessageGroup.getInstance(this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`));

            assert.strictEqual(messageGroup.option('alignment'), 'start');
        });

        QUnit.test('message group should be rendered with end alignment if user.id is equal message.author.id', function(assert) {
            this.reinit({
                items: [{ author: { id: 'MikeID' } }],
                currentUserId: 'MikeID',
            });

            const messageGroup = MessageGroup.getInstance(this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`));

            assert.strictEqual(messageGroup.option('alignment'), 'end');
        });

        QUnit.test(`new message group should be rendered if ${MESSAGEGROUP_TIMEOUT} ms elapsed between the last and new messages`, function(assert) {
            const items = [
                {
                    timestamp: '2024-09-26T14:00:00',
                    text: 'first messagegroup',
                },
                {
                    timestamp: '2024-09-26T14:02:00',
                    text: 'first messagegroup',
                },
                {
                    timestamp: '2024-09-26T14:05:01',
                    text: 'first messagegroup',
                },
                {
                    timestamp: '2024-09-26T14:10:02',
                    text: 'second messagegroup',
                },
            ];

            this.reinit({
                items,
            });

            const $messageGroups = this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`);
            const $firstMessageGroupBubbles = $messageGroups.eq(0).find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);
            const $secondMessageGroupBubbles = $messageGroups.eq(1).find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);

            assert.strictEqual($messageGroups.length, 2, 'correct messagegroup count');
            assert.strictEqual($firstMessageGroupBubbles.length, 3, 'correct bubble count');
            assert.strictEqual($secondMessageGroupBubbles.length, 1, 'correct bubble count');
        });

        QUnit.test(`new message group should be rendered if ${MESSAGEGROUP_TIMEOUT} ms elapsed between the last and new messages at runtime`, function(assert) {
            const items = [
                {
                    timestamp: '2024-09-26T14:00:00',
                    text: 'first messagegroup',
                },
                {
                    timestamp: '2024-09-26T14:02:00',
                    text: 'first messagegroup',
                },
                {
                    timestamp: '2024-09-26T14:05:01',
                    text: 'first messagegroup',
                },
            ];

            this.reinit({
                items,
            });

            const newMessage = {
                timestamp: '2024-09-26T14:10:02',
                text: 'second messagegroup',
            };

            this.instance.option({ items: [ ...items, newMessage ] });

            const $messageGroups = this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`);
            const $firstMessageGroupBubbles = $messageGroups.eq(0).find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);
            const $secondMessageGroupBubbles = $messageGroups.eq(1).find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);

            assert.strictEqual($messageGroups.length, 2, 'correct messagegroup count');
            assert.strictEqual($firstMessageGroupBubbles.length, 3, 'correct bubble count');
            assert.strictEqual($secondMessageGroupBubbles.length, 1, 'correct bubble count');
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

    QUnit.module('Scrollable', {
        beforeEach: function() {
            this.getScrollOffsetMax = () => {
                const scrollable = this.getScrollable();
                return $(scrollable.content()).height() - $(scrollable.container()).height();
            };
            this._resizeTimeout = 40;
        },
    }, () => {
        QUnit.test('should be initialized with correct options', function(assert) {
            const expectedOptions = {
                bounceEnabled: false,
                useKeyboard: false,
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, this.scrollable.option(key), `${key} value is correct`);
            });
        });

        QUnit.test('should be scrolled to last message after init', function(assert) {
            const done = assert.async();

            this.reinit({
                width: 300,
                height: 600,
                items: generateMessages(52)
            });

            setTimeout(() => {
                const scrollTop = this.scrollable.scrollTop();

                assert.notEqual(scrollTop, 0);
                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1);
                done();
            }, this._resizeTimeout);
        });

        QUnit.test('should be scrolled to last message if items changed at runtime', function(assert) {
            const done = assert.async();
            this.reinit({
                width: 300,
                height: 500,
            });

            this.instance.option('items', generateMessages(52));

            setTimeout(() => {
                const scrollTop = this.getScrollable().scrollTop();

                assert.notEqual(scrollTop, 0);
                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1);
                done();
            });
        });

        [MOCK_CURRENT_USER_ID, MOCK_COMPANION_USER_ID].forEach(id => {
            const isCurrentUser = id === MOCK_CURRENT_USER_ID;
            const textName = `Scrollable should be scrolled to last message after render ${isCurrentUser ? 'current user' : 'companion'} message`;

            QUnit.test(textName, function(assert) {
                const done = assert.async();
                assert.expect(2);
                const items = generateMessages(31);

                this.reinit({
                    width: 300,
                    height: 500,
                    items
                });

                const author = { id };
                const newMessage = {
                    author,
                    timestamp: NOW,
                    text: 'NEW MESSAGE',
                };

                this.instance.option('items', [...items, newMessage]);

                setTimeout(() => {
                    const scrollTop = this.getScrollable().scrollTop();

                    assert.notEqual(scrollTop, 0);
                    assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1);
                    done();
                });
            });
        });

        QUnit.test('should be scrolled to the last message after being rendered inside an invisible element and display correctly when shown', function(assert) {
            const done = assert.async();
            $('#qunit-fixture').css('display', 'none');

            const items = generateMessages(31);

            this.reinit({
                width: 300,
                height: 500,
                items
            });

            this.$element.css('height', 400);

            setTimeout(() => {
                const scrollTop = this.getScrollable().scrollTop();

                assert.strictEqual(scrollTop, 0);

                $('#qunit-fixture').css('display', 'block');

                setTimeout(() => {
                    const scrollTop = this.getScrollable().scrollTop();

                    assert.notEqual(scrollTop, 0);
                    assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1);

                    done();
                }, this._resizeTimeout);
            }, this._resizeTimeout);
        });

        QUnit.test('should be scrolled to the last message after being initialized on a detached element and then attached to the DOM', function(assert) {
            const done = assert.async();
            const $messageList = $('<div id="messageListDetached">');

            const items = generateMessages(31);

            this.$element = $(new MessageList($messageList.get(0), {
                items,
                width: 300,
                height: 500,
            }).$element());

            this.$element.css('height', 400);

            setTimeout(() => {
                const scrollTop = this.getScrollable().scrollTop();

                assert.strictEqual(scrollTop, 0);

                $messageList.appendTo('#qunit-fixture');

                setTimeout(() => {
                    const scrollTop = this.getScrollable().scrollTop();

                    assert.notEqual(scrollTop, 0);
                    assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1);

                    done();
                }, this._resizeTimeout);
            });
        });
    });

    QUnit.module('localization', moduleConfig, () => {
        QUnit.test('message, prompt texts should be equal custom localized values from the dictionary', function(assert) {
            const defaultLocale = localization.locale();

            const localizedEmptyListMessageText = '空のテキスト';
            const localizedEmptyListPromptText = '空のプロンプト';

            try {
                localization.loadMessages({
                    'ja': {
                        'dxChat-emptyListMessage': localizedEmptyListMessageText,
                        'dxChat-emptyListPrompt': localizedEmptyListPromptText
                    }
                });
                localization.locale('ja');

                this.reinit();

                assert.strictEqual(this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS}`).text(), localizedEmptyListMessageText, 'emptyListMessage');
                assert.strictEqual(this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS}`).text(), localizedEmptyListPromptText, 'emptyListPrompt');
            } finally {
                localization.locale(defaultLocale);
            }
        });
    });
});


