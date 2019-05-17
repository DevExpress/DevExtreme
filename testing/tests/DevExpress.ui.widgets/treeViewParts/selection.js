/* global initTree */

import $ from "jquery";
import keyboardMock from "../../../helpers/keyboardMock.js";
import eventsEngine from "events/core/events_engine";

let { module, test } = QUnit;

const WIDGET_CLASS = "dx-treeview";
const NODE_CLASS = "dx-treeview-node";
const ITEM_CLASS = "dx-treeview-item";
const SELECTED_ITEM_CLASS = "dx-state-selected";
const CHECK_BOX_CLASS = "dx-checkbox";
const CHECK_BOX_CHECKED_CLASS = "dx-checkbox-checked";

class TreeViewTestWrapper {
    constructor(instance) {
        this.instance = instance;
    }

    getElement() {
        return this.instance._$element;
    }

    getNodes() {
        return this.getElement().find(`.${NODE_CLASS}`);
    }

    getItems() {
        return this.getElement().find(`.${ITEM_CLASS}`);
    }

    getSelectedNodes() {
        return this.getElement().find(`.${NODE_CLASS}.${SELECTED_ITEM_CLASS}`);
    }

    getCheckBoxes() {
        return this.getElement().find(`.${CHECK_BOX_CLASS}`);
    }

    getAllSelectedCheckboxes() {
        return this.getElement().find(`.${CHECK_BOX_CHECKED_CLASS}`);
    }
}

const createInstance = function(options) {
    const instance = initTree(options).dxTreeView("instance");

    return new TreeViewTestWrapper(instance);
};

