import $ from 'jquery';

import keyboardMock from '../../../helpers/keyboardMock.js';
import '../../../helpers/xmlHttpRequestMock.js';

const FIELD_ITEM_CLASS = 'dx-field-item';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TOOLBAR_FORMAT_WIDGET_CLASS = 'dx-htmleditor-toolbar-format';
const ADD_IMAGE_DIALOG_CLASS = 'dx-htmleditor-add-image-popup';
const ADD_IMAGE_DIALOG_WIT_TABS_CLASS = 'dx-htmleditor-add-image-popup-with-tabs';

const WHITE_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWP4////fwAJ+wP93BEhJAAAAABJRU5ErkJggg==';
const BLACK_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWNgYmL6DwABFgEGpP/tHAAAAABJRU5ErkJggg==';
const ORANGE_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWP4z8j4HwAFBQIB6OfkUgAAAABJRU5ErkJggg==';

const TIME_TO_WAIT = 200;

const { test, module } = QUnit;

const markup = '\
    <p>test text</p>\
    <br>';

const fakeFile = {
    name: 'fakefile1.jpeg',
    size: 1063,
    type: 'image/jpeg',
    lastModifiedDate: $.now()
};

module('Image uploading integration', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor');
        this.options = {
            toolbar: { items: ['image'] },
            imageUploading: {
                mode: 'both',
                uploadUrl: '/',
                uploadDirectory: '/uploadDirectory/'
            },
            value: markup
        };

        this.createWidget = (options) => {
            const newOptions = $.extend({}, this.options, options);
            this.instance = this.$element
                .dxHtmlEditor(newOptions)
                .dxHtmlEditor('instance');

            this.quillInstance = this.instance.getQuillInstance();
        };
    },
    afterEach: function() {
        this.instance && this.instance.dispose();
        this.clock.restore();
    }
}, () => {
    module('resizing frames initialization', {}, () => {
        ['both', 'base64'].forEach((mode) => {
            test(`the form popup is correctly rendered for mode="${mode}"`, function(assert) {
                this.createWidget({
                    imageUploading: { mode }
                });
                this.clock.tick(TIME_TO_WAIT);

                this.instance.focus();

                this.instance.setSelection(0, 1);

                this.$element
                    .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                    .trigger('dxclick');

                this.clock.tick(TIME_TO_WAIT);

                const $form = $('.dx-form');
                const formInstance = $form.dxForm('instance');
                const formItems = formInstance.option('items');
                const fileUploader = $form.find('.dx-fileuploader');

                assert.strictEqual($(`.${ADD_IMAGE_DIALOG_CLASS}`).length, 1, 'has add image dialog class');
                assert.strictEqual($(`.${ADD_IMAGE_DIALOG_WIT_TABS_CLASS}`).length, 1, 'has add image dialog with tabs class');
                assert.strictEqual(formItems[0].itemType, 'tabbed', 'has tabbed items');
                assert.strictEqual(formItems[0].tabs[0].items.length, 2, 'has items for the first tab');
                assert.strictEqual(formItems[0].tabs[1].items.length, 4, 'has items for the second tab');
                assert.strictEqual(fileUploader.length, 1, 'file uploader is exists on the form');
            });
        });

        test('the popup and form is correctly rendered for mode="url"', function(assert) {
            this.createWidget({ imageUploading: { mode: 'url' } });
            this.clock.tick(TIME_TO_WAIT);

            this.instance.focus();

            this.instance.setSelection(0, 1);

            this.$element
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            this.clock.tick(TIME_TO_WAIT);

            const formInstance = $('.dx-form').dxForm('instance');
            const formItems = formInstance.option('items');

            assert.strictEqual($(`.${ADD_IMAGE_DIALOG_CLASS}`).length, 1, 'has add image dialog class');
            assert.strictEqual($(`.${ADD_IMAGE_DIALOG_WIT_TABS_CLASS}`).length, 0, 'has no add image dialog with tabs class');
            assert.strictEqual(formItems.length, 4, 'has correct form items count');
            assert.strictEqual(formItems[0].items || formItems[0].tabs, undefined, 'has no embeded items');
        });

        test('the popup and form is correctly rendered if imageUploading is undefined', function(assert) {
            this.createWidget({ imageUploading: null });
            this.clock.tick(TIME_TO_WAIT);

            this.instance.focus();

            this.instance.setSelection(0, 1);

            this.$element
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            this.clock.tick(TIME_TO_WAIT);

            const formInstance = $('.dx-form').dxForm('instance');
            const formItems = formInstance.option('items');

            assert.strictEqual($(`.${ADD_IMAGE_DIALOG_CLASS}`).length, 1, 'has add image dialog class');
            assert.strictEqual($(`.${ADD_IMAGE_DIALOG_WIT_TABS_CLASS}`).length, 0, 'has no add image dialog with tabs class');
            assert.strictEqual(formItems.length, 4, 'has correct form items count');
            assert.strictEqual(formItems[0].items || formItems[0].tabs, undefined, 'has no embeded items');
        });

        test('check file uploading form base64 checkbox', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            this.instance.focus();

            this.instance.setSelection(0, 1);

            this.$element
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            this.clock.tick(TIME_TO_WAIT);

            const $form = $('.dx-form');
            const $base64Editor = $form.find('.dx-checkbox');
            const base64EditorInstance = $base64Editor.dxCheckBox('instance');


            assert.strictEqual(base64EditorInstance.option('value'), false, 'base64 checkbox default value is false');
            assert.strictEqual(base64EditorInstance.option('disabled'), false, 'base64 checkbox is not disabled');
        });

        test('check file uploading form base64 checkbox if mode = "base64"', function(assert) {
            this.createWidget({ imageUploading: { mode: 'base64', uploadUrl: undefined } });
            this.clock.tick(TIME_TO_WAIT);

            this.instance.focus();

            this.instance.setSelection(0, 1);

            this.$element
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            this.clock.tick(TIME_TO_WAIT);

            const $form = $('.dx-form');
            const $base64Editor = $form.find('.dx-checkbox');
            const base64EditorInstance = $base64Editor.dxCheckBox('instance');

            assert.strictEqual(base64EditorInstance.option('value'), true, 'base64 checkbox default value is true');
            assert.strictEqual(base64EditorInstance.option('disabled'), true, 'base64 checkbox is disabled');
        });

        test('check file uploading in base64 format', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);


            const uploadSpy = sinon.spy(this.quillInstance.getModule('uploader'), 'upload');

            this.instance.focus();

            this.instance.setSelection(1, 2);

            this.$element
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            this.clock.tick(TIME_TO_WAIT);

            const $form = $('.dx-form');

            const $base64Editor = $form.find('.dx-checkbox');
            const fileUploader = $form.find('.dx-fileuploader').dxFileUploader('instance');
            const base64EditorInstance = $base64Editor.dxCheckBox('instance');

            base64EditorInstance.option('value', true);

            fileUploader.option('value', [fakeFile]);
            this.clock.tick(TIME_TO_WAIT);

            assert.strictEqual(uploadSpy.callCount, 1, 'file uploader upload method is called');
            assert.strictEqual(uploadSpy.getCall(0).args[0].index, 1, 'first upload arg index is correct');
            assert.deepEqual(uploadSpy.getCall(0).args[1], [fakeFile], 'file upload arg is correct');
        });

        function prepareImageUpdateTest(caretPosition, selectionLength) {
            return function(assert) {
                const done = assert.async();
                this.createWidget({
                    value: `<img src=${WHITE_PIXEL}>`,
                    imageUploading: { mode: 'url' },
                    onValueChanged: ({ value }) => {
                        assert.ok(value.indexOf(WHITE_PIXEL) === -1, 'There is no white pixel');
                        assert.ok(value.indexOf(BLACK_PIXEL) !== -1, 'There is a black pixel');
                        done();
                    }
                });

                this.instance.focus();

                setTimeout(() => {
                    this.instance.setSelection(caretPosition, selectionLength);
                }, 100);

                this.clock.tick(100);
                this.$element
                    .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                    .trigger('dxclick');

                const $srcInput = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`).first().val('');

                keyboardMock($srcInput.eq(0))
                    .type(BLACK_PIXEL)
                    .change()
                    .press('enter');
            };
        }

        test('image should be correctly updated after change a source and caret placed after', prepareImageUpdateTest(1, 0));

        test('image should be correctly updated after change a source and caret placed before an image', prepareImageUpdateTest(0, 0));

        test('selected image should be correctly updated after change a source and caret placed after', prepareImageUpdateTest(1, 1));

        test('selected image should be correctly updated after change a source and caret placed before an image', prepareImageUpdateTest(0, 1));

        test('image should be correctly updated after change a source and caret placed between two images', function(assert) {
            const done = assert.async();
            const $container = $('#htmlEditor');
            const instance = $container.dxHtmlEditor({
                toolbar: { items: ['image'] },
                value: `<img src=${WHITE_PIXEL}><img src=${BLACK_PIXEL}>`,
                onValueChanged: ({ value }) => {
                    const blackIndex = value.indexOf(BLACK_PIXEL);
                    const orangeIndex = value.indexOf(ORANGE_PIXEL);

                    assert.strictEqual(value.indexOf(WHITE_PIXEL), -1, 'There is no white pixel');
                    assert.notStrictEqual(blackIndex, -1, 'There is a black pixel');
                    assert.notStrictEqual(orangeIndex, -1, 'There is an orange pixel');
                    assert.ok(orangeIndex < blackIndex, 'orange pixel placed before black pixel');
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.focus();

            setTimeout(() => {
                instance.setSelection(1, 0);
            }, 100);

            this.clock.tick(100);

            $container
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            const $srcInput = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`).first().val('');

            keyboardMock($srcInput.eq(0))
                .type(ORANGE_PIXEL)
                .change()
                .press('enter');
        });
    });

    test('check file uploading by url dimention editors default value', function(assert) {
        this.createWidget({
            value: markup,
            imageUploading: { mode: 'url' },
        });

        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);

        this.instance.focus();

        this.instance.setSelection(0, 1);

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        this.clock.tick(TIME_TO_WAIT);

        const $form = $('.dx-form');
        const widthEditor = $form.find('.dx-textbox').eq(1).dxTextBox('instance');
        const heightEditor = $form.find('.dx-textbox').eq(2).dxTextBox('instance');

        assert.strictEqual(heightEditor.option('value'), undefined, 'height value is empty');
        assert.strictEqual(widthEditor.option('value'), undefined, 'width value is empty');
    });

    test('check file uploading by url with dimentions', function(assert) {
        this.createWidget({
            value: `<img src=${WHITE_PIXEL}>`,
            imageUploading: { mode: 'url' },
        });

        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);

        this.instance.focus();

        this.instance.setSelection(0, 1);

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        this.clock.tick(TIME_TO_WAIT);

        const $form = $('.dx-form');
        const widthEditor = $form.find('.dx-textbox').eq(1).dxTextBox('instance');
        const heightEditor = $form.find('.dx-textbox').eq(2).dxTextBox('instance');
        widthEditor.option('value', '70');
        heightEditor.option('value', '65');
        this.clock.tick(TIME_TO_WAIT);

        $('.dx-formdialog .dx-toolbar .dx-button')
            .first()
            .trigger('dxclick');

        this.clock.tick(TIME_TO_WAIT);

        const imageFormat = this.instance.getFormat();

        assert.strictEqual(imageFormat.width, '70', 'width is correct');
        assert.strictEqual(imageFormat.height, '65', 'height is correct');
    });

    test('check dimentions default values', function(assert) {
        this.createWidget({
            value: `<img width='50' height='40' src=${WHITE_PIXEL}>`,
            imageUploading: { mode: 'url' },
        });

        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);

        this.instance.focus();

        this.instance.setSelection(0, 1);

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        this.clock.tick(TIME_TO_WAIT);

        const $form = $('.dx-form');
        const widthEditor = $form.find('.dx-textbox').eq(1).dxTextBox('instance');
        const heightEditor = $form.find('.dx-textbox').eq(2).dxTextBox('instance');

        assert.strictEqual(heightEditor.option('value'), '40', 'height value is recalculated');
        assert.strictEqual(widthEditor.option('value'), '50', 'width value is recalculated');
    });

    test('check aspect ratio base', function(assert) {
        this.createWidget({
            value: `<img src=${WHITE_PIXEL}>`,
            imageUploading: { mode: 'url' }
        });

        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);

        this.instance.focus();

        this.instance.setSelection(0, 1);

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        this.clock.tick(TIME_TO_WAIT);

        const $form = $('.dx-form');
        const widthEditor = $form.find('.dx-textbox').eq(1).dxTextBox('instance');
        const heightEditor = $form.find('.dx-textbox').eq(2).dxTextBox('instance');

        widthEditor.option('value', '50');
        heightEditor.option('value', '25');
        this.clock.tick(TIME_TO_WAIT);
        widthEditor.option('value', '100');
        this.clock.tick(TIME_TO_WAIT);

        assert.strictEqual(heightEditor.option('value'), '50', 'height value is recalculated');
        this.clock.tick(TIME_TO_WAIT);

        heightEditor.option('value', '60');

        assert.strictEqual(widthEditor.option('value'), '120', 'width value is recalculated');
    });

    test('check aspect ratio with default values', function(assert) {
        this.createWidget({
            value: `<img width='50' height='40' src=${WHITE_PIXEL}>`,
            imageUploading: { mode: 'url' }
        });

        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);

        this.instance.focus();

        this.instance.setSelection(0, 1);

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        this.clock.tick(TIME_TO_WAIT);

        const $form = $('.dx-form');
        const widthEditor = $form.find('.dx-textbox').eq(1).dxTextBox('instance');
        const heightEditor = $form.find('.dx-textbox').eq(2).dxTextBox('instance');

        heightEditor.option('value', '80');

        assert.strictEqual(heightEditor.option('value'), '80', 'height value is recalculated');
        assert.strictEqual(widthEditor.option('value'), '100', 'width value is recalculated');
    });

    test('check aspect ratio disabling', function(assert) {
        this.createWidget({
            value: `<img src=${WHITE_PIXEL}>`,
            imageUploading: { mode: 'url' }
        });

        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);

        this.instance.focus();

        this.instance.setSelection(0, 1);

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        this.clock.tick(TIME_TO_WAIT);

        const $form = $('.dx-form');
        const widthEditor = $form.find('.dx-textbox').eq(1).dxTextBox('instance');
        const heightEditor = $form.find('.dx-textbox').eq(2).dxTextBox('instance');

        const $aspectRatioButton = $form.find('.dx-buttongroup .dx-button');
        $aspectRatioButton.trigger('dxclick');

        widthEditor.option('value', '50');
        heightEditor.option('value', '25');
        widthEditor.option('value', '100');

        assert.strictEqual(heightEditor.option('value'), '25', 'height value is recalculated');
        assert.strictEqual(widthEditor.option('value'), '100', 'width value is recalculated');
    });

    test('check aspect ratio when only one size is defined', function(assert) {
        this.createWidget({
            value: markup,
            imageUploading: { mode: 'url' }
        });

        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);

        this.instance.focus();

        this.instance.setSelection(0, 1);

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        this.clock.tick(TIME_TO_WAIT);

        const $form = $('.dx-form');
        const widthEditor = $form.find('.dx-textbox').eq(1).dxTextBox('instance');
        const heightEditor = $form.find('.dx-textbox').eq(2).dxTextBox('instance');

        widthEditor.option('value', '50');

        assert.strictEqual(heightEditor.option('value'), undefined, 'height value is recalculated');
        assert.strictEqual(widthEditor.option('value'), '50', 'width value is recalculated');
    });

    test('check file uploading to the server', function(assert) {
        const expectedValue = '<p>t<img src="/uploadDirectory/fakefile1.jpeg">est text</p><p><br></p>';
        this.createWidget();
        this.clock.tick(TIME_TO_WAIT);

        this.xhrMock = new window.XMLHttpRequestMock();
        this._nativeXhr = XMLHttpRequest;
        window.XMLHttpRequest = this.xhrMock.XMLHttpRequest;

        this.formDataMock = new window.FormDataMock();
        this._nativeFormData = window.FormData;
        window.FormData = this.formDataMock.FormData;

        this.instance.focus();

        this.instance.setSelection(1, 2);

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        this.clock.tick(TIME_TO_WAIT);

        const $form = $('.dx-form');
        const fileUploader = $form.find('.dx-fileuploader').dxFileUploader('instance');

        fileUploader.option('value', [fakeFile]);

        fileUploader.upload(fileUploader.option('value[0]'));
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);


        const request = this.xhrMock.getInstanceAt();

        $('.dx-formdialog .dx-toolbar .dx-button')
            .first()
            .trigger('dxclick');

        this.clock.tick(TIME_TO_WAIT);

        assert.ok(request.uploaded, 'upload is done');
        assert.strictEqual(this.instance.option('value'), expectedValue, 'value is correct');

        window.XMLHttpRequest = this._nativeXhr;
        window.FormData = this._nativeFormData;

        this.xhrMock.dispose();
        delete this.xhrMock;
        delete this.formDataMock;
    });

});
