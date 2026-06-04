import $ from 'jquery';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import messageLocalization from 'common/core/localization/message';

import ChatTextArea, {
    CHAT_TEXT_AREA_ATTACH_BUTTON,
    DEFAULT_ALLOWED_FILE_EXTENSIONS,
    STT_INITIAL_STATE,
    STT_LISTENING_STATE,
    SEND_BUTTON_INITIAL_STATE,
    SEND_BUTTON_READY_TO_SEND_STATE,
    SEND_BUTTON_CUSTOM_ACTIVE_STATE,
} from '__internal/ui/chat/message_box/chat_text_area';
import Button from 'ui/button';
import FileUploader, { FILEUPLOADER_CLASS, FILEUPLOADER_CANCEL_BUTTON_CLASS } from '__internal/ui/file_uploader/file_uploader';
import { BUTTON_CLASS } from '__internal/ui/button/button';
import Informer, { INFORMER_CLASS, INFORMER_TEXT_CLASS } from '__internal/ui/informer/informer';
import SpeechToText, { SPEECH_TO_TEXT_CLASS } from '__internal/ui/speech_to_text/speech_to_text';
import { TOOLBAR_BEFORE_CLASS, TOOLBAR_AFTER_CLASS } from '__internal/ui/toolbar/toolbar.base';
import { TEXTEDITOR_INPUT_CLASS } from '__internal/ui/text_box/text_editor.base';
import { TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE } from '__internal/ui/text_area';

const fakeFile = {
    name: 'fakefile.png',
    size: 100023,
    type: 'image/png',
    lastModifiedDate: Date.now(),
};

