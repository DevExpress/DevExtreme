import * as vizMocks from '../../helpers/vizMocks.js';
import { noop } from 'core/utils/common';
import pointModule from 'viz/series/points/base_point';
import labelModule from 'viz/series/points/label';
import { MockAngularTranslator } from '../../helpers/chartMocks.js';
import { states as statesConsts } from 'viz/components/consts';
import tooltipModule from 'viz/core/tooltip';

const originalLabel = labelModule.Label;

var defaultCorrection = {
    radiusInner: 0,
    radiusOuter: 120,
    radiusLabels: 120,
    centerX: 300,
    centerY: 150
};

var createPoint = function(series, data, options) {
    var point;
    options = options || {};
    options.type = options.type || 'pie';
    point = new pointModule.Point(series, data, options);
    point.correctPosition(defaultCorrection);
    return point;
};

function createLabelWithConnector() {
    this.series._visibleArea = { minX: 0, maxX: 600, minY: 0, maxY: 600 };
    var point = createPoint(this.series, this.data, this.options),
        label = point._label;

    point.translate();
    point.correctLabelPosition(label);

    return label;
}

function environmentWithStubLabels() {
    var that = this;
    this.renderer = new vizMocks.Renderer();
    this.group = this.renderer.g();
    this.translateData = { 0: 300, 10: 270, 20: 240 };
    this.angleTranslator = new MockAngularTranslator({
        translate: this.translateData
    });
    this.data = {
        value: 20,
        minValue: 0
    },
    this.options = {
        widgetType: 'pie',
        styles: {
            normal: {
                'stroke-width': 0
            }
        },
        label: {
            position: 'columns',
            visible: true,
            radialOffset: 0,
            background: {},
            connector: {
                'stroke-width': 1
            },
            connectorOffset: 0
        }
    };
    this.series = {
        _visibleArea: { minX: 0, maxX: 600, minY: 0, maxY: 600 },
        getVisibleArea: function() { return this._visibleArea; },
        name: 'series1',
        areLabelsVisible: function() {
            return true;
        },
        getOptions: function() {
            return this._options;
        },
        _options: {
            containerBackgroundColor: '#ffffff'
        },
        getLabelVisibility: function() { return true; },
        getValueAxis: function() { return { getTranslator: function() { return that.angleTranslator; } }; }
    };
    this.stubLabel = function(point, labelBBox) {
        point._label = sinon.createStubInstance(labelModule.Label);
        point._label.getLayoutOptions.returns(this.options.label);
        point._label.getBoundingRect.returns(labelBBox || { height: 10, width: 20, x: 10, y: 15 });
        point._label.fit.returns(true);
    };
}

function createPointWithStubLabelForDraw(translateData, isFirstDrawn) {
    var point = createPointWithStubLabel.call(this, translateData);
    if(isFirstDrawn) {
        point.drawLabel(undefined);
    } else {
        point._drawLabel();
    }
    return point;
}

function createCorrectionLabel(translateData, firstDrawing) {
    var point = createPointWithStubLabel.call(this, translateData);
    point._isLabelDrawingWithoutPoints = firstDrawing;
    point.correctLabelPosition(point._label);
    return point._label;
}

function createPointWithStubLabel(translateData, labelBBox) {
    this.translateData = translateData;
    this.angleTranslator = new MockAngularTranslator({
        translate: this.translateData
    });
    var point = createPoint(this.series, this.data, this.options);
    this.stubLabel(point, labelBBox);

    point.translate();
    return point;
}

function environment() {
    var that = this;
    this.series = {
        name: 'series1',
        getOptions: function() {
            return this._options;
        },
        _options: {},
        getLabelVisibility: function() { return false; },
        hidePointTooltip: noop,
        getValueAxis: function() { return { getTranslator: function() { return that.angleTranslator; } }; }
    };
    this.opt = {
        widgetType: 'pie',
        label: { visible: false },
        visibilityChanged: noop,
        styles: {
            normal: {
                fill: 'normalColor'
            },
            hover: {},
            selection: {},
            legendStyles: {
                isLegendStyles: true
            }
        }
    };
    this.translateData = { 0: 100, 5: 150, 10: 200 };

    this.angleTranslator = new MockAngularTranslator({
        translate: this.translateData
    });
}

QUnit.module('Creation. Pie', {
    beforeEach: environment
});

QUnit.test('point color/legendStyles', function(assert) {
    var point = createPoint(this.series, { argument: 'cat2', value: 10, minValue: 0 }, this.opt);

    assert.deepEqual(point.getLegendStyles(), this.opt.styles.legendStyles);
    assert.strictEqual(point.getColor(), 'normalColor');
});

QUnit.test('Creation with index', function(assert) {
    var point = createPoint(this.series, { argument: 'cat2', value: 10, minValue: 0, index: 'index' }, this.opt);

    assert.strictEqual(point.index, 'index');
});

QUnit.module('Point coordinates translation. Pie', {
    beforeEach: environment
});

QUnit.test('Angles translation, shiftedAngle is zero', function(assert) {
    var point = createPoint(this.series, { argument: 'cat2', value: 10, minValue: 0 }, this.opt);

    point.shiftedAngle = 0;
    point.translate();

    assert.equal(point.fromAngle, this.translateData[0]);
    assert.equal(point.toAngle, this.translateData[10]);
    assert.equal(point.middleAngle, this.translateData[5]);
});

QUnit.test('Angles translation, shiftedAngle is not zero', function(assert) {
    var point = createPoint(this.series, { argument: 'cat2', value: 10, minValue: 0 }, this.opt);

    point.shiftedAngle = 30;
    point.translate();

    assert.equal(point.fromAngle, this.translateData[0] + 30);
    assert.equal(point.toAngle, this.translateData[10] + 30);
    assert.equal(point.middleAngle, this.translateData[5] + 30);
});

QUnit.test('translate when point is invisible', function(assert) {
    var point = createPoint(this.series, { argument: 'cat2', value: 10, minValue: 0 }, this.opt);

    point.hide();
    point.shiftedAngle = 30;
    point.translate();

    assert.equal(point.fromAngle, this.translateData[0] + 30);
    assert.equal(point.toAngle, point.fromAngle);
    assert.equal(point.middleAngle, point.fromAngle);
});

