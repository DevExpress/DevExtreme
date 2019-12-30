import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import pointModule from 'viz/series/points/base_point';
import labelModule from 'viz/series/points/label';
import SeriesModule from 'viz/series/base_series';
const Series = SeriesModule.Series;

const defaultStyle = {
    normal: {
        r: 6
    }
};
const series = sinon.createStubInstance(Series);
const label = sinon.createStubInstance(labelModule.Label);
const environment = {
    beforeEach: function() {
        const that = this;

        this.valTranslator = { translate: sinon.stub(), getBusinessRange: sinon.stub() };
        this.argTranslator = { translate: sinon.stub() };

        this.valTranslator.translate.returns(10)
            .withArgs(0).returns(6)
            .withArgs(1).returns(8)
            .withArgs(2).returns(10)
            .withArgs(3).returns(12)
            .withArgs(4).returns(14)
            .withArgs('canvas_position_default').returns(2)
            .withArgs('canvas_position_top').returns(0)
            .withArgs('canvas_position_end').returns(150);

        this.argTranslator.translate.returns(90)
            .withArgs(1).returns(5)
            .withArgs(10).returns(-60)
            .withArgs('canvas_position_start').returns(0);

        this.valTranslator.getBusinessRange.returns({ minVisible: 0 });

        series.getLabelVisibility.returns(true);
        series.getOptions = function() { return { containerBackgroundColor: 'ffffff' }; };
        series._visibleArea = { minX: 50, minY: 102, maxX: 150, maxY: 235 };
        series.getVisibleArea = function() { return series._visibleArea; };

        this.angles = [30, 30 + 360];
        series.getValueAxis.returns({
            getTranslator: function() {
                return that.valTranslator;
            },
            getCenter: function() { return { x: 100, y: 200 }; },
            getCanvas: function() { return { top: 2, bottom: 15, left: 0, right: 10, width: 160, height: 150 }; },
            getAngles: function() { return that.angles; }
        });
        series.getArgumentAxis.returns({
            getTranslator: function() {
                return that.argTranslator;
            }
        });
        series._argumentChecker.returns(true);
        series._valueChecker.returns(true);

        this.createLabel = sinon.stub(labelModule, 'Label', function() {
            label.getBoundingRect.returns({ x: 1, y: 2, width: 20, height: 10 });
            label.getLayoutOptions.returns({ alignment: 'center', radialOffset: 0 });
            resetStub(label);
            return label;
        });

        this.data = { argument: 1, value: 2 };
        this.renderer = new vizMocks.Renderer();
    },
    afterEach: function() {
        this.createLabel.restore();
    }
};

function resetStub(stub) {
    $.each(stub, function(_, stubFunc) {
        stubFunc && stubFunc.reset && stubFunc.reset();
    });
}

function createPolarPoint(data, options) {
    options.widgetType = 'polar';
    return new pointModule.Point(series, data, options);
}

function createSimplePoint(data, options) {
    return createPolarPoint(data, $.extend({
        styles: defaultStyle,
        type: 'line',
        label: {},
        visible: true,
        symbol: 'circle'
    }, options));
}

function createTranslatedPoint(options, offset) {
    const point = createSimplePoint(this.data, options);
    point.correctCoordinates({ offset: offset || 0, width: 10 });
    point.translate();
    return point;
}

function createAndDrawPoint(options, animation) {
    const point = createTranslatedPoint.call(this, options);
    point.draw(this.renderer, {
        markers: this.renderer.g(),
        labels: this.renderer.g(),
        errorBars: this.renderer.g()
    }, animation);
    return point;
}

function createLabel(options, layoutOptions) {
    const point = createTranslatedPoint.call(this, options);
    layoutOptions && (point._label.getLayoutOptions.returns(layoutOptions));
    point.correctLabelPosition(point._label);
    return point._label;
}

QUnit.module('translate', environment);

QUnit.test('create polar point', function(assert) {
    const point = createSimplePoint(this.data);
    assert.ok(point, 'point created');
});

QUnit.test('translate point coords', function(assert) {
    const point = createTranslatedPoint.call(this);

    assert.equal(point.radius, 10);
    assert.equal(point.middleAngle, -(5 + 30 - 90));
    assert.equal(point.angle, -(5 + 30 - 90));

    assert.equal(point.x, 106);
    assert.equal(point.y, 192);
    assert.equal(point.defaultX, 100);
    assert.equal(point.defaultY, 200);
    assert.equal(point.centerX, 100);
    assert.equal(point.centerY, 200);
});

