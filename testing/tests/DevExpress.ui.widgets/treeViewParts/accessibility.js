import { TreeViewTestWrapper } from "../../../helpers/TreeViewTestHelper.js";
import eventsEngine from "events/core/events_engine";

const { module, test } = QUnit;
const createInstance = (options) => new TreeViewTestWrapper(options);

module("aria accessibility", {
    beforeEach() {
        this.treeView = createInstance({
            animationEnabled: false,
            items: [{ id: 1, text: "Item 1", expanded: true, items: [{ id: 3, text: "Item 11" }, { id: 4, text: "Item 12" }] }, { id: 2, text: "Item 2", expanded: false }],
            selectNodesRecursive: true,
            showCheckBoxesMode: "normal"
        });

        this.clock = sinon.useFakeTimers();
    },
    afterEach() {
        this.clock.restore();
    }
}, () => {
    test("aria expanded for items", function(assert) {
        this.treeView.instance.collapseItem(this.treeView.instance.itemElements()[0]);
        this.clock.tick(0);

        assert.equal(this.treeView.getNodes().eq(0).attr("aria-expanded"), "false", "aria-expanded changing on item collapsing");
    });

    test("aria selected for items via API", function(assert) {
        this.treeView.instance.selectItem(this.treeView.instance.itemElements()[0]);

        assert.equal(this.treeView.getNodes().eq(0).attr("aria-selected"), "true", "item is selected");
    });

    test("aria selected for items via UI", function(assert) {
        assert.equal(this.treeView.getNodes().eq(0).attr("aria-selected"), "false", "item is unselected by default");

        eventsEngine.trigger(this.treeView.getCheckBoxes().eq(0), "dxclick");
        assert.equal(this.treeView.getNodes().eq(0).attr("aria-selected"), "true", "item is selected");
        assert.equal(this.treeView.getNodes().eq(1).attr("aria-selected"), "true", "item is selected");

        eventsEngine.trigger(this.treeView.getCheckBoxes().eq(1), "dxclick");
        assert.notOk(this.treeView.getNodes().eq(0).attr("aria-selected"), "item is unselected");
        assert.equal(this.treeView.getNodes().eq(1).attr("aria-selected"), "false", "item is unselected");
    });

    test("'Expanded' attr should be applied correctly when item was expanded on the second time", function(assert) {
        this.treeView.instance.collapseItem(this.treeView.instance.itemElements()[0]);
        this.clock.tick(0);
        this.treeView.instance.expandItem(this.treeView.instance.itemElements()[0]);
        this.clock.tick(0);

        assert.equal(this.treeView.getNodes().eq(0).attr("aria-expanded"), "true", "aria-expanded changing on item expanding");
    });

    test("'Expanded' attr should be applied correctly when item was expanded on the first time", function(assert) {
        this.treeView.instance.option("items", [{ id: 1, text: "a", items: [{ id: 2, text: "b" }] }]);

        this.treeView.instance.expandItem(this.treeView.instance.itemElements()[0]);
        this.clock.tick(0);

        assert.equal(this.treeView.getNodes().eq(0).attr("aria-expanded"), "true", "aria-expanded changing on item expanding");
    });
});


