import $ from "jquery";
import fx from "animation/fx";
import translator from "animation/translator";
import resizeCallbacks from "core/utils/resize_callbacks";
import config from "core/config";
import typeUtils from "core/utils/type";
import { animation } from "ui/drawer/ui.drawer.rendering.strategy";
import Overlay from "ui/overlay";

import "common.css!";
import "ui/drawer";

const DRAWER_PANEL_CONTENT_CLASS = "dx-drawer-panel-content";
const DRAWER_CONTENT_CLASS = "dx-drawer-content";
const DRAWER_SHADER_CLASS = "dx-drawer-shader";

const position = $element => $element.position().left;

const mockFxAnimate = (animations, type, output) => {
    animations[type] = (config) => {
        let position = config.position || 0,
            $element = config.$element;

        output.push({
            $element,
            type,
            start: translator.locate($element).left,
            duration: config.duration,
            end: position
        });

        translator.move($element, { left: position });

        if(config.endAction) {
            config.endAction();
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
        .dx-drawer-panel-content {\
                width: 200px;\
        }\
         body {\
                margin: 0px;\
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

    assert.equal(instance.option("revealMode"), "slide", "revealMode is OK");
    assert.equal(instance.option("openedStateMode"), "shrink", "mode is OK");
    assert.equal(instance.option("position"), "left", "position is OK");
    assert.equal(instance.option("shading"), false, "shading is OK");
    assert.strictEqual(instance.option("minSize"), null, "minSize is OK");
    assert.strictEqual(instance.option("maxSize"), null, "maxSize is OK");
    assert.equal(instance.option("animationEnabled"), true, "animationEnabled is OK");
    assert.equal(instance.option("animationDuration"), 400, "animationDuration is OK");
});

QUnit.test("drawer should preserve content", assert => {
    const $content = $("#drawer #content"),
        $element = $("#drawer").dxDrawer({});

    assert.equal($content[0], $element.find("#content")[0]);
});

QUnit.test("subscribe on toggle function should fired at the end of animation", assert => {
    const $element = $("#drawer").dxDrawer({
        opened: false
    });

    const instance = $element.dxDrawer("instance");
    let count = 0;
    const done = assert.async();

    instance.toggle().then(() => {
        count++;
        assert.equal(count, 1, "callback not fired at animation start");
        done();
    });

    assert.equal(count, 0, "callback not fired at animation start");
});

QUnit.test("incomplete animation should be stopped after toggling visibility", assert => {
    let origFxStop = fx.stop,
        panelStopCalls = 0,
        contentStopCalls = 0,
        overlayContentStopCalls = 0,
        shaderStopCalls = 0,
        isJumpedToEnd = false;

    const $element = $("#drawer").dxDrawer({
        opened: false,
        openedStateMode: "overlap",
        revealMode: "expand",
        shading: true
    });

    const instance = $element.dxDrawer("instance");
    fx.stop = function($element, jumpToEnd) {
        if(jumpToEnd) {
            isJumpedToEnd = true;
        }
        if($element.hasClass(DRAWER_PANEL_CONTENT_CLASS)) {
            panelStopCalls++;
        }
        if($element.hasClass(DRAWER_CONTENT_CLASS)) {
            contentStopCalls++;
        }
        if($element.hasClass("dx-overlay-content")) {
            overlayContentStopCalls++;
        }
        if($element.hasClass(DRAWER_SHADER_CLASS)) {
            shaderStopCalls++;
        }
    };

    try {
        fx.off = false;

        instance.toggle();
        instance.toggle();

        assert.equal(panelStopCalls, 2, "animation should stops before toggling visibility");
        assert.equal(contentStopCalls, 2, "animation should stops before toggling visibility");
        assert.equal(overlayContentStopCalls, 2, "animation should stops before toggling visibility");
        assert.equal(shaderStopCalls, 2, "animation should stops before toggling visibility");
        assert.notOk(isJumpedToEnd, "elements aren't returned to the end position after animation stopping");
    } finally {
        fx.off = true;
        fx.stop = origFxStop;
    }
});

QUnit.test("incomplete animation should be stopped after closing on outside click", assert => {
    const $element = $("#drawer").dxDrawer({
        opened: true,
        openedStateMode: "overlap",
        closeOnOutsideClick: true,
        revealMode: "expand",
        shading: true
    });

    let origFxStop = fx.stop,
        panelStopCalls = 0,
        contentStopCalls = 0,
        overlayContentStopCalls = 0,
        shaderStopCalls = 0,
        isJumpedToEnd = false;

    const instance = $element.dxDrawer("instance");
    fx.stop = function($element, jumpToEnd) {
        if(jumpToEnd) {
            isJumpedToEnd = true;
        }
        if($element.hasClass(DRAWER_PANEL_CONTENT_CLASS)) {
            panelStopCalls++;
        }
        if($element.hasClass(DRAWER_CONTENT_CLASS)) {
            contentStopCalls++;
        }
        if($element.hasClass("dx-overlay-content")) {
            overlayContentStopCalls++;
        }
        if($element.hasClass(DRAWER_SHADER_CLASS)) {
            shaderStopCalls++;
        }
    };

    try {
        fx.off = false;

        $(instance.viewContent()).trigger("dxclick");

        assert.equal(panelStopCalls, 2, "animation should stops before closing");
        assert.equal(contentStopCalls, 2, "animation should stops before closing");
        assert.equal(overlayContentStopCalls, 2, "animation should stops before closing");
        assert.equal(shaderStopCalls, 2, "animation should stops before closing");
        assert.notOk(isJumpedToEnd, "elements aren't returned to the end position after animation stopping");
    } finally {
        fx.off = true;
        fx.stop = origFxStop;
    }
});

QUnit.test("drawer shouldn't fail after changing openedStateMode", assert => {
    const $element = $("#drawer").dxDrawer({
        openedStateMode: "push"
    });
    const instance = $element.dxDrawer("instance");

    instance.option("openedStateMode", "shrink");
    instance.option("openedStateMode", "overlap");

    assert.ok(true, "Drawer works correctly");
});

QUnit.test("target option", assert => {
    const $element = $("#drawer").dxDrawer({
        openedStateMode: "overlap"
    });
    const instance = $element.dxDrawer("instance");

    assert.ok($(instance._overlay.option("position").of).hasClass("dx-drawer-wrapper"), "default target is ok");

    instance.option("target", $element.find(".dx-drawer-content"));
    assert.ok($(instance._overlay.option("position").of).hasClass("dx-drawer-content"), "target is ok");
});

QUnit.test("content() function", assert => {
    const $element = $("#drawer").dxDrawer({});
    const instance = $element.dxDrawer("instance");
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);
    assert.equal(typeUtils.isRenderer(instance.content()), !!config().useJQuery, "panel element");
    assert.equal($panel.get(0), $(instance.content()).get(0), "content function return correct DOMNode");
});

QUnit.test("viewContent() function", assert => {
    const $element = $("#drawer").dxDrawer({});
    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.get(0), $(instance.viewContent()).get(0), "content function return correct DOMNode");
});

