import $ from 'jquery';

import 'generic_light.css!';

import 'ui/select_box';
import 'ui/color_box/color_view';

import Toolbar from 'ui/html_editor/modules/toolbar';
import FormDialog from 'ui/html_editor/ui/formDialog';
import { noop } from 'core/utils/common';
import keyboardMock from '../../../helpers/keyboardMock.js';
import fx from 'animation/fx';

const TOOLBAR_CLASS = 'dx-htmleditor-toolbar';
const TOOLBAR_WRAPPER_CLASS = 'dx-htmleditor-toolbar-wrapper';
const TOOLBAR_FORMAT_WIDGET_CLASS = 'dx-htmleditor-toolbar-format';
const ACTIVE_FORMAT_CLASS = 'dx-format-active';
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
const BOX_ITEM_CONTENT_CLASS = 'dx-box-item-content';

const BOLD_FORMAT_CLASS = 'dx-bold-format';
const ITALIC_FORMAT_CLASS = 'dx-italic-format';
const ALIGNCENTER_FORMAT_CLASS = 'dx-aligncenter-format';
const CODEBLOCK_FORMAT_CLASS = 'dx-codeblock-format';
const COLOR_FORMAT_CLASS = 'dx-color-format';
const BACKGROUND_FORMAT_CLASS = 'dx-background-format';
const ORDEREDLIST_FORMAT_CLASS = 'dx-orderedlist-format';
const BULLETLIST_FORMAT_CLASS = 'dx-bulletlist-format';
const CLEAR_FORMAT_CLASS = 'dx-clear-format';
const IMAGE_FORMAT_CLASS = 'dx-image-format';
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
        this.formDialogOptionStub = sinon.stub();

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
                _saveValueChangeEvent: noop,
                on: noop,
                option: noop,
                formDialogOption: this.formDialogOptionStub,
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

    test('Simple format handling', function(assert) {
        let isHandlerTriggered;
        this.quillMock.getFormat = () => {
            return { bold: false };
        };
        this.options.items = ['bold', {
            formatName: 'strike',
            widget: 'dxButton',
            options: {
                onClick: () => {
                    isHandlerTriggered = true;
                }
            }
        }, {
            formatName: 'underline'
        }, {
            formatName: 'italic',
            widget: 'dxCheckBox'
        }, {
            formatName: 'superscript',
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
            { formatName: 'size', formatValues: ['10px', '2em'] }
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
            { formatName: 'script', formatValues: [false, 'super', 'sub'], options: { placeholder: 'Test' } }
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
        this.options.items = [{ formatName: 'header', formatValues: [1, 2, 3, false] }];

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

    test('custom item without formatName shouldn\'t have format class', function(assert) {
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

        assert.equal($activeFormats.length, 1, 'Bold format button is active');
        assert.ok($activeFormats.hasClass(BOLD_FORMAT_CLASS), 'it\'s a bold button');
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
        this.options.items = [{ formatName: 'size', formatValues: ['10px', '11px'] }];

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
        const $boxItemContent = $colorView.closest(`.${BOX_ITEM_CONTENT_CLASS}`);

        assert.strictEqual($form.length, 1, 'Form shown');
        assert.strictEqual($colorView.length, 1, 'Form contains ColorView');
        assert.strictEqual($hexValueInput.val(), '000000', 'Base value');
        assert.strictEqual($boxItemContent.css('flexBasis'), 'auto', 'Box item content flex-basis is \'auto\'');
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

        assert.equal($form.length, 1, 'Form shown');
        assert.equal($colorView.length, 1, 'Form contains ColorView');
        assert.equal($hexValueInput.val(), '000000', 'Base value');
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

        assert.equal($fields.length, 4, 'Form with 4 fields shown');
        assert.equal(fieldsText, 'URL:Width (px):Height (px):Alternate text:', 'Check labels');

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
                height: '100',
                src: 'http://test.com/test.jpg',
                width: '100'
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

        const { index: pasteIndex, type: formatName } = this.log[0];
        assert.strictEqual(formatName, 'extendedImage', 'update an image');
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

        assert.equal($fields.length, 3, 'Form with 3 fields shown');
        assert.equal(fieldsText, 'URL:Text:Open link in new window', 'Check labels');
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

    test('show insertTable dialog', function(assert) {
        this.options.items = ['insertTable'];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger('dxclick');

        const $form = $(`.${FORM_CLASS}`);
        const $fields = $form.find(`.${FIELD_ITEM_CLASS}`);
        const fieldsText = $form.find(`.${FIELD_ITEM_LABEL_CLASS}`).text();

        assert.strictEqual($fields.length, 2, 'Form with 2 fields shown');
        assert.strictEqual(fieldsText, 'Rows:Columns:', 'Check labels');
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

    test('The toolbar with multiline mode overwrites item options affecting adaptive menu', function(assert) {
        this.options.items = [
            { widget: 'dxButton', locateInMenu: 'always', location: 'center' },
            { widget: 'dxButton', locateInMenu: 'auto', location: 'before' },
            { widget: 'dxButton' }
        ];
        const toolbar = new Toolbar(this.quillMock, this.options);

        const toolbarItems = toolbar.toolbarInstance.option('items');

        toolbarItems.forEach(({ locateInMenu, location }) => {
            assert.strictEqual(locateInMenu, 'never', 'Multiline toolbar should not move items to the adaptive menu');
            assert.strictEqual(location, 'before', 'Multiline toolbar operates with "before" location only');
        });
    });

    test('separator item', function(assert) {
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
        this.options.items = [{ formatName: 'strike', locateInMenu: 'always' }];

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
        this.options.items = ['separator', { formatName: 'separator', locateInMenu: 'always' }];

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
        const isInsertTableOperationDisabled = $disabledFormatWidgets.first().hasClass('dx-inserttable-format');

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
