import $ from 'jquery';
import Splitter from 'ui/splitter';
import fx from 'common/core/animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import { isRenderer, isNumeric } from 'core/utils/type';
import config from 'core/config';
import { createEvent } from 'common/core/events/utils/index';
import { name as DOUBLE_CLICK_EVENT } from 'common/core/events/double_click';
import { name as CLICK_EVENT } from 'common/core/events/click';

import 'generic_light.css!';

const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const SPLITTER_ITEM_HIDDEN_CONTENT_CLASS = 'dx-splitter-item-hidden-content';
const RESIZE_HANDLE_CLASS = 'dx-resize-handle';
const RESIZE_HANDLE_ICON_CLASS = 'dx-resize-handle-icon';
const RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS = 'dx-resize-handle-collapse-prev-pane';
const RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS = 'dx-resize-handle-collapse-next-pane';
const STATE_INVISIBLE_CLASS = 'dx-state-invisible';
const STATE_ACTIVE_CLASS = 'dx-state-active';
const STATE_FOCUSED_CLASS = 'dx-state-focused';
const SPLITTER_CLASS = 'dx-splitter';

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

        const init = (options = { }, selector = '#splitter') => {
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

        this.checkItemsOption = ($items, optionName, optionValue) => {
            for(let i = 0; i < $items.length; i++) {
                const nestedSplitterInstance = $items.eq(i).dxSplitter('instance');

                QUnit.assert.strictEqual(nestedSplitterInstance.option(optionName), optionValue);
            }
        };

        this.getNestedSplitter = (splitterElement) => {
            return splitterElement.find(`.${SPLITTER_CLASS}`);
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
        expectedItemSizes: [408]
    }, {
        dataSource: [{ size: '40%', minSize: '30%' }, { }],
        expectedLayout: ['40.8', '59.2'],
        expectedItemSizes: [163.203, 236.797]
    }, {
        dataSource: [{ minSize: '30%' }, { }, { }],
        expectedLayout: ['33.3333', '33.3333', '33.3333'],
        expectedItemSizes: [130.664, 130.664, 130.664]
    }, {
        dataSource: [{ minSize: '40%' }, { }, { }],
        expectedLayout: ['41.6327', '25.034', '33.3333'],
        expectedItemSizes: [163.203, 98.1328, 130.664]
    }, {
        dataSource: [{ }, { minSize: '40%' }, { }],
        expectedLayout: ['25.034', '41.6327', '33.3333'],
        expectedItemSizes: [98.1328, 163.203, 130.664]
    }, {
        dataSource: [{ }, { }, { minSize: '40%' }],
        expectedLayout: ['25.034', '33.3333', '41.6327'],
        expectedItemSizes: [98.1328, 130.664, 163.203]
    }, {
        dataSource: [{ size: '30%' }, { }, { minSize: '30%' }],
        expectedLayout: ['31.2245', '34.3878', '34.3878'],
        expectedItemSizes: [122.398, 134.797, 134.797]
    }, {
        dataSource: [{ size: '30%' }, { }, { minSize: '30%', size: '40%' }],
        expectedLayout: ['31.2245', '27.1429', '41.6327'],
        expectedItemSizes: [122.398, 106.398, 163.203]
    }, {
        dataSource: [{ }, { }, { size: '20%' }],
        expectedLayout: ['39.5918', '39.5918', '20.8163'],
        expectedItemSizes: [155.203, 155.203, 81.6016]
    }, {
        dataSource: [{ }, { }, { minSize: '30%', size: '20%' }],
        expectedLayout: ['29.1837', '39.5918', '31.2245'],
        expectedItemSizes: [114.398, 155.203, 122.398]
    }, {
        dataSource: [{ minSize: '50%' }, { }, { minSize: '30%', size: '20%' }],
        expectedLayout: ['52.0408', '16.7347', '31.2245'],
        expectedItemSizes: [204, 65.6016, 122.398]
    }, {
        dataSource: [{ size: '50%' }, { minSize: '40%' }, { minSize: '40%' }],
        expectedLayout: ['16.7347', '41.6327', '41.6327'],
        expectedItemSizes: [65.6016, 163.203, 163.203]
    }, {
        dataSource: [{ }, { size: '40%', minSize: '30%' }],
        expectedLayout: ['59.2', '40.8'],
        expectedItemSizes: [236.797, 163.203]
    }, {
        dataSource: [{ size: '200px', minSize: '30%' }, { }],
        expectedLayout: ['50', '50'],
        expectedItemSizes: [200, 200]
    }, {
        dataSource: [{ }, { size: '200px', minSize: '30%' }],
        expectedLayout: ['50', '50'],
        expectedItemSizes: [200, 200]
    }, {
        dataSource: [{ size: 200, minSize: '30%' }, { }],
        expectedLayout: ['50', '50'],
        expectedItemSizes: [200, 200]
    }, {
        dataSource: [{ size: 200, minSize: 300 }, { }],
        expectedLayout: ['75', '25'],
        expectedItemSizes: [300, 100]
    }, {
        dataSource: [{ minSize: '70%' }, { minSize: 100 }, { minSize: 100 }],
        expectedLayout: ['72.8571', '25.5102', '25.5102'],
        expectedItemSizes: [230.547, 80.7266, 80.7266]
    }, {
        dataSource: [{ minSize: '50%' }, { minSize: 100 }, { minSize: 100 }],
        expectedLayout: ['52.0408', '25.5102', '25.5102'],
        expectedItemSizes: [197.938, 97.0312, 97.0312]
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

    [
        {
            dataSource: [{ maxSize: '30%' }],
            expectedLayout: ['100'],
            expectedItemSizes: [408]
        }, {
            dataSource: [{ size: '40%', maxSize: '30%' }, { }],
            expectedLayout: ['30.6', '69.4'],
            expectedItemSizes: [122.398, 277.602]
        }, {
            dataSource: [{ size: '20%', maxSize: '30%' }, { }],
            expectedLayout: ['20.4', '79.6'],
            expectedItemSizes: [81.6016, 318.398]
        }, {
            dataSource: [{ size: '40%' }, { maxSize: '30%' }],
            expectedLayout: ['69.4', '30.6'],
            expectedItemSizes: [277.602, 122.398]
        }, {
            dataSource: [{ }, { maxSize: '20%' }, { }],
            expectedLayout: ['39.5918', '20.8163', '39.5918'],
            expectedItemSizes: [155.203, 81.6016, 155.203]
        }, {
            dataSource: [{ }, { }, { maxSize: '20%' }, { maxSize: '20%' }],
            expectedLayout: ['28.75', '28.75', '21.25', '21.25'],
            expectedItemSizes: [110.398, 110.398, 81.6016, 81.6016]
        }, {
            dataSource: [{ }, { maxSize: '20%' }, { }, { maxSize: '10%' }],
            expectedLayout: ['34.0625', '21.25', '34.0625', '10.625'],
            expectedItemSizes: [130.797, 81.6016, 130.797, 40.7969]
        }, {
            dataSource: [{ }, { maxSize: '20%' }, { }, { maxSize: '40%' }],
            expectedLayout: ['26.25', '21.25', '26.25', '26.25'],
            expectedItemSizes: [100.797, 81.6016, 100.797, 100.797]
        }, {
            dataSource: [{ maxSize: '20%' }, { }, { }],
            expectedLayout: ['20.8163', '39.5918', '39.5918'],
            expectedItemSizes: [81.6016, 155.203, 155.203]
        }, {
            dataSource: [{ }, { }, { maxSize: '20%' }],
            expectedLayout: ['39.5918', '39.5918', '20.8163'],
            expectedItemSizes: [155.203, 155.203, 81.6016]
        }, {
            dataSource: [{ maxSize: '20%' }, { size: '10%' }, { }],
            expectedLayout: ['20.8163', '10.4082', '68.7755'],
            expectedItemSizes: [81.6016, 40.7969, 269.602]
        }, {
            dataSource: [{ maxSize: '10%' }, { maxSize: '10%' }, { maxSize: '10%' }],
            expectedLayout: ['10.4082', '10.4082', '79.1837'],
            expectedItemSizes: [40.7969, 40.7969, 310.398]
        }].forEach(({ dataSource, expectedLayout, expectedItemSizes }) => {
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
        expectedLayout: ['50.5442', '41.6327', '7.82313'],
        expectedItemSizes: [198.133, 163.203, 30.6641]
    }, {
        resizeDistance: -200,
        dataSource: [{ minSize: '40%', size: '50%' }, { }, { }],
        expectedLayout: ['41.6327', '34.3878', '23.9796'],
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
        expectedLayout: ['14.0816', '20.8163', '65.102'],
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
            expectedItemSizes: [1016]
        }, {
            dataSource: [{ size: '100%' }, { }],
            expectedLayout: ['100', '0'],
            expectedItemSizes: [1008, 0]
        }, {
            dataSource: [{ size: '200', visible: false }],
            expectedLayout: ['0'],
            expectedItemSizes: [0]
        }, {
            dataSource: [{ size: '100%' }, { visible: false }],
            expectedLayout: ['100', '0'],
            expectedItemSizes: [1016, 0]
        }, {
            dataSource: [{ size: '100%%' }, { }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504],
        }, {
            dataSource: [{ size: '1%00' }, { }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504],
        }, {
            dataSource: [{ size: 'incorrect' }, { }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504],
        }, {
            dataSource: [{ }, { size: '50$' }, { size: '50%px' }],
            expectedLayout: ['33.3333', '33.3333', '33.3333'],
            expectedItemSizes: [333.336, 333.336, 333.336]
        }, {
            dataSource: [{ size: '600px' }, { }],
            expectedLayout: ['59.5238', '40.4762'],
            expectedItemSizes: [600, 408],
        }, {
            dataSource: [{ size: '60px0pxpx' }, { }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504],
        }, {
            dataSource: [{ }, { size: '10px10px%' }, { }],
            expectedLayout: ['33.3333', '33.3333', '33.3333'],
            expectedItemSizes: [333.336, 333.336, 333.336]
        }, {
            dataSource: [{ size: '600' }, { }],
            expectedLayout: ['59.5238', '40.4762'],
            expectedItemSizes: [600, 408],
        }, {
            dataSource: [{ size: '600$' }, { }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504],
        }, {
            dataSource: [{ size: -600 }, { }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504],
        }, {
            dataSource: [{ size: '-600' }, { }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504],
        }, {
            dataSource: [{ size: '-600px' }, { }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504],
        }, {
            dataSource: [{ size: NaN }, { }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504],
        }, {
            dataSource: [{ size: 10e1 }, { }],
            expectedLayout: ['9.92063', '90.0794'],
            expectedItemSizes: [100, 908],
        }, {
            dataSource: [{ size: Infinity }, { size: -Infinity }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504],
        }, {
            dataSource: [{ size: '10em' }, { size: '50vh' }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504],
        }, {
            dataSource: [{ size: 'auto' }, { size: 'inherit' }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504],
        }, {
            dataSource: [{ visible: false }, { }, { size: '100%' }, { }],
            expectedLayout: ['0', '0', '100', '0'],
            expectedItemSizes: [0, 0, 1000, 0]
        }, {
            dataSource: [{ size: null }, { }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504]
        }, {
            dataSource: [{ size: '300%' }],
            expectedLayout: ['100'],
            expectedItemSizes: [1016]
        }, {
            dataSource: [{ size: '50%' }, { size: '300%' }],
            expectedLayout: ['50.3968', '49.6032'],
            expectedItemSizes: [508, 500]
        }, {
            dataSource: [{ size: '50%' }, { size: 200 }, { size: '300%' }],
            expectedLayout: ['50.8', '20', '29.2'],
            expectedItemSizes: [508, 200, 292]
        }, {
            dataSource: [{ size: '50%' }, { minSize: 200, size: 100 }, { size: '300%' }],
            expectedLayout: ['40.8', '20', '39.2'],
            expectedItemSizes: [408, 200, 392]
        }, {
            dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
            expectedLayout: ['30', '60', '10'],
            expectedItemSizes: ['300', '600', '100']
        }, {
            dataSource: [{ }, { }, { size: '248px' }, { }],
            expectedLayout: ['25', '25', '25', '25'],
            expectedItemSizes: [248, 248, 248, 248],
        }, {
            dataSource: [{ size: '248px' }, { }, { size: '248px' }, { }],
            expectedLayout: ['25', '25', '25', '25'],
            expectedItemSizes: [248, 248, 248, 248],
        }, {
            dataSource: [{ size: '248' }, { }, { size: '496px' }, { }],
            expectedLayout: ['25', '12.5', '50', '12.5'],
            expectedItemSizes: [248, 124, 496, 124],
        }, {
            dataSource: [{ size: 252 }, { visible: false }, { }],
            expectedLayout: ['25', '0', '75'],
            expectedItemSizes: [252, 0, 756],
        }, {
            dataSource: [{ visible: false }, { visible: false }, { size: '504px' }, { }],
            expectedLayout: ['0', '0', '50', '50'],
            expectedItemSizes: [0, 0, 504, 504],
        }, {
            dataSource: [{ visible: false }, { visible: false }, { }, { size: 504 }],
            expectedLayout: ['0', '0', '50', '50'],
            expectedItemSizes: [0, 0, 504, 504],
        }, {
            dataSource: [{ size: 126 }, { size: 126 }, { visible: false }],
            expectedLayout: ['12.5', '87.5', '0'],
            expectedItemSizes: [126, 882, 0],
        }, {
            dataSource: [{ size: 126 }, { size: 126 }, { visible: true }],
            expectedLayout: ['12.6', '12.6', '74.8'],
            expectedItemSizes: [126, 126, 748],
        }, {
            dataSource: [{ size: '504' }, { size: '5000px' }],
            expectedLayout: ['50', '50'],
            expectedItemSizes: [504, 504],
        }, {
            dataSource: [{ size: '5000px' }, { size: '100px' }],
            expectedLayout: ['100', '0'],
            expectedItemSizes: [1008, 0],
        }, {
            dataSource: [{ size: '504232px' }, { }],
            expectedLayout: ['100', '0'],
            expectedItemSizes: [1008, 0],
        }, {
            dataSource: [{ size: 0 }, { size: 128 }],
            expectedLayout: ['0', '100'],
            expectedItemSizes: [0, 1008],
        }, {
            dataSource: [{ size: 2 }, { size: 128 }],
            expectedLayout: ['0.198413', '99.8016'],
            expectedItemSizes: [2, 1006],
        }, {
            dataSource: [{ size: 0 }, { size: 200 }, { }],
            expectedLayout: ['0', '20', '80'],
            expectedItemSizes: [0, 200, 800],
        }, {
            dataSource: [{ size: '0px' }, { size: 128 }],
            expectedLayout: ['0', '100'],
            expectedItemSizes: [0, 1008],
        }, {
            dataSource: [{ size: '25%' }, { size: '25%' }, { size: '248px' }, { }],
            expectedLayout: ['25.6048', '25.6048', '25', '23.7903'],
            expectedItemSizes: [254, 254, 248, 236],
        }, {
            dataSource: [{ size: '50%' }, { size: '25%' }, { size: 248 }, { }],
            expectedLayout: ['51.2097', '25.6048', '23.1855', '0'],
            expectedItemSizes: [508, 254, 230, 0]
        }, {
            dataSource: [{ size: '40%' }, { size: '50%' }, { size: '10%' }],
            expectedLayout: ['40.64', '50.8', '8.56'],
            expectedItemSizes: [406.398, 508, 85.6016]
        }, {
            dataSource: [{ }, { }, { }, { }],
            expectedLayout: ['25', '25', '25', '25'],
            expectedItemSizes: [248, 248, 248, 248]
        }, {
            dataSource: [{ }, { size: '10%' }, { }, { }],
            expectedLayout: ['29.9194', '10.2419', '29.9194', '29.9194'],
            expectedItemSizes: [296.797, 101.602, 296.797, 296.797]
        }, {
            dataSource: [{ size: '30%' }, { }, { size: '50%' }, { }],
            expectedLayout: ['30.7258', '9.03226', '51.2097', '9.03226'],
            expectedItemSizes: [304.797, 89.6016, 508, 89.6016]
        }, {
            dataSource: [{ size: '30%' }, { }, { size: '30%' }],
            expectedLayout: ['30.48', '39.04', '30.48'],
            expectedItemSizes: [304.797, 390.398, 304.797]
        }, {
            dataSource: [{ }, { visible: false }, { size: '50%' }, { }],
            expectedLayout: ['24.6', '0', '50.8', '24.6'],
            expectedItemSizes: [246, 0, 508, 246]
        }, {
            dataSource: [{ visible: false }, { visible: false }, { size: '50%' }, { }],
            expectedLayout: ['0', '0', '50.3968', '49.6032'],
            expectedItemSizes: [0, 0, 508, 500]
        }, {
            dataSource: [{ size: '40%' }, { size: '60%' }, { visible: false }],
            expectedLayout: ['40.3175', '59.6825', '0'],
            expectedItemSizes: [406.398, 601.602, 0]
        }, {
            dataSource: [{ size: '30%' }, { size: '200%' }],
            expectedLayout: ['30.2381', '69.7619'],
            expectedItemSizes: [304.797, 703.203]
        }, {
            dataSource: [{ size: '10%' }, { size: '10%' }],
            expectedLayout: ['10.0794', '89.9206'],
            expectedItemSizes: [101.602, 906.398]
        }, {
            dataSource: [{ size: '320%' }, { size: '200%' }],
            expectedLayout: ['100', '0'],
            expectedItemSizes: [1008, 0]
        }, {
            dataSource: [{ size: '10%' }, { size: '10%' }, { visible: false }, { visible: false }],
            expectedLayout: ['10.0794', '89.9206', '0', '0'],
            expectedItemSizes: [101.602, 906.398, 0, 0]
        }, {
            dataSource: [{ size: '30%' }, { size: '20%' }, { }, { size: '20%' }, { }],
            expectedLayout: ['30.9677', '20.6452', '13.871', '20.6452', '13.871'],
            expectedItemSizes: [304.797, 203.203, 136.398, 203.203, 136.398]
        }, {
            dataSource: [{ size: '30%' }, { size: '25%' }, { size: '10%' }],
            expectedLayout: ['30.48', '25.4', '44.12'],
            expectedItemSizes: [304.797, 254, 441.203]
        }, {
            dataSource: [{ size: '30%', visible: false }, { size: '25%' }, { size: '10%' }],
            expectedLayout: ['0', '25.1984', '74.8016'],
            expectedItemSizes: [0, 254, 754]
        }, {
            dataSource: [{ size: '0%' }, { size: '1%' }],
            expectedLayout: ['0', '100'],
            expectedItemSizes: [0, 1008]
        }, {
            dataSource: [{ }, { size: '1%' }],
            expectedLayout: ['98.9921', '1.00794'],
            expectedItemSizes: [997.844, 10.1562]
        }, {
            dataSource: [{ visible: false }, { }, { }],
            expectedLayout: ['0', '50', '50'],
            expectedItemSizes: [0, 504, 504]
        }, {
            dataSource: [{ }, { visible: false }, { }],
            expectedLayout: ['50', '0', '50'],
            expectedItemSizes: [504, 0, 504]
        }, {
            dataSource: [{ }, { }, { visible: false }],
            expectedLayout: ['50', '50', '0'],
            expectedItemSizes: [504, 504, 0]
        }, {
            dataSource: [{ size: 'auto' }, { }, { size: 'inherit' }],
            expectedLayout: ['33.3333', '33.3333', '33.3333'],
            expectedItemSizes: [333.336, 333.336, 333.336]
        }, {
            dataSource: [{ }, { size: '100%' }, { }],
            expectedLayout: ['0', '100', '0'],
            expectedItemSizes: [0, 1000, 0]
        }, {
            dataSource: [{ visible: false }, { visible: false, size: '20%' }, { visible: false }],
            expectedLayout: ['0', '0', '0'],
            expectedItemSizes: [0, 0, 0]
        }, {
            dataSource: [{ }, { size: '150%' }, { }],
            expectedLayout: ['0', '100', '0'],
            expectedItemSizes: [0, 1000, 0]
        }, {
            dataSource: [{ size: '30%' }, { size: 200 }, { size: '300%' }, { size: '20%' }],
            expectedLayout: ['30.7258', '20.1613', '49.1129', '0'],
            expectedItemSizes: [304.797, 200, 487.203, 0]
        }, {
            dataSource: [{ size: '30%' }, { size: '20%' }, { size: '300%' }, { size: '20%' }, { }],
            expectedLayout: ['30.9756', '20.6504', '48.374', '0', '0'],
            expectedItemSizes: [304.797, 203.203, 476, 0, 0]
        }, {
            dataSource: [{ size: 300 }, { size: '5000' }, { }, { }, { }],
            expectedLayout: ['30.4878', '69.5122', '0', '0', '0'],
            expectedItemSizes: ['300', '684', 0, 0, 0]
        }
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

            this.checkItemSizes([400, 193.336, 193.336, 193.336]);
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

            this.checkItemSizes([300, 92, 92, 92]);
            this.assertLayout(['52.0833', '15.9722', '15.9722', '15.9722']);
        });
    });

    [{
        items: [{ collapsed: true }, { }],
        expectedLayout: ['0', '100'],
    }, {
        items: [{ }, { collapsed: true }],
        expectedLayout: ['100', '0'],
    }, {
        items: [{ maxSize: '75%' }, { collapsed: true }],
        expectedLayout: ['100', '0'],
    }, {
        items: [{ collapsed: true }, { visible: false }, { maxSize: '75%' }],
        expectedLayout: ['0', '0', '100'],
    }, {
        items: [{ maxSize: '75%' }, { visible: false }, { collapsed: true }],
        expectedLayout: ['100', '0', '0'],
    }, {
        items: [{ visible: false }, { collapsed: true }, { maxSize: '75%' }, { visible: false }],
        expectedLayout: ['0', '0', '100', '0'],
    }, {
        items: [{ visible: false }, { maxSize: '75%' }, { visible: false }, { collapsed: true }, { visible: false }],
        expectedLayout: ['0', '100', '0', '0', '0'],
    }, {
        items: [{ collapsed: true }, { maxSize: '75%' }],
        expectedLayout: ['0', '100'],
    }, {
        items: [{ collapsed: true }, { collapsed: true }, { collapsed: true }],
        expectedLayout: ['0', '0', '0'],
    }, {
        items: [{ size: 200 }, { collapsed: true }, { size: 200 }],
        expectedLayout: ['20.0803', '0', '79.9197'],
    }, {
        items: [{ visible: false }, { collapsed: true }],
        expectedLayout: ['0', '0'],
    }, {
        items: [{ }, { visible: false }, { collapsed: true }],
        expectedLayout: ['100', '0', '0'],
    }, {
        items: [{ }, { collapsed: true }, { }],
        expectedLayout: ['50', '0', '50'],
    }, {
        items: [{ }, { collapsed: true, collapsedSize: '9.9%' }, { }],
        expectedLayout: ['45', '9.93976', '45'],
    }, {
        items: [{ }, { collapsed: true, collapsedSize: 100 }, { }],
        expectedLayout: ['45', '10', '45'],
    }, {
        items: [{ }, { collapsed: true, collapsedSize: 100 }, { collapsed: true, collapsedSize: 100 }],
        expectedLayout: ['79.9197', '10.0806', '10.0806'],
    }, {
        items: [{ collapsed: true, collapsedSize: 100 }, { }],
        expectedLayout: ['10', '90'],
    }, {
        items: [{ }, { collapsed: true, collapsedSize: 100 }],
        expectedLayout: ['90', '10'],
    }, {
        items: [{ collapsed: true, collapsedSize: 100 }, { visible: false }, { }],
        expectedLayout: ['10', '0', '90'],
    }].forEach(({ items, expectedLayout }) => {
        QUnit.test(`Panes with collapsed/collapsedSize, items: ${JSON.stringify(items)}`, function(assert) {
            this.reinit({ items });

            this.assertLayout(expectedLayout);
        });
    });

    [
        { position: 'prev', expectedLayout: ['0', '100'], items: [{ maxSize: '75%', collapsible: true }, { collapsible: true }] },
        { position: 'prev', expectedLayout: ['0', '100'], items: [{ maxSize: '75%', collapsible: true }, { collapsible: true }] },
        { position: 'prev', expectedLayout: ['0', '100'], items: [{ maxSize: '75%', collapsible: true }, { collapsible: true }] },
        { position: 'prev', expectedLayout: ['50', '50'], items: [{ maxSize: '75%', collapsible: false }, { collapsed: true, collapsible: true }] },
        { position: 'next', expectedLayout: ['50', '50'], items: [{ collapsed: true, collapsible: true }, { maxSize: '75%', collapsible: false }] },
        { position: 'prev', expectedLayout: ['10.0806', '89.9194'], items: [{ collapsible: true, collapsedSize: 100 }, { collapsible: true, collapsedSize: 100 }] },
        { position: 'next', expectedLayout: ['89.9194', '10.0806'], items: [{ collapsible: true, collapsedSize: 100 }, { collapsible: true, collapsedSize: 100 }] },
        { position: 'next', expectedLayout: ['100', '0'], items: [{ minSize: '15%', collapsible: true }, { collapsible: true }] },
        { position: 'prev', expectedLayout: ['0', '100'], items: [{ collapsible: true }, { collapsible: true }] },
        { position: 'next', expectedLayout: ['100', '0'], items: [{ collapsible: true }, { collapsible: true }] },
        { position: 'prev', expectedLayout: [ '10.0806', '89.9194'], items: [{ collapsible: true, collapsedSize: 100 }, { collapsible: true, collapsedSize: 100 }] },
        { position: 'next', expectedLayout: ['89.9194', '10.0806'], items: [{ collapsible: true, collapsedSize: 100 }, { collapsible: true, collapsedSize: 100 }] },
        { position: 'prev', expectedLayout: [ '10.0806', '89.9194'], items: [{ collapsible: true, maxSize: '75%', collapsedSize: 100 }, { collapsible: true, collapsedSize: 100 }] },
        { position: 'next', expectedLayout: ['89.9194', '10.0806'], items: [{ collapsible: true, maxSize: '75%', collapsedSize: 100 }, { collapsible: true, collapsedSize: 100 }] },
        { position: 'prev', expectedLayout: [ '10.0806', '89.9194'], items: [{ collapsible: true, minSize: '50%', collapsedSize: 100 }, { collapsible: true, collapsedSize: 100 }] },
        { position: 'next', expectedLayout: ['89.9194', '10.0806'], items: [{ collapsible: true, minSize: '50%', collapsedSize: 100 }, { collapsible: true, collapsedSize: 100 }] },
        { position: 'next', expectedLayout: ['50', '0', '50'], items: [{ collapsible: true, collapsed: true }, { collapsible: true, collapsed: true }, { }] },
        { position: 'prev', expectedLayout: ['25', '25', '50'], items: [{ collapsible: true, collapsed: false }, { collapsible: true, collapsed: true }, { }] },
        { position: 'prev', expectedLayout: ['0', '66.6667', '33.3333'], items: [{ collapsible: true, collapsed: false }, { collapsible: true, collapsed: false }, { }] },
        { position: 'next', resizeHandleIndex: 1, expectedLayout: ['0', '50', '50'], items: [{ collapsible: true, collapsed: true }, { collapsible: true, collapsed: true }, { }] },
        { position: 'next', expectedLayout: ['55.0813', '0', '44.9187'], items: [{ collapsedSize: 100, collapsible: true, collapsed: true }, { collapsible: true, collapsed: true }, { }] },
        { position: 'next', resizeHandleIndex: 1, expectedLayout: ['10.1626', '44.9187', '44.9187'], items: [{ collapsedSize: 100, collapsible: true, collapsed: true }, { collapsible: true, collapsed: true }, { }] },
        { position: 'prev', expectedLayout: ['10.1626', '10.1626', '79.6748'], items: [{ collapsedSize: 100, size: 200, collapsible: true, collapsed: false }, { collapsible: true, collapsed: true }, { }] },
        { position: 'next', resizeHandleIndex: 1, expectedLayout: ['10.1626', '44.9187', '44.9187'], items: [{ collapsedSize: 100, collapsible: true, collapsed: true }, { collapsible: true, collapsed: true }, { }] },
        { position: 'next', expectedLayout: ['10.0806', '89.9194'], items: [{ collapsible: true, collapsed: true, maxSize: 100 }, { collapsible: true }] },
        { position: 'prev', expectedLayout: ['89.9194', '10.0806'], items: [{ collapsible: true }, { collapsible: true, collapsed: true, maxSize: 100 }] },
        { position: 'prev', expectedLayout: ['39.8374', '10.1626', '50'], items: [{ collapsible: true }, { collapsible: true, collapsed: true, maxSize: 100 }, { collapsible: true }] },
        { position: 'next', resizeHandleIndex: 1, expectedLayout: ['50', '10.1626', '39.8374'], items: [{ collapsible: true }, { collapsible: true, collapsed: true, maxSize: 100 }, { collapsible: true }] },
        { position: 'prev', expectedLayout: ['79.5082', '20.4918', '0', '0'], items: [
            { collapsedSize: 100, collapsible: true, collapsed: false, resizable: true },
            { maxSize: 200, collapsible: true, collapsed: true, resizable: true },
            { collapsed: true, collapsible: true },
            { collapsed: true, collapsible: true }
        ] },
    ].forEach(({ position, expectedLayout, items, resizeHandleIndex = 0 }) => {
        QUnit.test(`Pane collapse ${position} at runtime, items: ${JSON.stringify(items)}`, function(assert) {
            this.reinit({ items });

            const $resizeHandle = this.getResizeHandles().eq(resizeHandleIndex);

            const $collapseButton = position === 'prev'
                ? this.getCollapsePrevButton($resizeHandle)
                : this.getCollapseNextButton($resizeHandle);

            $collapseButton.trigger('dxclick');

            this.assertLayout(expectedLayout);
        });
    });

    QUnit.test('Expanded pane size should not exceed maxSize', function(assert) {
        this.reinit({
            items: [{ collapsible: true, collapsed: true, maxSize: 100 }, { collapsible: true }]
        });

        const $resizeHandle = this.getResizeHandles();

        const $collapseButton = this.getCollapseNextButton($resizeHandle);

        $collapseButton.trigger('dxclick');

        this.assertLayout(['10.0806', '89.9194']);
    });

    [
        {
            items: [{ size: '30%', collapsible: true }, { size: '10%', collapsible: true }, { collapsible: true }, { collapsible: true }, { collapsible: true }],
            scenarios: [
                { targetButton: 'prev', resizeHandleIndex: 1, expectedLayout: ['30.9917', '0', '29.8898', '19.5592', '19.5592'] },
                { targetButton: 'prev', resizeHandleIndex: 0, expectedLayout: ['15.4959', '15.4959', '29.8898', '19.5592', '19.5592'] },
                { targetButton: 'prev', resizeHandleIndex: 0, expectedLayout: ['0', '30.9917', '29.8898', '19.5592', '19.5592'] },
                { targetButton: 'next', resizeHandleIndex: 3, expectedLayout: ['0', '30.9917', '29.8898', '39.1185', '0'] },
                { targetButton: 'next', resizeHandleIndex: 2, expectedLayout: ['0', '30.9917', '69.0083', '0', '0'] },
                { targetButton: 'next', resizeHandleIndex: 3, expectedLayout: ['0', '30.9917', '69.0083', '0', '0'] },
                { targetButton: 'prev', resizeHandleIndex: 2, expectedLayout: ['0', '30.9917', '0', '69.0083', '0'] },
                { targetButton: 'prev', resizeHandleIndex: 1, expectedLayout: ['0', '15.4959', '15.4959', '69.0083', '0'] },
                { targetButton: 'next', resizeHandleIndex: 0, expectedLayout: ['15.4959', '0', '15.4959', '69.0083', '0'] },
            ]
        },
        {
            items: [{ collapsible: true }, { collapsible: true }, { collapsible: true }, { collapsible: true }],
            scenarios: [
                { targetButton: 'next', resizeHandleIndex: 2, expectedLayout: ['25', '25', '50', '0'] },
                { targetButton: 'next', resizeHandleIndex: 1, expectedLayout: ['25', '75', '0', '0'] },
            ]
        },
        {
            items: [{ collapsedSize: 100, collapsible: true, collapsed: true }, { collapsible: true, collapsed: true }, { }],
            scenarios: [
                { targetButton: 'next', resizeHandleIndex: 0, expectedLayout: ['55.0813', '0', '44.9187'] },
                { targetButton: 'prev', resizeHandleIndex: 0, expectedLayout: ['27.5407', '27.5407', '44.9187'] },
                { targetButton: 'prev', resizeHandleIndex: 0, expectedLayout: ['10.1626', '44.9187', '44.9187'] },
                { targetButton: 'next', resizeHandleIndex: 0, expectedLayout: ['27.5407', '27.5407', '44.9187'] },
            ]
        }
    ].forEach(({ items, scenarios }) => {
        QUnit.test(`The pane should restore its size after collapsing and expanding by click, items: ${JSON.stringify(items)}`, function(assert) {
            this.reinit({ items });

            scenarios.forEach(({ targetButton, expectedLayout, resizeHandleIndex = 0 }) => {
                const $resizeHandle = this.getResizeHandles().eq(resizeHandleIndex);

                const $collapseButton = targetButton === 'prev'
                    ? this.getCollapsePrevButton($resizeHandle)
                    : this.getCollapseNextButton($resizeHandle);

                $collapseButton.trigger('dxclick');

                this.assertLayout(expectedLayout);
            });
        });
    });

    [
        {
            items: [{ collapsible: true }, { collapsible: true }, { collapsible: true }, { collapsible: true, size: '40%' }],
            scenarios: [
                { targetButton: 'next', resizeHandleIndex: 2, expectedLayout: ['19.6721', '19.6721', '60.6557', '0'] },
                { newCollapsedValue: false, paneIndex: 3, expectedLayout: ['19.6721', '19.6721', '19.6721', '40.9836'] },
            ]
        },
        {
            items: [{ collapsible: true }, { collapsible: true }, { collapsible: true }, { collapsible: true, size: '40%' }],
            scenarios: [
                { targetButton: 'next', resizeHandleIndex: 2, expectedLayout: ['19.6721', '19.6721', '60.6557', '0'] },
                { newCollapsedValue: true, paneIndex: 2, expectedLayout: ['19.6721', '80.3279', '0', '0'] },
                { newCollapsedValue: true, paneIndex: 0, expectedLayout: ['0', '100', '0', '0'] },
                { newCollapsedValue: false, paneIndex: 0, expectedLayout: ['19.6721', '80.3279', '0', '0'] },
                { newCollapsedValue: false, paneIndex: 2, expectedLayout: ['19.6721', '19.6721', '60.6557', '0'] },
            ]
        },
        {
            items: [{ collapsible: true }, { collapsible: true, size: '30%' }, { collapsible: true }, { collapsible: true }],
            scenarios: [
                { targetButton: 'next', resizeHandleIndex: 1, expectedLayout: ['23.0874', '53.8251', '0', '23.0874'] },
                { newCollapsedValue: false, paneIndex: 2, expectedLayout: ['23.0874', '30.7377', '23.0874', '23.0874'] },
            ]
        },
        {
            items: [{ collapsedSize: 100, size: 50, collapsible: true, collapsed: false }, { collapsible: true }, { collapsible: true }],
            scenarios: [
                { newCollapsedValue: true, paneIndex: 0, expectedLayout: ['10.1626', '42.378', '47.4593'] },
                { targetButton: 'next', resizeHandleIndex: 0, expectedLayout: ['31.3516', '21.189', '47.4593'] },
                { targetButton: 'next', resizeHandleIndex: 0, expectedLayout: ['52.5407', '0', '47.4593'] },
                { newCollapsedValue: false, paneIndex: 1, expectedLayout: ['31.3516', '21.189', '47.4593'] },
            ]
        },
        {
            items: [{ size: 700 }, { visible: false }, { collapsed: true, collapsible: true }, { visible: false }, { }],
            scenarios: [
                { targetButton: 'prev', resizeHandleIndex: 0, expectedLayout: ['35.5691', '0', '35.5691', '0', '28.8618'] },
                { newCollapsedValue: true, paneIndex: 0, expectedLayout: ['0', '0', '71.1382', '0', '28.8618'] },
            ]
        },
        {
            items: [{ }, { visible: false }, { collapsed: true, collapsible: true }, { visible: false }, { size: 700 }],
            scenarios: [
                { targetButton: 'next', resizeHandleIndex: 1, expectedLayout: ['28.8618', '0', '35.5691', '0', '35.5691'] },
                { newCollapsedValue: true, paneIndex: 4, expectedLayout: ['28.8618', '0', '71.1382', '0', '0'] },
            ]
        },
    ].forEach(({ items, scenarios }) => {
        QUnit.test(`The pane collapse/expand scenarios using API and UI, items: ${JSON.stringify(items)}`, function(assert) {
            this.reinit({ items });

            scenarios.forEach((scenario) => {
                const { newCollapsedValue, paneIndex, expectedLayout, targetButton, resizeHandleIndex } = scenario;

                if(targetButton) {
                    const $resizeHandle = this.getResizeHandles().eq(resizeHandleIndex);

                    const $collapseButton = targetButton === 'prev'
                        ? this.getCollapsePrevButton($resizeHandle)
                        : this.getCollapseNextButton($resizeHandle);

                    $collapseButton.trigger('dxclick');
                } else {
                    this.instance.option(`items[${paneIndex}].collapsed`, newCollapsedValue);
                }

                this.assertLayout(expectedLayout);
            });
        });
    });

    [
        {
            items: [{ }, { }, { }, { }],
            scenarios: [
                { newCollapsedValue: false, paneIndex: 0, expectedLayout: ['25', '25', '25', '25'] },
            ]
        },
        {
            items: [{ size: '150px' }, { }, { }, { }],
            scenarios: [
                { newCollapsedValue: true, paneIndex: 0, expectedLayout: ['0', '43.5792', '28.2104', '28.2104'] },
                { newCollapsedValue: true, paneIndex: 1, expectedLayout: ['0', '0', '71.7896', '28.2104'] },
                { newCollapsedValue: false, paneIndex: 0, expectedLayout: ['15.3689', '0', '56.4208', '28.2104'] },
            ]
        },
        {
            items: [{ collapsed: true, size: '150px', collapsible: true }, { collapsible: true }, { collapsed: true, collapsible: true }, { }],
            scenarios: [
                { newCollapsedValue: false, paneIndex: 0, expectedLayout: ['25', '25', '0', '50'] },
                { newCollapsedValue: false, paneIndex: 2, expectedLayout: ['25', '25', '25', '25'] },
            ]
        },
        {
            items: [{ collapsed: false, collapsible: true }, { collapsed: true, collapsible: true }, { collapsible: true }, { collapsed: true, size: '150px', collapsible: true }],
            scenarios: [
                { newCollapsedValue: false, paneIndex: 3, expectedLayout: ['50', '0', '25', '25'] },
                { newCollapsedValue: false, paneIndex: 1, expectedLayout: ['50', '12.5', '12.5', '25'] },
            ]
        },
        {
            items: [{ collapsed: true, collapsible: true }, { collapsed: true, collapsible: true }, { collapsible: true }, { collapsed: false, collapsible: true }],
            scenarios: [
                { newCollapsedValue: false, paneIndex: 1, expectedLayout: ['0', '25', '25', '50'] },
                { newCollapsedValue: false, paneIndex: 0, expectedLayout: ['12.5', '12.5', '25', '50'] },
                { newCollapsedValue: true, paneIndex: 1, expectedLayout: ['12.5', '0', '37.5', '50'] },
            ]
        },
        {
            items: [{ collapsed: true, collapsible: true }, { collapsed: true, collapsible: true }, { collapsible: true }, { size: '20%', collapsed: false, collapsible: true }],
            scenarios: [
                { newCollapsedValue: false, paneIndex: 0, expectedLayout: ['39.7541', '0', '39.7541', '20.4655674103'] },
                { newCollapsedValue: false, paneIndex: 1, expectedLayout: ['39.7541', '19.877', '19.877', '20.4655674103'] },
                { newCollapsedValue: true, paneIndex: 0, expectedLayout: ['0', '59.6311', '19.877', '20.4655674103'] },
            ]
        }
    ].forEach(({ items, scenarios }) => {
        QUnit.test(`The pane should restore its size after collapsing and expanding at runtime, items: ${JSON.stringify(items)}`, function(assert) {
            this.reinit({ items });

            scenarios.forEach((scenario) => {
                const { newCollapsedValue, paneIndex, expectedLayout } = scenario;

                this.instance.option(`items[${paneIndex}].collapsed`, newCollapsedValue);

                this.assertLayout(expectedLayout);
            });
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
        expectedLayout: ['0', '0', '100'],
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
        expectedLayout: ['0', '66.6667', '33.3'],
    },
    {
        items: [{ collapsible: true, size: 98 }, { collapsible: true, size: 98 }, { collapsible: true }],
        expectedLayout: ['0', '19.9187', '80.0813'],
    },
    {
        items: [{ collapsible: true, visible: false }, { collapsible: true }, { collapsible: true }],
        expectedLayout: ['0', '0', '100'],
    },
    {
        items: [{ collapsible: true, visible: false }, { collapsible: true, collapsedSize: 100 }, { collapsible: true }],
        expectedLayout: ['0', '10.0806', '89.9194'],
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
        expectedLayout: ['66.6667', '0', '33.3'],
    },
    {
        items: [{ collapsible: true, size: 98 }, { collapsible: true, size: 98 }, { collapsible: true }],
        expectedLayout: ['19.9187', '0', '80.0813'],
    },
    {
        items: [{ collapsible: true, visible: false }, { collapsible: true }, { collapsible: true }],
        expectedLayout: ['0', '100', '0'],
    },
    {
        items: [{ collapsible: true, visible: false }, { collapsible: true }, { collapsible: true, collapsedSize: 100 }],
        expectedLayout: ['0', '89.9194', '10.0806'],
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
            items: [ { collapsible: true }, { collapsible: true, collapsed: true }, { collapsible: true }],
        });

        this.assertLayout(['50', '0', '50']);

        const $resizeHandle = this.getResizeHandles().first();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);

        $collapsePrevButton.trigger('dxclick');

        this.assertLayout(['25', '25', '50']);
    });

    QUnit.test('Collapsed + expanded pane should have old size', function(assert) {
        this.reinit({
            items: [ { collapsible: true }, { collapsible: true, size: 98 }, { collapsible: true }],
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

    QUnit.test('Collapsed pane should expand to its previous size', function(assert) {
        this.reinit({
            items: [
                { resizable: true, collapsible: true },
                { resizable: false, collapsible: true, size: 500 },
                { resizable: true, collapsible: false }
            ],
        });

        const initialLayout = ['24.5935', '50.8', '24.5935'];

        this.assertLayout(initialLayout);

        const $resizeHandle = this.getResizeHandles().eq(1);
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);

        $collapsePrevButton.trigger('dxclick');

        this.assertLayout(['24.6', '0', '75.4']);

        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);
        $collapseNextButton.trigger('dxclick');

        this.assertLayout(initialLayout);
    });

    QUnit.test('Collapsed pane should restore full width when size to next neighbor is 0', function(assert) {
        this.reinit({
            items: [ { collapsible: true }, { collapsible: true, size: 500 }, { collapsible: true }],
        });

        this.assertLayout(['24.5935', '50.8', '24.5935']);

        const $resizeHandle = this.getResizeHandles().first();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        $collapsePrevButton.trigger('dxclick');

        this.assertLayout(['0', '75.4', '24.6']);

        const pointer = pointerMock(this.getResizeHandles()[1]);
        pointer.start().dragStart().drag(-500, 0).dragEnd();

        this.assertLayout(['0', '24.6', '75.4']);

        $collapseNextButton.trigger('dxclick');

        this.assertLayout(['24.6', '0', '75.4']);
    });

    QUnit.test('Whole layout should be repositined on collapse using api', function(assert) {
        this.reinit({
            items: [ { collapsible: true }, { collapsible: true }, { collapsible: true }],
        });

        this.assertLayout(['33.3', '33.3', '33.3']);

        this.instance.option('items[0].collapsed', true);

        this.assertLayout(['0', '66.6667', '33.3333']);
    });

    QUnit.test('Whole layout should be repositined on change Pane.collapsedSize option at runtime', function(assert) {
        this.reinit({
            items: [{ collapsedSize: 200, collapsed: true, collapsible: true }, { }, { }]
        });

        this.assertLayout(['20.3252', '39.8374', '39.8374']);

        this.instance.option('items[0].collapsedSize', 100);

        this.assertLayout(['10.1626', '39.8374', '50']);
    });

    QUnit.test('Whole layout should be repositined on change Pane.collapsedSize option at runtime after resize', function(assert) {
        this.reinit({
            items: [{ collapsedSize: 200, collapsed: true, collapsible: true }, { }, { }]
        });

        this.assertLayout(['20.3252', '39.8374', '39.8374']);

        const pointer = pointerMock(this.getResizeHandles()[1]);
        pointer.start().dragStart().drag(-50, 0).dragEnd();

        this.assertLayout(['20.3252', '34.7561', '44.9187']);

        this.instance.option('items[0].collapsedSize', 100);

        this.assertLayout(['10.1626', '34.7561', '55.0813']);
    });


    QUnit.test('Pane with collapsed=true should have more priority than pane with maxSize', function(assert) {
        this.reinit({
            items: [{ collapsed: true }, { maxSize: '50%' }],
        });

        const $leftPane = this.getPanes().first();

        assert.strictEqual($leftPane.css('width'), '0px');
    });

    QUnit.test('The splitter panes should maintain the correct ratio after being rendered inside an invisible element and display correctly when shown (T1241434)', function(assert) {
        const done = assert.async();
        $('#splitterParentContainer').css('display', 'none');

        this.reinit({
            dataSource: [{ size: '30%' }, { size: '70%' }]
        }, '#splitterInContainer');

        this.$element.css('width', '600px');

        setTimeout(() => {
            this.assertLayout(['', '']);

            $('#splitterParentContainer').css('display', 'block');

            const resizeObserverTimeout = 50;
            setTimeout(() => {
                this.assertLayout(['30.4054', '69.5946']);

                done();
            }, resizeObserverTimeout);
        });
    });

    QUnit.test('The splitter panes should maintain the correct ratio after being initialized on a detached element and then attached to the DOM (T1241434)', function(assert) {
        const done = assert.async();
        const $splitter = $('<div id="splitterDetached">');

        this.$element = $splitter.dxSplitter({
            dataSource: [{ size: '30%' }, { size: '70%' }]
        });

        this.$element.css('width', 600);

        setTimeout(() => {
            this.assertLayout(['', '']);

            $splitter.appendTo('#splitterParentContainer');

            const resizeObserverTimeout = 50;
            setTimeout(() => {
                this.assertLayout(['30.4054', '69.5946']);

                done();
            }, resizeObserverTimeout);
        });
    });

    QUnit.test('The splitter pane can safely collapse if the total size layout calculation error is less than three decimal places (T1262088)', function(assert) {
        this.reinit({
            width: 733.67,
            height: 200,
            items: [ { collapsible: true }, { collapsible: true }, { collapsible: true }],
        });

        this.assertLayout(['33.3333', '33.3333', '33.3333']);

        this.instance._layout = [33.3338502509, 33.3338502509, 33.3338502509];

        const $resizeHandle = this.getResizeHandles().first();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);

        $collapsePrevButton.trigger('dxclick');

        this.assertLayout(['0', '66.6677', '33.3339']);
    });
});