QUnit.test('render point with correct position', function(assert) {
    const point = createAndDrawPoint.call(this);

    assert.equal(this.renderer.circle.callCount, 1);
    assert.deepEqual(point.getBoundingRect().x, 100);
    assert.deepEqual(point.getBoundingRect().y, 186);
});

QUnit.test('Draw point with errorBar', function(assert) {
    this.data = { argument: 1, value: 1, lowError: 3, highError: 4 };
    createAndDrawPoint.call(this, {
        errorBars: {
            color: 'red',
            lineWidth: 3,
            edgeLength: 8,
            opacity: 1
        }
    });

    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[96, 186, 104, 186], [100, 186, 100, 188], [104, 188, 96, 188]]);
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.lastCall.args[0], {
        visibility: 'visible',
        rotate: 35,
        rotateX: 100,
        rotateY: 200
    });
});

QUnit.test('Draw errorBar with relative edgeLength', function(assert) {
    this.data = { argument: 1, value: 1, lowError: 3, highError: 4 };
    createAndDrawPoint.call(this, {
        type: 'bar',
        errorBars: {
            color: 'red',
            lineWidth: 3,
            edgeLength: 0.8,
            opacity: 1
        }
    });

    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[100, 186, 100, 186], [100, 186, 100, 188], [100, 188, 100, 188]]);
});

QUnit.test('Draw error bar - show highError', function(assert) {
    this.data = { argument: 1, value: 1, lowError: 3, highError: 4 };
    createAndDrawPoint.call(this, {
        type: 'bar',
        errorBars: {
            displayMode: 'high',
            color: 'red',
            lineWidth: 3,
            edgeLength: 8
        }
    });

    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[96, 186, 104, 186], [100, 186, 100, 192]]);
});

QUnit.test('Draw error bar - show highError with type is \'stdDeviation\'', function(assert) {
    this.data = { argument: 1, value: 1, lowError: 3, highError: 4 };
    createAndDrawPoint.call(this, {
        errorBars: {
            displayMode: 'high',
            type: 'stdDeviation',
            color: 'red',
            lineWidth: 3,
            edgeLength: 8
        }
    });

    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[96, 186, 104, 186], [100, 186, 100, 187]]);
});

QUnit.test('animation from start point', function(assert) {
    this.valTranslator.translate.withArgs('canvas_position_default').returns(0);
    const point = createAndDrawPoint.call(this, {}, true);

    assert.equal(point.graphic._stored_settings.translateX, 100);
    assert.equal(point.graphic._stored_settings.translateY, 200);
});

QUnit.test('without animation from center', function(assert) {
    const point = createAndDrawPoint.call(this, {}, false);

    assert.equal(point.graphic._stored_settings.translateX, 106);
    assert.equal(point.graphic._stored_settings.translateY, 192);
});

QUnit.test('getDefaultCoords', function(assert) {
    this.valTranslator.translate.withArgs('canvas_position_default').returns(0);
    const point = createTranslatedPoint.call(this);

    assert.deepEqual(point.getDefaultCoords(), { x: 100, y: 200 });
});

QUnit.test('draw label', function(assert) {
    const label = createLabel.call(this);

    assert.ok(label.shift.called);
    assert.equal(label.shift.args[0][0], 123);
    assert.equal(label.shift.args[0][1], 162);
});

QUnit.test('Set vx and vy for tracker values like angle and radius', function(assert) {
    const point = createTranslatedPoint.call(this);

    assert.equal(point.angle, 55, 'set angle');
    assert.equal(point.radius, 10, 'set radius');
    assert.equal(point.vx, 305, 'set angle');
    assert.equal(point.vy, 10, 'set radius');
    assert.equal(point.radiusOuter, 10, 'set radius');
});

QUnit.test('normalize angle for vx', function(assert) {
    this.data = { argument: 10, value: 1 };
    const point = createTranslatedPoint.call(this);

    assert.equal(point.vx, 240, 'set angle');
    assert.equal(point.vy, 8, 'set radius');
    assert.equal(point.middleAngle, 120, 'set angle');
});

