"use strict";

var $ = require("jquery"),
    pointerMock = require("../../helpers/pointerMock.js"),
    hideTopOverlayCallback = require("mobile/hide_top_overlay").hideCallback,
    fx = require("animation/fx"),
    setViewPort = require("core/utils/view_port").value,
    Toast = require("ui/toast");

require("common.css!");

var TOAST_CLASS = "dx-toast",
    TOAST_CLASS_PREFIX = TOAST_CLASS + "-",
    TOAST_WRAPPER_CLASS = TOAST_CLASS_PREFIX + "wrapper",
    TOAST_CONTENT_CLASS = TOAST_CLASS_PREFIX + "content",
    TOAST_MESSAGE_CLASS = TOAST_CLASS_PREFIX + "message",
    TOAST_ICON_CLASS = TOAST_CLASS_PREFIX + "icon";

var moduleConfig = {
    beforeEach: function() {
        this.$element = $("#toast");
        this.instance = new Toast(this.$element);
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
};

var viewPort = $("#qunit-fixture").addClass("dx-viewport");
setViewPort(viewPort);


QUnit.testStart(function() {
    var markup =
        '<div id="toast"></div>\
        <div id="firstToast"></div>\
        <div id="secondToast"></div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("general", moduleConfig);

QUnit.test("render", function(assert) {
    this.instance.show();

    var $content = this.instance.$content();

    assert.ok(this.$element.hasClass(TOAST_CLASS));
    assert.ok($content.parent().hasClass(TOAST_WRAPPER_CLASS));
    assert.ok($content.hasClass(TOAST_CONTENT_CLASS));

    assert.ok($content.width() < $(window).width());
    assert.ok($content.height() < $(window).height());
});

QUnit.test("default template", function(assert) {
    var $content = this.instance.$content();

    this.instance.option({
        message: "test42",
        type: "Error"
    });
    this.instance.show();

    assert.ok($content.children().eq(0).hasClass(TOAST_ICON_CLASS));
    assert.ok($content.children().eq(1).hasClass(TOAST_MESSAGE_CLASS));

    assert.ok($content.hasClass(TOAST_CLASS_PREFIX + "error"));
    assert.equal($content.text(), "test42");
});

QUnit.test("position", function(assert) {
    this.instance.option({
        message: "test42",
        position: { my: "bottom center", at: "bottom center", offset: "0 0" }
    });

    fx.off = true;
    this.instance.show();

    var $content = this.instance.$content();
    assert.roughEqual($content.offset().top + $content.outerHeight(), $(window).height(), 1.01);
});

QUnit.test("displayTime", function(assert) {
    var shown = 0,
        hidden = 0;

    this.instance.option({
        "displayTime": 100,
        "animation.show.duration": 20,
        "animation.hide.duration": 30,
        "onShown": function() {
            shown++;
        },
        "onHiding": function() {
            hidden++;
        }
    });


    this.instance.show();
    this.clock.tick(50);

    assert.equal(shown, 1);
    assert.equal(hidden, 0);

    this.clock.tick(50);

    assert.equal(shown, 1);
    assert.equal(hidden, 1);
});

QUnit.test("T179647 - only one toast is visible at the same time", function(assert) {
    var $first = $("#firstToast"),
        $second = $("#secondToast"),
        first = $first.dxToast().dxToast("instance"),
        second = $second.dxToast().dxToast("instance");

    first.show();

    assert.equal($(".dx-toast-content:visible").length, 1, "the first toast is visible");

    second.show();

    assert.equal($(".dx-toast-content:visible").length, 1, "only the second toast is visible");
});


QUnit.module("API", moduleConfig);

QUnit.test("show/hide", function(assert) {
    fx.off = true;

    var instance = this.instance;

    instance.option({
        // hidden: function() {
        //     assert.ok(instance.content().is(":hidden"));
        //     start();
        // },
        displayTime: 50,
        animation: {
            type: "fade",
            duration: 0,
            to: 1
        }
    });

    instance.show().done(function() {
        assert.ok(instance.$content().is(":visible"));
    });
});

QUnit.module("regression", moduleConfig);

QUnit.test("change message in runtime", function(assert) {
    this.instance.option({ message: "test42" });
    this.instance.show();
    this.instance.hide();
    this.instance.option({ message: "test43" });
    this.instance.show();

    assert.equal(this.instance.$content().text(), "test43");
});

QUnit.test("B238416", function(assert) {
    assert.expect(2);

    var instance = this.instance;

    instance.option({
        animation: {
            show: {
                from: { opacity: 0 },
                to: { opacity: 1 }
            },
            hide: {
                from: { opacity: 1 },
                to: { opacity: 0 }
            }
        }
    });

    instance.show().done(function() {
        var $content = instance.$content();

        assert.equal($content.css("opacity"), "1");

        instance.hide().done(function() {
            assert.equal($content.css("opacity"), "0");
        });
    });
});

QUnit.test("animation option should not contain window object if it was not set (T228805)", function(assert) {
    var instance = this.instance,
        animationConfig = {
            show: { type: "pop", from: { opacity: 1, scale: 0 }, to: { scale: 1 } },
            hide: { type: "pop", from: { scale: 1 }, to: { scale: 0 } }
        };

    instance.option("animation", animationConfig);

    instance.show();

    assert.equal(animationConfig.show.to.position.of, null);

    instance.option("animation.show.to.position.of", window);
    assert.equal(animationConfig.show.to.position.of, window);
});

QUnit.module("overlay integration", moduleConfig);

QUnit.test("toast should be closed on outside click if closeOnOutsideClick is true", function(assert) {
    this.instance.option("closeOnOutsideClick", true);
    this.instance.show();

    $("#qunit-fixture").trigger("dxpointerdown");

    assert.equal(this.instance.option("visible"), false, "toast was hidden should be hiding");
});

QUnit.test("toast does not prevent closeOnOutsideClick handler of other overlays", function(assert) {
    var $overlay = $("<div>").appendTo(viewPort);

    var overlay = $overlay.dxOverlay({
        closeOnOutsideClick: true
    }).dxOverlay("instance");


    overlay.show();
    this.instance.show();

    $("#qunit-fixture").trigger("dxpointerdown");

    assert.equal(overlay.option("visible"), false, "dxOverlay should be hiding");
});

QUnit.test("it should be possible to select a message in the toast by the mouse", function(assert) {
    assert.expect(1);
    var $toast = $("#toast").dxToast({
            shading: true,
            visible: true
        }),
        $shader = $toast.dxToast("$content").closest(".dx-overlay-shader");

    $($shader).on("dxdrag", function(e) {
        assert.equal(e.isDefaultPrevented(), false, "touchmove is not prevented");
    });

    var event = $.Event("dxdrag", {
        originalEvent: $.Event("dxpointermove", {
            originalEvent: $.Event("touchmove")
        })
    });

    $($shader).trigger(event);
});

QUnit.test("toast should stay opened after change content template", function(assert) {
    var toast = $("#toast").dxToast({
            visible: true
        }).dxToast("instance"),
        hideSpy = sinon.spy(toast, "hide");

    toast.option("contentTemplate", function() {
        return $("<div>");
    });

    this.clock.tick();
    assert.equal(hideSpy.callCount, 0, "Toast didn't hide");
});


QUnit.module("back button handling", moduleConfig);

QUnit.test("toast should not be hidden on back button press", function(assert) {
    var toast = this.instance;

    assert.equal(toast.option("closeOnBackButton"), false, "'closeOnBackButton is false by default'");

    toast.show();
    hideTopOverlayCallback.fire();
    assert.equal(toast.option("visible"), true, "is not hidden after back button event");
});


QUnit.module("base z-index");

QUnit.test("toast should have base z-index greater than overlay", function(assert) {
    Toast.baseZIndex(10000);

    var $toast = $("#toast").dxToast({ visible: true }),
        $content = $toast.dxToast("instance").$content();

    assert.equal($content.css("zIndex"), 18001, "toast's z-index is correct");
});


QUnit.module("close events handling");

QUnit.test("closeOnSwipe option", function(assert) {
    var $element = $("#toast").dxToast({ visible: true }),
        instance = $element.dxToast("instance"),
        pointer = pointerMock($element.find(".dx-toast-content"));

    pointer.start().swipe(-0.5);
    assert.ok(!instance.option("visible"), "toast should hide on swipe");

    instance.option("closeOnSwipe", false);
    instance.option("visible", true);
    pointer.swipe(-0.5);

    assert.ok(instance.option("visible"), "toast should not hide on swipe");
});

QUnit.test("closeOnClick option", function(assert) {
    var $element = $("#toast").dxToast({ visible: true }),
        instance = $element.dxToast("instance"),
        $content = $element.find(".dx-toast-content");

    $($content).trigger("dxclick");
    assert.ok(instance.option("visible"), "toast should not hide on click if option is false");

    instance.option("closeOnClick", true);
    $($content).trigger("dxclick");

    assert.ok(!instance.option("visible"), "toast should hide on click if option is true");
});


QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $element = $("#toast").dxToast({
            message: "test",
            animation: {}
        }),
        instance = $element.dxToast("instance");

    instance.show();

    var $message = instance.$content().find("." + TOAST_MESSAGE_CLASS);

    assert.equal($message.attr("role"), "alert", "role for toast message is correct");
});