QUnit.module('Pane visibility', moduleConfig, () => {
    ['horizontal', 'vertical'].forEach(orientation => {
        [{
            dataSource: [{ visible: true }],
            scenarios: [{
                paneIndex: 0,
                visible: false,
                expected: {
                    layout: ['100'],
                    itemSizes: [1000],
                    handlesCount: 0
                }
            }, {
                paneIndex: 0,
                visible: true,
                expected: {
                    layout: ['100'],
                    itemSizes: [1000],
                    handlesCount: 0
                }
            }]
        }, {
            dataSource: [{ visible: true }, { visible: true }],
            scenarios: [{
                paneIndex: 0,
                visible: false,
                expected: {
                    layout: ['0', '100'],
                    itemSizes: [0, 1000],
                    handlesCount: 0
                }
            }, {
                paneIndex: 0,
                visible: true,
                expected: {
                    layout: ['50', '50'],
                    itemSizes: [496, 496],
                    handlesCount: 1
                }
            }]
        }, {
            dataSource: [{ visible: true }, { visible: false }],
            scenarios: [{
                paneIndex: 1,
                visible: true,
                expected: {
                    layout: ['50', '50'],
                    itemSizes: [496, 496],
                    handlesCount: 1
                }
            }, {
                paneIndex: 1,
                visible: false,
                expected: {
                    layout: ['100', '0'],
                    itemSizes: [1000, 0],
                    handlesCount: 0
                }
            }]
        }, {
            dataSource: [{ visible: true }, { visible: true }],
            scenarios: [{
                paneIndex: 1,
                visible: false,
                expected: {
                    layout: ['100', '0'],
                    itemSizes: [1000, 0],
                    handlesCount: 0
                }
            }, {
                paneIndex: 1,
                visible: true,
                expected: {
                    layout: ['50', '50'],
                    itemSizes: [496, 496],
                    handlesCount: 1
                }
            }]
        }, {
            dataSource: [{ size: '200px' }, { size: '500px' }, {}],
            scenarios: [{
                paneIndex: 1,
                visible: true,
                expected: {
                    layout: ['20.3252', '50.813', '28.8618'],
                    itemSizes: [200, 500, 284],
                    handlesCount: 2
                }
            }, {
                paneIndex: 1,
                visible: false,
                expected: {
                    layout: ['20.3252', '0', '79.6748'],
                    itemSizes: [201.625, 0, 790.375],
                    handlesCount: 1
                }
            }, {
                paneIndex: 1,
                visible: true,
                expected: {
                    layout: ['20.3252', '50.813', '28.8618'],
                    itemSizes: [200, 500, 284],
                    handlesCount: 2
                }
            }]
        }, {
            dataSource: [{ size: '200px' }, { size: '500px' }, { visible: false }],
            scenarios: [{
                paneIndex: 2,
                visible: true,
                expected: {
                    layout: ['20.1613', '39.9194', '39.9194'],
                    itemSizes: [198.391, 392.805, 392.805],
                    handlesCount: 2
                }
            }]
        }, {
            dataSource: [{ size: '200px' }, { size: '600px' }, {}],
            scenarios: [{
                paneIndex: 2,
                visible: false,
                expected: {
                    layout: ['20.3252', '79.6748', 0],
                    itemSizes: [201.625, 790.375, 0],
                    handlesCount: 1
                }
            }, {
                paneIndex: 2,
                visible: true,
                expected: {
                    layout: ['20.3252', '60.9756', '18.6992'],
                    itemSizes: [200, 600, 184],
                    handlesCount: 2
                }
            }]
        }, {
            dataSource: [{ }, { visible: true }, { }],
            scenarios: [{
                paneIndex: 1,
                visible: false,
                expected: {
                    layout: ['33.3333', '0', '66.6667'],
                    itemSizes: [330.664, 0, 661.336],
                    handlesCount: 1
                }
            },
            {
                paneIndex: 1,
                visible: true,
                expected: {
                    layout: ['33.3333', '33.3333', '33.3333'],
                    itemSizes: [328, 328, 328],
                    handlesCount: 2
                }
            }]
        }, {
            dataSource: [{ visible: false }, { }, { }],
            scenarios: [{
                paneIndex: 0,
                visible: true,
                expected: {
                    layout: ['25', '25', '50'],
                    itemSizes: [246, 246, 492],
                    handlesCount: 2
                }
            }]
        }, {
            dataSource: [{ visible: true, minSize: '100px' }, { }, { }],
            scenarios: [{
                paneIndex: 0,
                visible: false,
                expected: {
                    layout: ['0', '66.6667', '33.3333'],
                    itemSizes: [0, 661.336, 330.664],
                    handlesCount: 1
                }
            }]
        }, {
            dataSource: [{ visible: false, maxSize: '100px' }, { }, { }],
            scenarios: [{
                paneIndex: 0,
                visible: true,
                expected: {
                    layout: ['10.1626', '39.8374', '50'],
                    itemSizes: [100, 392, 492],
                    handlesCount: 2
                }
            }]
        }, {
            dataSource: [{ visible: false, size: '100px' }, { size: 250 }, { }, { size: 200 }],
            scenarios: [{
                paneIndex: 2,
                visible: false,
                expected: {
                    layout: ['0', '25.4065', '0', '74.5935'],
                    itemSizes: [0, 252.031, 0, 739.969],
                    handlesCount: 1
                }
            }, {
                paneIndex: 3,
                visible: false,
                expected: {
                    layout: ['0', '100', '0', '0'],
                    itemSizes: [0, 1000, 0, 0],
                    handlesCount: 0
                }
            }, {
                paneIndex: 3,
                visible: true,
                expected: {
                    layout: ['0', '25.4065', '0', '74.5935'],
                    itemSizes: [0, 252.031, 0, 739.969],
                    handlesCount: 1
                }
            }, {
                paneIndex: 2,
                visible: true,
                expected: {
                    layout: ['0', '25.4065', '54.2683', '20.3252'],
                    itemSizes: [0, 250, 534, 200],
                    handlesCount: 2
                }
            }]
        }, {
            dataSource: [{ visible: true, size: '100px' }, { }, { size: 250, resizable: false }, { size: 200 }],
            scenarios: [{
                paneIndex: 1,
                visible: false,
                expected: {
                    layout: ['10.1215', '0', '69.6356', '20.2429'],
                    itemSizes: [100.812, 0, 693.57, 201.617],
                    handlesCount: 2
                }
            }]
        }, {
            dataSource: [{ visible: true, size: '100px' }, { }, { size: 100, maxSize: 250 }, { size: 200 }],
            scenarios: [{
                paneIndex: 1,
                visible: false,
                expected: {
                    layout: ['10.2459', '0', '69.2623', '20.4918'],
                    itemSizes: [100.812, 0, 681.539, 201.617],
                    handlesCount: 2
                }
            }]
        }].forEach(({ dataSource, scenarios }) => {
            QUnit.test(`Size distribution after changing pane.visibility at runtime, dataSource: ${JSON.stringify(dataSource)}, ${orientation} orientation`, function(assert) {
                this.reinit({
                    orientation,
                    dataSource: dataSource
                });

                scenarios.forEach(({ paneIndex, visible, expected }) => {
                    this.instance.option(`items[${paneIndex}].visible`, visible);

                    const { layout, itemSizes, handlesCount } = expected;
                    this.assertLayout(layout);
                    this.checkItemSizes(itemSizes);

                    assert.strictEqual(this.getResizeHandles().length, handlesCount, 'resize handles count');
                });
            });
        });

        QUnit.test('Changing pane visibility does not trigger full rerender (T1267030)', function(assert) {
            this.reinit({
                orientation,
                dataSource: [{}, {}, {}]
            });

            const initialPaneId = this.getPanes().eq(0).attr('id');

            this.instance.option('items[2].visible', false);

            assert.strictEqual(initialPaneId, this.getPanes().eq(0).attr('id'), 'neighbour pane was not rerendered');
        });
    });
});