QUnit.test('getCoords', function(assert) {
    this.valTranslator.translate.withArgs('canvas_position_default').returns(0);
    const point = createTranslatedPoint.call(this);

    assert.deepEqual(point.getCoords(), { x: 106, y: 192 });
    assert.deepEqual(point.getCoords(true), { x: 100, y: 200 });
});

QUnit.test('draw label, position inside', function(assert) {
    const l = createLabel.call(this, null, { alignment: 'center', radialOffset: 0, position: 'inside' });

    assert.ok(l.shift.called);
    assert.equal(l.shift.args[0][0], 123);
    assert.equal(l.shift.args[0][1], 162);
});

QUnit.test('translate, value out of visible area (less then minVisible)', function(assert) {
    this.valTranslator.translate.withArgs(2).returns(-50);
    const point = createAndDrawPoint.call(this);

    assert.strictEqual(point.radius, null);
    assert.notOk(point.inVisibleArea);
});

QUnit.test('translate, value out of visible area (over then maxVisible)', function(assert) {
    this.valTranslator.translate.withArgs(2).returns(200);
    const point = createAndDrawPoint.call(this);

    assert.notOk(point.inVisibleArea);
});

QUnit.module('Bar point', environment);

QUnit.test('translate point coords', function(assert) {
    const point = createTranslatedPoint.call(this, { type: 'bar' });

    assert.equal(point.radius, 10);
    assert.equal(point.x, 106);
    assert.equal(point.y, 192);
    assert.equal(point.defaultX, 100);
    assert.equal(point.defaultY, 200);
    assert.equal(point.centerX, 100);
    assert.equal(point.centerY, 200);

    assert.equal(point.radiusOuter, 10);
    assert.equal(point.radiusInner, 2);
    assert.equal(point.middleAngle, -305);
});

QUnit.test('normalize zero angle with positive offset', function(assert) {
    const point = createTranslatedPoint.call(this, { type: 'bar' }, 10);

    assert.equal(point.middleAngle, -315, 'set middle angle');
    assert.equal(point.angle, -315, 'set angle');
});

QUnit.test('normalize zero angle with negative offset', function(assert) {
    const point = createTranslatedPoint.call(this, { type: 'bar' }, -10);

    assert.equal(point.middleAngle, -295, 'set middle angle');
    assert.equal(point.angle, -295, 'set angle');
});

