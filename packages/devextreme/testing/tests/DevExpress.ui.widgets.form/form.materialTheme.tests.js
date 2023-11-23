import $ from 'jquery';
import browser from 'core/utils/browser';

import 'ui/form/ui.form';

import 'material_blue_light.css!';
import FormLayoutTestWrapper from '../../helpers/FormLayoutTestWrapper.js';
import { FIELD_ITEM_CONTENT_WRAPPER_CLASS } from 'ui/form/components/field_item';

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
        wrapper.checkFormSize(1000, 91);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 1000, 47);
    });

    function test_1Column_2ItemsLayout(items) {
        const wrapper = new FormLayoutTestWrapper(1, {}, items);
        wrapper.checkFormSize(1000, 198);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 1000, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 101, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 141, 0, 1000, 47);
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
        wrapper.checkFormSize(1000, 303);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 1000, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 101, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 141, 0, 1000, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 209, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 245, 0, 1000, 47);
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
        wrapper.checkFormSize(1000, 359);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 1000, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 225, 20, 960, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 262, 20, 960, 47);
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

        wrapper.checkFormSize(1000, 464);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 1000, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 225, 20, 960, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 262, 20, 960, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 369, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 406, 0, 1000, 47);
    });

    function test_2Column_2ItemsLayout(items) {
        const wrapper = new FormLayoutTestWrapper(2, {}, items);
        wrapper.checkFormSize(1000, 91);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 480, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 0, 520, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 34, 520, 480, 47);
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
        wrapper.checkFormSize(1000, 198);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 480, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 0, 520, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 34, 520, 480, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 101, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 141, 0, 480, 47);
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

        wrapper.checkFormSize(1000, 198);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 480, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 0, 520, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 34, 520, 480, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 101, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 141, 0, 1000, 47);
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

        wrapper.checkFormSize(1000, 255);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 480, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 120, 540, 440, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 158, 540, 440, 47);
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

        wrapper.checkFormSize(1000, 359);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 480, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 120, 540, 440, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 158, 540, 440, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 265, 0, 480, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 302, 0, 480, 47);
    });

    testChromeOnly('4 columns -> [{ group colSpan:3 [{ item1 }], { group colSpan:1 [{ item2 }], { group colspan:4 [{ item3 }] ]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(4, {}, [
            { itemType: 'group', colSpan: 3, items: ['item1'] },
            { itemType: 'group', colSpan: 1, items: ['item2'] },
            { itemType: 'group', colSpan: 4, items: ['item3'] }
        ]);

        wrapper.checkFormSize(1000, 198);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 0, 0, 730, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 34, 0, 730, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 0, 770, 230, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 34, 770, 230, 47);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 101, 0, 1000, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 142, 0, 1000, 47);
    });
});

