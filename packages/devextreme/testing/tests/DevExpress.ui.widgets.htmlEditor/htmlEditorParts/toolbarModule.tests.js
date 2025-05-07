import $ from 'jquery';

import 'generic_light.css!';

import 'ui/select_box';
import '__internal/ui/color_box/m_color_view';

import Toolbar from '__internal/ui/html_editor/modules/m_toolbar';
import FormDialog from '__internal/ui/html_editor/ui/m_formDialog';
import { noop } from 'core/utils/common';
import keyboardMock from '../../../helpers/keyboardMock.js';
import fx from 'common/core/animation/fx';
import errors from 'ui/widget/ui.errors';
import localization from 'localization';
import resizeCallbacks from 'core/utils/resize_callbacks.js';

const TOOLBAR_CLASS = 'dx-htmleditor-toolbar';
const TOOLBAR_WRAPPER_CLASS = 'dx-htmleditor-toolbar-wrapper';
const TOOLBAR_FORMAT_WIDGET_CLASS = 'dx-htmleditor-toolbar-format';
const ACTIVE_FORMAT_CLASS = 'dx-format-active';
const SELECTED_STATE_CLASS = 'dx-state-selected';
const FORM_CLASS = 'dx-formdialog-form';
const DIALOG_CLASS = 'dx-formdialog';
const DIALOG_TARGET_ITEM_CLASS = 'dx-formdialog-field-target';
const SEPARATOR_CLASS = 'dx-htmleditor-toolbar-separator';
const MENU_SEPARATOR_CLASS = 'dx-htmleditor-toolbar-menu-separator';

const BUTTON_CLASS = 'dx-button';
const SELECTBOX_CLASS = 'dx-selectbox';
const COLORVIEW_CLASS = 'dx-colorview';
const DROPDOWNMENU_BUTTON_CLASS = 'dx-dropdownmenu-button';
const BUTTON_WITH_TEXT_CLASS = 'dx-button-has-text';
const ICON_CLASS = 'dx-icon';
const HOME_ICON_CLASS = 'dx-icon-home';
const DISABLED_STATE_CLASS = 'dx-state-disabled';
const CHECKBOX_CHECKED_CLASS = 'dx-checkbox-checked';
const CHECKBOX_TEXT_CLASS = 'dx-checkbox-text';
const FIELD_ITEM_CLASS = 'dx-field-item';
const FIELD_ITEM_LABEL_CLASS = 'dx-field-item-label-text';
const COLOR_VIEW_HEX_FIELD_CLASS = 'dx-colorview-label-hex';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const DROPDOWNEDITOR_ICON_CLASS = 'dx-dropdowneditor-icon';
const LIST_ITEM_CLASS = 'dx-list-item';
const POPUP_TITLE_CLASS = 'dx-popup-title';

const BOLD_FORMAT_CLASS = 'dx-bold-format';
const SIZE_FORMAT_CLASS = 'dx-size-format';
const HEADER_FORMAT_CLASS = 'dx-header-format';
const ITALIC_FORMAT_CLASS = 'dx-italic-format';
const ALIGNCENTER_FORMAT_CLASS = 'dx-aligncenter-format';
const CODEBLOCK_FORMAT_CLASS = 'dx-codeblock-format';
const COLOR_FORMAT_CLASS = 'dx-color-format';
const BACKGROUND_FORMAT_CLASS = 'dx-background-format';
const ORDEREDLIST_FORMAT_CLASS = 'dx-orderedlist-format';
const BULLETLIST_FORMAT_CLASS = 'dx-bulletlist-format';
const CLEAR_FORMAT_CLASS = 'dx-clear-format';
const IMAGE_FORMAT_CLASS = 'dx-image-format';
const INSERT_TABLE_FORMAT_CLASS = 'dx-inserttable-format';
const TOOLBAR_MULTILINE_CLASS = 'dx-toolbar-multiline';

const TABLE_OPERATIONS = [
    'insertTable',
    'insertRowAbove',
    'insertRowBelow',
    'insertColumnLeft',
    'insertColumnRight',
    'deleteColumn',
    'deleteRow',
    'deleteTable'
];

const simpleModuleConfig = {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('#htmlEditor');
        this.log = [];
        this.quillMock = {
            format: (format, value) => {
                this.log.push({ format: format, value: value });
            },
            focus: noop,
            on: noop,
            off: noop,
            keyboard: {
                addBinding: noop
            },
            table: {
                insertTable: sinon.stub(),
                insertRowAbove: sinon.stub(),
                insertRowBelow: sinon.stub(),
                insertColumnLeft: sinon.stub(),
                insertColumnRight: sinon.stub(),
                deleteTable: sinon.stub(),
                deleteRow: sinon.stub(),
                deleteColumn: sinon.stub()
            },
            getSelection: () => { return { index: 0, length: 0 }; },
            getFormat: () => { return {}; },
            getModule: (moduleName) => this.quillMock[moduleName]
        };

        this.options = {
            editorInstance: {
                NAME: 'dxHtmlEditor',
                addCleanCallback: noop,
                addContentInitializedCallback: noop,
                $element: () => {
                    return this.$element;
                },
                _createComponent: ($element, widget, options) => {
                    return new widget($element, options);
                },
                _getQuillContainer: () => {
                    return this.$element;
                },
                _saveValueChangeEvent: noop,
                option: noop,
                on: noop
            }
        };
    },
    afterEach: function() {
        fx.off = false;
    }
};

const dialogModuleConfig = {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('#htmlEditor');
        this.log = [];
        this.focusStub = sinon.stub();

        this.quillMock = {
            format: (format, value) => {
                this.log.push({ format: format, value: value });
            },
            insertText: (index, text, formats) => {
                this.log.push({ index: index, text: text, formats: formats });
            },
            insertEmbed: (index, type, value) => {
                this.log.push({ index: index, type: type, value: value });
            },
            on: noop,
            off: noop,
            keyboard: {
                addBinding: noop
            },
            table: {
                insertTable: sinon.stub(),
                insertRowAbove: sinon.stub(),
                insertRowBelow: sinon.stub(),
                insertColumnLeft: sinon.stub(),
                insertColumnRight: sinon.stub(),
                deleteTable: sinon.stub(),
                deleteRow: sinon.stub(),
                deleteColumn: sinon.stub()
            },
            focus: this.focusStub,
            getSelection: noop,
            setSelection: (index, length) => { this.log.push({ setSelection: [index, length] }); },
            getFormat: () => { return {}; },
            getLength: () => { return 1; },
            getModule: (moduleName) => this.quillMock[moduleName]
        };

        this.options = {
            editorInstance: {
                NAME: 'dxHtmlEditor',
                addCleanCallback: noop,
                addContentInitializedCallback: noop,
                $element: () => {
                    return this.$element;
                },
                _createComponent: ($element, widget, options) => {
                    return new widget($element, options);
                },
                _getQuillContainer: () => {
                    return this.$element;
                },
                _saveValueChangeEvent: noop,
                on: noop,
                option: noop,
                formDialogOption: (...options) => this.formDialog && this.formDialog.popupOption(...options),
                showFormDialog: (formConfig) => {
                    return this.formDialog.show(formConfig);
                }
            }
        };

        this.formDialog = new FormDialog(this.options.editorInstance, { container: this.$element, position: null });
    },
    afterEach: function() {
        fx.off = false;
    }
};

const { test, module: testModule } = QUnit;

