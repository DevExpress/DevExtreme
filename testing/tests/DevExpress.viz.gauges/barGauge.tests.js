/* global createTestContainer, currentTest */

const $ = require('jquery');
const noop = require('core/utils/common').noop;
const vizMocks = require('../../helpers/vizMocks.js');
const dxBarGauge = require('viz/bar_gauge');
const rendererModule = require('viz/core/renderers/renderer');
const loadingIndicatorModule = require('viz/core/loading_indicator');
const titleModule = require('viz/core/title');
const tooltipModule = require('viz/core/tooltip');
const barGaugeModule = require('viz/gauges/bar_gauge');
const exportModule = require('viz/core/export');
const themeModule = require('viz/themes');
const BarWrapper = barGaugeModule.BarWrapper;
const stubBarWrapper = barGaugeModule.stubBarWrapper;
const restoreBarWrapper = barGaugeModule.restoreBarWrapper;

$('<div id="test-container">').appendTo('#qunit-fixture');

let renderer;
QUnit.begin(function() {
    rendererModule.Renderer = sinon.spy(function() {
        const test = currentTest();
        test.renderer = renderer || new vizMocks.Renderer();
        test.renderer.g = sinon.spy(function() {
            const group = new vizMocks.Element();
            group.animate = function(settings, options) {
                let that;
                let step;
                let complete;
                let pos;

                this.animateSettings = settings;
                this.animateArguments = arguments;
                if(arguments.length >= 2) {
                    this.durations = this.durations || [];
                    this.completes = this.completes || [];
                    this.steps = this.steps || [];
                    arguments[1] && this.durations.push(arguments[1].duration);
                    this.completes.push(arguments[2]);
                    arguments[1] && this.steps.push(arguments[1].step);
                }

                //  For gauges

                function tick() {
                    that.__animation = null;
                    step(pos);
                    that.animationStep && that.animationStep(pos);
                    if(pos < 1) {
                        that.__animation = setTimeout(function() {
                            pos += 0.5;
                            tick();
                        }, 0);
                    } else {
                        step(1);
                        that.animationStep && that.animationStep(1);
                        complete();
                        that.animationComplete && that.animationComplete();
                        test.renderer.animationCompleted && test.renderer.animationCompleted();
                    }
                }


                if(arguments[1] && typeof arguments[1].step === 'function') {
                    that = this;
                    step = arguments[1].step;
                    complete = arguments[1].complete || noop;
                    pos = 0;

                    tick();
                }
            };
            group.stopAnimation = function() {
                clearTimeout(this.__animation);
                return this;
            };
            return group;
        });

        return test.renderer;
    });

    titleModule.Title = function() {
        return new vizMocks.Title();
    };
    loadingIndicatorModule.LoadingIndicator = function(parameters) {
        return new vizMocks.LoadingIndicator(parameters);
    };
    exportModule.ExportMenu = function(parameters) {
        return new vizMocks.ExportMenu(parameters);
    };
    const StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip, { isEnabled: function() { return 'tooltip_enabled'; } });
    tooltipModule.Tooltip = function(parameters) {
        return new StubTooltip(parameters);
    };
});

const environment = {
    beforeEach: function() {
        this.$container = createTestContainer('#test-container', { width: 400, height: 300 });
    },
    afterEach: function() {
        this.$container.remove();
        rendererModule.Renderer.reset();
        this.renderer = null;

    },
    getBarsGroup: function() {
        return this.renderer.g.getCall(2).returnValue;
    },
    getTrackersGroup: function() {
        return this.renderer.g.getCall(1).returnValue;
    }
};

QUnit.module('General', environment);

QUnit.test('Instance type', function(assert) {
    const gauge = this.$container.dxBarGauge().dxBarGauge('instance');
    assert.ok(gauge instanceof dxBarGauge, 'instance of dxBarGauge');
});

QUnit.test('Groups creation', function(assert) {
    this.$container.dxBarGauge();
    assert.strictEqual(rendererModule.Renderer.lastCall.args[0]['cssClass'], 'dxg dxbg-bar-gauge', 'root class');
    const group = this.getBarsGroup();
    assert.deepEqual(group.attr.firstCall.args, [{ 'class': 'dxbg-bars' }], 'bars group settings');
    assert.deepEqual(group.linkOn.lastCall.args, [this.renderer.root, 'bars'], 'bars group is linked to container');

});

QUnit.test('Groups disposing', function(assert) {
    this.$container.dxBarGauge().remove();
    assert.deepEqual(this.getBarsGroup().linkOff.lastCall.args, [], 'bars group is unlinked');
});

QUnit.test('Bars creation', function(assert) {
    this.$container.dxBarGauge({
        values: [10, 20, 30]
    });
    const elements = this.getBarsGroup().children;
    assert.strictEqual(elements.length, 12, 'elements count');
    $.each([null, null, null], function(i) {
        const message = ' - ' + (i + 1);
        let k = i * 4;
        assert.strictEqual(elements[k++].typeOfNode, 'arc', 'background' + message);
        assert.strictEqual(elements[k++].typeOfNode, 'arc', 'bar' + message);
        assert.strictEqual(elements[k].typeOfNode, 'path', 'line' + message);
        assert.ok(elements[k++].sharp.called, 'line sharped');
        assert.strictEqual(elements[k++].typeOfNode, 'text', 'text' + message);
    });
    assert.strictEqual(this.getTrackersGroup().children.length, 3, 'trackers count');
});

QUnit.test('Bars creation - without text', function(assert) {
    this.$container.dxBarGauge({
        label: false,
        values: [10, 20, 30]
    });
    const elements = this.getBarsGroup().children;
    assert.strictEqual(elements.length, 6, 'elements count');
    $.each([null, null, null], function(i) {
        const message = ' - ' + (i + 1);
        let k = i * 2;
        assert.strictEqual(elements[k++].typeOfNode, 'arc', 'background' + message);
        assert.strictEqual(elements[k++].typeOfNode, 'arc', 'bar' + message);
    });
    assert.strictEqual(this.getTrackersGroup().children.length, 3, 'trackers count');
});

QUnit.test('Bars disposing', function(assert) {
    this.$container.dxBarGauge({
        values: [10, 20, 30]
    }).remove();

    assert.strictEqual(this.getBarsGroup().children.length, 0);
});

QUnit.test('Bars creation - without values', function(assert) {
    this.$container.dxBarGauge();

    assert.strictEqual(this.getBarsGroup().children.length, 1); //  Fake background
});

