"use strict";

import $ from "jquery";
import fx from "animation/fx";
import translator from "animation/translator";
import { hideCallback } from "mobile/hide_top_overlay";
import resizeCallbacks from "core/utils/resize_callbacks";
import config from "core/config";
import typeUtils from "core/utils/type";
import { animation } from "ui/drawer/ui.drawer.rendering.strategy";

import "common.css!";
import "ui/drawer";

const DRAWER_MENU_CONTENT_CLASS = "dx-drawer-menu-content";
const DRAWER_CONTENT_CLASS = "dx-drawer-content";
const DRAWER_SHADER_CLASS = "dx-drawer-shader";

const position = $element => $element.position().left;

const mockFxAnimate = (animations, type, output) => {
    animations[type] = ($element, position, duration, direction, endAction) => {
        position = position || 0;

        output.push({
            $element,
            type,
            start: translator.locate($element).left,
            duration,
            end: position
        });

        translator.move($element, { left: position });

        if(endAction) {
            endAction();
        }
    };
};

const animationCapturing = {
    start() {
        this._capturedAnimations = [];
        this._animation = $.extend({}, animation);

        mockFxAnimate(animation, "moveTo", this._capturedAnimations);

        return this._capturedAnimations;
    },
    teardown() {
        $.extend(animation, this._animation);

        delete this._capturedAnimations;
        delete this._animations;
    }
};


QUnit.testStart(() => {
    const markup = '\
    <style>\
        .dx-drawer-menu-content {\
                width: 200px;\
        }\
    </style>\
    \
    <div id="drawer">\
        <div id="content">Test Content</div>\
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

QUnit.test("defaults", assert => {
    const $element = $("#drawer").dxDrawer({});
    const instance = $element.dxDrawer("instance");

    assert.equal(instance.option("showMode"), "slide", "showMode is OK");
    assert.equal(instance.option("mode"), "push", "mode is OK");
});

QUnit.test("menuContent() function", assert => {
    const $element = $("#drawer").dxDrawer({});
    const instance = $element.dxDrawer("instance");
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);
    assert.equal(typeUtils.isRenderer(instance.menuContent()), !!config().useJQuery, "menu element");
    assert.equal($menu.get(0), $(instance.menuContent()).get(0), "menuContent function return correct DOMNode");
});

QUnit.test("drawer preserve content", assert => {
    const $content = $("#drawer #content"),
        $element = $("#drawer").dxDrawer({});

    assert.equal($content[0], $element.find("#content")[0]);
});

QUnit.test("content() function", assert => {
    const $element = $("#drawer").dxDrawer({});
    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.get(0), $(instance.content()).get(0), "content function return correct DOMNode");
});

QUnit.test("showMenu and hideMenu functions", assert => {
    const $element = $("#drawer").dxDrawer({});
    const instance = $element.dxDrawer("instance");

    instance.showMenu();
    assert.equal(instance.option("menuVisible"), true, "menu was shown");

    instance.hideMenu();
    assert.equal(instance.option("menuVisible"), false, "menu was hidden");
});

QUnit.test("toggleMenuVisibility function", assert => {
    const $element = $("#drawer").dxDrawer({});
    const instance = $element.dxDrawer("instance");
    const menuVisible = instance.option("menuVisible");

    instance.toggleMenuVisibility();
    assert.equal(instance.option("menuVisible"), !menuVisible, "menu was shown");

    instance.toggleMenuVisibility();
    assert.equal(instance.option("menuVisible"), menuVisible, "menu was hidden");
});

QUnit.test("subscribe on toggleMenuVisibility function should fired at the end of animation", assert => {
    const $element = $("#drawer").dxDrawer({
        menuVisible: false
    });

    const instance = $element.dxDrawer("instance");
    let count = 0;
    const done = assert.async();

    instance.toggleMenuVisibility().done(() => {
        count++;
        assert.equal(count, 1, "callback not fired at animation start");
        done();
    });

    assert.equal(count, 0, "callback not fired at animation start");
});


QUnit.module("navigation");

