"use strict";

var $ = require("jquery"),
    config = require("core/config"),
    typeUtils = require("core/utils/type"),
    windowUtils = require("core/utils/window");

require("common.css!");
require("ui/drawer");

var DRAWER_CLASS = "dx-drawer",
    DRAWER_WRAPPER_CLASS = "dx-drawer-wrapper",
    DRAWER_MENU_CONTENT_CLASS = "dx-drawer-menu-content",
    DRAWER_CONTENT_CLASS = "dx-drawer-content",
    DRAWER_SHADER_CLASS = "dx-drawer-shader",

    OPENED_STATE_CLASS = "dx-drawer-opened";

var position = function($element) {
    return $element.position().left;
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

QUnit.module("rendering");

QUnit.test("render drawer", function(assert) {
    var $element = $("#drawer").dxDrawer({});

    assert.ok($element.hasClass(DRAWER_CLASS), "drawer rendered");
    assert.equal($element.find("." + DRAWER_WRAPPER_CLASS).length, 1, "drawer has wrapper");
    assert.equal($element.find("." + DRAWER_MENU_CONTENT_CLASS).length, 1, "drawer has menu container");
    assert.equal($element.find("." + DRAWER_CONTENT_CLASS).length, 1, "drawer has content");
});

QUnit.test("drawer should have correct mode class by default", function(assert) {
    var $element = $("#drawer").dxDrawer();

    assert.ok($element.hasClass(DRAWER_CLASS + "-push"), "drawer class is correct");
});

QUnit.test("render drawer content", function(assert) {
    var $element = $("#drawer").dxDrawer({}),
        $content = $element.find("." + DRAWER_CONTENT_CLASS);

    assert.equal($.trim($content.text()), "Test Content", "drawer content was rendered");
});


QUnit.test("opened class should be applied correctly", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance");

    assert.ok($element.hasClass(OPENED_STATE_CLASS), 1, "drawer has opened class");

    instance.option("menuVisible", false);

    assert.notOk($element.hasClass(OPENED_STATE_CLASS), 1, "drawer hasn't opened class");
});

QUnit.test("custom content template for menu should be rendered correctly", function(assert) {
    var $element = $("#contentTemplate").dxDrawer({
            menuTemplate: "customMenu"
        }),
        $menu = $($element.dxDrawer("instance").menuContent());

    assert.equal($.trim($menu.text()), "Test Menu Template", "menu content text is correct");
});

QUnit.test("templates should be dom nodes without jQuery", function(assert) {
    assert.expect(2);
    $("#contentTemplate").dxDrawer({
        menuTemplate: function(element) {
            assert.equal(typeUtils.isRenderer(element), !!config().useJQuery, "element is correct");
        },
        contentTemplate: function(element) {
            assert.equal(typeUtils.isRenderer(element), !!config().useJQuery, "element is correct");
        }
    });
});

QUnit.test("custom content template for content should be rendered correctly", function(assert) {
    var $element = $("#contentTemplate").dxDrawer({
            contentTemplate: "customContent"
        }),
        $content = $($element.dxDrawer("instance").content());

    assert.equal($.trim($content.text()), "Test Content Template", "content text is correct");
});

QUnit.test("render right menu position", function(assert) {
    var $element = $("#contentTemplate").dxDrawer({
            menuPosition: "inverted",
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance"),
        $content = $(instance.content()),
        $menuContent = $(instance.menuContent());

    assert.notOk($menuContent.hasClass(DRAWER_CLASS + "-left"), "there is no left menu position class");
    assert.ok($menuContent.hasClass(DRAWER_CLASS + "-right"), "right menu position class added");

    if(windowUtils.hasWindow()) {
        assert.equal(position($content), -200, "menu left position is negative");
    }

    instance.option("menuPosition", "normal");
    assert.notOk($menuContent.hasClass(DRAWER_CLASS + "-right"), "right menu position class has been removed");
    assert.ok($menuContent.hasClass(DRAWER_CLASS + "-left"), "left menu position class added");
});

QUnit.test("shader should be rendered by default if menu is visible", function(assert) {
    var $element = $("#drawer").dxDrawer({
        menuVisible: true
    });

    assert.equal($element.find("." + DRAWER_SHADER_CLASS).length, 1, "drawer has shader");
});

QUnit.test("shader should not be rendered if showShader = false", function(assert) {
    var $element = $("#drawer").dxDrawer({
        menuVisible: true,
        showShader: false
    });

    assert.equal($element.find("." + DRAWER_SHADER_CLASS).length, 1, "drawer has shader");
});

QUnit.module("push mode");

QUnit.test("drawer should have correct class depending on mode", function(assert) {
    var $element = $("#drawer").dxDrawer({
        mode: "push"
    });

    assert.ok($element.hasClass(DRAWER_CLASS + "-push"), "drawer class is correct");
});

QUnit.module("temporary mode");

QUnit.test("drawer should have correct class depending on mode", function(assert) {
    var $element = $("#drawer").dxDrawer({
        mode: "temporary"
    });

    assert.ok($element.hasClass(DRAWER_CLASS + "-temporary"), "drawer class is correct");
});

QUnit.test("shader should always visible in temporary mode", function(assert) {
    var $element = $("#drawer").dxDrawer({
            menuVisible: true
        }),
        instance = $element.dxDrawer("instance"),
        $shader = $element.find("." + DRAWER_SHADER_CLASS).eq(0);

    assert.notOk($shader.hasClass("dx-state-invisible"), "drawer has visible shader");

    instance.option("menuVisible", false);

    assert.notOk($shader.hasClass("dx-state-invisible"), "drawer has visible shader");
});
