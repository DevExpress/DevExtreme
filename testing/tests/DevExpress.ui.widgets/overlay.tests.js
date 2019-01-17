var $ = require("jquery"),
    fx = require("animation/fx"),
    translator = require("animation/translator"),
    viewPort = require("core/utils/view_port").value,
    config = require("core/config"),
    typeUtils = require("core/utils/type"),
    hideTopOverlayCallback = require("mobile/hide_top_overlay").hideCallback,
    positionUtils = require("animation/position"),
    domUtils = require("core/utils/dom"),
    resizeCallbacks = require("core/utils/resize_callbacks"),
    devices = require("core/devices"),
    Template = require("ui/widget/template"),
    Overlay = require("ui/overlay"),
    pointerMock = require("../../helpers/pointerMock.js"),
    eventsEngine = require("events/core/events_engine"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    selectors = require("ui/widget/selectors");

require("common.css!");
require("ui/scroll_view/ui.scrollable");

QUnit.testStart(function() {
    var markup =
        '<style>\
            html, body {\
                height: 100%;\
                margin: 0;\
            }\
            \
            #qunit-fixture {\
                width: 100%;\
                height: 100%;\
            }\
        </style>\
        \
        <div id="overlayInTargetContainer"></div>\
        \
        <div id="customTargetContainer">\
            <div id="parentContainer">\
                <input id="overlayInputTarget" type="text" />\
                <div id="overlay"></div>\
                <div id="overlay2">\
                    <div id="test"></div>\
                </div>\
            </div>\
        </div>\
        \
        <div id="container"></div>\
        \
        <div id="overlayWithClass" class="something another"></div>\
        \
        <div id="overlayWithAnonymousTmpl">\
            <div id="content"></div>\
        </div>\
        \
        <div id="B237292">\
            <div id="B237292_container" style="width: 100px; height: 100px"></div>\
        \
            <div id="B237292_overlay">\
                Overlay content\
            </div>\
        </div>\
        \
        <div id="Q518355">\
            <div id="Q518355_overlay_1"></div>\
            <div id="Q518355_overlay_2"></div>\
        </div>\
        \
        <div id="overlayWithContentTemplate">\
            <div data-options="dxTemplate: { name: \'custom\' }">\
                TestContent\
            </div>\
        </div>\
        \
        <div id="overlayWithWrongTemplateName">\
            <div data-options="dxTemplate: { name: \'wrongName\' }">testContent</div>\
        </div>\
        \
        <div id="widget"></div>\
        \
        <script type="text/html" id="focusableTemplate">\
            <a>something</a>\
            <input class="firstTabbable" />\
            <div tabindex=\'0\'></div>\
            <textarea></textarea>\
            <div tabindex=\'-1\'></div>\
            <a href="#" class="lastTabbable">something</a>\
        </script>\
        <input class="outsideTabbable" />\
        \
        <div>\
            <div class="dx-swatch-my-color_scheme1 some-class some-class2">\
                <div>\
                    <div id="swatchOverlay1"></div>\
                </div>\
            </div>\
            <div class="some-class some-class2 dx-swatch-my-color_scheme2 some-class3">\
                <div>\
                    <div id="swatchOverlay2"></div>\
                    <div id="swatchOverlay3"></div>\
                </div>\
            </div>\
        <div>';

    $("#qunit-fixture").html(markup);
});

viewPort($("#qunit-fixture").addClass("dx-viewport"));

var OVERLAY_CLASS = "dx-overlay",
    OVERLAY_WRAPPER_CLASS = "dx-overlay-wrapper",
    OVERLAY_CONTENT_CLASS = "dx-overlay-content",
    OVERLAY_SHADER_CLASS = "dx-overlay-shader",
    OVERLAY_MODAL_CLASS = "dx-overlay-modal",

    HOVER_STATE_CLASS = "dx-state-hover",
    DISABLED_STATE_CLASS = "dx-state-disabled",

    viewport = function() { return $(".dx-viewport"); };

var toSelector = function(cssClass) {
    return "." + cssClass;
};

var moduleConfig = {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
};


QUnit.module("render", moduleConfig);

QUnit.test("overlay class should be added to overlay", function(assert) {
    var $element = $("#overlay").dxOverlay();
    assert.ok($element.hasClass(OVERLAY_CLASS));
});

QUnit.test("content should be present when widget instance exists", function(assert) {
    var $element = $("#overlay").dxOverlay(),
        instance = $element.dxOverlay("instance");

    assert.ok($(toSelector(OVERLAY_CONTENT_CLASS)).length);

    instance._dispose();
    assert.ok(!$(toSelector(OVERLAY_CONTENT_CLASS)).length);
});

QUnit.test("overlay should use default template when element with data-options has not dxTemplate params (B253554)", function(assert) {
    assert.expect(0);

    $("#overlay")
        .append("<div data-options=\"dxTest : { } \">123</div></div>")
        .appendTo("#qunit-fixture")
        .dxOverlay({
            visible: true
        });
});

QUnit.test("overlay should not crash on window resize (B253397)", function(assert) {
    assert.expect(0);

    $("<div />")
        .dxOverlay({
            visible: true,

            width: 500,
            height: 500,

            onContentReady: function() {
                resizeCallbacks.fire();
                $(".dx-overlay-content").width();
                resizeCallbacks.fire();
            }
        }).remove();
});

QUnit.test("overlay created with templatesRenderAsynchronously option should be shown with delay", function(assert) {
    var clock = sinon.useFakeTimers();
    try {
        var onShowingSpy = sinon.spy();

        $("#overlay").dxOverlay({
            templatesRenderAsynchronously: true,
            visible: true,
            onShowing: onShowingSpy
        });

        assert.equal(onShowingSpy.called, 0);
        clock.tick();
        assert.equal(onShowingSpy.called, 1);
    } finally {
        clock.restore();
    }
});

QUnit.test("overlay created with templatesRenderAsynchronously option should not be shown after delay if it was hidden before", function(assert) {
    var clock = sinon.useFakeTimers();
    try {
        var overlay = new Overlay($("#overlay"), {
            templatesRenderAsynchronously: true,
            visible: true
        });
        overlay.hide();
        clock.tick();
        assert.equal(overlay.$content().is(":visible"), false);
    } finally {
        clock.restore();
    }
});

QUnit.test("overlay should have hover class on content", function(assert) {
    var element = $("#overlay").dxOverlay({
            hoverStateEnabled: true,
            visible: true
        }),
        instance = element.dxOverlay("instance"),
        $content = $(instance.$content());

    $($content).trigger("dxhoverstart");
    assert.ok($content.hasClass(HOVER_STATE_CLASS));
});

QUnit.test("overlay should stop animation on window resize", function(assert) {
    var originalFxStop = fx.stop;

    try {
        $("#overlay").dxOverlay({
            visible: true
        });

        var stopExecuted = false;
        fx.stop = function() {
            stopExecuted = true;
        };
        resizeCallbacks.fire();
        assert.ok(stopExecuted, "animation stopped");

    } finally {
        fx.stop = originalFxStop;
    }
});

QUnit.test("default", function(assert) {
    var instance = $("#overlay").dxOverlay().dxOverlay("instance"),
        $content = $(instance.$content());

    assert.ok(!$content.is(":visible"));
    assert.ok(!viewport().children("." + OVERLAY_SHADER_CLASS).is(":visible"));
    assert.ok($content.width() < $(window).width());
    assert.ok($content.height() < $(window).height());
});

QUnit.test("RTL markup - rtlEnabled by default", function(assert) {
    var overlay = $("#overlay").dxOverlay({ rtlEnabled: true }).dxOverlay("instance");

    overlay.show();

    var $content = $(overlay.$content());

    assert.ok($content.hasClass("dx-rtl"));
});

QUnit.test("Color swatches - overlay should be rendered on viewport by default", function(assert) {
    var overlay = $("#overlay").dxOverlay().dxOverlay("instance");
    overlay.show();
    var $wrapper = overlay.$content().parent();
    assert.ok($wrapper.parent().hasClass("dx-viewport"));
});

QUnit.test("Color swatches - overlay should be rendered on the child of viewport with special class", function(assert) {
    var containers = [];

    for(var i = 1; i <= 3; i++) {
        var overlay = $("#swatchOverlay" + i).dxOverlay().dxOverlay("instance");
        overlay.show();
        containers[i] = overlay.$content().parent().parent();
    }

    assert.ok(containers[1].hasClass("dx-swatch-my-color_scheme1"), "overlay's container has right class");
    assert.ok(containers[1].parent().hasClass("dx-viewport"), "overlay's container is the viewport's child");

    assert.ok(containers[2].hasClass("dx-swatch-my-color_scheme2"), "overlay's container has right class");
    assert.ok(containers[2].parent().hasClass("dx-viewport"), "overlay's container is the viewport's child");

    assert.ok(containers[3].hasClass("dx-swatch-my-color_scheme2"), "overlay's container has right class");
    assert.ok(containers[3].parent().hasClass("dx-viewport"), "overlay's container is the viewport's child");

    assert.equal($(".dx-viewport > .dx-swatch-my-color_scheme2").length, 1, "one container for different overlays from the same swatch");
});

QUnit.test("Color swatches - overlay should be rendered on the child of viewport with special class if its element attached after creation", function(assert) {
    var detachedContainer = $("<div>");
    var overlay = detachedContainer.dxOverlay().dxOverlay("instance");
    detachedContainer.appendTo(".dx-swatch-my-color_scheme1 > div");
    overlay.show();

    var overlayContainer = overlay.$content().parent().parent();

    assert.ok(overlayContainer.hasClass("dx-swatch-my-color_scheme1"), "overlay's container has right class");
    assert.ok(overlayContainer.parent().hasClass("dx-viewport"), "overlay's container is the viewport's child");
});

QUnit.module("option", moduleConfig);

QUnit.test("RTL markup - rtlEnabled by option", function(assert) {
    var overlay = $("#overlay").dxOverlay({ deferRendering: false }).dxOverlay("instance"),
        $content = $(overlay.$content()),
        contentRenderSpy = sinon.spy(overlay, "_renderContentImpl");

    overlay.option("rtlEnabled", true);
    assert.ok($content.hasClass("dx-rtl"));

    overlay.option("rtlEnabled", false);
    assert.ok(!$content.hasClass("dx-rtl"));
    assert.equal(contentRenderSpy.callCount, 2, "must invalidate content when RTL changed");
});

QUnit.test("disabled", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            disabled: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $content = $(overlay.content());

    assert.ok($content.hasClass(DISABLED_STATE_CLASS), "disabled state present in content element");

    overlay.option("disabled", false);
    assert.ok(!$content.hasClass(DISABLED_STATE_CLASS), "disabled state not present in content element");

    overlay.option("disabled", undefined);
    assert.ok(!$content.hasClass(DISABLED_STATE_CLASS), "disabled state not present in content element");
});

QUnit.test("visibility callbacks", function(assert) {
    assert.expect(16);

    var beforeShowFired = 0,
        afterShowFired = 0,
        beforeHideFired = 0,
        afterHideFired = 0,
        positionedFired = 0;

    var instance = $("#overlay").dxOverlay({
        onShowing: function() {
            assert.equal(this.$content().css("display"), "block");
            assert.equal(afterShowFired, 0);

            beforeShowFired++;
        },
        onPositioned: function(options) {
            assert.equal(beforeShowFired, 1);
            assert.equal(this.$content().css("display"), "block");
            assert.ok(options.position);

            positionedFired++;
        },
        onShown: function() {
            assert.equal(positionedFired, 1);
            assert.equal(this.$content().css("display"), "block");

            afterShowFired++;
        },
        onHiding: function() {
            assert.equal(this.$content().css("display"), "block");
            assert.equal(afterHideFired, 0);

            beforeHideFired++;
        },
        onHidden: function() {
            assert.equal(beforeHideFired, 1);
            assert.equal(this.$content().css("display"), "none");

            afterHideFired++;
        }
    })
        .dxOverlay("instance");

    instance.show().done(function() {
        assert.equal(beforeShowFired, 1);
        assert.equal(positionedFired, 1);
        assert.equal(afterShowFired, 1);

        instance.hide().done(function() {
            assert.equal(beforeHideFired, 1);
            assert.equal(afterHideFired, 1);
        });
    });
});

