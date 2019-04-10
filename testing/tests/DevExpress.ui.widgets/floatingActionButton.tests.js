import $ from "jquery";
import config from "core/config";

import "ui/floating_action_button";
import "common.css!";
import "generic_light.css!";


const { test } = QUnit;

QUnit.testStart(() => {
    const markup =
        '<div id="fab-one"></div>\
        <div id="fab-two"></div>\
        <div id="fabs"></div>';

    $("#qunit-fixture").html(markup);
});

const FAB_CLASS = "dx-fa-button";
const FAB_MAIN_CLASS = "dx-fa-button-main";

QUnit.module("create one action", () => {
    test("check rendering", (assert) => {
        this.instance = $("#fab-one")
            .dxFloatingActionButton()
            .dxFloatingActionButton("instance");

        const $fabElement = $("." + FAB_CLASS);
        const $fabContent = $fabElement.find(".dx-overlay-content");
        const clickHandler = sinon.spy();

        assert.ok($fabElement.length === 1, "one action button created");
        assert.ok($fabElement.hasClass(FAB_MAIN_CLASS), "it is main action button");
        assert.equal($fabContent.find(".dx-fa-button-icon").length, 1, "icon container created");
        assert.equal($fabContent.find(".dx-icon-close").length, 1, "default close icon created");

        this.instance.option("icon", "preferences");
        assert.equal($fabContent.find(".dx-icon-preferences").length, 1, "icon changed");

        this.instance.option("onClick", clickHandler);
        $fabContent.trigger("dxclick");

        assert.ok(clickHandler.calledOnce, "Handler should be called");
        const params = clickHandler.getCall(0).args[0];
        assert.ok(params, "Event params should be passed");
        assert.ok(params.event, "Event should be passed");
        assert.ok(params.element, "Element should be passed");
        assert.ok(params.component, "Component should be passed");
    });
});


QUnit.module("maxActionButtonCount option", () => {
    test("check action buttons count", (assert) => {
        const $container = $("#fabs");
        const fabInstances = [];

        for(let i = 0; i < 8; i++) {
            fabInstances.push($("<div>")
                .appendTo($container)
                .dxFloatingActionButton({ icon: "favorites" })
                .dxFloatingActionButton("instance"));
        }

        assert.equal($("." + FAB_MAIN_CLASS).length, 1, "one main fab is created");
        assert.equal($("." + FAB_CLASS).length - 1, 5, "five actions is created");
    });
});


QUnit.module("create multiple actions", (hooks) => {
    let firstInstance;
    let secondInstance;

    hooks.beforeEach(() => {
        const firstElement = $("#fab-one").dxFloatingActionButton({ icon: "arrowdown" });
        const secondElement = $("#fab-two").dxFloatingActionButton({ icon: "arrowup" });
        firstInstance = firstElement.dxFloatingActionButton("instance");
        secondInstance = secondElement.dxFloatingActionButton("instance");
    }),

    test("check rendering", (assert) => {
        const $fabMainElement = $("." + FAB_MAIN_CLASS);
        const $fabMainContent = $fabMainElement.find(".dx-overlay-content");
        let $fabElement = $("." + FAB_CLASS);
        let $fabContent = $fabElement.find(".dx-overlay-content");

        assert.ok($fabMainElement.length === 1, "create one main fab");
        assert.ok($fabElement.length === 3, "create two actions");

        assert.equal($fabMainContent.find(".dx-icon-add").length, 1, "default icon is applied");
        assert.equal($fabMainContent.find(".dx-icon-close").length, 1, "default close is applied");

        assert.equal($($fabContent[1]).find(".dx-icon-arrowdown").length, 1, "first action with arrowdown icon");
        assert.equal($($fabContent[2]).find(".dx-icon-arrowup").length, 1, "second action with arrowup icon");

        assert.equal(firstInstance.option("position").offset.y, -56, "right fist action position");
        assert.equal(secondInstance.option("position").offset.y, -92, "right second action position");

        firstInstance.option("icon", "find");
        secondInstance.option("icon", "filter");

        $fabElement = $("." + FAB_CLASS);
        $fabContent = $fabElement.find(".dx-overlay-content");

        assert.equal($($fabContent[1]).find(".dx-icon-find").length, 1, "first action icon changed on icon find");
        assert.equal($($fabContent[2]).find(".dx-icon-filter").length, 1, "second action icon changed on icon filter");
    });
});


