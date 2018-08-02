/* global currentTest */

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    tooltipModule = require("viz/core/tooltip"),
    Tooltip = tooltipModule.Tooltip,
    vizUtils = require("viz/core/utils"),
    rendererModule = require("viz/core/renderers/renderer");

QUnit.testStart(function() {
    $("<div>")
        .attr("class", "some-correct-class-name")
        .appendTo($("#qunit-fixture"));
});

function getInitialOptions() {
    return {
        enabled: true,
        shared: false,
        location: "center",
        color: "#ffffff",
        border: {
            width: 1,
            color: "#252525",
            dashStyle: "solid",
            opacity: 0.9,
            visible: true
        },
        opacity: 0.8,
        customizeTooltip: function() { return 1; },
        font: {
            size: 14,
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            weight: 400,
            color: "#939393",
            opacity: 0.7
        },
        arrowLength: 10,
        paddingLeftRight: 18,
        paddingTopBottom: 15,
        shadow: {
            opacity: 0.6,
            color: "#000000",
            offsetX: 5,
            offsetY: 6,
            blur: 7
        }
    };
}

rendererModule.Renderer = function(parameters) {
    var renderer = new vizMocks.Renderer(parameters);
    currentTest().renderer = renderer;
    return renderer;
};

QUnit.module("Main functionality", {
    beforeEach: function() {
        this.options = getInitialOptions();
        this.patchFontOptions = sinon.stub(vizUtils, "patchFontOptions", function(arg) {
            var obj = {};
            for(var key in arg) {
                obj[key + "Patched"] = arg[key];
            }
            return obj;
        });
    },
    afterEach: function() {
        this.patchFontOptions.restore();
    }
});

QUnit.test("Create tooltip", function(assert) {
    var et = { event: "trigger" },
        tooltip,
        wrapper,
        div;

    // act
    tooltip = new Tooltip({ eventTrigger: et, cssClass: "tooltip-class", pathModified: "pathModified-option" });

    // assert
    assert.equal(tooltip._eventTrigger, et, "eventTrigger");
    assert.deepEqual(tooltip._renderer.ctorArgs, [{ pathModified: "pathModified-option", container: tooltip._wrapper[0] }], "renderer with rendererOptions");

    assert.ok(tooltip._wrapper, "wrapper");
    wrapper = tooltip._wrapper.get(0);
    assert.equal(wrapper.nodeName, "DIV");
    assert.equal(wrapper.className, "tooltip-class");
    assert.equal(wrapper.style.position, "absolute");
    assert.equal(wrapper.style.overflow, "visible");
    assert.equal(wrapper.style.height, "1px"); // T447623

    assert.equal(tooltip._renderer.root.attr.callCount, 1, "renderer root attr");
    assert.deepEqual(tooltip._renderer.root.attr.firstCall.args, [{ "pointer-events": "none" }]);

    assert.equal(tooltip._renderer.path.callCount, 1, "cloud element created");
    assert.deepEqual(tooltip._renderer.path.firstCall.args, [[], "area"]);
    assert.equal(tooltip._cloud, tooltip._renderer.path.firstCall.returnValue);
    assert.equal(tooltip._cloud.sharp.callCount, 1, "cloud sharp");
    assert.equal(tooltip._cloud.append.callCount, 1, "cloud added to dom");
    assert.deepEqual(tooltip._cloud.append.firstCall.args, [tooltip._renderer.root]);

    assert.equal(tooltip._renderer.shadowFilter.callCount, 1, "shadow element created");
    assert.deepEqual(tooltip._renderer.shadowFilter.firstCall.args, []);
    assert.equal(tooltip._shadow, tooltip._renderer.shadowFilter.firstCall.returnValue);

    // for svg text ↓
    assert.equal(tooltip._renderer.g.callCount, 1, "text group element created");
    assert.deepEqual(tooltip._renderer.g.firstCall.args, []);
    assert.equal(tooltip._textGroup, tooltip._renderer.g.firstCall.returnValue);

    assert.equal(tooltip._textGroup.attr.callCount, 1, "textGroup attrs");
    assert.deepEqual(tooltip._textGroup.attr.firstCall.args, [{ align: "center" }]);

    assert.equal(tooltip._textGroup.append.callCount, 1, "textGroup added to dom");
    assert.deepEqual(tooltip._textGroup.append.firstCall.args, [tooltip._renderer.root]);

    assert.equal(tooltip._renderer.text.callCount, 1, "text element created");
    assert.deepEqual(tooltip._renderer.text.firstCall.args, [undefined, 0, 0]);
    assert.equal(tooltip._text, tooltip._renderer.text.firstCall.returnValue);

    assert.equal(tooltip._text.append.callCount, 1, "text added to dom");
    assert.deepEqual(tooltip._text.append.firstCall.args, [tooltip._textGroup]);
    // for svg text ↑

    // for html text ↓
    assert.ok(tooltip._textGroupHtml, "textGroupHtml");
    div = tooltip._textGroupHtml.get(0);
    assert.equal(div.nodeName, "DIV");
    assert.equal(div.parentNode, tooltip._wrapper.get(0));
    assert.equal(div.style.position, "absolute");
    assert.equal(div.style.width, "0px");
    assert.equal(div.style.padding, "0px");
    assert.equal(div.style.margin, "0px");
    assert.equal(div.style["border-width"], "0px");
    assert.equal(div.style["border-style"], "solid");
    assert.equal(div.style["border-color"], "transparent");

    assert.ok(tooltip._textHtml, "textHtml");
    div = tooltip._textHtml.get(0);
    assert.equal(div.nodeName, "DIV");
    assert.equal(div.parentNode, tooltip._textGroupHtml.get(0));
    assert.equal(div.style.position, "relative");
    assert.equal(div.style.display, "inline-block");
    assert.equal(div.style.padding, "0px");
    assert.equal(div.style.margin, "0px");
    assert.equal(div.style["border-width"], "0px");
    assert.equal(div.style["border-style"], "solid");
    assert.equal(div.style["border-color"], "transparent");
    // for html text ↑
});

QUnit.test("Set options. All options", function(assert) {
    var et = { event: "trigger" },
        tooltip = new Tooltip({ eventTrigger: et }),
        result;

    // act
    result = tooltip.setOptions(this.options);

    // assert
    assert.equal(tooltip, result);
    assert.deepEqual(tooltip._options, this.options, "whole options");
    assert.deepEqual(tooltip._shadowSettings, {
        x: "-50%",
        y: "-50%",
        width: "200%",
        height: "200%",
        opacity: 0.6,
        color: "#000000",
        offsetX: 5,
        offsetY: 6,
        blur: 7
    }, "shadow");
    assert.deepEqual(tooltip._cloudSettings, {
        opacity: this.options.opacity,
        filter: tooltip._shadow.id,
        "stroke-width": this.options.border.width,
        stroke: this.options.border.color,
        "stroke-opacity": this.options.border.opacity,
        dashStyle: this.options.border.dashStyle
    }, "cloud");
    assert.equal(this.patchFontOptions.callCount, 1, "font");
    assert.deepEqual(this.patchFontOptions.firstCall.args, [this.options.font]);
    assert.equal(tooltip._textFontStyles, this.patchFontOptions.firstCall.returnValue); // reference
    assert.equal(tooltip._textFontStyles.color, this.options.font.color); // additional value

    assert.equal(tooltip._customizeTooltip, this.options.customizeTooltip, "customizeTooltip");
});

QUnit.test("Set options. Cloud border options", function(assert) {
    var et = { event: "trigger" },
        tooltip = new Tooltip({ eventTrigger: et }),
        result;
    this.options.border.visible = false;
    // act
    result = tooltip.setOptions(this.options);

    // assert
    assert.equal(tooltip, result);
    assert.deepEqual(tooltip._options, this.options, "whole options");
    assert.deepEqual(tooltip._cloudSettings, {
        opacity: this.options.opacity,
        filter: tooltip._shadow.id,
        "stroke-width": null,
        stroke: null
    }, "cloud");
});