QUnit.module('Positioning', $.extend({}, environment, {
    checkBars: function(assert, commonSettings, radiuses, angles) {
        const elements = this.getBarsGroup().children;
        const trackers = this.getTrackersGroup().children;
        const step = elements.length / trackers.length;
        let i = 0; const ii = trackers.length;
        let elementSettings;
        let message;
        for(; i < ii; ++i) {
            message = ' - ' + (i + 1);
            elementSettings = elements[i * step]._stored_settings;
            assert.deepEqual({
                x: elementSettings.x, y: elementSettings.y,
                outerRadius: Math.round(elementSettings.outerRadius),
                innerRadius: Math.round(elementSettings.innerRadius),
                startAngle: elementSettings.startAngle,
                endAngle: elementSettings.endAngle
            }, {
                x: commonSettings.x, y: commonSettings.y,
                outerRadius: radiuses[i][0],
                innerRadius: radiuses[i][1],
                startAngle: commonSettings.startAngle,
                endAngle: commonSettings.endAngle
            }, 'background' + message);
            elementSettings = elements[i * step + 1]._stored_settings;
            assert.deepEqual({
                x: elementSettings.x, y: elementSettings.y,
                outerRadius: Math.round(elementSettings.outerRadius),
                innerRadius: Math.round(elementSettings.innerRadius),
                startAngle: Math.round(elementSettings.startAngle),
                endAngle: Math.round(elementSettings.endAngle)
            }, {
                x: commonSettings.x, y: commonSettings.y,
                outerRadius: radiuses[i][0],
                innerRadius: radiuses[i][1],
                startAngle: angles[i][1],
                endAngle: angles[i][0]
            }, 'bar' + message);
            elementSettings = trackers[i]._stored_settings;
            assert.deepEqual({
                x: elementSettings.x, y: elementSettings.y,
                outerRadius: Math.round(elementSettings.outerRadius),
                innerRadius: Math.round(elementSettings.innerRadius),
                startAngle: Math.round(elementSettings.startAngle),
                endAngle: Math.round(elementSettings.endAngle)
            }, {
                x: commonSettings.x, y: commonSettings.y,
                outerRadius: radiuses[i][0],
                innerRadius: radiuses[i][1],
                startAngle: angles[i][1],
                endAngle: angles[i][0]
            }, 'tracker' + message);
        }
    },
    checkTexts: function(assert, commonSettings, linePositions, textPositions, textValues) {
        const elements = this.getBarsGroup().children;
        const trackers = this.getTrackersGroup().children;
        const step = elements.length / trackers.length;
        let i = 0; const ii = trackers.length;
        let elementSettings;
        let message;
        for(; i < ii; ++i) {
            message = ' - ' + (i + 1);
            elementSettings = elements[i * step + 2]._stored_settings;
            assert.deepEqual({
                points: elementSettings.points,
                'stroke-width': elementSettings['stroke-width']
            }, {
                points: [commonSettings.x, commonSettings.y - linePositions[i][0], commonSettings.x, commonSettings.y - commonSettings.textRadius],
                'stroke-width': commonSettings.lineWidth
            }, 'line' + message);
            assert.strictEqual(Math.round(elements[i * step + 2].rotate.firstCall.args[0]), linePositions[i][1], 'line rotation' + message);
            elementSettings = elements[i * step + 3]._stored_settings;
            assert.deepEqual({
                x: Math.round(elementSettings.x), y: Math.round(elementSettings.y),
                text: elementSettings.text
            }, {
                x: textPositions[i][0], y: textPositions[i][1],
                text: textValues[i]
            }, 'text' + message);
        }
    }
}));

function checkPositioning(name, options, callback) {
    options.resolveLabelOverlapping = 'none';
    QUnit.test(name, function(assert) {
        this.$container.dxBarGauge($.extend({}, options, { animation: false }));
        callback.apply(this, arguments);
    });
    QUnit.test(name + ' // animation', function(assert) {
        const done = assert.async();
        const test = this;
        const args = arguments;
        this.$container.dxBarGauge(options);
        this.getBarsGroup().animationComplete = function() {
            callback.apply(test, args);
            done();
        };
    });
}

checkPositioning('default', {
    values: [10, 40, 80]
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 113], [109, 78], [74, 43]], [[225, 198], [225, 117], [225, 9]]);
    this.checkTexts(assert, { x: 200, y: 174, textRadius: 164, lineWidth: 2 },
        [[113, -108], [78, -27], [43, 81]],
        [[34, 223], [116, 16], [372, 136]],
        ['10.0', '40.0', '80.0']);
});

checkPositioning('labels are not visible', {
    values: [10, 40, 80],
    label: null
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 176, startAngle: -45, endAngle: 225 }, [[175, 137], [133, 94], [90, 52]], [[225, 198], [225, 117], [225, 9]]);
});

checkPositioning('labels are not visible by visibility', {
    values: [10, 40, 80],
    label: { visible: false }
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 176, startAngle: -45, endAngle: 225 }, [[175, 137], [133, 94], [90, 52]], [[225, 198], [225, 117], [225, 9]]);
});

checkPositioning('startAngle and baseAngle', {
    values: [43, 62],
    geometry: {
        startAngle: 300,
        endAngle: 40
    }
}, function(assert) {
    this.checkBars(assert, { x: 216, y: 150, startAngle: 40, endAngle: 300 }, [[120, 80], [76, 36]], [[300, 188], [300, 139]]);
});

checkPositioning('baseValue', {
    values: [14, 91],
    baseValue: 35
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 96], [92, 43]], [[187, 131], [131, -21]]);
});

checkPositioning('baseValue is 0', {
    startValue: -10,
    endValue: 30,
    baseValue: 0,
    values: [-5, 10, 20]
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 113], [109, 78], [74, 43]], [[191, 158], [158, 90], [158, 23]]);
});

QUnit.test('switching angles during value changing', function(assert) {
    const gauge = this.$container.dxBarGauge({
        animation: false,
        startValue: 100,
        endValue: 300,
        baseValue: 200,
        values: [150, 250]
    }).dxBarGauge('instance');
    gauge.values([220, 170]);
    this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 96], [92, 43]], [[90, 63], [131, 90]]);
});

QUnit.test('switching angles during value changing // animation', function(assert) {
    const done = assert.async();
    const gauge = this.$container.dxBarGauge({
        startValue: 100,
        endValue: 300,
        baseValue: 200,
        values: [150, 250]
    }).dxBarGauge('instance');
    gauge.values([220, 170]);
    this.getBarsGroup().animationComplete = $.proxy(function() {
        this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 96], [92, 43]], [[90, 63], [131, 90]]);
        done();
    }, this);
});

checkPositioning('startValue and endValue', {
    startValue: 50,
    endValue: 90,
    values: [40, 70, 100]
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 113], [109, 78], [74, 43]], [[225, 225], [225, 90], [225, -45]]);
});

checkPositioning('labels indent', {
    values: [32, 89],
    label: {
        indent: 40
    }
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[124, 83], [79, 37]], [[225, 139], [225, -15]]);
    this.checkTexts(assert, { x: 200, y: 174, textRadius: 164, lineWidth: 2 },
        [[82.5, -49], [37, 105]],
        [[67, 54], [368, 215]],
        ['32.0', '89.0']);
});

//  B253614
checkPositioning('labels indent - out of range', {
    values: [32, 89],
    label: {
        indent: 200
    }
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[82, 55], [51, 24]], [[225, 139], [225, -15]]);
    this.checkTexts(assert, { x: 200, y: 174, textRadius: 164, lineWidth: 2 },
        [[55, -49], [24, 105]],
        [[67, 54], [368, 210]],
        ['32.0', '89.0']);
});

