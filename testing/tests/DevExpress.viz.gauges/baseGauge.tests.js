/* global currentTest */

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    registerComponent = require("core/component_registrator"),
    resizeCallbacks = require("core/utils/resize_callbacks"),
    baseGaugeModule = require("viz/gauges/base_gauge"),
    dxBaseGauge = baseGaugeModule.dxBaseGauge,
    formatValue = baseGaugeModule.formatValue,
    getSampleText = baseGaugeModule.getSampleText,
    titleModule = require("viz/core/title"),
    loadingIndicatorModule = require("viz/core/loading_indicator"),
    rendererModule = require("viz/core/renderers/renderer"),
    tooltipModule = require("viz/core/tooltip"),
    translator1DModule = require("viz/translators/translator1d"),
    ThemeManager = require("viz/gauges/theme_manager"),
    Tracker = require("viz/gauges/tracker");

registerComponent("dxBaseGauge", dxBaseGauge);

var factory = dxBaseGauge.prototype._factory;

var BASE_METHODS = ["_invalidate", "_refresh"];
// var ABSTRACT_FIELDS = ["_width", "_height", "_rootRect"];
var ABSTRACT_METHODS = ["_setupDomainCore", "_setupCodomain", "_getDefaultSize", "_cleanContent", "_renderContent", "_getApproximateScreenRange"];

var CONTAINER_WIDTH = 200,
    CONTAINER_HEIGHT = 100;

var StubTranslator = vizMocks.stubClass(translator1DModule.Translator1D),
    StubThemeManager = vizMocks.stubClass(ThemeManager),
    StubTracker = vizMocks.stubClass(Tracker),
    // StubLayoutManager = null,
    StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip, { isEnabled: function() { return "tooltip_enabled"; } }),
    StubTitle = vizMocks.Title;

StubThemeManager.prototype.setTheme = function() {
    vizMocks.forceThemeOptions(this);
};

$.each(BASE_METHODS, function(_, name) {
    dxBaseGauge.prototype[name] = sinon.stub();
});

$.each(ABSTRACT_METHODS, function(_, name) {
    dxBaseGauge.prototype[name] = sinon.stub();
});

rendererModule.Renderer = sinon.spy(function() {
    return currentTest().renderer;
});

tooltipModule.Tooltip = function(parameters) {
    currentTest().tooltip = new StubTooltip(parameters);
    return currentTest().tooltip;
};

titleModule.Title = function() {
    return currentTest().title;
};

$.extend(factory, {
    ThemeManager: sinon.spy(function() {
        return currentTest().themeManager;
    }),

    createTranslator: sinon.spy(function() {
        return currentTest().translator;
    }),

    createTracker: sinon.spy(function() {
        return currentTest().tracker;
    })
});

var environment = {
    beforeEach: function() {
        this.$container = $("<div>").css({ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }).appendTo("#qunit-fixture");
        this.renderer = new vizMocks.Renderer();
        this.translator = new StubTranslator();
        this.translator.stub("getDomain").returns([100, 200]);
        this.themeManager = new StubThemeManager();
        this.themeManager.stub("theme").returns({});
        this.tracker = new StubTracker();
        // this.layoutManager = new StubLayoutManager();
        this.title = new StubTitle();
        var baseMethods = this.baseMethods = {};
        $.each(BASE_METHODS, function(_, name) {
            baseMethods[name] = dxBaseGauge.prototype[name];
        });
        var abstractMethods = this.abstractMethods = {};
        $.each(ABSTRACT_METHODS, function(_, name) {
            abstractMethods[name] = dxBaseGauge.prototype[name];
        });
        abstractMethods._getDefaultSize.returns({});
        // $.each(ABSTRACT_FIELDS, function (_, name) {
        //    delete dxBaseGauge.prototype[name];
        // });
        this.clock = sinon.useFakeTimers();
        // this.setAbstractField("_width", 200);
        // this.setAbstractField("_height", 100);
        loadingIndicatorModule.LoadingIndicator = vizMocks.LoadingIndicator;
    },
    afterEach: function() {
        this.$container.remove();
        this.clock.restore();
        this.renderer = null;
        this.translator = null;
        this.themeManager = null;

        this.tracker = null;
        this.title = null;

        $.each(BASE_METHODS, function(_, name) {
            dxBaseGauge.prototype[name].reset();
        });

        $.each(ABSTRACT_METHODS, function(_, name) {
            dxBaseGauge.prototype[name].reset();
        });

        rendererModule.Renderer.reset();

        factory.ThemeManager.reset();
        factory.createTranslator.reset();
        factory.createTracker.reset();
    },
    createGauge: function(options) {
        return new dxBaseGauge(this.$container, options);
    },
    waitForCallback: function() {
        this.clock.tick(0);
    }
};

