/* global initTree */

QUnit.module("aria accessibility", {
    beforeEach: function() {
        this.$element = initTree({
            animationEnabled: false,
            items: [{ id: 1, text: "Item 1", expanded: true, items: [{ id: 3, text: "Item 11" }, { id: 4, text: "Item 12" }] }, { id: 2, text: "Item 2", expanded: false }],
            selectNodesRecursive: true,
            showCheckBoxesMode: "normal"
        });

        this.instance = this.$element.dxTreeView("instance");
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.$treeView = undefined;
        this.instance = undefined;
        this.clock.restore();
    }
});

QUnit.test("aria expanded for items", function(assert) {
    var $item1 = this.$element.find(".dx-treeview-node:eq(0)"),
        $itemElements = this.instance.itemElements();

    this.instance.collapseItem($itemElements[0]);
    this.clock.tick(0);

    assert.equal($item1.attr("aria-expanded"), "false", "aria-expanded changing on item collapsing");
});

QUnit.test("aria selected for items via API", function(assert) {
    var $item = this.$element.find(".dx-treeview-node:eq(0)"),
        $itemElements = this.instance.itemElements();

    this.instance.selectItem($itemElements[0]);
    assert.equal($item.attr("aria-selected"), "true", "item is selected");
});

QUnit.test("aria selected for items via UI", function(assert) {
    var $nodes = this.$element.find(".dx-treeview-node"),
        $checkboxes = this.$element.find(".dx-checkbox");

    assert.equal($nodes.eq(0).attr("aria-selected"), "false", "item is unselected by default");

    $checkboxes.eq(0).trigger("dxclick");
    assert.equal($nodes.eq(0).attr("aria-selected"), "true", "item is selected");
    assert.equal($nodes.eq(1).attr("aria-selected"), "true", "item is selected");

    $checkboxes.eq(1).trigger("dxclick");
    assert.notOk($nodes.eq(0).attr("aria-selected"), "item is unselected");
    assert.equal($nodes.eq(1).attr("aria-selected"), "false", "item is unselected");
});

QUnit.test("'Expanded' attr should be applied correctly when item was expanded on the second time", function(assert) {
    var $item1 = this.$element.find(".dx-treeview-node:eq(0)"),
        $itemElements = this.instance.itemElements();

    this.instance.collapseItem($itemElements[0]);
    this.clock.tick(0);
    this.instance.expandItem($itemElements[0]);
    this.clock.tick(0);

    assert.equal($item1.attr("aria-expanded"), "true", "aria-expanded changing on item expanding");
});

QUnit.test("'Expanded' attr should be applied correctly when item was expanded on the first time", function(assert) {

    this.instance.option("items", [{ id: 1, text: "a", items: [{ id: 2, text: "b" }] }]);

    var $item1 = this.$element.find(".dx-treeview-node:eq(0)"),
        $itemElements = this.instance.itemElements();

    this.instance.expandItem($itemElements[0]);
    this.clock.tick(0);

    assert.equal($item1.attr("aria-expanded"), "true", "aria-expanded changing on item expanding");
});