QUnit.test("resize callbacks", function(assert) {
    var onResizeStartFired = 0,
        onResizeFired = 0,
        onResizeEndFired = 0,

        instance = $("#overlay").dxOverlay({
            resizeEnabled: true,
            visible: true,
            onResizeStart: function() { onResizeStartFired++; },
            onResize: function() { onResizeFired++; },
            onResizeEnd: function() { onResizeEndFired++; }
        }).dxOverlay("instance"),

        $content = $(instance.$content()),
        $handle = $content.find(".dx-resizable-handle-top"),
        pointer = pointerMock($handle);

    pointer.start().dragStart().drag(0, 50).dragEnd();

    assert.equal(onResizeStartFired, 1, "onResizeStart fired");
    assert.equal(onResizeFired, 1, "onResize fired");
    assert.equal(onResizeEndFired, 1, "onResizeEnd fired");
});


QUnit.module("visibility", moduleConfig);

QUnit.test("overlay should be shown when option visible set to true", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            visible: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $content = $(overlay.$content()),
        $wrapper = $content.parent();

    assert.ok($wrapper.is(":visible"));
    assert.ok($content.is(":visible"));
    assert.ok($overlay.is(":visible"));

    overlay.option("visible", false);
    assert.ok($wrapper.is(":hidden"));
    assert.ok($content.is(":hidden"));
    assert.ok($overlay.is(":hidden"));
});

QUnit.test("new shown overlay should be displayed with greater z-index (Q518355)", function(assert) {
    var $overlay1 = $("#Q518355_overlay_1").dxOverlay(),
        $overlay2 = $("#Q518355_overlay_2").dxOverlay(),
        overlay1 = $overlay1.dxOverlay("instance"),
        overlay2 = $overlay2.dxOverlay("instance");

    overlay1.show();
    var $content1 = $(overlay1.$content()),
        contentZIndex = parseInt($content1.css("zIndex"), 10),
        wrapperZIndex = parseInt($content1.parent().css("zIndex"), 10);

    overlay2.show();
    var $content2 = $(overlay2.$content());
    assert.equal(parseInt($content2.css("zIndex"), 10), contentZIndex + 1);
    assert.equal(parseInt($content2.parent().css("zIndex"), 10), wrapperZIndex + 1);
});

QUnit.test("Cancel visibility change in hiding", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            visible: true,
            onHiding: function(e) {
                e.cancel = true;
            }
        }),
        overlay = $overlay.dxOverlay("instance");

    overlay.option("visible", false);
    assert.ok(overlay.option("visible"), "overlay still visible after option changed");

    overlay.hide();
    assert.ok(overlay.option("visible"), "overlay still visible after call 'hide'");

    overlay.option("onHiding", null);

    overlay.hide();
    assert.ok(!overlay.option("visible"), "overlay has not visible after clear hiding and call 'hide'");
});

QUnit.test("overlay should fire dxshown and dxhiding events on show/hide", function(assert) {
    var $overlay = $("#overlay");
    $("<div id='target' class='dx-visibility-change-handler'>").appendTo($overlay);

    var overlay = $overlay.dxOverlay({
        visible: false,
        deferRendering: false
    }).dxOverlay("instance");

    var shownFired = 0,
        hidingFired = 0;

    $(overlay.$content().find("#target")).on({
        "dxshown": function() {
            shownFired++;
        },
        "dxhiding": function() {
            hidingFired++;
        }
    });

    overlay.option("visible", true);
    assert.equal(shownFired, 1, "dxshown fired once after showing");
    assert.equal(hidingFired, 0, "dxhiding was not fired after showing");

    overlay.option("visible", false);
    assert.equal(shownFired, 1, "dxshown was not fired on hiding");
    assert.equal(hidingFired, 1, "dxhiding fired once on hiding");
});

QUnit.test("overlay should fire dxshown if visible at initialization", function(assert) {
    assert.expect(1);

    $("#overlay").dxOverlay({
        visible: true,
        deferRendering: false,
        onContentReady: function(e) {
            $("<div id='target' class='dx-visibility-change-handler'>").on("dxshown", function() {
                assert.ok(true, "dxshown was fired");
            }).appendTo(e.component.content());
        }
    });
});

QUnit.test("overlay is not shown when parent is hidden", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
        visible: false,
        deferRendering: false
    });
    var overlay = $overlay.dxOverlay("instance");

    $overlay.parent().hide();

    overlay.option("visible", true);

    assert.ok(overlay.option("visible"), "option was set");
    assert.ok(overlay.$content().is(":hidden"), "overlay was not visible");
});

QUnit.test("overlay content is shown on 'dxshown' after hidden parent becomes visible", function(assert) {
    var $overlay = $("#overlay").append("<div class='content-inner'>");

    $overlay.parent().hide();

    var overlay = $overlay.dxOverlay({
        visible: true,
        deferRendering: true
    }).dxOverlay("instance");

    assert.ok(overlay.$content().is(":hidden"), "overlay hidden");

    $overlay.parent().show();
    $($overlay).trigger("dxshown");

    assert.ok(overlay.$content().find(".content-inner").is(":visible"), "overlay shown");
});

QUnit.test("overlay is hidden when dxhiding event is fired", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
        visible: true,
        deferRendering: false
    });
    var overlay = $overlay.dxOverlay("instance");

    $($overlay).trigger("dxhiding").hide();

    assert.ok(overlay.$content().is(":hidden"), "overlay was disappeared");
    assert.ok(overlay.option("visible"), "overlay option visible is true");
});

QUnit.test("overlay is shown when dxshown event is fired", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
        visible: true,
        deferRendering: false
    });
    var overlay = $overlay.dxOverlay("instance");

    $($overlay).trigger("dxhiding").hide();
    $($overlay.show()).trigger("dxshown");

    assert.ok(overlay.$content().is(":visible"), "overlay shown");
});

QUnit.test("overlay is not shown when dxshown event was fired and option 'visible' is false", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
        visible: false,
        deferRendering: false
    });
    var overlay = $overlay.dxOverlay("instance");

    $overlay
        .trigger("dxhiding")
        .trigger("dxshown");

    assert.ok(overlay.$content().is(":hidden"), "overlay does not shown");
});

QUnit.test("overlay should be shown when visibility is true and dxshown event was fired", function(assert) {
    var $overlay = $("#overlay");
    var $overlayWrapper = $overlay.wrap("<div>").parent().hide();
    var overlay = $overlay.dxOverlay({
        visible: true,
        deferRendering: false
    }).dxOverlay("instance");

    var $overlayContent = $(overlay.content());
    assert.ok($overlayContent.is(":hidden"), "overlayContent is hidden when parent is hidden");

    $overlayWrapper.show();
    $($overlay).trigger("dxshown");

    $overlayContent = $(overlay.content());

    assert.ok($overlayContent.is(":visible"), "overlayContent is visible after dxshown event fired");
});

QUnit.test("visibility actions not fired when visibility is not changed", function(assert) {
    var onShownCounter = 0;
    var onHiddenCounter = 0;
    var $overlay = $("#overlay").dxOverlay({
        onShown: function() {
            onShownCounter++;
        },
        onHidden: function() {
            onHiddenCounter++;
        },
        visible: false
    });

    domUtils.triggerHidingEvent($overlay);

    assert.equal(onHiddenCounter, 0, "onHidden action not fired");

    $overlay.dxOverlay("show");
    onShownCounter = 0;

    domUtils.triggerShownEvent($overlay);

    assert.equal(onShownCounter, 0, "onShown action not fired");
});

QUnit.test("onHiding should be fired once after close and visibility change event", function(assert) {
    fx.off = false;
    var onHidingCounter = 0;
    var $overlay = $("#overlay").dxOverlay({
        onHiding: function() {
            onHidingCounter++;
        },
        visible: true
    });
    $overlay.dxOverlay("hide");
    domUtils.triggerHidingEvent($overlay);

    assert.equal(onHidingCounter, 1, "onHiding action fired once");
});

QUnit.test("dxresize event should be fired only once when container shows first time (T306921)", function(assert) {
    assert.expect(2);

    var triggerFunction = domUtils.triggerResizeEvent;

    try {
        domUtils.triggerResizeEvent = function() {
            assert.ok(true, "event triggered");
        };

        var $overlay = $("#overlay").dxOverlay({ visible: true }),
            overlay = $overlay.dxOverlay("instance");

        overlay.hide();
        overlay.show();

    } finally {
        domUtils.triggerResizeEvent = triggerFunction;
    }
});


QUnit.module("position", moduleConfig);

QUnit.test("position change should not show the content if the overlay is hidden", function(assert) {
    var instance = $("#overlay").dxOverlay().dxOverlay("instance");

    instance.option("position", { my: "top left", at: "top left", of: document });
    assert.ok(instance.$content().is(":hidden"));
});

QUnit.test("position in string format should be parsed correctly", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
        visible: true,
        position: "top"
    });

    var overlay = $overlay.dxOverlay("instance"),
        $content = $(overlay.content());

    assert.equal($content.position().top, 0, "overlay positioned correctly");
});

QUnit.test("position should be correct on second showing (B238662, B232822)", function(assert) {
    var $overlay = $("#overlay").html("123").dxOverlay(),
        overlay = $overlay.dxOverlay("instance"),
        $content = $(overlay.content()),
        firstPosition,
        secondPosition;

    overlay.show();
    firstPosition = $content.position();
    overlay.hide();
    overlay.show();
    secondPosition = $content.position();
    assert.deepEqual(secondPosition, firstPosition);
});

QUnit.test("position should be set up on first show", function(assert) {
    var $overlay = $("#overlay");

    $overlay.dxOverlay({
        visible: true,
        position: { my: "left top", at: "center", of: viewport() }
    });

    var position = viewport().find(toSelector(OVERLAY_CONTENT_CLASS)).position();

    assert.notEqual(position.left, 0);
    assert.notEqual(position.top, 0);
});

QUnit.test("position of overlay is absolute when position.of is not window", function(assert) {
    $("#overlay").dxOverlay({
        visible: true,
        position: {
            my: "center",
            at: "center",
            of: viewport()
        }
    });

    var $overlayWrapper = viewport().find(toSelector(OVERLAY_WRAPPER_CLASS));
    assert.equal($overlayWrapper.css("position"), "absolute");
});

QUnit.test("position of overlay is correct when position.of is window", function(assert) {
    $("#overlay").dxOverlay({
        visible: true,
        position: {
            my: "center",
            at: "center",
            of: window
        }
    });

    var $overlayWrapper = viewport().find(toSelector(OVERLAY_WRAPPER_CLASS));
    assert.equal($overlayWrapper.css("position"), devices.real().ios ? "absolute" : "fixed");
});

QUnit.test("position of overlay is correct when position.of is window and shading is false", function(assert) {
    $("#overlay").dxOverlay({
        visible: true,
        shading: false,
        position: {
            my: "center",
            at: "center",
            of: window
        }
    });

    var $overlayWrapper = viewport().find(toSelector(OVERLAY_WRAPPER_CLASS));
    assert.equal($overlayWrapper.css("position"), devices.real().ios ? "absolute" : "fixed");
});

QUnit.test("overlay should be correctly animated with custom 'animation.show.to'", function(assert) {
    var $container = $("<div>").css({
        height: "500px",
        position: "relative"
    }).appendTo("#qunit-fixture");

    var $content = $("<div>").css({
        height: "100px",
        position: "absolute",
        top: "100px"
    }).appendTo($container);


    var widgetPosition = {
        my: "bottom",
        at: "bottom",
        of: $content
    };

    var $overlay = $("#overlay").dxOverlay({
        container: $container,
        position: widgetPosition,
        animation: {
            show: {
                to: {
                    opacity: 0
                }
            }
        }
    });

    var overlay = $overlay.dxOverlay("instance");
    $content = $(overlay.content());

    overlay.show();
    var expectedPosition = positionUtils.calculate($content, widgetPosition);
    assert.deepEqual(positionUtils.setup($content), { top: expectedPosition.v.location, left: expectedPosition.h.location }, "overlay positioned correctly");
});