QUnit.module("modify global action button config", (hooks) => {
    hooks.afterEach(() => {
        $("#fab-one").dxFloatingActionButton("instance").dispose();
        $("#fab-two").dxFloatingActionButton("instance").dispose();
    }),

    test("check main fab changes", (assert) => {
        config({
            floatingActionButtonConfig: {
                icon: "favorites",
                closeIcon: "cancel",
                position: "left top"
            }
        });

        $("#fab-one").dxFloatingActionButton();
        $("#fab-two").dxFloatingActionButton();

        const $fabMainElement = $("." + FAB_MAIN_CLASS);
        const $fabMainContent = $fabMainElement.find(".dx-overlay-content");

        assert.equal($fabMainContent.find(".dx-icon-favorites").length, 1, "default icon is changed");
        assert.equal($fabMainContent.find(".dx-icon-cancel").length, 1, "default close icon is changed");
        assert.equal($fabMainContent.offset().top, 0, "default position top is changed");
        assert.equal($fabMainContent.offset().left, 0, "default position left is changed");
    });

    test("main button has default icon if config has no icon", (assert) => {
        config({
            floatingActionButtonConfig: { }
        });

        $("#fab-one").dxFloatingActionButton({ icon: "home" });
        $("#fab-two").dxFloatingActionButton({ icon: "square" });

        const $fabMainElement = $("." + FAB_MAIN_CLASS);
        const $fabMainContent = $fabMainElement.find(".dx-overlay-content");
        const $fabMainContentIcons = $fabMainElement.find(".dx-icon");
        assert.equal($fabMainContent.find(".dx-icon-add").length, 1, "default icon is 'add'");
        assert.equal($fabMainContentIcons.length, 2, "only two icons rendered on the main button");
    });
});

QUnit.module("add or remove action buttons", (hooks) => {
    hooks.afterEach(() => {
        $("#fab-one").dxFloatingActionButton("instance").dispose();
        $("#fab-two").dxFloatingActionButton("instance").dispose();
    }),

    test("check rendering", (assert) => {
        config({
            floatingActionButtonConfig: {
                icon: "menu"
            }
        });

        $("#fab-one").dxFloatingActionButton({
            icon: "plus",
            hint: "Add a Row"
        });

        const $fabMainElement = $("." + FAB_MAIN_CLASS);
        const $fabMainContent = $fabMainElement.find(".dx-overlay-content");
        const fabMainOffsetY = 16;

        assert.equal($fabMainContent.find(".dx-icon-plus").length, 1, "default icon by config");
        assert.equal($fabMainElement.attr("title"), "Add a Row", "default hint by config");

        $("#fab-two").dxFloatingActionButton({
            icon: "trash",
            hint: "Delete Selected Rows"
        });

        assert.equal($fabMainContent.find(".dx-icon-menu").length, 1, "default icon is changed");
        assert.equal($fabMainElement.attr("title"), undefined, "default hint empty");

        $("#fab-two").dxFloatingActionButton("instance").dispose();

        const $fabElement = $("." + FAB_CLASS);
        const $fabContent = $fabElement.find(".dx-overlay-content");

        assert.equal($fabContent.parent(".dx-overlay-wrapper").length, 1, "action button content include in wrapper");
        assert.equal($fabContent.length, 1, "one action button");
        assert.equal($fabMainContent.find(".dx-icon-plus").length, 1, "use icon by option");

        $("#fab-one").dxFloatingActionButton("instance").option("icon", "favorites");

        assert.equal($fabMainContent.find(".dx-icon-favorites").length, 1, "use icon after change icon option");
        assert.equal($fabMainContent.offset().top, $(window).height() - fabMainOffsetY - $fabMainContent.height(), "use dafault position after change icon option");

        $("#fab-two").dxFloatingActionButton({
            icon: "trash",
            hint: "Delete Selected Rows"
        });

        assert.equal($fabMainContent.offset().top, $(window).height() - fabMainOffsetY - $fabMainContent.height(), "use dafault position");
    });
});