testModule('Toolbar module', simpleModuleConfig, () => {
    test('Render toolbar without any options', function(assert) {
        new Toolbar(this.quillMock, this.options);

        assert.notOk(this.$element.hasClass(TOOLBAR_WRAPPER_CLASS), 'Toolbar rendered not on the root element');
        assert.notOk(this.$element.children().hasClass(TOOLBAR_WRAPPER_CLASS), 'Toolbar isn\'t render inside the root element (no items)');
        assert.strictEqual(this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).length, 0, 'There are no format widgets');
    });

    test('Render toolbar with items', function(assert) {
        this.options.items = ['bold'];
        new Toolbar(this.quillMock, this.options);

        const $toolbarWrapper = this.$element.children();
        const $toolbar = $toolbarWrapper.children();
        const $formatWidget = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);

        assert.notOk(this.$element.hasClass(TOOLBAR_WRAPPER_CLASS), 'Toolbar rendered not on the root element');
        assert.ok($toolbarWrapper.hasClass(TOOLBAR_WRAPPER_CLASS), 'Toolbar wrapper render inside the root element');
        assert.ok($toolbar.hasClass(TOOLBAR_CLASS), 'Toolbar render inside the wrapper element');
        assert.ok($toolbar.hasClass(TOOLBAR_MULTILINE_CLASS), 'Toolbar is rendered with multiline mode by default');
        assert.equal($formatWidget.length, 1, 'There is one format widget');
        assert.ok($formatWidget.hasClass('dx-bold-format'), 'It\'s the bold format');
        assert.equal($formatWidget.find('.dx-icon-bold').length, 1, 'It has a bold icon');
    });

    test('Render toolbar on custom container', function(assert) {
        this.options.items = ['bold'];
        this.options.container = this.$element;
        new Toolbar(this.quillMock, this.options);

        const $toolbar = this.$element.children();

        assert.ok(this.$element.hasClass(TOOLBAR_WRAPPER_CLASS), 'Toolbar rendered on the custom element');
        assert.ok($toolbar.hasClass(TOOLBAR_CLASS), 'Toolbar rendered on the custom element');
    });

    test('Render toolbar with simple formats', function(assert) {
        this.options.items = ['bold', 'strike'];

        new Toolbar(this.quillMock, this.options);
        const $formatWidgets = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);

        assert.equal($formatWidgets.length, 2, 'There are 2 format widgets');
        assert.ok($formatWidgets.first().hasClass('dx-button'), 'Change simple format via Button');
    });

    [{
        optionName: 'formatName',
        item: {
            formatName: 'undo'
        }
    }, {
        optionName: 'formatValues',
        item: {
            name: 'size',
            formatValues: ['10px']
        }
    }, {
        optionName: 'formatValues',
        item: {
            name: 'size',
            formatValues: null
        }
    }].forEach(optionInfo => {
        test(`should show 'W1016' warning if deprecated ${optionInfo.optionName} toolbar item field is used`, function(assert) {
            const originalLog = errors.log;
            let warning = null;
            this.options.items = [optionInfo.item];

            errors.log = (loggedWarning) => warning = loggedWarning;

            try {
                new Toolbar(this.quillMock, this.options);
                assert.strictEqual(warning, 'W1016');
            } finally {
                errors.log = originalLog;
            }
        });
    });

    test('Simple format handling', function(assert) {
        let isHandlerTriggered;
        this.quillMock.getFormat = () => {
            return { bold: false };
        };
        this.options.items = ['bold', {
            name: 'strike',
            widget: 'dxButton',
            options: {
                onClick: () => {
                    isHandlerTriggered = true;
                }
            }
        }, {
            name: 'underline'
        }, {
            name: 'italic',
            widget: 'dxCheckBox'
        }, {
            name: 'superscript',
            options: {
                icon: 'home'
            }
        }];

        new Toolbar(this.quillMock, this.options);

        const $formatWidgets = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);

        $formatWidgets.each((index, element) => {
            $(element).trigger('dxclick');
        });

        const $homeIcon = $formatWidgets.last().find(`.${HOME_ICON_CLASS}`);

        assert.deepEqual(
            this.log,
            [{
                format: 'bold',
                value: true
            }, {
                format: 'underline',
                value: true
            }, {
                format: 'script',
                value: 'super'
            }]
        );
        assert.ok(isHandlerTriggered, 'Custom handler triggered');
        assert.equal($homeIcon.length, 1, 'last button has a custom icon');
    });

    test('Enum format handling', function(assert) {
        this.quillMock.getFormat = () => {
            return {};
        };
        this.options.items = [
            { name: 'size', acceptedValues: ['10px', '2em'] }
        ];

        new Toolbar(this.quillMock, this.options);

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS} .${DROPDOWNEDITOR_ICON_CLASS}`)
            .trigger('dxclick');

        $(`.${LIST_ITEM_CLASS}`)
            .first()
            .trigger('dxclick');

        assert.deepEqual(
            this.log,
            [{
                format: 'size',
                value: '10px'
            }]
        );
    });

    test('Enum with custom options format handling', function(assert) {
        this.quillMock.getFormat = () => {
            return {};
        };
        this.options.items = [
            { name: 'script', acceptedValues: [false, 'super', 'sub'], options: { placeholder: 'Test' } }
        ];

        new Toolbar(this.quillMock, this.options);

        const $formatWidget = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);

        $formatWidget
            .find(`.${DROPDOWNEDITOR_ICON_CLASS}`)
            .trigger('dxclick');

        $(`.${LIST_ITEM_CLASS}`)
            .last()
            .trigger('dxclick');

        const placeholder = $formatWidget.dxSelectBox('option', 'placeholder');

        assert.deepEqual(
            this.log,
            [{
                format: 'script',
                value: 'sub'
            }]
        );
        assert.equal(placeholder, 'Test', 'widget has a custom placeholder');
    });

    QUnit.test('textbox should be focused on mousedown (T1196805)', function(assert) {
        this.options.items = [{
            widget: 'dxTextBox',
        }];

        new Toolbar(this.quillMock, this.options);

        const $textBox = $(`.${TEXTEDITOR_INPUT_CLASS}`);

        $textBox.trigger('mousedown');

        const root = document.querySelector('#qunit-fixture');
        const activeElement = root.shadowRoot ? root.shadowRoot.activeElement : document.activeElement;

        assert.strictEqual(activeElement, $textBox[0]);
    });

    test('handle align formatting', function(assert) {
        this.options.items = ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'];

        new Toolbar(this.quillMock, this.options);

        const $formatWidgets = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);

        $formatWidgets.each((index, element) => {
            $(element).trigger('dxclick');
        });

        this.quillMock.getFormat = () => { return { align: 'justify' }; };
        $formatWidgets.last().trigger('dxclick');

        assert.deepEqual(
            this.log,
            [{
                format: 'align',
                value: 'left'
            }, {
                format: 'align',
                value: 'center'
            }, {
                format: 'align',
                value: 'right'
            }, {
                format: 'align',
                value: 'justify'
            }, {
                format: 'align',
                value: false
            }]
        );
    });

    test('handle codeBlock formatting', function(assert) {
        this.options.items = ['codeBlock'];

        new Toolbar(this.quillMock, this.options);

        const $formatButton = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
        $formatButton.trigger('dxclick');

        this.quillMock.getFormat = () => { return { 'code-block': true }; };

        $formatButton.trigger('dxclick');

        assert.deepEqual(
            this.log,
            [{
                format: 'code-block',
                value: true
            }, {
                format: 'code-block',
                value: false
            }]);
    });

    test('handle orderedList formatting', function(assert) {
        this.options.items = ['orderedList'];

        new Toolbar(this.quillMock, this.options);

        const $formatButton = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
        $formatButton.trigger('dxclick');

        this.quillMock.getFormat = () => { return { list: 'ordered' }; };

        $formatButton.trigger('dxclick');

        assert.deepEqual(
            this.log,
            [{
                format: 'list',
                value: 'ordered'
            }, {
                format: 'list',
                value: false
            }]);
    });

    test('handle bulletList formatting', function(assert) {
        this.options.items = ['bulletList'];

        new Toolbar(this.quillMock, this.options);

        const $formatButton = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
        $formatButton.trigger('dxclick');

        this.quillMock.getFormat = () => { return { list: 'bullet' }; };

        $formatButton.trigger('dxclick');

        assert.deepEqual(
            this.log,
            [{
                format: 'list',
                value: 'bullet'
            }, {
                format: 'list',
                value: false
            }]);
    });

    test('Render toolbar with enum format', function(assert) {
        this.options.items = [{ name: 'header', acceptedValues: [1, 2, 3, false] }];

        new Toolbar(this.quillMock, this.options);
        const $formatWidget = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);

        assert.ok($formatWidget.hasClass(SELECTBOX_CLASS), 'Change enum format via SelectBox');
    });

    test('undo operation', function(assert) {
        const undoStub = sinon.stub();
        this.quillMock.history = {
            undo: undoStub,
            stack: { undo: ['test'], redo: [] }
        };
        this.options.items = ['undo'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        toolbar.updateHistoryWidgets();

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        assert.ok(undoStub.calledOnce, 'call undo');
    });

    test('redo operation', function(assert) {
        const redoStub = sinon.stub();
        this.quillMock.history = {
            redo: redoStub,
            stack: { undo: [], redo: ['test'] }
        };
        this.options.items = ['redo'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        toolbar.updateHistoryWidgets();

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        assert.ok(redoStub.calledOnce, 'call redo');
    });

    test('custom item without name shouldn\'t have format class', function(assert) {
        this.options.items = ['bold', { widget: 'dxButton', options: { text: 'test' } }];

        new Toolbar(this.quillMock, this.options);

        const $buttons = this.$element.find(`.${BUTTON_CLASS}`);

        assert.ok($buttons.eq(0).hasClass(TOOLBAR_FORMAT_WIDGET_CLASS), 'Bold');
        assert.notOk($buttons.eq(1).hasClass(TOOLBAR_FORMAT_WIDGET_CLASS), 'Custom button');
    });

    test('handle indent formatting', function(assert) {
        this.options.items = ['decreaseIndent', 'increaseIndent'];

        new Toolbar(this.quillMock, this.options);

        const $formatButton = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
        $formatButton.eq(0).trigger('dxclick');
        $formatButton.eq(1).trigger('dxclick');

        assert.deepEqual(
            this.log,
            [{
                format: 'indent',
                value: '-1'
            }, {
                format: 'indent',
                value: '+1'
            }]);
    });

    test('handle script formatting', function(assert) {
        this.options.items = ['superscript', 'subscript'];

        new Toolbar(this.quillMock, this.options);

        const $formatButton = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
        $formatButton.eq(0).trigger('dxclick');
        $formatButton.eq(1).trigger('dxclick');

        this.quillMock.getFormat = () => { return { script: 'super' }; };
        $formatButton.eq(0).trigger('dxclick');

        this.quillMock.getFormat = () => { return { script: 'sub' }; };
        $formatButton.eq(1).trigger('dxclick');

        assert.deepEqual(
            this.log,
            [{
                format: 'script',
                value: 'super'
            }, {
                format: 'script',
                value: 'sub'
            }, {
                format: 'script',
                value: false
            }, {
                format: 'script',
                value: false
            }]);
    });

    test('toolbar should prevent default mousedown event', function(assert) {
        this.options.items = ['bold'];

        new Toolbar(this.quillMock, this.options);

        this.$element.on('mousedown', (e) => {
            assert.ok(e.isDefaultPrevented(), 'Default prevented');
        });

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('mousedown');
    });

    test('default click handler should correctly revert defined format', function(assert) {
        this.options.items = ['bold'];
        this.quillMock.getFormat = () => { return { bold: '' }; };

        new Toolbar(this.quillMock, this.options);

        const $formatButton = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
        $formatButton.trigger('dxclick');

        assert.deepEqual(
            this.log,
            [{
                format: 'bold',
                value: false
            }]);
    });

    test('Size selectBox has custom width', function(assert) {
        this.options.items = [{
            name: 'size',
            acceptedValues: ['8pt', '12pt'] },
        {
            name: 'header',
            acceptedValues: [1, 2, 3, false]
        }];

        new Toolbar(this.quillMock, this.options);
        const $sizeEditor = this.$element.find(`.${SIZE_FORMAT_CLASS}`).eq(0);
        const $headerEditor = this.$element.find(`.${HEADER_FORMAT_CLASS}`).eq(0);

        assert.ok($sizeEditor.width() < $headerEditor.width() * 0.9, 'Size editor has custom width');
    });
});

testModule('Active formats', simpleModuleConfig, () => {
    test('without active formats', function(assert) {
        this.options.items = ['bold', 'italic', 'clear'];

        const toolbar = new Toolbar(this.quillMock, this.options);

        toolbar.updateFormatWidgets();
        const $activeFormats = this.$element.find(`.${ACTIVE_FORMAT_CLASS}`);

        assert.equal($activeFormats.length, 0, 'There is no active formats');
    });

    test('clear formatting', function(assert) {
        this.quillMock.getFormat = () => { return { bold: true }; };
        this.options.items = ['clear'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        const $clearFormat = this.$element.find(`.${CLEAR_FORMAT_CLASS}`);

        assert.ok($clearFormat.hasClass(DISABLED_STATE_CLASS), 'Clear formats button is disabled by default');

        toolbar.updateFormatWidgets();

        assert.notOk($clearFormat.hasClass(DISABLED_STATE_CLASS), 'Clear formats button is active because there is active format');
    });

    test('clear formatting with a selected range greater than 1 character long [T947981]', function(assert) {
        this.quillMock.getSelection = () => { return { index: 0, length: 5 }; };
        this.quillMock.getFormat = () => {};
        this.options.items = ['clear'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        const $clearFormat = this.$element.find(`.${CLEAR_FORMAT_CLASS}`);

        assert.ok($clearFormat.hasClass(DISABLED_STATE_CLASS), 'Clear formats button is disabled by default');

        toolbar.updateFormatWidgets();

        assert.notOk($clearFormat.hasClass(DISABLED_STATE_CLASS), 'Clear formats button is active because long range can contain formats');
    });

    test('clear formatting with a selected range 1 character long', function(assert) {
        this.quillMock.getSelection = () => { return { index: 0, length: 1 }; };
        this.quillMock.getFormat = () => {};
        this.options.items = ['clear'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        const $clearFormat = this.$element.find(`.${CLEAR_FORMAT_CLASS}`);

        assert.ok($clearFormat.hasClass(DISABLED_STATE_CLASS), 'Clear formats button is disabled by default');

        toolbar.updateFormatWidgets();

        assert.ok($clearFormat.hasClass(DISABLED_STATE_CLASS), 'Clear formats button is disabled because there is no active format');
    });

    test('simple format', function(assert) {
        this.quillMock.getFormat = () => { return { bold: true }; };
        this.options.items = ['bold', 'italic', 'strike'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        toolbar.updateFormatWidgets();
        const $activeFormats = this.$element.find(`.${ACTIVE_FORMAT_CLASS}`);

        assert.strictEqual($activeFormats.length, 1, 'Bold format button is active');
        assert.strictEqual($activeFormats.hasClass(BOLD_FORMAT_CLASS), true, 'Button has bold format class');
        assert.strictEqual($activeFormats.hasClass(SELECTED_STATE_CLASS), true, 'Bold format button has selected state class');
        assert.strictEqual($activeFormats.attr('aria-pressed'), 'true', 'Bold format button has aria-pressed attr');
    });

    test('several simple format', function(assert) {
        this.quillMock.getFormat = () => { return { bold: true, italic: true }; };
        this.options.items = ['bold', 'italic', 'strike'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        toolbar.updateFormatWidgets();
        const $activeFormats = this.$element.find(`.${ACTIVE_FORMAT_CLASS}`);

        assert.equal($activeFormats.length, 2, 'Two format buttons are active');
        assert.ok($activeFormats.eq(0).hasClass(BOLD_FORMAT_CLASS), 'it\'s a bold button');
        assert.ok($activeFormats.eq(1).hasClass(ITALIC_FORMAT_CLASS), 'it\'s an italic block button');

    });

    test('alias format', function(assert) {
        this.quillMock.getFormat = () => { return { 'code-block': true }; };
        this.options.items = ['codeBlock'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        toolbar.updateFormatWidgets();
        const $activeFormats = this.$element.find(`.${ACTIVE_FORMAT_CLASS}`);

        assert.equal($activeFormats.length, 1, 'Single format button is active');
        assert.ok($activeFormats.hasClass(CODEBLOCK_FORMAT_CLASS), 'it\'s a code block button');
    });

    test('composite format', function(assert) {
        this.quillMock.getFormat = () => { return { align: 'center' }; };
        this.options.items = ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        toolbar.updateFormatWidgets();
        const $activeFormats = this.$element.find(`.${ACTIVE_FORMAT_CLASS}`);

        assert.equal($activeFormats.length, 1, 'single button is active');
        assert.ok($activeFormats.hasClass(ALIGNCENTER_FORMAT_CLASS), 'it\'s an align center button');
    });

    test('color format', function(assert) {
        this.quillMock.getFormat = () => { return { color: '#fafafa' }; };
        this.options.items = ['color', 'background', 'bold'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        toolbar.updateFormatWidgets();
        const $activeFormats = this.$element.find(`.${ACTIVE_FORMAT_CLASS}`);
        const $icon = $activeFormats.find(`.${ICON_CLASS}`);

        assert.equal($activeFormats.length, 1, 'single button is active');
        assert.ok($activeFormats.hasClass(COLOR_FORMAT_CLASS), 'it\'s a color button');
        assert.equal($icon.get(0).style.borderBottomColor, 'rgb(250, 250, 250)', 'icon has correct color');

        this.quillMock.getFormat = () => { return {}; };
        toolbar.updateFormatWidgets();
        assert.equal($icon.get(0).style.borderBottomColor, 'transparent', 'icon has correct color after reset format');
    });

    test('background format', function(assert) {
        this.quillMock.getFormat = () => { return { background: '#fafafa' }; };
        this.options.items = ['color', 'background', 'bold'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        toolbar.updateFormatWidgets();
        const $activeFormats = this.$element.find(`.${ACTIVE_FORMAT_CLASS}`);
        const $icon = $activeFormats.find(`.${ICON_CLASS}`);

        assert.equal($activeFormats.length, 1, 'single button is active');
        assert.ok($activeFormats.hasClass(BACKGROUND_FORMAT_CLASS), 'it\'s a background button');
        assert.equal($icon.get(0).style.borderBottomColor, 'rgb(250, 250, 250)', 'icon has correct background');

        this.quillMock.getFormat = () => { return {}; };
        toolbar.updateFormatWidgets();
        assert.equal($icon.get(0).style.borderBottomColor, 'transparent', 'icon has correct background after reset format');
    });

    test('list format', function(assert) {
        this.quillMock.getFormat = () => { return { list: 'ordered' }; };
        this.options.items = ['orderedList', 'bulletList', 'bold'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        toolbar.updateFormatWidgets();
        let $activeFormats = this.$element.find(`.${ACTIVE_FORMAT_CLASS}`);

        assert.equal($activeFormats.length, 1, 'single button is active');
        assert.ok($activeFormats.hasClass(ORDEREDLIST_FORMAT_CLASS), 'it\'s an ordered list button');

        this.quillMock.getFormat = () => { return { list: 'bullet' }; };
        toolbar.updateFormatWidgets(true);

        $activeFormats = this.$element.find(`.${ACTIVE_FORMAT_CLASS}`);

        assert.equal($activeFormats.length, 1, 'single button is active');
        assert.ok($activeFormats.hasClass(BULLETLIST_FORMAT_CLASS), 'it\'s a bullet list button');
    });

    test('undo/redo', function(assert) {
        this.quillMock.history = { stack: { undo: [], redo: [] } };
        this.options.items = ['undo', 'redo'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        toolbar.updateHistoryWidgets();
        const $historyWidgets = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);

        assert.equal($historyWidgets.length, 2, 'Undo and redo buttons');
        assert.ok($historyWidgets.eq(0).hasClass(DISABLED_STATE_CLASS), 'Undo is disabled');
        assert.ok($historyWidgets.eq(1).hasClass(DISABLED_STATE_CLASS), 'Redo is disabled');

        this.quillMock.history.stack.undo.push('test');
        toolbar.updateHistoryWidgets();
        assert.notOk($historyWidgets.eq(0).hasClass(DISABLED_STATE_CLASS), 'Undo is enabled');
        assert.ok($historyWidgets.eq(1).hasClass(DISABLED_STATE_CLASS), 'Redo is disabled');

        this.quillMock.history.stack.redo.push('test');
        toolbar.updateHistoryWidgets();
        assert.notOk($historyWidgets.eq(0).hasClass(DISABLED_STATE_CLASS), 'Undo is enabled');
        assert.notOk($historyWidgets.eq(1).hasClass(DISABLED_STATE_CLASS), 'Redo is enabled');
    });

    test('SelectBox should display currently applied value', function(assert) {
        this.quillMock.getFormat = () => { return { size: '10px' }; };
        this.options.items = [{ name: 'size', acceptedValues: ['10px', '11px'] }];

        const toolbar = new Toolbar(this.quillMock, this.options);

        toolbar.updateFormatWidgets();

        const value = this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS} .${TEXTEDITOR_INPUT_CLASS}`)
            .val();

        assert.strictEqual(value, '10px', 'SelectBox contain selected value');
    });

    test('Image format', function(assert) {
        this.quillMock.getFormat = () => { return { imageSrc: 'testImage' }; };
        this.options.items = ['image', 'background', 'bold'];

        const toolbar = new Toolbar(this.quillMock, this.options);
        toolbar.updateFormatWidgets();
        const $activeFormats = this.$element.find(`.${ACTIVE_FORMAT_CLASS}`);

        assert.equal($activeFormats.length, 1, 'single button is active');
        assert.ok($activeFormats.hasClass(IMAGE_FORMAT_CLASS), 'it\'s an image button');
    });
});

