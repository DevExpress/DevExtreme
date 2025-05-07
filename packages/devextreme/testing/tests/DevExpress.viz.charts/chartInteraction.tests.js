import $ from 'jquery';
import devices from '__internal/core/m_devices';
import { DataSource } from 'common/data/data_source/data_source';
import errors from 'core/errors';

import 'viz/chart';
import 'viz/polar_chart';

const SERIES_POINT_MARKER_SELECTOR = '.dxc-series circle';
const LEGEND_TEXT_SELECTOR = '.dxc-legend .dxc-title text';

QUnit.testStart(function() {
    const markup =
        '<div class="tooltipInteraction">\
            <div class="parentContainer">\
                <div id="chart" class="chart"></div>\
            </div>\
            <div class="newParentContainer">\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Tooltip behavior on target scroll', {
    beforeEach: function() {
        this.tooltipHiddenSpy = sinon.spy();
        $('#qunit-fixture').css({ left: '-150px', top: '0px' });
    },
    createChart: function() {
        $('.tooltipInteraction .chart').dxChart({
            animation: { enabled: false },
            dataSource: [{ arg: 1, val: 1 }],
            commonAxisSettings: {
                grid: { visible: false },
                label: { visible: false },
                point: { visible: false },
                tick: { visible: false },
                visible: false
            },
            series: [{ point: { visible: false }, label: { visible: false } }],
            legend: { visible: false },
            tooltip: { enabled: true },
            onTooltipHidden: this.tooltipHiddenSpy
        });
    },
    showTooltip: function() {
        $('.tooltipInteraction .chart').dxChart('instance').getAllSeries()[0].getAllPoints()[0].showTooltip();
    }
});

QUnit.test('tooltip should be hidden on any target\'s parent scroll', function(assert) {
    this.createChart();
    this.showTooltip();

    // act
    $('.tooltipInteraction .parentContainer').triggerHandler('scroll');

    assert.equal(this.tooltipHiddenSpy.calledOnce, true);
});

QUnit.test('tooltip should be hidden on window scroll event on desktop', function(assert) {
    const originalPlatform = devices.real().platform;

    try {
        devices.real({ platform: 'generic' });
        this.createChart();
        this.showTooltip();

        // act
        $(window).triggerHandler('scroll');

        assert.equal(this.tooltipHiddenSpy.calledOnce, true);
    } finally {
        devices.real({ platform: originalPlatform });
    }
});

QUnit.test('tooltip should not be hidden on window scroll event on mobile devices', function(assert) {
    const originalPlatform = devices.real().platform;

    try {
        devices.real({ platform: 'ios' });

        this.createChart();
        this.showTooltip();

        // act
        $(window).triggerHandler('scroll');

        assert.equal(this.tooltipHiddenSpy.called, false);
    } finally {
        devices.real({ platform: originalPlatform });
    }
});

QUnit.test('tooltip should not be hidden if target parent was changed (scroll on previous parent)', function(assert) {
    this.createChart();

    const $chart = $('.parentContainer .chart').detach();
    $chart.appendTo('.tooltipInteraction .newParentContainer');
    $chart.dxChart('instance').render({ force: true });
    this.showTooltip();

    // act
    $('.tooltipInteraction .parentContainer').triggerHandler('scroll');

    assert.equal(this.tooltipHiddenSpy.calledOnce, false);
});

QUnit.test('tooltip should be hidden if target parent was changed (scroll on new parent)', function(assert) {
    this.createChart();

    const $chart = $('.parentContainer .chart').detach();
    $chart.appendTo('.tooltipInteraction .newParentContainer');
    $chart.dxChart('instance').render({ force: true });
    this.showTooltip();

    // act
    $('.tooltipInteraction .newParentContainer').triggerHandler('scroll');

    assert.equal(this.tooltipHiddenSpy.calledOnce, true);
});

QUnit.test('target scroll subscriptions should be unsubscribed for current chart', function(assert) {
    this.createChart();
    const chart = $('<div></div>').appendTo('.parentContainer').dxChart({}).dxChart('instance');
    this.showTooltip();

    // act
    chart.dispose();
    $('.tooltipInteraction .parentContainer').triggerHandler('scroll');

    assert.equal(this.tooltipHiddenSpy.calledOnce, true);
});

QUnit.module('Misc');

// T351032
// The exact conditions - one of changed options is any requiring "_reinit", other is "dataSource" -
// so "_dataSourceChangedHandler" is called during "_reinit".
// The new data source should cause incident - so "incidentOccurred" event is triggered during "_dataSourceChangedHandler".
// During incident processing "beginUpdate" must be called somehow.
// In the customer's issue it is somehow accomplished by actions code. In tests (for simplicity) it is done manually.
// On "beginUpdate" chart comes to invalid state and later crashes on "endUpdate".
QUnit.test('There should be no crash when chart updating is began after option is changed and ended some time later', function(assert) {
    const chart = $('#chart').dxChart({
        dataSource: [{ arg: 1, val: 1 }],
        series: {},
        onIncidentOccurred: function(e) {
            chart.beginUpdate();
            chart.option('dataSource', []);
        }
    }).dxChart('instance');

    chart.option({
        dataSource: [{ arg: 1, v: 1 }],
        argumentAxis: {}
    });
    chart.endUpdate();

    assert.ok(true, 'there should be no exceptions');
});

// T357324
QUnit.test('Three stacked spline area series (one of which has null point) should not cause crash', function(assert) {
    $('.chart').dxChart({
        dataSource: [{
            arg: 1, v1: 1, v2: 2, v3: 3
        }, {
            arg: 2, v1: 2, v2: null, v3: 1
        }],
        commonSeriesSettings: { type: 'stackedSplineArea' },
        series: [{ valueField: 'v1' }, { valueField: 'v2' }, { valueField: 'v3' }]
    });

    assert.ok(true, 'there should be no exceptions');
});

// T402081
QUnit.test('number of rendering on updating dataSource', function(assert) {
    const drawn = sinon.spy();
    const data = new DataSource({
        store: []
    });
    const chart = $('#chart').dxChart({
        dataSource: data,
        series: {},
        onDrawn: drawn
    }).dxChart('instance');

    drawn.resetHistory();

    chart.option({ dataSource: data });
    data.load();

    assert.equal(drawn.callCount, 2, 'drawn only on changing dataSource & load');
});

// T600660
QUnit.test('useSpiderWeb option changing', function(assert) {
    const polar = $('#chart').dxPolarChart({
        series: [{}]
    }).dxPolarChart('instance');
    const initialSeries = polar.getAllSeries()[0];

    polar.option('useSpiderWeb', true);

    assert.ok(polar.getAllSeries()[0].getOptions().spiderWidget);
    assert.strictEqual(initialSeries, polar.getAllSeries()[0]);
});

// T738245
QUnit.test('Legend\'s title as string', function(assert) {
    const drawn = sinon.spy();
    $('#chart').dxChart({
        series: {},
        onDrawn: drawn,
        legend: {
            title: '123'
        }
    });

    assert.strictEqual(drawn.callCount, 1);
});

QUnit.test('Legend title position should not change after legend visibility change (T1210271)', function(assert) {
    const chart = $('#chart').dxChart({
        legend: {
            title: 'Legend',
            visible: true
        },
        series: [{}],
    });

    const initialTextY = Number(chart.find(LEGEND_TEXT_SELECTOR).attr('y'));

    assert.roughEqual(initialTextY, 17, 2);

    const chartInstance = chart.dxChart('instance');
    chartInstance.option('legend.visible', false);
    chartInstance.option('legend.visible', true);

    const textYAfterVisibilityChange = Number(chart.find(LEGEND_TEXT_SELECTOR).attr('y'));
    assert.roughEqual(textYAfterVisibilityChange, 17, 2);
});

QUnit.test('Old title should be disposed upon creating a new one', function(assert) {
    const chart = $('#chart').dxChart({
        legend: {
            title: 'Legend',
            visible: true
        },
        series: [{}],
    }).dxChart('instance');

    const disposeSpy = sinon.spy(chart._legend._title, 'dispose');

    chart.option('legend.visible', false);
    chart.option('legend.visible', true);

    assert.strictEqual(disposeSpy.callCount, 1);
});

// T999609
QUnit.test('Value axis range ajusting after resetVisualRange', function(assert) {
    const dataSource = [];

    for(let i = 0; i < 10; i++) {
        dataSource.push({ arg: i, val: i });
    }

    const chart = $('#chart').dxChart({
        dataSource,
        argumentAxis: {
            visualRange: {
                startValue: 8
            }
        },
        legend: { visible: false },
        series: {
            aggregation: {
                enabled: true
            }
        }
    }).dxChart('instance');

    chart.resetVisualRange();

    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 0, endValue: 9 });
});