checkPositioning('value is equal to base value / with labels', {
    values: [30, 40],
    baseValue: 30,
    label: {
        indent: 40
    }
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[124, 83], [79, 37]], [[144, 144], [144, 117]]);
    this.checkTexts(assert, { x: 200, y: 174, textRadius: 164, lineWidth: 2 },
        [[82.5, -54], [37, -27]],
        [[57, 66], [116, 16]],
        ['30.0', '40.0']);
});

checkPositioning('connector width', {
    values: [15, 29],
    label: {
        connectorWidth: 3
    }
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 96], [92, 43]], [[225, 185], [225, 147]]);
    this.checkTexts(assert, { x: 200, y: 174, textRadius: 164, lineWidth: 3 },
        [[95.5, -94], [43, -57]],
        [[27, 180], [53, 72]],
        ['15.0', '29.0']);
});

checkPositioning('relativeInnerRadius', {
    relativeInnerRadius: 0.6,
    values: [70, 30, 5]
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 127], [123, 107], [103, 86]], [[225, 36], [225, 144], [225, 212]]);
});

checkPositioning('barSpacing', {
    values: [15, 75],
    barSpacing: 11
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 99], [88, 43]], [[225, 185], [225, 23]]);
});

//  B253614
checkPositioning('barSpacing - out of range', {
    values: [15, 25, 35],
    barSpacing: 60
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 143], [94, 93], [44, 43]], [[225, 185], [225, 158], [225, 131]]);
});

checkPositioning('single value', {
    values: 50
}, function(assert) {
    this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 43]], [[225, 90]]);
    this.checkTexts(assert, { x: 200, y: 174, textRadius: 164, lineWidth: 2 }, [[43, 0]], [[200, -2]], ['50.0']);
});

QUnit.test('no values', function(assert) {
    this.$container.dxBarGauge({
        animation: false
    });
    assert.strictEqual(this.getBarsGroup().children.length, 1, 'count');
    const settings = this.getBarsGroup().children[0]._stored_settings;
    assert.deepEqual({
        x: settings.x, y: settings.y,
        outerRadius: settings.outerRadius,
        innerRadius: settings.innerRadius,
        startAngle: settings.startAngle,
        endAngle: settings.endAngle
    }, {
        x: 200, y: 174, outerRadius: 144, innerRadius: 43, startAngle: -45, endAngle: 225
    }, 'settings');
});

QUnit.test('no values // animation', function(assert) {
    const done = assert.async();
    this.$container.dxBarGauge({});
    assert.strictEqual(this.getBarsGroup().children.length, 1, 'count');
    const settings = this.getBarsGroup().children[0]._stored_settings;
    assert.deepEqual({
        x: settings.x, y: settings.y,
        outerRadius: settings.outerRadius,
        innerRadius: settings.innerRadius,
        startAngle: settings.startAngle,
        endAngle: settings.endAngle
    }, {
        x: 200, y: 174, outerRadius: 144, innerRadius: 43, startAngle: -45, endAngle: 225
    }, 'settings');
    this.getBarsGroup().animationComplete = function() {
        assert.ok(false, 'This is not supposed to happen!');
    };
    setTimeout(function() {
        done();
    });
});

//  B253925
QUnit.test('background is moved properly when container is resized', function(assert) {
    this.$container.css({ width: 800 }).dxBarGauge({
        animation: false
    }).css({ width: 500 }).dxBarGauge('render');
    const settings = this.getBarsGroup().children[0]._stored_settings;
    delete settings.fill;
    assert.deepEqual(settings, {
        x: 250, y: 174, outerRadius: 144, innerRadius: 43, startAngle: -45, endAngle: 225,
        'stroke-linejoin': 'round'
    });
});

QUnit.test('Values are changed', function(assert) {
    const done = assert.async();
    const gauge = this.$container.dxBarGauge({
        values: [10, 20, 30],
        resolveLabelOverlapping: 'none'
    }).dxBarGauge('instance');
    const group = this.getBarsGroup();
    group.animationComplete = $.proxy(function() {
        gauge.values([15, 25, 35, 45]);
        this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 122], [118, 96], [92, 69], [65, 43]], [[225, 198], [225, 171], [225, 144], [225, 225]]);
        assert.strictEqual(group.children[2]._stored_settings.visibility, 'hidden', 'line 1 is hidden');
        assert.strictEqual(group.children[3]._stored_settings.visibility, 'hidden', 'text 1 is hidden');
        assert.strictEqual(group.children[6]._stored_settings.visibility, 'hidden', 'line 2 is hidden');
        assert.strictEqual(group.children[7]._stored_settings.visibility, 'hidden', 'line 2 is hidden');
        assert.strictEqual(group.children[10]._stored_settings.visibility, 'hidden', 'line 3 is hidden');
        assert.strictEqual(group.children[11]._stored_settings.visibility, 'hidden', 'text 3 is hidden');
        assert.strictEqual(group.children[14]._stored_settings.visibility, 'hidden', 'line 4 is hidden');
        assert.strictEqual(group.children[15]._stored_settings.visibility, 'hidden', 'text 4 is hidden');
        group.animationComplete = $.proxy(function() {
            this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 122], [118, 96], [92, 69], [65, 43]], [[225, 185], [225, 158], [225, 131], [225, 104]]);
            assert.strictEqual(group.children[2]._stored_settings.visibility, null, 'line 1 is visible');
            assert.strictEqual(group.children[3]._stored_settings.visibility, null, 'text 1 is visible');
            assert.strictEqual(group.children[6]._stored_settings.visibility, null, 'line 2 is visible');
            assert.strictEqual(group.children[7]._stored_settings.visibility, null, 'line 2 is visible');
            assert.strictEqual(group.children[10]._stored_settings.visibility, null, 'line 3 is visible');
            assert.strictEqual(group.children[11]._stored_settings.visibility, null, 'text 3 is visible');
            assert.strictEqual(group.children[14]._stored_settings.visibility, null, 'line 4 is visible');
            assert.strictEqual(group.children[15]._stored_settings.visibility, null, 'text 4 is visible');
            done();
        }, this);
    }, this);
});

