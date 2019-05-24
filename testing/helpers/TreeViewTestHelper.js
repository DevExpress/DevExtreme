import $ from "jquery";
import { isDefined } from "core/utils/type";

const CONTAINER_ID = "treeView";
const WIDGET_CLASS = "dx-treeview";

const NODE_CLASS = `${WIDGET_CLASS}-node`;
const NODE_CONTAINER_CLASS = `${NODE_CLASS}-container`;
const OPENED_NODE_CONTAINER_CLASS = `${NODE_CLASS}-container-opened`;
const IS_LEAF = `${NODE_CLASS}-is-leaf`;
const SEARCH_CLASS = "dx-treeview-search";

const ITEM_CLASS = `${WIDGET_CLASS}-item`;
const ITEM_WITH_CHECKBOX_CLASS = `${ITEM_CLASS}-with-checkbox`;
const ITEM_WITHOUT_CHECKBOX_CLASS = `${ITEM_CLASS}-without-checkbox`;
const ITEM_DATA_KEY = `${ITEM_CLASS}-data`;

const TOGGLE_ITEM_VISIBILITY_CLASS = `${WIDGET_CLASS}-toggle-item-visibility`;
const TOGGLE_ITEM_VISIBILITY_OPENED_CLASS = `${WIDGET_CLASS}-toggle-item-visibility-opened`;
const SELECT_ALL_ITEM_CLASS = `${WIDGET_CLASS}-select-all-item`;

const SCROLLABLE_CLASS = "dx-scrollable";
const SCROLLABLE_CONTENT_CLASS = `${SCROLLABLE_CLASS}-content`;
const CHECK_BOX_CHECKED_CLASS = "dx-checkbox-checked";
const CHECKBOX_INDETERMINATE_CLASS = "dx-checkbox-indeterminate";
const SELECTED_ITEM_CLASS = "dx-state-selected";
const FOCUSED_ITEM_CLASS = "dx-state-focused";
const DISABLED_ITEM_CLASS = "dx-state-disabled";
const EMPTY_MESSAGE_CLASS = "dx-empty-message";

const { assert } = QUnit;

class TreeViewTestWrapper {
    constructor(options) {
        this.classes = {
            WIDGET_CLASS: WIDGET_CLASS,
            NODE_CLASS: NODE_CLASS,
            ITEM_CLASS: ITEM_CLASS,
            SELECTED_ITEM_CLASS: SELECTED_ITEM_CLASS,
            SEARCH_CLASS: SEARCH_CLASS,
            FOCUSED_ITEM_CLASS: FOCUSED_ITEM_CLASS,
            DISABLED_ITEM_CLASS: DISABLED_ITEM_CLASS,
            CHECK_BOX_CLASS: "dx-checkbox",
            CHECK_BOX_CHECKED_CLASS: CHECK_BOX_CHECKED_CLASS,
            CHECKBOX_INDETERMINATE_CLASS: CHECKBOX_INDETERMINATE_CLASS,
            NODE_CONTAINER_CLASS: NODE_CONTAINER_CLASS,
            OPENED_NODE_CONTAINER_CLASS: OPENED_NODE_CONTAINER_CLASS,
            SCROLLABLE_CONTENT_CLASS: SCROLLABLE_CONTENT_CLASS,
            EMPTY_MESSAGE_CLASS: EMPTY_MESSAGE_CLASS,
            ITEM_WITH_CHECKBOX_CLASS: ITEM_WITH_CHECKBOX_CLASS,
            ITEM_WITHOUT_CHECKBOX_CLASS: ITEM_WITHOUT_CHECKBOX_CLASS,
            ITEM_DATA_KEY: ITEM_DATA_KEY,
            IS_LEAF: IS_LEAF,
            TOGGLE_ITEM_VISIBILITY_CLASS: TOGGLE_ITEM_VISIBILITY_CLASS,
            TOGGLE_ITEM_VISIBILITY_OPENED_CLASS: TOGGLE_ITEM_VISIBILITY_OPENED_CLASS,
            SELECT_ALL_ITEM_CLASS: SELECT_ALL_ITEM_CLASS,
            SCROLLABLE_CLASS: SCROLLABLE_CLASS
        };

        this.instance = this.getInstance(options);
    }
    hasWidgetClass() { return this.getElement().hasClass(WIDGET_CLASS); }
    getToggleItemVisibility() { return this.getElement().find(`.${this.classes.TOGGLE_ITEM_VISIBILITY_CLASS}`); }
    getToggleItemVisibilityInNode($node) { return $node.find(`.${this.classes.TOGGLE_ITEM_VISIBILITY_CLASS}`); }
    isToggleItemVisibilityOpened() { return this.getToggleItemVisibility().hasClass(TOGGLE_ITEM_VISIBILITY_OPENED_CLASS); }
    getElement() { return $(`#${CONTAINER_ID}`); }
    getInstance(options) { return this.getElement().dxTreeView(options).dxTreeView("instance"); }
    getNodes(index) {
        return isDefined(index) ? this.getElement().find(`.${this.classes.NODE_CLASS}`).eq(index) : this.getElement().find(`.${this.classes.NODE_CLASS}`);
    }
    hasSelectedClass($node) { return $node.hasClass(SELECTED_ITEM_CLASS); }
    isDisabled($item) { return $item.hasClass(DISABLED_ITEM_CLASS); }
    hasFocusedClass($item) { return $item.hasClass(FOCUSED_ITEM_CLASS); }
    isSearch($item) { return $item.hasClass(SEARCH_CLASS); }
    hasCheckBoxCheckedClass($item) { return $item.hasClass(CHECK_BOX_CHECKED_CLASS); }
    hasCheckBoxIndeterminateClass($item) { return $item.hasClass(CHECKBOX_INDETERMINATE_CLASS); }

