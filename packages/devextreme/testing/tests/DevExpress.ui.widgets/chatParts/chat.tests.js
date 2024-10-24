import $ from 'jquery';

import Chat from 'ui/chat';
import MessageList from '__internal/ui/chat/messagelist';
import ErrorList from '__internal/ui/chat/errorlist';
import MessageBox, { TYPING_END_DELAY } from '__internal/ui/chat/messagebox';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { DataSource } from 'data/data_source/data_source';
import CustomStore from 'data/custom_store';

import { isRenderer } from 'core/utils/type';

import config from 'core/config';
import ArrayStore from 'data/array_store';

const CHAT_HEADER_TEXT_CLASS = 'dx-chat-header-text';
const CHAT_MESSAGEGROUP_CLASS = 'dx-chat-messagegroup';
const CHAT_MESSAGELIST_CLASS = 'dx-chat-messagelist';
const CHAT_ERRORLIST_CLASS = 'dx-chat-errorlist';
const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
const CHAT_MESSAGEBOX_CLASS = 'dx-chat-messagebox';
const CHAT_MESSAGEBOX_BUTTON_CLASS = 'dx-chat-messagebox-button';
const CHAT_MESSAGEBOX_TEXTAREA_CLASS = 'dx-chat-messagebox-textarea';
const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';
const SCROLLVIEW_REACHBOTTOM_INDICATOR = 'dx-scrollview-scrollbottom';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

const MOCK_CHAT_HEADER_TEXT = 'Chat title';

export const MOCK_COMPANION_USER_ID = 'COMPANION_USER_ID';
export const MOCK_CURRENT_USER_ID = 'CURRENT_USER_ID';
export const NOW = '1721747399083';

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

        this.getBubbles = () => {
            return this.$element.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);
        };

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

    QUnit.module('Header integration', moduleConfig, () => {
        QUnit.test('Header text element should have correct text', function(assert) {
            this.reinit({
                title: MOCK_CHAT_HEADER_TEXT
            });

            const $header = this.$element.find(`.${CHAT_HEADER_TEXT_CLASS}`);

            assert.strictEqual($header.text(), MOCK_CHAT_HEADER_TEXT);
        });

        QUnit.test('Header text element should have correct text after runtime change', function(assert) {
            this.instance.option({ title: 'new title' });

            const $header = this.$element.find(`.${CHAT_HEADER_TEXT_CLASS}`);

            assert.strictEqual($header.text(), 'new title');
        });
    });

    QUnit.module('MessageList integration', {
        beforeEach: function() {
            moduleConfig.beforeEach.apply(this, arguments);

            this.getMessageList = () => MessageList.getInstance(this.$element.find(`.${CHAT_MESSAGELIST_CLASS}`));
        }
    }, () => {
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

        QUnit.test('items should be passed to messageList after update', function(assert) {
            const newItems = [{ author: { name: 'Mike' } }, { author: { name: 'John' } }];

            this.instance.option('items', newItems);

            const messageList = this.getMessageList();

            assert.deepEqual(messageList.option('items'), newItems, 'items value is updated');
        });

        QUnit.test('Chat should pass showDayHeaders to messageList on init', function(assert) {
            this.reinit({
                showDayHeaders: false,
            });

            const messageList = this.getMessageList();

            assert.strictEqual(messageList.option('showDayHeaders'), false, 'showDayHeaders is passed on init');
        });

        QUnit.test('Chat should pass showDayHeaders to messageList at runtime', function(assert) {
            this.reinit({
                showDayHeaders: true,
            });

            const messageList = this.getMessageList();

            this.instance.option('showDayHeaders', false);

            assert.strictEqual(messageList.option('showDayHeaders'), false, 'showDayHeaders is passed on runtime');
        });
    });

    QUnit.module('ErrorList integration', {
        beforeEach: function() {
            moduleConfig.beforeEach.apply(this, arguments);

            this.getErrorList = () => ErrorList.getInstance(this.$element.find(`.${CHAT_ERRORLIST_CLASS}`));
        }
    }, () => {
        QUnit.test('passed errors option in Chat should be proxied to the Errorlist', function(assert) {
            const errors = [{ id: 1, message: 'error' }];

            this.reinit({
                errors: errors
            });

            const errorList = this.getErrorList();

            const expectedOptions = {
                items: errors,
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, errorList.option(key), `${key} value is correct`);
            });
        });

        QUnit.test('errors should be passed to messageList after change at runtime', function(assert) {
            const newErrors = [{ id: 1, message: 'error_1' }, { id: 2, message: 'error_2' }];

            this.instance.option('errors', newErrors);

            const errorList = this.getErrorList();

            assert.deepEqual(errorList.option('items'), newErrors, 'items value is updated');
        });
    });

    QUnit.module('Events', () => {
        QUnit.module('onMessageSend', moduleConfig, () => {
            QUnit.test('should be called when the send button was clicked', function(assert) {
                const onMessageSend = sinon.spy();

                this.reinit({ onMessageSend });

                keyboardMock(this.$input)
                    .focus()
                    .type('new text message');

                this.$sendButton.trigger('dxclick');

                assert.strictEqual(onMessageSend.callCount, 1);
            });

            QUnit.test('should get correct arguments after clicking the send button', function(assert) {
                assert.expect(6);

                const text = 'new text message';

                this.instance.option({
                    onMessageSend: ({ component, element, event, message }) => {
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
                const onMessageSend = sinon.spy();

                this.instance.option({ onMessageSend });

                const text = 'new text message';

                keyboardMock(this.$input)
                    .focus()
                    .type(text);

                this.$sendButton.trigger('dxclick');

                assert.strictEqual(onMessageSend.callCount, 1);
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
                    onMessageSend: ({ message }) => {
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

            const getMessageGroups = () => this.$element.find(`.${CHAT_MESSAGEGROUP_CLASS}`);

            assert.strictEqual(getMessageGroups().length, 0);

            this.instance.renderMessage(newMessage);

            assert.strictEqual(getMessageGroups().length, 1);
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
                        d.resolve(messages);
                    }, timeout);
                    return d.promise();
                },
                insert: function(values) {
                    const d = $.Deferred();

                    setTimeout(() => {
                        messages.push(values);
                        d.resolve(values);
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

            assert.deepEqual(this.instance.option('items'), messages, 'items option should contain all messages including the new one');
            assert.strictEqual(this.getBubbles().length, 3, 'new message should be rendered in list');
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
    });
});