QUnit.module("General", environment);

QUnit.test("Instance type", function(assert) {
    var gauge = this.createGauge();

    assert.ok(gauge instanceof dxBaseGauge);
});

QUnit.test("Components creation", function(assert) {
    this.createGauge({
        rtlEnabled: "rtl-enabled",
        pathModified: "path-modified",
        encodeHtml: "encode-html"
    });

    assert.deepEqual(factory.createTranslator.lastCall.args, [], "translator");
    assert.deepEqual(factory.ThemeManager.lastCall.args, [], "theme manager");
    assert.deepEqual(factory.createTracker.lastCall.args, [{ renderer: this.renderer, container: this.renderer.root }], "tracker");
    // assert.deepEqual(factory.createLayoutManager.lastCall.args, [], "layout manager");

    var arg = this.tracker.setCallbacks.lastCall.args[0];
    assert.ok(typeof arg["tooltip-show"] === "function", "show callback");
    assert.ok(typeof arg["tooltip-hide"] === "function", "hide callback");
});

QUnit.test("Components disposing", function(assert) {
    this.createGauge();

    this.$container.remove();

    assert.ok(this.renderer.dispose.called, "renderer"); // Should it be tester here?
    assert.deepEqual(this.themeManager.stub("dispose").lastCall.args, [], "theme manager");
    assert.deepEqual(this.tracker.stub("dispose").lastCall.args, [], "tracker");
    assert.deepEqual(this.title.stub("dispose").lastCall.args, [], "title");
});

QUnit.test("Domain", function(assert) {
    this.createGauge();

    assert.deepEqual(this.abstractMethods._setupDomainCore.lastCall.args, []);
});

QUnit.test("Codomain", function(assert) {
    this.createGauge();

    assert.deepEqual(this.abstractMethods._setupCodomain.lastCall.args, []);
});

QUnit.test("Tooltip is hidden on loading indicator showing", function(assert) {
    var gauge = this.createGauge();

    gauge._loadingIndicator.ctorArgs[0].notify(true);

    assert.deepEqual(this.tooltip.hide.lastCall.args, []);
});

QUnit.module("Base fields processing", environment);

QUnit.test("Animation / default", function(assert) {
    var gauge = this.createGauge();

    assert.deepEqual(gauge._animationSettings, {
        duration: 1000,
        easing: "easeOutCubic"
    });
});

QUnit.test("Animation / disabled", function(assert) {
    var gauge = this.createGauge({
        animation: {
            enabled: false,
            duration: 500
        }
    });

    assert.strictEqual(gauge._animationSettings, null);
});

QUnit.test("Animation", function(assert) {
    var gauge = this.createGauge({
        animation: {
            duration: 150,
            easing: "linear"
        }
    });

    assert.deepEqual(gauge._animationSettings, {
        duration: 150,
        easing: "linear"
    });
});

QUnit.test("Animation / duration is zero", function(assert) {
    var gauge = this.createGauge({
        animation: { duration: 0 }
    });

    assert.strictEqual(gauge._animationSettings, null);
});

QUnit.test("Animation / duration is negative", function(assert) {
    var gauge = this.createGauge({
        animation: { duration: -10 }
    });

    assert.strictEqual(gauge._animationSettings, null);
});

QUnit.test("Animation / options priority", function(assert) {
    var gauge = this.createGauge({
        animation: {},
        animationDuration: 100
    });

    assert.deepEqual(gauge._animationSettings, { duration: 1000, easing: "easeOutCubic" });
});

QUnit.test("Container background color", function(assert) {
    var gauge = this.createGauge({
        containerBackgroundColor: "red"
    });

    assert.strictEqual(gauge._containerBackgroundColor, "red");
});

//   B232087
QUnit.test("Default format options / very big numbers", function(assert) {
    this.translator.stub("getDomain").returns([1E100, 2E100]);
    this.abstractMethods._getApproximateScreenRange.returns(1000);

    var gauge = this.createGauge();

    assert.deepEqual(gauge._defaultFormatOptions, { type: "exponential", precision: 2 });
});

