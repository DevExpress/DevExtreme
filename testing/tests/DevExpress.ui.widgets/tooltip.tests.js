var $ = require("jquery"),
    viewPort = require("core/utils/view_port").value,
    fx = require("animation/fx"),
    Tooltip = require("ui/tooltip");

require("common.css!");

var TOOLTIP_CLASS = "dx-tooltip",
    TOOLTIP_WRAPPER_CLASS = "dx-tooltip-wrapper";

var wrapper = function() {
    return $("body").find("." + TOOLTIP_WRAPPER_CLASS);
};

viewPort($("#qunit-fixture").addClass("dx-viewport"));


QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture">\
        <div class="dx-viewport">\
            <div id="target"></div>\
            <div id="tooltip"></div>\
        </div>\
    //</div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("render");

QUnit.test("render as tooltip", function(assert) {
    var $tooltip = $("#tooltip");
    new Tooltip($tooltip, { visible: true });

    assert.ok($tooltip.hasClass(TOOLTIP_CLASS));
    assert.ok(wrapper().length);
});


QUnit.module("overlay integration", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
});

QUnit.test("tooltip should be closed on outside click if closeOnOutsideClick is true", function(assert) {
    var $tooltip = $("#tooltip").dxTooltip({
            closeOnOutsideClick: true
        }),
        instance = $tooltip.dxTooltip("instance");

    instance.show();
    $("#qunit-fixture").trigger("dxpointerdown");

    assert.equal(instance.option("visible"), false, "toast was hidden should be hiding");
});

QUnit.test("tooltip should not prevent closeOnOutsideClick handler of other overlays", function(assert) {
    var tooltip = new Tooltip($("#tooltip"));
    var $overlay = $("<div>").appendTo(".dx-viewport");

    var overlay = $overlay.dxOverlay({
        closeOnOutsideClick: true
    }).dxOverlay("instance");

    overlay.show();
    tooltip.show();

    $("#qunit-fixture").trigger("dxpointerdown");

    assert.equal(overlay.option("visible"), false, "dxOverlay should be hiding");
});

QUnit.module("base z-index");

QUnit.test("tooltip should have correct z-index", function(assert) {
    Tooltip.baseZIndex(10000);

    var tooltip = new Tooltip($("#tooltip"), { visible: true }),
        $tooltipContent = tooltip.overlayContent();

    assert.equal($tooltipContent.css("zIndex"), 10001, "tooltip's z-index is correct");
});


QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $tooltip = $("#tooltip");
    new Tooltip($tooltip);
    var $overlayContent = $tooltip.find(".dx-overlay-content");

    assert.equal($overlayContent.attr("role"), "tooltip");
});

QUnit.test("aria-describedby property should be set on target when tooltip is visible", function(assert) {
    var $target = $("#target"),
        $element = $("#tooltip");
    new Tooltip($element, { target: '#target', visible: false });
    var $overlay = $element.find(".dx-overlay-content");

    assert.notEqual($target.attr("aria-describedby"), undefined, "aria-describedby exists on target");
    assert.equal($target.attr("aria-describedby"), $overlay.attr("id"), "aria-describedby and overlay's id are equal");

});
