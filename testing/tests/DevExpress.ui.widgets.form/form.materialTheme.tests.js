import $ from 'jquery';
import browser from 'core/utils/browser';

import 'ui/form/ui.form';

import 'common.css!';
import 'material_blue_light.css!';
import FormLayoutTestWrapper from '../../helpers/FormLayoutTestWrapper.js';
import { FIELD_ITEM_CONTENT_WRAPPER_CLASS } from 'ui/form/constants';

function testChromeOnly(name, callback) {
    if(!browser.chrome) {
        return;
    }

    QUnit.test(name, callback);
}

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';
    $('#qunit-fixture').html(markup);
});

QUnit.module('Form scenarios', () => {
    testChromeOnly('1 column -> [item1]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(1, {}, ['item1']);
        wrapper.checkFormSize(1000, 75);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 1000, 31);
    });

    function test_1Column_2ItemsLayout(items) {
        const wrapper = new FormLayoutTestWrapper(1, {}, items);
        wrapper.checkFormSize(1000, 160);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 1000, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 85, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 119, 0, 1000, 31);
    }

    testChromeOnly('1 column -> [item1, item2]', function(assert) {
        test_1Column_2ItemsLayout(['item1', 'item2']);
    });

    testChromeOnly('1 column -> [item1, { group [{ item2 }] ]', function(assert) {
        test_1Column_2ItemsLayout([
            'item1',
            { itemType: 'group', items: ['item2'] }]);
    });

    testChromeOnly('1 column -> [item1, { group [{ group [{ item2 }] }] ]', function(assert) {
        test_1Column_2ItemsLayout([
            'item1',
            { itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] }
        ]);
    });

    function test_1Column_3ItemsLayout(items) {
        const wrapper = new FormLayoutTestWrapper(1, {}, items);
        wrapper.checkFormSize(1000, 245);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 1000, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 85, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 119, 0, 1000, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 170, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 204, 0, 1000, 31);
    }

    testChromeOnly('1 column -> [item1, item2, item3]', function(assert) {
        test_1Column_3ItemsLayout(['item1', 'item2', 'item3']);
    });

    testChromeOnly('1 column -> [item1, { group [{ group [{ item2 }] }], item3]', function(assert) {
        test_1Column_3ItemsLayout([
            'item1',
            { itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] },
            'item3'
        ]);
    });

    testChromeOnly('1 column -> [item1, { group [{ group [{ group [{item2 }] }] }], item3]', function(assert) {
        test_1Column_3ItemsLayout([
            'item1',
            { itemType: 'group', items: [{ itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] }] },
            'item3'
        ]);
    });

    testChromeOnly('1 column -> [item1, { group [{ tabbed [{ item2 }] }] }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(1, {}, [
            'item1',
            { itemType: 'group', caption: 'Contact Information',
                items: [ { itemType: 'tabbed',
                    tabPanelOptions: { deferRendering: false },
                    tabs: [ { title: 'item2', items: ['item2'] }]
                }]
            }]);
        wrapper.checkFormSize(1000, 320);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 1000, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 205, 20, 960, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 239, 20, 960, 31);
    });

    testChromeOnly('1 column -> [item1, { group [{ tabbed [{ item2 }] }] }, item3]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(1, {}, [
            'item1',
            {
                itemType: 'group',
                caption: 'Contact Information',
                items: [
                    {
                        itemType: 'tabbed',
                        tabPanelOptions: { deferRendering: false },
                        tabs: [
                            {
                                title: 'item2',
                                items: ['item2']
                            }]
                    }]
            },
            'item3']);

        wrapper.checkFormSize(1000, 405);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 1000, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 205, 20, 960, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 239, 20, 960, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 330, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 364, 0, 1000, 31);
    });

    function test_2Column_2ItemsLayout(items) {
        const wrapper = new FormLayoutTestWrapper(2, {}, items);
        wrapper.checkFormSize(1000, 75);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 480, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 0, 520, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 34, 520, 480, 31);
    }

    testChromeOnly('2 columns -> [item1, item2]', function(assert) {
        test_2Column_2ItemsLayout(['item1', 'item2']);
    });

    testChromeOnly('2 columns -> [item1, { group [{ item2 }] }]', function(assert) {
        test_2Column_2ItemsLayout([
            'item1',
            { itemType: 'group', items: ['item2'] }
        ]);
    });

    testChromeOnly('2 columns -> [item1, { group [{ group [{ item2 }] }] }]', function(assert) {
        test_2Column_2ItemsLayout([
            'item1',
            { itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] }
        ]);
    });

    testChromeOnly('2 columns -> [{ group [{ item1 }], { group [{ item2 }]]', function(assert) {
        test_2Column_2ItemsLayout([
            { itemType: 'group', items: ['item1'] },
            { itemType: 'group', items: ['item2'] }
        ]);
    });

    testChromeOnly('2 columns -> [{ group [{ { group [{ item1 }] }], { group [{ { group [{ item2 }] }]]', function(assert) {
        test_2Column_2ItemsLayout([
            { itemType: 'group', items: [{ itemType: 'group', items: ['item1'] }] },
            { itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] }
        ]);
    });

    function test_2Columns_3ItemsLayout(items) {
        const wrapper = new FormLayoutTestWrapper(2, {}, items);
        wrapper.checkFormSize(1000, 160);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 480, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 0, 520, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 34, 520, 480, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 85, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 119, 0, 480, 31);
    }

    testChromeOnly('2 columns -> [item1, { group [{ group [{ item2 }] }], item3]', function(assert) {
        test_2Columns_3ItemsLayout([
            'item1',
            { itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] },
            'item3'
        ]);
    });

    testChromeOnly('2 columns -> [{ group [{ { group [{ item1 }] }], { group [{ { group [{ item2 }] }], { group [{ item3 }] }]', function(assert) {
        test_2Columns_3ItemsLayout([
            { itemType: 'group', items: [{ itemType: 'group', items: ['item1'] }] },
            { itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] },
            { itemType: 'group', colCount: 1, items: ['item3']
            }
        ]);
    });

    testChromeOnly('2 columns -> [{ group [{ item1 }], { group [{ item2 }], { group colspan:3 [{ item3 }] ]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(2, {}, [
            { itemType: 'group', colSpan: 1, items: ['item1'] },
            { itemType: 'group', colSpan: 1, items: ['item2'] },
            { itemType: 'group', colSpan: 2, items: ['item3']
            }
        ]);

        wrapper.checkFormSize(1000, 160);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 480, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 0, 520, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 34, 520, 480, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 85, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 119, 0, 1000, 31);
    });

    testChromeOnly('2 column -> [item1, { group [{ tabbed [{ item2 }] }] }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(2, {}, [
            'item1',
            { itemType: 'group', caption: 'Contact Information',
                items: [{
                    itemType: 'tabbed',
                    tabPanelOptions: { deferRendering: false },
                    tabs: [{ title: 'item2', items: ['item2'] }]
                }]
            }
        ]);

        wrapper.checkFormSize(1000, 235);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 480, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 120, 540, 440, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 154, 540, 440, 31);
    });

    testChromeOnly('2 column -> [item1, { group [{ tabbed [{ item2 }] }] }, item3]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(2, {}, [
            'item1',
            { itemType: 'group', caption: 'Contact Information',
                items: [{
                    itemType: 'tabbed',
                    tabPanelOptions: { deferRendering: false },
                    tabs: [{ title: 'item2', items: ['item2'] }]
                }]
            },
            'item3']);

        wrapper.checkFormSize(1000, 320);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 480, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 120, 540, 440, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 154, 540, 440, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 245, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 279, 0, 480, 31);
    });

    testChromeOnly('4 columns -> [{ group colSpan:3 [{ item1 }], { group colSpan:1 [{ item2 }], { group colspan:4 [{ item3 }] ]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(4, {}, [
            { itemType: 'group', colSpan: 3, items: ['item1'] },
            { itemType: 'group', colSpan: 1, items: ['item2'] },
            { itemType: 'group', colSpan: 4, items: ['item3'] }
        ]);

        wrapper.checkFormSize(1000, 160);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 730, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 730, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 0, 770, 230, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 34, 770, 230, 31);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 85, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 119, 0, 1000, 31);
    });
});