    findEmptyMessageClass($item) { return $item.find(`.${EMPTY_MESSAGE_CLASS}`); }

    getNodeContainers() { return this.getElement().find(`.${this.classes.NODE_CONTAINER_CLASS}`); }
    getNodeContainersInNode($node, index) {
        return isDefined(index) ? $node.find(`.${this.classes.NODE_CONTAINER_CLASS}`).eq(index) : $node.find(`.${this.classes.NODE_CONTAINER_CLASS}`);
    }
    getNodesInNode($node) { return $node.find(`.${this.classes.NODE_CLASS}`); }
    getItemsInNode($node) { return $node.find(`.${this.classes.ITEM_CLASS}`); }
    getItems(index) {
        return isDefined(index) ? this.getElement().find(`.${this.classes.ITEM_CLASS}`).eq(index) : this.getElement().find(`.${this.classes.ITEM_CLASS}`);
    }
    getSelectedNodes() { return this.getElement().find(`.${this.classes.NODE_CLASS}.${this.classes.SELECTED_ITEM_CLASS}`); }
    getCheckBoxes(index) {
        let checkBoxes = this.getElement().find(`.${this.classes.CHECK_BOX_CLASS}:not(.${SELECT_ALL_ITEM_CLASS})`);
        return isDefined(index) ? checkBoxes.eq(index) : checkBoxes;
    }
    getNodesWithCheckBoxes() { return this.getElement().find(`.${this.classes.NODE_CLASS} .${this.classes.CHECK_BOX_CLASS}`); }
    getItemsWithCheckBoxes() { return this.getElement().find(`.${this.classes.ITEM_WITH_CHECKBOX_CLASS}`); }
    getSelectAllItem() { return this.getElement().find(`.${this.classes.SELECT_ALL_ITEM_CLASS}`); }
    getSelectedItems() { return this.getElement().find(`.${this.classes.SELECTED_ITEM_CLASS}`); }
    getAllCheckedCheckboxes() { return this.getElement().find(`.${this.classes.CHECK_BOX_CHECKED_CLASS}`); }
    getOpenedContainers() { return this.getElement().find(`.${this.classes.OPENED_NODE_CONTAINER_CLASS}`); }
    isNodeContainerOpened($nodeContainer) { return $nodeContainer.hasClass(OPENED_NODE_CONTAINER_CLASS); }
    getScrollable() { return this.getElement().find(`.${this.classes.SCROLLABLE_CLASS}`); }
    getScrollableContent() { return this.getElement().find(`.${this.classes.SCROLLABLE_CONTENT_CLASS}`); }
    isNodeLeaf($node) { return $node.hasClass(`${this.classes.IS_LEAF}`); }
    hasWithoutCheckBoxClass($node) { return $node.hasClass(ITEM_WITHOUT_CHECKBOX_CLASS); }

