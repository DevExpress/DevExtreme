import $ from 'jquery';
import 'ui/form/ui.form';

import 'common.css!';
import 'material_blue_light.css!';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';

    $('#qunit-fixture').html(markup);
});

['xs', 'sm', 'md', 'lg'].forEach(screenSize => {
    const DEFAULT_PADDING_X = 40;
    const DEFAULT_PADDING_Y = 86;
    QUnit.module(`Form have correct padding (T849353), screen size: ${screenSize}`);

    function getPadding($items, itemIndex1, itemIndex2) {
        const item1Rect = $items.get(itemIndex1).getBoundingClientRect();
        const item2Rect = $items.get(itemIndex2).getBoundingClientRect();

        const paddingY = item2Rect.top - item1Rect.top;
        const paddingLeft = item2Rect.left - item1Rect.left;
        const paddingRight = item2Rect.left - item1Rect.right;

        return { paddingY, paddingLeft, paddingRight };
    }

    QUnit.test('1 column -> 2 items without groups', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 1,
            items: ['dataField1', 'dataField2']
        });
        const $items = $form.find('input');
        const actualPadding = getPadding($items, 0, 1);

        assert.equal(actualPadding.paddingLeft, 0);
        assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
    });

    QUnit.test('1 column -> 1 item and 1 group', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 1,
            items: ['dataField1', { itemType: 'group',
                items: ['dataField2' ]
            }]
        });
        const $items = $form.find('input');
        const actualPadding = getPadding($items, 0, 1);

        assert.equal(actualPadding.paddingLeft, 0);
        assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
    });

    QUnit.test('1 column -> 1 item and 1 group with nested group', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 1,
            items: ['dataField1', { itemType: 'group',
                items: [ { itemType: 'group',
                    items: ['dataField2' ]
                } ]
            }]
        });
        const $items = $form.find('input');
        const actualPadding = getPadding($items, 0, 1);

        assert.equal(actualPadding.paddingLeft, 0);
        assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
    });

    QUnit.test('1 column -> 2 item and 1 group with nested group', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 1,
            items: ['dataField1', { itemType: 'group',
                items: [ { itemType: 'group',
                    items: ['dataField2' ]
                } ]
            }, 'dataField3' ]
        });
        const $items = $form.find('input');
        const actualPadding = getPadding($items, 1, 2);

        assert.equal(actualPadding.paddingLeft, 0);
        assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
    });

    QUnit.test('1 column -> 2 item and 1 group with sub-nested group', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 1,
            items: ['dataField1', { itemType: 'group',
                items: [ { itemType: 'group',
                    items: [{ itemType: 'group',
                        items: ['dataField2' ]
                    } ]
                } ]
            }, 'dataField3' ]
        });
        const $items = $form.find('input');
        const actualPadding = getPadding($items, 1, 2);

        assert.equal(actualPadding.paddingLeft, 0);
        assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
    });

    QUnit.test('2 columns -> 2 items without groups', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 2,
            items: ['dataField1', 'dataField2']
        });
        const $items = $form.find('input');
        const actualPadding = getPadding($items, 0, 1);

        if(screenSize === 'xs') {
            assert.equal(actualPadding.paddingLeft, 0);
            assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
        } else {
            assert.equal(actualPadding.paddingRight, DEFAULT_PADDING_X);
            assert.equal(actualPadding.paddingY, 0);
        }
    });

    QUnit.test('2 columns -> 1 item and 1 group', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 2,
            items: ['dataField1', { itemType: 'group',
                items: ['dataField2' ]
            }]
        });
        const $items = $form.find('input');
        const actualPadding = getPadding($items, 0, 1);

        if(screenSize === 'xs') {
            assert.equal(actualPadding.paddingLeft, 0);
            assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
        } else {
            assert.equal(actualPadding.paddingRight, DEFAULT_PADDING_X);
            assert.equal(actualPadding.paddingY, 0);
        }
    });

    QUnit.test('2 columns -> 1 item and 1 group with nested group', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 2,
            items: ['dataField1', { itemType: 'group',
                items: [ { itemType: 'group',
                    items: ['dataField2' ]
                } ]
            }]
        });
        const $items = $form.find('input');
        const actualPadding = getPadding($items, 0, 1);

        if(screenSize === 'xs') {
            assert.equal(actualPadding.paddingLeft, 0);
            assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
        } else {
            assert.equal(actualPadding.paddingRight, DEFAULT_PADDING_X);
            assert.equal(actualPadding.paddingY, 0);
        }
    });


    QUnit.test('2 columns -> 2 groups', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 2,
            items: [{ itemType: 'group',
                items: ['dataField1' ]
            }, { itemType: 'group',
                items: ['dataField2' ]
            }]
        });
        const $items = $form.find('input');
        const actualPadding = getPadding($items, 0, 1);

        if(screenSize === 'xs') {
            assert.equal(actualPadding.paddingLeft, 0);
            assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
        } else {
            assert.equal(actualPadding.paddingRight, DEFAULT_PADDING_X);
            assert.equal(actualPadding.paddingY, 0);
        }
    });

    QUnit.test('2 columns -> 2 groups with nested groups', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 2,
            items: [{ itemType: 'group',
                items: [ { itemType: 'group',
                    items: ['dataField1' ]
                } ]
            }, { itemType: 'group',
                items: [ { itemType: 'group',
                    items: ['dataField2' ]
                } ]
            }]
        });
        const $items = $form.find('input');
        const actualPadding = getPadding($items, 0, 1);

        if(screenSize === 'xs') {
            assert.equal(actualPadding.paddingLeft, 0);
            assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
        } else {
            assert.equal(actualPadding.paddingRight, DEFAULT_PADDING_X);
            assert.equal(actualPadding.paddingY, 0);
        }
    });

    QUnit.test('2 columns -> 2 item and 1 group with nested group', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 2,
            items: ['dataField1', { itemType: 'group',
                items: [ { itemType: 'group',
                    items: ['dataField2' ]
                } ]
            }, 'dataField3']
        });
        const $items = $form.find('input');
        const actualPadding = getPadding($items, 1, 2);

        assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
    });

    QUnit.test('2 columns -> 2 groups with nested groups and 1 item', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 2,
            items: [{ itemType: 'group',
                items: [ { itemType: 'group',
                    items: ['dataField1' ]
                } ]
            }, { itemType: 'group',
                items: [ { itemType: 'group',
                    items: ['dataField2' ]
                } ]
            }, {
                itemType: 'group',
                colCount: 1,
                items: ['dataField3' ]
            } ]
        });

        const $items = $form.find('input');
        const actualPadding = getPadding($items, 1, 2);

        assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
    });


    QUnit.test('form -> 2 columns and 3 groups', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 2,
            items: [{ itemType: 'group',
                colSpan: 1,
                items: ['dataField1' ]
            }, { itemType: 'group',
                colSpan: 1,
                items: ['dataField2' ]
            }, {
                itemType: 'group',
                colSpan: 2,
                items: ['dataField3' ]
            }]
        });
        const $items = $form.find('input');
        const actualPadding = getPadding($items, 1, 2);

        assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
    });

    QUnit.test('form -> 4 columns and 3 groups with colspan', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 4,
            items: [{ itemType: 'group',
                colSpan: 3,
                items: ['dataField1' ]
            }, { itemType: 'group',
                colSpan: 1,
                items: ['dataField2' ]
            }, {
                itemType: 'group',
                colSpan: 4,
                items: ['dataField3' ]
            }]
        });
        const $items = $form.find('input');
        const actualPadding = getPadding($items, 1, 2);

        assert.equal(actualPadding.paddingY, DEFAULT_PADDING_Y);
    });
});

