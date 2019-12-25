window.DevExpress = { viz: { map: { sources: {} } } };

var $ = require('jquery'),
    chartTestsSignature = {
        getInitOptions: function() {
            return {
                animation: {
                    enabled: false
                },
                dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
                series: [{ type: 'line' }, { type: 'bar' }, { type: 'area' }]
            };
        },
        getExpandedOptions: function() {
            var initOptions = this.getInitOptions();

            initOptions.dataSource.push({ arg: initOptions.dataSource.length + 1, val: 10 });
            return { dataSource: initOptions.dataSource };
        }
    },
    linearGaugeTestSignature = {
        animation: {
            enabled: false
        },
        getInitOptions: function() {
            return {
                scale: {
                    startValue: 0,
                    endValue: 5
                },
                subvalues: [4, 2],
                value: 4.3
            };
        },
        getExpandedOptions: function() {
            return $.extend(this.getInitOptions(), {
                subvalues: [1, 2, 3]
            });
        }
    },
    widgets = {
        'dxChart': chartTestsSignature,

        'dxPieChart': {
            getInitOptions: function() {
                return $.extend(widgets.dxChart.getInitOptions(), { series: [{}] });
            },
            getExpandedOptions: chartTestsSignature.getExpandedOptions
        },
        'dxPolarChart': chartTestsSignature,
        'dxLinearGauge': linearGaugeTestSignature,
        'dxCircularGauge': linearGaugeTestSignature,
        'dxBarGauge': {
            getInitOptions: function() {
                return {
                    animation: {
                        enabled: false
                    },
                    startValue: 0,
                    endValue: 100,
                    values: [47, 65, 84, 71]
                };
            },
            getExpandedOptions: function() {
                return { values: this.getInitOptions().values.concat([1, 2, 3, 4]) };
            }
        },
        'dxRangeSelector': {
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
                var initOptions = this.getInitOptions();

                initOptions.scale.startValue = 1000;
                return initOptions;
            }
        },
        'dxVectorMap': {
            getInitOptions: function() {
                return {
                    layers: {
                        dataSource: DevExpress.viz.map.sources.world
                    }
                };
            },
            getExpandedOptions: function() {
                return {
                    layers: {
                        dataSource: DevExpress.viz.map.sources['usa']
                    }
                };
            }
        },
        'dxSparkline': {
            getInitOptions: function() {
                return { dataSource: chartTestsSignature.getInitOptions().dataSource };
            },
            getExpandedOptions: function() {
                return { dataSource: chartTestsSignature.getExpandedOptions().dataSource };
            }
        },
        'dxBullet': {
            getInitOptions: function() {
                return {
                    startScaleValue: 0,
                    endScaleValue: 35,
                    target: 10
                };
            },
            getExpandedOptions: function() {
                var initOptions = this.getInitOptions();

                initOptions.target = 7;
                return initOptions;
            }
        },
        'dxTreeMap': {
            getInitOptions: function() {
                return {
                    dataSource: [{ value: 1, text: '1' }, { value: 2, text: '2', items: [{ value: 2, text: '43' }] }]
                };
            },
            getExpandedOptions: function() {
                return {
                    dataSource: [{ value: 1, text: '22' }, { value: 1, text: '22' }]
                };
            }
        }
    };

require('viz/chart');
require('viz/pie_chart');
require('viz/polar_chart');
require('viz/linear_gauge');
require('viz/circular_gauge');
require('viz/bar_gauge');
require('viz/range_selector');
require('viz/vector_map');
require('viz/sparkline');
require('viz/bullet');
require('viz/tree_map');

require('../../../artifacts/js/vectormap-data/world.js');
require('../../../artifacts/js/vectormap-data/usa.js');

function domNodesCount(node) {
    var i,
        count = 1,
        children = $(node).children();

    if(children.length) {
        for(i = 0; i < children.length; i++) {
            count += domNodesCount(children[i]);
        }
    }
    return count;
}

var environment = {
    beforeEach: function() {
        this.$container = $('#widgetContainer');
    },
    assertNodesCount: function(assert, initCount) {
        assert.strictEqual(domNodesCount(this.$container[0]), initCount);
    },
    prepareDataForTest: function(widgetName, config) {
        var widget = this.$container[widgetName](config.getInitOptions())[widgetName]('instance'),
            initNodesCount = domNodesCount(this.$container[0]);

        return { widget: widget, initNodeCount: initNodesCount };
    }
};

QUnit.testStart(function() {
    var markup = '<div id="widgetContainer" style="width: 300px; height: 150px;"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('options updating', environment);

$.each(widgets, function(widgetName, config) {
    QUnit.test(widgetName + ' - creation & update', function(assert) {
        var data = this.prepareDataForTest(widgetName, config);

        data.widget.option(config.getExpandedOptions());
        data.widget.option(config.getInitOptions());

        this.assertNodesCount(assert, data.initNodeCount);
    });
});

QUnit.module('resizing', environment);

$.each(widgets, function(widgetName, config) {
    QUnit.test(widgetName + ' - resize', function(assert) {
        var srcWidth = this.$container.width(),
            srcHeight = this.$container.height(),
            data = this.prepareDataForTest(widgetName, config);

        this.$container.width(100);
        this.$container.height(100);

        data.widget.render();

        this.$container.width(srcWidth);
        this.$container.height(srcHeight);

        data.widget.render();

        this.assertNodesCount(assert, data.initNodeCount);
    });
});
