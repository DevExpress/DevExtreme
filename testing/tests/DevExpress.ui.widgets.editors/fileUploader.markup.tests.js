import $ from 'jquery';
import 'common.css!';
import 'ui/file_uploader';

QUnit.testStart(function() {
    const markup =
        '<div id="fileuploader"></div>';

    $('#qunit-fixture').html(markup);
});

const FILEUPLOADER_CLASS = 'dx-fileuploader',

    FILEUPLOADER_WRAPPER_CLASS = 'dx-fileuploader-wrapper',
    FILEUPLOADER_CONTAINER_CLASS = 'dx-fileuploader-container',
    FILEUPLOADER_CONTENT_CLASS = 'dx-fileuploader-content',
    FILEUPLOADER_INPUT_WRAPPER_CLASS = 'dx-fileuploader-input-wrapper',
    FILEUPLOADER_BUTTON_CLASS = 'dx-fileuploader-button',
    FILEUPLOADER_INPUT_CONTAINER_CLASS = 'dx-fileuploader-input-container',
    FILEUPLOADER_INPUT_CLASS = 'dx-fileuploader-input',
    FILEUPLOADER_INPUT_LABEL_CLASS = 'dx-fileuploader-input-label',

    FILEUPLOADER_UPLOAD_BUTTON_CLASS = 'dx-fileuploader-upload-button';

QUnit.module('fileUploader markup', () => {
    QUnit.test('fileUploader should have correct class', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader();

        assert.ok($fileUploader.hasClass(FILEUPLOADER_CLASS), 'widget rendered');
    });

    QUnit.test('wrapper should be rendered', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader(),
            $wrapper = $fileUploader.children('.' + FILEUPLOADER_WRAPPER_CLASS);

        assert.equal($wrapper.length, 1, 'wrapper wrapper was rendered');
    });

    QUnit.test('container should be rendered in wrapper', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader(),
            $wrapper = $fileUploader.find('.' + FILEUPLOADER_WRAPPER_CLASS),
            $container = $wrapper.children('.' + FILEUPLOADER_CONTAINER_CLASS);

        assert.equal($container.length, 1, 'container was rendered');
    });

    QUnit.test('content should be rendered in container', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader(),
            $container = $fileUploader.find('.' + FILEUPLOADER_CONTAINER_CLASS),
            $content = $container.children('.' + FILEUPLOADER_CONTENT_CLASS);

        assert.equal($content.length, 1, 'field was rendered');
    });

    QUnit.test('input wrapper should be rendered in content', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader(),
            $content = $fileUploader.find('.' + FILEUPLOADER_CONTENT_CLASS),
            $inputWrapper = $content.children('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);

        assert.equal($inputWrapper.length, 1, 'input wrapper was rendered');
    });

    QUnit.test('input container should be rendered in input wrapper', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader(),
            $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS),
            $inputContainer = $inputWrapper.children('.' + FILEUPLOADER_INPUT_CONTAINER_CLASS);

        assert.equal($inputContainer.length, 1, 'input was rendered');
    });

    QUnit.test('button should be rendered in input container', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader(),
            $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS),
            $button = $inputWrapper.children('.' + FILEUPLOADER_BUTTON_CLASS);

        assert.equal($button.length, 1, 'input was rendered');
    });

    QUnit.test('input label should be rendered in input container', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader(),
            $inputContainer = $fileUploader.find('.' + FILEUPLOADER_INPUT_CONTAINER_CLASS),
            $inputLabel = $inputContainer.children('.' + FILEUPLOADER_INPUT_LABEL_CLASS);

        assert.equal($inputLabel.length, 1, 'field was rendered');
    });

    QUnit.test('\'upload\' button should be rendered, \'uploadMode\'=\'useButtons\'', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });

        assert.equal($fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 1, '\'upload\' button is rendered');
    });

    QUnit.test('\'upload\' button should not be rendered, \'uploadMode\'=\'instantly\'', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly'
        });

        assert.equal($fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 0, '\'upload\' button is not rendered');
    });

    QUnit.test('select button text is changed by option', function(assert) {
        let selectButtonText = 'Click me!';
        const $fileUploader = $('#fileuploader').dxFileUploader({
                selectButtonText
            }),
            instance = $fileUploader.dxFileUploader('instance');

        const $button = $fileUploader.find('.' + FILEUPLOADER_BUTTON_CLASS);

        assert.equal($button.text(), selectButtonText, 'button text is correct');

        selectButtonText = 'Click me again!';
        instance.option('selectButtonText', selectButtonText);
        assert.equal($button.text(), selectButtonText, 'button text is correct');
    });

    QUnit.test('upload button text is changed by option', function(assert) {
        let uploadButtonText = 'Click me!';
        const $fileUploader = $('#fileuploader').dxFileUploader({
                uploadMode: 'useButtons',
                uploadButtonText
            }),
            instance = $fileUploader.dxFileUploader('instance');

        const $button = $fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

        assert.equal($button.text(), uploadButtonText, 'button text is correct');

        uploadButtonText = 'Click me again!';
        instance.option('uploadButtonText', uploadButtonText);
        assert.equal($button.text(), uploadButtonText, 'button text is correct');
    });
});

QUnit.module('multiple option', () => {
    QUnit.test('field multiple attr should be set correctly, multiple = true', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
                multiple: true
            }),
            $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

        assert.equal($fileInput.prop('multiple'), true, 'file input has correct name property');
    });

    QUnit.test('field multiple attr should be set correctly, multiple = false', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
                multiple: false
            }),
            $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

        assert.equal($fileInput.prop('multiple'), false, 'file input has correct name property');
    });
});

QUnit.module('option accept', () => {
    QUnit.test('field accept should be rendered correctly', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
                accept: 'image/*'
            }),
            fileUploader = $fileUploader.dxFileUploader('instance'),

            $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

        assert.equal($fileInput.prop('accept'), 'image/*', 'value was set to empty string');

        fileUploader.option('accept', 'video/*');
        assert.equal($fileInput.prop('accept'), 'video/*', 'value was set to empty string');
    });
});

QUnit.module('the \'name\' option', () => {
    QUnit.test('widget input should get the \'name\' attribute with a correct value', function(assert) {
        const expectedName = 'some_name',
            $element = $('#fileuploader').dxFileUploader({
                name: expectedName
            }),
            $input = $element.find('.' + FILEUPLOADER_INPUT_CLASS);

        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
    });
});