QUnit.test('Some values are not changed', function(assert) {
    const done = assert.async();
    const gauge = this.$container.dxBarGauge({
        values: [10, 20, 30],
        resolveLabelOverlapping: 'none'
    }).dxBarGauge('instance');
    const group = this.getBarsGroup();
    group.animationComplete = $.proxy(function() {
        gauge.values([10, 20, 30, 40]);
        this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 122], [118, 96], [92, 69], [65, 43]], [[225, 198], [225, 171], [225, 144], [225, 225]]);
        assert.strictEqual(group.children[2]._stored_settings.visibility, null, 'line 1 is visible');
        assert.strictEqual(group.children[3]._stored_settings.visibility, null, 'text 1 is visible');
        assert.strictEqual(group.children[6]._stored_settings.visibility, null, 'line 2 is visible');
        assert.strictEqual(group.children[7]._stored_settings.visibility, null, 'line 2 is visible');
        assert.strictEqual(group.children[10]._stored_settings.visibility, null, 'line 3 is visible');
        assert.strictEqual(group.children[11]._stored_settings.visibility, null, 'text 3 is visible');
        assert.strictEqual(group.children[14]._stored_settings.visibility, 'hidden', 'line 4 is hidden');
        assert.strictEqual(group.children[15]._stored_settings.visibility, 'hidden', 'text 4 is hidden');
        group.animationComplete = $.proxy(function() {
            this.checkBars(assert, { x: 200, y: 174, startAngle: -45, endAngle: 225 }, [[144, 122], [118, 96], [92, 69], [65, 43]], [[225, 198], [225, 171], [225, 144], [225, 117]]);
            assert.strictEqual(group.children[2]._stored_settings.visibility, null, 'line 1 is visible');
            assert.strictEqual(group.children[3]._stored_settings.visibility, null, 'text 1 is visible');
            assert.strictEqual(group.children[6]._stored_settings.visibility, null, 'line 2 is visible');
            assert.strictEqual(group.children[7]._stored_settings.visibility, null, 'line 2 is visible');
            assert.strictEqual(group.children[10]._stored_settings.visibility, null, 'line 3 is visible');
            assert.strictEqual(group.children[11]._stored_settings.visibility, null, 'text 3 is visible');
            assert.strictEqual(group.children[14]._stored_settings.visibility, null, 'line 4 is visible');
            assert.strictEqual(group.children[15]._stored_settings.visibility, null, 'text 4 is visible');
            done();
        }, this);
    }, this);
});

QUnit.test('labels on almost straight lines (delta less than indent)', function(assert) {
    this.$container.dxBarGauge({
        animation: false,
        values: [16, 51, 83]
    });

    this.checkTexts(assert, { x: 200, y: 174, textRadius: 164, lineWidth: 2 },
        [[113, -92], [78, 3], [43, 89]],
        [[26, 172], [208, -2], [374, 164]],
        ['16.0', '51.0', '83.0']);
});

QUnit.test('labels straight lines (indent = 0)', function(assert) {
    this.$container.dxBarGauge({
        animation: false,
        startValue: 0,
        endValue: 120,
        values: [60 - 0.01, 60, 100 - 0.01, 100],
        label: { indent: 0 }
    });

    this.checkTexts(assert, { x: 200, y: 174, textRadius: 164, lineWidth: 2 },
        [[138.25, 0], [108.5, 0], [78.75, 90], [49, 90]],
        [[190, -2], [200, -2], [374, 174 - 12], [374, 174 - 7]],
        ['60.0', '60.0', '100.0', '100.0']);
});

// T725337
QUnit.test('Half circle up - leave margin on bottom', function(assert) {
    this.$container.width(800).height(200).dxBarGauge({
        resolveLabelOverlapping: 'none',
        animation: false,
        geometry: {
            startAngle: 180,
            endAngle: 0
        },
        values: [100]
    });
    this.checkBars(assert, { x: 400, y: 195, startAngle: 0, endAngle: 180 }, [[165, 49]], [[180, 0]]);
    this.checkTexts(assert, { x: 400, y: 195, textRadius: 185, lineWidth: 2 },
        [[49, 90]],
        [[595, 188]],
        ['100.0']);
});

// T803467
QUnit.test('Update bars on values changing', function(assert) {
    const gauge = this.$container.dxBarGauge({
        animation: false,
        values: [100]
    }).dxBarGauge('instance');

    gauge.values([1, 2]);
    gauge.values([3]);

    assert.strictEqual(this.getBarsGroup().children.length, 4);
});

// T725337
QUnit.test('Half circle down - leave margin on top', function(assert) {
    this.$container.width(800).height(200).dxBarGauge({
        resolveLabelOverlapping: 'none',
        animation: false,
        geometry: {
            startAngle: 0,
            endAngle: 180
        },
        values: [100]
    });
    this.checkBars(assert, { x: 400, y: 5, startAngle: -180, endAngle: 0 }, [[165, 49]], [[0, -180]]);
});

// T725337
QUnit.test('Half circle left - leave margin on right', function(assert) {
    this.$container.width(300).height(800).dxBarGauge({
        resolveLabelOverlapping: 'none',
        animation: false,
        geometry: {
            startAngle: 90,
            endAngle: -90
        },
        values: [100]
    });
    this.checkBars(assert, { x: 10, y: 400, startAngle: -90, endAngle: 90 }, [[250, 75]], [[90, -90]]);
});

// T725337
QUnit.test('Half circle right - leave margin on left', function(assert) {
    this.$container.width(300).height(800).dxBarGauge({
        resolveLabelOverlapping: 'none',
        animation: false,
        geometry: {
            startAngle: -90,
            endAngle: 90
        },
        values: [100]
    });
    this.checkBars(assert, { x: 290, y: 400, startAngle: 90, endAngle: 270 }, [[250, 75]], [[270, 90]]);
});

QUnit.module('Colors', $.extend({}, environment, {
    checkColors: function(assert, backgroundColor, colors, lineColor, textColor) {
        const elements = this.getBarsGroup().children;
        let i = 0; const ii = elements.length / 4;
        let message;
        for(; i < ii; ++i) {
            message = ' - ' + (i + 1);
            assert.strictEqual(elements[i * 4 + 0]._stored_settings.fill, backgroundColor, 'background' + message);
            assert.strictEqual(elements[i * 4 + 1]._stored_settings.fill, colors[i], 'bar' + message);
            assert.strictEqual(elements[i * 4 + 2]._stored_settings.stroke, lineColor || colors[i], 'line' + message);
            assert.strictEqual(elements[i * 4 + 3]._stored_styles.fill, textColor || colors[i], 'text' + message);
        }
    }
}));

QUnit.test('Default', function(assert) {
    this.$container.dxBarGauge({ values: [10, 20, 30] });
    this.checkColors(assert, '#e0e0e0', ['#1db2f5', '#f5564a', '#97c95c']);
});

QUnit.test('Palette', function(assert) {
    this.$container.dxBarGauge({
        values: [5, 25, 45, 65],
        palette: 'pastel'
    });
    this.checkColors(assert, '#e0e0e0', ['#bb7862', '#70b3a1', '#bb626a', '#057d85']);
});

QUnit.test('Custom palette', function(assert) {
    this.$container.dxBarGauge({
        values: [1, 2, 3, 4],
        palette: ['c1', 'c2', 'c3', 'c4']
    });
    this.checkColors(assert, '#e0e0e0', ['c1', 'c2', 'c3', 'c4']);
});

QUnit.test('Default palette', function(assert) {
    themeModule.registerTheme({ name: 'defaultPaletteTheme', defaultPalette: ['c1', 'c2', 'c3', 'c4'] });
    this.$container.dxBarGauge({
        theme: 'defaultPaletteTheme',
        values: [1, 2, 3, 4]
    });
    this.checkColors(assert, '#e0e0e0', ['c1', 'c2', 'c3', 'c4']);
});

QUnit.test('Background color', function(assert) {
    this.$container.dxBarGauge({
        values: [10, 20, 30],
        palette: 'office',
        backgroundColor: 'black'
    });
    this.checkColors(assert, 'black', ['#5f8b95', '#ba4d51', '#af8a53']);
});

