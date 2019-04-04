import $ from "jquery";
import config from "core/config";

import "ui/action_button";
import "common.css!";
import "generic_light.css!";

QUnit.testStart(function() {
    const markup =
        '<div id="fab-one"></div>\
        <div id="fab-two"></div>\
        <div id="fabs"></div>';

    $("#qunit-fixture").html(markup);
});

const FAB_CLASS = "dx-fa-button";
const FAB_MAIN_CLASS = "dx-fa-button-main";

QUnit.module("create one action");

QUnit.test("check rendering", function(assert) {
    this.instance = $("#fab-one")
        .dxFloatingActionButton()
        .dxFloatingActionButton("instance");

    const $fabElement = $("." + FAB_CLASS);
    const $fabContent = $fabElement.find(".dx-overlay-content");
    const clickHandler = sinon.spy();

    assert.ok($fabElement.length === 1, "one action button created");
    assert.ok($fabElement.hasClass(FAB_MAIN_CLASS), "it is main action button");
    assert.equal($fabContent.find(".dx-icon-add").length, 1, "default icon created");
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

QUnit.module("maxActionButtonCount option");

QUnit.test("check action buttons count", function(assert) {
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

QUnit.module("create multiple actions", {
    beforeEach: function() {
        this.firstElement = $("#fab-one").dxFloatingActionButton({ icon: "arrowdown" });
        this.secondElement = $("#fab-two").dxFloatingActionButton({ icon: "arrowup" });
        this.firstInstance = this.firstElement.dxFloatingActionButton("instance");
        this.secondInstance = this.secondElement.dxFloatingActionButton("instance");
    }
});

QUnit.test("check rendering", function(assert) {
    const $fabMainElement = $("." + FAB_MAIN_CLASS);
    const $fabMainContent = $fabMainElement.find(".dx-overlay-content");
    let $fabElement = $("." + FAB_CLASS);
    let $fabContent = $fabElement.find(".dx-overlay-content");

    assert.ok($fabMainElement.length === 1, "create one main fab");
    assert.ok($fabElement.length === 3, "create two actions");

    assert.equal($fabMainContent.find(".dx-icon-add").length, 1, "default icon is apllyed");
    assert.equal($fabMainContent.find(".dx-icon-close").length, 1, "default close is apllyed");

    assert.equal($($fabContent[1]).find(".dx-icon-arrowdown").length, 1, "first action with arrowdown icon");
    assert.equal($($fabContent[2]).find(".dx-icon-arrowup").length, 1, "second action with arrowup icon");

    assert.equal(this.firstInstance.option("position").offset.y, -56, "right fist action position");
    assert.equal(this.secondInstance.option("position").offset.y, -92, "right second action position");

    this.firstInstance.option("icon", "find");
    this.secondInstance.option("icon", "filter");

    $fabElement = $("." + FAB_CLASS);
    $fabContent = $fabElement.find(".dx-overlay-content");

    assert.equal($($fabContent[1]).find(".dx-icon-find").length, 1, "first action icon changed on icon find");
    assert.equal($($fabContent[2]).find(".dx-icon-filter").length, 1, "second action icon changed on icon filter");
});

QUnit.module("modify global action button config");

QUnit.test("check main fab changes", function(assert) {
    config({
        floatingActionButtonConfig: {
            icon: "favorites",
            closeIcon: "cancel",
            position: "left top"
        }
    });

    $("#fab-one").dxFloatingActionButton();

    const $fabMainElement = $("." + FAB_MAIN_CLASS);
    const $fabMainContent = $fabMainElement.find(".dx-overlay-content");

    assert.equal($fabMainContent.find(".dx-icon-favorites").length, 1, "default icon is changed");
    assert.equal($fabMainContent.find(".dx-icon-cancel").length, 1, "default close icon is changed");
    assert.equal($fabMainContent.offset().top, 9, "default position top is changed");
    assert.equal($fabMainContent.offset().left, 9, "default position left is changed");

});
