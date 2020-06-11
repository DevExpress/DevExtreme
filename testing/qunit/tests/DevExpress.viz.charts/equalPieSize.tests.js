
const $ = require('jquery');
const vizMocks = require('../../helpers/vizMocks.js');
const commons = require('./chartParts/commons.js');
const dataValidatorModule = require('viz/components/data_validator');
const layoutManagerModule = require('viz/chart_components/layout_manager');
const dxPieChart = require('viz/pie_chart');
const chartMocks = require('../../helpers/chartMocks.js');
const MockSeries = chartMocks.MockSeries;
const MockPoint = chartMocks.MockPoint;
const insertMockFactory = chartMocks.insertMockFactory;
const restoreMockFactory = chartMocks.restoreMockFactory;
const resetMockFactory = chartMocks.resetMockFactory;

function getContainer(hidden) {
    const div = $('<div>').appendTo('#qunit-fixture');
    hidden && div.hide();
    return div;
}

function getPieChecker(x, y, r, assert, done) {
    return function(e) {
        assert.strictEqual(e.component.layoutManager.applyEqualPieChartLayout.lastCall.args[0][0], e.component.series[0]);
        assert.deepEqual(e.component.layoutManager.applyEqualPieChartLayout.lastCall.args[1], {
            drawOptions: {
                adjustAxes: true,
                animate: true,
                animationPointsLimit: 300,
                drawLegend: true,
                drawTitle: true,
                force: true,
                hideLayoutLabels: true,
                recreateCanvas: true
            },
            x: x,
            y: y,
            radius: r
        });

        done();
    };
}

function setupMocks() {
    insertMockFactory();

    this.stubPoints = [
        new MockPoint({ argument: 'First', value: 10, visible: true }),
        new MockPoint({ argument: 'Second', value: 11, visible: true }),
        new MockPoint({ argument: 'Third', value: 12, visible: true })
    ];
}

function checkCorrectPosition(assert, correctPos, x, y, outer, inner, canvas) {
    assert.equal(correctPos[0].centerX, x, 'centerX');
    assert.equal(correctPos[0].centerY, y, 'centerY');
    assert.equal(correctPos[0].radiusOuter, outer, 'radiusOuter');
    assert.equal(correctPos[0].radiusInner, inner, 'radiusInner');
    assert.deepEqual(correctPos[1], canvas, 'canvas');
}

const dataSourceTemplate = [
    { cat: 'First', val: 100 },
    { cat: 'Second', val: 200 },
    { cat: 'Third', val: 300 }
];

commons.rendererModule.Renderer = sinon.spy(function(parameters) {
    return new vizMocks.Renderer(parameters);
});

const environment = {
    beforeEach: function() {
        setupMocks.call(this);

        this.originalLayoutManagerCtor = layoutManagerModule.LayoutManager;
        this.LayoutManager = sinon.stub(layoutManagerModule, 'LayoutManager');

        this.validateData = sinon.stub(dataValidatorModule, 'validateData', function(data) {
            return { arg: data || [] };
        });
    },
    afterEach: function() {
        this.LayoutManager.restore();
        this.validateData.restore();

        commons.resetModules();
        resetMockFactory();
        restoreMockFactory();
    },
    createPieChart: function(options, layout, minLayout) {
        this._pieCounter = this._pieCounter || 0;

        const layoutManager = sinon.createStubInstance(this.originalLayoutManagerCtor);
        layoutManager.needMoreSpaceForPanesCanvas.returns(true);
        layoutManager.applyPieChartSeriesLayout.returns(layout);
        layoutManager.applyEqualPieChartLayout.returns(minLayout);

        this.LayoutManager.onCall(this._pieCounter++).returns(layoutManager);

        return new dxPieChart(getContainer(options.hidden), options);
    }
};

QUnit.module('Get layout from LayoutManagers', environment);