QUnit.module('Values correction', {
    beforeEach: function() {
        this.point = createPoint({
            name: 'series1',
            _options: {},
            getLabelVisibility: function() { return false; }
        }, { value: 10, argument: 5 }, {
            widgetType: 'pie',
            styles: {
                normal: {}
            },
            label: { visible: false }
        });
        this.point.normalInitialValue = 10 / 20;
    }
});

QUnit.test('Positive correction', function(assert) {
    var correction = 10 / 20;
    this.point.correctValue(correction);

    assert.strictEqual(this.point.value, 1);
    assert.strictEqual(this.point.initialValue, 10);
    assert.strictEqual(this.point.minValue, 0.5);
});

QUnit.test('Zero Correction', function(assert) {
    var correction = 0;
    this.point.correctValue(correction);

    assert.strictEqual(this.point.value, 0.5);
    assert.strictEqual(this.point.initialValue, 10);
    assert.strictEqual(this.point.minValue, 0);
});

QUnit.test('Correction with base', function(assert) {
    var correction = 10;
    this.point.correctValue(correction, undefined, 100);

    assert.strictEqual(this.point.value, 110);
    assert.strictEqual(this.point.initialValue, 10);
    assert.strictEqual(this.point.minValue, 10);
});

QUnit.test('Correction with percent', function(assert) {
    this.point._label.setDataField = sinon.spy();
    this.point.correctValue(undefined, 'percentValue');

    assert.ok(this.point._label.setDataField.calledOnce);
    assert.strictEqual(this.point._label.setDataField.lastCall.args[0], 'percent');
    assert.strictEqual(this.point._label.setDataField.lastCall.args[1], 'percentValue');
});


QUnit.module('Point radiuses correction', {
    beforeEach: function() {
        this.point = createPoint({
            name: 'series1',
            _options: {},
            getLabelVisibility: function() { return false; }
        }, { value: 10, argument: 5 }, {
            widgetType: 'pie',
            styles: {
                normal: {}
            },
            label: { visible: false }
        });
    }
});

QUnit.test('Zero inner radius', function(assert) {
    var correction = {
        radiusInner: 0,
        radiusOuter: 20,
        centerX: 30,
        centerY: 40,
    };

    this.point.correctPosition(correction);

    assert.equal(this.point.radiusInner, 0);
    assert.equal(this.point.radiusOuter, 20);
    assert.equal(this.point.centerX, 30);
    assert.equal(this.point.centerY, 40);
    assert.equal(this.point.radiusLabels, 50);
});

QUnit.test('Positive offset', function(assert) {
    var correction = {
        radiusInner: 10,
        radiusOuter: 20,
        centerX: 30,
        centerY: 40,
    };

    this.point.correctPosition(correction);

    assert.equal(this.point.radiusInner, 10);
    assert.equal(this.point.radiusOuter, 20);
    assert.equal(this.point.centerX, 30);
    assert.equal(this.point.centerY, 40);
    assert.equal(this.point.radiusLabels, 50);
});

QUnit.module('coordsIn API', {
    beforeEach: function() {
        var that = this;
        this.series = {
            name: 'series1',
            _options: {},
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return that.angleTranslator; } }; }
        };
        this.options = {
            widgetType: 'pie',
            styles: {
                normal: {}
            },
            label: { visible: false }
        };
    }
});

QUnit.test('fromAngle > to Angle', function(assert) {
    this.angleTranslator = new MockAngularTranslator({
        translate: { 0: 200, 5: 150, 10: 100 }
    });
    var point = createPoint(this.series, { value: 5, argument: 5, minValue: 0 }, this.options),
        correction = {
            radiusInner: 10,
            radiusOuter: 20,
            centerX: 30,
            centerY: 40
        };

    point.shiftedAngle = 0;
    point.translate();

    point.correctPosition(correction);

    assert.equal(point.radiusInner, 10);
    assert.equal(point.radiusOuter, 20);
    assert.equal(point.centerX, 30);
    assert.equal(point.centerY, 40);

    assert.equal(point.fromAngle, 200);
    assert.equal(point.toAngle, 150);

    assert.ok(!point.coordsIn(21, 40), 'out innerRadius');
    assert.ok(point.coordsIn(20, 40));

    assert.ok(!point.coordsIn(9, 40), 'out outerRadius');
    assert.ok(point.coordsIn(10, 40));

    var sinFrom = Math.sin(point.fromAngle * Math.PI / 180),
        sinTo = Math.sin(point.toAngle * Math.PI / 180),
        cosFrom = Math.cos(point.fromAngle * Math.PI / 180),
        cosTo = Math.cos(point.toAngle * Math.PI / 180),
        x1 = 15 * cosTo + 30,
        x2 = 15 * cosFrom + 30,
        yMin = -15 * sinFrom + 40,
        yMax = -15 * sinTo + 40;

    assert.ok(point.coordsIn(x1, yMax + 1));
    assert.ok(!point.coordsIn(x1, yMax - 1));
    assert.ok(point.coordsIn(x2, yMin - 1));
    assert.ok(!point.coordsIn(x2, yMin + 1));
});

