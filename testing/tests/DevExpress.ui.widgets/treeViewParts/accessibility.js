import $ from "jquery";
// import eventsEngine from "events/core/events_engine";
// import TreeViewTestWrapper from "../../../helpers/TreeViewTestHelper.js";
import ariaAccessibilityTestHelper from '../../../helpers/ariaAccessibilityTestHelper.js';

// const createInstance = (options) => new TreeViewTestWrapper(options);
const { module, test } = QUnit;

[true, false].forEach((searchEnabled) => {
    module(`Aria accessibility, searchEnabled: ${searchEnabled}`, {
        beforeEach: () => {
            this.helper = new ariaAccessibilityTestHelper({
                createWidget: ($element, options) => $element.dxTreeView(
                    $.extend({
                        animationEnabled: false,
                        items: [{ id: 1, text: "Item 1", expanded: true, items: [{ id: 3, text: "Item 11" }, { id: 4, text: "Item 12" }] }, { id: 2, text: "Item 2", expanded: false }],
                        selectNodesRecursive: true,
                        showCheckBoxesMode: "normal",
                        searchEnabled: searchEnabled
                    }, options)).dxTreeView("instance")
            });
        },
        afterEach: () => {
            this.helper.$widget.remove();
        }
    }, () => {
        test(`Selected: ["Item_2"], selectionMode: "single"`, () => {
            this.helper.createWidget({ selectedItemKeys: ["Item_2"], keyExpr: "text", selectionMode: "single" });

            this.helper.checkAttributes(searchEnabled ? this.helper.$itemContainer : this.helper.$widget, { role: "tree", activeDescendant: null, tabIndex: '0' });
            this.helper.checkAttributes(searchEnabled ? this.helper.$widget : this.helper.$itemContainer, { role: null, activeDescendant: null, tabIndex: null });
            this.helper.checkItemsAttributes([1]);
        });

        // QUnit.test(`Selected: ["Item_2", "Item_3"], selectionMode: "multiple"`, () => {
        //     this.helper.createWidget({ selectedItemKeys: ["Item_2", "Item_3"], keyExpr: "text", selectionMode: "multiple" });

        //     this.helper.checkAttributes(searchEnabled ? this.helper.$itemContainer : this.helper.$widget, { role: "listbox", activeDescendant: null, tabIndex: '0' });
        //     this.helper.checkAttributes(searchEnabled ? this.helper.$widget : this.helper.$itemContainer, { role: null, activeDescendant: null, tabIndex: null });
        //     this.helper.checkItemsAttributes([1, 2]);
        // });

        // QUnit.test(`Change searchEnabled after initialize`, () => {
        //     this.helper.createWidget({ selectedItemKeys: ["Item_2"], keyExpr: "text", selectionMode: "single" });
        //     this.helper.widget.option("searchEnabled", !searchEnabled);

        //     this.helper.checkAttributes(!searchEnabled ? this.helper.$itemContainer : this.helper.$widget, { role: "listbox", activeDescendant: null, tabIndex: '0' });
        //     this.helper.checkAttributes(!searchEnabled ? this.helper.$widget : this.helper.$itemContainer, { role: null, activeDescendant: null, tabIndex: null });
        // });

        // QUnit.test(`Selected: ["Item_3"] -> focusin -> focusout`, () => {
        //     this.helper.createWidget({ selectedItemKeys: ["Item_3"], keyExpr: "text", selectionMode: "single" });

        //     if(searchEnabled) {
        //         $(this.helper.$itemContainer).focusin();
        //     } else {
        //         this.helper.$widget.focusin();
        //     }

        //     this.helper.checkAttributes(searchEnabled ? this.helper.$itemContainer : this.helper.$widget, { role: "listbox", activeDescendant: this.helper.focusedItemId, tabIndex: '0' });
        //     this.helper.checkItemsAttributes([2], { focusedItemIndex: 2 });

        //     this.helper.$widget.focusout();
        //     this.helper.checkAttributes(searchEnabled ? this.helper.$itemContainer : this.helper.$widget, { role: "listbox", activeDescendant: this.helper.focusedItemId, tabIndex: '0' });
        //     this.helper.checkItemsAttributes([2], { focusedItemIndex: 2 });
        // });

        // QUnit.test(`Selected: ["Item_1"] -> set focusedElement -> clean focusedElement`, () => {
        //     this.helper.createWidget({ selectedItemKeys: ["Item_1"], keyExpr: "text", selectionMode: "single" });

        //     this.helper.widget.option("focusedElement", this.helper.$items.eq(0));
        //     this.helper.checkAttributes(searchEnabled ? this.helper.$itemContainer : this.helper.$widget, { role: "listbox", activeDescendant: this.helper.focusedItemId, tabIndex: '0' });
        //     this.helper.checkItemsAttributes([0], { focusedItemIndex: 0 });

        //     this.helper.widget.option("focusedElement", null);
        //     this.helper.checkAttributes(searchEnabled ? this.helper.$itemContainer : this.helper.$widget, { role: "listbox", activeDescendant: null, tabIndex: '0' });
        //     this.helper.checkItemsAttributes([0]);
        // });

        // QUnit.test(`Selected: ["Item_1"] -> set focusedElement -> change by click`, () => {
        //     this.helper.createWidget({ selectedItemKeys: ["Item_1"], keyExpr: "text", selectionMode: "single" });

        //     const clock = sinon.useFakeTimers();

        //     if(searchEnabled) {
        //         $(this.helper.$itemContainer).focusin();
        //     } else {
        //         this.helper.$widget.focusin();
        //     }

        //     const $item_2 = $(this.helper.$items.eq(2));
        //     eventsEngine.trigger($item_2, "dxclick");
        //     eventsEngine.trigger($item_2, "dxpointerdown");
        //     clock.tick();

        //     this.helper.checkAttributes(searchEnabled ? this.helper.$itemContainer : this.helper.$widget, { role: "listbox", activeDescendant: this.helper.focusedItemId, tabIndex: '0' });
        //     this.helper.checkItemsAttributes([2], { focusedItemIndex: 2 });

        //     this.helper.widget.option("focusedElement", null);
        //     this.helper.checkAttributes(searchEnabled ? this.helper.$itemContainer : this.helper.$widget, { role: "listbox", activeDescendant: null, tabIndex: '0' });
        //     this.helper.checkItemsAttributes([2]);
        //     clock.restore();
        // });

        // test(`Selected: ["Item_1", "Item_3"] -> select "Item_2" by click`, () => {
        //     this.helper.createWidget({ selectedItemKeys: ["Item_1", "Item_3"], keyExpr: "text", selectionMode: "multiple" });

        //     this.helper.checkAttributes(searchEnabled ? this.helper.$itemContainer : this.helper.$widget, { role: "listbox", activeDescendant: null, tabIndex: '0' });
        //     this.helper.checkItemsAttributes([0, 2]);

        //     const clock = sinon.useFakeTimers();

        //     const $item_1 = $(this.helper.$items.eq(1));
        //     eventsEngine.trigger($item_1, "dxclick");
        //     eventsEngine.trigger($item_1, "dxpointerdown");
        //     clock.tick();

        //     this.helper.checkAttributes(searchEnabled ? this.helper.$itemContainer : this.helper.$widget, { role: "listbox", activeDescendant: this.helper.focusedItemId, tabIndex: '0' });
        //     this.helper.checkItemsAttributes([0, 1, 2], { focusedItemIndex: 1 });

        //     clock.restore();
        // });
    });
});

