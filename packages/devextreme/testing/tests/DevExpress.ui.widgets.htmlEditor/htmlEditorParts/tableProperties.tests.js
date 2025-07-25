import $ from 'jquery';
import 'ui/html_editor';
import localization from 'localization';
import { getWindow } from 'core/utils/window';

import { getFormatHandlers } from '__internal/ui/html_editor/utils/m_toolbar_helper';

const FORM_CLASS = 'dx-formdialog-form';
const FIELD_ITEM_CLASS = 'dx-field-item';
const COLOR_BOX_CLASS = 'dx-colorbox';
const BUTTON_GROUP_CLASS = 'dx-buttongroup';

const showCellPropertiesForm = (instance, $cellElement) => {
    showForm(instance, $cellElement, 'cellProperties');
};

const showTablePropertiesForm = (instance, $tableElement) => {
    showForm(instance, $tableElement, 'tableProperties');
};

const showForm = (instance, $element, formatType) => {
    const contextMenuModule = instance.getModule('tableContextMenu');
    const formatHelpers = getFormatHandlers(contextMenuModule);
    formatHelpers[formatType]($element);
};

const tableMarkup = '\
    before table text<br>\
    <table>\
        <tr>\
            <td>0_0 content</td>\
            <td>0_1</td>\
            <td>0_2</td>\
            <td style="text-align: right;">0_3</td>\
        </tr>\
        <tr>\
            <td>1_0</td>\
            <td>1_1</td>\
            <td>1_2</td>\
            <td style="text-align: right;">1_3</td>\
        </tr>\
        <tr>\
            <td>2_0</td>\
            <td>2_1</td>\
            <td>2_2</td>\
            <td style="text-align: right;">2_3</td>\
        </tr>\
    </table>\
    <br>after table text<br>';

const tableWithoutContent = '\
<table>\
    <tr>\
        <td style="background-color: green; border-color: gray;"></td>\
        <td style="background-color: red; border-color: yellow;"></td>\
    </tr>\
</table>\
<br>';

const tableWithFixedDimensionsMarkup = '\
    <table>\
        <tr>\
            <td width="300px" height="24px">0_0 content</td>\
            <td width="300px" height="24px">0_1</td>\
        </tr>\
        <tr>\
            <td width="300px" height="48px">1_0</td>\
            <td width="300px" height="48px">1_1</td>\
        </tr>\
    </table>\
    <br>';

const tableMarkupWithHeaderRow = '\
    <table>\
        <thead>\
            <tr>\
                <th>0</th>\
                <th>1</th>\
                <th>2</th>\
                <th>3</th>\
            </tr>\
        </thead>\
        <tbody>\
            <tr>\
                <td>0_0 content</td>\
                <td>0_1</td>\
                <td>0_2</td>\
                <td style="text-align: right;">0_3</td>\
            </tr>\
            <tr>\
                <td>1_0</td>\
                <td>1_1</td>\
                <td>1_2</td>\
                <td style="text-align: right;">1_3</td>\
            </tr>\
            <tr>\
                <td>2_0</td>\
                <td>2_1</td>\
                <td>2_2</td>\
                <td style="text-align: right;">2_3</td>\
            </tr>\
        </tbody>\
    </table>\
    <br><br>';

const { test, module } = QUnit;

