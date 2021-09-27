import $ from 'jquery';
import 'ui/html_editor';
import devices from 'core/devices';

import { showTablePropertiesForm, showCellPropertiesForm } from 'ui/html_editor/ui/tableForms';

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

        this.applyFormChanges = (formInstance) => {
            const $okButton = $('.dx-popup-bottom .dx-button:visible').eq(0);
            $okButton.trigger('dxclick');

            this.clock.tick();
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
            this.clock.tick();
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const $scrollView = $form.closest('.dx-scrollview');

            assert.strictEqual($form.length, 1);
            assert.ok($form.eq(0).is(':visible'));
            assert.ok($scrollView.length, 'Form should be in the ScrollView');
        });

        test('Form popup use a fullscreen mode for mobile devices', function(assert) {
            const isPhone = devices.real().deviceType === 'phone';

            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick();
            const $popup = $('.dx-overlay-content');

            assert.strictEqual($popup.hasClass('dx-popup-fullscreen'), isPhone);
        });

        test('Check properties edititng at the table Form (without dimensions)', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick();

            const formInstance = this.getFormInstance();

            const borderStyleEditor = formInstance.getEditor('borderStyle');
            borderStyleEditor.option('value', 'dotted');

            const borderWidthEditor = formInstance.getEditor('borderWidth');
            borderWidthEditor.option('value', 3);

            const borderColorEditor = formInstance.$element().find('.dx-colorbox').eq(0).dxColorBox('instance');
            borderColorEditor.option('value', 'red');

            const backgroundColorEditor = formInstance.$element().find('.dx-colorbox').eq(1).dxColorBox('instance');
            backgroundColorEditor.option('value', 'green');

            const alignmentEditor = formInstance.$element().find('.dx-buttongroup').eq(0).dxButtonGroup('instance');
            alignmentEditor.option('selectedItemKeys', ['right']);

            this.applyFormChanges(formInstance);

            assert.strictEqual($tableElement.css('borderTopStyle'), 'dotted', 'border style is applied');
            assert.strictEqual($tableElement.css('borderTopWidth'), '3px', 'border width is applied');
            assert.strictEqual($tableElement.css('borderTopColor'), 'rgb(255, 0, 0)', 'border color is applied');
            assert.strictEqual($tableElement.css('backgroundColor'), 'rgb(0, 128, 0)', 'background color is applied');
            assert.strictEqual($tableElement.css('textAlign'), 'right', 'text align is applied');
        });

        test('Check table width and height editor min options', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            const heightEditor = formInstance.getEditor('height');

            assert.strictEqual(widthEditor.option('min'), 0);
            assert.strictEqual(heightEditor.option('min'), 0);
        });

        test('Check base dimensions edititng at the table Form', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 90);

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 600);

            this.applyFormChanges(formInstance);

            assert.strictEqual($tableElement.outerHeight(), 90, 'cell height is applied');
            assert.strictEqual($tableElement.outerWidth(), 600, 'cell width is applied');
        });

        test('show cell Form', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);

            showCellPropertiesForm(this.instance, $tableElement);
            this.clock.tick();
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const $scrollView = $form.closest('.dx-scrollview');

            assert.strictEqual($form.length, 1);
            assert.ok($form.eq(0).is(':visible'));
            assert.ok($scrollView.length, 'Form should be in the ScrollView');
        });

        test('Check properties edititng at the cell Form (without dimensions)', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(6);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const borderStyleEditor = formInstance.getEditor('borderStyle');
            borderStyleEditor.option('value', 'dotted');

            const borderWidthEditor = formInstance.getEditor('borderWidth');
            borderWidthEditor.option('value', 3);

            const borderColorEditor = formInstance.$element().find('.dx-colorbox').eq(0).dxColorBox('instance');
            borderColorEditor.option('value', 'red');

            const backgroundColorEditor = formInstance.$element().find('.dx-colorbox').eq(1).dxColorBox('instance');
            backgroundColorEditor.option('value', 'green');

            const horizontalPaddingEditor = formInstance.getEditor('horizontalPadding');
            horizontalPaddingEditor.option('value', 10);

            const verticalPaddingEditor = formInstance.getEditor('verticalPadding');
            verticalPaddingEditor.option('value', 15);

            const alignmentEditor = formInstance.$element().find('.dx-buttongroup').eq(0).dxButtonGroup('instance');
            alignmentEditor.option('selectedItemKeys', ['right']);

            const verticalAlignmentEditor = formInstance.$element().find('.dx-buttongroup').eq(1).dxButtonGroup('instance');
            verticalAlignmentEditor.option('selectedItemKeys', ['bottom']);

            this.applyFormChanges(formInstance);

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

        test('Check cell width and height editor min options', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(0);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            const heightEditor = formInstance.getEditor('height');

            assert.strictEqual(widthEditor.option('min'), 0);
            assert.strictEqual(heightEditor.option('min'), 0);
        });

        test('Check base cell dimensions edititng', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);
            const initialTableWidth = $tableElement.outerWidth();
            const initialTableHeight = $tableElement.outerHeight();
            const $targetCell = $tableElement.find('td').eq(6);
            const initialCellHeight = $targetCell.outerHeight();

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 80);

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 180);

            this.applyFormChanges(formInstance);

            assert.strictEqual($targetCell.outerHeight(), 80, 'cell height is applied');
            assert.strictEqual($targetCell.attr('height'), '80px', 'cell height attribute is correct');
            assert.strictEqual($targetCell.next().attr('height'), '80px', 'sibling cell height attribute is correct');

            assert.strictEqual($targetCell.outerWidth(), 180, 'cell width is applied');
            assert.strictEqual($targetCell.attr('width'), '180px', 'cell width attribute is correct');
            assert.strictEqual($tableElement.find('td').eq(2).attr('width'), '180px', 'other this column cell width attribute is correct');

            assert.roughEqual(initialTableWidth, $tableElement.outerWidth(), 1, 'table width is not changed');
            assert.roughEqual(initialTableHeight + 80 - initialCellHeight, $tableElement.outerHeight(), 1), 'table height is changed as expected';
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

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            this.applyFormChanges(formInstance);

            assert.strictEqual($targetCell.outerWidth(), 250, 'cell width is applied');
            assert.strictEqual($targetCell.next().outerWidth(), 350, 'next cell width is correct');
        });

        test('Check cell width attributes after edititing if all columns width is not fixed', function(assert) {
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

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            this.applyFormChanges(formInstance);

            assert.strictEqual($targetCell.outerWidth(), 250, 'cell width is applied');
            assert.strictEqual($targetCell.attr('width'), '250px', 'cell width attr is applied');
            assert.roughEqual($targetCell.next().outerWidth(), 348, 2, 'next cell width attr is correct');
            assert.strictEqual($targetCell.next().attr('width'), undefined, 'next cell width attr is correct');
        });

        test('Check cell width edititing for the last table column if all columns width is fixed', function(assert) {
            this.createWidget({ value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(1);
            $tableElement.css('width', 'initial');

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            this.applyFormChanges(formInstance);

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

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            this.applyFormChanges(formInstance);

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

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            this.applyFormChanges(formInstance);

            assert.strictEqual($targetCell.outerWidth(), 250, 'cell width is applied');
            assert.strictEqual($targetCell.attr('width'), '250px', 'cell width attr is applied');
            assert.roughEqual(parseInt($targetCell.prev().outerWidth()), 350, 2, 'previous cell width attr is correct');
            assert.roughEqual(parseInt($targetCell.prev().outerWidth()), 350, 2, 'previous cell width attr is correct');
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

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 400);

            this.applyFormChanges(formInstance);

            assert.strictEqual($targetCell.outerWidth(), 400, 'cell width is applied');
            assert.strictEqual($targetCell.attr('width'), '400px', 'cell width attr is applied');
            assert.roughEqual($targetCell.prev().outerWidth(), 300, 2, 'previous cell width is correct');
            assert.roughEqual(parseInt($targetCell.prev().attr('width')), 300, 2, 'previous cell width attr is correct');
            assert.roughEqual($targetCell.next().outerWidth(), 200, 2, 'next cell width is correct');
            assert.strictEqual($targetCell.next().attr('width'), undefined, 'next cell width attr is correct');
        });

        test('Check cell width attributes if new value is more than the full table width', function(assert) {
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

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 700);

            this.applyFormChanges(formInstance);

            assert.roughEqual($targetCell.outerWidth(), 567, 3, 'cell width is applied');
            assert.strictEqual($targetCell.attr('width'), '700px', 'cell width attr is applied');
            assert.roughEqual($targetCell.next().outerWidth(), 32, 3, 'next cell width attr is correct');
            assert.strictEqual($targetCell.next().attr('width'), undefined, 'next cell width attr is correct');
            assert.roughEqual($tableElement.outerWidth(), 600, 2, 'table width is not changed');
        });

        test('Check cell width attributes if new value is more than the full table width and all columns has fixed width', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(0);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 700);

            this.applyFormChanges(formInstance);

            assert.roughEqual($targetCell.outerWidth(), 567, 3, 'cell width is applied');
            assert.strictEqual($targetCell.attr('width'), '700px', 'cell width attr is applied');
            assert.roughEqual($targetCell.next().outerWidth(), 32, 3, 'next cell width attr is correct');
            assert.strictEqual($targetCell.next().attr('width'), '0px', 'next cell width attr is correct');
            assert.roughEqual($tableElement.outerWidth(), 600, 2, 'table width is not changed');
        });

        test('Check cell width attributes if it is changed after the table width was changed (columns width is fixed)', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick();
            let formInstance = this.getFormInstance();

            let widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 400);

            this.applyFormChanges(formInstance);

            const $targetCell = $tableElement.find('td').eq(0);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();

            formInstance = this.getFormInstance();

            widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 150);

            this.applyFormChanges(formInstance);

            assert.roughEqual($targetCell.outerWidth(), 150, 2, 'cell width is applied');
            assert.strictEqual($targetCell.attr('width'), '150px', 'cell width attr is applied');
            assert.roughEqual(parseInt($targetCell.next().outerWidth()), 250, 2, 'next cell width attr is correct');
            assert.roughEqual(parseInt($targetCell.next().attr('width')), 250, 2, 'next cell width attr is correct');
            assert.roughEqual($tableElement.outerWidth(), 400, 2, 'table width is correct');
        });

        test('Check cell width attributes if it is changed after the table width was changed (columns width is not fixed)', function(assert) {
            this.createWidget({ width: 1032 });

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick();
            let formInstance = this.getFormInstance();

            let widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 800);

            this.applyFormChanges(formInstance);

            const $targetCell = $tableElement.find('td').eq(0);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            formInstance = this.getFormInstance();

            widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 110);

            this.applyFormChanges(formInstance);

            const $rowCells = $targetCell.closest('tr').find('td');

            assert.roughEqual($targetCell.outerWidth(), 110, 2, 'cell width is applied');
            assert.strictEqual($targetCell.attr('width'), '110px', 'cell width attr is applied');
            assert.roughEqual(parseInt($rowCells.eq(1).outerWidth()), 230, 2, 'second cell width attr is correct');
            assert.roughEqual(parseInt($rowCells.eq(2).outerWidth()), 230, 2, 'third cell width attr is correct');
            assert.roughEqual(parseInt($rowCells.eq(3).outerWidth()), 230, 2, 'fourth cell width attr is correct');
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

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 80);

            this.applyFormChanges(formInstance);

            assert.strictEqual($targetCell.outerHeight(), 80, 'cell height is applied');
            assert.strictEqual($targetCell.attr('height'), '80px', 'cell height attribute is correct');

            assert.roughEqual(initialTableHeight + 80 - initialCellHeight, $tableElement.outerHeight(), 1), 'table height is changed as expected';
        });

        test('Check cell height edititng if all rows height is fixed and new value is less than the minimum row content height', function(assert) {
            this.createWidget({ value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(2);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 10);

            this.applyFormChanges(formInstance);

            assert.roughEqual($targetCell.outerHeight(), 24, 2, 'cell height is applied');
            assert.strictEqual($targetCell.attr('height'), '10px', 'cell height attribute is correct');

            assert.roughEqual($tableElement.outerHeight(), 48, 3), 'table height is changed as expected';
        });

    });

    module('Table height calculations', {}, () => {
        test('Check table height edititng if all rows height is fixed', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 150);

            this.applyFormChanges(formInstance);
            const $verticalCells = $tableElement.find('td:nth-child(1)');

            assert.roughEqual($tableElement.outerHeight(), 150, 2, 'table height is changed as expected');
            assert.roughEqual($verticalCells.eq(0).outerHeight(), 50, 2, 'first row cell height is applied');
            assert.roughEqual(parseInt($verticalCells.eq(0).attr('height')), 50, 2, 'first row cell height attr is applied');
            assert.roughEqual(parseInt($verticalCells.eq(1).outerHeight()), 99, 3, 'second row cell height attr is applied');
            assert.roughEqual(parseInt($verticalCells.eq(1).attr('height')), 99, 3, 'second row cell height attr is applied');
        });

        test('Check table height edititng if new value is less than the content', function(assert) {
            this.createWidget({ value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 30);

            this.applyFormChanges(formInstance);

            const $verticalCells = $tableElement.find('td:nth-child(1)');

            assert.roughEqual($tableElement.outerHeight(), 48, 3, 'table height is changed as expected');
            assert.roughEqual($verticalCells.eq(0).outerHeight(), 24, 2, 'first row cell height is applied');
            assert.roughEqual(parseInt($verticalCells.eq(0).attr('height')), 10, 2, 'first row cell height attr is applied');
            assert.roughEqual(parseInt($verticalCells.eq(1).outerHeight()), 24, 2, 'second row cell height attr is applied');
            assert.roughEqual(parseInt($verticalCells.eq(1).attr('height')), 20, 2, 'second row cell height attr is applied');
        });
    });

    module('Table width calculations', {}, () => {
        test('Check table width edititng if all columns height is fixed', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 400);

            this.applyFormChanges(formInstance);

            const $horizontalCells = $tableElement.find('tr:eq(0) td');

            assert.roughEqual($tableElement.outerWidth(), 400, 2, 'table width is changed as expected');
            assert.roughEqual($horizontalCells.eq(0).outerWidth(), 200, 2, 'first column cell width is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(0).attr('width')), 200, 2, 'first column cell width attr is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(1).outerWidth()), 200, 2, 'second column cell width attr is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(1).attr('width')), 200, 2, 'second column cell width attr is applied');
        });

        test('Check table width edititng if one column width is fixed', function(assert) {
            this.createWidget({ width: 632, value: '\
            <table>\
                <tr>\
                    <td width="400">0_0 content</td>\
                    <td>0_1</td>\
                </tr>\
                <tr>\
                    <td width="400">1_0</td>\
                    <td>1_1</td>\
                </tr>\
            </table>\
            <br>' });

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 900);

            this.applyFormChanges(formInstance);

            const $horizontalCells = $tableElement.find('tr:eq(0) td');

            assert.roughEqual($tableElement.outerWidth(), 900, 2, 'table width is changed as expected');
            assert.roughEqual($horizontalCells.eq(0).outerWidth(), 400, 2, 'first column cell width is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(0).attr('width')), 400, 2, 'first column cell width attr is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(1).outerWidth()), 500, 2, 'second column cell width attr is applied');
            assert.strictEqual($horizontalCells.eq(1).attr('width'), undefined, 'second column cell width attr is undefined');
        });

        test('Check table width edititng if new width is less than the content', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick();
            const formInstance = this.getFormInstance();

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 60);

            this.applyFormChanges(formInstance);

            const $horizontalCells = $tableElement.find('tr:eq(0) td');

            assert.roughEqual($tableElement.outerWidth(), 90, 3, 'table width is changed as expected');
            assert.roughEqual($horizontalCells.eq(0).outerWidth(), 60, 4.01, 'first column cell width is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(0).attr('width')), 30, 2, 'first column cell width attr is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(1).outerWidth()), 30, 4.01, 'second column cell width attr is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(1).attr('width')), 30, 2, 'second column cell width attr is applied');
        });

        test('Check table width attributes if it is changed after the cell width was changed (columns width is not fixed)', function(assert) {
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

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            let formInstance = this.getFormInstance();

            let widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 200);

            this.applyFormChanges(formInstance);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick();
            formInstance = this.getFormInstance();

            widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 800);

            this.applyFormChanges(formInstance);

            assert.roughEqual($targetCell.outerWidth(), 200, 2, 'cell width is applied');
            assert.strictEqual($targetCell.attr('width'), '200px', 'cell width attr is applied');
            assert.roughEqual($targetCell.next().outerWidth(), 600, 2, 'next cell width attr is correct');
            assert.strictEqual($targetCell.next().attr('width'), undefined, 'next cell width attr is not defined');
            assert.roughEqual($tableElement.outerWidth(), 800, 2, 'table width is correct');
        });

        test('Check table width attributes if it is changed after the cell width was changed (columns width is fixed)', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(0);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick();
            let formInstance = this.getFormInstance();

            let widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 200);

            this.applyFormChanges(formInstance);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick();
            formInstance = this.getFormInstance();

            widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 450);

            this.applyFormChanges(formInstance);

            assert.roughEqual($targetCell.outerWidth(), 150, 2, 'cell width is applied');
            assert.roughEqual(parseInt($targetCell.attr('width')), 150, 2, 'cell width attr is applied');
            assert.roughEqual($targetCell.next().outerWidth(), 300, 2, 'next cell width attr is correct');
            assert.strictEqual(parseInt($targetCell.next().attr('width')), 300, 'next cell width attr is not defined');
            assert.roughEqual($tableElement.outerWidth(), 450, 2, 'table width is correct');
        });
    });

});