QUnit.module('Left label location scenarios', () => {
    testChromeOnly('1 column -> [item1]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(1, { labelLocation: 'left' }, ['item1']);
        wrapper.checkFormSize(1000, 57);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 18, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 951, 47);
    });

    testChromeOnly('1 column -> [item1, item2, item3]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(1, { labelLocation: 'left' }, ['item1', 'item2', 'item3']);
        wrapper.checkFormSize(1000, 223);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 18, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 951, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 101, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 83, 49, 951, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 184, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 166, 49, 951, 47);
    });

    testChromeOnly('1 column -> [item1, { group [item2, item3] ]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(1, { labelLocation: 'left' }, [
            'item1',
            { itemType: 'group', items: ['item2', 'item3'] }
        ]);
        wrapper.checkFormSize(1000, 207);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 18, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 951, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 85, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 67, 49, 951, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="item3"]'), 168, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item3"]'), 150, 49, 951, 47);
    });

    testChromeOnly('1 column -> [item1, i2, { group [longText] }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(1, { labelLocation: 'left' }, ['item1', 'i2', { itemType: 'group', items: ['longText'] } ]);
        wrapper.checkFormSize(1000, 207);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 18, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 951, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 101, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 83, 49, 951, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 168, 0, 71, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 150, 71, 929, 47);
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
        wrapper.checkFormSize(1000, 284);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 18, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 951, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="item2"]'), 205, 20, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item2"]'), 187, 69, 911, 47);
    });

    testChromeOnly('2 columns -> [item1, i2 }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(2, { labelLocation: 'left' },
            ['item1', 'i2']);
        wrapper.checkFormSize(1000, 57);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 18, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 431, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 18, 520, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 0, 542, 458, 47);
    });

    testChromeOnly('2 columns -> [item1, { group [{ longText }] }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(2, { labelLocation: 'left' },
            ['item1', { itemType: 'group', items: ['longText'] }]);
        wrapper.checkFormSize(1000, 57);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 18, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 431, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 18, 520, 71, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 0, 591, 409, 47);
    });

    testChromeOnly('2 columns -> [item1, i2, { group. colCont:2 colSpan:2, [{ longText1, longText2 }] }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(2, { labelLocation: 'left' },
            ['item1', 'i2', { itemType: 'group', colSpan: 2, colCount: 2, items: ['longText1', 'longText2'] }]);
        wrapper.checkFormSize(1000, 124);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 18, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 431, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 18, 520, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 0, 542, 458, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText1"]'), 85, 0, 82, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText1"]'), 67, 82, 398, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText2"]'), 85, 520, 82, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText2"]'), 67, 602, 398, 47);
    });

    testChromeOnly('2 columns -> [item1, i2, i3, item4, { group. colCont:2 colSpan:2, [{ longText1, longText2 }] }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(2, { labelLocation: 'left' },
            ['item1', 'i2', 'i3', 'item4', { itemType: 'group', colSpan: 2, colCount: 2, items: ['longText1', 'longText2'] }]);
        wrapper.checkFormSize(1000, 207);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 18, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 431, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 18, 520, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 0, 569, 431, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i3"]'), 101, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i3"]'), 83, 49, 431, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="item4"]'), 101, 520, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item4"]'), 83, 569, 431, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText1"]'), 168, 0, 82, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText1"]'), 150, 82, 398, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText2"]'), 168, 520, 82, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText2"]'), 150, 602, 398, 47);
    });

    testChromeOnly('3 columns -> [item1, i2.colSpan2]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(3, { labelLocation: 'left' },
            ['item1', { dataField: 'i2', colSpan: 2 }]);
        wrapper.checkFormSize(1000, 57);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 18, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 264, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 18, 354, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 0, 375, 624, 47);
    });

    testChromeOnly('3 columns -> [item1, i2.colSpan2, i3, i4, item5]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(3, { labelLocation: 'left' },
            ['item1', { dataField: 'i2', colSpan: 2 }, 'i3', 'i4', 'i5']);
        wrapper.checkFormSize(1000, 140);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 18, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 264, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 18, 354, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 0, 375, 624, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i3"]'), 101, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i3"]'), 83, 49, 264, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i4"]'), 101, 354, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i4"]'), 83, 375, 271, 47);
    });

    testChromeOnly('3 columns -> [item1, i2.colSpan2, i3, i4, item5, { group. colSpan:3 items: [longText] }]', function(assert) {
        const wrapper = new FormLayoutTestWrapper(3, { labelLocation: 'left' },
            ['item1', { dataField: 'i2', colSpan: 2 }, 'i3', 'i4', 'i5', { itemType: 'group', colSpan: 3, colCount: 1, items: ['longText'] }]);
        wrapper.checkFormSize(1000, 207);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="item1"]'), 18, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="item1"]'), 0, 49, 264, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i2"]'), 18, 354, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i2"]'), 0, 375, 624, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i3"]'), 101, 0, 49, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i3"]'), 83, 49, 264, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="i4"]'), 101, 354, 22, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="i4"]'), 83, 375, 271, 47);

        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 168, 0, 71, 15);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 150, 71, 929, 47);
    });
});

