import $ from 'jquery';

import Chat from 'ui/chat';
import MessageList from '__internal/ui/chat/messagelist';
import AlertList from '__internal/ui/chat/alertlist';
import MessageBox, { TYPING_END_DELAY } from '__internal/ui/chat/messagebox';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';
import dataUtils from 'core/element_data';

import { isRenderer } from 'core/utils/type';

import config from 'core/config';
import ArrayStore from 'common/data/array_store';

const CHAT_MESSAGEGROUP_CLASS = 'dx-chat-messagegroup';
const CHAT_MESSAGELIST_CLASS = 'dx-chat-messagelist';
const CHAT_ALERTLIST_CLASS = 'dx-chat-alertlist';
const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
const CHAT_MESSAGEBUBBLE_CONTENT_CLASS = 'dx-chat-messagebubble-content';
const CHAT_MESSAGEBOX_CLASS = 'dx-chat-messagebox';
const CHAT_MESSAGEBOX_BUTTON_CLASS = 'dx-chat-messagebox-button';
const CHAT_MESSAGEBOX_TEXTAREA_CLASS = 'dx-chat-messagebox-textarea';
const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';
const SCROLLVIEW_REACHBOTTOM_INDICATOR = 'dx-scrollview-scrollbottom';
const CHAT_MESSAGELIST_DAY_HEADER_CLASS = 'dx-chat-messagelist-day-header';

const CHAT_LAST_MESSAGEGROUP_ALIGNMENT_START_CLASS = 'dx-chat-last-messagegroup-alignment-start';
const CHAT_LAST_MESSAGEGROUP_ALIGNMENT_END_CLASS = 'dx-chat-last-messagegroup-alignment-end';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

export const MOCK_COMPANION_USER_ID = 'COMPANION_USER_ID';
export const MOCK_CURRENT_USER_ID = 'CURRENT_USER_ID';
export const NOW = 1721747399083;

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
        const init = (options = {}) => {
            this.instance = new Chat($('#component'), options);
            this.$element = $(this.instance.$element());

            this.$textArea = this.$element.find(`.${CHAT_MESSAGEBOX_TEXTAREA_CLASS}`);
            this.$input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

            this.$sendButton = this.$element.find(`.${CHAT_MESSAGEBOX_BUTTON_CLASS}`);
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        this.getEmptyView = () => {
            return this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`);
        };

        this.getMessageList = () => MessageList.getInstance(this.$element.find(`.${CHAT_MESSAGELIST_CLASS}`));
        this.getMessageGroups = () => this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`);
        this.getDayHeaders = () => this.$element.find(`.${CHAT_MESSAGELIST_DAY_HEADER_CLASS}`);
        this.getBubbles = () => this.$element.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);
        this.getBubblesContents = () => this.$element.find(`.${CHAT_MESSAGEBUBBLE_CONTENT_CLASS}`);

        init();
    }
};