//  B232087
QUnit.test("Default format options / very small numbers", function(assert) {
    this.translator.stub("getDomain").returns([1E-20, 2E-20]);
    this.abstractMethods._getApproximateScreenRange.returns(100);

    var gauge = this.createGauge();

    assert.deepEqual(gauge._defaultFormatOptions, { type: "exponential", precision: 1 });
});

//  B232087
QUnit.test("Default format options / small numbers", function(assert) {
    this.translator.stub("getDomain").returns([0.0001, 0.0004]);
    this.abstractMethods._getApproximateScreenRange.returns(3);

    var gauge = this.createGauge();

    assert.deepEqual(gauge._defaultFormatOptions, { type: "fixedPoint", precision: 4 });
});

//  B232087
QUnit.test("Default format options / common numbers", function(assert) {
    this.translator.stub("getDomain").returns([0, 1000]);
    this.abstractMethods._getApproximateScreenRange.returns(10);

    var gauge = this.createGauge();

    assert.deepEqual(gauge._defaultFormatOptions, { type: "fixedPoint", precision: 0 });
});

QUnit.module("Rendering", environment);

QUnit.test("T305684. Title is single text", function(assert) {
    this.createGauge({
        title: "Test"
    });
    vizMocks.forceThemeOptions(this.themeManager);

    assert.deepEqual(this.title.update.getCall(0).args[0], { text: "Test", subtitle: {} });
});

QUnit.test("T305684. Subtitle is single text", function(assert) {
    this.createGauge({
        title: {
            text: "Test",
            subtitle: "Test2"
        }
    });
    vizMocks.forceThemeOptions(this.themeManager);

    assert.deepEqual(this.title.update.getCall(0).args[0], { text: "Test", subtitle: { text: "Test2" } });
});

QUnit.test("T305684. Deprecated subtitle", function(assert) {
    this.createGauge({
        subtitle: "Test3",
        title: {
            text: "Test",
            subtitle: "Test2"
        }
    });
    vizMocks.forceThemeOptions(this.themeManager);

    assert.deepEqual(this.title.update.getCall(0).args[0], { text: "Test", subtitle: { text: "Test3" } });
});

QUnit.test("Title is not rendered when text is empty", function(assert) {
    this.title._boundingRect = null;
    this.createGauge({});

    assert.deepEqual(this.title.stub("draw").callCount, 0);
});

QUnit.test("Tracker is activated", function(assert) {
    this.createGauge();

    assert.deepEqual(this.tracker.stub("setTooltipState").lastCall.args, ["tooltip_enabled"]);
    assert.deepEqual(this.tracker.stub("activate").lastCall.args, []);
});

QUnit.test("Content is rendered", function(assert) {
    this.createGauge();

    var _renderContent = this.abstractMethods._renderContent.lastCall;
    assert.deepEqual(_renderContent.args, [], "content");
    assert.ok(this.renderer.lock.lastCall.calledBefore(_renderContent) && this.renderer.unlock.lastCall.calledAfter(_renderContent), "lock");
});

// T130599
QUnit.test("Not rendered when value range is empty", function(assert) {
    var onIncidentOccurred = sinon.stub();
    this.translator.stub("getDomain").returns([0, 0]);

    this.createGauge({
        onIncidentOccurred: onIncidentOccurred
    });

    this.clock.tick(0);
    assert.strictEqual(this.abstractMethods._renderContent.lastCall, null);
    assert.strictEqual(onIncidentOccurred.lastCall.args[0].target.id, "W2301", "incident occurred");
});

QUnit.test("Drawn callback", function(assert) {
    var onDrawn = sinon.spy();
    var gauge = this.createGauge({
        onDrawn: onDrawn
    });

    gauge._beginValueChanging();
    gauge._beginValueChanging();
    gauge._endValueChanging();
    assert.strictEqual(onDrawn.callCount, 0);

    gauge._endValueChanging();
    assert.strictEqual(onDrawn.callCount, 1);
});

QUnit.test("Show tooltip", function(assert) {
    this.createGauge();

    var target = {
            getTooltipParameters: sinon.stub().returns({
                value: "value",
                color: "color",
                x: 100, y: 200, offset: 50
            })
        },
        info = { tag: "info" };
    this.renderer.getRootOffset = sinon.stub().returns({ left: 10, top: 20 });
    this.tooltip.stub("formatValue").returns("formatted-value");

    this.tracker.setCallbacks.lastCall.args[0]["tooltip-show"](target, info);

    assert.deepEqual(target.getTooltipParameters.lastCall.args, [], "tooltip parameters");
    assert.deepEqual(this.tooltip.formatValue.lastCall.args, ["value"], "value is formatted");
    assert.deepEqual(this.renderer.getRootOffset.lastCall.args, [], "renderer offset is got");
    assert.deepEqual(this.tooltip.show.lastCall.args, [
        { value: "value", color: "color", valueText: "formatted-value", tag: "info" },
        { x: 110, y: 220, offset: 50 },
        { target: info }
    ], "tooltip is shown");
});

