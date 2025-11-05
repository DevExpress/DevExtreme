import $ from 'jquery';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';

import ChatTextArea, { CHAT_TEXT_AREA_ATTACH_BUTTON } from '__internal/ui/chat/message_box/chat_text_area';
import Button from 'ui/button';
import FileUploader, { FILEUPLOADER_CLASS, FILEUPLOADER_CANCEL_BUTTON_CLASS } from '__internal/ui/file_uploader/file_uploader';
import { BUTTON_CLASS } from '__internal/ui/button/button';
import Informer, { INFORMER_CLASS, INFORMER_TEXT_CLASS } from '__internal/ui/informer/informer';
import { TEXTEDITOR_INPUT_CLASS } from '__internal/ui/text_box/m_text_editor.base';

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

            assert.strictEqual(this.$fileUploader.length, 1, 'file uploader is not rendered');
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
            this.typeText('i');

            assert.strictEqual(this.sendButton.option('disabled'), false);
        });

        QUnit.test('send button should be disabled after entering any character and clicking the button', function(assert) {
            this.typeText('i').clickSendButton();

            assert.strictEqual(this.sendButton.option('disabled'), true);
        });

        ['    ', '\n'].forEach(emptyValue => {
            QUnit.test(`send button should be disabled after entering only "${emptyValue === '\n' ? 'line breaks' : 'spaces'}"`, function(assert) {
                this.typeText(emptyValue);

                assert.strictEqual(this.sendButton.option('disabled'), true);
            });
        });

        QUnit.test('send button should be disabled after entering character and removing it', function(assert) {
            keyboardMock(this.$input)
                .focus()
                .type('i')
                .press('backspace');

            assert.strictEqual(this.sendButton.option('disabled'), true);
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

            assert.strictEqual(this.sendButton.option('disabled'), false);
        });

        QUnit.test('send button should be disabled after adding and before uploading', function(assert) {
            this.reinit({
                fileUploaderOptions: {
                    uploadFile: () => {},
                },
            });

            this.getFileUploader().option('value', [fakeFile]);

            assert.strictEqual(this.sendButton.option('disabled'), true);
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

            assert.strictEqual(this.sendButton.option('disabled'), true);
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

            assert.strictEqual(this.sendButton.option('disabled'), true, 'send button is disabled after adding file that fail validation');
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
        });
    });
});