QUnit.test("Set options. ZIndex", function(assert) {
    var et = { event: "trigger" },
        tooltip = new Tooltip({ eventTrigger: et }),
        result;
    this.options.zIndex = 1000;
    // act
    sinon.spy(tooltip._wrapper, "css");
    result = tooltip.setOptions(this.options);

    // assert
    assert.equal(tooltip, result);
    assert.deepEqual(tooltip._options, this.options, "whole options");
    assert.deepEqual(tooltip._wrapper.css.lastCall.args[0], { "zIndex": 1000 }, "zIndex");
});

QUnit.test("Set options. Container is incorrect", function(assert) {
    var et = { event: "trigger" },
        tooltip = new Tooltip({ eventTrigger: et }),
        result;
    this.options.container = ".some-wrong-class-name";
    // act
    result = tooltip.setOptions(this.options);

    // assert
    assert.equal(tooltip, result);
    assert.equal(tooltip._getContainer(), $("body").get(0));
});

QUnit.test("Set options. Container is correct", function(assert) {
    var et = { event: "trigger" },
        tooltip = new Tooltip({ eventTrigger: et }),
        result;
    this.options.container = ".some-correct-class-name";
    // act
    result = tooltip.setOptions(this.options);

    // assert
    assert.equal(tooltip, result);
    assert.equal(tooltip._getContainer(), $(".some-correct-class-name").get(0));
});

QUnit.test("Append tooltip to container on shown", function(assert) {
    $("#qunit-fixture")
        .append("<div class='tooltip-container'></div>")
        .append("<div class='tooltip-container'></div>");

    var et = { eventTrigger: function() {}, cssClass: "test-tooltip" },
        tooltip = new Tooltip(et);

    this.options.container = ".tooltip-container";
    tooltip.setOptions(this.options);

    tooltip.show({ valueText: "text" }, {});
    // act
    $(".tooltip-container").eq(0).remove();
    tooltip.show({ valueText: "text" }, {});

    assert.strictEqual($(".test-tooltip").parent().get(0), $(".tooltip-container").get(0));
});

QUnit.test("Tooltip should be appended in the closest element to root", function(assert) {
    $("#qunit-fixture")
        .append("<div class='tooltip-container far'></div>")
        .append("<div class='tooltip-container'><div id='root'></div></div>");

    var et = { eventTrigger: function() { }, cssClass: "test-tooltip", widgetRoot: $("#root").get(0) },
        tooltip = new Tooltip(et);

    this.options.container = ".tooltip-container";

    tooltip.setOptions(this.options);

    tooltip.show({ valueText: "text" }, {});
    // act
    var $tooltipContainer = $(".test-tooltip").parent().eq(0);
    assert.ok($tooltipContainer.hasClass("tooltip-container"));
    assert.ok(!$tooltipContainer.hasClass("far"));
});

QUnit.test("Set options. customizeTooltip", function(assert) {
    var et = { event: "trigger" },
        tooltip = new Tooltip({ eventTrigger: et }),
        result;
    this.options.customizeTooltip = {};
    // act
    result = tooltip.setOptions(this.options);

    // assert
    assert.equal(tooltip, result);
    assert.deepEqual(tooltip._options, this.options, "whole options");
    assert.strictEqual(tooltip._customizeTooltip, null, "customizeTooltip");
});

QUnit.test("Set options. Two times", function(assert) {
    var et = { event: "trigger" },
        options2 = {
            enabled: false,
            shared: true,
            location: "left",
            border: {
                width: 2,
                color: "color1",
                dashStyle: "dashStyle",
                opacity: 0.9,
                visible: true
            },
            color: "color2",
            opacity: 0.8,
            customizeTooltip: {},
            format: "format10",
            argumentFormat: "format20",
            precision: 10,
            argumentPrecision: 20,
            percentPrecision: 30,
            font: {
                size: 120,
                family: "Some font",
                weight: 40,
                color: "color3",
                opacity: 0.7
            },
            arrowLength: 100,
            paddingLeftRight: 180,
            paddingTopBottom: 150,
            shadow: {
                opacity: 0.6,
                color: "color4",
                offsetX: 13,
                offsetY: 40,
                blur: 20
            }
        },
        tooltip = new Tooltip({ eventTrigger: et }),
        result;

    tooltip.setOptions(this.options);

    // act
    result = tooltip.setOptions(options2);

    // assert
    assert.equal(tooltip, result);
    assert.deepEqual(tooltip._options, options2, "whole options");
    assert.deepEqual(tooltip._shadowSettings, {
        x: "-50%",
        y: "-50%",
        width: "200%",
        height: "200%",
        opacity: 0.6,
        color: "color4",
        offsetX: 13,
        offsetY: 40,
        blur: 20
    }, "shadow");
    assert.deepEqual(tooltip._cloudSettings, {
        opacity: options2.opacity,
        filter: tooltip._shadow.id,
        "stroke-width": options2.border.width,
        stroke: options2.border.color,
        "stroke-opacity": options2.border.opacity,
        dashStyle: options2.border.dashStyle
    }, "cloud");

    assert.equal(this.patchFontOptions.callCount, 2, "font");
    assert.deepEqual(this.patchFontOptions.lastCall.args, [options2.font]);
    assert.deepEqual(tooltip._textFontStyles, this.patchFontOptions.lastCall.returnValue);
    assert.strictEqual(tooltip._customizeTooltip, null, "customizeTooltip");
});

QUnit.test("Set renderer options", function(assert) {
    var options = { tag: "options" },
        tooltip = new Tooltip({});

    tooltip.setRendererOptions(options);

    assert.deepEqual(this.renderer.setOptions.lastCall.args, [options], "renderer options");
    assert.strictEqual(tooltip._wrapper.children().first().css("direction"), "ltr", "direction");
});

QUnit.test("Set renderer options / rtl enabled", function(assert) {
    var options = { tag: "options", rtl: 1 },
        tooltip = new Tooltip({});

    tooltip.setRendererOptions(options);

    assert.deepEqual(this.renderer.setOptions.lastCall.args, [options], "renderer options");
    assert.strictEqual(tooltip._wrapper.children().first().css("direction"), "rtl", "direction");
});

QUnit.test("Render, enabled", function(assert) {
    var et = { event: "trigger" },
        tooltip = new Tooltip({ eventTrigger: et }),
        result;

    tooltip.setOptions(this.options);

    tooltip._wrapper.appendTo = sinon.spy();
    tooltip._wrapper.detach = sinon.spy();
    tooltip._textGroupHtml.css = sinon.spy();

    // act
    result = tooltip.render();

    // assert
    assert.equal(tooltip, result);
    assert.equal(tooltip._wrapper.appendTo.callCount, 0, "wrapper is not added to dom");
    assert.equal(tooltip._wrapper.get(0).style.left, "-9999px", "wrapper is moved to invisible area");
    assert.equal(tooltip._wrapper.detach.callCount, 1, "wrapper detached");

    assert.equal(tooltip._cloud.attr.callCount, 1, "cloud attrs");
    assert.deepEqual(tooltip._cloud.attr.firstCall.args, [tooltip._cloudSettings]);

    assert.equal(tooltip._shadow.attr.callCount, 1, "shadow attrs");
    assert.deepEqual(tooltip._shadow.attr.firstCall.args, [tooltip._shadowSettings]);

    // for svg text ↓
    assert.equal(tooltip._textGroup.css.callCount, 1, "textGroup styles");
    assert.deepEqual(tooltip._textGroup.css.firstCall.args, [tooltip._textFontStyles]);

    assert.equal(tooltip._text.css.callCount, 1, "text styles");
    assert.deepEqual(tooltip._text.css.firstCall.args, [tooltip._textFontStyles]);
    // for svg text ↑

    // for html text ↓
    assert.equal(tooltip._textGroupHtml.css.callCount, 1, "textGroupHtml styles");
    assert.deepEqual(tooltip._textGroupHtml.css.firstCall.args, [tooltip._textFontStyles]);
    // for html text ↑
});

