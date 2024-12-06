import $ from 'jquery';

import MessageList, { MESSAGEGROUP_TIMEOUT } from '__internal/ui/chat/messagelist';
import ScrollView from 'ui/scroll_view';
import {
    generateMessages,
    userFirst,
    userSecond,
    NOW,
    MOCK_COMPANION_USER_ID,
    MOCK_CURRENT_USER_ID,
} from './chat.tests.js';
import MessageGroup from '__internal/ui/chat/messagegroup';
import TypingIndicator from '__internal/ui/chat/typingindicator';
import devices from '__internal/core/m_devices';
import localization from 'localization';
import dateLocalization from 'common/core/localization/date';

const CHAT_MESSAGELIST_CONTENT_CLASS = 'dx-chat-messagelist-content';
const CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS = 'dx-chat-messagelist-empty-message';
const CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS = 'dx-chat-messagelist-empty-prompt';
const CHAT_MESSAGELIST_DAY_HEADER_CLASS = 'dx-chat-messagelist-day-header';

const CHAT_MESSAGEGROUP_CLASS = 'dx-chat-messagegroup';
const CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS = 'dx-chat-messagegroup-alignment-start';
const CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS = 'dx-chat-messagegroup-alignment-end';
const CHAT_LAST_MESSAGEGROUP_ALIGNMENT_START_CLASS = 'dx-chat-last-messagegroup-alignment-start';
const CHAT_LAST_MESSAGEGROUP_ALIGNMENT_END_CLASS = 'dx-chat-last-messagegroup-alignment-end';
const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
const CHAT_TYPINGINDICATOR_CLASS = 'dx-chat-typingindicator';
const SCROLLVIEW_REACHBOTTOM_INDICATOR = 'dx-scrollview-scrollbottom';
const SCROLLABLE_CONTENT = 'dx-scrollable-content';

const MS_IN_DAY = 86400000;