QUnit.module('series API', {
    beforeEach: function() {
        this.options = {
            animation: { enabled: false },
            commonAxisSettings: {
                grid: { visible: false },
                label: { visible: false },
                tick: { visible: false },
                visible: false
            },
            commonSeriesSettings: {
                point: { visible: false },
                label: { visible: false }
            },
            dataSource: [
                { arg: 1, val: 1, val2: 1 },
                { arg: 2, val: 2, val2: 2 },
                { arg: 3, val: 3, val2: 3 }
            ],
            series: [{ argumentField: 'arg', valueField: 'val' }]
        };
    },
    createChart: function(options) {
        this.chart = $('#chart').dxChart(options || this.options).dxChart('instance');

        return this.chart;
    }
});

QUnit.test('single series. select', function(assert) {
    // arrange
    this.options.onSeriesSelectionChanged = sinon.spy();

    const chart = this.createChart(this.options);

    // act
    chart.getAllSeries()[0].select();

    // assert
    assert.equal(this.options.onSeriesSelectionChanged.callCount, 1);
});

QUnit.test('single series. double select', function(assert) {
    // arrange
    this.options.onSeriesSelectionChanged = sinon.spy();

    const chart = this.createChart(this.options);

    chart.getAllSeries()[0].select();
    // act
    chart.getAllSeries()[0].select();

    // assert
    assert.equal(this.options.onSeriesSelectionChanged.callCount, 1);
});