QUnit.module('Left label location scenarios', () => {
    testChromeOnly('1 column -> [item1]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(1, { labelLocation: 'left' }, ['item1']);
        wrapper.checkFormSize(1000, 41);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 10, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 951, 31);
    });

    testChromeOnly('1 column -> [item1, item2, item3]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(1, { labelLocation: 'left' }, ['item1', 'item2', 'item3']);
        wrapper.checkFormSize(1000, 175);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 10, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 951, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 77, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 67, 49, 951, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 144, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 134, 49, 951, 31);
    });

    testChromeOnly('1 column -> [item1, { group [item2, item3] ]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(1, { labelLocation: 'left' }, [
            'item1',
            { itemType: 'group', items: ['item2', 'item3'] }
        ]);
        wrapper.checkFormSize(1000, 159);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 10, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 951, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 61, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 51, 49, 951, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 128, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 118, 49, 951, 31);
    });

    testChromeOnly('1 column -> [item1, i2, { group [longText] }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(1, { labelLocation: 'left' }, ['item1', 'i2', { itemType: 'group', items: ['longText'] } ]);
        wrapper.checkFormSize(1000, 159);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 10, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 951, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 77, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 67, 49, 951, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 128, 0, 70, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 118, 70, 930, 31);
    });

    testChromeOnly('1 column -> [item1, { group [{ tabbed [{ item2 }] }] }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(1, { labelLocation: 'left' }, [
            'item1',
            {
                itemType: 'group',
                caption: 'Contact Information',
                items: [ { itemType: 'tabbed',
                    tabPanelOptions: { deferRendering: false },
                    tabs: [ { title: 'item2', items: ['item2'] }]
                }]
            }
        ]);
        wrapper.checkFormSize(1000, 252);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 10, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 951, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 181, 20, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 171, 69, 911, 31);
    });

    testChromeOnly('2 columns -> [item1, i2 }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(2, { labelLocation: 'left' },
            ['item1', 'i2']);
        wrapper.checkFormSize(1000, 41);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 10, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 431, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 10, 520, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 0, 542, 458, 31);
    });

    testChromeOnly('2 columns -> [item1, { group [{ longText }] }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(2, { labelLocation: 'left' },
            ['item1', { itemType: 'group', items: ['longText'] }]);
        wrapper.checkFormSize(1000, 41);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 10, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 431, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 10, 520, 71, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 0, 591, 409, 31);
    });

    testChromeOnly('2 columns -> [item1, i2, { group. colCont:2 colSpan:2, [{ longText1, longText2 }] }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(2, { labelLocation: 'left' },
            ['item1', 'i2', { itemType: 'group', colSpan: 2, colCount: 2, items: ['longText1', 'longText2'] }]);
        wrapper.checkFormSize(1000, 92);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 10, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 431, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 10, 520, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 0, 542, 458, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText1"]'), 60, 0, 82, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText2"]'), 51, 602, 398, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText1"]'), 60, 0, 82, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText2"]'), 51, 602, 398, 31);
    });

    testChromeOnly('2 columns -> [item1, i2, i3, item4, { group. colCont:2 colSpan:2, [{ longText1, longText2 }] }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(2, { labelLocation: 'left' },
            ['item1', 'i2', 'i3', 'item4', { itemType: 'group', colSpan: 2, colCount: 2, items: ['longText1', 'longText2'] }]);
        wrapper.checkFormSize(1000, 159);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 10, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 431, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 10, 520, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 0, 569, 431, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i3"]'), 77, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i3"]'), 67, 49, 431, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="item4"]'), 77, 520, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item4"]'), 67, 569, 431, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText1"]'), 128, 0, 82, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText2"]'), 118, 602, 398, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText1"]'), 128, 0, 82, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText2"]'), 118, 602, 398, 31);
    });

    testChromeOnly('3 columns -> [item1, i2.colSpan2]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(3, { labelLocation: 'left' },
            ['item1', { dataField: 'i2', colSpan: 2 }]);
        wrapper.checkFormSize(1000, 41);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 10, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 264, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 10, 354, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 0, 376, 624, 31);
    });

    testChromeOnly('3 columns -> [item1, i2.colSpan2, i3, i4, item5]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(3, { labelLocation: 'left' },
            ['item1', { dataField: 'i2', colSpan: 2 }, 'i3', 'i4', 'i5']);
        wrapper.checkFormSize(1000, 108);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 10, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 264, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 10, 354, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 0, 376, 624, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i3"]'), 77, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i3"]'), 67, 49, 264, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i4"]'), 77, 354, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i4"]'), 67, 376, 270, 31);
    });

    testChromeOnly('3 columns -> [item1, i2.colSpan2, i3, i4, item5, { group. colSpan:3 items: [longText] }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(3, { labelLocation: 'left' },
            ['item1', { dataField: 'i2', colSpan: 2 }, 'i3', 'i4', 'i5', { itemType: 'group', colSpan: 3, colCount: 1, items: ['longText'] }]);
        wrapper.checkFormSize(1000, 159);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 10, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 264, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 10, 354, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 0, 376, 624, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i3"]'), 77, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i3"]'), 67, 49, 264, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i4"]'), 77, 354, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i4"]'), 67, 376, 270, 31);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 128, 0, 71, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 118, 71, 929, 31);
    });
});