//  B254364
QUnit.test('Colors order is preserved during increasing bars count', function(assert) {
    this.$container.dxBarGauge({ values: [10, 20, 30, 40], palette: 'office' });
    this.$container.dxBarGauge('instance').values([5, 15, 25, 35, 45]);
    this.checkColors(assert, '#e0e0e0', ['#5f8b95', '#ba4d51', '#af8a53', '#955f71', '#859666']);
});

//  B254364
QUnit.test('Colors order is preserved during decreasing bars count', function(assert) {
    this.$container.dxBarGauge({ values: [10, 20, 30, 40], palette: 'office' });
    this.$container.dxBarGauge('instance').values([5, 15, 25]);
    this.checkColors(assert, '#e0e0e0', ['#5f8b95', '#ba4d51', '#af8a53']);
});

//  Q467887
QUnit.test('Connector color', function(assert) {
    this.$container.dxBarGauge({
        values: [10, 20, 30],
        palette: 'office',
        label: {
            connectorColor: 'red'
        }
    });
    this.checkColors(assert, '#e0e0e0', ['#5f8b95', '#ba4d51', '#af8a53'], 'red');
});

QUnit.test('Hide connector for empty label', function(assert) {
    this.$container.dxBarGauge({
        values: [10, 20],
        animation: {
            enabled: false
        },
        label: {
            customizeText: function(e) {
                if(e.value === 20) {
                    return '';
                }
                return e.valueText;
            }
        }
    });
    const elements = this.getBarsGroup().children;

    assert.strictEqual(elements[0 * 4 + 2]._stored_settings.visibility, null, 'first connector');
    assert.strictEqual(elements[1 * 4 + 2]._stored_settings.visibility, 'hidden', 'empty label connector');
});

QUnit.test('repair visibility for hidden connector', function(assert) {
    this.$container.dxBarGauge({
        values: [20],
        animation: {
            enabled: false
        },
        label: {
            customizeText: function(e) {
                if(e.value === 20) {
                    return '';
                }
                return e.valueText;
            }
        }
    });

    this.$container.dxBarGauge('instance').values([10]);
    const elements = this.getBarsGroup().children;
    assert.strictEqual(elements[0 * 4 + 2]._stored_settings.visibility, null, 'first connector');
});

//  Q467887
QUnit.test('Font color', function(assert) {
    this.$container.dxBarGauge({
        values: [10, 20, 30],
        palette: 'office',
        label: {
            font: { color: 'blue' }
        }
    });
    this.checkColors(assert, '#e0e0e0', ['#5f8b95', '#ba4d51', '#af8a53'], null, 'blue');
});

QUnit.module('Animation', $.extend({}, environment, {
    check: function(assert, angle) {
        assert.strictEqual(this.getBarsGroup().children[1]._stored_settings.startAngle, angle, 'bar position');
    }
}));

QUnit.test('Animation is disabled', function(assert) {
    this.$container.dxBarGauge({
        animation: false,
        values: [50]
    });
    this.check(assert, 90);
});

QUnit.test('Animation is disabled by "enabled" option', function(assert) {
    this.$container.dxBarGauge({
        animation: {
            enabled: false
        },
        values: [50]
    });
    this.check(assert, 90);
});

QUnit.test('Animation is disabled when duration is 0', function(assert) {
    this.$container.dxBarGauge({
        animation: {
            duration: 0
        },
        values: [50]
    });
    this.check(assert, 90);
});

QUnit.test('Animation is disabled when duration is not valid', function(assert) {
    this.$container.dxBarGauge({
        animation: {
            duration: 'test'
        },
        values: [50]
    });
    this.check(assert, 90);
});

QUnit.test('Animation duration', function(assert) {
    this.$container.dxBarGauge({
        animation: {
            duration: '250'
        },
        values: [50]
    });
    const done = assert.async();
    this.getBarsGroup().animationComplete = $.proxy(function() {
        this.check(assert, 90);
        assert.strictEqual(this.getBarsGroup().animateArguments[1].duration, 250, 'duration');
        assert.strictEqual(this.getBarsGroup().animateArguments[1].easing, 'easeOutCubic', 'easing');
        done();
    }, this);
});

QUnit.test('Animation easing', function(assert) {
    this.$container.dxBarGauge({
        animation: {
            easing: 'Linear'
        },
        values: [50]
    });
    const done = assert.async();
    this.getBarsGroup().animationComplete = $.proxy(function() {
        this.check(assert, 90);
        assert.strictEqual(this.getBarsGroup().animateArguments[1].duration, 1000, 'duration');
        assert.strictEqual(this.getBarsGroup().animateArguments[1].easing, 'Linear', 'easing');
        done();
    }, this);
});

QUnit.module('Values', $.extend({}, environment, {
    getGauge: function(options) {
        const gauge = this.$container.dxBarGauge(options).dxBarGauge('instance');
        const group = this.renderer.g.lastCall.returnValue;
        const __animate = group.animate;
        group.animate = function() {
            __animate.apply(this, arguments);
            arguments[1].complete();
        };
        return gauge;
    }
}));

QUnit.test('get values', function(assert) {
    const gauge = this.getGauge({
        values: [10, '20', '30', 40]
    });
    assert.deepEqual(gauge.values(), [10, 20, 30, 40], 'method');
    assert.deepEqual(gauge.option('values'), [10, 20, 30, 40], 'option');
});

QUnit.test('get values - scalar', function(assert) {
    const gauge = this.getGauge({
        values: 50
    });
    assert.deepEqual(gauge.values(), [50], 'method');
    assert.deepEqual(gauge.option('values'), [50], 'option');
});

QUnit.test('get values - undefined', function(assert) {
    const gauge = this.getGauge();
    assert.deepEqual(gauge.values(), [], 'method');
    assert.deepEqual(gauge.option('values'), [], 'option');
});

QUnit.test('some values are out of range', function(assert) {
    const gauge = this.getGauge({
        startValue: -300,
        endValue: 400,
        values: [-500, 100, '300', 600, '1000']
    });
    assert.deepEqual(gauge.values(), [-500, 100, 300, 600, 1000], 'method');
    assert.deepEqual(gauge.option('values'), [-500, 100, 300, 600, 1000], 'option');
});

QUnit.test('some values are not valid', function(assert) {
    const gauge = this.getGauge({
        values: [10, 20, {}, 'test', 'a', 70]
    });
    assert.deepEqual(gauge.values(), [10, 20, NaN, NaN, NaN, 70], 'method');
    assert.deepEqual(gauge.option('values'), [10, 20, NaN, NaN, NaN, 70], 'option');
});

QUnit.test('set values', function(assert) {
    const spy = sinon.spy();
    const gauge = this.getGauge({
        values: [50],
        onDrawn: spy
    });
    spy.reset();

    gauge.values([10, '20', 30]);

    assert.deepEqual(gauge.values(), [10, 20, 30], 'method');
    assert.deepEqual(gauge.option('values'), [10, 20, 30], 'option');
    assert.strictEqual(spy.callCount, 1, 'event');
});

QUnit.test('set "values" option', function(assert) {
    const spy = sinon.spy();
    const gauge = this.getGauge({
        values: [50],
        onDrawn: spy
    });
    spy.reset();

    gauge.option('values', [10, '20', 30]);

    assert.deepEqual(gauge.values(), [10, 20, 30], 'method');
    assert.deepEqual(gauge.option('values'), [10, 20, 30], 'option');
    assert.strictEqual(spy.callCount, 2, 'event');
});