QUnit.module('Chat', () => {
    QUnit.module('Render', moduleConfig, () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof Chat);
        });
    });

    QUnit.module('Default options', moduleConfig, () => {
        QUnit.test('user should be set to an object with generated id if property is not passed', function(assert) {
            const { user } = this.instance.option();

            // eslint-disable-next-line no-prototype-builtins
            assert.strictEqual(user.hasOwnProperty('id'), true);
        });

        QUnit.test('User id should be generated as a string if user has not been set', function(assert) {
            assert.strictEqual(typeof this.instance.option('user.id') === 'string', true);
        });
    });

    QUnit.module('MessageList integration', moduleConfig, () => {
        QUnit.test('passed currentUserId should be equal generated chat.user.id', function(assert) {
            const messageList = this.getMessageList();

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

            const messageList = this.getMessageList();

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

            const messageList = this.getMessageList();

            assert.deepEqual(messageList.option('currentUserId'), newUserID, 'currentUserId value is updated');
        });

        QUnit.test('typingUsers should be passed to messageList', function(assert) {
            const typingUsers = [
                { name: 'Mike' },
                { name: 'John' },
            ];

            this.reinit({ typingUsers });

            const messageList = this.getMessageList();

            assert.deepEqual(messageList.option('typingUsers'), typingUsers, 'typingUsers value is passed correctly');
        });

        QUnit.test('typingUsers should be passed correctly to messageList after update', function(assert) {
            const typingUsers = [
                { name: 'Mike' },
                { name: 'John' },
            ];

            this.reinit({ typingUsers });

            const newTypingUsers = [
                { name: 'Alice' },
                { name: 'James' },
            ];

            this.instance.option({ typingUsers: newTypingUsers });

            const messageList = this.getMessageList();

            assert.deepEqual(messageList.option('typingUsers'), newTypingUsers, 'typingUsers value is updated');
        });

        QUnit.test('items should be passed to messageList after update', function(assert) {
            const newItems = [{ author: { name: 'Mike' } }, { author: { name: 'John' } }];

            this.instance.option('items', newItems);

            const messageList = this.getMessageList();

            assert.deepEqual(messageList.option('items'), newItems, 'items value is updated');
        });

        ['showDayHeaders', 'showAvatar', 'showUserName', 'showMessageTimestamp'].forEach(option => {
            QUnit.test(`Chat should pass ${option} to messageList on init`, function(assert) {
                this.reinit({
                    [option]: false,
                });

                const messageList = this.getMessageList();

                assert.strictEqual(messageList.option(option), false, `${option} is passed on init`);
            });

            QUnit.test(`Chat should pass ${option} to messageList at runtime`, function(assert) {
                this.reinit({
                    [option]: true,
                });

                const messageList = this.getMessageList();

                this.instance.option(option, false);

                assert.strictEqual(messageList.option(option), false, `${option} is passed on runtime`);
            });

            QUnit.test(`Chat should pass ${option} with value undefined to messageList as false on init`, function(assert) {
                this.reinit({
                    [option]: undefined,
                });

                const messageList = this.getMessageList();

                assert.strictEqual(messageList.option(option), false, `${option} with value undefined is passed as false on init`);
            });

            QUnit.test(`Chat should pass ${option} with value undefined to messageList as false on runtime`, function(assert) {
                this.reinit({
                    [option]: true,
                });

                this.instance.option(option, undefined);

                const messageList = this.getMessageList();

                assert.strictEqual(messageList.option(option), false, `${option} with value undefined is passed as false on runtime`);
            });
        });

        QUnit.module('messageTemplate', () => {
            QUnit.test('messageTemplate should set bubble content on init', function(assert) {
                const messageTemplate = (data, container) => {
                    $('<h1>').text(`text: ${data.message.text}`).appendTo(container);
                };

                this.reinit({
                    items: [{ text: 'CustomText' }],
                    messageTemplate,
                });

                const $bubbleContent = this.getBubblesContents();

                assert.strictEqual($bubbleContent.text(), 'text: CustomText');
            });

            QUnit.test('messageTemplate should set bubble content at runtime', function(assert) {
                const messageTemplate = (data, container) => {
                    $('<h1>').text(`text: ${data.message.text}`).appendTo(container);
                };

                this.reinit({
                    items: [{ text: 'CustomText' }]
                });

                this.instance.option('messageTemplate', messageTemplate);

                const $bubbleContent = this.getBubbles();

                assert.strictEqual($bubbleContent.text(), 'text: CustomText');
            });

            QUnit.test('messageTemplate function should have correct parameters', function(assert) {
                assert.expect(2);

                const message = {
                    timestamp: 1234567,
                    text: 'message text',
                    author: { name: 'UserName', id: 'UserID' },
                };

                const messageTemplate = (data) => {
                    assert.strictEqual(data.component instanceof Chat, true, 'component is passed');
                    assert.deepEqual(data.message, message, 'message parameter is passed');
                };

                this.reinit({
                    items: [message],
                    messageTemplate,
                });
            });

            QUnit.test('messageTemplate should set bubble content on runtime message add', function(assert) {
                const messageTemplate = (data, container) => {
                    $('<h1>').text(`text: ${data.message.text}`).appendTo(container);
                };

                this.reinit({
                    messageTemplate,
                });

                this.instance.renderMessage({ text: 'new message' });

                const $bubbleContent = this.getBubblesContents();

                assert.strictEqual($bubbleContent.text(), 'text: new message');
            });

            QUnit.test('messageTemplate should not have excess call count', function(assert) {
                const messageTemplate = sinon.stub();

                this.reinit({
                    messageTemplate,
                    items: [
                        { text: 'a' },
                        { text: 'b' },
                    ]
                });

                assert.strictEqual(messageTemplate.callCount, 2, 'no excess renders on init');

                this.instance.renderMessage({ text: 'c' });

                assert.strictEqual(messageTemplate.callCount, 3, 'no excess renders on runtime message add');
            });

            QUnit.test('messageTemplate specified as a string text should set bubble content', function(assert) {
                this.reinit({
                    items: [{ text: 'a' }],
                    messageTemplate: 'hello',
                });

                const $bubbleContent = this.getBubblesContents();

                assert.strictEqual($bubbleContent.text(), 'hello');
            });

            QUnit.test('messageTemplate specified as a string with a html element should set bubble content', function(assert) {
                this.reinit({
                    items: [{ text: 'CustomText' }],
                    messageTemplate: '<p>p text</p>',
                });

                const $bubbleContent = this.getBubblesContents();
                const $bubbleContentChild = $bubbleContent.children();

                assert.strictEqual($bubbleContentChild.text(), 'p text', 'template text is correct');
                assert.strictEqual($bubbleContentChild.prop('tagName'), 'P', 'templte tag element is correct');
            });
        });

        QUnit.test('dayHeaderFormat option value should be passed to messageList on init', function(assert) {
            const dayHeaderFormat = 'dd of MMMM, yyyy';

            this.reinit({
                dayHeaderFormat,
            });

            const messageList = this.getMessageList();

            assert.strictEqual(messageList.option('dayHeaderFormat'), dayHeaderFormat, 'dayHeaderFormat is passed on init');
        });

        QUnit.test('messageTimestampFormat option value should be passed to messageList on init', function(assert) {
            const messageTimestampFormat = 'hh hours and mm minutes';

            this.reinit({
                messageTimestampFormat,
            });

            const messageList = this.getMessageList();

            assert.strictEqual(messageList.option('messageTimestampFormat'), messageTimestampFormat, 'messageTimestampFormat is passed on init');
        });

        QUnit.test('dayHeaderFormat option value should be passed to messageList at runtime', function(assert) {
            const dayHeaderFormat = 'dd of MMMM, yyyy';

            this.reinit({
                dayHeaderFormat: 'yyyy',
            });

            this.instance.option('dayHeaderFormat', dayHeaderFormat);

            const messageList = this.getMessageList();

            assert.strictEqual(messageList.option('dayHeaderFormat'), dayHeaderFormat, 'dayHeaderFormat is updated at runtime');
        });

        QUnit.test('messageTimestampFormat option value should be passed to messageList at runtime', function(assert) {
            const messageTimestampFormat = 'hh hours and mm minutes';

            this.reinit({
                messageTimestampFormat: 'hh',
            });

            this.instance.option('messageTimestampFormat', messageTimestampFormat);

            const messageList = this.getMessageList();

            assert.strictEqual(messageList.option('messageTimestampFormat'), messageTimestampFormat, 'messageTimestampFormat is updated at runtime');
        });
    });

    QUnit.module('AlertList integration', {
        beforeEach: function() {
            moduleConfig.beforeEach.apply(this, arguments);

            this.getAlertList = () => AlertList.getInstance(this.$element.find(`.${CHAT_ALERTLIST_CLASS}`));
        }
    }, () => {
        QUnit.test('passed alerts option value in Chat should be proxied to the Alertlist', function(assert) {
            const alerts = [{ id: 1, message: 'error' }];

            this.reinit({
                alerts
            });

            const alertList = this.getAlertList();

            const expectedOptions = {
                items: alerts,
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, alertList.option(key), `${key} value is correct`);
            });
        });

        QUnit.test('alerts should be passed to messageList after change at runtime', function(assert) {
            const newAlerts = [{ id: 1, message: 'error_1' }, { id: 2, message: 'error_2' }];

            this.instance.option('alerts', newAlerts);

            const alertList = this.getAlertList();

            assert.deepEqual(alertList.option('items'), newAlerts, 'items value is updated');
        });
    });

    QUnit.module('Events', () => {
        QUnit.module('onMessageEntered', moduleConfig, () => {
            QUnit.test('should be called when the send button was clicked', function(assert) {
                const onMessageEntered = sinon.spy();

                this.reinit({ onMessageEntered });

                keyboardMock(this.$input)
                    .focus()
                    .type('new text message');

                this.$sendButton.trigger('dxclick');

                assert.strictEqual(onMessageEntered.callCount, 1);
            });

            QUnit.test('should get correct arguments after clicking the send button', function(assert) {
                assert.expect(6);

                const text = 'new text message';

                this.instance.option({
                    onMessageEntered: ({ component, element, event, message }) => {
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
                const onMessageEntered = sinon.spy();

                this.instance.option({ onMessageEntered });

                const text = 'new text message';

                keyboardMock(this.$input)
                    .focus()
                    .type(text);

                this.$sendButton.trigger('dxclick');

                assert.strictEqual(onMessageEntered.callCount, 1);
            });

            QUnit.test('new message should not be created after clicking the send button', function(assert) {
                const text = 'new text message';

                keyboardMock(this.$input)
                    .focus()
                    .type(text);

                const numberOfMessagesBefore = this.getBubbles().length;

                this.$sendButton.trigger('dxclick');

                const numberOfMessagesAfter = this.getBubbles().length;

                assert.strictEqual(numberOfMessagesAfter, numberOfMessagesBefore);
            });

            QUnit.test('New message should be correct after clicking the send button', function(assert) {
                assert.expect(3);

                const text = 'new text message';

                this.instance.option({
                    onMessageEntered: ({ message }) => {
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

        QUnit.module('onTypingStart', moduleConfig, () => {
            QUnit.test('should be called with correct arguments', function(assert) {
                assert.expect(5);

                const currentUser = { id: 1 };

                this.reinit({
                    user: currentUser,
                    onTypingStart: ({ component, element, event, user }) => {
                        assert.strictEqual(component, this.instance, 'component field is correct');
                        assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                        assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                        assert.strictEqual(event.type, 'input', 'e.event.type is correct');
                        assert.deepEqual(user, currentUser, 'user field is correct');
                    },
                });

                keyboardMock(this.$input)
                    .focus()
                    .type('n');
            });

            QUnit.test('should be possible to change at runtime', function(assert) {
                const onTypingStart = sinon.spy();

                this.instance.option({ onTypingStart });

                keyboardMock(this.$input)
                    .focus()
                    .type('n');

                assert.strictEqual(onTypingStart.callCount, 1);
            });
        });

        QUnit.module('onTypingEnd', {
            beforeEach: function() {
                this.clock = sinon.useFakeTimers();

                moduleConfig.beforeEach.apply(this, arguments);
            },
            afterEach: function() {
                this.clock.restore();
            }
        }, () => {
            QUnit.test('should be called with correct arguments', function(assert) {
                assert.expect(4);

                const currentUser = { id: 1 };

                this.reinit({
                    user: currentUser,
                    onTypingEnd: ({ component, element, user }) => {
                        assert.strictEqual(component, this.instance, 'component field is correct');
                        assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                        assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                        assert.deepEqual(user, currentUser, 'user field is correct');
                    },
                });

                keyboardMock(this.$input)
                    .focus()
                    .type('n');

                this.clock.tick(TYPING_END_DELAY);
            });

            QUnit.test('should be possible to change at runtime', function(assert) {
                const onTypingEnd = sinon.spy();

                this.instance.option({ onTypingEnd });

                keyboardMock(this.$input)
                    .focus()
                    .type('n');

                this.clock.tick(TYPING_END_DELAY);

                assert.strictEqual(onTypingEnd.callCount, 1);
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

        QUnit.test('Message Group should be created if items was empty', function(assert) {
            this.instance.option({ items: [] });

            const author = {
                id: MOCK_CURRENT_USER_ID,
            };

            const newMessage = {
                author,
                timestamp: NOW,
                text: 'NEW MESSAGE',
            };

            assert.strictEqual(this.getMessageGroups().length, 0);

            this.instance.renderMessage(newMessage);

            assert.strictEqual(this.getMessageGroups().length, 1);
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

                const $bubbles = this.getBubbles();

                assert.strictEqual($bubbles.length, 4, 'false');
                assert.strictEqual($bubbles.last().text(), text ? text : '', 'text value is correct');
            });
        });
    });

    QUnit.module('Proxy state options', moduleConfig, () => {
        [true, false].forEach(value => {
            QUnit.test('passed state enabled options should be equal chat state enabled options', function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.reinit(options);

                const messageBox = MessageBox.getInstance(this.$element.find(`.${CHAT_MESSAGEBOX_CLASS}`));

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

                const messageBox = MessageBox.getInstance(this.$element.find(`.${CHAT_MESSAGEBOX_CLASS}`));

                Object.entries(options).forEach(([key, value]) => {
                    assert.deepEqual(value, messageBox.option(key), `${key} value is correct`);
                });
            });
        });
    });

    QUnit.module('Methods', moduleConfig, () => {
        QUnit.test('The textarea input element must be active after the focus() method is invoked', function(assert) {
            this.instance.focus();

            const root = document.querySelector('#qunit-fixture');
            const activeElement = root.shadowRoot ? root.shadowRoot.activeElement : document.activeElement;

            assert.strictEqual(activeElement, this.$input.get(0));
        });

        QUnit.test('getDataSource() should return null when dataSource is not defined', function(assert) {
            this.reinit({
                items: []
            });

            assert.strictEqual(this.instance.getDataSource(), null);
        });

        QUnit.test('getDataSource() should return the dataSource object when dataSource is passed', function(assert) {
            this.reinit({
                dataSource: [{ text: 'message_text' }]
            });

            assert.ok(this.instance.getDataSource() instanceof DataSource);
        });
    });

    QUnit.module('Data Layer Integration', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
            moduleConfig.beforeEach.apply(this, arguments);
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        QUnit.test('Should render empty view container if dataSource is empty', function(assert) {
            this.reinit({
                dataSource: {
                    store: new ArrayStore([])
                }
            });

            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`).length, 1);
        });

        QUnit.test('Should remove or render empty view container after dataSource is updated at runtime', function(assert) {
            this.instance.option('dataSource', {
                store: new ArrayStore([{}]),
            });

            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`).length, 0);

            this.instance.option('dataSource', {
                store: new ArrayStore([])
            });

            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`).length, 1);
        });

        QUnit.test('Items should synchronize with dataSource when declared as an array', function(assert) {
            const messages = [{ text: 'message_1' }, { text: 'message_2' }];
            this.reinit({
                dataSource: messages,
            });

            assert.deepEqual(this.instance.option('items'), messages);
        });

        QUnit.test('items option should be updated after calling renderMessage(newMessage)', function(assert) {
            const messages = [{ text: 'message_1' }, { text: 'message_2' }];
            this.reinit({
                items: messages,
            });

            const newMessage = { text: 'message_3' };
            this.instance.renderMessage(newMessage);

            const expectedData = [...messages, newMessage];
            assert.deepEqual(this.instance.option('items'), expectedData, 'items option should contain all messages including the new one');
            assert.deepEqual(this.instance.option('dataSource'), null, 'dataSource option should remain null');
        });

        QUnit.test('dataSource option should be updated after calling renderMessage(newMessage)', function(assert) {
            const messages = [{ text: 'message_1' }, { text: 'message_2' }];
            this.reinit({
                dataSource: [...messages],
            });

            const newMessage = { text: 'message_3' };
            this.instance.renderMessage(newMessage);

            const expectedData = [...messages, newMessage];
            assert.deepEqual(this.instance.option('items'), expectedData, 'items option should contain all messages including the new one');
            assert.deepEqual(this.instance.option('dataSource'), messages, 'dataSource option is not updated');

            this.instance.getDataSource().store().insert(newMessage);

            assert.deepEqual(this.instance.option('dataSource'), expectedData, 'dataSource option should contain all messages including the new one');
        });

        QUnit.test('Items should synchronize with DataSource store', function(assert) {
            const messages = [{ text: 'message_1' }, { text: 'message_2' }];

            this.reinit({
                dataSource: new DataSource({
                    store: new ArrayStore({
                        data: messages,
                    }),
                })
            });

            assert.deepEqual(this.instance.option('items'), messages);
        });

        QUnit.test('Items should synchronize with DataSource store after adding new message', function(assert) {
            const messages = [{ text: 'message_1' }, { text: 'message_2' }];

            this.reinit({
                dataSource: new DataSource({
                    store: new ArrayStore({
                        data: [...messages],
                    }),
                })
            });

            const newMessage = { text: 'message_3' };
            this.instance.renderMessage(newMessage);

            const expectedData = [...messages, newMessage];

            assert.deepEqual(this.instance.option('items'), expectedData);
        });

        QUnit.test('Items should synchronize with dataSource when declared as a store', function(assert) {
            const messages = [{ text: 'message_1' }, { text: 'message_2' }];
            this.reinit({
                dataSource: new ArrayStore(messages),
            });

            assert.deepEqual(this.instance.option('items'), messages);
        });

        QUnit.test('DataSource pagination is false by default', function(assert) {
            this.instance.option('dataSource', {
                store: new ArrayStore([{}]),
            });

            assert.strictEqual(this.instance.getDataSource().paginate(), false);
        });

        QUnit.test('should handle dataSource loading error', function(assert) {
            const deferred = $.Deferred();
            const messages = [{ text: 'message_1' }, { text: 'message_2' }];
            this.reinit({
                dataSource: messages
            });

            this.instance.option({
                dataSource: {
                    load() {
                        return deferred.promise();
                    }
                },
            });

            deferred.reject();

            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`).length, 1, 'empty view container was rendered on loading failure');
        });

        QUnit.test('should render all messages correctly when using an asynchronous data source', function(assert) {
            const messages = [{ text: 'message_1' }, { text: 'message_2' }];
            const timeout = 1000;

            const store = new CustomStore({
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve(messages);
                    }, timeout);
                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
            });

            const $indicator = this.$element.find(`.${SCROLLVIEW_REACHBOTTOM_INDICATOR}`);

            assert.strictEqual(this.getEmptyView().length, 0, 'Empty view should not be rendered');
            assert.strictEqual(this.getBubbles().length, 0, 'No message bubbles should be rendered initially');
            assert.strictEqual($indicator.is(':visible'), true, 'Loading indicator is visible');

            this.clock.tick(timeout / 2);

            assert.strictEqual(this.getEmptyView().length, 0, 'empty messagelist view should still be not rendered while data is loading');
            assert.strictEqual(this.getBubbles().length, 0, 'should still be no message bubbles rendered while data is loading');
            assert.strictEqual($indicator.is(':visible'), true, 'Loading indicator is visible');

            this.clock.tick(timeout / 2);

            assert.strictEqual(this.getEmptyView().length, 0, 'empty messagelist view should not be rendered when data is loaded');
            assert.strictEqual(this.getBubbles().length, 2, 'Message bubbles rendered');
            assert.strictEqual($indicator.is(':visible'), false, 'Loading indicator is hidden');
        });

        QUnit.test('new message should be rendered when using an asynchronous custom store', function(assert) {
            const messages = [{ text: 'message_1' }, { text: 'message_2' }];
            const timeout = 1000;

            const store = new CustomStore({
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([...messages]);
                    }, timeout);
                    return d.promise();
                },
                insert: function(value) {
                    const d = $.Deferred();
                    messages.push(value);

                    setTimeout(() => {
                        d.resolve();
                    }, timeout);

                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
            });

            this.clock.tick(timeout);

            const newMessage = { text: 'message_3' };
            this.instance.renderMessage(newMessage);

            this.clock.tick(timeout);

            assert.deepEqual(this.instance.option('items'), [...messages, newMessage], 'items option should contain all messages including the new one');
            assert.strictEqual(this.getBubbles().length, 3, 'new message should be rendered in list');
        });

        QUnit.test('new message should be rendered after message is entered if reloadOnChange is true', function(assert) {
            const messages = [{ text: 'message_1' }, { text: 'message_2' }];
            const timeout = 1000;

            const store = new CustomStore({
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([...messages]);
                    }, timeout);
                    return d.promise();
                },
                insert: function(message) {
                    const d = $.Deferred();
                    messages.push(message);

                    setTimeout(() => {
                        d.resolve();
                    }, timeout);

                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
                reloadOnChange: true,
            });

            this.clock.tick(timeout);

            const newMessage = { text: 'message_3' };
            keyboardMock(this.$input)
                .focus()
                .type(newMessage.text);

            this.$sendButton.trigger('dxclick');

            this.clock.tick(timeout * 2);

            assert.deepEqual(this.instance.option('items'), messages, 'items option should contain all messages including the new one');
            assert.strictEqual(this.getBubbles().length, 3, 'new message should be rendered in list');
        });

        QUnit.test('new message should be rendered when using store.push({ type: insert }) and reloadOnChange is false', function(assert) {
            const messages = [{ text: 'message_1' }, { text: 'message_2' }];
            const timeout = 1000;

            const store = new CustomStore({
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([...messages]);
                    }, timeout);
                    return d.promise();
                },
                insert: function(message) {
                    const d = $.Deferred();

                    setTimeout(() => {
                        d.resolve();
                    }, timeout);

                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
                reloadOnChange: false,
            });

            this.clock.tick(timeout);

            const newMessage = { text: 'message_3' };
            keyboardMock(this.$input)
                .focus()
                .type(newMessage.text);

            this.$sendButton.trigger('dxclick');

            store.push([{ type: 'insert', data: newMessage }]);

            this.clock.tick(timeout * 2);

            assert.deepEqual(this.instance.option('items'), [...messages, newMessage], 'items option should contain all messages including the new one');
            assert.deepEqual(this.getMessageList().option('items'), [...messages, newMessage], 'messagelist items option should contain all messages including the new one');
            assert.strictEqual(this.getBubbles().length, 3, 'new message should be rendered in list');
        });

        QUnit.test('new message should be rendered, and the empty view should be removed after adding a single message using store.push({ type: insert }) and reloadOnChange is false', function(assert) {
            const messages = [];
            const timeout = 1000;

            const store = new CustomStore({
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([...messages]);
                    }, timeout);
                    return d.promise();
                },
                insert: function(message) {
                    const d = $.Deferred();

                    setTimeout(() => {
                        d.resolve();
                    }, timeout);

                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
                reloadOnChange: false,
            });

            this.clock.tick(timeout);

            assert.strictEqual(this.getEmptyView().length, 1, 'empty view is rendered');

            const newMessage = { text: 'message_3' };
            keyboardMock(this.$input)
                .focus()
                .type(newMessage.text);

            this.$sendButton.trigger('dxclick');

            store.push([{ type: 'insert', data: newMessage }]);

            this.clock.tick(timeout * 2);

            assert.deepEqual(this.instance.option('items'), [...messages, newMessage], 'items option should contain all messages including the new one');
            assert.deepEqual(this.getMessageList().option('items'), [...messages, newMessage], 'messagelist items option should contain all messages including the new one');
            assert.strictEqual(this.getEmptyView().length, 0, 'empty view is removed');
            assert.strictEqual(this.getBubbles().length, 1, 'new message should be rendered in list');
        });

        QUnit.test('message text should be updated when using store.push({ type: "update", key: "message_id", data: { text: "new text"} })', function(assert) {
            const messages = [{ id: 1, text: 'message_1' }, { id: 2, text: 'message_2' }, { id: 3, text: 'message_3' }];
            const timeout = 100;

            const store = new CustomStore({
                key: 'id',
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([...messages]);
                    }, timeout);
                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
                reloadOnChange: false,
            });

            this.clock.tick(timeout);

            const newBubbleText = 'updated text';
            store.push([{ type: 'update', key: 2, data: { text: 'updated text' } }]);

            this.clock.tick(timeout * 2);

            const expectedData = [{ id: 1, text: 'message_1' }, { id: 2, text: newBubbleText }, { id: 3, text: 'message_3' }];

            assert.deepEqual(this.instance.option('items'), expectedData, 'items option should contain the same count of messages after update');
            assert.deepEqual(this.getMessageList().option('items'), expectedData, 'messagelist items option should contain the same count of messages after update');
            assert.strictEqual(this.getBubbles().length, 3, 'message bubble count');
            assert.strictEqual(this.getBubbles().eq(1).text(), newBubbleText, 'message bubble text was updated');

            const messageData = dataUtils.data(this.getBubbles().eq(1).get(0), 'dxMessageData');

            assert.deepEqual(messageData, { id: 2, text: newBubbleText }, 'message bubble data was updated');
        });

        QUnit.test('Message should be removed along with its group when using store.push({ type: "remove", key: "message_id" }), and the message was the last one in the group', function(assert) {
            const messages = [{ id: 1, text: 'message_1', author: userFirst }, { id: 2, text: 'message_2', author: userSecond }];
            const timeout = 100;

            const store = new CustomStore({
                key: 'id',
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([...messages]);
                    }, timeout);
                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
                reloadOnChange: false,
            });

            this.clock.tick(timeout);

            assert.strictEqual(this.getMessageGroups().length, 2, 'messagegroup count after initialization');

            store.push([{ type: 'remove', key: 2 }]);
            assert.strictEqual(this.getBubbles().length, 2, 'message bubble was removed');

            this.clock.tick(timeout * 2);

            assert.strictEqual(this.getMessageGroups().length, 1, 'messagegroup count after removing item');
            assert.deepEqual(this.instance.option('items'), [...messages.splice(0, 1)], 'items option should contain the correct messages after deletion');
            assert.deepEqual(this.getMessageList().option('items'), this.instance.option('items'), 'messagelist items option should contain the correct messages after deletion');
        });

        QUnit.test('Message should be removed when using store.push({ type: "remove", key: "message_id" })', function(assert) {
            const messages = [{ id: 1, text: 'message_1' }, { id: 2, text: 'message_2' }, { id: 3, text: 'message_3' }];
            const timeout = 100;

            const store = new CustomStore({
                key: 'id',
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([...messages]);
                    }, timeout);
                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
                reloadOnChange: false,
            });

            this.clock.tick(timeout);

            store.push([{ type: 'remove', key: 3 }]);

            this.clock.tick(timeout * 2);

            assert.deepEqual(this.instance.option('items'), [...messages.splice(0, 2)], 'items option should contain the last messages after deletion');
            assert.deepEqual(this.getMessageList().option('items'), this.instance.option('items'), 'messagelist items option should contain the last messages after deletion');
            assert.strictEqual(this.getBubbles().length, 2, 'message bubble was removed');
        });

        QUnit.test(`${CHAT_LAST_MESSAGEGROUP_ALIGNMENT_START_CLASS} class should be moved to a previous group after removing the last one from store`, function(assert) {
            const messages = [{
                id: 1,
                text: 'message_1',
                author: userFirst
            }, { id: 2,
                text: 'message_2',
                author: userSecond,
            }, {
                id: 3,
                text: 'message_3',
                author: userFirst
            }, {
                id: 4,
                text: 'message_4',
                author: userSecond,
            }];

            const timeout = 100;

            const store = new CustomStore({
                key: 'id',
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([...messages]);
                    }, timeout);
                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
                user: { id: userFirst.id },
                reloadOnChange: false,
            });

            this.clock.tick(timeout);
            store.push([{ type: 'remove', key: 4 }]);

            this.clock.tick(timeout * 2);

            const $lastMessageGroup = this.$element.find(`.${CHAT_LAST_MESSAGEGROUP_ALIGNMENT_START_CLASS}`);

            assert.strictEqual($lastMessageGroup.length, 1, 'only one message group has the corresponding class');
            assert.strictEqual($lastMessageGroup.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`).text(), 'message_2', 'message group content is correct.');
        });

        QUnit.test(`${CHAT_LAST_MESSAGEGROUP_ALIGNMENT_END_CLASS} class should move to the previous group after removing the last one from the store`, function(assert) {
            const messages = [{
                id: 1,
                text: 'message_1',
                author: userFirst
            }, { id: 2,
                text: 'message_2',
                author: userSecond,
            }, {
                id: 3,
                text: 'message_3',
                author: userFirst
            }, {
                id: 4,
                text: 'message_4',
                author: userSecond,
            }];

            const timeout = 100;

            const store = new CustomStore({
                key: 'id',
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([...messages]);
                    }, timeout);
                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
                user: { id: userFirst.id },
                reloadOnChange: false,
            });

            this.clock.tick(timeout);
            store.push([{ type: 'remove', key: 3 }]);

            this.clock.tick(timeout * 2);

            const $lastMessageGroup = this.$element.find(`.${CHAT_LAST_MESSAGEGROUP_ALIGNMENT_END_CLASS}`);

            assert.strictEqual($lastMessageGroup.length, 1, 'only one message group has the corresponding class');
            assert.strictEqual($lastMessageGroup.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`).text(), 'message_1', 'message group content is correct.');
        });

        QUnit.test('day header element should be removed after removing all groups for the current day', function(assert) {
            const messages = [{
                id: 1,
                text: 'message_1',
                timestamp: new Date('2021/10/17'),
                author: userFirst
            }, { id: 2,
                text: 'message_2',
                timestamp: new Date('2021/10/24'),
                author: userSecond,
            }, {
                id: 3,
                text: 'message_3',
                timestamp: new Date('2021/10/24'),
                author: userFirst,
            }, {
                id: 4,
                timestamp: new Date('2021/10/27'),
                text: 'message_4',
                author: userSecond,
            }];

            const timeout = 100;

            const store = new CustomStore({
                key: 'id',
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([...messages]);
                    }, timeout);
                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
                user: { id: userFirst.id },
                reloadOnChange: false,
            });

            this.clock.tick(timeout);

            store.push([{ type: 'remove', key: 3 }]);
            this.clock.tick(timeout);

            assert.strictEqual(this.getDayHeaders().length, 3, 'three day header should be present');

            store.push([{ type: 'remove', key: 2 }]);
            this.clock.tick(timeout);

            assert.strictEqual(this.getDayHeaders().length, 2, 'day header was removed');
            assert.strictEqual(this.getDayHeaders().eq(0).text(), '10/17/2021', 'day header content is correct');
            assert.strictEqual(this.getDayHeaders().eq(1).text(), '10/27/2021', 'day header content is correct');
        });

        QUnit.test('day header should be removed after the last message is deleted', function(assert) {
            const messages = [{
                id: 1,
                text: 'message_1',
                timestamp: new Date('2021/10/17'),
                author: userFirst
            }];

            const timeout = 100;

            const store = new CustomStore({
                key: 'id',
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([...messages]);
                    }, timeout);
                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
                user: { id: userFirst.id },
                reloadOnChange: false,
            });

            this.clock.tick(timeout);

            assert.strictEqual(this.getDayHeaders().length, 1, 'day header should be present');

            store.push([{ type: 'remove', key: 1 }]);
            this.clock.tick(timeout);

            assert.strictEqual(this.getDayHeaders().length, 0, 'day header was removed');
        });

        QUnit.test('emptyview should be rendered after the last message is deleted from the store', function(assert) {
            const messages = [{
                id: 1,
                text: 'message_1',
                timestamp: new Date('2021/10/17'),
                author: userFirst
            }];

            const timeout = 100;

            const store = new CustomStore({
                key: 'id',
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([...messages]);
                    }, timeout);
                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
                user: { id: userFirst.id },
                reloadOnChange: false,
            });

            this.clock.tick(timeout);

            assert.strictEqual(this.getEmptyView().length, 0, 'empty view is not rendered');

            store.push([{ type: 'remove', key: 1 }]);
            this.clock.tick(timeout * 2);

            assert.strictEqual(this.getEmptyView().length, 1, 'empty view is rendered');
        });

        QUnit.test('emptyview should be removed after the new message is added to the empty store', function(assert) {
            const timeout = 100;

            const store = new CustomStore({
                key: 'id',
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([]);
                    }, timeout);
                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
                user: { id: userFirst.id },
                reloadOnChange: false,
            });

            this.clock.tick(timeout);

            assert.strictEqual(this.getEmptyView().length, 1, 'empty view is rendered');

            store.push([{ type: 'insert', data: [{
                id: 1,
                text: 'message_1',
                timestamp: new Date('2021/10/17'),
                author: userFirst
            }] }]);
            this.clock.tick(timeout * 2);

            assert.strictEqual(this.getEmptyView().length, 0, 'empty view is removed');
        });

        QUnit.test('Loading and Empty view should not be shown at the same time when the dataSource option changes', function(assert) {
            const messages = [{ text: 'message_1' }, { text: 'message_2' }];
            const timeout = 400;

            const store = new CustomStore({
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve(messages);
                    }, timeout);
                    return d.promise();
                },
            });

            this.reinit({ dataSource: store });

            assert.strictEqual(this.getEmptyView().length, 0, 'empty view is not rendered');
            let $indicator = this.$element.find(`.${SCROLLVIEW_REACHBOTTOM_INDICATOR}`);
            assert.strictEqual($indicator.is(':visible'), true, 'loading indicator is visible');

            this.clock.tick(timeout);

            $indicator = this.$element.find(`.${SCROLLVIEW_REACHBOTTOM_INDICATOR}`);
            assert.strictEqual($indicator.is(':visible'), false, 'loading indicator is hidden');
            assert.strictEqual(this.getEmptyView().length, 0, 'empty view was removed');
        });

        QUnit.test('Loadindicator should be hidden after load a single message', function(assert) {
            const messages = [{ text: 'message_1' }];
            const timeout = 400;

            const store = new CustomStore({
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve(messages);
                    }, timeout);
                    return d.promise();
                },
            });

            this.reinit({ dataSource: store });

            assert.strictEqual(this.getEmptyView().length, 0, 'empty view is not rendered');
            let $indicator = this.$element.find(`.${SCROLLVIEW_REACHBOTTOM_INDICATOR}`);
            assert.strictEqual($indicator.is(':visible'), true, 'loading indicator is visible');

            this.clock.tick(timeout);

            $indicator = this.$element.find(`.${SCROLLVIEW_REACHBOTTOM_INDICATOR}`);
            assert.strictEqual($indicator.is(':visible'), false, 'loading indicator is hidden');
        });
    });
});
