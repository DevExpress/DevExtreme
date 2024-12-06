import $ from 'jquery';

import 'ui/html_editor';
import fx from 'common/core/animation/fx';

import { checkLink, prepareEmbedValue, prepareTableValue } from './utils.js';

const TOOLBAR_CLASS = 'dx-htmleditor-toolbar';
const TOOLBAR_WRAPPER_CLASS = 'dx-htmleditor-toolbar-wrapper';
const TOOLBAR_FORMAT_WIDGET_CLASS = 'dx-htmleditor-toolbar-format';
const TOOLBAR_MULTILINE_CLASS = 'dx-toolbar-multiline';
const TOOLBAR_FORMAT_BUTTON_ACTIVE_CLASS = 'dx-format-active';
const DROPDOWNMENU_CLASS = 'dx-dropdownmenu-button';
const DROPDOWNEDITOR_ICON_CLASS = 'dx-dropdowneditor-icon';
const BUTTON_CONTENT_CLASS = 'dx-button-content';
const QUILL_CONTAINER_CLASS = 'dx-quill-container';
const STATE_DISABLED_CLASS = 'dx-state-disabled';
const HEX_FIELD_CLASS = 'dx-colorview-label-hex';
const INPUT_CLASS = 'dx-texteditor-input';
const DIALOG_CLASS = 'dx-formdialog';
const DIALOG_FORM_CLASS = 'dx-formdialog-form';
const BUTTON_CLASS = 'dx-button';
const LIST_ITEM_CLASS = 'dx-list-item';

const BLACK_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWNgYmL6DwABFgEGpP/tHAAAAABJRU5ErkJggg==';

const { test, module: testModule } = QUnit;

function getToolbar($container) {
    return $container.find(`.${TOOLBAR_CLASS}`);
}

