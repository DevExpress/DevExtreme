import $ from 'jquery';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';

import ChatTextArea from '__internal/ui/chat/message_box/chat_text_area';
import Button from 'ui/button';
import FileUploader from 'ui/file_uploader';
import { BUTTON_CLASS } from '__internal/ui/button/button';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const FILE_UPLOADER = 'dx-fileuploader';
const FILE_UPLOADER_ATTACH_BUTTON = 'dx-textarea-attach-button';
const FILEUPLOADER_CANCEL_BUTTON_CLASS = 'dx-fileuploader-cancel-button';

const fakeFile = {
    name: 'fakefile.png',
    size: 100023,
    type: 'image/png',
    lastModifiedDate: Date.now()
};


const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new ChatTextArea($('#component'), options);
            this.$element = $(this.instance.$element());
            this.$input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

            const $buttons = this.$element.find(`.${BUTTON_CLASS}`);
            this.$sendButton = $($buttons[$buttons.length - 1]);
            this.sendButton = Button.getInstance(this.$sendButton);
            this.$attachButton = this.$element.find(`.${FILE_UPLOADER_ATTACH_BUTTON}`);
            this.$fileUploader = this.$element.find(`.${FILE_UPLOADER}`);
            this.fileUploader = FileUploader.getInstance(this.$fileUploader);
        };

        this.reinit = (options) => {
            this.instance.dispose();
            init(options);
        };

        init();
    }
};