QUnit.test("Update", function(assert) {
    var et = { event: "trigger" },
        options = { enabled: false, font: {} },
        tooltip = new Tooltip({ eventTrigger: et }),
        setOptions = tooltip.setOptions,
        render = tooltip.render,
        result;

    tooltip.setOptions = sinon.spy(function() { return setOptions.apply(tooltip, arguments); });
    tooltip.render = sinon.spy(function() { return render.apply(tooltip, arguments); });

    // act
    result = tooltip.update(options);

    // assert
    assert.equal(tooltip, result);
    assert.equal(tooltip.setOptions.callCount, 1);
    assert.equal(tooltip.setOptions.firstCall.args[0], options);
    assert.equal(tooltip.render.callCount, 1);
    assert.ok(tooltip.render.firstCall.calledAfter(tooltip.setOptions.firstCall));
});

QUnit.test("Disposing", function(assert) {
    var et = { event: "trigger" },
        tooltip = new Tooltip({ eventTrigger: et, widgetRoot: $("#qunit-fixture") });
    tooltip._wrapper.remove && (tooltip._wrapper.remove = sinon.spy());

    // act
    tooltip.dispose();

    // assert
    assert.equal(tooltip._renderer.dispose.callCount, 1);
    assert.equal(tooltip._wrapper.remove.callCount, 1);
    assert.equal(tooltip._options, null);
    assert.equal(tooltip._widgetRoot, null);
});

QUnit.test("formatValue. Default format", function(assert) {
    var tooltip = new Tooltip({ eventTrigger: {} });
    tooltip.setOptions($.extend(this.options,
        { format: "" }));

    assert.equal(tooltip.formatValue("test"), "test");
});

QUnit.test("formatValue. Custom format", function(assert) {
    var tooltip = new Tooltip({ eventTrigger: {} });
    tooltip.setOptions($.extend(this.options,
        { format: { type: "currency", precision: 3, percentPrecision: 4 }, argumentFormat: { type: "percent", precision: 1 } }));

    assert.equal(tooltip.formatValue(30), "$30.000");
    assert.equal(tooltip.formatValue(0.1, "argument"), "10.0%");
    assert.equal(tooltip.formatValue(0.4, "percent"), "40.0000%");
});

QUnit.test("formatValue. Custom format without precision", function(assert) {
    var tooltip = new Tooltip({ eventTrigger: {} });
    tooltip.setOptions($.extend(this.options,
        { format: "currency", argumentFormat: "" }));

    assert.equal(tooltip.formatValue(30), "$30");
    assert.equal(tooltip.formatValue(0.1, "argument"), 0.1);
    assert.equal(tooltip.formatValue(0.4, "percent"), "40%");
});

QUnit.test("formatValue. Null argumentFormat", function(assert) {
    var tooltip = new Tooltip({ eventTrigger: {} });
    tooltip.setOptions($.extend(this.options,
        { argumentFormat: null }));

    assert.equal(tooltip.formatValue(12, "argument"), 12);
});

QUnit.test("formatValue. Null valueFormat", function(assert) {
    var tooltip = new Tooltip({ eventTrigger: {} });
    tooltip.setOptions($.extend(this.options,
        { format: null }));

    assert.equal(tooltip.formatValue(12, "value"), 12);
});

QUnit.test("getLocation", function(assert) {
    this.testCase = function(option, expected) {
        var tooltip = new Tooltip({ eventTrigger: {} });
        tooltip.setOptions($.extend(this.options, { location: option }));

        assert.equal(tooltip.getLocation(), expected);
    };

    this.testCase("edge", "edge");
    this.testCase("CenTer", "center");
    this.testCase(null, "null");
    this.testCase(5, "5");
});

QUnit.test("isEnabled", function(assert) {
    this.testCase = function(option, expected) {
        var tooltip = new Tooltip({ eventTrigger: {} });
        tooltip.setOptions($.extend(this.options, { enabled: option }));

        assert.equal(tooltip.isEnabled(), expected);
    };

    this.testCase(true, true);
    this.testCase(false, false);
    this.testCase(null, false);
    this.testCase(5, true);
});

QUnit.test("isShared", function(assert) {
    this.testCase = function(option, expected) {
        var tooltip = new Tooltip({ eventTrigger: {} });
        tooltip.setOptions($.extend(this.options, { shared: option }));

        assert.equal(tooltip.isShared(), expected);
    };

    this.testCase(true, true);
    this.testCase(false, false);
    this.testCase(null, false);
    this.testCase(5, true);
});

QUnit.module("Manipulation", {
    beforeEach: function() {
        var tooltip,
            getComputedStyle = window.getComputedStyle;

        this.options = getInitialOptions();
        this.eventTrigger = sinon.spy();
        this.tooltip = tooltip = new Tooltip({ eventTrigger: this.eventTrigger });
        tooltip.update(this.options);

        this.resetTooltipMocks = function() {
            tooltip._cloud.stub("attr").reset();
            tooltip._shadow.stub("attr").reset();
            tooltip._textGroup.stub("attr").reset();
            tooltip._textGroup.stub("css").reset();
            tooltip._textGroup.stub("move").reset();
            tooltip._text.stub("css").reset();
            tooltip._renderer.stub("resize").reset();
        };

        if(tooltip._textGroup && tooltip._textGroup.stub("getBBox")) {
            tooltip._textGroup.getBBox = sinon.spy(function() { return { x: -10, y: -5, width: 20, height: 7 }; });
        }

        if(getComputedStyle) {
            this.getComputedStyle = sinon.stub(window, "getComputedStyle", function(elem) {
                if(elem === tooltip._textHtml.get(0)) {
                    return { width: "83.13px", height: "23.45px" };
                }
                return getComputedStyle.apply(window, arguments);
            });
        }
    },
    afterEach: function() {
        this.getComputedStyle && this.getComputedStyle.restore();
        this.tooltip.dispose();
    }
});

QUnit.test("Show preparations. W/o customize, empty text", function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var result = this.tooltip.show({ valueText: "" }, {});

    assert.strictEqual(result, false);
    assert.equal(this.eventTrigger.callCount, 0, "event is not triggered");

    assert.deepEqual(this.tooltip._state, {
        a: "b"
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, "wrapper is not added to dom");
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test("Show preparations. W/o customize, w/ text", function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var result = this.tooltip.show({ valueText: "some-text" }, { x: 100, y: 200, offset: 300 });
    delete this.tooltip._state.contentSize;

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ["tooltipShown", undefined], "event is triggered");

    assert.deepEqual(this.tooltip._state, {
        color: "#ffffff",
        borderColor: "#252525",
        textColor: "#939393",
        text: "some-text",
        tc: {}
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, "wrapper is added to dom");
    assert.deepEqual(this.tooltip._wrapper.appendTo.firstCall.args, [$("body").get(0)]);
    assert.equal(this.tooltip.move.callCount, 1);
    assert.deepEqual(this.tooltip.move.firstCall.args, [100, 200, 300]);
});

QUnit.test("Show preparations. W/ customize empty text, empty text", function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { text: "", color: "cColor1", borderColor: "cColor2", fontColor: "cColor3", someAnotherProperty: "some-value" }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var formatObject = { valueText: "" };

    var result = this.tooltip.show(formatObject, {});

    assert.strictEqual(result, false);
    assert.equal(this.eventTrigger.callCount, 0, "event is not triggered");

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        a: "b"
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, "wrapper is not added to dom");
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test("Show preparations. W/ customize undefined text, empty text", function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { text: undefined, color: "cColor1", borderColor: "cColor2", fontColor: "cColor3", someAnotherProperty: "some-value" }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var formatObject = { valueText: "" };

    var result = this.tooltip.show(formatObject, {});

    assert.strictEqual(result, false);
    assert.equal(this.eventTrigger.callCount, 0, "event is not triggered");

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        a: "b"
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, "wrapper is not added to dom");
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test("Show preparations. W/ customize w/o text, empty text", function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { color: "cColor1", borderColor: "cColor2", fontColor: "cColor3", someAnotherProperty: "some-value" }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var formatObject = { valueText: "" };

    var result = this.tooltip.show(formatObject, {});

    assert.strictEqual(result, false);
    assert.equal(this.eventTrigger.callCount, 0, "event is not triggered");

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        a: "b"
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, "wrapper is not added to dom");
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test("Show preparations. W/ customize w/o text, w/ text", function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { color: "cColor1", borderColor: "cColor2", fontColor: "cColor3", someAnotherProperty: "some-value" }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var formatObject = { valueText: "some-text" };

    var result = this.tooltip.show(formatObject, {});
    delete this.tooltip._state.contentSize;

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ["tooltipShown", undefined], "event is triggered");

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        color: "cColor1",
        borderColor: "cColor2",
        textColor: "cColor3",
        text: "some-text",
        tc: {}
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, "wrapper is not added to dom");
    assert.equal(this.tooltip.move.callCount, 1);
});

