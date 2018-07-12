"use strict";

/* global createTestContainer, currentTest */

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    Class = require("core/class"),
    registerComponent = require("core/component_registrator"),
    resizeCallbacks = require("core/utils/resize_callbacks"),
    objectUtils = require("core/utils/object"),
    vizMocks = require("../../helpers/vizMocks.js"),
    dxGauge = require("viz/gauges/common").dxGauge,
    Palette = require("viz/palette").Palette,
    axisModule = require("viz/axes/base_axis"),
    loadingIndicatorModule = require("viz/core/loading_indicator"),
    tooltipModule = require("viz/core/tooltip"),
    rangeModule = require("viz/translators/range"),
    translator1DModule = require("viz/translators/translator1d"),
    rendererModule = require("viz/core/renderers/renderer"),
    stubRange = vizMocks.stubClass(rangeModule.Range),
    ThemeManager = require("viz/gauges/theme_manager");

$('<div id="test-container">').appendTo("#qunit-fixture");

sinon.stub(rangeModule, "Range", function(parameters) {
    return new stubRange(parameters);
});

var dxTestGauge = dxGauge.inherit({
    NAME: "dxTestGauge",
    _scaleTypes: {
        type: "testAxes",
        drawingType: "testDrawing"
    },

    _getDefaultSize: function() {
        return { width: 101, height: 202 };
    },
    _updateScaleTickIndent: function() { },
    _setupCodomain: function() {
        this._area = { startCoord: 1, endCoord: 2 };
        this.position = 0;
        this._translator.setCodomain(1000, 2000);
    },
    _gridSpacingFactor: 0,
    _setOrientation: noop,
    _shiftScale: noop,
    _getTicksOrientation: function() {
        return "center";
    },
    _getScaleLayoutValue: noop,
    _getTicksCoefficients: function() {
        return { inner: 0, outer: 1 };
    },
    _correctScaleIndents: noop,
    _getElementLayout: function(offset) {
        return { position: Math.round(offset + this.position) };
    },

    _applyMainLayout: function() {
        this._area.startCoord = 1000;
        this._area.endCoord = 2000;
        this.position = 400;
    },

    _getApproximateScreenRange: function() {
        return this.option("approximateScreenRange") || 0;
    }
});

var factory = dxTestGauge.prototype._factory = objectUtils.clone(dxGauge.prototype._factory);

registerComponent("dxTestGauge", dxTestGauge);

var StubTooltip = vizMocks.Tooltip;
tooltipModule.Tooltip = function(parameters) {
    return new StubTooltip(parameters);
};

sinon.stub(axisModule, "Axis", function(parameters) {
    return new vizMocks.Axis(parameters);
});

factory.ThemeManager = vizMocks.stubClass(ThemeManager, {
    theme: function() { return {}; },
    themeName: function() { return "theme-name"; },
    createPalette: function(palette) { return new Palette(palette); },
    setTheme: function() {
        vizMocks.forceThemeOptions(this);
    }
});

var TestElement = Class.inherit({
    ctor: function(parameters) {
        this.parameters = parameters;
        this.renderer = parameters.renderer;
        this.translator = parameters.translator;
        this.container = parameters.container;
        this.owner = parameters.owner;
        this.incidentOccurred = parameters.incidentOccurred;
        this.tracker = parameters.tracker;
        this.root = this.renderer.g().attr({ "class": parameters.className });
    },

    dispose: function() {
        this.disposed = true;
        delete this.root;
        return true;
    },

    clean: function() {
        this.root.remove();
        return this;
    },

    render: function(options) {
        this.options = options;
        this.enabled = true;
        this.owner && this.root.append(this.owner);
        return this;
    },

    getOffset: function() {
        return this.options.offset;
    },

    resize: function(options) {
        $.extend(this.options, options);
    },

    measure: function() {
    }
});

var TestPointerElement = TestElement.inherit({
    render: function() {
        this.callBase.apply(this, arguments);
        this._currentValue = Number(this.options.currentValue);
        return this;
    },

    value: function(val) {
        this.valueCalls = this.valueCalls || [];
        this.valueCalls.push(val);
        if(arguments.length) {
            val = Number(val);
            if(Number(this._currentValue) !== val && isFinite(this.translator.translate(val))) {
                this.previousValue = Number(this._currentValue);
                this._currentValue = val;
            }
            return this;
        }
        return this._currentValue;
    }
});

function combineOptions(gauge, name, options) {
    return $.extend(true, {}, gauge._themeManager.theme()[name], options);
}

factory.RangeContainer = function(parameters) {
    parameters.className = "test-range-container";
    var rangeContainer = new TestElement(parameters);
    rangeContainer.getColorForValue = sinon.stub();
    return rangeContainer;
};

factory.createIndicator = function(parameters, type) {
    var pointer = new TestPointerElement(parameters);
    pointer.type = type;
    return pointer;
};

loadingIndicatorModule.LoadingIndicator = function(parameters) {
    return new vizMocks.LoadingIndicator(parameters);
};

sinon.stub(rendererModule, "Renderer", function() {
    return currentTest().renderer;
});

var environment = {
    beforeEach: function() {
        vizMocks.stubIncidentOccurredCreation();
        rangeModule.Range.reset();
        axisModule.Axis.reset();
        this.renderer = new vizMocks.Renderer();
        this.container = createTestContainer("#test-container", { width: 800, height: 600 });
    },
    createTestGauge: function(options) {
        return new dxTestGauge(this.container, $.extend(true, {}, {
            scale: {
                label: {
                    overlappingBehavior: "hide",
                    indentFromTick: 10
                },
                minorTick: {},
                tick: {}
            }
        }, options));
    },
    afterEach: function() {
        vizMocks.restoreIncidentOccurredCreation();
        this.container.remove();
        delete this.container;
    }
};

QUnit.module("Gauge - main elements rendering (on stubs)", environment);