QUnit.test("show() and hide() methods", assert => {
    const $element = $("#drawer").dxDrawer({});
    const instance = $element.dxDrawer("instance");

    instance.show();
    assert.equal(instance.option("opened"), true, "panel was shown");

    instance.hide();
    assert.equal(instance.option("opened"), false, "panel was hidden");
});

QUnit.test("toggle() method", assert => {
    const $element = $("#drawer").dxDrawer({});
    const instance = $element.dxDrawer("instance");
    const opened = instance.option("opened");

    instance.toggle();
    assert.equal(instance.option("opened"), !opened, "panel was shown");

    instance.toggle();
    assert.equal(instance.option("opened"), opened, "panel was hidden");
});

QUnit.test("wrapper content should be reversed if position = 'bottom' or 'right'", assert => {
    const $element = $("#drawer").dxDrawer({
        openedStateMode: "shrink"
    });
    const instance = $element.dxDrawer("instance");

    instance.option("position", "right");
    let $wrapper = $element.find(".dx-drawer-wrapper").eq(0);
    let $content = $wrapper.children();

    assert.ok($content.eq(1).hasClass("dx-drawer-panel-content"));
    assert.ok($content.eq(0).hasClass("dx-drawer-content"));

    instance.option("position", "left");

    $content = $wrapper.children();

    assert.ok($content.eq(0).hasClass("dx-drawer-panel-content"));
    assert.ok($content.eq(1).hasClass("dx-drawer-content"));
});

QUnit.test("wrapper content should be reversed if position = 'right' and openedStateMode is changed", assert => {
    const $element = $("#drawer").dxDrawer({
        openedStateMode: "push",
        position: "right"
    });
    const instance = $element.dxDrawer("instance");

    instance.option("openedStateMode", "shrink");
    let $wrapper = $element.find(".dx-drawer-wrapper").eq(0);
    let $content = $wrapper.children();

    assert.ok($content.eq(1).hasClass("dx-drawer-panel-content"));
    assert.ok($content.eq(0).hasClass("dx-drawer-content"));

    instance.option("position", "left");

    $content = $wrapper.children();

    assert.ok($content.eq(0).hasClass("dx-drawer-panel-content"));
    assert.ok($content.eq(1).hasClass("dx-drawer-content"));
});

QUnit.module("navigation");

QUnit.test("content container should have correct position if panel isn't visible", assert => {
    const $element = $("#drawer").dxDrawer({
        opened: false
    });

    const instance = $element.dxDrawer("instance");
    const $content = $(instance.viewContent());

    assert.equal(position($content), 0, "container rendered at correct position");
});

QUnit.test("content container should have correct position if panel is visible", assert => {
    const $element = $("#drawer").dxDrawer({
        opened: true
    });

    const instance = $element.dxDrawer("instance");
    const $content = $(instance.viewContent());
    const $panel = $(instance.content());

    assert.equal(position($content), $panel.width(), "container rendered at correct position");
});

