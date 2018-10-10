import $ from "jquery";
import "ui/button";
import "ui/button_group";
import "common.css!";

const BUTTON_GROUP_CLASS = "dx-buttongroup",
    BUTTON_GROUP_WRAPPER_CLASS = "dx-buttongroup-wrapper",
    BUTTON_CLASS = "dx-button",
    DX_ITEM_SELECTED_CLASS = "dx-item-selected",
    DX_ITEM_CLASS = "dx-item";

QUnit.testStart(() => {
    const markup = `
        <div id="buttonGroup"></div>
        <div id="widget"></div>
    `;
    $("#qunit-fixture").html(markup);
});

QUnit.module("default", {
    beforeEach() {
        this.$buttonGroup = $("#buttonGroup").dxButtonGroup({
            items: [
                {
                    text: "left"
                },
                {
                    icon: "center icon",
                    type: "normal"
                }
            ]
        });

        this.buttonGroup = this.$buttonGroup.dxButtonGroup("instance");
    }
}, () => {
    QUnit.test("render markup", function(assert) {
        assert.equal(this.$buttonGroup.attr("role"), "buttongroup", "aria role");
        assert.ok(this.$buttonGroup.hasClass(BUTTON_GROUP_CLASS), "button group class");

        const $wrapper = $(this.$buttonGroup).children();
        assert.equal($wrapper.length, 1, "button group wrapper elements count");
        assert.ok($wrapper.eq(0).hasClass(BUTTON_GROUP_WRAPPER_CLASS), "css class for button collection");

        const $buttons = $(`.${BUTTON_GROUP_WRAPPER_CLASS} .${DX_ITEM_CLASS}.${BUTTON_CLASS}`);
        assert.equal($buttons.length, 2, "buttons count");
    });

    QUnit.test("render with default key", function(assert) {
        const $buttonGroup = $("#widget").dxButtonGroup({
            items: ["item 1", "item 2"],
        });

        const buttons = $buttonGroup.find(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton("instance"));
        assert.equal(buttons[0].option("text"), "item 1", "text of first button");
        assert.equal(buttons[1].option("text"), "item 2", "text of second button");
    });

    QUnit.test("check button's options", function(assert) {
        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton("instance"));
        assert.equal(buttons[0].option("text"), "left", "text of first button");
        assert.equal(buttons[1].option("icon"), "center icon", "icon of second button");
        assert.equal(buttons[1].option("type"), "normal", "type of second button");
    });

    QUnit.test("focused state is disabled by default for all buttons", function(assert) {
        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton("instance"));

        assert.equal(buttons[0].option("focusStateEnabled"), false, "first button");
        assert.equal(buttons[1].option("focusStateEnabled"), false, "second button");
    });

    QUnit.test("the active state is disabled by default for all buttons", function(assert) {
        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton("instance"));

        assert.equal(buttons[0].option("activeStateEnabled"), false, "first button");
        assert.equal(buttons[1].option("activeStateEnabled"), false, "second button");
    });

    QUnit.test("default options of buttons collection", function(assert) {
        const buttonGroup = $("#widget").dxButtonGroup({
            items: ["item 1", "item 2"],
            accessKey: "test key",
            selectedItemKeys: ["item 1"],
            tabIndex: 25
        }).dxButtonGroup("instance");

        const buttonCollection = buttonGroup._buttonsCollection;

        assert.equal(buttonCollection.option("items").length, 2, "items of data source count");
        assert.equal(buttonCollection.option("accessKey"), "test key", "accessKey option");
        assert.equal(buttonCollection.option("tabIndex"), 25, "tabIndex option");
        assert.equal(buttonCollection.option("selectedItemKeys"), "item 1", "selectedItemKeys option");
        assert.equal(buttonCollection.option("keyExpr"), null, "keyExpr option");
        assert.ok(buttonCollection.option("itemTemplate"), "itemTemplate option");
        assert.ok(buttonCollection.option("focusStateEnabled"), "focusStateEnabled option");
        assert.notOk(buttonCollection.option("scrollingEnabled"), "scrollingEnabled option");
        assert.equal(buttonCollection.option("noDataText"), "", "noDataText option");
    });

    QUnit.test("use item template", function(assert) {
        const $buttonGroup = $("#widget").dxButtonGroup({
            items: ["item 1", "item 2"],
            itemTemplate: (itemData, itemIndex, itemElement) => {
                itemElement.append($(`<span class="custom-template">${itemData + "_" + itemIndex}</span>`));
            }
        });

        const $templates = $buttonGroup.find(`.${DX_ITEM_CLASS} .custom-template`);
        assert.equal($templates.eq(0).text(), "item 1_0", "text of first template");
        assert.equal($templates.eq(1).text(), "item 2_1", "text of second template");
    });

    QUnit.test("apply the button type option to all buttons", function(assert) {
        const $buttonGroup = $("#widget").dxButtonGroup({
            items: ["item 1", "item 2"],
            buttonType: "danger"
        });

        const buttons = $buttonGroup.find(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton("instance"));
        assert.equal(buttons[0].option("type"), "danger");
        assert.equal(buttons[1].option("type"), "danger");
    });
});

QUnit.module("selection", () => {
    QUnit.test("single selection with selectedIndexes", function(assert) {
        $("#buttonGroup").dxButtonGroup({
            items: ["button 1", "button 2"],
            selectedIndexes: [1]
        });

        const $items = $(`.${DX_ITEM_CLASS}`);

        assert.notOk($items.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok($items.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
    });

    QUnit.test("multiple selection with selectedIndexes", function(assert) {
        $("#buttonGroup").dxButtonGroup({
            selectionMode: "multiple",
            items: ["button 1", "button 2"],
            selectedIndexes: [0, 1]
        });

        const $items = $(`.${DX_ITEM_CLASS}`);

        assert.ok($items.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok($items.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
    });

    QUnit.test("single selection with selectedItemKeys", function(assert) {
        $("#buttonGroup").dxButtonGroup({
            items: [{ text: "button 1" }, { text: "button 2" }],
            keyExpr: "text",
            selectedItemKeys: ["button 2"]
        });

        const $items = $(`.${DX_ITEM_CLASS}`);

        assert.notOk($items.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok($items.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
    });

    QUnit.test("multiple selection with selectedItemKeys", function(assert) {
        $("#buttonGroup").dxButtonGroup({
            selectionMode: "multiple",
            items: [{ text: "button 1" }, { text: "button 2" }],
            keyExpr: "text",
            selectedItemKeys: ["button 2", "button 1"]
        });

        const $items = $(`.${DX_ITEM_CLASS}`);

        assert.ok($items.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok($items.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
    });

    QUnit.test("Prepare the selecteItemKeys from the selectedIndexes", function(assert) {
        const buttonGroup = $("#buttonGroup").dxButtonGroup({
            selectionMode: "multiple",
            items: [{ text: "button 1" }, { text: "button 2" }],
            keyExpr: "text",
            selectedIndexes: [0, 1]
        }).dxButtonGroup("instance");

        assert.deepEqual(buttonGroup.option("selectedItemKeys"), ["button 1", "button 2"]);
    });

    QUnit.test("Prepare the selectedIndexes from the selectedItemKeys", function(assert) {
        const buttonGroup = $("#buttonGroup").dxButtonGroup({
            selectionMode: "multiple",
            items: [{ text: "button 1" }, { text: "button 2" }],
            keyExpr: "text",
            selectedItemKeys: ["button 2"]
        }).dxButtonGroup("instance");

        assert.deepEqual(buttonGroup.option("selectedIndexes"), [1]);
    });
});
