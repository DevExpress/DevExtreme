"use strict";

var $ = require("jquery"),
    Widget = require("ui/widget/ui.widget"),
    registerComponent = require("core/component_registrator");

require("common.css!");

(function() {

    var WIDGET_CLASS = "dx-widget",
        DISABLED_STATE_CLASS = "dx-state-disabled";

    var DxWidget = Widget.inherit({});
    registerComponent("dxWidget", DxWidget);


    QUnit.testStart(function() {
        var markup = '\
            <div id="widget"></div>\
            <div id="widthRootStyle" style="width: 300px;"></div>\
            <div id="widthRootStylePercent" style="width: 50%;"></div>\
            </div>';

        $("#qunit-fixture").html(markup);
    });

    QUnit.module("Widget markup");

    QUnit.test("markup init", function(assert) {
        var element = $("#widget").dxWidget();

        assert.ok(element.hasClass(WIDGET_CLASS));
    });

    QUnit.test("widget should have correct width by default", function(assert) {
        var $element = $("#widget").dxWidget();

        assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
    });

    QUnit.test("root with custom width", function(assert) {
        var $element = $("#widthRootStyle").dxWidget(),
            instance = $element.dxWidget("instance");

        assert.strictEqual(instance.option("width"), undefined);
        assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
    });

    QUnit.test("root with custom percent width", function(assert) {
        var $element = $("#widthRootStylePercent").dxWidget();

        assert.strictEqual($element[0].style.width, "50%");
    });

    QUnit.test("option 'visible' - default", function(assert) {
        var element = $("#widget").dxWidget(),
            instance = element.dxWidget("instance");

        assert.ok(instance.option("visible"));
        assert.ok(element.is(":visible"));

        instance.option("visible", false);

        assert.ok(!element.is(":visible"));
    });

    QUnit.test("option 'visible' - false on start", function(assert) {
        var element = $("#widget").dxWidget({ visible: false }),
            instance = element.dxWidget("instance");

        assert.ok(!element.is(":visible"));

        instance.option("visible", true);

        assert.ok(element.is(":visible"));
    });

    QUnit.test("'hint' option has 'undefined' value by default", function(assert) {
        var instance = $("#widget").dxWidget().dxWidget("instance");
        assert.equal(instance.option("hint"), undefined);
    });

    QUnit.test("'hint' option has 'title' value", function(assert) {
        var hintText = 'titleText',
            element = $("#widget").dxWidget({
                hint: hintText
            }),
            instance = element.dxWidget("instance");

        assert.equal(instance.option("hint"), hintText, 'Option hint is correct');
        assert.equal(element.attr('title'), hintText, " 'title' attribute of widget is correct");

        instance.option("hint", undefined);

        assert.equal(instance.option("hint"), undefined, " hint option value is correct");
        assert.equal(element.attr('title'), undefined, " 'title' attribute of widget is undefined");
    });

    QUnit.test("'disabled' option with 'true' value atthaches 'dx-state-disabled' class", function(assert) {
        var element = $("#widget").dxWidget({
            disabled: true
        });

        assert.ok(element.hasClass(DISABLED_STATE_CLASS));
    });

    QUnit.test("'disabled' option with undefined value not attaches 'dx-state-disabled' class", function(assert) {
        var element = $("#widget").dxWidget({
            disabled: undefined
        });

        assert.ok(!element.hasClass(DISABLED_STATE_CLASS));
    });
})();