QUnit.test('toAngle > fromAngle', function(assert) {
    this.angleTranslator = new MockAngularTranslator({
        translate: { 0: 380, 5: 340, 10: 100 }
    });
    var point = createPoint(this.series, { value: 5, argument: 5, minValue: 0 }, this.options),
        correction = {
            radiusInner: 10,
            radiusOuter: 20,
            centerX: 30,
            centerY: 40
        };

    point.shiftedAngle = 0;
    point.translate();

    point.correctPosition(correction);

    assert.equal(point.radiusInner, 10);
    assert.equal(point.radiusOuter, 20);
    assert.equal(point.centerX, 30);
    assert.equal(point.centerY, 40);

    assert.equal(point.fromAngle, 380);
    assert.equal(point.toAngle, 340);

    assert.ok(!point.coordsIn(39, 40), 'out innerRadius');
    assert.ok(point.coordsIn(40, 40));

    assert.ok(point.coordsIn(45, 40));

    assert.ok(!point.coordsIn(51, 40), 'out outerRadius');
    assert.ok(point.coordsIn(50, 40));


    var sinFrom = Math.sin(point.fromAngle * Math.PI / 180),
        sinTo = Math.sin(point.toAngle * Math.PI / 180),
        cosFrom = Math.cos(point.fromAngle * Math.PI / 180),
        cosTo = Math.cos(point.toAngle * Math.PI / 180),
        x1 = 15 * cosTo + 30,
        x2 = 15 * cosFrom + 30,
        yMin = 15 * sinFrom + 40,
        yMax = 15 * sinTo + 40;

    assert.ok(point.coordsIn(x1, yMax + 1));
    assert.ok(!point.coordsIn(x1, yMax - 1));

    assert.ok(point.coordsIn(x2, yMin - 1));
    assert.ok(!point.coordsIn(x2, yMin + 1));
});

QUnit.test('circle point', function(assert) {
    this.angleTranslator = new MockAngularTranslator({
        translate: { 0: 0, 5: 360 }
    });
    var point = createPoint(this.series, { value: 5, argument: 5, minValue: 0 }, this.options),
        correction = {
            radiusInner: 10,
            radiusOuter: 20,
            centerX: 30,
            centerY: 40
        };

    point.shiftedAngle = 0;
    point.translate();

    point.correctPosition(correction);

    assert.equal(point.radiusInner, 10);
    assert.equal(point.radiusOuter, 20);
    assert.equal(point.centerX, 30);
    assert.equal(point.centerY, 40);

    assert.equal(point.fromAngle, 0);
    assert.equal(point.toAngle, 360);

    assert.ok(!point.coordsIn(39, 40), 'out innerRadius');
    assert.ok(point.coordsIn(40, 40));
    assert.ok(point.coordsIn(50, 40));
    assert.ok(point.coordsIn(45, 40));

    assert.ok(point.coordsIn(10, 40));
    assert.ok(point.coordsIn(30, 20));
    assert.ok(point.coordsIn(50, 40));
    assert.ok(point.coordsIn(30, 60));

    assert.ok(!point.coordsIn(51, 40), 'out outerRadius');

});

QUnit.test('getMarkerVisibility', function(assert) {
    let point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    assert.strictEqual(point.getMarkerVisibility(), true);
});

QUnit.module('Draw Point', {
    beforeEach: function() {
        var that = this;
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.translateData = { 0: 300, 10: 270, 20: 240 };
        this.angleTranslator = new MockAngularTranslator({
            translate: this.translateData
        });
        this.series = {
            name: 'series1',
            areLabelsVisible: function() { return false; },
            getOptions: function() {
                return this._options;
            },
            _options: {},
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return that.angleTranslator; } }; },
            hidePointTooltip: noop
        };
        this.options = {
            widgetType: 'pie',
            styles: { normal: { style: 'normal' }, hover: { style: 'hover' }, selection: { style: 'selection' } },
            label: {
                visible: false
            },
            visible: true
        };
        this.groups = {
            markers: this.group
        };
    }
});

QUnit.test('Marker', function(assert) {
    var point = createPoint(this.series, { argument: '2', value: 1 }, this.options);

    point.centerX = 11;
    point.centerY = 22;
    point.radiusInner = 33;
    point.radiusOuter = 44;
    point.toAngle = 55;
    point.fromAngle = 66;

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('arc').callCount, 1);
    assert.deepEqual(this.renderer.stub('arc').firstCall.args, [11, 22, 33, 44, 55, 66]);
    assert.equal(point.graphic, this.renderer.stub('arc').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linejoin': 'round' });
    assert.deepEqual(point.graphic.stub('attr').secondCall.args[0], this.options.styles.normal);
    assert.equal(point.graphic.sharp.callCount, 1);
    assert.ok(point.graphic.sharp.firstCall.calledAfter(point.graphic.attr.lastCall), 1);
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Update marker', function(assert) {
    var point = createPoint(this.series, { argument: '2', value: 1 }, this.options);

    point.centerX = 11;
    point.centerY = 22;
    point.radiusInner = 33;
    point.radiusOuter = 44;
    point.toAngle = 55;
    point.fromAngle = 66;

    point.draw(this.renderer, this.groups);

    this.options.styles.normal.fill = 'red';
    point.updateOptions(this.options);

    point.centerX = 111;
    point.centerY = 222;
    point.radiusInner = 333;
    point.radiusOuter = 444;
    point.toAngle = 555;
    point.fromAngle = 666;

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('arc').callCount, 1);
    assert.deepEqual(this.renderer.stub('arc').firstCall.args, [11, 22, 33, 44, 55, 66]);
    assert.equal(point.graphic, this.renderer.stub('arc').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], {
        endAngle: 666,
        fill: 'red',
        innerRadius: 333,
        outerRadius: 444,
        startAngle: 555,
        style: 'normal',
        x: 111,
        y: 222
    });
    assert.equal(point.graphic.sharp.callCount, 2);
    assert.ok(point.graphic.sharp.lastCall.calledAfter(point.graphic.attr.lastCall), 1);
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Update marker when animation enabled', function(assert) {
    var point = createPoint(this.series, { argument: '2', value: 1 }, this.options);

    point.centerX = 11;
    point.centerY = 22;
    point.radiusInner = 33;
    point.radiusOuter = 44;
    point.toAngle = 55;
    point.fromAngle = 66;

    point.draw(this.renderer, this.groups);

    this.options.styles.normal.fill = 'red';
    point.updateOptions(this.options);

    point.centerX = 111;
    point.centerY = 222;
    point.radiusInner = 333;
    point.radiusOuter = 444;
    point.toAngle = 555;
    point.fromAngle = 666;

    point.draw(this.renderer, this.groups, true);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('arc').callCount, 1);
    assert.deepEqual(this.renderer.stub('arc').firstCall.args, [11, 22, 33, 44, 55, 66]);
    assert.equal(point.graphic, this.renderer.stub('arc').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], {
        fill: 'red',
        style: 'normal'
    });
    assert.equal(point.graphic.sharp.callCount, 2);
    assert.ok(point.graphic.sharp.lastCall.calledAfter(point.graphic.attr.lastCall), 1);
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group);
});

