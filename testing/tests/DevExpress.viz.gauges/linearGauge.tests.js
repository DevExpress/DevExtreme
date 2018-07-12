"use strict";

/* global createTestContainer */

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    dxLinearGauge = require("viz/linear_gauge"),
    factory = dxLinearGauge.prototype._factory,
    axisModule = require("viz/axes/base_axis"),
    Class = require("core/class"),
    rendererModule = require("viz/core/renderers/renderer");

$('<div id="test-container">').appendTo("#qunit-fixture");


factory.RangeContainer = function(parameters) {
    parameters.className = "test-range-container";
    var item = new TestElement(parameters);
    item.measure = function(layout) {
        return {
            min: (this.vertical ? layout.x : layout.y),
            max: (this.vertical ? layout.x : layout.y) + this.options.size,
        };
    };
    return item;
};

factory.createIndicator = function(parameters) {
    var item = new TestPointerElement(parameters);
    if(parameters.className === "dxg-value-indicator") {
        item.measure = function(layout) {
            return {
                min: (this.vertical ? layout.x : layout.y) - this.options.size / 2,
                max: (this.vertical ? layout.x : layout.y) + this.options.size / 2
            };
        };
    } else if(parameters.className === "dxg-subvalue-indicator") {
        item.measure = function(layout) {
            return {
                min: (this.vertical ? layout.x : layout.y),
                max: (this.vertical ? layout.x : layout.y) + this.options.size,
                indent: this.options.indent
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
        this.options = options;
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

(function linearGauge() {
    rendererModule.Renderer = sinon.stub();

    sinon.stub(axisModule, "Axis", function(parameters) {
        var axis = new vizMocks.Axis(parameters);
        axis.measureLabels = sinon.stub().returns({
            width: 30,
            height: 15,
            y: -15
        });
        axis.getOptions = sinon.stub().returns({
            tick: {},
            minorTick: {},
            label: {}
        });
        return axis;
    });

    var environment = {
        beforeEach: function() {
            this.renderer = new vizMocks.Renderer();
            this.container = createTestContainer("#test-container", { width: 800, height: 600 });
            rendererModule.Renderer.onCall(0).returns(this.renderer);
            var tooltipRenderer = new vizMocks.Renderer();
            rendererModule.Renderer.onCall(1).returns(tooltipRenderer);
        },
        afterEach: function() {
            this.container.remove();
            axisModule.Axis.reset();
            rendererModule.Renderer.reset();
            this.renderer = null;
            delete this.container;
        }
    };

    QUnit.module("General", environment);

    QUnit.test("Gauge creation", function(assert) {
        new dxLinearGauge(this.container, {});

        var scale = axisModule.Axis.getCall(0).returnValue;

        assert.strictEqual(rendererModule.Renderer.firstCall.args[0]["cssClass"], "dxg dxg-linear-gauge", "root class");
        assert.ok(scale.setBusinessRange.lastCall.args[0], "range passed to scale");
        assert.deepEqual(scale.draw.getCall(0).args[0], { bottom: 0, top: 0, left: 0, right: 0, height: 600, width: 800 }, "canvas passed to scale");
    });

    QUnit.test("Ticks indent with negative value. Horizontal. Top vertical orientation of ticks", function(assert) {
        new dxLinearGauge(this.container, {
            geometry: {
                orientation: "horizontal"
            },
            scale: {
                verticalOrientation: "top",
                label: {
                    indentFromTick: -10
                }
            }
        });

        assert.equal(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(1).args[0].label.indentFromAxis, 15, "indent");
    });

    QUnit.test("Ticks indent with negative value. Horizontal. Bottom vertical orientation of ticks", function(assert) {
        new dxLinearGauge(this.container, {
            geometry: {
                orientation: "horizontal"
            },
            scale: {
                verticalOrientation: "bottom",
                label: {
                    indentFromTick: -10
                }
            }
        });

        assert.equal(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(1).args[0].label.indentFromAxis, 10, "indent");
    });

    QUnit.test("Ticks indent with zero value", function(assert) {
        new dxLinearGauge(this.container, {
            scale: {
                label: {
                    indentFromTick: 0
                }
            }
        });

        assert.equal(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(1).args[0].label.indentFromAxis, 0, "indent");
    });

    QUnit.test("Ticks indent with positive value. Horizontal", function(assert) {
        new dxLinearGauge(this.container, {
            geometry: {
                orientation: "horizontal"
            },
            scale: {
                label: {
                    indentFromTick: 10
                }
            }
        });

        assert.equal(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(1).args[0].label.indentFromAxis, -30, "indent");
    });

    QUnit.test("Ticks indent with positive value. Vertical", function(assert) {
        new dxLinearGauge(this.container, {
            geometry: {
                orientation: "vertical"
            },
            scale: {
                label: {
                    indentFromTick: 10
                }
            }
        });

        assert.equal(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(1).args[0].label.indentFromAxis, -45, "indent");
    });

    QUnit.test("Pass correct base value into indicator", function(assert) {
        var gauge = new dxLinearGauge(this.container, {
            scale: {
                startValue: -1000,
                endValue: 1000
            },
            valueIndicator: {
                type: "rangebar",
                baseValue: 0
            },
            value: 50,
        });

        assert.strictEqual(gauge._valueIndicator.options.baseValue, 0);
    });

    QUnit.module("HorizontalGauge - positioning of elements", environment);

    QUnit.test("Default", function(assert) {
        var gauge = new dxLinearGauge(this.container, {
            scale: {
                size: 10,
                label: {
                    indentFromAxis: 10
                }
            },
            rangeContainer: {
                offset: 20,
                size: 8
            },
            valueIndicator: {
                offset: 30,
                size: 16
            },
            subvalueIndicator: {
                offset: -5,
                size: 12,
                indent: 17
            },
            value: 50,
            subvalues: [10, 20]
        });

        assert.strictEqual(gauge._translator.getCodomainStart(), 17, "translator codomain start");
        assert.strictEqual(gauge._translator.getCodomainEnd(), 783, "translator codomain end");

        assert.strictEqual(gauge._rangeContainer.options.y, 314, "range container y");

        assert.strictEqual(gauge._valueIndicator.options.y, 324, "main pointer y");

        assert.strictEqual(gauge._subvalueIndicatorsSet._options.y, 289, "sub pointers set y");

        var scale = axisModule.Axis.getCall(0).returnValue;
        assert.deepEqual(scale.shift.getCall(0).args, [{ left: 0, top: -294 }], "shift scale");
        assert.equal(scale.draw.callCount, 2, "draw scale");
        assert.equal(scale.measureLabels.callCount, 2, "measure labels of scale");
        assert.deepEqual(scale.measureLabels.getCall(0).args[0], {
            bottom: 0,
            height: 600,
            left: 0,
            right: 0,
            top: 0,
            width: 800
        });
        assert.deepEqual(scale.measureLabels.getCall(1).args[0], {
            bottom: 0,
            height: 600,
            left: 0,
            right: 0,
            top: 0,
            width: 800
        });
        assert.deepEqual(scale.draw.lastCall.args[0], {
            bottom: 0,
            height: 600,
            left: 17,
            right: 17,
            top: 0,
            width: 800
        }, "new canvas for scale");

    });

    QUnit.test("Scale vertical orientation = top", function(assert) {
        new dxLinearGauge(this.container, {
            geometry: {
                orientation: "horizontal"
            },
            scale: {
                size: 10,
                verticalOrientation: "top"
            },
            rangeContainer: {
                offset: 20,
                size: 8
            },
            valueIndicator: {
                offset: 30,
                size: 16
            },
            subvalueIndicator: {
                offset: -5,
                size: 12,
                indent: 17
            }
        });
        var scale = axisModule.Axis.getCall(0).returnValue;

        assert.deepEqual(scale.shift.getCall(0).args, [{ left: 0, top: -296 }], "scale shifting");
        assert.deepEqual(scale.draw.lastCall.args[0], {
            bottom: 0,
            height: 600,
            left: 15,
            right: 15,
            top: 0,
            width: 800
        }, "new canvas for scale");
    });

    QUnit.test("Scale vertical orientation = bottom", function(assert) {
        new dxLinearGauge(this.container, {
            geometry: {
                orientation: "horizontal"
            },
            scale: {
                size: 10,
                verticalOrientation: "bottom"
            },
            rangeContainer: {
                offset: 20,
                size: 8
            },
            valueIndicator: {
                offset: 30,
                size: 16
            },
            subvalueIndicator: {
                offset: -5,
                size: 12,
                indent: 17
            }
        });
        var scale = axisModule.Axis.getCall(0).returnValue;

        assert.deepEqual(scale.shift.getCall(0).args, [{ left: 0, top: -294 }], "scale shifting");
        assert.deepEqual(scale.draw.lastCall.args[0], {
            bottom: 0,
            height: 600,
            left: 15,
            right: 15,
            top: 0,
            width: 800
        }, "new canvas for scale");
    });

    //  B232105
    QUnit.test("Offset validation", function(assert) {
        var gauge = new dxLinearGauge(this.container, {
            scale: {
                size: 10,
                label: {
                    indentFromAxis: 10
                }
            },
            rangeContainer: {
                offset: "test",
                size: 8
            },
            valueIndicator: {
                offset: {},
                size: 16
            },
            subvalueIndicator: {
                offset: [],
                size: 12,
                indent: 17
            },
            value: 50,
            subvalues: [10, 20]
        });
        var scale = axisModule.Axis.getCall(0).returnValue;

        assert.strictEqual(gauge._translator.getCodomainStart(), 17, "translator codomain start");
        assert.strictEqual(gauge._translator.getCodomainEnd(), 783, "translator codomain end");

        assert.deepEqual(scale.shift.getCall(0).args, [{ left: 0, top: -307 }], "scale shifting");
        assert.deepEqual(scale.draw.lastCall.args[0], {
            bottom: 0,
            height: 600,
            left: 17,
            right: 17,
            top: 0,
            width: 800
        }, "new canvas for scale");

        assert.strictEqual(gauge._rangeContainer.options.y, 307, "range container y");
        assert.strictEqual(gauge._valueIndicator.options.y, 307, "main pointer y");
        assert.strictEqual(gauge._subvalueIndicatorsSet._options.y, 307, "sub pointers set y");
    });

    // T569322
    QUnit.test("Indents of labels", function(assert) {
        new dxLinearGauge(this.container, {
            scale: {
                startValue: 0,
                endValue: 30
            }
        });
        var scale = axisModule.Axis.getCall(0).returnValue;

        assert.strictEqual(scale.updateOptions.lastCall.calledAfter(scale.setBusinessRange.lastCall), true);
    });

    QUnit.module("VerticalGauge - positioning of elements", environment);

    QUnit.test("Default", function(assert) {
        var gauge = new dxLinearGauge(this.container, {
            geometry: {
                orientation: "vertical"
            },
            scale: {
                size: 10
            },
            rangeContainer: {
                offset: 20,
                size: 8
            },
            valueIndicator: {
                offset: 30,
                size: 16
            },
            subvalueIndicator: {
                offset: -5,
                size: 12,
                indent: 17
            },
            value: 50,
            subvalues: [10, 20]
        });

        assert.strictEqual(gauge._translator.getCodomainStart(), 583, "translator codomain start");
        assert.strictEqual(gauge._translator.getCodomainEnd(), 17, "translator codomain end");

        var scale = axisModule.Axis.getCall(0).returnValue;
        assert.deepEqual(scale.shift.getCall(0).args, [{ left: -401, top: 0 }], "shift scale");
        assert.equal(scale.draw.callCount, 2, "draw scale");
        assert.equal(scale.measureLabels.callCount, 2, "measure labels of scale");
        assert.deepEqual(scale.measureLabels.getCall(0).args[0], {
            bottom: 0,
            height: 600,
            left: 0,
            right: 0,
            top: 0,
            width: 800
        });
        assert.deepEqual(scale.measureLabels.getCall(1).args[0], {
            bottom: 0,
            height: 600,
            left: 0,
            right: 0,
            top: 0,
            width: 800
        });
        assert.deepEqual(scale.draw.lastCall.args[0], {
            bottom: 17,
            height: 600,
            left: 0,
            right: 0,
            top: 17,
            width: 800
        }, "new canvas for scale");

        assert.strictEqual(gauge._rangeContainer.options.x, 421, "range container x");

        assert.strictEqual(gauge._valueIndicator.options.x, 431, "main pointer x");

        assert.strictEqual(gauge._subvalueIndicatorsSet._options.x, 396, "sub pointers set x");
    });

    QUnit.test("Scale horizontal orientation = left", function(assert) {
        new dxLinearGauge(this.container, {
            geometry: {
                orientation: "vertical"
            },
            scale: {
                size: 10,
                horizontalOrientation: "left"
            },
            rangeContainer: {
                offset: 20,
                size: 8
            },
            valueIndicator: {
                offset: 30,
                size: 16
            },
            subvalueIndicator: {
                offset: -5,
                size: 12,
                indent: 17
            }
        });
        var scale = axisModule.Axis.getCall(0).returnValue;

        assert.deepEqual(scale.shift.getCall(0).args, [{ left: -404, top: 0 }], "scale shifting");
        assert.deepEqual(scale.draw.lastCall.args[0], {
            bottom: 7.5,
            height: 600,
            left: 0,
            right: 0,
            top: 7.5,
            width: 800
        }, "new canvas for scale");
    });

    QUnit.test("Scale horizontal orientation = center", function(assert) {
        new dxLinearGauge(this.container, {
            geometry: {
                orientation: "vertical"
            },
            scale: {
                size: 10,
                horizontalOrientation: "center"
            },
            rangeContainer: {
                offset: 20,
                size: 8
            },
            valueIndicator: {
                offset: 30,
                size: 16
            },
            subvalueIndicator: {
                offset: -5,
                size: 12,
                indent: 17
            }
        });
        var scale = axisModule.Axis.getCall(0).returnValue;

        assert.deepEqual(scale.shift.getCall(0).args, [{ left: -402, top: 0 }], "scale shifting");
        assert.deepEqual(scale.draw.lastCall.args[0], {
            bottom: 7.5,
            height: 600,
            left: 0,
            right: 0,
            top: 7.5,
            width: 800
        }, "new canvas for scale");
    });

    QUnit.test("Scale horizontal orientation = right", function(assert) {
        new dxLinearGauge(this.container, {
            geometry: {
                orientation: "vertical"
            },
            scale: {
                size: 10,
                horizontalOrientation: "right"
            },
            rangeContainer: {
                offset: 20,
                size: 8
            },
            valueIndicator: {
                offset: 30,
                size: 16
            },
            subvalueIndicator: {
                offset: -5,
                size: 12,
                indent: 17
            }
        });
        var scale = axisModule.Axis.getCall(0).returnValue;

        assert.deepEqual(scale.shift.getCall(0).args, [{ left: -401, top: 0 }], "scale shifting");
        assert.deepEqual(scale.draw.lastCall.args[0], {
            bottom: 7.5,
            height: 600,
            left: 0,
            right: 0,
            top: 7.5,
            width: 800
        }, "new canvas for scale");
    });

    //  B232105
    QUnit.test("Offset validation", function(assert) {
        var gauge = new dxLinearGauge(this.container, {
            geometry: { orientation: "vertical" },
            scale: {
                size: 10,
                indent: 23
            },
            rangeContainer: {
                offset: "test",
                size: 8
            },
            valueIndicator: {
                offset: {},
                size: 16
            },
            subvalueIndicator: {
                offset: [],
                size: 12,
                indent: 17
            },
            value: 50,
            subvalues: [10, 20]
        });
        var scale = axisModule.Axis.getCall(0).returnValue;

        assert.strictEqual(gauge._translator.getCodomainStart(), 583, "translator codomain start");
        assert.strictEqual(gauge._translator.getCodomainEnd(), 17, "translator codomain end");

        assert.deepEqual(scale.shift.getCall(0).args, [{ left: -414, top: 0 }], "scale shifting");
        assert.deepEqual(scale.draw.lastCall.args[0], {
            bottom: 17,
            height: 600,
            left: 0,
            right: 0,
            top: 17,
            width: 800
        }, "new canvas for scale");

        assert.strictEqual(gauge._rangeContainer.options.x, 414, "range container x");

        assert.strictEqual(gauge._valueIndicator.options.x, 414, "main pointer x");

        assert.strictEqual(gauge._subvalueIndicatorsSet._options.x, 414, "sub pointers set x");
    });
})();