    checkArguments(actualArgs, expectedArgs) {
        assert.strictEqual(actualArgs.event, expectedArgs.event, "event");
        assert.deepEqual(actualArgs.itemData, expectedArgs.itemData, "itemData");
        assert.deepEqual(actualArgs.node, expectedArgs.node, "node");
        assert.deepEqual($(actualArgs.itemElement).get(0), expectedArgs.itemElement.get(0), "itemElement");
    }

    checkSelectedNodes(selectedIndexes, items) {
        selectedIndexes.forEach((index) => {
            assert.equal(this.getNodes().eq(index).hasClass(this.classes.SELECTED_ITEM_CLASS), true, `item ${index} has selected class`);
            items && assert.equal(items[index].selected, true, `item ${index} is selected`);
        });

        this.getNodes().each((index) => {
            if(selectedIndexes.indexOf(index) === -1) {
                assert.equal(this.getNodes().eq(index).hasClass(this.classes.SELECTED_ITEM_CLASS), false, `item ${index} has no selected class`);
                items && assert.equal(!!items[index].selected, false, `item ${index} is not selected`);
            }
        });
    }

    checkSelectedItems(selectedIndexes, items) {
        let itemsArray = this.getItemsInOrder(items);

        itemsArray.forEach((_, index) => {
            if(selectedIndexes.indexOf(index) === -1) {
                assert.equal(!!itemsArray[index].selected, false, `item ${index} is not selected`);
            } else {
                assert.equal(itemsArray[index].selected, true, `item ${index} is selected`);
            }
        });
    }

    checkSelected(expectedSelectedIndexes, items) {
        this.checkSelectedItems(expectedSelectedIndexes, items);
        this.checkSelectedNodes(expectedSelectedIndexes);
    }

    getItemsInOrder(items) {
        let itemsArray = [];

        let inOrder = (items) => {
            items.forEach((item) => {
                itemsArray.push(item);
                if(item.items) {
                    inOrder(item.items);
                }
            });
        };

        inOrder(items);

        return itemsArray;
    }

    checkCheckBoxesState(expectedValues) {
        this.getCheckBoxes().each((index) => {
            this.checkCheckBoxState(index, expectedValues[index]);
        });
    }

    checkCheckBoxState(index, expectedValue) {
        assert.equal(this.getCheckBoxes(index).dxCheckBox("instance").option("value"), expectedValue, `CheckBox ${index}`);
    }
}

class TreeViewDataHelper {
    constructor() {
        this.data = this.getData();
        this.data2 = this.getData2();
        this.dataID = this.getDataID();
        this.plainItems = this.getPlainItems();
        this.treeItems = this.getTreeItems();
    }