QUnit.test("Scale is rendered", function(assert) {
    this.createTestGauge({
        scale: {
            startValue: 10,
            endValue: 20,
            customTicks: [1, 2, 3],
            tick: {
                length: 8,
                color: "#123456",
                width: 2,
                visible: true
            },
            tickInterval: 4,
            customMinorTicks: [4, 5, 6],
            minorTick: {
                length: 8,
                color: "#654321",
                width: 1,
                visible: false
            },
            minorTickInterval: 2,
            hideFirstTick: true,
            hideFirstLabel: false,
            hideLastTick: true,
            hideLastLabel: false,
        }
    });

    var scale = axisModule.Axis.getCall(0).returnValue,
        scaleGroup = this.renderer.g.getCall(6).returnValue,
        axisArguments = axisModule.Axis.getCall(0).args[0];

    assert.deepEqual(axisArguments.renderer, this.renderer, "scale params: renderer");
    assert.deepEqual(axisArguments.axesContainerGroup, scaleGroup, "scale params: group");
    assert.deepEqual(axisArguments.axisType, "testAxes", "scale params: type");
    assert.deepEqual(axisArguments.drawingType, "testDrawing", "scale params: drawingType");
    assert.deepEqual(axisArguments.widgetClass, "dxg", "scale params: dxg");

    assert.deepEqual(scale.updateOptions.getCall(0).args[0], {
        customTicks: [1, 2, 3],
        customMinorTicks: [4, 5, 6],
        axisDivisionFactor: 0,
        minorAxisDivisionFactor: 5,
        numberMultipliers: [1, 2, 5],
        endValue: 20,
        hideFirstLabel: false,
        hideFirstTick: true,
        hideLastLabel: false,
        hideLastTick: true,
        isHorizontal: true,
        label: {
            indentFromAxis: 0,
            indentFromTick: 10,
            overlappingBehavior: "hide"
        },
        max: 20,
        min: 10,
        minorTick: {
            color: "#654321",
            length: 8,
            visible: false,
            width: 1
        },
        minorTickInterval: 2,
        startValue: 10,
        tick: {
            color: "#123456",
            length: 8,
            visible: true,
            width: 2
        },
        tickInterval: 4,
        tickOrientation: "center",
        startAngle: -910,
        endAngle: -1910,
        skipViewportExtending: true
    }, "scale updating");
    assert.equal(scale.draw.callCount, 1, "scale drawing");
    assert.equal(scaleGroup.linkAppend.callCount, 1, "scale group appending");
});

QUnit.test("overlappingBehavior option is hide", function(assert) {
    this.createTestGauge({
        scale: {
            label: {
                overlappingBehavior: "hide"
            }
        }
    });
    assert.deepEqual(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(0).args[0].label.overlappingBehavior, "hide");
});

QUnit.test("overlappingBehavior option is none", function(assert) {
    this.createTestGauge({
        scale: {
            label: {
                overlappingBehavior: "none"
            }
        }
    });
    assert.deepEqual(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(0).args[0].label.overlappingBehavior, "none");
});

QUnit.test("hideFirstOrLast option in label option", function(assert) {
    this.createTestGauge({
        scale: {
            label: {
                hideFirstOrLast: "hideFirstOrLast"
            }
        }
    });
    assert.deepEqual(axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(0).args[0].label.hideFirstOrLast, "hideFirstOrLast");
});

QUnit.test("Use range colors for scale", function(assert) {
    var gauge = this.createTestGauge({
        scale: {
            label: {
                useRangeColors: true
            }
        },
        rangeContainer: {
            palette: 'pastel',
            ranges: [
                { startValue: 50, endValue: 90 },
                { startValue: 90, endValue: 130 },
                { startValue: 130, endValue: 150 },
            ]
        }
    });

    axisModule.Axis.getCall(0).returnValue.updateOptions.getCall(0).args[0].label.customizeColor.call({ value: "test" }, { value: "test" });

    assert.equal(gauge._rangeContainer.getColorForValue.callCount, 1, "ranges");
    assert.deepEqual(gauge._rangeContainer.getColorForValue.getCall(0).args[0], "test", "args");
});

QUnit.test("Range container is rendered", function(assert) {
    var gauge = this.createTestGauge({
        rangeContainer: {
            offset: -5,
            backgroundColor: "grey",
            palette: "test"
        }
    });
    var target = gauge._rangeContainer;

    assert.ok(target, "instance");
    assert.ok(target instanceof TestElement, "instance type");

    assert.strictEqual(target.renderer, gauge._renderer, "renderer is passed");
    assert.strictEqual(target.translator, gauge._translator, "translator is passed");
    assert.strictEqual(target.container, gauge._renderer.root, "root element is passed");
    assert.strictEqual(target.parameters.themeManager, gauge._themeManager, "themeManager is passed");

    assert.ok(target.root, "root");
    assert.strictEqual(target.root.attr.getCall(0).args[0]["class"], "test-range-container", "style class for root");
    assert.deepEqual(target.options, combineOptions(gauge, "rangeContainer", { position: 395, offset: -5, backgroundColor: "grey", palette: "test" }), "options are passed");
});

//  B250275
QUnit.test("Palette for range container - name", function(assert) {
    var gauge = this.createTestGauge({
        rangeContainer: {
            palette: "test-palette"
        }
    });
    assert.strictEqual(gauge._rangeContainer.options.palette, "test-palette");
});

//  B250275
QUnit.test("Palette for range container - long array", function(assert) {
    var gauge = this.createTestGauge({
        rangeContainer: {
            palette: ["p1", "p2", "p3", "p4", "p5"]
        }
    });
    assert.deepEqual(gauge._rangeContainer.options.palette, ["p1", "p2", "p3", "p4", "p5"]);
});

//  B250275
QUnit.test("Palette for range container - short array", function(assert) {
    var gauge = this.createTestGauge({
        rangeContainer: {
            palette: ["p1", "p2"]
        }
    });
    assert.deepEqual(gauge._rangeContainer.options.palette, ["p1", "p2"]);
});

QUnit.test("Value indicator is rendered", function(assert) {
    var gauge = this.createTestGauge({
        animation: {
            enabled: true,
            duration: 100
        },
        containerBackgroundColor: "white",
        scale: { startValue: 10, endValue: 100 },
        valueIndicator: {
            type: "RECTANGLENEEDLE",
            offset: 20,
            color: "black"
        },
        value: 45
    });
    var target = gauge._valueIndicator;

    assert.ok(target, "instance");
    assert.ok(target instanceof TestElement, "instance type");

    assert.strictEqual(target.renderer, gauge._renderer, "renderer is passed");
    assert.strictEqual(target.translator, gauge._translator, "translator is passed");
    assert.strictEqual(target.owner, gauge._renderer.root, "root element is passed");
    assert.strictEqual(target.tracker, gauge._tracker, "tracker is passed");

    assert.ok(target.root, "root");
    assert.strictEqual(target.root.attr.getCall(0).args[0]["class"], "dxg-value-indicator", "style class for root");

    var defaultOptions = combineOptions(gauge, "valueIndicator");
    delete target.options.vertical;
    assert.deepEqual(target.options, $.extend(true, {}, defaultOptions._default, defaultOptions["rectangle"], {
        offset: 20, position: 420,
        animation: {
            duration: 100,
            easing: "easeOutCubic"
        },
        containerBackgroundColor: "white",
        type: "rectangleneedle",
        color: "black",
        baseValue: 10, currentValue: 10
    }), "options are passed");
    assert.strictEqual(target.previousValue, 10, "value is set");
    assert.strictEqual(target.value(), 45, "value is set");
});