QUnit.test("Show preparations. W/ customize w/ text, empty text", function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { text: "some-customized-text", color: "cColor1", borderColor: "cColor2", fontColor: "cColor3", someAnotherProperty: "some-value" }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var formatObject = { valueText: "" };

    var result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 });
    delete this.tooltip._state.contentSize;

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ["tooltipShown", undefined], "event is triggered");

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        color: "cColor1",
        borderColor: "cColor2",
        textColor: "cColor3",
        text: "some-customized-text",
        tc: {}
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, "wrapper is added to dom");
    assert.deepEqual(this.tooltip._wrapper.appendTo.firstCall.args, [$("body").get(0)]);
    assert.equal(this.tooltip.move.callCount, 1);
    assert.deepEqual(this.tooltip.move.firstCall.args, [100, 200, 300]);
});

QUnit.test("Show preparations. W/ customize w/ text, w/ text", function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { text: "some-customized-text", color: "cColor1", borderColor: "cColor2", fontColor: "cColor3", someAnotherProperty: "some-value" }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var formatObject = { valueText: "some-text" };

    var result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 });
    delete this.tooltip._state.contentSize;

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ["tooltipShown", undefined], "event is triggered");

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        color: "cColor1",
        borderColor: "cColor2",
        textColor: "cColor3",
        text: "some-customized-text",
        tc: {}
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, "wrapper is added to dom");
    assert.deepEqual(this.tooltip._wrapper.appendTo.firstCall.args, [$("body").get(0)]);
    assert.equal(this.tooltip.move.callCount, 1);
    assert.deepEqual(this.tooltip.move.firstCall.args, [100, 200, 300]);
});

QUnit.test("Show preparations. W/ customize empty html", function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { html: "", color: "cColor1", borderColor: "cColor2", fontColor: "cColor3", someAnotherProperty: "some-value" }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var formatObject = { valueText: "" };

    var result = this.tooltip.show(formatObject, {});

    assert.strictEqual(result, false);
    assert.strictEqual(this.eventTrigger.callCount, 0, "event is not triggered");

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        a: "b"
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, "wrapper is not added to dom");
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test("Show preparations. W/ customize empty html, w/text", function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { html: "", color: "cColor1", borderColor: "cColor2", fontColor: "cColor3", someAnotherProperty: "some-value" }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var formatObject = { valueText: "10" };

    var result = this.tooltip.show(formatObject, {});

    assert.strictEqual(result, false);
    assert.strictEqual(this.eventTrigger.callCount, 0, "event is not triggered");

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        a: "b"
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, "wrapper is not added to dom");
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test("Show preparations. W/ customize undefined html", function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { html: undefined, color: "cColor1", borderColor: "cColor2", fontColor: "cColor3", someAnotherProperty: "some-value" }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var formatObject = { valueText: "" };

    var result = this.tooltip.show(formatObject, {});

    assert.strictEqual(result, false);
    assert.strictEqual(this.eventTrigger.callCount, 0, "event is not triggered");

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        a: "b"
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, "wrapper is not added to dom");
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test("Show preparations. W/ customize w/ html", function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { html: "some-customized-html", color: "cColor1", borderColor: "cColor2", fontColor: "cColor3", someAnotherProperty: "some-value" }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var formatObject = { valueText: "" };

    var result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 });
    delete this.tooltip._state.contentSize;

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ["tooltipShown", undefined], "event is triggered");

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        color: "cColor1",
        borderColor: "cColor2",
        textColor: "cColor3",
        html: "some-customized-html",
        tc: {}
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, "wrapper is added to dom");
    assert.deepEqual(this.tooltip._wrapper.appendTo.firstCall.args, [$("body").get(0)]);
    assert.equal(this.tooltip.move.callCount, 1);
    assert.deepEqual(this.tooltip.move.firstCall.args, [100, 200, 300]);
});

QUnit.test("Show preparations. W/ customize w/ html/text", function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { text: "some-customized-text", html: "some-customized-html", color: "cColor1", borderColor: "cColor2", fontColor: "cColor3", someAnotherProperty: "some-value" }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var formatObject = { valueText: "" };

    var result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 });
    delete this.tooltip._state.contentSize;

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ["tooltipShown", undefined], "event is triggered");

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        color: "cColor1",
        borderColor: "cColor2",
        textColor: "cColor3",
        text: "some-customized-text",
        html: "some-customized-html",
        tc: {}
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, "wrapper is added to dom");
    assert.deepEqual(this.tooltip._wrapper.appendTo.firstCall.args, [$("body").get(0)]);
    assert.equal(this.tooltip.move.callCount, 1);
    assert.deepEqual(this.tooltip.move.firstCall.args, [100, 200, 300]);
});

QUnit.test("Show preparations. Certain container", function(assert) {
    this.options.customizeTooltip = null;
    this.options.container = ".some-correct-class-name";
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: "b" };

    var result = this.tooltip.show({ valueText: "some-text" }, { x: 100, y: 200, offset: 300 });
    delete this.tooltip._state.contentSize;

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ["tooltipShown", undefined], "event is triggered");

    assert.deepEqual(this.tooltip._state, {
        color: "#ffffff",
        borderColor: "#252525",
        textColor: "#939393",
        text: "some-text",
        tc: {}
    }, "state");

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, "wrapper is added to dom");
    assert.deepEqual(this.tooltip._wrapper.appendTo.firstCall.args, [$(".some-correct-class-name").get(0)]);
    assert.equal(this.tooltip.move.callCount, 1);
    assert.deepEqual(this.tooltip.move.firstCall.args, [100, 200, 300]);
});

QUnit.test("Show. W/o params", function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._textGroupHtml.css = sinon.spy();
    this.tooltip._textGroupHtml.width = sinon.spy(function() { return 85; });
    this.tooltip._textGroupHtml.height = sinon.spy(function() { return 43; });
    this.tooltip._textHtml.html = sinon.spy();
    var eventData = { tag: "event-data" };

    // act
    var result = this.tooltip.show({ valueText: "some-text" }, { x: 100, y: 200, offset: 300 }, eventData);
    delete this.tooltip._state.contentSize;

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ["tooltipShown", eventData], "event is triggered");

    assert.deepEqual(this.tooltip._state, {
        color: "#ffffff",
        borderColor: "#252525",
        textColor: "#939393",
        text: "some-text",
        tc: {}
    }, "state");

    assert.equal(this.tooltip._shadow.attr.callCount, 0, "shadow attrs");
    assert.equal(this.tooltip._textGroup.attr.callCount, 0, "textGroup attrs");

    assert.equal(this.tooltip._cloud.attr.callCount, 1, "cloud attrs");
    assert.deepEqual(this.tooltip._cloud.attr.firstCall.args, [{ fill: "#ffffff", stroke: "#252525" }]);

    assert.equal(this.tooltip._textGroup.css.callCount, 1, "textGroup styles");
    assert.deepEqual(this.tooltip._textGroup.css.firstCall.args, [{ fill: "#939393" }]);

    assert.equal(this.tooltip._text.css.callCount, 1, "text styles");
    assert.deepEqual(this.tooltip._text.css.firstCall.args, [{ fill: "#939393" }]);

    assert.equal(this.tooltip._text.attr.callCount, 1, "text attrs");
    assert.deepEqual(this.tooltip._text.attr.firstCall.args, [{ text: "some-text" }]);

    assert.equal(this.tooltip._textGroupHtml.css.callCount, 0, "textGroupHtml styles");
    assert.equal(this.tooltip._textGroupHtml.width.callCount, 0, "textGroupHtml width");

    assert.equal(this.tooltip._textHtml.html.callCount, 1, "textHtml html");
    assert.deepEqual(this.tooltip._textHtml.html.firstCall.args, [""], "textHtml html");

    assert.ok(this.tooltip._wrapper.appendTo.lastCall.calledBefore(this.tooltip._textGroup.getBBox.firstCall));

    assert.equal(this.tooltip.move.callCount, 1);
    assert.deepEqual(this.tooltip.move.firstCall.args, [100, 200, 300]);
});

