import $ from "jquery";
import "ui/button";
import "ui/button_group";
import "common.css!";

const BUTTON_CLASS = "dx-button",
    BUTTON_GROUP_CLASS = "dx-buttongroup",
    BUTTON_GROUP_ITEM_CLASS = BUTTON_GROUP_CLASS + "-item",
    BUTTON_GROUP_ITEM_HAS_WIDTH = BUTTON_GROUP_CLASS + "-item-has-width",
    DX_ITEM_SELECTED_CLASS = "dx-item-selected";

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

    QUnit.test("change selection via the selectedItems in the single mode", function(assert) {
        this.buttonGroup.option("selectedItems", [{ text: "button 2" }]);

        const $buttons = this.$buttonGroup.find(`.${BUTTON_CLASS}`);
        assert.notOk($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS), "first item is not selected");
        assert.ok($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS), "second item is selected");
        assert.deepEqual(this.buttonGroup.option("selectedItemKeys"), ["button 2"], "selectedItemKeys");
    });

    QUnit.test("change selection via the selectedItems in the multiple mode", function(assert) {
        const $buttonGroup = $("#widget").dxButtonGroup({
            items: [{ text: "button 1" }, { text: "button 2" }],
            selectionMode: "multiple"
        });

        const buttonGroup = $buttonGroup.dxButtonGroup("instance");
        buttonGroup.option("selectedItems", [{ text: "button 1" }, { text: "button 2" }]);

        const $buttons = $buttonGroup.find(`.${BUTTON_CLASS}`);
        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS), "first item is selected");
        assert.ok($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS), "second item is selected");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["button 1", "button 2"], "selectedItemKeys");
    });

    QUnit.test("change selection via the selectedItemKeys in the single mode", function(assert) {
        this.buttonGroup.option("selectedItemKeys", ["button 2"]);

        const $buttons = this.$buttonGroup.find(`.${BUTTON_CLASS}`);
        assert.notOk($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS), "first item is not selected");
        assert.ok($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS), "second item is selected");
        assert.deepEqual(this.buttonGroup.option("selectedItems"), [{ text: "button 2" }], "selectedItems");
    });

    QUnit.test("change selection via the selectedItemKeys in the multiple mode", function(assert) {
        this.buttonGroup.option("selectionMode", "multiple");
        this.buttonGroup.option("selectedItemKeys", ["button 1", "button 2"]);

        const $buttons = this.$buttonGroup.find(`.${BUTTON_CLASS}`);
        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS), "first item is selected");
        assert.ok($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS), "second item is selected");
        assert.deepEqual(this.buttonGroup.option("selectedItems"), [{ text: "button 1" }, { text: "button 2" }], "selectedItems");
    });

    QUnit.test("change the onSelectionChanged event", function(assert) {
        const stub = sinon.stub();
        this.buttonGroup.option("onSelectionChanged", stub);
        this.buttonGroup.option("selectedItemKeys", ["button 2"]);

        assert.equal(stub.callCount, 1);
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

QUnit.module("selection", () => {
    QUnit.test("change selection in the single by click", function(assert) {
        const $buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: [{ text: "button 1" }, { text: "button 2" }]
        });

        const buttonGroup = $buttonGroup.dxButtonGroup("instance");
        const $buttons = $buttonGroup.find(`.${BUTTON_CLASS}`);

        $buttons.eq(0).trigger("dxclick");
        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.notOk($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedItems"), [{ text: "button 1" }], "selectedItems");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["button 1"], "selectedItemKeys");

        $buttons.eq(1).trigger("dxclick");
        assert.notOk($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedItems"), [{ text: "button 2" }], "selectedItems");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["button 2"], "selectedItemKeys");
    });

    QUnit.test("deselect does not happen for the single selection mode", function(assert) {
        const $buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: [{ text: "button 1" }, { text: "button 2" }]
        });

        const buttonGroup = $buttonGroup.dxButtonGroup("instance");
        const $buttons = $buttonGroup.find(`.${BUTTON_CLASS}`);
        const $button = $buttonGroup.find(`.${BUTTON_CLASS}`).first();

        $button.trigger("dxclick");
        $button.trigger("dxclick");

        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.notOk($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedItems"), [{ text: "button 1" }], "selectedItems");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["button 1"], "selectedItemKeys");
    });

    QUnit.test("change election in the multiple mode by click", function(assert) {
        const $buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: [{ text: "button 1" }, { text: "button 2" }],
            selectionMode: "multiple"
        });

        const buttonGroup = $buttonGroup.dxButtonGroup("instance");
        const $buttons = $buttonGroup.find(`.${BUTTON_CLASS}`);

        $buttons.eq(0).trigger("dxclick");
        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.notOk($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedItems"), [{ text: "button 1" }], "selectedItems");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["button 1"], "selectedItemKeys");

        $buttons.eq(1).trigger("dxclick");
        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedItems"), [{ text: "button 1" }, { text: "button 2" }], "selectedItems");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["button 1", "button 2"], "selectedItemKeys");
    });

    QUnit.test("deselect all buttons in the multiple mode", function(assert) {
        const $buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: [{ text: "button 1" }, { text: "button 2" }],
            selectedItemKeys: ["button 1", "button 2"],
            selectionMode: "multiple"
        });

        const buttonGroup = $buttonGroup.dxButtonGroup("instance");
        const $buttons = $buttonGroup.find(`.${BUTTON_CLASS}`);

        $buttons.eq(0).trigger("dxclick");
        $buttons.eq(1).trigger("dxclick");

        assert.notOk($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.notOk($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedItems"), [], "selectedItems");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), [], "selectedItemKeys");
    });

    QUnit.test("сheck a selection with the custom keyExpr", function(assert) {
        const $buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: [{
                icon: "leftIcon",
                alignment: "left"
            },
            {
                icon: "centerIcon",
                alignment: "center"
            },
            {
                icon: "rightIcon",
                alignment: "right"
            }],
            keyExpr: "alignment",
            selectionMode: "multiple"
        });

        const buttonGroup = $buttonGroup.dxButtonGroup("instance");
        const $buttons = $buttonGroup.find(`.${BUTTON_CLASS}`);

        $buttons.eq(0).trigger("dxclick");
        $buttons.eq(2).trigger("dxclick");

        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok($buttons.eq(2).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedItems"), [{
            icon: "leftIcon",
            alignment: "left"
        }, {
            icon: "rightIcon",
            alignment: "right"
        }], "selectedItems");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["left", "right"], "selectedItemKeys");
    });

    QUnit.test("сheck a selection with the default keyExpr", function(assert) {
        const $buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: [{
                icon: "leftIcon",
                text: "left"
            },
            {
                icon: "centerIcon",
                text: "center"
            },
            {
                icon: "rightIcon",
                text: "right"
            }],
            selectionMode: "multiple"
        });

        const buttonGroup = $buttonGroup.dxButtonGroup("instance");
        const $buttons = $buttonGroup.find(`.${BUTTON_CLASS}`);

        $buttons.eq(0).trigger("dxclick");
        $buttons.eq(2).trigger("dxclick");

        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok($buttons.eq(2).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedItems"), [
            { icon: "leftIcon", text: "left" },
            { icon: "rightIcon", text: "right" }
        ], "selectedItems");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["left", "right"], "selectedItemKeys");
    });

    QUnit.test("onSelectedChanged event", function(assert) {
        let selectedItems;
        const $buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: [{
                text: "button 1",
                icon: "icon 1"
            }, {
                text: "button 2",
                icon: "icon 2"
            }],
            onSelectionChanged: (e) => {
                selectedItems = {
                    addedItems: e.addedItems,
                    removedItems: e.removedItems
                };
            },
            selectionMode: "multiple"
        });

        const $buttons = $buttonGroup.find(`.${BUTTON_CLASS}`);

        $buttons.eq(0).trigger("dxclick");
        assert.deepEqual(selectedItems, {
            addedItems: [{
                text: "button 1",
                icon: "icon 1"
            }],
            removedItems: []
        });

        $buttons.eq(1).trigger("dxclick");
        assert.deepEqual(selectedItems, {
            addedItems: [{
                text: "button 2",
                icon: "icon 2"
            }],
            removedItems: []
        });

        $buttons.eq(1).trigger("dxclick");
        assert.deepEqual(selectedItems, {
            addedItems: [],
            removedItems: [{
                text: "button 2",
                icon: "icon 2"
            }]
        });
    });
});