QUnit.test("Subvalue indicators are rendered", function(assert) {
    var gauge = this.createTestGauge({
        animation: {
            enabled: true,
            duration: 50
        },
        containerBackgroundColor: "green",
        scale: { startValue: -100, endValue: -500 },
        subvalueIndicator: {
            type: "TRIANGLEMARKER",
            offset: -15,
            color: "red"
        },
        subvalues: [-400, -300, -200]
    });

    var defaultOptions = combineOptions(gauge, "subvalueIndicator");

    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators.length, 3, "count");
    $.each(gauge._subvalueIndicatorsSet._indicators, function(i, target) {
        assert.ok(target, "instance");
        assert.ok(target instanceof TestElement, "instance type");

        assert.strictEqual(target.renderer, gauge._renderer, "renderer is passed");
        assert.strictEqual(target.translator, gauge._translator, "translator is passed");
        assert.strictEqual(target.owner, gauge._renderer.root, "root element is passed");
        assert.strictEqual(target.tracker, gauge._tracker, "tracker is passed");

        assert.ok(target.root, "root");
        assert.strictEqual(target.root.attr.getCall(0).args[0]["class"], "dxg-subvalue-indicator", "style class for root");

        delete target.options.vertical;
        assert.deepEqual(target.options, $.extend(true, {}, defaultOptions._default, defaultOptions["triangle"], {
            position: 385, offset: -15,
            animation: {
                duration: 50,
                easing: "easeOutCubic"
            },
            containerBackgroundColor: "green",
            type: "trianglemarker",
            color: "red",
            baseValue: -500, currentValue: -500,
            vertical: undefined
        }), "options are passed");
        assert.strictEqual(target.previousValue, -500, "value is set");
        assert.strictEqual(target.value(), [-400, -300, -200][i], "value is set");
    });
    assert.strictEqual(gauge._themeManager.stub("createPalette").called, false);
});

QUnit.test("Use sample indicator instance for getting offset", function(assert) {
    sinon.stub(TestElement.prototype, "getOffset").returns(0);

    var gauge = this.createTestGauge({
        animation: {
            enabled: true,
            duration: 50
        },
        containerBackgroundColor: "green",
        scale: { startValue: -100, endValue: -500 },
        subvalueIndicator: {
            type: "TRIANGLEMARKER",
            offset: -15,
            color: "red"
        },
        subvalues: [-400]
    });

    assert.deepEqual(gauge._subvalueIndicatorsSet._indicators[0].options.position, 400);

    TestElement.prototype.getOffset.restore();
});

QUnit.test("Subvalue indicators can be not rendered", function(assert) {
    var gauge = this.createTestGauge({
        scale: { startValue: -100, endValue: -500 },
        subvalueIndicator: {
            type: "triangle",
            offset: -15,
            color: "red"
        }
    });

    assert.ok(!gauge._subvalueIndicatorsSet, "sub pointers are not rendered");
});

QUnit.test("Value indicators are rendered in hard mode", function(assert) {
    var gauge = this.createTestGauge({
        animation: {
            enabled: true,
            duration: 50
        },
        containerBackgroundColor: "green",
        scale: { startValue: -50, endValue: 1000 },
        valueIndicators: [
            { value: 10, type: "rectangleneedle", offset: 10, color: "red" },
            { value: 20, type: "RangeBar", offset: 20, color: "blue", text: {} },
            { value: 30, type: "textCloud", offset: 5, color: "yellow", text: {} }
        ]
    });

    var defaultOptions = combineOptions(gauge, "valueIndicators");

    assert.strictEqual(gauge._valueIndicators.length, 3, "count");
    $.each(gauge._valueIndicators, function(i, target) {
        assert.ok(target, "instance");
        assert.ok(target instanceof TestElement, "instance type");

        assert.strictEqual(target.renderer, gauge._renderer, "renderer is passed");
        assert.strictEqual(target.translator, gauge._translator, "translator is passed");
        assert.strictEqual(target.owner, gauge._renderer.root, "root element is passed");
        assert.strictEqual(target.tracker, gauge._tracker, "tracker is passed");

        assert.ok(target.root, "root");
    });
    delete gauge._valueIndicators[0].options.vertical;
    assert.deepEqual(gauge._valueIndicators[0].options, $.extend(true, {}, defaultOptions._default, defaultOptions["rectangleneedle"], {
        color: "red", baseValue: -50, currentValue: -50, value: 10, type: "rectangleneedle", position: 410, offset: 10,
        animation: {
            duration: 50,
            easing: "easeOutCubic"
        },
        containerBackgroundColor: "green"
    }), "value indicator 1 options");
    assert.strictEqual(gauge._valueIndicators[0].previousValue, -50, "value is set - 1");
    assert.strictEqual(gauge._valueIndicators[0].value(), 10, "value is set - 1");
    delete gauge._valueIndicators[1].options.vertical;
    assert.deepEqual(gauge._valueIndicators[1].options, $.extend(true, {}, defaultOptions._default, defaultOptions["rangebar"], {
        color: "blue", baseValue: -50, currentValue: -50, value: 20, type: "rangebar", position: 420, offset: 20,
        text: { format: { type: "fixedPoint", precision: 0 } },
        animation: {
            duration: 50,
            easing: "easeOutCubic"
        },
        containerBackgroundColor: "green"
    }), "value indicator 2 options");
    assert.strictEqual(gauge._valueIndicators[1].previousValue, -50, "value is set - 2");
    assert.strictEqual(gauge._valueIndicators[1].value(), 20, "value is set - 2");
    delete gauge._valueIndicators[2].options.vertical;
    assert.deepEqual(gauge._valueIndicators[2].options, $.extend(true, {}, defaultOptions._default, defaultOptions["textcloud"], {
        color: "yellow", baseValue: -50, currentValue: -50, value: 30, type: "textcloud", position: 405, offset: 5,
        text: { format: { type: "fixedPoint", precision: 0 } },
        animation: {
            duration: 50,
            easing: "easeOutCubic"
        },
        containerBackgroundColor: "green"
    }), "value indicator 3 options");
    assert.strictEqual(gauge._valueIndicators[2].previousValue, -50, "value is set - 3");
    assert.strictEqual(gauge._valueIndicators[2].value(), 30, "value is set - 3");
    assert.ok(typeof gauge.indicatorValue === "function", "indicatorValue method is available");
});