QUnit.test("position as function", function(assert) {
    var instance = $("#overlay").dxOverlay({
        visible: true,
        position: function() { return { of: "body" }; }
    }).dxOverlay("instance");

    assert.equal(instance._position.of, "body");
});


QUnit.module("shading", moduleConfig);

QUnit.test("shading should be present", function(assert) {
    var overlay = $("#overlay").dxOverlay({
            shading: true,
            visible: true
        }).dxOverlay("instance"),
        $wrapper = $(overlay.$content().parent());

    assert.ok($wrapper.hasClass(OVERLAY_SHADER_CLASS));

    overlay.option("shading", false);
    assert.ok(!$wrapper.hasClass(OVERLAY_SHADER_CLASS));
});

QUnit.test("shading height should change after container resize (B237292)", function(assert) {
    var $container = $('#B237292_container'),
        overlay = $("#B237292_overlay").dxOverlay({
            visible: true,
            container: $container,
            position: {
                of: $container
            }
        }).dxOverlay("instance"),
        $wrapper = $(overlay.$content().parent());

    $container
        .width(200)
        .height(300)
        .offset({
            left: 100,
            top: 200
        });
    overlay.repaint();
    assert.strictEqual($wrapper.width(), 200);
    assert.strictEqual($wrapper.height(), 300);
    assert.strictEqual(translator.locate($wrapper).left, 0);
    assert.strictEqual(translator.locate($wrapper).top, 0);
});

QUnit.test("shading height should change after iOS address bar resize (T653828)", function(assert) {
    if(devices.real().platform !== "ios" || devices.real().deviceType === "desktop") {
        assert.ok(true);
        return;
    }

    var $wrapper,
        overlay = $("#overlay").dxOverlay({
            visible: true
        }).dxOverlay("instance");

    $wrapper = $(overlay.$content().parent());
    assert.equal($wrapper.css("minHeight").replace("px", ""), window.innerHeight, "overlay wrapper has right min-height style");
});

QUnit.test("shading color should be customized by option", function(assert) {
    var overlay = $("#overlay").dxOverlay({
            shading: true,
            shadingColor: "rgb(255, 0, 0)",
            visible: true
        }).dxOverlay("instance"),
        $wrapper = $(overlay.$content().parent());

    assert.ok(/rgb\(255,\s?0,\s?0\)/.test($wrapper.css("backgroundColor")));

    overlay.option("shading", false);
    assert.ok(!/rgb\(255,\s?0,\s?0\)/.test($wrapper.css("backgroundColor")));
});


QUnit.module("dimensions", moduleConfig);

QUnit.test("dimensions should be set correctly as number", function(assert) {
    var $content = $("#overlay").dxOverlay({
        visible: true,
        width: 20,
        height: 15
    }).dxOverlay("instance").$content();

    assert.equal($content.width(), 20);
    assert.equal($content.height(), 15);

    resizeCallbacks.fire();

    assert.equal($content.width(), 20);
    assert.equal($content.height(), 15);
});

QUnit.test("dimensions should be set correctly as function", function(assert) {
    var $content = $("#overlay").dxOverlay({
        visible: true,
        width: function() {
            return $(window).width();
        },
        height: function() {
            return $(window).height();
        }
    }).dxOverlay("instance").$content();

    assert.equal($content.width(), $(window).width());
    assert.equal($content.height(), $(window).height());

    resizeCallbacks.fire();

    assert.equal($content.width(), $(window).width());
    assert.equal($content.height(), $(window).height());
});

QUnit.test("dimensions should be shrunk correctly with max sizes specified", function(assert) {
    var $content = $("#overlay").dxOverlay({
        visible: true,
        width: "auto",
        height: "auto",
        maxWidth: 200,
        maxHeight: 200,
        contentTemplate: function() {
            return $("<div>").width(1000).height(1000);
        }
    }).dxOverlay("instance").$content();

    assert.equal($content.width(), 200);
    assert.equal($content.height(), 200);
});

QUnit.test("dimensions should be shrunk correctly with max sizes changes dynamically", function(assert) {
    var instance = $("#overlay").dxOverlay({
            visible: true,
            width: "auto",
            height: "auto",
            contentTemplate: function() {
                return $("<div>").width(1000).height(1000);
            }
        }).dxOverlay("instance"),
        $content = $(instance.content());

    instance.option("maxWidth", 200);
    assert.equal($content.width(), 200);

    instance.option("maxHeight", 200);
    assert.equal($content.height(), 200);
});

QUnit.test("dimensions should be expanded correctly with min sizes specified", function(assert) {
    var $content = $("#overlay").dxOverlay({
        visible: true,
        width: "auto",
        height: "auto",
        minWidth: 200,
        minHeight: 200
    }).dxOverlay("instance").$content();

    assert.equal($content.width(), 200);
    assert.equal($content.height(), 200);
});

QUnit.test("dimensions should be shrunk correctly with min sizes changes dynamically", function(assert) {
    var instance = $("#overlay").dxOverlay({
            visible: true,
            width: "auto",
            height: "auto"
        }).dxOverlay("instance"),
        $content = $(instance.content());

    instance.option("minWidth", 200);
    assert.equal($content.width(), 200);

    instance.option("minHeight", 200);
    assert.equal($content.height(), 200);
});


QUnit.module("animation", moduleConfig);

QUnit.test("correct animation should be present", function(assert) {
    var originAnimate = fx.animate;
    fx.animate = function($element, config) {
        if(instance.$content().get(0) === $element.get(0)) {
            lastConfig = config;
        }
    };

    try {
        var showConfig = {
                type: "pop",
                duration: 200
            },
            hideConfig = {
                type: "slide",
                duration: 100
            },
            lastConfig;
        var instance = $("#overlay").dxOverlay({
            animation: {
                show: showConfig,
                hide: hideConfig
            }
        }).dxOverlay("instance");

        instance.show();
        assert.equal(lastConfig.duration, showConfig.duration, "animate on show: correct type");
        assert.equal(lastConfig.type, showConfig.type, "animate on show: correct duration");

        instance.hide();
        assert.equal(lastConfig.type, hideConfig.type, "animate on hide: correct type");
        assert.equal(lastConfig.duration, hideConfig.duration, "animate on hide: correct duration");
    } finally {
        fx.animate = originAnimate;
    }
});

QUnit.test("animation complete callback arguments should be correct", function(assert) {
    var originAnimate = fx.animate;
    fx.animate = function($element, config) {
        config.complete($element, config);
    };

    try {
        var showArgs,
            hideArgs,
            showConfig = {
                type: "pop",
                complete: function() {
                    showArgs = arguments;
                }
            },
            hideConfig = {
                type: "pop",
                complete: function() {
                    hideArgs = arguments;
                }
            };
        var instance = $("#overlay").dxOverlay({
            animation: {
                show: showConfig,
                hide: hideConfig
            }
        }).dxOverlay("instance");

        instance.show();
        assert.equal(showArgs.length, 2, "animate on show: correct type");

        instance.hide();
        assert.equal(hideArgs.length, 2, "animate on hide: correct type");
    } finally {
        fx.animate = originAnimate;
    }
});

QUnit.test("no merging for animation option should be present", function(assert) {
    var overlay = $("#overlay")
            .dxOverlay({
                animation: {
                    type: "pop",
                    show: {
                        from: {
                            opacity: 0
                        },
                        to: {
                            opacity: 1
                        }
                    },
                    hide: {
                        from: {
                            opacity: 1
                        },
                        to: {
                            opacity: 0
                        }
                    }
                }
            }).dxOverlay("instance"),
        animation;

    overlay.option("animation", {
        type: "slide",
        show: {
            from: {
                left: 0
            },
            to: {
                left: 100
            }
        },
        hide: {
            from: {
                left: 100
            },
            to: {
                left: 0
            }
        }
    });

    animation = overlay.option("animation");

    assert.equal(animation.show.from.opacity, undefined, "opacity not merged");
    assert.equal(animation.show.to.opacity, undefined, "opacity not merged");
    assert.equal(animation.hide.from.opacity, undefined, "opacity not merged");
    assert.equal(animation.hide.to.opacity, undefined, "opacity not merged");
});

QUnit.test("dispose should stop animation before complete show", function(assert) {
    var done = assert.async();
    var $overlay = $("#overlay").dxOverlay({
            animation: {
                show: {
                    type: "pop",
                    duration: 500
                }
            }
        }),
        overlay = $overlay.dxOverlay("instance");

    overlay.show();
    overlay.on("disposing", function() {
        assert.ok(!fx.isAnimating($overlay));
        done();
    });
    $overlay.remove();
});

QUnit.test("dispose should stop animation before complete hide", function(assert) {
    var done = assert.async();
    var $overlay = $("#overlay").dxOverlay({
            animation: {
                hide: {
                    type: "pop",
                    duration: 500
                }
            }
        }),
        overlay = $overlay.dxOverlay("instance");

    overlay.show().done(function() {
        overlay.hide();
        overlay.on("disposing", function() {
            assert.ok(!fx.isAnimating($overlay));
            done();
        });
        $overlay.remove();
    });
});