QUnit.test("content container should have correct position after resize", assert => {
    const $element = $("#drawer2").dxDrawer({
        width: "100%",
        opened: true
    });

    const instance = $element.dxDrawer("instance");
    const $content = $(instance.viewContent());
    const elementWidth = $element.width();

    $("#drawerContainer").width(elementWidth * 2);
    resizeCallbacks.fire();

    assert.equal(position($content), $(instance.content()).width(), "container rendered at correct position");
});

QUnit.test("content container should have correct position if it is rendered in invisible container", assert => {
    const $container = $("#drawerContainer");
    const $element = $("#drawer2");

    $container.detach();

    const instance = $element.dxDrawer({
        width: "100%",
        opened: true,
        maxSize: 50
    }).dxDrawer("instance");

    const $content = $(instance.viewContent());

    $container.appendTo("#qunit-fixture");
    $element.trigger("dxshown");

    assert.equal(position($content), 50, "container rendered at correct position");
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
        return Promise.resolve();
    };

    try {
        const $drawer = $("#drawer").dxDrawer({
            opened: true,
            animationEnabled: false
        });

        const drawer = $drawer.dxDrawer("instance");

        drawer.option("opened", false);

        assert.equal(animated, false, "animation was not present");

        drawer.option("animationEnabled", true);
        drawer.option("opened", true);

        assert.equal(animated, true, "animation present");
    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("animationDuration option test", function(assert) {
    const $drawer = $("#drawer").dxDrawer({
        opened: false,
        animationEnabled: true,
        openedStateMode: "push"
    });

    const drawer = $drawer.dxDrawer("instance");


    drawer.option("animationDuration", 300);

    drawer.toggle();
    assert.equal(this.capturedAnimations[0].duration, 300, "duration is correct");
    drawer.option("animationDuration", 10000);
    drawer.toggle();
    assert.equal(this.capturedAnimations[1].duration, 10000, "duration is correct");
});

QUnit.module("shader");

QUnit.test("shader should be visible if drawer is opened and shading = true", assert => {
    const $element = $("#drawer").dxDrawer({
        opened: true,
        shading: true
    });

    const $shader = $element.find("." + DRAWER_SHADER_CLASS);

    assert.ok($shader.is(":visible"), "shader is visible");
});

QUnit.test("shader should not be visible if drawer is closed", assert => {
    const $element = $("#drawer").dxDrawer({
        opened: false,
        shading: true
    });

    const $shader = $element.find("." + DRAWER_SHADER_CLASS);

    assert.ok($shader.is(":hidden"), "shader is hidden");
    assert.equal($shader.css("visibility"), "hidden", "shader is hidden");
});

QUnit.test("shader should have correct visibility after toggling state", assert => {
    const $element = $("#drawer").dxDrawer({
        opened: true,
        shading: true,
        animationEnabled: false
    });
    const instance = $element.dxDrawer("instance");
    const $shader = $element.find("." + DRAWER_SHADER_CLASS);

    instance.toggle();

    assert.ok($shader.is(":hidden"), "shader is hidden");
    assert.equal($shader.css("visibility"), "hidden", "shader is hidden");
});

QUnit.test("shading option", assert => {
    const $element = $("#drawer").dxDrawer({
        opened: true,
        shading: true
    });
    const instance = $element.dxDrawer("instance");
    const $shader = $element.find("." + DRAWER_SHADER_CLASS);

    assert.ok($shader.is(":visible"), "shader is visible");

    instance.option("shading", false);
    assert.ok($shader.is(":hidden"), "shader is hidden");
});

QUnit.test("click on shader should not close drawer", assert => {
    const $element = $("#drawer").dxDrawer({
        opened: true,
        shading: true
    });

    const instance = $element.dxDrawer("instance");
    const $shader = $element.find("." + DRAWER_SHADER_CLASS);

    $shader.trigger("dxclick");
    assert.ok(instance.option("opened"), "drawer is opened");
});

QUnit.test("shader should be visible during animation", assert => {
    const $element = $("#drawer").dxDrawer({
        opened: false,
        shading: true
    });

    const instance = $element.dxDrawer("instance");
    const $shader = $element.find("." + DRAWER_SHADER_CLASS);

    instance.show();
    assert.ok($shader.is(":visible"), "shader is visible during animation");
});

QUnit.test("shader should have correct position", assert => {
    const $element = $("#drawer").dxDrawer({
        opened: true,
        shading: true
    });

    const instance = $element.dxDrawer("instance");
    const $content = $(instance.viewContent());
    const $shader = $element.find("." + DRAWER_SHADER_CLASS);

    assert.equal($shader.offset().left, $content.offset().left, "shader has correct position");
});

QUnit.test("shader should have correct position after widget resize", assert => {
    const $element = $("#drawer2").dxDrawer({
        width: "100%",
        opened: true,
        shading: true
    });

    const instance = $element.dxDrawer("instance");
    const $content = $(instance.viewContent());
    const $shader = $element.find("." + DRAWER_SHADER_CLASS);
    const panelWidth = $(instance.content()).width();

    $("#drawerContainer").width(panelWidth * 2);
    resizeCallbacks.fire();

    assert.equal($shader.offset().left, $content.offset().left, "shader has correct position");
});

QUnit.module("push mode");

QUnit.test("minSize should be rendered correctly in push mode", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        opened: true,
        openedStateMode: "push"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 200, "content has correct left when minSize is set");

    instance.toggle();

    assert.equal($content.position().left, 50, "content has correct left when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize should be rendered correctly in push mode", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 300,
        opened: true,
        openedStateMode: "push"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 300, "content has correct left when maxSize is set");

    instance.toggle();

    assert.equal($content.position().left, 0, "content has correct left when maxSize is set");

    fx.off = false;
});