QUnit.test("Show. W/o params. Html", function(assert) {
    var canvas = { left: 0, top: 0, width: 800, height: 600, fullWidth: 3000, fullHeight: 2000 },
        eventData = { tag: "event-data" };
    this.tooltip._getCanvas = function() { return canvas; };
    this.options.customizeTooltip = function() { return { html: "some-html" }; };
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._textGroupHtml.css = sinon.spy();
    this.tooltip._textGroupHtml.width = sinon.spy();
    this.tooltip._textGroupHtml.height = sinon.spy();
    this.tooltip._textHtml.html = sinon.spy();

    var textHtmlElement = this.tooltip._textHtml.get(0);
    if(!this.getComputedStyle) {
        textHtmlElement.getBoundingClientRect = sinon.spy(function() { return { right: 103.13, left: 20, bottom: 33.45, top: 10 }; });
    }

    // act
    var result = this.tooltip.show({ valueText: "some-text" }, { x: 100, y: 200, offset: 300 }, eventData);
    delete this.tooltip._state.contentSize;

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ["tooltipShown", eventData], "event is triggered");

    assert.deepEqual(this.tooltip._state, {
        color: "#ffffff",
        borderColor: "#252525",
        textColor: "#939393",
        html: "some-html",
        tc: {}
    }, "state");

    assert.equal(this.tooltip._shadow.attr.callCount, 0, "shadow attrs");
    assert.equal(this.tooltip._textGroup.attr.callCount, 0, "textGroup attrs");

    assert.equal(this.tooltip._cloud.attr.callCount, 1, "cloud attrs");
    assert.deepEqual(this.tooltip._cloud.attr.firstCall.args, [{ fill: "#ffffff", stroke: "#252525" }]);

    assert.equal(this.tooltip._textGroupHtml.css.callCount, 1, "textGroupHtml styles");
    assert.deepEqual(this.tooltip._textGroupHtml.css.firstCall.args, [{ color: "#939393", width: 800 }]);

    assert.equal(this.tooltip._textGroupHtml.width.callCount, 1, "textGroupHtml width");
    assert.deepEqual(this.tooltip._textGroupHtml.width.firstCall.args, [84]);

    assert.equal(this.tooltip._textGroupHtml.height.callCount, 1, "textGroupHtml height");
    assert.deepEqual(this.tooltip._textGroupHtml.height.firstCall.args, [24]);

    assert.equal(this.tooltip._textHtml.html.callCount, 1, "textHtml html");
    assert.deepEqual(this.tooltip._textHtml.html.firstCall.args, ["some-html"], "textHtml html");

    assert.equal(this.tooltip._textGroup.css.callCount, 0, "textGroup styles");
    assert.equal(this.tooltip._text.css.callCount, 0, "text styles");
    assert.equal(this.tooltip._text.attr.callCount, 1, "text attrs");
    assert.deepEqual(this.tooltip._text.attr.firstCall.args, [{ text: "" }]);

    if(this.getComputedStyle) {
        assert.ok(this.tooltip._wrapper.appendTo.lastCall.calledBefore(this.getComputedStyle.withArgs(textHtmlElement).lastCall));
    } else {
        assert.ok(this.tooltip._wrapper.appendTo.lastCall.calledBefore(textHtmlElement.getBoundingClientRect.firstCall));
    }

    assert.equal(this.tooltip.move.callCount, 1);
    assert.deepEqual(this.tooltip.move.firstCall.args, [100, 200, 300]);
});

QUnit.test("Show. W/o params. Html. T298249", function(assert) {
    var canvas = { left: 0, top: 0, width: 800, height: 600, fullWidth: 3000, fullHeight: 2000 },
        eventData = { tag: "event-data" };
    this.tooltip._getCanvas = function() { return canvas; };
    this.options.customizeTooltip = function() { return { html: "some-html" }; };
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._textGroupHtml.css = sinon.spy();
    this.tooltip._textGroupHtml.width = sinon.spy();
    this.tooltip._textGroupHtml.height = sinon.spy();
    this.tooltip._textHtml.html = sinon.spy();

    var textHtmlElement = this.tooltip._textHtml.get(0);
    if(!this.getComputedStyle) {
        textHtmlElement.getBoundingClientRect = sinon.spy(function() { return { right: 123.13, left: 20, bottom: 33.45, top: 20, width: 83.13, height: 23.45 }; });
    }

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 100, y: 200, offset: 300 }, eventData);
    delete this.tooltip._state.contentSize;

    assert.equal(this.tooltip._textGroupHtml.width.callCount, 1, "textGroupHtml width");
    assert.deepEqual(this.tooltip._textGroupHtml.width.firstCall.args, [84]);

    assert.equal(this.tooltip._textGroupHtml.height.callCount, 1, "textGroupHtml height");
    assert.deepEqual(this.tooltip._textGroupHtml.height.firstCall.args, [24]);

    if(this.getComputedStyle) {
        assert.ok(this.tooltip._wrapper.appendTo.lastCall.calledBefore(this.getComputedStyle.withArgs(textHtmlElement).lastCall));
    } else {
        assert.ok(this.tooltip._wrapper.appendTo.lastCall.calledBefore(textHtmlElement.getBoundingClientRect.firstCall));
    }
});

QUnit.test("Show. W/ params", function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });

    // act
    var result = this.tooltip.show({ valueText: "some-text" }, { x: 10, y: 20, offset: 30 });
    delete this.tooltip._state.contentSize;

    assert.strictEqual(result, true);
    assert.deepEqual(this.tooltip._state, {
        color: "#ffffff",
        borderColor: "#252525",
        textColor: "#939393",
        text: "some-text",
        tc: {}
    }, "state");

    assert.equal(this.tooltip.move.callCount, 1);
    assert.deepEqual(this.tooltip.move.firstCall.args, [10, 20, 30]);
});

QUnit.test("'tooltipHidden' is triggered on show if tooltip is already shown", function(assert) {
    var eventData1 = { tag: "data-1" },
        eventData2 = { tag: "data-2" };
    this.tooltip.update(this.options);
    this.tooltip.show({ valueText: "text-1" }, {}, eventData1);

    this.tooltip.show({ valueText: "text-2" }, {}, eventData2);

    assert.strictEqual(this.eventTrigger.callCount, 3, "event count");
    assert.deepEqual(this.eventTrigger.getCall(0).args, ["tooltipShown", eventData1], "call 1");
    assert.deepEqual(this.eventTrigger.getCall(1).args, ["tooltipHidden", eventData1], "call 2");
    assert.deepEqual(this.eventTrigger.getCall(2).args, ["tooltipShown", eventData2], "call 3");
});

QUnit.test("'tooltipHidden' is not triggered on hide if tooltip has not been shown", function(assert) {
    this.tooltip.update(this.options);

    this.tooltip.hide();

    assert.strictEqual(this.eventTrigger.lastCall, null);
});

QUnit.test("'tooltipHidden' is not triggered on hide if tooltip is already hidden", function(assert) {
    this.tooltip.update(this.options);
    this.tooltip.show({ valueText: "text" }, {}, {});
    this.tooltip.hide();
    this.eventTrigger.reset();

    this.tooltip.hide();

    assert.strictEqual(this.eventTrigger.lastCall, null);
});

QUnit.test("Show. Calculate content size", function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 100, y: 200, offset: 300 });

    assert.deepEqual(this.tooltip._state.tc, {});

    assert.deepEqual(this.tooltip._state.contentSize, {
        x: -10 - 18,
        y: -5 - 15,
        width: 20 + 18 + 18,
        height: 7 + 15 + 15,

        lm: 15 - 5,
        rm: 15 + 5,
        tm: 15 - 6,
        bm: 15 + 6,

        fullWidth: 20 + 18 + 18 + 15 - 5 + 15 + 5,
        fullHeight: 7 + 15 + 15 + 15 - 6 + 15 + 6 + 10
    });

    assert.equal(this.tooltip.move.callCount, 1);
    assert.deepEqual(this.tooltip.move.firstCall.args, [100, 200, 300]);
});

