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
    test('show table Form', function(assert) {

        this.createWidget();

        const $tableElement = this.$element.find('table').eq(0);
        this.quillInstance.setSelection(50, 1);

        showTablePropertiesForm(this.instance, $tableElement);
        this.clock.tick(500);
        const $form = $('.dx-form:not(.dx-formdialog-form)');

        assert.strictEqual($form.length, 1);
        assert.ok($form.eq(0).is(':visible'));
    });

    test('show cell Form', function(assert) {
        this.createWidget();

        const $tableElement = this.$element.find('table').eq(0);
        this.quillInstance.setSelection(50, 1);

        showCellPropertiesForm(this.instance, $tableElement);
        this.clock.tick(500);
        const $form = $('.dx-form:not(.dx-formdialog-form)');

        assert.strictEqual($form.length, 1);
        assert.ok($form.eq(0).is(':visible'));
    });
});