QUnit.test('single series. clear selection selected series', function(assert) {
    // arrage
    this.options.onSeriesSelectionChanged = sinon.spy();
    const chart = this.createChart(this.options);

    chart.getAllSeries()[0].select();

    // act
    chart.getAllSeries()[0].clearSelection();

    // assert
    assert.equal(this.options.onSeriesSelectionChanged.callCount, 2);
});

QUnit.test('single series. clear selection not selected series', function(assert) {
    // arrage
    this.options.onSeriesSelectionChanged = sinon.spy();
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].clearSelection();

    // assert
    assert.equal(this.options.onSeriesSelectionChanged.callCount, 0);
});

QUnit.test('select second series with single selection mode', function(assert) {
    // arrange
    this.options.series.push({ argumentField: 'arg', valueField: 'val2' });
    this.options.onSeriesSelectionChanged = sinon.spy();
    this.options.seriesSelectionMode = 'single';
    this.createChart(this.options);

    const allSeries = this.chart.getAllSeries();

    allSeries[0].select();

    // act
    allSeries[1].select();

    // assert
    assert.strictEqual(allSeries[0].isSelected(), false);
    assert.strictEqual(allSeries[1].isSelected(), true);
    assert.equal(this.options.onSeriesSelectionChanged.callCount, 3);
});

QUnit.test('select series with two series', function(assert) {
    // arrange
    this.options.series.push({ argumentField: 'arg', valueField: 'val2' });
    this.options.seriesSelectionMode = 'single';
    this.createChart(this.options);

    const allSeries = this.chart.getAllSeries();

    // act
    allSeries[0].select();

    // assert
    assert.strictEqual(allSeries[0].isSelected(), true);
});

QUnit.test('select second series with multiple selection mode', function(assert) {
    // arrange
    this.options.series.push({ argumentField: 'arg', valueField: 'val2' });
    this.options.seriesSelectionMode = 'multiple';
    this.createChart(this.options);

    const allSeries = this.chart.getAllSeries();

    allSeries[0].select();

    // act
    allSeries[1].select();

    // assert
    assert.strictEqual(allSeries[0].isSelected(), true);
    assert.strictEqual(allSeries[1].isSelected(), true);
});

QUnit.test('select point', function(assert) {
    // arrange
    const pointSelectionChanged = this.options.onPointSelectionChanged = sinon.spy();

    this.options.pointSelectionMode = 'single';
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].select();

    // assert
    assert.strictEqual(this.chart.getAllSeries()[0].getAllPoints()[0].isSelected(), true);
    assert.equal(pointSelectionChanged.callCount, 1);
});

QUnit.test('select selected point', function(assert) {
    // arrange
    const pointSelectionChanged = this.options.onPointSelectionChanged = sinon.spy();

    this.options.pointSelectionMode = 'single';
    this.createChart(this.options);
    this.chart.getAllSeries()[0].getAllPoints()[0].select();

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].select();

    // assert
    assert.equal(pointSelectionChanged.callCount, 1);
});