QUnit.test("Hide tooltip", function(assert) {
    this.createGauge();

    this.tracker.setCallbacks.lastCall.args[0]["tooltip-hide"]();

    assert.deepEqual(this.tooltip.hide.lastCall.args, [], "tooltip is hidden");
});

QUnit.module("Resizing", environment);

// T173563
QUnit.test("Not resized when domain is not valid", function(assert) {
    this.translator.stub("getDomain").returns([0, 0]);
    this.createGauge();
    this.renderer.resize = sinon.spy();

    resizeCallbacks.fire();

    this.clock.tick(100);
    assert.strictEqual(this.renderer.resize.lastCall, null, "renderer is not resized");
});

QUnit.module("Option changing", environment);

QUnit.test("startValue and endValue", function(assert) {
    var gauge = this.createGauge();

    gauge.option({ startValue: 10, endValue: 20 });

    assert.deepEqual(this.abstractMethods._setupDomainCore.lastCall.args, [], "setup domain");
});

QUnit.test("Tooltip - options changing", function(assert) {
    var gauge = this.createGauge({ tooltip: "tooltip-options" });

    gauge.option("tooltip", { tooltip: "new_tooltip-options" });

    assert.deepEqual(this.tooltip.stub("update").lastCall.args[0], { tooltip: "new_tooltip-options" });
    assert.deepEqual(this.tracker.stub("setTooltipState").lastCall.args, ["tooltip_enabled"]);
});

QUnit.module("util - formatValue");

QUnit.test("no options", function(assert) {
    assert.strictEqual(formatValue(0.135467), "0.135467");
});

QUnit.test("format and precision", function(assert) {
    assert.strictEqual(formatValue(0.135467, { format: "fixedPoint", precision: 2 }), "0.14");
});

QUnit.test("customizeText", function(assert) {
    assert.deepEqual(formatValue(0.135467, {
        customizeText: function(arg) { return arg.value.toString() + "###" + arg.valueText; }
    }), "0.135467###0.135467");
});

QUnit.test("customizeText is not a function", function(assert) {
    assert.strictEqual(formatValue(0.135467, { customizeText: "test" }), "0.135467");
});

QUnit.test("format, precision and customizeText", function(assert) {
    assert.deepEqual(formatValue(0.135467, {
        format: "fixedPoint", precision: 2,
        customizeText: function() { return this.value.toString() + "###" + this.valueText; }
    }), "0.135467###0.14");
});

// B233462
QUnit.test("customizeText returns not a string (B233462)", function(assert) {
    assert.strictEqual(formatValue(100, {
        customizeText: function() { return this.value; }
    }), "100", "100");
    assert.strictEqual(formatValue(undefined, {
        customizeText: function() { return this.value; }
    }), "undefined", "undefined");
    assert.strictEqual(formatValue(null, {
        customizeText: function() { return this.value; }
    }), "null", "null");
});

QUnit.test("extra parameters for customizeText context", function(assert) {
    assert.strictEqual(formatValue(100, {
        customizeText: function(arg) {
            return arg.a1 + arg.a2 + arg.value;
        }
    }, { a1: "A1", a2: "A2" }), "A1A2100");
    assert.strictEqual(formatValue(200, {
        customizeText: function(arg) {
            return arg.value;
        }
    }, null), "200");
});

QUnit.module("util - getSampleText", {
    test_getSampleText: function(start, end) {
        return getSampleText(new translator1DModule.Translator1D(start, end, 0, 1), {
            customizeText: function(arg) {
                return arg.valueText + "##";
            }
        });
    }
});

QUnit.test("case 1", function(assert) {
    assert.strictEqual(this.test_getSampleText(0, 10), "10##");
});

QUnit.test("case 2", function(assert) {
    assert.strictEqual(this.test_getSampleText(9.999, 100), "9.999##");
});

QUnit.test("case 3", function(assert) {
    assert.strictEqual(this.test_getSampleText(-9.11, 9.999), "-9.11##");
});
