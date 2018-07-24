"use strict";

var $ = require("jquery"),
    fx = require("animation/fx"),
    translator = require("animation/translator"),
    hideTopOverlayCallback = require("mobile/hide_top_overlay").hideCallback,
    resizeCallbacks = require("core/utils/resize_callbacks"),
    config = require("core/config"),
    typeUtils = require("core/utils/type"),
    animation = require("ui/drawer/ui.drawer.strategy").animation;

require("common.css!");
require("ui/drawer");

var DRAWER_MENU_CONTENT_CLASS = "dx-drawer-menu-content",
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
            menuVisible: true,
            maxWidth: 50
        }).dxDrawer("instance"),
        $content = $(instance.content());

    $container.appendTo("#qunit-fixture");
    $element.trigger("dxshown");

    assert.equal(position($content), 50, "container rendered at correct position");
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

QUnit.module("animation", {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();
    },
    afterEach: function() {
        animationCapturing.teardown();
    }
});

QUnit.test("animationEnabled option test", function(assert) {
    fx.off = false;

    var origFX = fx.animate,
        animated = false;

    fx.animate = function() {
        animated = true;
        return $.Deferred().resolve().promise();
    };

    try {
        var $drawer = $("#drawer").dxDrawer({
                menuVisible: true,
                animationEnabled: false
            }),
            drawer = $drawer.dxDrawer("instance");

        drawer.option("menuVisible", false);

        assert.equal(animated, false, "animation was not present");

        drawer.option("animationEnabled", true);
        drawer.option("menuVisible", true);

        assert.equal(animated, true, "animation present");
    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("animationDuration option test", function(assert) {
    var $drawer = $("#drawer").dxDrawer({
            menuVisible: false,
            animationEnabled: true,
            mode: "push"
        }),
        drawer = $drawer.dxDrawer("instance");


    drawer.option("animationDuration", 300);

    drawer.toggleMenuVisibility();
    assert.equal(this.capturedAnimations[0].duration, 300, "duration is correct");
    drawer.option("animationDuration", 10000);
    drawer.toggleMenuVisibility();
    assert.equal(this.capturedAnimations[1].duration, 10000, "duration is correct");
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

QUnit.test("maxWidth should be rendered correctly in push mode", function(assert) {
    fx.off = true;

    var $element = $("#drawer").dxDrawer({
            maxWidth: 300,
            menuVisible: true,
            mode: "push"
        }),
        instance = $element.dxDrawer("instance"),
        $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 300, "content has correct left when maxWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");

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

QUnit.test("maxWidth should be rendered correctly in persistent mode, shrink", function(assert) {
    fx.off = true;

    var $element = $("#drawer").dxDrawer({
            maxWidth: 100,
            menuVisible: false,
            showMode: "shrink",
            contentTemplate: 'contentTemplate',
            mode: "persistent"
        }),
        instance = $element.dxDrawer("instance"),
        $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0),
        $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.css("padding-left"), "0px", "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 0, "menu has correct width when maxWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.css("padding-left"), "100px", "content has correct left when maxWidth is set");
    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 100, "menu has correct width when maxWidth is set");

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

QUnit.test("maxWidth should be rendered correctly in persistent mode, slide", function(assert) {
    fx.off = true;

    var $element = $("#drawer").dxDrawer({
            maxWidth: 100,
            menuVisible: false,
            showMode: "slide",
            mode: "persistent"
        }),
        instance = $element.dxDrawer("instance"),
        $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0),
        $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, -200, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when maxWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, -100, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when maxWidth is set");

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

QUnit.test("maxWidth should be rendered correctly in temporary mode, shrink", function(assert) {
    fx.off = true;

    var $element = $("#drawer").dxDrawer({
            maxWidth: 100,
            menuVisible: false,
            showMode: "shrink",
            mode: "temporary"
        }),
        instance = $element.dxDrawer("instance"),
        $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0),
        $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 0, "menu has correct width when maxWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 100, "menu has correct width when maxWidth is set");

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

QUnit.test("maxWidth should be rendered correctly in temporary mode, slide", function(assert) {
    fx.off = true;

    var $element = $("#drawer").dxDrawer({
            maxWidth: 100,
            menuVisible: false,
            showMode: "slide",
            mode: "temporary"
        }),
        instance = $element.dxDrawer("instance"),
        $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0),
        $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, -200, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when maxWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, -100, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when maxWidth is set");

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