QUnit.test("Value indicators are rendered - not valid types", function(assert) {
    var __createIndicator = factory.createIndicator;
    try {
        factory.createIndicator = function(parameters, type) {
            if(type === "test") {
                return __createIndicator(parameters, "rangebar");
            }
            return null;
        };
        var gauge = this.createTestGauge({
            valueIndicators: [
                { value: 10, type: 1 },
                { value: 20 },
                { value: 30, type: "test" },
                { value: 40, type: "trianglemarker" }
            ]
        });

        assert.strictEqual(gauge._valueIndicators.length, 1, "count");
        assert.strictEqual(gauge._valueIndicators[0].value(), 30, "value");
    } finally {
        factory.createIndicator = __createIndicator;
    }
});

QUnit.module("Gauge - general parts creation", environment);

QUnit.test("Translator is set", function(assert) {
    var gauge = this.createTestGauge();
    assert.ok(gauge._translator, "translator");
    assert.ok(gauge._translator instanceof translator1DModule.Translator1D, "instance of Translator1D");
    assert.strictEqual(gauge._translator.getDomainStart(), 0, "domain start");
    assert.strictEqual(gauge._translator.getDomainEnd(), 100, "domain end");
    assert.strictEqual(gauge._translator.getCodomainStart(), 1000, "codomain start");
    assert.strictEqual(gauge._translator.getCodomainEnd(), 2000, "codomain end");
});

QUnit.test("Translator with settings", function(assert) {
    var gauge = this.createTestGauge({
        scale: { startValue: 100, endValue: "200" }
    });
    assert.strictEqual(gauge._translator.getDomainStart(), 100, "domain start");
    assert.strictEqual(gauge._translator.getDomainEnd(), 200, "domain end");
    assert.strictEqual(gauge._translator.getCodomainStart(), 1000, "codomain start");
    assert.strictEqual(gauge._translator.getCodomainEnd(), 2000, "codomain end");
});

QUnit.test("Translator with not valid settings", function(assert) {
    var gauge = this.createTestGauge({
        scale: { startValue: 500, endValue: "test" }
    });
    assert.strictEqual(gauge._translator.getDomainStart(), 500, "domain start");
    assert.strictEqual(gauge._translator.getDomainEnd(), 100, "domain end");
    assert.strictEqual(gauge._translator.getCodomainStart(), 1000, "codomain start");
    assert.strictEqual(gauge._translator.getCodomainEnd(), 2000, "codomain end");
});

QUnit.module("Gauge - scale initialization", environment);

QUnit.test("startValue < endValue", function(assert) {
    this.createTestGauge({
        scale: {
            startValue: 10,
            endValue: 20
        }
    });

    var scale = axisModule.Axis.getCall(0).returnValue,
        updateOptions = scale.updateOptions.getCall(0).args[0],
        setBusinessRange = scale.setBusinessRange.getCall(0).args[0];

    assert.strictEqual(updateOptions.min, 10);
    assert.strictEqual(updateOptions.max, 20);
    assert.deepEqual(setBusinessRange, {
        axisType: "continuous",
        dataType: "numeric",
        min: 10,
        max: 20,
        invert: false
    });
});

QUnit.test("startValue > endValue", function(assert) {
    this.createTestGauge({
        scale: {
            startValue: 20,
            endValue: 10
        }
    });

    var scale = axisModule.Axis.getCall(0).returnValue,
        updateOptions = scale.updateOptions.getCall(0).args[0],
        setBusinessRange = scale.setBusinessRange.getCall(0).args[0];

    assert.strictEqual(updateOptions.min, 10);
    assert.strictEqual(updateOptions.max, 20);
    assert.deepEqual(setBusinessRange, {
        axisType: "continuous",
        dataType: "numeric",
        min: 10,
        max: 20,
        invert: true
    });
});

QUnit.module("Gauge - resizing", {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        dxTestGauge.prototype._debug_rendered = function() {
            this.renderCount = (this.renderCount || 0) + 1;
            this.rendered && this.rendered();
        };
    },
    createTestGauge: environment.createTestGauge,
    afterEach: function() {
        delete dxTestGauge.prototype._debug_rendered;
        environment.afterEach.apply(this, arguments);
    }
});

QUnit.test("Resizable by default", function(assert) {
    assert.expect(2);
    var done = assert.async(),
        gauge = this.createTestGauge();
    gauge.rendered = function() {
        assert.strictEqual(gauge.renderCount, 2, "render count");
        assert.deepEqual(gauge._DEBUG_rootRect, [0, 0, 400, 200], "resized");
        done();
    };

    this.container.css({ width: 400, height: 200 });
    resizeCallbacks.fire();
});

QUnit.test("Not resizable", function(assert) {
    var gauge = this.createTestGauge({
        redrawOnResize: false
    });
    var rect = gauge._DEBUG_rootRect;
    gauge.rendered = function() {
        assert.ok(false);
    };

    this.container.css({ width: 400, height: 200 });
    resizeCallbacks.fire();

    assert.strictEqual(gauge.renderCount, 1, "render count");
    assert.deepEqual(gauge._DEBUG_rootRect, rect, "not resized");
});

QUnit.test("Not resizable if sizes defined", function(assert) {
    var gauge = this.createTestGauge({
        size: { width: 100, height: 200 }
    });
    var rect = gauge._DEBUG_rootRect;
    gauge.rendered = function() {
        assert.ok(false);
    };

    this.container.css({ width: 400, height: 300 });
    resizeCallbacks.fire();

    assert.strictEqual(gauge.renderCount, 1, "render count");
    assert.deepEqual(gauge._DEBUG_rootRect, rect, "not resized");
});

QUnit.test("Value indicators are not moved on resize", function(assert) {
    assert.expect(4);
    var done = assert.async(),
        gauge = this.createTestGauge({
            value: 10,
            subvalues: [20, 30]
        });
    gauge.rendered = function() {
        assert.strictEqual(gauge.renderCount, 2, "render count");
        assert.ok(!gauge._valueIndicator.previousValue, "main pointer is not moved");
        assert.ok(!gauge._subvalueIndicatorsSet._indicators[0].previousValue, "sub pointers are not moved");
        assert.ok(!gauge._subvalueIndicatorsSet._indicators[1].previousValue, "sub pointers are not moved");
        done();
    };
    delete gauge._valueIndicator.previousValue;
    delete gauge._subvalueIndicatorsSet._indicators[0].previousValue;
    delete gauge._subvalueIndicatorsSet._indicators[1].previousValue;

    this.container.css({ width: 200, height: 100 });
    resizeCallbacks.fire();
});

