import $ from "jquery";
// import eventsEngine from "events/core/events_engine";
// import TreeViewTestWrapper from "../../../helpers/TreeViewTestHelper.js";
import TreeView from "ui/tree_view/ui.tree_view.search";
import ariaAccessibilityTestHelper from '../../../helpers/ariaAccessibilityTestHelper.js';
import eventsEngine from "events/core/events_engine";

// const createInstance = (options) => new TreeViewTestWrapper(options);
const { module, test } = QUnit;

var helper;
[true, false].forEach((searchEnabled) => {
    module(`Aria accessibility, searchEnabled: ${searchEnabled}`, {
        beforeEach: () => {
            this.items = [{ id: 1, text: "Item_1", expanded: true, items: [{ id: 3, text: "Item_1_1" }, { id: 4, text: "Item_1_2" }] }, { id: 2, text: "Item_2", expanded: false }];
            helper = new ariaAccessibilityTestHelper({
                createWidget: ($element, options) => new TreeView($element,
                    $.extend({
                        animationEnabled: false,
                        showCheckBoxesMode: "normal",
                        searchEnabled: searchEnabled
                    }, options))
            });
            this.clock = sinon.useFakeTimers();
        },
        afterEach: () => {
            this.clock.restore();
            helper.$widget.remove();
        }
    }, () => {
        test(`Selected: [], selectionMode: "single"`, () => {
            helper.createWidget({ items: this.items, selectionMode: "single" });

            if(searchEnabled) {
                helper.checkAttributes(helper.$itemContainer, { role: "tree", activedescendant: null, tabindex: '0' });
                helper.checkAttributes(helper.$widget, { role: null, activedescendant: null, tabindex: null });
            } else {
                helper.checkAttributes(helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
                helper.checkAttributes(helper.$widget, { role: "tree", activedescendant: null, tabindex: '0' });
            }

            helper.checkItemsAttributes([], { role: null, isCheckBoxMode: true });
        });

        test(`Selected: [], change searchEnabled after initialize"`, () => {
            helper.createWidget({ items: this.items, selectionMode: "single" });
            helper.widget.option("searchEnabled", !searchEnabled);

            if(searchEnabled) {
                helper.checkAttributes(helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
                helper.checkAttributes(helper.$widget, { role: "tree", activedescendant: null, tabindex: '0' });
            } else {
                helper.checkAttributes(helper.widget._itemContainer(true), { role: "tree", activedescendant: null, tabindex: '0' });
                helper.checkAttributes(helper.$widget, { role: null, activedescendant: null, tabindex: null });
            }

            helper.checkItemsAttributes([], { role: null, isCheckBoxMode: true });
        });

        test(`Selected: ["Item_1"], selectionMode: "single"`, () => {
            this.items[0].selected = true;

            helper.createWidget({ items: this.items, selectionMode: "single" });

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: null, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([0], { role: null, ariaSelected: "false", isCheckBoxMode: true });
        });

        test(`Selected: ["Item_1_1"], selectionMode: "single", Item_1.expanded: true, collapseItem(["Item_1"]) -> expand(["Item_1"])`, () => {
            this.items[0].items[0].selected = true;

            helper.createWidget({ items: this.items, selectionMode: "single" });
            helper.widget.collapseItem(1);
            this.clock.tick();

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: null, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([1], { role: null, ariaSelected: "false", isCheckBoxMode: true });

            helper.widget.expandItem(1);
            this.clock.tick();

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: null, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([1], { role: null, ariaSelected: "false", isCheckBoxMode: true });
        });

        test(`Selected: ["Item_1"], selectionMode: "single", Item_1.expanded: false, expand(["Item_1"]) -> collapseItem(["Item_1"])`, () => {
            this.items[0].selected = true;
            this.items[0].expanded = false;

            helper.createWidget({ items: this.items, selectionMode: "single" });
            helper.widget.expandItem(1);
            this.clock.tick();

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: null, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([0], { role: null, ariaSelected: "false", isCheckBoxMode: true });

            helper.widget.collapseItem(1);
            this.clock.tick();

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: null, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([0], { role: null, ariaSelected: "false", isCheckBoxMode: true });
        });

        test(`Selected: ["Item_1_1"], selectionMode: "single", collapseItem(["Item_1"]) -> expand(["Item_1"])`, () => {
            this.items[0].items[0].selected = true;

            helper.createWidget({ items: this.items, selectionMode: "single" });
            helper.widget.collapseItem(1);
            this.clock.tick();

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: null, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([1], { role: null, ariaSelected: "false", isCheckBoxMode: true });

            helper.widget.expandItem(1);
            this.clock.tick();

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: null, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([1], { role: null, ariaSelected: "false", isCheckBoxMode: true });
        });

        test(`Selected: [], selectionMode: "single", selectItem(["Item_1"])`, () => {
            helper.createWidget({ items: this.items, selectionMode: "single" });
            helper.widget.selectItem(1);

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: null, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([0], { role: null, ariaSelected: "false", isCheckBoxMode: true });
        });

        test(`Selected: [], selectionMode: "single", click checkbox ["Item_1"] -> ["Item_1_1"]`, () => {
            helper.createWidget({ items: this.items, selectionMode: "single" });

            eventsEngine.trigger(helper.$items.eq(0).prev(), "dxclick");
            eventsEngine.trigger(helper.$items.eq(0).prev(), "dxpointerdown");
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([0], { role: null, ariaSelected: "false", focusedNodeIndex: 0, isCheckBoxMode: true });

            eventsEngine.trigger(helper.$items.eq(1).prev(), "dxclick");
            eventsEngine.trigger(helper.$items.eq(1).prev(), "dxpointerdown");
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([1], { role: null, ariaSelected: "false", focusedNodeIndex: 1, isCheckBoxMode: true });
        });

        test(`Selected: [], selectionMode: "multiple", selectNodesRecursive: true, click checkbox ["Item_1"] -> ["Item_1_1"]`, () => {
            helper.createWidget({ items: this.items, selectionMode: "multiple", selectNodesRecursive: true });

            eventsEngine.trigger(helper.$items.eq(0).prev(), "dxclick");
            eventsEngine.trigger(helper.$items.eq(0).prev(), "dxpointerdown");
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([0, 1, 2], { role: null, ariaSelected: "false", focusedNodeIndex: 0, isCheckBoxMode: true });

            eventsEngine.trigger(helper.$items.eq(1).prev(), "dxclick");
            eventsEngine.trigger(helper.$items.eq(1).prev(), "dxpointerdown");
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([0, 2], { role: null, ariaSelected: "false", focusedNodeIndex: 1, selectionMode: "multiple" });
        });

        test(`Selected: ["Item_1", "Item_1_1"], selectionMode: "multiple", selectNodesRecursive: false, unselectItem(["Item_1"]) -> selectItem(["Item_1_2"])`, () => {
            this.items[0].items[0].selected = true;
            this.items[0].selected = true;

            helper.createWidget({ items: this.items, selectionMode: "multiple", selectNodesRecursive: false });

            helper.widget.unselectItem(1);
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: null, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([1], { role: null, ariaSelected: "false", isCheckBoxMode: true });

            helper.widget.selectItem(4);
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: null, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([1, 2], { role: null, ariaSelected: "false", selectionMode: "multiple" });
        });

        test(`Selected: [], selectionMode: "single" -> focusin -> focusout`, () => {
            helper.createWidget({ items: this.items, selectionMode: "single" });

            if(searchEnabled) {
                $(helper.widget._itemContainer(true)).focusin();
            } else {
                helper.$widget.focusin();
            }

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([], { role: null, focusedNodeIndex: 0, ariaSelected: "false", isCheckBoxMode: true });

            helper.$widget.focusout();
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([], { role: null, focusedNodeIndex: 0, ariaSelected: "false" });
        });

        test(`Selected: [], selectionMode: "single" -> set focusedElement -> clean focusedElement`, () => {
            helper.createWidget({ items: this.items, selectionMode: "single" });

            helper.widget.option("focusedElement", helper.$items.eq(2).closest(".dx-treeview-node"));
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([], { role: null, focusedNodeIndex: 2, ariaSelected: "false", isCheckBoxMode: true });

            helper.widget.option("focusedElement", null);
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: null, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { role: null, activedescendant: null, tabindex: null });
            helper.checkItemsAttributes([], { role: null, ariaSelected: "false" });
        });
    });
});