QUnit.module('Resizing', moduleConfig, () => {
    ['horizontal', 'vertical'].forEach(orientation => {
        QUnit.test(`collapsed pane should move its neighboring pane on expansion to left, orientation ${orientation}`, function(assert) {
            this.reinit({
                width: '100%',
                height: '100%',
                orientation,
                dataSource: [{ }, { }, { }, { minSize: '250px', collapsible: true }]
            }, '#splitterInContainer');

            const $resizeHandle = this.getResizeHandles().eq(2);
            const keyboard = keyboardMock($resizeHandle);

            const collapseKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

            this.assertLayout(['25', '25', '25', '25']);

            keyboard.keyDown(collapseKey, { ctrlKey: true });

            this.assertLayout(['25', '25', '50', '0']);

            const pointer = pointerMock(this.getResizeHandles().eq(1));
            pointer.start().dragStart().drag(300, 300).dragEnd();

            this.assertLayout(['25', '55', '20', '0']);

            const expandKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
            keyboard.keyDown(expandKey, { ctrlKey: true });

            this.assertLayout(['25', '50', '0', '25']);
        });

        QUnit.test(`collapsed pane should move its neighboring pane on expansion to right, orientation ${orientation}`, function(assert) {
            this.reinit({
                width: '100%',
                height: '100%',
                orientation,
                dataSource: [{ minSize: '250px', collapsible: true }, { }, { }, { }]
            }, '#splitterInContainer');

            const $resizeHandle = this.getResizeHandles().eq(0);
            const keyboard = keyboardMock($resizeHandle);

            const collapseKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

            keyboard.keyDown(collapseKey, { ctrlKey: true });

            this.assertLayout(['0', '50', '25', '25']);

            const pointer = pointerMock(this.getResizeHandles().eq(1));
            pointer.start().dragStart().drag(-300, -300).dragEnd();

            this.assertLayout(['0', '20', '55', '25']);

            const expandKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
            keyboard.keyDown(expandKey, { ctrlKey: true });

            this.assertLayout(['25', '0', '50', '25']);
        });

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
                dataSource: [{ }, { visible: false }, { }]
            });

            this.assertLayout(['50', '0', '50']);
        });

        QUnit.test(`first and second items resize should work when middle item is invisible, ${orientation} orientation`, function(assert) {
            this.reinit({
                width: 224, height: 224,
                orientation,
                dataSource: [{ }, { }, { visible: false }, { }, { }]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(-25, -25).dragEnd();

            this.assertLayout(['12.5', '37.5', '0', '25', '25']);
        });

        QUnit.test(`last items resize should work when middle item is invisible, ${orientation} orientation`, function(assert) {
            this.reinit({
                width: 224, height: 224,
                orientation,
                dataSource: [{ }, { }, { visible: false }, { }, { }]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(2));
            pointer.start().dragStart().drag(-25, -25).dragEnd();

            this.assertLayout(['25', '25', '0', '12.5', '37.5']);
        });

        QUnit.test(`items should be resized when their neighbour item is not visible, ${orientation} orientation`, function(assert) {
            this.reinit({
                width: 208, height: 208,
                orientation,
                dataSource: [{ }, { visible: false }, { },]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(50, 50).dragEnd();

            this.assertLayout(['75', '0', '25']);
        });

        QUnit.test(`items should be resized when their neighbour item contains splitter, ${orientation} orientation`, function(assert) {
            this.reinit({
                width: '100%',
                height: '100%',
                orientation,
                dataSource: [{ }, { splitter: { dataSource: [{ }, { }, { }] } }, { }, { }]
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

            this.checkItemSizes([400, 200, 200, 200]);
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
                dataSource: [{ visible: false }, { }, { },]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));
            pointer.start().dragStart().drag(50, 50).dragEnd();

            this.assertLayout(['0', '75', '25']);
        });

        QUnit.test(`splitter should have no resize handles if only 1 item is visible, ${orientation} orientation`, function(assert) {
            this.reinit({
                orientation,
                dataSource: [{ visible: false }, { }]
            });

            assert.strictEqual(this.getResizeHandles(false).length, 0);
        });

        QUnit.test(`splitter should have 3 resize handles if 4 out of 6 are visible, ${orientation} orientation`, function(assert) {
            this.reinit({
                orientation,
                dataSource: [{ }, { }, { visible: false }, { }, { }, { visible: false }]
            });

            assert.strictEqual(this.getResizeHandles(false).length, 3);
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
                expectedLayout: ['90.0596', '0', '9.94036', '0'],
                expectedItemSizes: [906, 0, 100, 0]
            },
            {
                resizeHandleIndex: 2,
                resizeDistance: -800,
                dataSource: [{ }, { resizable: false, size: '100px' }, { }, { }],
                expectedLayout: ['0', '9.94036', '0', '90.0596'],
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

        QUnit.test(`non resizable panes shouldn't change their sizes after update splitter dimension, ${orientation} orientation`, function(assert) {
            this.reinit({
                width: 1018,
                height: 1018,
                dataSource: [{ }, { }, { }, { resizable: false, size: '300px' }],
                orientation,
            });

            this.instance.option(orientation === 'horizontal' ? 'width' : 'height', 700);

            this.checkItemSizes([159.133, 159.133, 159.133, 204.602]);
            this.assertLayout([23.3333, 23.3333, 23.3333, 30]);
        });
    });

    [
        { scenario: 'left', items: [{ resizable: false }, { }] },
        { scenario: 'right', items: [{ }, { resizable: false }] },
        { scenario: 'left and right', items: [{ resizable: false }, { resizable: false }] }
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
            items: [{ resizable: false }, { }],
        });

        this.instance.option('items[0].resizable', true);

        const pointer = pointerMock(this.getResizeHandles().eq(0));
        pointer.start().dragStart().drag(50, 50).dragEnd();

        this.assertLayout(['75', '25']);
    });

    QUnit.test('resize should not work when pane resizable is disabled on runtime', function(assert) {
        this.reinit({
            width: 208, height: 208,
            items: [{ }, { }],
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
                dataSource: [{ }, { }, { }, { }, { }],
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
        this.reinit({ width: 208, dataSource: [{ splitter: { dataSource: [{ }] } }, { }, { }, { splitter: { dataSource: [{ }] } }] });

        const pointer = pointerMock(this.getResizeHandles().eq(2));
        pointer.start().dragStart().drag(-400, 0).dragEnd();

        this.assertLayout(['0', '0', '0', '100']);
    });

    QUnit.test('Changing the runtime item size option should update the layout', function(assert) {
        this.reinit({
            width: 1016, dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
        });

        this.checkItemSizes([300, 600, 100]);
        this.assertLayout(['30', '60', '10']);

        this.instance.option('items[0].size', 100);

        this.checkItemSizes([100, 600, 300]);
        this.assertLayout(['10', '60', '30']);
    });

    QUnit.test('Changing the runtime item minSize option should update the layout, if minSize > size', function(assert) {
        this.reinit({
            width: 1016, dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
        });

        this.checkItemSizes([300, 600, 100]);
        this.assertLayout(['30', '60', '10']);

        this.instance.option('items[0].minSize', 500);

        this.checkItemSizes([500, 400, 100]);
        this.assertLayout(['50', '40', '10']);
    });

    QUnit.test('Changing the runtime item minSize option should not update the layout, if minSize < size', function(assert) {
        this.reinit({
            width: 1016, dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
        });

        this.checkItemSizes([300, 600, 100]);
        this.assertLayout(['30', '60', '10']);

        this.instance.option('items[0].minSize', 100);

        this.checkItemSizes([300, 600, 100]);
        this.assertLayout(['30', '60', '10']);
    });

    QUnit.test('Changing the runtime item maxSize option should update the layout, if maxSize < size', function(assert) {
        this.reinit({
            width: 1016, dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
        });

        this.checkItemSizes([300, 600, 100]);
        this.assertLayout(['30', '60', '10']);

        this.instance.option('items[0].maxSize', 100);

        this.checkItemSizes([100, 800, 100]);
        this.assertLayout(['10', '80', '10']);
    });

    QUnit.test('Changing the runtime item maxSize option should not update the layout, if maxSize > size', function(assert) {
        this.reinit({
            width: 1016, dataSource: [{ size: '300px' }, { size: '600px' }, { size: '100px' }],
        });

        this.checkItemSizes([300, 600, 100]);
        this.assertLayout(['30', '60', '10']);

        this.instance.option('items[0].maxSize', 400);

        this.checkItemSizes([300, 600, 100]);
        this.assertLayout(['30', '60', '10']);
    });

    QUnit.test('resize should work correctly after orientation runtime change', function(assert) {
        this.reinit({
            width: 208, height: 208,
            items: [{ }, { }],
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
        this.reinit({ dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }, { text: 'Pane_3' }] });

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
        this.reinit({ dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }, { text: 'Pane_3' }] });

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
                    dataSource: [{ size: '496px' }, { size: '496px' }],
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

            this.getCollapsePrevButton($resizeHandle).trigger(CLICK_EVENT);

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

    [
        {
            orientation: 'horizontal', expandKey: 'ArrowRight',
            dataSource: [{ minSize: '50px', collapsible: true, collapsed: true }, { size: 50 }, { }, { }],
            handleIndex: 0,
            expectedLayout: ['25', '0', '37.5', '37.5'],
            expectedItemSizes: [50, 0, 75, 75],
        },
        {
            orientation: 'vertical', expandKey: 'ArrowDown',
            dataSource: [{ minSize: '50px', collapsible: true, collapsed: true }, { size: 50 }, { }, { }],
            handleIndex: 0,
            expectedLayout: ['25', '0', '37.5', '37.5'],
            expectedItemSizes: [50, 0, 75, 75],
        },

        {
            orientation: 'horizontal', expandKey: 'ArrowLeft',
            dataSource: [ { }, { }, { size: 50 }, { minSize: '50px', collapsible: true, collapsed: true }],
            handleIndex: 2,
            expectedLayout: ['37.5', '37.5', '0', '25'],
            expectedItemSizes: [75, 75, 0, 50],
        },
        {
            orientation: 'vertical', expandKey: 'ArrowUp',
            dataSource: [ { }, { }, { size: 50 }, { minSize: '50px', collapsible: true, collapsed: true }],
            handleIndex: 2,
            expectedLayout: ['37.5', '37.5', '0', '25'],
            expectedItemSizes: [75, 75, 0, 50],
        },
    ].forEach(({ orientation, expandKey, dataSource, expectedLayout, handleIndex, expectedItemSizes }) => {
        QUnit.test(`pane should be expanded to to minSize, dataSource: ${JSON.stringify(dataSource)}, orientation ${orientation}`, function(assert) {
            this.reinit({
                width: 224,
                height: 224,
                orientation,
                dataSource
            }, '#splitterInContainer');

            const $resizeHandle = this.getResizeHandles().eq(handleIndex);
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(expandKey, { ctrlKey: true });

            this.assertLayout(expectedLayout);
            this.checkItemSizes(expectedItemSizes);
        });
    });

    QUnit.module('Visibility class of panes with no size', moduleConfig, () => {
        QUnit.test('Pane with hidden content class should have visibility hidden style', function(assert) {
            this.reinit({
                items: [{ size: 0 }, { }],
            });

            const $pane = this.getPanes().first();

            assert.strictEqual($pane.css('visibility'), 'hidden', true);
        });

        QUnit.test('Pane without hidden content class should not have visibility hidden style', function(assert) {
            this.reinit({
                items: [{ }, { }],
            });

            const $pane = this.getPanes().first();

            assert.notStrictEqual($pane.css('visibility'), 'hidden', true);
        });

        QUnit.test('Pane should have hidden content class when size=0 on init', function(assert) {
            this.reinit({
                items: [{ size: 0 }, { }],
            });

            const $pane = this.getPanes().first();

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), true);
        });

        QUnit.test('Pane should have hidden content class when size=0 on runtime', function(assert) {
            this.reinit({
                items: [{ }, { }],
            });
            const $pane = this.getPanes().first();

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), false);

            this.instance.option('items[0].size', 0);

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), true);
        });

        QUnit.test('Pane should not have hidden content class when size != 0 on init', function(assert) {
            this.reinit({
                items: [{ }, { }],
            });

            const $pane = this.getPanes().first();

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), false);
        });

        QUnit.test('Pane should not have hidden content class when size != 0 on runtime', function(assert) {
            this.reinit({
                items: [{ size: 0 }, { }],
            });
            const $pane = this.getPanes().first();

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), true);

            this.instance.option('items[0].size', 100);

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), false);
        });

        QUnit.test('Collapsed on init pane should have hidden content class', function(assert) {
            this.reinit({
                items: [{ collapsed: true }, { }],
            });

            const $pane = this.getPanes().first();

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), true);
        });

        QUnit.test('Collapsed on runtime pane should have hidden content class', function(assert) {
            this.reinit({
                items: [{ }, { }],
            });
            const $pane = this.getPanes().first();

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), false);

            this.instance.option('items[0].collapsed', true);

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), true);
        });

        QUnit.test('Expanded on runtime pane should not have hidden content class', function(assert) {
            this.reinit({
                items: [{ collapsible: true, collapsed: true }, { }],
            });
            const $pane = this.getPanes().first();

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), true);

            this.instance.option('items[0].collapsed', false);

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), false);
        });

        QUnit.test('Expanded on init pane should not have hidden content class', function(assert) {
            this.reinit({
                items: [{ }, { }],
            });

            const $pane = this.getPanes().first();

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), false);
        });

        QUnit.test('Pane should have hidden content class after resize to 0', function(assert) {
            this.reinit({
                items: [{ }, { }],
            });
            const $pane = this.getPanes().first();
            const pointer = pointerMock(this.getResizeHandles(false).eq(0));

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), false);

            pointer.start().dragStart().drag(-10000).dragEnd();

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), true);
        });

        QUnit.test('Pane should not have hidden content class after resize from 0', function(assert) {
            this.reinit({
                items: [{ size: 0 }, { }],
            });
            const $pane = this.getPanes().first();
            const pointer = pointerMock(this.getResizeHandles(false).eq(0));

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), true);

            pointer.start().dragStart().drag(10000).dragEnd();

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), false);
        });

        QUnit.test('Pane with size=0 and visible=false should not have hidden content class', function(assert) {
            this.reinit({
                items: [{ size: 0, visible: false }, { }],
            });
            const $pane = this.getPanes().first();

            assert.strictEqual($pane.hasClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS), false);
        });
    });
});

