import $ from "jquery";
import "ui/button";
import "ui/button_group";
import devices from "core/devices";
import registerKeyHandlerTestHelper from '../../helpers/registerKeyHandlerTestHelper.js';
import "common.css!";

const BUTTON_CLASS = "dx-button",
    BUTTON_GROUP_CLASS = "dx-buttongroup",
    BUTTON_GROUP_ITEM_CLASS = BUTTON_GROUP_CLASS + "-item",
    BUTTON_GROUP_ITEM_HAS_WIDTH = BUTTON_GROUP_CLASS + "-item-has-width";

QUnit.testStart(() => {
    const markup = `
        <div id="buttonGroup"></div>
        <div id="widget"></div>
    `;
    $("#qunit-fixture").html(markup);
});

QUnit.module("option changed", {
    createButtonGroup(options) {
        options = options || {
            items: [{ text: "button 1" }, { text: "button 2" }]
        };
        return $("#buttonGroup").dxButtonGroup(options).dxButtonGroup("instance");
    },
    beforeEach() {
        this.buttonGroup = this.createButtonGroup();
        this.$buttonGroup = this.buttonGroup.$element();
    }
}, () => {
    QUnit.test("change hover state for all buttons", function(assert) {
        this.buttonGroup.option("hoverStateEnabled", false);
        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton("instance"));

        assert.equal(buttons[0].option("hoverStateEnabled"), false, "first button");
        assert.equal(buttons[1].option("hoverStateEnabled"), false, "second button");
    });

    QUnit.test("change hover state for all buttons", function(assert) {
        this.buttonGroup.option("focusStateEnabled", false);
        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton("instance"));

        assert.equal(buttons[0].option("focusStateEnabled"), false, "first button");
        assert.equal(buttons[1].option("focusStateEnabled"), false, "second button");
    });

    QUnit.test("change active state for all buttons", function(assert) {
        this.buttonGroup.option("activeStateEnabled", true);
        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton("instance"));

        assert.equal(buttons[0].option("activeStateEnabled"), true, "first button");
        assert.equal(buttons[1].option("activeStateEnabled"), true, "second button");
    });

    QUnit.test("change items", function(assert) {
        this.buttonGroup.option("items", [{
            text: "left"
        }, {
            text: "right"
        }]);

        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton("instance"));
        assert.equal(buttons[0].option("text"), "left", "text of first button");
        assert.equal(buttons[1].option("text"), "right", "text of second button");
    });

    QUnit.test("change the width option", function(assert) {
        this.buttonGroup.option("width", 500);

        const buttonsSelector = `.${BUTTON_CLASS}`;
        let buttons = $(buttonsSelector);

        assert.equal(this.$buttonGroup.width(), 500, "button group width");
        assert.ok(buttons.eq(0).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH), "first item when button group has width");
        assert.ok(buttons.eq(1).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH), "second item when button group has width");
    });

    QUnit.test("change the width option when item has template", function(assert) {
        const buttonGroup = this.createButtonGroup({
            items: [{ text: "button 1" }, { text: "button 2" }],
            itemTemplate: () => "<div/>",
        });

        buttonGroup.option("width", 500);

        let $items = $(`.${BUTTON_GROUP_ITEM_CLASS}`);
        assert.equal(buttonGroup.$element().width(), 500, "button group width");
        assert.ok($items.eq(0).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH), "first item when button group has width");
        assert.ok($items.eq(1).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH), "second item when button group has width");
    });

    QUnit.test("change the stylingMode option", function(assert) {
        this.buttonGroup.option("stylingMode", "text");

        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton("instance"));

        assert.equal(buttons[0].option("stylingMode"), "text", "first button");
        assert.equal(buttons[1].option("stylingMode"), "text", "second button");
    });
});

if(devices.current().deviceType === "desktop") {
    registerKeyHandlerTestHelper.runTests(QUnit, "dxButtonGroup");
}
