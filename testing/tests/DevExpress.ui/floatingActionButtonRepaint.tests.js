import $ from "jquery";
import config from "core/config";
import floatingActionButtonRepaint from "ui/floating_action_button_repaint";

import "ui/speed_dial_action";
import "common.css!";
import "generic_light.css!";

const { test } = QUnit;

QUnit.testStart(() => {
    const markup =
        '<div id="fab-one"></div>\
        <div id="fab-two"></div>';

    $("#qunit-fixture").html(markup);
});

const FAB_MAIN_CLASS = "dx-fa-button-main";

QUnit.module("apply current config options", (hooks) => {
    hooks.afterEach(() => {
        config({
            floatingActionButtonConfig: {
                position: {
                    at: "right bottom",
                    my: "right bottom",
                    offset: "-16 -16"
                }
            }
        });
    }),

    test("repaint with multiple actions", (assert) => {
        $("#fab-one").dxSpeedDialAction();
        $("#fab-two").dxSpeedDialAction();

        const $fabMainElement = $("." + FAB_MAIN_CLASS);
        const $fabMainContent = $fabMainElement.find(".dx-overlay-content");
        const fabDimensions = 64;

        assert.equal($fabMainContent.offset().top, $(window).height() - fabDimensions, "default position top");
        assert.equal($fabMainContent.offset().left, $(window).width() - fabDimensions, "default position left");
        assert.equal($fabMainContent.find(".dx-icon-add").length, 1, "default icon");
        assert.equal($fabMainContent.find(".dx-icon-close").length, 1, "default close icon");

        config({
            floatingActionButtonConfig: {
                position: "left top",
                icon: "edit",
                closeIcon: "cancel"
            }
        });

        floatingActionButtonRepaint();

        assert.equal($fabMainContent.find(".dx-icon-edit").length, 1, "default icon is changed");
        assert.equal($fabMainContent.find(".dx-icon-cancel").length, 1, "default close icon is changed");
        assert.equal($fabMainContent.offset().top, 0, "default position top is changed");
        assert.equal($fabMainContent.offset().left, 0, "default position left is changed");
    });

    test("repaint with one action", (assert) => {
        const firstSDA = $("#fab-one").dxSpeedDialAction().dxSpeedDialAction("instance");
        $("#fab-two").dxSpeedDialAction({ icon: "trash" });

        const $fabMainElement = $("." + FAB_MAIN_CLASS);
        const $fabMainContent = $fabMainElement.find(".dx-overlay-content");
        const fabDimensions = 64;

        assert.equal($fabMainContent.offset().top, $(window).height() - fabDimensions, "default position top");
        assert.equal($fabMainContent.offset().left, $(window).width() - fabDimensions, "default position left");
        assert.equal($fabMainContent.find(".dx-icon-add").length, 1, "default icon");
        assert.equal($fabMainContent.find(".dx-icon-close").length, 1, "default close icon");

        config({
            floatingActionButtonConfig: {
                position: "left top",
                icon: "edit",
                closeIcon: "cancel"
            }
        });

        firstSDA.dispose();
        floatingActionButtonRepaint();

        assert.equal($fabMainContent.find(".dx-icon-trash").length, 1, "default icon is changed");
        assert.equal($fabMainContent.find(".dx-icon-cancel").length, 1, "default close icon is changed");
        assert.equal($fabMainContent.offset().top, 0, "default position top is changed");
        assert.equal($fabMainContent.offset().left, 0, "default position left is changed");
    });
});
