import $ from 'jquery';
import Splitter from 'ui/splitter';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import { isRenderer, isNumeric } from 'core/utils/type';
import config from 'core/config';
import { createEvent } from 'events/utils/index';
import { name as DOUBLE_CLICK_EVENT } from 'events/double_click';
import { name as CLICK_EVENT } from 'events/click';

import 'generic_light.css!';

const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const RESIZE_HANDLE_CLASS = 'dx-resize-handle';
const RESIZE_HANDLE_ICON_CLASS = 'dx-resize-handle-icon';
const RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS = 'dx-resize-handle-collapse-prev-pane';
const RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS = 'dx-resize-handle-collapse-next-pane';
const STATE_INVISIBLE_CLASS = 'dx-state-invisible';
const STATE_ACTIVE_CLASS = 'dx-state-active';
const STATE_FOCUSED_CLASS = 'dx-state-focused';

QUnit.testStart(() => {
    const markup =
        `<style nonce="qunit-test">
            #splitterParentContainer {
                width: 1024px;
                height: 1024px;
            }

            .extra-border {
                border: 10px solid black;
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

        this.getCollapsePrevButton = ($resizeHandle) => {
            return $resizeHandle.find(`.${RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS}`);
        };

        this.getCollapseNextButton = ($resizeHandle) => {
            return $resizeHandle.find(`.${RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS}`);
        };

        this.getResizeHandleIcon = ($resizeHandle) => {
            return $resizeHandle.find(`.${RESIZE_HANDLE_ICON_CLASS}`);
        };

        this.getPanes = () => {
            return this.$element.children(`.${SPLITTER_ITEM_CLASS}`);
        };

        this.assertLayout = (expectedLayout, epsilon) => {
            this.getPanes().filter(':visible').toArray().forEach((item, index) => {
                QUnit.assert.roughEqual(item.style.flexGrow, expectedLayout[index], epsilon || 0.1, `$item[${index}].flexGrow`);
            });
        };

        this.checkItemSizes = (expectedItemSizes) => {
            this.instance.option('items').forEach((item, index) => {
                if(isNumeric(item.size)) {
                    QUnit.assert.roughEqual(item.size, expectedItemSizes[index], 0.1, `item[${index}].size`);
                } else {
                    QUnit.assert.strictEqual(item.size, expectedItemSizes[index], `item[${index}].size`);
                }
            });
        };
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Pane sizing', moduleConfig, () => {
    [{
        dataSource: [{ minSize: '30%' }],
        expectedLayout: ['100'],
        expectedItemSizes: [undefined]
    }, {
        dataSource: [{ size: '40%', minSize: '30%' }, { }],
        expectedLayout: ['40.8', '59.2'],
        expectedItemSizes: ['40%', undefined]
    }, {
        dataSource: [{ minSize: '30%' }, { }, { }],
        expectedLayout: ['33.3333', '33.3333', '33.3333'],
        expectedItemSizes: [undefined, undefined, undefined]
    }, {
        dataSource: [{ minSize: '40%' }, { }, { }],
        expectedLayout: ['41.6326', '25.034', '33.3333'],
        expectedItemSizes: [undefined, undefined, undefined]
    },
    {
        dataSource: [{ }, { minSize: '40%' }, { }],
        expectedLayout: ['25.034', '41.6326', '33.3333'],
        expectedItemSizes: [undefined, undefined, undefined]
    },
    {
        dataSource: [{ }, { }, { minSize: '40%' }],
        expectedLayout: ['25.034', '33.3333', '41.6326'],
        expectedItemSizes: [undefined, undefined, undefined]
    },
    {
        dataSource: [{ size: '30%' }, { }, { minSize: '30%' }],
        expectedLayout: ['31.2245', '34.3877', '34.3877'],
        expectedItemSizes: ['30%', undefined, undefined]
    },
    {
        dataSource: [{ size: '30%' }, { }, { minSize: '30%', size: '40%' }],
        expectedLayout: ['31.2245', '27.1429', '41.6326'],
        expectedItemSizes: ['30%', undefined, '40%']
    },
    {
        dataSource: [{ }, { }, { size: '20%' }],
        expectedLayout: ['39.5918', '39.5918', '20.8163'],
        expectedItemSizes: [undefined, undefined, '20%']
    },
    {
        dataSource: [{ }, { }, { minSize: '30%', size: '20%' }],
        expectedLayout: ['29.1837', '39.5918', '31.2245'],
        expectedItemSizes: [undefined, undefined, '20%']
    },
    {
        dataSource: [{ minSize: '50%' }, { }, { minSize: '30%', size: '20%' }],
        expectedLayout: ['52.0408', '16.7347', '31.2245'],
        expectedItemSizes: [undefined, undefined, '20%']
    },
    {
        dataSource: [{ size: '50%' }, { minSize: '40%' }, { minSize: '40%' }],
        expectedLayout: ['16.7347', '41.6326', '41.6326'],
        expectedItemSizes: ['50%', undefined, undefined]
    },
    {
        dataSource: [{ }, { size: '40%', minSize: '30%' }],
        expectedLayout: ['59.2', '40.8'],
        expectedItemSizes: [undefined, '40%']
    },
    {
        dataSource: [{ size: '200px', minSize: '30%' }, { }],
        expectedLayout: ['50', '50'],
        expectedItemSizes: ['200px', undefined]
    },
    {
        dataSource: [{ }, { size: '200px', minSize: '30%' }],
        expectedLayout: ['50', '50'],
        expectedItemSizes: [undefined, '200px']
    },
    {
        dataSource: [{ size: 200, minSize: '30%' }, { }],
        expectedLayout: ['50', '50'],
        expectedItemSizes: [200, undefined]
    },
    {
        dataSource: [{ size: 200, minSize: 300 }, { }],
        expectedLayout: ['75', '25'],
        expectedItemSizes: [200, undefined]
    }].forEach(({ dataSource, expectedLayout, expectedItemSizes }) => {
        QUnit.test(`render panes with minSize option, dataSource: ${JSON.stringify(dataSource)}`, function(assert) {
            this.reinit({
                width: 408,
                height: 408,
                dataSource,
                orientation: 'horizontal',
            });

            this.checkItemSizes(expectedItemSizes);
            this.assertLayout(expectedLayout);
        });
    });

    [{
        dataSource: [{ maxSize: '30%' }],
        expectedLayout: ['100'],
        expectedItemSizes: [undefined]
    }, {
        dataSource: [{ size: '40%', maxSize: '30%' }, { }],
        expectedLayout: ['30.6', '69.4'],
        expectedItemSizes: ['40%', undefined]
    }, {
        dataSource: [{ size: '20%', maxSize: '30%' }, { }],
        expectedLayout: ['20.4', '79.6'],
        expectedItemSizes: ['20%', undefined]
    }, {
        dataSource: [{ size: '40%' }, { maxSize: '30%' }],
        expectedLayout: ['69.4', '30.6'],
        expectedItemSizes: ['40%', undefined]
    }, {
        dataSource: [{ }, { maxSize: '20%' }, { }],
        expectedLayout: ['39.5918', '20.8163', '39.5918'],
        expectedItemSizes: [undefined, undefined, undefined]
    },
    // TODO: the first and second pane sizes should be distributed evenly
    {
        dataSource: [{ }, { }, { maxSize: '20%' }, { maxSize: '20%' }],
        expectedLayout: ['31.25', '26.25', '21.25', '21.25'],
        expectedItemSizes: [undefined, undefined, undefined, undefined]
    }, {
        dataSource: [{ }, { maxSize: '20%' }, { }, { maxSize: '10%' }],
        expectedLayout: ['34.0625', '21.25', '34.0625', '10.625'],
        expectedItemSizes: [undefined, undefined, undefined, undefined]
    }, {
        dataSource: [{ }, { maxSize: '20%' }, { }, { maxSize: '40%' }],
        expectedLayout: ['26.25', '21.25', '26.25', '26.25'],
        expectedItemSizes: [undefined, undefined, undefined, undefined]
    }, {
        dataSource: [{ maxSize: '20%' }, { }, { }],
        expectedLayout: ['20.8163', '39.5918', '39.5918'],
        expectedItemSizes: [undefined, undefined, undefined]
    }, {
        dataSource: [{ }, { }, { maxSize: '20%' }],
        expectedLayout: ['39.5918', '39.5918', '20.8163'],
        expectedItemSizes: [undefined, undefined, undefined]
    }, {
        dataSource: [{ maxSize: '20%' }, { size: '10%' }, { }],
        expectedLayout: ['20.8163', '10.4082', '68.7755'],
        expectedItemSizes: [undefined, '10%', undefined]
    },
    // TODO: support this scenario
    // {
    //     dataSource: [{ maxSize: '10%' }, { maxSize: '10%' }, { maxSize: '10%' }],
    //     expectedLayout: ['20', '35', '45'],
    //     expectedItemSizes: [undefined, '10%', undefined]
    // }
    ].forEach(({ dataSource, expectedLayout, expectedItemSizes }) => {
        QUnit.test(`render panes with maxSize option, dataSource: ${JSON.stringify(dataSource)}`, function(assert) {
            this.reinit({
                width: 408,
                height: 408,
                dataSource,
                orientation: 'horizontal',
            });

            this.checkItemSizes(expectedItemSizes);
            this.assertLayout(expectedLayout);
        });
    });

    [{
        resizeDistance: 100,
        dataSource: [{ size: '50%', minSize: '30%' }, { }],
        expectedLayout: ['76', '24'],
        expectedItemSizes: [304, 96]
    }, {
        resizeDistance: 100,
        dataSource: [{ size: '200px', minSize: '30%' }, { }],
        expectedLayout: ['75', '25'],
        expectedItemSizes: [300, 100]
    }, {
        resizeDistance: -100,
        dataSource: [{ }, { size: '50%', minSize: '30%' }],
        expectedLayout: ['24', '76'],
        expectedItemSizes: [96, 304]
    }, {
        resizeDistance: -100,
        dataSource: [{ }, { size: '200px', minSize: '30%' }],
        expectedLayout: ['25', '75'],
        expectedItemSizes: [100, 300]
    }, {
        resizeDistance: 100,
        dataSource: [{ }, { minSize: '40%' }],
        expectedLayout: ['59.2', '40.8'],
        expectedItemSizes: [236.797, 163.203]
    }, {
        resizeDistance: 100,
        dataSource: [{ }, { size: '60%', minSize: '40%' }],
        expectedLayout: ['59.2', '40.8'],
        expectedItemSizes: [236.797, 163.203]
    }, {
        resizeDistance: 100,
        dataSource: [{ size: '10%' }, { minSize: '40%' }],
        expectedLayout: ['35.2', '64.8'],
        expectedItemSizes: [140.797, 259.203]
    }, {
        resizeDistance: 200,
        dataSource: [{ size: '10%' }, { minSize: '40%' }],
        expectedLayout: ['59.2', '40.8'],
        expectedItemSizes: [236.797, 163.203]
    }, {
        resizeDistance: 100,
        dataSource: [{ }, { minSize: '40%' }, { }],
        expectedLayout: ['50.5441', '41.6326', '7.82258'],
        expectedItemSizes: [198.133, 163.203, 30.6641]
    }, {
        resizeDistance: -200,
        dataSource: [{ minSize: '40%', size: '50%' }, { }, { }],
        expectedLayout: ['41.6326', '34.3877', '23.9796'],
        expectedItemSizes: [163.203, 134.797, 94]
    }].forEach(({ resizeDistance, dataSource, expectedLayout, expectedItemSizes }) => {
        QUnit.test(`pane sizes with minSize option after resize, dataSource: ${JSON.stringify(dataSource)}`, function(assert) {
            this.reinit({
                width: 408,
                height: 408,
                dataSource,
                orientation: 'horizontal',
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(resizeDistance, resizeDistance).dragEnd();

            this.checkItemSizes(expectedItemSizes);
            this.assertLayout(expectedLayout);
        });
    });

    [{
        resizeDistance: 100,
        dataSource: [{ size: '50%', maxSize: '30%' }, { }],
        expectedLayout: ['30.6', '69.4'],
        expectedItemSizes: [122.398, 277.602]
    }, {
        resizeDistance: 100,
        dataSource: [{ size: '300px', maxSize: '30%' }, { }],
        expectedLayout: ['30.6', '69.4'],
        expectedItemSizes: [122.398, 277.602]
    }, {
        resizeDistance: -100,
        dataSource: [{ }, { size: '50%', maxSize: '30%' }],
        expectedLayout: ['69.4', '30.6'],
        expectedItemSizes: [277.602, 122.398]
    }, {
        resizeDistance: 100,
        dataSource: [{ size: '50%' }, { maxSize: '30%' }],
        expectedLayout: ['94.4', '5.6'],
        expectedItemSizes: [377.602, 22.3984]
    }, {
        resizeDistance: -100,
        dataSource: [{ }, { maxSize: '20%' }, { }],
        expectedLayout: ['14.0821', '20.8163', '65.1015'],
        expectedItemSizes: [55.2031, 81.6016, 255.195]
    }, {
        resizeDistance: 100,
        dataSource: [{ maxSize: '20%' }, { }, { }],
        expectedLayout: ['20.8163', '39.5918', '39.5918'],
        expectedItemSizes: [81.6016, 155.203, 155.203]
    }].forEach(({ resizeDistance, dataSource, expectedLayout, expectedItemSizes }) => {
        QUnit.test(`pane sizes with maxSize option after resize, dataSource: ${JSON.stringify(dataSource)}`, function(assert) {
            this.reinit({
                width: 408,
                height: 408,
                dataSource,
                orientation: 'horizontal',
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(resizeDistance, resizeDistance).dragEnd();

            this.checkItemSizes(expectedItemSizes);
            this.assertLayout(expectedLayout);
        });
    });

    ['horizontal', 'vertical'].forEach(orientation => {
        [{
            dataSource: [{ }],
            expectedLayout: ['100'],
            expectedItemSizes: [undefined]
        }, {
            dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
            expectedLayout: ['30', '60', '10'],
            expectedItemSizes: ['300px', '600px', '100px']
        }, {
            dataSource: [{ }, { }, { size: '248px' }, { } ],
            expectedLayout: ['25', '25', '25', '25'],
            expectedItemSizes: [undefined, undefined, '248px', undefined],
        }, {
            dataSource: [{ size: '248px' }, { }, { size: '248px' }, { } ],
            expectedLayout: ['25', '25', '25', '25'],
            expectedItemSizes: ['248px', undefined, '248px', undefined],
        }, {
            dataSource: [{ size: '248' }, { }, { size: '496px' }, { } ],
            expectedLayout: ['25', '12.5', '50', '12.5'],
            expectedItemSizes: ['248', undefined, '496px', undefined],
        }, {
            dataSource: [{ size: 252 }, { visible: false }, { } ],
            expectedLayout: ['25', '75'],
            expectedItemSizes: [252, undefined, undefined],
        }, {
            dataSource: [{ visible: false }, { visible: false }, { size: '504px' }, { } ],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [undefined, undefined, '504px', undefined],
        }, {
            dataSource: [{ visible: false }, { visible: false }, { }, { size: 504 } ],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [undefined, undefined, undefined, 504],
        }, {
            dataSource: [{ size: 126 }, { size: 126 }, { visible: false }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [126, 126, undefined],
        }, {
            dataSource: [{ size: '500' }, { size: '5000px' } ],
            expectedLayout: ['9.09091', '90.9091'],
            expectedItemSizes: ['500', '5000px'],
        }, {
            dataSource: [{ size: '5000px' }, { size: '100px' } ],
            expectedLayout: ['98.0392', '1.96078'],
            expectedItemSizes: ['5000px', '100px'],
        }, {
            dataSource: [{ size: '504232px' }, { } ],
            expectedLayout: ['100', '0'],
            expectedItemSizes: ['504232px', undefined],
        }, {
            dataSource: [ { size: 0 }, { size: 128 } ],
            expectedLayout: ['0', '100'],
            expectedItemSizes: [0, 128],
        }, {
            dataSource: [ { size: 0 }, { size: 2 } ],
            expectedLayout: ['0', '100'],
            expectedItemSizes: [0, 2],
        }, {
            dataSource: [ { size: '0px' }, { size: 128 } ],
            expectedLayout: ['0', '100'],
            expectedItemSizes: ['0px', 128],
        }, {
            dataSource: [{ size: '25%' }, { size: '25%' }, { size: '248px' }, { } ],
            expectedLayout: ['25.6048', '25.6048', '25', '23.79035'],
            expectedItemSizes: ['25%', '25%', '248px', undefined],
        }, {
            dataSource: [{ size: '50%' }, { size: '25%' }, { size: 248 }, { } ],
            expectedLayout: ['49.3952', '25.6048', '25', '0'],
            expectedItemSizes: ['50%', '25%', 248, undefined]
        }, {
            dataSource: [{ size: '30%' }, { size: '60%' }, { size: '10%' }],
            expectedLayout: ['30', '60', '10'],
            expectedItemSizes: ['30%', '60%', '10%']
        }, {
            dataSource: [{ }, { }, { }, { } ],
            expectedLayout: ['25', '25', '25', '25'],
            expectedItemSizes: [undefined, undefined, undefined, undefined]
        }, {
            dataSource: [{ }, { size: '10%' }, { }, { } ],
            expectedLayout: ['29.92', '10.24', '29.92', '29.92'],
            expectedItemSizes: [undefined, '10%', undefined, undefined]
        }, {
            dataSource: [{ size: '30%' }, { }, { size: '50%' }, { } ],
            expectedLayout: ['30.72', '9.04', '51.2', '9.04'],
            expectedItemSizes: ['30%', undefined, '50%', undefined]
        }, {
            dataSource: [{ size: '30%' }, { }, { size: '30%' } ],
            expectedLayout: ['30.4762', '39.0476', '30.4762'],
            expectedItemSizes: ['30%', undefined, '30%']
        }, {
            dataSource: [{ }, { visible: false }, { size: '50%' }, { } ],
            expectedLayout: ['24.6032', '50.7937', '24.6032'],
            expectedItemSizes: [undefined, undefined, '50%', undefined]
        }, {
            dataSource: [{ visible: false }, { visible: false }, { size: '50%' }, { } ],
            expectedLayout: ['50.3937', '49.6063'],
            expectedItemSizes: [undefined, undefined, '50%', undefined]
        }, {
            dataSource: [{ size: '40%' }, { size: '60%' }, { visible: false } ],
            expectedLayout: ['40', '60'],
            expectedItemSizes: ['40%', '60%', undefined]
        }, {
            dataSource: [{ size: '30%' }, { size: '200%' } ],
            expectedLayout: ['13.0435', '86.9565'],
            expectedItemSizes: ['30%', '200%']
        }, {
            dataSource: [{ size: '320%' }, { size: '200%' } ],
            expectedLayout: ['61.5385', '38.4615'],
            expectedItemSizes: ['320%', '200%']
        }, {
            dataSource: [{ size: '10%' }, { size: '10%' }, { visible: false }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: ['10%', '10%', undefined]
        }, {
            dataSource: [{ size: '30%' }, { size: '20%' }, { }, { size: '20%' }, { } ],
            expectedLayout: ['30.9677', '20.6452', '13.871', '20.6452', '13.871'],
            expectedItemSizes: ['30%', '20%', undefined, '20%', undefined]
        }, {
            dataSource: [{ size: '30%' }, { size: '25%' }, { size: '10%' } ],
            expectedLayout: ['46.1538', '38.4615', '15.3846'],
            expectedItemSizes: ['30%', '25%', '10%']
        }, {
            dataSource: [{ size: '30%', visible: false }, { size: '25%' }, { size: '10%' } ],
            expectedLayout: [ '71.4286', '28.5714'],
            expectedItemSizes: ['30%', '25%', '10%']
        }, {
            dataSource: [{ size: '0%' }, { size: '1%' } ],
            expectedLayout: ['0', '100'],
            expectedItemSizes: ['0%', '1%']
        }, {
            dataSource: [{ }, { size: '1%' } ],
            expectedLayout: ['99', '1'],
            expectedItemSizes: [undefined, '1%']
        }, {
            dataSource: [{ visible: false }, { }, { }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [undefined, undefined, undefined]
        }, {
            dataSource: [{ }, { visible: false }, { }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [undefined, undefined, undefined]
        }, {
            dataSource: [{ }, { }, { visible: false }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [undefined, undefined, undefined]
        },
        // TODO: incorrect synchronization
        // {
        //     dataSource: [{ size: 'auto' }, { }, { size: 'inherit' }],
        //     expectedLayout: ['50', '50', '33'],
        //     expectedItemSizes: [undefined, undefined, undefined]
        // },
        {
            dataSource: [{ }, { size: '100%' }, { }],
            expectedLayout: ['0', '100', '0'],
            expectedItemSizes: [undefined, '100%', undefined]
        },
        {
            dataSource: [{ }, { size: '150%' }, { }],
            expectedLayout: ['0', '100', '0'],
            // TODO: incorrect synchronization
            expectedItemSizes: [undefined, '150%', undefined]
        },
        // {
        //     dataSource: [{ }, { size: '50$' }, { }],
        //     expectedLayout: ['0', '100', '0'],
        //     // TODO: incorrect synchronization
        //     expectedItemSizes: [undefined, '150%', undefined]
        // },
        // TODO: 50px% should be incorrect value // check assertion
        // {
        //     dataSource: [{ }, { size: '50px%' }, { }],
        //     expectedLayout: ['24.6', '50.8', '24.6'],
        //     // TODO: incorrect synchronization
        //     expectedItemSizes: [undefined, '150%', undefined]
        // },
        // TODO: 50%px should be incorrect value // check assertion
        // {
        //     dataSource: [{ }, { size: '50%px' }, { }],
        //     expectedLayout: ['47.5', '5', '47.5'],
        //     // TODO: incorrect synchronization
        //     expectedItemSizes: [undefined, '150%', undefined]
        // },
        // TODO: 50vh shouldn't affect on layout
        // {
        //     dataSource: [{ }, { size: '50vh' }, { }],
        //     expectedLayout: ['33.333', '33.333', '33.333'],
        //     // TODO: incorrect synchronization
        //     expectedItemSizes: [undefined, '150%', undefined]
        // },
        // TODO: 10em shouldn't affect on layout
        // {
        //     dataSource: [{ }, { size: '10em' }, { }],
        //     expectedLayout: ['33.333', '33.333', '33.333'],
        //     // TODO: incorrect synchronization
        //     expectedItemSizes: [undefined, '150%', undefined]
        // },
        // TODO: 10px10px% shouldn't affect on layout
        {
            dataSource: [{ }, { size: '10px10px%' }, { }],
            expectedLayout: ['44.92', '10.16', '44.92'],
            // TODO: incorrect synchronization
            expectedItemSizes: [undefined, '10px10px%', undefined]
        },
        // TODO
        // {
        //     dataSource: [{ size: '30%' }, { size: '20%' }, { size: '300%' }, { size: '20%' }, { } ],
        //     expectedLayout: ['20', '10', '70', '20', '0'],
        //     expectedItemSizes: ['30%', '20%', '300%', '20%', undefined]
        // },
        ].forEach(({ dataSource, expectedLayout, expectedItemSizes }) => {
            QUnit.test(`pane size option, dataSource: ${JSON.stringify(dataSource)}, ${orientation} orientation`, function(assert) {
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
        QUnit.test(`pane should have an exact size if the size is specified in pixels and the root element has a border, ${orientation} orientation`, function(assert) {
            this.reinit({
                elementAttr: {
                    class: 'extra-border',
                },
                dataSource: [{ size: 400 }, { }, { }, { }],
                orientation,
            }, '#splitterInContainer');

            const dimension = orientation === 'horizontal' ? 'width' : 'height';
            assert.strictEqual(this.getPanes().eq(0).css(dimension), '400px', 'pane[0].size has exact size');

            this.checkItemSizes([400, undefined, undefined, undefined]);
            this.assertLayout(['40.8163', '19.7279', '19.7279', '19.7279']);
        });

        QUnit.test(`pane should have an exact size if the size is specified in percentages and the root element has a border, ${orientation} orientation`, function(assert) {
            const dimension = orientation === 'horizontal' ? 'width' : 'height';

            this.reinit({
                [dimension]: 620,
                elementAttr: {
                    class: 'extra-border',
                },
                dataSource: [{ size: '50%' }, { }, { }, { }],
                orientation,
            }, '#splitterInContainer');

            assert.strictEqual(this.getPanes().eq(0).css(dimension), '300px', 'pane[0].size has exact size');

            this.checkItemSizes(['50%', undefined, undefined, undefined]);
            this.assertLayout(['52.0833', '15.9722', '15.9722', '15.9722']);
        });
    });

    [{
        items: [{ collapsed: true }, {}],
        expectedLayout: ['0', '100'],
    },
    {
        items: [{}, { collapsed: true }],
        expectedLayout: ['100', '0'],
    },
    {
        items: [{ collapsed: true }, { collapsed: true }, { collapsed: true }],
        expectedLayout: ['0', '0', '0'],
    },
    {
        items: [{ size: 200 }, { collapsed: true }, { size: 200 }],
        expectedLayout: ['50', '0', '50'],
    },
    {
        items: [{ visible: false }, { collapsed: true }],
        expectedLayout: ['0', '0'],
    },
    {
        items: [{}, { visible: false }, { collapsed: true }],
        expectedLayout: ['100', '0', '0'],
    },
    {
        items: [{}, { collapsed: true }, {}],
        expectedLayout: ['50', '0', '50'],
    },
    {
        items: [{}, { collapsed: true, collapsedSize: '9.9%' }, {}],
        expectedLayout: ['45', '10', '45'],
    },
    {
        items: [{}, { collapsed: true, collapsedSize: 100 }, {}],
        expectedLayout: ['45', '10', '45'],
    },
    {
        items: [{}, { collapsed: true, collapsedSize: 100 }, { collapsed: true, collapsedSize: 100 }],
        expectedLayout: ['80', '10', '10'],
    },
    {
        items: [{ collapsed: true, collapsedSize: 100 }, {}],
        expectedLayout: ['10', '90'],
    },
    {
        items: [{}, { collapsed: true, collapsedSize: 100 }],
        expectedLayout: ['90', '10'],
    },
    {
        items: [{ collapsed: true, collapsedSize: 100 }, { visible: false }, {}],
        expectedLayout: ['10', '90'],
    },].forEach(({ items, expectedLayout }) => {
        QUnit.test(`Panes with collapsed/collapsedSize, items: ${JSON.stringify(items)}`, function(assert) {
            this.reinit({ items });

            this.assertLayout(expectedLayout);
        });
    });

    ['prev', 'next'].forEach((scenario) => {
        QUnit.test(`Pane collapse ${scenario} on runtime (without collapsedSize)`, function(assert) {
            this.reinit({
                items: [{ collapsible: true }, { collapsible: true } ],
            });

            const expectedLayout = scenario === 'prev' ? ['0', '100'] : ['100', '0'];
            const $resizeHandle = this.getResizeHandles();
            const $collapseButton = scenario === 'prev'
                ? this.getCollapsePrevButton($resizeHandle)
                : this.getCollapseNextButton($resizeHandle);

            $collapseButton.trigger('dxclick');

            this.assertLayout(expectedLayout);
        });

        QUnit.test(`Pane collapse ${scenario} on runtime (with collapsedSize)`, function(assert) {
            this.reinit({
                items: [{ collapsible: true, collapsedSize: 100 }, { collapsible: true, collapsedSize: 100 } ],
            });

            const expectedLayout = scenario === 'prev' ? ['10', '90'] : ['90', '10'];
            const $resizeHandle = this.getResizeHandles();
            const $collapseButton = scenario === 'prev'
                ? this.getCollapsePrevButton($resizeHandle)
                : this.getCollapseNextButton($resizeHandle);

            $collapseButton.trigger('dxclick');

            this.assertLayout(expectedLayout);
        });
    });

    [{
        items: [{ collapsible: true }, { collapsible: true }],
        expectedLayout: ['0', '100'],
    },
    {
        items: [{ }, { collapsible: true }],
        expectedLayout: ['100', '0'],
    },
    {
        items: [{ }, { }],
        expectedLayout: ['50', '50'],
    },
    {
        items: [{ collapsible: true, collapsed: true }, { }],
        expectedLayout: ['50', '50'],
    },
    {
        items: [{ visible: false }, { collapsible: true }, { collapsible: true }],
        expectedLayout: ['0', '100'],
    }].forEach(({ items, expectedLayout }) => {
        QUnit.test(`Panes collapse by double click: ${JSON.stringify(items)}`, function(assert) {
            this.reinit({ items });

            const $resizeHandle = this.getResizeHandles();

            $resizeHandle.trigger(DOUBLE_CLICK_EVENT);

            this.assertLayout(expectedLayout);
        });
    });

    [{
        items: [{ collapsible: true }, { collapsible: true }, { collapsible: true }],
        expectedLayout: ['0', '66.6', '33.3'],
    },
    {
        items: [{ collapsible: true, size: 98 }, { collapsible: true, size: 98 }, { collapsible: true }],
        expectedLayout: ['0', '20', '80'],
    },
    {
        items: [{ collapsible: true, visible: false }, { collapsible: true }, { collapsible: true }],
        expectedLayout: ['0', '100'],
    },
    {
        items: [{ collapsible: true, visible: false }, { collapsible: true, collapsedSize: 100 }, { collapsible: true }],
        expectedLayout: ['10', '90'],
    }].forEach(({ items, expectedLayout }) => {
        QUnit.test(`Runtime collapse (collapse prev button): ${JSON.stringify(items)}`, function(assert) {
            this.reinit({ items });

            const $resizeHandle = this.getResizeHandles().first();

            const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);

            $collapsePrevButton.trigger('dxclick');

            this.assertLayout(expectedLayout);
        });
    });

    [{
        items: [{ collapsible: true }, { collapsible: true }, { collapsible: true }],
        expectedLayout: ['66.6', '0', '33.3'],
    },
    {
        items: [{ collapsible: true, size: 98 }, { collapsible: true, size: 98 }, { collapsible: true }],
        expectedLayout: ['20', '0', '80'],
    },
    {
        items: [{ collapsible: true, visible: false }, { collapsible: true }, { collapsible: true }],
        expectedLayout: ['100', '0'],
    },
    {
        items: [{ collapsible: true, visible: false }, { collapsible: true }, { collapsible: true, collapsedSize: 100 }],
        expectedLayout: ['90', '10'],
    }
    ].forEach(({ items, expectedLayout }) => {
        QUnit.test(`Runtime collapse (collapse next button): ${JSON.stringify(items)}`, function(assert) {
            this.reinit({ items });

            const $resizeHandle = this.getResizeHandles().first();

            const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

            $collapseNextButton.trigger('dxclick');

            this.assertLayout(expectedLayout);
        });
    });

    QUnit.test('Expanded pane that was collapsed on init should take half of next pane size', function(assert) {
        this.reinit({
            items: [ { collapsible: true, }, { collapsible: true, collapsed: true }, { collapsible: true } ],
        });

        this.assertLayout(['50', '0', '50']);

        const $resizeHandle = this.getResizeHandles().first();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);

        $collapsePrevButton.trigger('dxclick');

        this.assertLayout(['25', '25', '50']);
    });

    QUnit.test('Collapsed + expanded pane should have old size', function(assert) {
        this.reinit({
            items: [ { collapsible: true, }, { collapsible: true, size: 98 }, { collapsible: true } ],
        });

        this.assertLayout(['45', '10', '45']);

        const $resizeHandle = this.getResizeHandles().first();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        $collapseNextButton.trigger('dxclick');

        this.assertLayout(['55', '0', '45']);

        $collapsePrevButton.trigger('dxclick');

        this.assertLayout(['45', '10', '45']);
    });

    QUnit.test('Collapsed + expanded pane should have 50% of next pane size if next pane is now less than cached size', function(assert) {
        this.reinit({
            items: [ { collapsible: true, }, { collapsible: true, size: 500 }, { collapsible: true } ],
        });

        this.assertLayout(['24.5', '50.8', '24.5']);

        const $resizeHandle = this.getResizeHandles().first();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        $collapsePrevButton.trigger('dxclick');

        this.assertLayout(['0', '75.4', '24.6']);

        const pointer = pointerMock(this.getResizeHandles()[1]);
        pointer.start().dragStart().drag(-500, 0).dragEnd();

        this.assertLayout(['0', '24.6', '75.4']);

        $collapseNextButton.trigger('dxclick');

        this.assertLayout(['12.3', '12.3', '75.4']);
    });

    QUnit.test('Whole layout should be repositined on collapse using api', function(assert) {
        this.reinit({
            items: [ { collapsible: true }, { collapsible: true }, { collapsible: true } ],
        });

        this.assertLayout(['33.3', '33.3', '33.3']);

        this.instance.option('items[0].collapsed', true);

        this.assertLayout(['0', '50', '50']);
    });

    QUnit.test('Pane with collapsed=true should have more priority than pane with maxSize', function(assert) {
        this.reinit({
            items: [ { collapsed: true }, { maxSize: '50%' } ],
        });

        const $leftPane = this.getPanes().first();

        assert.strictEqual($leftPane.css('width'), '0px');
    });
});

QUnit.module('Resizing', moduleConfig, () => {
    ['horizontal', 'vertical'].forEach(orientation => {
        QUnit.test(`items should be evenly distributed by default with ${orientation} orientation`, function(assert) {
            this.reinit({
                orientation,
                dataSource: [{ }, { }]
            });

            this.assertLayout(['50', '50']);
        });

        [
            { width: '100%', height: '100%' },
            { width: '100%%%', height: '100%%%' },
            { width: 600, height: 600 },
            { width: '600px', height: '600px' },
            { width: '600', height: '600' },
            { width: '600pxpx', height: '600pxpx' },
            { width: '50vw', height: '50vh' },
            { width: 'incorrect', height: 'incorrect' },
            { width: '10em', height: '10em' },
            { width: 'auto', height: 'auto' },
            { width: 'inherit', height: 'inherit' },
        ].forEach(({ width, height }) => {
            QUnit.test(`splitter, with width=${width} and height=${height}, should have its layout correctly calculated for an orientation of ${orientation}`, function(assert) {
                this.reinit({
                    width,
                    height,
                    orientation,
                    dataSource: [{ }, { }, { }]
                });

                this.assertLayout(['33.3333', '33.3333', '33.3333']);
            });
        });

        QUnit.test(`items with nested splitter should be evenly distributed by default with ${orientation} orientation`, function(assert) {
            this.reinit({
                width: 208,
                height: 208,
                orientation,
                dataSource: [{ }, { }, { }, {
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
                dataSource: [{ }, { }, { visible: false, }, { }, { }]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(-25, -25).dragEnd();

            this.assertLayout(['12.5', '37.5', '25', '25']);
        });

        QUnit.test(`last items resize should work when middle item is invisible, ${orientation} orientation`, function(assert) {
            this.reinit({
                width: 224, height: 224,
                orientation,
                dataSource: [{ }, { }, { visible: false, }, { }, { }]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(2));
            pointer.start().dragStart().drag(-25, -25).dragEnd();

            this.assertLayout(['25', '25', '12.5', '37.5']);
        });

        QUnit.test(`items should be resized when their neighbour item is not visible, ${orientation} orientation`, function(assert) {
            this.reinit({
                width: 208, height: 208,
                orientation,
                dataSource: [{ }, { visible: false, }, { },]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(50, 50).dragEnd();

            this.assertLayout(['75', '25']);
        });

        QUnit.test(`items should be resized when their neighbour item contains splitter, ${orientation} orientation`, function(assert) {
            this.reinit({
                width: '100%',
                height: '100%',
                orientation,
                dataSource: [{ }, { splitter: { dataSource: [{}, {}, {}] } }, { }, { }]
            }, '#splitterInContainer');

            this.assertLayout(['25', '25', '25', '25'], 1);

            const pointer = pointerMock(this.getResizeHandles().eq(1));
            pointer.start().dragStart().drag(50, 50).dragEnd();

            this.checkItemSizes([250, 300, 200, 250]);
            this.assertLayout(['25', '30', '20', '25']);
        });

        QUnit.test(`splitter size in percentages, pane size in pixels, layout should be calculated correctly with ${orientation} orientation`, function(assert) {
            this.reinit({
                width: '100%',
                height: '100%',
                orientation,
                dataSource: [{ size: '400px' }, { }, { }, { }]
            }, '#splitterInContainer');

            this.checkItemSizes(['400px', undefined, undefined, undefined]);
            this.assertLayout(['40', '20', '20', '20'], 1);
        });

        QUnit.test(`next item should be resized immediately when the current item is 0 during resizing, ${orientation} orientation`, function(assert) {
            this.reinit({
                width: '100%',
                height: '100%',
                orientation,
                dataSource: [{ }, { }, { }, { }]
            }, '#splitterInContainer');

            this.assertLayout(['25', '25', '25', '25'], 1);

            const pointer = pointerMock(this.getResizeHandles().eq(1));
            pointer.start().dragStart().drag(260, 260).dragEnd();

            this.checkItemSizes([250, 510, 0, 240]);
            this.assertLayout(['25', '51', '0', '24']);
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

        [
            {
                resizeHandleIndex: 1,
                resizeDistance: 500,
                dataSource: [{ }, { }, { }, { resizable: false, size: '100px' }],
                expectedLayout: ['30', '60', '0', '10'],
                expectedItemSizes: [300, 600, 0, 100]
            },
            {
                resizeHandleIndex: 1,
                resizeDistance: -500,
                dataSource: [{ resizable: false, size: '100px' }, { }, { }, { }],
                expectedLayout: ['10', '0', '60', '30'],
                expectedItemSizes: [100, 0, 600, 300]
            },
            {
                resizeHandleIndex: 0,
                resizeDistance: 800,
                dataSource: [{ }, { }, { resizable: false, size: '100px' }, { }],
                expectedLayout: ['90', '0', '10', '0'],
                expectedItemSizes: [906, 0, 100, 0]
            },
            {
                resizeHandleIndex: 2,
                resizeDistance: -800,
                dataSource: [{ }, { resizable: false, size: '100px' }, { }, { }],
                expectedLayout: ['0', '10', '0', '90'],
                expectedItemSizes: [0, 100, 0, 906]
            },
        ].forEach(({ resizeHandleIndex, resizeDistance, dataSource, expectedLayout, expectedItemSizes }) => {
            QUnit.test(`non resizable panes shouldn't change their sizes, dataSource: ${JSON.stringify(dataSource)}, ${orientation} orientation`, function(assert) {
                this.reinit({
                    width: 1018, height: 1018,
                    dataSource,
                    orientation,
                });

                const pointer = pointerMock(this.getResizeHandles().eq(resizeHandleIndex));
                pointer.start().dragStart().drag(resizeDistance, resizeDistance).dragEnd();

                this.checkItemSizes(expectedItemSizes);
                this.assertLayout(expectedLayout);
            });
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
    }, {
        resizeDistance: 50,
        expectedLayout: ['75', '25'],
        expectedItemSizes: [150, 50],
        orientation: 'vertical',
        rtl: false
    }, {
        resizeDistance: -50,
        expectedLayout: ['25', '75'],
        expectedItemSizes: [50, 150],
        orientation: 'vertical',
        rtl: false
    }, {
        resizeDistance: -100,
        expectedLayout: ['0', '100'],
        expectedItemSizes: [0, 200],
        orientation: 'vertical',
        rtl: false
    }, {
        resizeDistance: 100,
        expectedLayout: ['100', '0'],
        expectedItemSizes: [200, 0],
        orientation: 'vertical',
        rtl: false
    }, {
        resizeDistance: 75,
        expectedLayout: ['87.5', '12.5'],
        expectedItemSizes: [175, 25],
        orientation: 'vertical',
        rtl: false
    }].forEach(({ resizeDistance, expectedLayout, expectedItemSizes, orientation, rtl }) => {
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
    }, {
        resizeDistance: 50,
        expectedLayout: ['75', '25'],
        expectedItemSizes: [150, 50],
        orientation: 'vertical'
    }, {
        resizeDistance: -50,
        expectedLayout: ['25', '75'],
        expectedItemSizes: [50, 150],
        orientation: 'vertical'
    }, {
        resizeDistance: -100,
        expectedLayout: ['0', '100'],
        expectedItemSizes: [0, 200],
        orientation: 'vertical'
    }, {
        resizeDistance: 100,
        expectedLayout: ['100', '0'],
        expectedItemSizes: [200, 0],
        orientation: 'vertical'
    }, {
        resizeDistance: 75,
        expectedLayout: ['87.5', '12.5'],
        expectedItemSizes: [175, 25],
        orientation: 'vertical'
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

    QUnit.test('Changing the runtime item size option should update the layout', function(assert) {
        this.reinit({
            width: 1016, dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
        });

        this.checkItemSizes(['300px', '600px', '100px']);
        this.assertLayout(['30', '60', '10']);

        this.instance.option('items[0].size', 100);

        this.checkItemSizes([125, 750, 125]);
        this.assertLayout(['12.5', '75', '12.5']);
    });

    QUnit.test('Changing the runtime item minSize option should update the layout, if minSize > size', function(assert) {
        this.reinit({
            width: 1016, dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
        });

        this.checkItemSizes(['300px', '600px', '100px']);
        this.assertLayout(['30', '60', '10']);

        this.instance.option('items[0].minSize', 500);

        this.checkItemSizes([500, 400, 100]);
        this.assertLayout(['50', '40', '10']);
    });

    QUnit.test('Changing the runtime item minSize option should not update the layout, if minSize < size', function(assert) {
        this.reinit({
            width: 1016, dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
        });

        this.checkItemSizes(['300px', '600px', '100px']);
        this.assertLayout(['30', '60', '10']);

        this.instance.option('items[0].minSize', 100);

        this.checkItemSizes([300, 600, 100]);
        this.assertLayout(['30', '60', '10']);
    });

    QUnit.test('Changing the runtime item maxSize option should update the layout, if maxSize < size', function(assert) {
        this.reinit({
            width: 1016, dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
        });

        this.checkItemSizes(['300px', '600px', '100px']);
        this.assertLayout(['30', '60', '10']);

        this.instance.option('items[0].maxSize', 100);

        this.checkItemSizes([100, 800, 100]);
        this.assertLayout(['10', '80', '10']);
    });

    QUnit.test('Changing the runtime item maxSize option should not update the layout, if maxSize > size', function(assert) {
        this.reinit({
            width: 1016, dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
        });

        this.checkItemSizes(['300px', '600px', '100px']);
        this.assertLayout(['30', '60', '10']);

        this.instance.option('items[0].maxSize', 400);

        this.checkItemSizes([300, 600, 100]);
        this.assertLayout(['30', '60', '10']);
    });

    QUnit.test('resize should work correctly after orientation runtime change', function(assert) {
        this.reinit({
            width: 208, height: 208,
            items: [ { }, { } ],
        });

        this.instance.option('orientation', 'vertical');

        const pointer = pointerMock(this.getResizeHandles().eq(0));
        pointer.start().dragStart().drag(50, 50).dragEnd();

        this.assertLayout(['75', '25']);
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

QUnit.module('Behavior', moduleConfig, () => {
    [11, 5, 0].forEach((separatorSize) => {
        QUnit.test('Resize handle should have correct size when separatorSize is defined on init', function(assert) {
            this.reinit({
                dataSource: [{ }, { }],
                separatorSize,
            });

            const $resizeHandle = this.getResizeHandles();

            assert.strictEqual($resizeHandle.css('width'), `${separatorSize}px`);
        });
    });

    ['horizontal', 'vertical'].forEach((orientation) => {
        ['50vh', '20spx', 'd10', 'NaN', '2%', '20em', '1vw', '', ' 100px', '100px ', ' 11 ', '12', -20, NaN, null, undefined].forEach((separatorSize) => {
            QUnit.test(`Resize handle size should fallback to default if separatorSize is incorrect on init (orientation=${orientation})`, function(assert) {
                this.reinit({
                    dataSource: [{ size: '500px' }, { size: '500px' }],
                    orientation,
                    separatorSize
                });

                this.assertLayout([50, 50]);

                const $resizeHandle = this.getResizeHandles();
                const dimension = orientation === 'horizontal' ? 'width' : 'height';

                assert.strictEqual($resizeHandle.css(dimension), '8px');
            });
        });

        QUnit.test(`Resize handle size should fallback to default if separatorSize changed at runtime to incorrect value (orientation=${orientation})`, function(assert) {
            this.reinit({
                dataSource: [{ }, { }],
                orientation,
                separatorSize: 10
            });

            this.instance.option('separatorSize', '20vh');

            const $resizeHandle = this.getResizeHandles();
            const dimension = orientation === 'horizontal' ? 'width' : 'height';

            assert.strictEqual($resizeHandle.css(dimension), '8px');
        });
    });

    [true, false].forEach((allowKeyboardNavigation) => {
        QUnit.test(`Resize handle should have dx-state-active class on interaction when allowKeyboardNavigation is ${allowKeyboardNavigation}`, function(assert) {
            this.reinit({
                width: 408,
                height: 408,
                allowKeyboardNavigation,
                dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
            });

            const $resizeHandle = this.getResizeHandles().eq(0);

            const pointer = pointerMock(this.getResizeHandles().eq(0));

            pointer.start().dragStart().drag(10, 10);

            assert.ok($resizeHandle.hasClass(STATE_ACTIVE_CLASS));

            pointer.dragEnd();

            assert.notOk($resizeHandle.hasClass(STATE_ACTIVE_CLASS));
        });

        QUnit.testInActiveWindow(`The resize handle should not change its focused state after the pane collapses when allowKeyboardNavigation is ${allowKeyboardNavigation}`, function(assert) {
            this.reinit({
                width: 408,
                height: 408,
                allowKeyboardNavigation,
                dataSource: [{ text: 'Pane_1', collapsible: true }, { text: 'Pane_2' }]
            });

            const $resizeHandle = this.getResizeHandles().eq(0);

            $resizeHandle.focusin();

            assert.strictEqual($resizeHandle.hasClass(STATE_FOCUSED_CLASS), allowKeyboardNavigation);

            const $collapseButton = $resizeHandle.find(`.${RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS}`);

            $collapseButton.trigger(CLICK_EVENT);

            assert.strictEqual(this.instance.option('items[0].collapsed'), true, 'pane[0] is collapse');
            assert.strictEqual($resizeHandle.hasClass(STATE_FOCUSED_CLASS), allowKeyboardNavigation);
        });
    });

    QUnit.test('Resize handle should have correct size when separatorSize is defined on runtime', function(assert) {
        this.reinit({ dataSource: [{ }, { }] });
        this.instance.option('separatorSize', 4);

        const $resizeHandle = this.getResizeHandles();

        assert.strictEqual($resizeHandle.css('width'), '4px');
    });

    QUnit.test('Resize handle should correctly update size when orientation is changed on runtime', function(assert) {
        this.reinit({
            dataSource: [{ }, { }],
            separatorSize: 4,
        });
        const $resizeHandle = this.getResizeHandles();

        this.instance.option('orientation', 'vertical');

        assert.strictEqual($resizeHandle.css('height'), '4px');
    });

    QUnit.test('Collapse buttons should be invisible when pane collapsible is not defined', function(assert) {
        this.reinit({
            dataSource: [{ }, { }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.ok($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse prev button is invisible');
        assert.ok($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse next button is invisible');
    });

    QUnit.test('Both resize handle collapse buttons should be visible when two panes are collapsible', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true }, { collapsible: true }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.notOk($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse prev button is visible');
        assert.notOk($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse next button is visible');
    });

    QUnit.test('Only collapse prev button should be visible when only left pane is collapsible', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true }, {}],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.notOk($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse prev button is visible');
        assert.ok($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse next button is invisible');
    });

    QUnit.test('Only collapse next button should be visible when only right pane is collapsible', function(assert) {
        this.reinit({
            dataSource: [{}, { collapsible: true }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.ok($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse prev button is invisible');
        assert.notOk($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse next button is visible');
    });

    QUnit.test('Collapsible buttons should become visible on panes runtime collapsable enable', function(assert) {
        this.reinit({
            dataSource: [{}, {}],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        this.instance.option('items[0].collapsible', true);
        this.instance.option('items[1].collapsible', true);

        assert.notOk($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse prev button is visible');
        assert.notOk($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse next button is visible');
    });

    QUnit.test('Collapse prev button should be invisible (left item is collapsed on init)', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true, collapsed: true }, {}],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);

        assert.ok($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse prev button is invisible');
    });

    QUnit.test('Collapse prev button should be invisible (left item is collapsed on runtime)', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true }, {}],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);

        assert.notOk($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse prev button is visible');

        $collapsePrevButton.trigger('dxclick');

        assert.ok($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse prev button is invisible');
    });

    QUnit.test('Collapse next button should be invisible (right item is collapsed on init)', function(assert) {
        this.reinit({
            dataSource: [{ }, { collapsible: true, collapsed: true }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.ok($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse next button is invisible');
    });

    QUnit.test('Collapse next button should be invisible (right item is collapsed on runtime)', function(assert) {
        this.reinit({
            dataSource: [{ }, { collapsible: true }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.notOk($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse next button is visible');

        $collapseNextButton.trigger('dxclick');

        assert.ok($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse next button is invisible');
    });

    QUnit.test('Collapse next button should be visible (left item is collapsed, right item is not collapsible)', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true, collapsed: true }, { }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.notOk($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse next button is visible');
    });

    QUnit.test('Collapse prev button should be visible (right item is collapsed, left item is not collapsible)', function(assert) {
        this.reinit({
            dataSource: [{ }, { collapsible: true, collapsed: true }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);

        assert.notOk($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse prev button is visible');
    });

    QUnit.test('Collapse prev button should not be visible (left item is collapsed, right item is collapsed)', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true, collapsed: true }, { collapsible: true, collapsed: true }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);

        assert.ok($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse prev button is invisible');
    });

    QUnit.test('Collapse next button should not be visible (left item is collapsed, right item is collapsed)', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true, collapsed: true }, { collapsible: true, collapsed: true }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.ok($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), 'collapse next button is invisible');
    });

    ['left', 'right'].forEach((item) => {
        QUnit.test(`Resize handle icon should be invisible (${item} item is collapsed on init)`, function(assert) {
            this.reinit({
                dataSource: [{ collapsed: item === 'left' }, { collapsed: item === 'right' }],
            });
            const $resizeHandle = this.getResizeHandles();
            const $resizeHandleIcon = this.getResizeHandleIcon($resizeHandle);

            assert.ok($resizeHandleIcon.hasClass(STATE_INVISIBLE_CLASS), 'resize handle icon is invisible');
        });

        QUnit.test(`Resize handle icon should be invisible (${item} item is collapsed on runtime)`, function(assert) {
            this.reinit({
                dataSource: [{ collapsible: true }, { collapsible: true }],
            });
            const $resizeHandle = this.getResizeHandles();
            const $resizeHandleIcon = this.getResizeHandleIcon($resizeHandle);
            const $collapseButton = item === 'left'
                ? this.getCollapsePrevButton($resizeHandle)
                : this.getCollapseNextButton($resizeHandle);

            assert.notOk($resizeHandleIcon.hasClass(STATE_INVISIBLE_CLASS), 'resize handle icon is visible');

            $collapseButton.trigger('dxclick');

            assert.ok($resizeHandleIcon.hasClass(STATE_INVISIBLE_CLASS), 'resize handle icon is invisible');
        });
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

            const pointer = pointerMock(this.getResizeHandles(false).eq(0));

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


            const pointer = pointerMock(this.getResizeHandles(false).eq(0));

            pointer.start().dragStart().drag(0, 50).dragEnd();

            this.instance.option(eventHandler, handlerStubAfterUpdate);

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(handlerStub.callCount, 1);
            assert.strictEqual(handlerStubAfterUpdate.callCount, 1);
        });

        QUnit.test(`${eventHandler} should have correct argument fields`, function(assert) {
            assert.expect(6);

            this.reinit({
                [eventHandler]: ({ component, element, event, handleElement }) => {
                    const $resizeHandle = this.getResizeHandles();

                    assert.strictEqual(component, this.instance, 'component field is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                    assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                    assert.strictEqual($(event.target).get(0), $resizeHandle.get(0), 'event field is correct');
                    assert.strictEqual(isRenderer(handleElement), !!config().useJQuery, 'handleElement is correct');
                    assert.strictEqual($(handleElement).is($resizeHandle), true, 'handleElement field is correct');
                },
                dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));

            pointer.start().dragStart().drag(0, 50).dragEnd();
        });
    });

    QUnit.test('onItemCollapsed should be called on collapse prev button click (right pane is not collapsed)', function(assert) {
        const onItemCollapsed = sinon.stub();
        const onItemExpanded = sinon.stub();

        this.reinit({
            onItemCollapsed,
            onItemExpanded,
            dataSource: [{ collapsible: true }, { collapsible: true }]
        });

        const $collapsePrevButton = this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS}`);

        $collapsePrevButton.trigger('dxclick');

        assert.strictEqual(onItemCollapsed.callCount, 1, 'onItemCollapsed called');
        assert.strictEqual(onItemExpanded.callCount, 0, 'onItemExpanded not called');
    });

    QUnit.test('onItemExpanded should be called on collapse prev button click (right pane is collapsed)', function(assert) {
        const onItemCollapsed = sinon.stub();
        const onItemExpanded = sinon.stub();

        this.reinit({
            onItemCollapsed,
            onItemExpanded,
            dataSource: [{ collapsible: true }, { collapsed: true, collapsible: true }]
        });

        const $collapsePrevButton = this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS}`);

        $collapsePrevButton.trigger('dxclick');

        assert.strictEqual(onItemCollapsed.callCount, 0, 'onItemCollapsed not called');
        assert.strictEqual(onItemExpanded.callCount, 1, 'onItemExpanded called');
    });

    QUnit.test('onItemCollapsed should be called on collapse next button click (left pane is not collapsed)', function(assert) {
        const onItemCollapsed = sinon.stub();
        const onItemExpanded = sinon.stub();

        this.reinit({
            onItemCollapsed,
            onItemExpanded,
            dataSource: [{ collapsible: true }, { collapsible: true }]
        });

        const $collapseNextButton = this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS}`);

        $collapseNextButton.trigger('dxclick');

        assert.strictEqual(onItemCollapsed.callCount, 1, 'onItemCollapsed called');
        assert.strictEqual(onItemExpanded.callCount, 0, 'onItemExpanded not called');
    });

    QUnit.test('onItemExpanded should be called on collapse next button click (left pane is collapsed)', function(assert) {
        const onItemCollapsed = sinon.stub();
        const onItemExpanded = sinon.stub();

        this.reinit({
            onItemCollapsed,
            onItemExpanded,
            dataSource: [{ collapsed: true, collapsible: true }, { collapsible: true }]
        });

        const $collapseNextButton = this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS}`);

        $collapseNextButton.trigger('dxclick');

        assert.strictEqual(onItemCollapsed.callCount, 0, 'onItemCollapsed not called');
        assert.strictEqual(onItemExpanded.callCount, 1, 'onItemExpanded called');
    });

    QUnit.test('onItemCollapsed should be called on pane collapsing by double click', function(assert) {
        const onItemCollapsed = sinon.stub();
        const onItemExpanded = sinon.stub();

        this.reinit({
            onItemCollapsed,
            onItemExpanded,
            dataSource: [{ collapsible: true }, { collapsible: true }]
        });

        const $resizeHandle = this.getResizeHandles();

        $resizeHandle.trigger(DOUBLE_CLICK_EVENT);

        assert.strictEqual(onItemCollapsed.callCount, 1, 'onItemCollapsed not called');
        assert.strictEqual(onItemExpanded.callCount, 0, 'onItemExpanded called');
    });

    QUnit.test('onItemExpanded should be called on pane expanding by double click', function(assert) {
        const onItemCollapsed = sinon.stub();
        const onItemExpanded = sinon.stub();

        this.reinit({
            onItemCollapsed,
            onItemExpanded,
            dataSource: [{ collapsed: true, collapsible: true }, { collapsible: true }]
        });

        const $resizeHandle = this.getResizeHandles();

        $resizeHandle.trigger(DOUBLE_CLICK_EVENT);

        assert.strictEqual(onItemCollapsed.callCount, 0, 'onItemCollapsed not called');
        assert.strictEqual(onItemExpanded.callCount, 1, 'onItemExpanded called');
    });

    QUnit.test('Two clicks on collapse buttons should not trigger double click event on resizeHandle', function(assert) {
        const doubleClickStub = sinon.stub();

        this.reinit({
            dataSource: [{ collapsible: true }, { collapsible: true }]
        });

        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        $resizeHandle.on(DOUBLE_CLICK_EVENT, doubleClickStub);

        $collapsePrevButton.trigger('dxclick');
        $collapseNextButton.trigger('dxclick');

        assert.strictEqual(doubleClickStub.callCount, 0, 'double click event is not triggered');
    });

    ['left', 'right'].forEach((item) => {
        QUnit.test(`onItemCollapsed should have correct argument fields on ${item} item collapse`, function(assert) {
            assert.expect(8);

            this.reinit({
                onItemCollapsed: (e) => {
                    const { component, element, event, itemData, itemElement, itemIndex } = e;

                    const $resizeHandle = this.getResizeHandles();
                    const $items = this.$element.find(`.${SPLITTER_ITEM_CLASS}`);
                    const $item = item === 'left' ? $items.first() : $items.last();

                    assert.strictEqual(component, this.instance, 'component field is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                    assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                    assert.strictEqual($(event.target).parent().get(0), $resizeHandle.get(0), 'target event field is correct');
                    assert.strictEqual(isRenderer(itemElement), !!config().useJQuery, 'itemElement is correct');
                    assert.strictEqual($(itemElement).is($item), true, 'itemElement field is correct');
                    assert.deepEqual(itemData, { collapsed: true, size: 0, collapsible: true }, 'itemData field is correct');
                    assert.strictEqual(itemIndex, item === 'left' ? 0 : 1, 'itemIndex is correct');
                },
                dataSource: [{ collapsible: true, }, { collapsible: true, }]
            });

            const $collapseButton = this.$element.find(`.${item === 'left' ? RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS : RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS}`);

            $collapseButton.trigger('dxclick');
        });

        QUnit.test(`onItemExpanded should have correct argument fields on ${item} item expand`, function(assert) {
            assert.expect(8);

            this.reinit({
                onItemExpanded: ({ component, element, event, itemData, itemElement, itemIndex }) => {
                    const $resizeHandle = this.getResizeHandles();
                    const $items = this.$element.find(`.${SPLITTER_ITEM_CLASS}`);
                    const $item = item === 'left' ? $items.first() : $items.last();

                    assert.strictEqual(component, this.instance, 'component field is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                    assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                    assert.strictEqual($(event.target).parent().is($resizeHandle), true, 'event field is correct');
                    assert.strictEqual(isRenderer(itemElement), !!config().useJQuery, 'itemElement is correct');
                    assert.strictEqual($(itemElement).is($item), true, 'itemElement field is correct');
                    assert.strictEqual(itemData.collapsed, false, 'itemData is correct');
                    assert.strictEqual(itemIndex, item === 'left' ? 0 : 1, 'itemIndex');
                },
                dataSource: [{ collapsed: item === 'left', collapsible: true }, { collapsed: item === 'right', collapsible: true }]
            });

            const $collapseButton = this.$element.find(`.${item === 'right' ? RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS : RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS}`);

            $collapseButton.trigger('dxclick');
        });
    });

    ['onItemCollapsed', 'onItemExpanded'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} event handler should be able to be updated at runtime`, function(assert) {
            const handlerStub = sinon.stub();
            const handlerStubAfterUpdate = sinon.stub();

            this.reinit({
                [eventHandler]: handlerStub,
                dataSource: [{ collapsible: true }, { collapsible: true }]
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

    QUnit.test('onResizeStart event should be cancellable', function(assert) {
        let resizeEvent;
        this.reinit({
            width: 408,
            height: 408,
            dataSource: [{ size: '200px', }, { size: '200px' }],
            onResizeStart: function(e) {
                resizeEvent = e;
                e.cancel = true;
            },
        });

        const pointer = pointerMock(this.getResizeHandles().eq(0));
        pointer.start().dragStart();

        assert.true(resizeEvent.event.cancel);
    });

    QUnit.test('onResize event should be cancellable', function(assert) {
        let resizeEvent;
        this.reinit({
            width: 408,
            height: 408,
            dataSource: [{ size: '200px', }, { size: '200px' }],
            onResize: function(e) {
                resizeEvent = e;
                e.cancel = true;
            },
        });

        const pointer = pointerMock(this.getResizeHandles().eq(0));
        pointer.start().dragStart().drag(100, 100).dragEnd();

        this.checkItemSizes([200, 200]);
        this.assertLayout([50, 50]);
        assert.true(resizeEvent.event.cancel);
    });

    QUnit.test('onResizeEnd event should be cancellable', function(assert) {
        let resizeEvent;
        this.reinit({
            width: 408,
            height: 408,
            dataSource: [{ size: '200px', }, { size: '200px' }],
            onResizeEnd: function(e) {
                resizeEvent = e;
                e.cancel = true;
            },
        });

        const pointer = pointerMock(this.getResizeHandles().eq(0));
        pointer.start().dragStart().drag(100, 100).dragEnd();

        const firstPaneSize = this.instance.option('items[0].size');
        const secondPaneSize = this.instance.option('items[1].size');

        assert.strictEqual(firstPaneSize, '200px');
        assert.strictEqual(secondPaneSize, '200px');
        assert.true(resizeEvent.event.cancel);
    });
});

QUnit.module('Nested Splitters', moduleConfig, () => {
    QUnit.test('panes should be rendered after the rendering of all the panes of the parent splitter', function(assert) {
        const onItemRenderedHandler = sinon.stub();
        this.reinit({
            width: 890,
            height: 600,
            allowKeyboardNavigation: false,
            onItemRendered: onItemRenderedHandler,
            items: [
                {
                    size: '140px',
                    text: 'Pane_1',
                }, {
                    text: 'Pane_2',
                    splitter: {
                        orientation: 'vertical',
                        items: [
                            {
                                size: '50%',
                                text: 'Pane_2_1',
                                splitter: {
                                    orientation: 'horizontal',
                                    items: [
                                        {
                                            size: '50%',
                                            text: 'Pane_2_1_1',
                                        },
                                        {
                                            text: 'Pane_2_1_2',
                                        },
                                        {
                                            minSize: '5%',
                                            text: 'Pane_2_1_3',
                                        },
                                    ],
                                },
                            },
                            {
                                text: 'Pane_2_2',
                            },
                            {
                                text: 'Pane_2_3',
                                splitter: {
                                    orientation: 'horizontal',
                                    items: [
                                        { text: 'Pane_2_3_1' },
                                        { text: 'Pane_2_3_2' },
                                        {
                                            size: '300px',
                                            text: 'Pane_2_3_3',
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                }, {
                    size: '140px',
                    resizable: false,
                    collapsible: false,
                    text: 'Pane_3',
                },
            ],
        });

        const expectedPaneRenderingOrder = [
            { text: 'Pane_1', width: 140, height: 600 },
            { text: 'Pane_2', width: 600, height: 600 },
            { text: 'Pane_3', width: 140, height: 600 },
            { text: 'Pane_2_1', width: 600, height: 300 },
            { text: 'Pane_2_2', width: 600, height: 142 },
            { text: 'Pane_2_3', width: 600, height: 142 },
            { text: 'Pane_2_1_1', width: 300, height: 300 },
            { text: 'Pane_2_1_2', width: 142, height: 300 },
            { text: 'Pane_2_1_3', width: 142, height: 300 },
            { text: 'Pane_2_3_1', width: 142, height: 142 },
            { text: 'Pane_2_3_2', width: 142, height: 142 },
            { text: 'Pane_2_3_3', width: 300, height: 142 }
        ];

        assert.strictEqual(onItemRenderedHandler.callCount, 12, 'onItemRenderedHandler.callCount');

        onItemRenderedHandler.args.forEach((event, index) => {
            assert.strictEqual(event[0].itemData.text, expectedPaneRenderingOrder[index].text, `Pane[${index + 1}].text`);
            assert.strictEqual($(event[0].itemElement).width(), expectedPaneRenderingOrder[index].width, `Pane[${index + 1}].width`);
            assert.strictEqual($(event[0].itemElement).height(), expectedPaneRenderingOrder[index].height, `Pane[${index + 1}].height`);
        });
    });

    ['onResizeStart', 'onResize', 'onResizeEnd'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} should be invoked when a handle in the nested splitter is dragged`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            this.reinit({
                [eventHandler]: resizeHandlerStub,
                items: [{
                    splitter: {
                        dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
                    }
                }]
            });

            const pointer = pointerMock(this.getResizeHandles(false)[0]);

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 1);
        });

        // TODO: repair this scenario
        QUnit.skip(`${eventHandler} should be called when a handle in the nested splitter is dragged, ${eventHandler} has been changed at runtime`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            const newResizeHandlerStub = sinon.stub();

            this.reinit({
                [eventHandler]: resizeHandlerStub,
                items: [{
                    splitter: {
                        dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
                    }
                }]
            });

            this.instance.option(`${eventHandler}`, newResizeHandlerStub);

            const pointer = pointerMock(this.getResizeHandles(false)[0]);

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 0);
            assert.strictEqual(newResizeHandlerStub.callCount, 1);
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

            const pointer = pointerMock(this.getResizeHandles(false)[0]);

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 0);
            assert.strictEqual(nestedSplitterResizeHandlerStub.callCount, 1);
        });

        // TODO: repair this scenario
        QUnit.skip(`nestedSplitter.${eventHandler} event handler should be able to be updated at runtime`, function(assert) {
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

            let pointer = pointerMock(this.getResizeHandles(false).get(0));

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(handlerStub.callCount, 1);
            assert.strictEqual(handlerStubAfterUpdate.callCount, 0);
            handlerStub.reset();

            this.instance.option(`items[0].splitter.${eventHandler}`, handlerStubAfterUpdate);

            pointer = pointerMock(this.getResizeHandles(false)[0]);
            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(handlerStub.callCount, 0);
            assert.strictEqual(handlerStubAfterUpdate.callCount, 1);
        });
    });

    QUnit.test('itemRendered callback should be called when the panes of a nested splitter are rendered', function(assert) {
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

    QUnit.test('the nested splitter\'s itemRendered should be called instead of the parent\'s itemRendered', function(assert) {
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

    [
        { key: 'ArrowLeft', orientation: 'horizontal', wrongKey: 'ArrowUp' },
        { key: 'ArrowUp', orientation: 'vertical', wrongKey: 'ArrowLeft' }
    ].forEach(({ key, orientation, wrongKey }) => {
        QUnit.test(`Prev item should be collapsed on command+${key} (orientation=${orientation})`, function(assert) {
            this.reinit({
                orientation,
                items: [{ collapsible: true }, { }],
            });

            const $resizeHandle = this.getResizeHandles();
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(key, { ctrlKey: true });

            assert.strictEqual(this.instance.option('items[0].collapsed'), true, 'item is collapsed');
        });

        QUnit.test(`Prev item should not be collapsed on command+${wrongKey} (orientation=${orientation})`, function(assert) {
            this.reinit({
                orientation,
                items: [{ collapsible: true }, { }],
            });

            const $resizeHandle = this.getResizeHandles();
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(wrongKey, { ctrlKey: true });

            assert.strictEqual(this.instance.option('items[0].collapsed'), undefined, 'item is not collapsed');
        });

        QUnit.test(`Prev item should not be collapsed on command+${wrongKey} if pane is not collapsible`, function(assert) {
            this.reinit({
                orientation,
                items: [{ }, { }],
            });

            const $resizeHandle = this.getResizeHandles();
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(wrongKey, { ctrlKey: true });

            assert.strictEqual(this.instance.option('items[0].collapsed'), undefined, 'item is not collapsed');
        });

        QUnit.test(`onItemCollapsed should be fired on command+${key} (orientation=${orientation})`, function(assert) {
            const onItemCollapsed = sinon.stub();
            this.reinit({
                orientation,
                onItemCollapsed,
                items: [{ collapsible: true }, { }],
            });

            const $resizeHandle = this.getResizeHandles();
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(key, { ctrlKey: true });

            assert.strictEqual(onItemCollapsed.callCount, 1, 'onItemCollapsed fired');
        });

        QUnit.test(`onItemCollapsed should not be fired on command+${key} when item is already collapsed`, function(assert) {
            const onItemCollapsed = sinon.stub();
            this.reinit({
                orientation,
                onItemCollapsed,
                items: [{ collapsible: true, collapsed: true }, { }],
            });

            const $resizeHandle = this.getResizeHandles();
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(key, { ctrlKey: true });

            assert.strictEqual(onItemCollapsed.callCount, 0, 'onItemCollapsed fired');
        });
    });

    [
        { key: 'ArrowRight', orientation: 'horizontal', wrongKey: 'ArrowDown' },
        { key: 'ArrowDown', orientation: 'vertical', wrongKey: 'ArrowRight' }
    ].forEach(({ key, orientation, wrongKey }) => {
        QUnit.test(`Next item should be collapsed on command+${key} (orientation=${orientation})`, function(assert) {
            this.reinit({
                orientation,
                items: [{ }, { collapsible: true }],
            });

            const $resizeHandle = this.getResizeHandles();
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(key, { ctrlKey: true });

            assert.strictEqual(this.instance.option('items[1].collapsed'), true, 'item is collapsed');
        });

        QUnit.test(`Next item should not be collapsed on command+${wrongKey} (orientation=${orientation})`, function(assert) {
            this.reinit({
                orientation,
                items: [{ }, { collapsible: true }],
            });

            const $resizeHandle = this.getResizeHandles();
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(wrongKey, { ctrlKey: true });

            assert.strictEqual(this.instance.option('items[1].collapsed'), undefined, 'item is not collapsed');
        });

        QUnit.test(`onItemCollapsed should be fired on command+${key} (orientation=${orientation})`, function(assert) {
            const onItemCollapsed = sinon.stub();
            this.reinit({
                orientation,
                onItemCollapsed,
                items: [{ }, { collapsible: true }],
            });

            const $resizeHandle = this.getResizeHandles();
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(key, { ctrlKey: true });

            assert.strictEqual(onItemCollapsed.callCount, 1, 'onItemCollapsed fired');
        });
    });
});
