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

        this.containsElement = (id) => {
            try {
                return this.$tabPanel.find("#id_" + id)[0].textContent;
            } catch(e) {}
        };
        this.checkNotContainsElements = (assert, idList) => {
            idList.forEach((id) => { assert.notOk(this.containsElement(id), `doesn't contain '${id}'`); });
        };
        this.checkContainsElements = (assert, idList) => {
            idList.forEach((id) => { assert.ok(this.containsElement(id), `contains '${id}'`); });
        };
        this.checkTitleRendered = (assert, callCount, itemData) => {
            assert.equal(this.titleRenderedSpy.callCount, callCount, "titleRenderedSpy.callCount");
            if(callCount > 0) {
                assert.deepEqual(this.titleRenderedSpy.firstCall.args[0].itemData, itemData, "titleRenderedSpy.firstCall.args[0].itemData");
            }
        };
        this.checkItemRendered = (assert, callCount, itemData1, itemIndex1, itemData2, itemIndex2) => {
            assert.equal(this.itemRenderedSpy.callCount, callCount, "itemRenderedSpy.callCount");
            if(callCount > 0) {
                assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, itemData1, "itemRenderedSpy.firstCall.args[0].itemData");
                assert.equal(this.itemRenderedSpy.firstCall.args[0].itemIndex, itemIndex1, "itemRenderedSpy.firstCall.args[0].index");
            }
            if(callCount > 1) {
                assert.deepEqual(this.itemRenderedSpy.secondCall.args[0].itemData, itemData2, "itemRenderedSpy.secondCall.args[0].itemData");
                assert.equal(this.itemRenderedSpy.secondCall.args[0].itemIndex, itemIndex2, "itemRenderedSpy.secondCall.args[0].index");
            }
            if(callCount > 2) {
                assert.ok(false, "callCount > 2");
            }
        };
        this.checkItemDeleted = (assert, callCount, itemData) => {
            assert.equal(this.itemDeletedSpy.callCount, callCount, "itemDeletedSpy.callCount");
            if(callCount > 0) {
                assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData, itemData, "itemDeletedSpy.firstCall.args[0].itemData");
            }
        };
        this.checkContainsEmptyMessage = (assert, expected) => {
            assert.equal(this.$tabPanel.find(".dx-empty-message").length, expected ? 1 : 0, "EmptyMessage elements count");
        };
    },
    afterEach() {
        fx.animate = this.origAnimate;
        this.clock.restore();
    }

}, () => {
    ["items", "dataSource"].forEach(dataSourcePropertyName => {
        let testContext = `, option(${dataSourcePropertyName})`;
        QUnit.test("[{1}] -> []" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            this.createTabPanel({ items: [item1] });

            this.tabPanel.option(dataSourcePropertyName, []);
            this.clock.tick(1);

            this.checkTitleRendered(assert, 0);
            this.checkItemRendered(assert, 0);
            this.checkItemDeleted(assert, 1, item1);

            this.checkNotContainsElements(assert, [item1.text, item1.content]);
            this.checkContainsEmptyMessage(assert, true);
        });

        QUnit.test("[{1}] -> [{1}, {2}]" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            this.createTabPanel({ items: [item1] });

            const item2 = { text: "2a", content: "2a_" };
            this.tabPanel.option(dataSourcePropertyName, [item1, item2]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, 1, item2);
            this.checkItemRendered(assert, 0);
            this.checkItemDeleted(assert, 0);

            this.checkContainsElements(assert, [item1.text, item2.text, item1.content]);
            this.checkNotContainsElements(assert, [item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test("[{1, text: 1a, content: 1a_}] -> [{1, text: 1a, content: 1a_upd}]" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            this.createTabPanel({ items: [item1] });

            const item1_ = { text: "1a", content: "1a_upd" };
            this.tabPanel.option(dataSourcePropertyName, [item1_]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, 1, item1_);
            this.checkItemRendered(assert, 1, item1_, 0);
            this.checkItemDeleted(assert, 1, item1);

            this.checkContainsElements(assert, [item1_.text, item1_.content]);
            this.checkNotContainsElements(assert, [item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test("[{1, text: 1a, content: 1a_}] -> [{1, text: 1aupd, content: 1a_}]" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            this.createTabPanel({ items: [item1] });

            const item1_ = { text: "1aupd", content: "1a_" };
            this.tabPanel.option(dataSourcePropertyName, [item1_]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, 1, item1_);
            this.checkItemRendered(assert, 1, item1_, 0);
            this.checkItemDeleted(assert, 1, item1);

            this.checkContainsElements(assert, [item1_.text, item1_.content]);
            this.checkNotContainsElements(assert, [item1.text]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test("[{1, text: 1a, content: 1a_}] -> [{1, text: 1aupd, content: 1a_upd}]" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            this.createTabPanel({ items: [item1] });

            const item1_ = { text: "1aupd", content: "1a_upd" };
            this.tabPanel.option(dataSourcePropertyName, [item1_]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, 1, item1_);
            this.checkItemRendered(assert, 1, item1_, 0);
            this.checkItemDeleted(assert, 1, item1);

            this.checkContainsElements(assert, [item1_.text, item1_.content]);
            this.checkNotContainsElements(assert, [item1.text, item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test("[{1}] -> [{2}]" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            this.createTabPanel({ items: [item1] });

            const item2_ = { text: "2a", content: "2a_" };
            this.tabPanel.option(dataSourcePropertyName, [item2_]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, 1, item2_);
            this.checkItemRendered(assert, 1, item2_, 0);
            this.checkItemDeleted(assert, 1, item1);

            this.checkContainsElements(assert, [item2_.text, item2_.content]);
            this.checkNotContainsElements(assert, [item1.text, item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test("[{1}, {2}] -> [{1}]" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            const item2 = { text: "2a", content: "2a_" };
            this.createTabPanel({ items: [item1, item2] });

            this.tabPanel.option(dataSourcePropertyName, [item1]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, 0);
            this.checkItemRendered(assert, 0);
            this.checkItemDeleted(assert, 1, item2);

            this.checkContainsElements(assert, [item1.text, item1.content]);
            this.checkNotContainsElements(assert, [item2.text, item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test("[{1}, {2}] -> [selectedIndex: 1]" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            const item2 = { text: "2a", content: "2a_" };
            this.createTabPanel({ items: [item1, item2] });

            this.tabPanel.option("selectedIndex", 1);
            this.clock.tick(1);

            this.checkTitleRendered(assert, 0);
            this.checkItemRendered(assert, 1, item2, 1);
            this.checkItemDeleted(assert, 0);

            this.checkContainsElements(assert, [item1.text, item1.content, item2.text, item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test("[{1}, {2}] -> [{1, visible:false}, {2}]" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            const item2 = { text: "2a", content: "2a_" };
            this.createTabPanel({ items: [item1, item2] });

            const item1_ = { text: "1a", content: "1a_", visible: false };
            this.tabPanel.option(dataSourcePropertyName, [item1_, item2]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, 1, item1_);
            this.checkItemRendered(assert, 2, item2, 1, item1_, 0);
            this.checkItemDeleted(assert, 1, item1);

            this.checkContainsElements(assert, [item1.text, item1.content, item2.text, item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test("[{1}, {2}] -> [{2}]" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            const item2 = { text: "2a", content: "2a_" };
            this.createTabPanel({ items: [item1, item2] });

            this.tabPanel.option(dataSourcePropertyName, [item2]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, 0);
            this.checkItemRendered(assert, 1, item2, 0);
            this.checkItemDeleted(assert, 1, item1);

            this.checkContainsElements(assert, [item2.text, item2.content]);
            this.checkNotContainsElements(assert, [item1.text, item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test("[{1}, {2, selected}]" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            const item2 = { text: "2a", content: "2a_" };

            this.createTabPanel({ items: [item1, item2], selectedIndex: 1 });
            this.clock.tick(1);

            this.checkContainsElements(assert, [item1.text, item2.text, item2.content]);
            this.checkNotContainsElements(assert, [item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test("[{1}, {2, selected}] -> [{1}]" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            const item2 = { text: "2a", content: "2a_" };
            this.createTabPanel({ items: [item1, item2], selectedIndex: 1 });

            this.tabPanel.option(dataSourcePropertyName, [item1]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, 0);
            this.checkItemRendered(assert, 1, item1, 0);
            this.checkItemDeleted(assert, 1, item2);

            this.checkContainsElements(assert, [item1.text, item1.content]);
            this.checkNotContainsElements(assert, [item2.text, item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test("[{1}, {2, selected}, {3}]" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            const item2 = { text: "2a", content: "2a_" };
            const item3 = { text: "3a", content: "3a_" };

            this.createTabPanel({ items: [item1, item2, item3], selectedIndex: 1 });
            this.clock.tick(1);

            this.checkContainsElements(assert, [item1.text, item2.text, item2.content, item3.text]);
            this.checkNotContainsElements(assert, [item1.content, item3.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test("[{1}, {2, selected}, {3}] -> [{1}, {3}]" + testContext, function(assert) {
            const item1 = { text: "1a", content: "1a_" };
            const item2 = { text: "2a", content: "2a_" };
            const item3 = { text: "3a", content: "3a_" };
            this.createTabPanel({ items: [item1, item2, item3], selectedIndex: 1 });

            this.tabPanel.option(dataSourcePropertyName, [item1, item3]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, 0);
            this.checkItemRendered(assert, 1, item3, 1);
            this.checkItemDeleted(assert, 1, item2);

            this.checkContainsElements(assert, [item1.text, item3.text, item3.content]);
            this.checkNotContainsElements(assert, [item1.content, item2.text, item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });
    });
});