testModule('Toolbar dialogs', dialogModuleConfig, () => {
    test('show color dialog', function(assert) {
        this.options.items = ['color'];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $form = $(`.${FORM_CLASS}`);
        const $colorView = $form.find(`.${COLORVIEW_CLASS}`);
        const $hexValueInput = $colorView.find(`.${COLOR_VIEW_HEX_FIELD_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);
        const popupTitleText = $(`.${POPUP_TITLE_CLASS}`).text();

        assert.strictEqual($form.length, 1, 'Form shown');
        assert.strictEqual($colorView.length, 1, 'Form contains ColorView');
        assert.strictEqual($hexValueInput.val(), '000000', 'Base value');
        assert.strictEqual(popupTitleText, 'Change Font Color');
        assert.strictEqual($form.attr('aria-label'), popupTitleText);
    });

    test('show color dialog when formatted text selected', function(assert) {
        this.options.items = ['color'];
        this.quillMock.getFormat = () => { return { color: '#fafafa' }; };

        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $colorView = $(`.${FORM_CLASS} .${COLORVIEW_CLASS}`);
        const $hexValueInput = $colorView.find(`.${COLOR_VIEW_HEX_FIELD_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        assert.equal($hexValueInput.val(), 'fafafa', 'Selected text color');
    });

    test('change color', function(assert) {
        this.options.items = ['color'];

        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $colorView = $(`.${FORM_CLASS} .${COLORVIEW_CLASS}`);
        const $hexValueInput = $colorView.find(`.${COLOR_VIEW_HEX_FIELD_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        $hexValueInput.val('');
        keyboardMock($hexValueInput)
            .type('fafafa')
            .change();

        $(`.${DIALOG_CLASS} .${BUTTON_WITH_TEXT_CLASS}`)
            .first()
            .trigger('dxclick');

        assert.deepEqual(this.log, [{ format: 'color', value: '#fafafa' }], 'format method with the right arguments');
    });

    test('decline change color dialog', function(assert) {
        this.options.items = ['color'];

        new Toolbar(this.quillMock, this.options);

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        $(`.${DIALOG_CLASS} .${BUTTON_WITH_TEXT_CLASS}`)
            .last()
            .trigger('dxclick');

        assert.ok(this.focusStub.calledOnce, 'focus method was called after closing the dialog');
    });

    test('show background dialog', function(assert) {
        this.options.items = ['background'];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $form = $(`.${FORM_CLASS}`);
        const $colorView = $form.find(`.${COLORVIEW_CLASS}`);
        const $hexValueInput = $colorView.find(`.${COLOR_VIEW_HEX_FIELD_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);
        const popupTitleText = $(`.${POPUP_TITLE_CLASS}`).text();

        assert.equal($form.length, 1, 'Form shown');
        assert.equal($colorView.length, 1, 'Form contains ColorView');
        assert.equal($hexValueInput.val(), '000000', 'Base value');
        assert.strictEqual(popupTitleText, 'Change Background Color');
        assert.strictEqual($form.attr('aria-label'), popupTitleText);
    });

    test('show background dialog when formatted text selected', function(assert) {
        this.options.items = ['background'];
        this.quillMock.getFormat = () => { return { background: '#fafafa' }; };

        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $colorView = $(`.${FORM_CLASS} .${COLORVIEW_CLASS}`);
        const $hexValueInput = $colorView.find(`.${COLOR_VIEW_HEX_FIELD_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        assert.equal($hexValueInput.val(), 'fafafa', 'Selected background color');
    });

    test('change background', function(assert) {
        this.options.items = ['background'];

        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $colorView = $(`.${FORM_CLASS} .${COLORVIEW_CLASS}`);
        const $hexValueInput = $colorView.find(`.${COLOR_VIEW_HEX_FIELD_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        $hexValueInput.val('');
        keyboardMock($hexValueInput)
            .type('fafafa')
            .change();

        $(`.${DIALOG_CLASS} .${BUTTON_WITH_TEXT_CLASS}`)
            .first()
            .trigger('dxclick');

        assert.deepEqual(this.log, [{ format: 'background', value: '#fafafa' }], 'format method with the right arguments');
    });

    test('show image dialog', function(assert) {
        this.options.items = ['image'];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $form = $(`.${FORM_CLASS}`);
        const $fields = $form.find(`.${FIELD_ITEM_CLASS}`);
        const fieldsText = $form.find(`.${FIELD_ITEM_LABEL_CLASS}`).text();
        const popupTitleText = $(`.${POPUP_TITLE_CLASS}`).text();

        assert.equal($fields.length, 4, 'Form with 4 fields shown');
        assert.equal(fieldsText, 'URL:Width (px):Height (px):Alternate text:', 'Check labels');
        assert.strictEqual(popupTitleText, 'Add Image');
        assert.strictEqual($form.attr('aria-label'), popupTitleText);
    });

    test('show image dialog when an image selected', function(assert) {
        this.quillMock.getFormat = () => {
            return {
                src: 'http://test.com/test.jpg',
                width: 100,
                height: 100
            };
        };
        this.options.items = ['image'];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $fieldInputs = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        assert.equal($fieldInputs.eq(0).val(), 'http://test.com/test.jpg', 'URL');
        assert.equal($fieldInputs.eq(1).val(), '100', 'Width');
        assert.equal($fieldInputs.eq(2).val(), '100', 'Height');
    });

    test('decline link dialog', function(assert) {
        this.options.items = ['link'];

        new Toolbar(this.quillMock, this.options);

        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        assert.ok(this.focusStub.calledOnce, 'focus method was called on link adding');

        $(`.${DIALOG_CLASS} .${BUTTON_WITH_TEXT_CLASS}`)
            .last()
            .trigger('dxclick');

        assert.ok(this.focusStub.calledTwice, 'focus method was called after closing the dialog');
    });

    test('change an image formatting', function(assert) {
        this.options.items = ['image'];
        this.quillMock.getSelection = () => { return { index: 1, length: 0 }; };
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $fieldInputs = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        keyboardMock($fieldInputs.eq(0))
            .type('http://test.com/test.jpg')
            .change();

        keyboardMock($fieldInputs.eq(1))
            .type('100')
            .change();

        keyboardMock($fieldInputs.eq(2))
            .type('100')
            .change();

        keyboardMock($fieldInputs.eq(3))
            .type('Alternate')
            .change()
            .press('enter');

        assert.deepEqual(this.log[0], {
            index: 1,
            type: 'extendedImage',
            value: {
                alt: 'Alternate',
                height: 100,
                src: 'http://test.com/test.jpg',
                width: 100
            }
        }, 'expected insert new image config');

        assert.deepEqual(this.log[1], {
            setSelection: [2, 0]
        }, 'caret position has been updated');
    });

    test('caret position after update an image with selection', function(assert) {
        this.options.items = ['image'];
        this.quillMock.getSelection = () => { return { index: 4, length: 2 }; };
        this.quillMock.getFormat = () => { return { extendedImage: 'oldImage' }; };
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $src = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`).first();

        keyboardMock($src)
            .type('http://test.com/test.jpg')
            .change()
            .press('enter');

        assert.deepEqual(this.log[1], {
            setSelection: [5, 0]
        }, 'caret position has been correctly updated');
    });

    test('image must be correctly updated if it is the first element', function(assert) {
        this.options.items = ['image'];
        this.quillMock.getSelection = () => { return { index: 0, length: 1 }; };
        this.quillMock.getLength = () => 5;
        this.quillMock.getFormat = () => { return { extendedImage: 'oldImage' }; };
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $src = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`).eq(1);

        keyboardMock($src)
            .type('100')
            .change()
            .press('enter');

        const { index: pasteIndex, type: name } = this.log[0];
        assert.strictEqual(name, 'extendedImage', 'update an image');
        assert.strictEqual(pasteIndex, 0, 'we should paste an image at the same position');
        assert.deepEqual(this.log[1], {
            setSelection: [1, 0]
        }, 'caret position has been correctly updated');
    });

    test('show link dialog', function(assert) {
        this.options.items = ['link'];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $form = $(`.${FORM_CLASS}`);
        const $fields = $form.find(`.${FIELD_ITEM_CLASS}`);
        const fieldsText = $form.find(`.${FIELD_ITEM_LABEL_CLASS}, .${CHECKBOX_TEXT_CLASS}`).text();
        const popupTitleText = $(`.${POPUP_TITLE_CLASS}`).text();

        assert.equal($fields.length, 3, 'Form with 3 fields shown');
        assert.equal(fieldsText, 'URL:Text:Open link in new window', 'Check labels');
        assert.strictEqual(popupTitleText, 'Add Link');
        assert.strictEqual($form.attr('aria-label'), popupTitleText);
    });

    test('show link dialog when a link selected', function(assert) {
        this.quillMock.getFormat = () => {
            return {
                link: 'http://test.com',
                target: true,
                text: 'Test'
            };
        };
        this.quillMock.getSelection = () => true;
        this.quillMock.getText = () => 'Test';

        this.options.items = ['link'];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $fieldInputs = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);
        const $targetField = $(`.${DIALOG_TARGET_ITEM_CLASS}`);

        assert.equal($fieldInputs.eq(0).val(), 'http://test.com', 'URL');
        assert.equal($fieldInputs.eq(1).val(), 'Test', 'Text');
        assert.equal($targetField.length, 1, 'There is target field');
        assert.equal($targetField.find(`.${CHECKBOX_CHECKED_CLASS}`).length, 1, 'It is contains a checked CheckBox');
    });

    test('show link dialog when a link selected and didn\'t contain a target attribute', function(assert) {
        this.quillMock.getFormat = () => {
            return {
                link: 'http://test.com',
                target: undefined,
                text: 'Test'
            };
        };
        this.quillMock.getSelection = () => true;
        this.quillMock.getText = () => 'Test';

        this.options.items = ['link'];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $fieldInputs = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);
        const $targetField = $(`.${DIALOG_TARGET_ITEM_CLASS}`);

        assert.equal($fieldInputs.eq(0).val(), 'http://test.com', 'URL');
        assert.equal($fieldInputs.eq(1).val(), 'Test', 'Text');
        assert.equal($targetField.length, 1, 'There is target field');
        assert.equal($targetField.find(`.${CHECKBOX_CHECKED_CLASS}`).length, 0, 'It isn\'t contains an checked CheckBox');
    });

    test('change an link formatting', function(assert) {
        this.options.items = ['link'];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $fieldInputs = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        keyboardMock($fieldInputs.eq(0))
            .type('http://test.com')
            .change();

        keyboardMock($fieldInputs.eq(1))
            .type('Test')
            .change()
            .press('enter');

        assert.deepEqual(this.log, [{
            format: 'link',
            value: {
                href: 'http://test.com',
                target: true,
                text: 'Test'
            }
        }], 'expected format config');
    });

    test('\'Text\' field should be hidden when formatting embed config with the \'link\' dialog', function(assert) {
        this.options.items = ['link'];
        this.quillMock.getSelection = () => { return { index: 0, length: 10 }; };
        this.quillMock.getText = () => 'Test';
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $form = $(`.${FORM_CLASS}`);
        const $fields = $form.find(`.${FIELD_ITEM_CLASS}`);
        const fieldsText = $fields.find(`.${FIELD_ITEM_LABEL_CLASS}, .${CHECKBOX_TEXT_CLASS}`).text();

        assert.equal($fields.length, 2, 'Form with 2 fields shown');
        assert.equal(fieldsText, 'URL:Open link in new window', 'Check labels');
    });

    [0, 1].forEach((length) => {
        const testName = `"URL" field should be ${length ? 'not' : ''} empty when selection length is ${length} and selection stays at link`;
        test(testName, function(assert) {
            const text = length ? 'T' : '';
            this.options.items = ['link'];
            this.quillMock.getFormat = () => {
                return {
                    link: length ? 'http://test.com' : undefined,
                    target: undefined,
                    text
                };
            };
            this.quillMock.getSelection = () => { return { index: 0, length }; };
            this.quillMock.getText = () => text;
            new Toolbar(this.quillMock, this.options);
            this.$element
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger('dxclick');

            const $fieldInputs = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

            assert.equal($fieldInputs.eq(0).val(), length ? 'http://test.com' : '', 'URL');
            assert.equal($fieldInputs.eq(1).val(), text, 'Text');
        });
    });

    test('show insertTable dialog', function(assert) {
        this.options.items = ['insertTable'];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $form = $(`.${FORM_CLASS}`);
        const $fields = $form.find(`.${FIELD_ITEM_CLASS}`);
        const fieldsText = $form.find(`.${FIELD_ITEM_LABEL_CLASS}`).text();
        const popupTitleText = $(`.${POPUP_TITLE_CLASS}`).text();

        assert.strictEqual($fields.length, 2, 'Form with 2 fields shown');
        assert.strictEqual(fieldsText, 'Rows:Columns:', 'Check labels');
        assert.strictEqual(popupTitleText, 'Insert Table');
        assert.strictEqual($form.attr('aria-label'), popupTitleText);
    });

    test('do not show insertTable dialog when a table focused', function(assert) {
        this.quillMock.getFormat = () => {
            return {
                table: true
            };
        };
        this.quillMock.getSelection = () => true;

        this.options.items = ['insertTable'];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $fieldInputs = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`).is(':visible');
        const isFieldsVisible = Boolean($fieldInputs.length);

        assert.notOk(isFieldsVisible, 'insertTable dialog is hidden');
    });
});

testModule('Toolbar with multiline mode', simpleModuleConfig, function() {
    test('The toolbar must change its height according to the items', function(assert) {
        this.options.items = ['bold'];
        const toolbar = new Toolbar(this.quillMock, this.options);

        const toolbarHeight = this.$element.height();
        toolbar.clean();

        for(let i = 0; i < 50; i++) {
            this.options.items.push('bold');
        }

        new Toolbar(this.quillMock, this.options);

        const isHeightIncreased = this.$element.height() > toolbarHeight;
        assert.ok(isHeightIncreased, 'Toolbar height increased');
    });

    test('check separator item height', function(assert) {
        this.options.multiline = false;
        this.options.items = ['separator'];

        new Toolbar(this.quillMock, this.options);

        $(`.${TOOLBAR_CLASS} .${DROPDOWNMENU_BUTTON_CLASS}`)
            .trigger('dxclick')
            .trigger('dxclick');

        const $separator = $(`.${TOOLBAR_CLASS} .${SEPARATOR_CLASS}`);

        const separatorHeight = $separator.outerHeight();
        assert.equal($separator.length, 1, 'Toolbar has a separator item');
        assert.ok(separatorHeight > 0, 'Separator has height greater than 0');
    });
});

testModule('Toolbar items state update', {
    beforeEach: function() {
        simpleModuleConfig.beforeEach.apply(this, arguments);
        this.getDisabledFormats = () => {
            return this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}.${DISABLED_STATE_CLASS}`);
        };
        this.getFormatItemElement = () => this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
    },
    afterEach: function() {
        simpleModuleConfig.afterEach.apply(this, arguments);
    }
}, () => {
    const COLOR_ITEMS = ['color', 'background'];
    const BUTTON_FORMAT_ITEMS = ['bold', 'italic', 'link', 'strike', 'underline', 'blockquote', 'code-block', 'codeBlock', 'variable'];
    const EDITOR_FORMAT_ITEMS = [{
        name: 'size',
        value: 'large',
        acceptedValues: ['large']
    }, {
        name: 'font',
        value: 'cursive',
        acceptedValues: ['cursive']
    }, {
        name: 'header',
        value: 3,
        acceptedValues: [3]
    }];

    testModule('when items are located not in menu', () => {
        test('table formats on table focus', function(assert) {
            this.options.items = TABLE_OPERATIONS;
            const toolbar = new Toolbar(this.quillMock, this.options);
            this.quillMock.getFormat = () => ({ table: true });

            toolbar.updateTableWidgets();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const disabledItemsCount = $disabledFormatWidgets.length;
            const isInsertTableFormatDisabled = $disabledFormatWidgets.first().hasClass(INSERT_TABLE_FORMAT_CLASS);

            assert.strictEqual(disabledItemsCount, 1, 'table focused -> all table operation buttons are enabled (except "insertTable")');
            assert.ok(isInsertTableFormatDisabled, 'insert table format is disabled');
        });

        test('table formats on table unfocus', function(assert) {
            this.options.items = TABLE_OPERATIONS;
            const toolbar = new Toolbar(this.quillMock, this.options);
            this.quillMock.getFormat = () => ({ table: true });
            toolbar.updateTableWidgets();

            this.quillMock.getFormat = () => ({ table: false });
            toolbar.updateTableWidgets();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const disabledItemsCount = $disabledFormatWidgets.length;
            const isInsertTableFormatDisabled = $disabledFormatWidgets.first().hasClass(INSERT_TABLE_FORMAT_CLASS);

            assert.strictEqual(disabledItemsCount, 7, 'table is not focused -> all table operation buttons are disabled (except "insertTable")');
            assert.notOk(isInsertTableFormatDisabled, 'insert table format is enabled');
        });

        test('clear button if some format is applied', function(assert) {
            this.options.items = ['clear'];
            const toolbar = new Toolbar(this.quillMock, this.options);
            this.quillMock.getFormat = () => ({ bold: true });

            toolbar.updateFormatWidgets();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const isClearButtonDisabled = $disabledFormatWidgets.length === 1;

            assert.strictEqual(isClearButtonDisabled, false, 'clear button is enabled');
        });

        test('clear button if no format is applied', function(assert) {
            this.options.items = ['clear'];
            const toolbar = new Toolbar(this.quillMock, this.options);
            this.quillMock.getFormat = () => ({ bold: true });
            toolbar.updateFormatWidgets();

            this.quillMock.getFormat = () => ({});
            toolbar.updateFormatWidgets();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const isClearButtonDisabled = $disabledFormatWidgets.length === 1;

            assert.strictEqual(isClearButtonDisabled, true, 'clear button is disabled');
        });

        test('undo button if undo stack is not empty', function(assert) {
            this.quillMock.history = {
                undo: sinon.stub(),
                stack: { undo: ['test'], redo: [] }
            };
            this.options.items = ['undo'];
            const toolbar = new Toolbar(this.quillMock, this.options);

            toolbar.updateHistoryWidgets();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const isUndoButtonDisabled = $disabledFormatWidgets.length === 1;
            assert.strictEqual(isUndoButtonDisabled, false, 'undo button is enabled');
        });

        test('undo button if undo stack is empty', function(assert) {
            this.quillMock.history = {
                undo: sinon.stub(),
                stack: { undo: [], redo: [] }
            };
            this.options.items = ['undo'];
            const toolbar = new Toolbar(this.quillMock, this.options);

            toolbar.updateHistoryWidgets();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const isUndoButtonDisabled = $disabledFormatWidgets.length === 1;
            assert.strictEqual(isUndoButtonDisabled, true, 'undo button is disabled');
        });

        test('redo button if redo stack is not empty', function(assert) {
            this.quillMock.history = {
                redo: sinon.stub(),
                stack: { undo: [], redo: ['test'] }
            };
            this.options.items = ['redo'];
            const toolbar = new Toolbar(this.quillMock, this.options);

            toolbar.updateHistoryWidgets();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const isRedoButtonDisabled = $disabledFormatWidgets.length === 1;
            assert.strictEqual(isRedoButtonDisabled, false, 'undo button is enabled');
        });

        test('redo button if redo stack is empty', function(assert) {
            this.quillMock.history = {
                redo: sinon.stub(),
                stack: { undo: [], redo: [] }
            };
            this.options.items = ['redo'];
            const toolbar = new Toolbar(this.quillMock, this.options);

            toolbar.updateHistoryWidgets();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const isRedoButtonDisabled = $disabledFormatWidgets.length === 1;
            assert.strictEqual(isRedoButtonDisabled, true, 'redo button is disabled');
        });

        COLOR_ITEMS.forEach(colorItemName => {
            test(`${colorItemName} button if ${colorItemName} format is applied`, function(assert) {
                this.options.items = [colorItemName];
                const toolbar = new Toolbar(this.quillMock, this.options);
                this.quillMock.getFormat = () => ({ [colorItemName]: 'blue' });

                toolbar.updateFormatWidgets();

                const $formatItemElement = this.getFormatItemElement();
                const $icon = $formatItemElement.find(`.${ICON_CLASS}`);

                assert.strictEqual($icon.css('borderBottomColor'), 'rgb(0, 0, 255)', `${colorItemName} button bottomBorderColor is correct`);
                assert.strictEqual($formatItemElement.hasClass(ACTIVE_FORMAT_CLASS), true, `${colorItemName} button has ${ACTIVE_FORMAT_CLASS} class`);
            });

            test(`${colorItemName} button if ${colorItemName} format is not applied`, function(assert) {
                this.options.items = [colorItemName];
                const toolbar = new Toolbar(this.quillMock, this.options);
                this.quillMock.getFormat = () => ({ [colorItemName]: 'blue' });
                toolbar.updateFormatWidgets();

                this.quillMock.getFormat = () => ({});
                toolbar.updateFormatWidgets();

                const $formatItemElement = this.getFormatItemElement();
                const $icon = $formatItemElement.find(`.${ICON_CLASS}`);

                assert.strictEqual($icon.css('borderBottomColor'), 'rgba(0, 0, 0, 0)', `${colorItemName} button bottomBorderColor is transparent`);
                assert.strictEqual($formatItemElement.hasClass(ACTIVE_FORMAT_CLASS), false, `${colorItemName} button has no ${ACTIVE_FORMAT_CLASS} class`);
            });
        });

        BUTTON_FORMAT_ITEMS.forEach(buttonItemName => {
            test(`${buttonItemName} button if format is applied`, function(assert) {
                this.options.items = [buttonItemName];
                const toolbar = new Toolbar(this.quillMock, this.options);
                this.quillMock.getFormat = () => ({ [buttonItemName]: true });

                toolbar.updateFormatWidgets();

                const $formatItemElement = this.getFormatItemElement();
                assert.strictEqual($formatItemElement.hasClass(ACTIVE_FORMAT_CLASS), true, `${buttonItemName} button has ${ACTIVE_FORMAT_CLASS} class`);
                assert.strictEqual($formatItemElement.hasClass(SELECTED_STATE_CLASS), true, `${buttonItemName} button has ${SELECTED_STATE_CLASS} class`);
                assert.strictEqual($formatItemElement.attr('aria-pressed'), 'true', `${buttonItemName} button has aria-pressed attr`);
            });

            test(`${buttonItemName} button if format is not applied`, function(assert) {
                this.options.items = [buttonItemName];
                const toolbar = new Toolbar(this.quillMock, this.options);
                this.quillMock.getFormat = () => ({ [buttonItemName]: true });
                toolbar.updateFormatWidgets();

                this.quillMock.getFormat = () => ({});
                toolbar.updateFormatWidgets();

                const $formatItemElement = this.getFormatItemElement();
                assert.strictEqual($formatItemElement.hasClass(ACTIVE_FORMAT_CLASS), false, `${buttonItemName} button has no ${ACTIVE_FORMAT_CLASS} class`);
                assert.strictEqual($formatItemElement.hasClass(SELECTED_STATE_CLASS), false, `${buttonItemName} button has no ${SELECTED_STATE_CLASS} class`);
                assert.strictEqual($formatItemElement.attr('aria-pressed'), undefined, `${buttonItemName} button has no aria-pressed attr`);
            });
        });

        EDITOR_FORMAT_ITEMS.forEach((item) => {
            const { name: editorItemName, value } = item;

            test(`${editorItemName} editor if format is applied`, function(assert) {
                this.options.items = [item];
                const toolbar = new Toolbar(this.quillMock, this.options);
                this.quillMock.getFormat = () => ({ [editorItemName]: value });

                toolbar.updateFormatWidgets();

                const actualValue = this.getFormatItemElement().dxSelectBox('instance').option('value');
                assert.strictEqual(actualValue, value, 'value is correct');
            });

            test(`${editorItemName} editor if format is not applied`, function(assert) {
                this.options.items = [item];
                const toolbar = new Toolbar(this.quillMock, this.options);
                this.quillMock.getFormat = () => ({ [editorItemName]: value });
                toolbar.updateFormatWidgets();

                this.quillMock.getFormat = () => ({});
                toolbar.updateFormatWidgets();

                const actualValue = this.getFormatItemElement().dxSelectBox('instance').option('value');
                assert.strictEqual(actualValue, null, 'value is restored');
            });
        });
    });

    testModule('when items are located in menu and it was not opened yet', {
        beforeEach: function() {
            this.options.multiline = false;
            this.openDropDownMenu = () => {
                $(`.${TOOLBAR_CLASS} .${DROPDOWNMENU_BUTTON_CLASS}`).trigger('dxclick');
            };
            this.mapToMenuItems = (items) => items.map(item => {
                if(typeof item === 'string') {
                    return {
                        name: item,
                        locateInMenu: 'always'
                    };
                } else {
                    return {
                        ...item,
                        locateInMenu: 'always'
                    };
                }
            });
        }
    }, () => {
        test('table formats in menu on table focus (t1117604)', function(assert) {
            this.options.items = this.mapToMenuItems(TABLE_OPERATIONS);
            const toolbar = new Toolbar(this.quillMock, this.options);
            this.quillMock.getFormat = () => ({ table: true });

            toolbar.updateTableWidgets();

            this.openDropDownMenu();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const disabledItemsCount = $disabledFormatWidgets.length;
            const isInsertTableFormatDisabled = $disabledFormatWidgets.first().hasClass(INSERT_TABLE_FORMAT_CLASS);

            assert.strictEqual(disabledItemsCount, 1, 'table focused -> all table operation buttons are enabled (except "insertTable")');
            assert.ok(isInsertTableFormatDisabled, 'insert table format is disabled');
        });

        test('table formats in menu on table unfocus', function(assert) {
            this.options.items = this.mapToMenuItems(TABLE_OPERATIONS);
            const toolbar = new Toolbar(this.quillMock, this.options);
            this.quillMock.getFormat = () => ({ table: true });
            toolbar.updateTableWidgets();

            this.quillMock.getFormat = () => ({ table: false });
            toolbar.updateTableWidgets();

            this.openDropDownMenu();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const disabledItemsCount = $disabledFormatWidgets.length;
            const isInsertTableFormatDisabled = $disabledFormatWidgets.first().hasClass(INSERT_TABLE_FORMAT_CLASS);

            assert.strictEqual(disabledItemsCount, 7, 'table is not focused -> all table operation buttons are disabled (except "insertTable")');
            assert.notOk(isInsertTableFormatDisabled, 'insert table format is enabled');
        });

        test('clear button in menu if some format is applied', function(assert) {
            this.options.items = this.mapToMenuItems(['clear']);
            const toolbar = new Toolbar(this.quillMock, this.options);
            this.quillMock.getFormat = () => ({ bold: true });

            toolbar.updateFormatWidgets();

            this.openDropDownMenu();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const isClearButtonDisabled = $disabledFormatWidgets.length === 1;

            assert.strictEqual(isClearButtonDisabled, false, 'clear button is enabled');
        });

        test('clear button in menu if no format is applied', function(assert) {
            this.options.items = this.mapToMenuItems(['clear']);
            const toolbar = new Toolbar(this.quillMock, this.options);
            this.quillMock.getFormat = () => ({ bold: true });
            toolbar.updateFormatWidgets();

            this.quillMock.getFormat = () => ({});
            toolbar.updateFormatWidgets();

            this.openDropDownMenu();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const isClearButtonDisabled = $disabledFormatWidgets.length === 1;

            assert.strictEqual(isClearButtonDisabled, true, 'clear button is disabled');
        });

        test('undo button in menu if undo stack is not empty', function(assert) {
            this.quillMock.history = {
                undo: sinon.stub(),
                stack: { undo: ['test'], redo: [] }
            };
            this.options.items = this.mapToMenuItems(['undo']);
            const toolbar = new Toolbar(this.quillMock, this.options);

            toolbar.updateHistoryWidgets();

            this.openDropDownMenu();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const isUndoButtonDisabled = $disabledFormatWidgets.length === 1;
            assert.strictEqual(isUndoButtonDisabled, false, 'undo button is enabled');
        });

        test('undo button in menu if undo stack is empty', function(assert) {
            this.quillMock.history = {
                undo: sinon.stub(),
                stack: { undo: [], redo: [] }
            };
            this.options.items = this.mapToMenuItems(['undo']);
            const toolbar = new Toolbar(this.quillMock, this.options);

            toolbar.updateHistoryWidgets();

            this.openDropDownMenu();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const isUndoButtonDisabled = $disabledFormatWidgets.length === 1;
            assert.strictEqual(isUndoButtonDisabled, true, 'undo button is disabled');
        });

        test('redo button in menu if redo stack is not empty', function(assert) {
            this.quillMock.history = {
                redo: sinon.stub(),
                stack: { undo: [], redo: ['test'] }
            };
            this.options.items = this.mapToMenuItems(['redo']);
            const toolbar = new Toolbar(this.quillMock, this.options);

            toolbar.updateHistoryWidgets();

            this.openDropDownMenu();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const isRedoButtonDisabled = $disabledFormatWidgets.length === 1;
            assert.strictEqual(isRedoButtonDisabled, false, 'undo button is enabled');
        });

        test('redo button in menu if redo stack is empty', function(assert) {
            this.quillMock.history = {
                redo: sinon.stub(),
                stack: { undo: [], redo: [] }
            };
            this.options.items = this.mapToMenuItems(['redo']);
            const toolbar = new Toolbar(this.quillMock, this.options);

            toolbar.updateHistoryWidgets();

            this.openDropDownMenu();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const isRedoButtonDisabled = $disabledFormatWidgets.length === 1;
            assert.strictEqual(isRedoButtonDisabled, true, 'redo button is disabled');
        });

        COLOR_ITEMS.forEach(colorItemName => {
            test(`${colorItemName} button in menu if ${colorItemName} format is applied`, function(assert) {
                this.options.items = this.mapToMenuItems([colorItemName]);
                const toolbar = new Toolbar(this.quillMock, this.options);
                this.quillMock.getFormat = () => ({ [colorItemName]: 'blue' });

                toolbar.updateFormatWidgets();

                this.openDropDownMenu();

                const $formatItemElement = this.getFormatItemElement();
                const $icon = $formatItemElement.find(`.${ICON_CLASS}`);

                assert.strictEqual($icon.css('borderBottomColor'), 'rgb(0, 0, 255)', `${colorItemName} button bottomBorderColor is correct`);
                assert.strictEqual($formatItemElement.hasClass(ACTIVE_FORMAT_CLASS), true, `${colorItemName} button has ${ACTIVE_FORMAT_CLASS} class`);
                assert.strictEqual($formatItemElement.hasClass(SELECTED_STATE_CLASS), true, `${colorItemName} button has ${SELECTED_STATE_CLASS} class`);
                assert.strictEqual($formatItemElement.attr('aria-pressed'), 'true', `${colorItemName} button has aria-pressed attr`);
            });

            test(`${colorItemName} button in menu if ${colorItemName} format is not applied`, function(assert) {
                this.options.items = this.mapToMenuItems([colorItemName]);
                const toolbar = new Toolbar(this.quillMock, this.options);
                this.quillMock.getFormat = () => ({ [colorItemName]: 'blue' });
                toolbar.updateFormatWidgets();

                this.quillMock.getFormat = () => ({});
                toolbar.updateFormatWidgets();

                this.openDropDownMenu();

                const $formatItemElement = this.getFormatItemElement();
                const $icon = $formatItemElement.find(`.${ICON_CLASS}`);

                assert.strictEqual($icon.css('borderBottomColor'), 'rgba(0, 0, 0, 0)', `${colorItemName} button bottomBorderColor is transparent`);
                assert.strictEqual($formatItemElement.hasClass(ACTIVE_FORMAT_CLASS), false, `${colorItemName} button has no ${ACTIVE_FORMAT_CLASS} class`);
                assert.strictEqual($formatItemElement.hasClass(SELECTED_STATE_CLASS), false, `${colorItemName} button has no ${SELECTED_STATE_CLASS} class`);
                assert.strictEqual($formatItemElement.attr('aria-pressed'), undefined, `${colorItemName} button has no aria-pressed attr`);
            });
        });

        BUTTON_FORMAT_ITEMS.forEach(buttonItemName => {
            test(`${buttonItemName} button in menu if format is applied`, function(assert) {
                this.options.items = this.mapToMenuItems([buttonItemName]);
                const toolbar = new Toolbar(this.quillMock, this.options);
                this.quillMock.getFormat = () => ({ [buttonItemName]: true });

                toolbar.updateFormatWidgets();

                this.openDropDownMenu();

                const $formatItemElement = this.getFormatItemElement();
                assert.strictEqual($formatItemElement.hasClass(ACTIVE_FORMAT_CLASS), true, `${buttonItemName} button has ${ACTIVE_FORMAT_CLASS} class`);
                assert.strictEqual($formatItemElement.hasClass(SELECTED_STATE_CLASS), true, `${buttonItemName} button has ${SELECTED_STATE_CLASS} class`);
                assert.strictEqual($formatItemElement.attr('aria-pressed'), 'true', `${buttonItemName} button has aria-pressed attr`);
            });

            test(`${buttonItemName} button in menu if format is not applied`, function(assert) {
                this.options.items = this.mapToMenuItems([buttonItemName]);
                const toolbar = new Toolbar(this.quillMock, this.options);
                this.quillMock.getFormat = () => ({ [buttonItemName]: true });
                toolbar.updateFormatWidgets();

                this.quillMock.getFormat = () => ({});
                toolbar.updateFormatWidgets();

                this.openDropDownMenu();

                const $formatItemElement = this.getFormatItemElement();
                assert.strictEqual($formatItemElement.hasClass(ACTIVE_FORMAT_CLASS), false, `${buttonItemName} button has no ${ACTIVE_FORMAT_CLASS} class`);
                assert.strictEqual($formatItemElement.hasClass(SELECTED_STATE_CLASS), false, `${buttonItemName} button has no ${SELECTED_STATE_CLASS} class`);
                assert.strictEqual($formatItemElement.attr('aria-pressed'), undefined, `${buttonItemName} button has no aria-pressed attr`);
            });
        });

        EDITOR_FORMAT_ITEMS.forEach((item) => {
            const { name: editorItemName, value } = item;

            test(`${editorItemName} editor in menu if format is applied`, function(assert) {
                this.options.items = this.mapToMenuItems([item]);
                const toolbar = new Toolbar(this.quillMock, this.options);
                this.quillMock.getFormat = () => ({ [editorItemName]: value });

                toolbar.updateFormatWidgets();

                this.openDropDownMenu();

                const actualValue = this.getFormatItemElement().dxSelectBox('instance').option('value');
                assert.strictEqual(actualValue, value, 'value is correct');
            });

            test(`${editorItemName} editor in menu if format is not applied`, function(assert) {
                this.options.items = this.mapToMenuItems([item]);
                const toolbar = new Toolbar(this.quillMock, this.options);
                this.quillMock.getFormat = () => ({ [editorItemName]: value });
                toolbar.updateFormatWidgets();

                this.quillMock.getFormat = () => ({});
                toolbar.updateFormatWidgets();

                this.openDropDownMenu();

                const actualValue = this.getFormatItemElement().dxSelectBox('instance').option('value');
                assert.strictEqual(actualValue, null, 'value is restored');
            });
        });

        test('state of the items in menu should be synchronized after toolbar repaint (t1117604)', function(assert) {
            this.options.items = this.mapToMenuItems(TABLE_OPERATIONS);
            const toolbar = new Toolbar(this.quillMock, this.options);
            this.quillMock.getFormat = () => ({ table: true });
            toolbar.updateTableWidgets();
            this.openDropDownMenu();

            resizeCallbacks.fire();
            toolbar.updateTableWidgets();
            this.openDropDownMenu();

            const $disabledFormatWidgets = this.getDisabledFormats();
            const disabledItemsCount = $disabledFormatWidgets.length;
            const isInsertTableFormatDisabled = $disabledFormatWidgets.first().hasClass(INSERT_TABLE_FORMAT_CLASS);

            assert.strictEqual(disabledItemsCount, 1, 'table focused -> all table operation buttons are enabled (except "insertTable")');
            assert.ok(isInsertTableFormatDisabled, 'insert table format is disabled');
        });
    });
});

testModule('Toolbar with adaptive menu', simpleModuleConfig, function() {
    test('Render toolbar with adaptive mode', function(assert) {
        this.options.multiline = false;
        this.options.items = ['bold'];
        new Toolbar(this.quillMock, this.options);

        const $toolbar = this.$element.children().children();
        assert.notOk($toolbar.hasClass(TOOLBAR_MULTILINE_CLASS), 'Toolbar is rendered with adaptive mode');
    });

    test('adaptive menu container', function(assert) {
        this.options.multiline = false;
        this.options.items = [{ name: 'strike', locateInMenu: 'always' }];

        new Toolbar(this.quillMock, this.options);

        $(`.${TOOLBAR_CLASS} .${DROPDOWNMENU_BUTTON_CLASS}`).trigger('dxclick');

        const $formatButton = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
        const isMenuLocatedInToolbar = !!$formatButton.closest(`.${TOOLBAR_CLASS}`).length;
        const isMenuLocatedInToolbarContainer = !!$formatButton.closest(`.${TOOLBAR_WRAPPER_CLASS}`).length;

        assert.notOk(isMenuLocatedInToolbar, 'Adaptive menu is not located into Toolbar');
        assert.ok(isMenuLocatedInToolbarContainer, 'Adaptive menu is located into Toolbar container');
    });

    test('separator item', function(assert) {
        this.options.multiline = false;
        this.options.items = ['separator', { name: 'separator', locateInMenu: 'always' }];

        new Toolbar(this.quillMock, this.options);

        $(`.${TOOLBAR_CLASS} .${DROPDOWNMENU_BUTTON_CLASS}`)
            .trigger('dxclick')
            .trigger('dxclick');

        const $separator = $(`.${TOOLBAR_CLASS} .${SEPARATOR_CLASS}`);
        const $menuSeparator = $(`.${TOOLBAR_CLASS} .${MENU_SEPARATOR_CLASS}`);

        assert.equal($separator.length, 1, 'Toolbar has a separator item');
        assert.equal($menuSeparator.length, 1, 'Toolbar has a menu separator item');
    });
});

testModule('tables', simpleModuleConfig, function() {
    test('render table manipulation buttons', function(assert) {
        this.options.items = TABLE_OPERATIONS;

        new Toolbar(this.quillMock, this.options);

        const $formatWidgets = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
        const formatWidgetsCount = $formatWidgets.length;
        const disabledFormatWidgetsCount = $formatWidgets.filter(`.${DISABLED_STATE_CLASS}`).length;

        assert.strictEqual(formatWidgetsCount, TABLE_OPERATIONS.length, 'All table operations rendered');
        assert.strictEqual(disabledFormatWidgetsCount, formatWidgetsCount - 1, 'All operation except the "insert table" disabled');

        $formatWidgets.each((index, element) => {
            const operationName = TABLE_OPERATIONS[index];
            const isElementExist = Boolean($(element).find(`.dx-icon-${operationName.toLowerCase()}`).length);
            const expectedDisabledState = operationName === 'insertTable' ? false : true;

            assert.ok(isElementExist, `${operationName} item has an related icon`);
            assert.strictEqual(
                $(element).hasClass(DISABLED_STATE_CLASS),
                expectedDisabledState,
                `${operationName} item should ${expectedDisabledState ? '' : 'not'} be disabled in case the table is not focused`
            );
        });
    });

    test('update selection -> focus table', function(assert) {
        this.options.items = TABLE_OPERATIONS;

        const toolbar = new Toolbar(this.quillMock, this.options);

        this.quillMock.getFormat = () => {
            return { table: true };
        };

        toolbar.updateTableWidgets();

        const $disabledFormatWidgets = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}.${DISABLED_STATE_CLASS}`);
        const disabledItemsCount = $disabledFormatWidgets.length;
        const isInsertTableOperationDisabled = $disabledFormatWidgets.first().hasClass(INSERT_TABLE_FORMAT_CLASS);

        assert.strictEqual(disabledItemsCount, 1, 'table focused -> all table operation buttons are enabled (except "insertTable")');
        assert.ok(isInsertTableOperationDisabled);
    });

    test('buttons interaction', function(assert) {
        const simpleOperations = TABLE_OPERATIONS.slice(1);
        this.options.items = simpleOperations;
        this.quillMock.getFormat = () => {
            return { table: true };
        };

        const toolbar = new Toolbar(this.quillMock, this.options);
        toolbar.updateTableWidgets();

        const $formatWidgets = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);

        $formatWidgets.each((index, element) => {
            const operationName = simpleOperations[index];
            const isMethodCalled = () => this.quillMock.table[operationName].calledOnce;

            assert.notOk(isMethodCalled(), `${operationName} isn't called before clicking on toolbar item`);

            $(element).trigger('dxclick');

            assert.ok(isMethodCalled(), `${operationName} called after click on toolbar item`);
        });
    });
});

