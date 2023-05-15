window.DevExpress = { viz: { map: { sources: {} } } };

import $ from 'core/renderer';
import { getWidth, getHeight, setWidth, setHeight } from 'core/utils/size';

import 'viz/chart';
import 'viz/pie_chart';
import 'viz/polar_chart';
import 'viz/linear_gauge';
import 'viz/circular_gauge';
import 'viz/bar_gauge';
import 'viz/range_selector';
import 'viz/vector_map';
import 'viz/sparkline';
import 'viz/bullet';
import 'viz/tree_map';

import '../../../artifacts/js/vectormap-data/world.js';
import '../../../artifacts/js/vectormap-data/usa.js';

const chartTestsSignature = {
    getInitOptions() {
        return {
            animation: {
                enabled: false
            },
            dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
            series: [{ type: 'line' }, { type: 'bar' }, { type: 'area' }]
        };
    },
    getExpandedOptions() {
        const initOptions = this.getInitOptions();

        initOptions.dataSource.push({ arg: initOptions.dataSource.length + 1, val: 10 });
        return { dataSource: initOptions.dataSource };
    }
};

const linearGaugeTestSignature = {
    animation: {
        enabled: false
    },
    getInitOptions() {
        return {
            scale: {
                startValue: 0,
                endValue: 5
            },
            subvalues: [4, 2],
            value: 4.3
        };
    },
    getExpandedOptions() {
        return {
            ...this.getInitOptions(),
            subvalues: [1, 2, 3]
        };
    }
};

const charts = {
    dxChart: chartTestsSignature,

    dxPieChart: {
        getInitOptions() {
            return {
                ...allWidgets.dxChart.getInitOptions(),
                series: [{}]
            };
        },
        getExpandedOptions: chartTestsSignature.getExpandedOptions
    },
    dxPolarChart: chartTestsSignature
};

const allWidgets = {
    ...charts,
    dxLinearGauge: linearGaugeTestSignature,
    dxCircularGauge: linearGaugeTestSignature,
    dxBarGauge: {
        getInitOptions() {
            return {
                animation: {
                    enabled: false
                },
                startValue: 0,
                endValue: 100,
                values: [47, 65, 84, 71]
            };
        },
        getExpandedOptions() {
            return { values: this.getInitOptions().values.concat([1, 2, 3, 4]) };
        }
    },
    dxRangeSelector: {
        getInitOptions: function() {
            return {
                behavior: {
                    animationEnabled: false
                },
                scale: {
                    startValue: 15000,
                    endValue: 150000
                }
            };
        },
        getExpandedOptions: function() {
            const initOptions = this.getInitOptions();

            initOptions.scale.startValue = 1000;
            return initOptions;
        }
    },
    dxVectorMap: {
        getInitOptions() {
            return {
                layers: {
                    dataSource: DevExpress.viz.map.sources.world
                }
            };
        },
        getExpandedOptions() {
            return {
                layers: {
                    dataSource: DevExpress.viz.map.sources['usa']
                }
            };
        }
    },
    dxSparkline: {
        getInitOptions() {
            return { dataSource: chartTestsSignature.getInitOptions().dataSource };
        },
        getExpandedOptions() {
            return { dataSource: chartTestsSignature.getExpandedOptions().dataSource };
        }
    },
    dxBullet: {
        getInitOptions() {
            return {
                startScaleValue: 0,
                endScaleValue: 35,
                target: 10
            };
        },
        getExpandedOptions() {
            const initOptions = this.getInitOptions();

            initOptions.target = 7;
            return initOptions;
        }
    },
    dxTreeMap: {
        getInitOptions() {
            return {
                dataSource: [{ value: 1, text: '1' }, { value: 2, text: '2', items: [{ value: 2, text: '43' }] }]
            };
        },
        getExpandedOptions() {
            return {
                dataSource: [{ value: 1, text: '22' }, { value: 1, text: '22' }]
            };
        }
    }
};

const environment = {
    beforeEach() {
        this.$container = $('#widgetContainer');
    },
    assertNodesCount(assert, initCount) {
        assert.strictEqual(domNodesCount(this.$container[0]), initCount);
    },
    prepareDataForTest(widgetName, config) {
        const widget = this.$container[widgetName](config.getInitOptions())[widgetName]('instance');
        const initNodesCount = domNodesCount(this.$container[0]);

        return { widget: widget, initNodeCount: initNodesCount };
    }
};

function domNodesCount(node) {
    let i;
    let count = 1;

    const children = $(node).children();

    if(children.length) {
        for(i = 0; i < children.length; i++) {
            count += domNodesCount(children[i]);
        }
    }
    return count;
}

QUnit.testStart(function() {
    const markup = '<div id="widgetContainer"></div>';

    $('#qunit-fixture').html(markup);
    $('#widgetContainer').css({
        width: '300px',
        height: '150px'
    });
});

QUnit.module('options updating', environment);

for(const widgetName in allWidgets) {
    const config = allWidgets[widgetName];

    QUnit.test(widgetName + ' - creation & update', function(assert) {
        const data = this.prepareDataForTest(widgetName, config);

        data.widget.option(config.getExpandedOptions());
        data.widget.option(config.getInitOptions());

        this.assertNodesCount(assert, data.initNodeCount);
    });
}

QUnit.module('resizing', environment);

for(const widgetName in allWidgets) {
    const config = allWidgets[widgetName];

    QUnit.test(widgetName + ' - resize', function(assert) {
        const srcWidth = getWidth(this.$container);
        const srcHeight = getHeight(this.$container);
        const data = this.prepareDataForTest(widgetName, config);

        setWidth(this.$container, 100);
        setHeight(this.$container, 100);

        data.widget.render();

        setWidth(this.$container, srcWidth);
        setHeight(this.$container, srcHeight);

        data.widget.render();

        this.assertNodesCount(assert, data.initNodeCount);
    });
}

QUnit.module('Refresh', environment);

for(const widgetName in charts) {
    const config = charts[widgetName];

    QUnit.test(`${widgetName} - refresh`, function(assert) {
        const { widget, initNodeCount } = this.prepareDataForTest(widgetName, config);

        widget.refresh();

        this.assertNodesCount(assert, initNodeCount);
    });
}
