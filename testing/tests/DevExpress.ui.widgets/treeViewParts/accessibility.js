import $ from "jquery";
import TreeView from "ui/tree_view/ui.tree_view.search";
import ariaAccessibilityTestHelper from '../../../helpers/ariaAccessibilityTestHelper.js';
import eventsEngine from "events/core/events_engine";

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
                helper.checkAttributes(helper.$itemContainer, { role: "tree", tabindex: '0' });
                helper.checkAttributes(helper.$widget, { });
            } else {
                helper.checkAttributes(helper.widget._itemContainer(true), { });
                helper.checkAttributes(helper.$widget, { role: "tree", tabindex: '0' });
            }

            helper.checkItemsAttributes([], { });
        });

        test(`Selected: [], change searchEnabled after initialize"`, () => {
            helper.createWidget({ items: this.items, selectionMode: "single" });
            helper.widget.option("searchEnabled", !searchEnabled);

            if(searchEnabled) {
                helper.checkAttributes(helper.widget._itemContainer(true), { });
                helper.checkAttributes(helper.$widget, { role: "tree", tabindex: '0' });
            } else {
                helper.checkAttributes(helper.widget._itemContainer(true), { role: "tree", tabindex: '0' });
                helper.checkAttributes(helper.$widget, { });
            }

            helper.checkItemsAttributes([], { });
        });

        test(`Selected: ["Item_1"], selectionMode: "single"`, () => {
            this.items[0].selected = true;

            helper.createWidget({ items: this.items, selectionMode: "single" });

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0], { });
        });

        test(`Selected: ["Item_1_1"], selectionMode: "single", Item_1.expanded: true, collapseItem(["Item_1"]) -> expand(["Item_1"])`, () => {
            this.items[0].items[0].selected = true;

            helper.createWidget({ items: this.items, selectionMode: "single" });
            helper.widget.collapseItem(1);
            this.clock.tick();

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1], { });

            helper.widget.expandItem(1);
            this.clock.tick();

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1], { });
        });

        test(`Selected: ["Item_1"], selectionMode: "single", Item_1.expanded: false, expand(["Item_1"]) -> collapseItem(["Item_1"])`, () => {
            this.items[0].selected = true;
            this.items[0].expanded = false;

            helper.createWidget({ items: this.items, selectionMode: "single" });
            helper.widget.expandItem(1);
            this.clock.tick();

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0], { });

            helper.widget.collapseItem(1);
            this.clock.tick();

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0], { });
        });

        test(`Selected: ["Item_1_1"], selectionMode: "single", collapseItem(["Item_1"]) -> expand(["Item_1"])`, () => {
            this.items[0].items[0].selected = true;

            helper.createWidget({ items: this.items, selectionMode: "single" });
            helper.widget.collapseItem(1);
            this.clock.tick();

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1], { });

            helper.widget.expandItem(1);
            this.clock.tick();

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1], { });
        });

        test(`Selected: [], selectionMode: "single", selectItem(["Item_1"])`, () => {
            helper.createWidget({ items: this.items, selectionMode: "single" });
            helper.widget.selectItem(1);

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0], { });
        });

        test(`Selected: [], selectionMode: "single", click checkbox ["Item_1"] -> ["Item_1_1"]`, () => {
            helper.createWidget({ items: this.items, selectionMode: "single" });

            eventsEngine.trigger(helper.$items.eq(0).prev(), "dxclick");
            eventsEngine.trigger(helper.$items.eq(0).prev(), "dxpointerdown");
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0], { focusedNodeIndex: 0, });

            eventsEngine.trigger(helper.$items.eq(1).prev(), "dxclick");
            eventsEngine.trigger(helper.$items.eq(1).prev(), "dxpointerdown");
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1], { focusedNodeIndex: 1, });
        });

        test(`Selected: [], selectionMode: "multiple", selectNodesRecursive: true, click checkbox ["Item_1"] -> ["Item_1_1"]`, () => {
            helper.createWidget({ items: this.items, selectionMode: "multiple", selectNodesRecursive: true });

            eventsEngine.trigger(helper.$items.eq(0).prev(), "dxclick");
            eventsEngine.trigger(helper.$items.eq(0).prev(), "dxpointerdown");
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0, 1, 2], { focusedNodeIndex: 0, });

            eventsEngine.trigger(helper.$items.eq(1).prev(), "dxclick");
            eventsEngine.trigger(helper.$items.eq(1).prev(), "dxpointerdown");
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0, 2], { focusedNodeIndex: 1, selectionMode: "multiple" });
        });

        test(`Selected: ["Item_1", "Item_1_1"], selectionMode: "multiple", selectNodesRecursive: false, unselectItem(["Item_1"]) -> selectItem(["Item_1_2"])`, () => {
            this.items[0].items[0].selected = true;
            this.items[0].selected = true;

            helper.createWidget({ items: this.items, selectionMode: "multiple", selectNodesRecursive: false });

            helper.widget.unselectItem(1);
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1], { });

            helper.widget.selectItem(4);
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1, 2], { selectionMode: "multiple" });
        });

        test(`Selected: [], selectionMode: "single" -> focusin -> focusout`, () => {
            helper.createWidget({ items: this.items, selectionMode: "single" });

            if(searchEnabled) {
                $(helper.widget._itemContainer(true)).focusin();
            } else {
                helper.$widget.focusin();
            }

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([], { focusedNodeIndex: 0, });

            helper.$widget.focusout();
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([], { focusedNodeIndex: 0 });
        });

        test(`Selected: [], selectionMode: "single" -> set focusedElement -> clean focusedElement`, () => {
            helper.createWidget({ items: this.items, selectionMode: "single" });

            helper.widget.option("focusedElement", helper.$items.eq(2).closest(".dx-treeview-node"));
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", activedescendant: helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([], { focusedNodeIndex: 2, });

            helper.widget.option("focusedElement", null);
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "tree", tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([], { });
        });
    });
});
