import $ from 'jquery';

import Chat from 'ui/chat';
import MessageList, {
    CHAT_MESSAGELIST_CONTEXT_MENU_CLASS
} from '__internal/ui/chat/messagelist';
import ContextMenu, {
    DX_MENU_ITEM_CLASS,
} from '__internal/ui/context_menu/context_menu';
import {
    FOCUSED_STATE_CLASS,
    WIDGET_CLASS,
} from '__internal/core/widget/widget';
import AlertList from '__internal/ui/chat/alertlist';
import MessageBox, {
    TYPING_END_DELAY,
    CHAT_MESSAGEBOX_CLASS,
    CHAT_MESSAGEBOX_BUTTON_CLASS,
    CHAT_MESSAGEBOX_TEXTAREA_CLASS,
} from '__internal/ui/chat/messagebox';
import keyboardMock from '../../../helpers/keyboardMock.js';
import pointerMock from '../../../helpers/pointerMock.js';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';
import dataUtils from 'core/element_data';
import fx from 'common/core/animation/fx';

import { isRenderer } from 'core/utils/type';

import config from 'core/config';
import localization from 'localization';
import ArrayStore from 'common/data/array_store';
import {
    CHAT_EDITING_PREVIEW_CLASS,
    CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS,
} from '__internal/ui/chat/editing_preview';
import { CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS } from '__internal/ui/chat/confirmationpopup';
import { POPUP_CLASS } from '__internal/ui/popup/m_popup';
import { BUTTON_CLASS } from '__internal/ui/button/button';
import MessageBubble from '__internal/ui/chat/messagebubble';

const CHAT_MESSAGEGROUP_CLASS = 'dx-chat-messagegroup';
const CHAT_MESSAGELIST_CLASS = 'dx-chat-messagelist';
const CHAT_ALERTLIST_CLASS = 'dx-chat-alertlist';
const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
const CHAT_MESSAGEBUBBLE_CONTENT_CLASS = 'dx-chat-messagebubble-content';
const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';
const SCROLLVIEW_REACHBOTTOM_INDICATOR = 'dx-scrollview-scrollbottom';
const CHAT_MESSAGELIST_DAY_HEADER_CLASS = 'dx-chat-messagelist-day-header';
const CHAT_MESSAGEGROUP_INFORMATION_CLASS = 'dx-chat-messagegroup-information';
const CHAT_MESSAGEGROUP_CONTENT_CLASS = 'dx-chat-messagegroup-content';
const CHAT_MESSAGE_EDITED_CLASS = 'dx-chat-message-edited';
const CHAT_MESSAGE_EDITED_HIDING_CLASS = 'dx-chat-message-edited-hiding';

const CHAT_LAST_MESSAGEGROUP_ALIGNMENT_START_CLASS = 'dx-chat-last-messagegroup-alignment-start';
const CHAT_LAST_MESSAGEGROUP_ALIGNMENT_END_CLASS = 'dx-chat-last-messagegroup-alignment-end';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