QUnit.test("Show. Calculate content size. Html", function(assert) {
    var canvas = { left: 0, top: 0, width: 800, height: 600, fullWidth: 3000, fullHeight: 2000 };
    this.tooltip._getCanvas = function() { return canvas; };
    this.options.customizeTooltip = function() { return { html: "some-html" }; };
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._textGroupHtml.css = sinon.spy();
    this.tooltip._textGroupHtml.width = sinon.spy();
    this.tooltip._textGroupHtml.height = sinon.spy();
    this.tooltip._textHtml.html = sinon.spy();

    if(!this.getComputedStyle) {
        this.tooltip._textHtml.get(0).getBoundingClientRect = function() { return { right: 103.13, left: 20, bottom: 33.45, top: 10 }; };
    }

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 100, y: 200, offset: 300 });

    // assert
    assert.deepEqual(this.tooltip._state.tc, {});

    assert.deepEqual(this.tooltip._state.contentSize, {
        x: 0 - 18,
        y: 0 - 15,
        width: 84 + 18 + 18,
        height: 24 + 15 + 15,

        lm: 15 - 5,
        rm: 15 + 5,
        tm: 15 - 6,
        bm: 15 + 6,

        fullWidth: 84 + 18 + 18 + 15 - 5 + 15 + 5,
        fullHeight: 24 + 15 + 15 + 15 - 6 + 15 + 6 + 10
    }, "content size");

    assert.equal(this.tooltip.move.callCount, 1);
    assert.deepEqual(this.tooltip.move.firstCall.args, [100, 200, 300]);
});

QUnit.test("Show. Calculate content size. Margins to zero", function(assert) {
    this.options.customizeTooltip = null;
    this.options.shadow.blur = 3;
    this.options.shadow.offsetX = 9;
    this.options.shadow.offsetY = -9;
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });

    // act
    this.tooltip.show({ valueText: "some-text" }, {});

    assert.equal(this.tooltip._state.contentSize.lm, 0);
    assert.equal(this.tooltip._state.contentSize.rm, 7 + 9);
    assert.equal(this.tooltip._state.contentSize.tm, 7 + 9);
    assert.equal(this.tooltip._state.contentSize.bm, 0);
});

QUnit.test("Hide.", function(assert) {
    var eventObject = { "some-event-object": "some-event-value" };
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options).show({ valueText: "some-text" }, {}, eventObject);
    this.tooltip.move(100, 200, 30);
    this.eventTrigger.reset();

    this.resetTooltipMocks();
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._wrapper.detach = sinon.spy();

    // act
    this.tooltip.hide();

    // assert
    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, "wrapper is not added to dom");
    assert.equal(this.tooltip._wrapper.get(0).style.left, "-9999px", "wrapper is moved to invisible area");
    assert.equal(this.tooltip._wrapper.detach.callCount, 1, "wrapper detached");
    assert.equal(this.eventTrigger.callCount, 1);
    assert.deepEqual(this.eventTrigger.firstCall.args, ["tooltipHidden", eventObject]);
});

// T244003
QUnit.test("Show then show on invisible target then move", function(assert) {
    this.tooltip.update(this.options).show({ valueText: "text" }, {}, {});

    this.tooltip.show({}, {});
    this.tooltip.move(100, 200, 10);

    assert.ok(true, "no errors");
});

QUnit.module("Movements", {
    beforeEach: function() {
        var that = this,
            tooltip,
            getComputedStyle = window.getComputedStyle;

        that._initialBodyMargin = $(document.body).css("margin");
        $(document.body).css({ margin: 0 });

        that.options = getInitialOptions();
        that.eventTrigger = sinon.spy();
        that.tooltip = tooltip = new Tooltip({ eventTrigger: that.eventTrigger, cssClass: "test-title-class" });
        tooltip.update(that.options);

        that.resetTooltipMocks = function() {
            tooltip._cloud.stub("attr").reset();
            tooltip._cloud.stub("move").reset();
            tooltip._shadow.stub("attr").reset();
            tooltip._textGroup.stub("attr").reset();
            tooltip._textGroup.stub("css").reset();
            tooltip._textGroup.stub("move").reset();
            tooltip._text.stub("css").reset();
            tooltip._renderer.stub("resize").reset();
        };

        if(tooltip._textGroup && tooltip._textGroup.stub("getBBox")) {
            tooltip._textGroup.getBBox = sinon.spy(function() { return { x: -12, y: -5, width: 24, height: 10 }; });
        }

        that.canvas = { left: 0, top: 0, width: 800, height: 600, fullWidth: 3000, fullHeight: 2000 };
        tooltip._getCanvas = function() { return that.canvas; };

        if(getComputedStyle) {
            this.getComputedStyle = sinon.stub(window, "getComputedStyle", function(elem) {
                if(elem === tooltip._textHtml.get(0)) {
                    return { width: "60px", height: "40px" };
                }
                return getComputedStyle.apply(window, arguments);
            });
        }
    },
    afterEach: function() {
        this.getComputedStyle && this.getComputedStyle.restore();
        $("body").css({
            margin: this._initialBodyMargin
        });
        $("body").get(0).scrollTop = 0;
        this.tooltip.dispose();
    }
});

QUnit.test("LT corner of page", function(assert) {
    var bBox = {
            x: -30,
            y: -20,
            width: 60,
            height: 40,

            lm: 10,
            rm: 20,
            tm: 9,
            bm: 21
        },
        wrapper;

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 30, y: 80, offset: 30 });

    // assert
    wrapper = $('.test-title-class');
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm + this.options.arrowLength]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 10, // lt
            0, 10, // la
            0, 0, // ca
            10, 10, // ra
            60, 10, // rt
            60, 50, // rb
            0, 50] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css("left"), "20px"); // x - lm
    assert.equal(wrapper.css("top"), "101px"); // y + offset - tm
});

QUnit.test("CT side of page", function(assert) {
    var bBox = {
            x: -30,
            y: -20,
            width: 60,
            height: 40,

            lm: 10,
            rm: 20,
            tm: 9,
            bm: 21
        },
        wrapper;

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 400, y: 80, offset: 30 });

    // assert
    wrapper = $('.test-title-class');
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm + this.options.arrowLength]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 10, // lt
            20, 10, // la
            30, 0, // ca
            40, 10, // ra
            60, 10, // rt
            60, 50, // rb
            0, 50] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css("left"), "360px"); // x - bBox.width / 2 - lm
    assert.equal(wrapper.css("top"), "101px"); // y + offset - tm
});

QUnit.test("CT side of page, Html", function(assert) {
    this.options.customizeTooltip = function() { return { html: "some-html" }; };
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip._textGroupHtml.css = sinon.spy();
    if(!this.getComputedStyle) {
        this.tooltip._textHtml.get(0).getBoundingClientRect = sinon.spy(function() { return { right: 60, left: 0, bottom: 40, top: 0 }; });
    }

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 400, y: 80, offset: 30 });

    // assert
    assert.equal(this.tooltip._textGroupHtml.css.callCount, 2, "textGroup move");
    assert.deepEqual(this.tooltip._textGroupHtml.css.lastCall.args, [{ left: 18 + 10, top: 15 + 9 + this.options.arrowLength }]);

    assert.equal(this.tooltip._textGroup.stub("move").callCount, 0);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 2 * 18 + 10 + 20, 40 + 2 * 15 + 9 + 21 + this.options.arrowLength]);
});

QUnit.test("RT corner of page", function(assert) {
    var bBox = {
            x: -30,
            y: -20,
            width: 60,
            height: 40,

            lm: 10,
            rm: 20,
            tm: 9,
            bm: 21
        },
        wrapper;

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 770, y: 80, offset: 30 });

    // assert
    wrapper = $('.test-title-class');
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm + this.options.arrowLength]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 10, // lt
            50, 10, // la
            60, 0, // ca
            60, 10, // ra
            60, 10, // rt
            60, 50, // rb
            0, 50] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css("left"), "700px"); // x - bBox.width - lm
    assert.equal(wrapper.css("top"), "101px"); // y + offset - tm
});

