"use strict";

var $ = require("jquery"),
    fx = require("animation/fx"),
    translator = require("animation/translator"),
    hideTopOverlayCallback = require("mobile/hide_top_overlay").hideCallback,
    resizeCallbacks = require("core/utils/resize_callbacks"),
    config = require("core/config"),
    typeUtils = require("core/utils/type"),
    animation = require("ui/drawer").animation,
    pointerMock = require("../../helpers/pointerMock.js");

require("common.css!");
require("ui/drawer");

var DRAWER_CLASS = "dx-drawer",
    DRAWER_MENU_CONTENT_CLASS = "dx-drawer-menu-content",
    DRAWER_CONTENT_CLASS = "dx-drawer-content",
    DRAWER_SHADER_CLASS = "dx-drawer-shader";

var position = function($element) {
    return $element.position().left;
};

var mockFxAnimate = function(animations, type, output) {
    animations[type] = function($element, position, duration, endAction) {
        position = position || 0;

        output.push({
            $element: $element,
            type: type,
            start: translator.locate($element).left,
            duration: duration,
            end: position
        });

        translator.move($element, { left: position });

        if(endAction) {
            endAction();
        }
    };
};

var animationCapturing = {
    start: function() {
        this._capturedAnimations = [];
        this._animation = $.extend({}, animation);

        mockFxAnimate(animation, "moveTo", this._capturedAnimations);

        return this._capturedAnimations;
    },
    teardown: function() {
        $.extend(animation, this._animation);

        delete this._capturedAnimations;
        delete this._animations;
    }
};


QUnit.testStart(function() {
    var markup = '\
    <style>\
        .dx-drawer-menu-content {\
                width: 200px;\
        }\
    </style>\
    \
    <div id="drawer">\
        Test Content\
    </div>\
    <div id="drawerContainer" style="width: 100px">\
        <div id="drawer2"></div>\
    </div>\
        <div id="contentTemplate">\
        <div data-options="dxTemplate: { name: \'customMenu\' }">\
            Test Menu Template\
        </div>\
            <div data-options="dxTemplate: { name: \'customContent\' }">\
            Test Content Template\
        </div>\
    </div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("api");

QUnit.test("defaults", function(assert) {
    var $element = $("#drawer").dxDrawer({}),
        instance = $element.dxDrawer("instance");

    assert.equal(instance.option("showMode"), "slide", "showMode is OK");
    assert.equal(instance.option("mode"), "push", "mode is OK");
});

QUnit.test("menuContent() function", function(assert) {
    var $element = $("#drawer").dxDrawer({}),
        instance = $element.dxDrawer("instance"),
        $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);
    assert.equal(typeUtils.isRenderer(instance.menuContent()), !!config().useJQuery, "menu element");
    assert.equal($menu.get(0), $(instance.menuContent()).get(0), "menuContent function return correct DOMNode");
});

QUnit.test("content() function", function(assert) {
    var $element = $("#drawer").dxDrawer({}),
        instance = $element.dxDrawer("instance"),
        $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.get(0), $(instance.content()).get(0), "content function return correct DOMNode");
});

QUnit.test("showMenu and hideMenu functions", function(assert) {
    var $element = $("#drawer").dxDrawer({}),
        instance = $element.dxDrawer("instance");

    instance.showMenu();
    assert.equal(instance.option("menuVisible"), true, "menu was shown");

    instance.hideMenu();
    assert.equal(instance.option("menuVisible"), false, "menu was hidden");
});

QUnit.test("toggleMenuVisibility function", function(assert) {
    var $element = $("#drawer").dxDrawer({}),
        instance = $element.dxDrawer("instance"),
        menuVisible = instance.option("menuVisible");

    instance.toggleMenuVisibility();
    assert.equal(instance.option("menuVisible"), !menuVisible, "menu was shown");

    instance.toggleMenuVisibility();
    assert.equal(instance.option("menuVisible"), menuVisible, "menu was hidden");
});

QUnit.test("subscribe on toggleMenuVisibility function should fired at the end of animation", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: false
        }),
        instance = $element.dxDrawer("instance"),
        count = 0,
        done = assert.async();

    instance.toggleMenuVisibility().done(function() {
        count++;
        assert.equal(count, 1, "callback not fired at animation start");
        done();
    });

    assert.equal(count, 0, "callback not fired at animation start");
});


QUnit.module("navigation");

QUnit.test("content container should have correct position if menu isn't visible", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: false
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content());

    assert.equal(position($content), 0, "container rendered at correct position");
});