QUnit.test("'animation.show.to.position' should be configured according to widget option 'position'", function(assert) {
    var origFX = fx.animate;

    try {
        var widgetPosition = { my: "top", at: "top", of: window },
            animationShowToPosition = { my: "bottom", at: "bottom", of: window };

        var $overlay = $("#overlay").dxOverlay({
                position: widgetPosition,
                animation: { show: { to: { position: animationShowToPosition } } }
            }),
            overlay = $overlay.dxOverlay("instance");

        fx.animate = function(_, config) {
            assert.equal(config.type, "slide", "slide animation set");
            assert.deepEqual(config.to.position, widgetPosition, "to position animation set");
        };
        overlay.show();
    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("'animation.hide.from.position' should be configured according to widget option 'position'", function(assert) {
    var origFX = fx.animate;

    try {
        var widgetPosition = { my: "top", at: "top", of: window },
            animationShowToPosition = { my: "bottom", at: "bottom", of: window };

        var $overlay = $("#overlay").dxOverlay({
                position: widgetPosition,
                animation: { hide: { from: { position: animationShowToPosition } } },
                visible: true
            }),
            overlay = $overlay.dxOverlay("instance");

        fx.animate = function(_, config) {
            assert.equal(config.type, "slide", "slide animation set");
            assert.deepEqual(config.from.position, widgetPosition, "from position animation set");
        };
        overlay.hide();
    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("pointer events should be disabled during hide animation", function(assert) {
    assert.expect(2);

    if(!$("body").css("pointerEvents")) {
        assert.expect(0);
        return;
    }

    var animationConfig = {
        duration: 0,
        start: function() {
            assert.equal(instance.$content().css("pointerEvents"), "none", "start of the hiding animation has correct pointer-events");
        },
        complete: function() {
            assert.equal(instance.$content().css("pointerEvents"), originalPointerEvents, "complete of the hiding animation has correct pointer-events");
        }
    };

    var $element = $("#overlay").dxOverlay({
            visible: true,
            animation: {
                hide: animationConfig
            }
        }),
        instance = $element.dxOverlay("instance"),
        originalPointerEvents = instance.$content().css("pointerEvents");

    instance.hide();
});

QUnit.test("overlay should be able to get animation function", function(assert) {
    assert.expect(1);

    var origFX = fx.animate;

    try {
        fx.animate = function(_, config) {
            assert.equal(config.type, "fade", "slide animation should be executed");
        };

        var $element = $("#overlay").dxOverlay({
                animation: function() {
                    return { hide: { type: "fade" } };
                },
                visible: true
            }),
            instance = $element.dxOverlay("instance");

        instance.hide();

    } finally {
        fx.animate = origFX;
    }
});


QUnit.module("content", moduleConfig);

QUnit.test("content ready action should be fired if was set at initialization", function(assert) {
    var count = 0,
        instance = $("#overlay").dxOverlay({
            onContentReady: function() { count++; }
        }).dxOverlay("instance");

    instance.show();
    instance.hide();
    instance.show();
    assert.equal(count, 1);
});

QUnit.test("content ready action should be fired if was set thought option", function(assert) {
    var count = 0,
        instance = $("#overlay").dxOverlay({
            onContentReady: function() { count++; }
        }).dxOverlay("instance");
    instance.option("onContentReady", function() { count = count + 3; });

    instance.show();
    instance.hide();
    instance.show();
    assert.equal(count, 3);
});

QUnit.test("content should be rendered only once after repaint", function(assert) {
    var count = 0,
        instance = $("#overlay").dxOverlay({
            visible: true,
            onContentReady: function() { count++; }
        }).dxOverlay("instance");

    instance.repaint();
    assert.equal(count, 1);
});

QUnit.test("content should be rendered only once after resize", function(assert) {
    var count = 0;

    $("#overlay").dxOverlay({
        visible: true,
        animation: null,
        onContentReady: function() { count++; }
    });

    resizeCallbacks.fire();
    assert.equal(count, 1);
});

QUnit.test("content should be rendered only once after container change", function(assert) {
    var count = 0,
        instance = $("#overlay").dxOverlay({
            visible: true,
            animation: null,
            onContentReady: function() { count++; },
            container: "#overlayInTargetContainer"
        }).dxOverlay("instance");

    instance.option("container", null);
    assert.equal(count, 1);
});

QUnit.test("contentTemplate should use correct contentElement", function(assert) {
    $("#overlay").dxOverlay({
        visible: true,
        contentTemplate: function(contentElement) {
            assert.equal(typeUtils.isRenderer(contentElement), !!config().useJQuery, "contentElement is correct");
        }
    });
});

QUnit.test("anonymous content template rendering", function(assert) {
    const $contentElement = $("#overlayWithAnonymousTmpl #content");

    const $overlay = $("#overlayWithAnonymousTmpl").dxOverlay({
        visible: true
    });
    const $content = $overlay.dxOverlay("$content");

    assert.equal($content.children()[0], $contentElement[0], "content element preserved");
});

QUnit.test("custom content template", function(assert) {
    var $overlay = $("#overlayWithContentTemplate").dxOverlay({ contentTemplate: 'custom', visible: true }),
        $content = $($overlay.dxOverlay("instance").$content());

    assert.equal($content.children().length, 1, "Overlay content has only one child");
    assert.equal($.trim($content.text()), "TestContent", "Overlay content text is correct");
});

QUnit.test("wrong content template name is specified", function(assert) {
    var $overlay = $("#overlayWithWrongTemplateName").dxOverlay({ contentTemplate: 'custom', visible: true }),
        $content = $($overlay.dxOverlay("instance").$content());

    assert.equal($.trim($content.text()), "custom", "content has no text");
});

QUnit.test("contentTemplate option accepts template instance", function(assert) {
    var $template = $("<div>").text("test");

    var $overlay = $("#overlay").dxOverlay({
        contentTemplate: new Template($template),
        visible: true
    });

    var $content = $($overlay.dxOverlay("instance").$content());

    assert.equal($.trim($content.text()), "test", "template rendered");
});

QUnit.test("contentTemplate option support dynamic change", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
        contentTemplate: "template1",
        visible: true
    });

    $overlay.dxOverlay("option", "contentTemplate", "template2");

    assert.equal($.trim($overlay.dxOverlay("$content").text()), "template2", "template rerendered");
});

QUnit.test("contentTemplate option support dynamic change in a set of options", function(assert) {
    var overlay = $("#overlay").dxOverlay({
        contentTemplate: "template1",
        visible: true
    }).dxOverlay("instance");

    overlay.hide();
    overlay.option({
        contentTemplate: "template2",
        visible: true
    });

    assert.equal(overlay.$content().text(), "template2", "template rerendered correctly");
});

QUnit.module("defer rendering", moduleConfig);

QUnit.test("behavior if option set to true", function(assert) {
    var onContentReadyFired = false,
        instance = $("#overlay").dxOverlay({
            onContentReady: function() { onContentReadyFired = true; }
        }).dxOverlay("instance");

    assert.ok(!onContentReadyFired, "after widget render content still not render");
    instance.show();
    assert.ok(onContentReadyFired, "after overlay show, content is rendered");
});

QUnit.test("behavior if option set to false", function(assert) {
    var onContentReadyFired = false,
        instance = $("#overlay")
            .dxOverlay({
                deferRendering: false,
                onContentReady: function() { onContentReadyFired = true; }
            })
            .dxOverlay("instance");

    assert.ok(onContentReadyFired, "after overlay render, content is render too");

    onContentReadyFired = false;
    instance.show();
    assert.ok(!onContentReadyFired, "after show overlay content do not render");
});

QUnit.test("content ready should be fired correctly when async template is used", function(assert) {
    var clock = sinon.useFakeTimers(),
        contentIsRendered = false;

    $("#overlay").dxOverlay({
        templatesRenderAsynchronously: true,
        deferRendering: false,
        onContentReady: function() {
            assert.ok(contentIsRendered, "Content is rendered before content ready firing");
        },
        integrationOptions: {
            templates: {
                "content": {
                    render: function(args) {
                        setTimeout(function() {
                            contentIsRendered = true;
                            args.onRendered();
                        }, 100);
                    }
                }
            }
        }
    });

    clock.tick(100);
    clock.restore();
});

QUnit.module("close on outside click", moduleConfig);

QUnit.test("overlay should be hidden after click outside was present", function(assert) {
    var overlay = $("#overlay").dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        })
            .dxOverlay("instance"),
        $content = overlay.$content();

    $($content).trigger("dxpointerdown");
    assert.equal(overlay.option("visible"), true, "overlay is not hidden");

    $(document).trigger("dxpointerdown");
    assert.equal(overlay.option("visible"), false, "overlay is hidden");
});

QUnit.test("overlay should not be hidden after click inside was present", function(assert) {
    var $overlay = $("#overlay");
    $("<div id='innerContent'>").appendTo($overlay);
    var overlay = $overlay.dxOverlay({
        closeOnOutsideClick: true,
        visible: true
    }).dxOverlay("instance");

    pointerMock($("#innerContent", $overlay))
        .start()
        .wait(600)
        .click();

    assert.equal(overlay.option("visible"), true, "overlay is not hidden");
});

// T494814
QUnit.test("overlay should not be hidden after click in detached element", function(assert) {
    var overlay = $("#overlayWithAnonymousTmpl").dxOverlay({
        closeOnOutsideClick: true,
        visible: true
    })
        .dxOverlay("instance");

    $("#content").on("dxpointerdown", function(e) {
        $("#content").replaceWith($("<div>").attr("id", "content"));
    });

    // act
    $("#content").trigger("dxpointerdown");

    // assert
    assert.equal(overlay.option("visible"), true, "overlay is not hidden");
});

QUnit.test("overlay should not propagate events after click outside was present", function(assert) {
    $("#overlay").dxOverlay({
        closeOnOutsideClick: true,
        visible: true,
        shading: true
    });

    var downEvent = $.Event("dxpointerdown", { pointerType: "mouse" });
    $(document).trigger(downEvent);
    assert.ok(downEvent.isDefaultPrevented(), "default prevented");

});

QUnit.test("overlay should propagate events when shading is false (T181002)", function(assert) {
    $("#overlay").dxOverlay({
        closeOnOutsideClick: true,
        visible: true,
        shading: false
    });

    var downEvent = $.Event("dxpointerdown", { pointerType: "mouse" });
    $(document).trigger(downEvent);
    assert.ok(!downEvent.isDefaultPrevented(), "default is not prevented");

});

QUnit.test("outside click should close several overlays if propagateOutsideClick option of top overlay is true", function(assert) {
    var overlay1 = $("#overlay").dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }).dxOverlay("instance"),
        overlay2 = $("#overlay2").dxOverlay({
            closeOnOutsideClick: false,
            visible: true,
            propagateOutsideClick: true
        }).dxOverlay("instance");

    $("body").trigger("dxpointerdown");

    assert.equal(overlay1.option("visible"), false, "First overlay is hidden");
    assert.equal(overlay2.option("visible"), true, "Second overlay is visible");
});

QUnit.test("customer should control closing of other overlays when some overlay content clicked", function(assert) {
    // note: T668816, T655391 and click menu item when menu is inside of dxPopup with closeOnOutsideClick true
    var overlay1 = $("#overlay").dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }).dxOverlay("instance"),
        overlay2 = $("#overlay2").dxOverlay({
            closeOnOutsideClick: true,
            visible: true,
            propagateOutsideClick: true
        }).dxOverlay("instance");

    $(overlay2.content()).trigger("dxpointerdown");

    assert.equal(overlay1.option("visible"), false, "Bottom overlay should get outside click when other overlay clicked");
    assert.equal(overlay2.option("visible"), true, "Second overlay is visible");

    overlay1.show();
    overlay2.option("closeOnOutsideClick", function(e) {
        return !e.target.closest(".dx-overlay-content");
    });
    $(overlay1.content()).trigger("dxpointerdown");

    assert.equal(overlay1.option("visible"), true, "First overlay is visible");
    assert.equal(overlay2.option("visible"), true, "Closing should be prevented by a user-defined function");
});

QUnit.test("overlays' priority", function(assert) {
    var $overlay1 = $("#overlay").dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }),
        overlay1 = $overlay1.dxOverlay("instance"),
        $overlay2 = $("#overlay2").dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }),
        overlay2 = $overlay2.dxOverlay("instance");

    $(overlay2.content()).trigger("dxpointerdown");

    assert.equal(overlay1.option("visible"), true, "First overlay is NOT hidden, because it's NOT active");
    assert.equal(overlay2.option("visible"), true, "Second overlay is visible");

    $("body").trigger("dxpointerdown");

    assert.equal(overlay1.option("visible"), true, "First overlay is NOT hidden, because it's NOT active");
    assert.equal(overlay2.option("visible"), false, "Second overlay is hidden, because it is active");

    $("body").trigger("dxpointerdown");

    assert.equal(overlay1.option("visible"), false, "First overlay is now hidden, because it has become active");
});


QUnit.test("closeOnOutsideClick works after first overlay hiding", function(assert) {
    var $overlay1 = $("#overlay").dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }),
        overlay1 = $overlay1.dxOverlay("instance"),
        $overlay2 = $("#overlay2").dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }),
        overlay2 = $overlay2.dxOverlay("instance");

    overlay1.hide();

    $("body").trigger("dxpointerdown");

    assert.equal(overlay1.option("visible"), false, "First overlay is hidden, because of calling hide");
    assert.equal(overlay2.option("visible"), false, "Second overlay is hidden, because of outsideclick");
});

QUnit.test("document events should be unsubscribed at each overlay hiding", function(assert) {
    var $overlay1 = $("#overlay").dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }),
        instance1 = $overlay1.dxOverlay("instance"),
        $overlay2 = $("#overlay2").dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }),
        instance2 = $overlay2.dxOverlay("instance");

    assert.ok(instance1.option("visible"), "overlay1 is shown");
    assert.ok(instance2.option("visible"), "overlay2 is shown");

    $("body").trigger("dxpointerdown");
    assert.ok(instance1.option("visible"), "overlay1 is shown");
    assert.ok(!instance2.option("visible"), "overlay2 is hidden");

    $("body").trigger("dxpointerdown");
    assert.ok(!instance1.option("visible"), "overlay1 is hidden");
    assert.ok(!instance2.option("visible"), "overlay2 is hidden");
});

