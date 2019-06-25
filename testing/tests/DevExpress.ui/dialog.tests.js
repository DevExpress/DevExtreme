import $ from "jquery";
import config from "core/config";
import devices from "core/devices";
import dialog from "ui/dialog";
import domUtils from "core/utils/dom";
import errors from "ui/widget/ui.errors";
import fx from "animation/fx";
import keyboardMock from "../../helpers/keyboardMock.js";
import { value as viewPort } from "core/utils/view_port";

const { module, test, testInActiveWindow } = QUnit;

module("dialog tests", {
    beforeEach: () => {
        viewPort("#qunit-fixture");

        fx.off = true;

        this.title = "Title here";
        this.messageHtml = "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>";
        this.dialog = () => {
            return $(".dx-dialog-wrapper");
        };
        this.thereIsDialog = () => {
            return this.dialog().length === 1;
        };
        this.thereIsNoDialog = () => {
            return this.dialog().length === 0;
        };
        this.clickButton = (index) => {
            index = index || 0;
            this.dialog()
                .find(".dx-dialog-button")
                .eq(index)
                .trigger("dxclick");
        };
        this.isPopupDraggable = () => $(".dx-popup").dxPopup("instance").option("dragEnabled");
    },
    afterEach: () => {
        fx.off = false;
    }
}, () => {
    test("dialog show/hide by Escape (T686065)", (assert) => {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "desktop specific test");
            return;
        }

        dialog.alert();
        assert.ok(this.thereIsDialog());
        keyboardMock(this.dialog().find(".dx-overlay-content").get(0)).keyDown("esc");
        assert.ok(this.thereIsNoDialog());
    });

    test("dialog show/hide", (assert) => {
        let instance;
        const options = {
            title: this.title,
            messageHtml: this.messageHtml
        };
        const result = "DialogResultValue";

        const afterHide = function(value) {
            assert.equal(value, result, "Dialog's deferred object were resolved with right value.");
        };

        assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");

        // by 'hide' calling
        instance = dialog.custom(options);
        instance.show().done(afterHide);
        assert.ok(this.thereIsDialog(), "Dialog is shown.");
        instance.hide(result);
        assert.ok(this.thereIsNoDialog(), "Dialog is not shown after 'hide' was called.");

        // by clicking button
        instance = dialog.custom(options);
        instance.show();
        assert.ok(this.thereIsDialog(), "Dialog is shown.");
        this.clickButton();
        assert.ok(this.thereIsNoDialog(), "Dialog is not shown after button was clicked.");
    });

    testInActiveWindow("first button in dialog obtained focus on shown", (assert) => {
        if(devices.real().platform !== "generic") {
            assert.ok(true, "focus is absent on mobile devices");
            return;
        }
        dialog.alert("Sample message", "Alert");

        assert.equal($(".dx-dialog-wrapper").find(".dx-state-focused").length, 1, "button obtained focus");
    });

    test("dialog content", (assert) => {
        let instance;
        let options = {
            title: this.title,
            messageHtml: this.messageHtml
        };

        instance = dialog.custom(options);
        instance.show();

        assert.equal(this.dialog().find(".dx-popup-title").text(), this.title, "Actual title is equal to expected.");
        assert.equal((this.dialog().find(".dx-dialog-message").html() || "").toLowerCase(), this.messageHtml.toLowerCase(), "Actual message is equal to expected.");
        instance.hide();

        assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");

        options = {
            messageHtml: this.messageHtml
        };
        assert.equal(instance.title, undefined, "dialog.title value isn't set.");

        dialog.title = this.title;
        instance = dialog.custom(options);
        instance.show();

        assert.equal(this.dialog().find(".dx-popup-title").text(), this.title, "Dialog default title is used.");

        instance.hide();

        assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");
    });

    test("dialog content without title", (assert) => {
        const options = {
            title: this.title,
            messageHtml: this.messageHtml,
            showTitle: false
        };
        const instance = dialog.custom(options);

        instance.show();

        assert.equal(this.dialog().find(".dx-popup-title").length, 0, "Actual title is equal not expected.");
    });

    test("popup drag enabled", (assert) => {
        const testPopupDrag = (dialogDragEnabled, expectedPopupDragEnabled, message) => {
            const options = {
                title: this.title,
                messageHtml: this.messageHtml,
                dragEnabled: dialogDragEnabled
            };
            const instance = dialog.custom(options);

            instance.show();

            assert.equal(this.isPopupDraggable(), expectedPopupDragEnabled, message);
            instance.hide();
        };

        testPopupDrag(true, true, "drag was not enabled");
        testPopupDrag(false, false, "drag was not disabled");
        testPopupDrag(undefined, true, "drag was not enabled");
    });

    test("alert dialog without title should not be draggable", assert => {
        const testPopupDrag = (showTitle, expectedPopupDragEnabled, message) => {
            dialog.alert(this.messageHtml, "alert title", showTitle);

            assert.equal(this.isPopupDraggable(), expectedPopupDragEnabled, message);

            this.clickButton();
        };

        testPopupDrag(true, true, "drag was not enabled");
        testPopupDrag(false, false, "drag was not disabled");
        testPopupDrag(undefined, true, "drag was not enabled");
    });

    test("confirm dialog without title should not be draggable", assert => {
        const testPopupDrag = (showTitle, expectedPopupDragEnabled, message) => {
            dialog.confirm(this.messageHtml, "confirm title", showTitle);

            assert.equal(this.isPopupDraggable(), expectedPopupDragEnabled, message);

            this.clickButton();
        };

        testPopupDrag(true, true, "drag was not enabled");
        testPopupDrag(false, false, "drag was not disabled");
        testPopupDrag(undefined, true, "drag was not enabled");
    });

    test("dialog buttons", (assert) => {
        let actual;
        const expected = "ButtonReturnValue#2";
        const options = {
            title: this.title,
            messageHtml: this.messageHtml,
            buttons: [{
                text: "ButtonCaption#1",
                onClick: function() {
                    return "ButtonReturnValue#1";
                }
            }, {
                text: "ButtonCaption#2",
                onClick: function() {
                    return "ButtonReturnValue#2";
                }
            }]
        };

        assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");

        const instance = dialog.custom(options);
        instance.show().done((value) => actual = value);

        assert.ok(this.thereIsDialog(), "Dialog is shown.");
        assert.equal(this.dialog().find(".dx-dialog-button").length, 2, "There are two custom buttons.");

        this.clickButton(1);

        assert.equal(actual, expected, "Actual value is equal to expected.");
        assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");
    });

    test("alert dialog", (assert) => {
        assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");

        dialog.title = this.title;
        dialog.alert(this.messageHtml);

        assert.ok(this.thereIsDialog(), "Dialog is shown.");
        assert.equal(this.dialog().find(".dx-popup-title").text(), this.title, "Dialog default title is used.");

        const $bottom = this.dialog().find(".dx-popup-bottom");

        assert.equal($bottom.length, 1, "Dialog bottom is rendered");
        assert.equal($bottom.find(".dx-button").length, 1, "Dialog has button");

        this.clickButton();

        assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");
    });

    test("confirm dialog", (assert) => {
        let actual;

        assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");

        dialog.confirm(this.messageHtml, this.title).done((value) => actual = value);

        this.clickButton();

        assert.strictEqual(actual, true, "Confirm result value is equal to expected.");
        assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");
    });

    test("dialog overlay content has 'dx-rtl' class when RTL is enabled", (assert) => {
        config({ rtlEnabled: true });

        dialog.confirm(this.messageHtml, this.title);

        assert.ok($('.dx-overlay-content').hasClass('dx-rtl'), "'dx-rlt' class is present");

        config({ rtlEnabled: false });
    });

    test("should show 'W1013' warning if deprecated 'message' option is used", (assert) => {
        const originalLog = errors.log;
        let warning = null;

        errors.log = (loggedWarning) => warning = loggedWarning;

        try {
            dialog.custom({ message: "message" });
            assert.strictEqual(warning, "W1013");
        } finally {
            errors.log = originalLog;
        }
    });

    test("dialog should reset active element on showing", (assert) => {
        const options = {
            title: "title",
            messageHtml: "message"
        };
        const resetActiveElementStub = sinon.stub(domUtils, "resetActiveElement");

        try {
            const instance = dialog.custom(options);
            instance.show();
            assert.equal(resetActiveElementStub.callCount, 1);
            instance.hide();
        } finally {
            resetActiveElementStub.reset();
        }
    });

    test("it should be possible to redefine popup option in the dialog", (assert) => {
        dialog.custom({
            title: "Test Title",
            popupOptions: {
                customOption: "Test",
                title: "Popup title",
                height: 300
            }
        }).show();

        const popup = $(".dx-popup").dxPopup("instance");

        assert.equal(popup.option("customOption"), "Test", "custom option is defined");
        assert.equal(popup.option("title"), "Popup title", "user option is redefined");
        assert.equal(popup.option("height"), 300, "default option is redefined");
    });

    test("it should apply correct arguments to the button 'onClick' handler", (assert) => {
        const clickStub = sinon.stub();

        dialog.custom({
            buttons: [{
                text: "Test",
                onClick: clickStub
            }]
        }).show();

        this.clickButton(0);

        const clickArgs = clickStub.lastCall.args[0];

        assert.ok(Object.prototype.hasOwnProperty.call(clickArgs, "component"));
        assert.ok(Object.prototype.hasOwnProperty.call(clickArgs, "event"));
        assert.strictEqual(clickArgs.component.NAME, "dxButton");
    });
});
