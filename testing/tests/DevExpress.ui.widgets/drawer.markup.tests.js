import $ from "jquery";
import config from "core/config";
import typeUtils from "core/utils/type";
import "common.css!";
import "ui/drawer";

const DRAWER_CLASS = "dx-drawer";
const DRAWER_WRAPPER_CLASS = "dx-drawer-wrapper";
const DRAWER_PANEL_CONTENT_CLASS = "dx-drawer-panel-content";
const DRAWER_CONTENT_CLASS = "dx-drawer-content";
const DRAWER_SHADER_CLASS = "dx-drawer-shader";
const OPENED_STATE_CLASS = "dx-drawer-opened";


QUnit.testStart(() => {
    const markup = '\
    <style>\
        .dx-drawer-panel-content {\
            width: 200px;\
        }\
    </style>\
    \
    <div id="drawer">\
        Test Content\
    </div>\
    <div id="contentTemplate">\
        <div data-options="dxTemplate: { name: \'customPanel\' }">\
            Test panel Template\
        </div>\
            <div data-options="dxTemplate: { name: \'customContent\' }">\
            Test Content Template\
        </div>\
    </div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("rendering");

QUnit.test("render drawer", function(assert) {
    const $element = $("#drawer").dxDrawer({});

    assert.ok($element.hasClass(DRAWER_CLASS), "drawer rendered");
    assert.equal($element.find("." + DRAWER_WRAPPER_CLASS).length, 1, "drawer has wrapper");
    assert.equal($element.find("." + DRAWER_PANEL_CONTENT_CLASS).length, 1, "drawer has panel container");
    assert.equal($element.find("." + DRAWER_CONTENT_CLASS).length, 1, "drawer has content");
});

QUnit.test("drawer should have correct mode class by default", function(assert) {
    const $element = $("#drawer").dxDrawer();

    assert.ok($element.hasClass(DRAWER_CLASS + "-shrink"), "drawer class is correct");
});

QUnit.test("drawer should have correct revealMode class by default", function(assert) {
    const $element = $("#drawer").dxDrawer();

    assert.ok($element.hasClass(DRAWER_CLASS + "-slide"), "drawer class is correct");
});

QUnit.test("render drawer content", function(assert) {
    const $element = $("#drawer").dxDrawer({});
    const $content = $element.find("." + DRAWER_CONTENT_CLASS);

    assert.equal($content.text().trim(), "Test Content", "drawer content was rendered");
});


QUnit.test("opened class should be applied correctly", function(assert) {
    const $element = $("#drawer").dxDrawer({
        opened: true
    });

    const instance = $element.dxDrawer("instance");

    assert.ok($element.hasClass(OPENED_STATE_CLASS), "drawer has opened class");

    instance.option("opened", false);

    assert.notOk($element.hasClass(OPENED_STATE_CLASS), "drawer hasn't opened class");
});

QUnit.test("custom template for panel should be rendered correctly", function(assert) {
    const $element = $("#contentTemplate").dxDrawer({
        template: "customPanel"
    });

    const $panel = $($element.dxDrawer("instance").content());

    assert.equal($panel.text().trim(), "Test panel Template", "panel content text is correct");
});

QUnit.test("templates should be dom nodes without jQuery", function(assert) {
    assert.expect(2);
    $("#contentTemplate").dxDrawer({
        template(element) {
            assert.equal(typeUtils.isRenderer(element), !!config().useJQuery, "element is correct");
        },
        contentTemplate(element) {
            assert.equal(typeUtils.isRenderer(element), !!config().useJQuery, "element is correct");
        }
    });
});

QUnit.test("custom content template for content should be rendered correctly", function(assert) {
    const $element = $("#contentTemplate").dxDrawer({
        contentTemplate: "customContent"
    });

    const $content = $($element.dxDrawer("instance").viewContent());

    assert.equal($content.text().trim(), "Test Content Template", "content text is correct");
});

QUnit.test("render panel positions", function(assert) {
    const $element = $("#contentTemplate").dxDrawer({
        position: "right",
        openedStateMode: "shrink",
        opened: true
    });
    const instance = $element.dxDrawer("instance");

    assert.notOk($element.hasClass(DRAWER_CLASS + "-left"), "there is no left panel position class");
    assert.ok($element.hasClass(DRAWER_CLASS + "-right"), "right panel position class added");

    instance.option("position", "top");

    assert.notOk($element.hasClass(DRAWER_CLASS + "-right"), "right panel position class has been removed");
    assert.notOk($element.hasClass(DRAWER_CLASS + "-left"), "right panel position class has been removed");
    assert.ok($element.hasClass(DRAWER_CLASS + "-top"), "top panel position class added");
});

QUnit.test("shader should be rendered by default if panel is visible", function(assert) {
    const $element = $("#drawer").dxDrawer({
        opened: true
    });

    assert.equal($element.find("." + DRAWER_SHADER_CLASS).length, 1, "drawer has shader");
});

QUnit.test("shader should not be rendered if shading = false", function(assert) {
    const $element = $("#drawer").dxDrawer({
        opened: true,
        shading: false
    });

    assert.equal($element.find("." + DRAWER_SHADER_CLASS).length, 1, "drawer has shader");
});

QUnit.module("push mode");

QUnit.test("drawer should have correct class depending on mode", function(assert) {
    const $element = $("#drawer").dxDrawer({
        openedStateMode: "push"
    });

    assert.ok($element.hasClass(DRAWER_CLASS + "-push"), "drawer class is correct");
});

QUnit.module("overlap mode");

QUnit.test("drawer should have correct class depending on mode", function(assert) {
    const $element = $("#drawer").dxDrawer({
        openedStateMode: "overlap"
    });

    assert.ok($element.hasClass(DRAWER_CLASS + "-overlap"), "drawer class is correct");
});

QUnit.test("drawer panel should be overlay in overlap mode", function(assert) {
    const drawer = $("#drawer").dxDrawer({
        openedStateMode: "overlap"
    }).dxDrawer("instance");

    const $panel = drawer.content();
    assert.ok($($panel).hasClass("dx-overlay"), "drawer panel is overlay");
});
