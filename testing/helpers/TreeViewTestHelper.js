import $ from "jquery";
import { isDefined } from "core/utils/type";

const CONTAINER_ID = "treeView";
const WIDGET_CLASS = "dx-treeview";

const NODE_CLASS = `${WIDGET_CLASS}-node`;
const ITEM_CLASS = `${WIDGET_CLASS}-item`;

const SELECTED_ITEM_CLASS = "dx-state-selected";
const CHECK_BOX_CLASS = "dx-checkbox";
const CHECK_BOX_CHECKED_CLASS = "dx-checkbox-checked";

const { assert } = QUnit;

class TreeViewTestWrapper {
    constructor(options) {
        this.instance = this.getInstance(options);
    }

    getElement() { return $(`#${CONTAINER_ID}`); }
    getInstance(options) { return this.getElement().dxTreeView(options).dxTreeView("instance"); }
    getNodes() { return this.getElement().find(`.${NODE_CLASS}`); }
    getItems($node) { return isDefined($node) ? $node.find(`.${ITEM_CLASS}`) : this.getElement().find(`.${ITEM_CLASS}`); }
    getSelectedNodes() { return this.getElement().find(`.${NODE_CLASS}.${SELECTED_ITEM_CLASS}`); }
    getCheckBoxes() { return this.getElement().find(`.${CHECK_BOX_CLASS}`); }
    getAllSelectedCheckboxes() { return this.getElement().find(`.${CHECK_BOX_CHECKED_CLASS}`); }

    hasWidgetClass($item) { return $item.hasClass(WIDGET_CLASS); }
    hasItemClass($item) { return $item.hasClass(ITEM_CLASS); }
    hasCheckboxCheckedClass($item) { return $item.hasClass(CHECK_BOX_CHECKED_CLASS); }

    checkSelectedNodes(selectedIndexes) {
        selectedIndexes.forEach((index) => {
            assert.equal(this.getNodes().eq(index).hasClass(SELECTED_ITEM_CLASS), true, `item ${index} has selected class`);
        });

        this.getNodes().each((index) => {
            if(selectedIndexes.indexOf(index) === -1) {
                assert.equal(this.getNodes().eq(index).hasClass(SELECTED_ITEM_CLASS), false, `item ${index} has no selected class`);
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
}

export default TreeViewTestWrapper;
