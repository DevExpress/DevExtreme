/* global createTestContainer, currentTest */

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    vizMocks = require("../../helpers/vizMocks.js"),
    dxBarGauge = require("viz/bar_gauge"),
    rendererModule = require("viz/core/renderers/renderer"),
    loadingIndicatorModule = require("viz/core/loading_indicator"),
    titleModule = require("viz/core/title"),
    tooltipModule = require("viz/core/tooltip"),
    barGaugeModule = require("viz/gauges/bar_gauge"),
    exportModule = require("viz/core/export"),
    themeModule = require("viz/themes"),
    BarWrapper = barGaugeModule.BarWrapper,
    stubBarWrapper = barGaugeModule.stubBarWrapper,
    restoreBarWrapper = barGaugeModule.restoreBarWrapper;

$('<div id="test-container">').appendTo("#qunit-fixture");

QUnit.begin(function() {
    rendererModule.Renderer = sinon.spy(function() {
        var test = currentTest();
        test.renderer = new vizMocks.Renderer();
        test.renderer.g = sinon.spy(function() {
            var group = new vizMocks.Element();
            group.animate = function(settings, options) {
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
                    var that = this,
                        step = arguments[1].step,
                        complete = arguments[1].complete || noop,
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
    var StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip, { isEnabled: function() { return "tooltip_enabled"; } });
    tooltipModule.Tooltip = function(parameters) {
        return new StubTooltip(parameters);
    };
});

var environment = {
    beforeEach: function() {
        this.$container = createTestContainer('#test-container', { width: 400, height: 300 });
    },
    afterEach: function() {
        this.$container.remove();
        rendererModule.Renderer.reset();
        this.renderer = null;

    },
    getBarsGroup: function() {
        return this.renderer.g.getCall(1).returnValue;
    },
    getTrackersGroup: function() {
        return this.renderer.g.getCall(0).returnValue;
    }
};

QUnit.module('General', environment);

QUnit.test('Instance type', function(assert) {
    var gauge = this.$container.dxBarGauge().dxBarGauge('instance');
    assert.ok(gauge instanceof dxBarGauge, 'instance of dxBarGauge');
});

QUnit.test('Groups creation', function(assert) {
    this.$container.dxBarGauge();
    assert.strictEqual(rendererModule.Renderer.lastCall.args[0]['cssClass'], 'dxg dxbg-bar-gauge', 'root class');
    var group = this.getBarsGroup();
    assert.deepEqual(group.attr.firstCall.args, [{ "class": "dxbg-bars" }], "bars group settings");
    assert.deepEqual(group.linkOn.lastCall.args, [this.renderer.root, "bars"], "bars group is linked to container");

});

QUnit.test('Groups disposing', function(assert) {
    this.$container.dxBarGauge().remove();
    assert.deepEqual(this.getBarsGroup().linkOff.lastCall.args, [], "bars group is unlinked");
});

QUnit.test('Bars creation', function(assert) {
    this.$container.dxBarGauge({
        values: [10, 20, 30]
    });
    var elements = this.getBarsGroup().children;
    assert.strictEqual(elements.length, 12, 'elements count');
    $.each([null, null, null], function(i) {
        var message = ' - ' + (i + 1),
            k = i * 4;
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
    var elements = this.getBarsGroup().children;
    assert.strictEqual(elements.length, 6, 'elements count');
    $.each([null, null, null], function(i) {
        var message = ' - ' + (i + 1),
            k = i * 2;
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
        var elements = this.getBarsGroup().children,
            trackers = this.getTrackersGroup().children,
            step = elements.length / trackers.length,
            i = 0, ii = trackers.length,
            elementSettings,
            message;
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
        var elements = this.getBarsGroup().children,
            trackers = this.getTrackersGroup().children,
            step = elements.length / trackers.length,
            i = 0, ii = trackers.length,
            elementSettings,
            message;
        for(; i < ii; ++i) {
            message = ' - ' + (i + 1);
            elementSettings = elements[i * step + 2]._stored_settings;
            assert.deepEqual({
                points: elementSettings.points,
                "stroke-width": elementSettings["stroke-width"]
            }, {
                points: [commonSettings.x, commonSettings.y - linePositions[i][0], commonSettings.x, commonSettings.y - commonSettings.textRadius],
                "stroke-width": commonSettings.lineWidth
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
    QUnit.test(name, function(assert) {
        this.$container.dxBarGauge($.extend({}, options, { animation: false }));
        callback.apply(this, arguments);
    });
    QUnit.test(name + ' // animation', function(assert) {
        var done = assert.async(),
            test = this,
            args = arguments;
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
        [[33, 220], [120, 16], [374, 140]],
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
    var gauge = this.$container.dxBarGauge({
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
    var done = assert.async(),
        gauge = this.$container.dxBarGauge({
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
        [[68, 55], [370, 212]],
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
        [[68, 55], [370, 212]],
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
        [[58, 67], [120, 16]],
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
        [[25, 180], [53, 74]],
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
    this.checkTexts(assert, { x: 200, y: 174, textRadius: 164, lineWidth: 2 }, [[43, 0]], [[200, -3]], ['50.0']);
});

QUnit.test('no values', function(assert) {
    this.$container.dxBarGauge({
        animation: false
    });
    assert.strictEqual(this.getBarsGroup().children.length, 1, 'count');
    var settings = this.getBarsGroup().children[0]._stored_settings;
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
    var done = assert.async();
    this.$container.dxBarGauge({});
    assert.strictEqual(this.getBarsGroup().children.length, 1, 'count');
    var settings = this.getBarsGroup().children[0]._stored_settings;
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
    var settings = this.getBarsGroup().children[0]._stored_settings;
    delete settings.fill;
    assert.deepEqual(settings, {
        x: 250, y: 174, outerRadius: 144, innerRadius: 43, startAngle: -45, endAngle: 225,
        "stroke-linejoin": "round"
    });
});

QUnit.test('Values are changed', function(assert) {
    var done = assert.async(),
        gauge = this.$container.dxBarGauge({
            values: [10, 20, 30]
        }).dxBarGauge('instance');
    var group = this.getBarsGroup();
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
    var done = assert.async(),
        gauge = this.$container.dxBarGauge({
            values: [10, 20, 30]
        }).dxBarGauge('instance');
    var group = this.getBarsGroup();
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

QUnit.module('Colors', $.extend({}, environment, {
    checkColors: function(assert, backgroundColor, colors, lineColor, textColor) {
        var elements = this.getBarsGroup().children,
            i = 0, ii = elements.length / 4,
            message;
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
    themeModule.registerTheme({ name: "defaultPaletteTheme", defaultPalette: ['c1', 'c2', 'c3', 'c4'] });
    this.$container.dxBarGauge({
        theme: "defaultPaletteTheme",
        values: [1, 2, 3, 4]
    });
    this.checkColors(assert, '#e0e0e0', ['c1', 'c2', 'c3', 'c4']);
});

QUnit.test('Background color', function(assert) {
    this.$container.dxBarGauge({
        values: [10, 20, 30],
        palette: "office",
        backgroundColor: 'black'
    });
    this.checkColors(assert, 'black', ['#5f8b95', '#ba4d51', '#af8a53']);
});

//  B254364
QUnit.test('Colors order is preserved during increasing bars count', function(assert) {
    this.$container.dxBarGauge({ values: [10, 20, 30, 40], palette: "office" });
    this.$container.dxBarGauge('instance').values([5, 15, 25, 35, 45]);
    this.checkColors(assert, '#e0e0e0', ['#5f8b95', '#ba4d51', '#af8a53', '#955f71', '#859666']);
});

//  B254364
QUnit.test('Colors order is preserved during decreasing bars count', function(assert) {
    this.$container.dxBarGauge({ values: [10, 20, 30, 40], palette: "office" });
    this.$container.dxBarGauge('instance').values([5, 15, 25]);
    this.checkColors(assert, '#e0e0e0', ['#5f8b95', '#ba4d51', '#af8a53']);
});

//  Q467887
QUnit.test('Connector color', function(assert) {
    this.$container.dxBarGauge({
        values: [10, 20, 30],
        palette: "office",
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
                    return "";
                }
                return e.valueText;
            }
        }
    });
    var elements = this.getBarsGroup().children;

    assert.strictEqual(elements[0 * 4 + 2]._stored_settings.visibility, null, "first connector");
    assert.strictEqual(elements[1 * 4 + 2]._stored_settings.visibility, "hidden", "empty label connector");
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
                    return "";
                }
                return e.valueText;
            }
        }
    });

    this.$container.dxBarGauge("instance").values([10]);
    var elements = this.getBarsGroup().children;
    assert.strictEqual(elements[0 * 4 + 2]._stored_settings.visibility, null, "first connector");
});

//  Q467887
QUnit.test('Font color', function(assert) {
    this.$container.dxBarGauge({
        values: [10, 20, 30],
        palette: "office",
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
    var done = assert.async();
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
    var done = assert.async();
    this.getBarsGroup().animationComplete = $.proxy(function() {
        this.check(assert, 90);
        assert.strictEqual(this.getBarsGroup().animateArguments[1].duration, 1000, 'duration');
        assert.strictEqual(this.getBarsGroup().animateArguments[1].easing, 'Linear', 'easing');
        done();
    }, this);
});

QUnit.module('Values', $.extend({}, environment, {
    getGauge: function(options) {
        var gauge = this.$container.dxBarGauge(options).dxBarGauge('instance'),
            group = this.renderer.g.lastCall.returnValue,
            __animate = group.animate;
        group.animate = function() {
            __animate.apply(this, arguments);
            arguments[1].complete();
        };
        return gauge;
    }
}));

QUnit.test('get values', function(assert) {
    var gauge = this.getGauge({
        values: [10, '20', '30', 40]
    });
    assert.deepEqual(gauge.values(), [10, 20, 30, 40], 'method');
    assert.deepEqual(gauge.option('values'), [10, 20, 30, 40], 'option');
});

QUnit.test('get values - scalar', function(assert) {
    var gauge = this.getGauge({
        values: 50
    });
    assert.deepEqual(gauge.values(), [50], 'method');
    assert.deepEqual(gauge.option('values'), [50], 'option');
});

QUnit.test('get values - undefined', function(assert) {
    var gauge = this.getGauge();
    assert.deepEqual(gauge.values(), [], 'method');
    assert.deepEqual(gauge.option('values'), [], 'option');
});

QUnit.test('some values are out of range', function(assert) {
    var gauge = this.getGauge({
        startValue: -300,
        endValue: 400,
        values: [-500, 100, '300', 600, '1000']
    });
    assert.deepEqual(gauge.values(), [-500, 100, 300, 600, 1000], 'method');
    assert.deepEqual(gauge.option('values'), [-500, 100, 300, 600, 1000], 'option');
});

QUnit.test('some values are not valid', function(assert) {
    var gauge = this.getGauge({
        values: [10, 20, {}, 'test', 'a', 70]
    });
    assert.deepEqual(gauge.values(), [10, 20, NaN, NaN, NaN, 70], 'method');
    assert.deepEqual(gauge.option('values'), [10, 20, NaN, NaN, NaN, 70], 'option');
});

QUnit.test('set values', function(assert) {
    var spy = sinon.spy(),
        gauge = this.getGauge({
            values: [50],
            onDrawn: spy
        });
    spy.reset();

    gauge.values([10, '20', 30]);

    assert.deepEqual(gauge.values(), [10, 20, 30], 'method');
    assert.deepEqual(gauge.option('values'), [10, 20, 30], 'option');
    assert.strictEqual(spy.callCount, 1, "event");
});

QUnit.test('set "values" option', function(assert) {
    var spy = sinon.spy(),
        gauge = this.getGauge({
            values: [50],
            onDrawn: spy
        });
    spy.reset();

    gauge.option("values", [10, '20', 30]);

    assert.deepEqual(gauge.values(), [10, 20, 30], 'method');
    assert.deepEqual(gauge.option('values'), [10, 20, 30], 'option');
    assert.strictEqual(spy.callCount, 2, "event");
});

QUnit.test('set values - scalar', function(assert) {
    var spy = sinon.spy(),
        gauge = this.getGauge({
            values: [50],
            onDrawn: spy
        });
    spy.reset();

    gauge.values(80);

    assert.deepEqual(gauge.values(), [80], 'method');
    assert.deepEqual(gauge.option('values'), [80], 'option');
    assert.strictEqual(spy.callCount, 1, "event");
});

QUnit.test('set values - not valid', function(assert) {
    var spy = sinon.spy(),
        gauge = this.getGauge({
            values: [60, 70],
            onDrawn: spy
        });
    spy.reset();

    gauge.values({});

    assert.deepEqual(gauge.values(), [], 'method');
    assert.deepEqual(gauge.option('values'), [], 'option');
    assert.strictEqual(spy.callCount, 1, "event");
});

QUnit.test('API method values when container is invisible', function(assert) {
    var gauge = this.getGauge({
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

var StubBarWrapper = null;
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

    var bars = StubBarWrapper.instances;
    assert.strictEqual(bars.length, 5, 'count');
    assert.strictEqual(bars[0].stub('arrange').lastCall.args[0].radius, 50, 'bar 1');
    assert.strictEqual(bars[1].stub('arrange').lastCall.args[0].radius, 49, 'bar 2');
    assert.strictEqual(bars[2].stub('arrange').lastCall.args[0].radius, 48, 'bar 3');
    assert.strictEqual(bars[3].stub('arrange').lastCall.args[0].radius, 47, 'bar 4');
    assert.strictEqual(bars[4].stub('arrange').lastCall.args[0].radius, 46, 'bar 5');
});

QUnit.test('Calling drawn', function(assert) {
    var callback = sinon.spy();
    this.$container.width(100).height(100).dxBarGauge({
        values: [1, 2, 3],
        onDrawn: callback
    });

    var done = assert.async();
    this.renderer.animationCompleted = function() {
        setTimeout(function() {
            assert.strictEqual(callback.callCount, 1);
            done();
        }, 10);
    };
});

QUnit.test('Calling drawn / no animation', function(assert) {
    var callback = sinon.spy();
    this.$container.width(100).height(100).dxBarGauge({
        values: [1, 2, 3],
        animation: false,
        onDrawn: callback
    });

    var done = assert.async();
    setTimeout(function() {
        assert.strictEqual(callback.callCount, 1);
        done();
    }, 10);
});
