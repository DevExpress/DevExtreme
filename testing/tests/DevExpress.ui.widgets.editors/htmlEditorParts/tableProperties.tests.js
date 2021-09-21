import $ from 'jquery';
import 'ui/html_editor';

import { showTablePropertiesForm, showCellPropertiesForm } from 'ui/html_editor/modules/tableOperations';

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

// const LIST_ITEM_CLASS = 'dx-list-item';

const { test, module } = QUnit;

module('Table properties forms', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor');
        this.options = {
            // tableContextMenu: { enabled: true },
            value: tableMarkup
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
        this.instance.dispose();
        this.clock.restore();
    }
}, () => {
    module('Base', {}, () => {
        test('show table Form', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);
            this.quillInstance.setSelection(50, 1);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const $scrollView = $form.closest('.dx-scrollview');

            assert.strictEqual($form.length, 1);
            assert.ok($form.eq(0).is(':visible'));
            assert.ok($scrollView.length, 'Form should be in the ScrollView');
        });

        test('Check properties edititng at the table Form (without dimensions)', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');

            const formInstance = $form.dxForm('instance');

            const borderStyleEditor = formInstance.getEditor('borderStyle');
            borderStyleEditor.option('value', 'dotted');

            const borderWidthEditor = formInstance.getEditor('borderWidth');
            borderWidthEditor.option('value', '3px');

            const borderColorEditor = formInstance.$element().find('.dx-colorbox').eq(0).dxColorBox('instance');
            borderColorEditor.option('value', 'red');

            const backgroundColorEditor = formInstance.$element().find('.dx-colorbox').eq(1).dxColorBox('instance');
            backgroundColorEditor.option('value', 'green');

            const alignmentEditor = formInstance.$element().find('.dx-buttongroup').eq(0).dxButtonGroup('instance');
            alignmentEditor.option('selectedItemKeys', ['right']);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');

            this.clock.tick();

            assert.strictEqual($tableElement.css('borderStyle'), 'dotted', 'border style is applied');
            assert.strictEqual($tableElement.css('borderWidth'), '3px', 'border width is applied');
            assert.strictEqual($tableElement.css('borderColor'), 'rgb(255, 0, 0)', 'border color is applied');
            assert.strictEqual($tableElement.css('backgroundColor'), 'rgb(0, 128, 0)', 'background color is applied');
            assert.strictEqual($tableElement.css('textAlign'), 'right', 'text align is applied');
        });

        test('Check table width and height editor min options', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const formInstance = $form.dxForm('instance');

            const widthEditor = formInstance.getEditor('width');
            const heightEditor = formInstance.getEditor('height');

            assert.strictEqual(widthEditor.option('min'), 0);
            assert.strictEqual(heightEditor.option('min'), 0);
        });

        test('Check base dimensions edititng at the table Form', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');

            const formInstance = $form.dxForm('instance');

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 90);

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 600);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');

            this.clock.tick();

            assert.strictEqual($tableElement.outerHeight(), 90, 'cell height is applied');
            assert.strictEqual($tableElement.outerWidth(), 600, 'cell width is applied');
        });

        test('show cell Form', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);
            // this.quillInstance.setSelection(50, 1);

            showCellPropertiesForm(this.instance, $tableElement);
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const $scrollView = $form.closest('.dx-scrollview');

            assert.strictEqual($form.length, 1);
            assert.ok($form.eq(0).is(':visible'));
            assert.ok($scrollView.length, 'Form should be in the ScrollView');
        });

        test('Check properties edititng at the cell Form (without dimensions)', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);

            // this.quillInstance.setSelection(50, 1);
            const $targetCell = $tableElement.find('td').eq(6);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');

            const formInstance = $form.dxForm('instance');

            const borderStyleEditor = formInstance.getEditor('borderStyle');
            borderStyleEditor.option('value', 'dotted');

            const borderWidthEditor = formInstance.getEditor('borderWidth');
            borderWidthEditor.option('value', '3px');

            const borderColorEditor = formInstance.$element().find('.dx-colorbox').eq(0).dxColorBox('instance');
            borderColorEditor.option('value', 'red');

            const backgroundColorEditor = formInstance.$element().find('.dx-colorbox').eq(1).dxColorBox('instance');
            backgroundColorEditor.option('value', 'green');

            const paddingEditor = formInstance.getEditor('padding');
            paddingEditor.option('value', '5px');

            const alignmentEditor = formInstance.$element().find('.dx-buttongroup').eq(0).dxButtonGroup('instance');
            alignmentEditor.option('selectedItemKeys', ['right']);

            const verticalAlignmentEditor = formInstance.$element().find('.dx-buttongroup').eq(1).dxButtonGroup('instance');
            verticalAlignmentEditor.option('selectedItemKeys', ['bottom']);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');

            this.clock.tick();

            assert.strictEqual($targetCell.css('borderStyle'), 'dotted', 'border style is applied');
            assert.strictEqual($targetCell.css('borderWidth'), '3px', 'border width is applied');
            assert.strictEqual($targetCell.css('borderColor'), 'rgb(255, 0, 0)', 'border color is applied');
            assert.strictEqual($targetCell.css('backgroundColor'), 'rgb(0, 128, 0)', 'background color is applied');
            assert.strictEqual($targetCell.css('padding'), '5px', 'padding is applied');
            assert.strictEqual($targetCell.css('textAlign'), 'right', 'text align is applied');
            assert.strictEqual($targetCell.css('verticalAlign'), 'bottom', 'vertical align is applied');
        });

        test('Check cell width and height editor min options', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(0);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const formInstance = $form.dxForm('instance');

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
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');

            const formInstance = $form.dxForm('instance');

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 80);

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 180);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

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
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const formInstance = $form.dxForm('instance');

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

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
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const formInstance = $form.dxForm('instance');

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

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
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const formInstance = $form.dxForm('instance');

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

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
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const formInstance = $form.dxForm('instance');

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

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
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const formInstance = $form.dxForm('instance');

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 250);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

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
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const formInstance = $form.dxForm('instance');

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 400);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

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
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const formInstance = $form.dxForm('instance');

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 700);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

            assert.roughEqual($targetCell.outerWidth(), 567, 1, 'cell width is applied');
            assert.strictEqual($targetCell.attr('width'), '700px', 'cell width attr is applied');
            assert.roughEqual($targetCell.next().outerWidth(), 32, 1, 'next cell width attr is correct');
            assert.strictEqual($targetCell.next().attr('width'), '0px', 'next cell width attr is correct');
            assert.roughEqual($tableElement.outerWidth(), 600, 2, 'table width is not changed');
        });

        test('Check cell width attributes if new value is more than the full table width and all columns has fixed width', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(0);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');
            const formInstance = $form.dxForm('instance');

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 700);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

            assert.roughEqual($targetCell.outerWidth(), 567, 1, 'cell width is applied');
            assert.strictEqual($targetCell.attr('width'), '700px', 'cell width attr is applied');
            assert.roughEqual($targetCell.next().outerWidth(), 32, 1, 'next cell width attr is correct');
            assert.strictEqual($targetCell.next().attr('width'), '0px', 'next cell width attr is correct');
            assert.roughEqual($tableElement.outerWidth(), 600, 2, 'table width is not changed');
        });

        test('Check cell width attributes if it is changed after the table width was changed (columns width is fixed)', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(500);
            let $form = $('.dx-form:not(.dx-formdialog-form)');

            let formInstance = $form.dxForm('instance');

            let widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 400);

            let $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

            const $targetCell = $tableElement.find('td').eq(0);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(500);
            $form = $('.dx-form:not(.dx-formdialog-form)');
            formInstance = $form.dxForm('instance');

            widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 150);

            $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

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
            this.clock.tick(500);
            let $form = $('.dx-form:not(.dx-formdialog-form)');

            let formInstance = $form.dxForm('instance');

            let widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 800);

            let $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

            const $targetCell = $tableElement.find('td').eq(0);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(500);
            $form = $('.dx-form:not(.dx-formdialog-form)');
            formInstance = $form.dxForm('instance');

            widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 110);

            $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);
            const $rowCells = $targetCell.closest('tr').find('td');

            assert.roughEqual($targetCell.outerWidth(), 110, 2, 'cell width is applied');
            assert.strictEqual($targetCell.attr('width'), '110px', 'cell width attr is applied');
            assert.roughEqual(parseInt($rowCells.eq(1).outerWidth()), 230, 2, 'second cell width attr is correct');
            // assert.roughEqual(parseInt($rowCells.eq(1).attr('width')), 230, 2, 'second cell width attr is correct');
            assert.roughEqual(parseInt($rowCells.eq(2).outerWidth()), 230, 2, 'third cell width attr is correct');
            // assert.roughEqual(parseInt($rowCells.eq(2).attr('width')), 230, 2, 'third cell width attr is correct');
            assert.roughEqual(parseInt($rowCells.eq(3).outerWidth()), 230, 2, 'fourth cell width attr is correct');
            // assert.roughEqual(parseInt($rowCells.eq(3).attr('width')), 230, 2, 'fourth cell width attr is correct');
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
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');

            const formInstance = $form.dxForm('instance');

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 80);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

            assert.strictEqual($targetCell.outerHeight(), 80, 'cell height is applied');
            assert.strictEqual($targetCell.attr('height'), '80px', 'cell height attribute is correct');

            assert.roughEqual(initialTableHeight + 80 - initialCellHeight, $tableElement.outerHeight(), 1), 'table height is changed as expected';
        });

        test('Check cell height edititng if all rows height is fixed nad new value is less than the minimum row content height', function(assert) {
            this.createWidget({ value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);
            const $targetCell = $tableElement.find('td').eq(2);

            showCellPropertiesForm(this.instance, $targetCell);
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');

            const formInstance = $form.dxForm('instance');

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 10);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

            assert.strictEqual($targetCell.outerHeight(), 24, 'cell height is applied');
            assert.strictEqual($targetCell.attr('height'), '10px', 'cell height attribute is correct');

            assert.roughEqual($tableElement.outerHeight(), 48, 2), 'table height is changed as expected';
        });

    });

    module('Table height calculations', {}, () => {
        test('Check cell height edititng if all rows height is fixed', function(assert) {
            this.createWidget({ value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');

            const formInstance = $form.dxForm('instance');

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 150);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

            const $verticalCells = $tableElement.find('td:nth-child(1)');

            assert.roughEqual($tableElement.outerHeight(), 150, 2, 'table height is changed as expected');
            assert.roughEqual($verticalCells.eq(0).outerHeight(), 50, 2, 'first row cell height is applied');
            assert.roughEqual(parseInt($verticalCells.eq(0).attr('height')), 50, 2, 'first row cell height attr is applied');
            assert.roughEqual(parseInt($verticalCells.eq(1).outerHeight()), 99, 2, 'second row cell height attr is applied');
            assert.roughEqual(parseInt($verticalCells.eq(1).attr('height')), 99, 2, 'second row cell height attr is applied');
        });

        test('Check cell height edititng if new value is less than the content', function(assert) {
            this.createWidget({ value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');

            const formInstance = $form.dxForm('instance');

            const heightEditor = formInstance.getEditor('height');
            heightEditor.option('value', 30);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

            const $verticalCells = $tableElement.find('td:nth-child(1)');

            assert.roughEqual($tableElement.outerHeight(), 48, 2, 'table height is changed as expected');
            assert.roughEqual($verticalCells.eq(0).outerHeight(), 24, 2, 'first row cell height is applied');
            assert.roughEqual(parseInt($verticalCells.eq(0).attr('height')), 10, 2, 'first row cell height attr is applied');
            assert.roughEqual(parseInt($verticalCells.eq(1).outerHeight()), 24, 2, 'second row cell height attr is applied');
            assert.roughEqual(parseInt($verticalCells.eq(1).attr('height')), 20, 2, 'second row cell height attr is applied');
        });
    });

    module('Table width calculations', {}, () => {
        test('Check cell width edititng if all columns height is fixed', function(assert) {
            this.createWidget({ width: 632, value: tableWithFixedDimensionsMarkup });

            const $tableElement = this.$element.find('table').eq(0);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');

            const formInstance = $form.dxForm('instance');

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 400);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

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
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');

            const formInstance = $form.dxForm('instance');

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 900);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

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
            this.clock.tick(500);
            const $form = $('.dx-form:not(.dx-formdialog-form)');

            const formInstance = $form.dxForm('instance');

            const widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 60);

            const $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

            const $horizontalCells = $tableElement.find('tr:eq(0) td');

            assert.roughEqual($tableElement.outerWidth(), 90, 2, 'table width is changed as expected');
            assert.roughEqual($horizontalCells.eq(0).outerWidth(), 60, 2, 'first column cell width is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(0).attr('width')), 30, 2, 'first column cell width attr is applied');
            assert.roughEqual(parseInt($horizontalCells.eq(1).outerWidth()), 30, 2, 'second column cell width attr is applied');
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
            this.clock.tick(500);
            let $form = $('.dx-form:not(.dx-formdialog-form)');

            let formInstance = $form.dxForm('instance');

            let widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 200);

            let $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(500);
            $form = $('.dx-form:not(.dx-formdialog-form)');
            formInstance = $form.dxForm('instance');

            widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 800);

            $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

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
            this.clock.tick(500);
            let $form = $('.dx-form:not(.dx-formdialog-form)');

            let formInstance = $form.dxForm('instance');

            let widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 200);

            let $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

            showTablePropertiesForm(this.instance, $tableElement);
            this.clock.tick(500);
            $form = $('.dx-form:not(.dx-formdialog-form)');
            formInstance = $form.dxForm('instance');

            widthEditor = formInstance.getEditor('width');
            widthEditor.option('value', 450);

            $okButton = $(formInstance.$element().find('.dx-button.dx-button-success'));
            $okButton.trigger('dxclick');
            this.clock.tick(500);

            assert.roughEqual($targetCell.outerWidth(), 150, 2, 'cell width is applied');
            assert.roughEqual(parseInt($targetCell.attr('width')), 150, 2, 'cell width attr is applied');
            assert.roughEqual($targetCell.next().outerWidth(), 300, 2, 'next cell width attr is correct');
            assert.strictEqual(parseInt($targetCell.next().attr('width')), 300, 'next cell width attr is not defined');
            assert.roughEqual($tableElement.outerWidth(), 450, 2, 'table width is correct');
        });
    });

});