module("selection common", () => {
    test("selection should work without checkboxes on init", function(assert) {
        const items = [{ text: "item 1", selected: true }, { text: "item 2" }];
        const treeView = createInstance({
            items: items,
            showCheckBoxesMode: "none"
        });

        assert.ok(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), "node should be selected");
        assert.ok(items[0].selected, "item should be selected");

        assert.notOk(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), "node should not be selected");
        assert.notOk(items[1].selected, "item should not be selected");
    });

    test("selection methods should work with item keys", function(assert) {
        const items = [{ text: "item 1", selected: true }, { text: "item 2" }];
        const treeView = createInstance({
            items: items
        });

        treeView.instance.unselectItem(1);
        assert.notOk(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), "node should not be selected");
        assert.notOk(items[0].selected, "item should not be selected");

        treeView.instance.selectItem(2);
        assert.ok(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), "node should be selected");
        assert.ok(items[1].selected, "item should be selected");
    });

    test("selection methods should work with itemElements", function(assert) {
        const items = [{ text: "item 1", selected: true }, { text: "item 2" }];
        const treeView = createInstance({
            items: items
        });

        treeView.instance.unselectItem(treeView.getNodes().eq(0).find(`.${ITEM_CLASS}`).eq(0));
        assert.notOk(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), "node should not be selected");
        assert.notOk(items[0].selected, "item should not be selected");

        treeView.instance.selectItem(treeView.getNodes().eq(1).find(`.${ITEM_CLASS}`).eq(0));
        assert.ok(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), "node should be selected");
        assert.ok(items[1].selected, "item should be selected");
    });

    test("selection methods should work with dom itemElements", function(assert) {
        const items = [{ text: "item 1", selected: true }, { text: "item 2" }];
        const treeView = createInstance({
            items: items
        });

        treeView.instance.unselectItem(treeView.getNodes().eq(0).find(`.${ITEM_CLASS}`).eq(0).get(0));
        assert.notOk(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), "node should not be selected");
        assert.notOk(items[0].selected, "item should not be selected");

        treeView.instance.selectItem(treeView.getNodes().eq(1).find(`.${ITEM_CLASS}`).eq(0).get(0));
        assert.ok(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), "node should be selected");
        assert.ok(items[1].selected, "item should be selected");
    });

    test("selectionChanged should fire only when selection was changed", function(assert) {
        let selectionChangedHandler = sinon.spy();
        const items = [{ text: "item 1", selected: true }, { text: "item 2", items: [{ text: "item 21" }] }];
        const treeView = createInstance({
            items: items,
            selectNodesRecursive: true,
            onSelectionChanged: selectionChangedHandler
        });

        treeView.instance.selectItem(1);
        treeView.instance.selectItem(2);
        treeView.instance.unselectItem(1);

        assert.equal(selectionChangedHandler.callCount, 2, "selectionChanged should call twice");
    });

    test("onItemSelectionChanged should have correct arguments", function(assert) {
        let itemSelectionChangedHandler = sinon.spy();
        const treeView = createInstance({
            items: [{ text: "Item 1", id: 2 }],
            onItemSelectionChanged: itemSelectionChangedHandler
        });

        treeView.instance.selectItem(2);

        assert.equal(itemSelectionChangedHandler.callCount, 1, "selection was changed once");

        // note: other parameters are redundant but they were saved in the code to prevent a BC
        assert.equal(itemSelectionChangedHandler.getCall(0).args[0].component.NAME, treeView.instance.NAME, "component is correct");
        assert.ok($(itemSelectionChangedHandler.getCall(0).args[0].element).hasClass(WIDGET_CLASS), "element is correct");
        assert.equal(itemSelectionChangedHandler.getCall(0).args[0].node.key, 2, "node is correct");
        assert.ok($(itemSelectionChangedHandler.getCall(0).args[0].itemElement).hasClass(ITEM_CLASS), "itemElement is correct");
    });

    test("itemSelected should fire when select", function(assert) {
        let itemSelectionChangedHandler = sinon.spy();
        const treeView = createInstance({
            items: [{ text: "item 1", selected: true }, { text: "item 2" }],
            onItemSelectionChanged: itemSelectionChangedHandler
        });

        treeView.instance.selectItem(2);

        assert.equal(itemSelectionChangedHandler.callCount, 1, "event was fired");
    });

    test("itemSelected should not fire when selection was not changed", function(assert) {
        let itemSelectionChangedHandler = sinon.spy();
        const treeView = createInstance({
            items: [{ text: "item 1", selected: true }, { text: "item 2" }],
            onItemSelectionChanged: itemSelectionChangedHandler
        });

        treeView.instance.selectItem(1);

        assert.equal(itemSelectionChangedHandler.callCount, 0, "event was not fired");
    });

    test("disabled item should be selectable via api", function(assert) {
        const items = [{ text: "item 1", disabled: true }, { text: "item 2", disabled: true, selected: true }];
        const treeView = createInstance({
            items: items,
            showCheckBoxesMode: "normal"
        });

        treeView.instance.selectItem(1);
        assert.ok(items[0].selected, "item should be selected");

        treeView.instance.unselectItem(1);
        assert.notOk(items[0].selected, "item should not be selected");

        assert.ok(items[1].selected, "item should be selected");
        assert.ok(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), "item should be selected");
    });

    test("all nodes should have selected class if they have selected property", function(assert) {
        const items = [{ text: "item 1", selected: true, expanded: true, items: [{ text: "item 11", selected: true }] }, { text: "item 2", selected: true }];
        const treeView = createInstance({
            items: items,
            showCheckBoxesMode: "none"
        });

        assert.equal(treeView.getSelectedNodes().length, 3, "all nodes should have selected class");
    });

    test("should not fire an error when try to select unspecified item", function(assert) {
        const items = [{ text: "item 1", selected: true, expanded: true, items: [{ text: "item 11", selected: true }] }, { text: "item 2", selected: true }];
        const treeView = createInstance({ items: items });

        try {
            treeView.instance.selectItem(null);
        } catch(e) {
            assert.notOk(true, "Error has been raised");
        } finally {
            assert.ok(true);
        }
    });

    test("should not fire an error when item contains 'nodeType' field", function(assert) {
        const treeView = createInstance({ items: [{ id: 1, nodeType: "test" }] });

        try {
            treeView.instance.selectItem({ id: 1, nodeType: "test" });
        } catch(e) {
            assert.notOk(true, "Error has been raised");
        } finally {
            assert.step("Test completed");
        }
    });
});

module("Selection mode", () => {
    test("Items: [{ text: 'item 1', selected: true }, { text: 'item 2' }], single -> multiple, click(item 2)", (assert) => {
        const items = [{ text: "item 1", selected: true }, { text: "item 2" }];
        const treeView = createInstance({
            items: items,
            selectionMode: "single",
            selectByClick: true,
            showCheckBoxesMode: "normal"
        });

        assert.equal(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), true, "node is selected");
        assert.equal(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), false, "node is selected");

        treeView.instance.option("selectionMode", "multiple");
        eventsEngine.trigger(treeView.getItems().eq(1), "dxclick");

        assert.equal(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), true, "node is selected");
        assert.equal(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), true, "node is selected");
    });

    test("Items: [{ text: 'item 1'}, { text: 'item 2' }], multiple -> single, click(item1, item 2)", (assert) => {
        const items = [{ text: "item 1" }, { text: "item 2" }];
        const treeView = createInstance({
            items: items,
            selectionMode: "multiple",
            selectByClick: true,
            showCheckBoxesMode: "normal"
        });

        eventsEngine.trigger(treeView.getItems().eq(0), "dxclick");

        assert.equal(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), true, "node is selected");
        assert.equal(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), false, "node is selected");

        treeView.instance.option("selectionMode", "single");
        eventsEngine.trigger(treeView.getItems().eq(1), "dxclick");

        assert.equal(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), false, "node is selected");
        assert.equal(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), true, "node is selected");
    });
});

