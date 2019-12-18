/* global createTestContainer */

import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import dxChart from 'viz/chart';
import axisModule from 'viz/axes/base_axis';
import scrollBarModule from 'viz/chart_components/scroll_bar';
import legendModule from 'viz/components/legend';
import titleModule from 'viz/core/title';
import rendererModule from 'viz/core/renderers/renderer';
import multiAxesSynchronizer from 'viz/chart_components/multi_axes_synchronizer';

$('<div id="test-container">').appendTo('#qunit-fixture');

rendererModule.Renderer = sinon.stub();

var environment = {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.container = createTestContainer('#test-container', { width: 800, height: 600 });
        rendererModule.Renderer.onCall(0).returns(this.renderer);
        rendererModule.Renderer.onCall(1).returns(new vizMocks.Renderer());
        rendererModule.Renderer.onCall(2).returns(new vizMocks.Renderer());
    },
    setupScrollBar: function() {
        var originalScrollBar = scrollBarModule.ScrollBar,
            scrollBarFakes = {
                getMargins: sinon.stub()
            };

        this.scrollBarStub = sinon.stub(scrollBarModule, 'ScrollBar', function(renderer, group) {
            var scrollBar = new originalScrollBar(renderer, group),
                originalUpdateSize = scrollBar.updateSize;

            scrollBar.getMargins = scrollBarFakes.getMargins;
            scrollBarFakes.updateSize = scrollBar.updateSize = sinon.spy(function() { originalUpdateSize.apply(scrollBar, arguments); });

            return scrollBar;
        });

        return scrollBarFakes;
    },
    setupAxes: function(axesStubs) {
        var axisIndex = 0,
            originalAxis = axisModule.Axis;

        this.axisStub = sinon.stub(axisModule, 'Axis', function(renderingSettings) {
            var axis = new originalAxis(renderingSettings);

            for(var stubName in axesStubs[axisIndex]) {
                /* axis[stubName] && */(axis[stubName] = axesStubs[axisIndex][stubName]);
            }
            axisIndex++;
            return axis;
        });

        this.title = new vizMocks.Title();
        this.legend = new vizMocks.Legend();

        this.legendStub = sinon.stub(legendModule, 'Legend', () =>{
            return this.legend;
        });

        this.titleStub = sinon.stub(titleModule, 'Title', () => {
            return this.title;
        });
    },
    afterEach: function() {
        this.container.remove();
        this.renderer = null;
        rendererModule.Renderer.reset();
        this.axisStub.restore();
        this.scrollBarStub && this.scrollBarStub.restore();
        this.legendStub.restore();
        this.titleStub.restore();
    }
};

function createAxisStubs() {
    var axisFakes = {
        updateSizeArgs: [],
        estimateMargins: sinon.stub(),
        getMargins: sinon.stub(),
        createTicks: sinon.spy(function(arg) { this.createTicks_test_arg = $.extend({}, arg); }),
        draw: sinon.spy(function(arg) { this.draw_test_arg = $.extend({}, arg); }),
        updateSize: sinon.spy(function(arg) {
            this.updateSize_test_arg = $.extend({}, arg);
            this.updateSizeArgs.push(this.updateSize_test_arg);
        }),
        shift: sinon.spy(function(arg) { this.shift_test_arg = $.extend({}, arg); }),
        hideTitle: sinon.spy(),
        drawScaleBreaks: sinon.spy(),
        hideOuterElements: sinon.spy(),
        prepareAnimation: sinon.spy()
    };

    axisFakes
        .estimateMargins.returns({ left: 0, top: 0, right: 0, bottom: 0 });
    axisFakes
        .getMargins.returns({ left: 0, top: 0, right: 0, bottom: 0 });

    return axisFakes;
}

QUnit.module('Canvas processing', environment);