QUnit.test("content container should have correct position if menu is visible", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        $menu = $(instance.menuContent());

    assert.equal(position($content), $menu.width(), "container rendered at correct position");
});

QUnit.test("content container should have correct position if menu is lager than element", function(assert) {
    var $element = $("#drawer2").dxDrawer({
            width: "100%",
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content());

    assert.equal(position($content), $element.width() - instance.option("contentOffset"), "container rendered at correct position");
});

QUnit.test("content should not overlap menu", function(assert) {
    var $element = $("#drawer2").dxDrawer({
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance"),
        $menu = $(instance.menuContent());

    assert.equal(parseInt($menu.css("max-width")), $element.width() - instance.option("contentOffset"), "menu isn't overlapped by content");

    instance.option("width", 200);
    assert.equal(parseInt($menu.css("max-width")), $element.width() - instance.option("contentOffset"), "menu isn't overlapped by content");
});

QUnit.test("content container should have correct position after resize", function(assert) {
    var $element = $("#drawer2").dxDrawer({
            width: "100%",
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        elementWidth = $element.width();

    $("#drawerContainer").width(elementWidth * 2);
    resizeCallbacks.fire();

    assert.equal(position($content), $(instance.menuContent()).width(), "container rendered at correct position");
});

QUnit.test("content container should have correct position if it is rendered in invisible container", function(assert) {
    var $container = $("#drawerContainer"),
        $element = $("#drawer2");

    $container.detach();

    var instance = $element.dxDrawer({
            width: "100%",
            menuVisible: true
        }).dxDrawer("instance"),
        $content = $(instance.content());

    $container.appendTo("#qunit-fixture");
    $element.trigger("dxshown");

    assert.equal(position($content), $element.width() - instance.option("contentOffset"), "container rendered at correct position");
});

QUnit.test("menu should be hidden after back button click", function(assert) {
    var instance = $("#drawer").dxDrawer({
        menuVisible: true
    }).dxDrawer("instance");

    hideTopOverlayCallback.fire();
    assert.equal(instance.option("menuVisible"), false, "hidden after back button event");
});

QUnit.test("handle back button should be removed on dispose", function(assert) {
    var $element = $("#drawer").dxDrawer({
        menuVisible: true
    });

    $element.remove();
    assert.ok(!hideTopOverlayCallback.hasCallback());
});

QUnit.test("menu should not handle back button click if it isn't visible", function(assert) {
    $("#drawer").dxDrawer({
        menuVisible: false
    });

    assert.ok(!hideTopOverlayCallback.hasCallback());
});


QUnit.module("interaction via swipe");

QUnit.test("content container should be moved by swipe", function(assert) {
    fx.off = true;

    var $element = $("#drawer").dxDrawer({
            menuVisible: false
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        $menu = $(instance.menuContent()),
        pointer = pointerMock($content).start();

    pointer.swipeStart().swipe(0.1);
    assert.equal(position($content), $menu.width() / 10, "container moved");

    pointer.swipeEnd(1).swipe(-0.5);
    assert.equal(position($content), $menu.width() * 0.5, "container moved");
    fx.off = false;
});

QUnit.test("content should be moved by swipe with inverted position", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: false,
            menuPosition: 'inverted'
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        $menu = $(instance.menuContent()),
        pointer = pointerMock($content).start();

    pointer.swipeStart().swipe(-0.1);
    assert.equal(position($content), -$menu.width() / 10, "container moved");
});

QUnit.test("content container should not be moved out of menu", function(assert) {
    var $element = $("#drawer").dxDrawer({}),
        instance = $element.dxDrawer("instance"),
        pointer = pointerMock($(instance.content())).start();

    var lastEvent = pointer.swipeStart().lastEvent();
    assert.strictEqual(lastEvent.maxLeftOffset, 0, "container will not move out of menu");
    assert.strictEqual(lastEvent.maxRightOffset, 1, "container will not move out of menu");

    instance.option("menuVisible", true);

    lastEvent = pointer.swipeEnd().swipeStart().lastEvent();
    assert.strictEqual(lastEvent.maxLeftOffset, 1, "container will not move out of menu");
    assert.strictEqual(lastEvent.maxRightOffset, 0, "container will not move out of menu");
});

QUnit.test("swipeEnabled option", function(assert) {
    var $element = $("#drawer").dxDrawer({
            swipeEnabled: false,
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        pointer = pointerMock($content).start();

    var startPosition = position($content);

    pointer.swipeStart().swipe(-0.1);
    assert.equal(position($content), startPosition, "position won't changed");
});

QUnit.test("swipeEnabled option dynamic change", function(assert) {
    var $element = $("#drawer").dxDrawer({
            swipeEnabled: true,
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        pointer = pointerMock($content).start();

    var startPosition = position($content);

    instance.option("swipeEnabled", false);
    pointer.swipeStart().swipe(-0.1);
    assert.equal(position($content), startPosition, "position won't changed");
});

QUnit.test("content container should not be moved in design mode", function(assert) {
    config({ designMode: true });

    try {
        var $element = $("#drawer").dxDrawer({
                swipeEnabled: true,
                menuVisible: true
            }),
            instance = $element.dxDrawer("instance"),
            $content = $(instance.content()),
            pointer = pointerMock($content).start();

        var startPosition = position($content);
        pointer.swipeStart().swipe(-0.1);
        assert.equal(position($content), startPosition, "content won't moved");

    } finally {
        config({ designMode: false });
    }
});


QUnit.module("animation", {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();
    },
    afterEach: function() {
        animationCapturing.teardown();
    }
});

QUnit.test("showing menu should be animated", function(assert) {
    var $element = $("#drawer").dxDrawer({}),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        $menu = $(instance.menuContent()),
        pointer = pointerMock($content).start();

    pointer.swipeStart().swipe(0.1).swipeEnd(1);

    assert.equal(this.capturedAnimations[0].$element.get(0), $content.get(0), "content was animated");
    assert.equal(this.capturedAnimations[0].start, $menu.width() / 10, "correct start position");
    assert.equal(this.capturedAnimations[0].end, $menu.width(), "correct end position");
});

QUnit.test("animation should be stopped after swipe start", function(assert) {
    var $element = $("#drawer").dxDrawer({}),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        pointer = pointerMock($content).start();

    animationCapturing.teardown();
    pointer.swipeStart().swipe(0.1).swipeEnd(1).swipeStart();

    assert.ok(!fx.isAnimating($content), "animation was stopped");
});

QUnit.test("hiding menu should be animated", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        $menu = $(instance.menuContent()),
        pointer = pointerMock($content).start();

    pointer.swipeStart().swipe(-0.5).swipeEnd(-1);

    assert.equal(this.capturedAnimations[0].$element.get(0), $content.get(0), "content was animated");
    assert.equal(this.capturedAnimations[0].start, $menu.width() * 0.5, "correct start position");
    assert.equal(this.capturedAnimations[0].end, 0, "correct end position");
});


QUnit.module("shader");

QUnit.test("shader should be visible if menu is opened", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: true
        }),
        $shader = $element.find("." + DRAWER_SHADER_CLASS);

    assert.ok($shader.is(":visible"), "shader is visible");
});

QUnit.test("shader should not be visible if menu is closed", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: false
        }),
        $shader = $element.find("." + DRAWER_SHADER_CLASS);

    assert.ok($shader.is(":hidden"), "shader is visible");
});

QUnit.test("click on shader should not close menu", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance"),
        $shader = $element.find("." + DRAWER_SHADER_CLASS);

    $shader.trigger("dxclick");
    assert.ok(!instance.option("menuVisible"), "menu was closed");
});

QUnit.test("shader should be visible during swipe", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        $shader = $element.find("." + DRAWER_SHADER_CLASS),
        pointer = pointerMock($content).start();

    pointer.swipeStart();
    assert.ok($shader.is(":visible"), "shader won't hidden");
});

