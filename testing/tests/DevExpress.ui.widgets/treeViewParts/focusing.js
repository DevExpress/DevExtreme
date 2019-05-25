import $ from "jquery";
import { noop } from "core/utils/common";
import { isRenderer } from "core/utils/type";
import config from "core/config";
import devices from "core/devices";
import eventsEngine from "events/core/events_engine";
import { TreeViewTestWrapper, TreeViewDataHelper } from "../../../helpers/TreeViewTestHelper.js";

let { module, test, testInActiveWindow } = QUnit;

const createInstance = (options) => new TreeViewTestWrapper(options);
const dataHelper = new TreeViewDataHelper();

module("Focusing", () => {
    testInActiveWindow("item should have focus-state class after click on it", (assert) => {
        const treeView = createInstance({
            items: dataHelper.data[0],
            focusStateEnabled: true
        });

        eventsEngine.trigger(treeView.getItems(0), "dxpointerdown");

        assert.equal(isRenderer(treeView.instance.option("focusedElement")), !!config().useJQuery, "focusedElement is correct");
        assert.ok(treeView.getNodes(0).hasClass("dx-state-focused"), "focus state was toggle after click");
    });

    testInActiveWindow("disabled item should not have focus-state class after click on it", (assert) => {
        let treeViewData = $.extend(true, [], dataHelper.data[0]);
        treeViewData[0].disabled = true;

        const treeView = createInstance({
            items: treeViewData,
            focusStateEnabled: true
        });

        eventsEngine.trigger(treeView.getItems(0), "dxpointerdown");

        assert.ok(!treeView.getNodes(0).hasClass("dx-state-focused"), "focus state was toggle after click");
    });

    testInActiveWindow("widget should not have focus-state class after click on arrow", (assert) => {
        const treeView = createInstance({
            items: dataHelper.data[0],
            focusStateEnabled: true
        });

        eventsEngine.trigger(treeView.getSelectAllItem(), "dxclick");

        assert.ok(!treeView.getNodes(0).hasClass("dx-state-focused"), "focus state was toggle after click");
    });

    test("focus on the item should move scroll position to this item (T226868)", (assert) => {
        assert.expect(1);

        if(devices.real().platform !== "generic") {
            assert.ok(true, "unnecessary test on mobile devices");
            return;
        }

        const treeView = createInstance({
            items: [{ id: 1, text: "item 1" }, { id: 2, text: "item 2", expanded: true, items: [{ id: 3, text: "item 3" }] }],
            focusStateEnabled: true,
            height: 40
        });

        let scrollable = treeView.getElement().find(`.${treeView.classes.SCROLLABLE_CLASS}`).dxScrollable("instance");

        scrollable.option("onScroll", function(args) {
            assert.equal(args.scrollOffset.top, 24, "scrolled to the item");
            scrollable.option("onScroll", noop);
        });

        eventsEngine.trigger(treeView.getItems(1), "dxpointerdown");
    });

    test("PointerDown event at checkbox should not be ignored", (assert) => {
        const treeView = createInstance({
            dataSource: [ { id: 1, parentId: 0, text: "Cats" } ],
            dataStructure: "plain",
            showCheckBoxesMode: "normal"
        });

        let pointerDownStub = sinon.stub(treeView.instance, "_itemPointerDownHandler");
        eventsEngine.trigger(treeView.getCheckBoxes(0), "dxpointerdown");

        assert.equal(pointerDownStub.callCount, 1, "itemPointerDownHandler was called");
    });

    test("PointerDown event at expansion arrow should not be ignored", (assert) => {
        const treeView = createInstance({
            dataSource: [
                { id: 1, parentId: 0, text: "Cats" },
                { id: 2, parentId: 1, text: "Maine Coon" }
            ],
            dataStructure: "plain"
        });

        let pointerDownStub = sinon.stub(treeView.instance, "_itemPointerDownHandler");
        eventsEngine.trigger(treeView.getToggleItemVisibility(), "dxpointerdown");

        assert.equal(pointerDownStub.callCount, 1, "itemPointerDownHandler was called");
    });

    test("Scroll should not jump down when focusing on item (T492496)", (assert) => {
        const treeView = createInstance({
            items: [{ id: 1, text: "item 1" }, { id: 2, text: "item 2", expanded: true, items: [{ id: 3, text: "item 3" }] }],
            focusStateEnabled: true,
            height: 40
        });
        let $items = treeView.getItems();
        let scrollable = treeView.getElement().find(`.${treeView.classes.SCROLLABLE_CLASS}`).dxScrollable("instance");
        let clock = sinon.useFakeTimers();

        try {
            eventsEngine.trigger($items.last(), "dxpointerdown");
            assert.equal(scrollable.scrollTop(), 56, "scroll top position");

            scrollable.scrollTo({ y: 0 });
            assert.equal(scrollable.scrollTop(), 0, "scroll top position");

            eventsEngine.trigger(treeView.getElement, "focusin");
            assert.equal(scrollable.scrollTop(), 0, "scroll top position");

            eventsEngine.trigger($items.first(), "dxpointerdown");
            clock.tick();
            assert.equal(scrollable.scrollTop(), 0, "scroll top position");
        } finally {
            clock.restore();
        }
    });

    test("Scroll should not jump down when focusing on Select All (T517945)", (assert) => {
        const treeView = createInstance({
            items: [{ id: 1, text: "item 1" }, { id: 2, text: "item 2", expanded: true, items: [{ id: 3, text: "item 3" }] }],
            showCheckBoxesMode: "selectAll",
            focusStateEnabled: true,
            height: 40
        });
        let $items = treeView.getItems();
        let scrollable = treeView.getElement().find(`.${treeView.classes.SCROLLABLE_CLASS}`).dxScrollable("instance");
        let clock = sinon.useFakeTimers();

        try {
            eventsEngine.trigger($items.last(), "dxpointerdown");
            assert.equal(scrollable.scrollTop(), 106, "scroll top position");

            scrollable.scrollTo({ y: 0 });
            assert.equal(scrollable.scrollTop(), 0, "scroll top position");

            eventsEngine.trigger(treeView.getElement, "focusin");
            assert.equal(scrollable.scrollTop(), 0, "scroll top position");

            eventsEngine.trigger(treeView.getSelectAllItem().first(), "dxpointerdown");
            clock.tick();
            assert.equal(scrollable.scrollTop(), 0, "scroll top position");
        } finally {
            clock.restore();
        }
    });

    testInActiveWindow("Focusing widget when there is search editor", (assert) => {
        const treeView = createInstance({
            items: $.extend(true, [], dataHelper.data[0]),
            searchEnabled: true
        });

        treeView.instance.focus();

        assert.ok(treeView.getElement.children(`.${treeView.classes.SEARCH_CLASS}`).hasClass(`${this.classes.FOCUSED_ITEM_CLASS}`), "search editor is focused");
    });

});