module('Table properties forms', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor');
        this.options = {
            tableContextMenu: { enabled: true },
            value: tableMarkup
        };

        this.createWidget = (options) => {
            const newOptions = $.extend({}, this.options, options);
            this.instance = this.$element
                .dxHtmlEditor(newOptions)
                .dxHtmlEditor('instance');

            this.quillInstance = this.instance.getQuillInstance();
        };

        this.applyFormChanges = (buttonIndex = 0) => {
            const $button = $('.dx-popup-bottom .dx-button:visible').eq(buttonIndex);
            $button.trigger('dxclick');

            this.clock.tick(10);
        };

        this.getFormInstance = () => {
            return $('.dx-form:not(.dx-formdialog-form)').dxForm('instance');
        };
    },
    afterEach: function() {
        this.instance.dispose();
        this.clock.restore();
    }
}, () => {
    module('Base', {}, () => {
        test('show table Form', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const $scrollView = $form.closest('.dx-scrollview');

            assert.strictEqual($form.length, 1);
            assert.ok($form.eq(0).is(':visible'));
            assert.ok($scrollView.length, 'Form should be in the ScrollView');
        });

        test('show table form start values', function(assert) {
            this.createWidget({ width: 432 });

            const $tableElement = this.$element.find('table').eq(0);

            this.quillInstance.setSelection(50, 1);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);

            const formInstance = this.getFormInstance();
            const borderStyleEditor = formInstance.getEditor('borderStyle');
            const borderWidthEditor = formInstance.getEditor('borderWidth');
            const borderColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(0).dxColorBox('instance');
            const backgroundColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(1).dxColorBox('instance');
            const alignmentEditor = formInstance.$element().find(`.${BUTTON_GROUP_CLASS}`).eq(0).dxButtonGroup('instance');
            const heightEditor = formInstance.getEditor('height');
            const widthEditor = formInstance.getEditor('width');

            assert.strictEqual(borderStyleEditor.option('value'), null, 'borderStyleEditor value is correct');
            assert.strictEqual(borderWidthEditor.option('value'), null, 'borderWidthEditor value is correct');
            assert.strictEqual(borderColorEditor.option('value'), null, 'borderColorEditor value is correct');
            assert.strictEqual(backgroundColorEditor.option('value'), null, 'backgroundColorEditor value is correct');
            assert.strictEqual(alignmentEditor.option('selectedItemKeys')[0], 'left', 'alignmentEditor selectedItemKeys is correct');
            assert.strictEqual(heightEditor.option('value'), null, 'heightEditor value is correct');
            assert.strictEqual(widthEditor.option('value'), null, 'widthEditor value is correct');
        });

        test('Check properties edititng at the table Form (without dimensions)', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);

            this.quillInstance.setSelection(50, 1);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);

            const formInstance = this.getFormInstance();

            const borderStyleEditor = formInstance.getEditor('borderStyle');
            borderStyleEditor.option('value', 'dotted');

            const borderWidthEditor = formInstance.getEditor('borderWidth');
            borderWidthEditor.option('value', 3);

            const borderColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(0).dxColorBox('instance');
            borderColorEditor.option('value', 'red');

            const backgroundColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(1).dxColorBox('instance');
            backgroundColorEditor.option('value', 'green');

            const alignmentEditor = formInstance.$element().find(`.${BUTTON_GROUP_CLASS}`).eq(0).dxButtonGroup('instance');
            alignmentEditor.option('selectedItemKeys', ['right']);

            this.applyFormChanges();

            assert.strictEqual($tableElement.css('borderTopStyle'), 'dotted', 'border style is applied');
            assert.strictEqual($tableElement.css('borderTopWidth'), '3px', 'border width is applied');
            assert.strictEqual($tableElement.css('borderTopColor'), 'rgb(255, 0, 0)', 'border color is applied');
            assert.strictEqual($tableElement.css('backgroundColor'), 'rgb(0, 128, 0)', 'background color is applied');
            assert.strictEqual($tableElement.css('textAlign'), 'right', 'text align is applied');
        });

        test('Cell backgroundColor & borderColor should be passed to colorBox as a default during editing', function(assert) {
            this.createWidget({ value: tableWithoutContent });

            const $tableElement = this.$element.find('table').eq(0);

            this.quillInstance.setSelection(0, 2);
            showCellPropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);

            const formInstance = this.getFormInstance();
            const backgroundColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(1).dxColorBox('instance');
            const borderColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(0).dxColorBox('instance');

            assert.strictEqual(backgroundColorEditor.option('value'), 'green', 'background color is passed to colorBox');
            assert.strictEqual(borderColorEditor.option('value'), 'gray', 'border color is passed to colorBox');
        });

        test('backgroundColor & borderColor of first selected cell should be applied for all cells when color was not modified in colorBox', function(assert) {
            this.createWidget({ value: tableWithoutContent });

            const $tableElement = this.$element.find('table').eq(0);

            this.quillInstance.setSelection(0, 2);
            showCellPropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);

            this.applyFormChanges();

            [0, 1].forEach(elementNumber => {
                assert.strictEqual($tableElement.find('td').eq(elementNumber).css('backgroundColor'), 'rgb(0, 128, 0)', 'background color is applied');
                assert.strictEqual($tableElement.find('td').eq(elementNumber).css('borderColor'), 'rgb(128, 128, 128)', 'borderColor color is applied');
            });
        });

        test('Check table width and height editor options', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);

            this.quillInstance.setSelection(50, 1);
            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            const heightEditor = formInstance.getEditor('height');

            assert.strictEqual(widthEditor.option('min'), 0, 'placeholder is applied');
            assert.strictEqual(heightEditor.option('min'), 0, 'placeholder is applied');
            assert.ok(widthEditor.option('placeholder').length > 1, 'placeholder is applied');
            assert.ok(heightEditor.option('placeholder').length > 1, 'placeholder is applied');
        });

        test('Check base dimensions edititng at the table Form', function(assert) {
            this.createWidget();
            const $tableElement = this.$element.find('table').eq(0);

            this.quillInstance.setSelection(50, 1);
            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 90);

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 600);

            this.applyFormChanges();

            assert.strictEqual($tableElement.outerHeight(), 90, 'table height is applied');
            assert.strictEqual($tableElement.outerWidth(), 600, 'table width is applied');
        });

        test('show cell Form', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(6);

            this.quillInstance.setSelection(50, 1);

            showCellPropertiesForm(this.instance, $targetCell);

            this.clock.tick(10);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const $scrollView = $form.closest('.dx-scrollview');

            assert.strictEqual($form.length, 1);
            assert.ok($form.eq(0).is(':visible'));
            assert.ok($scrollView.length, 'Form should be in the ScrollView');
        });

        test('border width is not equal to 0 if page zoom is not default (T1295949)', function(assert) {
            const window = getWindow();
            const originalZoom = window.document.body.style.zoom;

            window.document.body.style.zoom = '125%';

            try {
                this.createWidget({ width: 432 });

                const $tableElement = this.$element.find('table').eq(0);
                const $targetCell = $tableElement.find('td').eq(6);

                this.quillInstance.setSelection(50, 1);

                showCellPropertiesForm(this.instance, $targetCell);

                this.clock.tick(10);

                const borderWidthEditor = this.getFormInstance().getEditor('borderWidth');

                assert.strictEqual(borderWidthEditor.option('value'), null, 'borderWidthEditor value is correct');
            } finally {
                window.document.body.style.zoom = originalZoom;
            }
        });

        [
            { text: 'ok', index: 0 },
            { text: 'cancel', index: 1 }
        ].forEach(buttonConfig => {
            test(`Cell Form can not update other form dialogs if cell form is closed by ${buttonConfig.text} button (T1038636)`, function(assert) {
                this.createWidget();

                const $tableElement = this.$element.find('table').eq(0);
                const $targetCell = $tableElement.find('td').eq(6);

                this.quillInstance.setSelection(50, 1);

                showCellPropertiesForm(this.instance, $targetCell);

                this.clock.tick(10);

                this.applyFormChanges(buttonConfig.index);

                const contextMenuModule = this.instance.getModule('tableContextMenu');
                const formatHelpers = getFormatHandlers(contextMenuModule);
                formatHelpers['link'](this.$element);

                this.clock.tick(10);

                const formItemsCount = $(`.${FORM_CLASS} .${FIELD_ITEM_CLASS}`).length;

                assert.equal(formItemsCount, 3, '3 form items are rendered');
            });
        });

        test('show cell form start values', function(assert) {
            this.createWidget({ width: 432 });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(6);

            this.quillInstance.setSelection(50, 1);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const borderStyleEditor = formInstance.getEditor('borderStyle');
            const borderWidthEditor = formInstance.getEditor('borderWidth');
            const borderColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(0).dxColorBox('instance');
            const backgroundColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(1).dxColorBox('instance');
            const horizontalPaddingEditor = formInstance.getEditor('horizontalPadding');
            const verticalPaddingEditor = formInstance.getEditor('verticalPadding');
            const alignmentEditor = formInstance.$element().find(`.${BUTTON_GROUP_CLASS}`).eq(0).dxButtonGroup('instance');
            const verticalAlignmentEditor = formInstance.$element().find(`.${BUTTON_GROUP_CLASS}`).eq(1).dxButtonGroup('instance');
            const heightEditor = formInstance.getEditor('height');
            const widthEditor = formInstance.getEditor('width');

            assert.strictEqual(borderStyleEditor.option('value'), null, 'borderStyleEditor value is correct');
            assert.strictEqual(borderWidthEditor.option('value'), null, 'borderWidthEditor value is correct');
            assert.strictEqual(borderColorEditor.option('value'), null, 'borderColorEditor value is correct');
            assert.strictEqual(backgroundColorEditor.option('value'), null, 'backgroundColorEditor value is correct');
            assert.strictEqual(horizontalPaddingEditor.option('value'), null, 'horizontalPaddingEditor value is correct');
            assert.strictEqual(verticalPaddingEditor.option('value'), null, 'verticalPaddingEditor value is correct');
            assert.strictEqual(alignmentEditor.option('selectedItemKeys')[0], 'left', 'alignmentEditor selectedItemKeys is correct');
            assert.strictEqual(verticalAlignmentEditor.option('selectedItemKeys')[0], 'middle', 'verticalAlignmentEditor selectedItemKeys is correct');
            assert.strictEqual(heightEditor.option('value'), null, 'heightEditor value is correct');
            assert.strictEqual(widthEditor.option('value'), null, 'widthEditor value is correct');
        });

        test('alignment default value in the Cell Properties form should be "center" for header cells', function(assert) {
            this.createWidget({ value: tableMarkupWithHeaderRow });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('th').eq(0);

            this.quillInstance.setSelection(0, 1);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const alignmentEditor = formInstance.$element().find(`.${BUTTON_GROUP_CLASS}`).eq(0).dxButtonGroup('instance');

            assert.strictEqual(alignmentEditor.option('selectedItemKeys')[0], 'center', 'alignmentEditor selectedItemKeys is correct');
        });

        test('Check properties edititng at the cell Form (without dimensions)', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(6);
            this.quillInstance.setSelection(50, 1);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const borderStyleEditor = formInstance.getEditor('borderStyle');
            borderStyleEditor.option('value', 'dotted');

            const borderWidthEditor = formInstance.getEditor('borderWidth');
            borderWidthEditor.option('value', 3);

            const borderColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(0).dxColorBox('instance');
            borderColorEditor.option('value', 'red');

            const backgroundColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(1).dxColorBox('instance');
            backgroundColorEditor.option('value', 'green');

            const horizontalPaddingEditor = formInstance.getEditor('horizontalPadding');
            horizontalPaddingEditor.option('value', 10);

            const verticalPaddingEditor = formInstance.getEditor('verticalPadding');
            verticalPaddingEditor.option('value', 15);

            const alignmentEditor = formInstance.$element().find(`.${BUTTON_GROUP_CLASS}`).eq(0).dxButtonGroup('instance');
            alignmentEditor.option('selectedItemKeys', ['right']);

            const verticalAlignmentEditor = formInstance.$element().find(`.${BUTTON_GROUP_CLASS}`).eq(1).dxButtonGroup('instance');
            verticalAlignmentEditor.option('selectedItemKeys', ['bottom']);

            this.applyFormChanges();

            assert.strictEqual($targetCell.css('borderTopStyle'), 'dotted', 'border style is applied');
            assert.strictEqual($targetCell.css('borderTopWidth'), '3px', 'border width is applied');
            assert.strictEqual($targetCell.css('borderTopColor'), 'rgb(255, 0, 0)', 'border color is applied');
            assert.strictEqual($targetCell.css('backgroundColor'), 'rgb(0, 128, 0)', 'background color is applied');
            assert.strictEqual($targetCell.css('paddingLeft'), '10px', 'padding is applied');
            assert.strictEqual($targetCell.css('paddingRight'), '10px', 'padding is applied');
            assert.strictEqual($targetCell.css('paddingTop'), '15px', 'padding is applied');
            assert.strictEqual($targetCell.css('paddingBottom'), '15px', 'padding is applied');
            assert.strictEqual($targetCell.css('textAlign'), 'right', 'text align is applied');
            assert.strictEqual($targetCell.css('verticalAlign'), 'bottom', 'vertical align is applied');
        });

        test('Cell Properties form applying with no changes should not affect formats of the cell', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(6);
            this.quillInstance.setSelection(50, 1);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);

            this.applyFormChanges();

            const cellFormats = this.quillInstance.getFormat();

            assert.deepEqual(cellFormats, {
                cellTextAlign: 'left',
                cellVerticalAlign: 'middle',
                'data-table-row': '2',
                row: '2',
                tableCellLine: { row: '2', cell: '3' }
            }, 'cell formats are not changed');
        });

        test('Cell Properties form should show updated values when reopened after applying changes', function(assert) {
            const multilineTableMarkup = `
            <table>
                <tr>
                    <td>0_0 content</td>
                    <td>0_1</td>
                    <td>0_2</td>
                </tr>
                <tr>
                    <td>1_0</td>
                    <td><p>Line 1</p><p>Line 2</p></td>
                    <td>1_2</td>
                </tr>
                <tr>
                    <td>2_0</td>
                    <td>2_1</td>
                    <td>2_2</td>
                </tr>
            </table>`;

            this.createWidget({ value: multilineTableMarkup });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(4);

            const editorText = this.quillInstance.getText();
            const secondLinePosition = editorText.indexOf('Line 2');
            this.quillInstance.setSelection(secondLinePosition, 0);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);

            let formInstance = this.getFormInstance();

            const borderStyleEditor = formInstance.getEditor('borderStyle');
            borderStyleEditor.option('value', 'dotted');

            const borderWidthEditor = formInstance.getEditor('borderWidth');
            borderWidthEditor.option('value', 5);

            const borderColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(0).dxColorBox('instance');
            borderColorEditor.option('value', 'blue');

            const backgroundColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(1).dxColorBox('instance');
            backgroundColorEditor.option('value', 'yellow');

            const horizontalPaddingEditor = formInstance.getEditor('horizontalPadding');
            horizontalPaddingEditor.option('value', 12);

            const verticalPaddingEditor = formInstance.getEditor('verticalPadding');
            verticalPaddingEditor.option('value', 8);

            const alignmentEditor = formInstance.$element().find('.dx-buttongroup').eq(0).dxButtonGroup('instance');
            alignmentEditor.option('selectedItemKeys', ['center']);

            const verticalAlignmentEditor = formInstance.$element().find('.dx-buttongroup').eq(1).dxButtonGroup('instance');
            verticalAlignmentEditor.option('selectedItemKeys', ['top']);

            this.applyFormChanges();

            this.quillInstance.setSelection(36, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);

            formInstance = this.getFormInstance();
            const reopenedBorderStyleEditor = formInstance.getEditor('borderStyle');
            const reopenedBorderWidthEditor = formInstance.getEditor('borderWidth');
            const reopenedBorderColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(0).dxColorBox('instance');
            const reopenedBackgroundColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(1).dxColorBox('instance');
            const reopenedHorizontalPaddingEditor = formInstance.getEditor('horizontalPadding');
            const reopenedVerticalPaddingEditor = formInstance.getEditor('verticalPadding');
            const reopenedAlignmentEditor = formInstance.$element().find('.dx-buttongroup').eq(0).dxButtonGroup('instance');
            const reopenedVerticalAlignmentEditor = formInstance.$element().find('.dx-buttongroup').eq(1).dxButtonGroup('instance');


            assert.strictEqual(reopenedBorderStyleEditor.option('value'), 'dotted', 'border style editor shows updated value');
            assert.strictEqual(reopenedBorderWidthEditor.option('value'), 5, 'border width editor shows updated value');
            assert.strictEqual(reopenedBorderColorEditor.option('value'), 'blue', 'border color editor shows updated value');
            assert.strictEqual(reopenedBackgroundColorEditor.option('value'), 'yellow', 'background color editor shows updated value');
            assert.strictEqual(reopenedHorizontalPaddingEditor.option('value'), 12, 'horizontal padding editor shows updated value');
            assert.strictEqual(reopenedVerticalPaddingEditor.option('value'), 8, 'vertical padding editor shows updated value');
            assert.strictEqual(reopenedAlignmentEditor.option('selectedItemKeys')[0], 'center', 'alignment editor shows updated value');
            assert.strictEqual(reopenedVerticalAlignmentEditor.option('selectedItemKeys')[0], 'top', 'vertical alignment editor shows updated value');
        });

        test('Cell Properties form should show updated values when reopened after applying changes (TableLite)', function(assert) {
            this.createWidget({
                onInitialized: ({ component }) => {
                    const liteTableModule = component.get('tableModules/lite');
                    component.register({ 'modules/table': liteTableModule });
                },
                onDisposing: ({ component }) => {
                    const mainTableModule = component.get('tableModules/main');
                    component.register({ 'modules/table': mainTableModule });
                }
            });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(6);

            this.quillInstance.setSelection(50, 1);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);

            let formInstance = this.getFormInstance();

            const borderStyleEditor = formInstance.getEditor('borderStyle');
            borderStyleEditor.option('value', 'dotted');

            const borderWidthEditor = formInstance.getEditor('borderWidth');
            borderWidthEditor.option('value', 5);

            const borderColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(0).dxColorBox('instance');
            borderColorEditor.option('value', 'blue');

            const backgroundColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(1).dxColorBox('instance');
            backgroundColorEditor.option('value', 'yellow');

            const horizontalPaddingEditor = formInstance.getEditor('horizontalPadding');
            horizontalPaddingEditor.option('value', 12);

            const verticalPaddingEditor = formInstance.getEditor('verticalPadding');
            verticalPaddingEditor.option('value', 8);

            const alignmentEditor = formInstance.$element().find(`.${BUTTON_GROUP_CLASS}`).eq(0).dxButtonGroup('instance');
            alignmentEditor.option('selectedItemKeys', ['center']);

            const verticalAlignmentEditor = formInstance.$element().find(`.${BUTTON_GROUP_CLASS}`).eq(1).dxButtonGroup('instance');
            verticalAlignmentEditor.option('selectedItemKeys', ['top']);

            this.applyFormChanges();

            this.quillInstance.setSelection(50, 1);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);

            formInstance = this.getFormInstance();
            const reopenedBorderStyleEditor = formInstance.getEditor('borderStyle');
            const reopenedBorderWidthEditor = formInstance.getEditor('borderWidth');
            const reopenedBorderColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(0).dxColorBox('instance');
            const reopenedBackgroundColorEditor = formInstance.$element().find(`.${COLOR_BOX_CLASS}`).eq(1).dxColorBox('instance');
            const reopenedHorizontalPaddingEditor = formInstance.getEditor('horizontalPadding');
            const reopenedVerticalPaddingEditor = formInstance.getEditor('verticalPadding');
            const reopenedAlignmentEditor = formInstance.$element().find(`.${BUTTON_GROUP_CLASS}`).eq(0).dxButtonGroup('instance');
            const reopenedVerticalAlignmentEditor = formInstance.$element().find(`.${BUTTON_GROUP_CLASS}`).eq(1).dxButtonGroup('instance');

            assert.strictEqual(reopenedBorderStyleEditor.option('value'), 'dotted', 'border style editor shows updated value');
            assert.strictEqual(reopenedBorderWidthEditor.option('value'), 5, 'border width editor shows updated value');
            assert.strictEqual(reopenedBorderColorEditor.option('value'), 'blue', 'border color editor shows updated value');
            assert.strictEqual(reopenedBackgroundColorEditor.option('value'), 'yellow', 'background color editor shows updated value');
            assert.strictEqual(reopenedHorizontalPaddingEditor.option('value'), 12, 'horizontal padding editor shows updated value');
            assert.strictEqual(reopenedVerticalPaddingEditor.option('value'), 8, 'vertical padding editor shows updated value');
            assert.strictEqual(reopenedAlignmentEditor.option('selectedItemKeys')[0], 'center', 'alignment editor shows updated value');
            assert.strictEqual(reopenedVerticalAlignmentEditor.option('selectedItemKeys')[0], 'top', 'vertical alignment editor shows updated value');
        });

        test('Check cell width and height editor options', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(0);

            this.quillInstance.setSelection(50, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            const heightEditor = formInstance.getEditor('height');

            assert.strictEqual(widthEditor.option('min'), 0, 'min is applied');
            assert.strictEqual(heightEditor.option('min'), 0, 'placeholder is applied');
            assert.ok(widthEditor.option('placeholder').length > 1, 'placeholder is applied');
            assert.ok(heightEditor.option('placeholder').length > 1, 'placeholder is applied');
        });

        test('Check base cell dimensions edititng', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);
            const initialTableWidth = $tableElement.outerWidth();
            const initialTableHeight = $tableElement.outerHeight();
            const $targetCell = $tableElement.find('td').eq(6);
            const initialCellHeight = $targetCell.outerHeight();

            this.quillInstance.setSelection(50, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 80);

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 180);

            this.applyFormChanges();

            assert.strictEqual($targetCell.outerHeight(), 80, 'cell height is applied');
            assert.strictEqual($targetCell.get(0).style.height, '80px', 'cell height style is correct');
            assert.strictEqual($targetCell.next().get(0).style.height, '80px', 'sibling cell height style is correct');

            assert.strictEqual($targetCell.outerWidth(), 180, 'cell width is applied');
            assert.strictEqual($targetCell.get(0).style.width, '180px', 'cell width style is correct');
            assert.strictEqual($tableElement.find('td').eq(2).get(0).style.width, '180px', 'other this column cell width style is correct');

            assert.roughEqual(initialTableWidth, $tableElement.outerWidth(), 1, 'table width is not changed');
            assert.roughEqual(initialTableHeight + 80 - initialCellHeight, $tableElement.outerHeight(), 1), 'table height is changed as expected';
        });

        test('Check header row cell dimensions edititng', function(assert) {
            this.createWidget({ value: tableMarkupWithHeaderRow });

            const $tableElement = this.$element.find('table').eq(0);
            const initialTableWidth = $tableElement.outerWidth();
            const initialTableHeight = $tableElement.outerHeight();
            const $targetCell = $tableElement.find('th').eq(1);
            const initialCellHeight = $targetCell.outerHeight();

            this.quillInstance.setSelection(3, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 80);

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 180);

            this.applyFormChanges();

            assert.strictEqual($targetCell.outerHeight(), 80, 'cell height is applied');
            assert.strictEqual($targetCell.get(0).style.height, '80px', 'cell height style is correct');
            assert.strictEqual($targetCell.next().get(0).style.height, '80px', 'sibling cell height style is correct');

            assert.strictEqual($targetCell.outerWidth(), 180, 'cell width is applied');
            assert.strictEqual($targetCell.get(0).style.width, '180px', 'cell width style is correct');
            assert.strictEqual($tableElement.find('td').eq(1).get(0).style.width, '180px', 'other this column cell width style is correct');

            assert.roughEqual(initialTableWidth, $tableElement.outerWidth(), 1, 'table width is not changed');
            assert.roughEqual(initialTableHeight + 80 - initialCellHeight, $tableElement.outerHeight(), 1), 'table height is changed as expected';
        });

        test('formDialog tableWidth should have value in table with fixed dimensions and enabled tableResizing (T1093235)', function(assert) {
            this.createWidget({
                tableResizing: { enabled: true },
                value: tableWithFixedDimensionsMarkup
            });

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);

            const formInstance = this.getFormInstance();
            const width = formInstance.getEditor('width').option('value');

            assert.notOk(isNaN(width), 'width is not NaN');
        });

        test('formDialog tableWidth should have value after cell width change in table with enabled tableResizing', function(assert) {
            this.createWidget({
                tableResizing: { enabled: true },
                value: tableWithFixedDimensionsMarkup
            });
            const $tableElement = this.$element.find('table').eq(0);
            const $cellElement = $tableElement.find('td').eq(0);

            this.quillInstance.setSelection(5, 1);
            showCellPropertiesForm(this.instance, $cellElement);
            this.clock.tick(10);


            const cellPropertiesFormInstance = this.getFormInstance();
            cellPropertiesFormInstance.getEditor('width').option('value', 50);
            this.applyFormChanges();

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);

            const tablePropertiesFormInstance = this.getFormInstance();
            const width = tablePropertiesFormInstance.getEditor('width').option('value');

            assert.notOk(isNaN(width), 'width is not NaN');
        });
    });

    module('Cell width calculations', {}, () => {
        test('Check cell width edititing if all columns width is fixed', function(assert) {
            this.createWidget({ value: '\
            <table>\
                <tr>\
                    <td width="300px">0_0 content</td>\
                    <td width="300px">0_1</td>\
                </tr>\
                <tr>\
                    <td width="300px">1_0</td>\
                    <td width="300px">1_1</td>\
                </tr>\
            </table>\
            <br>' });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(0);
            $tableElement.css('width', 'initial');

            this.quillInstance.setSelection(5, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            this.applyFormChanges();

            assert.strictEqual($targetCell.outerWidth(), 250, 'cell width is applied');
            assert.strictEqual($targetCell.next().outerWidth(), 350, 'next cell width is correct');
        });

        test('Check cell width styles after edititing if all columns width is not fixed', function(assert) {
            this.createWidget({ width: 632, value: '\
            <table>\
                <tr>\
                    <td>0_0 content</td>\
                    <td>0_1</td>\
                </tr>\
                <tr>\
                    <td>1_0</td>\
                    <td>1_1</td>\
                </tr>\
            </table>\
            <br>' });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(0);

            this.quillInstance.setSelection(5, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            this.applyFormChanges();

            assert.strictEqual($targetCell.outerWidth(), 250, 'cell width is applied');
            assert.strictEqual($targetCell.get(0).style.width, '250px', 'cell width style is applied');
            assert.roughEqual($targetCell.next().outerWidth(), 348, 2, 'next cell width style is correct');
            assert.strictEqual($targetCell.next().get(0).style.width, '', 'next cell width style is correct');
        });

        test('Check cell width edititing for the last table column if all columns width is fixed', function(assert) {
            this.createWidget({ value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(1);
            $tableElement.css('width', 'initial');

            this.quillInstance.setSelection(5, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            this.applyFormChanges();

            assert.strictEqual($targetCell.outerWidth(), 250, 'cell width is applied');
            assert.strictEqual($targetCell.prev().outerWidth(), 350, 'previous cell width is correct');
        });

        test('Check cell width edititing if the table has one column', function(assert) {
            this.createWidget({ value: '\
            <table>\
                <tr>\
                    <td>0_0 content</td>\
                </tr>\
                <tr>\
                    <td>1_0</td>\
                </tr>\
            </table>\
            <br>' });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(0);

            this.quillInstance.setSelection(5, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            this.applyFormChanges();

            assert.strictEqual($targetCell.outerWidth(), 250, 'cell width is applied');
        });


        test('Check cell width edititing if the table has one column with auto width and one with fixed width', function(assert) {
            this.createWidget({ width: 632, value: '\
            <table>\
                <tr>\
                    <td width="300px">0_0 content</td>\
                    <td>0_1</td>\
                </tr>\
                <tr>\
                    <td width="300px">1_0</td>\
                    <td>1_1</td>\
                </tr>\
            </table>\
            <br>' });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(1);

            this.quillInstance.setSelection(5, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            this.applyFormChanges();

            assert.strictEqual($targetCell.outerWidth(), 250, 'cell width is applied');
            assert.strictEqual($targetCell.get(0).style.width, '250px', 'cell width style is applied');
            assert.roughEqual(parseInt($targetCell.prev().outerWidth()), 350, 2, 'previous cell width style is correct');
            assert.roughEqual(parseInt($targetCell.prev().outerWidth()), 350, 2, 'previous cell width style is correct');
        });

        test('Check cell width edititing if the table has two column with auto width and one with fixed width', function(assert) {
            this.createWidget({ width: 932, value: '\
            <table>\
                <tr>\
                    <td width="300px">0_0 content</td>\
                    <td>0_1</td>\
                    <td>0_2</td>\
                </tr>\
                <tr>\
                    <td width="300px">1_0</td>\
                    <td>1_1</td>\
                    <td>1_2</td>\
                </tr>\
            </table>\
            <br>' });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(1);

            this.quillInstance.setSelection(5, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 400);

            this.applyFormChanges();

            assert.strictEqual($targetCell.outerWidth(), 400, 'cell width is applied');
            assert.strictEqual($targetCell.get(0).style.width, '400px', 'cell width style is applied');
            assert.roughEqual($targetCell.prev().outerWidth(), 300, 2, 'previous cell width is correct');
            assert.roughEqual(parseInt($targetCell.prev().get(0).style.width), 300, 2, 'previous cell width style is correct');
            assert.roughEqual($targetCell.next().outerWidth(), 200, 2, 'next cell width is correct');
            assert.strictEqual($targetCell.next().get(0).style.width, '', 'next cell width style is correct');
        });

        test('Check cell width styles if new value is more than the full table width', function(assert) {
            this.createWidget({ width: 632, value: '\
            <table>\
                <tr>\
                    <td>0_0 content</td>\
                    <td>0_1</td>\
                </tr>\
                <tr>\
                    <td>1_0</td>\
                    <td>1_1</td>\
                </tr>\
            </table>\
            <br>' });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(0);

            this.quillInstance.setSelection(5, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 700);

            this.applyFormChanges();

            assert.roughEqual($targetCell.outerWidth(), 567, 3, 'cell width is applied');
            assert.strictEqual($targetCell.get(0).style.width, '700px', 'cell width style is applied');
            assert.roughEqual($targetCell.next().outerWidth(), 32, 3, 'next cell width style is correct');
            assert.strictEqual($targetCell.next().get(0).style.width, '', 'next cell width style is correct');
            assert.roughEqual($tableElement.outerWidth(), 600, 2, 'table width is not changed');
        });

        test('Check cell width styles if new value is more than the full table width and all columns has fixed width', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(0);

            this.quillInstance.setSelection(5, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 700);

            this.applyFormChanges();

            assert.roughEqual($targetCell.outerWidth(), 567, 3, 'cell width is applied');
            assert.strictEqual($targetCell.get(0).style.width, '700px', 'cell width style is applied');
            assert.roughEqual($targetCell.next().outerWidth(), 32, 3, 'next cell width style is correct');
            assert.strictEqual($targetCell.next().get(0).style.width, '0px', 'next cell width style is correct');
            assert.roughEqual($tableElement.outerWidth(), 600, 2, 'table width is not changed');
        });

        test('Check cell width styles if it is changed after the table width was changed (columns width is fixed)', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            this.quillInstance.setSelection(5, 1);
            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);
            let formInstance = this.getFormInstance();

            let widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 400);

            this.applyFormChanges();

            const $targetCell = $tableElement.find('td').eq(0);

            this.quillInstance.setSelection(5, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);

            formInstance = this.getFormInstance();

            widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 150);

            this.applyFormChanges();

            assert.roughEqual($targetCell.outerWidth(), 150, 2, 'cell width is applied');
            assert.strictEqual($targetCell.get(0).style.width, '150px', 'cell width style is applied');
            assert.roughEqual(parseInt($targetCell.next().outerWidth()), 250, 2, 'next cell width style is correct');
            assert.roughEqual(parseInt($targetCell.next().get(0).style.width), 250, 2, 'next cell width style is correct');
            assert.roughEqual($tableElement.outerWidth(), 400, 2, 'table width is correct');
        });

        test('Check cell width styles if it is changed after the table width was changed (columns width is not fixed)', function(assert) {
            this.createWidget({ width: 1032 });

            const $tableElement = this.$element.find('table').eq(0);

            this.quillInstance.setSelection(50, 1);
            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);
            let formInstance = this.getFormInstance();

            let widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 800);

            this.applyFormChanges();

            const $targetCell = $tableElement.find('td').eq(0);

            this.quillInstance.setSelection(50, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            formInstance = this.getFormInstance();

            widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 110);

            this.applyFormChanges();

            const $rowCells = $targetCell.closest('tr').find('td');

            assert.roughEqual($targetCell.outerWidth(), 110, 2, 'cell width is applied');
            assert.strictEqual($targetCell.get(0).style.width, '110px', 'cell width style is applied');
            assert.roughEqual(parseInt($rowCells.eq(1).outerWidth()), 230, 2, 'second cell width style is correct');
            assert.roughEqual(parseInt($rowCells.eq(2).outerWidth()), 230, 2, 'third cell width style is correct');
            assert.roughEqual(parseInt($rowCells.eq(3).outerWidth()), 230, 2, 'fourth cell width style is correct');
            assert.roughEqual($tableElement.outerWidth(), 800, 2, 'table width is correct');
        });
    });

    module('Cell height calculations', {}, () => {
        test('Check cell height edititng if all rows height is fixed', function(assert) {
            this.createWidget({ value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);
            const initialTableHeight = $tableElement.outerHeight();
            const $targetCell = $tableElement.find('td').eq(0);
            const initialCellHeight = $targetCell.outerHeight();

            this.quillInstance.setSelection(5, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 80);

            this.applyFormChanges();

            assert.strictEqual($targetCell.outerHeight(), 80, 'cell height is applied');
            assert.strictEqual($targetCell.get(0).style.height, '80px', 'cell height style is correct');

            assert.roughEqual(initialTableHeight + 80 - initialCellHeight, $tableElement.outerHeight(), 1), 'table height is changed as expected';
        });

        test('Check cell height edititng if all rows height is fixed and new value is less than the minimum row content height', function(assert) {
            this.createWidget({ value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(2);

            this.quillInstance.setSelection(17, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 10);

            this.applyFormChanges();

            assert.roughEqual($targetCell.outerHeight(), 24, 2, 'cell height is applied');
            assert.strictEqual($targetCell.get(0).style.height, '10px', 'cell height style is correct');

            assert.roughEqual($tableElement.outerHeight(), 48, 3), 'table height is changed as expected';
        });

    });

    module('Table height calculations', {}, () => {
        test('Check table height edititng if all rows height is fixed', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            this.quillInstance.setSelection(5, 1);
            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 150);

            this.applyFormChanges();
            const $verticalCells = $tableElement.find('td:nth-child(1)');

            assert.roughEqual($tableElement.outerHeight(), 150, 2.01, 'table height is changed as expected');
            assert.roughEqual($verticalCells.eq(0).outerHeight(), 50, 2, 'first row cell height is applied');
            assert.roughEqual(parseInt($verticalCells.eq(0).get(0).style.height), 50, 2, 'first row cell height style is applied');
            assert.roughEqual(parseInt($verticalCells.eq(1).outerHeight()), 99, 3, 'second row cell height style is applied');
            assert.roughEqual(parseInt($verticalCells.eq(1).get(0).style.height), 99, 3, 'second row cell height style is applied');
        });

        test('Check table height edititng if new value is less than the content', function(assert) {
            this.createWidget({ value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            this.quillInstance.setSelection(5, 1);
            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 30);

            this.applyFormChanges();

            const $verticalCells = $tableElement.find('td:nth-child(1)');

            assert.roughEqual($tableElement.outerHeight(), 48, 3, 'table height is changed as expected');
            assert.roughEqual($verticalCells.eq(0).outerHeight(), 24, 2, 'first row cell height is applied');
            assert.roughEqual(parseInt($verticalCells.eq(0).get(0).style.height), 10, 2, 'first row cell height style is applied');
            assert.roughEqual(parseInt($verticalCells.eq(1).outerHeight()), 24, 2, 'second row cell height style is applied');
            assert.roughEqual(parseInt($verticalCells.eq(1).get(0).style.height), 20, 2, 'second row cell height style is applied');
        });
    });

    module('Table width calculations', {}, () => {
        test('Check table width edititng if all columns height is fixed', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            this.quillInstance.setSelection(5, 1);
            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 400);

            this.applyFormChanges();

            const $horizontalCells = $tableElement.find('tr:eq(0) td');

            assert.roughEqual($tableElement.outerWidth(), 400, 2, 'table width is changed as expected');
            assert.roughEqual($horizontalCells.eq(0).outerWidth(), 200, 2, 'first column cell width is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(0).get(0).style.width), 200, 2, 'first column cell width style is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(1).outerWidth()), 200, 2, 'second column cell width style is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(1).get(0).style.width), 200, 2, 'second column cell width style is applied');
        });

        test('Check table width edititng if one column width is fixed', function(assert) {
            this.createWidget({ width: 632, value: '\
            <table>\
                <tr>\
                    <td style="width: 400px;">0_0 content</td>\
                    <td>0_1</td>\
                </tr>\
                <tr>\
                    <td style="width: 400px;">1_0</td>\
                    <td>1_1</td>\
                </tr>\
            </table>\
            <br>' });

            const $tableElement = this.$element.find('table').eq(0);

            this.quillInstance.setSelection(5, 1);
            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 900);

            this.applyFormChanges();

            const $horizontalCells = $tableElement.find('tr:eq(0) td');

            assert.roughEqual($tableElement.outerWidth(), 900, 2, 'table width is changed as expected');
            assert.roughEqual($horizontalCells.eq(0).outerWidth(), 400, 2, 'first column cell width is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(0).get(0).style.width), 400, 2, 'first column cell width style is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(1).outerWidth()), 500, 2, 'second column cell width style is applied');
            assert.strictEqual($horizontalCells.eq(1).get(0).style.width, '', 'second column cell width style is undefined');
        });

        test('Check table width edititng if new width is less than the content', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            this.quillInstance.setSelection(5, 1);
            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);

            const formInstance = this.getFormInstance();
            const widthEditor = formInstance.getEditor('width');

            widthEditor.option('value', 60);

            this.applyFormChanges();

            const $horizontalCells = $tableElement.find('tr:eq(0) td');

            assert.roughEqual($tableElement.outerWidth(), 90, 3, 'table width is changed as expected');
            assert.roughEqual($horizontalCells.eq(0).outerWidth(), 60, 4.01, 'first column cell width is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(0).get(0).style.width), 30, 2, 'first column cell width style is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(1).outerWidth()), 30, 4.01, 'second column cell width style is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(1).get(0).style.width), 30, 2, 'second column cell width style is applied');
        });

        test('Check table width styles if it is changed after the cell width was changed (columns width is not fixed)', function(assert) {
            this.createWidget({ width: 632, value: '\
            <table>\
                <tr>\
                    <td>0_0 content</td>\
                    <td>0_1</td>\
                </tr>\
                <tr>\
                    <td>1_0</td>\
                    <td>1_1</td>\
                </tr>\
            </table>\
            <br>' });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(0);

            this.quillInstance.setSelection(5, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            let formInstance = this.getFormInstance();

            let widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 200);

            this.applyFormChanges();

            this.quillInstance.setSelection(5, 1);
            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);
            formInstance = this.getFormInstance();

            widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 800);

            this.applyFormChanges();

            assert.roughEqual($targetCell.outerWidth(), 200, 2, 'cell width is applied');
            assert.strictEqual($targetCell.get(0).style.width, '200px', 'cell width style is applied');
            assert.roughEqual($targetCell.next().outerWidth(), 600, 2, 'next cell width style is correct');
            assert.strictEqual($targetCell.next().get(0).style.width, '', 'next cell width style is not defined');
            assert.roughEqual($tableElement.outerWidth(), 800, 2, 'table width is correct');
        });

        test('Check table width styles if it is changed after the cell width was changed (columns width is fixed)', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(0);

            this.quillInstance.setSelection(5, 1);
            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(10);
            let formInstance = this.getFormInstance();

            let widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 200);

            this.applyFormChanges();

            this.quillInstance.setSelection(5, 1);
            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(10);
            formInstance = this.getFormInstance();

            widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 450);

            this.applyFormChanges();

            assert.roughEqual($targetCell.outerWidth(), 150, 2, 'cell width is applied');
            assert.roughEqual(parseInt($targetCell.get(0).style.width), 150, 2, 'cell width style is applied');
            assert.roughEqual($targetCell.next().outerWidth(), 300, 2, 'next cell width style is correct');
            assert.strictEqual(parseInt($targetCell.next().get(0).style.width), 300, 'next cell width style is not defined');
            assert.roughEqual($tableElement.outerWidth(), 450, 2, 'table width is correct');
        });
    });

    module('Localization', {
        beforeEach: function() {
            this.messages = {
                'de': {
                    'dxHtmlEditor-borderStyleNone': 'Test',
                }
            };
            localization.loadMessages(this.messages);
            localization.locale('de');
        },
        afterEach: function() {
            localization.locale('en');
        }
    }, () => {
        test('borderStyle selectbox items are localized even if messages are loaded at runtime (T1234032)', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);

            this.clock.tick(10);

            const formBorderItem = this.getFormInstance().option('items')[0];
            const borderStyleEditor = formBorderItem.items[0];
            const firstListItem = borderStyleEditor.editorOptions.items[0];

            assert.strictEqual(firstListItem.value, 'Test', 'borderStyleEditor is correctly localized');
        });
    });
});
