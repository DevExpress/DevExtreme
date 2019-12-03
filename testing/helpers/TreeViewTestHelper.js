import $ from "jquery";
import { isDefined } from "core/utils/type";

const CONTAINER_ID = "treeView";
const WIDGET_CLASS = "dx-treeview";

const NODE_CLASS = `${WIDGET_CLASS}-node`;
const ITEM_CLASS = `${WIDGET_CLASS}-item`;
const TOGGLE_ITEM_VISIBILITY_CLASS = `${WIDGET_CLASS}-toggle-item-visibility`;
const NODE_LOAD_INDICATOR_CLASS = `${NODE_CLASS}-loadindicator`;

const SELECTED_ITEM_CLASS = "dx-state-selected";
const INVISIBLE_ITEM_CLASS = "dx-state-invisible";

const CHECK_BOX_CLASS = "dx-checkbox";
const CHECK_BOX_CHECKED_CLASS = "dx-checkbox-checked";

const { assert } = QUnit;

class TreeViewTestWrapper {
    constructor(options) {
        this.options = options;
        this.instance = this.getInstance(options);
        this.isCheckBoxMode = this.instance.option("showCheckBoxesMode") === "normal";
    }

    getElement() { return $(`#${CONTAINER_ID}`); }
    getInstance(options) { return this.getElement().dxTreeView(options).dxTreeView("instance"); }
    getNodes() { return this.getElement().find(`.${NODE_CLASS}`); }
    getItems($node) { return isDefined($node) ? $node.find(`.${ITEM_CLASS}`) : this.getElement().find(`.${ITEM_CLASS}`); }
    getSelectedNodes() { return this.getElement().find(`.${NODE_CLASS}.${SELECTED_ITEM_CLASS}`); }
    getCheckBoxes() { return this.getElement().find(`.${CHECK_BOX_CLASS}`); }
    getAllSelectedCheckboxes() { return this.getElement().find(`.${CHECK_BOX_CHECKED_CLASS}`); }
    getToggleItemVisibility($node) { return isDefined($node) ? $node.find(`.${TOGGLE_ITEM_VISIBILITY_CLASS}`) : this.getElement().find(`.${TOGGLE_ITEM_VISIBILITY_CLASS}`); }
    getNodeLoadIndicator($node) { return isDefined($node) ? $node.find(`.${NODE_LOAD_INDICATOR_CLASS}`) : this.getElement().find(`.${NODE_LOAD_INDICATOR_CLASS}`); }

    hasWidgetClass($item) { return $item.hasClass(WIDGET_CLASS); }
    hasItemClass($item) { return $item.hasClass(ITEM_CLASS); }
    hasCheckboxCheckedClass($item) { return $item.hasClass(CHECK_BOX_CHECKED_CLASS); }
    hasSelectedClass($item) { return $item.hasClass(SELECTED_ITEM_CLASS); }
    hasInvisibleClass($item) { return $item.hasClass(INVISIBLE_ITEM_CLASS); }

    checkSelectedNodes(selectedIndexes) {
        let $node = this.getNodes();

        selectedIndexes.forEach((index) => {
            assert.equal(this.hasSelectedClass($node.eq(index)), true, `item ${index} has selected class`);
            if(this.isCheckBoxMode) assert.equal(this.hasCheckboxCheckedClass($node.eq(index).children()), true, `checkbox ${index} has checked class`);
        });

        $node.each((index) => {
            if(selectedIndexes.indexOf(index) === -1) {
                assert.equal(this.hasSelectedClass($node.eq(index)), false, `item ${index} has no selected class`);
                if(this.isCheckBoxMode) assert.equal(!!this.hasCheckboxCheckedClass($node.eq(index).children()), false, `checkbox ${index} has not checked class`);
            }
        });
    }

    checkSelectedItems(selectedIndexes, items) {
        let itemsArray = this.convertTreeToFlatList(items);

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

    checkSelectedKeys(expectedSelectedKeys) {
        const actualSelectedKeys = this.instance._dataAdapter.getSelectedNodesKeys();
        assert.deepEqual(actualSelectedKeys.sort(), expectedSelectedKeys.sort());
    }

    convertTreeToFlatList(items) {
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
}

export default TreeViewTestWrapper;
