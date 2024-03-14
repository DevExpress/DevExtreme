import $ from 'jquery';
import Splitter from 'ui/splitter';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import { createEvent } from 'events/utils/index';

import 'generic_light.css!';

const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const RESIZE_HANDLE_CLASS = 'dx-resize-handle';
const RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS = 'dx-resize-handle-collapse-prev-pane';
const RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS = 'dx-resize-handle-collapse-next-pane';

QUnit.testStart(() => {
    const markup =
        '<div id="splitter"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        const init = (options = {}) => {
            this.$element = $('#splitter').dxSplitter(options);
            this.instance = this.$element.dxSplitter('instance');
        };

        init();

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        this.getResizeHandles = () => {
            return this.$element.find(`.${RESIZE_HANDLE_CLASS}`);
        };

        this.getPanes = () => {
            return this.$element.children(`.${SPLITTER_ITEM_CLASS}`);
        };

        this.assertLayout = (expectedLayout) => {
            this.getPanes().filter(':visible').toArray().forEach((item, index) => {
                QUnit.assert.strictEqual(item.style.flexGrow, expectedLayout[index]);
            });
        };

        this.checkItemSizes = (expectedItemSizes) => {
            this.instance.option('items').forEach((item, index) => {
                QUnit.assert.strictEqual(item.size, expectedItemSizes[index], `item[${index}].size`);
            });
        };
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Resizing', moduleConfig, () => {
    QUnit.module('Pane sizing', moduleConfig, () => {
        ['horizontal', 'vertical'].forEach(orientation => {
            [
                {
                    dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
                    expectedLayout: ['30', '60', '10'],
                    expectedItemSizes: ['300px', '600px', '100px']
                },
                {
                    dataSource: [{ }, { }, { size: '248px' }, { } ],
                    expectedLayout: ['25', '25', '25', '25'],
                    expectedItemSizes: [undefined, undefined, '248px', undefined],
                },
                {
                    dataSource: [{ size: '248px' }, { }, { size: '248px' }, { } ],
                    expectedLayout: ['25', '25', '25', '25'],
                    expectedItemSizes: ['248px', undefined, '248px', undefined],
                },
                {
                    dataSource: [{ size: '248' }, { }, { size: '496px' }, { } ],
                    expectedLayout: ['25', '12.5', '50', '12.5'],
                    expectedItemSizes: ['248', undefined, '496px', undefined],
                },
                {
                    dataSource: [{ size: 252 }, { visible: false }, { } ],
                    expectedLayout: ['25', '75'],
                    expectedItemSizes: [252, undefined, undefined],
                },
                {
                    dataSource: [{ visible: false }, { visible: false }, { size: '504px' }, { } ],
                    expectedLayout: ['50', '50'],
                    expectedItemSizes: [undefined, undefined, '504px', undefined],
                },
                {
                    dataSource: [{ visible: false }, { visible: false }, { }, { size: 504 } ],
                    expectedLayout: ['50', '50'],
                    expectedItemSizes: [undefined, undefined, undefined, 504],
                },
                {
                    dataSource: [{ size: 126 }, { size: 126 }, { visible: false }],
                    expectedLayout: ['12.5', '87.5'],
                    expectedItemSizes: [126, 126, undefined],
                },
                {
                    dataSource: [{ size: '504' }, { size: '23133px' } ],
                    expectedLayout: ['50', '50'],
                    expectedItemSizes: ['504', '23133px'],
                },
                {
                    dataSource: [{ size: '504232px' }, { size: '3px' } ],
                    expectedLayout: ['100', '0'],
                    expectedItemSizes: ['504232px', '3px'],
                },
                {
                    dataSource: [{ size: '504232px' }, { } ],
                    expectedLayout: ['100', '0'],
                    expectedItemSizes: ['504232px', undefined],
                },
                {
                    dataSource: [ { size: 0 }, { size: 128 } ],
                    expectedLayout: ['0', '100'],
                    expectedItemSizes: [0, 128],
                },
                {
                    dataSource: [ { size: 0 }, { size: 2 } ],
                    expectedLayout: ['0', '100'],
                    expectedItemSizes: [0, 2],
                },
                {
                    dataSource: [ { size: '0px' }, { size: 128 } ],
                    expectedLayout: ['0', '100'],
                    expectedItemSizes: ['0px', 128],
                },

            ].forEach(({ dataSource, expectedLayout, expectedItemSizes }) => {
                QUnit.test(`pane should respect size option in pixels, dataSource: ${JSON.stringify(dataSource)}, ${orientation} orientation`, function(assert) {
                    this.reinit({
                        width: 1016,
                        height: 1016,
                        dataSource,
                        orientation,
                    });

                    this.checkItemSizes(expectedItemSizes);
                    this.assertLayout(expectedLayout);
                });
            });
        });

        // todo: more use cases
        ['horizontal', 'vertical'].forEach(orientation => {
            [
                {
                    dataSource: [{ size: '25%' }, { size: '25%' }, { size: '248px' }, { } ],
                    expectedLayout: ['25', '25', '25', '25'],
                    expectedItemSizes: ['25%', '25%', '248px', undefined],
                },
                {
                    dataSource: [{ size: '50%' }, { size: '25%' }, { size: 248 }, { } ],
                    expectedLayout: ['50', '25', '25', '0'],
                    expectedItemSizes: ['50%', '25%', 248, undefined]
                },
            ].forEach(({ dataSource, expectedLayout, expectedItemSizes }) => {
                QUnit.test(`pane should respect size option when both pixels and percents are used, dataSource: ${JSON.stringify(dataSource)} ${orientation} orientation`, function(assert) {
                    this.reinit({
                        width: 1016,
                        height: 1016,
                        dataSource,
                        orientation,
                    });

                    this.checkItemSizes(expectedItemSizes);
                    this.assertLayout(expectedLayout);
                });
            });
        });

        ['horizontal', 'vertical'].forEach(orientation => {
            [
                {
                    dataSource: [{ size: '30%' }, { size: '60%' }, { size: '10%' }],
                    expectedLayout: ['30', '60', '10'],
                    expectedItemSizes: ['30%', '60%', '10%']
                },
                {
                    dataSource: [{ }, { }, { }, { } ],
                    expectedLayout: ['25', '25', '25', '25'],
                    expectedItemSizes: [undefined, undefined, undefined, undefined]
                },
                {
                    dataSource: [{ }, { size: '10%' }, { }, { } ],
                    expectedLayout: ['30', '10', '30', '30'],
                    expectedItemSizes: [undefined, '10%', undefined, undefined]
                },
                {
                    dataSource: [{ size: '30%' }, { }, { size: '50%' }, { } ],
                    expectedLayout: ['30', '10', '50', '10'],
                    expectedItemSizes: ['30%', undefined, '50%', undefined]
                },
                {
                    dataSource: [{ size: '30%' }, { }, { size: '30%' } ],
                    expectedLayout: ['30', '40', '30'],
                    expectedItemSizes: ['30%', undefined, '30%']
                },
                {
                    dataSource: [{ }, { visible: false }, { size: '50%' }, { } ],
                    expectedLayout: ['25', '50', '25'],
                    expectedItemSizes: [undefined, undefined, '50%', undefined]
                },
                {
                    dataSource: [{ visible: false }, { visible: false }, { size: '50%' }, { } ],
                    expectedLayout: ['50', '50'],
                    expectedItemSizes: [undefined, undefined, '50%', undefined]
                },
                {
                    dataSource: [{ size: '40%' }, { size: '60%' }, { visible: false } ],
                    expectedLayout: ['40', '60'],
                    expectedItemSizes: ['40%', '60%', undefined]
                },
                {
                    dataSource: [{ size: '30%' }, { size: '200%' } ],
                    expectedLayout: ['30', '70'],
                    expectedItemSizes: ['30%', '200%']
                },
                {
                    dataSource: [{ size: '320%' }, { size: '200%' } ],
                    expectedLayout: ['100', '0'],
                    expectedItemSizes: ['320%', '200%']
                },
                {
                    dataSource: [{ size: '10%' }, { size: '10%' }, { visible: false }],
                    expectedLayout: ['10', '90'],
                    expectedItemSizes: ['10%', '10%', undefined]
                },
                {
                    dataSource: [{ size: '30%' }, { size: '20%' }, { size: '300%' }, { size: '20%' }, { } ],
                    expectedLayout: ['30', '20', '50', '0', '0'],
                    expectedItemSizes: ['30%', '20%', '300%', '20%', undefined]
                },
                {
                    dataSource: [{ size: '30%' }, { size: '25%' }, { size: '10%' } ],
                    expectedLayout: ['30', '25', '45'],
                    expectedItemSizes: ['30%', '25%', '10%']
                },
                {
                    dataSource: [{ size: '30%', visible: false }, { size: '25%' }, { size: '10%' } ],
                    expectedLayout: [ '25', '75'],
                    expectedItemSizes: ['30%', '25%', '10%']
                },
                {
                    dataSource: [{ size: '0%' }, { size: '1%' } ],
                    expectedLayout: ['0', '100'],
                    expectedItemSizes: ['0%', '1%']
                },
                {
                    dataSource: [{ }, { size: '1%' } ],
                    expectedLayout: ['99', '1'],
                    expectedItemSizes: [undefined, '1%']
                },
            ].forEach(({ dataSource, expectedLayout, expectedItemSizes }) => {
                QUnit.test(`pane should respect size option in percentages, dataSource: ${JSON.stringify(dataSource)}, ${orientation} orientation`, function(assert) {
                    this.reinit({
                        width: 424, height: 424,
                        dataSource,
                        orientation,
                    });

                    this.checkItemSizes(expectedItemSizes);
                    this.assertLayout(expectedLayout);
                });
            });
        });
    });

    ['horizontal', 'vertical'].forEach(orientation => {
        QUnit.test(`items should be evenly distributed by default with ${orientation} orientation`, function(assert) {
            this.reinit({
                orientation,
                dataSource: [{ }, { }]
            });

            this.assertLayout(['50', '50']);
        });

        QUnit.test(`items with nested splitter should be evenly distributed by default with ${orientation} orientation`, function(assert) {
            this.reinit({ width: 208, height: 208, orientation: 'horizontal',
                dataSource: [{}, {}, {}, {
                    splitter: {
                        orientation,
                        dataSource: [{ }]
                    },
                }]
            });

            this.assertLayout(['25', '25', '25', '25']);
        });

        QUnit.test(`items should have no size if not visible, ${orientation} orientation`, function(assert) {
            this.reinit({
                orientation,
                dataSource: [{ }, { visible: false }, {}]
            });

            this.assertLayout(['50', '50']);
        });

        QUnit.test(`first and second items resize should work when middle item is invisible, ${orientation} orientation`, function(assert) {
            this.reinit({
                width: 224, height: 224,
                orientation,
                dataSource: [{}, {}, { visible: false, }, { }, { }]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(-25, -25).dragEnd();

            this.assertLayout(['12.5', '37.5', '25', '25']);
        });

        QUnit.test(`last items resize should work when middle item is invisible, ${orientation} orientation`, function(assert) {
            this.reinit({
                width: 224, height: 224,
                orientation,
                dataSource: [{}, {}, { visible: false, }, {}, {}]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(2));
            pointer.start().dragStart().drag(-25, -25).dragEnd();

            this.assertLayout(['25', '25', '12.5', '37.5']);
        });

        QUnit.test(`items should be resized when their neighbour item is not visible, ${orientation} orientation`, function(assert) {
            this.reinit({
                width: 208, height: 208,
                orientation,
                dataSource: [{}, { visible: false, }, { },]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(50, 50).dragEnd();

            this.assertLayout(['75', '25']);
        });

        QUnit.test(`last two items should be able to resize when first item is not visible, ${orientation} orientation`, function(assert) {
            this.reinit({
                width: 208, height: 208,
                orientation,
                dataSource: [{ visible: false, }, {}, {},]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(50, 50).dragEnd();

            this.assertLayout(['75', '25']);
        });

        QUnit.test(`splitter should have no resize handles if only 1 item is visible, ${orientation} orientation`, function(assert) {
            this.reinit({
                orientation,
                dataSource: [{ visible: false }, { }]
            });

            const resizeHandles = this.$element.find(`.${RESIZE_HANDLE_CLASS}`);

            assert.strictEqual(resizeHandles.length, 0);
        });

        QUnit.test(`splitter should have 3 resize handles if 4 out of 6 are visible, ${orientation} orientation`, function(assert) {
            this.reinit({
                orientation,
                dataSource: [ { }, { }, { visible: false }, { }, { }, { visible: false }]
            });

            const resizeHandles = this.$element.find(`.${RESIZE_HANDLE_CLASS}`);

            assert.strictEqual(resizeHandles.length, 3);
        });
    });

    [
        { scenario: 'left', items: [ { resizable: false }, { } ] },
        { scenario: 'right', items: [ { }, { resizable: false } ] },
        { scenario: 'left and right', items: [ { resizable: false }, { resizable: false } ] }
    ].forEach(({ scenario, items }) => {
        QUnit.test(`resize should not work when ${scenario} pane has resizable=false`, function(assert) {
            this.reinit({
                width: 208, height: 208,
                items
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(-25, -25).dragEnd();

            this.assertLayout(['50', '50']);
        });
    });

    QUnit.test('resize should work when pane resizable is enabled on runtime', function(assert) {
        this.reinit({
            width: 208, height: 208,
            items: [ { resizable: false }, { } ],
        });

        this.instance.option('items[0].resizable', true);

        const pointer = pointerMock(this.getResizeHandles().eq(0));
        pointer.start().dragStart().drag(50, 50).dragEnd();

        this.assertLayout(['75', '25']);
    });

    QUnit.test('resize should not work when pane resizable is disabled on runtime', function(assert) {
        this.reinit({
            width: 208, height: 208,
            items: [ { }, { } ],
        });

        this.instance.option('items[0].resizable', false);

        const pointer = pointerMock(this.getResizeHandles().eq(0));
        pointer.start().dragStart().drag(50, 50).dragEnd();

        this.assertLayout(['50', '50']);
    });

    [{
        resizeDistance: 50,
        expectedLayout: ['25', '75'],
        expectedItemSizes: [50, 150],
        orientation: 'horizontal',
        rtl: true
    }, {
        resizeDistance: -50,
        expectedLayout: ['75', '25'],
        expectedItemSizes: [150, 50],
        orientation: 'horizontal',
        rtl: true
    }, {
        resizeDistance: -100,
        expectedLayout: ['100', '0'],
        expectedItemSizes: [200, 0],
        orientation: 'horizontal',
        rtl: true
    }, {
        resizeDistance: 100,
        expectedLayout: ['0', '100'],
        expectedItemSizes: [0, 200],
        orientation: 'horizontal',
        rtl: true
    }, {
        resizeDistance: 75,
        expectedLayout: ['12.5', '87.5'],
        expectedItemSizes: [25, 175],
        orientation: 'horizontal',
        rtl: true
    }, {
        resizeDistance: 50,
        expectedLayout: ['75', '25'],
        expectedItemSizes: [150, 50],
        orientation: 'horizontal',
        rtl: false
    }, {
        resizeDistance: -50,
        expectedLayout: ['25', '75'],
        expectedItemSizes: [50, 150],
        orientation: 'horizontal',
        rtl: false
    }, {
        resizeDistance: -100,
        expectedLayout: ['0', '100'],
        expectedItemSizes: [0, 200],
        orientation: 'horizontal',
        rtl: false
    }, {
        resizeDistance: 100,
        expectedLayout: ['100', '0'],
        expectedItemSizes: [200, 0],
        orientation: 'horizontal',
        rtl: false
    }, {
        resizeDistance: 75,
        expectedLayout: ['87.5', '12.5'],
        expectedItemSizes: [175, 25],
        orientation: 'horizontal',
        rtl: false
    },
    // TODO: expectedItemSizes are not correct
    // {
    //     resizeDistance: 50,
    //     expectedLayout: ['75', '25'],
    //     expectedItemSizes: [208, 208],
    //     orientation: 'vertical',
    //     rtl: false },
    // {
    //     resizeDistance: -50,
    //     expectedLayout: ['25', '75'],
    //     expectedItemSizes: [208, 208],
    //     orientation: 'vertical',
    //     rtl: false },
    // {
    //     resizeDistance: -100,
    //     expectedLayout: ['0', '100'],
    //     expectedItemSizes: [208, 208],
    //     orientation: 'vertical',
    //     rtl: false },
    // {
    //     resizeDistance: 100,
    //     expectedLayout: ['100', '0'],
    //     expectedItemSizes: [208, 208],
    //     orientation: 'vertical',
    //     rtl: false },
    // {
    //     resizeDistance: 75,
    //     expectedLayout: ['87.5', '12.5'],
    //     expectedItemSizes: [208, 208],
    //     orientation: 'vertical',
    //     rtl: false
    // },
    ].forEach(({ resizeDistance, expectedLayout, expectedItemSizes, orientation, rtl }) => {
        QUnit.test(`items should resize proportionally with ${orientation} orientation, rtl ${rtl}`, function(assert) {
            this.reinit({
                width: 208, height: 208,
                dataSource: [{ }, { }],
                orientation,
                rtlEnabled: rtl,
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(resizeDistance, resizeDistance).dragEnd();

            this.checkItemSizes(expectedItemSizes);
            this.assertLayout(expectedLayout);
        });
    });

    [{
        resizeDistance: 50,
        expectedLayout: ['75', '25'],
        expectedItemSizes: [150, 50],
        orientation: 'horizontal'
    }, {
        resizeDistance: -50,
        expectedLayout: ['25', '75'],
        expectedItemSizes: [50, 150],
        orientation: 'horizontal'
    }, {
        resizeDistance: -100,
        expectedLayout: ['0', '100'],
        expectedItemSizes: [0, 200],
        orientation: 'horizontal'
    }, {
        resizeDistance: 100,
        expectedLayout: ['100', '0'],
        expectedItemSizes: [200, 0],
        orientation: 'horizontal'
    }, {
        resizeDistance: 75,
        expectedLayout: ['87.5', '12.5'],
        expectedItemSizes: [175, 25],
        orientation: 'horizontal'
    // TODO: item sizes are not correct
    // }, {
    //     resizeDistance: 50,
    //     expectedLayout: ['75', '25'],
    //     expectedItemSizes: [208, 208],
    //     orientation: 'vertical'
    // }, {
    //     resizeDistance: -50,
    //     expectedLayout: ['25', '75'],
    //     expectedItemSizes: [208, 208],
    //     orientation: 'vertical'
    // }, {
    //     resizeDistance: -100,
    //     expectedLayout: ['0', '100'],
    //     expectedItemSizes: [208, 208],
    //     orientation: 'vertical'
    // }, {
    //     resizeDistance: 100,
    //     expectedLayout: ['100', '0'],
    //     expectedItemSizes: [208, 208],
    //     orientation: 'vertical'
    // }, {
    //     resizeDistance: 75,
    //     expectedLayout: ['87.5', '12.5'],
    //     expectedItemSizes: [208, 208],
    //     orientation: 'vertical'
    }].forEach(({ resizeDistance, expectedLayout, expectedItemSizes, orientation }) => {
        QUnit.test(`items with nested splitter should resize proportionally with ${orientation} orientation`, function(assert) {
            this.reinit({
                width: 208, height: 208,
                dataSource: [{ }, {
                    splitter: {
                        orientation,
                        dataSource: [{ }]
                    },
                }],
                orientation
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(resizeDistance, resizeDistance).dragEnd();

            this.checkItemSizes(expectedItemSizes);
            this.assertLayout(expectedLayout);
        });
    });

    [
        { resizeDistance: 50, resizeBackDistance: -30, expectedSize: ['30', '10', '20', '20', '20'], orientation: 'horizontal', rtl: false },
        { resizeDistance: 50, resizeBackDistance: -30, expectedSize: ['30', '10', '20', '20', '20'], orientation: 'vertical', rtl: false },
        { resizeDistance: 100, resizeBackDistance: -100, expectedSize: ['20', '20', '20', '20', '20'], orientation: 'horizontal', rtl: false },
        { resizeDistance: -50, resizeBackDistance: 30, expectedSize: ['30', '10', '20', '20', '20'], orientation: 'horizontal', rtl: true },
        { resizeDistance: -100, resizeBackDistance: 100, expectedSize: ['20', '20', '20', '20', '20'], orientation: 'horizontal', rtl: true },
        { resizeDistance: 50, resizeBackDistance: -30, expectedSize: ['30', '10', '20', '20', '20'], orientation: 'vertical', rtl: false },
        { resizeDistance: 100, resizeBackDistance: -100, expectedSize: ['20', '20', '20', '20', '20'], orientation: 'vertical', rtl: false },
    ].forEach(({ resizeDistance, resizeBackDistance, expectedSize, orientation, rtl }) => {
        QUnit.test(`panes sizes should be correct after resizing multiple panes beyond neighbor and changing resize direction, ${orientation} orientation, rtl ${rtl}`, function(assert) {
            this.reinit({
                orientation: orientation, width: 232, height: 232, rtlEnabled: rtl,
                dataSource: [{}, {}, {}, {}, {}],
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(resizeDistance, resizeDistance).drag(resizeBackDistance, resizeBackDistance).dragEnd();

            this.assertLayout(expectedSize);
        });
    });

    [
        { resizeDistance: 500, expectedSize: ['100', '0'], orientation: 'horizontal' },
        { resizeDistance: -500, expectedSize: ['0', '100'], orientation: 'vertical' }
    ].forEach(({ resizeDistance, expectedSize, orientation }) => {
        QUnit.test(`resize item should not be resized beyound splitter borders with ${orientation} orientation`, function(assert) {
            this.reinit({ width: 208, height: 208, dataSource: [{ }, { }], orientation });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(resizeDistance, resizeDistance).dragEnd();

            this.assertLayout(expectedSize);
        });
    });

    [
        { resizeDistance: 200, expectedSize: ['75', '0', '0', '25'], handleIndex: 0, orientation: 'horizontal', rtl: false },
        { resizeDistance: 200, expectedSize: ['75', '0', '0', '25'], handleIndex: 0, orientation: 'vertical', rtl: false },
        { resizeDistance: 200, expectedSize: ['0', '50', '25', '25'], handleIndex: 0, orientation: 'horizontal', rtl: true },
        { resizeDistance: 300, expectedSize: ['100', '0', '0', '0'], handleIndex: 0, orientation: 'horizontal', rtl: false },
        { resizeDistance: 300, expectedSize: ['100', '0', '0', '0'], handleIndex: 0, orientation: 'vertical', rtl: false },
        { resizeDistance: 200, expectedSize: ['25', '75', '0', '0'], handleIndex: 1, orientation: 'horizontal', rtl: false },
        { resizeDistance: 200, expectedSize: ['25', '75', '0', '0'], handleIndex: 1, orientation: 'vertical', rtl: false },
        { resizeDistance: 200, expectedSize: ['25', '0', '0', '75'], handleIndex: 2, orientation: 'horizontal', rtl: true },
    ].forEach(({ resizeDistance, expectedSize, handleIndex, orientation, rtl }) => {
        QUnit.test(`should resize all panes on the way, ${orientation} orientation`, function(assert) {
            this.reinit({ width: 424, height: 424, dataSource: [{ }, { }, { }, { }], orientation, rtlEnabled: rtl });

            const pointer = pointerMock(this.getResizeHandles().eq(handleIndex));
            pointer.start().dragStart().drag(resizeDistance, resizeDistance).dragEnd();

            this.assertLayout(expectedSize);
        });
    });

    QUnit.test('resize item with nested splitter should resize all panes beyound neighbour', function(assert) {
        this.reinit({ width: 208, dataSource: [ { splitter: { dataSource: [{ }] } }, { }, { }, { splitter: { dataSource: [{ }] } }] });

        const pointer = pointerMock(this.getResizeHandles().eq(2));
        pointer.start().dragStart().drag(-400, 0).dragEnd();

        this.assertLayout(['0', '0', '0', '100']);
    });

    QUnit.test('runtime size option change should update lauout', function(assert) {
        this.reinit({
            width: 1016, dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
        });

        this.instance.option('items[0].size', 100);

        this.assertLayout(['10', '60', '30']);
    });
});

QUnit.module('Initialization', moduleConfig, () => {
    QUnit.test('Splitter should be initialized with Splitter type', function(assert) {
        assert.ok(this.instance instanceof Splitter);
    });

    QUnit.test('items count should be the same as datasource items count', function(assert) {
        this.reinit({ dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }, { text: 'pane 3' }] });

        const items = this.$element.find(`.${SPLITTER_ITEM_CLASS}`);

        assert.strictEqual(items.length, 3);
    });

    QUnit.test('items should be able to be initialized with template', function(assert) {
        this.reinit({ dataSource: [{
            template: () => $('<div>').text('Pane 1') }, {
            template: () => $('<div>').text('Pane 2') }, {
            template: () => $('<div>').text('Pane 3') }]
        });

        const items = this.$element.find(`.${SPLITTER_ITEM_CLASS}`);

        assert.strictEqual(items.length, 3);
    });

    QUnit.test('Splitter with three items should have two resize handles', function(assert) {
        this.reinit({ dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }, { text: 'pane 3' }] });

        assert.strictEqual(this.getResizeHandles().length, 2);
    });

    QUnit.test('Splitter with one item should have no handles', function(assert) {
        this.reinit({ dataSource: [{ template: () => $('<div>').text('Pane 1') }] });

        assert.strictEqual(this.getResizeHandles().length, 0);
    });

    QUnit.test('Splitter with no items should have no handles', function(assert) {
        this.reinit({ dataSource: [] });

        assert.strictEqual(this.getResizeHandles().length, 0);
    });
});


QUnit.module('Events', moduleConfig, () => {
    ['onResizeStart', 'onResize', 'onResizeEnd'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} should be called when handle dragged`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            this.reinit({
                [eventHandler]: resizeHandlerStub,
                dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 1);
        });

        QUnit.test(`${eventHandler} event handler should be able to be updated at runtime`, function(assert) {
            const handlerStub = sinon.stub();
            const handlerStubAfterUpdate = sinon.stub();

            this.reinit({
                [eventHandler]: handlerStub,
                dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));

            pointer.start().dragStart().drag(0, 50).dragEnd();

            this.instance.option(eventHandler, handlerStubAfterUpdate);

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(handlerStub.callCount, 1);
            assert.strictEqual(handlerStubAfterUpdate.callCount, 1);
        });

        QUnit.test(`${eventHandler} should have correct argument fields`, function(assert) {
            assert.expect(4);

            this.reinit({
                [eventHandler]: ({ component, element, event, handleElement }) => {
                    const $resizeHandle = this.getResizeHandles();

                    assert.strictEqual(component, this.instance, 'component field is correct');
                    assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                    assert.strictEqual($(event.target).is($resizeHandle), true, 'event field is correct');
                    assert.strictEqual($(handleElement).is($resizeHandle), true, 'handleElement field is correct');
                },
                dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));

            pointer.start().dragStart().drag(0, 50).dragEnd();
        });
    });

    QUnit.test('onItemCollapsed should be called on collapse prev button click', function(assert) {
        const onItemCollapsed = sinon.stub();

        this.reinit({
            onItemCollapsed,
            dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
        });

        const $collapsePrevButton = this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS}`);

        $collapsePrevButton.trigger('dxclick');

        assert.strictEqual(onItemCollapsed.callCount, 1);
    });

    QUnit.test('onItemExpanded should be called on collapse next button click', function(assert) {
        const onItemExpanded = sinon.stub();

        this.reinit({
            onItemExpanded,
            dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
        });

        const $collapseNextButton = this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS}`);

        $collapseNextButton.trigger('dxclick');

        assert.strictEqual(onItemExpanded.callCount, 1);
    });

    ['onItemCollapsed', 'onItemExpanded'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} should have correct argument fields`, function(assert) {
            assert.expect(5);

            this.reinit({
                [eventHandler]: ({ component, element, event, itemData, itemElement }) => {
                    const $resizeHandle = this.getResizeHandles();
                    const $item = this.$element.find(`.${SPLITTER_ITEM_CLASS}`).first();

                    assert.strictEqual(component, this.instance, 'component field is correct');
                    assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                    assert.strictEqual($(event.target).parent().is($resizeHandle), true, 'event field is correct');
                    assert.strictEqual($(itemElement).is($item), true, 'itemElement field is correct');
                    assert.deepEqual(itemData, { text: 'pane 1' }, 'itemData field is correct');
                },
                dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
            });

            const $collapsePrevButton = this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS}`);
            const $collapseNextButton = this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS}`);

            $collapsePrevButton.trigger('dxclick');
            $collapseNextButton.trigger('dxclick');
        });

        QUnit.test(`${eventHandler} event handler should be able to be updated at runtime`, function(assert) {
            const handlerStub = sinon.stub();
            const handlerStubAfterUpdate = sinon.stub();

            this.reinit({
                [eventHandler]: handlerStub,
                dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
            });

            const $collapsePrevButton = this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS}`);
            const $collapseNextButton = this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS}`);

            $collapsePrevButton.trigger('dxclick');
            $collapseNextButton.trigger('dxclick');

            this.instance.option(eventHandler, handlerStubAfterUpdate);

            $collapsePrevButton.trigger('dxclick');
            $collapseNextButton.trigger('dxclick');

            assert.strictEqual(handlerStub.callCount, 1);
            assert.strictEqual(handlerStubAfterUpdate.callCount, 1);
        });
    });
});

QUnit.module('Nested Splitter Events', moduleConfig, () => {
    ['onResizeStart', 'onResize', 'onResizeEnd'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} should be called when handle in nested splitter is dragged`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            this.reinit({
                [eventHandler]: resizeHandlerStub,
                items: [{
                    splitter: {
                        dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
                    }
                }]
            });

            const pointer = pointerMock(this.getResizeHandles()[0]);

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 1);
        });

        QUnit.test(`nestedSplitter.${eventHandler} should be called instead of parentSplitter.${eventHandler}`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            const nestedSplitterResizeHandlerStub = sinon.stub();
            this.reinit({
                [eventHandler]: resizeHandlerStub,
                items: [{
                    splitter: {
                        [eventHandler]: nestedSplitterResizeHandlerStub,
                        dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
                    }
                }]
            });

            const pointer = pointerMock(this.getResizeHandles()[0]);

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 0);
            assert.strictEqual(nestedSplitterResizeHandlerStub.callCount, 1);
        });

        QUnit.test(`nestedSplitter.${eventHandler} event handler should be able to be updated at runtime`, function(assert) {
            const handlerStub = sinon.stub();
            const handlerStubAfterUpdate = sinon.stub();

            this.reinit({
                items: [{
                    splitter: {
                        [eventHandler]: handlerStub,
                        dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
                    }
                }]
            });

            let pointer = pointerMock(this.getResizeHandles().get(0));

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(handlerStub.callCount, 1);
            assert.strictEqual(handlerStubAfterUpdate.callCount, 0);
            handlerStub.reset();

            this.instance.option(`items[0].splitter.${eventHandler}`, handlerStubAfterUpdate);

            pointer = pointerMock(this.getResizeHandles()[0]);
            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(handlerStub.callCount, 0);
            assert.strictEqual(handlerStubAfterUpdate.callCount, 1);
        });
    });

    QUnit.test('itemRendered should be called when nested splitter panes are rendered', function(assert) {
        const itemRenderedSpy = sinon.spy();

        this.reinit({
            onItemRendered: itemRenderedSpy,
            items: [{
                text: 'Pane_1',
            }, {
                splitter: {
                    items: [{ text: 'NestedPane_1' }, { text: 'NestedPane_2' }]
                }
            }]
        });

        assert.strictEqual(itemRenderedSpy.callCount, 4, 'itemRendered.callCount');
    });

    QUnit.test('nested splitter itemRendered should be called instead of parent.itemRendered', function(assert) {
        const itemRenderedSpy = sinon.spy();
        const nestedItemRenderedSpy = sinon.spy();

        this.reinit({
            onItemRendered: itemRenderedSpy,
            items: [{
                text: 'Pane_1',
            }, {
                splitter: {
                    onItemRendered: nestedItemRenderedSpy,
                    items: [{ text: 'NestedPane_1' }, { text: 'NestedPane_2' }]
                }
            }]
        });

        assert.strictEqual(itemRenderedSpy.callCount, 2, 'itemRendered.callCount');
        assert.strictEqual(nestedItemRenderedSpy.callCount, 2, 'itemRendered.callCount');
    });
});

QUnit.module('The dependency of ResizeHandle`s behavior on Splitter options', moduleConfig, () => {
    QUnit.test('ResizeHandle should be focusable when allowKeyboardNavigation option is set to true', function(assert) {
        this.reinit({
            dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }, { text: 'Pane_3' }],
            allowKeyboardNavigation: true
        });

        this.getResizeHandles().each((index, resizeHandle) => {
            assert.strictEqual($(resizeHandle).attr('tabIndex'), '0', `resizeHandle[${index}] is focusable`);
        });
    });

    QUnit.test('ResizeHandle should not be focusable when allowKeyboardNavigation option is set to false', function(assert) {
        this.reinit({
            dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }, { text: 'Pane_3' }],
            allowKeyboardNavigation: false
        });

        this.getResizeHandles().each((index, resizeHandle) => {
            assert.strictEqual($(resizeHandle).attr('tabIndex'), undefined, `resizeHandle[${index}] is not focusable`);
        });
    });

    QUnit.test('ResizeHandle should not be focusable when allowKeyboardNavigation option is set to false in runtime and vise versa', function(assert) {
        this.reinit({
            dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }, { text: 'Pane_3' }],
            allowKeyboardNavigation: true,
        });

        this.instance.option('allowKeyboardNavigation', false);

        this.getResizeHandles().each((index, resizeHandle) => {
            assert.strictEqual($(resizeHandle).attr('tabIndex'), undefined, `resizeHandle[${index}] is not focusable`);
        });

        this.instance.option('allowKeyboardNavigation', true);

        this.getResizeHandles().each((index, resizeHandle) => {
            assert.strictEqual($(resizeHandle).attr('tabIndex'), '0', `resizeHandle[${index}] is focusable`);
        });
    });
});