QUnit.test('correct render point', function(assert) {
    const point = createAndDrawPoint.call(this, { type: 'bar' });

    assert.equal(this.renderer.arc.callCount, 1);
    assert.equal(this.renderer.arc.getCall(0).args[0], 100, 'x position');
    assert.equal(this.renderer.arc.getCall(0).args[1], 200, 'y position');
    assert.equal(this.renderer.arc.getCall(0).args[2], 2, 'inner radius');
    assert.equal(this.renderer.arc.getCall(0).args[3], 10, 'outer radius');
    assert.equal(this.renderer.arc.getCall(0).args[4], -305 - 10 * 0.5, 'to angle');
    assert.equal(this.renderer.arc.getCall(0).args[5], -305 + 10 * 0.5, 'from angle');
    assert.deepEqual(this.renderer.arc.getCall(0).returnValue.attr.firstCall.args[0], defaultStyle.normal, 'pass default style');
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('update marker after redraw', function(assert) {
    const point = createAndDrawPoint.call(this, { type: 'bar' });

    point.translate();
    point.draw(this.renderer, {
        markers: this.renderer.g(),
        labels: this.renderer.g()
    });

    assert.equal(point.graphic._stored_settings.x, 100, 'x position');
    assert.equal(point.graphic._stored_settings.y, 200, 'y position');
    assert.equal(point.graphic._stored_settings.outerRadius, 10, 'outer radius');
    assert.equal(point.graphic._stored_settings.innerRadius, 2, 'inner radius');
    assert.equal(point.graphic._stored_settings.startAngle, -305 - 10 * 0.5, 'to angle');
    assert.equal(point.graphic._stored_settings.endAngle, -305 + 10 * 0.5, 'from angle');
});

QUnit.test('draw bar point with animation', function(assert) {
    const point = createAndDrawPoint.call(this, { type: 'bar' }, true);

    assert.equal(point.graphic._stored_settings.x, 101, 'x position');
    assert.equal(point.graphic._stored_settings.y, 198, 'y position');
    assert.equal(point.graphic._stored_settings.outerRadius, 0, 'outer radius');
    assert.equal(point.graphic._stored_settings.innerRadius, 0, 'inner radius');
    assert.equal(point.graphic._stored_settings.startAngle, -310, 'to angle');
    assert.equal(point.graphic._stored_settings.endAngle, -300, 'from angle');
});

QUnit.test('get marker coords', function(assert) {
    const point = createAndDrawPoint.call(this, { type: 'bar' });

    assert.deepEqual(point.getMarkerCoords(), {
        x: 100,
        y: 200,
        startAngle: -305 - 10 * 0.5,
        endAngle: -305 + 10 * 0.5,
        innerRadius: 2,
        outerRadius: 10
    });
});

QUnit.test('T173587. translate, negative value', function(assert) {
    this.data = { argument: 1, value: -2 };
    this.valTranslator.translate.withArgs('canvas_position_default').returns(100);
    this.valTranslator.translate.withArgs(-2).returns(50);
    const point = createAndDrawPoint.call(this, { type: 'bar' });

    assert.deepEqual(point.getMarkerCoords(), {
        x: 100,
        y: 200,
        startAngle: -310,
        endAngle: -300,
        innerRadius: 50,
        outerRadius: 100
    });
    assert.ok(point.inVisibleArea);
});

QUnit.test('translate, value out of visible area', function(assert) {
    this.valTranslator.translate.withArgs(2).returns(-50);
    this.valTranslator.translate.withArgs('canvas_position_default').returns(0);
    const point = createAndDrawPoint.call(this, { type: 'bar' });

    assert.deepEqual(point.getMarkerCoords(), {
        x: 100,
        y: 200,
        startAngle: -310,
        endAngle: -300,
        innerRadius: 0,
        outerRadius: 150
    });
    assert.notOk(point.inVisibleArea);
});

QUnit.test('translate negative value, value out of visible area', function(assert) {
    this.data = { argument: 1, value: -2 };
    this.valTranslator.translate.withArgs('canvas_position_default').returns(100);
    this.valTranslator.translate.withArgs(-2).returns(-50);
    this.valTranslator.getBusinessRange.returns({ minVisible: -1 });
    const point = createAndDrawPoint.call(this, { type: 'bar' });

    assert.deepEqual(point.getMarkerCoords(), {
        x: 100,
        y: 200,
        startAngle: -310,
        endAngle: -300,
        innerRadius: 0,
        outerRadius: 100
    });
    assert.ok(point.inVisibleArea);
});

QUnit.test('translate, both values out of visible area', function(assert) {
    this.valTranslator.translate.withArgs('canvas_position_default').returns(null);
    this.valTranslator.translate.withArgs(2).returns(null);
    const point = createAndDrawPoint.call(this, { type: 'bar' });

    assert.deepEqual(point.getMarkerCoords(), {
        x: 100,
        y: 200,
        startAngle: -310,
        endAngle: -300,
        innerRadius: 150,
        outerRadius: 150
    });
    assert.notOk(point.inVisibleArea);
});

QUnit.test('translate negative value, value on edge of visible area', function(assert) {
    this.data = { argument: 1, value: -2 };
    this.valTranslator.translate.withArgs('canvas_position_default').returns(100);
    this.valTranslator.translate.withArgs(-2).returns(0);
    const point = createAndDrawPoint.call(this, { type: 'bar' });

    assert.deepEqual(point.getMarkerCoords(), {
        x: 100,
        y: 200,
        startAngle: -310,
        endAngle: -300,
        innerRadius: 0,
        outerRadius: 100
    });
    assert.ok(point.inVisibleArea);
});

QUnit.test('draw label', function(assert) {
    const label = createLabel.call(this, { type: 'bar' });

    assert.ok(label.shift.called);
    assert.equal(label.shift.args[0][0], 123);
    assert.equal(label.shift.args[0][1], 162);
});

QUnit.test('Draw point with errorBar', function(assert) {
    this.data = { argument: 1, value: 1, lowError: 3, highError: 4 };
    createAndDrawPoint.call(this, {
        type: 'bar',
        errorBars: {
            color: 'red',
            lineWidth: 3,
            edgeLength: 8,
            opacity: 1
        }
    });

    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[96, 186, 104, 186], [100, 186, 100, 188], [104, 188, 96, 188]]);
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.lastCall.args[0], {
        visibility: 'visible',
        rotate: 395,
        rotateX: 100,
        rotateY: 200
    });
});