QUnit.module('Visibility of control elements', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);

        this.checkIconsVisibility = (expectedVisibleIcons) => {
            this.getResizeHandles().each((index, resizeHandle) => {
                const { prev, resize, next } = expectedVisibleIcons[index];

                QUnit.assert.strictEqual(this.getCollapsePrevButton($(resizeHandle)).hasClass(STATE_INVISIBLE_CLASS), !prev, `collapse prev icon should ${prev ? 'not' : ''} have invisible state class`);
                QUnit.assert.strictEqual(this.getResizeHandleIcon($(resizeHandle)).hasClass(STATE_INVISIBLE_CLASS), !resize, `resize icon should ${resize ? 'not' : ''} have invisible state class`);
                QUnit.assert.strictEqual(this.getCollapseNextButton($(resizeHandle)).hasClass(STATE_INVISIBLE_CLASS), !next, `collapse next icon should ${next ? 'not' : ''} have invisible state class`);
            });
        };
    },
    afterEach: function() {
        moduleConfig.afterEach.call(this);

    }
}, () => {
    QUnit.test('Collapse buttons should be invisible when pane collapsible is not defined', function(assert) {
        this.reinit({
            dataSource: [{ }, { }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), true, 'collapse prev button is invisible');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), true, 'collapse next button is invisible');
    });

    QUnit.test('Both resize handle collapse buttons should be visible when two panes are collapsible', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true }, { collapsible: true }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), false, 'collapse prev button is visible');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), false, 'collapse next button is visible');
    });

    QUnit.test('Only collapse prev button should be visible when only left pane is collapsible', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true }, { }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), false, 'collapse prev button is visible');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), true, 'collapse next button is invisible');
    });

    QUnit.test('Only collapse next button should be visible when only right pane is collapsible', function(assert) {
        this.reinit({
            dataSource: [{ }, { collapsible: true }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), true, 'collapse prev button is invisible');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), false, 'collapse next button is visible');
    });

    QUnit.test('Collapsible buttons should become visible on panes runtime collapsable enable', function(assert) {
        this.reinit({
            dataSource: [{ }, { }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        this.instance.option('items[0].collapsible', true);
        this.instance.option('items[1].collapsible', true);

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), false, 'collapse prev button is visible');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), false, 'collapse next button is visible');
    });

    QUnit.test('Collapse prev button should be invisible (left item is collapsed on init)', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true, collapsed: true }, { }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), true, 'collapse prev button is invisible');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), false, 'collapse next button is visible');
    });

    QUnit.test('Collapse prev button should be visible (right item is not collapsible on init)', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true }, { collapsible: false }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), false, 'prev button visibility');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), true, 'next button visibility');
    });

    QUnit.test('Collapse prev button should be invisible (left item is collapsed at runtime)', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true }, { }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), false, 'prev button visibility');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), true, 'next button visibility');

        $collapsePrevButton.trigger('dxclick');

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), true, 'prev button visibility');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), false, 'next button visibility');
    });

    QUnit.test('Collapse next button should be invisible (right item is collapsed on init)', function(assert) {
        this.reinit({
            dataSource: [{ }, { collapsible: true, collapsed: true }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), false, 'collapse prev button is visible');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), true, 'collapse next button is invisible');
    });

    QUnit.test('Collapse next button should be invisible (right item is collapsed on runtime)', function(assert) {
        this.reinit({
            dataSource: [{ }, { collapsible: true }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), true, 'collapse prev button is invisible');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), false, 'collapse next button is visible');

        $collapseNextButton.trigger('dxclick');

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), false, 'collapse prev button is visible');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), true, 'collapse next button is invisible');
    });

    QUnit.test('Collapse next button should be visible (left item is collapsed, right item is not collapsible)', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true, collapsed: true }, { }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), true, 'collapse prev button is invisible');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), false, 'collapse next button is visible');
    });

    QUnit.test('Collapse prev button should be visible (right item is collapsed, left item is not collapsible)', function(assert) {
        this.reinit({
            dataSource: [{ }, { collapsible: true, collapsed: true }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), false, 'collapse prev button is visible');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), true, 'collapse next button is invisible');
    });

    QUnit.test('Collapse prev button should not be visible (left item is collapsed, right item is collapsed)', function(assert) {
        this.reinit({
            dataSource: [{ collapsible: true, collapsed: true }, { collapsible: true, collapsed: true }],
        });
        const $resizeHandle = this.getResizeHandles();
        const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
        const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

        assert.strictEqual($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS), true, 'collapse prev button is invisible');
        assert.strictEqual($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS), false, 'collapse next button is visible');
    });

    [{
        items: [{ }, { }, { }],
        expectedVisibleIcons: [{ prev: false, resize: true, next: false }, { prev: false, resize: true, next: false }]
    }, {
        items: [{ }, { collapsible: true }, { }],
        expectedVisibleIcons: [{ prev: false, resize: true, next: true }, { prev: true, resize: true, next: false }]
    }, {
        items: [{ }, { resizable: false, collapsible: true }, { }],
        expectedVisibleIcons: [{ prev: false, resize: false, next: true }, { prev: true, resize: false, next: false }]
    }, {
        items: [{ resizable: false }, { collapsible: true }, { resizable: true }],
        expectedVisibleIcons: [{ prev: false, resize: false, next: true }, { prev: true, resize: true, next: false }]
    }, {
        items: [{ collapsible: true }, { collapsible: false }, { collapsible: true }],
        expectedVisibleIcons: [{ prev: true, resize: true, next: false }, { prev: false, resize: true, next: true }]
    }, {
        items: [{ collapsible: true }, { collapsible: false, collapsed: true }, { collapsible: true }],
        expectedVisibleIcons: [{ prev: false, resize: false, next: false }, { prev: false, resize: false, next: false }]
    }, {
        items: [{ collapsible: true }, { collapsible: true, collapsed: true }, { collapsible: false }],
        expectedVisibleIcons: [{ prev: true, resize: false, next: false }, { prev: false, resize: false, next: true }]
    }, {
        items: [{ collapsible: true, collapsed: true }, { collapsible: true }, { collapsible: false }],
        expectedVisibleIcons: [{ prev: false, resize: false, next: true }, { prev: true, resize: true, next: false }]
    }, {
        items: [{ collapsible: false }, { collapsible: true }, { collapsible: true, collapsed: true }],
        expectedVisibleIcons: [{ prev: false, resize: true, next: true }, { prev: true, resize: false, next: false }]
    }, {
        items: [{ collapsible: true, collapsed: true }, { collapsible: true, collapsed: true }, { collapsible: true, collapsed: true }, { }],
        expectedVisibleIcons: [{ prev: false, resize: false, next: true }, { prev: false, resize: false, next: true }, { prev: false, resize: false, next: true }]
    }, {
        items: [{ }, { collapsible: true, collapsed: true }, { collapsible: true, collapsed: true }, { collapsible: true, collapsed: true }],
        expectedVisibleIcons: [{ prev: true, resize: false, next: false }, { prev: false, resize: false, next: true }, { prev: false, resize: false, next: true }]
    }, {
        items: [{ collapsible: true, collapsed: true }, { collapsible: true, collapsed: false }, { collapsible: true, collapsed: true }, { }],
        expectedVisibleIcons: [{ prev: false, resize: false, next: true }, { prev: true, resize: false, next: false }, { prev: false, resize: false, next: true }]
    }].forEach(({ items, expectedVisibleIcons }) => {
        QUnit.test(`Control elements visibility, items: ${JSON.stringify(items)}`, function(assert) {
            this.reinit({
                items,
            });

            this.checkIconsVisibility(expectedVisibleIcons);
        });
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

    [{
        dataSource: [{ visible: false, collapsible: false, }, { collapsible: true }],
        scenarios: [{
            paneIndex: 0,
            visible: true,
            expectedVisibleIcons: [{ prev: false, resize: true, next: true }]
        }, ]
    }, {
        dataSource: [{ visible: false, resizable: false, collapsible: false }, { collapsible: false }],
        scenarios: [{
            paneIndex: 0,
            visible: true,
            expectedVisibleIcons: [{ prev: false, resize: false, next: false }]
        }, ]
    }, {
        dataSource: [{ visible: false }, { }, { }],
        scenarios: [{
            paneIndex: 0,
            visible: true,
            expectedVisibleIcons: [{ prev: false, resize: true, next: false }, { prev: false, resize: true, next: false }]
        }]
    }].forEach(({ dataSource, scenarios }) => {
        QUnit.test(`Control elements visibility distribution after changing pane.visibility at runtime, dataSource: ${JSON.stringify(dataSource)}`, function(assert) {
            this.reinit({
                dataSource: dataSource
            });

            scenarios.forEach(({ paneIndex, visible, expectedVisibleIcons }) => {
                this.instance.option(`items[${paneIndex}].visible`, visible);

                this.checkIconsVisibility(expectedVisibleIcons);
            });
        });
    });
});