QUnit.module('dx-invalid class on dx-field-item-content-wrapper (T949269)', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, function() {
    const invalidClass = 'dx-invalid';
    const formData = {
        field1: ''
    };

    QUnit.testInActiveWindow('dx-invalid class is added for invalid focused editor (simple item)', function(assert) {
        const formInstance = $('#form').dxForm({
            formData,
            items: [{
                dataField: 'field1',
                helpText: 'help',
                isRequired: true
            }]
        }).dxForm('instance');

        formInstance.validate();

        const editorInstance = formInstance.getEditor('field1');
        const wrapper = $(editorInstance.element()).closest(`.${FIELD_ITEM_CONTENT_WRAPPER_CLASS}`);

        assert.notOk(wrapper.hasClass(invalidClass));
        editorInstance.focus();
        this.clock.tick();
        assert.ok(wrapper.hasClass(invalidClass));
    });

    QUnit.testInActiveWindow('dx-invalid class is added for invalid focused editor (template)', function(assert) {
        let editorElement;
        $('#form').dxForm({
            validationGroup: 'formGroup',
            formData,
            items: [
                {
                    dataField: 'field1',
                    helpText: 'help',
                    template: function(data, itemElement) {
                        editorElement = $('<div>').dxTextBox({
                            value: ''
                        }).dxValidator({
                            validationGroup: 'formGroup',
                            validationRules: [{
                                type: 'required',
                                message: 'LastName is required'
                            }]
                        }).appendTo(itemElement);
                    }
                }
            ]
        })
            .dxForm('instance')
            .validate();

        const wrapper = $(editorElement).closest(`.${FIELD_ITEM_CONTENT_WRAPPER_CLASS}`);

        assert.notOk(wrapper.hasClass(invalidClass));
        $(editorElement).dxTextBox('instance').focus();
        this.clock.tick();
        assert.ok(wrapper.hasClass(invalidClass));
    });
});
