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
                'input1', 'input2', {
                    itemType: 'group',
                    colCount: 2,
                    visible: true,
                    items: ['input3', 'input4', {
                        itemType: 'group',
                        colCount: 1,
                        colSpan: 2,
                        visible: true,
                        items: ['input5']
                    },
                    {
                        itemType: 'group',
                        colCount: 1,
                        colSpan: 2,
                        visible: true,
                        items: [ 'input6' ]
                    },
                    {
                        itemType: 'group',
                        colCount: 2,
                        visible: true,
                        items: [ 'input6', {
                            itemType: 'group',
                            colCount: 2,
                            visible: true,
                            items: ['input8', 'input9']
                        } ]
                    },
                    {
                        itemType: 'group',
                        colCount: 2,
                        visible: true,
                        items: [ 'input10', 'input11' ]
                    }
                    ] },
                'input12']
        }]
    });

    const $items = $form.find('input');

    function getPadding(itemIndex1, itemIndex2) {
        const paddingY = $items.get(itemIndex1).getBoundingClientRect().y - $items.get(itemIndex2).getBoundingClientRect().y;
        const paddingX = $items.get(itemIndex1).getBoundingClientRect().x - ($items.get(itemIndex2).getBoundingClientRect().x + $items.get(itemIndex2).getBoundingClientRect().width);

        return { paddingX, paddingY };
    }

    const expectedPaddingY = getPadding(1, 0).paddingY;
    const expectedPaddingX = getPadding(3, 2).paddingX;

    $items.each(function(index, item) {
        if(index !== 0) {
            const padding = getPadding(index, index - 1);
            if(padding.paddingY !== 0) {
                assert.equal(padding.paddingY, expectedPaddingY, 'paddingY');
            } else {
                assert.equal(padding.paddingX, expectedPaddingX, 'paddingX');
            }
        }
    });
});