QUnit.test('Update marker location', function(assert) {
    var point = createPoint(this.series, { argument: '2', value: 1 }, this.options);

    point.centerX = 11;
    point.centerY = 22;
    point.radiusInner = 33;
    point.radiusOuter = 44;
    point.toAngle = 55;
    point.fromAngle = 66;

    point.draw(this.renderer, this.groups);

    point.centerX = 100;
    point.centerY = 200;
    point.radiusInner = 300;
    point.radiusOuter = 400;
    point.toAngle = 500;
    point.fromAngle = 600;

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('arc').callCount, 1);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], {
        endAngle: 600,
        innerRadius: 300,
        outerRadius: 400,
        startAngle: 500,
        x: 100,
        y: 200,
        style: 'normal'
    });
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group);
});

QUnit.test('Draw point without state', function(assert) {
    var point = createPoint(this.series, { argument: '4', value: 3 }, this.options);

    point.series = {
        areLabelsVisible: function() { return false; },
        getLabelVisibility: function() { return false; }
    };
    point.selectedState = false;
    point.series.setPointSelectedState = function(point) {
        point.selectedState = true;
    };
    point.hoveredState = false;
    point.series.setHoverState = function(point) {
        point.hoveredState = true;
    };
    point.state = undefined;
    point.draw(this.renderer, this.groups);

    assert.ok(!point.selectedState);
    assert.ok(!point.hoveredState);
    assert.strictEqual(point.fullState, statesConsts.normalMark);
});

QUnit.test('Animation. Draw point when animation enabled. First drawing', function(assert) {
    var point = createPoint(this.series, { argument: '4', value: 3 }, this.options);
    point.centerX = 11;
    point.centerY = 22;
    point.radiusInner = 33;
    point.radiusOuter = 44;
    point.toAngle = 55;
    point.fromAngle = 66;

    point.draw(this.renderer, this.groups, true, true);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('arc').callCount, 1);
    assert.deepEqual(this.renderer.stub('arc').firstCall.args, [11, 22, 0, 0, 55, 66]);
    assert.equal(point.graphic, this.renderer.stub('arc').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: 'normal' });
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group);
});

QUnit.test('Animation. Draw point when animation enabled. Second drawing', function(assert) {
    var point = createPoint(this.series, { argument: '4', value: 3 }, this.options);
    point.centerX = 11;
    point.centerY = 22;
    point.radiusInner = 33;
    point.radiusOuter = 44;
    point.toAngle = 55;
    point.fromAngle = 66;
    point.shiftedAngle = 0;

    point.draw(this.renderer, this.groups, true, false);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('arc').callCount, 1);
    assert.deepEqual(this.renderer.stub('arc').firstCall.args, [11, 22, 0, 0, 0, 0]);
    assert.equal(point.graphic, this.renderer.stub('arc').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: 'normal' });
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group);
});

QUnit.test('Animation. Draw point when animation enabled with startAngle. Second drawing', function(assert) {
    var point = createPoint(this.series, { argument: '4', value: 3 }, this.options);
    point.centerX = 11;
    point.centerY = 22;
    point.radiusInner = 33;
    point.radiusOuter = 44;
    point.toAngle = 55;
    point.fromAngle = 66;
    point.shiftedAngle = 100;

    point.draw(this.renderer, this.groups, true, false);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('arc').callCount, 1);
    assert.deepEqual(this.renderer.stub('arc').firstCall.args, [11, 22, 0, 0, 100, 100]);
    assert.equal(point.graphic, this.renderer.stub('arc').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('smartAttr').firstCall.args[0], { style: 'normal' });
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group);
});

QUnit.test('Animation. Animate point', function(assert) {
    var point = createPoint(this.series, { argument: '4', value: 3 }, this.options),
        complete = function() { };
    point.centerX = 11;
    point.centerY = 22;
    point.radiusInner = 33;
    point.radiusOuter = 44;
    point.toAngle = 55;
    point.fromAngle = 66;

    point.draw(this.renderer, this.groups, true);
    point.animate(complete, 100, 0.1);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('arc').callCount, 1);
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group);

    assert.deepEqual(point.graphic.stub('animate').lastCall.args[0], {
        endAngle: 66,
        innerRadius: 33,
        outerRadius: 44,
        startAngle: 55,
        x: 11,
        y: 22
    });
    assert.deepEqual(point.graphic.stub('animate').lastCall.args[1].partitionDuration, 100);
    assert.equal(point.graphic.stub('animate').lastCall.args[1].delay, 0.1);
    assert.equal(point.graphic.stub('animate').lastCall.args[2], complete);
});