//  B252892
QUnit.test("Value indicators preserve their value on resize", function(assert) {
    assert.expect(4);
    var done = assert.async(),
        gauge = this.createTestGauge({
            value: 10,
            subvalues: [20, 30]
        });
    gauge.rendered = function() {
        assert.strictEqual(gauge.renderCount, 2, "render count");
        assert.strictEqual(gauge._valueIndicator.value(), 10, "main pointer");
        assert.strictEqual(gauge._subvalueIndicatorsSet._indicators[0].value(), 20, "sub pointer 1");
        assert.strictEqual(gauge._subvalueIndicatorsSet._indicators[1].value(), 30, "sub pointer 2");
        done();
    };
    delete gauge._valueIndicator.previousValue;
    delete gauge._subvalueIndicatorsSet._indicators[0].previousValue;
    delete gauge._subvalueIndicatorsSet._indicators[1].previousValue;

    this.container.css({ width: 200, height: 100 });
    resizeCallbacks.fire();
});

QUnit.test("Can set value to null", function(assert) {
    var gauge = this.createTestGauge({
        value: null
    });

    assert.strictEqual(gauge.value(), null);
});

//  B252892
QUnit.test("Value indicators preserve their value on resize (hard mode)", function(assert) {
    assert.expect(4);
    var done = assert.async(),
        gauge = this.createTestGauge({
            valueIndicators: [
                { value: 10 },
                { value: 20 },
                { value: 30 }
            ]
        });
    gauge.rendered = function() {
        assert.strictEqual(gauge.renderCount, 2, "render count");
        assert.strictEqual(gauge._valueIndicators[0].value(), 10, "value indicator 1");
        assert.strictEqual(gauge._valueIndicators[1].value(), 20, "value indicator 2");
        assert.strictEqual(gauge._valueIndicators[2].value(), 30, "value indicator 3");
        done();
    };

    this.container.css({ width: 200, height: 100 });
    resizeCallbacks.fire();
});

//  B253559
QUnit.test("Animation settings are preserved on resize", function(assert) {
    assert.expect(4);
    var done = assert.async(),
        gauge = this.createTestGauge({
            value: 10,
            subvalues: [20, 30]
        });
    gauge.rendered = function() {
        assert.strictEqual(gauge.renderCount, 2, "render count");
        assert.ok(gauge._valueIndicator.options.animation, "main pointer");
        assert.ok(gauge._subvalueIndicatorsSet._indicators[0].options.animation, "sub pointer 1");
        assert.ok(gauge._subvalueIndicatorsSet._indicators[1].options.animation, "sub pointer 2");
        done();
    };
    delete gauge._valueIndicator.previousValue;
    delete gauge._subvalueIndicatorsSet._indicators[0].previousValue;
    delete gauge._subvalueIndicatorsSet._indicators[1].previousValue;

    this.container.css({ width: 200, height: 100 });
    resizeCallbacks.fire();
});

//  B253559
QUnit.test("Animation settings are preserved on resize (hard mode)", function(assert) {
    assert.expect(4);
    var done = assert.async(),
        gauge = this.createTestGauge({
            valueIndicators: [
                { value: 10 },
                { value: 20 },
                { value: 30 }
            ]
        });
    gauge.rendered = function() {
        assert.strictEqual(gauge.renderCount, 2, "render count");
        assert.ok(gauge._valueIndicators[0].options.animation, "value indicator 1");
        assert.ok(gauge._valueIndicators[1].options.animation, "value indicator 2");
        assert.ok(gauge._valueIndicators[2].options.animation, "value indicator 3");
        done();
    };

    this.container.css({ width: 200, height: 100 });
    resizeCallbacks.fire();
});

QUnit.test("Not redrawn if size is not changed", function(assert) {
    var gauge = this.createTestGauge();
    gauge.rendered = function() {
        assert.ok(false);
    };

    resizeCallbacks.fire();

    assert.strictEqual(gauge.renderCount, 1, "render count");
});

//  B238220
QUnit.test("Translator is not recreated on resize", function(assert) {
    assert.expect(1);
    var done = assert.async(),
        gauge = this.createTestGauge(),
        translator = gauge._translator;
    gauge.rendered = function() {
        assert.strictEqual(gauge._translator, translator, "not recreated");
        done();
    };

    this.container.css({ width: 200, height: 100 });
    resizeCallbacks.fire();
});

QUnit.module("Gauge - options processing", environment);

//  B232788
QUnit.test("Less ranges in range container", function(assert) {
    var gauge = this.createTestGauge({
        rangeContainer: {
            ranges: [
                { startValue: 0, endValue: 10, color: "red" },
                { startValue: 20, endValue: 30, color: "yellow" },
                { startValue: 40, endValue: 50, color: "green" }
            ]
        }
    });
    gauge.option({
        rangeContainer: {
            width: 9,
            ranges: [
                { startValue: 5, endValue: 10, color: "blue" },
                { startValue: 15, endValue: 20, color: "orange" }
            ]
        }
    });

    assert.deepEqual(gauge.option("rangeContainer"), {
        width: 9,
        ranges: [
            { startValue: 5, endValue: 10, color: "blue" },
            { startValue: 15, endValue: 20, color: "orange" }
        ]
    });
});

//  B232788
QUnit.test("More ranges in range container", function(assert) {
    var gauge = this.createTestGauge({
        rangeContainer: {
            ranges: [
                { startValue: 0, endValue: 10, color: "red" },
                { startValue: 20, endValue: 30, color: "yellow" },
                { startValue: 40, endValue: 50, color: "green" }
            ]
        }
    });
    gauge.option({
        rangeContainer: {
            width: 9,
            ranges: [
                { startValue: 5, endValue: 10, color: "blue" },
                { startValue: 15, endValue: 20, color: "orange" },
                { startValue: 25, endValue: 30, color: "purple" },
                { startValue: 35, endValue: 40, color: "magenta" }
            ]
        }
    });

    assert.deepEqual(gauge.option("rangeContainer"), {
        width: 9,
        ranges: [
            { startValue: 5, endValue: 10, color: "blue" },
            { startValue: 15, endValue: 20, color: "orange" },
            { startValue: 25, endValue: 30, color: "purple" },
            { startValue: 35, endValue: 40, color: "magenta" }
        ]
    });
});

//  B232788
QUnit.test("Ranges in range container are not changed", function(assert) {
    var gauge = this.createTestGauge({
        rangeContainer: {
            ranges: [
                { startValue: 0, endValue: 10, color: "red" },
                { startValue: 20, endValue: 30, color: "yellow" },
                { startValue: 40, endValue: 50, color: "green" }
            ]
        }
    });
    gauge.option({ rangeContainer: { width: 9, } });

    assert.deepEqual(gauge.option("rangeContainer"), {
        width: 9,
        ranges: [
            { startValue: 0, endValue: 10, color: "red" },
            { startValue: 20, endValue: 30, color: "yellow" },
            { startValue: 40, endValue: 50, color: "green" }
        ]
    });
});