QUnit.test('set values - scalar', function(assert) {
    const spy = sinon.spy();
    const gauge = this.getGauge({
        values: [50],
        onDrawn: spy
    });
    spy.reset();

    gauge.values(80);

    assert.deepEqual(gauge.values(), [80], 'method');
    assert.deepEqual(gauge.option('values'), [80], 'option');
    assert.strictEqual(spy.callCount, 1, 'event');
});

QUnit.test('set values - not valid', function(assert) {
    const spy = sinon.spy();
    const gauge = this.getGauge({
        values: [60, 70],
        onDrawn: spy
    });
    spy.reset();

    gauge.values({});

    assert.deepEqual(gauge.values(), [], 'method');
    assert.deepEqual(gauge.option('values'), [], 'option');
    assert.strictEqual(spy.callCount, 1, 'event');
});

QUnit.test('API method values when container is invisible', function(assert) {
    const gauge = this.getGauge({
        size: { width: 0, height: 0 },
        values: [10, 15]
    });

    gauge.values([1, 2, 3]);
    gauge.option('size', { width: 20, height: 20 });
    gauge.render();

    assert.deepEqual(gauge.values(), [1, 2, 3], 'Gauge value is correct');
});

QUnit.module('Misc', environment);

//  T103336
QUnit.test('Redraw after render to invisible container', function(assert) {
    this.$container.hide();
    this.$container.dxBarGauge({ values: [10, 20, 30] });
    this.$container.show();
    this.$container.dxBarGauge('instance').render();
    assert.ok(1, 'there should be no exceptions');
});

let StubBarWrapper = null;
QUnit.begin(function() {
    StubBarWrapper = vizMocks.stubClass(BarWrapper, null, {
        $constructor: function() {
            StubBarWrapper.instances.push(this);
        }
    });
});

QUnit.module('New tests', {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        StubBarWrapper.instances = [];
        stubBarWrapper(StubBarWrapper);
    },
    afterEach: function() {
        environment.afterEach.apply(this, arguments);
        StubBarWrapper.instances = null;
        restoreBarWrapper();
    }
});

// T112387
QUnit.test('Too many bars', function(assert) {
    this.$container.width(100).height(100).dxBarGauge({
        values: [1, 2, 3, 4, 5, 6, 7, 8],
        relativeInnerRadius: 0.9,
        label: { visible: false }
    });

    const bars = StubBarWrapper.instances;
    assert.strictEqual(bars.length, 8, 'count');
    assert.strictEqual(bars[0].stub('arrange').lastCall.args[0].radius, 50, 'bar 1');
    assert.strictEqual(bars[1].stub('arrange').lastCall.args[0].radius, 49, 'bar 2');
    assert.strictEqual(bars[2].stub('arrange').lastCall.args[0].radius, 48, 'bar 3');
    assert.strictEqual(bars[3].stub('arrange').lastCall.args[0].radius, 47, 'bar 4');
    assert.strictEqual(bars[4].stub('arrange').lastCall.args[0].radius, 46, 'bar 5');
    assert.strictEqual(bars[5].stub('arrange').callCount, 0, 'bar 6');
    assert.strictEqual(bars[6].stub('arrange').callCount, 0, 'bar 7');
    assert.strictEqual(bars[7].stub('arrange').callCount, 0, 'bar 8');
    assert.strictEqual(bars[4].stub('hide').callCount, 0);
    assert.strictEqual(bars[5].stub('hide').callCount, 1);
    assert.strictEqual(bars[6].stub('hide').callCount, 1);
    assert.strictEqual(bars[7].stub('hide').callCount, 1);
});

QUnit.test('Render all hidden bars after resize', function(assert) {
    this.$container.width(100).height(100).dxBarGauge({
        values: [1, 2, 3, 4, 5, 6, 7, 8],
        relativeInnerRadius: 0.9,
        label: { visible: false }
    });

    this.$container.width(1000).height(1000).dxBarGauge('render');

    const bars = StubBarWrapper.instances;
    assert.strictEqual(bars.length, 8, 'count');
    assert.strictEqual(bars[5].stub('arrange').callCount, 1, 'bar 6');
    assert.strictEqual(bars[6].stub('arrange').callCount, 1, 'bar 7');
    assert.strictEqual(bars[7].stub('arrange').callCount, 1, 'bar 8');
});

QUnit.test('Calling drawn', function(assert) {
    const callback = sinon.spy();
    this.$container.width(100).height(100).dxBarGauge({
        values: [1, 2, 3],
        onDrawn: callback
    });

    const done = assert.async();
    this.renderer.animationCompleted = function() {
        setTimeout(function() {
            assert.strictEqual(callback.callCount, 1);
            done();
        }, 10);
    };
});

QUnit.test('Calling drawn / no animation', function(assert) {
    const callback = sinon.spy();
    this.$container.width(100).height(100).dxBarGauge({
        values: [1, 2, 3],
        animation: false,
        onDrawn: callback
    });

    const done = assert.async();
    setTimeout(function() {
        assert.strictEqual(callback.callCount, 1);
        done();
    }, 10);
});

QUnit.module('Gauge in small container', $.extend({}, environment, {
    getGauge: function(options) {
        const gauge = this.$container.dxBarGauge(options).dxBarGauge('instance');
        const group = this.renderer.g.lastCall.returnValue;
        const __animate = group.animate;
        group.animate = function() {
            __animate.apply(this, arguments);
            arguments[1].complete();
        };
        return gauge;
    }
}));

QUnit.test('Draw without animation in small container', function(assert) {
    this.getGauge({
        size: { width: 50, height: 50 },
        values: [1, 2, 3, 4],
        animation: false
    });

    assert.deepEqual(this.getTrackersGroup().children.length, 2);
});

QUnit.test('Draw with animation in small container', function(assert) {
    this.getGauge({
        size: { width: 50, height: 50 },
        values: [1, 2, 3, 4],
        animation: true
    });

    assert.deepEqual(this.getTrackersGroup().children.length, 2);
});

QUnit.test('Draw with animation in small container, change values', function(assert) {
    const gauge = this.getGauge({
        values: [1, 2, 3, 4],
        animation: true
    });

    gauge.option('size', { width: 50, height: 50 });

    gauge.values([5, 6, 7, 8]);

    assert.deepEqual(this.getTrackersGroup().children.length, 2);
});