    getData() {
        return [
            // 0
            [
                { key: 1, text: "Item 1" },
                { key: 2, text: "Item 2" },
                { key: 3, text: "Item 3" }
            ],
            // 1
            [
                {
                    key: 1, text: "Item 1", items: [
                        { key: 12, text: "Nested item 1" },
                        {
                            key: 13, text: "Nested item 2", items: [
                                { key: 131, text: "Last item" }
                            ]
                        }
                    ]
                },
                { key: 2, text: "Item 2" }
            ],
            // 2
            [
                {
                    key: 1, text: "Item 1", items: [
                        { key: 12, text: "Nested item 1" },
                        { key: 13, text: "Nested item 2" }
                    ]
                },
                { key: 2, text: "Item 2" }
            ],
            // 3
            [
                {
                    itemId: 1,
                    itemName: "Item 1",
                    children: [
                        { itemId: 11, itemName: "Nested Item 1" }
                    ]
                },
                { itemId: 2, itemName: "Item 2" }
            ],
            // 4
            [
                { "Id": 1, "ParentId": 0, "Name": "Animals" },
                { "Id": 2, "ParentId": 1, "Name": "Cat" },
                { "Id": 3, "ParentId": 1, "Name": "Dog" },
                { "Id": 5, "ParentId": 2, "Name": "Abyssinian" },
                { "Id": 8, "ParentId": 3, "Name": "Affenpinscher" },
                { "Id": 9, "ParentId": 3, "Name": "Afghan Hound" },
                { "Id": 12, "ParentId": 0, "Name": "Birds" },
                { "Id": 13, "ParentId": 12, "Name": "Akekee" }
            ],
            // 5
            [
                {
                    // id: "!/#$%&'()*+,./:;<=>?@[\]^`{|}~",
                    id: 1,
                    text: "Item 1",
                    items: [
                        { id: 11, text: "Nested Item 1" },
                        {
                            id: 12, text: "Nested Item 2", items: [
                                { id: 121, text: "Third level item 1" },
                                { id: 122, text: "Third level item 2" }
                            ]
                        }
                    ]
                },
                { id: 2, text: "Item 2" }
            ],
            [
                {
                    id: 1,
                    text: "Item 1",
                    items: [
                        {
                            id: 12, text: "Nested Item 2", items: [
                                { id: 121, text: "Third level item 1" },
                                { id: 122, text: "Third level item 2" }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    text: "Item 2",
                    items: [
                        {
                            id: 22, text: "Nested Item 2", items: [
                                { id: 221, text: "Third level item 1" },
                                { id: 222, text: "Third level item 2" }
                            ]
                        }
                    ]
                }
            ]
        ];
    }

    getData2() {
        return [
            { id: 1, parentId: 0, text: "Animals" },
            { id: 2, parentId: 1, text: "Cat" },
            { id: 3, parentId: 1, text: "Dog" },
            { id: 4, parentId: 1, text: "Cow" },
            { id: 5, parentId: 2, text: "Abyssinian" },
            { id: 6, parentId: 2, text: "Aegean cat" },
            { id: 7, parentId: 2, text: "Australian Mist" },
            { id: 8, parentId: 3, text: "Affenpinscher" },
            { id: 9, parentId: 3, text: "Afghan Hound" },
            { id: 10, parentId: 3, text: "Airedale Terrier" },
            { id: 11, parentId: 3, text: "Akita Inu" },
            { id: 12, parentId: 0, text: "Birds" },
            { id: 13, parentId: 12, text: "Akekee" },
            { id: 14, parentId: 12, text: "Arizona Woodpecker" },
            { id: 15, parentId: 12, text: "Black-chinned Sparrow" },
            { id: 16, parentId: 0, text: "Others" }
        ];
    }

    getDataID() {
        return [
            { id: 1, "elternId": 0, text: "Animals" },
            { id: 2, "elternId": 1, text: "Cat" },
            { id: 3, "elternId": 2, text: "Abyssinian" },
            { id: 4, "elternId": 0, text: "Birds" },
            { id: 5, "elternId": 4, text: "Akekee" }
        ];
    }

    getPlainItems() {
        return [
            { id: 1, parentId: 0, text: "Animals" },
            { id: 2, parentId: 1, text: "Cat" },
            { id: 3, parentId: 1, text: "Dog" },
            { id: 4, parentId: 1, text: "Cow" },
            { id: 5, parentId: 2, text: "Abyssinian" },
            { id: 6, parentId: 2, text: "Aegean cat" },
            { id: 7, parentId: 2, text: "Australian Mist" },
            { id: 8, parentId: 3, text: "Affenpinscher" },
            { id: 9, parentId: 3, text: "Afghan Hound" },
            { id: 10, parentId: 3, text: "Airedale Terrier" },
            { id: 11, parentId: 3, text: "Akita Inu" },
            { id: 12, parentId: 0, text: "Birds" },
            { id: 13, parentId: 12, text: "Akekee" },
            { id: 14, parentId: 12, text: "Arizona Woodpecker" },
            { id: 15, parentId: 12, text: "Black-chinned Sparrow" },
            { id: 16, parentId: 0, text: "Others" }
        ];
    }

    getTreeItems() {
        return [
            {
                key: 1, text: "Item 1", items: [
                    { key: 12, text: "Nested item 1" },
                    {
                        key: 13, text: "Nested item 2", items: [
                            { key: 131, text: "Last item" }
                        ]
                    }
                ]
            },
            { key: 2, text: "Item 2" }
        ];
    }
}

export { TreeViewTestWrapper, TreeViewDataHelper };
