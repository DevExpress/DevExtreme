"use strict";

/* global createTestContainer */

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    dxCircularGauge = require("viz/circular_gauge"),
    factory = dxCircularGauge.prototype._factory,
    axisModule = require("viz/axes/base_axis"),
    Class = require("core/class"),
    rendererModule = require("viz/core/renderers/renderer");

$('<div id="test-container">').appendTo("#qunit-fixture");

factory.RangeContainer = function(parameters) {
    parameters.className = "test-range-container";
    var item = new TestElement(parameters);
    item.measure = function(layout) {
        return {
            min: layout.radius,
            max: layout.radius + this.options.size
        };
    };
    return item;
};

factory.createIndicator = function(parameters) {
    var item = new TestPointerElement(parameters);
    if(parameters.className === "dxg-value-indicator") {
        item.measure = function(layout) {
            return {
                max: layout.radius,
                inverseHorizontalOffset: this.options.inverseHorizontalOffset,
                inverseVerticalOffset: this.options.inverseVerticalOffset
            };
        };
    } else if(parameters.className === "dxg-subvalue-indicator") {
        item.measure = function(layout) {
            return {
                min: layout.radius,
                max: layout.radius + this.options.size,
                horizontalOffset: this.options.horizontalOffset,
                verticalOffset: this.options.verticalOffset
            };
        };
    }
    return item;
};

var TestElement = Class.inherit({
    ctor: function(parameters) {
        this.renderer = parameters.renderer;
        this.translator = parameters.translator;
        this.container = parameters.container;
        this.owner = parameters.owner;
        this.incidentOccurred = parameters.incidentOccurred;
        this.tracker = parameters.tracker;
        this.className = parameters.className;
        this.root = this.renderer.g().attr({ "class": parameters.className });
    },

    dispose: function() {
        this.disposed = true;
        return this;
    },

    render: function(options) {
        this.root = this.root || this.renderer.g().attr({ "class": this.className });
        this.options = this._options = options;
        this.enabled = true;
        this.root.append(this.owner || this.container);
        return this;
    },

    clean: function() {
        if(this.root) {
            this.root.remove();
            delete this.root;
        }
        return this;
    },

    getOffset: function() {
        return Number(this.options.offset) || 0;
    },

    resize: function(layout) {
        $.extend(this.options, layout);
    }
});

var TestPointerElement = TestElement.inherit({
    value: function(val) {
        if(arguments.length) {
            val = Number(val);
            if(Number(this.options.currentValue) !== val && isFinite(this.translator.translate(val))) {
                this.previousValue = Number(this.options.currentValue);
                this.options.currentValue = val;
            }
            return this;
        }
        return this.options ? Number(this.options.currentValue) : NaN;
    }
});

