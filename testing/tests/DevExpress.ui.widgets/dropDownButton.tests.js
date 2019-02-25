import $ from "jquery";
import DropDownButton from "ui/drop_down_button";
import eventsEngine from "events/core/events_engine";

import "common.css!";

const DROP_DOWN_BUTTON_CLASS = "dx-dropdownbutton";
const DROP_DOWN_BUTTON_CONTENT = "dx-dropdownbutton-content";
const DROP_DOWN_BUTTON_ACTION_CLASS = "dx-dropdownbutton-action";
const DROP_DOWN_BUTTON_TOGGLE_CLASS = "dx-dropdownbutton-toggle";

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

    QUnit.test("popup and list should not be rendered if deferRendering is true", assert => {
        assert.strictEqual(getPopup(this.instance), undefined, "popup should be lazy rendered");
        assert.strictEqual(getList(this.instance), undefined, "list should be lazy rendered");
    });

    QUnit.test("popup and list should be rendered on init when deferRendering is false", assert => {
        const dropDownButton = new DropDownButton("#dropDownButton", { deferRendering: false });
        const popup = getPopup(dropDownButton);

        assert.strictEqual(popup.NAME, "dxPopup", "popup has been rendered");
        assert.strictEqual(getList(dropDownButton).NAME, "dxList", "list has been rendered");
        assert.strictEqual(popup.option("target"), getButtonGroup(dropDownButton).element(), "popup has correct target");
        assert.ok(popup.option("closeOnOutsideClick"), "popup should be closed on outside click");
    });
});

QUnit.module("button group integration", {}, () => {
    QUnit.test("element should have buttonGroup inside", assert => {
        const instance = new DropDownButton("#dropDownButton", {});
        const buttonGroup = getButtonGroup(instance);
        assert.strictEqual(buttonGroup.NAME, "dxButtonGroup", "buttonGroup rendered");
        assert.strictEqual(buttonGroup.option("selectionMode"), "none", "selection should be disabled");
        assert.strictEqual(buttonGroup.option("stylingMode"), "outlined", "styling mode should be outlined");

        const buttonGroupItems = buttonGroup.option("items");
        assert.strictEqual(buttonGroupItems.length, 2, "2 buttons are rendered");
        assert.strictEqual(buttonGroupItems[0].icon, "default", "empty icon is correct");
        assert.strictEqual(buttonGroupItems[1].icon, "spindown", "dropdown icon is correct");
    });

    QUnit.test("it should be possible to redefine one item using buttonGroupOptions", assert => {
        const clickHandler = sinon.spy();
        const instance = new DropDownButton("#dropDownButton", {
            buttonGroupOptions: {
                items: [{}, { onClick: clickHandler }]
            }
        });
        const toggleButton = instance.$element().find(".dx-button").eq(1);

        eventsEngine.trigger(toggleButton, "dxclick");
        assert.strictEqual(clickHandler.callCount, 1, "handler has been redefined");
        assert.strictEqual(toggleButton.find(".dx-icon-spindown").length, 1, "icon has not been redefined");
    });

    QUnit.test("action and toggle button should have special class", assert => {
        const instance = new DropDownButton("#dropDownButton", {});

        assert.ok(instance.$element().find(".dx-button").eq(0).hasClass(DROP_DOWN_BUTTON_ACTION_CLASS));
        assert.ok(instance.$element().find(".dx-button").eq(1).hasClass(DROP_DOWN_BUTTON_TOGGLE_CLASS));
    });
});

QUnit.module("popup integration", {
    beforeEach: () => {
        this.instance = new DropDownButton("#dropDownButton", {
            deferRendering: false,
            items: [{ text: "Item 1" }, { text: "Item 2" }]
        });
        this.popup = getPopup(this.instance);
    }
}, () => {
    QUnit.test("popup content should have special class", assert => {
        assert.ok(this.popup.content().hasClass(DROP_DOWN_BUTTON_CONTENT), "popup has special class");
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
        assert.strictEqual($listItem.find(".dx-icon-box").length, 1, "item icon works");
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