QUnit.test("Drawer should be rendered correctly in push mode, right panel position", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        opened: true,
        position: "right",
        openedStateMode: "push"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, -200, "content has correct left when minSize is set");

    instance.toggle();

    assert.equal($content.position().left, 0, "content has correct left when minSize is set");

    fx.off = false;
});

QUnit.test("minSize should be rendered correctly in push mode, right panel position", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        position: "right",
        opened: true,
        openedStateMode: "push"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, -200, "content has correct left when minSize is set");

    instance.toggle();

    assert.equal($content.position().left, -50, "content has correct left when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize should be rendered correctly in push mode, right panel position", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 300,
        position: "right",
        opened: true,
        openedStateMode: "push"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, -300, "content has correct left when maxSize is set");

    instance.toggle();

    assert.equal($content.position().left, 0, "content has correct left when maxSize is set");

    fx.off = false;
});

QUnit.test("maxSize and minSize should be rendered correctly in push mode, top panel position", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 300,
        minSize: 50,
        position: "top",
        opened: true,
        openedStateMode: "push",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 300);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($content.position().top, 300, "content has correct top");

    instance.toggle();

    assert.equal($content.position().top, 50, "content has correct top");

    fx.off = false;
});

QUnit.test("maxSize and minSize should be rendered correctly in push mode, bottom panel position", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 300,
        minSize: 50,
        position: "bottom",
        opened: true,
        openedStateMode: "push",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 300);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($content.position().top, -300, "content has correct top");
    assert.equal($panel.position().top, 700, "panel has correct top");

    instance.toggle();

    assert.equal($content.position().top, -50, "content has correct top");
    assert.equal($panel.position().top, 700, "panel has correct top");

    fx.off = false;
});

QUnit.test("panel should be rendered correctly after openedStateMode changing, horizontal direction", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 300,
        opened: false,
        revealMode: "expand",
        openedStateMode: "shrink"
    });

    const instance = $element.dxDrawer("instance");
    instance.option("openedStateMode", "push");
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($panel.width(), 300, "panel has correct size");

    instance.toggle();

    assert.equal($panel.width(), 300, "panel has correct size");

    fx.off = false;
});

QUnit.test("panel should be rendered correctly after openedStateMode changing, vertical direction", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 300,
        opened: false,
        position: "bottom",
        revealMode: "slide",
        openedStateMode: "shrink"
    });

    const instance = $element.dxDrawer("instance");
    instance.option("openedStateMode", "push");
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($panel.height(), 300, "panel has correct size");

    instance.toggle();

    assert.equal($panel.height(), 300, "panel has correct size");

    fx.off = false;
});

QUnit.test("panel and content should be rendered correctly after revealMode changing", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        opened: true,
        revealMode: "slide",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 300);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    instance.option("opened", false);
    instance.option("revealMode", "expand");

    let $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);
    let $panelContent = $panel.find(".dx-overlay-content").eq(0);

    assert.equal($panelContent.width(), 50, "panel content has correct size");
    assert.equal($panel.position().left, 0, "panel has correct position");
    assert.equal($panelContent.position().left, 0, "panel content has correct position");

    instance.option("opened", true);
    instance.option("revealMode", "slide");

    $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);
    $panelContent = $panel.find(".dx-overlay-content").eq(0);

    assert.equal($panelContent.width(), 300, "panel content has correct size");
    assert.equal($panel.position().left, 0, "panel has correct position");
    assert.equal($panelContent.position().left, 0, "panel content has correct position");

    fx.off = false;
});

QUnit.module("shrink mode");

QUnit.test("panel should have correct width in shrink mode after drawer resizing, expand", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        maxSize: 100,
        opened: false,
        revealMode: "expand",
        contentTemplate: 'contentTemplate',
        openedStateMode: "shrink",
        width: 800,
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 2000);
            $div.css("width", 200);

            return $div;
        }
    });

    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($panel.width(), 50, "panel has correct width when minSize is set");

    resizeCallbacks.fire();
    assert.equal($panel.width(), 50, "panel has correct width when minSize is set");

    fx.off = false;
});

QUnit.test("minSize should be rendered correctly in shrink mode, expand", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        opened: false,
        revealMode: "expand",
        contentTemplate: 'contentTemplate',
        openedStateMode: "shrink"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);


    assert.equal($content.position().left, 50, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 0, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 50, "panel has correct width when minSize is set");

    instance.toggle();

    assert.equal($content.position().left, 200, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 0, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    fx.off = false;
});