const RTL_CLASS = 'dx-rtl';
const ANIMATION_TIMEOUT = 250;

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
            fx.off = true;

            this.instance = new Chat($('#component'), options);
            this.$element = $(this.instance.$element());

            this.$textArea = this.$element.find(`.${CHAT_MESSAGEBOX_TEXTAREA_CLASS}`);
            this.textArea = this.$textArea.dxTextArea('instance');
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
        this.getContextMenu = () => ContextMenu.getInstance(this.$element.find(`.${CHAT_MESSAGELIST_CONTEXT_MENU_CLASS}`));
        this.getContextMenuItems = () => $(this.getContextMenu().itemsContainer()).find(`.${DX_MENU_ITEM_CLASS}`);
        this.getEditingPreview = () => this.$element.find(`.${CHAT_EDITING_PREVIEW_CLASS}`);
        this.getCancelEditingButton = () => this.$element.find(`.${CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS}`);
        this.getMessageListEmptyView = () => this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`);

        init();
    },
    afterEach: function() {
        fx.off = false;
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


            assert.strictEqual(user.hasOwnProperty('id'), true);
        });

        QUnit.test('User id should be generated as a string if user has not been set', function(assert) {
            assert.strictEqual(typeof this.instance.option('user.id') === 'string', true);
        });

        QUnit.test('confirmation popup should have correct default values', function(assert) {
            const items = [
                { text: 'a', author: userFirst },
                { text: 'b', author: userSecond },
            ];

            this.reinit({
                user: userSecond,
                editing: {
                    allowDeleting: true
                },
                items,
            });

            const $bubbles = this.getBubbles();
            $bubbles.eq(1).trigger('dxcontextmenu');

            const $deleteButton = this.getContextMenuItems().eq(0);
            $deleteButton.trigger('dxclick');

            const $popup = this.$element.find(`.${POPUP_CLASS}.${WIDGET_CLASS}`);
            const popup = $popup.dxPopup('instance');

            assert.propContains(popup.option(), {
                showTitle: false,
                showCloseButton: false,
                shading: true,
                dragEnabled: false,
                hideOnOutsideClick: true,
                resizeEnabled: false,
                rtlEnabled: false,
            }, 'confirmation popup has correct default options');
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

        QUnit.test('items should be passed to messageList after update only one item (T1290746)', function(assert) {
            this.reinit({
                items: [{ text: 'one' }, { text: 'two' }],
            });

            this.instance.option('items[0]', { text: 'new one' });

            const messageList = this.getMessageList();

            assert.deepEqual(messageList.option('items'), [{ text: 'new one' }, { text: 'two' }], 'items value is updated');
        });

        QUnit.test('items should be passed to messageList after update only one item field (T1290746)', function(assert) {
            this.reinit({
                items: [{ text: 'one' }, { text: 'two' }],
            });

            this.instance.option('items[0].text', 'new one');

            const messageList = this.getMessageList();

            assert.deepEqual(messageList.option('items'), [{ text: 'new one' }, { text: 'two' }], 'items value is updated');
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

        QUnit.module('Editing', () => {
            ['allowDeleting', 'allowUpdating'].forEach(option => {
                QUnit.test(`Chat should pass editing.${option} to messageList on init`, function(assert) {
                    this.reinit({
                        editing: {
                            [option]: true
                        }
                    });

                    const messageList = this.getMessageList();

                    assert.strictEqual(messageList.option(option)(), true, `${option} is passed on init`);
                });

                QUnit.test(`Chat should pass editing.${option} as function to messageList on init`, function(assert) {
                    this.reinit({
                        editing: {
                            [option]: () => {
                                return true;
                            }
                        }
                    });

                    const messageList = this.getMessageList();

                    assert.strictEqual(messageList.option(option)(), true, `${option} is passed on init`);
                });

                QUnit.test(`Chat editing.${option} should be respected by messageList after changing at runtime`, function(assert) {
                    this.reinit({
                        editing: {
                            [option]: () => {
                                return false;
                            }
                        }
                    });

                    const messageList = this.getMessageList();

                    this.instance.option('editing', {
                        [option]: (options) => {
                            return options.message.id === 1;
                        }
                    });

                    assert.strictEqual(messageList.option(option)({ id: 1 }), true, `${option} is respected after change at runtime`
                    );
                });

                QUnit.test(`Chat editing.${option} should receive correct arguments`, function(assert) {
                    assert.expect(4);

                    const allowActionSpy = sinon.spy(() => true);

                    const items = [
                        { text: 'a', author: userFirst },
                        { text: 'b', author: userSecond },
                    ];

                    this.reinit({
                        user: userSecond,
                        editing: {
                            [option]: allowActionSpy
                        },
                        items,
                    });

                    assert.strictEqual(allowActionSpy.callCount, 0, 'allow action callback should not be called initially');

                    const $bubbles = this.getBubbles();
                    $bubbles.eq(1).trigger('dxcontextmenu');

                    assert.strictEqual(allowActionSpy.callCount, 1, 'allow action callback should be called after bubble click');
                    assert.strictEqual(allowActionSpy.args[0][0].component.NAME, 'dxChat', 'component is passed correctly');
                    assert.deepEqual(allowActionSpy.args[0][0].message, items[1], 'target message is passed correctly');
                });
            });

            QUnit.testInActiveWindow('Contextmenu should be hidden and input focused after esc is pressed', function(assert) {
                const items = [
                    { id: '1', text: 'a', author: userFirst },
                    { id: '2', text: 'b', author: userSecond },
                ];

                this.reinit({
                    focusStateEnabled: true,
                    items,
                    user: userSecond,
                    editing: {
                        allowUpdating: true,
                        allowDeleting: true,
                    }
                });
                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                keyboardMock(this.getContextMenu().itemsContainer())
                    .keyDown('esc');

                assert.strictEqual(this.getContextMenu().option('visible'), false, 'context menu is hidden');
                assert.strictEqual(this.$textArea.hasClass(FOCUSED_STATE_CLASS), true, 'input is focused');
            });

            QUnit.testInActiveWindow('Input not focused after context menu is hidden by outside click', function(assert) {
                const items = [
                    { id: '1', text: 'a', author: userFirst },
                    { id: '2', text: 'b', author: userSecond },
                ];

                this.reinit({
                    focusStateEnabled: true,
                    items,
                    user: userSecond,
                    editing: {
                        allowUpdating: true,
                        allowDeleting: true,
                    }
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                pointerMock($bubbles.eq(0)).click();

                assert.strictEqual(this.getContextMenu().option('visible'), false, 'context menu is hidden');
                assert.strictEqual(this.$textArea.hasClass(FOCUSED_STATE_CLASS), false, 'input is focused');
            });

            QUnit.testInActiveWindow('Input should be blurred after context menu is shown', function(assert) {
                const items = [
                    { id: '1', text: 'a', author: userFirst },
                    { id: '2', text: 'b', author: userSecond },
                ];

                this.reinit({
                    focusStateEnabled: true,
                    items,
                    user: userSecond,
                    editing: {
                        allowUpdating: true,
                        allowDeleting: true,
                    }
                });

                keyboardMock(this.$input).focus();

                assert.strictEqual(this.$textArea.hasClass(FOCUSED_STATE_CLASS), true, 'input is focused');

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                assert.strictEqual(this.getContextMenu().option('visible'), true, 'context menu is shown');
                assert.strictEqual(this.$textArea.hasClass(FOCUSED_STATE_CLASS), false, 'input is blurred');
            });

            QUnit.test('edit menu item should be disabled for message that is already editing', function(assert) {
                this.reinit({
                    focusStateEnabled: true,
                    editing: {
                        allowUpdating: true,
                    },
                    items: [
                        { text: 'a', author: userFirst },
                        { text: 'b', author: userSecond },
                    ],
                    user: userSecond,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                let editAction = this.getContextMenu().option('items')[0];
                assert.strictEqual(editAction.disabled, false, 'Edit action is enabled');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                $bubbles.eq(1).trigger('dxcontextmenu');

                editAction = this.getContextMenu().option('items')[0];
                assert.strictEqual(editAction.disabled, true, 'Edit action is disabled');
            });

            QUnit.test('Edit menu item should remain enabled after editing is cancelled', function(assert) {
                this.reinit({
                    focusStateEnabled: true,
                    editing: {
                        allowUpdating: true,
                    },
                    items: [
                        { text: 'a', author: userFirst },
                        { text: 'b', author: userSecond },
                    ],
                    user: userSecond,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                let editAction = this.getContextMenu().option('items')[0];
                assert.strictEqual(editAction.disabled, false, 'Edit action is enabled initially');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                this.getCancelEditingButton().trigger('dxclick');

                $bubbles.eq(1).trigger('dxcontextmenu');
                editAction = this.getContextMenu().option('items')[0];
                assert.strictEqual(editAction.disabled, false, 'Edit action is still enabled after cancel');
            });

            QUnit.test('Edit menu item should remain enabled after editing is saved', function(assert) {
                this.reinit({
                    focusStateEnabled: true,
                    editing: {
                        allowUpdating: true,
                    },
                    items: [
                        { text: 'a', author: userFirst },
                        { text: 'b', author: userSecond },
                    ],
                    user: userSecond,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                let editAction = this.getContextMenu().option('items')[0];
                assert.strictEqual(editAction.disabled, false, 'Edit action is enabled initially');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                this.$sendButton.trigger('dxclick');

                $bubbles.eq(1).trigger('dxcontextmenu');
                editAction = this.getContextMenu().option('items')[0];
                assert.strictEqual(editAction.disabled, false, 'Edit action is still enabled after save');
            });

            QUnit.testInActiveWindow('Context menu should not be shown for deleted messages', function(assert) {
                const items = [
                    { id: '1', text: 'a', author: userFirst },
                    { id: '2', text: 'b', author: userSecond, isDeleted: true },
                ];

                this.reinit({
                    focusStateEnabled: true,
                    items,
                    user: userSecond,
                    editing: {
                        allowDeleting: true,
                    }
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                assert.strictEqual(this.getContextMenu().option('visible'), false, 'Context menu is not shown for deleted message');
            });

            QUnit.test('Edit menu item should not be shown for image messages', function(assert) {
                this.reinit({
                    focusStateEnabled: true,
                    editing: {
                        allowUpdating: true,
                    },
                    items: [
                        { type: 'image', src: 'image.jpg', author: userSecond },
                    ],
                    user: userSecond,
                });

                const $bubbles = this.getBubbles();

                $bubbles.trigger('dxcontextmenu');

                const contextMenuItems = this.getContextMenu().option('items');
                const editItem = contextMenuItems.find((item) => item.text === 'Edit');

                assert.strictEqual(editItem, undefined, 'Edit menu item is not shown for image message');
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
                    alt: undefined,
                    src: undefined,
                    type: undefined
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

        QUnit.module('emptyViewTemplate', () => {
            QUnit.test('emptyViewTemplate should set empty view content on init', function(assert) {
                this.reinit({
                    emptyViewTemplate: () => $('<h1>').text('This is empty'),
                });

                const $emptyView = this.getMessageListEmptyView();

                assert.strictEqual($emptyView.text(), 'This is empty');
            });

            QUnit.test('emptyViewTemplate should set empty view content at runtime', function(assert) {
                this.reinit({ });
                this.instance.option('emptyViewTemplate', () => $('<h1>').text('This is empty'));

                const $emptyView = this.getMessageListEmptyView();

                assert.strictEqual($emptyView.text(), 'This is empty');
            });

            QUnit.test('emptyViewTemplate specified as a string text should set empty view content', function(assert) {
                this.reinit({ emptyViewTemplate: 'empty' });

                const $emptyView = this.getMessageListEmptyView();

                assert.strictEqual($emptyView.text(), 'empty');
            });

            QUnit.test('emptyViewTemplate specified as a string with a html element should set empty view content', function(assert) {
                this.reinit({ emptyViewTemplate: '<p>p text</p>' });

                const $emptyViewChild = this.getMessageListEmptyView().children();

                assert.strictEqual($emptyViewChild.text(), 'p text', 'template text is correct');
                assert.strictEqual($emptyViewChild.prop('tagName'), 'P', 'templte tag element is correct');
            });

            QUnit.test('emptyViewTemplate function argument should include Chat instance', function(assert) {
                assert.expect(1);

                const emptyViewTemplate = (data) => {
                    assert.strictEqual(data.component instanceof Chat, true, 'chat instance is passed');
                };

                this.reinit({ emptyViewTemplate });
            });

            QUnit.test('emptyViewTemplate function argument should include texts field with localized message and prompt', function(assert) {
                assert.expect(2);

                const defaultLocale = localization.locale();
                const localizedEmptyListMessage = 'Lista wiadomości jest pusta';
                const localizedEmptyListPrompt = 'Napisz swoją pierwszą wiadomość';

                const emptyViewTemplate = ({ texts }) => {
                    assert.strictEqual(texts.message, localizedEmptyListMessage, 'localized message is passed');
                    assert.strictEqual(texts.prompt, localizedEmptyListPrompt, 'localized prompt is passed');
                };

                try {
                    localization.loadMessages({
                        'pl': {
                            'dxChat-emptyListMessage': localizedEmptyListMessage,
                            'dxChat-emptyListPrompt': localizedEmptyListPrompt,
                        }
                    });
                    localization.locale('pl');

                    this.reinit({ emptyViewTemplate });
                } finally {
                    localization.locale(defaultLocale);
                }
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

    QUnit.module('Confirmation popup integration', moduleConfig, () => {
        QUnit.test('passed rtlEnabled option value in Chat should be proxied to the Confirmation popup', function(assert) {
            const items = [
                { text: 'a', author: userFirst },
                { text: 'b', author: userSecond },
            ];

            this.reinit({
                user: userSecond,
                editing: {
                    allowDeleting: true
                },
                rtlEnabled: true,
                items,
            });

            const $bubbles = this.getBubbles();
            $bubbles.eq(1).trigger('dxcontextmenu');

            const $deleteButton = this.getContextMenuItems().eq(0);
            $deleteButton.trigger('dxclick');

            const $popup = $(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
            assert.notStrictEqual($popup.find(`.${RTL_CLASS}`).length, 0, 'rtl class is passed to the popup');
        });

        QUnit.testInActiveWindow('input should be focused after message delete popup is closed', function(assert) {
            const items = [
                { text: 'a', author: userFirst },
                { text: 'b', author: userSecond },
            ];

            this.reinit({
                user: userSecond,
                editing: {
                    allowDeleting: true
                },
                items,
            });

            const $bubbles = this.getBubbles();
            $bubbles.eq(1).trigger('dxcontextmenu');

            const $deleteButton = this.getContextMenuItems().eq(0);
            $deleteButton.trigger('dxclick');

            const $popup = $(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
            const $cancelButton = $popup.find(`.${BUTTON_CLASS}`).last();

            $cancelButton.trigger('dxclick');

            assert.strictEqual(this.$textArea.hasClass(FOCUSED_STATE_CLASS), true, 'input is focused');
        });
    });

    QUnit.module('Message editing preview integration', moduleConfig, () => {
        [true, false].forEach((isPromise) => {
            [true, false].forEach((cancel) => {
                QUnit.test(`editing preview should appear based on onMessageEditingStart cancel (isPromise=${isPromise}, cancel=${cancel})`, function(assert) {
                    const done = assert.async();

                    const items = [
                        { text: 'a', author: userFirst },
                        { text: 'b', author: userSecond },
                    ];

                    this.reinit({
                        user: userSecond,
                        editing: {
                            allowUpdating: true
                        },
                        onMessageEditingStart: (e) => {
                            e.cancel = isPromise ? Promise.resolve(cancel) : cancel;
                        },
                        items,
                    });

                    const $bubbles = this.getBubbles();
                    $bubbles.eq(1).trigger('dxcontextmenu');

                    const $editButton = this.getContextMenuItems().eq(0);
                    $editButton.trigger('dxclick');

                    setTimeout(() => {
                        assert.strictEqual(this.getEditingPreview().length, cancel ? 0 : 1);
                        done();
                    });
                });

                QUnit.test(`Editing preview should remain visible depending on onMessageUpdating cancellation (isPromise=${isPromise}, cancel=${cancel})`, function(assert) {
                    const done = assert.async();

                    const items = [
                        { text: 'a', author: userFirst },
                        { text: 'b', author: userSecond },
                    ];

                    this.reinit({
                        user: userSecond,
                        editing: {
                            allowUpdating: true
                        },
                        onMessageUpdating: (e) => {
                            e.cancel = isPromise ? Promise.resolve(cancel) : cancel;
                        },
                        items,
                    });

                    const $bubbles = this.getBubbles();
                    $bubbles.eq(1).trigger('dxcontextmenu');

                    const $editButton = this.getContextMenuItems().eq(0);
                    $editButton.trigger('dxclick');

                    this.$sendButton.trigger('dxclick');

                    setTimeout(() => {
                        assert.strictEqual(
                            this.getEditingPreview().length,
                            cancel ? 1 : 0,
                            `Editing preview ${cancel ? 'remains' : 'is hidden'} when cancel=${cancel}`
                        );
                        done();
                    }, ANIMATION_TIMEOUT);
                });
            });
        });

        QUnit.testInActiveWindow('editing preview should be shown after the Edit button is clicked if cancel promise rejected', function(assert) {
            const done = assert.async();

            const items = [
                { text: 'a', author: userFirst },
                { text: 'b', author: userSecond },
            ];

            this.reinit({
                user: userSecond,
                editing: {
                    allowUpdating: true
                },
                onMessageEditingStart: (e) => {
                    e.cancel = Promise.reject();
                },
                items,
            });

            const $bubbles = this.getBubbles();
            $bubbles.eq(1).trigger('dxcontextmenu');

            const $editButton = this.getContextMenuItems().eq(0);
            $editButton.trigger('dxclick');


            setTimeout(() => {
                assert.strictEqual(this.getEditingPreview().length, 1);
                assert.strictEqual(this.textArea.option('text'), items[1].text, 'input contains edited text');
                assert.strictEqual(this.$textArea.hasClass(FOCUSED_STATE_CLASS), true, 'input is focused');
                done();
            });
        });

        QUnit.test('editing preview should be hidden after the message is deleted', function(assert) {
            const done = assert.async();

            const items = [
                { text: 'a', author: userFirst },
                { text: 'b', author: userSecond },
            ];

            this.reinit({
                user: userSecond,
                editing: {
                    allowUpdating: true,
                    allowDeleting: true,
                },
                items,
            });

            const $bubbles = this.getBubbles();
            $bubbles.eq(1).trigger('dxcontextmenu');

            const $editButton = this.getContextMenuItems().eq(0);
            $editButton.trigger('dxclick');

            $bubbles.eq(1).trigger('dxcontextmenu');

            const $deleteButton = this.getContextMenuItems().eq(1);
            $deleteButton.trigger('dxclick');

            const $popup = $(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
            const $applyButton = $popup.find(`.${BUTTON_CLASS}`).first();

            $applyButton.trigger('dxclick');

            setTimeout(() => {
                assert.strictEqual(this.getEditingPreview().length, 0);
                assert.strictEqual(this.textArea.option('value'), '', 'input is empty');
                assert.strictEqual(this.$textArea.hasClass(FOCUSED_STATE_CLASS), true, 'input is focused');
                done();
            }, ANIMATION_TIMEOUT);
        });

        QUnit.test('send button should change its active state with update input value during editing', function(assert) {
            const items = [
                { text: 'a', author: userFirst },
                { text: 'b', author: userSecond },
            ];

            this.reinit({
                focusStateEnabled: true,
                user: userSecond,
                editing: {
                    allowUpdating: true
                },
                items,
            });

            const sendButton = this.$sendButton.dxButton('instance');

            assert.strictEqual(sendButton.option('disabled'), true, 'send button is disabled by default');

            const $bubbles = this.getBubbles();
            $bubbles.eq(1).trigger('dxcontextmenu');

            const $editButton = this.getContextMenuItems().eq(0);
            $editButton.trigger('dxclick');

            assert.strictEqual(sendButton.option('disabled'), false, 'send button is active after edit started');

            this.getCancelEditingButton().trigger('dxclick');

            assert.strictEqual(sendButton.option('disabled'), true, 'send button is disabled after edit cancelled');
        });

        QUnit.test('editing preview should be enabled after the send button is clicked if cancel promise rejected', function(assert) {
            const done = assert.async();

            const items = [
                { text: 'a', author: userFirst },
                { text: 'b', author: userSecond },
            ];

            this.reinit({
                user: userSecond,
                editing: {
                    allowUpdating: true
                },
                onMessageUpdating: (e) => {
                    e.cancel = Promise.reject();
                },
                items,
            });

            const $bubbles = this.getBubbles();
            $bubbles.eq(1).trigger('dxcontextmenu');

            const $editButton = this.getContextMenuItems().eq(0);
            $editButton.trigger('dxclick');

            this.$sendButton.trigger('dxclick');

            setTimeout(() => {
                assert.strictEqual(this.getEditingPreview().length, 0);
                assert.strictEqual(this.textArea.option('value'), '', 'input is empty');
                assert.strictEqual(this.$textArea.hasClass(FOCUSED_STATE_CLASS), true, 'input is focused');
                done();
            }, ANIMATION_TIMEOUT);
        });

        QUnit.testInActiveWindow('message box should have editing message text and focus after the Edit button is clicked and not cancelled', function(assert) {
            const items = [
                { text: 'a', author: userFirst },
                { text: 'b', author: userSecond },
            ];

            this.reinit({
                focusStateEnabled: true,
                user: userSecond,
                editing: {
                    allowUpdating: true
                },
                items,
            });

            const $bubbles = this.getBubbles();
            $bubbles.eq(1).trigger('dxcontextmenu');

            const $editButton = this.getContextMenuItems().eq(0);
            $editButton.trigger('dxclick');

            assert.strictEqual(this.textArea.option('value'), 'b', 'input contains editing message text');
            assert.strictEqual(this.$textArea.hasClass(FOCUSED_STATE_CLASS), true, 'input is focused');
        });

        QUnit.testInActiveWindow('message box should have editing message text and focus after the Edit was triggered from keyboard', function(assert) {
            const items = [
                { text: 'a', author: userFirst },
                { text: 'b', author: userSecond },
            ];

            this.reinit({
                focusStateEnabled: true,
                user: userSecond,
                editing: {
                    allowUpdating: true
                },
                items,
            });

            const $bubbles = this.getBubbles();
            $bubbles.eq(1).trigger('dxcontextmenu');

            keyboardMock(this.getContextMenu().itemsContainer())
                .press('down')
                .press('enter');

            assert.strictEqual(this.textArea.option('value'), 'b', 'input contains editing message text');
            assert.strictEqual(this.$textArea.hasClass(FOCUSED_STATE_CLASS), true, 'input is focused');
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

                        assert.strictEqual(message.hasOwnProperty('timestamp'), true, 'timestamp field is set');
                        assert.strictEqual(messageText, text, 'text field is correct');
                    },
                });

                keyboardMock(this.$input)
                    .focus()
                    .type(text);

                this.$sendButton.trigger('dxclick');
            });

            QUnit.test('onMessageEntered should not be called when send button is clicked in editing mode', function(assert) {
                const onMessageUpdating = sinon.spy();
                const onMessageEntered = sinon.spy();

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true,
                    },
                    onMessageUpdating,
                    onMessageEntered,
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                this.$sendButton.trigger('dxclick');

                assert.strictEqual(onMessageUpdating.callCount, 1, 'onMessageUpdating was called once');
                assert.strictEqual(onMessageEntered.callCount, 0, 'onMessageEntered was not called');
            });
        });

        QUnit.module('OnMessageUpdating', moduleConfig, () => {
            QUnit.test('should be called when the send button is clicked in editing mode', function(assert) {
                const onMessageUpdating = sinon.spy();

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true,
                    },
                    onMessageUpdating,
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                this.$sendButton.trigger('dxclick');

                assert.strictEqual(onMessageUpdating.callCount, 1, 'onMessageUpdating was called once');
            });

            QUnit.test('should pass correct arguments to onMessageUpdating after clicking the send button', function(assert) {
                assert.expect(6);

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true,
                    },
                    onMessageUpdating: (e) => {
                        const { component, element, message, cancel, text } = e;

                        assert.strictEqual(component, this.instance, 'e.component is correct');
                        assert.strictEqual(isRenderer(element), !!config().useJQuery, 'e.element uses correct renderer');
                        assert.strictEqual($(element).is(this.$element), true, 'e.element matches the widget root');
                        assert.strictEqual(message, items[1], 'e.message is correct');
                        assert.strictEqual(cancel, false, 'e.cancel is false by default');
                        assert.strictEqual(text, 'newb', 'e.text reflects updated message content');
                    },
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                keyboardMock(this.$input)
                    .focus()
                    .type('new');

                this.$sendButton.trigger('dxclick');
            });

            QUnit.test('should allow updating onMessageUpdating handler at runtime', function(assert) {
                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true,
                    },
                    onMessageUpdating: () => {},
                    items,
                });

                const onMessageUpdating = sinon.spy();
                this.instance.option({ onMessageUpdating });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                this.$sendButton.trigger('dxclick');

                assert.strictEqual(onMessageUpdating.callCount, 1, 'Updated onMessageUpdating handler was called');
            });
        });

        QUnit.module('OnMessageUpdated', moduleConfig, () => {
            QUnit.test('should be called when the send button is clicked in editing mode', function(assert) {
                const onMessageUpdated = sinon.spy();

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true,
                    },
                    onMessageUpdated,
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                this.$sendButton.trigger('dxclick');

                assert.strictEqual(onMessageUpdated.callCount, 1, 'onMessageUpdated was called once');
            });

            QUnit.test('should pass correct arguments to onMessageUpdated after clicking the send button', function(assert) {
                assert.expect(6);

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true,
                    },
                    onMessageUpdated: (e) => {
                        const { component, element, message, cancel, text } = e;

                        assert.strictEqual(component, this.instance, 'e.component is correct');
                        assert.strictEqual(isRenderer(element), !!config().useJQuery, 'e.element uses correct renderer');
                        assert.strictEqual($(element).is(this.$element), true, 'e.element matches widget root');
                        assert.strictEqual(message, items[1], 'e.message is correct');
                        assert.strictEqual(cancel, false, 'e.cancel is false by default');
                        assert.strictEqual(text, 'newb', 'e.text reflects updated message content');
                    },
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                keyboardMock(this.$input)
                    .focus()
                    .type('new');

                this.$sendButton.trigger('dxclick');
            });

            QUnit.test('should support updating onMessageUpdated handler at runtime', function(assert) {
                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true,
                    },
                    onMessageUpdated: () => {},
                    items,
                });

                const onMessageUpdated = sinon.spy();
                this.instance.option({ onMessageUpdated });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                this.$sendButton.trigger('dxclick');

                assert.strictEqual(onMessageUpdated.callCount, 1, 'Updated onMessageUpdated handler was called');
            });
        });

        QUnit.module('OnMessageEditingStart', moduleConfig, () => {
            QUnit.test('should be called when the Edit button is clicked', function(assert) {
                const onMessageEditingStart = sinon.spy();

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true
                    },
                    onMessageEditingStart,
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                assert.strictEqual(onMessageEditingStart.callCount, 1);
            });

            QUnit.test('should get correct arguments after clicking the Edit button', function(assert) {
                assert.expect(5);

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true
                    },
                    onMessageEditingStart: (e) => {
                        const { component, element, message, cancel } = e;

                        assert.strictEqual(component, this.instance, 'e.component is correct');
                        assert.strictEqual(isRenderer(element), !!config().useJQuery, 'e.element uses correct renderer');
                        assert.strictEqual($(element).is(this.$element), true, 'e.element matches the widget root');
                        assert.strictEqual(message, items[1], 'e.message is correct');
                        assert.strictEqual(cancel, false, 'cancel value is false by default');
                    },
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');
            });

            QUnit.test('should allow updating onMessageEditingStart at runtime', function(assert) {
                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true
                    },
                    onMessageEditingStart: () => {},
                    items,
                });

                const onMessageEditingStart = sinon.spy();

                this.instance.option({ onMessageEditingStart });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                assert.strictEqual(onMessageEditingStart.callCount, 1);
            });
        });

        QUnit.module('OnMessageEditCanceled', moduleConfig, () => {
            QUnit.test('should be called when the Cancel button in editing preview is clicked', function(assert) {
                const onMessageEditCanceled = sinon.spy();

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true
                    },
                    onMessageEditCanceled,
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                this.getCancelEditingButton().trigger('dxclick');

                assert.strictEqual(onMessageEditCanceled.callCount, 1);
            });

            QUnit.test('should be called after ESCAPE key pressed during message editing', function(assert) {
                const onMessageEditCanceled = sinon.spy();

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true
                    },
                    onMessageEditCanceled,
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                keyboardMock(this.$input).keyDown('escape');

                assert.strictEqual(onMessageEditCanceled.callCount, 1);
            });

            QUnit.test('should be called before start editing new message if already editing another message', function(assert) {
                const onMessageEditCanceled = sinon.spy();
                const onMessageEditingStart = sinon.spy();

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                    { text: 'c', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true
                    },
                    onMessageEditCanceled,
                    onMessageEditingStart,
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                let $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                $bubbles.eq(2).trigger('dxcontextmenu');
                $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                assert.strictEqual(onMessageEditCanceled.callCount, 1);
                assert.strictEqual(onMessageEditingStart.callCount, 2);
                assert.strictEqual(onMessageEditCanceled.calledBefore(onMessageEditingStart), true);
            });

            QUnit.test('onMessageEditCanceled should be called before onMessageDeleted if the message is being edited', function(assert) {
                const onMessageEditCanceled = sinon.spy();
                const onMessageDeleted = sinon.spy();

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                    { text: 'c', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true,
                        allowDeleting: true,
                    },
                    onMessageEditCanceled,
                    onMessageDeleted,
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                $bubbles.eq(1).trigger('dxcontextmenu');
                const $deleteButton = this.getContextMenuItems().eq(1);
                $deleteButton.trigger('dxclick');

                const $popup = $(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
                const $applyButton = $popup.find(`.${BUTTON_CLASS}`).first();
                $applyButton.trigger('dxclick');

                assert.strictEqual(onMessageEditCanceled.callCount, 1, 'onMessageEditCanceled was called once');
                assert.strictEqual(onMessageDeleted.callCount, 1, 'onMessageDeleted was called once');
                assert.ok(onMessageEditCanceled.calledBefore(onMessageDeleted), 'onMessageEditCanceled was called before onMessageDeleted');
            });

            QUnit.test('onMessageEditCanceled should not be called before deletion if the message is not being edited', function(assert) {
                const onMessageEditCanceled = sinon.spy();
                const onMessageDeleted = sinon.spy();

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                    { text: 'c', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true,
                        allowDeleting: true,
                    },
                    onMessageEditCanceled,
                    onMessageDeleted,
                    items,
                });

                const $bubbles = this.getBubbles();

                $bubbles.eq(1).trigger('dxcontextmenu');
                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                $bubbles.eq(2).trigger('dxcontextmenu');
                const $deleteButton = this.getContextMenuItems().eq(1);
                $deleteButton.trigger('dxclick');

                const $popup = $(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
                const $applyButton = $popup.find(`.${BUTTON_CLASS}`).first();
                $applyButton.trigger('dxclick');

                assert.strictEqual(onMessageEditCanceled.callCount, 0, 'onMessageEditCanceled was not called');
                assert.strictEqual(onMessageDeleted.callCount, 1, 'onMessageDeleted was called once');
            });

            QUnit.test('should get correct arguments after clicking the Cancel button in editing preview', function(assert) {
                assert.expect(4);

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true
                    },
                    onMessageEditCanceled: (e) => {
                        const { component, element, message } = e;

                        assert.strictEqual(component, this.instance, 'e.component is correct');
                        assert.strictEqual(isRenderer(element), !!config().useJQuery, 'e.element uses correct renderer');
                        assert.strictEqual($(element).is(this.$element), true, 'e.element matches the widget root');
                        assert.strictEqual(message, items[1], 'e.message is correct');
                    },
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                this.getCancelEditingButton().trigger('dxclick');
            });

            QUnit.test('should allow updating onMessageEditCanceled at runtime', function(assert) {
                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowUpdating: true
                    },
                    onMessageEditCanceled: () => {},
                    items,
                });

                const onMessageEditCanceled = sinon.spy();

                this.instance.option({ onMessageEditCanceled });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $editButton = this.getContextMenuItems().eq(0);
                $editButton.trigger('dxclick');

                this.getCancelEditingButton().trigger('dxclick');

                assert.strictEqual(onMessageEditCanceled.callCount, 1);
            });
        });

        QUnit.module('onMessageDeleting', moduleConfig, () => {
            QUnit.test('should be called when the Delete button is clicked', function(assert) {
                const onMessageDeleting = sinon.spy();

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowDeleting: true
                    },
                    onMessageDeleting,
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $deleteButton = this.getContextMenuItems().eq(0);
                $deleteButton.trigger('dxclick');

                assert.strictEqual(onMessageDeleting.callCount, 1);
            });

            QUnit.test('should get correct arguments after clicking the Delete button', function(assert) {
                assert.expect(5);

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowDeleting: true
                    },
                    onMessageDeleting: (e) => {
                        const { component, element, message, cancel } = e;

                        assert.strictEqual(component, this.instance, 'e.component is correct');
                        assert.strictEqual(isRenderer(element), !!config().useJQuery, 'e.element uses correct renderer');
                        assert.strictEqual($(element).is(this.$element), true, 'e.element matches the widget root');
                        assert.strictEqual(cancel, false, 'e.cancel is correct');
                        assert.strictEqual(message, items[1], 'e.message is correct');
                    },
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $deleteButton = this.getContextMenuItems().eq(0);
                $deleteButton.trigger('dxclick');
            });

            QUnit.test('should be able to delete several messages', function(assert) {
                assert.expect(1);

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                    { text: 'c', author: userSecond },
                ];

                const deletedMessages = [];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowDeleting: true
                    },
                    onMessageDeleting: (e) => {
                        const { message } = e;
                        deletedMessages.push(message);
                    },
                    items,
                });

                const deleteMessage = (messageIndex) => {
                    const $bubbles = this.getBubbles();
                    $bubbles.eq(messageIndex).trigger('dxcontextmenu');

                    const $deleteButton = this.getContextMenuItems().eq(0);
                    $deleteButton.trigger('dxclick');
                };

                deleteMessage(1);
                deleteMessage(2);

                assert.deepEqual(deletedMessages, [items[1], items[2]], 'Both messages were deleted');
            });

            QUnit.test('should allow updating onMessageDeleting at runtime', function(assert) {
                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowDeleting: true
                    },
                    onMessageDeleting: () => {},
                    items,
                });

                const onMessageDeleting = sinon.spy();

                this.instance.option({ onMessageDeleting });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $deleteButton = this.getContextMenuItems().eq(0);
                $deleteButton.trigger('dxclick');

                assert.strictEqual(onMessageDeleting.callCount, 1);
            });

            [false, true].forEach((isPromise) => {
                [false, true].forEach((cancel) => {
                    QUnit.test(`delete confirmation popup should appear based on onMessageDeleting cancel (isPromise=${isPromise}, cancel=${cancel})`, function(assert) {
                        const done = assert.async();

                        const items = [
                            { text: 'a', author: userFirst },
                            { text: 'b', author: userSecond },
                        ];

                        this.reinit({
                            user: userSecond,
                            editing: {
                                allowDeleting: true
                            },
                            onMessageDeleting: (e) => {
                                e.cancel = isPromise ? Promise.resolve(cancel) : cancel;
                            },
                            items,
                        });

                        const $bubbles = this.getBubbles();
                        $bubbles.eq(1).trigger('dxcontextmenu');

                        const $deleteButton = this.getContextMenuItems().eq(0);
                        $deleteButton.trigger('dxclick');

                        setTimeout(() => {
                            const $popup = $(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
                            assert.strictEqual($popup.length === 0, cancel, `cancel = ${cancel}, isPromise = ${isPromise}`);
                            done();
                        });
                    });
                });
            });
        });

        QUnit.module('onMessageDeleted', moduleConfig, () => {
            QUnit.test('should be called when the Delete button is clicked and user confirms deletion', function(assert) {
                const onMessageDeleted = sinon.spy();

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowDeleting: true
                    },
                    onMessageDeleted,
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $deleteButton = this.getContextMenuItems().eq(0);
                $deleteButton.trigger('dxclick');

                const $popup = $(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
                const $applyButton = $popup.find(`.${BUTTON_CLASS}`).first();

                $applyButton.trigger('dxclick');

                assert.strictEqual(onMessageDeleted.callCount, 1);
            });

            QUnit.test('should not be called when the Delete button is clicked and user cancels deletion', function(assert) {
                const onMessageDeleted = sinon.spy();

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowDeleting: true
                    },
                    onMessageDeleted,
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $deleteButton = this.getContextMenuItems().eq(0);
                $deleteButton.trigger('dxclick');

                const $popup = $(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
                const $applyButton = $popup.find(`.${BUTTON_CLASS}`).last();

                $applyButton.trigger('dxclick');

                assert.strictEqual(onMessageDeleted.callCount, 0);
            });

            QUnit.test('should get correct arguments after clicking the Apply button in the Delete Confirmation Popup', function(assert) {
                assert.expect(4);

                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowDeleting: true
                    },
                    onMessageDeleted: (e) => {
                        const { component, element, message } = e;

                        assert.strictEqual(component, this.instance, 'e.component is correct');
                        assert.strictEqual(isRenderer(element), !!config().useJQuery, 'e.element uses correct renderer');
                        assert.strictEqual($(element).is(this.$element), true, 'e.element matches the widget root');
                        assert.strictEqual(message, items[1], 'e.message is correct');
                    },
                    items,
                });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $deleteButton = this.getContextMenuItems().eq(0);
                $deleteButton.trigger('dxclick');

                const $popup = $(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
                const $applyButton = $popup.find(`.${BUTTON_CLASS}`).first();

                $applyButton.trigger('dxclick');
            });

            QUnit.test('should allow updating onMessageDeleted at runtime', function(assert) {
                const items = [
                    { text: 'a', author: userFirst },
                    { text: 'b', author: userSecond },
                ];

                this.reinit({
                    user: userSecond,
                    editing: {
                        allowDeleting: true
                    },
                    onMessageDeleted: () => {},
                    items,
                });

                const onMessageDeleted = sinon.spy();

                this.instance.option({ onMessageDeleted });

                const $bubbles = this.getBubbles();
                $bubbles.eq(1).trigger('dxcontextmenu');

                const $deleteButton = this.getContextMenuItems().eq(0);
                $deleteButton.trigger('dxclick');

                const $popup = $(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
                const $applyButton = $popup.find(`.${BUTTON_CLASS}`).first();

                $applyButton.trigger('dxclick');

                assert.strictEqual(onMessageDeleted.callCount, 1);
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

        QUnit.test('message text should be updated when using store.push({ type: "update", key: "message_id", data: { text: "new text" } })', function(assert) {
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

        QUnit.test('it should be possible to update item with key=0 using push api', function(assert) {
            const messages = [{ id: 0, text: 'message_0' }, { id: 1, text: 'message_1' }];
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
            store.push([{ type: 'update', key: 0, data: { text: 'updated text' } }]);
            this.clock.tick(timeout * 2);

            assert.strictEqual(this.getBubbles().eq(0).text(), 'updated text', 'message bubble text was updated');
        });

        QUnit.test('it should be possible to update isEdited state of first message in group using push api', function(assert) {
            const messages = [{ id: 0, text: 'message_0' }, { id: 1, text: 'message_1' }];
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
            store.push([{ type: 'update', key: 0, data: { ...messages[0], isEdited: true } }]);
            this.clock.tick(timeout * 2);

            const $information = this.$element.find(`.${CHAT_MESSAGEGROUP_INFORMATION_CLASS}`);
            const $editedMessage = $information.find(`.${CHAT_MESSAGE_EDITED_CLASS}`);

            assert.strictEqual($editedMessage.length, 1, 'edited text was added');
        });

        QUnit.test('it should be possible to update isEdited state of not first message in group using push api', function(assert) {
            const messages = [{ id: 0, text: 'message_0' }, { id: 1, text: 'message_1' }];
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

            const $groupContent = this.$element.find(`.${CHAT_MESSAGEGROUP_CONTENT_CLASS}`);
            let $editedMessage = $groupContent.find(`.${CHAT_MESSAGE_EDITED_CLASS}`);

            assert.strictEqual($editedMessage.length, 0, 'edited text was not added on init');

            store.push([{ type: 'update', key: 1, data: { ...messages[1], isEdited: true } }]);
            this.clock.tick(timeout * 2);

            $editedMessage = $groupContent.find(`.${CHAT_MESSAGE_EDITED_CLASS}`);

            assert.strictEqual($editedMessage.length, 1, 'edited text was added at runtime');
        });

        QUnit.test('it should be possible to update isEdited state of new message added using push api', function(assert) {
            const messages = [];
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
                insert: (message) => {
                    const d = $.Deferred();

                    setTimeout(() => {
                        messages.push(message);
                        d.resolve();
                    });

                    return d.promise();
                },
            });

            this.reinit({
                dataSource: store,
                reloadOnChange: false,
            });

            this.clock.tick(timeout);

            store.push([{ type: 'insert', data: { id: 1, text: 'inserted message' } }]);

            this.clock.tick(timeout);

            let $editedMessage = this.$element.find(`.${CHAT_MESSAGE_EDITED_CLASS}`);

            assert.strictEqual($editedMessage.length, 0, 'there is no edited messages');

            store.push([{ type: 'update', key: 1, data: { isEdited: true } }]);

            this.clock.tick(timeout);

            $editedMessage = this.$element.find(`.${CHAT_MESSAGE_EDITED_CLASS}`);

            assert.strictEqual($editedMessage.length, 1, 'there is an edited message');
        });

        [
            {
                scenario: 'in information element',
                messages: [{ id: 0, text: 'message_0', isEdited: true }, { id: 1, text: 'message_1' }],
            },
            {
                scenario: 'not in information element',
                messages: [{ id: 0, text: 'message_0' }, { id: 1, text: 'message_1', isEdited: true }],
            },
        ].forEach(({ scenario, messages }) => {
            QUnit.test(`Edited text ${scenario} should get hiding class on isEdited runtime disable`, function(assert) {
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

                const $editedMessage = this.$element.find(`.${CHAT_MESSAGE_EDITED_CLASS}`);

                assert.strictEqual($editedMessage.length, 1, 'edited text was added on init');

                store.push([{ type: 'update', key: 0, data: { ...messages[0], isEdited: false } }]);
                store.push([{ type: 'update', key: 1, data: { ...messages[1], isEdited: false } }]);

                this.clock.tick(timeout);

                assert.strictEqual($editedMessage.hasClass(CHAT_MESSAGE_EDITED_HIDING_CLASS), true, 'edited text has hiding class');

            });
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

        QUnit.test('should update only the necessary changes if the new Message object is passed to store.push', function(assert) {
            const initialMessageData = { text: 'message_1', isDeleted: false };
            const messages = [
                { id: 1, ...initialMessageData },
                { id: 2, text: 'message_2' }
            ];
            const timeout = 400;

            const store = new CustomStore({
                key: 'id',
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve(messages);
                    }, timeout);
                    return d.promise();
                },
            });

            this.reinit({ dataSource: store });

            this.clock.tick(timeout);

            const bubble = MessageBubble.getInstance(this.getBubbles().eq(0));
            const updateContentSpy = sinon.spy(bubble, '_updateContent');

            [
                { config: {}, expected: { optionChangedCallCount: 0 } },
                { config: { ...initialMessageData }, expected: { optionChangedCallCount: 0 } },
                { config: { text: 'new text 1', isDeleted: false }, expected: { optionChangedCallCount: 1 } },
                { config: { text: 'new text 1', isDeleted: true }, expected: { optionChangedCallCount: 1 } },
                { config: { text: 'new text 2', isDeleted: true }, expected: { optionChangedCallCount: 1 } },
                { config: { text: 'new text 3', isDeleted: false }, expected: { optionChangedCallCount: 2 } },
            ].forEach(testConfig => {
                const { config, expected } = testConfig;
                store.push([{ type: 'update', key: 1, data: config }]);

                this.clock.tick(timeout);

                assert.strictEqual(
                    updateContentSpy.callCount,
                    expected.optionChangedCallCount,
                    `bubble's _updateContent was called ${expected.optionChangedCallCount} time(s) for changes: ${JSON.stringify(config)}`
                );
                updateContentSpy.resetHistory();
            });

            updateContentSpy.restore();
        });
    });
});