QUnit.module('Keyboard support', moduleConfig, () => {
    QUnit.test('RegisterKeyHandler registers key handling on all internal resizeHandle components', function(assert) {
        const registerKeyHandlerSpy = sinon.spy();

        this.reinit({
            dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }, { text: 'Pane_3' }],
        });

        this.instance.registerKeyHandler('enter', registerKeyHandlerSpy);

        this.getResizeHandles().eq(0).trigger(createEvent('keydown', { key: 'Enter' }));

        assert.strictEqual(registerKeyHandlerSpy.args[0][0].target, this.getResizeHandles().eq(0).get(0), 'event target is correct');
        assert.strictEqual(registerKeyHandlerSpy.callCount, 1);
        registerKeyHandlerSpy.resetHistory();

        this.getResizeHandles().eq(1).trigger(createEvent('keydown', { key: 'Enter' }));
        assert.strictEqual(registerKeyHandlerSpy.args[0][0].target, this.getResizeHandles().eq(1).get(0), 'event target is correct');
        assert.strictEqual(registerKeyHandlerSpy.callCount, 1);
    });

    QUnit.test('RegisterKeyHandler registers key handling on all internal resizeHandle components, allowKeyboardNavigation is false', function(assert) {
        const registerKeyHandlerSpy = sinon.spy();

        this.reinit({
            dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }, { text: 'Pane_3' }],
            allowKeyboardNavigation: false
        });

        this.instance.registerKeyHandler('enter', registerKeyHandlerSpy);

        this.getResizeHandles().eq(0).trigger(createEvent('keydown', { key: 'Enter' }));

        assert.strictEqual(registerKeyHandlerSpy.callCount, 0);
    });
});