QUnit.test("minSize should be rendered correctly in shrink mode, right panel position, expand", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        opened: false,
        position: "right",
        revealMode: "expand",
        contentTemplate: 'contentTemplate',
        openedStateMode: "shrink"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 950, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 50, "panel has correct width when minSize is set");

    instance.toggle();

    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 800, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize should be rendered correctly in shrink mode, expand", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 100,
        opened: false,
        revealMode: "expand",
        contentTemplate: 'contentTemplate',
        openedStateMode: "shrink"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 0, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 0, "panel has correct width when minSize is set");

    instance.toggle();

    assert.equal($content.position().left, 100, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 0, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 100, "panel has correct width when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize should be rendered correctly in shrink mode, right panel position, expand", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 100,
        opened: false,
        revealMode: "expand",
        position: "right",
        contentTemplate: 'contentTemplate',
        openedStateMode: "shrink"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 1000, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 0, "panel has correct width when minSize is set");

    instance.toggle();

    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 900, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 100, "panel has correct width when minSize is set");

    fx.off = false;
});

QUnit.test("minSize and maxSize should be rendered correctly in shrink mode, bottom panel position, expand", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        maxSize: 100,
        opened: false,
        position: "bottom",
        revealMode: "expand",
        contentTemplate: 'contentTemplate',
        openedStateMode: "shrink",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 1000);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($content.position().top, 0, "content has correct top");
    assert.equal($panel.position().top, 950, "panel has correct top");
    assert.equal($panel.height(), 50, "panel has correct height");

    instance.toggle();

    assert.equal($content.position().top, 0, "content has correct top");
    assert.equal($panel.position().top, 900, "panel has correct top");
    assert.equal($panel.height(), 100, "panel has correct height");

    fx.off = false;
});

QUnit.test("panel should have correct height in shrink mode after drawer resizing, expand", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        maxSize: 100,
        opened: false,
        position: "top",
        revealMode: "expand",
        contentTemplate: 'contentTemplate',
        openedStateMode: "shrink",
        width: 800,
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 2000);

            return $div;
        }
    });

    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($panel.height(), 50, "panel has correct height when minSize is set");

    resizeCallbacks.fire();
    assert.equal($panel.height(), 50, "panel has correct height when minSize is set");

    fx.off = false;
});

QUnit.test("minSize should be rendered correctly in shrink mode, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        opened: false,
        revealMode: "slide",
        openedStateMode: "shrink"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($panel.css("margin-left"), "-150px", "panel has correct margin when minSize is set");
    assert.equal($content.position().left, 50, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 0, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    instance.toggle();

    assert.equal($panel.css("margin-left"), "0px", "panel has correct margin when minSize is set");
    assert.equal($content.position().left, 200, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 0, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize should be rendered correctly in shrink mode, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 100,
        opened: false,
        revealMode: "slide",
        openedStateMode: "shrink"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($panel.css("margin-left"), "-200px", "panel has correct margin when minSize is set");
    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 0, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    instance.toggle();

    assert.equal($panel.css("margin-left"), "-100px", "panel has correct margin when minSize is set");
    assert.equal($content.position().left, 100, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 0, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    fx.off = false;
});

QUnit.test("minSize should be rendered correctly in shrink mode, right panel position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        opened: false,
        position: "right",
        revealMode: "slide",
        openedStateMode: "shrink"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($panel.css("margin-right"), "-150px", "panel has correct margin when minSize is set");
    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 950, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    instance.toggle();

    assert.equal($panel.css("margin-right"), "0px", "panel has correct margin when minSize is set");
    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 800, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize should be rendered correctly in shrink mode, right panel position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 100,
        opened: false,
        position: "right",
        revealMode: "slide",
        openedStateMode: "shrink"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($panel.css("margin-right"), "-200px", "panel has correct margin when minSize is set");
    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 1000, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    instance.toggle();

    assert.equal($panel.css("margin-right"), "-100px", "panel has correct margin when minSize is set");
    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 900, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize and minSize should be rendered correctly in shrink mode, top panel position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 100,
        minSize: 50,
        opened: false,
        position: "top",
        revealMode: "slide",
        contentTemplate: 'contentTemplate',
        openedStateMode: "shrink",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 1000);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($content.position().top, 50, "content has correct top");
    assert.equal($panel.position().top, 0, "panel has correct top");
    assert.equal($panel.height(), 200, "panel has correct height");
    assert.equal($panel.css("marginTop"), "-150px", "panel content has correct marginTop");

    instance.toggle();

    assert.equal($content.position().top, 100, "content has correct top");
    assert.equal($panel.position().top, 0, "panel has correct top when");
    assert.equal($panel.height(), 200, "panel has correct height when");
    assert.equal($panel.css("marginTop"), "-100px", "panel content has correct marginTop");

    fx.off = false;
});