QUnit.test("content container should have correct position if menu isn't visible", assert => {
    const $element = $("#drawer").dxDrawer({
        menuVisible: false
    });

    const instance = $element.dxDrawer("instance");
    const $content = $(instance.content());

    assert.equal(position($content), 0, "container rendered at correct position");
});

QUnit.test("content container should have correct position if menu is visible", assert => {
    const $element = $("#drawer").dxDrawer({
        menuVisible: true
    });

    const instance = $element.dxDrawer("instance");
    const $content = $(instance.content());
    const $menu = $(instance.menuContent());

    assert.equal(position($content), $menu.width(), "container rendered at correct position");
});

QUnit.test("content container should have correct position after resize", assert => {
    const $element = $("#drawer2").dxDrawer({
        width: "100%",
        menuVisible: true
    });

    const instance = $element.dxDrawer("instance");
    const $content = $(instance.content());
    const elementWidth = $element.width();

    $("#drawerContainer").width(elementWidth * 2);
    resizeCallbacks.fire();

    assert.equal(position($content), $(instance.menuContent()).width(), "container rendered at correct position");
});

QUnit.test("content container should have correct position if it is rendered in invisible container", assert => {
    const $container = $("#drawerContainer");
    const $element = $("#drawer2");

    $container.detach();

    const instance = $element.dxDrawer({
        width: "100%",
        menuVisible: true,
        maxWidth: 50
    }).dxDrawer("instance");

    const $content = $(instance.content());

    $container.appendTo("#qunit-fixture");
    $element.trigger("dxshown");

    assert.equal(position($content), 50, "container rendered at correct position");
});

QUnit.test("menu should be hidden after back button click", assert => {
    const instance = $("#drawer").dxDrawer({
        menuVisible: true
    }).dxDrawer("instance");

    hideCallback.fire();
    assert.equal(instance.option("menuVisible"), false, "hidden after back button event");
});

QUnit.test("handle back button should be removed on dispose", assert => {
    const $element = $("#drawer").dxDrawer({
        menuVisible: true
    });

    $element.remove();
    assert.ok(!hideCallback.hasCallback());
});

QUnit.test("menu should not handle back button click if it isn't visible", assert => {
    $("#drawer").dxDrawer({
        menuVisible: false
    });

    assert.ok(!hideCallback.hasCallback());
});

QUnit.module("animation", {
    beforeEach() {
        this.capturedAnimations = animationCapturing.start();
    },
    afterEach() {
        animationCapturing.teardown();
    }
});