QUnit.test("shader should be visible during animation", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: false
        }),
        instance = $element.dxDrawer("instance"),
        $shader = $element.find("." + DRAWER_SHADER_CLASS);

    instance.showMenu();
    assert.ok($shader.is(":visible"), "shader is visible during animation");
});

QUnit.test("shader should have correct position", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        $shader = $element.find("." + DRAWER_SHADER_CLASS);

    assert.equal($shader.offset().left, $content.offset().left, "shader has correct position");
});

QUnit.test("shader should have correct position after widget resize", function(assert) {
    var $element = $("#drawer2").dxDrawer({
            width: "100%",
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        $shader = $element.find("." + DRAWER_SHADER_CLASS),
        menuWidth = $(instance.menuContent()).width();

    $("#drawerContainer").width(menuWidth * 2);
    resizeCallbacks.fire();

    assert.equal($shader.offset().left, $content.offset().left, "shader has correct position");
});

QUnit.module("push mode");

QUnit.test("minWidth should be rendered correctly in push mode", function(assert) {
    fx.off = true;

    var $element = $("#drawer").dxDrawer({
            minWidth: 50,
            menuVisible: true,
            mode: "push"
        }),
        instance = $element.dxDrawer("instance"),
        $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 200, "content has correct left when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 50, "content has correct left when minWidth is set");

    fx.off = false;
});

QUnit.module("persistent mode");

QUnit.test("minWidth should be rendered correctly in persistent mode, shrink", function(assert) {
    fx.off = true;

    var $element = $("#drawer").dxDrawer({
            minWidth: 50,
            menuVisible: false,
            showMode: "shrink",
            contentTemplate: 'contentTemplate',
            mode: "persistent"
        }),
        instance = $element.dxDrawer("instance"),
        $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0),
        $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.css("padding-left"), "50px", "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 50, "menu has correct width when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.css("padding-left"), "200px", "content has correct left when minWidth is set");
    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    fx.off = false;
});