module("selection single", () => {
    test("only one node should be selected on init", function(assert) {
        const items = [{ text: "item 1", selected: true }, { text: "item 2", selected: true }];
        const treeView = createInstance({ items: items, selectionMode: "single" });

        assert.notOk(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), "node should not be selected");
        assert.ok(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), "node should be selected");
    });

    test("only one node should be selected on selection change", function(assert) {
        const items = [{ text: "item 1", selected: true }, { text: "item 2" }];
        const treeView = createInstance({ items: items, selectionMode: "single" });

        treeView.instance.selectItem(2);

        assert.notOk(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), "node should not be selected");
        assert.ok(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), "node should be selected");
    });

    test("last item should not be deselected when selectionRequired is used with checkboxes", function(assert) {
        const treeView = createInstance({
            items: [{ id: 1, text: "item 1", selected: true }],
            showCheckBoxesMode: "normal",
            selectionMode: "single",
            selectionRequired: true
        });

        let $checkBox = treeView.getNodes().find(`.${CHECK_BOX_CLASS}`);

        eventsEngine.trigger($checkBox, "dxclick");

        assert.ok(treeView.getNodes().hasClass(SELECTED_ITEM_CLASS), "node is selected");
        assert.deepEqual(treeView.instance.getSelectedNodesKeys(), [1], "node was not removed from selected nodes array");
        assert.ok($checkBox.dxCheckBox("instance").option("value"), "node's checkbox is still checked");
    });

    test("last item should not be deselected when selectionRequired is used without checkboxes", function(assert) {
        const treeView = createInstance({
            items: [{ id: 1, text: "item 1", selected: true }],
            showCheckBoxesMode: "none",
            selectionMode: "single",
            selectByClick: true,
            selectionRequired: true
        });

        let $item = treeView.getNodes().children(`.${ITEM_CLASS}`);

        eventsEngine.trigger($item, "dxclick");

        assert.ok(treeView.getNodes().hasClass(SELECTED_ITEM_CLASS), "node is selected");
        assert.deepEqual(treeView.instance.getSelectedNodesKeys(), [1], "node was not removed from selected nodes array");
    });

    test("last item should not be deselected when selectionRequired is used with api", function(assert) {
        const treeView = createInstance({
            items: [{ id: 1, text: "item 1", selected: true }],
            showCheckBoxesMode: "none",
            selectionMode: "single",
            selectionRequired: true
        });

        treeView.instance.unselectItem(1);

        assert.ok(treeView.getNodes().hasClass(SELECTED_ITEM_CLASS), "node is selected");
        assert.deepEqual(treeView.instance.getSelectedNodesKeys(), [1], "node was not removed from selected nodes array");
    });

    test("last item should not be deselected when selectionRequired is used with multiple selection", function(assert) {
        const treeView = createInstance({
            items: [{ id: 1, text: "item 1", selected: true }, { id: 2, text: "item 2", selected: true }],
            showCheckBoxesMode: "none",
            selectionMode: "multiple",
            selectionRequired: true
        });

        treeView.instance.unselectItem(1);
        assert.notOk(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), "node is not selected");
        assert.deepEqual(treeView.instance.getSelectedNodesKeys(), [2], "node was removed from selected nodes array");

        treeView.instance.unselectItem(2);
        assert.ok(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), "node is selected");
        assert.deepEqual(treeView.instance.getSelectedNodesKeys(), [2], "node was not removed from selected nodes array");
    });

    test("last item should not be deselected when selectionRequired is used with recursive selection", function(assert) {
        const treeView = createInstance({
            items: [{ id: 1, text: "item 1", selected: true, expanded: true, items: [{ id: 11, text: "Item 11" }] }],
            showCheckBoxesMode: "none",
            selectionMode: "multiple",
            selectNodesRecursive: true,
            selectionRequired: true
        });

        treeView.instance.unselectItem(1);
        assert.ok(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), "root node is selected");
        assert.ok(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), "leaf node is selected");
        assert.deepEqual(treeView.instance.getSelectedNodesKeys(), [1, 11], "all nodes are still in the selected array");
    });

    test("last item should not be deselected when selectionRequired is used with select all", function(assert) {
        const treeView = createInstance({
            items: [{
                id: 1,
                text: "item 1",
                selected: true,
                expanded: true,
                items: [{ id: 11, text: "Item 11" }]
            }, { id: 2, text: "Item 2", selected: true }],
            selectionMode: "multiple",
            selectNodesRecursive: true,
            selectionRequired: true
        });

        treeView.instance.unselectAll();
        assert.notOk(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), "first node is not selected");
        assert.notOk(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), "child node is not selected");
        assert.ok(treeView.getNodes().eq(2).hasClass(SELECTED_ITEM_CLASS), "last node is selected");
        assert.deepEqual(treeView.instance.getSelectedNodesKeys(), [2], "last noder is still in the selected array");
    });

    test("selectByClick option should select item  by single click", function(assert) {
        const items = [{ text: "item 1" }, { text: "item 2" }];
        const treeView = createInstance({
            items: items,
            selectByClick: false,
            selectionMode: "single"
        });

        treeView.instance.option("selectByClick", true);
        eventsEngine.trigger(treeView.getItems().eq(0), "dxclick");

        assert.ok(items[0].selected, "item was selected");
    });

    test("selectByClick option should unselect item  by second click", function(assert) {
        const items = [{ text: "item 1" }, { text: "item 2" }];
        const treeView = createInstance({
            items: items,
            selectByClick: true,
            selectionMode: "single"
        });

        eventsEngine.trigger(treeView.getItems().eq(0), "dxclick");
        eventsEngine.trigger(treeView.getItems().eq(0), "dxclick");

        assert.notOk(items[0].selected, "item was unselected");
    });

    test("selection can be prevented on itemClick", function(assert) {
        const items = [{ text: "item 1" }, { text: "item 2" }];
        const treeView = createInstance({
            items: items,
            selectByClick: true,
            selectionMode: "single",
            onItemClick: function(e) {
                e.event.preventDefault();
            }
        });

        eventsEngine.trigger(treeView.getItems().eq(0), "dxclick");

        assert.notOk(items[0].selected, "item selection has been prevented");
    });

    test("selectNodesRecursive should be ignored when single selection is enabled", function(assert) {
        const treeView = createInstance({
            items: [{ text: "Item 1", expanded: true, items: [{ text: "Item 11" }] }],
            selectionMode: "single",
            selectByClick: true,
            selectNodesRecursive: true
        });

        eventsEngine.trigger(treeView.getItems().eq(0), "dxclick");

        assert.ok(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), "root node should be selected");
        assert.notOk(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), "nested node should not be selected");
    });

    test("selectNodesRecursive should work correct on option changing", function(assert) {
        const treeView = createInstance({
            items: [{ id: 1, text: "Item 1", expanded: true, items: [{ id: 11, text: "Item 11", selected: true }] }],
            selectByClick: true,
            selectNodesRecursive: false
        });

        treeView.instance.option("selectNodesRecursive", true);

        assert.ok(treeView.getNodes().eq(0).hasClass(SELECTED_ITEM_CLASS), "root node should be selected");
        assert.ok(treeView.getNodes().eq(1).hasClass(SELECTED_ITEM_CLASS), "nested node should be selected");
    });

    test("onItemSelectionChanged event should be fired on unselect previosly selected item", function(assert) {
        let itemSelectionChangedHandler = sinon.spy();
        const treeView = createInstance({
            items: [{ text: "item 1" }, { text: "item 2" }],
            selectByClick: true,
            selectionMode: "single",
            onItemSelectionChanged: itemSelectionChangedHandler
        });

        eventsEngine.trigger(treeView.getItems().eq(0), "dxclick");
        eventsEngine.trigger(treeView.getItems().eq(1), "dxclick");

        assert.equal(itemSelectionChangedHandler.callCount, 3, "'onItemSelectionChanged' event fires three times");
        assert.deepEqual(itemSelectionChangedHandler.getCall(1).args[0].itemData, { selected: false, text: "item 1" }, "itemSelectionChangedHandler.itemData");
    });

    test("item selection correctly reset when dataSource is filtered", function(assert) {
        const items = [{ text: "item 1" }, { text: "item 2" }];
        const treeView = createInstance({
            dataSource: items,
            selectionMode: "single",
            showCheckBoxesMode: "normal",
            searchExpr: "text",
            searchEnabled: true,
        });

        treeView.instance.option("searchValue", "2");
        eventsEngine.trigger(treeView.getCheckBoxes(), "dxclick");
        treeView.instance.option("searchValue", "1");
        eventsEngine.trigger(treeView.getCheckBoxes(), "dxclick");
        treeView.instance.option("searchValue", "");

        assert.equal(treeView.getAllSelectedCheckboxes().length, 1, "There is only one checked checkBox");
        assert.ok(treeView.getCheckBoxes().eq(0).hasClass(CHECK_BOX_CHECKED_CLASS), "Correct checkbox checked");
    });

    test("items should be selectable after the search", function(assert) {
        let itemClickHandler = sinon.spy();
        const treeView = createInstance({
            dataSource: [{ text: "Stores" }],
            searchEnabled: true,
            searchTimeout: 0,
            selectionMode: "single",
            onItemClick: itemClickHandler
        });
        let $input = treeView.getElement().find(".dx-texteditor-input");

        keyboardMock($input).type("s");
        eventsEngine.trigger(treeView.getItems().eq(0), "dxclick");

        assert.equal(itemClickHandler.callCount, 1, "click works");
    });
});