QUnit.module('Label overlapping behavior', function(hooks) {
    hooks.beforeEach(function() {
        environment.beforeEach.apply(this, arguments);
    });

    hooks.afterEach(function() {
        environment.afterEach.apply(this, arguments);
    });

    QUnit.test('None', function(assert) {
        this.$container.dxBarGauge({
            values: [19, 20],
            resolveLabelOverlapping: 'none',
            animation: {
                enabled: false
            }
        });

        const elements = environment.getBarsGroup.call(this).children;
        const labels = $.grep(elements, function(element) {
            if(element.typeOfNode === 'text') return element;
        });
        const lines = $.grep(elements, function(element) {
            if(element.typeOfNode === 'path') return element;
        });

        assert.equal(labels.length, 2, 'labels count should be correct value');
        assert.equal(lines.length, 2, 'lines and lables should be same count');

        const firstLabelArgs = labels[0].attr.lastCall.args[0];
        assert.strictEqual(firstLabelArgs.text, '19.0', 'first label should have correct text');
        assert.strictEqual(firstLabelArgs.visibility, null, 'first label should be visible');
        assert.strictEqual(lines[0].attr.lastCall.args[0].visibility, null, 'first line should be visible');

        const lastLabelArgs = labels[1].attr.lastCall.args[0];
        assert.strictEqual(lastLabelArgs.text, '20.0', 'last label should have correct text');
        assert.strictEqual(lastLabelArgs.visibility, null, 'last label should be visible');
        assert.strictEqual(lines[1].attr.lastCall.args[0].visibility, null, 'last line should be visible');
    });

    QUnit.test('Hide', function(assert) {
        const bBoxes = [
            // render test
            { x: 0, y: 0, width: 10, height: 10 },

            // compare last label with third label
            { x: 27, y: 29, width: 10, height: 10 },
            { x: 20, y: 20, width: 10, height: 10 },

            // compare third label with second label
            { x: 20, y: 20, width: 10, height: 10 },
            { x: 3, y: 5, width: 10, height: 10 },

            // compare second label with first label
            { x: 3, y: 5, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 }
        ];
        let i = 0;
        renderer = new vizMocks.Renderer();
        renderer.bBoxTemplate = function() {
            const bBox = bBoxes[i];
            i++;
            if(i >= bBoxes.length) {
                i = 0;
            }

            return bBox;
        };

        this.$container.dxBarGauge({
            values: [19, 20, 39, 40],
            resolveLabelOverlapping: 'hide',
            animation: {
                enabled: false
            }
        });

        const elements = environment.getBarsGroup.call(this).children;
        const labels = $.grep(elements, function(element) {
            if(element.typeOfNode === 'text') return element;
        });
        const lines = $.grep(elements, function(element) {
            if(element.typeOfNode === 'path') return element;
        });

        assert.equal(labels.length, 4, 'labels count should be correct value');
        assert.equal(lines.length, 4, 'lines and lables should be same count');

        const firstLabelSettings = labels[0]._stored_settings;
        assert.strictEqual(firstLabelSettings.text, '19.0', 'first label should have correct text');
        assert.strictEqual(firstLabelSettings.visibility, null, 'first label should be visible');
        assert.strictEqual(lines[0]._stored_settings.visibility, null, 'first line should be visible');

        const secondLabelSettings = labels[1]._stored_settings;
        assert.strictEqual(secondLabelSettings.text, '20.0', 'second label should have correct text');
        assert.equal(secondLabelSettings.visibility, 'hidden', 'second label should be hidden');
        assert.strictEqual(lines[1]._stored_settings.visibility, 'hidden', 'second line should be hidden');

        const thirdLabelSettings = labels[2]._stored_settings;
        assert.strictEqual(thirdLabelSettings.text, '39.0', 'third label should have correct text');
        assert.strictEqual(thirdLabelSettings.visibility, null, 'third label should be visible');
        assert.strictEqual(lines[2]._stored_settings.visibility, null, 'third line should be visible');

        const lastLabelSettings = labels[3]._stored_settings;
        assert.strictEqual(lastLabelSettings.text, '40.0', 'last label should have correct text');
        assert.equal(lastLabelSettings.visibility, 'hidden', 'last label should be hidden');
        assert.strictEqual(lines[3]._stored_settings.visibility, 'hidden', 'third line should be hidden');
    });

    QUnit.test('[with animation] None', function(assert) {
        const done = assert.async();
        const that = this;
        this.$container.dxBarGauge({
            values: [19, 20],
            resolveLabelOverlapping: 'none',
            animation: true
        });

        environment.getBarsGroup.call(that).animationComplete = function() {
            const elements = environment.getBarsGroup.call(that).children;
            const labels = $.grep(elements, function(element) {
                if(element.typeOfNode === 'text') return element;
            });
            const lines = $.grep(elements, function(element) {
                if(element.typeOfNode === 'path') return element;
            });

            assert.equal(labels.length, 2, 'labels count should be correct value');
            assert.equal(lines.length, 2, 'lines and lables should be same count');

            const firstLabelArgs = labels[0].attr.lastCall.args[0];
            assert.strictEqual(firstLabelArgs.text, '19.0', 'first label should have correct text');
            assert.strictEqual(firstLabelArgs.visibility, null, 'first label should be visible');
            assert.strictEqual(lines[0].attr.lastCall.args[0].visibility, null, 'first line should be visible');

            const lastLabelArgs = labels[1].attr.lastCall.args[0];
            assert.strictEqual(lastLabelArgs.text, '20.0', 'last label should have correct text');
            assert.strictEqual(lastLabelArgs.visibility, null, 'last label should be visible');
            assert.strictEqual(lines[1].attr.lastCall.args[0].visibility, null, 'last line should be visible');

            done();
        };
    });

    QUnit.test('[with animation] Hide', function(assert) {
        const done = assert.async();
        const that = this;
        const bBoxes = [
            // render test
            { x: 0, y: 0, width: 10, height: 10 },

            // compare last label with third label
            { x: 27, y: 29, width: 10, height: 10 },
            { x: 20, y: 20, width: 10, height: 10 },

            // compare third label with second label
            { x: 20, y: 20, width: 10, height: 10 },
            { x: 3, y: 5, width: 10, height: 10 },

            // compare second label with first label
            { x: 3, y: 5, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 }
        ];
        let i = 0;
        renderer = new vizMocks.Renderer();
        renderer.bBoxTemplate = function() {
            const bBox = bBoxes[i];
            i++;
            if(i >= bBoxes.length) {
                i = 0;
            }

            return bBox;
        };

        this.$container.dxBarGauge({
            values: [19, 20, 39, 40],
            resolveLabelOverlapping: 'hide',
            animation: true
        });

        environment.getBarsGroup.call(that).animationComplete = function() {
            const elements = environment.getBarsGroup.call(that).children;
            const labels = $.grep(elements, function(element) {
                if(element.typeOfNode === 'text') return element;
            });
            const lines = $.grep(elements, function(element) {
                if(element.typeOfNode === 'path') return element;
            });

            assert.equal(labels.length, 4, 'labels count should be correct value');
            assert.equal(lines.length, 4, 'lines and lables should be same count');

            const firstLabelSettings = labels[0]._stored_settings;
            assert.strictEqual(firstLabelSettings.text, '19.0', 'first label should have correct text');
            assert.strictEqual(firstLabelSettings.visibility, null, 'first label should be visible');
            assert.strictEqual(lines[0]._stored_settings.visibility, null, 'first line should be visible');

            const secondLabelSettings = labels[1]._stored_settings;
            assert.strictEqual(secondLabelSettings.text, '20.0', 'second label should have correct text');
            assert.equal(secondLabelSettings.visibility, 'hidden', 'second label should be hidden');
            assert.strictEqual(lines[1]._stored_settings.visibility, 'hidden', 'second line should be hidden');

            const thirdLabelSettings = labels[2]._stored_settings;
            assert.strictEqual(thirdLabelSettings.text, '39.0', 'third label should have correct text');
            assert.strictEqual(thirdLabelSettings.visibility, null, 'third label should be visible');
            assert.strictEqual(lines[2]._stored_settings.visibility, null, 'third line should be visible');

            const lastLabelSettings = labels[3]._stored_settings;
            assert.strictEqual(lastLabelSettings.text, '40.0', 'last label should have correct text');
            assert.equal(lastLabelSettings.visibility, 'hidden', 'last label should be hidden');
            assert.strictEqual(lines[3]._stored_settings.visibility, 'hidden', 'third line should be hidden');

            done();
        };
    });

    QUnit.test('Change mode. None -> Hide', function(assert) {
        this.$container.dxBarGauge({
            values: [19, 20],
            resolveLabelOverlapping: 'none',
            animation: {
                enabled: false
            }
        });

        const bBoxes = [
            // render test
            { x: 0, y: 0, width: 10, height: 10 },

            // compare second label with first label
            { x: 3, y: 5, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 }
        ];
        let i = 0;
        renderer = new vizMocks.Renderer();
        renderer.bBoxTemplate = function() {
            const bBox = bBoxes[i];
            i++;
            if(i >= bBoxes.length) {
                i = 0;
            }

            return bBox;
        };

        this.$container.dxBarGauge({
            resolveLabelOverlapping: 'hide'
        });

        const elements = environment.getBarsGroup.call(this).children;
        const labels = $.grep(elements, function(element) {
            if(element.typeOfNode === 'text') return element;
        });
        const lines = $.grep(elements, function(element) {
            if(element.typeOfNode === 'path') return element;
        });

        assert.equal(labels.length, 2, 'labels count should be correct value');
        assert.equal(lines.length, 2, 'lines and lables should be same count');

        const firstLabelSettings = labels[0]._stored_settings;
        assert.strictEqual(firstLabelSettings.text, '19.0', 'first label should have correct text');
        assert.strictEqual(firstLabelSettings.visibility, null, 'first label should be visible');
        assert.strictEqual(lines[0]._stored_settings.visibility, null, 'first line should be visible');

        const secondLabelSettings = labels[1]._stored_settings;
        assert.strictEqual(secondLabelSettings.text, '20.0', 'second label should have correct text');
        assert.equal(secondLabelSettings.visibility, 'hidden', 'second label should be hidden');
        assert.strictEqual(lines[1]._stored_settings.visibility, 'hidden', 'second line should be hidden');
    });

});

