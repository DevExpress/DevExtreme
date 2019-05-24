import $ from "jquery";
import eventsEngine from "events/core/events_engine";
import { TreeViewTestWrapper, TreeViewDataHelper } from "../../../helpers/TreeViewTestHelper.js";

let { module, test, } = QUnit;

const createInstance = (options) => new TreeViewTestWrapper(options);
const dataHelper = new TreeViewDataHelper();

module("Checkboxes", () => {
    test("Set intermediate state for parent if at least a one child is selected", () => {
        let data = $.extend(true, [], dataHelper.data[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;

        const treeView = createInstance({
            items: data,
            showCheckBoxesMode: "normal"
        });

        eventsEngine.trigger(treeView.getCheckBoxes(4), "dxclick");

        treeView.checkCheckBoxesState([undefined, false, undefined, false, true, false]);
    });

    test("selectNodesRecursive = false", () => {
        let data = $.extend(true, [], dataHelper.data[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;

        const treeView = createInstance({
            items: data,
            selectNodesRecursive: false,
            showCheckBoxesMode: "normal"
        });

        eventsEngine.trigger(treeView.getCheckBoxes(4), "dxclick");

        treeView.checkCheckBoxesState([false, false, false, false, true, false]);
    });

    test("Remove intermediate state from parent if all children are unselected", () => {
        let data = $.extend(true, [], dataHelper.data[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;

        const treeView = createInstance({
            items: data,
            showCheckBoxesMode: "normal"
        });

        let checkboxes = treeView.getCheckBoxes();
        eventsEngine.trigger(checkboxes.eq(4), "dxclick");
        eventsEngine.trigger(checkboxes.eq(3), "dxclick");
        eventsEngine.trigger(checkboxes.eq(4), "dxclick");

        treeView.checkCheckBoxesState([undefined, false, undefined, true, false, false]);

        eventsEngine.trigger(checkboxes.eq(3), "dxclick");

        treeView.checkCheckBoxesState([false, false, false, false, false, false]);
    });

    test("Parent node should be selected if all children are selected", () => {
        var data = $.extend(true, [], dataHelper.data[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;

        const treeView = createInstance({
            items: data,
            showCheckBoxesMode: "normal"
        });

        let checkboxes = treeView.getCheckBoxes();
        eventsEngine.trigger(checkboxes.eq(4), "dxclick");
        eventsEngine.trigger(checkboxes.eq(3), "dxclick");

        treeView.checkCheckBoxesState([undefined, false, true, true, true, false]);
    });

    test("All children should be selected/unselected after click on parent node", () => {
        var data = $.extend(true, [], dataHelper.data[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;

        const treeView = createInstance({
            items: data,
            showCheckBoxesMode: "normal"
        });

        let checkboxes = treeView.getCheckBoxes();
        eventsEngine.trigger(checkboxes.eq(2), "dxclick");

        treeView.checkCheckBoxesState([undefined, false, true, true, true, false]);

        eventsEngine.trigger(checkboxes.eq(2), "dxclick");

        treeView.checkCheckBoxesState([false, false, false, false, false, false]);
    });

    test("Regression: incorrect parent state", () => {
        var data = $.extend(true, [], dataHelper.data2);
        data[2].expanded = true;

        const treeView = createInstance({
            dataSource: data,
            dataStructure: "plain",
            showCheckBoxesMode: "normal"
        });

        let checkboxes = treeView.getCheckBoxes();

        eventsEngine.trigger(checkboxes.eq(3), "dxclick");
        eventsEngine.trigger(checkboxes.eq(4), "dxclick");
        eventsEngine.trigger(checkboxes.eq(5), "dxclick");
        eventsEngine.trigger(checkboxes.eq(6), "dxclick");

        treeView.checkCheckBoxesState([undefined, false, true, true, true, true, true, false, false, false]);
    });

    test("T173381", () => {
        const treeView = createInstance({
            items: [
                {
                    id: 777, text: 'root', items: [
                        {
                            id: 1, text: 'a', items:
                            [
                                {
                                    id: 11, text: 'a.1', expanded: true,
                                    items: [
                                        { id: 111, text: 'a.1.1' },
                                        { id: 112, text: 'a.1.2' }
                                    ]
                                },
                                { id: 12, text: 'a.2' }]
                        },
                        {
                            id: 2, text: 'b', expanded: true,
                            items: [
                                { id: 21, text: 'b.1' },
                                { id: 22, text: 'b.2' }
                            ]
                        }
                    ]
                }
            ],
            showCheckBoxesMode: "normal"
        });

        let checkboxes = treeView.getCheckBoxes();

        eventsEngine.trigger(checkboxes.eq(2), "dxclick");
        treeView.checkCheckBoxesState([undefined, undefined, true, true, true, false, false, false, false]);

        eventsEngine.trigger(checkboxes.eq(6), "dxclick");
        treeView.checkCheckBoxesState([undefined, undefined, true, true, true, false, true, true, true]);

        eventsEngine.trigger(checkboxes.eq(6), "dxclick");
        treeView.checkCheckBoxesState([undefined, undefined, true, true, true, false, false, false, false]);
    });

    test("T195986", () => {
        const treeView = createInstance({
            items: [
                {
                    id: 777, text: 'root', expanded: true, selected: true,
                    items: [
                        {
                            id: 1, text: 'a', expanded: true, selected: true, items:
                            [
                                {
                                    id: 11, text: 'a.1', expanded: true, selected: true,
                                    items: [
                                        { id: 111, text: 'a.1.1', selected: true },
                                        { id: 112, text: 'a.1.2', selected: true }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            showCheckBoxesMode: "normal"
        });

        let checkboxes = treeView.getCheckBoxes();

        eventsEngine.trigger(checkboxes.eq(3), "dxclick");
        treeView.checkCheckBoxesState([undefined, undefined, undefined, false, true]);

        eventsEngine.trigger(checkboxes.eq(3), "dxclick");
        treeView.checkCheckBoxesState([true, true, true, true, true]);
    });

    test("Selection works correct with custom rootValue", (assert) => {
        const data = [
            { id: 0, parentId: "none", text: "Animals" },
            { id: 1, parentId: 0, text: "Cat" },
            { id: 2, parentId: 0, text: "Dog" },
            { id: 3, parentId: 0, text: "Cow" },
            { id: 4, parentId: "none", text: "Birds" }
        ];
        const treeView = createInstance({
            dataSource: data,
            dataStructure: "plain",
            showCheckBoxesMode: "normal",
            rootValue: "none"
        });

        eventsEngine.trigger(treeView.getToggleItemVisibility().eq(0), "dxclick");

        assert.equal(treeView.instance.option("items").length, 5);

        let checkboxes = treeView.getCheckBoxes();
        eventsEngine.trigger(checkboxes.eq(1), "dxclick");

        let nodes = treeView.instance.getNodes();
        assert.ok(nodes[0].items[0].selected, "item was selected");
        assert.strictEqual(nodes[0].selected, undefined, "item selection has undefined state");
    });
});