QUnit.test('clear selection of selected point', function(assert) {
    // arrange
    const pointSelectionChanged = this.options.onPointSelectionChanged = sinon.spy();

    this.options.pointSelectionMode = 'single';
    this.createChart(this.options);

    this.chart.getAllSeries()[0].getAllPoints()[0].select();
    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].clearSelection();

    // assert
    assert.strictEqual(this.chart.getAllSeries()[0].getAllPoints()[0].isSelected(), false);
    assert.equal(pointSelectionChanged.callCount, 2);
});

QUnit.test('clear selection of unselected point', function(assert) {
    // arrange
    const pointSelectionChanged = this.options.onPointSelectionChanged = sinon.spy();

    this.options.pointSelectionMode = 'single';
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].clearSelection();

    // assert
    assert.equal(pointSelectionChanged.callCount, 0);
});

QUnit.test('select two points. single mode', function(assert) {
    // arrange
    const pointSelectionChanged = this.options.onPointSelectionChanged = sinon.spy();

    this.options.pointSelectionMode = 'single';
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].select();
    this.chart.getAllSeries()[0].getAllPoints()[1].select();

    // assert
    assert.strictEqual(this.chart.getAllSeries()[0].getAllPoints()[0].isSelected(), false);
    assert.strictEqual(this.chart.getAllSeries()[0].getAllPoints()[1].isSelected(), true);
    assert.equal(pointSelectionChanged.callCount, 3);
});

QUnit.test('select points in different series', function(assert) {
    this.options.series.push({ argumentField: 'arg', valueField: 'val2' });

    this.options.pointSelectionMode = 'single';
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].select();
    this.chart.getAllSeries()[1].getAllPoints()[0].select();

    // assert
    assert.equal(this.chart.getAllSeries()[0].getAllPoints()[0].isSelected(), false);
});

QUnit.test('select two points with multiple mode', function(assert) {
    // arrange
    this.options.pointSelectionMode = 'multiple';
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].select();
    this.chart.getAllSeries()[0].getAllPoints()[1].select();

    // assert
    assert.equal(this.chart.getAllSeries()[0].getAllPoints()[0].isSelected(), true);
});

QUnit.test('hover', function(assert) {
    // arrange
    const hoverChanged = this.options.onSeriesHoverChanged = sinon.spy();
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].hover();

    // assert
    assert.equal(hoverChanged.callCount, 1);
});

QUnit.test('clearHover', function(assert) {
    // arrange
    const hoverChanged = this.options.onSeriesHoverChanged = sinon.spy();
    this.createChart(this.options);
    this.chart.getAllSeries()[0].hover();
    hoverChanged.resetHistory();
    // act
    this.chart.getAllSeries()[0].clearHover();

    // assert
    assert.equal(hoverChanged.callCount, 1);
});

QUnit.test('hoverPoint', function(assert) {
    // arrange
    const pointHover = this.options.onPointHoverChanged = sinon.spy();
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].hover();

    // assert
    assert.equal(pointHover.callCount, 1);
});

QUnit.test('clearPointHover', function(assert) {
    // arrange
    const pointHover = this.options.onPointHoverChanged = sinon.spy();
    this.createChart(this.options);
    this.chart.getAllSeries()[0].getAllPoints()[0].hover();
    pointHover.resetHistory();

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].clearHover();

    // assert
    assert.equal(pointHover.callCount, 1);
    assert.strictEqual(this.chart.getAllSeries()[0].getAllPoints()[0].isHovered(), false);
});

QUnit.test('Clean point hover after hover another point', function(assert) {
    // arrange
    this.createChart(this.options);
    const series = this.chart.getAllSeries()[0];
    const points = series.getAllPoints();

    // act
    points[0].hover();
    points[1].hover();

    // assert
    assert.strictEqual(points[0].isHovered(), false);
});

QUnit.test('onPointhoverChanged on hover second', function(assert) {
    // arrange
    const pointHover = this.options.onPointHoverChanged = sinon.spy();

    this.createChart(this.options);
    this.chart.getAllSeries()[0].getAllPoints()[0].hover();
    pointHover.resetHistory();
    // act
    this.chart.getAllSeries()[0].getAllPoints()[1].hover();

    // assert
    assert.strictEqual(pointHover.getCall(0).args[0].target, this.chart.getAllSeries()[0].getAllPoints()[0]);
});

QUnit.module('axis grids hidding', {
    createChart: function(options) {
        return $('#chart').dxChart(options).dxChart('instance');
    }
});

