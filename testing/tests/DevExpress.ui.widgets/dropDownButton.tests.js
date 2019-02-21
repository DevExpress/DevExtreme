import $ from "jquery";
import DropDownButton from "ui/drop_down_button";

import "common.css!";

const DROP_DOWN_BUTTON_CLASS = "dx-dropdownbutton";

QUnit.testStart(() => {
    const markup = '<div id="dropDownButton"></div>';
    $("#qunit-fixture").html(markup);
});

const getPopup = (instance) => {
    return instance._popup;
};

const getList = (instance) => {
    return instance._list;
};

const getButtonGroup = (instance) => {
    return instance._buttonGroup;
};

QUnit.module("markup", {
    beforeEach: () => {
        this.instance = new DropDownButton("#dropDownButton", {});
    }
}, () => {
    QUnit.test("element should have dropDownButton class", assert => {
        assert.ok(this.instance.$element().hasClass(DROP_DOWN_BUTTON_CLASS), "class is ok");
    });

    QUnit.test("element should have buttonGroup inside", assert => {
        const buttonGroup = this.instance._buttonGroup;
        assert.strictEqual(buttonGroup.NAME, "dxButtonGroup", "buttonGroup rendered");
        assert.strictEqual(buttonGroup.option("selectionMode"), "none", "selection should be disabled");
        assert.strictEqual(buttonGroup.option("stylingMode"), "outlined", "styling mode should be outlined");

        const buttonGroupItems = buttonGroup.option("items");
        assert.strictEqual(buttonGroupItems.length, 2, "2 buttons are rendered");
        assert.strictEqual(buttonGroupItems[0].icon, "default", "empty icon is correct");
        assert.strictEqual(buttonGroupItems[1].icon, "chevrondown", "dropdown icon is correct");
    });

    QUnit.test("popup should not be rendered if deferRendering is false", assert => {
        assert.strictEqual(getPopup(this.instance), undefined, "popup should be lazy rendered");
        assert.strictEqual(getList(this.instance), undefined, "list should be lazy rendered");
    });

    QUnit.test("popup and list should be rendered on init when deferRendering is false", assert => {
        const dropDownButton = new DropDownButton("#dropDownButton", { deferRendering: false });
        const popup = getPopup(dropDownButton);

        assert.strictEqual(popup.NAME, "dxPopover", "popup has been rendered");
        assert.strictEqual(getList(dropDownButton).NAME, "dxList", "list has been rendered");
        assert.strictEqual(popup.option("target"), getButtonGroup(dropDownButton).element(), "popup has correct target");
        assert.ok(popup.option("closeOnOutsideClick"), "popup should be closed on outside click");
    });
});

QUnit.module("list integration", {}, () => {
    QUnit.test("list should be displayed correctly without data expressions", assert => {
        const dropDownButton = new DropDownButton("#dropDownButton", {
            items: ["Item 1"],
            deferRendering: false
        });
        const list = getList(dropDownButton);
        const $listItem = list.itemElements();

        assert.strictEqual($listItem.text(), "Item 1", "displayExpr works");
        assert.strictEqual(list.option("keyExpr"), null, "valueExpr is 'this'");
    });

    QUnit.test("data expressions should work with dropDownButton", assert => {
        const dropDownButton = new DropDownButton("#dropDownButton", {
            items: [{ key: 1, name: "Item 1", icon: "box" }],
            valueExpr: "key",
            displayExpr: "name",
            deferRendering: false
        });

        const list = getList(dropDownButton);
        const $listItem = list.itemElements();

        assert.strictEqual($listItem.text(), "Item 1", "displayExpr works");
        assert.strictEqual(list.option("keyExpr"), "key", "valueExpr works");
        // assert.strictEqual($listItem.find(".dx-icon-box").length, 1, "item icon works");
    });

    QUnit.test("some options should be transfered to the list", assert => {
        const dropDownButton = new DropDownButton("#dropDownButton", {
            items: [{ key: 1, name: "Item 1", icon: "box" }],
            deferRendering: false,
            grouped: true,
            noDataText: "No data",
            showSelectedItem: false
        });

        const list = getList(dropDownButton);

        assert.strictEqual(list.option("grouped"), true, "grouped option transfered");
        assert.strictEqual(list.option("noDataText"), "No data", "noDataText option transfered");
        assert.strictEqual(list.option("selectionMode"), "none", "selectionMode depends on showSelectedItem option");
    });

    QUnit.test("list selection should depend on value option", assert => {
        const dropDownButton = new DropDownButton("#dropDownButton", {
            items: [{ key: 1, name: "Item 1" }, { key: 2, name: "Item 2" }],
            deferRendering: false,
            valueExpr: "key",
            displayExpr: "name",
            value: 2
        });

        const list = getList(dropDownButton);
        assert.deepEqual(list.option("selectedItemKeys"), [2], "selection is correct");
    });
});
