import $ from "jquery";
import DropDownButton from "ui/drop_down_button";
import eventsEngine from "events/core/events_engine";

import "common.css!";

const DROP_DOWN_BUTTON_CLASS = "dx-dropdownbutton";
const DROP_DOWN_BUTTON_CONTENT = "dx-dropdownbutton-content";
const DROP_DOWN_BUTTON_ACTION_CLASS = "dx-dropdownbutton-action";
const DROP_DOWN_BUTTON_TOGGLE_CLASS = "dx-dropdownbutton-toggle";

QUnit.testStart(() => {
    const markup = '' +
        '<div id="dropDownButton"></div>' +
        '<div id="dropDownButton2"></div>';
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

const getActionButton = (instance) => {
    return instance.$element().find(`.${DROP_DOWN_BUTTON_ACTION_CLASS}`);
};

QUnit.module("markup", {
    beforeEach: () => {
        this.instance = new DropDownButton("#dropDownButton", {});
    }
}, () => {
    QUnit.test("element should have dropDownButton class", (assert) => {
        assert.ok(this.instance.$element().hasClass(DROP_DOWN_BUTTON_CLASS), "class is ok");
    });

    QUnit.test("popup and list should not be rendered if deferRendering is true", (assert) => {
        assert.strictEqual(getPopup(this.instance), undefined, "popup should be lazy rendered");
        assert.strictEqual(getList(this.instance), undefined, "list should be lazy rendered");
    });

    QUnit.test("popup and list should be rendered on init when deferRendering is false", (assert) => {
        const dropDownButton = new DropDownButton("#dropDownButton2", { deferRendering: false });
        const popup = getPopup(dropDownButton);

        assert.strictEqual(popup.NAME, "dxPopup", "popup has been rendered");
        assert.strictEqual(getList(dropDownButton).NAME, "dxList", "list has been rendered");
        assert.ok(popup.option("closeOnOutsideClick"), "popup should be closed on outside click");
    });
});

QUnit.module("button group integration", {}, () => {
    QUnit.test("element should have buttonGroup inside", (assert) => {
        const instance = new DropDownButton("#dropDownButton", {});
        const buttonGroup = getButtonGroup(instance);
        assert.strictEqual(buttonGroup.NAME, "dxButtonGroup", "buttonGroup rendered");
        assert.strictEqual(buttonGroup.option("selectionMode"), "none", "selection should be disabled");
        assert.strictEqual(buttonGroup.option("stylingMode"), "outlined", "styling mode should be outlined");

        const buttonGroupItems = buttonGroup.option("items");
        assert.strictEqual(buttonGroupItems.length, 2, "2 buttons are rendered");
        assert.strictEqual(buttonGroupItems[0].icon, undefined, "empty icon is correct");
        assert.strictEqual(buttonGroupItems[1].icon, "spindown", "dropdown icon is correct");
    });

    QUnit.test("action and toggle button should have special class", (assert) => {
        const instance = new DropDownButton("#dropDownButton", {});

        assert.ok(instance.$element().find(".dx-button").eq(0).hasClass(DROP_DOWN_BUTTON_ACTION_CLASS));
        assert.ok(instance.$element().find(".dx-button").eq(1).hasClass(DROP_DOWN_BUTTON_TOGGLE_CLASS));
    });

    QUnit.test("a user can redefine buttonGroupOptions", (assert) => {
        const instance = new DropDownButton("#dropDownButton", {
            showSelectedItem: false,
            buttonGroupOptions: {
                items: [{ text: "Test" }],
                someOption: "Test"
            }
        });

        const buttonGroup = getButtonGroup(instance);
        assert.strictEqual(buttonGroup.option("items[0].text"), "Test", "text of the first item is correct");
        assert.strictEqual(buttonGroup.option("items[0].icon"), undefined, "icon of the first item is correct");
        assert.strictEqual(buttonGroup.option("items[1]"), undefined, "second item is not exist");

        instance.option("buttonGroupOptions.items[0]", { text: "Test 2" });
        assert.strictEqual(buttonGroup.option("items[0].text"), "Test 2", "text of the first item is correct");
    });

    QUnit.test("a user can read buttonGroupOptions", (assert) => {
        const instance = new DropDownButton("#dropDownButton", {});

        assert.strictEqual(instance.option("buttonGroupOptions.stylingMode"), "outlined", "option is correct");
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
    QUnit.test("popup content should have special class", (assert) => {
        assert.ok($(this.popup.content()).hasClass(DROP_DOWN_BUTTON_CONTENT), "popup has special class");
    });

    QUnit.test("popup should have correct options after rendering", (assert) => {
        const buttonGroupElement = getButtonGroup(this.instance).element();
        const options = {
            deferRendering: this.instance.option("deferRendering"),
            minWidth: 130,
            closeOnOutsideClick: true,
            showTitle: false,
            animation: {
                show: { type: "fade", duration: 0, from: 0, to: 1 },
                hide: { type: "fade", duration: 400, from: 1, to: 0 }
            },
            width: "auto",
            height: "auto",
            shading: false,
            position: {
                of: buttonGroupElement,
                collision: "flipfit",
                my: "top right",
                at: "bottom right",
                offset: {
                    y: -1
                }
            }
        };

        for(let name in options) {
            assert.deepEqual(this.popup.option(name), options[name], "option " + name + " is correct");
        }
    });
});

QUnit.module("list integration", {}, () => {
    QUnit.test("list should be displayed correctly without data expressions", (assert) => {
        const dropDownButton = new DropDownButton("#dropDownButton", {
            items: ["Item 1"],
            deferRendering: false
        });
        const list = getList(dropDownButton);
        const $listItem = list.itemElements();

        assert.strictEqual($listItem.text(), "Item 1", "displayExpr works");
        assert.strictEqual(list.option("keyExpr"), null, "valueExpr is 'this'");
    });

    QUnit.test("data expressions should work with dropDownButton", (assert) => {
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

    QUnit.test("some options should be transfered to the list", (assert) => {
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
        assert.strictEqual(list.option("selectionMode"), "single", "selectionMode is always single. The widget uses selectedItems to prevent extra dataSource loads");
    });

    QUnit.test("list selection should depend on selectedItem option", (assert) => {
        const dropDownButton = new DropDownButton("#dropDownButton", {
            items: [{ key: 1, name: "Item 1" }, { key: 2, name: "Item 2" }],
            deferRendering: false,
            valueExpr: "key",
            displayExpr: "name",
            selectedItem: { key: 2 }
        });

        const list = getList(dropDownButton);
        assert.deepEqual(list.option("selectedItemKeys"), [2], "selection is correct");

        dropDownButton.option("selectedItem", { key: 1 });
        assert.deepEqual(list.option("selectedItemKeys"), [1], "selection is correct");
    });
});

QUnit.module("common use cases", {
    beforeEach: () => {
        this.itemClickHandler = sinon.spy();
        this.dropDownButton = new DropDownButton("#dropDownButton", {
            showSelectedItem: false,
            deferRendering: false,
            valueExpr: "id",
            displayExpr: "name",
            onItemClick: this.itemClickHandler,
            items: [
                { id: 1, file: "vs.exe", name: "Trial for Visual Studio", icon: "box" },
                { id: 2, file: "all.exe", name: "Trial for all platforms", icon: "user" }
            ],
            selectedItem: { file: "common.exe", text: "Download DevExtreme Trial", icon: "group" }
        });
        this.list = getList(this.dropDownButton);
        this.listItems = this.list.itemElements();
    }
}, () => {
    QUnit.test("it should be possible to set non-datasource action button", (assert) => {
        assert.strictEqual(getActionButton(this.dropDownButton).text(), "Download DevExtreme Trial", "initial text is correct");

        eventsEngine.trigger(this.listItems.eq(0), "dxclick");

        assert.strictEqual(this.itemClickHandler.callCount, 1, "item clicked");
        assert.strictEqual(this.itemClickHandler.getCall(0).args[0].itemData.id, 1, "vs.exe clicked");
        assert.strictEqual(getActionButton(this.dropDownButton).text(), "Download DevExtreme Trial", "initial text was not changed");
        assert.notOk(getPopup(this.dropDownButton).option("visible"), "popup is hidden");
    });

    QUnit.test("custom item should be redefined after selection if showSelectedItem is true", (assert) => {
        this.dropDownButton.option("showSelectedItem", true);
        eventsEngine.trigger(this.listItems.eq(0), "dxclick");
        assert.strictEqual(getActionButton(this.dropDownButton).text(), "Trial for Visual Studio", "action button has been changed");
    });

    QUnit.test("prevent default behavior for the itemClick action", (assert) => {
        const clickHandler = sinon.stub().returns(false);
        this.dropDownButton.option("onItemClick", clickHandler);

        this.dropDownButton.toggle(true);
        eventsEngine.trigger(this.listItems.eq(0), "dxclick");
        assert.strictEqual(clickHandler.callCount, 1, "clickHandler called");
        assert.ok(getPopup(this.dropDownButton).option("visible"), "default behavior has been prevented");
    });
});

QUnit.module("data expressions", {
    beforeEach: () => {
        this.dropDownButton = new DropDownButton("#dropDownButton", {
            items: [
                { id: 1, file: "vs.exe", name: "Trial for Visual Studio", icon: "box" },
                { id: 2, file: "all.exe", name: "Trial for all platforms", icon: "user" }
            ],
            valueExpr: "id",
            showSelectedItem: true,
            deferRendering: false
        });
    }
}, () => {
    QUnit.test("displayExpr is required when items are objects", (assert) => {
        this.dropDownButton.option("displayExpr", undefined);
        this.dropDownButton.option("value", 2);

        assert.strictEqual(getActionButton(this.dropDownButton).text(), String({}));
    });

    QUnit.test("displayExpr as function should work", (assert) => {
        this.dropDownButton.option("displayExpr", (itemData) => {
            return itemData.name + "!";
        });

        this.dropDownButton.option("value", 2);
        assert.strictEqual(getActionButton(this.dropDownButton).text(), "Trial for all platforms!", "displayExpr works");
    });

    QUnit.test("null value should be displayed as an empty string", (assert) => {
        const dropDownButton = new DropDownButton("#dropDownButton2", {
            items: ["Item 1", "Item 2", "Item 3"],
            selectedItem: null
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), "", "value is correct");
    });

    QUnit.test("undefined value should be displayed as an empty string", (assert) => {
        const dropDownButton = new DropDownButton("#dropDownButton2", {
            items: ["Item 1", "Item 2", "Item 3"],
            selectedItem: undefined
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), "", "value is correct");
    });

    QUnit.test("primitive items can be used without data expressions", (assert) => {
        const dropDownButton = new DropDownButton("#dropDownButton2", {
            items: ["Item 1", "Item 2", "Item 3"],
            selectedItem: "Item 1"
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), "Item 1", "value is correct");
    });

    QUnit.test("numbers can be used without data expressions", (assert) => {
        const dropDownButton = new DropDownButton("#dropDownButton2", {
            items: [0, 1, 2],
            selectedItem: 0
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), "0", "value is correct");
    });

    QUnit.test("booleans can be used without data expressions", (assert) => {
        const dropDownButton = new DropDownButton("#dropDownButton2", {
            items: [true, false],
            selectedItem: false
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), "false", "value is correct");
    });
});