QUnit.module('dx-invalid class on dx-field-item-content-wrapper (T949285)', {
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

    QUnit.testInActiveWindow('dx-invalid class is added for invalid focused editor (async template) (T1107088)', function(assert) {
        let $editorElement;
        const form = $('#form').dxForm({
            formData,
            items: [
                {
                    dataField: 'field1',
                    helpText: 'help',
                    template: 'itemTemplate'
                }
            ],
            templatesRenderAsynchronously: true,
            integrationOptions: {
                templates: {
                    itemTemplate: {
                        render({ container, onRendered }) {

                            $editorElement = $('<div>').appendTo(container);

                            setTimeout(() => {
                                $editorElement.dxTextBox({}).dxValidator({
                                    validationRules: [{
                                        type: 'required',
                                        message: 'LastName is required'
                                    }]
                                });

                                $editorElement.dxValidator('instance').validate();
                                onRendered();
                            });
                        }
                    }
                }
            },
        }).dxForm('instance');

        const $itemContentWrapper = $editorElement.closest(`.${FIELD_ITEM_CONTENT_WRAPPER_CLASS}`);

        assert.strictEqual($itemContentWrapper.hasClass(invalidClass), false);
        this.clock.tick();

        form.validate();
        $editorElement.dxTextBox('instance').focus();
        assert.strictEqual($itemContentWrapper.hasClass(invalidClass), true);

        $editorElement.dxTextBox('instance').blur();
        assert.strictEqual($itemContentWrapper.hasClass(invalidClass), false);
    });

    QUnit.testInActiveWindow('dx-invalid class is added for invalid focused editor (async template) with dx-template-wrapper class (T1107088)', function(assert) {
        let $editorElement;
        const form = $('#form').dxForm({
            formData,
            items: [
                {
                    dataField: 'field1',
                    helpText: 'help',
                    template: 'itemTemplate'
                }
            ],
            templatesRenderAsynchronously: true,
            integrationOptions: {
                templates: {
                    itemTemplate: {
                        render({ container, onRendered }) {
                            $editorElement = $('<div>')
                                .addClass('dx-template-wrapper')
                                .appendTo(container);

                            setTimeout(() => {
                                $editorElement.dxTextBox({}).dxValidator({
                                    validationRules: [{
                                        type: 'required',
                                        message: 'LastName is required'
                                    }]
                                });

                                $editorElement.dxValidator('instance').validate();
                                onRendered();
                            });
                        }
                    }
                }
            },
        }).dxForm('instance');

        const $itemContentWrapper = $editorElement.closest(`.${FIELD_ITEM_CONTENT_WRAPPER_CLASS}`);

        assert.strictEqual($itemContentWrapper.hasClass(invalidClass), false);
        this.clock.tick();

        form.validate();
        $editorElement.dxTextBox('instance').focus();
        assert.strictEqual($itemContentWrapper.hasClass(invalidClass), true);

        $editorElement.dxTextBox('instance').blur();
        assert.strictEqual($itemContentWrapper.hasClass(invalidClass), false);
    });

    QUnit.testInActiveWindow('dx-invalid class is added for invalid editor if validationMessageMode: "always" (T1026923)', function(assert) {
        const formInstance = $('#form').dxForm({
            formData,
            customizeItem: function(item) {
                if(item.itemType === 'simple') {
                    item.editorOptions = { ...item.editorOptions, validationMessageMode: 'always' };
                }
            },
            items: [{
                dataField: 'field1',
                helpText: 'help',
                isRequired: true
            }]
        }).dxForm('instance');

        formInstance.validate();

        const editorInstance = formInstance.getEditor('field1');
        const wrapper = $(editorInstance.element()).closest(`.${FIELD_ITEM_CONTENT_WRAPPER_CLASS}`);

        assert.ok(wrapper.hasClass(invalidClass));
    });
});