//  B232788
QUnit.test("Less ranges in range container (direct assignment)", function(assert) {
    var gauge = this.createTestGauge({
        rangeContainer: {
            ranges: [
                { startValue: 0, endValue: 10, color: "red" },
                { startValue: 20, endValue: 30, color: "yellow" },
                { startValue: 40, endValue: 50, color: "green" }
            ]
        }
    });
    gauge.option("rangeContainer.ranges", [
        { startValue: 5, endValue: 10, color: "blue" },
        { startValue: 15, endValue: 20, color: "orange" }
    ]);

    assert.deepEqual(gauge.option("rangeContainer"), {
        ranges: [
            { startValue: 5, endValue: 10, color: "blue" },
            { startValue: 15, endValue: 20, color: "orange" }
        ]
    });
});

//  B232788
QUnit.test("More ranges in range container (direct assignment)", function(assert) {
    var gauge = this.createTestGauge({
        rangeContainer: {
            ranges: [
                { startValue: 0, endValue: 10, color: "red" },
                { startValue: 20, endValue: 30, color: "yellow" },
                { startValue: 40, endValue: 50, color: "green" }
            ]
        }
    });
    gauge.option("rangeContainer.ranges", [
        { startValue: 5, endValue: 10, color: "blue" },
        { startValue: 15, endValue: 20, color: "orange" },
        { startValue: 25, endValue: 30, color: "purple" },
        { startValue: 35, endValue: 40, color: "magenta" }
    ]);

    assert.deepEqual(gauge.option("rangeContainer"), {
        ranges: [
            { startValue: 5, endValue: 10, color: "blue" },
            { startValue: 15, endValue: 20, color: "orange" },
            { startValue: 25, endValue: 30, color: "purple" },
            { startValue: 35, endValue: 40, color: "magenta" }
        ]
    });
});

//  B232788
QUnit.test("Less custom tick values for scale", function(assert) {
    var gauge = this.createTestGauge({
        scale: {
            customTicks: [10, 20, 30]
        }
    });
    gauge.option({
        scale: {
            startValue: 50,
            tickInterval: 9,
            customTicks: [11, 21],
            minorTick: {
                tickInterval: 4
            }
        }
    });

    assert.deepEqual(gauge.option("scale").customTicks, [11, 21]);
    assert.strictEqual(gauge.option("scale").minorTick.tickInterval, 4);
});

//  B232788
QUnit.test("More custom tick values for scale", function(assert) {
    var gauge = this.createTestGauge({
        scale: {
        }
    });
    gauge.option({
        scale: {
            endValue: 50,
            majorTick: {
                tickInterval: 9
            },
            minorTick: {
                tickInterval: 4
            }
        }
    });

    assert.strictEqual(gauge.option("scale").majorTick.tickInterval, 9);

    assert.strictEqual(gauge.option("scale").minorTick.tickInterval, 4);
});

//  B232788
QUnit.test("Custom tick values in scale are not changed", function(assert) {
    var gauge = this.createTestGauge({
    });
    gauge.option({
        scale: {
            majorTick: {
                tickInterval: 9,
            },
            minorTick: {
                tickInterval: 4,
            }
        }
    });

    assert.strictEqual(gauge.option("scale").majorTick.tickInterval, 9);

    assert.strictEqual(gauge.option("scale").minorTick.tickInterval, 4);
});

QUnit.test("Animation", function(assert) {
    var gauge = this.createTestGauge({
        animation: {
            duration: 500
        }
    });

    assert.deepEqual(gauge._valueIndicator.options.animation, {
        easing: "easeOutCubic",
        duration: 500
    });
});

QUnit.module("Gauge - value changing", environment);

QUnit.test("value - get", function(assert) {
    var gauge = this.createTestGauge({
        value: 30
    });
    assert.strictEqual(gauge.value(), 30);
});

QUnit.test("value - set", function(assert) {
    var gauge = this.createTestGauge({
        value: 30
    });
    delete gauge._valueIndicator.previousValue;

    gauge.value(50);

    assert.strictEqual(gauge._valueIndicator.valueCalls[1], 50, "value indicator");
    assert.strictEqual(gauge.value(), 50, "method result");
    assert.strictEqual(gauge.option("value"), 50, "option value");
});

QUnit.test("value - set, out of range", function(assert) {
    var gauge = this.createTestGauge({
        value: 30
    });
    delete gauge._valueIndicator.previousValue;

    gauge.value(150);

    assert.strictEqual(gauge._valueIndicator.valueCalls[1], 150, "value indicator");
    assert.strictEqual(gauge.value(), 150, "method result");
    assert.strictEqual(gauge.option("value"), 150, "option value");
});

QUnit.test("value - set, not valid", function(assert) {
    var gauge = this.createTestGauge({
        value: 30
    });
    delete gauge._valueIndicator.previousValue;

    gauge.value("test");

    assert.strictEqual(gauge._valueIndicator.valueCalls[1], 30, "value indicator");
    assert.strictEqual(gauge.value(), 30, "method result");
    assert.strictEqual(gauge.option("value"), 30, "option value");
});

QUnit.test("subvalues - get", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [1, 2, 3]
    });
    assert.deepEqual(gauge.subvalues(), [1, 2, 3]);
});

QUnit.test("subvalues - get / initialized with number", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: 10
    });
    assert.deepEqual(gauge.subvalues(), [10]);
});

QUnit.test("subvalues - get / not initialized", function(assert) {
    var gauge = this.createTestGauge({
    });
    assert.strictEqual(gauge.subvalues(), undefined);
});

QUnit.test("subvalues - get / initialized with null", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: null
    });
    assert.strictEqual(gauge.subvalues(), undefined);
});

QUnit.test("subvalues - set", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [1, 2, 3]
    });

    gauge.subvalues([10, 20, 30]);

    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators[0].valueCalls[1], 10, "subvalue indicator 1");
    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators[1].valueCalls[1], 20, "subvalue indicator 2");
    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators[2].valueCalls[1], 30, "subvalue indicator 3");
    assert.deepEqual(gauge.subvalues(), [10, 20, 30], "method result");
    assert.deepEqual(gauge.option("subvalues"), [10, 20, 30], "option value");
});