QUnit.test('hide grids for first stub axis', function(assert) {
    // act
    const chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }],
        series: [{ axis: 'a1' }, { argumentField: 'argumentField' }],
        valueAxis: [{
            name: 'stubAxis',
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }, {
            name: 'a1',
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }]
    });

    const stubAxis = chart.getValueAxis('stubAxis');
    const valueAxis = chart.getValueAxis('a1');

    assert.equal(stubAxis.getOptions().grid.visible, false, 'first axis grid isn\'t visible');
    assert.equal(stubAxis.getOptions().minorGrid.visible, false, 'first axis grid isn\'t visible');

    assert.equal(valueAxis.getOptions().grid.visible, true, 'second axis grid visible');
    assert.equal(valueAxis.getOptions().minorGrid.visible, true, 'second axis grid visible');
});

QUnit.test('hide grids for second axis', function(assert) {
    // act
    const chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }],
        series: [{ axis: 'a1' }, { axis: 'a2' }],
        valueAxis: [{
            name: 'a2',
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }, {
            name: 'a1',
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }]
    });
    const firstAxis = chart.getValueAxis('a2');
    const secondAxis = chart.getValueAxis('a1');

    assert.equal(firstAxis.getOptions().grid.visible, true, 'first axis grid visible');
    assert.equal(firstAxis.getOptions().minorGrid.visible, true, 'first axis grid visible');

    assert.equal(secondAxis.getOptions().grid.visible, false, 'second axis grid isn\'t visible');
    assert.equal(secondAxis.getOptions().minorGrid.visible, false, 'second axis grid isn\'t visible');
});

QUnit.test('T570332. Do not show minor grid when it disabled and two stub axis', function(assert) {
    // act
    const chart = this.createChart({
        series: [{ axis: 'a1' }, { axis: 'a2' }],
        valueAxis: [{
            name: 'a2',
            grid: {
                visible: true
            },
            minorGrid: {
                visible: false
            }
        }, {
            name: 'a1',
            grid: {
                visible: true
            },
            minorGrid: {
                visible: false
            }
        }]
    });
    const firstAxis = chart.getValueAxis('a2');
    const secondAxis = chart.getValueAxis('a1');

    assert.equal(firstAxis.getOptions().minorGrid.visible, false, 'first axis minor grid isn\'t visible');
    assert.equal(secondAxis.getOptions().minorGrid.visible, false, 'second axis minor grid isn\'t visible');
});

QUnit.test('T570332. Make minor grid visible for first non stub axis', function(assert) {
    // act
    const chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }],
        series: [{ axis: 'a1' }, { axis: 'a2' }],
        valueAxis: [{
            name: 'a2',
            grid: {
                visible: true
            },
            minorGrid: {
                visible: false
            }
        }, {
            name: 'a1',
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }]
    });
    const firstAxis = chart.getValueAxis('a2');
    const secondAxis = chart.getValueAxis('a1');

    assert.equal(firstAxis.getOptions().minorGrid.visible, true, 'first axis minor grid is visible');
    assert.equal(secondAxis.getOptions().minorGrid.visible, false, 'second axis minor grid isn\'t visible');
});

QUnit.test('two stub axis', function(assert) {
    // act
    const chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }],
        series: [{ argumentField: 'a1' }, { argumentField: 'a1' }],
        valueAxis: [{
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }, {
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }]
    });

    const verticalAxes = chart._valueAxes;

    assert.equal(verticalAxes.length, 2, 'chart must have two value axis');
    assert.equal(verticalAxes[0].getOptions().grid.visible, true, 'first axis grid visible');
    assert.equal(verticalAxes[0].getOptions().minorGrid.visible, true, 'first axis grid visible');

    assert.equal(verticalAxes[1].getOptions().grid.visible, false, 'second axis grid isn\'t visible');
    assert.equal(verticalAxes[1].getOptions().minorGrid.visible, false, 'second axis grid isn\'t visible');
});

QUnit.module('Resizing (T1156890)', {
    beforeEach() {
        this.$container = $('#chart');
    },
    createChart(options) {
        return this.$container.dxChart(options).dxChart('instance');
    }
}, () => {
    [-1, 1].forEach(sign => {
        ['height', 'width'].forEach(dimension => {
            QUnit.test(`Chart should not re-render when ${dimension} ${sign > 0 ? 'increased' : 'decreased'} on value less threshold`, function(assert) {
                const initialSize = {
                    height: 200,
                    width: 200
                };
                const drawnHandler = sinon.spy();

                const chart = this.createChart({
                    size: initialSize,
                    onDrawn: drawnHandler
                });

                drawnHandler.resetHistory();

                chart.option(`size.${dimension}`, initialSize[dimension] + sign * 0.98);

                assert.strictEqual(drawnHandler.callCount, 0);
            });
        });
    });
});