QUnit.test("LC side of page", function(assert) {
    var bBox = {
            x: -30,
            y: -20,
            width: 60,
            height: 40,

            lm: 10,
            rm: 20,
            tm: 9,
            bm: 21
        },
        wrapper;

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 30, y: 300, offset: 30 });

    // assert
    wrapper = $('.test-title-class');
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 0, // lt
            60, 0, // rt
            60, 40, // rb
            10, 40, // ra
            0, 50, // ca
            0, 40, // la
            0, 40] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css("left"), "20px"); // x - lm
    assert.equal(wrapper.css("top"), "211px"); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test("CC of page", function(assert) {
    var bBox = {
            x: -30,
            y: -20,
            width: 60,
            height: 40,

            lm: 10,
            tm: 9
        },
        wrapper;

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 400, y: 300, offset: 30 });

    // assert
    wrapper = $('.test-title-class');
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 0, // lt
            60, 0, // rt
            60, 40, // rb
            40, 40, // ra
            30, 50, // ca
            20, 40, // la
            0, 40] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css("left"), "360px"); // x - bBox.width / 2 - lm
    assert.equal(wrapper.css("top"), "211px"); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test("CC side of page, Html", function(assert) {
    this.options.customizeTooltip = function() { return { html: "some-html" }; };
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip._textGroupHtml.css = sinon.spy();
    if(!this.getComputedStyle) {
        this.tooltip._textHtml.get(0).getBoundingClientRect = sinon.spy(function() { return { right: 60, left: 0, bottom: 40, top: 0 }; });
    }

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 400, y: 300, offset: 30 });

    // assert
    assert.equal(this.tooltip._textGroupHtml.css.callCount, 2, "textGroup move");
    assert.deepEqual(this.tooltip._textGroupHtml.css.lastCall.args, [{ left: 18 + 10, top: 15 + 9 }]);

    assert.equal(this.tooltip._textGroup.stub("move").callCount, 0);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 2 * 18 + 10 + 20, 40 + 2 * 15 + 9 + 21 + this.options.arrowLength]);
});

QUnit.test("RC side of page", function(assert) {
    var bBox = {
            x: -30,
            y: -20,
            width: 60,
            height: 40,

            lm: 10,
            rm: 20,
            tm: 9,
            bm: 21
        },
        wrapper;

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 770, y: 300, offset: 30 });

    // assert
    wrapper = $('.test-title-class');
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 0, // lt
            60, 0, // rt
            60, 40, // rb
            60, 40, // ra
            60, 50, // ca
            50, 40, // la
            0, 40] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css("left"), "700px"); // x - bBox.width - lm
    assert.equal(wrapper.css("top"), "211px"); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test("LB corner of page", function(assert) {
    var bBox = {
            x: -30,
            y: -20,
            width: 60,
            height: 40,

            lm: 10,
            rm: 20,
            tm: 9,
            bm: 21
        },
        wrapper;

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 30, y: 600, offset: 30 });

    // assert
    wrapper = $('.test-title-class');
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 0, // lt
            60, 0, // rt
            60, 40, // rb
            10, 40, // ra
            0, 50, // ca
            0, 40, // la
            0, 40] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css("left"), "20px"); // x - lm
    assert.equal(wrapper.css("top"), "511px"); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test("CB side of page", function(assert) {
    var bBox = {
            x: -30,
            y: -20,
            width: 60,
            height: 40,

            lm: 10,
            tm: 9
        },
        wrapper;

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 400, y: 600, offset: 30 });

    // assert
    wrapper = $('.test-title-class');
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 0, // lt
            60, 0, // rt
            60, 40, // rb
            40, 40, // ra
            30, 50, // ca
            20, 40, // la
            0, 40] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css("left"), "360px"); // x - bBox.width / 2 - lm
    assert.equal(wrapper.css("top"), "511px"); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test("RB corner of page", function(assert) {
    var bBox = {
            x: -30,
            y: -20,
            width: 60,
            height: 40,

            lm: 10,
            rm: 20,
            tm: 9,
            bm: 21
        },
        wrapper;

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 770, y: 600, offset: 30 });

    // assert
    wrapper = $('.test-title-class');
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 0, // lt
            60, 0, // rt
            60, 40, // rb
            60, 40, // ra
            60, 50, // ca
            50, 40, // la
            0, 40] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css("left"), "700px"); // x - bBox.width - lm
    assert.equal(wrapper.css("top"), "511px"); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test("Orientation is not changed", function(assert) {
    var wrapper;

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.tooltip.show({ valueText: "some-text" }, { x: 400, y: 300, offset: 30 });
    this.resetTooltipMocks();
    this.tooltip._textGroupHtml.css = sinon.spy();

    // act
    this.tooltip.move(500, 400, 10);

    // assert
    wrapper = $('.test-title-class');
    assert.equal(this.tooltip._textGroupHtml.css.callCount, 0, "textGroupHtml move");
    assert.equal(this.tooltip._textGroup.move.callCount, 0, "textGroup move");
    assert.equal(this.tooltip._cloud.attr.callCount, 0, "cloud attr");
    assert.equal(this.tooltip._renderer.resize.callCount, 0, "renderer resize");

    assert.equal(wrapper.css("left"), "460px"); // x - bBox.width / 2 - lm
    assert.equal(wrapper.css("top"), "331px"); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test("Orientation is changed", function(assert) {
    var bBox = {
            x: -30,
            y: -20,
            width: 60,
            height: 40,

            lm: 10,
            tm: 9
        },
        wrapper;

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.tooltip.show({ valueText: "some-text" }, { x: 400, y: 300 });
    this.resetTooltipMocks();
    this.tooltip._textGroupHtml.css = sinon.spy();

    // act
    this.tooltip.move(800, 300, 30);

    // assert
    wrapper = $('.test-title-class');
    assert.equal(this.tooltip._textGroupHtml.css.callCount, 0, "textGroupHtml move");

    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm]);

    assert.equal(this.tooltip._cloud.attr.callCount, 1, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 0, // lt
            60, 0, // rt
            60, 40, // rb
            60, 40, // ra
            60, 50, // ca
            50, 40, // la
            0, 40] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css("left"), "730px"); // x - bBox.width - lm
    assert.equal(wrapper.css("top"), "211px"); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test("Orientation is changed. Html", function(assert) {
    this.options.customizeTooltip = function() { return { html: "some-html" }; };
    this.tooltip.update(this.options);

    if(!this.getComputedStyle) {
        this.tooltip._textHtml.get(0).getBoundingClientRect = sinon.spy(function() { return { right: 60, left: 0, bottom: 40, top: 0 }; });
    }

    this.tooltip.show({ valueText: "some-text" }, { x: 400, y: 300 });
    this.resetTooltipMocks();
    this.tooltip._textGroupHtml.css = sinon.spy();

    // act
    this.tooltip.move(800, 300, 30);

    // assert
    assert.equal(this.tooltip._textGroup.move.callCount, 0, "textGroup move");

    assert.equal(this.tooltip._textGroupHtml.css.callCount, 1, "textGroupHtml move");
    assert.deepEqual(this.tooltip._textGroupHtml.css.firstCall.args, [{ left: 18 + 10, top: 15 + 9 }]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 2 * 18 + 10 + 20, 40 + 2 * 15 + 9 + 21 + this.options.arrowLength]);
});

QUnit.test("Show after move w/o orientation changing", function(assert) {
    var bBox = {
            x: -40,
            y: -30,
            width: 80,
            height: 50,

            lm: 10,
            tm: 9
        },
        wrapper;

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.tooltip.show({ valueText: "some-text" }, { x: 400, y: 300 });
    this.tooltip._textGroup.getBBox = sinon.spy(function() { return { x: -22, y: -15, width: 44, height: 20 }; });
    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: "some-long-text" }, { x: 500, y: 400, offset: 30 });

    // assert
    wrapper = $('.test-title-class');
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 0, // lt
            80, 0, // rt
            80, 50, // rb
            50, 50, // ra
            40, 60, // ca
            30, 50, // la
            0, 50] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [80 + 10 + 20, 50 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css("left"), "450px"); // x - bBox.width / 2 - lm
    assert.equal(wrapper.css("top"), "301px"); // y - (bBox.height + arrowLength) - offset - tm
});