QUnit.test("closeOnOutsideClick does not close back widget while front widget is still animated", function(assert) {
    var $overlay1 = $("#overlay").dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }),
        instance1 = $overlay1.dxOverlay("instance"),
        $overlay2 = $("#overlay2").dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }),
        instance2 = $overlay2.dxOverlay("instance");

    try {
        fx.off = false;

        $("body").trigger("dxpointerdown");
        $(instance2.content()).trigger("dxpointerdown");
        assert.ok(!instance2.option("visible"), "second overlay is hidden");
        assert.ok(instance1.option("visible"), "first overlay is not hidden");
    } finally {
        fx.off = true;
    }
});

QUnit.test("click on overlay during the start animation should end the animation (T273294)", function(assert) {
    var $overlay = $("#overlay").dxOverlay({ closeOnOutsideClick: true }),
        overlay = $overlay.dxOverlay("instance");

    try {
        fx.off = false;
        overlay.show();

        $(overlay.content()).trigger("dxpointerdown");
        assert.ok(overlay.option("visible"), "overlay is stay visible");
    } finally {
        fx.off = true;
    }
});

QUnit.testInActiveWindow("inputs inside should loose focus when overlay is hidden with animation disabled", function(assert) {
    var focusoutWasTriggered = false,
        $input = $("<input id='alter-box' />")
            .on("focusout", function() {
                focusoutWasTriggered = true;
            }),
        overlay = $("#overlay")
            .dxOverlay({
                animation: false,
                shading: false,
                visible: true,
                contentTemplate: function(contentElement) {
                    return $(contentElement).append($input);
                }
            })
            .dxOverlay("instance");

    $input.focus();
    overlay.hide();

    assert.equal(focusoutWasTriggered, true, "input lost focus");
});

QUnit.module("close on target scroll", moduleConfig);

QUnit.test("overlay should be hidden if any of target's parents were scrolled", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            closeOnTargetScroll: true,
            position: {
                my: "left top",
                at: "left bottom",
                of: $("#overlayInputTarget")
            },
            visible: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $content = $(overlay.content());

    $("#parentContainer").triggerHandler("scroll");
    assert.equal($content.is(":visible"), false, "overlay should be hidden after scroll event on any parent");
});

QUnit.test("overlay should not be hidden on parents scroll if show animation is not completed", function(assert) {
    fx.off = false;

    var overlay = $("#overlay").dxOverlay({
        closeOnTargetScroll: true,
        position: {
            my: "left top",
            at: "left bottom",
            of: $("#overlayInputTarget")
        },
        visible: false,
        animation: { show: { duration: 100 } }
    }).dxOverlay("instance");

    overlay.show();
    $("#parentContainer").triggerHandler("scroll");

    assert.equal(overlay.option("visible"), true, "overlay should not be hidden if show animation is not completed");
});

QUnit.test("overlay should be hidden if any of jQuery Event target's parents were scrolled", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            closeOnTargetScroll: true,
            position: {
                my: "left top",
                at: "left bottom",
                of: $.Event("dxpointerdown", { pointerType: "mouse", pageX: 50, pageY: 50, target: $("#overlayInputTarget").get(0) })
            },
            visible: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $content = $(overlay.content());

    $("#parentContainer").triggerHandler("scroll");
    assert.equal($content.is(":visible"), false, "Overlay should be hidden after scroll event on any parent");
});

QUnit.test("overlay should not be hidden on any target's parents scroll events if option set to false", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            closeOnTargetScroll: false,
            position: {
                my: "left top",
                at: "left bottom",
                of: $("#overlayInputTarget")
            },
            visible: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $content = $(overlay.content());

    $("#parentContainer").triggerHandler("scroll");
    assert.equal($content.is(":visible"), true, "Overlay should not be hidden as this ability is disabled");
});

QUnit.test("overlay should be hidden on window scroll event on desktop", function(assert) {
    var originalPlatform = devices.real().platform;

    try {
        devices.real({ platform: "generic" });

        var $overlay = $("#overlay").dxOverlay({
            closeOnTargetScroll: true
        });

        var overlay = $overlay.dxOverlay("instance");
        var $content = $(overlay.content());

        overlay.show();

        $(window).triggerHandler("scroll");
        assert.equal($content.is(":visible"), false, "Overlay should be hidden after scroll event on window");
    } finally {
        devices.real({ platform: originalPlatform });
    }
});

QUnit.test("overlay should not be hidden on window scroll event on mobile devices", function(assert) {
    var originalPlatform = devices.real().platform;

    try {
        devices.real({ platform: "ios" });

        var $overlay = $("#overlay").dxOverlay({
            closeOnTargetScroll: true
        });

        var overlay = $overlay.dxOverlay("instance");
        var $content = $(overlay.content());

        overlay.show();

        $(window).triggerHandler("scroll");
        assert.equal($content.is(":visible"), true, "Overlay should not be hidden after scroll event on window");
    } finally {
        devices.real({ platform: originalPlatform });
    }
});

QUnit.test("hiding & hidden should be fired if closing by scroll event when overlay initially visible", function(assert) {
    assert.expect(2);

    var $overlay = $("#overlay").dxOverlay({
            visible: true,
            closeOnTargetScroll: true,
            position: {
                my: "left top",
                at: "left bottom",
                of: "#overlayInputTarget"
            },
            onHiding: function() {
                assert.ok(true, "hiding action fired");
            },
            onHidden: function() {
                assert.ok(true, "hidden action fired");
            }
        }),
        overlay = $overlay.dxOverlay("instance");

    overlay.show();
    $("#parentContainer").triggerHandler("scroll");
});

QUnit.test("scroll subscriptions should be unsubscribed from subscribed elements", function(assert) {
    var $target = $("#overlayInputTarget");

    var $overlay = $("#overlay").dxOverlay({
            closeOnTargetScroll: true,
            position: {
                my: "left top",
                at: "left bottom",
                of: $target
            },
            visible: true
        }),
        overlay = $overlay.dxOverlay("instance");

    var targetParent = $target.parent().get(0);
    $target.detach();
    overlay.hide();
    var parentEvents = $._data(targetParent).events || {};
    assert.equal("scroll" in parentEvents, false, "scroll unsubscribed");
});

QUnit.test("all opened overlays should be closed on scroll", function(assert) {
    var $target = $("#overlayInputTarget");

    var $overlay1 = $("#overlay").dxOverlay({
        closeOnTargetScroll: true,
        position: {
            of: $target
        },
        visible: true
    });

    var $overlay2 = $("#overlay2").dxOverlay({
        closeOnTargetScroll: true,
        position: {
            of: $target
        },
        visible: true
    });

    $("#parentContainer").triggerHandler("scroll");
    assert.equal($overlay1.dxOverlay("option", "visible"), false, "overlay1 closed");
    assert.equal($overlay2.dxOverlay("option", "visible"), false, "overlay2 closed");
});

QUnit.test("target scroll subscriptions should be unsubscribed for current overlay", function(assert) {
    var $target = $("#overlayInputTarget");

    var $overlay1 = $("#overlay").dxOverlay({
        closeOnTargetScroll: function() {
            return $overlay2.dxOverlay("option", "visible");
        },
        position: {
            of: $target
        },
        visible: true
    });

    var $overlay2 = $("#overlay2").dxOverlay({
        closeOnTargetScroll: true,
        position: {
            of: $target
        },
        visible: true
    });

    $("#parentContainer").triggerHandler("scroll");
    assert.equal($overlay1.dxOverlay("option", "visible"), true, "overlay1 opened");

    $("#parentContainer").triggerHandler("scroll");
    assert.equal($overlay1.dxOverlay("option", "visible"), false, "overlay1 closed");
});


QUnit.module("container", moduleConfig);

QUnit.test("content should not be moved to container", function(assert) {
    var overlay = $("#overlay").dxOverlay({
        container: "#customTargetContainer"
    }).dxOverlay("instance");

    overlay.show();
    assert.equal($("#customTargetContainer").children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 1);
});

QUnit.test("content should not be moved to container before content ready action", function(assert) {
    assert.expect(1);

    var overlay = $("#overlay").dxOverlay({
        container: "#customTargetContainer",
        onContentReady: function() {
            assert.equal($("#customTargetContainer").children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 1);
        }
    }).dxOverlay("instance");

    overlay.show();
});

QUnit.test("content should not be moved to container before content ready action only if content visible", function(assert) {
    assert.expect(1);

    $("#overlay").dxOverlay({
        container: "#customTargetContainer",
        onContentReady: function() {
            assert.equal($("#customTargetContainer").children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 0);
        },
        deferRendering: false
    });
});

QUnit.test("content should not be moved if overlay in container", function(assert) {
    var overlay = $("#overlayInTargetContainer").dxOverlay().dxOverlay("instance");

    overlay.show();
    assert.equal(viewport().children(toSelector(OVERLAY_CLASS)).children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 1);
});

QUnit.test("content should be moved to parent overlay element if container equals 'null'", function(assert) {
    var overlay = $("#overlay").dxOverlay({
        container: false
    }).dxOverlay("instance");

    overlay.show();
    assert.equal($("#overlay").children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 1);
    assert.equal($(".dx-viewport").children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 0);
});

QUnit.test("css classes from overlay should be duplicated to wrapper", function(assert) {
    var instance = $("#overlayWithClass").dxOverlay({
            visible: true
        }).dxOverlay("instance"),
        $wrapper = $(instance.$content().closest(toSelector(OVERLAY_WRAPPER_CLASS)));
    assert.ok($wrapper.hasClass("something"), "class added to wrapper");
    assert.ok($wrapper.hasClass("another"), "another class added to wrapper");
    assert.ok($wrapper.hasClass(OVERLAY_WRAPPER_CLASS), "classes does not removed from wrapper");
    assert.ok(!$wrapper.hasClass(OVERLAY_CLASS), "only user-defined classes added to wrapper");
});

QUnit.test("defaultTargetContainer should be .dx-viewport by default", function(assert) {
    var overlay = $("#overlay").dxOverlay().dxOverlay("instance");
    overlay.show();

    assert.equal($(".dx-viewport").children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 1);
    assert.equal($("#parentContainer").children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 0);
});

QUnit.test("content should be moved back to overlay element on hide (B253278)", function(assert) {
    var $overlay = $("#overlay").dxOverlay(),
        overlay = $overlay.dxOverlay("instance");

    overlay.show();
    overlay.hide();

    assert.ok($overlay.find(overlay.$content()).length, "content moved back");
});

QUnit.test("content should be moved to container on show (B253278)", function(assert) {
    var $overlay = $("#overlay").dxOverlay(),
        overlay = $overlay.dxOverlay("instance");

    overlay.show();
    overlay.hide();
    overlay.show();

    assert.ok(!$overlay.find(overlay.$content()).length, "content moved back");
});

QUnit.test("shader should be positioned relatively to container", function(assert) {
    var $container = $("<div>").css({
        height: "500px",
        position: "relative"
    }).appendTo("#qunit-fixture");

    var $content = $("<div>").css({
        height: "100px",
        position: "absolute",
        top: "100px"
    }).appendTo($container);

    var $overlay = $("#overlay").dxOverlay({
        container: $container,
        shading: true,
        position: {
            my: "center center",
            at: "center center",
            of: $content
        }
    });

    $overlay.dxOverlay("show");

    var $shader = $container.find(".dx-overlay-shader");

    assert.ok(Math.abs(Math.round($shader.offset().top) - Math.round($container.offset().top)) <= 1, "shader top position is correct");
    assert.equal($shader.width(), $container.width(), "shader width is correct");
    assert.equal($shader.height(), $container.height(), "shader height is correct");
});

QUnit.test("wrong position targeted container (B236074)", function(assert) {
    var $overlappedDiv = $("<div>").css({ width: 200, height: 150 });
    $overlappedDiv.appendTo("#qunit-fixture");

    try {
        var instance = $("<div>")
            .appendTo("#qunit-fixture")
            .dxOverlay({
                container: $overlappedDiv,
                shading: true,
                visible: true
            }).dxOverlay("instance");

        assert.ok(!$(instance._$wrapper).hasClass(OVERLAY_MODAL_CLASS));

        instance.option("container", null);
        assert.ok($(instance._$wrapper).hasClass(OVERLAY_MODAL_CLASS));
    } finally {
        $overlappedDiv.remove();
    }
});