QUnit.test("subvalues - set, number", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [1, 2, 3]
    });

    gauge.subvalues(4);

    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators[0].valueCalls[1], 4, "subvalue indicator 1");
    assert.deepEqual(gauge.subvalues(), [4], "method result");
    assert.deepEqual(gauge.option("subvalues"), [4], "option value");
});

QUnit.test("subvalues - set, out of range", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [1, 2, 3]
    });

    gauge.subvalues([10, 120, 30]);

    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators[0].valueCalls[1], 10, "subvalue indicator 1");
    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators[1].valueCalls[1], 120, "subvalue indicator 2");
    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators[2].valueCalls[1], 30, "subvalue indicator 3");
    assert.deepEqual(gauge.subvalues(), [10, 120, 30], "method result");
    assert.deepEqual(gauge.option("subvalues"), [10, 120, 30], "option value");
});

QUnit.test("subvalues - set, not valid", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [1, 2, 3]
    });

    gauge.subvalues({ a: "A", b: "B" });

    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators[0].valueCalls[1], 1, "subvalue indicator 1");
    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators[1].valueCalls[1], 2, "subvalue indicator 2");
    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators[2].valueCalls[1], 3, "subvalue indicator 3");
    assert.deepEqual(gauge.subvalues(), [1, 2, 3], "method result");
    assert.deepEqual(gauge.option("subvalues"), [1, 2, 3], "option value");
});

QUnit.test("subvalues - set, when they is not defined on initialization", function(assert) {
    var gauge = this.createTestGauge();

    gauge.subvalues([1, 2, 3]);

    assert.deepEqual(gauge.subvalues(), [1, 2, 3], "method result");
    assert.deepEqual(gauge.option("subvalues"), [1, 2, 3], "option value");
});

QUnit.test("set subvalues - null", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [1]
    });

    gauge.subvalues(null);

    assert.deepEqual(gauge.subvalues(), [1], "method result");
    assert.deepEqual(gauge.option("subvalues"), [1], "option value");
});

QUnit.test("subvalues - set, less values", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [1, 2, 3]
    });

    gauge.subvalues([10, 20]);

    assert.deepEqual(gauge.subvalues(), [10, 20], "method result");
    assert.deepEqual(gauge.option("subvalues"), [10, 20], "option value");
    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators.length, 2, "subvalue indicators count");
});

QUnit.test("subvalues - set, more values", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [1, 2, 3]
    });

    gauge.subvalues([10, 20, 30, 40]);

    assert.deepEqual(gauge.subvalues(), [10, 20, 30, 40], "method result");
    assert.deepEqual(gauge.option("subvalues"), [10, 20, 30, 40], "option value");
    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators.length, 4, "subvalue indicators count");

    assert.strictEqual(gauge._subvalueIndicatorsSet._indicators[3].previousValue, 0, "new subvalue indicator is moved");
});

//  B252197
QUnit.test("subvalues - set, when initialized with empty array", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: []
    });

    gauge.subvalues([10, 20]);

    assert.deepEqual(gauge.subvalues(), [10, 20], "method result");
    assert.deepEqual(gauge.option("subvalues"), [10, 20], "option value");
});

QUnit.test("indicatorValue - get", function(assert) {
    var gauge = this.createTestGauge({
        valueIndicators: [
            { value: 10 },
            { value: 20 }
        ]
    });

    assert.strictEqual(gauge.indicatorValue(0), 10, "value 1");
    assert.strictEqual(gauge.indicatorValue(1), 20, "value 2");
    assert.strictEqual(gauge.indicatorValue("test"), undefined, "not valid");
    assert.strictEqual(gauge.indicatorValue(4), undefined, "not valid");
});

QUnit.test("indicatorValue - set", function(assert) {
    var gauge = this.createTestGauge({
        valueIndicators: [
            { value: 10 },
            { value: 20 }
        ]
    });

    gauge.indicatorValue(0, 50);
    gauge.indicatorValue(1, "60");
    gauge.indicatorValue("test", 70);
    gauge.indicatorValue(4, 80);

    assert.strictEqual(gauge.indicatorValue(0), 50, "value 1");
    assert.strictEqual(gauge.indicatorValue(1), 60, "value 2");
    assert.strictEqual(gauge._valueIndicators[0].value(), 50, "value indicator 1");
    assert.strictEqual(gauge._valueIndicators[1].value(), 60, "value indicator 1");
});

QUnit.test("indicatorValue - set, not valid", function(assert) {
    var gauge = this.createTestGauge({
        valueIndicators: [
            { value: 10 },
            { value: 20 }
        ]
    });

    gauge.indicatorValue(0, "test");
    gauge.indicatorValue(1, [1, 2]);

    assert.strictEqual(gauge.indicatorValue(0), 10, "value 1");
    assert.strictEqual(gauge.indicatorValue(1), 20, "value 2");
    assert.strictEqual(gauge._valueIndicators[0].value(), 10, "value indicator 1");
    assert.strictEqual(gauge._valueIndicators[1].value(), 20, "value indicator 1");
});

QUnit.test("indicatorValue - not in hard mode", function(assert) {
    var gauge = this.createTestGauge();

    assert.ok(gauge.valueIndicator === undefined, "method is not available");
});

QUnit.module("Gauge - options changing support", environment);

QUnit.test("value option", function(assert) {
    var gauge = this.createTestGauge({
        value: 50
    });

    gauge.option("value", 60);

    assert.strictEqual(gauge.option("value"), 60, "option value");
    assert.strictEqual(gauge.value(), 60, "method result");
    // TODO: check that gauge was not rerendered
});

QUnit.test("value option, out of range", function(assert) {
    var gauge = this.createTestGauge({
        value: 50
    });

    gauge.option("value", 160);

    assert.strictEqual(gauge.option("value"), 160, "option value");
    assert.strictEqual(gauge.value(), 160, "method result");
    // TODO: check that gauge was not rerendered
});

QUnit.test("value option, not valid", function(assert) {
    var gauge = this.createTestGauge({
        value: 50
    });

    gauge.option("value", "test");

    assert.strictEqual(gauge.option("value"), 50, "option value");
    assert.strictEqual(gauge.value(), 50, "method result");
});

QUnit.test("subvalues option", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [10, 20]
    });

    gauge.option("subvalues", [30, 40]);

    assert.deepEqual(gauge.option("subvalues"), [30, 40], "option value");
    assert.deepEqual(gauge.subvalues(), [30, 40], "method result");
    // TODO: check that gauge was not rerendered
});

QUnit.test("subvalues option, less values", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [10, 20, 30]
    });

    gauge.option("subvalues", [40, 50]);

    assert.deepEqual(gauge.option("subvalues"), [40, 50], "option value");
    assert.deepEqual(gauge.subvalues(), [40, 50], "method result");
    // TODO: check that gauge was not rerendered
});

