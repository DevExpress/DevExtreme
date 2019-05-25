import $ from "jquery";
import { isDefined } from "core/utils/type";

const CONTAINER_ID = "treeView";
const WIDGET_CLASS = "dx-treeview";

const NODE_CLASS = `${WIDGET_CLASS}-node`;
const NODE_CONTAINER_CLASS = `${NODE_CLASS}-container`;
const OPENED_NODE_CONTAINER_CLASS = `${NODE_CLASS}-container-opened`;
const IS_LEAF = `${NODE_CLASS}-is-leaf`;

const ITEM_CLASS = `${WIDGET_CLASS}-item`;
const ITEM_WITH_CHECKBOX_CLASS = `${ITEM_CLASS}-with-checkbox`;
const ITEM_DATA_KEY = `${ITEM_CLASS}-data`;

const TOGGLE_ITEM_VISIBILITY_CLASS = `${WIDGET_CLASS}-toggle-item-visibility`;
const TOGGLE_ITEM_VISIBILITY_OPENED_CLASS = `${WIDGET_CLASS}-toggle-item-visibility-opened`;
const SELECT_ALL_ITEM_CLASS = `${WIDGET_CLASS}-select-all-item`;

const { assert } = QUnit;

class TreeViewTestWrapper {
    constructor(options) {
        this.classes = {
            WIDGET_CLASS: WIDGET_CLASS,
            NODE_CLASS: NODE_CLASS,
            ITEM_CLASS: ITEM_CLASS,
            SELECTED_ITEM_CLASS: "dx-state-selected",
            CHECK_BOX_CLASS: "dx-checkbox",
            CHECK_BOX_CHECKED_CLASS: "dx-checkbox-checked",
            NODE_CONTAINER_CLASS: NODE_CONTAINER_CLASS,
            OPENED_NODE_CONTAINER_CLASS: OPENED_NODE_CONTAINER_CLASS,
            ITEM_WITH_CHECKBOX_CLASS: ITEM_WITH_CHECKBOX_CLASS,
            ITEM_DATA_KEY: ITEM_DATA_KEY,
            IS_LEAF: IS_LEAF,
            TOGGLE_ITEM_VISIBILITY_CLASS: TOGGLE_ITEM_VISIBILITY_CLASS,
            TOGGLE_ITEM_VISIBILITY_OPENED_CLASS: TOGGLE_ITEM_VISIBILITY_OPENED_CLASS,
            SELECT_ALL_ITEM_CLASS: SELECT_ALL_ITEM_CLASS
        };

        this.instance = this.getInstance(options);
    }
    getElement() { return $(`#${CONTAINER_ID}`); }
    getInstance(options) { return this.getElement().dxTreeView(options).dxTreeView("instance"); }
    getNodes(index) {
        return isDefined(index) ? this.getElement().find(`.${this.classes.NODE_CLASS}`).eq(index) : this.getElement().find(`.${this.classes.NODE_CLASS}`);
    }
    getNodeContainers($node, index) {
        return isDefined(index) ? $node.find(`.${this.classes.NODE_CONTAINER_CLASS}`).eq(index) : $node.find(`.${this.classes.NODE_CONTAINER_CLASS}`);
    }
    getItems(index) {
        return isDefined(index) ? this.getElement().find(`.${this.classes.ITEM_CLASS}`).eq(index) : this.getElement().find(`.${this.classes.ITEM_CLASS}`);
    }
    getSelectedNodes() { return this.getElement().find(`.${this.classes.NODE_CLASS}.${this.classes.SELECTED_ITEM_CLASS}`); }
    getCheckBoxes() { return this.getElement().find(`.${this.classes.CHECK_BOX_CLASS}`); }
    getAllSelectedCheckboxes() { return this.getElement().find(`.${this.classes.CHECK_BOX_CHECKED_CLASS}`); }
    isNodeContainerOpened($nodeContainer) { return $nodeContainer.hasClass(OPENED_NODE_CONTAINER_CLASS); }

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
}

export default TreeViewTestWrapper;