// T277991, T447623
QUnit.test("Position when page's body has relative position and margins and page is scrolled. T277991, T447623", function(assert) {
    var wrapper;

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.tooltip.show({ valueText: "some-text" }, {});
    this.tooltip._textGroup.getBBox = sinon.spy(function() { return { x: -22, y: -15, width: 44, height: 20 }; });
    this.resetTooltipMocks();

    $("body").css({
        position: "relative",
        marginLeft: 110,
        marginTop: 120,
        marginRight: 130,
        marginBottom: 140
    });
    $("body").height(4000).get(0).scrollTop = 200;

    // act
    this.tooltip.move(500, 400, 30);

    // assert
    wrapper = $('.test-title-class');
    assert.strictEqual(wrapper.css("left"), "350px");
    assert.strictEqual(wrapper.css("top"), "191px");
});

// T486487
QUnit.test("size of wrapper", function(assert) {
    this.tooltip.update(this.options);
    this.tooltip._textGroup.getBBox = sinon.spy(function() { return { x: -22, y: -15, width: 44, height: 20 }; });

    this.tooltip.show({ valueText: "some-text" }, {});

    assert.equal($('.test-title-class').width(), 110);
});

QUnit.module("Movements. Out of visible borders", {
    beforeEach: function() {
        var that = this,
            tooltip;

        that._initialBodyMargin = $(document.body).css("margin");
        $(document.body).css({ margin: 0 });

        that.options = getInitialOptions();
        that.eventTrigger = sinon.spy();
        that.tooltip = tooltip = new Tooltip({ eventTrigger: that.eventTrigger });
        tooltip.update(that.options);

        that.resetTooltipMocks = function() {
            tooltip._cloud.stub("attr").reset();
            tooltip._cloud.stub("move").reset();
            tooltip._shadow.stub("attr").reset();
            tooltip._textGroup.stub("attr").reset();
            tooltip._textGroup.stub("css").reset();
            tooltip._textGroup.stub("move").reset();
            tooltip._text.stub("css").reset();
            tooltip._renderer.stub("resize").reset();
        };

        that.canvas = { left: 10, top: 20, width: 800, height: 600, fullWidth: 3000, fullHeight: 2000 };
        tooltip._getCanvas = function() { return that.canvas; };
    },
    afterEach: function() {
        $(document.body).css({ margin: this._initialBodyMargin });
        this.tooltip.dispose();
    }
});

QUnit.test("Out of bounds vertically. L side of page", function(assert) {
    var bBox = {
        x: -30,
        y: -500,
        width: 60,
        height: 1000,

        lm: 10,
        rm: 20,
        tm: 9,
        bm: 21
    };
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    if(this.tooltip._textGroup && this.tooltip._textGroup.stub("getBBox")) {
        this.tooltip._textGroup.getBBox = sinon.spy(function() { return { x: -12, y: -485, width: 24, height: 970 }; });
    }

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 40, y: 300, offset: 30 });

    // assert
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 0, // lt
            60, 0, // rt
            60, 1000, // rb
            0, 1000] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 2000]);

    assert.equal(this.tooltip._wrapper.css("left"), "30px"); // x - lm
    assert.equal(this.tooltip._wrapper.css("top"), "11px"); // canvas.top - tm
    assert.equal(this.tooltip._wrapper.css("width"), "90px");
});

QUnit.test("Out of bounds vertically. C of page", function(assert) {
    var bBox = {
        x: -30,
        y: -500,
        width: 60,
        height: 1000,

        lm: 10,
        rm: 20,
        tm: 9,
        bm: 21
    };
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    if(this.tooltip._textGroup && this.tooltip._textGroup.stub("getBBox")) {
        this.tooltip._textGroup.getBBox = sinon.spy(function() { return { x: -12, y: -485, width: 24, height: 970 }; });
    }

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 400, y: 300, offset: 30 });

    // assert
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 0, // lt
            60, 0, // rt
            60, 1000, // rb
            0, 1000] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 2000]);

    assert.equal(this.tooltip._wrapper.css("left"), "360px"); // x - bBox.width / 2 - lm
    assert.equal(this.tooltip._wrapper.css("top"), "11px"); // canvas.top - tm
    assert.equal(this.tooltip._wrapper.css("width"), "90px");
});

QUnit.test("Out of bounds vertically. R side of page", function(assert) {
    var bBox = {
        x: -30,
        y: -500,
        width: 60,
        height: 1000,

        lm: 10,
        rm: 20,
        tm: 9,
        bm: 21
    };
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    if(this.tooltip._textGroup && this.tooltip._textGroup.stub("getBBox")) {
        this.tooltip._textGroup.getBBox = sinon.spy(function() { return { x: -12, y: -485, width: 24, height: 970 }; });
    }

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 770, y: 300, offset: 30 });

    // assert
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 0, // lt
            60, 0, // rt
            60, 1000, // rb
            0, 1000] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 2000]);

    assert.equal(this.tooltip._wrapper.css("left"), "700px"); // x - bBox.width - lm
    assert.equal(this.tooltip._wrapper.css("top"), "11px"); // canvas.top - tm
    assert.equal(this.tooltip._wrapper.css("width"), "90px");
});

QUnit.test("Out of bounds horizontally. T side of page", function(assert) {
    var bBox = {
        x: -500,
        y: -20,
        width: 1000,
        height: 40,

        lm: 10,
        rm: 20,
        tm: 9,
        bm: 21
    };
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    if(this.tooltip._textGroup && this.tooltip._textGroup.stub("getBBox")) {
        this.tooltip._textGroup.getBBox = sinon.spy(function() { return { x: -482, y: -5, width: 964, height: 10 }; });
    }

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 400, y: 80, offset: 30 });

    // assert
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 0, // lt
            1000, 0, // rt
            1000, 40, // rb
            0, 40] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [3010, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(this.tooltip._wrapper.css("left"), "0px"); // canvas.left - lm
    assert.equal(this.tooltip._wrapper.css("top"), "101px"); // y + offset - tm
    assert.equal(this.tooltip._wrapper.css("width"), "3010px");
});

QUnit.test("Out of bounds horizontally. C of page", function(assert) {
    var bBox = {
        x: -500,
        y: -20,
        width: 1000,
        height: 40,

        lm: 10,
        rm: 20,
        tm: 9,
        bm: 21
    };
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    if(this.tooltip._textGroup && this.tooltip._textGroup.stub("getBBox")) {
        this.tooltip._textGroup.getBBox = sinon.spy(function() { return { x: -482, y: -5, width: 964, height: 10 }; });
    }

    // act
    this.tooltip.show({ valueText: "some-text" }, { x: 400, y: 300, offset: 30 });

    // assert
    assert.equal(this.tooltip._textGroup.move.callCount, 1, "textGroup move");
    assert.deepEqual(this.tooltip._textGroup.move.firstCall.args, [-bBox.x + bBox.lm, -bBox.y + bBox.tm]);

    assert.equal(this.tooltip._cloud.attr.callCount, 2, "cloud attr");
    assert.deepEqual(this.tooltip._cloud.attr.lastCall.args, [{
        points: [0, 0, // lt
            1000, 0, // rt
            1000, 40, // rb
            0, 40] // lb
    }]);

    assert.equal(this.tooltip._cloud.move.callCount, 1, "cloud move");
    assert.deepEqual(this.tooltip._cloud.move.lastCall.args, [bBox.lm, bBox.tm]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, "renderer resize");
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [3010, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(this.tooltip._wrapper.css("left"), "0px"); // canvas.left - lm
    assert.equal(this.tooltip._wrapper.css("top"), "211px"); // y - (bBox.height + arrowLength) - offset - tm
    assert.equal(this.tooltip._wrapper.css("width"), "3010px");
});