QUnit.test('Pass canvas to axis\' estimateMargins', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs();

    this.setupAxes([argAxis, valAxis]);

    new dxChart(this.container, {
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    assert.deepEqual(this.axisStub.getCall(0).returnValue.estimateMargins.lastCall.args[0], {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    });
});

QUnit.test('Take into account max margin on each side of pane', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs();

    argAxis
        .estimateMargins.returns({ left: 10, top: 8, right: 11, bottom: 20 });
    argAxis
        .getMargins.returns({ left: 10, top: 7, right: 20, bottom: 13 });

    valAxis
        .getMargins.returns({ left: 18, top: 15, right: 10, bottom: 9 });


    this.setupAxes([argAxis, valAxis]);

    new dxChart(this.container, {
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 1. estimate horizontal axes margins
    // 2. draw vertical axes
    assert.deepEqual(this.axisStub.getCall(1).returnValue.createTicks_test_arg, {
        left: 10,
        right: 11,
        top: 8,
        bottom: 20,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis canvas');

    assert.equal(this.axisStub.getCall(1).returnValue.draw.lastCall.args[0], false, 'draw valAxis');

    // 3. draw horizontal axes
    assert.deepEqual(this.axisStub.getCall(0).returnValue.draw_test_arg, {
        left: 18,
        right: 11,
        top: 15,
        bottom: 20,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'draw argAxis canvas');

    // 4. update horizontal axes size
    assert.deepEqual(this.axisStub.getCall(0).returnValue.updateSize_test_arg, {
        left: 18,
        right: 20,
        top: 15,
        bottom: 13,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize argAxis canvas');

    // 5. update vertical axes size
    assert.deepEqual(this.axisStub.getCall(1).returnValue.updateSize_test_arg, {
        left: 18,
        right: 20,
        top: 15,
        bottom: 13,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize valAxis canvas');
});

QUnit.test('Multiple value axes - margins are accumulated on left and right', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis_inner = createAxisStubs(),
        valAxis_outer = createAxisStubs();

    argAxis
        .estimateMargins.returns({ left: 10, top: 8, right: 11, bottom: 20 });
    argAxis
        .getMargins.returns({ left: 10, top: 7, right: 19, bottom: 13 });

    valAxis_inner
        .getMargins.returns({ left: 18, top: 15, right: 10, bottom: 9 });
    valAxis_outer
        .getMargins.returns({ left: 8, top: 8, right: 5, bottom: 4 });

    this.setupAxes([argAxis,
        valAxis_inner,
        valAxis_outer]);

    new dxChart(this.container, {
        valueAxis: [
            { name: 'valAxis_inner' },
            { name: 'valAxis_outer' }
        ],
        series: [
            { axis: 'valAxis_inner' },
            { axis: 'valAxis_outer' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 1. estimate horizontal axes margins
    // 2. draw vertical axes
    // valAxis_inner
    assert.deepEqual(this.axisStub.getCall(1).returnValue.createTicks_test_arg, {
        left: 10,
        right: 11,
        top: 8,
        bottom: 20,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis_inner canvas');

    assert.equal(this.axisStub.getCall(1).returnValue.draw.lastCall.args[0], false, 'draw valAxis_inner');

    // valAxis_outer
    assert.deepEqual(this.axisStub.getCall(2).returnValue.createTicks_test_arg, {
        left: 10,
        right: 11,
        top: 8,
        bottom: 20,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis_outer canvas');

    assert.equal(this.axisStub.getCall(2).returnValue.draw.lastCall.args[0], false, 'draw valAxis_outer canvas');

    // 3. draw horizontal axes
    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.draw_test_arg, {
        left: 31,
        right: 20,
        top: 15,
        bottom: 20,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'draw argAxis canvas');

    // 4. update horizontal axes size
    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.updateSize_test_arg, {
        left: 31,
        right: 20,
        top: 15,
        bottom: 13,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize argAxis canvas');

    // 5. update vertical axes size
    // valAxis_inner
    assert.deepEqual(this.axisStub.getCall(1).returnValue.updateSize_test_arg, {
        left: 31,
        right: 20,
        top: 15,
        bottom: 13,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize valAxis_inner canvas');

    // valAxis_outer
    assert.deepEqual(this.axisStub.getCall(2).returnValue.updateSize_test_arg, {
        left: 31,
        right: 20,
        top: 15,
        bottom: 13,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize valAxis_outer canvas');
});

QUnit.test('Rotated. Multiple value axes - margins are accumulated on top and bottom', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis_inner = createAxisStubs(),
        valAxis_outer = createAxisStubs();

    argAxis
        .getMargins.returns({ bottom: 10, right: 7, top: 19, left: 13 });

    valAxis_inner
        .estimateMargins.returns({ bottom: 5, right: 3, top: 2, left: 6 });
    valAxis_outer
        .estimateMargins.returns({ bottom: 6, right: 4, top: 3, left: 5 });

    valAxis_inner
        .getMargins.returns({ bottom: 18, right: 15, top: 10, left: 9 });
    valAxis_outer
        .getMargins.returns({ bottom: 8, right: 8, top: 5, left: 4 });


    this.setupAxes([argAxis,
        valAxis_inner,
        valAxis_outer]);

    new dxChart(this.container, {
        rotated: true,
        valueAxis: [
            { name: 'valAxis_inner' },
            { name: 'valAxis_outer' }
        ],
        series: [
            { axis: 'valAxis_inner' },
            { axis: 'valAxis_outer' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 1. estimate horizontal axes margins
    // 2. draw vertical axes
    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.draw_test_arg, {
        left: 6,
        right: 4,
        top: 10,
        bottom: 16,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'draw argAxis canvas');

    // 3. draw horizontal axes
    // valAxis_inner
    assert.deepEqual(this.axisStub.getCall(1).returnValue.createTicks_test_arg, {
        left: 13,
        right: 7,
        top: 19,
        bottom: 16,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis_inner canvas');

    assert.equal(this.axisStub.getCall(1).returnValue.draw.lastCall.args[0], false, 'draw valAxis_inner');

    // valAxis_outer
    assert.deepEqual(this.axisStub.getCall(2).returnValue.createTicks_test_arg, {
        left: 13,
        right: 7,
        top: 19,
        bottom: 16,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis_outer canvas');

    assert.equal(this.axisStub.getCall(2).returnValue.draw.lastCall.args[0], false, 'draw valAxis_outer');

    // 4. update horizontal axes size
    // valAxis_inner
    assert.deepEqual(this.axisStub.getCall(1).returnValue.updateSize_test_arg, {
        left: 13,
        right: 15,
        top: 20,
        bottom: 31,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize valAxis_inner canvas');

    // valAxis_outer
    assert.deepEqual(this.axisStub.getCall(2).returnValue.updateSize_test_arg, {
        left: 13,
        right: 15,
        top: 20,
        bottom: 31,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize valAxis_outer canvas');

    // 5. update vertical axes size
    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.updateSize_test_arg, {
        left: 13,
        right: 15,
        top: 20,
        bottom: 31,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize argAxis canvas');
});

QUnit.test('Multiple panes - individual margins on top and bottom, common margins on left and right', function(assert) {
    var argAxis_topPane = createAxisStubs(),
        argAxis_bottomPane = createAxisStubs(),
        valAxis_bottomPane_right_inner = createAxisStubs(),
        valAxis_bottomPane_right_outer = createAxisStubs(),
        valAxis_topPane_left_inner = createAxisStubs(),
        valAxis_topPane_left_outer = createAxisStubs();

    argAxis_topPane
        .estimateMargins.returns({ left: 0, top: 9, right: 0, bottom: 6 });
    argAxis_topPane
        .getMargins.returns({ left: 0, top: 9, right: 0, bottom: 6 });

    argAxis_bottomPane
        .estimateMargins.returns({ left: 0, top: 5, right: 0, bottom: 10 });
    argAxis_bottomPane
        .getMargins.returns({ left: 0, top: 5, right: 0, bottom: 10 });

    valAxis_bottomPane_right_inner
        .getMargins.returns({ left: 0, top: 0, right: 5, bottom: 0 });
    valAxis_bottomPane_right_outer
        .getMargins.returns({ left: 0, top: 0, right: 6, bottom: 0 });

    valAxis_topPane_left_inner
        .getMargins.returns({ left: 7, top: 0, right: 0, bottom: 0 });
    valAxis_topPane_left_outer
        .getMargins.returns({ left: 8, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis_topPane,
        argAxis_bottomPane,
        valAxis_bottomPane_right_inner,
        valAxis_bottomPane_right_outer,
        valAxis_topPane_left_inner,
        valAxis_topPane_left_outer]);

    new dxChart(this.container, {
        panes: [
            { name: 'top' },
            { name: 'bottom' }
        ],
        valueAxis: [
            { name: 'valAxis_bottomPane_right_inner', position: 'right' },
            { name: 'valAxis_bottomPane_right_outer', position: 'right' },
            { name: 'valAxis_topPane_left_inner' },
            { name: 'valAxis_topPane_left_outer' }
        ],
        series: [
            { pane: 'bottom', axis: 'valAxis_bottomPane_right_inner' },
            { pane: 'bottom', axis: 'valAxis_bottomPane_right_outer' },
            { pane: 'top', axis: 'valAxis_topPane_left_inner' },
            { pane: 'top', axis: 'valAxis_topPane_left_outer' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 1. estimate horizontal axes margins
    // 2. draw vertical axes
    // valAxis_bottomPane_right_inner
    assert.deepEqual(this.axisStub.getCall(2).returnValue.createTicks_test_arg, {
        left: 0,
        right: 0,
        top: 310,
        bottom: 10,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 305,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis_bottomPane_right_inner canvas');

    assert.equal(this.axisStub.getCall(2).returnValue.draw.lastCall.args[0], false, 'draw valAxis_bottomPane_right_inner canvas');

    // valAxis_bottomPane_right_outer
    assert.deepEqual(this.axisStub.getCall(3).returnValue.createTicks_test_arg, {
        left: 0,
        right: 0,
        top: 310,
        bottom: 10,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 305,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis_bottomPane_right_outer canvas');

    assert.equal(this.axisStub.getCall(3).returnValue.draw.lastCall.args[0], false, 'draw valAxis_bottomPane_right_outer canvas');

    // valAxis_topPane_left_inner
    assert.deepEqual(this.axisStub.getCall(4).returnValue.createTicks_test_arg, {
        left: 0,
        right: 0,
        top: 9,
        bottom: 311,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 305,
        width: 800,
        height: 600
    }, 'createTicks valAxis_topPane_left_inner canvas');

    assert.equal(this.axisStub.getCall(4).returnValue.draw.lastCall.args[0], false, 'draw valAxis_topPane_left_inner canvas');

    // valAxis_topPane_left_outer
    assert.deepEqual(this.axisStub.getCall(5).returnValue.createTicks_test_arg, {
        left: 0,
        right: 0,
        top: 9,
        bottom: 311,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 305,
        width: 800,
        height: 600
    }, 'createTicks valAxis_topPane_left_outer canvas');

    assert.equal(this.axisStub.getCall(5).returnValue.draw.lastCall.args[0], false, 'draw valAxis_topPane_left_outer canvas');

    // 3. draw horizontal axes
    // argAxis_topPane
    assert.deepEqual(this.axisStub.getCall(0).returnValue.draw_test_arg, {
        left: 20,
        right: 16,
        top: 9,
        bottom: 311,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 305,
        width: 800,
        height: 600
    }, 'draw argAxis_topPane canvas');

    // argAxis_bottomPane
    assert.deepEqual(this.axisStub.getCall(1).returnValue.draw_test_arg, {
        left: 20,
        right: 16,
        top: 310,
        bottom: 10,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 305,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'draw argAxis_bottomPane canvas');

    // 4. update horizontal axes size
    // argAxis_topPane
    assert.deepEqual(this.axisStub.getCall(0).returnValue.updateSize_test_arg, {
        left: 20,
        right: 16,
        top: 9,
        bottom: 311,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 305,
        width: 800,
        height: 600
    }, 'updateSize argAxis_topPane canvas');

    // argAxis_bottomPane
    assert.deepEqual(this.axisStub.getCall(1).returnValue.updateSize_test_arg, {
        left: 20,
        right: 16,
        top: 310,
        bottom: 10,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 305,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize argAxis_bottomPane canvas');

    // 5. update vertical axes size
    // valAxis_bottomPane_right_inner
    assert.deepEqual(this.axisStub.getCall(2).returnValue.updateSize_test_arg, {
        left: 20,
        right: 16,
        top: 310,
        bottom: 10,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 305,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize valAxis_bottomPane_right_inner canvas');

    // valAxis_bottomPane_right_outer
    assert.deepEqual(this.axisStub.getCall(3).returnValue.updateSize_test_arg, {
        left: 20,
        right: 16,
        top: 310,
        bottom: 10,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 305,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize valAxis_bottomPane_right_outer canvas');

    // valAxis_topPane_left_inner
    assert.deepEqual(this.axisStub.getCall(4).returnValue.updateSize_test_arg, {
        left: 20,
        right: 16,
        top: 9,
        bottom: 311,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 305,
        width: 800,
        height: 600
    }, 'updateSize valAxis_topPane_left_inner canvas');

    // valAxis_topPane_left_outer
    assert.deepEqual(this.axisStub.getCall(5).returnValue.updateSize_test_arg, {
        left: 20,
        right: 16,
        top: 9,
        bottom: 311,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 305,
        width: 800,
        height: 600
    }, 'updateSize valAxis_topPane_left_outer canvas');
});

QUnit.test('Rotated. Multiple panes - individual margins on left and right, common margins on top and bottom. Rotated', function(assert) {
    var argAxis_rightPane = createAxisStubs(),
        argAxis_leftPane = createAxisStubs(),
        valAxis_leftPane_top_inner = createAxisStubs(),
        valAxis_leftPane_top_outer = createAxisStubs(),
        valAxis_rightPane_bottom_inner = createAxisStubs(),
        valAxis_rightPane_bottom_outer = createAxisStubs();

    argAxis_rightPane
        .getMargins.returns({ bottom: 0, right: 9, top: 0, left: 6 });

    argAxis_leftPane
        .getMargins.returns({ bottom: 0, right: 5, top: 0, left: 10 });

    valAxis_leftPane_top_inner
        .estimateMargins.returns({ bottom: 0, right: 0, top: 5, left: 0 });
    valAxis_leftPane_top_outer
        .estimateMargins.returns({ bottom: 0, right: 0, top: 6, left: 0 });
    valAxis_leftPane_top_inner
        .getMargins.returns({ bottom: 0, right: 0, top: 5, left: 0 });
    valAxis_leftPane_top_outer
        .getMargins.returns({ bottom: 0, right: 0, top: 6, left: 0 });

    valAxis_rightPane_bottom_inner
        .estimateMargins.returns({ bottom: 7, right: 0, top: 0, left: 0 });
    valAxis_rightPane_bottom_outer
        .estimateMargins.returns({ bottom: 8, right: 0, top: 0, left: 0 });
    valAxis_rightPane_bottom_inner
        .getMargins.returns({ bottom: 7, right: 0, top: 0, left: 0 });
    valAxis_rightPane_bottom_outer
        .getMargins.returns({ bottom: 8, right: 0, top: 0, left: 0 });

    this.setupAxes([argAxis_leftPane,
        argAxis_rightPane,
        valAxis_leftPane_top_inner,
        valAxis_leftPane_top_outer,
        valAxis_rightPane_bottom_inner,
        valAxis_rightPane_bottom_outer]);

    new dxChart(this.container, {
        rotated: true,
        panes: [
            { name: 'right' },
            { name: 'left' }
        ],
        valueAxis: [
            { name: 'valAxis_leftPane_top_inner', position: 'top' },
            { name: 'valAxis_leftPane_top_outer', position: 'top' },
            { name: 'valAxis_rightPane_bottom_inner' },
            { name: 'valAxis_rightPane_bottom_outer' }
        ],
        series: [
            { pane: 'left', axis: 'valAxis_leftPane_top_inner' },
            { pane: 'left', axis: 'valAxis_leftPane_top_outer' },
            { pane: 'right', axis: 'valAxis_rightPane_bottom_inner' },
            { pane: 'right', axis: 'valAxis_rightPane_bottom_outer' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 1. estimate horizontal axes margins
    // 2. draw vertical axes
    // argAxis_leftPane
    assert.deepEqual(this.axisStub.getCall(0).returnValue.draw_test_arg, {
        left: 0,
        right: 405,
        top: 16,
        bottom: 20,
        originalLeft: 0,
        originalRight: 405,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'draw argAxis_leftPane canvas');

    // argAxis_rightPane
    assert.deepEqual(this.axisStub.getCall(1).returnValue.draw_test_arg, {
        left: 405,
        right: 0,
        top: 16,
        bottom: 20,
        originalLeft: 405,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'draw argAxis_rightPane canvas');

    // 3. draw horizontal axes
    // valAxis_leftPane_top_inner
    assert.deepEqual(this.axisStub.getCall(2).returnValue.createTicks_test_arg, {
        left: 10,
        right: 410,
        top: 16,
        bottom: 20,
        originalLeft: 0,
        originalRight: 405,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis_leftPane_top_inner canvas');

    assert.equal(this.axisStub.getCall(2).returnValue.draw.lastCall.args[0], false, 'draw valAxis_leftPane_top_inner canvas');

    // valAxis_leftPane_top_outer
    assert.deepEqual(this.axisStub.getCall(3).returnValue.createTicks_test_arg, {
        left: 10,
        right: 410,
        top: 16,
        bottom: 20,
        originalLeft: 0,
        originalRight: 405,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis_leftPane_top_outer canvas');

    assert.equal(this.axisStub.getCall(3).returnValue.draw.lastCall.args[0], false, 'draw valAxis_leftPane_top_outer canvas');

    // valAxis_rightPane_bottom_inner
    assert.deepEqual(this.axisStub.getCall(4).returnValue.createTicks_test_arg, {
        left: 411,
        right: 9,
        top: 16,
        bottom: 20,
        originalLeft: 405,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis_rightPane_bottom_inner canvas');

    assert.equal(this.axisStub.getCall(4).returnValue.draw.lastCall.args[0], false, 'draw valAxis_rightPane_bottom_inner canvas');

    // valAxis_rightPane_bottom_outer
    assert.deepEqual(this.axisStub.getCall(5).returnValue.createTicks_test_arg, {
        left: 411,
        right: 9,
        top: 16,
        bottom: 20,
        originalLeft: 405,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis_rightPane_bottom_outer canvas');

    assert.equal(this.axisStub.getCall(5).returnValue.draw.lastCall.args[0], false, 'draw valAxis_rightPane_bottom_outer canvas');

    // 4. update horizontal axes size
    // argAxis_rightPane
    assert.deepEqual(this.axisStub.getCall(1).returnValue.updateSize_test_arg, {
        left: 411,
        right: 9,
        top: 16,
        bottom: 20,
        originalLeft: 405,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize argAxis_rightPane canvas');

    // argAxis_leftPane
    assert.deepEqual(this.axisStub.getCall(0).returnValue.updateSize_test_arg, {
        left: 10,
        right: 410,
        top: 16,
        bottom: 20,
        originalLeft: 0,
        originalRight: 405,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize argAxis_leftPane canvas');

    // 5. update vertical axes size
    // valAxis_leftPane_top_inner
    assert.deepEqual(this.axisStub.getCall(2).returnValue.updateSize_test_arg, {
        left: 10,
        right: 410,
        top: 16,
        bottom: 20,
        originalLeft: 0,
        originalRight: 405,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize valAxis_leftPane_top_inner canvas');

    // valAxis_leftPane_top_outer
    assert.deepEqual(this.axisStub.getCall(3).returnValue.updateSize_test_arg, {
        left: 10,
        right: 410,
        top: 16,
        bottom: 20,
        originalLeft: 0,
        originalRight: 405,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize valAxis_leftPane_top_outer canvas');

    // valAxis_rightPane_bottom_inner
    assert.deepEqual(this.axisStub.getCall(4).returnValue.updateSize_test_arg, {
        left: 411,
        right: 9,
        top: 16,
        bottom: 20,
        originalLeft: 405,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize valAxis_rightPane_bottom_inner canvas');

    // valAxis_rightPane_bottom_outer
    assert.deepEqual(this.axisStub.getCall(5).returnValue.updateSize_test_arg, {
        left: 411,
        right: 9,
        top: 16,
        bottom: 20,
        originalLeft: 405,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize valAxis_rightPane_bottom_outer canvas');
});

QUnit.test('check call \'setInitRange\'', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs();

    valAxis.setInitRange = sinon.spy();

    this.setupAxes([argAxis, valAxis]);

    new dxChart(this.container, {
        valueAxis: [
            { name: 'valAxis' }
        ],
        series: [
            { axis: 'valAxis' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    var valAxis1 = this.axisStub.getCall(1).returnValue;

    assert.equal(valAxis1.setInitRange.callCount, 1);
});

QUnit.test('check call \'setInitRange\'. Rotated', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs();

    valAxis.setInitRange = sinon.spy();

    this.setupAxes([argAxis, valAxis]);

    new dxChart(this.container, {
        rotated: true,
        valueAxis: [
            { name: 'valAxis' }
        ],
        series: [
            { axis: 'valAxis' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    var valAxis1 = this.axisStub.getCall(1).returnValue;

    assert.equal(valAxis1.setInitRange.callCount, 1);
});

QUnit.test('Multiple panes - Weighted panes processing', function(assert) {
    var argAxis_topPane = createAxisStubs(),
        argAxis_bottomPane = createAxisStubs(),
        valAxis_bottomPane_right_inner = createAxisStubs(),
        valAxis_bottomPane_right_outer = createAxisStubs(),
        valAxis_topPane_left_inner = createAxisStubs(),
        valAxis_topPane_left_outer = createAxisStubs();

    argAxis_topPane
        .estimateMargins.returns({ left: 0, top: 9, right: 0, bottom: 6 });
    argAxis_topPane
        .getMargins.returns({ left: 0, top: 9, right: 0, bottom: 6 });

    argAxis_bottomPane
        .estimateMargins.returns({ left: 0, top: 5, right: 0, bottom: 10 });
    argAxis_bottomPane
        .getMargins.returns({ left: 0, top: 5, right: 0, bottom: 10 });

    valAxis_bottomPane_right_inner
        .getMargins.returns({ left: 0, top: 0, right: 5, bottom: 0 });
    valAxis_bottomPane_right_outer
        .getMargins.returns({ left: 0, top: 0, right: 6, bottom: 0 });

    valAxis_topPane_left_inner
        .getMargins.returns({ left: 7, top: 0, right: 0, bottom: 0 });
    valAxis_topPane_left_outer
        .getMargins.returns({ left: 8, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis_topPane,
        argAxis_bottomPane,
        valAxis_bottomPane_right_inner,
        valAxis_bottomPane_right_outer,
        valAxis_topPane_left_inner,
        valAxis_topPane_left_outer]);

    new dxChart(this.container, {
        panes: [
            { name: 'top', height: 0.5 },
            { name: 'bottom', height: 0.1 }
        ],
        valueAxis: [
            { name: 'valAxis_bottomPane_right_inner', position: 'right' },
            { name: 'valAxis_bottomPane_right_outer', position: 'right' },
            { name: 'valAxis_topPane_left_inner' },
            { name: 'valAxis_topPane_left_outer' }
        ],
        series: [
            { pane: 'bottom', axis: 'valAxis_bottomPane_right_inner' },
            { pane: 'bottom', axis: 'valAxis_bottomPane_right_outer' },
            { pane: 'top', axis: 'valAxis_topPane_left_inner' },
            { pane: 'top', axis: 'valAxis_topPane_left_outer' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // argAxis_topPane
    assert.deepEqual(this.axisStub.getCall(0).returnValue.draw_test_arg, {
        left: 20,
        right: 16,
        top: 10,
        bottom: 124,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 108,
        width: 800,
        height: 600
    }, 'draw argAxis_topPane canvas');

    // argAxis_bottomPane
    assert.deepEqual(this.axisStub.getCall(1).returnValue.draw_test_arg, {
        left: 20,
        right: 16,
        top: 497,
        bottom: 10,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 502,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'draw argAxis_bottomPane canvas');
});

QUnit.module('Shift axes', environment);

QUnit.test('Multiple axes - shift only to the right/left, multipleAxesSpacing is not passed directly to axis shift method', function(assert) {
    // NOTE
    // it is important to test 3 axes
    var argAxis = createAxisStubs(),
        valAxis_left_1 = createAxisStubs(),
        valAxis_left_2 = createAxisStubs(),
        valAxis_left_3 = createAxisStubs(),
        valAxis_right = createAxisStubs();

    valAxis_left_1
        .getMargins.returns({ left: 6, top: 0, right: 7, bottom: 0 });
    valAxis_left_2
        .getMargins.returns({ left: 8, top: 0, right: 9, bottom: 0 });
    valAxis_left_3
        .getMargins.returns({ left: 10, top: 0, right: 11, bottom: 0 });

    valAxis_right
        .getMargins.returns({ left: 13, top: 0, right: 12, bottom: 0 });

    this.setupAxes([argAxis,
        valAxis_left_1,
        valAxis_left_2,
        valAxis_left_3,
        valAxis_right]);

    new dxChart(this.container, {
        valueAxis: [
            { name: 'valAxis_left_1', multipleAxesSpacing: 5 },
            { name: 'valAxis_left_2', multipleAxesSpacing: 6 },
            { name: 'valAxis_left_3', multipleAxesSpacing: 7 },
            { name: 'valAxis_right', multipleAxesSpacing: 8, position: 'right' }
        ],
        series: [
            { axis: 'valAxis_left_1' },
            { axis: 'valAxis_left_2' },
            { axis: 'valAxis_left_3' },
            { axis: 'valAxis_right' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 6. shift horizontal axes
    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }, 'shift argAxis');

    // 7. shift vertical axes
    // valAxis_left_1
    assert.deepEqual(this.axisStub.getCall(1).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }, 'shift valAxis_left_1');

    // valAxis_left_2
    assert.deepEqual(this.axisStub.getCall(2).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 6,
        right: 7
    }, 'shift valAxis_left_2');

    // valAxis_left_3
    assert.deepEqual(this.axisStub.getCall(3).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 20,
        right: 22
    }, 'shift valAxis_left_3');

    // valAxis_right
    assert.deepEqual(this.axisStub.getCall(4).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 37,
        right: 40
    }, 'shift valAxis_right');
});

QUnit.test('Rotated. Multiple axes - shift only to the top/bottom, multipleAxesSpacing is not passed directly to axis shift method', function(assert) {
    // NOTE
    // it is important to test 3 axes
    var argAxis = createAxisStubs(),
        valAxis_bottom_1 = createAxisStubs(),
        valAxis_bottom_2 = createAxisStubs(),
        valAxis_bottom_3 = createAxisStubs(),
        valAxis_top = createAxisStubs();

    valAxis_bottom_1
        .getMargins.returns({ bottom: 6, right: 0, top: 7, left: 0 });
    valAxis_bottom_2
        .getMargins.returns({ bottom: 8, right: 0, top: 9, left: 0 });
    valAxis_bottom_3
        .getMargins.returns({ bottom: 10, right: 0, top: 11, left: 0 });

    valAxis_top
        .getMargins.returns({ bottom: 13, right: 0, top: 12, left: 0 });

    this.setupAxes([argAxis,
        valAxis_bottom_1,
        valAxis_bottom_2,
        valAxis_bottom_3,
        valAxis_top]);

    new dxChart(this.container, {
        rotated: true,
        valueAxis: [
            { name: 'valAxis_bottom_1', multipleAxesSpacing: 5 },
            { name: 'valAxis_bottom_2', multipleAxesSpacing: 6 },
            { name: 'valAxis_bottom_3', multipleAxesSpacing: 7 },
            { name: 'valAxis_top', multipleAxesSpacing: 8, position: 'top' }
        ],
        series: [
            { axis: 'valAxis_bottom_1' },
            { axis: 'valAxis_bottom_2' },
            { axis: 'valAxis_bottom_3' },
            { axis: 'valAxis_top' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 6. shift horizontal axes
    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }, 'shift argAxis');

    // 7. shift vertical axes
    // valAxis_bottom_1
    assert.deepEqual(this.axisStub.getCall(1).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }, 'shift valAxis_bottom_1');

    // valAxis_bottom_2
    assert.deepEqual(this.axisStub.getCall(2).returnValue.shift_test_arg, {
        top: 7,
        bottom: 6,
        left: 0,
        right: 0
    }, 'shift valAxis_bottom_2');

    // valAxis_bottom_3
    assert.deepEqual(this.axisStub.getCall(3).returnValue.shift_test_arg, {
        top: 22,
        bottom: 20,
        left: 0,
        right: 0
    }, 'shift valAxis_bottom_3');

    // valAxis_top
    assert.deepEqual(this.axisStub.getCall(4).returnValue.shift_test_arg, {
        top: 40,
        bottom: 37,
        left: 0,
        right: 0
    }, 'shift valAxis_top');
});

QUnit.test('Multiple panes - shift axes by panes', function(assert) {
    var argAxis_topPane = createAxisStubs(),
        argAxis_bottomPane = createAxisStubs(),
        valAxis_bottomPane_left = createAxisStubs(),
        valAxis_bottomPane_right_inner = createAxisStubs(),
        valAxis_bottomPane_right_outer = createAxisStubs(),
        valAxis_topPane_left_inner = createAxisStubs(),
        valAxis_topPane_left_outer = createAxisStubs(),
        valAxis_topPane_right = createAxisStubs();

    valAxis_bottomPane_left
        .getMargins.returns({ left: 6, top: 0, right: 7, bottom: 0 });
    valAxis_bottomPane_right_inner
        .getMargins.returns({ left: 9, top: 0, right: 8, bottom: 0 });
    valAxis_bottomPane_right_outer
        .getMargins.returns({ left: 11, top: 0, right: 10, bottom: 0 });

    valAxis_topPane_left_inner
        .getMargins.returns({ left: 20, top: 0, right: 21, bottom: 0 });
    valAxis_topPane_left_outer
        .getMargins.returns({ left: 22, top: 0, right: 23, bottom: 0 });
    valAxis_topPane_right
        .getMargins.returns({ left: 25, top: 0, right: 24, bottom: 0 });

    this.setupAxes([argAxis_topPane,
        argAxis_bottomPane,
        valAxis_bottomPane_left,
        valAxis_bottomPane_right_inner,
        valAxis_bottomPane_right_outer,
        valAxis_topPane_left_inner,
        valAxis_topPane_left_outer,
        valAxis_topPane_right]);

    new dxChart(this.container, {
        panes: [
            { name: 'top' },
            { name: 'bottom' }
        ],
        valueAxis: [
            { name: 'valAxis_bottomPane_left' },
            { name: 'valAxis_bottomPane_right_inner', position: 'right' },
            { name: 'valAxis_bottomPane_right_outer', position: 'right' },
            { name: 'valAxis_topPane_left_inner' },
            { name: 'valAxis_topPane_left_outer' },
            { name: 'valAxis_topPane_right', position: 'right' }
        ],
        series: [
            { pane: 'bottom', axis: 'valAxis_bottomPane_left' },
            { pane: 'bottom', axis: 'valAxis_bottomPane_right_inner' },
            { pane: 'bottom', axis: 'valAxis_bottomPane_right_outer' },
            { pane: 'top', axis: 'valAxis_topPane_left_inner' },
            { pane: 'top', axis: 'valAxis_topPane_left_outer' },
            { pane: 'top', axis: 'valAxis_topPane_right' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // 6. shift horizontal axes
    // argAxis_topPane
    assert.deepEqual(this.axisStub.getCall(0).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }, 'shift argAxis_topPane');

    // argAxis_bottomPane
    assert.deepEqual(this.axisStub.getCall(1).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }, 'shift argAxis_bottomPane');

    // 7. shift vertical axes
    // valAxis_bottomPane_left
    assert.deepEqual(this.axisStub.getCall(2).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }, 'shift valAxis_bottomPane_left');

    // valAxis_bottomPane_right_inner
    assert.deepEqual(this.axisStub.getCall(3).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 6,
        right: 7
    }, 'shift valAxis_bottomPane_right_inner');

    // valAxis_bottomPane_right_outer
    assert.deepEqual(this.axisStub.getCall(4).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 20,
        right: 20
    }, 'shift valAxis_bottomPane_right_outer');

    // valAxis_topPane_left_inner
    assert.deepEqual(this.axisStub.getCall(5).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }, 'shift valAxis_topPane_left_inner');

    // valAxis_topPane_left_outer
    assert.deepEqual(this.axisStub.getCall(6).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 20,
        right: 21
    }, 'shift valAxis_topPane_left_outer');

    // valAxis_topPane_right
    assert.deepEqual(this.axisStub.getCall(7).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 47,
        right: 49
    }, 'shift valAxis_topPane_right');
});

QUnit.module('Misc', environment);

QUnit.test('Draw - pass correct pane borders', function(assert) {
    var argAxis_topPane = createAxisStubs(),
        argAxis_bottomPane = createAxisStubs(),
        valAxis_bottomPane = createAxisStubs(),
        valAxis_topPane = createAxisStubs();

    this.setupAxes([argAxis_topPane,
        argAxis_bottomPane,
        valAxis_bottomPane,
        valAxis_topPane]);

    new dxChart(this.container, {
        panes: [
            { name: 'top', border: { visible: true, color: 'red' } },
            { name: 'bottom', border: { visible: true, color: 'blue' } }
        ],
        valueAxis: [
            { name: 'valAxis_bottomPane' },
            { name: 'valAxis_topPane' }
        ],
        series: [
            { pane: 'bottom', axis: 'valAxis_bottomPane' },
            { pane: 'top', axis: 'valAxis_topPane' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    assert.strictEqual(argAxis_topPane.draw.lastCall.args[1].color, 'red');

    assert.strictEqual(argAxis_bottomPane.draw.lastCall.args[1].color, 'blue');

    assert.strictEqual(valAxis_bottomPane.draw.lastCall.args[1].color, 'blue');

    assert.strictEqual(valAxis_topPane.draw.lastCall.args[1].color, 'red');
});

QUnit.test('Update panes canvases', function(assert) {
    var argAxis_topPane = createAxisStubs(),
        argAxis_bottomPane = createAxisStubs(),
        valAxis_bottomPane = createAxisStubs(),
        valAxis_topPane = createAxisStubs();

    argAxis_topPane
        .getMargins.returns({ left: 0, top: 9, right: 0, bottom: 6 });

    argAxis_bottomPane
        .getMargins.returns({ left: 0, top: 5, right: 0, bottom: 10 });

    valAxis_bottomPane
        .getMargins.returns({ left: 0, top: 0, right: 6, bottom: 0 });

    valAxis_topPane
        .getMargins.returns({ left: 8, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis_topPane,
        argAxis_bottomPane,
        valAxis_bottomPane,
        valAxis_topPane]);

    var chart = new dxChart(this.container, {
        panes: [
            { name: 'top' },
            { name: 'bottom' }
        ],
        valueAxis: [
            { name: 'valAxis_bottomPane', position: 'right' },
            { name: 'valAxis_topPane' }
        ],
        series: [
            { pane: 'bottom', axis: 'valAxis_bottomPane' },
            { pane: 'top', axis: 'valAxis_topPane' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    assert.deepEqual(chart.panes[0].canvas, {
        left: 8,
        right: 6,
        top: 9,
        bottom: 311,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 305,
        width: 800,
        height: 600
    });

    assert.deepEqual(chart.panes[1].canvas, {
        left: 8,
        right: 6,
        top: 310,
        bottom: 10,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 305,
        originalBottom: 0,
        width: 800,
        height: 600
    });
});

QUnit.test('Calculate panes canvases (by percentage)', function(assert) {
    var argAxis_topPane = createAxisStubs(),
        argAxis_centerPane = createAxisStubs(),
        argAxis_bottomPane = createAxisStubs(),
        valAxis_topPane = createAxisStubs(),
        valAxis_centerPane = createAxisStubs(),
        valAxis_bottomPane = createAxisStubs();

    argAxis_topPane
        .getMargins.returns({ left: 0, top: 9, right: 0, bottom: 6 });
    argAxis_centerPane
        .getMargins.returns({ left: 0, top: 5, right: 0, bottom: 5 });
    argAxis_bottomPane
        .getMargins.returns({ left: 0, top: 5, right: 0, bottom: 10 });
    valAxis_topPane
        .getMargins.returns({ left: 8, top: 0, right: 0, bottom: 0 });
    valAxis_centerPane
        .getMargins.returns({ left: 10, top: 0, right: 0, bottom: 0 });
    valAxis_bottomPane
        .getMargins.returns({ left: 0, top: 0, right: 6, bottom: 0 });

    this.setupAxes([argAxis_topPane,
        argAxis_centerPane,
        argAxis_bottomPane,
        valAxis_bottomPane,
        valAxis_centerPane,
        valAxis_topPane]);

    var chart = new dxChart(this.container, {
        panes: [
            { name: 'top', height: '30%' },
            { name: 'center', height: 0.4 },
            { name: 'bottom' }
        ],
        valueAxis: [
            { name: 'valAxis_bottomPane', position: 'right' },
            { name: 'valAxis_centerPane' },
            { name: 'valAxis_topPane' }
        ],
        series: [
            { pane: 'bottom', axis: 'valAxis_bottomPane' },
            { pane: 'center', axis: 'valAxis_centerPane' },
            { pane: 'top', axis: 'valAxis_topPane' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    assert.equal(argAxis_topPane.getMargins.callCount, 2);

    assert.deepEqual(chart.panes[0].canvas, {
        left: 10,
        right: 6,
        top: 9,
        bottom: 429,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 426,
        width: 800,
        height: 600
    });

    assert.deepEqual(chart.panes[1].canvas, {
        left: 10,
        right: 6,
        top: 192,
        bottom: 192,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 184,
        originalBottom: 184,
        width: 800,
        height: 600
    });

    assert.deepEqual(chart.panes[2].canvas, {
        left: 10,
        right: 6,
        top: 428,
        bottom: 10,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 426,
        originalBottom: 0,
        width: 800,
        height: 600
    });
});

QUnit.test('Calculate panes canvases (mixed)', function(assert) {
    var argAxis_topPane = createAxisStubs(),
        argAxis_centerPane = createAxisStubs(),
        argAxis_bottomPane = createAxisStubs(),
        valAxis_topPane = createAxisStubs(),
        valAxis_centerPane = createAxisStubs(),
        valAxis_bottomPane = createAxisStubs();

    argAxis_topPane
        .getMargins.returns({ left: 0, top: 9, right: 0, bottom: 6 });
    argAxis_centerPane
        .getMargins.returns({ left: 0, top: 5, right: 0, bottom: 5 });
    argAxis_bottomPane
        .getMargins.returns({ left: 0, top: 5, right: 0, bottom: 10 });
    valAxis_topPane
        .getMargins.returns({ left: 8, top: 0, right: 0, bottom: 0 });
    valAxis_centerPane
        .getMargins.returns({ left: 10, top: 0, right: 0, bottom: 0 });
    valAxis_bottomPane
        .getMargins.returns({ left: 0, top: 0, right: 6, bottom: 0 });

    this.setupAxes([argAxis_topPane,
        argAxis_centerPane,
        argAxis_bottomPane,
        valAxis_bottomPane,
        valAxis_centerPane,
        valAxis_topPane]);

    var chart = new dxChart(this.container, {
        panes: [
            { name: 'top', height: '45%' },
            { name: 'center', height: '220px' },
            { name: 'bottom' }
        ],
        valueAxis: [
            { name: 'valAxis_bottomPane', position: 'right' },
            { name: 'valAxis_centerPane' },
            { name: 'valAxis_topPane' }
        ],
        series: [
            { pane: 'bottom', axis: 'valAxis_bottomPane' },
            { pane: 'center', axis: 'valAxis_centerPane' },
            { pane: 'top', axis: 'valAxis_topPane' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    assert.equal(argAxis_topPane.getMargins.callCount, 2);

    assert.deepEqual(chart.panes[0].canvas, {
        left: 10,
        right: 6,
        top: 9,
        bottom: 447,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 438,
        width: 800,
        height: 600
    });

    assert.deepEqual(chart.panes[1].canvas, {
        left: 10,
        right: 6,
        top: 174,
        bottom: 206,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 172,
        originalBottom: 208,
        width: 800,
        height: 600
    });

    assert.deepEqual(chart.panes[2].canvas, {
        left: 10,
        right: 6,
        top: 414,
        bottom: 10,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 402,
        originalBottom: 0,
        width: 800,
        height: 600
    });
});

QUnit.test('Calculate panes canvases (pixels). Rotated. ScrollBar on left', function(assert) {
    var argAxis1 = createAxisStubs(),
        argAxis2 = createAxisStubs(),
        valAxis1 = createAxisStubs(),
        valAxis2 = createAxisStubs(),
        scrollBar = this.setupScrollBar();

    argAxis1
        .getMargins.returns({ left: 10, top: 0, right: 0, bottom: 0 });
    argAxis2
        .getMargins.returns({ left: 0, top: 0, right: 10, bottom: 0 });
    valAxis1
        .getMargins.returns({ left: 0, top: 9, right: 0, bottom: 0 });
    valAxis2
        .getMargins.returns({ left: 0, top: 0, right: 0, bottom: 10 });

    scrollBar
        .getMargins.returns({ left: 15, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis1, argAxis2, valAxis1, valAxis2]);

    new dxChart(this.container, {
        rotated: true,
        scrollBar: { visible: true, position: 'left' },
        panes: [{ name: 'pane1', height: 300 }, { name: 'pane2', height: 350 }],
        valueAxis: [{ name: 'axis1' }, { name: 'axis2' }],
        series: [{ axis: 'axis1', pane: 'pane1' }, { axis: 'axis2', pane: 'pane2' }],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    assert.equal(argAxis1.getMargins.callCount, 3);
    // 3. draw horizontal axes
    assert.deepEqual(this.axisStub.getCall(3).returnValue.createTicks_test_arg, {
        left: 30,
        right: 420,
        top: 0,
        bottom: 0,
        originalLeft: 0,
        originalRight: 450,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    });

    assert.deepEqual(this.axisStub.getCall(2).returnValue.createTicks_test_arg, {
        left: 390,
        right: 110,
        top: 0,
        bottom: 0,
        originalLeft: 360,
        originalRight: 140,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    });
});

QUnit.test('Do not recalculate canvas on zooming - only draw axes in old canvas', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs(),
        scrollBar = this.setupScrollBar();

    argAxis
        .getMargins.returns({ left: 10, top: 7, right: 20, bottom: 13 });

    valAxis
        .getMargins.returns({ left: 18, top: 15, right: 10, bottom: 9 });

    scrollBar
        .getMargins.returns({ left: 0, top: 15, right: 0, bottom: 0 });

    this.setupAxes([argAxis, valAxis]);

    var chart = new dxChart(this.container, {
        scrollBar: { visible: true },
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    var argAxisStub = this.axisStub.getCall(0).returnValue;

    argAxisStub.draw.reset();
    argAxisStub.getMargins.reset();
    argAxisStub.estimateMargins.reset();
    argAxisStub.updateSize.reset();
    argAxisStub.shift.reset();
    argAxisStub.createTicks.reset();
    argAxisStub.drawScaleBreaks.reset();

    var valAxisStub = this.axisStub.getCall(1).returnValue;

    valAxisStub.draw.reset();
    valAxisStub.getMargins.reset();
    valAxisStub.estimateMargins.reset();
    valAxisStub.updateSize.reset();
    valAxisStub.shift.reset();
    valAxisStub.createTicks.reset();
    valAxisStub.drawScaleBreaks.reset();

    scrollBar.updateSize.reset();

    // act
    chart.zoomArgument(2, 9);

    // assert
    assert.deepEqual(valAxisStub.createTicks_test_arg, {
        left: 18,
        right: 20,
        top: 27,
        bottom: 13,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis canvas');

    assert.equal(valAxisStub.draw.lastCall.args[0], false, 'draw valAxis');

    assert.deepEqual(argAxisStub.draw_test_arg, {
        left: 18,
        right: 20,
        top: 27,
        bottom: 13,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'draw argAxis canvas');

    assert.equal(argAxisStub.updateSize.called, false);
    assert.equal(valAxisStub.updateSize.called, false);
    assert.equal(scrollBar.updateSize.called, false);

    assert.equal(argAxisStub.shift.called, false);
    assert.equal(valAxisStub.shift.called, false);

    assert.ok(valAxisStub.drawScaleBreaks.called, 'draw scaleBreaks for value axis');
    assert.ok(argAxisStub.drawScaleBreaks.called, 'draw scaleBreaks for argument axis');

    assert.ok(valAxisStub.prepareAnimation.called);
    assert.ok(argAxisStub.prepareAnimation.called);
});

QUnit.test('Recalculate canvas on zooming - draw axes in new canvas', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs(),
        scrollBar = this.setupScrollBar();

    argAxis
        .getMargins.returns({ left: 10, top: 7, right: 20, bottom: 13 });

    valAxis
        .getMargins.returns({ left: 18, top: 15, right: 10, bottom: 9 });

    scrollBar
        .getMargins.returns({ left: 0, top: 15, right: 0, bottom: 0 });

    this.setupAxes([argAxis, valAxis]);

    var chart = new dxChart(this.container, {
        scrollBar: { visible: true },
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false },
        resizePanesOnZoom: true
    });

    var argAxisStub = this.axisStub.getCall(0).returnValue;

    argAxisStub.draw.reset();
    argAxisStub.getMargins.reset();
    argAxisStub.estimateMargins.reset();
    argAxisStub.updateSize.reset();
    argAxisStub.shift.reset();
    argAxisStub.createTicks.reset();
    argAxisStub.drawScaleBreaks.reset();

    var valAxisStub = this.axisStub.getCall(1).returnValue;

    valAxisStub.draw.reset();
    valAxisStub.getMargins.reset();
    valAxisStub.estimateMargins.reset();
    valAxisStub.updateSize.reset();
    valAxisStub.shift.reset();
    valAxisStub.createTicks.reset();
    valAxisStub.drawScaleBreaks.reset();

    scrollBar.updateSize.reset();

    // act
    chart.zoomArgument(2, 9);

    // assert
    assert.deepEqual(valAxisStub.createTicks_test_arg, {
        left: 0,
        right: 0,
        top: 15,
        bottom: 0,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis canvas');

    assert.equal(valAxisStub.draw.lastCall.args[0], false, 'draw valAxis');

    assert.deepEqual(argAxisStub.draw_test_arg, {
        left: 18,
        right: 10,
        top: 15,
        bottom: 9,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'draw argAxis canvas');

    assert.equal(argAxisStub.updateSize.called, true);
    assert.equal(valAxisStub.updateSize.called, true);
    assert.equal(scrollBar.updateSize.called, true);

    assert.equal(argAxisStub.shift.called, true);
    assert.equal(valAxisStub.shift.called, true);

    assert.ok(valAxisStub.drawScaleBreaks.called, 'draw scaleBreaks for value axis');
    assert.ok(argAxisStub.drawScaleBreaks.called, 'draw scaleBreaks for argument axis');

    assert.ok(!valAxisStub.prepareAnimation.called);
    assert.ok(!argAxisStub.prepareAnimation.called);
});

QUnit.test('Recalculate canvas on zooming - draw axes in new canvas (support of adjustAxesOnZoom)', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs(),
        scrollBar = this.setupScrollBar();

    argAxis
        .getMargins.returns({ left: 10, top: 7, right: 20, bottom: 13 });

    valAxis
        .getMargins.returns({ left: 18, top: 15, right: 10, bottom: 9 });

    scrollBar
        .getMargins.returns({ left: 0, top: 15, right: 0, bottom: 0 });

    this.setupAxes([argAxis, valAxis]);

    var chart = new dxChart(this.container, {
        scrollBar: { visible: true },
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false },
        adjustAxesOnZoom: true
    });

    var argAxisStub = this.axisStub.getCall(0).returnValue;

    argAxisStub.draw.reset();
    argAxisStub.getMargins.reset();
    argAxisStub.estimateMargins.reset();
    argAxisStub.updateSize.reset();
    argAxisStub.shift.reset();
    argAxisStub.createTicks.reset();
    argAxisStub.drawScaleBreaks.reset();

    var valAxisStub = this.axisStub.getCall(1).returnValue;

    valAxisStub.draw.reset();
    valAxisStub.getMargins.reset();
    valAxisStub.estimateMargins.reset();
    valAxisStub.updateSize.reset();
    valAxisStub.shift.reset();
    valAxisStub.createTicks.reset();
    valAxisStub.drawScaleBreaks.reset();

    scrollBar.updateSize.reset();

    // act
    chart.zoomArgument(2, 9);

    // assert
    assert.deepEqual(valAxisStub.createTicks_test_arg, {
        left: 0,
        right: 0,
        top: 15,
        bottom: 0,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis canvas');

    assert.equal(valAxisStub.draw.lastCall.args[0], false, 'draw valAxis');

    assert.deepEqual(argAxisStub.draw_test_arg, {
        left: 18,
        right: 10,
        top: 15,
        bottom: 9,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'draw argAxis canvas');

    assert.equal(argAxisStub.updateSize.called, true);
    assert.equal(valAxisStub.updateSize.called, true);
    assert.equal(scrollBar.updateSize.called, true);

    assert.equal(argAxisStub.shift.called, true);
    assert.equal(valAxisStub.shift.called, true);

    assert.ok(valAxisStub.drawScaleBreaks.called, 'draw scaleBreaks for value axis');
    assert.ok(argAxisStub.drawScaleBreaks.called, 'draw scaleBreaks for argument axis');

    assert.ok(!valAxisStub.prepareAnimation.called);
    assert.ok(!argAxisStub.prepareAnimation.called);
});

QUnit.test('Draw scale breaks', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs(),
        scrollBar = this.setupScrollBar();

    argAxis
        .getMargins.returns({ left: 10, top: 7, right: 20, bottom: 13 });

    valAxis
        .getMargins.returns({ left: 18, top: 15, right: 10, bottom: 9 });

    scrollBar
        .getMargins.returns({ left: 0, top: 15, right: 0, bottom: 0 });

    this.setupAxes([argAxis, valAxis]);

    new dxChart(this.container, {
        scrollBar: { visible: true },
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    var argAxisStub = this.axisStub.getCall(0).returnValue,
        valAxisStub = this.axisStub.getCall(1).returnValue;

    assert.ok(valAxisStub.drawScaleBreaks.called, 'draw scaleBreaks for value axis');
    assert.ok(argAxisStub.drawScaleBreaks.called, 'draw scaleBreaks for argument axis');
});

QUnit.module('Axes synchronization', environment);

QUnit.test('synchronizeMultiAxes true - only value axes are synchronized', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis_inner = createAxisStubs(),
        valAxis_outer = createAxisStubs(),
        synchronize = sinon.spy();

    multiAxesSynchronizer.synchronize = synchronize;

    this.setupAxes([argAxis,
        valAxis_inner,
        valAxis_outer]);

    new dxChart(this.container, {
        synchronizeMultiAxes: true,
        valueAxis: [
            { name: 'valAxis_inner' },
            { name: 'valAxis_outer' }
        ],
        series: [
            { axis: 'valAxis_inner' },
            { axis: 'valAxis_outer' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    var valAxis1 = this.axisStub.getCall(1).returnValue,
        valAxis2 = this.axisStub.getCall(2).returnValue;

    assert.equal(synchronize.callCount, 1);
    assert.deepEqual(synchronize.lastCall.args, [[valAxis1, valAxis2]]);

    assert.equal(valAxis1.createTicks.callCount, 1);
    assert.equal(valAxis2.createTicks.callCount, 1);

    assert.ok(synchronize.lastCall.calledAfter(valAxis1.createTicks.lastCall));
    assert.ok(synchronize.lastCall.calledAfter(valAxis2.createTicks.lastCall));

    assert.ok(valAxis1.draw.lastCall.calledAfter(synchronize.lastCall));
    assert.ok(valAxis2.draw.lastCall.calledAfter(synchronize.lastCall));
});

QUnit.test('synchronizeMultiAxes true - only value axes are synchronized. Rotated', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis_inner = createAxisStubs(),
        valAxis_outer = createAxisStubs(),
        synchronize = sinon.spy();

    multiAxesSynchronizer.synchronize = synchronize;

    this.setupAxes([argAxis,
        valAxis_inner,
        valAxis_outer]);

    new dxChart(this.container, {
        rotated: true,
        synchronizeMultiAxes: true,
        valueAxis: [
            { name: 'valAxis_inner' },
            { name: 'valAxis_outer' }
        ],
        series: [
            { axis: 'valAxis_inner' },
            { axis: 'valAxis_outer' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    var valAxis1 = this.axisStub.getCall(1).returnValue,
        valAxis2 = this.axisStub.getCall(2).returnValue;

    assert.equal(synchronize.callCount, 1);
    assert.deepEqual(synchronize.lastCall.args, [[valAxis1, valAxis2]]);

    assert.equal(valAxis1.createTicks.callCount, 1);
    assert.equal(valAxis2.createTicks.callCount, 1);

    assert.ok(synchronize.lastCall.calledAfter(valAxis1.createTicks.lastCall));
    assert.ok(synchronize.lastCall.calledAfter(valAxis2.createTicks.lastCall));

    assert.ok(valAxis1.draw.lastCall.calledAfter(synchronize.lastCall));
    assert.ok(valAxis2.draw.lastCall.calledAfter(synchronize.lastCall));
});

QUnit.test('synchronizeMultiAxes false - do not synchronize', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis_inner = createAxisStubs(),
        valAxis_outer = createAxisStubs(),
        synchronize = sinon.spy();

    multiAxesSynchronizer.synchronize = synchronize;

    this.setupAxes([argAxis,
        valAxis_inner,
        valAxis_outer]);

    new dxChart(this.container, {
        synchronizeMultiAxes: false,
        valueAxis: [
            { name: 'valAxis_inner' },
            { name: 'valAxis_outer' }
        ],
        series: [
            { axis: 'valAxis_inner' },
            { axis: 'valAxis_outer' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    assert.equal(synchronize.callCount, 0);
});

QUnit.test('synchronizeMultiAxes false - do not synchronize. Rotated', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis_inner = createAxisStubs(),
        valAxis_outer = createAxisStubs(),
        synchronize = sinon.spy();

    multiAxesSynchronizer.synchronize = synchronize;

    this.setupAxes([argAxis,
        valAxis_inner,
        valAxis_outer]);

    new dxChart(this.container, {
        rotated: true,
        synchronizeMultiAxes: false,
        valueAxis: [
            { name: 'valAxis_inner' },
            { name: 'valAxis_outer' }
        ],
        series: [
            { axis: 'valAxis_inner' },
            { axis: 'valAxis_outer' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    assert.equal(synchronize.callCount, 0);
});

QUnit.module('ScrollBar', environment);

QUnit.test('ScrollBar margins accumulated with argument axis margins', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs(),
        scrollBar = this.setupScrollBar();

    argAxis
        .estimateMargins.returns({ left: 0, top: 10, right: 0, bottom: 20 });
    argAxis
        .getMargins.returns({ left: 0, top: 5, right: 0, bottom: 10 });

    scrollBar
        .getMargins.returns({ left: 0, top: 15, right: 0, bottom: 0 });

    this.setupAxes([argAxis, valAxis]);

    new dxChart(this.container, {
        scrollBar: { visible: true },
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 1. estimate horizontal axes margins
    // 2. draw vertical axes
    assert.deepEqual(this.axisStub.getCall(1).returnValue.createTicks_test_arg, {
        left: 0,
        right: 0,
        top: 30,
        bottom: 20,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis canvas');

    // 3. draw horizontal axes
    assert.deepEqual(this.axisStub.getCall(0).returnValue.draw_test_arg, {
        left: 0,
        right: 0,
        top: 30,
        bottom: 20,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'draw argAxis canvas');

    // 4. update horizontal axes size
    assert.deepEqual(this.axisStub.getCall(0).returnValue.updateSize_test_arg, {
        left: 0,
        right: 0,
        top: 25,
        bottom: 10,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize argAxis canvas');

    // 5. update vertical axes size
    assert.deepEqual(this.axisStub.getCall(1).returnValue.updateSize_test_arg, {
        left: 0,
        right: 0,
        top: 25,
        bottom: 10,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'updateSize valAxis canvas');
});

QUnit.test('Multiple panes. ScrollBar on top. ScrollBar placed in correct pane', function(assert) {
    var argAxis1 = createAxisStubs(),
        argAxis2 = createAxisStubs(),
        valAxis1 = createAxisStubs(),
        valAxis2 = createAxisStubs(),
        scrollBar = this.setupScrollBar();

    argAxis1
        .estimateMargins.returns({ left: 0, top: 10, right: 0, bottom: 0 });
    argAxis1
        .getMargins.returns({ left: 0, top: 5, right: 0, bottom: 0 });
    argAxis2
        .estimateMargins.returns({ left: 0, top: 0, right: 0, bottom: 20 });
    argAxis2
        .getMargins.returns({ left: 0, top: 0, right: 0, bottom: 10 });

    scrollBar
        .getMargins.returns({ left: 0, top: 15, right: 0, bottom: 0 });

    this.setupAxes([argAxis1, argAxis2, valAxis1, valAxis2]);

    new dxChart(this.container, {
        scrollBar: { visible: true, position: 'top' },
        panes: [{ name: 'pane1' }, { name: 'pane2' }],
        valueAxis: [{ name: 'axis1' }, { name: 'axis2' }],
        series: [{ axis: 'axis1', pane: 'pane1' }, { axis: 'axis2', pane: 'pane2' }],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 1. estimate horizontal axes margins
    // 2. draw vertical axes
    assert.deepEqual(this.axisStub.getCall(2).returnValue.createTicks_test_arg, {
        left: 0,
        right: 0,
        top: 30,
        bottom: 300,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 305,
        width: 800,
        height: 600
    }, 'createTicks valAxis canvas');

    assert.deepEqual(this.axisStub.getCall(3).returnValue.createTicks_test_arg, {
        left: 0,
        right: 0,
        top: 310,
        bottom: 20,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 305,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis canvas');
});

QUnit.test('Multiple panes. ScrollBar on bottom. ScrollBar placed in correct pane', function(assert) {
    var argAxis1 = createAxisStubs(),
        argAxis2 = createAxisStubs(),
        valAxis1 = createAxisStubs(),
        valAxis2 = createAxisStubs(),
        scrollBar = this.setupScrollBar();

    argAxis1
        .estimateMargins.returns({ left: 0, top: 10, right: 0, bottom: 0 });
    argAxis1
        .getMargins.returns({ left: 0, top: 5, right: 0, bottom: 0 });
    argAxis2
        .estimateMargins.returns({ left: 0, top: 0, right: 0, bottom: 20 });
    argAxis2
        .getMargins.returns({ left: 0, top: 0, right: 0, bottom: 10 });

    scrollBar
        .getMargins.returns({ left: 0, top: 0, right: 0, bottom: 15 });

    this.setupAxes([argAxis1, argAxis2, valAxis1, valAxis2]);

    new dxChart(this.container, {
        scrollBar: { visible: true, position: 'bottom' },
        panes: [{ name: 'pane1' }, { name: 'pane2' }],
        valueAxis: [{ name: 'axis1' }, { name: 'axis2' }],
        series: [{ axis: 'axis1', pane: 'pane1' }, { axis: 'axis2', pane: 'pane2' }],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 1. estimate horizontal axes margins
    // 2. draw vertical axes
    assert.deepEqual(this.axisStub.getCall(2).returnValue.createTicks_test_arg, {
        left: 0,
        right: 0,
        top: 10,
        bottom: 320,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 305,
        width: 800,
        height: 600
    }, 'createTicks valAxis canvas');

    assert.deepEqual(this.axisStub.getCall(3).returnValue.createTicks_test_arg, {
        left: 0,
        right: 0,
        top: 290,
        bottom: 40,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 305,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis canvas');
});

QUnit.test('Rotated. Multiple panes. ScrollBar on left. ScrollBar placed in correct pane', function(assert) {
    var argAxis1 = createAxisStubs(),
        argAxis2 = createAxisStubs(),
        valAxis1 = createAxisStubs(),
        valAxis2 = createAxisStubs(),
        scrollBar = this.setupScrollBar();

    argAxis1
        .getMargins.returns({ left: 10, top: 0, right: 0, bottom: 0 });
    argAxis2
        .getMargins.returns({ left: 0, top: 0, right: 10, bottom: 0 });

    scrollBar
        .getMargins.returns({ left: 15, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis1, argAxis2, valAxis1, valAxis2]);

    new dxChart(this.container, {
        rotated: true,
        scrollBar: { visible: true, position: 'left' },
        panes: [{ name: 'pane1' }, { name: 'pane2' }],
        valueAxis: [{ name: 'axis1' }, { name: 'axis2' }],
        series: [{ axis: 'axis1', pane: 'pane1' }, { axis: 'axis2', pane: 'pane2' }],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 3. draw horizontal axes
    assert.deepEqual(this.axisStub.getCall(3).returnValue.createTicks_test_arg, {
        left: 30,
        right: 395,
        top: 0,
        bottom: 0,
        originalLeft: 0,
        originalRight: 405,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis canvas');

    assert.deepEqual(this.axisStub.getCall(2).returnValue.createTicks_test_arg, {
        left: 415,
        right: 10,
        top: 0,
        bottom: 0,
        originalLeft: 405,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks valAxis canvas');
});

QUnit.test('Rotated. Multiple panes. ScrollBar on right. ScrollBar placed in correct pane', function(assert) {
    var argAxis1 = createAxisStubs(),
        argAxis2 = createAxisStubs(),
        valAxis1 = createAxisStubs(),
        valAxis2 = createAxisStubs(),
        scrollBar = this.setupScrollBar();

    argAxis1
        .getMargins.returns({ left: 10, top: 0, right: 0, bottom: 0 });
    argAxis2
        .getMargins.returns({ left: 0, top: 0, right: 10, bottom: 0 });

    scrollBar
        .getMargins.returns({ left: 0, top: 0, right: 15, bottom: 0 });

    this.setupAxes([argAxis1, argAxis2, valAxis1, valAxis2]);

    new dxChart(this.container, {
        rotated: true,
        scrollBar: { visible: true, position: 'right' },
        panes: [{ name: 'pane1' }, { name: 'pane2' }],
        valueAxis: [{ name: 'axis1' }, { name: 'axis2' }],
        series: [{ axis: 'axis1', pane: 'pane1' }, { axis: 'axis2', pane: 'pane2' }],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 3. draw horizontal axes
    assert.deepEqual(this.axisStub.getCall(3).returnValue.createTicks_test_arg, {
        left: 10,
        right: 415,
        top: 0,
        bottom: 0,
        originalLeft: 0,
        originalRight: 405,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks argAxis canvas');

    assert.deepEqual(this.axisStub.getCall(2).returnValue.createTicks_test_arg, {
        left: 395,
        right: 30,
        top: 0,
        bottom: 0,
        originalLeft: 405,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, 'createTicks argAxis canvas');
});

QUnit.test('ScrollBar on top. Shift argument axis by ScrollBar margin', function(assert) {
    var scrollBar = this.setupScrollBar();

    scrollBar
        .getMargins.returns({ left: 0, top: 15, right: 0, bottom: 0 });

    this.setupAxes([createAxisStubs(), createAxisStubs()]);

    new dxChart(this.container, {
        scrollBar: { visible: true, position: 'top' },
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 6. shift horizontal axes
    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.shift_test_arg, {
        top: 15,
        bottom: 0,
        left: 0,
        right: 0
    }, 'shift argAxis');
});

QUnit.test('ScrollBar on bottom. Shift argument axis by ScrollBar margin', function(assert) {
    var scrollBar = this.setupScrollBar();

    scrollBar
        .getMargins.returns({ left: 0, top: 0, right: 0, bottom: 15 });

    this.setupAxes([createAxisStubs(), createAxisStubs()]);

    new dxChart(this.container, {
        scrollBar: { visible: true, position: 'bottom' },
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 6. shift horizontal axes
    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.shift_test_arg, {
        top: 0,
        bottom: 15,
        left: 0,
        right: 0
    }, 'shift argAxis');
});

QUnit.test('Rotated. ScrollBar on right. Shift argument axis by ScrollBar margin', function(assert) {
    var scrollBar = this.setupScrollBar();

    scrollBar
        .getMargins.returns({ left: 0, top: 0, right: 15, bottom: 0 });

    this.setupAxes([createAxisStubs(), createAxisStubs()]);

    new dxChart(this.container, {
        rotated: true,
        scrollBar: { visible: true, position: 'right' },
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 6. shift horizontal axes
    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 15
    }, 'shift argAxis');
});

QUnit.test('Rotated. ScrollBar on left. Shift argument axis by ScrollBar margin', function(assert) {
    var scrollBar = this.setupScrollBar();

    scrollBar
        .getMargins.returns({ left: 15, top: 0, right: 0, bottom: 0 });

    this.setupAxes([createAxisStubs(), createAxisStubs()]);

    new dxChart(this.container, {
        rotated: true,
        scrollBar: { visible: true, position: 'left' },
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // 6. shift horizontal axes
    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 15,
        right: 0
    }, 'shift argAxis');
});

QUnit.test('UpdateSize - scrollBar gets canvas', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs(),
        scrollBar = this.setupScrollBar();

    argAxis
        .estimateMargins.returns({ left: 0, top: 10, right: 0, bottom: 20 });
    argAxis
        .getMargins.returns({ left: 0, top: 5, right: 0, bottom: 10 });

    scrollBar
        .getMargins.returns({ left: 0, top: 15, right: 0, bottom: 0 });

    this.setupAxes([argAxis, valAxis]);

    new dxChart(this.container, {
        scrollBar: { visible: true },
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    assert.deepEqual(scrollBar.updateSize.getCall(0).args, [{
        left: 0,
        right: 0,
        top: 25,
        bottom: 10,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 800,
        height: 600
    }, true, undefined]);
});

QUnit.module('Adaptive layout rendering', environment);

QUnit.test('Multiple panes - hide all for horizontal axes', function(assert) {
    var argAxis_top = createAxisStubs(),
        argAxis_bottom = createAxisStubs(),
        valAxis_top = createAxisStubs(),
        valAxis_bottom = createAxisStubs();

    argAxis_top.getMargins.returns({ left: 0, top: 10, right: 0, bottom: 0 });
    argAxis_bottom.getMargins.returns({ left: 0, top: 0, right: 0, bottom: 15 });

    this.setupAxes([argAxis_top,
        argAxis_bottom,
        valAxis_top,
        valAxis_bottom]);

    new dxChart(this.container, {
        size: { width: 220, height: 220 },
        adaptiveLayout: { width: 200, height: 100 },
        panes: [{ name: 'topPane', height: 110 }, { name: 'bottomPame' }],
        valueAxis: [
            { name: 'valAxis_top' },
            { name: 'valAxis_bottom' }
        ],
        series: [
            { axis: 'valAxis_top', pane: 'topPane' },
            { axis: 'valAxis_bottom', pane: 'bottomPane' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // argAxis_bottom
    assert.deepEqual(this.axisStub.getCall(1).returnValue.hideTitle.callCount, 1);
    assert.deepEqual(this.axisStub.getCall(1).returnValue.hideOuterElements.callCount, 1);

    // argAxis_top
    assert.deepEqual(this.axisStub.getCall(0).returnValue.hideTitle.callCount, 1);
    assert.deepEqual(this.axisStub.getCall(0).returnValue.hideOuterElements.callCount, 1);
});

QUnit.test('Multiple panes - not hide all for horizontal axes (pane sized for adaptivity)', function(assert) {
    var argAxis_top = createAxisStubs(),
        argAxis_bottom = createAxisStubs(),
        valAxis_top = createAxisStubs(),
        valAxis_bottom = createAxisStubs();

    argAxis_top.getMargins.returns({ left: 0, top: 10, right: 0, bottom: 0 });
    argAxis_bottom.getMargins.returns({ left: 0, top: 0, right: 0, bottom: 15 });

    this.setupAxes([argAxis_top,
        argAxis_bottom,
        valAxis_top,
        valAxis_bottom]);

    new dxChart(this.container, {
        size: { width: 220, height: 220 },
        adaptiveLayout: { width: 200, height: 90 },
        panes: [{ name: 'topPane', height: 70 }, { name: 'bottomPame' }],
        valueAxis: [
            { name: 'valAxis_top' },
            { name: 'valAxis_bottom' }
        ],
        series: [
            { axis: 'valAxis_top', pane: 'topPane' },
            { axis: 'valAxis_bottom', pane: 'bottomPane' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // argAxis_bottom
    assert.deepEqual(this.axisStub.getCall(1).returnValue.hideTitle.callCount, 0);
    assert.deepEqual(this.axisStub.getCall(1).returnValue.hideOuterElements.callCount, 0);

    // argAxis_top
    assert.deepEqual(this.axisStub.getCall(0).returnValue.hideTitle.callCount, 0);
    assert.deepEqual(this.axisStub.getCall(0).returnValue.hideOuterElements.callCount, 0);
});

QUnit.test('Multiple axes, vertical axes without titles are fit, horizontal axis without labels is fit - hide title for vertical axes, and all for horizontal', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis_inner = createAxisStubs(),
        valAxis_outer = createAxisStubs();

    argAxis.getMargins.onCall(0).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(1).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(2).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(3).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(4).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.returns({ left: 0, top: 0, right: 0, bottom: 11 });

    valAxis_inner.getMargins.onCall(0).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.onCall(1).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.onCall(2).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.onCall(3).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.onCall(4).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.returns({ left: 7, top: 0, right: 0, bottom: 0 });

    valAxis_outer.getMargins.onCall(0).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(1).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(2).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(3).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(4).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.returns({ left: 6, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis,
        valAxis_inner,
        valAxis_outer]);

    new dxChart(this.container, {
        size: { width: 220, height: 110 },
        adaptiveLayout: { width: 200, height: 100 },
        valueAxis: [
            { name: 'valAxis_inner' },
            { name: 'valAxis_outer' }
        ],
        series: [
            { axis: 'valAxis_inner' },
            { axis: 'valAxis_outer' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // valAxis_inner
    assert.deepEqual(this.axisStub.getCall(1).returnValue.hideTitle.callCount, 1);
    assert.deepEqual(this.axisStub.getCall(1).returnValue.hideOuterElements.callCount, 0);

    // valAxis_outer
    assert.deepEqual(this.axisStub.getCall(2).returnValue.hideTitle.callCount, 1);
    assert.deepEqual(this.axisStub.getCall(2).returnValue.hideOuterElements.callCount, 0);

    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.hideTitle.callCount, 1);
    assert.deepEqual(this.axisStub.getCall(0).returnValue.hideOuterElements.callCount, 1);
});

QUnit.test('Multiple axes, horizontal axes without titles are fit, vertical axis without labels is fit - hide title for horizontal axes, and all for vertical', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis_inner = createAxisStubs(),
        valAxis_outer = createAxisStubs();

    argAxis.getMargins.onCall(0).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(1).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(2).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(3).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(4).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.returns({ left: 0, top: 0, right: 0, bottom: 5 });

    valAxis_inner.getMargins.onCall(0).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.onCall(1).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.onCall(2).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.onCall(3).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.onCall(4).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.returns({ left: 11, top: 0, right: 0, bottom: 0 });

    valAxis_outer.getMargins.onCall(0).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(1).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(2).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(3).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(4).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.returns({ left: 6, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis,
        valAxis_inner,
        valAxis_outer]);

    new dxChart(this.container, {
        size: { width: 220, height: 110 },
        adaptiveLayout: { width: 200, height: 100 },
        valueAxis: [
            { name: 'valAxis_inner' },
            { name: 'valAxis_outer' }
        ],
        series: [
            { axis: 'valAxis_inner' },
            { axis: 'valAxis_outer' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // valAxis_inner
    assert.deepEqual(this.axisStub.getCall(1).returnValue.hideTitle.callCount, 1);
    assert.deepEqual(this.axisStub.getCall(1).returnValue.hideOuterElements.callCount, 1);

    // valAxis_outer
    assert.deepEqual(this.axisStub.getCall(2).returnValue.hideTitle.callCount, 1);
    assert.deepEqual(this.axisStub.getCall(2).returnValue.hideOuterElements.callCount, 1);

    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.hideTitle.callCount, 1);
    assert.deepEqual(this.axisStub.getCall(0).returnValue.hideOuterElements.callCount, 0);
});

QUnit.test('Update axes size and shift with new margins (there is also scrollBar)', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis_inner = createAxisStubs(),
        valAxis_outer = createAxisStubs(),
        scrollBar = this.setupScrollBar();

    scrollBar
        .getMargins.returns({ left: 0, top: 4, right: 0, bottom: 0 });

    argAxis.getMargins.onCall(0).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(1).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(2).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(3).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(4).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.returns({ left: 0, top: 0, right: 0, bottom: 5 });

    valAxis_inner.getMargins.onCall(0).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.onCall(1).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.onCall(2).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.onCall(3).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.onCall(4).returns({ left: 12, top: 0, right: 0, bottom: 0 });
    valAxis_inner.getMargins.returns({ left: 7, top: 0, right: 0, bottom: 0 });

    valAxis_outer.getMargins.onCall(0).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(1).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(2).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(3).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(4).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.returns({ left: 6, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis,
        valAxis_inner,
        valAxis_outer]);

    var chart = new dxChart(this.container, {
        size: { width: 220, height: 110 },
        adaptiveLayout: { width: 200, height: 100 },
        scrollBar: { visible: true },
        valueAxis: [
            { name: 'valAxis_inner' },
            { name: 'valAxis_outer' }
        ],
        series: [
            { axis: 'valAxis_inner' },
            { axis: 'valAxis_outer' }
        ],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // valAxis_inner
    assert.deepEqual(this.axisStub.getCall(1).returnValue.updateSize_test_arg, {
        left: 18,
        right: 0,
        top: 4,
        bottom: 5,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 220,
        height: 110
    });
    assert.deepEqual(this.axisStub.getCall(1).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    });

    assert.deepEqual(this.axisStub.getCall(1).returnValue.updateSizeArgs.length, 4);
    assert.deepEqual(this.axisStub.getCall(1).returnValue.updateSizeArgs[2], {
        bottom: 0,
        height: 110,
        left: 0,
        originalBottom: 0,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        right: 0,
        top: 0,
        width: 220
    }); // T587219

    // valAxis_outer
    assert.deepEqual(this.axisStub.getCall(2).returnValue.updateSize_test_arg, {
        left: 18,
        right: 0,
        top: 4,
        bottom: 5,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 220,
        height: 110
    });
    assert.deepEqual(this.axisStub.getCall(2).returnValue.shift_test_arg, {
        top: 0,
        bottom: 0,
        left: 7,
        right: 0
    });

    assert.deepEqual(this.axisStub.getCall(2).returnValue.updateSizeArgs[2], {
        bottom: 0,
        height: 110,
        left: 0,
        originalBottom: 0,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        right: 0,
        top: 0,
        width: 220
    }); // T587219
    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.updateSize_test_arg, {
        left: 18,
        right: 0,
        top: 4,
        bottom: 5,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 220,
        height: 110
    });
    assert.deepEqual(this.axisStub.getCall(0).returnValue.shift_test_arg, {
        top: 4,
        bottom: 0,
        left: 0,
        right: 0
    });

    assert.deepEqual(chart.panes[0].canvas, {
        left: 18,
        right: 0,
        top: 4,
        bottom: 5,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 220,
        height: 110
    });

    assert.deepEqual(this.axisStub.getCall(0).returnValue.updateSizeArgs[2], {
        bottom: 0,
        height: 110,
        left: 0,
        originalBottom: 0,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        right: 0,
        top: 0,
        width: 220
    }); // T587219
});

QUnit.test('Do not shrink axis on zooming - only draw axes in old canvas (T624446)', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs(),
        scrollBar = this.setupScrollBar();

    argAxis
        .getMargins.returns({ left: 10, top: 7, right: 20, bottom: 13 });

    valAxis
        .getMargins.returns({ left: 18, top: 15, right: 10, bottom: 9 });

    scrollBar
        .getMargins.returns({ left: 0, top: 15, right: 0, bottom: 0 });

    this.setupAxes([argAxis, valAxis]);

    var chart = new dxChart(this.container, {
        size: { width: 220, height: 110 },
        adaptiveLayout: { width: 200, height: 100 },
        scrollBar: { visible: true },
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    var argAxisStub = this.axisStub.getCall(0).returnValue;

    argAxisStub.draw.reset();
    argAxisStub.getMargins.reset();
    argAxisStub.estimateMargins.reset();
    argAxisStub.updateSize.reset();
    argAxisStub.shift.reset();
    argAxisStub.createTicks.reset();
    argAxisStub.drawScaleBreaks.reset();

    var valAxisStub = this.axisStub.getCall(1).returnValue;

    valAxisStub.draw.reset();
    valAxisStub.getMargins.reset();
    valAxisStub.estimateMargins.reset();
    valAxisStub.updateSize.reset();
    valAxisStub.shift.reset();
    valAxisStub.createTicks.reset();
    valAxisStub.drawScaleBreaks.reset();

    scrollBar.updateSize.reset();

    // act
    chart.zoomArgument(2, 9);

    // assert
    assert.equal(valAxisStub.draw.lastCall.args[0], false, 'draw valAxis');

    assert.deepEqual(argAxisStub.draw_test_arg, {
        left: 18,
        right: 20,
        top: 27,
        bottom: 13,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        originalBottom: 0,
        width: 220,
        height: 110
    }, 'draw argAxis canvas');

    assert.equal(argAxisStub.updateSize.called, false);
    assert.equal(valAxisStub.updateSize.called, false);
    assert.equal(scrollBar.updateSize.called, false);

    assert.equal(argAxisStub.shift.called, false);
    assert.equal(valAxisStub.shift.called, false);

    assert.ok(valAxisStub.drawScaleBreaks.called, 'draw scaleBreaks for value axis');
    assert.ok(argAxisStub.drawScaleBreaks.called, 'draw scaleBreaks for argument axis');
});

QUnit.test('Hide legend and title - free space is enought for axis - no hide elements', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis_outer = createAxisStubs();

    argAxis.getMargins.onCall(0).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(1).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(2).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(3).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.onCall(4).returns({ left: 0, top: 0, right: 0, bottom: 15 });
    argAxis.getMargins.returns({ left: 0, top: 0, right: 0, bottom: 11 });

    valAxis_outer.getMargins.onCall(0).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(1).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(2).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(3).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(4).returns({ left: 16, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.returns({ left: 6, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis,
        valAxis_outer]);

    this.title.stub('layoutOptions').returns({
        horizontalAlignment: 'center',
        verticalAlignment: 'top'
    });

    this.title.stub('measure').returns([100, 50]);

    this.legend.stub('layoutOptions').returns({
        horizontalAlignment: 'right',
        verticalAlignment: 'top',
        side: 'horizontal'
    });

    this.legend.stub('measure').returns([50, 50]);

    new dxChart(this.container, {
        size: { width: 220, height: 110 },
        adaptiveLayout: { width: 220 - 51, height: 110 - 51 },
        valueAxis: [
            { name: 'valAxis_outer' }
        ],
        series: [
            { axis: 'valAxis_outer' }
        ],
        title: 'text',
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // valAxis_outer
    assert.deepEqual(this.axisStub.getCall(1).returnValue.hideTitle.callCount, 0);
    assert.deepEqual(this.axisStub.getCall(1).returnValue.hideOuterElements.callCount, 0);

    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.hideTitle.callCount, 0);
    assert.deepEqual(this.axisStub.getCall(0).returnValue.hideOuterElements.callCount, 0);

    assert.ok(this.title.freeSpace.called);
    assert.ok(this.legend.freeSpace.called);
});

QUnit.test('Hide legend and title - free space is enought for axis - hide elements', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis_outer = createAxisStubs();

    argAxis.getMargins.onCall(0).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.onCall(1).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.onCall(2).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.onCall(3).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.onCall(4).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.returns({ left: 0, top: 0, right: 0, bottom: 11 });

    valAxis_outer.getMargins.onCall(0).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(1).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(2).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(3).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(4).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.returns({ left: 6, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis,
        valAxis_outer]);

    this.title.stub('layoutOptions').returns({
        horizontalAlignment: 'center',
        verticalAlignment: 'top'
    });

    this.title.stub('measure').returns([100, 50]);

    this.legend.stub('layoutOptions').returns({
        horizontalAlignment: 'right',
        verticalAlignment: 'top',
        side: 'horizontal'
    });

    this.legend.stub('measure').returns([50, 50]);

    new dxChart(this.container, {
        size: { width: 220, height: 110 },
        adaptiveLayout: { width: 220 - 55, height: 110 - 55 },
        valueAxis: [
            { name: 'valAxis_outer' }
        ],
        series: [
            { axis: 'valAxis_outer' }
        ],
        title: 'text',
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    // valAxis_outer
    assert.deepEqual(this.axisStub.getCall(1).returnValue.hideTitle.callCount, 1);

    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.hideTitle.callCount, 1);

    assert.ok(this.title.freeSpace.called);
    assert.ok(this.legend.freeSpace.called);
});

QUnit.test('Stretch chart by pane size', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis_outer = createAxisStubs();

    argAxis.getMargins.onCall(0).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.onCall(1).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.onCall(2).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.onCall(3).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.onCall(4).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.returns({ left: 0, top: 0, right: 0, bottom: 11 });

    valAxis_outer.getMargins.onCall(0).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(1).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(2).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(3).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(4).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.returns({ left: 6, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis,
        valAxis_outer]);

    this.title.stub('layoutOptions').returns({
        horizontalAlignment: 'center',
        verticalAlignment: 'top'
    });

    this.title.stub('measure').returns([100, 50]);

    this.legend.stub('layoutOptions').returns({
        horizontalAlignment: 'center',
        verticalAlignment: 'top',
        side: 'vertical'
    });

    this.legend.stub('measure').returns([50, 50]);
    this.container.height('');

    new dxChart(this.container, {
        panes: [{ name: 'p1', height: 600 }],
        valueAxis: [
            { name: 'valAxis_outer' }
        ],
        series: [
            { axis: 'valAxis_outer', pane: 'p1' }
        ],
        title: 'text',
        dataSource: [{ arg: 1, val: 10 }]
    });

    // assert
    // valAxis_outer
    assert.deepEqual(this.axisStub.getCall(1).returnValue.hideTitle.callCount, 0);

    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.hideTitle.callCount, 0);

    assert.notOk(this.title.freeSpace.called);
    assert.notOk(this.legend.freeSpace.called);
});

QUnit.test('Hide legend and title by pane size', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis_outer = createAxisStubs();

    argAxis.getMargins.onCall(0).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.onCall(1).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.onCall(2).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.onCall(3).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.onCall(4).returns({ left: 0, top: 0, right: 0, bottom: 60 });
    argAxis.getMargins.returns({ left: 0, top: 0, right: 0, bottom: 11 });

    valAxis_outer.getMargins.onCall(0).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(1).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(2).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(3).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.onCall(4).returns({ left: 60, top: 0, right: 0, bottom: 0 });
    valAxis_outer.getMargins.returns({ left: 6, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis,
        valAxis_outer]);

    this.title.stub('layoutOptions').returns({
        horizontalAlignment: 'center',
        verticalAlignment: 'top'
    });

    this.title.stub('measure').returns([100, 50]);

    this.legend.stub('layoutOptions').returns({
        horizontalAlignment: 'center',
        verticalAlignment: 'top',
        side: 'vertical'
    });

    this.legend.stub('measure').returns([50, 50]);

    new dxChart(this.container, {
        size: { width: 220, height: 110 },
        panes: [{ name: 'p1', height: 100 }],
        valueAxis: [
            { name: 'valAxis_outer' }
        ],
        series: [
            { axis: 'valAxis_outer', pane: 'p1' }
        ],
        title: 'text',
        dataSource: [{ arg: 1, val: 10 }]
    });

    // assert
    // valAxis_outer
    assert.deepEqual(this.axisStub.getCall(1).returnValue.hideTitle.callCount, 0);

    // argAxis
    assert.deepEqual(this.axisStub.getCall(0).returnValue.hideTitle.callCount, 1);

    assert.ok(this.title.freeSpace.called);
    assert.ok(this.legend.freeSpace.called);
});

QUnit.module('Animation', environment);

QUnit.test('Pass animate true flag to the updateSize method', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs();

    this.setupAxes([argAxis, valAxis]);

    new dxChart(this.container, {
        series: {},
        dataSource: [{ arg: 1, val: 10 }]
    });

    // assert
    assert.deepEqual(argAxis.updateSize.lastCall.args[1], true);
    assert.deepEqual(valAxis.updateSize.lastCall.args[1], true);
});

QUnit.test('Pass animate false flag to the updateSize method if animation is disabled', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs();

    this.setupAxes([argAxis, valAxis]);

    new dxChart(this.container, {
        animation: {
            enabled: false
        },
        series: {},
        dataSource: [{ arg: 1, val: 10 }]
    });

    // assert
    assert.deepEqual(argAxis.updateSize.lastCall.args[1], false);
    assert.deepEqual(valAxis.updateSize.lastCall.args[1], false);
});

QUnit.test('Pass animate false flag to the updateSize method if points limit is exceeded', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs();

    this.setupAxes([argAxis, valAxis]);

    var dataSource = [];

    for(var i = 0; i < 12; i++) {
        dataSource.push({ arg: i, val: 1 });
    }

    new dxChart(this.container, {
        animation: {
            enabled: true,
            maxPointCountSupported: 10
        },
        series: [{}, {}],
        dataSource: dataSource
    });

    // assert
    assert.deepEqual(argAxis.updateSize.lastCall.args[1], false);
    assert.deepEqual(valAxis.updateSize.lastCall.args[1], false);
});

QUnit.test('Pass animate false flag to the updateSize method if points limit is not exceeded', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs();

    this.setupAxes([argAxis, valAxis]);

    var dataSource = [];

    for(var i = 0; i < 15; i++) {
        dataSource.push({ arg: i, val: 1 });
    }

    new dxChart(this.container, {
        animation: {
            enabled: true,
            maxPointCountSupported: 10
        },
        series: [{}, { valueField: 'val2' }],
        dataSource: dataSource
    });

    // assert
    assert.deepEqual(argAxis.updateSize.lastCall.args[1], true);
    assert.deepEqual(valAxis.updateSize.lastCall.args[1], true);
});

QUnit.test('Do not stop all current animations if no adaptive layout', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs();

    argAxis.getMargins.returns({ left: 0, top: 0, right: 0, bottom: 15 });
    valAxis.getMargins.returns({ left: 7, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis, valAxis]);

    new dxChart(this.container, {
        size: { width: 220, height: 110 },
        adaptiveLayout: { width: 50, height: 50 },
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    var valAxisStub = this.axisStub.getCall(1).returnValue;
    assert.equal(valAxisStub.updateSize.callCount, 1);

    assert.ok(this.renderer.stopAllAnimations.lastCall.calledBefore(valAxisStub.updateSize.lastCall));
});

QUnit.test('Stop all current animations on adaptive layout', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs();

    argAxis.getMargins.returns({ left: 0, top: 0, right: 0, bottom: 15 });
    valAxis.getMargins.returns({ left: 7, top: 0, right: 0, bottom: 0 });

    this.setupAxes([argAxis, valAxis]);

    new dxChart(this.container, {
        size: { width: 220, height: 110 },
        adaptiveLayout: { width: 50, height: 100 },
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    var valAxisStub = this.axisStub.getCall(1).returnValue;
    assert.equal(valAxisStub.updateSize.callCount, 4);

    assert.strictEqual(this.renderer.stopAllAnimations.callCount, 2);
    assert.strictEqual(this.renderer.stopAllAnimations.lastCall.args[0], true);
    assert.ok(this.renderer.stopAllAnimations.lastCall.calledBefore(valAxisStub.updateSize.lastCall));
    assert.strictEqual(valAxisStub.updateSize.getCall(1).args[1], false);
});

QUnit.module('Wrap axis title', environment);

QUnit.test('With a pane; Position is right', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs();


    valAxis.hasWrap = () => true;
    valAxis.getTitle = sinon.stub();
    valAxis.getTitle.onCall(0).returns({ bBox: { width: 10 } });
    valAxis.getTitle.onCall(1).returns({ bBox: { width: 24 } });

    this.setupAxes([argAxis, valAxis]);

    new dxChart(this.container, {
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false },
        valueAxis: {
            position: 'right'
        }
    });

    // assert
    const axis = this.axisStub.getCall(1).returnValue;

    assert.equal(axis.updateSizeArgs[0].right, 0);
    assert.equal(axis.updateSizeArgs[1].right, 14);
});

QUnit.test('With a pane', function(assert) {
    var argAxis = createAxisStubs(),
        valAxis = createAxisStubs();


    valAxis.hasWrap = () => true;
    valAxis.getTitle = sinon.stub();
    valAxis.getTitle.onCall(0).returns({ bBox: { width: 10 } });
    valAxis.getTitle.onCall(1).returns({ bBox: { width: 24 } });

    this.setupAxes([argAxis, valAxis]);

    new dxChart(this.container, {
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: false }
    });

    // assert
    const axis = this.axisStub.getCall(1).returnValue;
    assert.equal(axis.updateSize.callCount, 2);

    assert.equal(axis.updateSizeArgs[0].left, 0);
    assert.equal(axis.updateSizeArgs[1].left, 14);

    assert.equal(axis.updateSize.lastCall.args[1], false);
    assert.equal(axis.updateSize.lastCall.args[2], false);

    assert.equal(axis.getTitle.callCount, 3);
});

QUnit.test('With two panes', function(assert) {
    var argAxis1 = createAxisStubs(),
        argAxis2 = createAxisStubs(),
        valAxis1 = createAxisStubs(),
        valAxis2 = createAxisStubs();


    valAxis1.hasWrap = valAxis2.hasWrap = () => true;
    valAxis1.getTitle = sinon.stub();
    valAxis2.getTitle = sinon.stub();

    valAxis1.getTitle.onCall(0).returns({ bBox: { width: 10 } });
    valAxis1.getTitle.onCall(1).returns({ bBox: { width: 24 } });

    valAxis2.getTitle.onCall(0).returns({ bBox: { width: 16 } });
    valAxis2.getTitle.onCall(1).returns({ bBox: { width: 32 } });
    valAxis2.getTitle.onCall(2).returns({ bBox: { width: 44 } });

    this.setupAxes([argAxis1, argAxis2, valAxis1, valAxis2]);

    new dxChart(this.container, {
        panes: [{ name: 'pane1' }, { name: 'pane2' }],
        valueAxis: [{ name: 'axis1' }, { name: 'axis2' }],
        series: [{ axis: 'axis1', pane: 'pane1' }, { axis: 'axis2', pane: 'pane2' }],
        dataSource: [{ arg: 1, val: 10 }],
        legend: { visible: true }
    });

    // assert
    const axis = this.axisStub.getCall(1).returnValue;
    assert.equal(axis.updateSize.callCount, 3);

    assert.equal(axis.updateSizeArgs[0].left, 0);
    assert.equal(axis.updateSizeArgs[1].left, 14);
    assert.equal(axis.updateSizeArgs[2].left, 26);

    assert.equal(axis.updateSize.lastCall.args[1], false);
    assert.equal(axis.updateSize.lastCall.args[2], false);
});
