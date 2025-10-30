import $ from 'jquery';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';

import ChatTextArea from '__internal/ui/chat/message_box/chat_text_area';
import Button from 'ui/button';
import FileUploader from 'ui/file_uploader';
import { BUTTON_CLASS } from '__internal/ui/button/button';
import Informer from 'ui/informer';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const FILE_UPLOADER = 'dx-fileuploader';
const FILE_UPLOADER_ATTACH_BUTTON = 'dx-chat-textarea-attach-button';
const FILEUPLOADER_CANCEL_BUTTON_CLASS = 'dx-fileuploader-cancel-button';

const fakeFile = {
    name: 'fakefile.png',
    size: 100023,
    type: 'image/png',
    lastModifiedDate: Date.now()
};

const INFORMER_CLASS = 'dx-informer';
const INFORMER_TEXT_CLASS = 'dx-informer-text';

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
            this.getFileUploader = () => FileUploader.getInstance(this.$element.find(`.${FILE_UPLOADER}`));
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
                fileUploaderOptions: undefined,
                maxHeight: '16em',
                valueChangeEvent: 'input',
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

    QUnit.module('FileUploader', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
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
            assert.strictEqual(this.getFileUploader() instanceof FileUploader, true, 'file uploader has correct instance');
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

                assert.strictEqual(this.getFileUploader().option(name), value);
            });
        });

        QUnit.test('It should be possible to redefine fileUploaderOptions.multiple option', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    multiple: false,
                },
            });

            assert.strictEqual(this.getFileUploader().option('multiple'), false, 'multiple option is redefined');
        });

        QUnit.test('It should not be possible to redefine fileUploaderOptions.uploadMode option', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    uploadMode: 'useButtons',
                },
            });

            assert.strictEqual(this.getFileUploader().option('uploadMode'), 'instantly', 'uploadMode option is not redefined');
        });

        QUnit.test('visible option should equal false when value is empty', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    value: [],
                }
            });

            assert.strictEqual(this.getFileUploader().option('visible'), false, 'fileUploader is not visible');
        });

        QUnit.test('visible option should equal true when value is not empty', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    value: [fakeFile],
                }
            });

            assert.strictEqual(this.getFileUploader().option('visible'), true, 'fileUploader is visible');
        });

        QUnit.test('visible option should change after runtime file adding', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    value: [fakeFile],
                }
            });
            const fileUploader = this.getFileUploader();

            assert.strictEqual(fileUploader.option('visible'), true, 'fileUploader is visible');

            fileUploader.option('value', []);

            assert.strictEqual(fileUploader.option('visible'), false, 'fileUploader is hidden');
        });

        QUnit.test('dialogTrigger option should equal attach button element', function(assert) {
            this.reinit({
                fileUploaderOptions: {}
            });

            const $dialogTrigger = $(this.getFileUploader().option('dialogTrigger'));

            assert.strictEqual($dialogTrigger.is(this.$attachButton), true);
        });
        ['onValueChanged', 'onUploadStarted', 'onUploaded'].forEach((eventName) => {
            QUnit.test(`${eventName} specified by user should be called in addition to inner one`, function(assert) {
                assert.expect(1);

                this.reinit({
                    fileUploaderOptions: {
                        [eventName]: () => {
                            assert.ok(true, `${eventName} was called`);
                        },
                        uploadFile: () => {},
                    }
                });

                const fileUploader = this.getFileUploader();

                fileUploader.option('value', [fakeFile]);
                fileUploader.upload();
            });
        });

        QUnit.test('value should be reset after send button click', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    uploadFile: () => {},
                },
            });
            const fileUploader = this.getFileUploader();
            fileUploader.option('value', [fakeFile]);
            fileUploader.upload();

            this.clock.tick();
            this.$sendButton.trigger('dxclick');

            assert.deepEqual(fileUploader.option('value'), []);
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
            const fileUploader = this.getFileUploader();
            fileUploader.option('value', [fakeFile]);
            fileUploader.upload();

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

            this.getFileUploader().option('value', [fakeFile]);

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });

        QUnit.test('send button should be disabled after adding, uploading and removing', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    uploadFile: () => {},
                },
            });
            const fileUploader = this.getFileUploader();
            fileUploader.option('value', [fakeFile]);
            fileUploader.upload();

            this.clock.tick();

            const $cancelButton = this.$element.find(`.${FILEUPLOADER_CANCEL_BUTTON_CLASS}`);

            $cancelButton.trigger('dxclick');

            const { disabled } = this.sendButton.option();

            assert.strictEqual(disabled, true);
        });
    });

    QUnit.module('Informer integration', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();

            this.getInformer = () => this.instance._informer;
            this.showInformer = (text) => this.instance._showInformer(text);
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        QUnit.module('Render', () => {
            QUnit.test('informer should not be rendered by default', function(assert) {
                const $informer = this.$element.find(`.${INFORMER_CLASS}`);

                assert.strictEqual($informer.length, 0, 'informer is not rendered');
                assert.strictEqual(this.getInformer(), undefined, 'informer instance is undefined');
            });

            QUnit.test('informer should be rendered when _showInformer is called', function(assert) {
                this.showInformer('Test error message');

                const $informer = this.$element.find(`.${INFORMER_CLASS}`);

                assert.strictEqual($informer.length, 1, 'informer is rendered');
                assert.ok(this.getInformer() instanceof Informer, 'informer instance is created');
            });

            QUnit.test('informer should have correct options on initialization', function(assert) {
                const errorMessage = 'Test error message';

                this.showInformer(errorMessage);

                const informer = this.getInformer();
                const expectedOptions = {
                    text: errorMessage,
                    contentAlignment: 'start',
                    icon: 'errorcircle',
                };

                Object.entries(expectedOptions).forEach(([key, value]) => {
                    assert.strictEqual(informer.option(key), value, `${key} option is correct`);
                });
            });

            QUnit.test('informer should be rendered as first element', function(assert) {
                this.showInformer('Test error');

                const $informer = this.$element.find(`.${INFORMER_CLASS}`);

                assert.strictEqual($informer.index(), 0, 'informer is first element');
            });
        });

        QUnit.module('Timeout behavior', () => {
            QUnit.test('informer should be hidden after INFORMER_DELAY timeout', function(assert) {
                this.showInformer('Test error');

                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 1, 'informer is visible initially');

                this.clock.tick(10000);

                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 0, 'informer is hidden after timeout');
                assert.strictEqual(this.getInformer(), null, 'informer instance is null after timeout');
            });

            QUnit.test('timeout should be reset when _showInformer is called again', function(assert) {
                this.showInformer('First message');

                this.clock.tick(5000);

                this.showInformer('Second message');

                this.clock.tick(5000);

                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 1, 'informer is still visible');

                this.clock.tick(5000);

                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 0, 'informer is hidden after full timeout from second call');
            });
        });

        QUnit.module('Height calculation', () => {
            QUnit.test('element height should increase by exact informer height plus gap when informer is shown', function(assert) {
                const initialHeight = this.$element.outerHeight();

                this.showInformer('Test error message');

                const $informer = this.$element.find(`.${INFORMER_CLASS}`);
                const informerHeight = $informer.outerHeight();
                const gap = parseFloat(this.$element.css('gap'));
                const heightWithInformer = this.$element.outerHeight();

                assert.strictEqual(heightWithInformer, initialHeight + informerHeight + gap, 'element height increased by informer height plus gap');
            });

            QUnit.test('element height should return to initial value after informer is hidden', function(assert) {
                const initialHeight = this.$element.outerHeight();

                this.showInformer('Test error message');

                this.clock.tick(10000);

                const heightAfterHiding = this.$element.outerHeight();

                assert.strictEqual(heightAfterHiding, initialHeight, 'element height returned to initial value');
            });
        });

        QUnit.module('Cleanup', () => {
            QUnit.test('informer should be disposed when instance is disposed', function(assert) {
                this.showInformer('Test error');

                const informer = this.getInformer();

                this.instance.dispose();

                assert.strictEqual(informer._disposed, true, 'informer instance is disposed');
                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 0, 'informer element is removed');
            });
        });

        QUnit.module('Integration with FileUploader', () => {
            QUnit.test('clicking file uploader button should show informer with file limit error', function(assert) {
                this.reinit({ fileUploaderOptions: {} });

                const $attachButton = this.$element.find(`.${BUTTON_CLASS}`).eq(0);

                $attachButton.trigger('dxclick');

                const $informer = this.$element.find(`.${INFORMER_CLASS}`);
                const $informerText = this.$element.find(`.${INFORMER_TEXT_CLASS}`);

                assert.strictEqual($informer.length, 1, 'informer is shown');
                assert.strictEqual($informerText.text(), 'You selected too many files. Select no more than 10 files and retry.', 'error message is correct');
            });
        });
    });
});