QUnit.module('Checking intersection of labels', function() {
    QUnit.test('Other bar matches with current bar', function(assert) {
        const coords = {
            topLeft: {
                x: 0,
                y: 0
            },
            bottomRight: {
                x: 10,
                y: 10
            }
        };
        const currentBar = new BarWrapper(0, {
            renderer: new vizMocks.Renderer()
        });

        currentBar.calculateLabelCoords = function() { return coords; };

        const otherBar = new BarWrapper(1, {
            renderer: new vizMocks.Renderer()
        });

        otherBar.calculateLabelCoords = function() { return coords; };

        assert.ok(currentBar.checkIntersect(otherBar), 'current bar crossed with other');
    });

    QUnit.test('Other bar shift on right and top of current bar', function(assert) {
        const currentBar = new BarWrapper(0, {
            renderer: new vizMocks.Renderer()
        });

        currentBar.calculateLabelCoords = function() {
            return {
                topLeft: {
                    x: 0,
                    y: 0
                },
                bottomRight: {
                    x: 10,
                    y: 10
                }
            };
        };

        const otherBar = new BarWrapper(1, {
            renderer: new vizMocks.Renderer()
        });

        otherBar.calculateLabelCoords = function() {
            return {
                topLeft: {
                    x: 7,
                    y: 5
                },
                bottomRight: {
                    x: 10,
                    y: 10
                }
            };
        };

        assert.ok(currentBar.checkIntersect(otherBar), 'current bar crossed with other');
    });

    QUnit.test('Other bar shift on left and top of current bar', function(assert) {
        const currentBar = new BarWrapper(0, {
            renderer: new vizMocks.Renderer()
        });

        currentBar.calculateLabelCoords = function() {
            return {
                topLeft: {
                    x: 0,
                    y: 0
                },
                bottomRight: {
                    x: 10,
                    y: 10
                }
            };
        };

        const otherBar = new BarWrapper(1, {
            renderer: new vizMocks.Renderer()
        });

        otherBar.calculateLabelCoords = function() {
            return {
                topLeft: {
                    x: -7,
                    y: 9
                },
                bottomRight: {
                    x: 10,
                    y: 10
                }
            };
        };

        assert.ok(currentBar.checkIntersect(otherBar), 'current bar crossed with other');
    });

    QUnit.test('Other bar shift on right and bottom of current bar', function(assert) {
        const currentBar = new BarWrapper(0, {
            renderer: new vizMocks.Renderer()
        });

        currentBar.calculateLabelCoords = function() {
            return {
                topLeft: {
                    x: 0,
                    y: 0
                },
                bottomRight: {
                    x: 10,
                    y: 10
                }
            };
        };

        const otherBar = new BarWrapper(1, {
            renderer: new vizMocks.Renderer()
        });

        otherBar.calculateLabelCoords = function() {
            return {
                topLeft: {
                    x: 5,
                    y: -4
                },
                bottomRight: {
                    x: 10,
                    y: 10
                }
            };
        };

        assert.ok(currentBar.checkIntersect(otherBar), 'current bar crossed with other');
    });

    QUnit.test('Other bar shift on left and bottom of current bar', function(assert) {
        const currentBar = new BarWrapper(0, {
            renderer: new vizMocks.Renderer()
        });

        currentBar.calculateLabelCoords = function() {
            return {
                topLeft: {
                    x: 0,
                    y: 0
                },
                bottomRight: {
                    x: 10,
                    y: 10
                }
            };
        };

        const otherBar = new BarWrapper(1, {
            renderer: new vizMocks.Renderer()
        });

        otherBar.calculateLabelCoords = function() {
            return {
                topLeft: {
                    x: -9,
                    y: -5
                },
                bottomRight: {
                    x: 10,
                    y: 10
                }
            };
        };

        assert.ok(currentBar.checkIntersect(otherBar), 'current bar crossed with other');
    });

    QUnit.test('Current bar doesn\'t crossed with other bar', function(assert) {
        const currentBar = new BarWrapper(0, {
            renderer: new vizMocks.Renderer()
        });

        currentBar.calculateLabelCoords = function() {
            return {
                topLeft: {
                    x: 0,
                    y: 0
                },
                bottomRight: {
                    x: 10,
                    y: 10
                }
            };
        };

        const otherBar = new BarWrapper(1, {
            renderer: new vizMocks.Renderer()
        });

        otherBar.calculateLabelCoords = function() {
            return {
                topLeft: {
                    x: 10,
                    y: 15
                },
                bottomRight: {
                    x: 15,
                    y: 20
                }
            };
        };

        assert.ok(!currentBar.checkIntersect(otherBar), 'current bar doesn\'t intersect with other');
    });

});
