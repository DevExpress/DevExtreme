import $ from 'jquery';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';

import MessageBox, {
    TYPING_END_DELAY,
    CHAT_MESSAGEBOX_TEXTAREA_CLASS,
} from '__internal/ui/chat/message_box/message_box';
import ChatTextArea from '__internal/ui/chat/message_box/chat_text_area';
import Button from 'ui/button';
import FileUploader from 'ui/file_uploader';
import EditingPreview, {
    CHAT_EDITING_PREVIEW_CLASS,
    CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS,
} from '__internal/ui/chat/message_box/editing_preview';
import {
    FOCUSED_STATE_CLASS,
} from '__internal/core/widget/widget';
import { BUTTON_CLASS } from '__internal/ui/button/button';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const FILE_UPLOADER = 'dx-fileuploader';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new MessageBox($('#component'), options);
            this.$element = $(this.instance.$element());

            this.$textArea = this.$element.find(`.${CHAT_MESSAGEBOX_TEXTAREA_CLASS}`);
            this.textArea = ChatTextArea.getInstance(this.$textArea);

            this.$input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

            const $buttons = this.$element.find(`.${BUTTON_CLASS}`);
            this.$sendButton = $($buttons[$buttons.length - 1]);
            this.sendButton = Button.getInstance(this.$sendButton);

            this.$fileUploader = this.$element.find(`.${FILE_UPLOADER}`);
            this.fileUploader = FileUploader.getInstance(this.$fileUploader);

            this.getEditingPreview = () => this.$element.find(`.${CHAT_EDITING_PREVIEW_CLASS}`);
            this.getEditingPreviewInstance = () => EditingPreview.getInstance(this.getEditingPreview());

            this.getCancelButton = () => this.getEditingPreview().find(`.${CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS}`);
            this.getCancelButtonInstance = () => Button.getInstance(this.getCancelButton());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('MessageBox', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof MessageBox);
        });

        QUnit.test('should pass correct configuration to ChatTextArea', function(assert) {
            const expectedOptions = {
                stylingMode: 'outlined',
                placeholder: 'Type a message',
                autoResizeEnabled: true,
                valueChangeEvent: 'input'
            };

            const textArea = ChatTextArea.getInstance(this.$textArea);

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, textArea.option(key), `textarea ${key} value is correct`);
            });
        });
    });

    QUnit.module('onMessageEntered event', () => {
        QUnit.test('should be fired when the send button is clicked if the textarea input contains a value', function(assert) {
            const onMessageEnteredStub = sinon.stub();

            this.reinit({ onMessageEntered: onMessageEnteredStub });

            keyboardMock(this.$input)
                .focus()
                .type('new text message');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onMessageEnteredStub.callCount, 1);
        });

        QUnit.test('should be fired on enter key if the textarea input contains a value', function(assert) {
            const onMessageEnteredStub = sinon.stub();

            this.reinit({ onMessageEntered: onMessageEnteredStub });

            keyboardMock(this.$input)
                .focus()
                .type('new text message')
                .keyUp('enter');


            assert.strictEqual(onMessageEnteredStub.callCount, 1);
        });

        QUnit.test('should not be fired when the send button is clicked if the textarea input does not contain a value', function(assert) {
            const onMessageEnteredStub = sinon.stub();

            this.reinit({ onMessageEntered: onMessageEnteredStub });

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onMessageEnteredStub.callCount, 0);
        });

        QUnit.test('should not be fired on enter key if the textarea input does not contain a value (excluding spaces)', function(assert) {
            const onMessageEnteredStub = sinon.stub();

            this.reinit({ onMessageEntered: onMessageEnteredStub });

            keyboardMock(this.$input)
                .focus()
                .keyUp('enter');

            assert.strictEqual(onMessageEnteredStub.callCount, 0);

            keyboardMock(this.$input)
                .focus()
                .type('   ')
                .keyUp('enter');

            assert.strictEqual(onMessageEnteredStub.callCount, 0);
        });

        QUnit.test('should be possible to update it at runtime', function(assert) {
            const eventHandlerStub = sinon.stub();

            this.instance.option('onMessageEntered', eventHandlerStub);

            keyboardMock(this.$input)
                .focus()
                .type('text');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(eventHandlerStub.callCount, 1);
        });

        QUnit.test('should not be fired when the send button is clicked if the textarea input contains a value consisting only of spaces', function(assert) {
            const emptyText = '    ';
            const onMessageEnteredStub = sinon.stub();

            this.reinit({ onMessageEntered: onMessageEnteredStub });

            keyboardMock(this.$input)
                .focus()
                .type(emptyText);

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onMessageEnteredStub.callCount, 0);
        });

        QUnit.test('should be fired with correct arguments', function(assert) {
            assert.expect(6);

            const text = '  new text message ';

            this.reinit({
                onMessageEntered: (e) => {
                    const { component, element, event, text } = e;

                    assert.strictEqual(component, this.instance, 'component field is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                    assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                    assert.strictEqual(event.type, 'dxclick', 'e.event.type is correct');
                    assert.strictEqual(event.target, this.$sendButton.get(0), 'event field is correct');
                    assert.strictEqual(text, text, 'message field is correct');
                },
            });

            keyboardMock(this.$input)
                .focus()
                .type(text);

            this.$sendButton.trigger('dxclick');
        });

        QUnit.test('should be fired with correct arguments when enter is pressed', function(assert) {
            assert.expect(6);

            const text = '  new text message ';

            this.reinit({
                onMessageEntered: (e) => {
                    const { component, element, event, text } = e;

                    assert.strictEqual(component, this.instance, 'component field is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                    assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                    assert.strictEqual(event.type, 'keyup', 'e.event.type is correct');
                    assert.strictEqual(event.target, this.$input.get(0), 'event target is correct');
                    assert.strictEqual(text, text, 'message field is correct');
                },
            });

            keyboardMock(this.$input)
                .focus()
                .type(text)
                .keyDown('enter')
                .keyUp('enter');
        });

        QUnit.test('should be fired with attachments in args when the send button is clicked if the textarea is empty and file is attached', function(assert) {
            assert.expect(3);

            const clock = sinon.useFakeTimers();
            this.reinit({
                onMessageEntered: ({ attachments }) => {
                    assert.notStrictEqual(attachments, undefined, 'attachments argument is passed');
                    assert.strictEqual(attachments[0].name, 'file.png', 'attachments name is correct');
                    assert.strictEqual(attachments[0].size, 123, 'attachments size is correct');
                },
                fileUploaderOptions: {
                    uploadFile: () => {},
                }
            });
            this.fileUploader.option('value', [ { name: 'file.png', size: 123 }]);
            this.fileUploader.upload();

            clock.tick();

            this.$sendButton.trigger('dxclick');

            clock.restore();
        });
    });

    QUnit.module('onMessageEditCanceled event', () => {
        QUnit.test('should be fired when the Cancel button is clicked and editing is active', function(assert) {
            const onMessageEditCanceled = sinon.stub();

            this.reinit({ onMessageEditCanceled, text: 'editing text' });

            keyboardMock(this.$input)
                .focus()
                .type('new text message');

            this.getCancelButton().trigger('dxclick');

            assert.strictEqual(onMessageEditCanceled.callCount, 1, 'Event fired once on cancel');
        });

        QUnit.test('should not be fired when the Cancel button is clicked and text option is empty', function(assert) {
            const onMessageEditCanceled = sinon.stub();

            this.reinit({ onMessageEditCanceled });

            keyboardMock(this.$input)
                .focus()
                .type('new text message');

            this.getCancelButton().trigger('dxclick');

            assert.strictEqual(onMessageEditCanceled.callCount, 0, 'Event was not fired because text was not set');
        });

        QUnit.test('should be fired when Escape key is pressed during editing', function(assert) {
            const onMessageEditCanceled = sinon.stub();

            this.reinit({ onMessageEditCanceled });
            this.instance.option('text', 'test');

            keyboardMock(this.$input)
                .focus()
                .type('some text')
                .press('esc');

            assert.strictEqual(onMessageEditCanceled.callCount, 1, 'Event fired once on Escape press');
        });
    });

    QUnit.module('onMessageUpdating event', () => {
        QUnit.test('should be fired when the Send button is clicked and text is defined', function(assert) {
            const onMessageUpdating = sinon.stub();

            this.reinit({ onMessageUpdating, text: 'edited text' });

            keyboardMock(this.$input)
                .focus()
                .type('new text message');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onMessageUpdating.callCount, 1, 'Event fired once on send with defined text');
        });

        QUnit.test('should not be fired when the Send button is clicked and text option is empty', function(assert) {
            const onMessageUpdating = sinon.stub();

            this.reinit({ onMessageUpdating });

            keyboardMock(this.$input)
                .focus()
                .type('new text message');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onMessageUpdating.callCount, 0, 'Event was not fired because text option was not set');
        });
    });

    QUnit.module('onTypingStart event', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();

            moduleConfig.beforeEach.apply(this, arguments);
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        QUnit.test('should be triggered once if a character is entered in the input', function(assert) {
            const onTypingStartStub = sinon.stub();

            this.reinit({ onTypingStart: onTypingStartStub });

            keyboardMock(this.$input)
                .focus()
                .type('n');

            assert.strictEqual(onTypingStartStub.callCount, 1);
        });

        QUnit.test('should be possible to update it at runtime', function(assert) {
            const onTypingStartStub = sinon.stub();

            this.instance.option('onTypingStart', onTypingStartStub);

            keyboardMock(this.$input)
                .focus()
                .type('n');

            assert.strictEqual(onTypingStartStub.callCount, 1);
        });

        QUnit.test('should be possible to update it at runtime if init value is function', function(assert) {
            this.reinit({ onTypingStart: () => {} });

            const onTypingStartStub = sinon.stub();

            this.instance.option('onTypingStart', onTypingStartStub);

            keyboardMock(this.$input)
                .focus()
                .type('n');

            assert.strictEqual(onTypingStartStub.callCount, 1);
        });

        [' ', '\n'].forEach(value => {
            QUnit.test(`should be triggered if an empty character is entered in the input, value is '${value}'`, function(assert) {
                const onTypingStartStub = sinon.stub();

                this.reinit({ onTypingStart: onTypingStartStub });

                keyboardMock(this.$input)
                    .focus()
                    .type(value);

                assert.strictEqual(onTypingStartStub.callCount, 1);
            });
        });

        ['n', 'no'].forEach(value => {
            QUnit.test(`should be triggered if backspace was pressed after ${value.length} character(s) was entered`, function(assert) {
                const onTypingStartStub = sinon.stub();

                this.reinit({ onTypingStart: onTypingStartStub });

                const keyboard = keyboardMock(this.$input);

                keyboard
                    .focus()
                    .type(value);

                this.clock.tick(TYPING_END_DELAY);

                keyboard.press('backspace');

                assert.strictEqual(onTypingStartStub.callCount, 2);
            });
        });

        QUnit.test('should be triggered only once during continuous typing', function(assert) {
            const onTypingStartStub = sinon.stub();

            this.reinit({ onTypingStart: onTypingStartStub });

            const keyboard = keyboardMock(this.$input);

            keyboard
                .focus()
                .type('n');

            assert.strictEqual(onTypingStartStub.callCount, 1, 'called once');

            keyboard.type('o');

            assert.strictEqual(onTypingStartStub.callCount, 1, 'still called once');

            this.clock.tick(TYPING_END_DELAY - 500);

            keyboard.type('t');

            assert.strictEqual(onTypingStartStub.callCount, 1, 'still called once');

            this.clock.tick(TYPING_END_DELAY + 500);

            keyboard.type('e');

            assert.strictEqual(onTypingStartStub.callCount, 2, 'called again after typing end');
        });

        QUnit.test('should be triggered with correct arguments', function(assert) {
            assert.expect(4);

            this.reinit({
                onTypingStart: (e) => {
                    const { component, element, event } = e;

                    assert.strictEqual(component, this.instance, 'component field is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                    assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                    assert.strictEqual(event.type, 'input', 'e.event.type is correct');
                },
            });

            keyboardMock(this.$input)
                .focus()
                .type('n');
        });
    });

    QUnit.module('onTypingEnd event', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();

            moduleConfig.beforeEach.apply(this, arguments);
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        QUnit.test('should be triggered once if a character is entered in the input', function(assert) {
            const onTypingEndStub = sinon.stub();

            this.reinit({ onTypingEnd: onTypingEndStub });

            const keyboard = keyboardMock(this.$input);

            keyboard
                .focus()
                .type('n');

            assert.strictEqual(onTypingEndStub.callCount, 0, 'is not called immediately after entering');

            this.clock.tick(TYPING_END_DELAY - 500);

            assert.strictEqual(onTypingEndStub.callCount, 0, 'is not called still');

            this.clock.tick(500);

            assert.strictEqual(onTypingEndStub.callCount, 1, 'is called once after delay');
        });

        QUnit.test('should be possible to update it at runtime', function(assert) {
            const onTypingEndStub = sinon.stub();

            this.instance.option('onTypingEnd', onTypingEndStub);

            keyboardMock(this.$input)
                .focus()
                .type('n');

            this.clock.tick(TYPING_END_DELAY);

            assert.strictEqual(onTypingEndStub.callCount, 1);
        });

        QUnit.test('should not be called if the user continues to enter text during the delay', function(assert) {
            const onTypingEndStub = sinon.stub();

            this.reinit({ onTypingEnd: onTypingEndStub });

            const keyboard = keyboardMock(this.$input);

            keyboard
                .focus()
                .type('n');

            this.clock.tick(TYPING_END_DELAY - 10);

            keyboard.type('n');

            this.clock.tick(20);

            assert.strictEqual(onTypingEndStub.callCount, 0, 'is not called');

            this.clock.tick(TYPING_END_DELAY);

            assert.strictEqual(onTypingEndStub.callCount, 1, 'is called once after delay');
        });

        [' ', '\n'].forEach(value => {
            QUnit.test(`should be triggered if an empty character is entered in the input, value is '${value}'`, function(assert) {
                const onTypingEndStub = sinon.stub();

                this.reinit({ onTypingEnd: onTypingEndStub });

                keyboardMock(this.$input)
                    .focus()
                    .type(value);

                this.clock.tick(TYPING_END_DELAY);

                assert.strictEqual(onTypingEndStub.callCount, 1);
            });
        });

        QUnit.test('should be triggered with correct arguments', function(assert) {
            assert.expect(3);

            this.reinit({
                onTypingEnd: (e) => {
                    const { component, element } = e;

                    assert.strictEqual(component, this.instance, 'component field is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                    assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                },
            });

            keyboardMock(this.$input)
                .focus()
                .type('n');

            this.clock.tick(TYPING_END_DELAY);
        });

        QUnit.test('should be called after sending a message', function(assert) {
            const onTypingEndStub = sinon.stub();

            this.reinit({ onTypingEnd: onTypingEndStub });

            keyboardMock(this.$input)
                .focus()
                .type('new text message');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onTypingEndStub.callCount, 1, 'called immediately');
        });
    });

    QUnit.module('Proxy state options', () => {
        [true, false].forEach(value => {
            QUnit.test('passed state options should be equal message box state options', function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.reinit({
                    ...options,
                    text: 'message text'
                });

                const editingPreview = this.getEditingPreviewInstance();

                Object.entries(options).forEach(([key, value]) => {
                    assert.deepEqual(value, this.sendButton.option(key), `button ${key} value is correct`);
                    assert.deepEqual(value, this.textArea.option(key), `textarea ${key} value is correct`);
                    assert.deepEqual(value, editingPreview.option(key), `editing preview ${key} value is correct`);
                });
            });

            QUnit.test('passed state options should be updated when state options are changed in runtime', function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.instance.option({
                    ...options,
                    text: 'message text'
                });

                const editingPreview = this.getEditingPreviewInstance();

                Object.entries(options).forEach(([key, value]) => {
                    assert.deepEqual(value, this.sendButton.option(key), `button ${key} value is correct`);
                    assert.deepEqual(value, this.textArea.option(key), `textarea ${key} value is correct`);
                    assert.deepEqual(value, editingPreview.option(key), `editing preview ${key} value is correct`);
                });
            });
        });
    });

    QUnit.module('Integration with ChatTextArea', () => {
        QUnit.test('should pass fileUploaderOptions to ChatTextArea on initialization', function(assert) {
            const fileUploaderOptions = {
                uploadMode: 'instantly',
            };

            this.reinit({ fileUploaderOptions });

            const chatTextArea = ChatTextArea.getInstance(this.$textArea);

            assert.deepEqual(
                chatTextArea.option('fileUploaderOptions'),
                fileUploaderOptions,
                'fileUploaderOptions is passed to ChatTextArea'
            );
        });

        QUnit.test('should update fileUploaderOptions in ChatTextArea at runtime', function(assert) {
            const fileUploaderOptions = {
                uploadMode: 'useButtons',
            };

            this.instance.option('fileUploaderOptions', fileUploaderOptions);

            const chatTextArea = ChatTextArea.getInstance(this.$textArea);

            assert.deepEqual(
                chatTextArea.option('fileUploaderOptions'),
                fileUploaderOptions,
                'fileUploaderOptions updated in ChatTextArea'
            );
        });

        QUnit.test('should transform ChatTextArea onSend event to onMessageEntered when not editing', function(assert) {
            const onMessageEnteredStub = sinon.stub();
            const onMessageUpdatingStub = sinon.stub();

            this.reinit({
                onMessageEntered: onMessageEnteredStub,
                onMessageUpdating: onMessageUpdatingStub,
            });

            keyboardMock(this.$input)
                .focus()
                .type('new message');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onMessageEnteredStub.callCount, 1, 'onMessageEntered fired once');
            assert.strictEqual(onMessageUpdatingStub.callCount, 0, 'onMessageUpdating not fired');
        });

        QUnit.test('should transform ChatTextArea onSend event to onMessageUpdating when editing', function(assert) {
            const onMessageEnteredStub = sinon.stub();
            const onMessageUpdatingStub = sinon.stub();

            this.reinit({
                onMessageEntered: onMessageEnteredStub,
                onMessageUpdating: onMessageUpdatingStub,
                text: 'original text',
            });

            keyboardMock(this.$input)
                .focus()
                .type('updated text');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onMessageEnteredStub.callCount, 0, 'onMessageEntered not fired');
            assert.strictEqual(onMessageUpdatingStub.callCount, 1, 'onMessageUpdating fired once');
        });

        QUnit.test('should pass correct text to onMessageUpdating from ChatTextArea', function(assert) {
            assert.expect(1);

            const originalText = 'original';
            const newText = 'updated message text';

            this.reinit({
                text: originalText,
                onMessageUpdating: (e) => {
                    assert.strictEqual(e.text, `${newText}${originalText}`, 'correct text passed to onMessageUpdating');
                },
            });

            keyboardMock(this.$input)
                .focus()
                .type(newText);

            this.$sendButton.trigger('dxclick');
        });
    });

    QUnit.module('Integration with EditingPreview', () => {
        QUnit.test('should render EditingPreview when text option is set on initialization', function(assert) {
            this.reinit({ text: 'editing text' });

            const $editingPreview = this.getEditingPreview();
            const editingPreviewInstance = this.getEditingPreviewInstance();

            assert.strictEqual($editingPreview.length, 1, 'EditingPreview is rendered');
            assert.strictEqual(
                editingPreviewInstance.option('text'),
                'editing text',
                'EditingPreview has correct text'
            );
        });

        QUnit.test('should not render EditingPreview when text option is empty', function(assert) {
            this.reinit({ text: '' });

            const $editingPreview = this.getEditingPreview();

            assert.strictEqual($editingPreview.length, 0, 'EditingPreview is not rendered');
        });

        QUnit.test('should render EditingPreview when text option is set at runtime', function(assert) {
            this.instance.option('text', 'new editing text');

            const $editingPreview = this.getEditingPreview();
            const editingPreviewInstance = this.getEditingPreviewInstance();

            assert.strictEqual($editingPreview.length, 1, 'EditingPreview is rendered');
            assert.strictEqual(
                editingPreviewInstance.option('text'),
                'new editing text',
                'EditingPreview has correct text'
            );
        });

        QUnit.test('should remove EditingPreview when text option is cleared at runtime', function(assert) {
            this.reinit({ text: 'editing text' });

            assert.strictEqual(this.getEditingPreview().length, 1, 'EditingPreview initially rendered');

            this.instance.option('text', '');

            assert.strictEqual(this.getEditingPreview().length, 1, 'EditingPreview is not removed after clearing text');
        });

        QUnit.test('should sync text between EditingPreview and ChatTextArea value', function(assert) {
            this.reinit({ text: 'editing message' });

            assert.strictEqual(this.$input.val(), 'editing message', 'ChatTextArea value initially synced');

            this.instance.option('text', 'modified message');

            assert.strictEqual(this.$input.val(), 'modified message', 'ChatTextArea value updated');
        });
    });

    QUnit.module('Mode switching', () => {
        QUnit.test('should switch from creation mode to editing mode when text is set', function(assert) {
            assert.strictEqual(this.instance.option('text'), '', 'initially in creation mode');
            assert.strictEqual(this.getEditingPreview().length, 0, 'no EditingPreview in creation mode');

            this.instance.option('text', 'message to edit');

            assert.strictEqual(this.getEditingPreview().length, 1, 'EditingPreview appears in editing mode');
            assert.strictEqual(this.$input.val(), 'message to edit', 'ChatTextArea filled with text');
        });

        QUnit.test('should switch from editing mode to creation mode when text is cleared', function(assert) {
            this.reinit({ text: 'editing message' });

            assert.strictEqual(this.getEditingPreview().length, 1, 'initially in editing mode');

            this.instance.option('text', '');

            assert.strictEqual(this.getEditingPreview().length, 1, 'EditingPreview has not been removed in creation mode');
            assert.strictEqual(this.$input.val(), '', 'ChatTextArea cleared');
        });

        QUnit.test('should use onMessageEntered in creation mode and onMessageUpdating in editing mode', function(assert) {
            const onMessageEnteredStub = sinon.stub();
            const onMessageUpdatingStub = sinon.stub();

            this.reinit({
                onMessageEntered: onMessageEnteredStub,
                onMessageUpdating: onMessageUpdatingStub,
            });

            keyboardMock(this.$input).focus().type('new message');
            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onMessageEnteredStub.callCount, 1, 'onMessageEntered called in creation mode');
            assert.strictEqual(onMessageUpdatingStub.callCount, 0, 'onMessageUpdating not called in creation mode');

            this.instance.option('text', 'edit this');

            keyboardMock(this.$input).focus().type('edited message');
            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onMessageEnteredStub.callCount, 1, 'onMessageEntered still called once');
            assert.strictEqual(onMessageUpdatingStub.callCount, 1, 'onMessageUpdating called in editing mode');
        });

        QUnit.test('Escape key should cancel editing and switch to creation mode', function(assert) {
            this.reinit({ text: 'original message' });

            assert.strictEqual(this.getEditingPreview().length, 1, 'in editing mode');

            keyboardMock(this.$input).focus().press('esc');

            assert.strictEqual(this.instance.option('text'), '', 'text cleared');
            assert.strictEqual(this.getEditingPreview().length, 1, 'EditingPreview has not been removed');
            assert.strictEqual(this.$input.val(), '', 'ChatTextArea cleared');
        });
    });

    QUnit.module('Keyboard navigation', () => {
        QUnit.test('textarea should be cleared on escape key when some message is editing', function(assert) {
            this.instance.option('text', 'test');

            keyboardMock(this.$input)
                .focus()
                .type('some text')
                .press('esc');

            assert.strictEqual(this.$input.val(), '');
        });

        QUnit.test('textarea should not be cleared on escape key when no message is editing', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('some text')
                .press('esc');

            assert.strictEqual(this.$input.val(), 'some text');
        });

        QUnit.test('Editing preview should be cleared when Escape key is pressed during editing', function(assert) {
            this.instance.option('text', 'test');

            const editingPreview = this.getEditingPreviewInstance();
            assert.strictEqual(editingPreview.option('text'), 'test', 'Initial text is set in editing preview');

            keyboardMock(this.$input)
                .focus()
                .type('some text')
                .press('esc');

            assert.strictEqual(editingPreview.option('text'), '', 'Editing preview text is cleared after pressing Escape');
        });

        QUnit.test('Text option should update editing preview when changed at runtime', function(assert) {
            this.instance.option('text', 'new text value');

            const editingPreview = this.getEditingPreviewInstance();
            assert.strictEqual(editingPreview.option('text'), 'new text value', 'Updated text is reflected in editing preview');
        });

        QUnit.testInActiveWindow('Textarea should be focused after pressing Escape key', function(assert) {
            this.instance.option('text', 'test');

            keyboardMock(this.$input)
                .focus()
                .type('some text')
                .press('esc');

            assert.strictEqual(this.$textArea.hasClass(FOCUSED_STATE_CLASS), true, 'Textarea is focused after Escape press');
        });

        QUnit.testInActiveWindow('Textarea should not be focused after clicking Send button if text is not empty', function(assert) {
            this.instance.option('text', 'test');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(this.$textArea.hasClass(FOCUSED_STATE_CLASS), false, 'Textarea is not focused after send');
        });

        QUnit.test('Editing preview and textarea should be cleared after clicking the cancel button', function(assert) {
            this.reinit({ text: 'edited text' });

            const editingPreview = this.getEditingPreviewInstance();

            this.getCancelButton().trigger('dxclick');

            assert.strictEqual(this.textArea.option('text'), '', 'Textarea is cleared after cancel');
            assert.strictEqual(editingPreview.option('text'), '', 'Editing preview is cleared after cancel');
        });
    });
});