QUnit.test('Create pies without groups. Get individual layout', function(assert) {
    const done = assert.async(2);

    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    this.createPieChart({
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie(done, 100, 200, 300, 0)
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} });
    this.createPieChart({
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie(done, 150, 250, 200, 0)
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    function checkPie(done, x, y, rOuter, rInner) {
        return function(e) {
            const series = e.component.series[0];

            assert.equal(series.drawLabelsWOPoints.callCount, 1);
            checkCorrectPosition(assert, series.correctPosition.lastCall.args, x, y, rOuter, rInner, e.component.DEBUG_canvas);
            assert.equal(series.correctRadius.lastCall.args[0].radiusOuter, rOuter, 'correction radiusOuter');
            assert.equal(series.correctRadius.lastCall.args[0].radiusInner, rInner, 'correction radiusInner');
            assert.equal(series.draw.callCount, 1);
            done();
        };
    }
});

QUnit.test('Create pies with group. Get common layout', function(assert) {
    const done = assert.async(2);

    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    this.createPieChart({
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie(done, 150, 250, 200, 0)
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
    this.createPieChart({
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie(done, 150, 250, 200, 0)
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    function checkPie(done, x, y, rOuter, rInner) {
        return function(e) {
            const series = e.component.series[0];

            assert.equal(series.drawLabelsWOPoints.callCount, 2);
            checkCorrectPosition(assert, series.correctPosition.lastCall.args, x, y, rOuter, rInner, e.component.DEBUG_canvas);
            assert.ok(series.drawLabelsWOPoints.lastCall.calledAfter(series.correctPosition.lastCall));
            assert.equal(series.correctRadius.lastCall.args[0].radiusOuter, rOuter, 'correction radiusOuter');
            assert.equal(series.correctRadius.lastCall.args[0].radiusInner, rInner, 'correction radiusInner');
            assert.deepEqual(e.component.layoutManager.correctPieLabelRadius.lastCall.args, [
                e.component.series,
                e.component.layoutManager.applyEqualPieChartLayout.lastCall.returnValue,
                e.component.DEBUG_canvas
            ]);
            assert.equal(series.draw.callCount, 1);
            done();
        };
    }
});

QUnit.module('Pass common layout to LayoutManagers', environment);

QUnit.test('Create pies without groups. Do not ask for common layout', function(assert) {
    const done = assert.async(2);

    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    this.createPieChart({
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} });
    this.createPieChart({
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    function checkPie(e) {
        assert.equal(e.component.layoutManager.applyEqualPieChartLayout.callCount, 0);
        done();
    }
});

QUnit.test('Create pies with same group. Ask for common layout', function(assert) {
    const checkPie = getPieChecker(150, 250, 200, assert, assert.async(2));

    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    this.createPieChart({
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
    this.createPieChart({
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
});

QUnit.test('Create pies with same group, but one pie is hidden. Do not ask hidden pie for its layout', function(assert) {
    const done = assert.async(1);
    const checkPie = getPieChecker(150, 250, 200, assert, done);

    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    this.createPieChart({
        hidden: true,
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: done
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} });
    this.createPieChart({
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
});

QUnit.test('Create two sets of pies with different groups. Ask corresponding common layout', function(assert) {
    const done = assert.async(4);

    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    this.createPieChart({
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: getPieChecker(150, 250, 200, assert, done)
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
    this.createPieChart({
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: getPieChecker(150, 250, 200, assert, done)
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    this.createPieChart({
        sizeGroup: 'group2',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: getPieChecker(200, 300, 100, assert, done)
    },
    { radiusInner: 0, radiusOuter: 100, centerX: 200, centerY: 300, canvas: {} },
    { radiusInner: 0, radiusOuter: 100, centerX: 200, centerY: 300, canvas: {} });
    this.createPieChart({
        sizeGroup: 'group2',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: getPieChecker(200, 300, 100, assert, done)
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
});

QUnit.test('Have pies with group. Add new pie to the same group. Ask common layout for all pies', function(assert) {
    const checkPie = getPieChecker(200, 300, 100, assert, assert.async(3));

    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    const skipFirstCallAndCreateNewPie = function(that) {
        let firstCall = true;
        return function(e) {
            if(firstCall) {
                that.createPieChart({
                    sizeGroup: 'group1',
                    dataSource: dataSourceTemplate,
                    series: [{}],
                    onDrawn: checkPie
                },
                { radiusInner: 0, radiusOuter: 100, centerX: 200, centerY: 300, canvas: {} },
                { radiusInner: 0, radiusOuter: 100, centerX: 200, centerY: 300, canvas: {} });
            } else {
                checkPie(e);
            }
            firstCall = false;
        };
    };

    const skipFirstCall = (function() {
        let skipped = false;
        return function(e) {
            skipped && checkPie(e);
            skipped = true;
        };
    })();

    this.createPieChart({
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: skipFirstCallAndCreateNewPie(this)
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
    this.createPieChart({
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: skipFirstCall
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
});

QUnit.module('Misc', environment);

QUnit.test('Have pies with group. Change group of one pie. Redraw only changed pie', function(assert) {
    const done = assert.async(2);
    assert.expect(0);

    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    const changeGroupOnFirstCall = (function() {
        let firstCall = true;
        return function(e) {
            if(firstCall) {
                e.component.option('sizeGroup', 'group2');
            }
            done();
            firstCall = false;
        };
    })();

    this.createPieChart({
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: changeGroupOnFirstCall
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
});

QUnit.test('Do not touch disposed pies', function(assert) {
    const done = assert.async(3);
    assert.expect(0);

    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    const killPieAndChangeGroupOnFirstCall = function(pieToKill) {
        let firstCall = true;
        return function(e) {
            if(firstCall) {
                pieToKill.$element().remove();
                e.component.option('sizeGroup', 'group2');
            }
            done();
            firstCall = false;
        };
    };

    const pie1 = this.createPieChart({
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: done
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    this.createPieChart({
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: killPieAndChangeGroupOnFirstCall(pie1)
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
});

QUnit.test('Create pies with group. Series should be animated', function(assert) {
    const done = assert.async(1);

    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    this.createPieChart({
        sizeGroup: 'group1',
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: check
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    function check(e) {
        assert.ok(e.component.series[0].wasAnimated);
        done();
    }
});

QUnit.test('Hide labes after first measuring render', function(assert) {
    const series1 = new MockSeries({ points: this.stubPoints });
    chartMocks.seriesMockData.series.push(series1);

    series1.drawLabelsWOPoints = sinon.spy(function() { return true; });

    chartMocks.seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    const pie = this.createPieChart({
        dataSource: dataSourceTemplate,
        series: [{}]
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    const series = pie.series[0];

    assert.equal(pie.layoutManager.applyPieChartSeriesLayout.callCount, 2);
    assert.equal(series.drawLabelsWOPoints.callCount, 1);
    assert.equal(series.hideLabels.callCount, 1);
    assert.ok(series.hideLabels.lastCall.calledAfter(pie.layoutManager.applyPieChartSeriesLayout.lastCall));

});

QUnit.test('Create pie with group but w/o series. Do not ask for common layout. T602149', function(assert) {
    const done = assert.async();

    this.createPieChart({
        sizeGroup: 'group1',
        onDrawn: checkPie
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} });

    function checkPie(e) {
        assert.equal(e.component.layoutManager.applyEqualPieChartLayout.callCount, 0);
        done();
    }
});