QUnit.test("widget should react on viewport change", function(assert) {
    var origViewport = viewPort();

    try {
        $("#overlay").dxOverlay({
            container: undefined,
            visible: true
        });

        var $viewport = $("<div>");
        viewPort($viewport);
        assert.equal($viewport.children("." + OVERLAY_WRAPPER_CLASS).length, 1, "overlay moved to new viewport");
    } finally {
        viewPort(origViewport);
    }
});

QUnit.test("widget should correctly react on viewport change if parent container hidden", function(assert) {
    var $origViewport = viewPort();

    try {
        var overlay = $("#overlay").dxOverlay({
            container: undefined,
            visible: true,
            animation: null
        }).dxOverlay("instance");

        overlay.$element().parent().hide();

        viewPort($origViewport); // Need to trigger viewport change callback but not change viewport value
        assert.equal($origViewport.children("." + OVERLAY_WRAPPER_CLASS).length, 0, "overlay not rendered because parent is hidden");
    } finally {
        viewPort($origViewport);
    }
});

QUnit.test("widget should react on viewport change with correct container", function(assert) {
    var origViewport = viewPort();

    try {
        $("#overlay").dxOverlay({
            container: false,
            visible: true
        });

        var $viewport = $("<div>");
        viewPort($viewport);
        assert.equal($viewport.children("." + OVERLAY_WRAPPER_CLASS).length, 0, "overlay not moved to new viewport");
    } finally {
        viewPort(origViewport);
    }
});


QUnit.module("target", moduleConfig);

QUnit.test("target option should be present in positions", function(assert) {
    var $target = $("#container");

    var OverlayTarget = Overlay.inherit({

        _defaultOptionsRules: function() {
            return [];
        },

        _setDefaultOptions: function() {
            this.callBase();

            this.option({
                position: { of: $(window) },
                animation: {
                    show: {
                        to: { position: { of: $(window) } },
                        from: { position: { of: $(window) } }
                    },
                    hide: {
                        to: { position: { of: $(window) } },
                        from: { position: { of: $(window) } }
                    }
                }
            });
        }

    });

    var $overlay = $("#overlay"),
        overlay = new OverlayTarget($overlay, {
            target: $target
        });

    $.each([
        "position.of",
        "animation.show.from.position.of",
        "animation.show.to.position.of",
        "animation.hide.from.position.of",
        "animation.hide.to.position.of"
    ], function(_, item) {
        assert.equal(overlay.option(item).get(0), $target.get(0), item + " set");
    });
});


QUnit.module("back button callback", moduleConfig);

QUnit.test("callback should not be added if hideTopOverlayHandler option equals 'null' (B251263, B251262)", function(assert) {
    var instance = $("#overlay").dxOverlay({
        hideTopOverlayHandler: null
    }).dxOverlay("instance");
    assert.ok(!hideTopOverlayCallback.hasCallback());

    instance.show();
    assert.ok(!hideTopOverlayCallback.hasCallback());
});

QUnit.test("hideTopOverlayCallback callback should not be added if hideTopOverlayHandler option equals 'false'", function(assert) {
    var instance = $("#overlay").dxOverlay({
        closeOnBackButton: false
    }).dxOverlay("instance");
    assert.ok(!hideTopOverlayCallback.hasCallback());

    instance.show();
    assert.ok(!hideTopOverlayCallback.hasCallback());
});

QUnit.test("hideTopOverlayCallback callback should be unsubscribing before hide animation start", function(assert) {
    var instance = $("#overlay").dxOverlay({
        visible: true,
        animation: {
            hide: {
                start: function() {
                    assert.ok(!hideTopOverlayCallback.hasCallback());
                }
            }
        }
    }).dxOverlay("instance");

    instance.hide();
});

QUnit.test("overlay should be hidden after callback fired", function(assert) {
    var instance = $("#overlay").dxOverlay().dxOverlay("instance");

    instance.show();
    hideTopOverlayCallback.fire();
    assert.equal(instance.option("visible"), false, "hidden after back button event");
});

QUnit.test("overlay should be hidden after callback fired if overlay showed by setting option 'visible'", function(assert) {
    var instance = $("#overlay").dxOverlay().dxOverlay("instance");

    instance.option("visible", true);
    hideTopOverlayCallback.fire();
    assert.equal(instance.option("visible"), false, "hidden after back button event");
});


QUnit.module("API", moduleConfig);

QUnit.test("toggle without args", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            visible: false
        }),
        overlay = $overlay.dxOverlay("instance");

    overlay.toggle();
    assert.equal(overlay.option("visible"), true);

    overlay.toggle();
    assert.equal(overlay.option("visible"), false);
});

QUnit.test("toggle with args", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            visible: false
        }),
        overlay = $overlay.dxOverlay("instance");

    overlay.toggle(true);
    assert.equal(overlay.option("visible"), true);

    overlay.toggle(true);
    assert.equal(overlay.option("visible"), true);

    overlay.toggle(false);
    assert.equal(overlay.option("visible"), false);

    overlay.toggle(false);
    assert.equal(overlay.option("visible"), false);
});

QUnit.test("show/hide", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            visible: false
        }),
        overlay = $overlay.dxOverlay("instance");

    overlay.show();
    assert.equal(overlay.option("visible"), true);

    overlay.show();
    assert.equal(overlay.option("visible"), true);

    overlay.hide();
    assert.equal(overlay.option("visible"), false);

    overlay.hide();
    assert.equal(overlay.option("visible"), false);
});

QUnit.test("show/hide deferreds without animation", function(assert) {
    assert.expect(4);

    var done = assert.async();

    fx.off = true;

    var overlay = $("#overlay").dxOverlay().dxOverlay("instance");

    overlay.show().done(function() {
        assert.ok(true);
        assert.equal(this, overlay);

        overlay.hide().done(function() {
            assert.ok(true);
            assert.equal(this, overlay);

            done();
        });
    });
});

QUnit.test("show/hide deferreds with animation", function(assert) {
    assert.expect(4);

    var done = assert.async();

    fx.off = false;

    var overlay = $("#overlay").dxOverlay({
        animation: {
            show: {
                duration: 10
            },
            hide: {
                duration: 10
            }
        }
    }).dxOverlay("instance");

    overlay.show().done(function() {
        assert.ok(true);
        assert.equal(this, overlay);

        overlay.hide().done(function() {
            assert.ok(true);
            assert.equal(this, overlay);

            done();
        });
    });
});

QUnit.test("content()", function(assert) {
    var $element = $("#overlay"),
        instance = $element.dxOverlay().dxOverlay("instance");

    assert.ok(instance.$content().hasClass(OVERLAY_CONTENT_CLASS), "API method content() returns correct jQuery object");
});


QUnit.module("integration tests", moduleConfig);

QUnit.test("wrong gallery render on start in overlay widget (B232427)", function(assert) {
    var overlay = $("#overlayWithAnonymousTmpl").dxOverlay().dxOverlay("instance"),
        $content = $(overlay.content());

    assert.equal($content.children().length, 0, "Overlay has no children");
    overlay.show();
    assert.equal($content.children().length, 1, "Overlay content has one children");
    overlay.hide();
    assert.equal($content.children().length, 1, "Overlay content has one children");
});

QUnit.module("widget sizing render", moduleConfig);

QUnit.test("default", function(assert) {
    var $element = $("#widget").dxOverlay(),
        instance = $element.dxOverlay("instance");

    instance.show();

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
});

QUnit.test("constructor", function(assert) {
    var $element = $("#widget").dxOverlay({ width: 400 }),
        instance = $element.dxOverlay("instance");

    instance.show();

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual(instance.$content().outerWidth(), 400, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#widget").dxOverlay(),
        instance = $element.dxOverlay("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    instance.show();

    assert.strictEqual(instance.$content().outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});


QUnit.module("drag", moduleConfig);

QUnit.test("overlay should be dragged by content", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            dragEnabled: true,
            visible: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content()),
        pointer = pointerMock($overlayContent),
        position = $overlayContent.position();

    pointer.start().dragStart().drag(50, 50).dragEnd();

    assert.deepEqual($overlayContent.position(), {
        top: position.top + 50,
        left: position.left + 50
    }, "overlay was moved");
});

QUnit.test("overlay should not be dragged if dragEnabled is false", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            dragEnabled: false,
            visible: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content()),
        pointer = pointerMock($overlayContent),
        position = $overlayContent.position();

    pointer.start().dragStart().drag(50, 50).dragEnd();

    assert.deepEqual($overlayContent.position(), {
        top: position.top,
        left: position.left
    }, "overlay was not moved");
});

QUnit.test("overlay should not be dragged if dragEnabled is changed dynamically", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            dragEnabled: true,
            visible: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content()),
        pointer = pointerMock($overlayContent),
        position = $overlayContent.position();

    overlay.option("dragEnabled", false);
    pointer.start().dragStart().drag(50, 50).dragEnd();

    assert.deepEqual($overlayContent.position(), {
        top: position.top,
        left: position.left
    }, "overlay was not moved");
});

QUnit.test("dragged overlay should save position after dimensions change", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            dragEnabled: true,
            visible: true,
            width: 1,
            height: 1
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content()),
        pointer = pointerMock($overlayContent);

    pointer.start().dragStart().drag(-10).dragEnd();
    var prevPosition = $overlayContent.position().left;
    resizeCallbacks.fire();
    assert.equal($overlayContent.position().left, prevPosition, "correct position after first move");

    pointer.start().dragStart().drag(-10).dragEnd();
    prevPosition = $overlayContent.position().left;
    resizeCallbacks.fire();
    assert.equal($overlayContent.position().left, prevPosition, "correct position after next move");
});

QUnit.test("dragged overlay should not be positioned at default location after toggle visibility", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            dragEnabled: true,
            visible: true,
            height: 10,
            width: 10
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content()),
        pointer = pointerMock($overlayContent),
        position = $overlayContent.position();

    pointer.start().dragStart().drag(50, 50).dragEnd();

    overlay.hide();
    overlay.show();

    assert.deepEqual($overlayContent.position(), {
        top: position.top + 50,
        left: position.left + 50
    }, "overlay dragged position was reset");
});

QUnit.test("overlay should not be dragged out of target", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            dragEnabled: true,
            width: 2,
            height: 2,
            visible: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content()),
        $container = viewport(),
        pointer = pointerMock($overlayContent);

    $container.css({ padding: '10px' });

    var viewWidth = $container.outerWidth(),
        viewHeight = $container.outerHeight(),
        position = $overlayContent.position();

    var startEvent = pointer.start().dragStart().lastEvent();

    assert.equal(position.left - startEvent.maxLeftOffset, 0, "overlay should not be dragged left of target");
    assert.equal(position.left + startEvent.maxRightOffset, viewWidth - $overlayContent.outerWidth(), "overlay should not be dragged right of target");
    assert.equal(position.top - startEvent.maxTopOffset, 0, "overlay should not be dragged above the target");
    assert.equal(position.top + startEvent.maxBottomOffset, viewHeight - $overlayContent.outerHeight(), "overlay should not be dragged below than target");
});

QUnit.test("overlay can be dragged out of target if viewport and container is not specified", function(assert) {
    try {
        viewPort(null);

        var $overlay = $("#overlay").dxOverlay({
                dragEnabled: true,
                width: 2,
                height: 2,
                visible: true
            }),
            overlay = $overlay.dxOverlay("instance"),
            $overlayContent = overlay.$content(),
            pointer = pointerMock($overlayContent);

        $(".dx-viewport").attr("style", "width: 100px; height: 100px");

        var $container = $(window),
            viewWidth = $container.outerWidth(),
            viewHeight = Math.max($(document).outerHeight(), $container.outerHeight()),
            position = $overlayContent.position();

        var startEvent = pointer.start().dragStart().lastEvent();

        assert.equal(position.left + startEvent.maxRightOffset, viewWidth - $overlayContent.outerWidth(), "overlay should not be dragged right of target");
        assert.equal(position.top + startEvent.maxBottomOffset, viewHeight - $overlayContent.outerHeight(), "overlay should not be dragged below than target");
    } finally {
        $(".dx-viewport").removeAttr("style");
        viewPort(".dx-viewport");
    }
});