// module("aria accessibility", () => {
//     [true, false].forEach((searchEnabled) => {
//         QUnit.test(`aria role on initialize, searchEnabled: ${searchEnabled}`, () => {
//             let helper = new ariaAccessibilityTestHelper(searchEnabled);
//             const $itemContainer = helper.element._itemContainer(true);

//             helper.checkAsserts({ $target: searchEnabled ? $itemContainer : helper.$element, role: "tree", isActiveDescendant: true, tabIndex: '0' });
//             helper.checkAsserts({ $target: searchEnabled ? helper.$element : $itemContainer, role: undefined, isActiveDescendant: false, tabIndex: undefined });
//         });

//         QUnit.test(`aria role after initialize, searchEnabled: ${searchEnabled}`, () => {
//             let helper = new ariaAccessibilityTestHelper(searchEnabled);
//             helper.element.option("searchEnabled", !searchEnabled);
//             const $itemContainer = helper.element._itemContainer(true);

//             helper.checkAsserts({ $target: searchEnabled ? helper.$element : $itemContainer, role: "tree", isActiveDescendant: true, tabIndex: '0' });
//             helper.checkAsserts({ $target: searchEnabled ? $itemContainer : helper.$element, role: undefined, isActiveDescendant: false, tabIndex: undefined });
//         });