QUnit.test("subvalues option, more values", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [10, 20, 30]
    });

    gauge.option("subvalues", [40, 50, 60, 70]);

    assert.deepEqual(gauge.option("subvalues"), [40, 50, 60, 70], "option value");
    assert.deepEqual(gauge.subvalues(), [40, 50, 60, 70], "method result");
    // TODO: check that gauge was not rerendered
});

QUnit.test("subvalues option, out of range", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [10, 20]
    });

    gauge.option("subvalues", [130, 40]);

    assert.deepEqual(gauge.option("subvalues"), [130, 40], "option value");
    assert.deepEqual(gauge.subvalues(), [130, 40], "method result");
    // TODO: check that gauge was not rerendered
});

QUnit.test("subvalues option, not valid", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [10, 20]
    });

    gauge.option("subvalues", { a: "A", b: "B" });

    assert.deepEqual(gauge.option("subvalues"), [10, 20], "option value");
    assert.deepEqual(gauge.subvalues(), [10, 20], "method result");
    // TODO: check that gauge was not rerendered
});

//  B251763
QUnit.test("subvalues option, when subvalues are not defined on initialization", function(assert) {
    var gauge = this.createTestGauge();

    gauge.option("subvalues", [10, 20]);

    assert.deepEqual(gauge.option("subvalues"), [10, 20], "option value");
    assert.deepEqual(gauge.subvalues(), [10, 20], "method result");
});

//  B252197
QUnit.test("subvalues option, when initialized with empty array", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: []
    });

    gauge.option("subvalues", [1, 2, 3]);

    assert.deepEqual(gauge.option("subvalues"), [1, 2, 3], "option value");
    assert.deepEqual(gauge.subvalues(), [1, 2, 3], "method result");
});

QUnit.module("Palette for subvalueIndicators", environment);

QUnit.test("subvalueIndicator with empty palette", function(assert) {
    var gauge = this.createTestGauge({
        subvalues: [1, 2, 3], subvalueIndicator: {
            palette: [],
            color: "someColor"
        }
    });
    $.each(gauge._subvalueIndicatorsSet._indicators, function(index, item) {
        assert.strictEqual(item.options.color, "someColor");
    });
    assert.strictEqual(gauge._themeManager.createPalette.callCount, 1);
    assert.deepEqual(gauge._themeManager.createPalette.firstCall.args, [[]]);
});

QUnit.test("palette longer count of indicators", function(assert) {
    var customPalette = ["color1", "color2", "color3", "color4"],
        gauge = this.createTestGauge({
            subvalues: [1, 2, 3],
            subvalueIndicator: {
                palette: customPalette
            }
        });

    $.each(gauge._subvalueIndicatorsSet._indicators, function(index, item) {
        assert.strictEqual(item.options.color, customPalette[index]);
    });
    assert.strictEqual(gauge._themeManager.createPalette.callCount, 1);
    assert.deepEqual(gauge._themeManager.createPalette.firstCall.args, [customPalette]);
});

QUnit.test("count of indicators longer palette", function(assert) {
    var customPalette = ["color1", "color2", "color3", "color4"],
        gauge = this.createTestGauge({
            subvalues: [1, 2, 3, 4, 5, 6, 7],
            subvalueIndicator: {
                palette: customPalette
            }
        });

    $.each(gauge._subvalueIndicatorsSet._indicators, function(index, item) {
        assert.strictEqual(item.options.color, customPalette[index % customPalette.length]);
    });
    assert.strictEqual(gauge._themeManager.createPalette.callCount, 1);
    assert.deepEqual(gauge._themeManager.createPalette.firstCall.args, [customPalette]);
});

QUnit.test("palette after remove some subvalues", function(assert) {
    var customPalette = ["color1", "color2"],
        gauge = this.createTestGauge({
            subvalues: [1, 2, 3, 4, 5],
            subvalueIndicator: {
                palette: customPalette
            }
        });

    gauge.subvalues([1, 2, 3]);

    assert.equal(gauge._subvalueIndicatorsSet._indicators.length, 3);
    $.each(gauge._subvalueIndicatorsSet._indicators, function(index, item) {
        assert.strictEqual(item.options.color, customPalette[index % customPalette.length]);
    });
    assert.strictEqual(gauge._themeManager.createPalette.callCount, 1);
    assert.deepEqual(gauge._themeManager.createPalette.firstCall.args, [customPalette]);
});

QUnit.test("palette after add some subvalues", function(assert) {
    var customPalette = ["color1", "color2"],
        gauge = this.createTestGauge({
            subvalues: [1, 2, 3, 4],
            subvalueIndicator: {
                palette: customPalette
            }
        });

    gauge.subvalues([1, 2, 3, 4, 5, 6]);

    assert.equal(gauge._subvalueIndicatorsSet._indicators.length, 6);
    $.each(gauge._subvalueIndicatorsSet._indicators, function(index, item) {
        assert.strictEqual(item.options.color, customPalette[index % customPalette.length]);
    });
    assert.strictEqual(gauge._themeManager.createPalette.callCount, 1);
    assert.deepEqual(gauge._themeManager.createPalette.firstCall.args, [customPalette]);
});

QUnit.test("palette after double add subvalues", function(assert) {
    var customPalette = ["color1", "color2"],
        gauge = this.createTestGauge({
            subvalues: [1, 2, 3, 4],
            subvalueIndicator: {
                palette: customPalette
            }
        });

    gauge.subvalues([1, 2, 3, 4, 5]);
    gauge.subvalues([1, 2, 3, 4, 5, 6]);

    assert.equal(gauge._subvalueIndicatorsSet._indicators.length, 6);
    $.each(gauge._subvalueIndicatorsSet._indicators, function(index, item) {
        assert.strictEqual(item.options.color, customPalette[index % customPalette.length]);
    });
});

QUnit.test("remove palette", function(assert) {
    var customPalette = ["color1", "color2"],
        gauge = this.createTestGauge({
            subvalues: [1, 2, 3],
            subvalueIndicator: {
                palette: customPalette,
                color: "someColor",
                defaultPalette: null // For test only, there is no such option
            }
        });

    gauge.option("subvalueIndicator", { palette: null });

    $.each(gauge._subvalueIndicatorsSet._indicators, function(index, item) {
        assert.strictEqual(item.options.color, "someColor");
    });
    assert.strictEqual(gauge._themeManager.createPalette.callCount, 1);
    assert.deepEqual(gauge._themeManager.createPalette.firstCall.args, [customPalette]);
});