testModule('Toolbar localization', simpleModuleConfig, function() {
    const messages = {
        'fr': {
            'dxHtmlEditor-italic': 'Italique',
            'dxHtmlEditor-list': 'Liste',
            'dxHtmlEditor-ordered': 'Numéroté',
            'dxHtmlEditor-bullet': 'Marqué'
        }
    };

    function init(that, locateInMenu) {
        localization.loadMessages(messages);

        that.options.multiline = false;
        that.options.items = [
            {
                name: 'italic',
                locateInMenu: locateInMenu ? 'always' : 'never'
            },
            {
                name: 'list',
                locateInMenu: locateInMenu ? 'always' : 'never',
                acceptedValues: ['ordered', 'bullet']
            }
        ];
    }

    function getElementsData() {
        const $button = $('.dx-italic-format');
        const $selectBox = $('.dx-list-format');
        const selectBox = $selectBox.dxSelectBox('instance');

        selectBox.open();
        selectBox.close();

        return {
            buttonTitle: $button.attr('title'),
            buttonText: $button.text(),
            isButtonTextVisible: $button.find('.dx-button-text').is(':visible'),

            selectBoxPlaceholder: $selectBox.find('.dx-placeholder').attr('data-dx_placeholder'),
            selectBoxItemsText: $selectBox.find('.dx-item').text()
        };
    }

    function getExpectedData(locatedInMenu) {
        return {
            buttonText: 'Italique',
            buttonTitle: 'Italique',
            isButtonTextVisible: locatedInMenu,
            selectBoxItemsText: 'NumérotéMarqué',
            selectBoxPlaceholder: 'Liste'
        };
    }

    [false, true].forEach(function(locateInMenu) {
        const testCaption = `items located in the ${locateInMenu ? 'adaptive menu' : 'Toolbar'} should be correctly localized`;
        test(testCaption, function(assert) {
            assert.expect(1);
            const locale = localization.locale();
            init(this, locateInMenu);

            try {
                localization.locale('fr');
                new Toolbar(this.quillMock, this.options);

                if(locateInMenu) {
                    $('.dx-dropdownmenu').trigger('dxclick');
                }

                assert.deepEqual(getElementsData(), getExpectedData(locateInMenu));
            } finally {
                localization.locale(locale);
            }
        });
    });
});
