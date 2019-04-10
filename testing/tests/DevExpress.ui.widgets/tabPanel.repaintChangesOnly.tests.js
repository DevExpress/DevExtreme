import $ from "jquery";
import fx from "animation/fx";
import "ui/tab_panel";

QUnit.module("repaintChangesOnly", {
    beforeEach() {
        this.clock = sinon.useFakeTimers();
        this.origAnimate = fx.animate;
        fx.animate = (_, options) => {
            setTimeout(() => options.complete(), 1);
        };

        this.itemRenderedSpy = sinon.spy();
        this.titleRenderedSpy = sinon.spy();
        this.itemDeletedSpy = sinon.spy();

        this.clearSpies = () => {
            this.itemRenderedSpy.reset();
            this.titleRenderedSpy.reset();
            this.itemDeletedSpy.reset();
        };

        this.createTabPanel = (options) => {
            options.repaintChangesOnly = true;
            options.itemTemplate = (itemData) => `<div id='id_${itemData.content}'>${itemData.content}</div>`;
            options.itemTitleTemplate = (itemData) => `<div id='id_${itemData.text}'>${itemData.text}</div>`;

            this.$tabPanel = $("<div>");
            this.tabPanel = this.$tabPanel.dxTabPanel(options).dxTabPanel("instance");

            this.tabPanel.option("onItemRendered", this.itemRenderedSpy);
            this.tabPanel.option("onTitleRendered", this.titleRenderedSpy);
            this.tabPanel.option("onItemDeleted", this.itemDeletedSpy);
        };

        this.tabPanelContainsElement = (id) => {
            try {
                return this.$tabPanel.find("#id_" + id)[0].textContent;
            } catch(e) {}
        };
    },
    afterEach() {
        fx.animate = this.origAnimate;
        this.clock.restore();
    }

}, () => {

    QUnit.test("[{1}] -> []", function(assert) {
        const item1 = { text: "1a", content: "1a_" };
        this.createTabPanel({ items: [item1] });

        this.tabPanel.option("items", []);
        this.clock.tick(1);

        assert.equal(this.titleRenderedSpy.callCount, 0, "titleRenderedSpy.callCount");

        assert.equal(this.itemRenderedSpy.callCount, 0, "itemRenderedSpy.callCount");

        assert.equal(this.itemDeletedSpy.callCount, 1, "itemDeleted.callCount");
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData, item1, "itemDeletedSpy.firstCall.args[0].itemData");

        assert.notOk(this.tabPanelContainsElement(item1.text), item1.text, `doesn't contain '${item1.text}'`);
        assert.notOk(this.tabPanelContainsElement(item1.content), item1.content, `doesn't contain '${item1.content}'`);
    });

    QUnit.test("[{1}] -> [{1}, {2}]", function(assert) {
        const item1 = { text: "1a", content: "1a_" };
        this.createTabPanel({ items: [item1] });

        const item2 = { text: "2a", content: "2a_" };
        this.tabPanel.option("items", [item1, item2]);
        this.clock.tick(1);

        assert.equal(this.titleRenderedSpy.callCount, 1, "titleRenderedSpy.callCount");
        assert.deepEqual(this.titleRenderedSpy.firstCall.args[0].itemData, item2, "titleRenderedSpy.firstCall.args[0].itemData");

        assert.equal(this.itemRenderedSpy.callCount, 0, "itemRenderedSpy");

        assert.equal(this.itemDeletedSpy.callCount, 0, "onItemDeleted");

        assert.ok(this.tabPanelContainsElement(item1.text), item1.text, `contains '${item1.text}'`);
        assert.ok(this.tabPanelContainsElement(item2.text), item2.text, `contains '${item2.text}'`);

        assert.ok(this.tabPanelContainsElement(item1.content), item1.content, `contains '${item1.content}'`);
        assert.notOk(this.tabPanelContainsElement(item2.content), item2.content, `doent contain '${item2.content}'`);
    });

    QUnit.test("[{1, text: 1a, content: 1a_}] -> [{1, text: 1a, content: 1a_upd}]", function(assert) {
        const item1 = { text: "1a", content: "1a_" };
        this.createTabPanel({ items: [item1] });

        const item1_ = { text: "1a", content: "1a_upd" };
        this.tabPanel.option("items", [item1_]);
        this.clock.tick(1);

        assert.equal(this.titleRenderedSpy.callCount, 1, "titleRenderedSpy.callCount");
        assert.deepEqual(this.titleRenderedSpy.firstCall.args[0].itemData, item1_, "titleRenderedSpy.firstCall.args[0].itemData");

        assert.equal(this.itemRenderedSpy.callCount, 1, "itemRenderedSpy");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, item1_, "itemRenderedSpy.firstCall.args[0].itemData");
        assert.equal(this.itemRenderedSpy.firstCall.args[0].itemIndex, 0, "itemRenderedSpy.firstCall.args[0].index");

        assert.equal(this.itemDeletedSpy.callCount, 1, "onItemDeleted");
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData, item1, "itemDeletedSpy.firstCall.args[0].itemData");

        assert.ok(this.tabPanelContainsElement(item1.text), item1.text, `contains '${item1.text}'`);

        assert.notOk(this.tabPanelContainsElement(item1.content), item1.content, `doesn't contain '${item1.content}'`);
        assert.ok(this.tabPanelContainsElement(item1_.content), item1_.content, `contains '${item1_.content}'`);
    });

    QUnit.test("[{1, text: 1a, content: 1a_}] -> [{1, text: 1aupd, content: 1a_}]", function(assert) {
        const item1 = { text: "1a", content: "1a_" };
        this.createTabPanel({ items: [item1] });

        const item1_ = { text: "1aupd", content: "1a_" };
        this.tabPanel.option("items", [item1_]);
        this.clock.tick(1);

        assert.equal(this.titleRenderedSpy.callCount, 1, "titleRenderedSpy.callCount");
        assert.deepEqual(this.titleRenderedSpy.firstCall.args[0].itemData, item1_, "titleRenderedSpy.firstCall.args[0].itemData");

        assert.equal(this.itemRenderedSpy.callCount, 1, "itemRenderedSpy");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, item1_, "itemRenderedSpy.firstCall.args[0].itemData");
        assert.equal(this.itemRenderedSpy.firstCall.args[0].itemIndex, 0, "itemRenderedSpy.firstCall.args[0].index");

        assert.equal(this.itemDeletedSpy.callCount, 1, "onItemDeleted");
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData, item1, "itemDeletedSpy.firstCall.args[0].itemData");

        assert.notOk(this.tabPanelContainsElement(item1.text), item1.text, `doesn't contain '${item1.text}'`);
        assert.ok(this.tabPanelContainsElement(item1_.text), item1_.text, `contains '${item1.text}'`);

        assert.ok(this.tabPanelContainsElement(item1.content), item1.content, `contains '${item1.content}'`);
    });

    QUnit.test("[{1, text: 1a, content: 1a_}] -> [{1, text: 1aupd, content: 1a_upd}]", function(assert) {
        const item1 = { text: "1a", content: "1a_" };
        this.createTabPanel({ items: [item1] });

        const item1_ = { text: "1aupd", content: "1a_upd" };
        this.tabPanel.option("items", [item1_]);
        this.clock.tick(1);

        assert.equal(this.titleRenderedSpy.callCount, 1, "titleRenderedSpy.callCount");
        assert.deepEqual(this.titleRenderedSpy.firstCall.args[0].itemData, item1_, "titleRenderedSpy.firstCall.args[0].itemData");

        assert.equal(this.itemRenderedSpy.callCount, 1, "itemRenderedSpy");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, item1_, "itemRenderedSpy.firstCall.args[0].itemData");
        assert.equal(this.itemRenderedSpy.firstCall.args[0].itemIndex, 0, "itemRenderedSpy.firstCall.args[0].index");

        assert.equal(this.itemDeletedSpy.callCount, 1, "onItemDeleted");
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData, item1, "itemDeletedSpy.firstCall.args[0].itemData");

        assert.notOk(this.tabPanelContainsElement(item1.text), item1.text, `doesn't contain '${item1.text}'`);
        assert.ok(this.tabPanelContainsElement(item1_.text), item1_.text, `contains '${item1.text}'`);

        assert.notOk(this.tabPanelContainsElement(item1.content), item1.content, `doesn't contain '${item1.content}'`);
        assert.ok(this.tabPanelContainsElement(item1_.content), item1_.content, `contains '${item1_.content}'`);
    });

    QUnit.test("[{1}] -> [{2}]", function(assert) {
        const item1 = { text: "1a", content: "1a_" };
        this.createTabPanel({ items: [item1] });

        const item2 = { text: "2a", content: "2a_" };
        this.tabPanel.option("items", [item2]);
        this.clock.tick(1);

        assert.equal(this.titleRenderedSpy.callCount, 1, "titleRenderedSpy.callCount");
        assert.deepEqual(this.titleRenderedSpy.firstCall.args[0].itemData, item2, "titleRenderedSpy.firstCall.args[0].itemData");

        assert.equal(this.itemRenderedSpy.callCount, 1, "itemRenderedSpy");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, item2, "itemRenderedSpy.firstCall.args[0].itemData");
        assert.equal(this.itemRenderedSpy.firstCall.args[0].itemIndex, 0, "itemRenderedSpy.firstCall.args[0].index");

        assert.equal(this.itemDeletedSpy.callCount, 1, "onItemDeleted");
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData, item1, "itemDeletedSpy.firstCall.args[0].itemData");

        assert.notOk(this.tabPanelContainsElement(item1.text), item1.text, `doesn't contain '${item1.text}'`);
        assert.ok(this.tabPanelContainsElement(item2.text), item2.text, `contains '${item2.text}'`);

        assert.notOk(this.tabPanelContainsElement(item1.content), item1.content, `doesn't contain '${item1.content}'`);
        assert.ok(this.tabPanelContainsElement(item2.content), item2.content, `contains '${item2.content}'`);
    });

    QUnit.test("[{1}, {2}] -> [{1}]", function(assert) {
        const item1 = { text: "1a", content: "1a_" };
        const item2 = { text: "2a", content: "2a_" };
        this.createTabPanel({ items: [item1, item2] });

        this.tabPanel.option("items", [item1]);
        this.clock.tick(1);

        assert.equal(this.titleRenderedSpy.callCount, 0, "titleRenderedSpy.callCount");

        assert.equal(this.itemRenderedSpy.callCount, 0, "itemRenderedSpy");
        assert.ok(this.tabPanelContainsElement(item1.content), item1.content, `contains '${item1.content}'`);

        assert.equal(this.itemDeletedSpy.callCount, 1, "onItemDeleted");
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData, item2, "itemDeletedSpy.firstCall.args[0].itemData");

        assert.ok(this.tabPanelContainsElement(item1.text), item1.text, `contains '${item1.text}'`);
        assert.notOk(this.tabPanelContainsElement(item2.text), item2.text, `doesn't contain '${item2.text}'`);

        assert.ok(this.tabPanelContainsElement(item1.content), item1.content, `contains '${item1.content}'`);
        assert.notOk(this.tabPanelContainsElement(item2.content), item2.content, `doesn't contain '${item2.content}'`);
    });

    QUnit.test("[{1}, {2}] -> [{1, visible:false}, {2}]", function(assert) {
        const item1 = { text: "1a", content: "1a_" };
        const item2 = { text: "2a", content: "2a_" };
        this.createTabPanel({ items: [item1, item2] });

        const item1_ = { text: "1a", content: "1a_", visible: false };
        this.tabPanel.option("items", [item1_, item2]);
        this.clock.tick(1);

        assert.equal(this.titleRenderedSpy.callCount, 1, "titleRenderedSpy.callCount");
        assert.deepEqual(this.titleRenderedSpy.firstCall.args[0].itemData, item1_, "titleRenderedSpy.firstCall.args[0].itemData");

        assert.equal(this.itemRenderedSpy.callCount, 2, "itemRenderedSpy");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, item2, "itemRenderedSpy.firstCall.args[0].itemData");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemIndex, 1, "itemRenderedSpy.firstCall.args[0].index");
        assert.deepEqual(this.itemRenderedSpy.secondCall.args[0].itemData, item1_, "itemRenderedSpy.firstCall.args[0].itemData");
        assert.deepEqual(this.itemRenderedSpy.secondCall.args[0].itemIndex, 0, "itemRenderedSpy.firstCall.args[0].index");

        assert.equal(this.itemDeletedSpy.callCount, 1, "onItemDeleted");
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData, item1, "itemDeletedSpy.firstCall.args[0].itemData");

        assert.ok(this.tabPanelContainsElement(item1.text), item1.text, `contains '${item1.text}'`);
        assert.ok(this.tabPanelContainsElement(item2.text), item2.text, `contains '${item2.text}'`);

        assert.ok(this.tabPanelContainsElement(item1.content), item1.content, `contains '${item1.content}'`);
        assert.ok(this.tabPanelContainsElement(item2.content), item2.content, `contains '${item2.content}'`);
    });

    QUnit.test("[{1}, {2}] -> [{2}]", function(assert) {
        const item1 = { text: "1a", content: "1a_" };
        const item2 = { text: "2a", content: "2a_" };
        this.createTabPanel({ items: [item1, item2] });

        this.tabPanel.option("items", [item2]);
        this.clock.tick(1);

        assert.equal(this.titleRenderedSpy.callCount, 0, "titleRenderedSpy.callCount");

        assert.equal(this.itemRenderedSpy.callCount, 1, "itemRenderedSpy");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, item2, "itemRenderedSpy.firstCall.args[0].itemData");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemIndex, 0, "itemRenderedSpy.firstCall.args[0].index");

        assert.equal(this.itemDeletedSpy.callCount, 1, "onItemDeleted");
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData, item1, "itemDeletedSpy.firstCall.args[0].itemData");

        assert.notOk(this.tabPanelContainsElement(item1.text), item1.text, `doesn't contain '${item1.text}'`);
        assert.ok(this.tabPanelContainsElement(item2.text), item2.text, `contains '${item2.text}'`);

        assert.notOk(this.tabPanelContainsElement(item1.content), item1.content, `doesn't contain '${item1.content}'`);
        assert.ok(this.tabPanelContainsElement(item2.content), item2.content, `contains '${item2.content}'`);
    });

    QUnit.test("[{1}, {2, selected}]", function(assert) {
        const item1 = { text: "1a", content: "1a_" };
        const item2 = { text: "2a", content: "2a_" };
        this.createTabPanel({ items: [item1, item2], selectedIndex: 1 });

        this.clock.tick(1);

        assert.ok(this.tabPanelContainsElement(item1.text), item1.text, `contains '${item1.text}'`);
        assert.ok(this.tabPanelContainsElement(item2.text), item2.text, `contains '${item2.text}'`);

        assert.notOk(this.tabPanelContainsElement(item1.content), item1.content, `doesn't contain '${item1.content}'`);
        assert.ok(this.tabPanelContainsElement(item2.content), item2.content, `contains '${item2.content}'`);
    });

    QUnit.test("[{1}, {2, selected}] -> [{1}]", function(assert) {
        const item1 = { text: "1a", content: "1a_" };
        const item2 = { text: "2a", content: "2a_" };
        this.createTabPanel({ items: [item1, item2], selectedIndex: 1 });

        this.tabPanel.option("items", [item1]);
        this.clock.tick(1);

        assert.equal(this.titleRenderedSpy.callCount, 0, "titleRenderedSpy.callCount");

        assert.equal(this.itemRenderedSpy.callCount, 1, "itemRenderedSpy");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, item1, "itemRenderedSpy.firstCall.args[0].itemData");

        assert.equal(this.itemDeletedSpy.callCount, 1, "onItemDeleted");
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData, item2, "itemDeletedSpy.firstCall.args[0].itemData");

        assert.ok(this.tabPanelContainsElement(item1.text), item1.text, `contains '${item1.text}'`);
        assert.notOk(this.tabPanelContainsElement(item2.text), item2.text, `doesn't contain '${item2.text}'`);

        assert.ok(this.tabPanelContainsElement(item1.content), item1.content, `contains '${item1.content}'`);
        assert.notOk(this.tabPanelContainsElement(item2.content), item2.content, `doesn't contain '${item2.content}'`);
    });

    QUnit.test("[{1}, {2, selected}, {3}] -> [{1}, {3}]", function(assert) {
        const item1 = { text: "1a", content: "1a_" };
        const item2 = { text: "2a", content: "2a_" };
        const item3 = { text: "3a", content: "3a_" };
        this.createTabPanel({ items: [item1, item2, item3], selectedIndex: 1 });

        this.clock.tick(1);

        assert.ok(this.tabPanelContainsElement(item1.text), item1.text, `contains '${item1.text}'`);
        assert.ok(this.tabPanelContainsElement(item2.text), item2.text, `contains '${item2.text}'`);
        assert.ok(this.tabPanelContainsElement(item3.text), item3.text, `contains '${item3.text}'`);

        assert.notOk(this.tabPanelContainsElement(item1.content), item1.content, `doesn't contain '${item1.content}'`);
        assert.ok(this.tabPanelContainsElement(item2.content), item2.content, `contains '${item2.content}'`);
        assert.notOk(this.tabPanelContainsElement(item3.content), item3.content, `doesn't contain '${item3.content}'`);
    });

    QUnit.test("[{1}, {2, selected}, {3}] -> [{1}, {3}]", function(assert) {
        const item1 = { text: "1a", content: "1a_" };
        const item2 = { text: "2a", content: "2a_" };
        const item3 = { text: "3a", content: "3a_" };
        this.createTabPanel({ items: [item1, item2, item3], selectedIndex: 1 });

        this.tabPanel.option("items", [item1, item3]);
        this.clock.tick(1);

        assert.equal(this.titleRenderedSpy.callCount, 0, "titleRenderedSpy.callCount");

        assert.equal(this.itemRenderedSpy.callCount, 1, "itemRenderedSpy");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, item3, "itemRenderedSpy.firstCall.args[0].itemData");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemIndex, 1, "itemRenderedSpy.firstCall.args[0].index");

        assert.equal(this.itemDeletedSpy.callCount, 1, "onItemDeleted");
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData, item2, "itemDeletedSpy.firstCall.args[0].itemData");

        assert.ok(this.tabPanelContainsElement(item1.text), item1.text, `contains '${item1.text}'`);
        assert.notOk(this.tabPanelContainsElement(item2.text), item2.text, `doesn't contain '${item2.text}'`);
        assert.ok(this.tabPanelContainsElement(item3.text), item3.text, `contains '${item3.text}'`);

        assert.notOk(this.tabPanelContainsElement(item1.content), item1.content, `doesn't contain '${item1.content}'`);
        assert.notOk(this.tabPanelContainsElement(item2.content), item2.content, `doesn't contain '${item2.content}'`);
        assert.ok(this.tabPanelContainsElement(item3.content), item3.content, `contains '${item3.content}'`);
    });
});
