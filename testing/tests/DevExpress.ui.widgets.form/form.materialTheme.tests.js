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

['xs', 'sm', 'md', 'lg'].forEach(screenSize => {
    QUnit.test(`Form have correct padding (T849353) -> ScreenSize: '${screenSize}'`, function(assert) {
        const $form = $('#form').dxForm({
            colCount: 1,
            screenByWidth: () => { return screenSize; },
            items: [ {
                itemType: 'group',
                caption: 'System Information',
                items: [
                    'dataField1', {
                        itemType: 'group',
                        colCount: 4,
                        items: [{
                            itemType: 'group',
                            colSpan: 3,
                            items:
                                ['dataField2']
                        }, 'dataField3']
                    }, {
                        itemType: 'group',
                        colCount: 2,
                        items: ['dataField4', 'dataField5', {
                            itemType: 'group',
                            colCount: 1,
                            colSpan: 2,
                            items: ['dataField6']
                        }, {
                            itemType: 'group',
                            colCount: 2,
                            items: [ 'dataField7', {
                                itemType: 'group',
                                colCount: 2,
                                items: ['dataField8', 'dataField9']
                            } ]
                        }, {
                            itemType: 'group',
                            colCount: 2,
                            items: [ 'dataField10', 'dataField11' ]
                        }] },
                    'dataField12']
            }]
        });

        const $items = $form.find('input');

        function getPadding(itemIndex1, itemIndex2) {
            const item1Rect = $items.get(itemIndex1).getBoundingClientRect();
            const item2Rect = $items.get(itemIndex2).getBoundingClientRect();

            const paddingY = item1Rect.top - item2Rect.top;
            const paddingX = item1Rect.left - item2Rect.right;

            return { paddingX, paddingY, isSameRow: item1Rect.top === item2Rect.top };
        }

        const expectedPaddingY = getPadding(1, 0).paddingY;
        const expectedPaddingX = getPadding(4, 3).paddingX;

        $items.each(function(index, item) {
            if(index !== 0) {
                const padding = getPadding(index, index - 1);
                if(padding.isSameRow) {
                    assert.equal(padding.paddingX, expectedPaddingX, `paddingX between ${index - 1} and ${index} elements`);
                } else {
                    assert.equal(padding.paddingY, expectedPaddingY, `paddingY between ${index - 1} and ${index} elements`);
                }
            }
        });
    });
});