QUnit.test('Hide marker when marker is visible', function(assert) {
    this.options.styles.normal.visibility = 'visible';
    var point = createPoint(this.series, { argument: '4', value: 3 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    var labelSpy = sinon.spy(point._label, 'draw');

    point.setInvisibility();

    assert.strictEqual(point.graphic._stored_settings.visibility, 'visible');
    assert.deepEqual(labelSpy.lastCall.args, [false]);
});

QUnit.test('Hide marker when marker has no visibility setting', function(assert) {
    var point = createPoint(this.series, { argument: '4', value: 3 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    var labelSpy = sinon.spy(point._label, 'draw');

    point.setInvisibility();

    assert.strictEqual(point.graphic._stored_settings.visibility, undefined);
    assert.deepEqual(labelSpy.lastCall.args, [false]);
});

QUnit.test('Draw point if option visible is false', function(assert) {
    this.options.visible = false;
    var point = createPoint(this.series, { argument: '4', value: 3 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
});

QUnit.test('Apply style', function(assert) {
    var point = createPoint(this.series, { argument: '4', value: 3 }, this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    point.fullState = 2;
    point.applyView();

    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: 'selection' });
});

QUnit.test('Apply style with legend callback', function(assert) {
    var point = createPoint(this.series, { argument: '4', value: 3 }, this.options),
        callback = sinon.stub();

    point.translate();
    point.draw(this.renderer, this.groups);

    point.fullState = 2;
    point.applyView(callback);

    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: 'selection' });
    assert.strictEqual(callback.callCount, 1);
});

QUnit.test('Apply view with legend callback', function(assert) {
    var point = createPoint(this.series, { argument: '4', value: 3 }, this.options),
        callback = sinon.stub();

    point.fullState = 2;
    point.draw(this.renderer, this.groups);

    point.applyView(callback);

    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: 'selection' });
    assert.strictEqual(callback.callCount, 1);
});

QUnit.test('Point should preserve visibility state on data updating', function(assert) {
    this.options.visibilityChanged = noop;
    let point = createPoint(this.series, { argument: 'a1', value: 1 }, this.options);

    point.hide();
    point.updateData({ argument: 'a1', value: 10 });

    assert.strictEqual(point.isVisible(), false);
});

QUnit.test('Point should reset hidden state if argument changed', function(assert) {
    this.options.visibilityChanged = noop;
    let point = createPoint(this.series, { argument: 'a1', value: 1 }, this.options);

    point.hide();
    point.updateData({ argument: 'a2', value: 10 });

    assert.strictEqual(point.isVisible(), true);
});

QUnit.module('Tooltip', {
    beforeEach: function() {
        this.data = {
            value: 10,
            argument: 1
        };
        this.options = {
            widgetType: 'pie',
            attributes: {},
            label: { visible: false },
            styles: {
                normal: {}
            }
        };
        this.series = {
            name: 'series1',
            getLabelVisibility: function() { return false; },
            getOptions: function() {
                return this._options;
            },
            _options: {}
        };
        var StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip, {
            formatValue: function(value, specialFormat) {
                return value || value === 0 ? value + ':' + specialFormat : value || '';
            }
        });
        this.tooltip = new StubTooltip();
    }
});

QUnit.test('Get tooltip coordinates', function(assert) {
    var point = createPoint(this.series, this.data, this.options);
    point.middleAngle = 90;
    point.centerX = 310;
    point.centerY = 250;
    point.radiusOuter = 400;
    point.radiusInner = 50;

    var cc = point.getTooltipParams();

    assert.equal(cc.x, 310);
    assert.equal(cc.y, 25);
    assert.equal(cc.offset, 0);
});

QUnit.test('Get tooltip coordinates, radiusInner != 0', function(assert) {
    var point = createPoint(this.series, this.data, this.options);
    point.middleAngle = 90;
    point.centerX = 310;
    point.centerY = 250;
    point.radiusOuter = 400;
    point.radiusInner = 50;

    var cc = point.getTooltipParams();

    assert.equal(cc.x, 310);
    assert.equal(cc.y, 25);
    assert.equal(cc.offset, 0);
});

QUnit.test('Get tooltip format object', function(assert) {
    var point = createPoint(this.series, this.data, this.options);
    point.percent = 100;
    var cc = point.getTooltipFormatObject(this.tooltip);

    assert.equal(cc.argument, 1);
    assert.equal(cc.argumentText, '1:argument');
    assert.equal(cc.percent, 100);
    assert.equal(cc.percentText, '100:percent');

    assert.equal(cc.value, 10);
    assert.equal(cc.valueText, '10:undefined');
    assert.equal(cc.seriesName, 'series1');
    assert.equal(cc.point, point);
    assert.equal(cc.originalArgument, 1);
    assert.equal(cc.originalValue, 10);
});


QUnit.module('Label', {
    beforeEach: environmentWithStubLabels
});

QUnit.test('Draw label, position outside (-0.1 < angleFunctions.cos < 0.1)', function(assert) {
    this.options.label.position = 'outside';
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 270, 20: 240 });

    assert.equal(label.shift.args[0][0], 290);
    assert.equal(label.shift.args[0][1], 295);
});

QUnit.test('Draw label, position is invalid', function(assert) {
    this.options.label.position = 'abc';
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 270, 20: 240 });

    assert.equal(label.shift.args[0][0], 290);
    assert.equal(label.shift.args[0][1], 295);
});

QUnit.test('Label position outside (angleFunctions.cos > 0.1)', function(assert) {
    this.options.label.position = 'outside';
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 10, 20: 240 });

    assert.equal(label.shift.args[0][0], 448);
    assert.equal(label.shift.args[0][1], 119);
});

QUnit.test('Label position outside (angleFunctions.cos < -0.1)', function(assert) {
    this.options.label.position = 'outside';
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 180, 20: 240 });

    assert.equal(label.shift.args[0][0], 130);
    assert.equal(label.shift.args[0][1], 145);
});

QUnit.test('Draw label, position columns and angleFunctions.cos < 0 (> -0.1)', function(assert) {
    this.options.label.position = 'columns';
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 269, 20: 240 });

    assert.equal(label.shift.args[0][0], 277);
    assert.equal(label.shift.args[0][1], 295);
});

QUnit.test('Draw label, position columns and angleFunctions.cos > 0 (< 0.1)', function(assert) {
    this.options.label.position = 'columns';
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 271, 20: 240 });

    assert.equal(label.shift.args[0][0], 303);
    assert.equal(label.shift.args[0][1], 295);
});

QUnit.test('Draw label, position columns and angleFunctions.cos === 0', function(assert) {
    this.options.label.position = 'columns';
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 270, 20: 240 });

    assert.equal(label.shift.args[0][0], 280);
    assert.equal(label.shift.args[0][1], 295);
});

QUnit.test('Draw label, position inside', function(assert) {
    this.options.label.position = 'inside';
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 270, 20: 240 });

    assert.equal(label.shift.args[0][0], 290);
    assert.equal(label.shift.args[0][1], 205);
});

QUnit.test('hide label on draw if it invisible', function(assert) {
    var point = createPointWithStubLabelForDraw.call(this, { 0: 300, 10: 270, 20: 240 });

    this.series.getLabelVisibility = function() {
        return false;
    };

    point.updateOptions(this.options);
    point._drawLabel();

    assert.deepEqual(point._label.draw.lastCall.args, [false]);
});