QUnit.module('ChatTextArea', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof ChatTextArea);
        });

        QUnit.test('send button should be initialized with the corresponding configuration', function(assert) {
            const expectedOptions = {
                icon: 'arrowright',
                type: 'default',
                stylingMode: 'contained',
                disabled: true,
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(this.sendButton.option(key), value, `${key} value is correct`);
            });
        });

        QUnit.test('should have correct default options', function(assert) {
            const expectedOptions = {
                stylingMode: 'outlined',
                placeholder: 'Type a message',
                autoResizeEnabled: true,
                valueChangeEvent: 'input',
                fileUploaderOptions: undefined,
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(this.instance.option(key), value, `${key} value is correct`);
            });
        });
    });

    QUnit.module('Behavior', () => {
        QUnit.test('textarea should be cleared after clicking the send button', function(assert) {
            const text = 'new text message';

            keyboardMock(this.$input)
                .focus()
                .type(text);

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(this.$input.val(), '');
        });

        QUnit.test('textarea should not be cleared when the send button is clicked if the input contains only spaces', function(assert) {
            const emptyValue = '    ';

            keyboardMock(this.$input)
                .focus()
                .type(emptyValue);

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(this.$input.val(), emptyValue);
        });
    });

    QUnit.module('onSend event', () => {
        QUnit.test('should be fired when send button is clicked with valid text', function(assert) {
            const onSendStub = sinon.stub();

            this.reinit({ onSend: onSendStub });

            keyboardMock(this.$input)
                .focus()
                .type('new text message');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onSendStub.callCount, 1);
        });

        QUnit.test('should be fired on enter key if textarea contains valid text', function(assert) {
            const onSendStub = sinon.stub();

            this.reinit({ onSend: onSendStub });

            keyboardMock(this.$input)
                .focus()
                .type('new text message')
                .keyDown('enter')
                .keyUp('enter');

            assert.strictEqual(onSendStub.callCount, 1);
        });

        QUnit.test('should not be fired when send button is clicked if textarea is empty', function(assert) {
            const onSendStub = sinon.stub();

            this.reinit({ onSend: onSendStub });

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onSendStub.callCount, 0);
        });

        QUnit.test('should not be fired on enter key if textarea contains only spaces', function(assert) {
            const onSendStub = sinon.stub();

            this.reinit({ onSend: onSendStub });

            keyboardMock(this.$input)
                .focus()
                .type('   ')
                .keyDown('enter')
                .keyUp('enter');

            assert.strictEqual(onSendStub.callCount, 0);
        });

        QUnit.test('should be possible to update it at runtime', function(assert) {
            const onSendStub = sinon.stub();

            this.instance.option('onSend', onSendStub);

            keyboardMock(this.$input)
                .focus()
                .type('new text message');

            this.$sendButton.trigger('dxclick');

            assert.strictEqual(onSendStub.callCount, 1);
        });

        QUnit.test('should be fired with correct arguments on button click', function(assert) {
            assert.expect(4);

            const text = 'new text message';

            this.reinit({
                onSend: (e) => {
                    const { component, element, event } = e;

                    assert.strictEqual(component, this.instance, 'component is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is renderer');
                    assert.strictEqual($(element).is(this.$element), true, 'element is correct');
                    assert.strictEqual(event.type, 'dxclick', 'event.type is correct');
                },
            });

            keyboardMock(this.$input).focus().type(text);
            this.$sendButton.trigger('dxclick');
        });

        QUnit.test('should be fired with correct arguments on enter key', function(assert) {
            assert.expect(5);

            const text = 'new text message';

            this.reinit({
                onSend: (e) => {
                    const { component, element, event } = e;

                    assert.strictEqual(component, this.instance, 'component is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is renderer');
                    assert.strictEqual($(element).is(this.$element), true, 'element is correct');
                    assert.strictEqual(event.type, 'keyup', 'event.type is correct');
                    assert.strictEqual(event.target, this.$input.get(0), 'event.target is correct');
                },
            });

            keyboardMock(this.$input)
                .focus()
                .type(text)
                .keyDown('enter')
                .keyUp('enter');
        });
    });

    QUnit.module('Keyboard navigation', () => {
        QUnit.test('textarea should not be cleared on enter if text contains only spaces', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('   ')
                .keyDown('enter')
                .keyUp('enter');

            assert.strictEqual(this.$input.val(), '   ');
        });

        QUnit.test('textarea should be cleared on enter when valid text is entered', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('some text')
                .keyDown('enter')
                .keyUp('enter');

            assert.strictEqual(this.$input.val(), '');
        });

        QUnit.test('enter keydown should be prevented if input has non-space characters', function(assert) {
            const enterKeyDownEvent = $.Event('keydown', { key: 'enter' });

            keyboardMock(this.$input).type('1');

            this.$input.trigger(enterKeyDownEvent);

            assert.ok(enterKeyDownEvent.isDefaultPrevented(), 'default is prevented');
        });

        QUnit.test('enter keydown with Shift should not be prevented', function(assert) {
            const enterKeyDownEvent = $.Event('keydown', { key: 'enter', shiftKey: true });

            keyboardMock(this.$input).focus().type('1');

            this.$input.trigger(enterKeyDownEvent);

            assert.notOk(enterKeyDownEvent.isDefaultPrevented(), 'default is not prevented');
        });

        QUnit.test('enter keydown should not be prevented if text has only spaces', function(assert) {
            const enterKeyDownEvent = $.Event('keydown', { key: 'enter' });

            keyboardMock(this.$input).type('  \n  \n');

            this.$input.trigger(enterKeyDownEvent);

            assert.notOk(enterKeyDownEvent.isDefaultPrevented(), 'default is not prevented');
        });

        QUnit.test('textarea should restore height after enter with multiline text', function(assert) {
            const initialHeight = this.$element.height();

            keyboardMock(this.$input)
                .type('1\n2\n3')
                .keyDown('enter')
                .keyUp('enter');

            assert.roughEqual(this.$element.height(), initialHeight, 0.1, 'height is restored');
        });
    });

    QUnit.module('Proxy state options', () => {
        [true, false].forEach(value => {
            QUnit.test('passed state options should be equal chat textarea state options', function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.reinit(options);

                Object.entries(options).forEach(([key, value]) => {
                    assert.deepEqual(value, this.sendButton.option(key), `button ${key} value is correct`);
                });
            });

            QUnit.test('passed state options should be updated when state options are changed in runtime', function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.instance.option(options);

                Object.entries(options).forEach(([key, value]) => {
                    assert.deepEqual(value, this.sendButton.option(key), `button ${key} value is correct`);
                });
            });
        });
    });

    QUnit.module('FileUploader', () => {
        QUnit.test('should not be rendered if fileUploaderOptions are undefined', function(assert) {
            this.reinit({
                fileUploaderOptions: undefined,
            });

            assert.strictEqual(this.$fileUploader.length, 0, 'file uploader is not added');
        });

        QUnit.test('should be rendered if fileUploaderOptions are specified', function(assert) {
            this.reinit({
                fileUploaderOptions: {},
            });

            assert.strictEqual(this.$fileUploader.length, 1, 'file uploader is not rendered');
            assert.strictEqual(this.fileUploader instanceof FileUploader, true, 'file uploader has correct instance');
        });

        QUnit.test('should not be rendered after fileUploaderOptions runtime updated', function(assert) {
            assert.strictEqual(this.$fileUploader.length, 0, 'file uploader is not added');

            this.instance.option('fileUploaderOptions', {});

            const $fileUploader = this.$element.find(`.${FILE_UPLOADER}`);

            assert.strictEqual($fileUploader.length, 1, 'file uploader is added');
        });

        [
            { name: 'uploadMode', value: 'instantly' },
            { name: '_hideCancelButtonOnUpload', value: false },
            { name: '_showFileIcon', value: true },
            { name: '_cancelButtonPosition', value: 'end' },
            { name: 'multiple', value: true },
        ].forEach(({ name, value }) => {
            QUnit.test(`${name} should equal ${value} by default`, function(assert) {
                this.reinit({
                    fileUploaderOptions: {},
                });

                assert.strictEqual(this.fileUploader.option(name), value);
            });
        });

        QUnit.test('It should be possible to redefine fileUploaderOptions.multiple option', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    multiple: false,
                },
            });

            assert.strictEqual(this.fileUploader.option('multiple'), false, 'multiple option is redefined');
        });

        QUnit.test('It should not be possible to redefine fileUploaderOptions.uploadMode option', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    uploadMode: 'useButtons',
                },
            });

            assert.strictEqual(this.fileUploader.option('uploadMode'), 'instantly', 'uploadMode option is not redefined');
        });

        QUnit.test('visible option should equal false when value is empty', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    value: [],
                }
            });

            assert.strictEqual(this.fileUploader.option('visible'), false, 'fileUploader is not visible');
        });

        QUnit.test('visible option should equal true when value is not empty', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    value: [fakeFile],
                }
            });

            assert.strictEqual(this.fileUploader.option('visible'), true, 'fileUploader is visible');
        });

        QUnit.test('visible option should change after runtime file adding', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    value: [fakeFile],
                }
            });

            assert.strictEqual(this.fileUploader.option('visible'), true, 'fileUploader is visible');

            this.fileUploader.option('value', []);

            assert.strictEqual(this.fileUploader.option('visible'), false, 'fileUploader is hidden');
        });

        QUnit.test('dialogTrigger option should equal attach button element', function(assert) {
            this.reinit({
                fileUploaderOptions: {}
            });

            const $dialogTrigger = $(this.fileUploader.option('dialogTrigger'));

            assert.strictEqual($dialogTrigger.is(this.$attachButton), true);
        });

        QUnit.test('onValueChanged specified by user should be called in addition to inner one', function(assert) {
            assert.expect(1);

            this.reinit({
                fileUploaderOptions: {
                    onValueChanged: () => {
                        assert.ok(true, 'onValueChanged was called');
                    },
                }
            });

            this.fileUploader.option('value', [fakeFile]);
        });
    });

    QUnit.module('SendButton state', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        QUnit.test('send button should be enabled after entering any character', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('i');

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, false);
        });

        QUnit.test('send button should be disabled after entering any character and clicking the button', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('i');

            this.$sendButton.trigger('dxclick');

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });

        QUnit.test('send button should be disabled after entering only spaces', function(assert) {
            const emptyValue = '    ';

            keyboardMock(this.$input)
                .focus()
                .type(emptyValue);

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });

        QUnit.test('send button should be disabled after entering only line breaks', function(assert) {
            const lineBreakValue = '\n';

            keyboardMock(this.$input)
                .focus()
                .type(lineBreakValue);

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });

        QUnit.test('send button should be disabled after entering character and removing it', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('i')
                .press('backspace');

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });

        QUnit.test('send button should be enabled after adding and uploading files', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    uploadFile: () => {},
                },
            });

            this.fileUploader.option('value', [fakeFile]);
            this.fileUploader.upload();

            this.clock.tick();

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, false);
        });

        QUnit.test('send button should be disabled after adding and before uploading', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    uploadFile: () => {},
                },
            });

            this.fileUploader.option('value', [fakeFile]);

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });

        QUnit.test('send button should be disabled after adding, uploading and removing', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    uploadFile: () => {},
                },
            });

            this.fileUploader.option('value', [fakeFile]);
            this.fileUploader.upload();

            this.clock.tick();

            const $cancelButton = this.$element.find(`.${FILEUPLOADER_CANCEL_BUTTON_CLASS}`);

            $cancelButton.trigger('dxclick');

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });
    });
});
