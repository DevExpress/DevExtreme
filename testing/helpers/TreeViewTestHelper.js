import $ from 'jquery';
import { isDefined } from 'core/utils/type';

const CONTAINER_ID = 'treeView';
const WIDGET_CLASS = 'dx-treeview';

const NODE_CLASS = `${WIDGET_CLASS}-node`;
const ITEM_CLASS = `${WIDGET_CLASS}-item`;
const ITEM_CONTENT_CLASS = `${WIDGET_CLASS}-item-content`;
const TOGGLE_ITEM_VISIBILITY_CLASS = `${WIDGET_CLASS}-toggle-item-visibility`;
const NODE_LOAD_INDICATOR_CLASS = `${NODE_CLASS}-loadindicator`;

const SELECTED_ITEM_CLASS = 'dx-state-selected';
const INVISIBLE_ITEM_CLASS = 'dx-state-invisible';

const CHECK_BOX_CLASS = 'dx-checkbox';
const CHECK_BOX_CHECKED_CLASS = 'dx-checkbox-checked';

const { assert } = QUnit;

class TreeViewTestWrapper {
    constructor(options) {
        if(!options.onItemSelectionChanged) {
            options.onItemSelectionChanged = () => this.eventLog.push('itemSelectionChanged');
        }

        if(!options.onSelectionChanged) {
            options.onSelectionChanged = () => this.eventLog.push('selectionChanged');
        }

        if(!options.onSelectAllValueChanged) {
            options.onSelectAllValueChanged = () => this.eventLog.push('selectAllValueChanged');
        }

        this.eventLog = [];
        this.instance = this.getInstance(options);
        this.isCheckBoxMode = this.instance.option('showCheckBoxesMode') === 'normal';
    }

    getElement() { return $(`#${CONTAINER_ID}`); }
    getInstance(options) { return this.getElement().dxTreeView(options).dxTreeView('instance'); }
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

    checkSelectedNodes(selectedIndexes, additionalErrorMessage) {
        const $node = this.getNodes();

        selectedIndexes.forEach((index) => {
            assert.equal(this.hasSelectedClass($node.eq(index)), true, `item ${index} has selected class`);
            if(this.isCheckBoxMode) assert.equal(this.hasCheckboxCheckedClass($node.eq(index).children()), true, `checkbox ${index} has checked class` + (additionalErrorMessage || ''));
        });

        $node.each((index) => {
            if(selectedIndexes.indexOf(index) === -1) {
                assert.equal(this.hasSelectedClass($node.eq(index)), false, `item ${index} has no selected class`);
                if(this.isCheckBoxMode) assert.equal(!!this.hasCheckboxCheckedClass($node.eq(index).children()), false, `checkbox ${index} has not checked class` + (additionalErrorMessage || ''));
            }
        });
    }

    checkSelectedItemsWithTreeStructure(selectedIndexes, items) {
        const itemsArray = this.convertTreeToFlatList(items);
        this.checkSelectedItemsWithPlainStructure(selectedIndexes, itemsArray);
    }

    checkSelectedItemsWithPlainStructure(selectedIndexes, itemsArray) {
        itemsArray.forEach((_, index) => {
            if(selectedIndexes.indexOf(index) === -1) {
                assert.equal(!!itemsArray[index].selected, false, `item ${index} is not selected`);
            } else {
                assert.equal(itemsArray[index].selected, true, `item ${index} is selected`);
            }
        });
    }

    checkSelection(expectedKeys, expectedNodes, additionalErrorMessage) {
        const items = this.instance._dataAdapter.getData().map(node => node.internalFields.publicNode);
        const keysArray = items.map(item => item.key);
        const selectedIndexes = expectedKeys.map(key => keysArray.indexOf(key));
        this.checkSelectedItemsWithPlainStructure(selectedIndexes, items);

        this.checkSelectedKeys(expectedKeys, additionalErrorMessage);
        this.checkSelectedNodes(expectedNodes, additionalErrorMessage);
    }

    checkSelected(expectedSelectedIndexes, items) {
        this.checkSelectedItemsWithTreeStructure(expectedSelectedIndexes, items);
        this.checkSelectedNodes(expectedSelectedIndexes);
    }

    checkSelectedKeys(expectedSelectedKeys, additionalErrorMessage) {
        const actualKeys = this.instance.getSelectedNodeKeys();
        assert.deepEqual(actualKeys.sort(), expectedSelectedKeys.sort(), 'getSelectedNodeKeys method ' + additionalErrorMessage);

        const keysByAdapter = this.instance._dataAdapter.getSelectedNodesKeys();
        assert.deepEqual(keysByAdapter.sort(), expectedSelectedKeys.sort(), 'selectedKeys from dataAdapter' + additionalErrorMessage);

        const selectedKeysByNodes = this.instance.getSelectedNodes().map(node => { return node.key; });
        assert.deepEqual(selectedKeysByNodes.sort(), expectedSelectedKeys.sort(), 'getSelectedNodes method ' + additionalErrorMessage);
    }

    checkEventLog(expectedEventLog, additionalErrorMessage) {
        assert.deepEqual(this.eventLog, expectedEventLog, 'eventLog ' + additionalErrorMessage);
    }

    checkNodeIsInVisibleArea(itemKey) {
        const $treeView = this.getElement();
        const $item = $treeView.find(`[data-item-id="${itemKey}"] .${ITEM_CLASS}`).eq(0);
        $item.find(`.${ITEM_CONTENT_CLASS}`).wrapInner('<span/>');

        const treeViewRect = $treeView.get(0).getBoundingClientRect();
        const itemTextRect = $item.find('span').get(0).getBoundingClientRect();

        const scrollDirection = this.instance.option('scrollDirection');
        if(scrollDirection === 'vertical' || scrollDirection === 'both') {
            assert.equal(itemTextRect.top >= treeViewRect.top && itemTextRect.top <= treeViewRect.bottom, true, ` item ${itemKey} top location ${itemTextRect.top} must be between ${treeViewRect.top} and ${treeViewRect.bottom}`);
            assert.equal(itemTextRect.bottom >= treeViewRect.top && itemTextRect.bottom <= treeViewRect.bottom, true, ` item ${itemKey} bottom location ${itemTextRect.bottom} must be between ${treeViewRect.top} and ${treeViewRect.bottom}`);
        }

        if(scrollDirection === 'horizontal' || scrollDirection === 'both') {
            assert.equal(itemTextRect.left >= treeViewRect.left && itemTextRect.left <= treeViewRect.right, true, ` horizontal item ${itemKey} left location ${itemTextRect.left} must be between ${treeViewRect.left} and ${treeViewRect.right}`);
            assert.equal(itemTextRect.right >= treeViewRect.left && itemTextRect.right <= treeViewRect.right, true, ` horizontal item ${itemKey} right location ${itemTextRect.right} must be between ${treeViewRect.left} and ${treeViewRect.right}`);
        }
    }

    clearEventLog() {
        this.eventLog = [];
    }

    convertTreeToFlatList(items) {
        const itemsArray = [];
        const inOrder = (items) => {
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