const moduleConfig = {
    beforeEach: function() {
        this.init = (options = {}) => {
            this.instance = new ChatTextArea($('#component'), options);
            this.$element = $(this.instance.$element());
            this.$input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

            const $buttons = this.$element.find(`.${BUTTON_CLASS}`);

            this.$sendButton = $($buttons[$buttons.length - 1]);
            this.sendButton = Button.getInstance(this.$sendButton);
            this.$attachButton = this.$element.find(`.${CHAT_TEXT_AREA_ATTACH_BUTTON}`);
            this.$fileUploader = this.$element.find(`.${FILEUPLOADER_CLASS}`);
        };

        this.reinit = (options) => {
            this.instance.dispose();
            this.init(options);
        };


        this.getFileUploader = () => FileUploader.getInstance(this.$element.find(`.${FILEUPLOADER_CLASS}`));

        this.typeText = (text) => {
            keyboardMock(this.$input).focus().type(text);
            return this;
        };

        this.clickSendButton = () => {
            this.$sendButton.trigger('dxclick');
            return this;
        };

        this.pressEnter = () => {
            keyboardMock(this.$input).keyDown('enter').keyUp('enter');
            return this;
        };

        this.init();
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
                type: 'normal',
                stylingMode: 'text',
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
                maxHeight: '53.86em',
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

            this.typeText(text).clickSendButton();

            assert.strictEqual(this.$input.val(), '');
        });

        QUnit.test('textarea should not be cleared when the send button is clicked if the input contains only spaces', function(assert) {
            const emptyValue = '    ';

            this.typeText(emptyValue).clickSendButton();

            assert.strictEqual(this.$input.val(), emptyValue);
        });
    });

    QUnit.module('onSend event', () => {
        QUnit.test('should be fired when send button is clicked with valid text', function(assert) {
            const onSendStub = sinon.stub();

            this.reinit({ onSend: onSendStub });

            this.typeText('new text message').clickSendButton();

            assert.strictEqual(onSendStub.callCount, 1);
        });

        QUnit.test('should be fired on enter key if textarea contains valid text', function(assert) {
            const onSendStub = sinon.stub();

            this.reinit({ onSend: onSendStub });

            this.typeText('new text message').pressEnter();

            assert.strictEqual(onSendStub.callCount, 1);
        });

        QUnit.test('should not be fired when send button is clicked if textarea is empty', function(assert) {
            const onSendStub = sinon.stub();

            this.reinit({ onSend: onSendStub });

            this.clickSendButton();

            assert.strictEqual(onSendStub.callCount, 0);
        });

        QUnit.test('should not be fired on enter key if textarea contains only spaces', function(assert) {
            const onSendStub = sinon.stub();

            this.reinit({ onSend: onSendStub });

            this.typeText('   ').pressEnter();

            assert.strictEqual(onSendStub.callCount, 0);
        });

        QUnit.test('should be possible to update it at runtime', function(assert) {
            const onSendStub = sinon.stub();

            this.instance.option('onSend', onSendStub);

            this.typeText('new text message').clickSendButton();

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
            this.typeText('   ').pressEnter();

            assert.strictEqual(this.$input.val(), '   ');
        });

        QUnit.test('textarea should be cleared on enter when valid text is entered', function(assert) {
            this.typeText('some text').pressEnter();

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

            this.typeText('1\n2\n3').pressEnter();

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

            assert.strictEqual(this.$fileUploader.length, 1, 'file uploader is rendered');
            assert.strictEqual(this.getFileUploader() instanceof FileUploader, true, 'file uploader has correct instance');
        });

        QUnit.test('should not be rendered after fileUploaderOptions runtime updated', function(assert) {
            assert.strictEqual(this.$fileUploader.length, 0, 'file uploader is not added');

            this.instance.option('fileUploaderOptions', {});

            const $fileUploader = this.$element.find(`.${FILEUPLOADER_CLASS}`);

            assert.strictEqual($fileUploader.length, 1, 'file uploader is added');
        });

        [
            { name: 'uploadMode', value: 'instantly' },
            { name: '_hideCancelButtonOnUpload', value: false },
            { name: '_showFileIcon', value: true },
            { name: '_cancelButtonPosition', value: 'end' },
            { name: 'multiple', value: true },
            { name: 'allowedFileExtensions', value: DEFAULT_ALLOWED_FILE_EXTENSIONS },
        ].forEach(({ name, value }) => {
            QUnit.test(`${name} should equal ${value} by default`, function(assert) {
                this.reinit({
                    fileUploaderOptions: {},
                });

                assert.strictEqual(this.getFileUploader().option(name), value);
            });
        });

        [
            { name: 'multiple', value: false },
            { name: 'allowedFileExtensions', value: [] },
        ].forEach(({ name, value }) => {
            QUnit.test(`It should be possible to redefine fileUploaderOptions.${name} option`, function(assert) {
                this.reinit({
                    fileUploaderOptions: {
                        [name]: value,
                    },
                });

                assert.strictEqual(this.getFileUploader().option(name), value, `${name} option is redefined`);
            });
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
            this.compareButtonState = (assert, expectedState, sendButton = this.sendButton) => {
                const { stylingMode, type, disabled } = sendButton.option();
                const stateOptions = { stylingMode, type, disabled };

                assert.deepEqual(stateOptions, expectedState, 'send button has correct options');
            };
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        QUnit.test('send button should have correct state after entering any character', function(assert) {
            this.typeText('i');

            this.compareButtonState(assert, SEND_BUTTON_READY_TO_SEND_STATE);
        });

        QUnit.test('send button should have correct state after entering any character and clicking the button', function(assert) {
            this.typeText('i').clickSendButton();

            this.compareButtonState(assert, SEND_BUTTON_INITIAL_STATE);
        });

        ['    ', '\n'].forEach(emptyValue => {
            QUnit.test(`send button should have correct state after entering only "${emptyValue === '\n' ? 'line breaks' : 'spaces'}"`, function(assert) {
                this.typeText(emptyValue);

                this.compareButtonState(assert, SEND_BUTTON_INITIAL_STATE);
            });
        });

        QUnit.test('send button should have correct state after entering character and removing it', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('i')
                .press('backspace');

            this.compareButtonState(assert, SEND_BUTTON_INITIAL_STATE);
        });

        QUnit.test('send button should have correct state after adding and uploading files', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    uploadFile: () => {},
                },
            });
            const fileUploader = this.getFileUploader();
            fileUploader.option('value', [fakeFile]);
            fileUploader.upload();

            this.clock.tick();

            this.compareButtonState(assert, SEND_BUTTON_READY_TO_SEND_STATE);
        });

        QUnit.test('send button should be disabled after adding and before uploading', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    uploadFile: () => {},
                },
            });

            this.getFileUploader().option('value', [fakeFile]);

            this.compareButtonState(assert, SEND_BUTTON_INITIAL_STATE);
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

            this.compareButtonState(assert, SEND_BUTTON_INITIAL_STATE);
        });

        QUnit.test('send button should be disabled after adding files and some of them fail validation', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    uploadFile: () => {},
                    allowedFileExtensions: ['.png'],
                },
            });
            const fileUploader = this.getFileUploader();
            fileUploader.option('value', [fakeFile, { name: 'img.jpg', size: 1 }]);
            fileUploader.upload();

            this.clock.tick();

            this.compareButtonState(assert, SEND_BUTTON_INITIAL_STATE);
        });

        QUnit.test('send button should not be disabled after removing file that fail validation', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    uploadFile: () => {},
                    allowedFileExtensions: ['.jpg'],
                },
            });
            const fileUploader = this.getFileUploader();
            fileUploader.option('value', [fakeFile]);
            fileUploader.upload();

            this.clock.tick();

            this.compareButtonState(assert, SEND_BUTTON_INITIAL_STATE);

            const $cancelButton = this.$element.find(`.${FILEUPLOADER_CANCEL_BUTTON_CLASS}`);

            $cancelButton.trigger('dxclick');

            this.compareButtonState(assert, SEND_BUTTON_INITIAL_STATE);
        });

        QUnit.test('send button should have updated state after speechToText disable during listening state', function(assert) {
            this.reinit({ speechToTextEnabled: true });
            this.typeText('i');

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            speechToTextInstance.option('onStartClick')({});
            this.instance.option('speechToTextEnabled', false);

            const $sendButton = this.$element.find(`.${BUTTON_CLASS}`);
            const sendButton = Button.getInstance($sendButton);

            this.compareButtonState(assert, SEND_BUTTON_READY_TO_SEND_STATE, sendButton);
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
                assert.strictEqual(this.getInformer(), null, 'informer instance is not defined');
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
            QUnit.test('element height should increase when informer is shown', function(assert) {
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

            QUnit.test('element height should account for all visible sections with gaps', function(assert) {
                this.reinit({
                    fileUploaderOptions: {
                        uploadFile: () => {},
                    }
                });

                const fileUploader = this.getFileUploader();
                fileUploader.option('value', [fakeFile]);

                const heightWithFile = this.$element.outerHeight();

                this.showInformer('Test error');

                const heightWithFileAndInformer = this.$element.outerHeight();

                assert.ok(heightWithFileAndInformer > heightWithFile, 'height increases when informer is added to file uploader');
            });

            QUnit.test('element height should decrease when sections are removed', function(assert) {
                this.reinit({
                    fileUploaderOptions: {
                        uploadFile: () => {},
                    }
                });

                const fileUploader = this.getFileUploader();
                fileUploader.option('value', [fakeFile]);

                this.showInformer('Test error');

                const heightWithBoth = this.$element.outerHeight();

                this.clock.tick(10000);

                const heightWithoutInformer = this.$element.outerHeight();

                assert.ok(heightWithoutInformer < heightWithBoth, 'height decreases when informer is removed');

                fileUploader.option('value', []);

                const heightWithoutBoth = this.$element.outerHeight();

                assert.ok(heightWithoutBoth < heightWithoutInformer, 'height decreases when file uploader is hidden');
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

        QUnit.module('Text update behavior', () => {
            QUnit.test('informer text should be updated when _showInformer is called again', function(assert) {
                const firstMessage = 'First error message';
                const secondMessage = 'Second error message';

                this.showInformer(firstMessage);

                let $informerText = this.$element.find(`.${INFORMER_TEXT_CLASS}`);
                assert.strictEqual($informerText.text(), firstMessage, 'first message is shown');

                this.showInformer(secondMessage);

                $informerText = this.$element.find(`.${INFORMER_TEXT_CLASS}`);
                assert.strictEqual($informerText.text(), secondMessage, 'second message is shown');
                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 1, 'only one informer exists');
            });
        });

        QUnit.module('Integration with FileUploader', () => {
            QUnit.test('informer should be shown when file limit is reached', function(assert) {
                this.reinit({
                    fileUploaderOptions: {
                        uploadFile: () => {},
                    }
                });

                const fileUploader = this.getFileUploader();

                fileUploader.option('onFileLimitReached')();

                const $informer = this.$element.find(`.${INFORMER_CLASS}`);
                const $informerText = this.$element.find(`.${INFORMER_TEXT_CLASS}`);

                assert.strictEqual($informer.length, 1, 'informer is shown');
                assert.strictEqual($informerText.text(), 'You selected too many files. Select no more than 10 files and retry.', 'error message is correct');
            });

            QUnit.test('informer should be hidden when attach button is clicked', function(assert) {
                this.reinit({ fileUploaderOptions: {} });

                this.showInformer('Test error');

                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 1, 'informer is visible initially');

                const $attachButton = this.$element.find(`.${CHAT_TEXT_AREA_ATTACH_BUTTON}`);
                $attachButton.trigger('dxclick');

                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 0, 'informer is hidden after attach button click');
                assert.strictEqual(this.getInformer(), null, 'informer instance is null');
            });

            QUnit.test('send button should be disabled after removing file via cancel button', function(assert) {
                this.reinit({
                    fileUploaderOptions: {
                        uploadFile: () => {},
                    },
                });

                const fileUploader = this.getFileUploader();

                fileUploader.option('value', [fakeFile]);
                fileUploader.upload();

                this.clock.tick();

                assert.strictEqual(this.sendButton.option('disabled'), false, 'send button is enabled after upload');

                const $cancelButton = this.$element.find(`.${FILEUPLOADER_CANCEL_BUTTON_CLASS}`);
                $cancelButton.trigger('dxclick');

                assert.strictEqual(this.sendButton.option('disabled'), true, 'send button is disabled after file removal');
            });

            QUnit.module('Localization', {
                beforeEach: function() {
                    this.defaultMessage = messageLocalization.format('dxChat-fileLimitReachedWarning');
                    this.customMessage = 'Custom file limit message';
                },
                afterEach: function() {
                    messageLocalization.load({ en: { 'dxChat-fileLimitReachedWarning': this.defaultMessage } });
                }
            }, () => {
                QUnit.test('informer should show custom localization message loaded before component initialization', function(assert) {
                    messageLocalization.load({ en: { 'dxChat-fileLimitReachedWarning': this.customMessage } });

                    this.reinit({
                        fileUploaderOptions: {
                            uploadFile: () => {},
                        }
                    });

                    const fileUploader = this.getFileUploader();
                    fileUploader.option('onFileLimitReached')();

                    const $informerText = this.$element.find(`.${INFORMER_TEXT_CLASS}`);

                    assert.strictEqual($informerText.text(), this.customMessage, 'custom localization message is shown');
                });

                QUnit.test('informer should show custom localization message loaded after component initialization', function(assert) {
                    this.reinit({
                        fileUploaderOptions: {
                            uploadFile: () => {},
                        }
                    });

                    messageLocalization.load({ en: { 'dxChat-fileLimitReachedWarning': this.customMessage } });

                    const fileUploader = this.getFileUploader();
                    fileUploader.option('onFileLimitReached')();

                    const $informerText = this.$element.find(`.${INFORMER_TEXT_CLASS}`);

                    assert.strictEqual($informerText.text(), this.customMessage, 'custom localization message is shown after runtime load');
                });
            });
        });

        QUnit.module('Integration with text option', () => {
            QUnit.test('informer should be hidden when text option is changed', function(assert) {
                this.showInformer('Test error message');

                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 1, 'informer is visible initially');

                this.instance.option('text', 'new text');

                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 0, 'informer is hidden after text change');
                assert.strictEqual(this.getInformer(), null, 'informer instance is null');
            });

            QUnit.test('informer should be hidden when text is typed in textarea', function(assert) {
                this.showInformer('Test error message');

                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 1, 'informer is visible initially');

                this.typeText('new text');

                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 0, 'informer is hidden after typing');
                assert.strictEqual(this.getInformer(), null, 'informer instance is null');
            });

            QUnit.test('element height should be recalculated when informer is hidden by text change', function(assert) {
                const initialHeight = this.$element.outerHeight();

                this.showInformer('Test error message');

                this.instance.option('text', 'new text');

                const heightAfterTextChange = this.$element.outerHeight();

                assert.strictEqual(heightAfterTextChange, initialHeight, 'element height returned to initial value after informer is hidden');
            });

            QUnit.test('informer timeout should be cleared when text option is changed', function(assert) {
                this.showInformer('Test error message');

                const timeoutId = this.instance._informerTimeoutId;

                assert.notStrictEqual(timeoutId, undefined, 'timeout is set');

                this.instance.option('text', 'new text');

                assert.strictEqual(this.instance._informerTimeoutId, undefined, 'timeout is cleared');
            });

            QUnit.test('informer should be hidden when text is cleared', function(assert) {
                this.typeText('new text');
                this.showInformer('Test error message');

                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 1, 'informer is visible initially');

                this.instance.option('text', '');

                assert.strictEqual(this.$element.find(`.${INFORMER_CLASS}`).length, 0, 'informer is hidden after text is cleared');
            });
        });
    });

    QUnit.module('SpeechToText integration', () => {
        QUnit.test('speech to text button should not be rendered if speechToTextEnabled is false', function(assert) {
            this.reinit({ speechToTextEnabled: false });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);

            assert.strictEqual($speechToText.length, 0, 'speech to text button is not rendered');
        });

        QUnit.test('speech to text button should not be rendered by default', function(assert) {
            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);

            assert.strictEqual($speechToText.length, 0, 'speech to text button is not rendered by default');
        });

        QUnit.test('speech to text button should be rendered if speechToTextEnabled is true', function(assert) {
            this.reinit({ speechToTextEnabled: true });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);

            assert.strictEqual($speechToText.length, 1, 'speech to text button is rendered');
            assert.ok(SpeechToText.getInstance($speechToText) instanceof SpeechToText, 'speech to text has correct instance');
        });

        QUnit.test('speech to text button should be rendered after speechToTextEnabled runtime update', function(assert) {
            assert.strictEqual(this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`).length, 0, 'speech to text is not rendered initially');

            this.instance.option('speechToTextEnabled', true);

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);

            assert.strictEqual($speechToText.length, 1, 'speech to text button is rendered after runtime update');
        });

        QUnit.test('speech to text button should be removed after speechToTextEnabled is set to false at runtime', function(assert) {
            this.reinit({ speechToTextEnabled: true });

            this.instance.option('speechToTextEnabled', false);

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);

            assert.strictEqual($speechToText.length, 0, 'speech to text button is removed');
        });

        QUnit.test('speech to text button should have correct default options', function(assert) {
            this.reinit({ speechToTextEnabled: true });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            assert.strictEqual(speechToTextInstance.option('stylingMode'), 'text', 'stylingMode is text');
            assert.strictEqual(speechToTextInstance.option('type'), 'normal', 'type is normal');
            assert.strictEqual(speechToTextInstance.option('startIcon'), 'micoutline', 'startIcon is micoutline');
            assert.strictEqual(speechToTextInstance.option('stopIcon'), 'micfilled', 'stopIcon is micfilled');
        });

        QUnit.test('speech to text button should be placed in toolbar with location after', function(assert) {
            this.reinit({ speechToTextEnabled: true });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);

            assert.ok($speechToText.length, 'speech to text is rendered in toolbar');
        });

        QUnit.test('speechToTextOptions should be passed to SpeechToText button', function(assert) {
            const speechToTextOptions = {
                speechRecognitionConfig: {
                    continuous: true,
                    interimResults: true,
                },
            };

            this.reinit({
                speechToTextEnabled: true,
                speechToTextOptions,
            });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            assert.deepEqual(speechToTextInstance.option('speechRecognitionConfig'), speechToTextOptions.speechRecognitionConfig, 'speechRecognitionConfig is passed');
        });

        QUnit.test('speechToTextOptions should be updated at runtime', function(assert) {
            this.reinit({
                speechToTextEnabled: true,
            });

            const newOptions = {
                speechRecognitionConfig: {
                    continuous: false,
                    interimResults: false,
                },
            };

            this.instance.option('speechToTextOptions', newOptions);

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            assert.deepEqual(speechToTextInstance.option('speechRecognitionConfig'), newOptions.speechRecognitionConfig, 'speechRecognitionConfig is updated');
        });

        QUnit.test('STT default options should override user-defined stylingMode, type and stopIcon', function(assert) {
            this.reinit({
                speechToTextEnabled: true,
                speechToTextOptions: {
                    stylingMode: 'contained',
                    type: 'danger',
                    stopIcon: 'customIcon',
                },
            });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            assert.strictEqual(speechToTextInstance.option('stylingMode'), 'text', 'stylingMode is always text');
            assert.strictEqual(speechToTextInstance.option('type'), 'normal', 'type is always normal');
            assert.strictEqual(speechToTextInstance.option('stopIcon'), 'micfilled', 'stopIcon is always micfilled');
        });

        QUnit.test('state options should be passed to speech to text button', function(assert) {
            this.reinit({
                speechToTextEnabled: true,
                activeStateEnabled: false,
                focusStateEnabled: false,
                hoverStateEnabled: false,
            });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            assert.strictEqual(speechToTextInstance.option('activeStateEnabled'), false, 'activeStateEnabled is passed');
            assert.strictEqual(speechToTextInstance.option('focusStateEnabled'), false, 'focusStateEnabled is passed');
            assert.strictEqual(speechToTextInstance.option('hoverStateEnabled'), false, 'hoverStateEnabled is passed');
        });

        QUnit.test('toolbar items order should be correct when both fileUploader and STT are enabled', function(assert) {
            this.reinit({
                speechToTextEnabled: true,
                fileUploaderOptions: {},
            });

            const $beforeItems = this.$element.find(`.${TOOLBAR_BEFORE_CLASS}`).children();
            const $afterItems = this.$element.find(`.${TOOLBAR_AFTER_CLASS}`).children();

            assert.strictEqual($beforeItems.length, 1, 'one item in before section');
            assert.ok($beforeItems.eq(0).find(`.${CHAT_TEXT_AREA_ATTACH_BUTTON}`).length, 'attach button is in before section');

            assert.strictEqual($afterItems.length, 2, 'two items in after section');
            assert.ok($afterItems.eq(0).find(`.${SPEECH_TO_TEXT_CLASS}`).length, 'speech to text is first in after section');
            assert.ok($afterItems.eq(1).find(`.${BUTTON_CLASS}`).length, 'send button is second in after section');
        });

        QUnit.test('user-defined onResult callback should be called along with internal handler', function(assert) {
            assert.expect(1);

            const onResult = sinon.spy();

            this.reinit({
                speechToTextEnabled: true,
                speechToTextOptions: {
                    onResult,
                },
            });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            const fakeEvent = {
                results: {
                    0: [{ transcript: 'hello' }],
                },
            };

            speechToTextInstance.option('onResult')({ event: fakeEvent });

            assert.strictEqual(onResult.callCount, 1, 'user onResult callback is called');
        });

        QUnit.test('user-defined onStartClick callback should be called along with internal handler', function(assert) {
            assert.expect(1);

            const onStartClick = sinon.spy();

            this.reinit({
                speechToTextEnabled: true,
                speechToTextOptions: {
                    onStartClick,
                },
            });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            speechToTextInstance.option('onStartClick')({});

            assert.strictEqual(onStartClick.callCount, 1, 'user onStartClick callback is called');
        });

        QUnit.test('user-defined onStopClick callback should be called along with internal handler', function(assert) {
            assert.expect(1);

            const onStopClick = sinon.spy();

            this.reinit({
                speechToTextEnabled: true,
                speechToTextOptions: {
                    onStopClick,
                },
            });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            speechToTextInstance.option('onStopClick')({});

            assert.strictEqual(onStopClick.callCount, 1, 'user onStopClick callback is called');
        });

        QUnit.test('user-defined onEnd callback should be called along with internal handler', function(assert) {
            assert.expect(1);

            const onEnd = sinon.spy();

            this.reinit({
                speechToTextEnabled: true,
                speechToTextOptions: {
                    onEnd,
                },
            });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            speechToTextInstance.option('onEnd')({});

            assert.strictEqual(onEnd.callCount, 1, 'user onEnd callback is called');
        });

        QUnit.test('textarea value should be updated with speech recognition result', function(assert) {
            this.reinit({
                speechToTextEnabled: true,
            });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            const fakeEvent = {
                results: {
                    0: [{ transcript: 'hello world' }],
                },
            };

            speechToTextInstance.option('onResult')({ event: fakeEvent });

            assert.strictEqual(this.instance.option('value'), 'hello world', 'textarea value is updated');
        });

        QUnit.test('textarea value should be appended to existing text on speech recognition result', function(assert) {
            this.reinit({
                speechToTextEnabled: true,
                value: 'existing text',
            });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            speechToTextInstance.option('onStartClick')({});

            const fakeEvent = {
                results: {
                    0: [{ transcript: 'hello world' }],
                },
            };

            speechToTextInstance.option('onResult')({ event: fakeEvent });

            assert.strictEqual(this.instance.option('value'), 'existing text hello world', 'textarea value is appended');
        });

        QUnit.test('multiple speech recognition results should be joined with spaces', function(assert) {
            this.reinit({
                speechToTextEnabled: true,
            });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            const fakeEvent = {
                results: {
                    0: [{ transcript: 'hello' }],
                    1: [{ transcript: 'world' }],
                },
            };

            speechToTextInstance.option('onResult')({ event: fakeEvent });

            assert.strictEqual(this.instance.option('value'), 'hello world', 'results are joined with spaces');
        });

        QUnit.test('initialInputText should be reset on onEnd event', function(assert) {
            this.reinit({
                speechToTextEnabled: true,
                value: 'initial',
            });

            const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
            const speechToTextInstance = SpeechToText.getInstance($speechToText);

            speechToTextInstance.option('onStartClick')({});

            assert.strictEqual(this.instance._initialInputText, 'initial', 'initialInputText is set on start');

            speechToTextInstance.option('onEnd')({});

            assert.strictEqual(this.instance._initialInputText, '', 'initialInputText is reset on end');
        });

        QUnit.test('onInitialized should store reference to speech to text button', function(assert) {
            this.reinit({
                speechToTextEnabled: true,
            });

            assert.ok(this.instance._speechToTextButton, 'speech to text button reference is stored');
        });

        QUnit.test('user-defined onInitialized callback should be called', function(assert) {
            assert.expect(1);

            this.reinit({
                speechToTextEnabled: true,
                speechToTextOptions: {
                    onInitialized: () => {
                        assert.ok(true, 'user onInitialized callback is called');
                    },
                },
            });
        });

        QUnit.module('SpeechToText button style options state', {
            beforeEach: function() {
                this.compareButtonState = (assert, expectedState) => {
                    const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
                    const speechToTextInstance = SpeechToText.getInstance($speechToText);

                    const { stylingMode, type } = speechToTextInstance.option();
                    const styleOptions = { stylingMode, type };

                    assert.deepEqual(styleOptions, expectedState, 'speech to text button has correct style options');
                };
            }
        }, () => {
            QUnit.test('speech to text button should have correct style options on init', function(assert) {
                this.reinit({ speechToTextEnabled: true });

                this.compareButtonState(assert, STT_INITIAL_STATE);
            });

            QUnit.test('speech to text button should have correct style options after entering text', function(assert) {
                this.reinit({ speechToTextEnabled: true });
                this.typeText('i');

                this.compareButtonState(assert, STT_INITIAL_STATE);
            });

            QUnit.test('speech to text button should have correct style options after entering text and clicking send button', function(assert) {
                this.reinit({ speechToTextEnabled: true });
                this.typeText('i').clickSendButton();

                this.compareButtonState(assert, STT_INITIAL_STATE);
            });

            QUnit.test('speech to text button should have correct style options when onStartClick is triggered', function(assert) {
                this.reinit({ speechToTextEnabled: true });

                const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
                const speechToTextInstance = SpeechToText.getInstance($speechToText);

                speechToTextInstance.option('onStartClick')({});

                this.compareButtonState(assert, STT_LISTENING_STATE);
            });

            QUnit.test('speech to text button should have correct style options after onStopClick is triggered', function(assert) {
                this.reinit({ speechToTextEnabled: true });
                const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
                const speechToTextInstance = SpeechToText.getInstance($speechToText);

                speechToTextInstance.option('onStartClick')({});
                speechToTextInstance.option('onStopClick')({});

                this.compareButtonState(assert, STT_INITIAL_STATE);
            });

            QUnit.test('speech to text button should have correct style options after onEnd is triggered', function(assert) {
                this.reinit({ speechToTextEnabled: true });
                const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
                const speechToTextInstance = SpeechToText.getInstance($speechToText);

                speechToTextInstance.option('onEnd')({});

                this.compareButtonState(assert, STT_INITIAL_STATE);
            });

            QUnit.test('speech to text button should have correct style options in custom mode', function(assert) {
                this.reinit({
                    speechToTextEnabled: true,
                    sendButtonOptions: { action: 'custom' },
                });

                this.compareButtonState(assert, STT_INITIAL_STATE);
            });

            QUnit.test('speech to text button should return to initial state when switching to custom mode during listening', function(assert) {
                this.reinit({ speechToTextEnabled: true });
                const $speechToText = this.$element.find(`.${SPEECH_TO_TEXT_CLASS}`);
                const speechToTextInstance = SpeechToText.getInstance($speechToText);

                speechToTextInstance.option('onStartClick')({});
                speechToTextInstance.option('onStopClick')({});

                this.instance.option('sendButtonOptions', { action: 'custom' });

                this.compareButtonState(assert, STT_INITIAL_STATE);
            });
        });
    });

    QUnit.module('sendButtonOptions', {
        beforeEach: function() {
            this.compareButtonState = (assert, expectedState) => {
                const { stylingMode, type, disabled } = this.sendButton.option();
                assert.deepEqual({ stylingMode, type, disabled }, expectedState, 'send button has correct state');
            };
        }
    }, () => {
        QUnit.module('icon', () => {
            QUnit.test('send button should have default icon when sendButtonOptions is not set', function(assert) {
                this.reinit({});

                assert.strictEqual(this.sendButton.option('icon'), 'arrowright', 'default icon is arrowright');
            });

            QUnit.test('send button should use icon from sendButtonOptions when specified', function(assert) {
                this.reinit({
                    sendButtonOptions: { icon: 'stopfilled' },
                });

                assert.strictEqual(this.sendButton.option('icon'), 'stopfilled', 'icon is set from sendButtonOptions');
            });

            QUnit.test('send button icon should update at runtime', function(assert) {
                this.instance.option('sendButtonOptions', { icon: 'stopfilled' });

                assert.strictEqual(this.sendButton.option('icon'), 'stopfilled', 'icon is updated at runtime');
            });

            QUnit.test('send button icon should reset to default when sendButtonOptions icon is removed', function(assert) {
                this.reinit({ sendButtonOptions: { icon: 'stopfilled' } });

                this.instance.option('sendButtonOptions', { icon: null });

                assert.strictEqual(this.sendButton.option('icon'), 'arrowright', 'icon is reset to default');
            });
        });

        QUnit.module('action: custom', () => {
            QUnit.test('send button should be enabled when action is custom regardless of input content', function(assert) {
                this.reinit({
                    sendButtonOptions: { action: 'custom' },
                });

                this.compareButtonState(assert, SEND_BUTTON_CUSTOM_ACTIVE_STATE);
            });

            QUnit.test('clicking send button in custom mode should not clear the textarea', function(assert) {
                this.reinit({
                    sendButtonOptions: { action: 'custom' },
                });

                this.typeText('some text').clickSendButton();

                assert.strictEqual(this.$input.val(), 'some text', 'textarea is not cleared');
            });

            QUnit.test('clicking send button in custom mode should not fire onSend', function(assert) {
                const onSendStub = sinon.stub();

                this.reinit({
                    onSend: onSendStub,
                    sendButtonOptions: { action: 'custom' },
                });

                this.typeText('some text').clickSendButton();

                assert.strictEqual(onSendStub.callCount, 0, 'onSend is not fired in custom mode');
            });

            QUnit.test('send button should switch to SEND_BUTTON_CUSTOM_ACTIVE_STATE when action changes to custom at runtime', function(assert) {
                this.instance.option('sendButtonOptions', { action: 'custom' });

                this.compareButtonState(assert, SEND_BUTTON_CUSTOM_ACTIVE_STATE);
            });

            QUnit.test('send button should revert to initial state when action switches back from custom with no input', function(assert) {
                this.reinit({
                    sendButtonOptions: { action: 'custom' },
                });

                this.instance.option('sendButtonOptions', { action: 'send' });

                this.compareButtonState(assert, SEND_BUTTON_INITIAL_STATE);
            });

            QUnit.test('send button should revert to ready state when action switches back from custom and input has text', function(assert) {
                this.reinit({
                    sendButtonOptions: { action: 'custom' },
                });

                this.typeText('some text');
                this.instance.option('sendButtonOptions', { action: 'send' });

                this.compareButtonState(assert, SEND_BUTTON_READY_TO_SEND_STATE);
            });
        });

        QUnit.module('onClick', () => {
            QUnit.test('onClick handler should be called when send button is clicked in custom mode', function(assert) {
                const onClickStub = sinon.stub();

                this.reinit({
                    sendButtonOptions: { action: 'custom', onClick: onClickStub },
                });

                this.clickSendButton();

                assert.strictEqual(onClickStub.callCount, 1, 'onClick is called once');
            });

            QUnit.test('onClick handler should not be called in default mode when input is empty', function(assert) {
                const onClickStub = sinon.stub();

                this.reinit({
                    sendButtonOptions: { action: 'send', onClick: onClickStub },
                });

                this.clickSendButton();

                assert.strictEqual(onClickStub.callCount, 0, 'onClick is not called when button is disabled');
            });

            QUnit.test('onClick handler should be called in default mode when input has text', function(assert) {
                const onClickStub = sinon.stub();

                this.reinit({
                    sendButtonOptions: { action: 'send', onClick: onClickStub },
                });

                this.typeText('hello').clickSendButton();

                assert.strictEqual(onClickStub.callCount, 1, 'onClick is called once with text');
            });

            QUnit.test('onClick handler should update when sendButtonOptions changes at runtime', function(assert) {
                const firstHandler = sinon.stub();
                const secondHandler = sinon.stub();

                this.reinit({
                    sendButtonOptions: { action: 'custom', onClick: firstHandler },
                });

                this.clickSendButton();

                this.instance.option('sendButtonOptions', { action: 'custom', onClick: secondHandler });

                this.clickSendButton();

                assert.strictEqual(firstHandler.callCount, 1, 'first handler called once');
                assert.strictEqual(secondHandler.callCount, 1, 'second handler called once after update');
            });

            QUnit.test('onClick handler should receive click event as argument', function(assert) {
                assert.expect(3);

                this.reinit({
                    sendButtonOptions: {
                        action: 'custom',
                        onClick: (e) => {
                            const { component, element } = e;

                            assert.strictEqual(component, this.instance, 'e.component is ChatTextArea instance');
                            assert.strictEqual(isRenderer(element), !!config().useJQuery, 'e.element uses correct renderer');
                            assert.strictEqual($(element).is(this.$element), true, 'e.element matches widget root');
                        },
                    },
                });

                this.clickSendButton();
            });
        });
    });

    QUnit.module('MaxHeight and scroll behavior', () => {
        QUnit.test('input should have auto-resize class by default', function(assert) {
            const hasAutoResizeClass = this.$input.hasClass(TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE);

            assert.ok(hasAutoResizeClass, 'input has auto-resize class');
        });

        QUnit.test('textarea should expand when text is added', function(assert) {
            const initialHeight = this.$input.height();

            this.typeText('Line 1\nLine 2\nLine 3');

            const heightAfterTyping = this.$input.height();

            assert.ok(heightAfterTyping > initialHeight, 'textarea height increased after adding multiline text');
        });

        QUnit.test('textarea should not exceed default maxHeight', function(assert) {
            const longText = Array(100).fill('Line of text that should cause scrolling').join('\n');
            this.typeText(longText);

            const inputHeight = this.$input.height();
            const maxHeightValue = parseFloat(this.$input.css('maxHeight'));

            assert.roughEqual(inputHeight, maxHeightValue, 0.01, 'input height respects default maxHeight');
            assert.notStrictEqual(maxHeightValue, undefined, 'default maxHeight is applied');
        });

        QUnit.test('textarea height should be restored after clearing text', function(assert) {
            const initialHeight = this.$input.height();

            this.typeText('Line 1\nLine 2\nLine 3\nLine 4\nLine 5');

            const heightWithText = this.$input.height();
            assert.ok(heightWithText > initialHeight, 'height increased with text');

            this.instance.option('value', '');

            const heightAfterClear = this.$input.height();

            assert.roughEqual(heightAfterClear, initialHeight, 0.01, 'height is restored after clearing text');
        });
    });
});
