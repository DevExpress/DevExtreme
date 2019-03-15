import $ from "jquery";
import DropDownButton from "ui/drop_down_button";
import typeUtils from "core/utils/type";
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
        assert.strictEqual(list.option("keyExpr"), "this", "keyExpr is 'this'");
    });

    QUnit.test("data expressions should work with dropDownButton", (assert) => {
        const dropDownButton = new DropDownButton("#dropDownButton", {
            items: [{ key: 1, name: "Item 1", icon: "box" }],
            keyExpr: "key",
            displayExpr: "name",
            deferRendering: false
        });

        const list = getList(dropDownButton);
        const $listItem = list.itemElements();

        assert.strictEqual($listItem.text(), "Item 1", "displayExpr works");
        assert.strictEqual(list.option("keyExpr"), "key", "keyExpr works");
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
            keyExpr: "key",
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
            keyExpr: "id",
            displayExpr: "name",
            onItemClick: this.itemClickHandler,
            items: [
                { id: 1, file: "vs.exe", name: "Trial for Visual Studio", icon: "box" },
                { id: 2, file: "all.exe", name: "Trial for all platforms", icon: "user" }
            ],
            selectedItem: { file: "common.exe", name: "Download DevExtreme Trial", icon: "group" }
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

QUnit.module("public methods", {
    beforeEach: () => {
        this.dropDownButton = new DropDownButton("#dropDownButton", {
            items: ["Item 1", "Item 2", "Item 3"],
            deferRendering: false
        });
    }
}, () => {
    QUnit.test("toggle method", (assert) => {
        const popup = getPopup(this.dropDownButton);
        assert.strictEqual(popup.option("visible"), false, "popup is closed");

        this.dropDownButton.toggle(true);
        assert.strictEqual(popup.option("visible"), true, "popup is opened");

        this.dropDownButton.toggle(true);
        assert.strictEqual(popup.option("visible"), true, "popup is still opened");

        this.dropDownButton.toggle(false);
        assert.strictEqual(popup.option("visible"), false, "popup is closed");

        this.dropDownButton.toggle();
        assert.strictEqual(popup.option("visible"), true, "popup visibility is inverted");

        const togglePromise = this.dropDownButton.toggle();
        assert.strictEqual(popup.option("visible"), false, "popup visibility is inverted");
        assert.ok(typeUtils.isPromise(togglePromise), "toggle should return promise");
    });

    QUnit.test("open method", (assert) => {
        const popup = getPopup(this.dropDownButton);
        assert.strictEqual(popup.option("visible"), false, "popup is closed");

        const openPromise = this.dropDownButton.open();
        assert.strictEqual(popup.option("visible"), true, "popup is opened");
        assert.ok(typeUtils.isPromise(openPromise), "open should return promise");
    });

    QUnit.test("close method", (assert) => {
        this.dropDownButton.option("dropDownOptions.visible", true);
        const popup = getPopup(this.dropDownButton);
        assert.strictEqual(popup.option("visible"), true, "popup is opened");

        const closePromise = this.dropDownButton.close();
        assert.strictEqual(popup.option("visible"), false, "popup is closed");
        assert.ok(typeUtils.isPromise(closePromise), "close should return promise");
    });
});

QUnit.module("data expressions", {
    beforeEach: () => {
        this.dropDownButton = new DropDownButton("#dropDownButton", {
            items: [
                { id: 1, file: "vs.exe", name: "Trial for Visual Studio", icon: "box" },
                { id: 2, file: "all.exe", name: "Trial for all platforms", icon: "user" }
            ],
            keyExpr: "id",
            showSelectedItem: true,
            deferRendering: false
        });
    }
}, () => {
    QUnit.test("displayExpr is required when items are objects", (assert) => {
        this.dropDownButton.option("displayExpr", undefined);
        this.dropDownButton.option("selectedItem", {
            id: 1,
            file: "vs.exe",
            name: "Trial for Visual Studio",
            icon: "box"
        });

        assert.strictEqual(getActionButton(this.dropDownButton).text(), String({}));
    });

    QUnit.test("displayExpr as function should work", (assert) => {
        this.dropDownButton.option("displayExpr", (itemData) => {
            return itemData.name + "!";
        });

        this.dropDownButton.option("selectedItem", {
            id: 2,
            file: "all.exe",
            name: "Trial for all platforms",
            icon: "user"
        });
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

QUnit.module("deferred datasource", {
    beforeEach: () => {
        this.items = [
            { id: 1, name: "Left", icon: "alignleft" },
            { id: 4, name: "Right", icon: "alignright" },
            { id: 2, name: "Center", icon: "aligncenter" },
            { id: 3, name: "Justify", icon: "alignjustify" }
        ];
        this.clock = sinon.useFakeTimers();
        this.dataSourceConfig = {
            load: () => {
                const d = $.Deferred();
                setTimeout(() => {
                    d.resolve(this.items.slice());
                }, 500);
                return d.promise();
            },
            byKey: (key) => {
                const d = $.Deferred();
                setTimeout(() => {
                    const item = $.grep(this.items, (item) => {
                        return item.id === key;
                    });
                    d.resolve(item);
                }, 200);

                return d.promise();
            }
        };
    },
    afterEach: () => {
        this.clock.restore();
    }
}, () => {
    QUnit.test("displayExpr should work with deferred datasource", (assert) => {
        const dropDownButton = new DropDownButton("#dropDownButton2", {
            displayExpr: "name",
            dataSource: this.dataSourceConfig,
        });

        dropDownButton.open();
        this.clock.tick(500);

        const list = getList(dropDownButton);
        const $item = list.itemElements().eq(0);

        assert.strictEqual($item.text(), "Left", "text is correct");
    });

    QUnit.test("incomplete selected item should work", (assert) => {
        const dropDownButton = new DropDownButton("#dropDownButton2", {
            dataSource: this.dataSourceConfig,
            keyExpr: "id",
            displayExpr: "name",
            selectedItem: { id: 2 }
        });

        this.clock.tick(200);
        assert.strictEqual(getActionButton(dropDownButton).text(), "Center", "value is correct");
    });
});

QUnit.module("events", {}, () => {
    QUnit.test("onItemClick event", (assert) => {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton("#dropDownButton2", {
            items: [1, 2, 3],
            onItemClick: handler
        });

        dropDownButton.open();
        const $item = getList(dropDownButton).itemElements().eq(0);

        eventsEngine.trigger($item, "dxclick");
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, "handler was called");
        assert.strictEqual(e.component, dropDownButton, "component is correct");
        assert.strictEqual(e.element, dropDownButton.element(), "element is correct");
        assert.strictEqual(e.event.type, "dxclick", "event is correct");
        assert.strictEqual(e.itemData, 1, "itemData is correct");
        assert.strictEqual(e.itemElement, $item.get(0), "itemElement is correct");
        assert.strictEqual(e.itemIndex, undefined, "itemIndex was removed");
    });

    QUnit.test("onItemClick event change", (assert) => {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton("#dropDownButton2", {
            items: [1, 2, 3]
        });

        dropDownButton.open();
        dropDownButton.option("onItemClick", handler);

        const $item = getList(dropDownButton).itemElements().eq(0);
        eventsEngine.trigger($item, "dxclick");

        assert.strictEqual(handler.callCount, 1, "handler was called");
    });

    QUnit.test("onActionButtonClick event", (assert) => {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton("#dropDownButton2", {
            items: [1, 2, 3],
            selectedItem: 2,
            onActionButtonClick: handler
        });

        const $actionButton = getActionButton(dropDownButton);

        eventsEngine.trigger($actionButton, "dxclick");
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, "handler was called");
        assert.strictEqual(e.component, dropDownButton, "component is correct");
        assert.strictEqual(e.element, dropDownButton.element(), "element is correct");
        assert.strictEqual(e.event.type, "dxclick", "event is correct");
        assert.strictEqual(e.selectedItem, 2, "itemData is correct");
    });

    QUnit.test("onActionButtonClick event change", (assert) => {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton("#dropDownButton2", {
            items: [1, 2, 3],
            selectedItem: 2
        });

        dropDownButton.option("onActionButtonClick", handler);
        const $actionButton = getActionButton(dropDownButton);

        eventsEngine.trigger($actionButton, "dxclick");

        assert.strictEqual(handler.callCount, 1, "handler was called");
    });

    QUnit.test("onSelectionChanged event", (assert) => {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton("#dropDownButton2", {
            items: [1, 2, 3],
            selectedItem: 2,
            onSelectionChanged: handler
        });

        dropDownButton.open();
        const $item = getList(dropDownButton).itemElements().eq(0);

        eventsEngine.trigger($item, "dxclick");
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, "handler was called");
        assert.strictEqual(e.component, dropDownButton, "component is correct");
        assert.strictEqual(e.element, dropDownButton.element(), "element is correct");
        assert.strictEqual(e.oldSelectedItem, 2, "oldSelectedItem is correct");
        assert.strictEqual(e.selectedItem, 1, "selectedItem is correct");
    });

    QUnit.test("onSelectionChanged event with data expressions", (assert) => {
        const handler = sinon.spy();
        const items = [{ id: 1, text: "Item 1" }, { id: 2, text: "Item 2" }];
        const dropDownButton = new DropDownButton("#dropDownButton2", {
            items: items,
            keyExpr: "id",
            displayExpr: "text",
            selectedItem: { id: 2 },
            onSelectionChanged: handler
        });

        dropDownButton.open();
        const $item = getList(dropDownButton).itemElements().eq(0);

        eventsEngine.trigger($item, "dxclick");
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, "handler was called");
        assert.strictEqual(e.component, dropDownButton, "component is correct");
        assert.strictEqual(e.element, dropDownButton.element(), "element is correct");
        assert.deepEqual(e.oldSelectedItem, items[1], "oldSelectedItem is correct");
        assert.deepEqual(e.selectedItem, items[0], "selectedItem is correct");
        assert.strictEqual(e.selectedItem.onClick, undefined, "onClick should not be added to the selectedItem");
        assert.strictEqual(e.oldSelectedItem.onClick, undefined, "onClick should not be added to the oldSelectedItem");
    });
});
