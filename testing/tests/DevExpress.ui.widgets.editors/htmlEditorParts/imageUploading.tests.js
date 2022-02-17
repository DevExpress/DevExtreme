import $ from 'jquery';

import keyboardMock from '../../../helpers/keyboardMock.js';

const FIELD_ITEM_CLASS = 'dx-field-item';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TOOLBAR_FORMAT_WIDGET_CLASS = 'dx-htmleditor-toolbar-format';
const ADD_IMAGE_DIALOG_CLASS = 'dx-htmleditor-add-image-popup';


const WHITE_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWP4////fwAJ+wP93BEhJAAAAABJRU5ErkJggg==';
const BLACK_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWNgYmL6DwABFgEGpP/tHAAAAABJRU5ErkJggg==';
const ORANGE_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWP4z8j4HwAFBQIB6OfkUgAAAABJRU5ErkJggg==';

const TIME_TO_WAIT = 200;

const { test, module } = QUnit;

const markup = '\
    <p>test text</p>\
    <br>';

module('Image uploading integration', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor');
        this.options = {
            toolbar: { items: ['image'] },
            imageUploading: { enabled: true },
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
        test('the form is correctly rendered', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            this.instance.focus();

            this.instance.setSelection(0, 1);

            this.$element
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            this.clock.tick(TIME_TO_WAIT);

            assert.strictEqual($(`.${ADD_IMAGE_DIALOG_CLASS}`).length, 1);
            assert.strictEqual($(`.${ADD_IMAGE_DIALOG_CLASS}`).length, 1);
        });

        // { enabled: false }
        // { imageUploading: null }
        // { check aspect ratio }
        // { check size changing }
        // { file uploader form tab }
        // { file uploading }
        // { uploading useBase64 }


        function prepareImageUpdateTest(caretPosition, selectionLength) {
            return function(assert) {
                const done = assert.async();
                this.createWidget({
                    value: `<img src=${WHITE_PIXEL}>`,
                    imageUploading: { enabled: false },
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
});
