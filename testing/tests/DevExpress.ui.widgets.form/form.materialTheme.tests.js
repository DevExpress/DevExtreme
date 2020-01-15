import $ from 'jquery';
import 'ui/form/ui.form';

import 'common.css!';
import 'material_blue_light.css!';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';

    $('#qunit-fixture').html(markup);
});

['xs', 'sm', 'md', 'lg'].forEach(screenSize => {
    const DEFAULT_PADDING_RIGHT = 40;
    const DEFAULT_PADDING_TOP = 20;
    QUnit.module(`Form have correct padding (T849353), screen size: ${screenSize}`);

    function getPaddings(item1, item2) {
        const item1Rect = item1.getBoundingClientRect();
        const item2Rect = item2.getBoundingClientRect();

        const paddingTop = item2Rect.top - item1Rect.bottom;
        const paddingRight = item2Rect.left - item1Rect.right;
        const locationDiffX = item2Rect.left - item1Rect.left;
        const locationDiffY = item2Rect.top - item1Rect.top;

        return { paddingTop, paddingRight, locationDiffX, locationDiffY };
    }

    QUnit.test('1 column -> 2 items without groups', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 1,
            items: ['dataField1', 'dataField2']
        });
        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const actualPadding = getPaddings($contents.get(0), $labels.get(1));
        assert.equal(actualPadding.paddingTop, DEFAULT_PADDING_TOP);
        assert.equal(actualPadding.locationDiffX, 0);
    });


    QUnit.test('1 column -> 1 item and 1 group', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 1,
            items: ['dataField1', { itemType: 'group',
                items: ['dataField2' ]
            }]
        });
        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const actualPadding = getPaddings($contents.get(0), $labels.get(1));
        assert.equal(actualPadding.paddingTop, DEFAULT_PADDING_TOP);
        assert.equal(actualPadding.locationDiffX, 0);
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
        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const actualPadding = getPaddings($contents.get(0), $labels.get(1));
        assert.equal(actualPadding.paddingTop, DEFAULT_PADDING_TOP);
        assert.equal(actualPadding.locationDiffX, 0);
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
        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const actualPadding = getPaddings($contents.get(0), $labels.get(1));
        assert.equal(actualPadding.locationDiffX, 0);
        assert.equal(actualPadding.paddingTop, DEFAULT_PADDING_TOP);
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
        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const actualPadding = getPaddings($contents.get(0), $labels.get(1));
        assert.equal(actualPadding.paddingTop, DEFAULT_PADDING_TOP);
        assert.equal(actualPadding.locationDiffX, 0);
    });

    QUnit.test('2 columns -> 2 items without groups', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 2,
            items: ['dataField1', 'dataField2']
        });
        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const labelToContentPadding = getPaddings($contents.get(0), $labels.get(1));
        const paddingBetweenContent = getPaddings($contents.get(0), $contents.get(1));

        if(screenSize === 'xs') {
            assert.equal(labelToContentPadding.locationDiffX, 0);
            assert.equal(labelToContentPadding.paddingTop, DEFAULT_PADDING_TOP);
        } else {
            assert.equal(labelToContentPadding.paddingRight, DEFAULT_PADDING_RIGHT);
            assert.equal(paddingBetweenContent.locationDiffY, 0);
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
        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const labelToContentPadding = getPaddings($contents.get(0), $labels.get(1));
        const paddingBetweenContent = getPaddings($contents.get(0), $contents.get(2));

        if(screenSize === 'xs') {
            assert.equal(labelToContentPadding.locationDiffX, 0);
            assert.equal(labelToContentPadding.paddingTop, DEFAULT_PADDING_TOP);
        } else {
            assert.equal(labelToContentPadding.paddingRight, DEFAULT_PADDING_RIGHT);
            assert.equal(paddingBetweenContent.locationDiffY, 0);
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
        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const labelToContentPadding = getPaddings($contents.get(0), $labels.get(1));
        const paddingBetweenContent = getPaddings($contents.get(0), $contents.get(3));

        if(screenSize === 'xs') {
            assert.equal(labelToContentPadding.locationDiffX, 0);
            assert.equal(labelToContentPadding.paddingTop, DEFAULT_PADDING_TOP);
        } else {
            assert.equal(labelToContentPadding.paddingRight, DEFAULT_PADDING_RIGHT);
            assert.equal(paddingBetweenContent.locationDiffY, 0);
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
        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const labelToContentPadding = getPaddings($contents.get(0), $labels.get(1));
        const paddingBetweenContent = getPaddings($contents.get(1), $contents.get(3));

        if(screenSize === 'xs') {
            assert.equal(labelToContentPadding.locationDiffX, 0);
            assert.equal(labelToContentPadding.paddingTop, DEFAULT_PADDING_TOP);
        } else {
            assert.equal(labelToContentPadding.paddingRight, DEFAULT_PADDING_RIGHT);
            assert.equal(paddingBetweenContent.locationDiffY, 0);
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
        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const labelToContentPadding = getPaddings($contents.get(0), $labels.get(1));
        const paddingBetweenContent = getPaddings($contents.get(1), $contents.get(4));

        if(screenSize === 'xs') {
            assert.equal(labelToContentPadding.locationDiffX, 0);
            assert.equal(labelToContentPadding.paddingTop, DEFAULT_PADDING_TOP);
        } else {
            assert.equal(labelToContentPadding.paddingRight, DEFAULT_PADDING_RIGHT);
            assert.equal(paddingBetweenContent.locationDiffY, 0);
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
        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const labelToContentPadding = getPaddings($contents.get(1), $labels.get(2));
        assert.equal(labelToContentPadding.paddingTop, DEFAULT_PADDING_TOP);
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

        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const labelToContentPadding = getPaddings($contents.get(5), $labels.get(2));
        assert.equal(labelToContentPadding.paddingTop, DEFAULT_PADDING_TOP);
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

        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const labelToContentPadding = getPaddings($contents.get(3), $labels.get(2));
        assert.equal(labelToContentPadding.paddingTop, DEFAULT_PADDING_TOP);
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

        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const labelToContentPadding = getPaddings($contents.get(3), $labels.get(2));
        assert.equal(labelToContentPadding.paddingTop, DEFAULT_PADDING_TOP);
    });

    QUnit.test('form -> 1 column and 1 items and 1 tab', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 1,
            items: ['dataField1', {
                itemType: 'group',
                caption: 'Contact Information',
                items: [{
                    itemType: 'tabbed',
                    tabPanelOptions: {
                        deferRendering: false
                    },
                    tabs: [{
                        title: 'dataField2',
                        items: ['dataField2']
                    }]
                }] }
            ]
        });
        const $contents = $form.find('.dx-field-item-content');

        const paddings = getPaddings($contents.get(0), $contents.get(1));
        assert.equal(paddings.paddingTop, DEFAULT_PADDING_TOP);
    });

    QUnit.test('form -> 1 column and 2 items and 1 tab', function(assert) {
        const $form = $('#form').dxForm({
            screenByWidth: () => { return screenSize; },
            colCount: 1,
            items: ['dataField1', {
                itemType: 'group',
                caption: 'Contact Information',
                items: [{
                    itemType: 'tabbed',
                    tabPanelOptions: {
                        deferRendering: false
                    },
                    tabs: [{
                        title: 'dataField2',
                        items: ['dataField2']
                    }]
                }] }, 'dataField3'
            ]
        });

        const $labels = $form.find('.dx-field-item-label');
        const $contents = $form.find('.dx-field-item-content');

        const paddings = getPaddings($contents.get(1), $labels.get(2));
        assert.equal(paddings.paddingTop, DEFAULT_PADDING_TOP);
    });
});

