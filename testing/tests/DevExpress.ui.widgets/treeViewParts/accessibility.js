import TreeViewTestWrapper from "../../../helpers/TreeViewTestHelper.js";

const createInstance = (options) => new TreeViewTestWrapper(options);
const { module, test } = QUnit;

class ariaAccessibilityTestHelper {
    constructor(searchEnabled) {
        this.treeView = createInstance({
            animationEnabled: false,
            items: [{ id: 1, text: "Item 1", expanded: true, items: [{ id: 3, text: "Item 11" }, { id: 4, text: "Item 12" }] }, { id: 2, text: "Item 2", expanded: false }],
            selectNodesRecursive: true,
            showCheckBoxesMode: "normal",
            searchEnabled: searchEnabled
        });
        this.element = this.treeView.instance;
        this.$element = this.treeView.getElement();
        this.$itemContainer = this.element._itemContainer();
        this.clock = sinon.useFakeTimers();
    }

    checkAsserts(expectedValues) {
        let { role, isActiveDescendant, tabIndex, $target } = expectedValues;

        QUnit.assert.strictEqual($target.attr("role"), role, "role");
        QUnit.assert.strictEqual(!!$target.attr("aria-activedescendant"), isActiveDescendant, "activedescendant");
        QUnit.assert.strictEqual($target.attr("tabIndex"), tabIndex, "tabIndex");
    }
}

module("aria accessibility", () => {
    [true, false].forEach((searchEnabled) => {
        QUnit.test(`aria role on initialize, searchEnabled: ${searchEnabled}`, () => {
            let helper = new ariaAccessibilityTestHelper(searchEnabled);
            const $itemContainer = helper.element._itemContainer(true);

            helper.checkAsserts({ $target: searchEnabled ? $itemContainer : helper.$element, role: "tree", isActiveDescendant: true, tabIndex: '0' });
            helper.checkAsserts({ $target: searchEnabled ? helper.$element : $itemContainer, role: undefined, isActiveDescendant: false, tabIndex: undefined });
        });

        QUnit.test(`aria role after initialize, searchEnabled: ${searchEnabled}`, () => {
            let helper = new ariaAccessibilityTestHelper(searchEnabled);
            helper.element.option("searchEnabled", !searchEnabled);
            const $itemContainer = helper.element._itemContainer(true);

            helper.checkAsserts({ $target: searchEnabled ? helper.$element : $itemContainer, role: "tree", isActiveDescendant: true, tabIndex: '0' });
            helper.checkAsserts({ $target: searchEnabled ? $itemContainer : helper.$element, role: undefined, isActiveDescendant: false, tabIndex: undefined });
        });

        test("aria expanded for items", function(assert) {
            let helper = new ariaAccessibilityTestHelper(searchEnabled);

            const $firstItem = helper.treeView.getNodes().eq(0);

            helper.element.collapseItem(helper.element.itemElements()[0]);
            helper.clock.tick(0);

            assert.equal($firstItem.attr("aria-expanded"), "false", "aria-expanded changing on item collapsing");
        });

        test("aria selected for items via API", function(assert) {
            let helper = new ariaAccessibilityTestHelper(searchEnabled);

            const $firstItem = helper.treeView.getNodes().eq(0);

            helper.element.selectItem(helper.element.itemElements()[0]);
            assert.equal($firstItem.attr("aria-selected"), "true", "item is selected");
        });

        test("aria selected for items via UI", function(assert) {
            let helper = new ariaAccessibilityTestHelper(searchEnabled);

            let $nodes = helper.treeView.getNodes();
            let $checkboxes = helper.treeView.getCheckBoxes();

            assert.equal($nodes.eq(0).attr("aria-selected"), "false", "item is unselected by default");

            $checkboxes.eq(0).trigger("dxclick");
            assert.equal($nodes.eq(0).attr("aria-selected"), "true", "item is selected");
            assert.equal($nodes.eq(1).attr("aria-selected"), "true", "item is selected");

            $checkboxes.eq(1).trigger("dxclick");
            assert.notOk($nodes.eq(0).attr("aria-selected"), "item is unselected");
            assert.equal($nodes.eq(1).attr("aria-selected"), "false", "item is unselected");
        });

        test("'Expanded' attr should be applied correctly when item was expanded on the second time", function(assert) {
            let helper = new ariaAccessibilityTestHelper(searchEnabled);

            const $firstItem = helper.treeView.getNodes().eq(0);
            const $itemElements = helper.element.itemElements();

            helper.element.collapseItem($itemElements[0]);
            helper.clock.tick(0);
            helper.element.expandItem($itemElements[0]);
            helper.clock.tick(0);

            assert.equal($firstItem.attr("aria-expanded"), "true", "aria-expanded changing on item expanding");
        });

        test("'Expanded' attr should be applied correctly when item was expanded on the first time", function(assert) {
            let helper = new ariaAccessibilityTestHelper(searchEnabled);
            helper.element.option("items", [{ id: 1, text: "a", items: [{ id: 2, text: "b" }] }]);

            const $firstItem = helper.treeView.getNodes().eq(0);

            helper.element.expandItem(helper.element.itemElements()[0]);
            helper.clock.tick(0);

            assert.equal($firstItem.attr("aria-expanded"), "true", "aria-expanded changing on item expanding");
        });
    });
});