QUnit.test("animationEnabled option test", assert => {
    fx.off = false;

    const origFX = fx.animate;
    let animated = false;

    fx.animate = () => {
        animated = true;
        return $.Deferred().resolve().promise();
    };

    try {
        const $drawer = $("#drawer").dxDrawer({
            menuVisible: true,
            animationEnabled: false
        });

        const drawer = $drawer.dxDrawer("instance");

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
    const $drawer = $("#drawer").dxDrawer({
        menuVisible: false,
        animationEnabled: true,
        mode: "push"
    });

    const drawer = $drawer.dxDrawer("instance");


    drawer.option("animationDuration", 300);

    drawer.toggleMenuVisibility();
    assert.equal(this.capturedAnimations[0].duration, 300, "duration is correct");
    drawer.option("animationDuration", 10000);
    drawer.toggleMenuVisibility();
    assert.equal(this.capturedAnimations[1].duration, 10000, "duration is correct");
});

QUnit.module("shader");

QUnit.test("shader should be visible if menu is opened", assert => {
    const $element = $("#drawer").dxDrawer({
        menuVisible: true
    });

    const $shader = $element.find("." + DRAWER_SHADER_CLASS);

    assert.ok($shader.is(":visible"), "shader is visible");
});

QUnit.test("shader should not be visible if menu is closed", assert => {
    const $element = $("#drawer").dxDrawer({
        menuVisible: false
    });

    const $shader = $element.find("." + DRAWER_SHADER_CLASS);

    assert.ok($shader.is(":hidden"), "shader is visible");
});

QUnit.test("click on shader should not close menu", assert => {
    const $element = $("#drawer").dxDrawer({
        menuVisible: true
    });

    const instance = $element.dxDrawer("instance");
    const $shader = $element.find("." + DRAWER_SHADER_CLASS);

    $shader.trigger("dxclick");
    assert.ok(!instance.option("menuVisible"), "menu was closed");
});

QUnit.test("shader should be visible during animation", assert => {
    const $element = $("#drawer").dxDrawer({
        menuVisible: false
    });

    const instance = $element.dxDrawer("instance");
    const $shader = $element.find("." + DRAWER_SHADER_CLASS);

    instance.showMenu();
    assert.ok($shader.is(":visible"), "shader is visible during animation");
});

QUnit.test("shader should have correct position", assert => {
    const $element = $("#drawer").dxDrawer({
        menuVisible: true
    });

    const instance = $element.dxDrawer("instance");
    const $content = $(instance.content());
    const $shader = $element.find("." + DRAWER_SHADER_CLASS);

    assert.equal($shader.offset().left, $content.offset().left, "shader has correct position");
});

QUnit.test("shader should have correct position after widget resize", assert => {
    const $element = $("#drawer2").dxDrawer({
        width: "100%",
        menuVisible: true
    });

    const instance = $element.dxDrawer("instance");
    const $content = $(instance.content());
    const $shader = $element.find("." + DRAWER_SHADER_CLASS);
    const menuWidth = $(instance.menuContent()).width();

    $("#drawerContainer").width(menuWidth * 2);
    resizeCallbacks.fire();

    assert.equal($shader.offset().left, $content.offset().left, "shader has correct position");
});

QUnit.module("push mode");

QUnit.test("minWidth should be rendered correctly in push mode", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minWidth: 50,
        menuVisible: true,
        mode: "push"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 200, "content has correct left when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 50, "content has correct left when minWidth is set");

    fx.off = false;
});

QUnit.test("maxWidth should be rendered correctly in push mode", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxWidth: 300,
        menuVisible: true,
        mode: "push"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 300, "content has correct left when maxWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");

    fx.off = false;
});

QUnit.test("Drawer should be rendered correctly in push mode, right menu position", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        menuVisible: true,
        menuPosition: "right",
        mode: "push"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, -200, "content has correct left when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");

    fx.off = false;
});

QUnit.test("minWidth should be rendered correctly in push mode, right menu position", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minWidth: 50,
        menuPosition: "right",
        menuVisible: true,
        mode: "push"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, -200, "content has correct left when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, -50, "content has correct left when minWidth is set");

    fx.off = false;
});

QUnit.test("maxWidth should be rendered correctly in push mode, right menu position", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxWidth: 300,
        menuPosition: "right",
        menuVisible: true,
        mode: "push"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, -300, "content has correct left when maxWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");

    fx.off = false;
});

QUnit.module("persistent mode");

QUnit.test("minWidth should be rendered correctly in persistent mode, shrink", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minWidth: 50,
        menuVisible: false,
        showMode: "shrink",
        contentTemplate: 'contentTemplate',
        mode: "persistent"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

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

QUnit.test("minWidth should be rendered correctly in persistent mode, right menu position, shrink", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minWidth: 50,
        menuVisible: false,
        menuPosition: "right",
        showMode: "shrink",
        contentTemplate: 'contentTemplate',
        mode: "persistent"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.css("padding-right"), "50px", "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 950, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 50, "menu has correct width when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.css("padding-right"), "200px", "content has correct left when minWidth is set");
    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 800, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    fx.off = false;
});

QUnit.test("maxWidth should be rendered correctly in persistent mode, shrink", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxWidth: 100,
        menuVisible: false,
        showMode: "shrink",
        contentTemplate: 'contentTemplate',
        mode: "persistent"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

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

QUnit.test("maxWidth should be rendered correctly in persistent mode, right menu position, shrink", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxWidth: 100,
        menuVisible: false,
        showMode: "shrink",
        menuPosition: "right",
        contentTemplate: 'contentTemplate',
        mode: "persistent"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.css("padding-right"), "0px", "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, 1000, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 0, "menu has correct width when maxWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.css("padding-right"), "100px", "content has correct left when maxWidth is set");
    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, 900, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 100, "menu has correct width when maxWidth is set");

    fx.off = false;
});