//         test("aria expanded for items", function(assert) {
//             let helper = new ariaAccessibilityTestHelper(searchEnabled);

//             const $firstItem = helper.treeView.getNodes().eq(0);

//             helper.element.collapseItem(helper.element.itemElements()[0]);
//             helper.clock.tick(0);

//             assert.equal($firstItem.attr("aria-expanded"), "false", "aria-expanded changing on item collapsing");
//         });

//         test("aria selected for items via API", function(assert) {
//             let helper = new ariaAccessibilityTestHelper(searchEnabled);

//             const $firstItem = helper.treeView.getNodes().eq(0);

//             helper.element.selectItem(helper.element.itemElements()[0]);
//             assert.equal($firstItem.attr("aria-selected"), "true", "item is selected");
//         });

//         test("aria selected for items via UI", function(assert) {
//             let helper = new ariaAccessibilityTestHelper(searchEnabled);

//             let $nodes = helper.treeView.getNodes();
//             let $checkboxes = helper.treeView.getCheckBoxes();

//             assert.equal($nodes.eq(0).attr("aria-selected"), "false", "item is unselected by default");

//             $checkboxes.eq(0).trigger("dxclick");
//             assert.equal($nodes.eq(0).attr("aria-selected"), "true", "item is selected");
//             assert.equal($nodes.eq(1).attr("aria-selected"), "true", "item is selected");

//             $checkboxes.eq(1).trigger("dxclick");
//             assert.notOk($nodes.eq(0).attr("aria-selected"), "item is unselected");
//             assert.equal($nodes.eq(1).attr("aria-selected"), "false", "item is unselected");
//         });

//         test("'Expanded' attr should be applied correctly when item was expanded on the second time", function(assert) {
//             let helper = new ariaAccessibilityTestHelper(searchEnabled);

//             const $firstItem = helper.treeView.getNodes().eq(0);
//             const $itemElements = helper.element.itemElements();

//             helper.element.collapseItem($itemElements[0]);
//             helper.clock.tick(0);
//             helper.element.expandItem($itemElements[0]);
//             helper.clock.tick(0);

//             assert.equal($firstItem.attr("aria-expanded"), "true", "aria-expanded changing on item expanding");
//         });

//         test("'Expanded' attr should be applied correctly when item was expanded on the first time", function(assert) {
//             let helper = new ariaAccessibilityTestHelper(searchEnabled);
//             helper.element.option("items", [{ id: 1, text: "a", items: [{ id: 2, text: "b" }] }]);

//             const $firstItem = helper.treeView.getNodes().eq(0);

//             helper.element.expandItem(helper.element.itemElements()[0]);
//             helper.clock.tick(0);

//             assert.equal($firstItem.attr("aria-expanded"), "true", "aria-expanded changing on item expanding");
//         });
//     });
// });