QUnit.module('Events', moduleConfig, () => {
    QUnit.test('items sizes should be already updated when onResizeEnd is raised (T1240125)', function(assert) {
        assert.expect(1);

        this.reinit({
            onResizeEnd: (eventArgs) => {
                const newItems = eventArgs.component.option('items');
                assert.strictEqual(newItems[0].size, firstPaneInitialSize + delta, 'Size of the first item should be updated');
            },
            dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
        });
        const firstPaneInitialSize = this.instance.option('items')[0].size;
        const delta = 90;
        const pointer = pointerMock(this.getResizeHandles(false).eq(0));
        pointer.start().dragStart().drag(delta, 0).dragEnd();
    });

    ['onResizeStart', 'onResize', 'onResizeEnd'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} should be called when handle dragged`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            this.reinit({
                [eventHandler]: resizeHandlerStub,
                dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
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
                dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
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
                dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
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

        const $resizeHandle = this.getResizeHandles().eq(0);

        this.getCollapsePrevButton($resizeHandle).trigger('dxclick');

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

        const $resizeHandle = this.getResizeHandles().eq(0);

        this.getCollapsePrevButton($resizeHandle).trigger('dxclick');

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

        const $resizeHandle = this.getResizeHandles().eq(0);

        this.getCollapseNextButton($resizeHandle).trigger('dxclick');

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

        const $resizeHandle = this.getResizeHandles().eq(0);

        this.getCollapseNextButton($resizeHandle).trigger('dxclick');

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

    QUnit.test('onItemExpanded should be called after change collapsed option at runtime', function(assert) {
        const onItemCollapsed = sinon.stub();
        const onItemExpanded = sinon.stub();

        this.reinit({
            onItemCollapsed,
            onItemExpanded,
            dataSource: [{ collapsed: true, collapsible: true }, { collapsible: true }]
        });

        this.instance.option('items[0].collapsed', false);

        assert.strictEqual(onItemCollapsed.callCount, 0, 'onItemCollapsed not called');
        assert.strictEqual(onItemExpanded.callCount, 1, 'onItemExpanded called');
    });

    QUnit.test('onItemCollapsed should be called after change collapsed option at runtime', function(assert) {
        const onItemCollapsed = sinon.stub();
        const onItemExpanded = sinon.stub();

        this.reinit({
            onItemCollapsed,
            onItemExpanded,
            dataSource: [{ collapsed: false, collapsible: true }, { collapsible: true }]
        });

        this.instance.option('items[0].collapsed', true);

        assert.strictEqual(onItemCollapsed.callCount, 1, 'onItemCollapsed called');
        assert.strictEqual(onItemExpanded.callCount, 0, 'onItemExpanded not called');
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
                dataSource: [{ collapsible: true }, { collapsible: true }]
            });

            const $resizeHandle = this.getResizeHandles().eq(0);

            const $targetButton = item === 'left'
                ? this.getCollapsePrevButton($resizeHandle)
                : this.getCollapseNextButton($resizeHandle);

            $targetButton.trigger('dxclick');
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

            const $resizeHandle = this.getResizeHandles().eq(0);

            const $targetButton = item === 'right'
                ? this.getCollapsePrevButton($resizeHandle)
                : this.getCollapseNextButton($resizeHandle);

            $targetButton.trigger('dxclick');
        });
    });

    QUnit.test('onItemCollapsed should have correct argument fields on item collapse at runtime', function(assert) {
        assert.expect(8);

        this.reinit({
            onItemCollapsed: (e) => {
                const { component, element, event, itemData, itemElement, itemIndex } = e;

                const $item = this.getPanes().eq(0);

                assert.strictEqual(component, this.instance, 'component field is correct');
                assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                assert.strictEqual(event, undefined, 'event is not defined');
                assert.strictEqual(isRenderer(itemElement), !!config().useJQuery, 'itemElement is correct');
                assert.strictEqual($(itemElement).is($item), true, 'itemElement field is correct');
                assert.deepEqual(itemData, { collapsed: true, size: 0, collapsible: true }, 'itemData field is correct');
                assert.strictEqual(itemIndex, 0, 'itemIndex is correct');
            },
            dataSource: [{ collapsible: true }, { collapsible: true }]
        });

        this.instance.option('items[0].collapsed', true);
    });

    QUnit.test('onItemExpanded should have correct argument fields on item expand at runtime', function(assert) {
        assert.expect(8);

        this.reinit({
            onItemExpanded: (e) => {
                const { component, element, event, itemData, itemElement, itemIndex } = e;

                const $item = this.getPanes().eq(0);

                assert.strictEqual(component, this.instance, 'component field is correct');
                assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is correct');
                assert.strictEqual($(element).is(this.$element), true, 'element field is correct');
                assert.strictEqual(event, undefined, 'event is not defined');
                assert.strictEqual(isRenderer(itemElement), !!config().useJQuery, 'itemElement is correct');
                assert.strictEqual($(itemElement).is($item), true, 'itemElement field is correct');
                assert.strictEqual(itemData.collapsed, false, 'itemData is correct');
                assert.strictEqual(itemIndex, 0, 'itemIndex');
            },
            dataSource: [{ collapsed: true, collapsible: true }, { collapsible: true }]
        });

        this.instance.option('items[0].collapsed', false);
    });

    QUnit.test('onItemCollapsed events should not be called if non declared collapsed option is changing to false', function(assert) {
        const onItemCollapsed = sinon.stub();
        const onItemExpanded = sinon.stub();

        this.reinit({
            onItemCollapsed,
            onItemExpanded,
            dataSource: [{ collapsible: true }, { collapsible: true }]
        });

        this.instance.option('items[0].collapsed', false);

        assert.strictEqual(onItemCollapsed.callCount, 0, 'onItemCollapsed not called');
        assert.strictEqual(onItemExpanded.callCount, 0, 'onItemExpanded not called');
    });

    ['onItemCollapsed', 'onItemExpanded'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} event handler should be able to be updated at runtime`, function(assert) {
            const handlerStub = sinon.stub();
            const handlerStubAfterUpdate = sinon.stub();

            this.reinit({
                [eventHandler]: handlerStub,
                dataSource: [{ collapsible: true }, { collapsible: true }]
            });

            const $resizeHandle = this.getResizeHandles().eq(0);

            const $collapsePrevButton = this.getCollapsePrevButton($resizeHandle);
            const $collapseNextButton = this.getCollapseNextButton($resizeHandle);

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
            dataSource: [{ size: '200px' }, { size: '200px' }],
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
            dataSource: [{ size: '200px' }, { size: '200px' }],
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
});

QUnit.module('Nested Splitters', moduleConfig, () => {
    [
        { propertyName: 'onResizeStart', propertyValue: () => { } },
        { propertyName: 'onResizeEnd', propertyValue: () => { } },
        { propertyName: 'onResize', propertyValue: () => { } },
        { propertyName: 'onItemCollapsed', propertyValue: () => { } },
        { propertyName: 'onItemExpanded', propertyValue: () => { } },
        { propertyName: 'allowKeyboardNavigation', propertyValue: false },
        { propertyName: 'allowKeyboardNavigation', propertyValue: true },
        { propertyName: 'rtlEnabled', propertyValue: false },
        { propertyName: 'rtlEnabled', propertyValue: true },
        { propertyName: 'separatorSize', propertyValue: 12 },
    ].forEach(({ propertyName, propertyValue }) => {
        QUnit.test(`${propertyName} property should be passed to nested splitter on initialization`, function(assert) {
            this.reinit({
                [propertyName]: propertyValue,
                items: [{
                    splitter: {
                        dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
                    }
                }]
            });

            const $nestedSplitter = this.getNestedSplitter(this.$element);
            const nestedSplitterInstance = $nestedSplitter.dxSplitter('instance');

            assert.strictEqual(nestedSplitterInstance.option(propertyName), propertyValue);
        });
    });

    [
        { eventHandler: 'onItemCollapsed', arrowKey: 'ArrowLeft', dataSource: [{ collapsible: true }, { collapsible: true }] },
        { eventHandler: 'onItemExpanded', arrowKey: 'ArrowRight', dataSource: [{ collapsed: true, collapsible: true }, { }] },
    ].forEach(({ eventHandler, arrowKey, dataSource }) => {
        QUnit.test(`${eventHandler} should be invoked when nested splitter's pane collapsed state changed if option was changed at runtime`, function(assert) {
            const handlerStub = sinon.stub();
            const handlerStubAfterUpdate = sinon.stub();

            this.reinit({
                [eventHandler]: handlerStub,
                items: [{
                    splitter: {
                        [eventHandler]: handlerStub,
                        dataSource
                    }
                }]
            });

            this.instance.option(`${eventHandler}`, handlerStubAfterUpdate);

            const $resizeHandle = this.getResizeHandles(false)[0];
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(arrowKey, { ctrlKey: true });

            assert.strictEqual(handlerStub.callCount, 0);
            assert.strictEqual(handlerStubAfterUpdate.callCount, 1);
        });
    });

    [
        { propertyName: 'allowKeyboardNavigation', propertyValue: true, newPropertyValue: false },
        { propertyName: 'allowKeyboardNavigation', propertyValue: false, newPropertyValue: true },
        { propertyName: 'rtlEnabled', propertyValue: true, newPropertyValue: false },
        { propertyName: 'rtlEnabled', propertyValue: false, newPropertyValue: true },
        { propertyName: 'rtlEnabled', propertyValue: true, newPropertyValue: false },
        { propertyName: 'separatorSize', propertyValue: 9, newPropertyValue: 12 },
    ].forEach(({ propertyName, propertyValue, newPropertyValue }) => {
        QUnit.test(`${propertyName} property should be passed to nested splitters at runtime`, function(assert) {
            this.reinit({
                [propertyName]: propertyValue,
                items: [{
                    splitter: {
                        dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
                    }
                }, { },
                {
                    splitter: {
                        dataSource: [
                            { text: 'Pane_1' },
                            {
                                splitter: {
                                    dataSource: [
                                        { text: 'Pane_1' },
                                        { text: 'Pane_2' }
                                    ]
                                }
                            }
                        ]
                    }
                }]
            });

            this.instance.option(propertyName, newPropertyValue);

            const $nestedItems = this.getNestedSplitter(this.$element);

            this.checkItemsOption($nestedItems, propertyName, newPropertyValue);

            const secondLevelNestedSplitterElement = this.getNestedSplitter($nestedItems.eq(1));
            const secondLevelNestingSplitter = secondLevelNestedSplitterElement.dxSplitter('instance');

            assert.strictEqual(secondLevelNestingSplitter.option(propertyName), newPropertyValue);
        });
    });

    [
        { propertyName: 'onResizeStart', propertyValue: () => { } },
        { propertyName: 'onResizeEnd', propertyValue: () => { } },
        { propertyName: 'onResize', propertyValue: () => { } },
        { propertyName: 'onItemCollapsed', propertyValue: () => { } },
        { propertyName: 'onItemExpanded', propertyValue: () => { } },
    ].forEach(({ propertyName, propertyValue, newPropertyValue }) => {
        QUnit.test(`${propertyName} handler property should be passed to nested splitters at runtime`, function(assert) {
            this.reinit({
                [propertyName]: propertyValue,
                items: [{
                    splitter: {
                        dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
                    }
                }, { },
                {
                    splitter: {
                        dataSource: [
                            { text: 'Pane_1' },
                            {
                                splitter: {
                                    dataSource: [
                                        { text: 'Pane_1' },
                                        { text: 'Pane_2' }
                                    ]
                                }
                            }
                        ]
                    }
                }]
            });

            this.instance.option(propertyName, newPropertyValue);

            const $nestedItems = this.getNestedSplitter(this.$element);

            this.checkItemsOption($nestedItems, propertyName, newPropertyValue);

            const secondLevelNestedSplitterElement = this.getNestedSplitter($nestedItems.eq(1));
            const secondLevelNestingSplitter = secondLevelNestedSplitterElement.dxSplitter('instance');

            assert.strictEqual(secondLevelNestingSplitter.option(propertyName), newPropertyValue);
        });
    });

    QUnit.test('updating nested splitter"s property should not affect parent', function(assert) {
        this.reinit({
            items: [{
                splitter: {
                    dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
                }
            }]
        });

        const $nestedSplitter = this.getNestedSplitter(this.$element);
        const nestedSplitterInstance = $nestedSplitter.eq(0).dxSplitter('instance');
        nestedSplitterInstance.option('separatorSize', 5);

        assert.strictEqual(this.instance.option('separatorSize'), 8);
    });

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
                        dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
                    }
                }]
            });

            const pointer = pointerMock(this.getResizeHandles(false)[0]);

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 1);
        });

        QUnit.test(`${eventHandler} should be called when a handle in the nested splitter is dragged, ${eventHandler} has been changed at runtime`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            const newResizeHandlerStub = sinon.stub();

            this.reinit({
                [eventHandler]: resizeHandlerStub,
                items: [{
                    splitter: {
                        dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
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
                        dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
                    }
                }]
            });

            const pointer = pointerMock(this.getResizeHandles(false)[0]);

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 0);
            assert.strictEqual(nestedSplitterResizeHandlerStub.callCount, 1);
        });

        QUnit.skip(`nestedSplitter.${eventHandler} event handler should be able to be updated at runtime`, function(assert) {
            const handlerStub = sinon.stub();
            const handlerStubAfterUpdate = sinon.stub();

            this.reinit({
                items: [{
                    splitter: {
                        [eventHandler]: handlerStub,
                        dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
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

    QUnit.test('RegisterKeyHandler registers key handling for all resize handles of nested splitter components', function(assert) {
        const registerKeyHandlerSpy = sinon.spy();

        this.reinit({
            items: [{
                splitter: {
                    dataSource: [{
                        text: 'Pane_1'
                    }, {
                        splitter: {
                            dataSource: [{
                                text: 'Pane_2'
                            }, {
                                text: 'Pane_3'
                            }]
                        }
                    }]
                }
            }],
        });

        this.instance.registerKeyHandler('enter', registerKeyHandlerSpy);

        const $resizeHandles = this.getResizeHandles(false);

        $resizeHandles.eq(0).trigger(createEvent('keydown', { key: 'Enter' }));

        assert.strictEqual(registerKeyHandlerSpy.callCount, 1);
        assert.strictEqual(registerKeyHandlerSpy.args[0][0].target, $resizeHandles.get(0), 'event target is correct');

        $resizeHandles.eq(1).trigger(createEvent('keydown', { key: 'Enter' }));

        assert.strictEqual(registerKeyHandlerSpy.callCount, 2);
        assert.strictEqual(registerKeyHandlerSpy.args[1][0].target, $resizeHandles.get(1), 'event target is correct');

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
        { key: 'ArrowRight', wrongKey: 'ArrowLeft', initialRtlEnabled: false },
        { key: 'ArrowLeft', wrongKey: 'ArrowRight', initialRtlEnabled: true },
    ].forEach(({ key, wrongKey, initialRtlEnabled }) => {
        QUnit.test(`Collapse direction should be changed when rtlEnabled changed from ${initialRtlEnabled} at runtime`, function(assert) {
            this.reinit({
                rtlEnabled: initialRtlEnabled,
                items: [{ collapsible: true }, { }],
            });

            this.instance.option('rtlEnabled', !initialRtlEnabled);

            const $resizeHandle = this.getResizeHandles();
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(wrongKey, { ctrlKey: true });

            assert.strictEqual(this.instance.option('items[0].collapsed'), undefined, 'item is not collapsed');

            keyboard.keyDown(key, { ctrlKey: true });

            assert.strictEqual(this.instance.option('items[0].collapsed'), true, 'item is collapsed');
        });
    });

    [
        { key: 'ArrowRight', orientation: 'horizontal', wrongKey: 'ArrowUp', rtlEnabled: true },
        { key: 'ArrowUp', orientation: 'vertical', wrongKey: 'ArrowDown', rtlEnabled: true },
        { key: 'ArrowLeft', orientation: 'horizontal', wrongKey: 'ArrowUp', rtlEnabled: false },
        { key: 'ArrowUp', orientation: 'vertical', wrongKey: 'ArrowLeft', rtlEnabled: false }
    ].forEach(({ key, orientation, wrongKey, rtlEnabled }) => {
        QUnit.test(`Prev item should be collapsed on command+${key} (orientation=${orientation}, rtlEnabled=${rtlEnabled})`, function(assert) {
            this.reinit({
                orientation,
                rtlEnabled,
                items: [{ collapsible: true }, { }],
            });

            const $resizeHandle = this.getResizeHandles();
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(key, { ctrlKey: true });

            assert.strictEqual(this.instance.option('items[0].collapsed'), true, 'item is collapsed');
        });

        QUnit.test(`Prev item should not be collapsed on command+${wrongKey} (orientation=${orientation}, rtlEnabled=${rtlEnabled})`, function(assert) {
            this.reinit({
                orientation,
                rtlEnabled,
                items: [{ collapsible: true }, { }],
            });

            const $resizeHandle = this.getResizeHandles();
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(wrongKey, { ctrlKey: true });

            assert.strictEqual(this.instance.option('items[0].collapsed'), undefined, 'item is not collapsed');
        });

        QUnit.test(`Prev item should not be collapsed on command+${wrongKey} if pane is not collapsible (rtlEnabled=${rtlEnabled})`, function(assert) {
            this.reinit({
                orientation,
                rtlEnabled,
                items: [{ }, { }],
            });

            const $resizeHandle = this.getResizeHandles();
            const keyboard = keyboardMock($resizeHandle);

            keyboard.keyDown(wrongKey, { ctrlKey: true });

            assert.strictEqual(this.instance.option('items[0].collapsed'), undefined, 'item is not collapsed');
        });

        QUnit.test(`onItemCollapsed should be fired on command+${key} (orientation=${orientation}, rtlEnabled=${rtlEnabled})`, function(assert) {
            const onItemCollapsed = sinon.stub();
            this.reinit({
                orientation,
                rtlEnabled,
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
        { key: 'ArrowLeft', orientation: 'horizontal', wrongKey: 'ArrowDown', rtlEnabled: true },
        { key: 'ArrowDown', orientation: 'vertical', wrongKey: 'ArrowUp', rtlEnabled: true },
        { key: 'ArrowRight', orientation: 'horizontal', wrongKey: 'ArrowDown' },
        { key: 'ArrowDown', orientation: 'vertical', wrongKey: 'ArrowRight' }
    ].forEach(({ key, orientation, wrongKey, rtlEnabled }) => {
        QUnit.test(`Next item should be collapsed on command+${key} (orientation=${orientation}, rtlEnabled=${rtlEnabled})`, function(assert) {
            this.reinit({
                orientation,
                rtlEnabled,
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

        QUnit.test(`onItemCollapsed should be fired on command+${key} (orientation=${orientation}, rtlEnabled=${rtlEnabled})`, function(assert) {
            const onItemCollapsed = sinon.stub();
            this.reinit({
                orientation,
                rtlEnabled,
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