const getStringDate = (date) => {
    return dateLocalization.format(date, 'shortdate');
};
const SCROLLVIEW_CLASS = 'dx-scrollview';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}, selector = '#component') => {
            this.instance = new MessageList($(selector), options);
            this.$element = $(this.instance.$element());

            this.getScrollView = () => ScrollView.getInstance(this.$element.find(`.${SCROLLVIEW_CLASS}`));
            this.getDayHeaders = () => $(this.getScrollView().content()).find(`.${CHAT_MESSAGELIST_DAY_HEADER_CLASS}`);
            this.getMessageGroups = () => this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`);
            this.getBubbles = () => this.$element.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);

            this.scrollView = this.getScrollView();
            this.$scrollViewContent = $(this.scrollView.content());
        };

        this.reinit = (options, selector) => {
            this.instance.dispose();

            init(options, selector);
        };

        init();
    }
};

QUnit.module('MessageList', () => {
    QUnit.module('Render', moduleConfig, () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof MessageList);
        });

        QUnit.test('scrollable content box-sizing value should be border-box', function(assert) {
            if(devices.real().platform !== 'ios') {
                assert.ok(true, 'test does not actual other than ios');
                return;
            }
            const $scrollableContent = this.$element.find(`.${SCROLLABLE_CONTENT}`);
            const scrollBoxSizing = $scrollableContent.css('box-sizing');

            assert.strictEqual(scrollBoxSizing, 'border-box', 'scrollable content has right box-sizing value');
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

        QUnit.test('scrollView should be rendered inside root element', function(assert) {
            assert.ok(ScrollView.getInstance(this.$element.children().first()) instanceof ScrollView);
        });

        QUnit.test('Message List content should be rendered in the scrollView content', function(assert) {
            const newMessage = {
                author: { id: MOCK_CURRENT_USER_ID },
                timestamp: NOW,
                text: 'NEW MESSAGE',
            };

            this.reinit({ items: [newMessage] });

            const $messageListContent = this.$scrollViewContent.children().first();

            assert.strictEqual($messageListContent.length, 1);
            assert.strictEqual($messageListContent.hasClass(CHAT_MESSAGELIST_CONTENT_CLASS), true);
        });

        QUnit.test('Message Group should be rendered in the MessageList content', function(assert) {
            const newMessage = {
                author: { id: MOCK_CURRENT_USER_ID },
                timestamp: NOW,
                text: 'NEW MESSAGE',
            };

            this.reinit({ items: [newMessage] });

            const $messageListContent = this.$scrollViewContent.children().first();
            const $messageGroups = $messageListContent.find(`.${CHAT_MESSAGEGROUP_CLASS}`);

            assert.strictEqual($messageGroups.length, 1);
        });

        QUnit.test('Message Group should be rendered in the scrollable content after adding 1 new message', function(assert) {
            const newMessage = {
                author: { id: MOCK_CURRENT_USER_ID },
                timestamp: NOW,
                text: 'NEW MESSAGE',
            };

            this.instance.option({ items: [newMessage] });

            const $messageGroups = this.$scrollViewContent.find(`.${CHAT_MESSAGEGROUP_CLASS}`);

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

            const $messageGroups = $(this.scrollView.content()).find(`.${CHAT_MESSAGEGROUP_CLASS}`);

            assert.strictEqual($messageGroups.length, 27);
        });

        QUnit.test('Message Group should be rendered in the scrollable content after updating items at runtime', function(assert) {
            this.instance.option({ items: generateMessages(52) });

            const scrollableContent = this.getScrollView().content();
            const $messageGroups = $(scrollableContent).find(`.${CHAT_MESSAGEGROUP_CLASS}`);

            assert.strictEqual($messageGroups.length, 26);
        });

        [
            {
                date: new Date(),
                scenario: 'today\'s date',
                expectedDatePrefix: 'Today ',
            },
            {
                date: new Date(Date.now() - MS_IN_DAY),
                scenario: 'yesterday\'s date',
                expectedDatePrefix: 'Yesterday ',
            },
            {
                date: new Date(Date.now() - 2 * MS_IN_DAY),
                scenario: 'some older date',
                expectedDatePrefix: '',
            },
        ].forEach(({ date, scenario, expectedDatePrefix }) => {
            QUnit.test(`Day header should be rendered (message date is ${scenario}, on init)`, function(assert) {
                const expectedText = `${expectedDatePrefix}${getStringDate(date)}`;

                this.reinit({ items: [{ timestamp: date, text: 'ABC' }] });

                const $dayHeaders = this.getDayHeaders();

                assert.strictEqual($dayHeaders.length, 1, 'day header was added');
                assert.strictEqual($dayHeaders.text(), expectedText, 'day header text is correct');
            });

            QUnit.test(`Day header should be rendered (message date is ${scenario}, on runtime)`, function(assert) {
                const expectedText = `${expectedDatePrefix}${getStringDate(date)}`;

                this.instance.option({ items: [{ timestamp: date, text: 'ABC' }] });

                const $dayHeaders = this.getDayHeaders();

                assert.strictEqual($dayHeaders.length, 1, 'day header was added');
                assert.strictEqual($dayHeaders.text(), expectedText, 'day header text is correct');
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

                const $dayHeaders = this.getDayHeaders();

                assert.strictEqual($dayHeaders.length, 0, 'day header was not added');
            });
        });


        QUnit.test('Day headers should be\'removed on runtime showDayHeaders disable', function(assert) {
            const now = new Date().getTime();

            this.reinit({
                items: [{ timestamp: now - MS_IN_DAY, text: 'ABC' }, { timestamp: now, text: 'CBA' }],
                showDayHeaders: true,
            });

            this.instance.option({ showDayHeaders: false });

            const $dayHeaders = this.getDayHeaders();

            assert.strictEqual($dayHeaders.length, 0, 'day headers were removed');
        });

        QUnit.test('Day headers should be added on runtime showDayHeaders enable', function(assert) {
            const now = new Date().getTime();

            this.reinit({
                items: [{ timestamp: now - MS_IN_DAY, text: 'ABC' }, { timestamp: now, text: 'CBA' }],
                showDayHeaders: false,
            });

            this.instance.option({ showDayHeaders: true });

            const $dayHeaders = this.getDayHeaders();

            assert.strictEqual($dayHeaders.length, 2, 'day headers were added');
        });

        [
            {
                oldItemTimestamp: new Date().getTime() - MS_IN_DAY,
                newItemTimestamp: new Date().getTime(),
                scenario: 'items have different date',
                expectedDayHeadersCount: 2,
            },
            {
                oldItemTimestamp: new Date().getTime(),
                newItemTimestamp: new Date().getTime(),
                scenario: 'items have the same date',
                expectedDayHeadersCount: 1,
            },
            {
                oldItemTimestamp: undefined,
                newItemTimestamp: new Date().getTime(),
                scenario: 'first item has undefined date',
                expectedDayHeadersCount: 1,
            },
            {
                oldItemTimestamp: new Date().getTime(),
                newItemTimestamp: 'invalid',
                scenario: 'second item has an invalid date',
                expectedDayHeadersCount: 1,
            },
            {
                oldItemTimestamp: undefined,
                newItemTimestamp: undefined,
                scenario: 'dates are not defined for both items',
                expectedDayHeadersCount: 0,
            },
        ].forEach(({ oldItemTimestamp, newItemTimestamp, scenario, expectedDayHeadersCount }) => {
            QUnit.test(`It should be ${expectedDayHeadersCount} day headers when add second item on runtime (${scenario})`, function(assert) {
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

                const $dayHeaders = this.getDayHeaders();

                assert.strictEqual($dayHeaders.length, expectedDayHeadersCount, 'day headers count is correct');
            });
        });

        QUnit.test('Current message group should be rendered before day header is added', function(assert) {
            this.reinit({
                items: [{
                    text: 'ABC',
                }, {
                    timestamp: new Date('11.10.2024'),
                    text: 'EFG',
                }]
            });

            const $scrollableContent = $(this.getScrollView().content()).children().first();
            const $firstChild = $scrollableContent.children().first();

            assert.strictEqual($firstChild.hasClass(CHAT_MESSAGEGROUP_CLASS), true, 'first message group is added before day header');
        });

        QUnit.test('Only one day header should be added when there are two messages with the same date and undefined date between them (last day header was added for message in current messageGroup)', function(assert) {
            this.reinit({
                items: [{
                    timestamp: new Date('11.10.2024'),
                    author: { id: 1 },
                    text: 'ABC',
                }, {
                    author: { id: 2 },
                    text: 'EFG',
                }, {
                    timestamp: new Date('11.10.2024'),
                    author: { id: 1 },
                    text: 'HIJ',
                }],
            });

            const $dayHeaders = this.getDayHeaders();

            assert.strictEqual($dayHeaders.length, 1, 'only one day header was added');
        });

        QUnit.test('Only one day header should be added when there are two messages with the same date and and undefined date between them (last day header was added for message in older messageGroup)', function(assert) {
            this.reinit({
                items: [{
                    timestamp: new Date('11.10.2024'),
                    text: 'ABC',
                }, {
                    text: 'EFG',
                }, {
                    timestamp: new Date('11.10.2024'),
                    text: 'HIJ',
                }],
            });

            const $dayHeaders = this.getDayHeaders();

            assert.strictEqual($dayHeaders.length, 1, 'only one day header was added');
        });

        QUnit.test('Day header should not dissapear after component invalidate', function(assert) {
            const items = [{
                timestamp: new Date('11.10.2024'),
                text: 'ABC',
            }];

            this.reinit({
                items,
            });

            let $dayHeaders = this.getDayHeaders();

            assert.strictEqual($dayHeaders.length, 1, 'day header was added');

            this.instance.option({ items });

            $dayHeaders = this.getDayHeaders();

            assert.strictEqual($dayHeaders.length, 1, 'day header is not removed after invalidate');
        });

        QUnit.test('loading indicator should be hidden if isLoading is set to false', function(assert) {
            this.reinit({
                items: [],
                isLoading: false
            });

            const $indicator = this.$element.find(`.${SCROLLVIEW_REACHBOTTOM_INDICATOR}`);
            assert.strictEqual($indicator.is(':visible'), false);
        });

        QUnit.test('loading indicator should be shown if isLoading is set to true', function(assert) {
            this.reinit({
                items: [],
                isLoading: true
            });

            const $indicator = this.$element.find(`.${SCROLLVIEW_REACHBOTTOM_INDICATOR}`);
            assert.strictEqual($indicator.is(':visible'), true);
        });

        QUnit.test('loading indicator should be hidden if isLoading is set to false and items is not empty', function(assert) {
            this.reinit({
                items: [
                    { author: { id: 'UserID' } },
                ],
                isLoading: false
            });

            const $indicator = this.$element.find(`.${SCROLLVIEW_REACHBOTTOM_INDICATOR}`);
            assert.strictEqual($indicator.is(':visible'), false);
        });

        QUnit.test('loading indicator should be shown if isLoading is set to true and items is not empty', function(assert) {
            this.reinit({
                items: [
                    { author: { id: 'UserID' } },
                ],
                isLoading: true
            });

            const $indicator = this.$element.find(`.${SCROLLVIEW_REACHBOTTOM_INDICATOR}`);
            assert.strictEqual($indicator.is(':visible'), true);
        });

        QUnit.test('loading indicator should be change visibility after change isLoading option value at runtime', function(assert) {
            this.reinit({
                items: [
                    { author: { id: 'UserID' } },
                ],
                isLoading: true
            });

            this.instance.option('isLoading', false);

            const $indicator = this.$element.find(`.${SCROLLVIEW_REACHBOTTOM_INDICATOR}`);
            assert.strictEqual($indicator.is(':visible'), false, 'loadindicator is not visible');

            this.instance.option('isLoading', true);

            assert.strictEqual($indicator.is(':visible'), true, 'loadindicator is visible');
        });
    });

    QUnit.module('Options', () => {
        QUnit.module('dayHeaderFormat', {
            beforeEach: function() {
                this.clock = sinon.useFakeTimers(new Date('2021/10/17'));
                moduleConfig.beforeEach.apply(this, arguments);
            },
            afterEach: function() {
                this.clock.restore();
            }
        }, () => {
            [{
                getTimestamp: () => new Date(),
                scenario: 'today',
                expectedDayHeaderText: 'Today 17 of October, 2021',
            },
            {
                getTimestamp: () => new Date(Date.now() - MS_IN_DAY),
                dayHeaderPrefix: 'Yesterday ',
                scenario: 'yesterday',
                expectedDayHeaderText: 'Yesterday 16 of October, 2021',
            }, {
                getTimestamp: () => new Date('10.10.2024'),
                dayHeaderPrefix: '',
                scenario: '10.10.2024',
                expectedDayHeaderText: '10 of October, 2024',
            }].forEach(({ getTimestamp, scenario, expectedDayHeaderText }) => {
                QUnit.test(`Day header should be formatted when dayHeaderFormat is specified on init (timestamp=${scenario})`, function(assert) {
                    const items = [{
                        timestamp: getTimestamp(),
                        text: 'A',
                    }];

                    this.reinit({
                        items,
                        dayHeaderFormat: 'dd of MMMM, yyyy',
                    });

                    const $dayHeaders = this.getDayHeaders();

                    assert.strictEqual($dayHeaders.text(), expectedDayHeaderText, 'day header has formatted text');
                });

                QUnit.test(`Day header should be formatted when dayHeaderFormat is specified at runtime (timestamp=${scenario})`, function(assert) {
                    const items = [{
                        timestamp: getTimestamp(),
                        text: 'A',
                    }];

                    this.reinit({
                        items,
                    });

                    this.instance.option('dayHeaderFormat', 'dd of MMMM, yyyy');

                    const $dayHeaders = this.getDayHeaders();

                    assert.strictEqual($dayHeaders.text(), expectedDayHeaderText, 'day header has formatted text');
                });
            });
        });
    });

    QUnit.module('MessageGroup integration', moduleConfig, () => {
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

        ['showAvatar', 'showUserName', 'showMessageTimestamp'].forEach(option => {
            QUnit.test(`message list should pass option ${option} to message group`, function(assert) {
                this.reinit({
                    items: [{ author: { id: 'MikeID' } }],
                    [option]: true,
                });

                const messageGroup = MessageGroup.getInstance(this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`));

                assert.strictEqual(messageGroup.option(option), true);
            });
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

        QUnit.test('new messages should be rendered after the last group', function(assert) {
            const items = [
                {
                    timestamp: '2024-09-26T14:00:00',
                    text: 'first messagegroup',
                    author: userFirst,
                },
                {
                    timestamp: '2024-09-26T14:02:00',
                    text: 'first messagegroup',
                    author: userFirst,
                },
                {
                    timestamp: '2024-09-26T14:05:01',
                    text: 'first messagegroup',
                    author: userFirst,
                },
                {
                    timestamp: '2024-09-26T14:10:02',
                    text: 'second messagegroup',
                    author: userSecond,
                },
            ];

            this.reinit({
                items,
                showDayHeaders: false,
                currentUserId: userFirst.id,
            });

            let $messageGroups = this.getMessageGroups();

            assert.strictEqual($messageGroups.length, 2, 'correct messagegroup count');
            assert.strictEqual($messageGroups.eq(0).find(`.${CHAT_MESSAGEBUBBLE_CLASS}`).length, 3, 'correct bubble count');
            assert.strictEqual($messageGroups.eq(1).find(`.${CHAT_MESSAGEBUBBLE_CLASS}`).length, 1, 'correct bubble count');

            this.instance.option('items', [...items, {
                timestamp: '2024-09-26T14:05:05',
                text: 'message_text',
                author: userFirst,
            }]);

            $messageGroups = this.getMessageGroups();

            assert.strictEqual($messageGroups.length, 3, 'correct messagegroup count');
            assert.strictEqual($messageGroups.eq(0).find(`.${CHAT_MESSAGEBUBBLE_CLASS}`).length, 3, 'correct bubble count');
            assert.strictEqual($messageGroups.eq(1).find(`.${CHAT_MESSAGEBUBBLE_CLASS}`).length, 1, 'correct bubble count');
            assert.strictEqual($messageGroups.eq(2).find(`.${CHAT_MESSAGEBUBBLE_CLASS}`).length, 1, 'correct bubble count');
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

        QUnit.test('messageTimestampFormat should be passed to message group on init', function(assert) {
            this.reinit({
                items: [{ timestamp: '2024-09-26T14:00:00', text: 'text' }],
                messageTimestampFormat: 'hh.mm',
            });

            const messageGroup = MessageGroup.getInstance(this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`));

            assert.strictEqual(messageGroup.option('messageTimestampFormat'), 'hh.mm');
        });

        QUnit.test('messageTimestampFormat should be passed to message group at runtime', function(assert) {
            this.reinit({
                items: [{ timestamp: '2024-09-26T14:00:00', text: 'text' }],
            });

            this.instance.option('messageTimestampFormat', 'hh.mm');

            const messageGroup = MessageGroup.getInstance(this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`));

            assert.strictEqual(messageGroup.option('messageTimestampFormat'), 'hh.mm');
        });

        [{
            alignment: 'alignment-start',
            expectedGroupClass: CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS,
            expectedLastGroupClass: CHAT_LAST_MESSAGEGROUP_ALIGNMENT_START_CLASS,
        }, {
            alignment: 'alignment-end',
            expectedGroupClass: CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS,
            expectedLastGroupClass: CHAT_LAST_MESSAGEGROUP_ALIGNMENT_END_CLASS,
        }].forEach(({ alignment, expectedGroupClass, expectedLastGroupClass, author }) => {
            QUnit.test(`last message group with ${alignment} should have ${expectedLastGroupClass} class`, function(assert) {
                this.reinit({
                    items: [
                        { text: 'a', author: userFirst },
                        { text: 'b', author: userSecond },
                        { text: 'c', author: userFirst },
                        { text: 'd', author: userSecond },
                    ],
                    currentUserId: userFirst.id,
                });

                const $messageGroups = this.$element.find(`.${expectedGroupClass}`);
                const $lastGroup = this.$element.find(`.${expectedLastGroupClass}`);

                assert.strictEqual($messageGroups.last().hasClass(expectedLastGroupClass), true, 'last group has expected class');
                assert.strictEqual($lastGroup.length, 1, 'only one message group has expected class');
            });

            QUnit.test(`${expectedLastGroupClass} class should be moved to a new message group on runtime message with ${alignment} add`, function(assert) {
                this.reinit({
                    items: [
                        { text: 'a', author: userFirst },
                        { text: 'b', author: userSecond },
                    ],
                    currentUserId: userFirst.id,
                });

                let newMessage = { text: 'c', author: userFirst };

                this.instance.option({ items: [ ...this.instance.option('items'), newMessage ] });

                newMessage = { text: 'd', author: userSecond };

                this.instance.option({ items: [ ...this.instance.option('items'), newMessage ] });

                const $messageGroups = this.$element.find(`.${expectedGroupClass}`);
                const $lastGroup = this.$element.find(`.${expectedLastGroupClass}`);

                assert.strictEqual($messageGroups.last().hasClass(expectedLastGroupClass), true, 'last group has expected class');
                assert.strictEqual($lastGroup.length, 1, 'only one message group has expected class');
            });
        });

        QUnit.test('messageTemplate should be passed to messageGroup on init', function(assert) {
            const messageTemplate = () => {};

            this.reinit({
                items: [{ text: 'text' }],
                messageTemplate,
            });

            const messageGroup = MessageGroup.getInstance(this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`));

            assert.strictEqual(messageGroup.option('messageTemplate'), messageTemplate, 'messageTemplate is passed to messageGroup');
        });

        QUnit.test('messageTemplate should be passed to messageGroup at runtime', function(assert) {

            this.reinit({
                items: [{ text: 'text' }],
            });

            const messageTemplate = () => {};

            this.instance.option('messageTemplate', messageTemplate);

            const messageGroup = MessageGroup.getInstance(this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`));

            assert.strictEqual(messageGroup.option('messageTemplate'), messageTemplate, 'messageTemplate is passed to messageGroup');
        });
    });

    QUnit.module('TypingIndicator integration', moduleConfig, () => {
        QUnit.test('should be rendered if items is empty', function(assert) {
            this.reinit({
                items: [],
            });

            const $typingIndicator = this.$element.find(`.${CHAT_TYPINGINDICATOR_CLASS}`);

            assert.strictEqual($typingIndicator.length, 1);
        });

        QUnit.test('should be rendered if items is not empty', function(assert) {
            this.reinit({
                items: [{ text: 'message' }],
            });

            const $typingIndicator = this.$element.find(`.${CHAT_TYPINGINDICATOR_CLASS}`);

            assert.strictEqual($typingIndicator.length, 1);
        });

        QUnit.test('should provide typingUsers correctly', function(assert) {
            const typingUsers = [{ name: 'User 1' }];

            this.reinit({ typingUsers });

            const $typingIndicator = this.$element.find(`.${CHAT_TYPINGINDICATOR_CLASS}`);
            const typingIndicator = TypingIndicator.getInstance($typingIndicator);

            assert.deepEqual(typingIndicator.option('typingUsers'), typingUsers);
        });

        QUnit.test('should update TypingIndicator\'s typingUsers correctly', function(assert) {
            const typingUsers = [{ name: 'User 1' }];

            const $typingIndicator = this.$element.find(`.${CHAT_TYPINGINDICATOR_CLASS}`);
            const typingIndicator = TypingIndicator.getInstance($typingIndicator);

            this.instance.option({ typingUsers });

            assert.deepEqual(typingIndicator.option('typingUsers'), typingUsers);
        });
    });

    QUnit.module('Items option change', moduleConfig, () => {
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
            moduleConfig.beforeEach.apply(this, arguments);

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

        ['showAvatar', 'showUserName', 'showMessageTimestamp'].forEach(option => {
            QUnit.test(`should run invalidate after changing ${option} in runtime`, function(assert) {
                this.instance.option({ [option]: false });

                assert.strictEqual(this.invalidateStub.callCount, 1);
            });
        });
    });

    QUnit.module('ScrollView', {
        beforeEach: function() {
            moduleConfig.beforeEach.apply(this, arguments);

            this.getScrollOffsetMax = () => {
                const scrollView = this.getScrollView();
                return $(scrollView.content()).height() - $(scrollView.container()).height();
            };
            this._resizeTimeout = 40;
        },
    }, () => {
        QUnit.test('should be initialized with correct options', function(assert) {
            const expectedOptions = {
                bounceEnabled: false,
                useKeyboard: false,
                indicateLoading: false,
                reachBottomText: '',
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, this.scrollView.option(key), `${key} value is correct`);
            });
        });

        QUnit.test('should be scrolled down after init', function(assert) {
            const done = assert.async();

            this.reinit({
                width: 300,
                height: 600,
                items: generateMessages(52)
            });

            setTimeout(() => {
                const scrollTop = this.scrollView.scrollTop();

                assert.notEqual(scrollTop, 0, 'scroll position should not be 0 after initialization');
                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after initialization');
                done();
            }, this._resizeTimeout);
        });

        QUnit.test('should be scrolled down if items changed at runtime', function(assert) {
            const done = assert.async();
            this.reinit({
                width: 300,
                height: 500,
            });

            this.instance.option('items', generateMessages(52));

            setTimeout(() => {
                const scrollTop = this.getScrollView().scrollTop();

                assert.notEqual(scrollTop, 0, 'scroll position should not be 0 after items are updated at runtime');
                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after items are updated at runtime');
                done();
            });
        });

        QUnit.test('should be scrolled down if typingUsers changed at runtime if scroll position at the bottom', function(assert) {
            const done = assert.async();
            this.reinit({
                width: 300,
                height: 500,
                items: generateMessages(52),
            });

            const scrollTopBefore = this.getScrollView().scrollTop();

            assert.roughEqual(scrollTopBefore, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom before updating typingUsers');

            setTimeout(() => {
                this.instance.option({ typingUsers: [{ name: 'User' }] });

                const scrollTop = this.getScrollView().scrollTop();

                assert.notEqual(scrollTop, 0, 'scroll position should not be 0 after items are updated at runtime');
                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after typingUsers are updated at runtime');

                done();
            });
        });

        QUnit.test('should not be scroll down if typingUsers changed at runtime if scroll position not at the bottom', function(assert) {
            const done = assert.async();

            this.reinit({
                width: 300,
                height: 500,
                items: generateMessages(52),
            });

            setTimeout(() => {
                const initialScrollTop = this.getScrollOffsetMax() - 100;

                this.getScrollView().scrollTo({ top: initialScrollTop });

                setTimeout(() => {
                    const scrollTopBefore = this.getScrollView().scrollTop();

                    assert.notEqual(scrollTopBefore, this.getScrollOffsetMax(), 'scroll position should not be at the bottom before updating typingUsers');

                    this.instance.option({ typingUsers: [{ name: 'User' }] });

                    setTimeout(() => {
                        const scrollTop = this.getScrollView().scrollTop();

                        assert.roughEqual(scrollTop, scrollTopBefore, 1, 'scroll position should remain the same after updating typingUsers when not at the bottom');
                        done();
                    });
                });
            });
        });

        QUnit.test('should be scroll down if typingUsers changed at runtime, provided the content does not overflow before the typing indicator is displayed', function(assert) {
            const done = assert.async();
            this.reinit({
                width: 300,
                height: 500,
                items: generateMessages(7),
            });

            const scrollTopBefore = this.getScrollView().scrollTop();

            assert.strictEqual(scrollTopBefore, 0, 'content is not overflowing');

            setTimeout(() => {
                this.instance.option({ typingUsers: [{ name: 'User' }] });

                const scrollTop = this.getScrollView().scrollTop();

                assert.notEqual(scrollTop, 0, 'scroll position should not be 0 after items are updated at runtime');
                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after typingUsers are updated at runtime');

                done();
            });
        });

        QUnit.test('should be scrolled down if items changed at runtime with an invalidate call', function(assert) {
            const done = assert.async();
            this.reinit({
                width: 300,
                height: 500,
                items: generateMessages(52)
            });

            setTimeout(() => {
                this.instance.option('items', generateMessages(30));

                const scrollTop = this.getScrollView().scrollTop();

                assert.notEqual(scrollTop, 0, 'scroll position should not be 0 after items are updated at runtime');
                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after items are updated at runtime');

                done();
            }, this._resizeTimeout);
        });

        [MOCK_CURRENT_USER_ID, MOCK_COMPANION_USER_ID].forEach(id => {
            const isCurrentUser = id === MOCK_CURRENT_USER_ID;

            QUnit.test(`should be scrolled down after render ${isCurrentUser ? 'current user' : 'companion'} message`, function(assert) {
                const done = assert.async();
                const items = generateMessages(52);

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

                const scrollTopBefore = this.getScrollView().scrollTop();
                assert.roughEqual(scrollTopBefore, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom before render new message');

                setTimeout(() => {
                    this.instance.option('items', [...items, newMessage]);

                    setTimeout(() => {
                        const scrollTop = this.getScrollView().scrollTop();

                        assert.notEqual(scrollTop, 0, 'scroll position should not be 0 after a new message is rendered');
                        assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after rendering the new message');
                        done();
                    });
                });
            });

            QUnit.test(`should be scrolled down after render ${isCurrentUser ? 'current user' : 'companion'} message, provided the content does not overflow before the message is rendered`, function(assert) {
                const done = assert.async();
                const items = generateMessages(7);

                this.reinit({
                    width: 300,
                    height: 500,
                    items: generateMessages(7),
                });

                const author = { id };
                const newMessage = {
                    author,
                    timestamp: NOW,
                    text: 'NEW MESSAGE',
                };

                const scrollTopBefore = this.getScrollView().scrollTop();

                assert.strictEqual(scrollTopBefore, 0, 'content is not overflowing');

                setTimeout(() => {
                    this.instance.option('items', [...items, newMessage]);

                    const scrollTop = this.getScrollView().scrollTop();

                    assert.notEqual(scrollTop, 0, 'scroll position should not be 0 after a new message is rendered');
                    assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after rendering the new message');

                    done();
                });
            });
        });

        QUnit.test('should be scroll down after render current user message if scroll position not at the bottom', function(assert) {
            const done = assert.async();
            const items = generateMessages(52);

            this.reinit({
                width: 300,
                height: 500,
                items,
                currentUserId: MOCK_CURRENT_USER_ID,
            });

            const author = { id: MOCK_CURRENT_USER_ID };
            const newMessage = {
                author,
                timestamp: NOW,
                text: 'NEW MESSAGE',
            };

            setTimeout(() => {
                const initialScrollTop = this.getScrollOffsetMax() - 100;
                this.getScrollView().scrollTo({ top: initialScrollTop });

                setTimeout(() => {
                    const scrollTopBefore = this.getScrollView().scrollTop();
                    assert.roughEqual(scrollTopBefore, this.getScrollOffsetMax() - 100, 1, 'scroll position should not be at the bottom before rendering the message');

                    setTimeout(() => {
                        this.instance.option('items', [...items, newMessage]);

                        setTimeout(() => {
                            const scrollTop = this.getScrollView().scrollTop();

                            assert.notEqual(scrollTop, 0, 'scroll position should not be 0 after a new message is rendered');
                            assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after rendering the new message');
                            done();
                        });
                    });
                });
            });
        });

        QUnit.test('should not be scroll down after render companion message if scroll position not at the bottom', function(assert) {
            const done = assert.async();
            const items = generateMessages(52);

            this.reinit({
                width: 300,
                height: 500,
                items,
                currentUserId: MOCK_CURRENT_USER_ID
            });

            const author = { id: MOCK_COMPANION_USER_ID };
            const newMessage = {
                author,
                timestamp: NOW,
                text: 'NEW MESSAGE',
            };

            setTimeout(() => {
                this.getScrollView().scrollBy({ top: -100 });
                setTimeout(() => {

                    const scrollTopBefore = this.getScrollView().scrollTop();
                    assert.roughEqual(scrollTopBefore, this.getScrollOffsetMax() - 100, 1, 'scroll position should not be at the bottom before rendering the message');

                    setTimeout(() => {
                        this.instance.option('items', [...items, newMessage]);

                        const scrollTop = this.getScrollView().scrollTop();

                        assert.notEqual(scrollTop, 0, 'scroll position should not be 0 after a new message is rendered');
                        assert.roughEqual(scrollTop, scrollTopBefore, 1, 'scroll position should be at the bottom after rendering the new message');
                        done();
                    });
                });
            });
        });

        QUnit.test('should be scrolled down after showing if was initially rendered inside an invisible element', function(assert) {
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
                const scrollTop = this.getScrollView().scrollTop();

                assert.strictEqual(scrollTop, 0, 'scroll position should be 0 when the element is hidden');

                $('#qunit-fixture').css('display', 'block');

                setTimeout(() => {
                    const scrollTop = this.getScrollView().scrollTop();

                    assert.notEqual(scrollTop, 0, 'scroll position should change after the element is made visible');
                    assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after element becomes visible');

                    done();
                }, this._resizeTimeout);
            }, this._resizeTimeout);
        });

        QUnit.test('should be scrolled down after being initialized on a detached element and then attached to the DOM', function(assert) {
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
                const scrollTop = this.getScrollView().scrollTop();

                assert.strictEqual(scrollTop, 0, 'scroll position should be 0 while the element is detached');

                $messageList.appendTo('#qunit-fixture');

                setTimeout(() => {
                    const scrollTop = this.getScrollView().scrollTop();

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
                const scrollTop = this.getScrollView().scrollTop();

                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after initialization');

                this.instance.option('height', 300);

                setTimeout(() => {
                    const scrollTop = this.getScrollView().scrollTop();

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
                const scrollTop = this.getScrollView().scrollTop();

                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after initialization');

                this.instance.option('height', 700);

                setTimeout(() => {
                    const scrollTop = this.getScrollView().scrollTop();

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
                const scrollTop = this.getScrollView().scrollTop();

                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after initialization');

                this.getScrollView().scrollTo({ top: this.getScrollOffsetMax() - 200 });
                this.instance.option('height', 300);

                setTimeout(() => {
                    const scrollTop = this.getScrollView().scrollTop();

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
                const scrollTop = this.getScrollView().scrollTop();

                assert.roughEqual(scrollTop, this.getScrollOffsetMax(), 1, 'scroll position should be at the bottom after initialization');

                const newScrollTop = this.getScrollOffsetMax() - 200;
                this.getScrollView().scrollTo({ top: newScrollTop });
                this.instance.option('height', 600);

                setTimeout(() => {
                    const scrollTop = this.getScrollView().scrollTop();

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

                this.getScrollView().scrollTo({ top: newScrollTop });
                this.instance.option('height', 800);

                setTimeout(() => {
                    const scrollTop = this.getScrollView().scrollTop();

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


