import $ from 'jquery';
import 'common.css!';
import 'ui/file_uploader';

QUnit.testStart(function() {
    const markup =
        '<div id="fileuploader"></div>';

    $('#qunit-fixture').html(markup);
});

const FILEUPLOADER_CLASS = 'dx-fileuploader';

const FILEUPLOADER_WRAPPER_CLASS = 'dx-fileuploader-wrapper';
const FILEUPLOADER_CONTAINER_CLASS = 'dx-fileuploader-container';
const FILEUPLOADER_CONTENT_CLASS = 'dx-fileuploader-content';
const FILEUPLOADER_INPUT_WRAPPER_CLASS = 'dx-fileuploader-input-wrapper';
const FILEUPLOADER_BUTTON_CLASS = 'dx-fileuploader-button';
const FILEUPLOADER_INPUT_CONTAINER_CLASS = 'dx-fileuploader-input-container';
const FILEUPLOADER_INPUT_CLASS = 'dx-fileuploader-input';
const FILEUPLOADER_INPUT_LABEL_CLASS = 'dx-fileuploader-input-label';

const FILEUPLOADER_UPLOAD_BUTTON_CLASS = 'dx-fileuploader-upload-button';

QUnit.module('fileUploader markup', () => {
    QUnit.test('fileUploader should have correct class', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader();

        assert.ok($fileUploader.hasClass(FILEUPLOADER_CLASS), 'widget rendered');
    });

    QUnit.test('wrapper should be rendered', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader();
        const $wrapper = $fileUploader.children('.' + FILEUPLOADER_WRAPPER_CLASS);

        assert.equal($wrapper.length, 1, 'wrapper wrapper was rendered');
    });

    QUnit.test('container should be rendered in wrapper', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader();
        const $wrapper = $fileUploader.find('.' + FILEUPLOADER_WRAPPER_CLASS);
        const $container = $wrapper.children('.' + FILEUPLOADER_CONTAINER_CLASS);

        assert.equal($container.length, 1, 'container was rendered');
    });

    QUnit.test('content should be rendered in container', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader();
        const $container = $fileUploader.find('.' + FILEUPLOADER_CONTAINER_CLASS);
        const $content = $container.children('.' + FILEUPLOADER_CONTENT_CLASS);

        assert.equal($content.length, 1, 'field was rendered');
    });

    QUnit.test('input wrapper should be rendered in content', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader();
        const $content = $fileUploader.find('.' + FILEUPLOADER_CONTENT_CLASS);
        const $inputWrapper = $content.children('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);

        assert.equal($inputWrapper.length, 1, 'input wrapper was rendered');
    });

    QUnit.test('input container should be rendered in input wrapper', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader();
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);
        const $inputContainer = $inputWrapper.children('.' + FILEUPLOADER_INPUT_CONTAINER_CLASS);

        assert.equal($inputContainer.length, 1, 'input was rendered');
    });

    QUnit.test('button should be rendered in input container', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader();
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);
        const $button = $inputWrapper.children('.' + FILEUPLOADER_BUTTON_CLASS);

        assert.equal($button.length, 1, 'input was rendered');
    });

    QUnit.test('input label should be rendered in input container', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader();
        const $inputContainer = $fileUploader.find('.' + FILEUPLOADER_INPUT_CONTAINER_CLASS);
        const $inputLabel = $inputContainer.children('.' + FILEUPLOADER_INPUT_LABEL_CLASS);

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
        });
        const instance = $fileUploader.dxFileUploader('instance');

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
        });
        const instance = $fileUploader.dxFileUploader('instance');

        const $button = $fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

        assert.equal($button.text(), uploadButtonText, 'button text is correct');

        uploadButtonText = 'Click me again!';
        instance.option('uploadButtonText', uploadButtonText);
        assert.equal($button.text(), uploadButtonText, 'button text is correct');
    });

    QUnit.test('file input accessability attrbutes rendered', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });

        const $fileInput = $fileUploader.find(`.${FILEUPLOADER_INPUT_CLASS}`);
        const $fileInputLabel = $fileUploader.find(`.${FILEUPLOADER_INPUT_LABEL_CLASS}`);

        const labelId = $fileInputLabel.attr('id');
        assert.strictEqual($fileInput.attr('aria-labelledby'), labelId, 'aria attribute rendered');
    });

    QUnit.test('file input custom attrbutes rendered', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            inputAttr: {
                role: 'test_role1',
                id: 'test_id1'
            }
        });

        const $fileInput = $fileUploader.find(`.${FILEUPLOADER_INPUT_CLASS}`);

        assert.strictEqual($fileInput.attr('role'), 'test_role1', 'custom attribute rendered');
        assert.strictEqual($fileInput.attr('id'), 'test_id1', 'custom attribute rendered');
    });

    QUnit.test('partically update the "inputAttr" option', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });

        $fileUploader.dxFileUploader('option', 'inputAttr.id', 'test_id1');

        const $fileInput = $fileUploader.find(`.${FILEUPLOADER_INPUT_CLASS}`);

        assert.strictEqual($fileInput.attr('id'), 'test_id1', 'custom attribute has been applied');
    });

    QUnit.test('partial update of the "inputAttr" option should not replace other attibutes', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            inputAttr: {
                role: 'test_role1',
                autocomplete: 'on',
                id: 'test_id1'
            }
        });

        $fileUploader.dxFileUploader('option', 'inputAttr.id', 'test_id1');
        const $fileInput = $fileUploader.find(`.${FILEUPLOADER_INPUT_CLASS}`);

        assert.strictEqual($fileInput.attr('role'), 'test_role1', '"role" attribute has the same value');
        assert.strictEqual($fileInput.attr('id'), 'test_id1', '"id" attribute has been applied');
        assert.strictEqual($fileInput.attr('autocomplete'), 'on', '"autocomplete" attribute has the same value');
    });

});

QUnit.module('multiple option', () => {
    QUnit.test('field multiple attr should be set correctly, multiple = true', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true
        });
        const $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

        assert.equal($fileInput.prop('multiple'), true, 'file input has correct name property');
    });

    QUnit.test('field multiple attr should be set correctly, multiple = false', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false
        });
        const $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

        assert.equal($fileInput.prop('multiple'), false, 'file input has correct name property');
    });
});

QUnit.module('option accept', () => {
    QUnit.test('field accept should be rendered correctly', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            accept: 'image/*'
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');

        const $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

        assert.equal($fileInput.prop('accept'), 'image/*', 'value was set to empty string');

        fileUploader.option('accept', 'video/*');
        assert.equal($fileInput.prop('accept'), 'video/*', 'value was set to empty string');
    });
});

QUnit.module('the \'name\' option', () => {
    QUnit.test('widget input should get the \'name\' attribute with a correct value', function(assert) {
        const expectedName = 'some_name';
        const $element = $('#fileuploader').dxFileUploader({
            name: expectedName
        });
        const $input = $element.find('.' + FILEUPLOADER_INPUT_CLASS);

        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
    });
});