QUnit.test("maxSize and minSize should be rendered correctly in shrink mode, bottom panel position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 150,
        minSize: 50,
        opened: false,
        position: "bottom",
        revealMode: "slide",
        contentTemplate: 'contentTemplate',
        openedStateMode: "shrink",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 1000);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($content.position().top, 0, "content has correct top");
    assert.equal($panel.position().top, 950, "panel has correct top");
    assert.equal($panel.height(), 200, "panel has correct height");
    assert.equal($panel.css("marginBottom"), "-150px", "panel content has correct marginBottom");

    instance.toggle();

    assert.equal($content.position().top, 0, "content has correct top");
    assert.equal($panel.position().top, 850, "panel has correct top when");
    assert.equal($panel.height(), 200, "panel has correct height when");
    assert.equal($panel.css("marginBottom"), "-50px", "panel content has correct marginBottom");

    fx.off = false;
});

QUnit.module("overlap mode");

QUnit.test("drawer panel should be overlay in overlap mode", assert => {
    const drawer = $("#drawer").dxDrawer({
        openedStateMode: "overlap"
    }).dxDrawer("instance");

    assert.ok(drawer._overlay instanceof Overlay, "Drawer has overlay");
    assert.ok($(drawer.content()).hasClass("dx-overlay"), "Panel content is an overlay");
});

QUnit.test("drawer panel overlay should have right config depending on position option", assert => {
    let drawer = $("#drawer").dxDrawer({
            openedStateMode: "overlap"
        }).dxDrawer("instance"),
        overlay = drawer.getOverlay();

    assert.equal(overlay.option("shading"), false, "Overlay has no shading");
    assert.ok(overlay.option("container").hasClass("dx-drawer-wrapper"));

    assert.equal(overlay.option("position").my, "top left");
    assert.equal(overlay.option("position").at, "top left");

    drawer.option("position", "right");
    overlay = drawer.getOverlay();
    assert.equal(overlay.option("position").my, "top right");
    assert.equal(overlay.option("position").at, "top right");

    drawer.option("position", "top");
    overlay = drawer.getOverlay();
    assert.equal(overlay.option("position").my, "top");
    assert.equal(overlay.option("position").at, "top");

    drawer.option("position", "bottom");
    overlay = drawer.getOverlay();
    assert.equal(overlay.option("position").my, "bottom");
    assert.equal(overlay.option("position").at, "bottom");
});

QUnit.test("minSize should be rendered correctly in overlap mode, expand", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        opened: false,
        revealMode: "expand",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 600);
            $div.css("width", 200);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    const $overlayContent = $(".dx-drawer-panel-content.dx-overlay-wrapper .dx-overlay-content").eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($content.css("paddingLeft"), "50px", "content has correct padding when minSize is set");
    assert.equal($panel.position().left, 0, "panel has correct left when minSize is set");
    assert.equal($overlayContent.width(), 50, "panel content has correct width when minSize is set");

    instance.toggle();

    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($content.css("paddingLeft"), "50px", "content has correct padding when minSize is set");
    assert.equal($panel.position().left, 0, "panel has correct left when minSize is set");
    assert.equal($overlayContent.width(), 200, "panel content has correct width when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize should be rendered correctly in overlap mode, expand", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 100,
        opened: false,
        revealMode: "expand",
        openedStateMode: "overlap"
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);
    const $overlayContent = $(".dx-drawer-panel-content.dx-overlay .dx-overlay-content").eq(0);

    assert.equal($content.position().left, 0, "content has correct left when maxSize is set");
    assert.equal($panel.position().left, 0, "panel has correct left when maxSize is set");
    assert.equal($overlayContent.width(), 0, "panel content has correct width when maxSize is set");

    instance.toggle();

    assert.equal($content.position().left, 0, "content has correct left when maxSize is set");
    assert.equal($panel.position().left, 0, "panel has correct left when maxSize is set");
    assert.equal($overlayContent.width(), 100, "panel content has correct width when maxSize is set");

    fx.off = false;
});

QUnit.test("minSize should be rendered correctly in overlap mode, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        opened: false,
        revealMode: "slide",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 600);
            $div.css("width", 200);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $(".dx-drawer-panel-content.dx-overlay").eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, -150, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    instance.toggle();

    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 0, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize should be rendered correctly in overlap mode, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 100,
        opened: false,
        revealMode: "slide",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 600);
            $div.css("width", 200);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $(".dx-drawer-panel-content.dx-overlay").eq(0);

    assert.equal($content.position().left, 0, "content has correct left when maxSize is set");
    assert.equal($panel.position().left, -200, "panel has correct left when maxSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when maxSize is set");

    instance.toggle();

    assert.equal($content.position().left, 0, "content has correct left when maxSize is set");
    assert.equal($panel.position().left, -100, "panel has correct left when maxSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when maxSize is set");

    fx.off = false;
});