QUnit.test("overlay should have correct resizable area if viewport and container is not specified", function(assert) {
    try {
        viewPort(null);

        var $overlay = $("#overlay").dxOverlay({
                resizeEnabled: true,
                width: 2,
                height: 2,
                visible: true
            }),
            overlay = $overlay.dxOverlay("instance"),
            resizable = $(overlay.content()).dxResizable("instance");

        assert.ok($.isWindow(resizable.option("area").get(0)), "window is the area of the resizable");
    } finally {
        viewPort(".dx-viewport");
    }
});

QUnit.test("overlay should not be dragged when container size less than overlay content", function(assert) {
    var $container = $("<div>").appendTo("#qunit-fixture").height(0).width(20);
    var $overlay = $("#overlay").dxOverlay({
        dragEnabled: true,
        visible: true,
        height: 10,
        width: 10,
        container: $container
    });

    var $overlayContent = $overlay.dxOverlay("$content");
    var pointer = pointerMock($overlayContent);

    var startEvent = pointer.start().dragStart().lastEvent();

    assert.equal(startEvent.maxTopOffset, 0, "overlay should not be dragged vertically");
    assert.equal(startEvent.maxBottomOffset, 0, "overlay should not be dragged vertically");
    assert.equal(startEvent.maxLeftOffset, 0, "overlay should not be dragged horizontally");
    assert.equal(startEvent.maxRightOffset, 0, "overlay should not be dragged horizontally");
});

QUnit.test("overlay should be dragged correctly when position.of and shading (T534551)", function(assert) {
    var $container = $("<div>").appendTo("#qunit-fixture").height(0).width(200);
    $container.css("margin-left", "200px");
    $container.css("margin-top", "200px");

    var $overlay = $("#overlay").dxOverlay({
        dragEnabled: true,
        visible: true,
        shading: true,
        height: 20,
        width: 20,
        position: { of: $container }
    });

    var $overlayContent = $overlay.dxOverlay("$content"),
        overlayPosition = $overlayContent.position(),
        containerPosition = $container.position(),
        viewWidth = viewport().outerWidth(),
        viewHeight = viewport().outerHeight();

    var pointer = pointerMock($overlayContent);
    var startEvent = pointer.start().dragStart().lastEvent();

    assert.equal(startEvent.maxRightOffset, viewWidth - $overlayContent.outerWidth() - overlayPosition.left - 200, "overlay should be dragged right");
    assert.equal(startEvent.maxLeftOffset, 200 + overlayPosition.left, "overlay should be dragged left");
    assert.roughEqual(startEvent.maxTopOffset, 200 + overlayPosition.top + containerPosition.top, 1, "overlay should be dragged top");
    assert.roughEqual(startEvent.maxBottomOffset, viewHeight - $overlayContent.outerHeight() - containerPosition.top - overlayPosition.top - 200, 1, "overlay should be dragged bottom");
});

QUnit.test("change position after dragging", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
        visible: true,
        dragEnabled: true,
        position: { my: 'top', at: 'top', of: viewport(), offset: '0 0' }
    });
    var overlay = $overlay.dxOverlay("instance");
    var $content = $(overlay.content());
    var pointer = pointerMock($content);

    pointer.start().dragStart().drag(50, 50).dragEnd();
    assert.equal($content.position().top, 50, "overlay positioned correctly after dragging");

    overlay.option("position.offset", '0 20');

    assert.equal($content.position().top, 20, "overlay positioned correctly after change the 'position' option");
});

QUnit.module("resize", moduleConfig);

QUnit.test("overlay should have resizable component on content", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            resizeEnabled: true,
            visible: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content());

    assert.equal($overlayContent.dxResizable("option", "handles"), "all", "direction specified correctly");
});

QUnit.test("overlay shouldn't have resizable component on content if resizeEnabled is false", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            resizeEnabled: false,
            visible: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content());

    assert.equal($overlayContent.dxResizable("option", "handles"), "none", "direction specified correctly");
});

QUnit.test("overlay shouldn't have resizable component on content if resizeEnabled is changed dynamically", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            resizeEnabled: true,
            visible: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content());

    overlay.option("resizeEnabled", false);
    assert.equal($overlayContent.dxResizable("option", "handles"), "none", "direction specified correctly");
});

QUnit.test("resized overlay should save dimensions after dimensions change", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            resizeEnabled: true,
            visible: true,
            width: 200,
            height: 200
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content()),
        $handle = $overlayContent.find(".dx-resizable-handle-corner-bottom-right"),
        pointer = pointerMock($handle);

    pointer.start().dragStart().drag(10, 10).dragEnd();
    resizeCallbacks.fire();
    assert.deepEqual([$overlayContent.width(), $overlayContent.height()], [210, 210], "correct size");

    pointer.start().dragStart().drag(-20, -20).dragEnd();
    resizeCallbacks.fire();
    assert.deepEqual([$overlayContent.width(), $overlayContent.height()], [190, 190], "correct size");
});

QUnit.test("resized overlay should not save dimensions after height changed", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            resizeEnabled: true,
            visible: true,
            width: 200,
            height: 200
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content()),
        $handle = $overlayContent.find(".dx-resizable-handle-corner-bottom-right"),
        pointer = pointerMock($handle);

    pointer.start().dragStart().drag(10, 10).dragEnd();
    resizeCallbacks.fire();

    overlay.option("width", 300);
    assert.deepEqual([$overlayContent.width(), $overlayContent.height()], [300, 210], "correct size");
});

QUnit.test("resized overlay should save dimension for the side which was not resized", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            resizeEnabled: true,
            visible: true,
            width: 200,
            height: '70%'
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content()),
        $handle = $overlayContent.find(".dx-resizable-handle-corner-bottom-right"),
        pointer = pointerMock($handle);

    pointer.start().dragStart().drag(10, 0).dragEnd();
    resizeCallbacks.fire();

    assert.deepEqual([overlay.option("width"), overlay.option("height")], [210, "70%"], "correct size");
});

QUnit.test("resized overlay should not have default dimensions after toggle visibility", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            resizeEnabled: true,
            visible: true,
            width: 200,
            height: 200
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content()),
        $handle = $overlayContent.find(".dx-resizable-handle-corner-bottom-right"),
        pointer = pointerMock($handle);

    pointer.start().dragStart().drag(50, 50).dragEnd();

    overlay.hide();
    overlay.show();

    assert.deepEqual([$overlayContent.width(), $overlayContent.height()], [250, 250], "correct size");
});


QUnit.module("drag & resize", moduleConfig);

QUnit.test("dragged overlay should have default dimensions after toggle visibility", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            dragEnabled: true,
            resizeEnabled: true,
            visible: true,
            width: "auto",
            height: "auto"
        }),
        overlay = $overlay.dxOverlay("instance"),
        $overlayContent = $(overlay.content());

    pointerMock($overlayContent).start().dragStart().drag(50, 50).dragEnd();

    overlay.hide();
    overlay.show();

    assert.deepEqual([$overlayContent[0].style.width, $overlayContent[0].style.height], ["auto", "auto"], "correct size");
});