QUnit.test('Set label tracker data', function(assert) {
    var point = createPointWithStubLabelForDraw.call(this, { 0: 300, 10: 270, 20: 240 });

    point.setLabelTrackerData();

    assert.deepEqual(point.getLabel().setTrackerData.getCall(0).args[0], point, 'trackerData');
});


QUnit.module('get columns coord', {
    beforeEach: environmentWithStubLabels
});

QUnit.test('columns if label in the left side', function(assert) {
    var point = createPointWithStubLabel.call(this, { 0: 170, 10: 210, 20: 250 });
    var coord = point._correctLabelCoord({ x: 20, y: 10 });

    assert.deepEqual(coord, { x: 0, y: 10 });
});

QUnit.test('columns if label in the right side', function(assert) {
    var point = createPointWithStubLabel.call(this, { 0: 350, 10: 330, 20: 310 });
    var coord = point._correctLabelCoord({ x: 400, y: 10 });

    assert.deepEqual(coord, { x: 580, y: 10 });
});

QUnit.test('columns if label in center', function(assert) {
    var point = createPointWithStubLabel.call(this, { 0: 330, 10: 90, 20: 30 });
    var coord = point._correctLabelCoord({ x: 300, y: 10 });

    assert.deepEqual(coord, { x: 580, y: 10 });
});

QUnit.test('not columns', function(assert) {
    this.options.label.position = 'outside';
    var point = createPointWithStubLabel.call(this, { 0: 350, 10: 330, 20: 310 });
    var coord = point._correctLabelCoord({ x: 10, y: 10 });

    assert.deepEqual(coord, { x: 10, y: 10 });
});

QUnit.module('update Coord', {
    beforeEach: environmentWithStubLabels
});

QUnit.test('Outside', function(assert) {
    this.options.label.position = 'outside';
    var point = createPointWithStubLabel.call(this, { 0: 350, 10: 330, 20: 310 });
    point.updateLabelCoord();

    assert.equal(point._label.shift.args[0][0], 10);
    assert.equal(point._label.shift.args[0][1], 15);
});

QUnit.test('Outside. with check position', function(assert) {
    this.options.label.position = 'outside';
    this.series._visibleArea = { minX: 15, maxX: 600, minY: 300, maxY: 600 };
    var point = createPointWithStubLabel.call(this, { 0: 350, 10: 330, 20: 310 });
    point.updateLabelCoord();

    assert.equal(point._label.shift.args[0][0], 15);
    assert.equal(point._label.shift.args[0][1], 15);
});

QUnit.test('T586419. Outside, move from center', function(assert) {
    this.options.label.position = 'outside';
    var point1 = createPointWithStubLabel.call(this, { 0: 55, 10: 45, 20: 35 }, { x: 295, y: 10, width: 10, height: 10 }),
        point2 = createPointWithStubLabel.call(this, { 0: 145, 10: 135, 20: 125 }, { x: 295, y: 10, width: 10, height: 10 }),
        point3 = createPointWithStubLabel.call(this, { 0: 55, 10: 45, 20: 35 }, { x: 320, y: 10, width: 10, height: 10 }),
        point4 = createPointWithStubLabel.call(this, { 0: 145, 10: 135, 20: 125 }, { x: 280, y: 10, width: 10, height: 10 });

    point1.updateLabelCoord(true);
    point2.updateLabelCoord(true);
    point3.updateLabelCoord(true);
    point4.updateLabelCoord(true);

    assert.equal(point1._label.shift.args[0][0], 300);
    assert.equal(point2._label.shift.args[0][0], 290);
    assert.equal(point3._label.shift.args[0][0], 320);
    assert.equal(point4._label.shift.args[0][0], 280);
});

QUnit.test('Outside, move from center but with connector - correct x coordinate by connector offset', function(assert) {
    this.options.label.position = 'outside';
    this.options.label.connectorOffset = 20;
    var point1 = createPointWithStubLabel.call(this, { 0: 55, 10: 45, 20: 35 }, { x: 305, y: 10, width: 10, height: 10 }),
        point2 = createPointWithStubLabel.call(this, { 0: 145, 10: 135, 20: 125 }, { x: 285, y: 10, width: 10, height: 10 }),
        point3 = createPointWithStubLabel.call(this, { 0: 55, 10: 45, 20: 35 }, { x: 330, y: 10, width: 10, height: 10 }),
        point4 = createPointWithStubLabel.call(this, { 0: 145, 10: 135, 20: 125 }, { x: 260, y: 10, width: 10, height: 10 });

    point1.updateLabelCoord(true);
    point2.updateLabelCoord(true);
    point3.updateLabelCoord(true);
    point4.updateLabelCoord(true);

    assert.equal(point1._label.shift.args[0][0], 320);
    assert.equal(point2._label.shift.args[0][0], 270);
    assert.equal(point3._label.shift.args[0][0], 330);
    assert.equal(point4._label.shift.args[0][0], 260);
});

QUnit.test('T626329. Outside, move from center. Shrink big label with half canvas width', function(assert) {
    this.options.label.position = 'outside';
    var point = createPointWithStubLabel.call(this, { 0: 55, 10: 45, 20: 35 }, { x: 110, y: 10, width: 410, height: 10 });

    point.applyWordWrap(true);
    assert.equal(point._label.fit.args[0][0], 300);
});

QUnit.test('Inside - do not correct coordinates even if \'move from center\'', function(assert) {
    this.options.label.position = 'inside';
    var point1 = createPointWithStubLabel.call(this, { 0: 55, 10: 45, 20: 35 }, { x: 295, y: 10, width: 10, height: 10 }),
        point2 = createPointWithStubLabel.call(this, { 0: 145, 10: 135, 20: 125 }, { x: 295, y: 10, width: 10, height: 10 }),
        point3 = createPointWithStubLabel.call(this, { 0: 55, 10: 45, 20: 35 }, { x: 320, y: 10, width: 10, height: 10 }),
        point4 = createPointWithStubLabel.call(this, { 0: 145, 10: 135, 20: 125 }, { x: 280, y: 10, width: 10, height: 10 });

    point1.updateLabelCoord(true);
    point2.updateLabelCoord(true);
    point3.updateLabelCoord(true);
    point4.updateLabelCoord(true);

    assert.equal(point1._label.shift.args[0][0], 295);
    assert.equal(point2._label.shift.args[0][0], 295);
    assert.equal(point3._label.shift.args[0][0], 320);
    assert.equal(point4._label.shift.args[0][0], 280);
});