QUnit.test("minSize should be rendered correctly in overlap mode, right panel position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        opened: false,
        position: "right",
        revealMode: "slide",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 600);
            $div.css("width", 200);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $(".dx-drawer-panel-content.dx-overlay").eq(0);

    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 950, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    instance.toggle();

    assert.equal($content.position().left, 0, "content has correct left when minSize is set");
    assert.equal($panel.position().left, 800, "panel has correct left when minSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize should be rendered correctly in overlap mode, right panel position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 100,
        opened: false,
        revealMode: "slide",
        position: "right",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 600);
            $div.css("width", 200);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $(".dx-drawer-panel-content.dx-overlay").eq(0);

    assert.equal($content.position().left, 0, "content has correct left when maxSize is set");
    assert.equal($panel.position().left, 1000, "panel has correct left when maxSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when maxSize is set");

    instance.toggle();

    assert.equal($content.position().left, 0, "content has correct left when maxSize is set");
    assert.equal($panel.position().left, 900, "panel has correct left when maxSize is set");
    assert.equal($panel.width(), 200, "panel has correct width when maxSize is set");

    fx.off = false;
});

QUnit.test("minSize should be rendered correctly in overlap mode, top panel position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        opened: false,
        position: "top",
        revealMode: "slide",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 600);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $(".dx-drawer-panel-content.dx-overlay").eq(0);

    assert.equal($content.position().top, 0, "content has correct top when minSize is set");
    assert.equal($panel.position().top, -150, "panel has correct top when minSize is set");

    instance.toggle();

    assert.equal($content.position().top, 0, "content has correct top when minSize is set");
    assert.equal($panel.position().top, 0, "panel has correct top when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize should be rendered correctly in overlap mode, top panel position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 100,
        opened: false,
        position: "top",
        revealMode: "slide",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 600);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $(".dx-drawer-panel-content.dx-overlay").eq(0);

    assert.equal($content.position().top, 0, "content has correct top when minSize is set");
    assert.equal($panel.position().top, -200, "panel has correct top when minSize is set");

    instance.toggle();

    assert.equal($content.position().top, 0, "content has correct top when minSize is set");
    assert.equal($panel.position().top, -100, "panel has correct top when minSize is set");

    fx.off = false;
});

QUnit.test("minSize should be rendered correctly in overlap mode, top panel position, expand", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        opened: false,
        position: "top",
        revealMode: "expand",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 600);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $panel = $(".dx-drawer-panel-content.dx-overlay").eq(0);
    const $panelContent = $panel.find(".dx-overlay-content");

    assert.equal($panelContent.height(), 50, "panel content has correct height when minSize is set");

    instance.toggle();

    assert.equal($panelContent.height(), 200, "panel content has correct height when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize should be rendered correctly in overlap mode, top panel position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 100,
        opened: false,
        position: "top",
        revealMode: "expand",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 600);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $panel = $(".dx-drawer-panel-content.dx-overlay").eq(0);
    const $panelContent = $panel.find(".dx-overlay-content");

    assert.equal($panelContent.height(), 0, "panel content has correct height when maxSize is set");

    instance.toggle();

    assert.equal($panelContent.height(), 100, "panel content has correct height when maxSize is set");

    fx.off = false;
});

QUnit.test("minSize should be rendered correctly in overlap mode, bottom panel position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        opened: false,
        position: "bottom",
        revealMode: "slide",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 600);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $(".dx-drawer-panel-content.dx-overlay").eq(0);

    assert.equal($content.position().top, 0, "content has correct top when minSize is set");
    assert.equal($panel.position().top, 150, "panel has correct top when minSize is set");

    instance.toggle();

    assert.equal($content.position().top, 0, "content has correct top when minSize is set");
    assert.equal($panel.position().top, 0, "panel has correct top when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize should be rendered correctly in overlap mode, bottom panel position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 100,
        opened: false,
        position: "bottom",
        revealMode: "slide",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 600);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);
    const $panel = $(".dx-drawer-panel-content.dx-overlay").eq(0);

    assert.equal($content.position().top, 0, "content has correct top when minSize is set");
    assert.equal($panel.position().top, 200, "panel has correct top when minSize is set");

    instance.toggle();

    assert.equal($content.position().top, 0, "content has correct top when minSize is set");
    assert.equal($panel.position().top, 100, "panel has correct top when minSize is set");

    fx.off = false;
});

QUnit.test("minSize should be rendered correctly in overlap mode, bottom panel position, expand", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        minSize: 50,
        opened: false,
        position: "bottom",
        revealMode: "expand",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 600);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $panel = $(".dx-drawer-panel-content.dx-overlay").eq(0);
    const $panelContent = $panel.find(".dx-overlay-content");

    assert.equal($panelContent.height(), 50, "panel content has correct height when minSize is set");
    assert.equal($panelContent.css("marginTop"), "150px", "panel content has correct height when minSize is set");

    instance.toggle();

    assert.equal($panelContent.height(), 200, "panel content has correct height when minSize is set");
    assert.equal($panelContent.css("marginTop"), "0px", "panel content has correct height when minSize is set");

    fx.off = false;
});

QUnit.test("maxSize should be rendered correctly in overlap mode, bottom panel position, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        maxSize: 100,
        opened: false,
        position: "bottom",
        revealMode: "expand",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 200);
            $div.css("width", 600);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    const $panel = $(".dx-drawer-panel-content.dx-overlay").eq(0);
    const $panelContent = $panel.find(".dx-overlay-content");

    assert.equal($panelContent.height(), 0, "panel content has correct height when maxSize is set");
    assert.equal($panelContent.css("marginTop"), "200px", "panel content has correct height when minSize is set");

    instance.toggle();

    assert.equal($panelContent.height(), 100, "panel content has correct height when maxSize is set");
    assert.equal($panelContent.css("marginTop"), "100px", "panel content has correct height when minSize is set");

    fx.off = false;
});