QUnit.module('Deprecated options', {
    beforeEach() {
        sinon.spy(errors, 'log');
    },
    afterEach() {
        errors.log.restore();
    },
    createChart(options) {
        return $('#chart').dxChart(options).dxChart('instance');
    }
}, () => {
    QUnit.test('Should show warning if deprecated "shift" value sets to "valueAxis.visualRangeUpdateMode" option', function(assert) {
        this.createChart({
            valueAxis: {
                visualRangeUpdateMode: 'shift'
            }
        });

        assert.strictEqual(errors.log.callCount, 1);
        assert.deepEqual(errors.log.lastCall.args,
            [
                'W0016',
                'valueAxis.visualRangeUpdateMode',
                'shift',
                '23.1',
                'Specify another value'
            ]);
    });

    QUnit.test('Should show one warning when to "valueAxis.visualRangeUpdateMode" option passed deprecated "shift" on options update', function(assert) {
        const chart = this.createChart({});

        chart.option({
            valueAxis: {
                visualRangeUpdateMode: 'shift'
            }
        });

        assert.strictEqual(errors.log.callCount, 1);
        assert.deepEqual(errors.log.lastCall.args,
            [
                'W0016',
                'valueAxis.visualRangeUpdateMode',
                'shift',
                '23.1',
                'Specify another value'
            ]);
    });
});

QUnit.module('Series translation', {
    createChart(options) {
        const hiddenAxisOptions = {
            visible: false,
            grid: {
                visible: false
            },
            label: {
                visible: false
            },
            tick: {
                visible: false
            }
        };
        const defaultOptions = {
            series: {},
            legend: {
                visible: false
            },
            size: {
                width: 300,
                height: 300
            },
            valueAxis: {
                visualRange: [1, 1000],
                ...hiddenAxisOptions
            },
            argumentAxis: {

                visualRange: [1, 1000],
                ...hiddenAxisOptions
            },
            dataSource: [{
                arg: 1,
                val: 500
            }, {
                arg: 1.05,
                val: 500.01
            }]
        };

        return $('#chart').dxChart($.extend(true, {}, defaultOptions, options)).dxChart('instance');
    }
}, () => {
    function getMarkerCoordinates(element) {
        const transformAttribute = element.getAttribute('transform');

        const coordinatesFromAttribute = transformAttribute
            .replace('translate(', '')
            .replace(')', '');

        return coordinatesFromAttribute
            .split(',')
            .map((coord) => parseFloat(coord));
    }

    QUnit.test('Coordinates of points should be different when distance between values is too small.(T1195064)', function(assert) {
        const chart = this.createChart({});

        const pointsMarkers = $(chart.element()).find(SERIES_POINT_MARKER_SELECTOR);
        const firstPointCoordinates = getMarkerCoordinates(pointsMarkers[0]);
        const secondPointCoordinates = getMarkerCoordinates(pointsMarkers[1]);

        assert.strictEqual(pointsMarkers.length, 2, 'Chart should has two points');
        assert.ok((firstPointCoordinates[0] - secondPointCoordinates[0]) < 0, 'points should have different x coordinates');
        assert.ok((secondPointCoordinates[1] - firstPointCoordinates[1]) < 0, 'points should have different y coordinates');
    });

    QUnit.test('Coordinates of points should be different when distance between values is too small. Rotated = true.(T1195064)', function(assert) {
        const chart = this.createChart({
            rotated: true
        });

        const pointsMarkers = $(chart.element()).find(SERIES_POINT_MARKER_SELECTOR);
        const firstPointCoordinates = getMarkerCoordinates(pointsMarkers[0]);
        const secondPointCoordinates = getMarkerCoordinates(pointsMarkers[1]);

        assert.strictEqual(pointsMarkers.length, 2, 'Chart should has two points');
        assert.ok((firstPointCoordinates[0] - secondPointCoordinates[0]) < 0, 'points should have different x coordinates');
        assert.ok((secondPointCoordinates[1] - firstPointCoordinates[1]) < 0, 'points should have different y coordinates');
    });
});