QUnit.module("keyboard navigation", {
    beforeEach: function() {
        fx.off = true;

        this.$overlay = $("#overlay").dxOverlay({
            focusStateEnabled: true,
            dragEnabled: true,
            visible: true,
            width: 1,
            height: 1
        });

        this.overlay = this.$overlay.dxOverlay("instance");
        this.$overlayContent = $(this.overlay.content());
        this.position = this.$overlayContent.position();
        this.keyboard = keyboardMock(this.$overlayContent);
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("esc handling", function(assert) {
    assert.equal(this.$overlayContent.attr("tabindex"), 0, "overlay content has tabindex 0");

    this.keyboard.keyDown("esc");

    assert.equal(this.overlay.option("visible"), false, "overlay is closed after pressing esc ");
});

QUnit.test("arrows handling", function(assert) {
    var offset = 5;
    this.keyboard.keyDown("left");
    assert.equal(this.$overlayContent.position().left, this.position.left - offset, "overlay position was change after pressing left arrow");
    this.position = this.$overlayContent.position();

    this.keyboard.keyDown("down");
    assert.equal(this.$overlayContent.position().top, this.position.top + offset, "overlay position was change after pressing down arrow");
    this.position = this.$overlayContent.position();

    this.keyboard.keyDown("right");
    assert.equal(this.$overlayContent.position().left, this.position.left + offset, "overlay position was change after pressing right arrow");
    this.position = this.$overlayContent.position();

    this.keyboard.keyDown("up");
    assert.equal(this.$overlayContent.position().top, this.position.top - offset, "overlay position was change after pressing up arrow");
});

QUnit.test("overlay should not be dragged when container size less than overlay content", function(assert) {
    var $container = $("<div>").appendTo("#qunit-fixture").height(14).width(14);
    var $overlay = $("#overlay").dxOverlay({
        dragEnabled: true,
        visible: true,
        height: 10,
        width: 10,
        container: $container,
        position: { my: "center center", at: "center center", of: $container }
    });

    var $overlayContent = $overlay.dxOverlay("$content");
    var keyboard = keyboardMock($overlayContent);

    keyboard.keyDown("left");
    assert.equal($overlayContent.position().left, 0, "overlay should not be dragged left of target");

    keyboard.keyDown("right");
    assert.equal($overlayContent.position().left, $container.width() - $overlayContent.outerWidth(), "overlay should not be dragged right of target");

    keyboard.keyDown("up");
    assert.equal($overlayContent.position().top, 0, "overlay should not be dragged above the target");

    keyboard.keyDown("down");
    assert.equal($overlayContent.position().top, $container.height() - $overlayContent.outerHeight(), "overlay should not be dragged below than target");
});

QUnit.test("arrows handling for rtl", function(assert) {
    var offset = 5;

    this.keyboard.keyDown("left");
    assert.equal(this.$overlayContent.position().left, this.position.left - offset, "overlay position was change after pressing left arrow");
    this.position = this.$overlayContent.position();

    this.keyboard.keyDown("right");
    assert.equal(this.$overlayContent.position().left, this.position.left + offset, "overlay position was change after pressing right arrow");
});

QUnit.test("arrows handling with dragEnable = false", function(assert) {
    this.overlay.option("dragEnabled", false);

    this.keyboard.keyDown("left");
    assert.equal(this.$overlayContent.position().left, this.position.left, "overlay position was change after pressing left arrow");
    this.position = this.$overlayContent.position();

    this.keyboard.keyDown("down");
    assert.equal(this.$overlayContent.position().top, this.position.top, "overlay position was change after pressing down arrow");
    this.position = this.$overlayContent.position();

    this.keyboard.keyDown("right");
    assert.equal(this.$overlayContent.position().left, this.position.left, "overlay position was change after pressing right arrow");
    this.position = this.$overlayContent.position();

    this.keyboard.keyDown("up");
    assert.equal(this.$overlayContent.position().top, this.position.top, "overlay position was change after pressing up arrow");
});

QUnit.test("overlay have focus on show click", function(assert) {
    var $overlayContent = this.$overlayContent;

    this.overlay.option("animation", {
        show: {
            start: function() {
                assert.ok(!$overlayContent.is(document.activeElement), "focus is on overlay");
            },
            complete: function() {
                assert.ok($overlayContent.is(document.activeElement), "focus isn't on overlay");
            }
        }
    });

    this.overlay.option("visible", false);
    this.overlay.option("visible", true);
});

QUnit.test("overlay doesn't handle keyboard propagated events", function(assert) {
    var $overlayContent = this.$overlayContent,
        $input = $("<input>");

    $overlayContent.append($input);
    var keyboard = keyboardMock($input);

    keyboard.keyDown("esc");

    assert.equal(this.overlay.option("visible"), true, "overlay doesn't handle keyboard propagated events");
});


QUnit.module("focus policy", {
    beforeEach: function() {
        this.tabEvent = $.Event("keydown", { keyCode: 9 });
        this.shiftTabEvent = $.Event("keydown", { keyCode: 9, shiftKey: true });

        moduleConfig.beforeEach.apply(this, arguments);
    },

    afterEach: function() {
        moduleConfig.afterEach.apply(this, arguments);
    }
});

QUnit.test("elements under overlay with shader have not to get focus by tab", function(assert) {
    var overlay = new Overlay($("<div>").appendTo("#qunit-fixture"), {
            visible: true,
            shading: true,
            contentTemplate: $("#focusableTemplate")
        }),
        $content = $(overlay.content());

    var $firstTabbable = $content.find(".firstTabbable"),
        $lastTabbable = $content.find(".lastTabbable").focus(),
        $outsideTabbable = $content.find(".outsideTabbable");

    $(document).trigger(this.tabEvent);
    assert.equal(document.activeElement, $firstTabbable.get(0), "first item focused on press tab on last item (does not go under overlay)");

    $(document).trigger(this.shiftTabEvent);
    assert.equal(document.activeElement, $lastTabbable.get(0), "last item focused on press tab+shift on first item (does not go under overlay)");

    $outsideTabbable.focus();
    $(document).trigger(this.tabEvent);
    assert.equal(document.activeElement, $firstTabbable.get(0), "first item focused on press tab on last item (does not go under overlay)");
});

QUnit.test("elements under overlay with shader have not to get focus by tab when top overlay has no tabbable elements", function(assert) {
    var overlay1 = new Overlay($("<div>").appendTo("#qunit-fixture"), {
            shading: true,
            contentTemplate: $("#focusableTemplate")
        }),
        overlay2 = new Overlay($("<div>").appendTo("#qunit-fixture"), {
            shading: false,
            contentTemplate: function() { return "test"; }
        }),
        $content = $(overlay1.content());

    overlay1.show();
    overlay2.show();

    var $firstTabbable = $content.find(".firstTabbable");

    $content.find(".lastTabbable").focus();
    $(document).trigger(this.tabEvent);
    assert.equal(document.activeElement, $firstTabbable.get(0), "first item focused on press tab on last item (does not go under overlay)");
});

QUnit.test("elements under overlay with shader have not to get focus by tab after another overlay is hide", function(assert) {
    var overlay = new Overlay($("<div>").appendTo("#qunit-fixture"), {
            visible: true,
            shading: true,
            contentTemplate: $("#focusableTemplate")
        }),
        $content = $(overlay.content());

    new Overlay($("<div>").appendTo("#qunit-fixture"), {
        visible: true,
        shading: true
    }).hide();

    var $firstTabbable = $content.find(".firstTabbable");

    $(document).trigger(this.tabEvent);
    assert.equal(document.activeElement, $firstTabbable.get(0), "first item focused on press tab on last item (does not go under overlay)");
});

QUnit.test("elements on the page have to change focus by tab after overlay dispose", function(assert) {
    var overlay = new Overlay($("<div>").appendTo("#qunit-fixture"), {
        visible: true,
        shading: true
    });

    overlay.$element().remove();

    $(document).trigger(this.tabEvent);

    assert.equal(this.tabEvent.isDefaultPrevented(), false, "default tab behavior should not be prevented after dispose overlay");
});

QUnit.test("elements under top overlay with shader have not to get focus by tab", function(assert) {
    new Overlay($("<div>").appendTo("#qunit-fixture"), {
        visible: true,
        shading: true
    });

    var overlay = new Overlay($("<div>").appendTo("#qunit-fixture"), {
            visible: true,
            shading: true,
            contentTemplate: $("#focusableTemplate")
        }),
        $content = $(overlay.content());

    var $firstTabbable = $content.find(".firstTabbable");

    $firstTabbable.focus();
    $($firstTabbable).trigger(this.tabEvent);
    assert.equal(this.tabEvent.isDefaultPrevented(), false, "default action is not prevented");
});

QUnit.test("tabbable selectors should check only bounds", function(assert) {
    var tabbableSpy = sinon.spy(selectors, "tabbable");
    var overlay = new Overlay($("<div>").appendTo("#qunit-fixture"), {
        visible: true,
        shading: true,
        contentTemplate: $("#focusableTemplate")
    });
    var $content = $(overlay.content());

    $content
        .find(".firstTabbable")
        .focus()
        .trigger(this.tabEvent);

    var $elements = $content.find("*");
    var middleElement = $elements.get(Math.floor($elements.length / 2));

    assert.ok(tabbableSpy.withArgs(0, $elements.get(0)).called, "first element has been checked");
    assert.ok(tabbableSpy.withArgs(0, $elements.last().get(0)).called, "last element has been checked");
    assert.notOk(tabbableSpy.withArgs(0, middleElement).called, "middle element hasn't been checked");
});

QUnit.test("tab target inside of wrapper but outside of content should not be outside", function(assert) {
    var overlay = new Overlay($("<div>").appendTo("#qunit-fixture"), {
            visible: true,
            shading: true,
            contentTemplate: $("#focusableTemplate")
        }),
        $content = $(overlay.content()),
        $wrapper = $content.closest("." + OVERLAY_WRAPPER_CLASS);

    var contentFocusHandler = sinon.spy(),
        $tabbableDiv = $("<div>")
            .attr("tabindex", 0)
            .html("Tabbable div")
            .prependTo($wrapper);

    eventsEngine.on($tabbableDiv, "focusin", contentFocusHandler);
    keyboardMock($tabbableDiv).press("tab");

    assert.equal(contentFocusHandler.callCount, 1, "focus has been triggered once from keyboardMock");
});

QUnit.test("focusin event should not be propagated (T342292)", function(assert) {
    assert.expect(0);

    var overlay = new Overlay($("<div>").appendTo("#qunit-fixture"), {
            visible: true,
            shading: true,
            contentTemplate: $("#focusableTemplate")
        }),
        $content = $(overlay.content());

    $(document).on("focusin.test", function() {
        assert.ok(false, "focusin bubbled");
    });

    $($content).trigger("focusin");

    $(document).off(".test");
});


QUnit.module("scrollable interaction", {
    beforeEach: function() {
        this._originalViewport = viewPort();
        viewPort("#customTargetContainer");
        moduleConfig.beforeEach.apply(this, arguments);
    },

    afterEach: function() {
        viewPort(this._originalViewport);
        moduleConfig.afterEach.apply(this, arguments);
    }
});

QUnit.test("scroll event prevented on overlay shader 1", function(assert) {
    assert.expect(0);

    var $overlay = $("#overlay").dxOverlay({
        shading: true
    });

    $overlay.dxOverlay("option", "visible", true);

    var $content = $overlay.dxOverlay("$content"),
        $shader = $content.closest(".dx-overlay-shader");

    $($shader.parent()).on("dxdrag.TEST", {
        getDirection: function() { return "both"; },
        validate: function() { return true; }
    }, function() {
        assert.ok(false, "scroll should not be fired");
    });

    pointerMock($shader)
        .start()
        .wheel(10);

    $($shader.parent()).off(".TEST");
});

QUnit.test("scroll event should not be prevented if originalEvent is mousemove", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
        shading: true,
        visible: true
    });

    var $content = $overlay.dxOverlay("$content");
    var $shader = $content.closest(".dx-overlay-shader");

    $($shader).on("dxdrag", {
        getDirection: function() { return "both"; },
        validate: function() { return true; }
    }, function(e) {
        if(e.originalEvent.originalEvent.type === "mousemove") {
            assert.equal(e.isDefaultPrevented(), false, "mousemove is not prevented");
            return;
        }
        assert.equal(e.isDefaultPrevented(), true, "touchmove is prevented");
    });

    var event = $.Event("dxdrag", {
        originalEvent: $.Event("dxpointermove", {
            originalEvent: $.Event("mousemove")
        })
    });

    $($shader).trigger(event);

    event = $.Event("dxdrag", {
        originalEvent: $.Event("dxpointermove", {
            originalEvent: $.Event("touchmove")
        })
    });

    $($shader).trigger(event);
});

QUnit.test("scroll event prevented on overlay shader", function(assert) {
    try {
        var $overlay = $($("#overlay").dxOverlay({
                shading: true,
                visible: true
            })),
            $content = $($overlay.dxOverlay("$content"));

        $(document).on("dxpointermove.TEST", function(e) {
            assert.ok(e.isScrollingEvent, "scrolling event set");
        });

        $content
            .trigger({
                type: "dxpointerdown",
                pointers: [null]
            })
            .trigger({
                type: "dxpointermove",
                isScrollingEvent: true,
                pointers: [null]
            });
    } finally {
        $(document).off(".TEST");
    }
});

QUnit.test("scroll event prevented on overlay", function(assert) {
    assert.expect(1);

    var $overlay = $($("#overlay").dxOverlay()),
        $scrollable = $("<div>");

    $overlay.dxOverlay("option", "visible", true);
    var $content = $($overlay.dxOverlay("$content")).append($scrollable);

    $scrollable.dxScrollable({
        useNative: false,
        bounceEnabled: false,
        direction: "vertical",
        inertiaEnabled: false
    });

    var $overlayWrapper = $content.closest(".dx-overlay-wrapper");

    $($overlayWrapper).on("dxdrag.TEST", {
        getDirection: function() { return "both"; },
        validate: function() { return true; }
    }, function(e) {
        assert.ok(e.isDefaultPrevented(), "scroll event prevented");
    });

    $($overlayWrapper.parent()).on("dxdrag.TEST", {
        getDirection: function() { return "both"; },
        validate: function() { return true; }
    }, function() {
        assert.ok(false, "scroll should not be fired");
    });

    pointerMock($scrollable.find(".dx-scrollable-container"))
        .start()
        .wheel(10);

    $overlayWrapper
        .off(".TEST")
        .parent()
        .off(".TEST");
});

QUnit.test("scroll event does not prevent gestures", function(assert) {
    var $gestureCover = $(".dx-gesture-cover");
    var originalPointerEvents = $gestureCover.css("pointerEvents");

    var $overlay = $("#overlay").dxOverlay({
        shading: true,
        visible: true
    });

    var $content = $overlay.dxOverlay("$content"),
        $shader = $content.closest(".dx-overlay-shader");

    $($shader).on({
        "dxdragstart": function() {
            assert.equal($gestureCover.css("pointerEvents"), originalPointerEvents, "selection is enabled");
        },
        "dxdragend": function() {
            assert.equal($gestureCover.css("pointerEvents"), originalPointerEvents, "selection is enabled");
        }
    });

    pointerMock($shader)
        .start()
        .wheel(10);
});

QUnit.test("scroll event should not prevent text selection in content", function(assert) {
    assert.expect(1);

    var $overlay = $("#overlay").dxOverlay({
        shading: true,
        visible: true
    });

    var $content = $overlay.dxOverlay("$content"),
        $shader = $content.closest(".dx-overlay-shader");

    var e = pointerMock($shader)
        .start()
        .dragStart()
        .drag(10, 0)
        .lastEvent();

    assert.ok(e._cancelPreventDefault, "overlay should set special flag for prevent default cancelling");
});


QUnit.module("specifying base z-index", moduleConfig);

QUnit.test("overlay should render with correct z-index by default", function(assert) {
    var $overlay = $("#overlay").dxOverlay({ visible: true }),
        overlay = $overlay.dxOverlay("instance"),
        $content = $(overlay.content()),
        $wrapper = $content.parent();

    assert.equal($content.css("zIndex"), 1501, "z-index for content is correct");
    assert.equal($wrapper.css("zIndex"), 1501, "z-index for wrapper is correct");
});

QUnit.test("base z-index should be changed using the static method", function(assert) {
    Overlay.baseZIndex(10000);

    var $overlay = $("#overlay").dxOverlay({
            visible: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $content = $(overlay.content()),
        $wrapper = $content.parent();

    assert.equal($content.css("zIndex"), 10001, "z-index for content is correct");
    assert.equal($wrapper.css("zIndex"), 10001, "z-index for wrapper is correct");
});