export default function() {
    testModule('Toolbar integration', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
            fx.off = true;
        },
        afterEach: function() {
            this.clock.restore();
            fx.off = false;
        }
    }, () => {
        test('Apply simple format without focus', function(assert) {
            const focusInStub = sinon.stub();
            const focusOutStub = sinon.stub();

            $('#htmlEditor').dxHtmlEditor({
                value: '<p>test</p>',
                toolbar: { items: ['bold'] },
                onFocusIn: focusInStub,
                onFocusOut: focusOutStub
            });

            try {
                $('#htmlEditor')
                    .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                    .trigger('dxclick');
            } catch(e) {
                assert.ok(false, 'error on formatting');
            }

            assert.strictEqual(focusInStub.callCount, 1, 'editor focused');
            assert.strictEqual(focusOutStub.callCount, 0, 'editor isn\'t blurred');
        });

        test('there is no extra focusout when applying toolbar formatting to the selected range', function(assert) {
            const done = assert.async();
            const focusInStub = sinon.stub();
            const focusOutStub = sinon.stub();
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: '<p>test</p>',
                toolbar: { items: ['bold'] },
                onValueChanged: (e) => {
                    assert.strictEqual(focusInStub.callCount, 1, 'editor focused');
                    assert.strictEqual(focusOutStub.callCount, 0, 'editor isn\'t blurred');
                    done();
                },
                onFocusIn: focusInStub,
                onFocusOut: focusOutStub
            })
                .dxHtmlEditor('instance');

            instance.setSelection(0, 2);

            $('#htmlEditor')
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');
        });

        test('Apply simple format with selection', function(assert) {
            const done = assert.async();
            const expected = '<p><strong>te</strong>st</p>';
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: '<p>test</p>',
                toolbar: { items: ['bold'] },
                onValueChanged: (e) => {
                    assert.equal(e.value, expected, 'markup contains a formatted text');
                    done();
                }
            })
                .dxHtmlEditor('instance');

            instance.setSelection(0, 2);

            $('#htmlEditor')
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');
        });

        test('Apply format via color dialog located in the adaptive menu', function(assert) {
            const done = assert.async();
            const toolbarClickStub = sinon.stub();
            const expected = '<p><span style="color: rgb(250, 250, 250);">te</span>st</p>';
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: '<p>test</p>',
                toolbar: {
                    items: [{ name: 'color', locateInMenu: 'always' }],
                    multiline: false
                },
                onValueChanged: (e) => {
                    assert.equal(e.value, expected, 'color has been applied');
                    assert.equal(toolbarClickStub.callCount, 2, 'Clicks on toolbar buttons should bubbling to the toolbar container');
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.setSelection(0, 2);

            $(`.${TOOLBAR_WRAPPER_CLASS}`).on('dxclick', toolbarClickStub);
            $('#htmlEditor')
                .find('.dx-dropdownmenu-button')
                .trigger('dxclick');

            $(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            $(`.${HEX_FIELD_CLASS} .${INPUT_CLASS}`)
                .val('fafafa')
                .change();


            $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
                .first()
                .trigger('dxclick');
        });

        test('adaptive menu should be hidden after selecting formatting', function(assert) {
            const done = assert.async();
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: '<p>test</p>',
                toolbar: {
                    items: [{
                        name: 'header',
                        acceptedValues: [false, 1, 2, 3, 4, 5],
                        options: {
                            opened: true
                        },
                        locateInMenu: 'always'
                    }],
                    multiline: false
                },
                onValueChanged: (e) => {
                    assert.ok($(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).is(':hidden'));
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.setSelection(0, 2);

            $('#htmlEditor')
                .find(`.${DROPDOWNMENU_CLASS}`)
                .trigger('dxclick');

            $(`.${LIST_ITEM_CLASS}`)
                .last()
                .trigger('dxclick');
        });

        test('Add a link via dialog', function(assert) {
            const done = assert.async();
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: '<p>test</p>',
                toolbar: { items: ['link'] },
                onValueChanged: ({ value }) => {
                    checkLink(assert, {
                        href: 'http://test.test',
                        content: 'te'
                    }, value);
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.setSelection(0, 2);

            $('#htmlEditor')
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            const $inputs = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`);
            const linkText = $inputs
                .last()
                .val();

            assert.strictEqual(linkText, 'te', 'Link test equal to the selected content');

            $inputs
                .first()
                .val('http://test.test')
                .change();

            $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
                .first()
                .trigger('dxclick');
        });

        test('Overflow menu button should have a correct content', function(assert) {
            $('#htmlEditor').html('<p>test</p>').dxHtmlEditor({
                toolbar: {
                    multiline: false,
                    items: ['bold', { text: 'test', showInMenu: 'always' }]
                }
            });

            const buttonContent = $('#htmlEditor')
                .find(`.${DROPDOWNMENU_CLASS} .${BUTTON_CONTENT_CLASS}`)
                .html();
            const expectedContent = '<i class="dx-icon dx-icon-overflow"></i>';

            assert.equal(buttonContent, expectedContent);
        });

        test('Editor disposing should dispose external toolbar', function(assert) {
            const $toolbarContainer = $('<div>').addClass('external-container');
            $('#qunit-fixture').append($toolbarContainer);

            const editor = $('#htmlEditor').dxHtmlEditor({
                toolbar: {
                    container: $toolbarContainer,
                    items: ['bold']
                }
            }).dxHtmlEditor('instance');

            assert.ok($toolbarContainer.hasClass(TOOLBAR_WRAPPER_CLASS), 'Container has wrapper class');
            assert.equal($toolbarContainer.find(`.${TOOLBAR_CLASS}`).length, 1, 'Toolbar container contains the htmlEditor\'s toolbar');

            editor.dispose();

            assert.equal($toolbarContainer.html(), '', 'Container\'s inner html is empty');
            assert.notOk($toolbarContainer.hasClass(TOOLBAR_WRAPPER_CLASS), 'Container hasn\'t wrapper class');
        });

        test('Editor should consider toolbar height', (function(assert) {
            const height = 100;
            const $container = $('#htmlEditor');
            let markup = '';

            for(let i = 1; i < 50; i++) {
                markup += `<p>test ${i}</p>`;
            }

            $container.html(markup).dxHtmlEditor({
                height: height,
                toolbar: { items: ['bold'] }
            });

            const quillContainerHeight = $container.find(`.${QUILL_CONTAINER_CLASS}`).outerHeight();
            const toolbarHeight = $container.find(`.${TOOLBAR_WRAPPER_CLASS}`).outerHeight();
            const bordersWidth = parseInt($container.css('border-top-width')) + parseInt($container.css('border-bottom-width'));

            assert.roughEqual(quillContainerHeight + toolbarHeight + bordersWidth, height, 1, 'Toolbar + editor equals to the predefined height');
        }));

        test('Toolbar correctly disposed after repaint', function(assert) {
            const $toolbarContainer = $('<div>').addClass('external-container');
            $('#qunit-fixture').append($toolbarContainer);

            const editor = $('#htmlEditor').dxHtmlEditor({
                toolbar: {
                    container: $toolbarContainer,
                    items: ['bold']
                }
            }).dxHtmlEditor('instance');

            editor.repaint();

            assert.ok($toolbarContainer.hasClass(TOOLBAR_WRAPPER_CLASS), 'Container has wrapper class');
            assert.equal($toolbarContainer.find(`.${TOOLBAR_CLASS}`).length, 1, 'Toolbar container contains the htmlEditor\'s toolbar');
        });

        test('Toolbar should be disabled once editor is read only', function(assert) {
            $('#htmlEditor').dxHtmlEditor({
                readOnly: true,
                toolbar: { items: ['bold'] }
            });

            const isToolbarDisabled = $(`.${TOOLBAR_CLASS}`).hasClass(STATE_DISABLED_CLASS);
            assert.ok(isToolbarDisabled);
        });

        test('Toolbar should be disabled once editor is disabled', function(assert) {
            $('#htmlEditor').dxHtmlEditor({
                disabled: true,
                toolbar: { items: ['bold'] }
            });

            const isToolbarDisabled = $(`.${TOOLBAR_CLASS}`).hasClass(STATE_DISABLED_CLASS);
            assert.ok(isToolbarDisabled);
        });

        test('Toolbar should correctly update disabled state on the option changed', function(assert) {
            const editor = $('#htmlEditor').dxHtmlEditor({
                disabled: true,
                readOnly: true,
                toolbar: { items: ['bold'] }
            }).dxHtmlEditor('instance');
            const $toolbar = $(`.${TOOLBAR_CLASS}`);

            editor.option('disabled', false);
            assert.ok($toolbar.hasClass(STATE_DISABLED_CLASS));

            editor.option('readOnly', false);
            assert.notOk($toolbar.hasClass(STATE_DISABLED_CLASS));

            editor.option('disabled', true);
            assert.ok($toolbar.hasClass(STATE_DISABLED_CLASS));
        });

        test('SelectBox should keep selected value after format applying', function(assert) {
            $('#htmlEditor').dxHtmlEditor({
                toolbar: { items: [{ name: 'size', acceptedValues: ['10px', '11px'] }] }
            });

            const $formatWidget = $('#htmlEditor').find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);

            $formatWidget
                .find(`.${DROPDOWNEDITOR_ICON_CLASS}`)
                .trigger('dxclick');

            $(`.${LIST_ITEM_CLASS}`)
                .last()
                .trigger('dxclick');

            const value = $formatWidget.find(`.${INPUT_CLASS}`).val();

            assert.strictEqual(value, '11px', 'SelectBox contain selected value');
        });

        test('link should be correctly set to an image', function(assert) {
            const done = assert.async();
            const $container = $('#htmlEditor');
            const link = 'http://test.test';
            const instance = $container.dxHtmlEditor({
                toolbar: { items: ['link'] },
                value: `<img src=${BLACK_PIXEL}>`,
                onValueChanged: ({ value }) => {
                    checkLink(assert, {
                        href: link,
                        content: `<img src="${BLACK_PIXEL}">`
                    }, value);
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.focus();
            instance.setSelection(0, 1);

            const $linkFormatButton = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).eq(0);
            $linkFormatButton.trigger('dxclick');

            const $urlInput = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`).first();
            const $okDialogButton = $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`).first();

            $urlInput
                .val(link)
                .change();

            $okDialogButton.trigger('dxclick');
        });

        test('link should be correctly added for a third', function(assert) {
            const done = assert.async();
            const $container = $('#htmlEditor');
            let $urlInput;
            let $okDialogButton;

            const prepareLink = () => {
                instance.focus();

                instance.setSelection(0, 4);

                const $linkFormatButton = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).eq(0);
                $linkFormatButton.trigger('dxclick');

                $urlInput = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`).first();
                $okDialogButton = $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`).first();
            };

            const valueChangeSpy = sinon.spy(({ value }) => {
                if(valueChangeSpy.calledOnce) {
                    setTimeout(() => {
                        prepareLink();
                        $urlInput
                            .val('http://test2.test')
                            .change();

                        $okDialogButton.trigger('dxclick');
                    });
                } else if(valueChangeSpy.calledTwice) {
                    setTimeout(() => {
                        prepareLink();
                        $urlInput
                            .val('http://test3.test')
                            .change();

                        $okDialogButton.trigger('dxclick');
                    });
                } else {
                    checkLink(assert, {
                        href: 'http://test3.test',
                        content: 'test'
                    }, value);
                    done();
                }
            });

            const instance = $container.dxHtmlEditor({
                toolbar: { items: ['link'] },
                value: '<p>test</p>',
                onValueChanged: valueChangeSpy
            }).dxHtmlEditor('instance');

            prepareLink();
            $urlInput
                .val('http://test1.test')
                .change();

            $okDialogButton.trigger('dxclick');
            this.clock.tick(10);
            this.clock.tick(10);
        });

        test('Add a link with empty text', function(assert) {
            const done = assert.async();
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: '<p>test</p>',
                toolbar: { items: ['link'] },
                onValueChanged: ({ value }) => {
                    checkLink(assert, {
                        href: 'http://test.test',
                        content: 'http://test.test',
                        afterLink: 'test'
                    }, value);
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.setSelection(0, 0);

            $('#htmlEditor')
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            const $inputs = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`);

            $inputs
                .first()
                .val('http://test.test')
                .change();

            $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
                .first()
                .trigger('dxclick');
        });

        test('Add a link and text without selection', function(assert) {
            const done = assert.async();
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: '<p>test</p>',
                toolbar: { items: ['link'] },
                onValueChanged: ({ value }) => {
                    checkLink(assert, {
                        href: 'http://test.test',
                        content: '123',
                        afterLink: 'test'
                    }, value);
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.setSelection(0, 0);

            $('#htmlEditor')
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            const $inputs = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`);

            $inputs
                .first()
                .val('http://test.test')
                .change();

            $inputs
                .last()
                .val('123')
                .change();

            $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
                .first()
                .trigger('dxclick');
        });

        test('Add a link with empty text and selected range', function(assert) {
            const done = assert.async();
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: '<p>test</p>',
                toolbar: { items: ['link'] },
                onValueChanged: ({ value }) => {
                    checkLink(assert, {
                        href: 'http://test.test',
                        content: 'http://test.test',
                        afterLink: 'st'
                    }, value);
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.setSelection(0, 2);

            $('#htmlEditor')
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            const $inputs = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`);

            $inputs
                .first()
                .val('http://test.test')
                .change();

            $inputs
                .last()
                .val('')
                .change();

            $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
                .first()
                .trigger('dxclick');
        });

        test('format image and text', function(assert) {
            const done = assert.async();
            const $container = $('#htmlEditor');
            const link = 'http://test.test';
            const instance = $container.dxHtmlEditor({
                toolbar: { items: ['link'] },
                value: `<img src=${BLACK_PIXEL}>12`,
                onValueChanged: ({ value }) => {
                    checkLink(assert, {
                        href: link,
                        content: `<img src="${BLACK_PIXEL}">12`
                    }, value);
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.focus();
            instance.setSelection(0, 3);

            const $linkFormatButton = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).eq(0);
            $linkFormatButton.trigger('dxclick');

            const $urlInput = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`).first();
            const $okDialogButton = $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`).first();

            $urlInput
                .val(link)
                .change();

            $okDialogButton.trigger('dxclick');
        });

        test('replace the text of the existed link', function(assert) {
            const done = assert.async();
            const $container = $('#htmlEditor');
            const link = 'http://test.test';
            const instance = $container.dxHtmlEditor({
                toolbar: { items: ['link'] },
                value: `<a href="${link}" target="_blank">test</a>`,
                onValueChanged: ({ value }) => {
                    checkLink(assert, {
                        href: link,
                        content: '123'
                    }, value);
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.focus();
            instance.setSelection(0, 4);

            const $linkFormatButton = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).eq(0);
            $linkFormatButton.trigger('dxclick');

            const $textInput = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`).last();
            const $okDialogButton = $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`).first();

            $textInput
                .val('123')
                .change();

            $okDialogButton.trigger('dxclick');
        });

        test('href in markup should be empty when empty href is passed in value (T1134100)', function(assert) {
            const $container = $('#htmlEditor').dxHtmlEditor({
                value: '<a href="">test</a>',
            });
            const linkHref = $container.find('a').attr('href');

            assert.strictEqual(linkHref, '');
        });

        test('href should be empty on empty URL input submit (T1134100)', function(assert) {
            const done = assert.async();
            const $container = $('#htmlEditor');

            const instance = $container.dxHtmlEditor({
                toolbar: { items: ['link'] },
                value: '<p>test</p>',
                onValueChanged: ({ value }) => {
                    checkLink(assert, {
                        href: '',
                        content: '123'
                    }, value);
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.focus();
            instance.setSelection(0, 4);

            const $linkFormatButton = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).eq(0);
            $linkFormatButton.trigger('dxclick');

            const $textInput = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`).last();
            const $okDialogButton = $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`).first();

            $textInput
                .val('123')
                .change();

            $okDialogButton.trigger('dxclick');
        });

        test('Update link dialog should display link text when link href is empty (T1134100)', function(assert) {
            const $container = $('#htmlEditor');
            const linkText = 'test';

            const instance = $container.dxHtmlEditor({
                toolbar: { items: ['link'] },
                value: `<a href="">${linkText}</a>`,
            }).dxHtmlEditor('instance');

            instance.focus();
            instance.setSelection(2, 0);

            const $linkFormatButton = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).eq(0);
            $linkFormatButton.trigger('dxclick');

            const $textInput = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`).last();

            assert.strictEqual(linkText, $textInput.val());
        });

        test('Add link dialog should contains info about link when cursor is placed on right border of link(T1157840)', function(assert) {
            const linkText = 'text';
            const linkAddress = 'http://devexpress.com';
            const $htmlEditor = $('#htmlEditor');
            const htmlEditor = $htmlEditor.dxHtmlEditor({
                toolbar: { items: ['link'] },
                value: `<a href="${linkAddress}">${linkText}</a>`,
            }).dxHtmlEditor('instance');

            htmlEditor.setSelection(linkText.length, 0);

            const $linkFormatButton = $htmlEditor.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).eq(0);
            $linkFormatButton.trigger('dxclick');

            const $formInputs = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`);
            const $linkAddressInput = $formInputs.first();
            const $textInput = $formInputs.last();

            assert.strictEqual(linkAddress, $linkAddressInput.val());
            assert.strictEqual(linkText, $textInput.val());
        });

        test('Text input should be visible in dialog if selected text has whitespaces on sides (T1134089)', function(assert) {
            const $container = $('#htmlEditor');
            const instance = $container.dxHtmlEditor({
                toolbar: { items: ['link'] },
                value: '<p>text with whitespaces</p>',
            }).dxHtmlEditor('instance');

            instance.focus();
            instance.setSelection(4, 6);

            const $linkFormatButton = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).eq(0);
            $linkFormatButton.trigger('dxclick');

            const $textInput = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`).last();

            assert.strictEqual($textInput.val(), ' with ');
        });

        test('Selected text with whitespaces on sides should be replaced by link', function(assert) {
            const done = assert.async();
            const link = 'http://test.com';
            const $container = $('#htmlEditor');
            const instance = $container.dxHtmlEditor({
                toolbar: { items: ['link'] },
                value: '<p>text with whitespaces</p>',
                onValueChanged: ({ value }) => {
                    checkLink(assert, {
                        href: link,
                        content: ' with '
                    }, value);
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.focus();
            instance.setSelection(4, 6);

            const $linkFormatButton = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).eq(0);
            $linkFormatButton.trigger('dxclick');

            const $urlInput = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`).first();
            const $okDialogButton = $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`).first();

            $urlInput
                .val(link)
                .change();

            $okDialogButton.trigger('dxclick');
        });

        test('Update whole link by dialog (zero-length selection)', function(assert) {
            const done = assert.async();
            const initialUrl = 'http://test.test';
            const initialUrlText = 'test';
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: `<a href="${initialUrl}">${initialUrlText}</a>']`,
                toolbar: { items: ['link'] },
                onValueChanged: ({ value }) => {
                    checkLink(assert, {
                        href: initialUrl + 'a',
                        content: initialUrlText + 't'
                    }, value);
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.setSelection(2, 0);

            $('#htmlEditor')
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            const $inputs = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`);
            const url = $inputs.first().val();
            const urlText = $inputs.last().val();

            $inputs
                .first()
                .val(initialUrl + 'a')
                .change();

            $inputs
                .last()
                .val(initialUrlText + 't')
                .change();

            $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
                .first()
                .trigger('dxclick');

            assert.strictEqual(url, initialUrl);
            assert.strictEqual(urlText, initialUrlText);
        });

        [
            { format: 'bold', which: 66 },
            { format: 'italic', which: 73 },
            { format: 'underline', which: 85 }
        ].forEach(({ format, which }) => {
            test(`hotkey handler can set active state for ${format} button (T1027453)`, function(assert) {
                const $container = $('#htmlEditor').html('<p>test</p>');
                const instance = $container.dxHtmlEditor({
                    toolbar: { items: ['bold', 'italic', 'underline'] },
                    height: 100,
                    width: 300,
                    value: '<p>test</p>',
                }).dxHtmlEditor('instance');

                const quill = instance.getQuillInstance();
                const formatHandler = quill.keyboard.bindings[which][1].handler;

                instance.setSelection(4, 0);
                instance.formatText(3, 1, { bold: true, italic: true, underline: true });

                $container.find(`.${TOOLBAR_FORMAT_BUTTON_ACTIVE_CLASS}`).removeClass(TOOLBAR_FORMAT_BUTTON_ACTIVE_CLASS);

                formatHandler.call(quill.keyboard, null, null, { which: which });

                const $activeFormats = $container.find(`.${TOOLBAR_FORMAT_BUTTON_ACTIVE_CLASS}`);

                assert.strictEqual($activeFormats.length, 1, 'one format button state is changed');
                assert.ok($activeFormats.eq(0).hasClass(`dx-${format}-format`), 'correct toolbar item is active');
            });

            test(`hotkey handler can set inactive state for ${format} button (T1027453)`, function(assert) {
                const $container = $('#htmlEditor').html('<p>test</p>');
                const instance = $container.dxHtmlEditor({
                    toolbar: { items: ['bold', 'italic', 'underline'] },
                    height: 100,
                    width: 300,
                    value: '<p>test</p>',
                }).dxHtmlEditor('instance');

                const quill = instance.getQuillInstance();
                const formatHandler = quill.keyboard.bindings[which][1].handler;

                instance.setSelection(4, 0);

                $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).addClass(TOOLBAR_FORMAT_BUTTON_ACTIVE_CLASS);

                formatHandler.call(quill.keyboard, null, null, { which: which });

                const $activeFormats = $container.find(`.${TOOLBAR_FORMAT_BUTTON_ACTIVE_CLASS}`);

                assert.strictEqual($activeFormats.length, 2, 'other toolbar items are not changed');
                assert.notOk($activeFormats.eq(0).hasClass(`dx-${format}-format`), 'toolbar item state is changed');
            });
        });

        test('history buttons are inactive after processing transcluded content', function(assert) {
            const done = assert.async();
            const $container = $('#htmlEditor').html('<p>test</p>');

            $container.dxHtmlEditor({
                toolbar: { items: ['undo', 'redo'] },
                onContentReady: () => {
                    const $toolbarButtons = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
                    assert.ok($toolbarButtons.eq(0).hasClass(STATE_DISABLED_CLASS), 'Undo button is disabled');
                    assert.ok($toolbarButtons.eq(1).hasClass(STATE_DISABLED_CLASS), 'Redo button is disabled');

                    done();
                }
            }).dxHtmlEditor('instance');

            this.clock.tick(10);
        });

        test('history buttons are inactive when editor has initial value', function(assert) {
            const done = assert.async();
            const $container = $('#htmlEditor');

            $container.dxHtmlEditor({
                toolbar: { items: ['undo', 'redo'] },
                value: '<p>test</p>',
                onContentReady: () => {
                    const $toolbarButtons = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
                    assert.ok($toolbarButtons.eq(0).hasClass(STATE_DISABLED_CLASS), 'Undo button is disabled');
                    assert.ok($toolbarButtons.eq(1).hasClass(STATE_DISABLED_CLASS), 'Redo button is disabled');

                    done();
                }
            }).dxHtmlEditor('instance');
        });

        test('history buttons are inactive when editor hasn\'t initial value', function(assert) {
            const done = assert.async();
            const $container = $('#htmlEditor');

            $container.dxHtmlEditor({
                toolbar: { items: ['undo', 'redo'] },
                onContentReady: () => {
                    const $toolbarButtons = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
                    assert.ok($toolbarButtons.eq(0).hasClass(STATE_DISABLED_CLASS), 'Undo button is disabled');
                    assert.ok($toolbarButtons.eq(1).hasClass(STATE_DISABLED_CLASS), 'Redo button is disabled');

                    done();
                }
            }).dxHtmlEditor('instance');
        });

        test('Toolbar should correctly update its dimensions after changing the width of the HtmlEditor', function(assert) {
            const $container = $('#htmlEditor');
            const instance = $container.dxHtmlEditor({
                width: 1000,
                toolbar: {
                    items: [
                        'undo', 'redo', 'bold', 'italic', 'strike', 'underline', 'separator',
                        'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'separator',
                        'orderedList', 'bulletList', 'separator',
                        'color', 'background', 'separator',
                        'link', 'image', 'separator',
                        'clear', 'codeBlock', 'blockquote'
                    ]
                }
            }).dxHtmlEditor('instance');

            this.clock.tick(10);
            instance.option('width', 100);
            this.clock.tick(10);

            const toolbarWidth = $container.find(`.${TOOLBAR_CLASS}`).width();
            const beforeContainerWidth = $container.find('.dx-toolbar-before').width();
            assert.ok(beforeContainerWidth <= toolbarWidth, 'toolbar items fits the widget container');
        });

        test('Multiline toolbar rendered by default', function(assert) {
            const $container = $('#htmlEditor');
            $container.dxHtmlEditor({
                toolbar: { items: ['bold'] }
            });

            assert.ok(getToolbar($container).hasClass(TOOLBAR_MULTILINE_CLASS));
        });

        [true, false].forEach((multiline) => {
            test(`Multiline mode change to ${multiline} is performed correctly at runtime`, function(assert) {
                const $container = $('#htmlEditor');
                const editor = $container.dxHtmlEditor({
                    toolbar: {
                        items: ['bold'],
                        multiline
                    }
                }).dxHtmlEditor('instance');

                assert.strictEqual(getToolbar($container).hasClass(TOOLBAR_MULTILINE_CLASS), multiline, `Toolbar in ${multiline ? 'multiline' : 'adaptive'} mode`);

                editor.option('toolbar.multiline', !multiline);
                assert.strictEqual(getToolbar($container).hasClass(TOOLBAR_MULTILINE_CLASS), !multiline, `Toolbar in ${!multiline ? 'multiline' : 'adaptive'} mode`);
            });
        });

        test('Add a table via dialog', function(assert) {
            const done = assert.async();
            const expectedValue = '<table><tbody><tr><td><p>t</p></td></tr><tr><td><p><br></p></td></tr></tbody></table><p>est</p>';
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: '<p>test</p>',
                toolbar: { items: ['insertTable'] },
                onValueChanged: ({ value }) => {
                    assert.strictEqual(prepareTableValue(value), expectedValue);
                    done();
                }
            }).dxHtmlEditor('instance');

            instance.setSelection(1, 0);

            $('#htmlEditor')
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            const $inputs = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`);

            $inputs
                .first()
                .val('2')
                .change();

            $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
                .first()
                .trigger('dxclick');
        });

        test('Add a variable via toolbar', function(assert) {
            fx.off = false;
            const done = assert.async();
            const expectedValue = '<p><span class="dx-variable" data-var-start-esc-char="%" data-var-end-esc-char="%" data-var-value="test"><span contenteditable="false">%test%</span></span></p>';
            $('#htmlEditor').dxHtmlEditor({
                toolbar: { items: ['variable'] },
                variables: {
                    dataSource: ['test'],
                    escapeChar: '%'
                },
                onValueChanged: ({ value }) => {
                    assert.strictEqual(prepareEmbedValue(value), expectedValue);
                    done();
                }
            });

            $('#htmlEditor')
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            $('.dx-suggestion-list .dx-list-item').trigger('dxclick');
            this.clock.tick(10);
        });
    });
}