QUnit.test("minWidth should be rendered correctly in persistent mode, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minWidth: 50,
        menuVisible: false,
        showMode: "slide",
        mode: "persistent"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, -150, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    fx.off = false;
});

QUnit.test("minWidth should be rendered correctly in persistent mode, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minWidth: 50,
        menuVisible: false,
        showMode: "slide",
        mode: "persistent"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, -150, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    fx.off = false;
});

QUnit.test("maxWidth should be rendered correctly in persistent mode, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxWidth: 100,
        menuVisible: false,
        showMode: "slide",
        mode: "persistent"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, -200, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when maxWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, -100, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when maxWidth is set");

    fx.off = false;
});

QUnit.test("minWidth should be rendered correctly in persistent mode, right menu position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minWidth: 50,
        menuVisible: false,
        menuPosition: "right",
        showMode: "slide",
        mode: "persistent"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 950, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 800, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    fx.off = false;
});

QUnit.test("maxWidth should be rendered correctly in persistent mode, right menu position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxWidth: 100,
        menuVisible: false,
        menuPosition: "right",
        showMode: "slide",
        mode: "persistent"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, 1000, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when maxWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, 900, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when maxWidth is set");

    fx.off = false;
});

QUnit.module("temporary mode");

QUnit.test("minWidth should be rendered correctly in temporary mode, shrink", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minWidth: 50,
        menuVisible: false,
        showMode: "shrink",
        mode: "temporary"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 50, "menu has correct width when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    fx.off = false;
});

QUnit.test("maxWidth should be rendered correctly in temporary mode, shrink", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxWidth: 100,
        menuVisible: false,
        showMode: "shrink",
        mode: "temporary"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 0, "menu has correct width when maxWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 100, "menu has correct width when maxWidth is set");

    fx.off = false;
});

QUnit.test("minWidth should be rendered correctly in temporary mode, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minWidth: 50,
        menuVisible: false,
        showMode: "slide",
        mode: "temporary"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, -150, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 0, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    fx.off = false;
});

QUnit.test("maxWidth should be rendered correctly in temporary mode, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxWidth: 100,
        menuVisible: false,
        showMode: "slide",
        mode: "temporary"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, -200, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when maxWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, -100, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when maxWidth is set");

    fx.off = false;
});

QUnit.test("minWidth should be rendered correctly in temporary mode, right menu position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minWidth: 50,
        menuVisible: false,
        menuPosition: "right",
        showMode: "slide",
        mode: "temporary"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 950, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when minWidth is set");
    assert.equal($menu.position().left, 800, "menu has correct left when minWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when minWidth is set");

    fx.off = false;
});

QUnit.test("maxWidth should be rendered correctly in temporary mode, right menu position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxWidth: 100,
        menuVisible: false,
        showMode: "slide",
        menuPosition: "right",
        mode: "temporary"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $menu = $element.find("." + DRAWER_MENU_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, 1000, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when maxWidth is set");

    instance.toggleMenuVisibility();

    assert.equal($content.position().left, 0, "content has correct left when maxWidth is set");
    assert.equal($menu.position().left, 900, "menu has correct left when maxWidth is set");
    assert.equal($menu.width(), 200, "menu has correct width when maxWidth is set");

    fx.off = false;
});

QUnit.module("rtl");

QUnit.test("content should have correct position if menu is visible in rtl mode", assert => {
    const $element = $("#drawer").dxDrawer({
        menuVisible: true,
        rtlEnabled: true
    });

    const instance = $element.dxDrawer("instance");
    const $content = $(instance.content());
    const $menu = $(instance.menuContent());

    assert.equal(position($content), -$menu.width(), "container rendered at correct position");
});