(function circularGauge() {
    rendererModule.Renderer = sinon.stub();

    sinon.stub(axisModule, "Axis", function(parameters) {
        var axis = new vizMocks.Axis(parameters);
        axis.measureLabels = sinon.stub().returns({
            width: 30,
            height: 15
        });
        axis.getOptions = sinon.stub().returns({
            tick: { length: 5 },
            minorTick: {},
            label: {}
        });
        axis.stub("getCanvas").returns({});
        axis.getCenter = sinon.stub().returns({ x: 100, y: 100 });
        return axis;
    });

    var environment = {
        beforeEach: function() {
            this.renderer = new vizMocks.Renderer();
            this.container = createTestContainer("#test-container", { width: 800, height: 600 });
            rendererModule.Renderer.onCall(0).returns(this.renderer);
            var tooltipRender = new vizMocks.Renderer();
            rendererModule.Renderer.onCall(1).returns(tooltipRender);

        },
        afterEach: function() {
            this.container.remove();
            this.renderer = null;
            axisModule.Axis.reset();
            rendererModule.Renderer.reset();
        }
    };
    var canvas = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 800,
        height: 600
    };

    QUnit.module("General", environment);

    QUnit.test("Gauge creation", function(assert) {
        new dxCircularGauge(this.container, {});

        var scale = axisModule.Axis.getCall(0).returnValue;

        assert.strictEqual(rendererModule.Renderer.firstCall.args[0]["cssClass"], "dxg dxg-circular-gauge", "root class");

        assert.ok(scale.setBusinessRange.lastCall.args[0], "range for scale");
        assert.deepEqual(scale.draw.getCall(0).args[0], canvas, "canvas for scale");

        assert.deepEqual(scale.updateOptions.getCall(0).args[0].startAngle, -135, "start angle");
        assert.deepEqual(scale.updateOptions.getCall(0).args[0].endAngle, 135, "end angle");
    });

    QUnit.test("Ticks indent with positive value. Outside orientation of ticks", function(assert) {
        new dxCircularGauge(this.container, {
            scale: {
                orientation: "outside",
                label: {
                    indentFromTick: 10
                }
            }
        });

        assert.equal(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(1).args[0].label.indentFromAxis, 15, "indent");
    });

    QUnit.test("Ticks indent with positive value. Inside orientation of ticks", function(assert) {
        new dxCircularGauge(this.container, {
            scale: {
                orientation: "inside",
                label: {
                    indentFromTick: 10
                }
            }
        });

        assert.equal(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(1).args[0].label.indentFromAxis, 10, "indent");
    });

    QUnit.test("Ticks indent with positive value. Center orientation of ticks", function(assert) {
        new dxCircularGauge(this.container, {
            scale: {
                orientation: "center",
                label: {
                    indentFromTick: 10
                }
            }
        });

        assert.equal(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(1).args[0].label.indentFromAxis, 12.5, "indent");
    });

    QUnit.test("Ticks indent with negative value. Outside orientation of ticks", function(assert) {
        new dxCircularGauge(this.container, {
            scale: {
                orientation: "outside",
                label: {
                    indentFromTick: -10
                }
            }
        });

        assert.equal(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(1).args[0].label.indentFromAxis, -45, "indent");
    });

    QUnit.test("Ticks indent with negative value. Inside orientation of ticks", function(assert) {
        new dxCircularGauge(this.container, {
            scale: {
                orientation: "inside",
                label: {
                    indentFromTick: -10
                }
            }
        });

        assert.equal(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(1).args[0].label.indentFromAxis, -40, "indent");
    });

    QUnit.test("Ticks indent with negative value. Center orientation of ticks", function(assert) {
        new dxCircularGauge(this.container, {
            scale: {
                orientation: "center",
                label: {
                    indentFromTick: -10
                }
            }
        });

        assert.equal(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(1).args[0].label.indentFromAxis, -42.5, "indent");
    });

    QUnit.test("Ticks indent with zero value", function(assert) {
        new dxCircularGauge(this.container, {
            scale: {
                label: {
                    indentFromTick: 0
                }
            }
        });

        assert.equal(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(1).args[0].label.indentFromAxis, 5, "indent");
    });

    QUnit.module("dxCircularGauge - positioning of elements", {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            this.check = function(assert, options, expected) {
                var gauge = new dxCircularGauge(this.container, $.extend(true, {
                    scale: {
                        size: 10,
                        horizontalOffset: 23,
                        verticalOffset: 18,
                        inverseHorizontalOffset: 17,
                        inverseVerticalOffset: 12
                    },
                    rangeContainer: {
                        offset: 20,
                        size: 8
                    },
                    valueIndicator: {
                        offset: 30,
                        inverseHorizontalOffset: 15,
                        inverseVerticalOffset: 14
                    },
                    subvalueIndicator: {
                        offset: -5,
                        size: 12,
                        horizontalOffset: 19,
                        verticalOffset: 20
                    },
                    value: 50,
                    subvalues: [10, 20]
                }, options));

                assert.strictEqual(gauge._translator.getCodomainStart(), expected.start, "translator codomain start");
                assert.strictEqual(gauge._translator.getCodomainEnd(), expected.end, "translator codomain end");

                assert.strictEqual(gauge._rangeContainer._options.x, expected.x, "range container x");
                assert.strictEqual(gauge._rangeContainer._options.y, expected.y, "range container y");
                assert.strictEqual(gauge._rangeContainer._options.radius, expected.radius - 20, "range container radius");

                assert.strictEqual(gauge._valueIndicator.options.x, expected.x, "main pointer x");
                assert.strictEqual(gauge._valueIndicator.options.y, expected.y, "main pointer y");
                assert.strictEqual(gauge._valueIndicator.options.radius, expected.radius - 30, "main pointer radius");

                assert.strictEqual(gauge._subvalueIndicatorsSet._options.x, expected.x, "sub pointers set x");
                assert.strictEqual(gauge._subvalueIndicatorsSet._options.y, expected.y, "sub pointers set y");
                assert.strictEqual(gauge._subvalueIndicatorsSet._options.radius, expected.radius + 5, "sub pointers set radius");

                var scale = axisModule.Axis.getCall(0).returnValue;
                assert.deepEqual(scale.shift.getCall(0).args, [{ right: expected.x - 100, bottom: expected.y - 100 }], "shift scale");
                assert.equal(scale.draw.callCount, 2, "draw scale");
                assert.equal(scale.measureLabels.callCount, 2, "measure labels of scale");
                assert.deepEqual(scale.measureLabels.getCall(0).args[0], canvas);
                assert.deepEqual(scale.measureLabels.getCall(1).args[0], canvas);
                assert.deepEqual(scale.draw.lastCall.args[0], {
                    width: expected.radius * 2,
                    height: expected.radius * 2
                }, "new radius");
            };
        },
        afterEach: function() {
            environment.afterEach.apply(this, arguments);
        }
    });

    QUnit.test("Default", function(assert) {
        this.check(assert, null, { x: 400, y: 348, radius: 311, start: 225, end: -45 });
    });

    QUnit.test("Half circle - up", function(assert) {
        this.check(assert, {
            geometry: { startAngle: "180", endAngle: "0" }
        }, { x: 400, y: 489, radius: 355, start: 180, end: 0 });
    });

    QUnit.test("Half circle - down", function(assert) {
        this.check(assert, {
            geometry: { startAngle: 0, endAngle: 180 }
        }, { x: 400, y: 111, radius: 355, start: 0, end: -180 });
    });

    QUnit.test("Half circle - left", function(assert) {
        this.check(assert, {
            geometry: { startAngle: -90, endAngle: 90 }
        }, { x: 547, y: 300, radius: 263, start: 270, end: 90 });
    });

    QUnit.test("Half circle - right", function(assert) {
        this.check(assert, {
            geometry: { startAngle: 90, endAngle: "-90" }
        }, { x: 254, y: 300, radius: 263, start: 90, end: -90 });
    });

    QUnit.test("Quarter circle - I", function(assert) {
        this.check(assert, {
            geometry: { startAngle: "90", endAngle: 360 }
        }, { x: 111, y: 586, radius: 549, start: 90, end: 0 });
    });

    QUnit.test("Quarter circle - II", function(assert) {
        this.check(assert, {
            geometry: { startAngle: "-180", endAngle: "-270" }
        }, { x: 690, y: 586, radius: 549, start: 180, end: 90 });
    });

    QUnit.test("Quarter circle - III", function(assert) {
        this.check(assert, {
            geometry: { startAngle: -90, endAngle: 180 }
        }, { x: 690, y: 14, radius: 549, start: 270, end: 180 });
    });

    QUnit.test("Quarter circle - IV", function(assert) {
        this.check(assert, {
            geometry: { startAngle: "720", endAngle: 270 }
        }, { x: 111, y: 14, radius: 549, start: 0, end: -90 });
    });

    QUnit.test("Full circle", function(assert) {
        this.check(assert, {
            geometry: { startAngle: 0, endAngle: 0 }
        }, { x: 400, y: 300, radius: 263, start: 0, end: -360 });
    });

    QUnit.test("[150; -80]", function(assert) {
        this.check(assert, {
            geometry: { startAngle: 150, endAngle: "-80" }
        }, { x: 381, y: 302, radius: 265, start: 150, end: -80 });
    });

    QUnit.test("[90; 180]", function(assert) {
        this.check(assert, {
            geometry: { startAngle: 90, endAngle: 180 }
        }, { x: 400, y: 300, radius: 263, start: 90, end: -180 });
    });

    QUnit.test("[-20; 160]", function(assert) {
        this.check(assert, {
            geometry: { startAngle: "-20", endAngle: "160" }
        }, { x: 412, y: 174, radius: 367, start: 340, end: 160 });
    });

    QUnit.test("[test, undefined] (validation)", function(assert) {
        this.check(assert, {
            geometry: { startAngle: "test", endAngle: undefined }
        }, { x: 400, y: 348, radius: 311, start: 225, end: -45 });
    });

    QUnit.test("[{}, 90] (validation)", function(assert) {
        this.check(assert, {
            geometry: { startAngle: {}, endAngle: 90 }
        }, { x: 571, y: 348, radius: 311, start: 225, end: 90 });
    });

    QUnit.test("[-80, a] (validation)", function(assert) {
        this.check(assert, {
            geometry: { startAngle: -80, endAngle: "a" }
        }, { x: 400, y: 300, radius: 263, start: 280, end: -45 });
    });

    //  B232105
    QUnit.test("Offset validation", function(assert) {
        var gauge = new dxCircularGauge(this.container, {
            scale: {
                size: 10,
                horizontalOffset: 23,
                verticalOffset: 18,
                inverseHorizontalOffset: 17,
                inverseVerticalOffset: 12
            },
            rangeContainer: {
                offset: "test",
                size: 8
            },
            valueIndicator: {
                offset: {},
                inverseHorizontalOffset: 15,
                inverseVerticalOffset: 14
            },
            subvalueIndicator: {
                offset: [],
                size: 12,
                horizontalOffset: 19,
                verticalOffset: 20
            },
            value: 50,
            subvalues: [10, 20]
        });
        var x = 400,
            y = 348,
            radius = 316;

        assert.strictEqual(gauge._rangeContainer._options.x, x, "range container x");
        assert.strictEqual(gauge._rangeContainer._options.y, y, "range container y");
        assert.strictEqual(gauge._rangeContainer._options.radius, radius, "range container radius");

        assert.strictEqual(gauge._valueIndicator.options.x, x, "main pointer x");
        assert.strictEqual(gauge._valueIndicator.options.y, y, "main pointer y");
        assert.strictEqual(gauge._valueIndicator.options.radius, radius, "main pointer radius");

        assert.strictEqual(gauge._subvalueIndicatorsSet._options.x, x, "sub pointers set x");
        assert.strictEqual(gauge._subvalueIndicatorsSet._options.y, y, "sub pointers set y");
        assert.strictEqual(gauge._subvalueIndicatorsSet._options.radius, radius, "sub pointers set radius");
    });

    //  B238939, B238978
    QUnit.test("[123; 123]", function(assert) {
        this.check(assert, {
            geometry: { startAngle: 123, endAngle: 123 }
        }, { x: 400, y: 300, radius: 263, start: 123, end: -237 });
    });

    QUnit.test("Default after apply subvalues", function(assert) {
        var gauge = new dxCircularGauge(this.container, {
            scale: {
                size: 10,
                horizontalOffset: 23,
                verticalOffset: 18,
                inverseHorizontalOffset: 17,
                inverseVerticalOffset: 12
            },
            rangeContainer: {
                offset: 20,
                size: 8
            },
            valueIndicator: {
                offset: 30,
                inverseHorizontalOffset: 15,
                inverseVerticalOffset: 14
            },
            subvalueIndicator: {
                offset: -5,
                size: 12,
                horizontalOffset: 19,
                verticalOffset: 20
            },
            value: 50
        });

        gauge.option("subvalues", [10, 20]);

        var expected = { x: 400, y: 348, radius: 311, start: 225, end: -45 };

        assert.strictEqual(gauge._translator.getCodomainStart(), expected.start, "translator codomain start");
        assert.strictEqual(gauge._translator.getCodomainEnd(), expected.end, "translator codomain end");

        assert.strictEqual(gauge._rangeContainer._options.x, expected.x, "range container x");
        assert.strictEqual(gauge._rangeContainer._options.y, expected.y, "range container y");
        assert.strictEqual(gauge._rangeContainer._options.radius, expected.radius - 20, "range container radius");

        assert.strictEqual(gauge._valueIndicator.options.x, expected.x, "main pointer x");
        assert.strictEqual(gauge._valueIndicator.options.y, expected.y, "main pointer y");
        assert.strictEqual(gauge._valueIndicator.options.radius, expected.radius - 30, "main pointer radius");

        assert.strictEqual(gauge._subvalueIndicatorsSet._options.x, expected.x, "sub pointers set x");
        assert.strictEqual(gauge._subvalueIndicatorsSet._options.y, expected.y, "sub pointers set y");
        assert.strictEqual(gauge._subvalueIndicatorsSet._options.radius, expected.radius + 5, "sub pointers set radius");

        var scale = axisModule.Axis.getCall(0).returnValue;
        assert.deepEqual(scale.shift.getCall(1).args, [{ right: expected.x - 100, bottom: expected.y - 100 }], "shift scale");
        assert.equal(scale.draw.callCount, 6, "draw scale");
        assert.equal(scale.measureLabels.callCount, 6, "measure labels of scale");
        assert.deepEqual(scale.measureLabels.getCall(0).args[0], canvas);
        assert.deepEqual(scale.measureLabels.getCall(1).args[0], canvas);
        assert.deepEqual(scale.measureLabels.getCall(2).args[0], canvas);
        assert.deepEqual(scale.measureLabels.getCall(3).args[0], canvas);
        assert.deepEqual(scale.measureLabels.getCall(4).args[0], canvas);
        assert.deepEqual(scale.measureLabels.getCall(5).args[0], canvas);
        assert.deepEqual(scale.draw.getCall(1).args[0], {
            width: expected.radius * 2,
            height: expected.radius * 2
        }, "new radius");
        assert.deepEqual(gauge._canvas, canvas, "gauge canvas is not changed");
    });
})();
