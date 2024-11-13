import $ from 'jquery';
import TreeView from 'ui/tree_view';
import ariaAccessibilityTestHelper from '../../../helpers/ariaAccessibilityTestHelper.js';
import eventsEngine from 'common/core/events/core/events_engine';

const { module, test } = QUnit;

const CHECK_BOX_CLASS = 'dx-checkbox';

let helper;
[true, false].forEach((searchEnabled) => {
    module(`Aria accessibility, searchEnabled: ${searchEnabled}`, {
        beforeEach: function() {
            this.items = [{ id: 1, text: 'Item_1', expanded: true, items: [{ id: 3, text: 'Item_1_1' }, { id: 4, text: 'Item_1_2' }] }, { id: 2, text: 'Item_2', expanded: false }];
            helper = new ariaAccessibilityTestHelper({
                createWidget: ($element, options) => new TreeView($element,
                    $.extend({
                        focusStateEnabled: true,
                        animationEnabled: false,
                        showCheckBoxesMode: 'normal',
                        searchEnabled: searchEnabled
                    }, options))
            });
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
            helper.$widget.remove();
        }
    }, () => {
        test('Selected: [], selectionMode: "single"', function() {
            helper.createWidget({ items: this.items, selectionMode: 'single' });

            if(searchEnabled) {
                helper.checkAttributes(helper.$itemContainer, { role: 'tree', tabindex: '0' });
                helper.checkAttributes(helper.$widget, { });
            } else {
                helper.checkAttributes(helper.widget._itemContainer(true), { });
                helper.checkAttributes(helper.$widget, { role: 'tree', tabindex: '0' });
            }

            helper.checkItemsAttributes([], { });
        });

        test('Selected: [], change searchEnabled after initialize"', function() {
            helper.createWidget({ items: this.items, selectionMode: 'single' });
            helper.widget.option('searchEnabled', !searchEnabled);

            if(searchEnabled) {
                helper.checkAttributes(helper.widget._itemContainer(true), { });
                helper.checkAttributes(helper.$widget, { role: 'tree', tabindex: '0' });
            } else {
                helper.checkAttributes(helper.widget._itemContainer(true), { role: 'tree', tabindex: '0' });
                helper.checkAttributes(helper.$widget, { });
            }

            helper.checkItemsAttributes([], { });
        });

        test('Selected: ["Item_1"], selectionMode: "single"', function() {
            this.items[0].selected = true;

            helper.createWidget({ items: this.items, selectionMode: 'single' });

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0], { });
        });

        test('Selected: ["Item_2"], selectionMode: "single", disabled: true', function() {
            this.items[1].selected = true;
            this.items[1].disabled = true;

            helper.createWidget({ items: [this.items[1]], selectionMode: 'single' });

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0], { attributes: [ 'aria-disabled' ] });
        });

        test('Selected: ["Item_1_1"], selectionMode: "single", Item_1.expanded: true, collapseItem(["Item_1"]) -> expand(["Item_1"])', function() {
            this.items[0].items[0].selected = true;

            helper.createWidget({ items: this.items, selectionMode: 'single' });
            helper.widget.collapseItem(1);
            this.clock.tick(10);

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1], { });

            helper.widget.expandItem(1);
            this.clock.tick(10);

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1], { });
        });

        test('Selected: ["Item_1"], selectionMode: "single", Item_1.expanded: false, expand(["Item_1"]) -> collapseItem(["Item_1"])', function() {
            this.items[0].selected = true;
            this.items[0].expanded = false;

            helper.createWidget({ items: this.items, selectionMode: 'single' });
            helper.widget.expandItem(1);
            this.clock.tick(10);

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0], { });

            helper.widget.collapseItem(1);
            this.clock.tick(10);

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0], { });
        });

        test('Selected: ["Item_1_1"], selectionMode: "single", collapseItem(["Item_1"]) -> expand(["Item_1"])', function() {
            this.items[0].items[0].selected = true;

            helper.createWidget({ items: this.items, selectionMode: 'single' });
            helper.widget.collapseItem(1);
            this.clock.tick(10);

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1], { });

            helper.widget.expandItem(1);
            this.clock.tick(10);

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1], { });
        });

        test('Selected: [], selectionMode: "single", selectItem(["Item_1"])', function() {
            helper.createWidget({ items: this.items, selectionMode: 'single' });
            helper.widget.selectItem(1);

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0], { });
        });

        test('Selected: [], selectionMode: "single", click checkbox ["Item_1"] -> ["Item_1_1"]', function() {
            helper.createWidget({ items: this.items, selectionMode: 'single' });

            eventsEngine.trigger(helper.getItems().eq(0).find(`.${CHECK_BOX_CLASS}`), 'dxclick');
            eventsEngine.trigger(helper.getItems().eq(0).find(`.${CHECK_BOX_CLASS}`), 'dxpointerdown');
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', 'aria-activedescendant': helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });

            helper.checkItemsAttributes([0], { focusedNodeIndex: 0, });

            eventsEngine.trigger(helper.getItems().eq(1).find(`.${CHECK_BOX_CLASS}`), 'dxclick');
            eventsEngine.trigger(helper.getItems().eq(1).find(`.${CHECK_BOX_CLASS}`), 'dxpointerdown');
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', 'aria-activedescendant': helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1], { focusedNodeIndex: 1, });
        });

        test('Selected: [], selectionMode: "multiple", selectNodesRecursive: true, click checkbox ["Item_1"] -> ["Item_1_1"]', function() {
            helper.createWidget({ items: this.items, selectionMode: 'multiple', selectNodesRecursive: true });

            eventsEngine.trigger(helper.getItems().eq(0).find(`.${CHECK_BOX_CLASS}`), 'dxclick');
            eventsEngine.trigger(helper.getItems().eq(0).find(`.${CHECK_BOX_CLASS}`), 'dxpointerdown');

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', 'aria-activedescendant': helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0, 1, 2], { focusedNodeIndex: 0, });

            eventsEngine.trigger(helper.getItems().eq(1).find(`.${CHECK_BOX_CLASS}`), 'dxclick');
            eventsEngine.trigger(helper.getItems().eq(1).find(`.${CHECK_BOX_CLASS}`), 'dxpointerdown');
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', 'aria-activedescendant': helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([0, 2], { focusedNodeIndex: 1, selectionMode: 'multiple' });
        });

        test('Selected: ["Item_1", "Item_1_1"], selectionMode: "multiple", selectNodesRecursive: false, unselectItem(["Item_1"]) -> selectItem(["Item_1_2"])', function() {
            this.items[0].items[0].selected = true;
            this.items[0].selected = true;

            helper.createWidget({ items: this.items, selectionMode: 'multiple', selectNodesRecursive: false });

            helper.widget.unselectItem(1);
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1], { });

            helper.widget.selectItem(4);
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([1, 2], { selectionMode: 'multiple' });
        });

        test('Selected: [], selectionMode: "single" -> focusin -> focusout', function() {
            helper.createWidget({ items: this.items, selectionMode: 'single' });

            if(searchEnabled) {
                $(helper.widget._itemContainer(true)).focusin();
            } else {
                helper.$widget.focusin();
            }

            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', 'aria-activedescendant': helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([], { focusedNodeIndex: 0, });

            helper.$widget.focusout();
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', 'aria-activedescendant': helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([], { focusedNodeIndex: 0 });
        });

        test('Selected: [], selectionMode: "single" -> set focusedElement -> clean focusedElement', function() {
            helper.createWidget({ items: this.items, selectionMode: 'single' });

            helper.widget.option('focusedElement', helper.getItems().eq(2).closest('.dx-treeview-node'));
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', 'aria-activedescendant': helper.focusedItemId, tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([], { focusedNodeIndex: 2, });

            helper.widget.option('focusedElement', null);
            helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'tree', tabindex: '0' });
            helper.checkAttributes(searchEnabled ? helper.$widget : helper.widget._itemContainer(true), { });
            helper.checkItemsAttributes([], { });
        });
    });
});