QUnit.test("drawer panel should be rendered correctly in overlap mode after mode changing, expand", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        opened: true,
        revealMode: "expand",
        openedStateMode: "shrink",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 600);
            $div.css("width", 200);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");

    instance.option("openedStateMode", "overlap");
    instance.toggle();

    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS).eq(0);

    assert.equal($panel.width(), 0, "panel should have correct width after option changing");

    fx.off = false;
});

QUnit.test("drawer panel and content should be rendered correctly in overlap mode after mode changing, slide", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        opened: true,
        revealMode: "slide",
        minSize: 50,
        openedStateMode: "shrink",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 600);
            $div.css("width", 200);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");
    instance.option("openedStateMode", "overlap");

    const $panelContent = $element.find(".dx-overlay-content").eq(0);
    const $content = $element.find("." + DRAWER_CONTENT_CLASS).eq(0);

    assert.equal($panelContent.width(), 200, "panel should have correct width after option changing");
    assert.equal($content.css("transform"), "none", "content has right css transform");

    fx.off = false;
});

QUnit.test("drawer should have only one panel after mode changing", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        opened: true,
        revealMode: "expand",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 600);
            $div.css("width", 200);

            return $div;
        }
    });

    const instance = $element.dxDrawer("instance");

    instance.option("openedStateMode", "shrink");

    const $panel = $element.find("." + DRAWER_PANEL_CONTENT_CLASS);

    assert.equal($panel.length, 1, "one panel is rendered");

    fx.off = false;
});

QUnit.test("drawer panel should be repositioned after dimension changed", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        opened: false,
        revealMode: "slide",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 600);
            $div.css("width", 200);

            return $div;
        }
    });
    const $panelOverlayContent = $element.find(".dx-overlay-content");

    resizeCallbacks.fire();

    assert.equal($panelOverlayContent.position().left, 0, "panel overlay content position is OK");

    fx.off = false;
});

QUnit.test("drawer panel should be repositioned after dimension changed, right position", assert => {
    fx.off = true;

    const $element = $("#drawer").dxDrawer({
        opened: false,
        revealMode: "slide",
        position: "right",
        openedStateMode: "overlap",
        template: function($content) {
            var $div = $("<div/>");
            $div.css("height", 600);
            $div.css("width", 200);

            return $div;
        }
    });
    const $panelOverlayContent = $element.find(".dx-overlay-content");

    resizeCallbacks.fire();

    assert.equal($panelOverlayContent.position().left, 0, "panel overlay content position is OK");

    fx.off = false;
});

QUnit.module("rtl");

QUnit.test("content should have correct position if panel is visible in rtl mode", assert => {
    const $element = $("#drawer").dxDrawer({
        opened: true,
        openedStateMode: "push",
        rtlEnabled: true
    });

    const instance = $element.dxDrawer("instance");
    const $content = $(instance.viewContent());
    const $panel = $(instance.content());

    assert.equal(position($content), -$panel.width(), "container rendered at correct position");
});

QUnit.test("drawer panel overlay should have right position config", assert => {
    let drawer = $("#drawer").dxDrawer({
            openedStateMode: "overlap",
            rtlEnabled: true
        }).dxDrawer("instance"),
        overlay = drawer.getOverlay();

    assert.equal(overlay.option("position").my, "top right");
    assert.equal(overlay.option("position").at, "top right");
});

QUnit.module("closeOnOutsideClick");

QUnit.test("drawer should be hidden after click on content", (assert) => {
    var drawer = $("#drawer").dxDrawer({
            closeOnOutsideClick: false,
            opened: true,
            shading: true
        })
        .dxDrawer("instance"),
        $content = drawer.viewContent();

    $($content).trigger("dxclick");
    assert.equal(drawer.option("opened"), true, "drawer is not hidden");
    drawer.option("closeOnOutsideClick", true);

    const $shader = drawer.$element().find("." + DRAWER_SHADER_CLASS);
    $($content).trigger("dxclick");

    assert.equal(drawer.option("opened"), false, "drawer is hidden");
    assert.ok($shader.is(":hidden"), "shader is hidden");
});

QUnit.test("closeOnOutsideClick as function should be processed correctly", (assert) => {
    var drawer = $("#drawer").dxDrawer({
            closeOnOutsideClick: () => {
                return false;
            },
            opened: true
        })
        .dxDrawer("instance"),
        $content = drawer.viewContent();

    $($content).trigger("dxclick");
    assert.equal(drawer.option("opened"), true, "drawer is not hidden");
    drawer.option("closeOnOutsideClick", () => {
        return true;
    });

    $($content).trigger("dxclick");
    assert.equal(drawer.option("opened"), false, "drawer is hidden");
});