QUnit.test("minWidth should be rendered correctly in persistent mode, slide", function(assert) {
    fx.off = true;

    var $element = $("#drawer").dxDrawer({
            minWidth: 50,
            menuVisible: false,
            showMode: "slide",
            mode: "persistent"
        }),
        instance = $element.dxDrawer("instance"),
        $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0),
        $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, -150, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    fx.off = false;
});

QUnit.module("temporary mode");

QUnit.test("minWidth should be rendered correctly in temporary mode, shrink", function(assert) {
    fx.off = true;

    var $element = $("#drawer").dxDrawer({
            minWidth: 50,
            menuVisible: false,
            showMode: "shrink",
            mode: "temporary"
        }),
        instance = $element.dxDrawer("instance"),
        $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0),
        $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 50, "menu has correct width when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    fx.off = false;
});

QUnit.test("minWidth should be rendered correctly in temporary mode, slide", function(assert) {
    fx.off = true;

    var $element = $("#drawer").dxDrawer({
            minWidth: 50,
            menuVisible: false,
            showMode: "slide",
            mode: "temporary"
        }),
        instance = $element.dxDrawer("instance"),
        $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0),
        $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, -150, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    fx.off = false;
});

QUnit.module("rtl");

QUnit.test("content should have correct position if menu is visible in rtl mode", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: true,
            rtlEnabled: true
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        $menu = $(instance.menuContent());

    assert.equal(position($content), -$menu.width(), "container rendered at correct position");
});

QUnit.test("content should be moved by swipe in rtl", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: false,
            rtlEnabled: true
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        $menu = $(instance.menuContent()),
        pointer = pointerMock($content).start();

    pointer.swipeStart().swipe(-0.1);
    assert.equal(position($content), -$menu.width() / 10, "container moved");
});

QUnit.test("content should be moved by swipe in rtl with inverted position", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: false,
            rtlEnabled: true,
            menuPosition: 'inverted'
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        $menu = $(instance.menuContent()),
        pointer = pointerMock($content).start();

    pointer.swipeStart().swipe(0.1);
    assert.equal(position($content), $menu.width() / 10, "container moved");
});

QUnit.test("menu position classes in rtl", function(assert) {
    var $element = $("#drawer").dxDrawer({
            rtlEnabled: true,
            menuPosition: "normal"
        }),
        instance = $element.dxDrawer("instance"),
        $menu = $(instance.menuContent());

    assert.ok($menu.hasClass(DRAWER_CLASS + "-right"), "menu has class for right position");
    assert.notOk($menu.hasClass(DRAWER_CLASS + "-left"), "menu has not class for left position");

    instance.option("menuPosition", "inverted");
    assert.ok($menu.hasClass(DRAWER_CLASS + "-left"), "menu has class for left position");
    assert.notOk($menu.hasClass(DRAWER_CLASS + "-right"), "menu has not class for right position");
});

QUnit.test("content should not be moved out of menu", function(assert) {
    var $element = $("#drawer").dxDrawer({
            rtlEnabled: true
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        pointer = pointerMock($content).start();

    var lastEvent = pointer.swipeStart().lastEvent();
    assert.strictEqual(lastEvent.maxLeftOffset, 1, "container will not move out of menu");
    assert.strictEqual(lastEvent.maxRightOffset, 0, "container will not move out of menu");

    instance.option("menuVisible", true);

    lastEvent = pointer.swipeEnd().swipeStart().lastEvent();
    assert.strictEqual(lastEvent.maxLeftOffset, 0, "container will not move out of menu");
    assert.strictEqual(lastEvent.maxRightOffset, 1, "container will not move out of menu");
});
