import $ from 'jquery';
import 'ui/text_area';
import 'ui/autocomplete';
import 'ui/calendar';
import 'ui/date_box';
import 'ui/drop_down_box';
import 'ui/html_editor';
import 'ui/lookup';
import 'ui/radio_group';
import 'ui/tag_box';

import 'common.css!';
import 'material_blue_light.css!';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Form -> material theme');

QUnit.test('Form have correct padding (T849353)', function(assert) {
    const $form = $('#form').dxForm({
        colCount: 1,
        items: [ {
            itemType: 'group',
            caption: 'System Information',
            items: [
                'input1', {
                    itemType: 'group',
                    colCount: 4,
                    items: [{
                        itemType: 'group',
                        colSpan: 3,
                        items:
                            ['input2']
                    }, 'input3']
                }, {
                    itemType: 'group',
                    colCount: 2,
                    items: ['input4', 'input5', {
                        itemType: 'group',
                        colCount: 1,
                        colSpan: 2,
                        items: ['input6']
                    }, {
                        itemType: 'group',
                        colCount: 2,
                        items: [ 'input7', {
                            itemType: 'group',
                            colCount: 2,
                            items: ['input8', 'input9']
                        } ]
                    }, {
                        itemType: 'group',
                        colCount: 2,
                        items: [ 'input10', 'input11' ]
                    }] },
                'input12']
        }]
    });

    const $items = $form.find('input');

    function getPadding(itemIndex1, itemIndex2) {
        const item1Rect = $items.get(itemIndex1).getBoundingClientRect();
        const item2Rect = $items.get(itemIndex2).getBoundingClientRect();

        const paddingY = item1Rect.top - (item2Rect.top);
        const paddingX = item1Rect.left - (item2Rect.left + item2Rect.width);

        return { paddingX, paddingY };
    }

    const expectedPaddingY = getPadding(1, 0).paddingY;
    const expectedPaddingX = getPadding(4, 3).paddingX;

    $items.each(function(index, item) {
        if(index !== 0) {
            const padding = getPadding(index, index - 1);
            if(padding.paddingY !== 0) {
                assert.equal(padding.paddingY, expectedPaddingY, `paddingY between ${index - 1} and ${index} elements`);
            } else {
                assert.equal(padding.paddingX, expectedPaddingX, `paddingX between ${index - 1} and ${index} elements`);
            }
        }
    });
});

