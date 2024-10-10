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
const CHAT_MESSAGELIST_DAY_HEADER_CLASS = 'dx-chat-messagelist-day-header';

const SCROLLABLE_CLASS = 'dx-scrollable';

const MS_IN_DAY = 86400000;

const getStringDate = (date) => {
    return date.toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).replace(/[/-]/g, '.');
};

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

        [
            {
                date: new Date(),
                scenario: 'today\'s date',
                text: 'Today ',
            },
            {
                date: new Date(Date.now() - MS_IN_DAY),
                scenario: 'yesterday\'s date',
                text: 'Yesterday ',
            },
            {
                date: new Date(Date.now() - 2 * MS_IN_DAY),
                scenario: 'some older date',
                text: '',
            },
        ].forEach(({ date, scenario, text }) => {
            QUnit.test(`Day header should be rendered (message date is ${scenario}, on init)`, function(assert) {
                const expectedText = `${text}${getStringDate(date)}`;

                this.reinit({ items: [{ timestamp: date, text: 'ABC' }] });

                const scrollableContent = this.getScrollable().content();
                const $dayHeader = $(scrollableContent).find(`.${CHAT_MESSAGELIST_DAY_HEADER_CLASS}`);

                assert.strictEqual($dayHeader.length, 1, 'day header was added');
                assert.strictEqual($dayHeader.text(), expectedText, 'day header text is correct');
            });

            QUnit.test(`Day header should be rendered (message date is ${scenario}, on runtime)`, function(assert) {
                const expectedText = `${text}${getStringDate(date)}`;

                this.instance.option({ items: [{ timestamp: date, text: 'ABC' }] });

                const scrollableContent = this.getScrollable().content();
                const $dayHeader = $(scrollableContent).find(`.${CHAT_MESSAGELIST_DAY_HEADER_CLASS}`);

                assert.strictEqual($dayHeader.length, 1, 'day header was added');
                assert.strictEqual($dayHeader.text(), expectedText, 'day header text is correct');
            });
        });

        [
            {
                date: undefined,
                scenario: 'date is undefined',
                showDayHeaders: true,
            },
            {
                date: new Date('invalid'),
                scenario: 'date is invalid',
                showDayHeaders: true,
            },
            {
                date: new Date(),
                scenario: 'showDayHeaders=false',
                showDayHeaders: false,
            },
        ].forEach(({ date, scenario, showDayHeaders }) => {
            QUnit.test(`Day header should not be rendered when ${scenario}`, function(assert) {
                this.reinit({
                    items: [{ timestamp: date, text: 'ABC' }],
                    showDayHeaders,
                });

                const scrollableContent = this.getScrollable().content();
                const $dayHeader = $(scrollableContent).find(`.${CHAT_MESSAGELIST_DAY_HEADER_CLASS}`);

                assert.strictEqual($dayHeader.length, 0, 'day header was not added');
            });
        });

        [true, false].forEach((showDayHeaders) => {
            QUnit.test(`Day headers should be ${showDayHeaders ? 'removed' : 'added'} on runtime showDayHeaders ${showDayHeaders ? 'disable' : 'enable'}`, function(assert) {
                const now = new Date().getTime();

                this.reinit({
                    items: [{ timestamp: now - MS_IN_DAY, text: 'ABC' }, { timestamp: now, text: 'CBA' }],
                    showDayHeaders,
                });

                this.instance.option({ showDayHeaders: !showDayHeaders });

                const scrollableContent = this.getScrollable().content();
                const $dayHeader = $(scrollableContent).find(`.${CHAT_MESSAGELIST_DAY_HEADER_CLASS}`);
                const expectedHeadersCount = showDayHeaders ? 0 : 2;

                assert.strictEqual($dayHeader.length, expectedHeadersCount, `day headers were ${showDayHeaders ? 'removed' : 'added'}`);
            });
        });

        [
            {
                oldItemTimestamp: new Date().getTime() - MS_IN_DAY,
                newItemTimestamp: new Date().getTime(),
                scenario: 'items have different date',
                expectedDayHeaders: 2,
            },
            {
                oldItemTimestamp: new Date().getTime(),
                newItemTimestamp: new Date().getTime(),
                scenario: 'items have the same date',
                expectedDayHeaders: 1,
            },
            {
                oldItemTimestamp: undefined,
                newItemTimestamp: new Date().getTime(),
                scenario: 'first item has undefined date',
                expectedDayHeaders: 1,
            },
            {
                oldItemTimestamp: new Date().getTime(),
                newItemTimestamp: 'invalid',
                scenario: 'second item has an invalid date',
                expectedDayHeaders: 1,
            },
            {
                oldItemTimestamp: undefined,
                newItemTimestamp: undefined,
                scenario: 'dates are not defined for both items',
                expectedDayHeaders: 0,
            },
        ].forEach(({ oldItemTimestamp, newItemTimestamp, scenario, expectedDayHeaders }) => {
            QUnit.test(`It should be ${expectedDayHeaders} day headers when add second item on runtime (${scenario})`, function(assert) {
                const items = [{
                    timestamp: oldItemTimestamp,
                    text: 'ABC'
                }];

                this.reinit({
                    items,
                });

                const newMessage = {
                    timestamp: newItemTimestamp,
                    text: 'EFG',
                };

                this.instance.option({ items: [...items, newMessage] });

                const scrollableContent = this.getScrollable().content();
                const $dayHeader = $(scrollableContent).find(`.${CHAT_MESSAGELIST_DAY_HEADER_CLASS}`);

                assert.strictEqual($dayHeader.length, expectedDayHeaders, 'day headers count is correct');
            });
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

        QUnit.test(`new message group should not be rendered if ${MESSAGEGROUP_TIMEOUT} ms elapsed between the first and new messages at runtime`, function(assert) {
            const user = { id: 1 };

            const items = [
                {
                    timestamp: '2024-09-26T14:00:00',
                    text: 'first messagegroup, 1',
                    author: user,
                },
                {
                    timestamp: '2024-09-26T14:02:00',
                    text: 'first messagegroup, 2',
                    author: user,
                },
            ];

            this.reinit({
                items,
                user,
            });

            const newMessage = {
                timestamp: '2024-09-26T14:05:02',
                text: 'first messagegroup, 3',
                author: user,
            };

            this.instance.option({ items: [ ...items, newMessage ] });

            const $messageGroups = this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`);
            const $firstMessageGroupBubbles = $messageGroups.eq(0).find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);

            assert.strictEqual($messageGroups.length, 1, 'correct messagegroup count');
            assert.strictEqual($firstMessageGroupBubbles.length, 3, 'correct bubble count');
        });

        QUnit.test(`new message group should be rendered if ${MESSAGEGROUP_TIMEOUT} ms elapsed between the last and new messages at runtime`, function(assert) {
            const user = { id: 1 };

            const items = [
                {
                    timestamp: '2024-09-26T14:00:00',
                    text: 'first messagegroup, 1',
                    author: user,
                },
                {
                    timestamp: '2024-09-26T14:02:00',
                    text: 'first messagegroup, 2',
                    author: user,
                },
            ];

            this.reinit({
                items,
                user,
            });

            const newMessage = {
                timestamp: '2024-09-26T14:07:01',
                text: 'second messagegroup, 1',
                author: user,
            };

            this.instance.option({ items: [ ...items, newMessage ] });

            const $messageGroups = this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`);
            const $firstMessageGroupBubbles = $messageGroups.eq(0).find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);
            const $secondMessageGroupBubbles = $messageGroups.eq(1).find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);

            assert.strictEqual($messageGroups.length, 2, 'correct messagegroup count');
            assert.strictEqual($firstMessageGroupBubbles.length, 2, 'correct bubble count');
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

                assert.notEqual(scrollTop, 0, 'scroll position should not be 0 after initialization');
                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after initialization');
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

                assert.notEqual(scrollTop, 0, 'scroll position should not be 0 after items are updated at runtime');
                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after items are updated at runtime');
                done();
            });
        });

        [MOCK_CURRENT_USER_ID, MOCK_COMPANION_USER_ID].forEach(id => {
            const isCurrentUser = id === MOCK_CURRENT_USER_ID;

            QUnit.test(`Scrollable should be scrolled to last message after render ${isCurrentUser ? 'current user' : 'companion'} message`, function(assert) {
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

                    assert.notEqual(scrollTop, 0, 'scroll position should not be 0 after a new message is rendered');
                    assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after rendering the new message');
                    done();
                });
            });
        });

        QUnit.test('should be scrolled to the last message after showing if was initially rendered inside an invisible element', function(assert) {
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

                assert.strictEqual(scrollTop, 0, 'scroll position should be 0 when the element is hidden');

                $('#qunit-fixture').css('display', 'block');

                setTimeout(() => {
                    const scrollTop = this.getScrollable().scrollTop();

                    assert.notEqual(scrollTop, 0, 'scroll position should change after the element is made visible');
                    assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after element becomes visible');

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

                assert.strictEqual(scrollTop, 0, 'scroll position should be 0 while the element is detached');

                $messageList.appendTo('#qunit-fixture');

                setTimeout(() => {
                    const scrollTop = this.getScrollable().scrollTop();

                    assert.notEqual(scrollTop, 0, 'scroll position should change after the element is attached to the DOM');
                    assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after attachment');

                    done();
                }, this._resizeTimeout);
            });
        });

        QUnit.test('should be scrolled to the bottom after reducing height if it\'s initially scrolled to the bottom', function(assert) {
            const done = assert.async();

            const items = generateMessages(31);

            this.reinit({
                width: 300,
                height: 500,
                items,
            });

            setTimeout(() => {
                const scrollTop = this.getScrollable().scrollTop();

                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after initialization');

                this.instance.option('height', 300);

                setTimeout(() => {
                    const scrollTop = this.getScrollable().scrollTop();

                    assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'max scroll position should be saved after reducing height');

                    done();
                }, this._resizeTimeout);
            }, this._resizeTimeout);
        });

        QUnit.test('should be scrolled to the bottom after increasing height if it\'s initially scrolled to the bottom', function(assert) {
            const done = assert.async();

            const items = generateMessages(31);

            this.reinit({
                width: 300,
                height: 500,
                items,
            });

            setTimeout(() => {
                const scrollTop = this.getScrollable().scrollTop();

                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after initialization');

                this.instance.option('height', 700);

                setTimeout(() => {
                    const scrollTop = this.getScrollable().scrollTop();

                    assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'max scroll position should be saved after increasing height');

                    done();
                }, this._resizeTimeout);
            }, this._resizeTimeout);
        });

        QUnit.test('should update visual scroll position after reducing height if it\'s not scrolled to the bottom (fix viewport bottom point)', function(assert) {
            const done = assert.async();

            const items = generateMessages(31);

            this.reinit({
                width: 300,
                height: 500,
                items,
            });

            setTimeout(() => {
                const scrollTop = this.getScrollable().scrollTop();

                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after initialization');

                this.getScrollable().scrollTo({ top: this.getScrollOffsetMax() - 200 });
                this.instance.option('height', 300);

                setTimeout(() => {
                    const scrollTop = this.getScrollable().scrollTop();

                    assert.roughEqual(scrollTop, this.getScrollOffsetMax() - 200, 1, 'scroll position should be set correctly after reducing height');

                    done();
                }, this._resizeTimeout);
            }, this._resizeTimeout);
        });

        QUnit.test('should keep visual scroll position after increasing height if it\'s not scrolled to the bottom (fix viewport top point)', function(assert) {
            const done = assert.async();

            const items = generateMessages(31);

            this.reinit({
                width: 300,
                height: 500,
                items,
            });

            setTimeout(() => {
                const scrollTop = this.getScrollable().scrollTop();

                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after initialization');

                const newScrollTop = this.getScrollOffsetMax() - 200;
                this.getScrollable().scrollTo({ top: newScrollTop });
                this.instance.option('height', 600);

                setTimeout(() => {
                    const scrollTop = this.getScrollable().scrollTop();

                    assert.roughEqual(scrollTop, newScrollTop, 1, 'scroll position should be saved correctly after increasing height');

                    done();
                }, this._resizeTimeout);
            }, this._resizeTimeout);
        });

        QUnit.test('should limit scroll position after increasing height more than scroll offset allows', function(assert) {
            const done = assert.async();

            const items = generateMessages(31);

            this.reinit({
                width: 300,
                height: 500,
                items,
            });

            setTimeout(() => {
                const newScrollTop = this.getScrollOffsetMax() - 200;

                this.getScrollable().scrollTo({ top: newScrollTop });
                this.instance.option('height', 800);

                setTimeout(() => {
                    const scrollTop = this.getScrollable().scrollTop();

                    assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1.01, 'scroll position should be limited to the max scrollable offset after increasing height');

                    done();
                }, this._resizeTimeout);
            }, this._resizeTimeout);
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