QUnit.module('Check label position', {
    beforeEach: environmentWithStubLabels
});

QUnit.test('Draw label (area of label < minY area of canvas)', function(assert) {
    this.series._visibleArea = { minX: 0, maxX: 600, minY: 300, maxY: 600 };
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 270, 20: 240 });

    assert.equal(label.shift.args[0][0], 280);
    assert.equal(label.shift.args[0][1], 300);
});

QUnit.test('Draw label (area of label > maxY area of canvas)', function(assert) {
    this.series._visibleArea = { minX: 0, maxX: 600, minY: 0, maxY: 300 };
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 270, 20: 240 });

    assert.equal(label.shift.args[0][0], 242);
    assert.equal(label.shift.args[0][1], 290);
});

QUnit.test('Draw label (area of label < minY area of canvas), first drawing', function(assert) {
    this.series._visibleArea = { minX: 0, maxX: 600, minY: 300, maxY: 600 };
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 270, 20: 240 }, true);

    assert.equal(label.shift.args[0][0], 280);
    assert.equal(label.shift.args[0][1], 300);
});

QUnit.test('Draw label (area of label > maxY area of canvas), first drawing', function(assert) {
    this.series._visibleArea = { minX: 0, maxX: 600, minY: 0, maxY: 300 };
    this.options.label.radialOffset = 30;
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 270, 20: 240 }, true);

    assert.equal(label.shift.args[0][0], 280);
    assert.equal(label.shift.args[0][1], 290);
});

QUnit.test('Draw label (area of label > maxX area of canvas)', function(assert) {
    var point = createPointWithStubLabelForDraw.call(this, { 0: 300, 10: 270, 20: 240 });
    var coord = point._checkHorizontalLabelPosition({ x: 595, y: 295, width: 20, height: 10 }, point._label.getBoundingRect(), point._getVisibleArea());

    assert.equal(coord.x, 580);
    assert.equal(coord.y, 295);
});

QUnit.test('Draw label (area of label < minX area of canvas)', function(assert) {
    var point = createPointWithStubLabelForDraw.call(this, { 0: 300, 10: 270, 20: 240 });
    var coord = point._checkHorizontalLabelPosition({ x: -10, y: 295, width: 20, height: 10 }, point._label.getBoundingRect(), point._getVisibleArea());

    assert.equal(coord.x, 0);
    assert.equal(coord.y, 295);
});

QUnit.test('Draw label (area of label > maxX area of canvas), first drawing', function(assert) {
    this.series._visibleArea = { minX: 0, maxX: 300, minY: 0, maxY: 600 };
    this.options.label.radialOffset = 30;
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 270, 20: 240 }, true);

    assert.equal(label.shift.args[0][0], 280);
    assert.equal(label.shift.args[0][1], 325);
});

QUnit.test('Draw label (area of label < minX area of canvas), first drawing', function(assert) {
    this.series._visibleArea = { minX: 300, maxX: 600, minY: 0, maxY: 600 };
    this.options.label.radialOffset = 30;
    var label = createCorrectionLabel.call(this, { 0: 300, 10: 270, 20: 240 }, true);

    assert.equal(label.shift.args[0][0], 300);
    assert.equal(label.shift.args[0][1], 325);
});

QUnit.module('set label ellipsis', {
    beforeEach: environmentWithStubLabels
});

QUnit.test('Single series, label is outside right bound - fit in reduced space', function(assert) {
    var point = createPointWithStubLabel.call(this, { 0: 300, 10: 270, 20: 240 }, { x: 590, width: 20, y: 10, height: 30 });
    var textEllipsis = point.applyWordWrap();

    assert.deepEqual(point._label.fit.args[0][0], 10);
    assert.strictEqual(textEllipsis, true, 'text has ellipsis');
});

QUnit.test('Single series, label is outside left bound - fit in reduced space', function(assert) {
    var point = createPointWithStubLabel.call(this, { 0: 300, 10: 270, 20: 240 }, { x: -15, width: 30, y: 10, height: 30 });
    point.applyWordWrap();

    assert.deepEqual(point._label.fit.args[0][0], 15);
});

QUnit.test('Single series, label is inside bounds - do not fit', function(assert) {
    var point = createPointWithStubLabel.call(this, { 0: 300, 10: 270, 20: 240 }, { x: 400, width: 30, y: 10, height: 30 });
    var textEllipsis = point.applyWordWrap();

    assert.strictEqual(point._label.fit.callCount, 0);
    assert.strictEqual(textEllipsis, false, 'text do not have ellipsis');
});

QUnit.test('Multiple series, first series, columns, label is outside right bound - fit in reduced space', function(assert) {
    this.series.index = 0;
    var point = createPointWithStubLabel.call(this, { 0: 300, 10: 270, 20: 240 }, { x: 590, width: 20, y: 10, height: 30 });
    point.applyWordWrap();

    assert.deepEqual(point._label.fit.args[0][0], 10);
});

QUnit.test('Multiple series, non-first series, columns - fit in column width', function(assert) {
    this.series.index = 1;
    var point = createPointWithStubLabel.call(this, { 0: 300, 10: 270, 20: 240 }, { x: 590, width: 185, y: 10, height: 30 });
    point.applyWordWrap();

    assert.deepEqual(point._label.fit.args[0][0], 150);
});

QUnit.test('set label ellipsis. not drawn point', function(assert) {
    assert.expect(3);
    var point = createPointWithStubLabel.call(this, { 0: 300, 10: 270, 20: 240 });
    point.applyWordWrap();
    point.updateLabelCoord();
});