QUnit.test('Draw point with errorBar when animation enabled', function(assert) {
    this.data = { argument: 1, value: 1, lowError: 3, highError: 4 };
    createAndDrawPoint.call(this, {
        type: 'bar',
        errorBars: {
            color: 'red',
            lineWidth: 3,
            edgeLength: 8,
            opacity: 1
        }
    }, true);

    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[96, 186, 104, 186], [100, 186, 100, 188], [104, 188, 96, 188]]);
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.lastCall.args[0], {
        visibility: 'visible',
        rotate: 395,
        rotateX: 100,
        rotateY: 200
    });
});

QUnit.test('draw label, position inside', function(assert) {
    label.getLayoutOptions.returns({ alignment: 'center', radialOffset: 0, position: 'inside' });
    const l = createLabel.call(this, { type: 'bar' }, { alignment: 'center', radialOffset: 0, position: 'inside' });

    assert.ok(l.shift.called);
    assert.equal(l.shift.args[0][0], 93);
    assert.equal(l.shift.args[0][1], 190);
});

QUnit.test('draw connector', function(assert) {
    const label = createLabel.call(this, { type: 'bar', styles: { normal: { 'stroke-width': 4, stroke: 'ffffff' } } });

    assert.ok(label.setFigureToDrawConnector.called);

    assert.equal(label.setFigureToDrawConnector.args[0][0].x, 105);
    assert.equal(label.setFigureToDrawConnector.args[0][0].y, 193);
});

QUnit.test('coordsIn', function(assert) {
    const point = createAndDrawPoint.call(this, { type: 'bar', styles: { normal: { 'stroke-width': 4, stroke: 'ffffff' } } });
    assert.ok(point.coordsIn(104, 194));
});

QUnit.test('not in coordsIn', function(assert) {
    const point = createAndDrawPoint.call(this, { type: 'bar', styles: { normal: { 'stroke-width': 4, stroke: 'ffffff' } } });
    assert.ok(!point.coordsIn(105, 105));
});

QUnit.test('not in coordsIn, radius more than point', function(assert) {
    const point = createAndDrawPoint.call(this, { type: 'bar', styles: { normal: { 'stroke-width': 4, stroke: 'ffffff' } } });
    assert.ok(!point.coordsIn(109, 189));
});

QUnit.module('check label position', environment);

QUnit.test('line, point in visible area', function(assert) {
    const point = createTranslatedPoint.call(this);
    const coord = point._checkLabelPosition({ getBoundingRect: function() { return { width: 20, height: 10 }; } }, { x: -1, y: 2 });

    assert.deepEqual(coord, { x: 50, y: 102 });
});

QUnit.test('line, point is not in visible area', function(assert) {
    series._visibleArea = { minY: 20, maxY: 135, minX: 30, maxX: 150 };
    const point = createTranslatedPoint.call(this);
    const coord = point._checkLabelPosition({}, { x: -1, y: 2 });

    assert.deepEqual(coord, { x: -1, y: 2 });
});

QUnit.test('bar', function(assert) {
    const point = createTranslatedPoint.call(this, { type: 'bar' });
    const coord = point._checkLabelPosition({ getBoundingRect: function() { return { width: 20, height: 10 }; } }, { x: -1, y: 2 });

    assert.deepEqual(coord, { x: 50, y: 102 });
});

QUnit.test('bar, point is not in visible area', function(assert) {
    series._visibleArea = { minY: 20, maxY: 35, minX: 30, maxX: 30 };
    const point = createTranslatedPoint.call(this, { type: 'bar' });
    const coord = point._checkLabelPosition({ getBoundingRect: function() { return { width: 20, height: 10 }; } }, { x: -1, y: 2 });

    assert.deepEqual(coord, { x: -1, y: 2 });
});

QUnit.test('getTooltipParam', function(assert) {
    this.angles = [90, 90 + 360];
    this.argTranslator.translate.withArgs(1).returns(90);
    const point = createTranslatedPoint.call(this, { type: 'bar' });

    assert.deepEqual(point.getTooltipParams(), {
        offset: 0,
        x: 100,
        y: 206
    });
});
