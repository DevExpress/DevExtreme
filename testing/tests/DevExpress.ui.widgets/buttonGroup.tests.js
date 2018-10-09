import $ from "jquery";
import "ui/button";
import "ui/button_group";
import "common.css!";

const BUTTON_CLASS = "dx-button",
    DX_ITEM_SELECTED_CLASS = "dx-item-selected";

QUnit.testStart(() => {
    const markup = `
        <div id="buttonGroup"></div>
        <div id="widget"></div>
    `;
    $("#qunit-fixture").html(markup);
});

QUnit.module("option changed", {
    beforeEach() {
        this.$buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: ["button 1", "button 2"]
        });

        this.buttonGroup = this.$buttonGroup.dxButtonGroup("instance");
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

    QUnit.test("change selection via the selectedIndexes in the single mode", function(assert) {
        this.buttonGroup.option("selectedIndexes", [1]);

        const $buttons = this.$buttonGroup.find(`.${BUTTON_CLASS}`);
        assert.notOk($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS), "first item is not selected");
        assert.ok($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS), "second item is selected");
        assert.deepEqual(this.buttonGroup.option("selectedItemKeys"), ["button 2"], "selectedItemKeys");
    });

    QUnit.test("change selection via the selectedIndexes in the multiple mode", function(assert) {
        this.buttonGroup.option("selectionMode", "multiple");
        this.buttonGroup.option("selectedIndexes", [0, 1]);

        const $buttons = this.$buttonGroup.find(`.${BUTTON_CLASS}`);
        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS), "first item is selected");
        assert.ok($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS), "second item is selected");
        assert.deepEqual(this.buttonGroup.option("selectedItemKeys"), ["button 1", "button 2"], "selectedItemKeys");
    });

    QUnit.test("change selection via the selectedItemKeys in the single mode", function(assert) {
        this.buttonGroup.option("selectedItemKeys", ["button 2"]);

        const $buttons = this.$buttonGroup.find(`.${BUTTON_CLASS}`);
        assert.notOk($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS), "first item is not selected");
        assert.ok($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS), "second item is selected");
        assert.deepEqual(this.buttonGroup.option("selectedIndexes"), [1], "selectedIndexes");
    });

    QUnit.test("change selection via the selectedItemKeys in the multiple mode", function(assert) {
        this.buttonGroup.option("selectionMode", "multiple");
        this.buttonGroup.option("selectedItemKeys", ["button 1", "button 2"]);

        const $buttons = this.$buttonGroup.find(`.${BUTTON_CLASS}`);
        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS), "first item is selected");
        assert.ok($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS), "second item is selected");
        assert.deepEqual(this.buttonGroup.option("selectedIndexes"), [0, 1], "selectedIndexes");
    });
});

QUnit.module("selection", () => {
    QUnit.test("change selection in the single by click", function(assert) {
        const $buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: ["button 1", "button 2"]
        });

        const buttonGroup = $buttonGroup.dxButtonGroup("instance");
        const $buttons = $buttonGroup.find(`.${BUTTON_CLASS}`);

        $buttons.eq(0).trigger("dxclick");
        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.notOk($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedIndexes"), [0], "selectedIndexes");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["button 1"], "selectedItemKeys");

        $buttons.eq(1).trigger("dxclick");
        assert.notOk($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedIndexes"), [1], "selectedIndexes");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["button 2"], "selectedItemKeys");
    });

    QUnit.test("deselect does not happen for the single selection mode", function(assert) {
        const $buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: ["button 1", "button 2"]
        });

        const buttonGroup = $buttonGroup.dxButtonGroup("instance");
        const $buttons = $buttonGroup.find(`.${BUTTON_CLASS}`);
        const $button = $buttonGroup.find(`.${BUTTON_CLASS}`).first();

        $button.trigger("dxclick");
        $button.trigger("dxclick");

        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.notOk($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedIndexes"), [0], "selectedIndexes");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["button 1"], "selectedItemKeys");
    });

    QUnit.test("change election in the multiple mode by click", function(assert) {
        const $buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: ["button 1", "button 2"],
            selectionMode: "multiple"
        });

        const buttonGroup = $buttonGroup.dxButtonGroup("instance");
        const $buttons = $buttonGroup.find(`.${BUTTON_CLASS}`);

        $buttons.eq(0).trigger("dxclick");
        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.notOk($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedIndexes"), [0], "selectedIndexes");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["button 1"], "selectedItemKeys");

        $buttons.eq(1).trigger("dxclick");
        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedIndexes"), [0, 1], "selectedIndexes");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["button 1", "button 2"], "selectedItemKeys");
    });

    QUnit.test("deselect all buttons in the multiple mode", function(assert) {
        const $buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: ["button 1", "button 2"],
            selectedIndexes: [0, 1],
            selectionMode: "multiple"
        });

        const buttonGroup = $buttonGroup.dxButtonGroup("instance");
        const $buttons = $buttonGroup.find(`.${BUTTON_CLASS}`);

        $buttons.eq(0).trigger("dxclick");
        $buttons.eq(1).trigger("dxclick");

        assert.notOk($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.notOk($buttons.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedIndexes"), [], "selectedIndexes");
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
        assert.deepEqual(buttonGroup.option("selectedIndexes"), [0, 2], "selectedIndexes");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["left", "right"], "selectedItemKeys");
    });

    QUnit.test("сheck a selection with the default keyExpr", function(assert) {
        const $buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: [{
                icon: "leftIcon"
            },
            {
                icon: "centerIcon"
            },
            {
                icon: "rightIcon"
            }],
            selectionMode: "multiple"
        });

        const buttonGroup = $buttonGroup.dxButtonGroup("instance");
        const $buttons = $buttonGroup.find(`.${BUTTON_CLASS}`);

        $buttons.eq(0).trigger("dxclick");
        $buttons.eq(2).trigger("dxclick");

        assert.ok($buttons.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok($buttons.eq(2).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.deepEqual(buttonGroup.option("selectedIndexes"), [0, 2], "selectedIndexes");
        assert.deepEqual(buttonGroup.option("selectedItemKeys"), [{ icon: "leftIcon" }, { icon: "rightIcon" }], "selectedItemKeys");
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
