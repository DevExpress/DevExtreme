import $ from 'jquery';
import browser from 'core/utils/browser';

import 'ui/form/ui.form';

import 'common.css!';
import 'material_blue_light.css!';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';
    $('#qunit-fixture').html(markup);
});

QUnit.module('Form scenarios', () => {
    function createForm(colCount, items) {
        const $form = $('#form').dxForm({
            width: 1000,
            screenByWidth: () => {
                return 'xs';
            },
            colCountByScreen: {
                xs: colCount
            },
            items
        });

        $form.find('*').css('font-family', 'Helvetica');

        return $form;
    }

    function checkPosition($container, $element, expected) {
        const elementRect = $element.get(0).getBoundingClientRect();

        const epsilon = 0.1;
        if($container != null) {
            const containerRect = $container.get(0).getBoundingClientRect();
            QUnit.assert.roughEqual(elementRect.top - containerRect.top, expected.top, epsilon, 'top element offset');
            QUnit.assert.roughEqual(elementRect.left - containerRect.left, expected.left, epsilon, 'left element offset');
        }

        QUnit.assert.roughEqual(elementRect.width, expected.width, epsilon, 'element width');
        QUnit.assert.roughEqual(elementRect.height, expected.height, epsilon, 'element height');
    }

    function testOrSkip(name, callback) {
        if(!browser.chrome) {
            return;
        }

        QUnit.test(name, callback);
    }

    testOrSkip('1 column -> [item1]', function(assert) {
        const $form = createForm(1, ['item1']);
        checkPosition(null, $form, { top: 0, left: 0, width: 1000, height: 75 });
        checkPosition($form, $form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
        checkPosition($form, $form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 31 });
    });

    function test_1Column_2ItemsLayout(items) {
        const $form = createForm(1, items);
        checkPosition($form, $form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
        checkPosition($form, $form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 31 });
        checkPosition($form, $form.find('[for$="item2"]'), { top: 85, left: 0, width: 1000, height: 34 });
        checkPosition($form, $form.find('[id$="item2"]'), { top: 119, left: 0, width: 1000, height: 31 });
    }

    testOrSkip('1 column -> [item1, item2]', function(assert) {
        test_1Column_2ItemsLayout(['item1', 'item2']);
    });

    testOrSkip('1 column -> [item1, { group [{ item2 }] ]', function(assert) {
        test_1Column_2ItemsLayout([
            'item1',
            { itemType: 'group', items: ['item2'] }]);
    });

    testOrSkip('1 column -> [item1, { group [{ group [{ item2 }] }] ]', function(assert) {
        test_1Column_2ItemsLayout([
            'item1',
            { itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] }
        ]);
    });

    function test_1Column_3ItemsLayout(items) {
        const $form = createForm(1, items);
        checkPosition(null, $form, { top: 0, left: 0, width: 1000, height: 245 });
        checkPosition($form, $form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
        checkPosition($form, $form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 31 });
        checkPosition($form, $form.find('[for$="item2"]'), { top: 85, left: 0, width: 1000, height: 34 });
        checkPosition($form, $form.find('[id$="item2"]'), { top: 119, left: 0, width: 1000, height: 31 });
        checkPosition($form, $form.find('[for$="item3"]'), { top: 170, left: 0, width: 1000, height: 34 });
        checkPosition($form, $form.find('[id$="item3"]'), { top: 204, left: 0, width: 1000, height: 31 });
    }

    testOrSkip('1 column -> [item1, item2, item3]', function(assert) {
        test_1Column_3ItemsLayout(['item1', 'item2', 'item3']);
    });

    testOrSkip('1 column -> [item1, { group [{ group [{ item2 }] }], item3]', function(assert) {
        test_1Column_3ItemsLayout([
            'item1',
            { itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] },
            'item3'
        ]);
    });

    testOrSkip('1 column -> [item1, { group [{ group [{ group [{item2 }] }] }], item3]', function(assert) {
        test_1Column_3ItemsLayout([
            'item1',
            { itemType: 'group', items: [{ itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] }] },
            'item3'
        ]);
    });

    testOrSkip('1 column -> [item1, { group [{ tabbed [{ item2 }] }] }]', function(assert) {
        const $form = createForm(1, [
            'item1',
            { itemType: 'group', caption: 'Contact Information',
                items: [ { itemType: 'tabbed',
                    tabPanelOptions: { deferRendering: false },
                    tabs: [ { title: 'item2', items: ['item2'] }]
                }]
            }]);
        checkPosition(null, $form, { top: 0, left: 0, width: 1000, height: 320 });
        checkPosition($form, $form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
        checkPosition($form, $form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 31 });
        checkPosition($form, $form.find('[for$="item2"]'), { top: 205, left: 20, width: 960, height: 34 });
        checkPosition($form, $form.find('[id$="item2"]'), { top: 239, left: 20, width: 960, height: 31 });
    });

    testOrSkip('1 column -> [item1, { group [{ tabbed [{ item2 }] }] }, item3]', function(assert) {
        const $form = createForm(1, [
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

        checkPosition(null, $form, { top: 0, left: 0, width: 1000, height: 405 });
        checkPosition($form, $form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
        checkPosition($form, $form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 31 });
        checkPosition($form, $form.find('[for$="item2"]'), { top: 205, left: 20, width: 960, height: 34 });
        checkPosition($form, $form.find('[id$="item2"]'), { top: 239, left: 20, width: 960, height: 31 });
        checkPosition($form, $form.find('[for$="item3"]'), { top: 330, left: 0, width: 1000, height: 34 });
        checkPosition($form, $form.find('[id$="item3"]'), { top: 364, left: 0, width: 1000, height: 31 });
    });

    function test_2Column_2ItemsLayout(items) {
        const $form = createForm(2, items);
        checkPosition(null, $form, { top: 0, left: 0, width: 1000, height: 75 });
        checkPosition($form, $form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
        checkPosition($form, $form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 31 });
        checkPosition($form, $form.find('[for$="item2"]'), { top: 0, left: 520, width: 480, height: 34 });
        checkPosition($form, $form.find('[id$="item2"]'), { top: 34, left: 520, width: 480, height: 31 });
    }

    testOrSkip('2 columns -> [item1, item2]', function(assert) {
        test_2Column_2ItemsLayout(['item1', 'item2']);
    });

    testOrSkip('2 columns -> [item1, { group [{ item2 }] }]', function(assert) {
        test_2Column_2ItemsLayout([
            'item1',
            { itemType: 'group', items: ['item2'] }
        ]);
    });

    testOrSkip('2 columns -> [item1, { group [{ group [{ item2 }] }] }]', function(assert) {
        test_2Column_2ItemsLayout([
            'item1',
            { itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] }
        ]);
    });

    testOrSkip('2 columns -> [{ group [{ item1 }], { group [{ item2 }]]', function(assert) {
        test_2Column_2ItemsLayout([
            { itemType: 'group', items: ['item1'] },
            { itemType: 'group', items: ['item2'] }
        ]);
    });

    testOrSkip('2 columns -> [{ group [{ { group [{ item1 }] }], { group [{ { group [{ item2 }] }]]', function(assert) {
        test_2Column_2ItemsLayout([
            { itemType: 'group', items: [{ itemType: 'group', items: ['item1'] }] },
            { itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] }
        ]);
    });

    function test_2Columns_3ItemsLayout(items) {
        const $form = createForm(2, items);
        checkPosition(null, $form, { top: 0, left: 0, width: 1000, height: 160 });
        checkPosition($form, $form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
        checkPosition($form, $form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 31 });
        checkPosition($form, $form.find('[for$="item2"]'), { top: 0, left: 520, width: 480, height: 34 });
        checkPosition($form, $form.find('[id$="item2"]'), { top: 34, left: 520, width: 480, height: 31 });
        checkPosition($form, $form.find('[for$="item3"]'), { top: 85, left: 0, width: 480, height: 34 });
        checkPosition($form, $form.find('[id$="item3"]'), { top: 119, left: 0, width: 480, height: 31 });
    }

    testOrSkip('2 columns -> [item1, { group [{ group [{ item2 }] }], item3]', function(assert) {
        test_2Columns_3ItemsLayout([
            'item1',
            { itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] },
            'item3'
        ]);
    });

    testOrSkip('2 columns -> [{ group [{ { group [{ item1 }] }], { group [{ { group [{ item2 }] }], { group [{ item3 }] }]', function(assert) {
        test_2Columns_3ItemsLayout([
            { itemType: 'group', items: [{ itemType: 'group', items: ['item1'] }] },
            { itemType: 'group', items: [{ itemType: 'group', items: ['item2'] }] },
            { itemType: 'group', colCount: 1, items: ['item3']
            }
        ]);
    });

    testOrSkip('2 columns -> [{ group [{ item1 }], { group [{ item2 }], { group colspan:3 [{ item3 }] ]', function(assert) {
        const $form = createForm(2, [
            { itemType: 'group', colSpan: 1, items: ['item1'] },
            { itemType: 'group', colSpan: 1, items: ['item2'] },
            { itemType: 'group', colSpan: 2, items: ['item3']
            }
        ]);

        checkPosition(null, $form, { top: 0, left: 0, width: 1000, height: 160 });
        checkPosition($form, $form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
        checkPosition($form, $form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 31 });
        checkPosition($form, $form.find('[for$="item2"]'), { top: 0, left: 520, width: 480, height: 34 });
        checkPosition($form, $form.find('[id$="item2"]'), { top: 34, left: 520, width: 480, height: 31 });
        checkPosition($form, $form.find('[for$="item3"]'), { top: 85, left: 0, width: 1000, height: 34 });
        checkPosition($form, $form.find('[id$="item3"]'), { top: 119, left: 0, width: 1000, height: 31 });
    });

    testOrSkip('2 column -> [item1, { group [{ tabbed [{ item2 }] }] }]', function(assert) {
        const $form = createForm(2, [
            'item1',
            { itemType: 'group', caption: 'Contact Information',
                items: [{
                    itemType: 'tabbed',
                    tabPanelOptions: { deferRendering: false },
                    tabs: [{ title: 'item2', items: ['item2'] }]
                }]
            }
        ]);

        checkPosition(null, $form, { top: 0, left: 0, width: 1000, height: 235 });
        checkPosition($form, $form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
        checkPosition($form, $form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 31 });
        checkPosition($form, $form.find('[for$="item2"]'), { top: 120, left: 540, width: 440, height: 34 });
        checkPosition($form, $form.find('[id$="item2"]'), { top: 154, left: 540, width: 440, height: 31 });
    });

    testOrSkip('2 column -> [item1, { group [{ tabbed [{ item2 }] }] }, item3]', function(assert) {
        const $form = createForm(2, [
            'item1',
            { itemType: 'group', caption: 'Contact Information',
                items: [{
                    itemType: 'tabbed',
                    tabPanelOptions: { deferRendering: false },
                    tabs: [{ title: 'item2', items: ['item2'] }]
                }]
            },
            'item3']);

        checkPosition(null, $form, { top: 0, left: 0, width: 1000, height: 320 });
        checkPosition($form, $form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
        checkPosition($form, $form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 31 });
        checkPosition($form, $form.find('[for$="item2"]'), { top: 120, left: 540, width: 440, height: 34 });
        checkPosition($form, $form.find('[id$="item2"]'), { top: 154, left: 540, width: 440, height: 31 });
        checkPosition($form, $form.find('[for$="item3"]'), { top: 245, left: 0, width: 480, height: 34 });
        checkPosition($form, $form.find('[id$="item3"]'), { top: 279, left: 0, width: 480, height: 31 });
    });

    testOrSkip('4 columns -> [{ group colSpan:3 [{ item1 }], { group colSpan:1 [{ item2 }], { group colspan:4 [{ item3 }] ]', function(assert) {
        const $form = createForm(4, [
            { itemType: 'group', colSpan: 3, items: ['item1'] },
            { itemType: 'group', colSpan: 1, items: ['item2'] },
            { itemType: 'group', colSpan: 4, items: ['item3'] }
        ]);

        checkPosition(null, $form, { top: 0, left: 0, width: 1000, height: 160 });
        checkPosition($form, $form.find('[for$="item1"]'), { top: 0, left: 0, width: 730, height: 34 });
        checkPosition($form, $form.find('[id$="item1"]'), { top: 34, left: 0, width: 730, height: 31 });
        checkPosition($form, $form.find('[for$="item2"]'), { top: 0, left: 770, width: 230, height: 34 });
        checkPosition($form, $form.find('[id$="item2"]'), { top: 34, left: 770, width: 230, height: 31 });
        checkPosition($form, $form.find('[for$="item3"]'), { top: 85, left: 0, width: 1000, height: 34 });
        checkPosition($form, $form.find('[id$="item3"]'), { top: 119, left: 0, width: 1000, height: 31 });
    });
});