QUnit.test('Inside. Label is outside bound but label width less that visible area - do not reduce label', function(assert) {
    this.options.label.position = 'inside';
    var point = createPointWithStubLabel.call(this, { 0: 300, 10: 270, 20: 240 }, { x: 590, width: 20, y: 10, height: 30 });

    point.applyWordWrap();

    assert.strictEqual(point._label.fit.callCount, 0);
});

QUnit.test('Inside. Label width more that visible area - fit in visible area', function(assert) {
    this.options.label.position = 'inside';
    var point = createPointWithStubLabel.call(this, { 0: 300, 10: 270, 20: 240 }, { x: 590, width: 620, y: 10, height: 30 });

    point.applyWordWrap();

    assert.deepEqual(point._label.fit.args[0][0], 600);
});

QUnit.module('Connector', {
    beforeEach: function() {
        var that = this;
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.translateData = { 0: 300, 10: 270, 20: 240 };
        this.angleTranslator = new MockAngularTranslator({
            translate: this.translateData
        });
        this.data = {
            value: 20,
            minValue: 0
        };
        this.options = {
            widgetType: 'pie',
            styles: {
                normal: {
                    'stroke-width': 0
                }
            },
            label: {
                visible: true,
                radialOffset: 0,
                background: {},
                connector: {
                    'stroke-width': 1
                }
            }
        };
        this.series = {
            name: 'series1',
            areLabelsVisible: function() {
                return true;
            },
            getOptions: function() {
                return this._options;
            },
            getVisibleArea: function() { return {}; },
            _options: {
                containerBackgroundColor: '#ffffff'
            },
            getLabelVisibility: function() { return true; },
            getValueAxis: function() { return { getTranslator: function() { return that.angleTranslator; } }; }
        };
        this.label = sinon.createStubInstance(labelModule.Label);
        this.label.getLayoutOptions.returns(this.options.label);
        this.label.getBoundingRect.returns({ height: 10, width: 20 });
        this.labelFactory = labelModule.Label = sinon.spy(function() {
            return that.label;
        });
    },
    afterEach: function() {
        labelModule.Label = originalLabel;
    }
});

QUnit.test('Draw connector', function(assert) {
    this.options.label.position = 'outside';
    var label = createLabelWithConnector.call(this);

    assert.ok(label.setFigureToDrawConnector.calledOnce);
    assert.deepEqual(label.setFigureToDrawConnector.firstCall.args[0], { x: 300, y: 270, angle: 270 });
});

QUnit.test('Draw connector, color of border and containerBackgroundColor are different', function(assert) {
    this.options.label.position = 'outside';
    this.options.styles.normal['stroke-width'] = 4;
    this.options.styles.normal.stroke = 'black';
    var label = createLabelWithConnector.call(this);

    assert.deepEqual(label.setFigureToDrawConnector.firstCall.args[0], { x: 300, y: 272, angle: 270 });
});

QUnit.test('Draw connector, color of border and containerBackgroundColor are equal', function(assert) {
    this.options.label.position = 'outside';
    this.options.styles.normal['stroke-width'] = 4;
    this.options.styles.normal.stroke = '#ffffff';
    var label = createLabelWithConnector.call(this);

    assert.deepEqual(label.setFigureToDrawConnector.firstCall.args[0], { x: 300, y: 268, angle: 270 });
});


QUnit.module('show/hide API', {
    beforeEach: function() {
        var that = this;
        this.visibilityChanged = sinon.spy();
        this.series = {
            name: 'series1',
            getOptions: function() {
                return this._options;
            },
            _options: {

            },
            getLabelVisibility: function() { return false; },
            hidePointTooltip: function() { },
            getValueAxis: function() { return { getTranslator: function() { return that.angleTranslator; } }; }
        };
        this.opt = {
            type: 'pie',
            widgetType: 'pie',
            label: { visible: false },
            visibilityChanged: this.visibilityChanged,
            styles: {
                normal: {},
                hover: {},
                selection: {},
                legendStyles: {
                    isLegendStyles: true
                }

            }
        };
        this.translateData = { 0: 100, 5: 150, 10: 200 };

        this.angleTranslator = new MockAngularTranslator({
            translate: this.translateData
        });
    }
});

QUnit.test('Create point', function(assert) {
    var point = createPoint(this.series, { argument: 'cat2', value: 10, minValue: 0 }, this.opt);
    assert.ok(point.isVisible());
    assert.ok(!this.visibilityChanged.called);
    assert.ok(point.isInVisibleArea());
});

QUnit.test('hide point', function(assert) {
    var point = createPoint(this.series, { argument: 'cat2', value: 10, minValue: 0 }, this.opt),
        hideTooltipSpy = sinon.spy(point, 'hideTooltip');

    point.hide();
    assert.ok(!point.isVisible());
    assert.ok(this.visibilityChanged.calledOnce);
    assert.ok(!this.visibilityChanged.lastCall.args[0]);
    assert.ok(hideTooltipSpy.calledOnce);
    assert.ok(point.isInVisibleArea());
});

QUnit.test('double hide point', function(assert) {
    var point = createPoint(this.series, { argument: 'cat2', value: 10, minValue: 0 }, this.opt);

    point.hide();
    point.hide();

    assert.ok(!point.isVisible());
    assert.ok(point.isInVisibleArea());
    assert.ok(this.visibilityChanged.calledOnce);
});

QUnit.test('show', function(assert) {
    var point = createPoint(this.series, { argument: 'cat2', value: 10, minValue: 0 }, this.opt);

    point.show();

    assert.ok(point.isVisible());
    assert.ok(point.isInVisibleArea());
    assert.ok(!this.visibilityChanged.called);
});

QUnit.test('show after hide point', function(assert) {
    var point = createPoint(this.series, { argument: 'cat2', value: 10, minValue: 0 }, this.opt);

    point.hide();
    this.visibilityChanged.reset();
    point.show();

    assert.ok(point.isVisible());
    assert.ok(point.isInVisibleArea());
    assert.ok(this.visibilityChanged.calledOnce);
    assert.ok(!this.visibilityChanged.lastCall.args[0]);
});
