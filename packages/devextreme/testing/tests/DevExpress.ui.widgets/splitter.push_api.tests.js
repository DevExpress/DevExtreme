import $ from 'jquery';
import Splitter from 'ui/splitter';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import { isNumeric } from 'core/utils/type';
import ArrayStore from 'data/array_store';
import DataSource from 'data/data_source';

import 'generic_light.css!';

const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const RESIZE_HANDLE_CLASS = 'dx-resize-handle';

QUnit.testStart(() => {
    const markup =
        `<style nonce="qunit-test">
            #splitterParentContainer {
                width: 1024px;
                height: 1024px;
            }
        </style>
        
        <div id="splitter"></div>
        <div id="splitterParentContainer">
            <div id="splitterInContainer"></div>
        </div>`;
    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        const init = (options = {}, selector = '#splitter') => {
            this.$element = $(selector).dxSplitter(options);
            this.instance = this.$element.dxSplitter('instance');
        };

        init();

        this.reinit = (options, selector) => {
            this.instance.dispose();

            init(options, selector);
        };

        this.getResizeHandles = (childrenOnly = true) => {
            return this.$element[childrenOnly ? 'children' : 'find'](`.${RESIZE_HANDLE_CLASS}`);
        };


        this.getPanes = () => {
            return this.$element.children(`.${SPLITTER_ITEM_CLASS}`);
        };

        this.assertLayout = (expectedLayout) => {
            this.getPanes().toArray().forEach((item, index) => {
                QUnit.assert.roughEqual(item.style.flexGrow, expectedLayout[index], 0.05, `$item[${index}].flexGrow`);
            });
        };

        this.checkItemSizes = (expectedItemSizes) => {
            this.instance.option('items').forEach((item, index) => {
                if(isNumeric(item.size)) {
                    QUnit.assert.roughEqual(item.size, expectedItemSizes[index], 0.05, `item[${index}].size`);
                } else {
                    QUnit.assert.strictEqual(item.size, expectedItemSizes[index], `item[${index}].size`);
                }
            });
        };
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

QUnit.module('Push API', moduleConfig, () => {
    // TODO: fix pushApi when reshapeOnPush false
    [true].forEach((reshapeOnPush) => {
        ['horizontal', 'vertical'].forEach((orientation) => {
            [false, true].forEach((repaintChangesOnly) => {
                [
                    {
                        data: [{}, {}],
                        expectedItemSizes: [496, 488, 0],
                        expectedLayout: [50.4, 49.5935, 0],
                    },
                    {
                        data: [{ id: 1 }, { id: 2 }],
                        expectedItemSizes: [496, 488, 0],
                        expectedLayout: [50.4, 49.5935, 0],
                    },
                    {
                        data: [{ id: 1 }, { id: 2 }],
                        rtlEnabled: true,
                        expectedItemSizes: [496, 488, 0],
                        expectedLayout: [50.4, 49.5935, 0],
                    },
                    {
                        data: [{ id: 1 }, { id: 2 }],
                        expectedItemSizes: [496, 488, 0],
                        expectedLayout: [50.4, 49.5935, 0],
                    },
                ].forEach(({ data, rtlEnabled, expectedItemSizes, expectedLayout, insertIndex = 2, itemSize = 0 }) => {
                    QUnit.test(`insert should work, reshapeOnPush ${reshapeOnPush}, repaintChangesOnly ${repaintChangesOnly}, orientation ${orientation}`, function(assert) {
                        const dataSource = new DataSource({
                            store: new ArrayStore({
                                data: data,
                                key: data[0]['id'] ? 'id' : undefined,
                            }),
                            reshapeOnPush
                        });

                        this.reinit({ dataSource, orientation, rtlEnabled, repaintChangesOnly });

                        this.checkItemSizes([496, 496]);
                        this.assertLayout([50, 50]);
                        assert.strictEqual(this.getPanes().length, 2);
                        assert.strictEqual(this.getResizeHandles().length, 1);

                        const store = this.instance.getDataSource().store();
                        store.push([{ data: { id: 3, size: itemSize }, type: 'insert', index: insertIndex }]);
                        this.clock.tick(100);

                        this.checkItemSizes(expectedItemSizes);
                        this.assertLayout(expectedLayout);
                        assert.strictEqual(this.getPanes().toArray().length, 3);
                        assert.strictEqual(this.getResizeHandles().length, 2);
                    });
                });

                [
                    {
                        data: [{}, {}],
                    },
                    {
                        data: [{ id: 1 }, { id: 2 }],
                    },
                    {
                        data: [{ id: 1 }, { id: 2 }],
                    },
                ].forEach(({ data }) => {
                    QUnit.test(`resize should work correctly after insert, reshapeOnPush ${reshapeOnPush}, repaintChangesOnly ${repaintChangesOnly}, orientation ${orientation}`, function(assert) {
                        const dataSource = new DataSource({
                            store: new ArrayStore({
                                data: data,
                                key: data[0]['id'] ? 'id' : undefined,
                            }),
                            reshapeOnPush
                        });

                        this.reinit({ dataSource, orientation, repaintChangesOnly });

                        const store = this.instance.getDataSource().store();
                        store.push([{ data: { id: 3 }, type: 'insert', index: 2 }]);
                        this.clock.tick(100);

                        const pointer = pointerMock(this.getResizeHandles().eq(1));
                        pointer.start().dragStart().drag(-50, -50).dragEnd();

                        this.checkItemSizes([496, 438, 50]);

                        pointer.start().dragStart().drag(50, 50).dragEnd();

                        this.checkItemSizes([496, 488, 0]);
                    });
                });

                [
                    {
                        data: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                        expectedLayout: [24.7967, 24.7967, 50.4065],
                        expectedItemSizes: [244, 244, 496],
                    },
                    {
                        data: [{ id: 1 }, { id: 2 }],
                        expectedLayout: [100],
                        expectedItemSizes: [1000],
                    },
                    {
                        data: [{ id: 1 }, { id: 2 }],
                        expectedLayout: [100],
                        expectedItemSizes: [1000],
                    },
                ].forEach(({ data, expectedLayout, expectedItemSizes }) => {
                    QUnit.test(`remove should work correctly, reshapeOnPush ${reshapeOnPush}, repaintChangesOnly ${repaintChangesOnly}, orientation ${orientation}`, function(assert) {
                        const dataSource = new DataSource({
                            store: new ArrayStore({
                                data,
                                key: 'id',
                            }),
                            reshapeOnPush
                        });

                        this.reinit({ dataSource, orientation, repaintChangesOnly });

                        const initialResizeHandlesCount = this.getResizeHandles().length;
                        const store = this.instance.getDataSource().store();
                        store.push([{ type: 'remove', key: 2 }]);
                        this.clock.tick(100);

                        assert.strictEqual(this.getResizeHandles().length, initialResizeHandlesCount - 1);
                        this.assertLayout(expectedLayout);
                        this.checkItemSizes(expectedItemSizes);
                    });

                    QUnit.test(`resize should work correctly after updating datasource at runtime, repaintChangesOnly ${repaintChangesOnly}, orientation ${orientation}`, function(assert) {
                        const dataSource = [ {
                            resizable: true,
                            size: '140px',
                        }, {
                            splitter: {
                                orientation: 'vertical',
                                dataSource: [{ }, { }],
                            },
                        }, { }];

                        this.reinit({ dataSource, orientation, repaintChangesOnly });

                        assert.strictEqual(this.getPanes().length, 3);
                        assert.strictEqual(this.getResizeHandles().length, 2);

                        dataSource.push({ text: 'Pane_New' });
                        this.instance.option('dataSource', dataSource);

                        assert.strictEqual(this.getPanes().length, 4);
                        assert.strictEqual(this.getResizeHandles().length, 3);

                        this.assertLayout([14.3443, 43.2377, 42.418, 0]);
                        this.checkItemSizes([140, 422, 414, 0]);
                    });

                    [
                        {
                            data: [{ id: 1 }, { id: 2 }],
                            expectedLayout: [12.2984, 87.7016],
                            expectedItemSizes: [122, 870],
                        },
                        {
                            data: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 } ],
                            expectedLayout: [12.5, 25, 25, 37.5],
                            expectedItemSizes: [122, 244, 244, 366],
                        },
                    ].forEach(({ data, expectedLayout, expectedItemSizes }) => {
                        QUnit.test(`update should work correctly, reshapeOnPush ${reshapeOnPush}, repaintChangesOnly ${repaintChangesOnly}, orientation ${orientation}`, function(assert) {
                            const dataSource = new DataSource({
                                store: new ArrayStore({
                                    data,
                                    key: 'id',
                                }),
                                reshapeOnPush
                            });

                            this.reinit({ dataSource, orientation, repaintChangesOnly });

                            const store = this.instance.getDataSource().store();
                            store.push([{ type: 'update', data: { size: 122 }, key: 1 }]);
                            this.clock.tick(100);

                            this.assertLayout(expectedLayout);
                            this.checkItemSizes(expectedItemSizes);
                        });
                    });
                });
            });
        });
    });
});
