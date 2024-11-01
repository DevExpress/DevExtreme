/* global data2, dataID, internals, makeSlowDataSource */

import $ from 'jquery';
import { noop } from 'core/utils/common';
import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';
import { CustomStore } from 'common/data/custom_store';
import dblclickEvent from 'common/core/events/dblclick';
import TreeView from 'ui/tree_view';
import eventsEngine from 'common/core/events/core/events_engine';
import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
import LoadIndicator from 'ui/load_indicator';

const { module, test, assert } = QUnit;
const createInstance = (options) => new TreeViewTestWrapper(options);

import 'generic_light.css!';

const NODE_LOAD_INDICATOR_CLASS = 'dx-treeview-node-loadindicator';
const TREEVIEW_ITEM_CLASS = 'dx-treeview-item';
const TREEVIEW_NODE_CLASS = 'dx-treeview-node';
const TREEVIEW_NODE_IS_LEAF = 'dx-treeview-node-is-leaf';
const TREEVIEW_CUSTOM_COLLAPSE_ICON_CLASS = 'dx-treeview-custom-collapse-icon';

QUnit.module('Virtual mode', {
    beforeEach: function() {
        this.$element = $('#treeView');
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },

    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
});

QUnit.test('All nodes should be rendered by default', function(assert) {
    new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'plain'
    });
    const items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);

    assert.equal(items.length, 3);
});

QUnit.test('Only root nodes should be rendered in virtualMode', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    const items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);

    assert.equal(items.length, 3);
    assert.equal(treeView.option('items').length, 3);
});

QUnit.test('Render expanded node in virtualMode', function(assert) {
    const newData = $.extend(true, [], data2);
    newData[0].expanded = true;

    const treeView = new TreeView(this.$element, {
        dataSource: newData,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    const items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);

    assert.equal(items.length, 6);
    assert.equal(treeView.option('items').length, 6);
});

QUnit.test('Ignore virtual mode if dataStructure is set to \'tree\'', function(assert) {
    new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'tree',
        virtualModeEnabled: true
    });

    const items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);

    assert.equal(items.length, 16);
});

QUnit.test('Root nodes should not have leaf class', function(assert) {
    new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    const $nodes = this.$element.find(`.${TREEVIEW_NODE_CLASS}`);

    $.each($nodes, function(_, node) {
        assert.ok(!$(node).hasClass(TREEVIEW_NODE_IS_LEAF));
    });
});

QUnit.test('Render second level in virtualMode after click on icon', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    const $firstItem = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`).eq(0);
    const $icon = $firstItem.find(`> .${internals.TOGGLE_ITEM_VISIBILITY_CLASS}`);

    $icon.trigger('dxclick');

    const items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);
    assert.equal(items.length, 6);
    assert.equal(treeView.option('items').length, 6);

    // T378648
    const $itemsContainer = $icon.parent().siblings(`.${internals.NODE_CONTAINER_CLASS}`);
    $icon.trigger('dxclick');
    assert.ok(!$itemsContainer.is(':visible'), 'collapsed');

    $icon.trigger('dxclick');
    assert.ok($itemsContainer.is(':visible'), 'expanded again');
});

QUnit.test('Render second level in virtualMode after expand by api', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    treeView.expandItem(1);

    const items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);
    assert.equal(items.length, 6);
    assert.equal(treeView.option('items').length, 6);
});

QUnit.test('Render second level in virtualMode with parentIdExpr', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: $.extend(true, [], dataID),
        parentIdExpr: 'elternId',
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    treeView.expandItem(1);

    const items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);
    assert.equal(items.length, 3);
    assert.equal(treeView.option('items').length, 3);
});

QUnit.test('DataSource should contain root items and second level after expand with custom root value', function(assert) {
    const data = [
        { id: 1, parentId: null, text: 'Animals' },
        { id: 2, parentId: 1, text: 'Cat' },
        { id: 3, parentId: 1, text: 'Dog' },
        { id: 4, parentId: 1, text: 'Cow' },
        { id: 12, parentId: null, text: 'Birds' }
    ];
    const treeView = new TreeView(this.$element, {
        dataSource: data,
        dataStructure: 'plain',
        virtualModeEnabled: true,
        rootValue: null
    });

    treeView.expandItem(1);

    const items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);
    assert.equal(items.length, 5);
    assert.equal(treeView.option('items').length, 5);
});

QUnit.test('Render toggle icon everywhen', function(assert) {
    new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    const $icons = this.$element.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS);

    assert.equal($icons.length, 3);
});

QUnit.test('Remove toggle icon after expand childless item', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    treeView.expandItem(16);

    const $icons = this.$element.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS);
    assert.equal($icons.length, 2);
});

QUnit.test('No custom expander icons should be visible after expand childless item', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'plain',
        expandIcon: 'add',
        collapseIcon: 'minus',
        virtualModeEnabled: true
    });

    treeView.expandItem(16);

    assert.notOk($(`.${TREEVIEW_CUSTOM_COLLAPSE_ICON_CLASS}`).eq(2).is(':visible'));
});

QUnit.test('Remove loadindicator after expand childless item', function(assert) {
    new TreeView(this.$element, {
        dataSource: makeSlowDataSource($.extend(true, [], data2)),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    this.clock.tick(400);

    const $node = this.$element.find(`.${TREEVIEW_NODE_CLASS}`).eq(2);
    $node.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger('dxclick');
    assert.equal($node.find('.dx-treeview-node-loadindicator').length, 1);

    this.clock.tick(400);
    assert.ok($node.find('.dx-treeview-node-loadindicator').is(':hidden'));
});

QUnit.test('Remove loadindicator after expand childless item on dblclick', function(assert) {
    new TreeView(this.$element, {
        dataSource: makeSlowDataSource($.extend(true, [], data2)),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    this.clock.tick(400);

    const $node = this.$element.find(`.${TREEVIEW_NODE_CLASS}`).eq(2);

    $node.find(`.${TREEVIEW_ITEM_CLASS}`).trigger(dblclickEvent.name);
    assert.equal($node.find('.dx-loadindicator').length, 1);

    this.clock.tick(400);
    assert.ok($node.find('.dx-loadindicator').is(':hidden'));
});

QUnit.test('Don\'t create loadindicator on dblclick after expand childless item set via hasItems expression', function(assert) {
    const newData = $.extend(true, [], data2);
    newData[15].hasItems = false;

    new TreeView(this.$element, {
        dataSource: makeSlowDataSource(newData),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    this.clock.tick(400);

    const $node = this.$element.find(`.${TREEVIEW_NODE_CLASS}`).eq(2);

    $node.find(`.${TREEVIEW_ITEM_CLASS}`).trigger(dblclickEvent.name);
    assert.equal($node.find('.dx-loadindicator').length, 0);
});

QUnit.test('Don\'t create loadindicator when disabled item expands', function(assert) {
    const newData = $.extend(true, [], data2);
    newData[15].disabled = true;

    new TreeView(this.$element, {
        dataSource: makeSlowDataSource(newData),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    this.clock.tick(400);

    const $node = this.$element.find(`.${TREEVIEW_NODE_CLASS}`).eq(2);

    $node.find('.dx-treeview-toggle-item-visibility').trigger('dxclick');
    assert.equal($node.find('.dx-loadindicator').length, 0);
});

QUnit.test('Add leaf class after expand childless item', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });
    const $lastNode = this.$element.find(`.${TREEVIEW_NODE_CLASS}`).eq(2);

    treeView.expandItem(16);

    assert.ok($lastNode.hasClass(TREEVIEW_NODE_IS_LEAF));
});

QUnit.test('Don\'t render toggle icon if item.hasItems is false', function(assert) {
    const data = $.extend(true, [], data2);
    data[15].hasItems = false;

    new TreeView(this.$element, {
        dataSource: data,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    const icons = this.$element.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS);
    assert.equal(icons.length, 2);
});

QUnit.test('Don\'t render toggle icon if item.hasChildren is false', function(assert) {
    const data = $.extend(true, [], data2);
    data[15].hasChildren = false;

    new TreeView(this.$element, {
        dataSource: data,
        dataStructure: 'plain',
        virtualModeEnabled: true,
        hasItemsExpr: 'hasChildren'
    });


    const icons = this.$element.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS);
    assert.equal(icons.length, 2);
});

QUnit.test('Render opened icon if item is expanded', function(assert) {
    const data = $.extend(true, [], data2);
    data[0].expanded = true;

    new TreeView(this.$element, {
        dataSource: data,
        dataStructure: 'plain',
        virtualModeEnabled: true,
        hasItemsExpr: 'hasChildren'
    });

    const icons = this.$element.find('.' + internals.TOGGLE_ITEM_VISIBILITY_OPENED_CLASS);
    assert.equal(icons.length, 1);
});

QUnit.test('Add leaf class if item.hasItems is false', function(assert) {
    const data = $.extend(true, [], data2);
    data[15].hasItems = false;

    new TreeView(this.$element, {
        dataSource: data,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    const $lastItem = this.$element.find(`.${TREEVIEW_NODE_CLASS}`).eq(2);
    assert.ok($lastItem.hasClass(TREEVIEW_NODE_IS_LEAF));
});

QUnit.test('Render empty checkboxes on root level', function(assert) {
    const data = $.extend(true, [], data2);
    data[1].selected = true;

    new TreeView(this.$element, {
        dataSource: data,
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal',
        virtualModeEnabled: true
    });


    const $checkboxes = this.$element.find('.dx-checkbox');
    assert.equal($checkboxes.length, 3, 'number of checkboxes is right');

    $.each($checkboxes, function(index, checkbox) {
        assert.equal($(checkbox).dxCheckBox('instance').option('value'), false, index + ' checkbox is not checked');
    });
});

QUnit.test('Render empty checkboxes on nested level', function(assert) {
    const data = $.extend(true, [], data2);

    const treeView = new TreeView(this.$element, {
        dataSource: data,
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal',
        virtualModeEnabled: true
    });

    treeView.expandItem(1);

    const $checkboxes = this.$element.find('.dx-checkbox');

    assert.equal($checkboxes.length, 6, 'number of checkboxes is right');

    $.each($checkboxes, function(index, checkbox) {
        assert.equal($(checkbox).dxCheckBox('instance').option('value'), false, index + ' checkbox is not checked');
    });
});

QUnit.test('Change root checkbox\'s value if new rendered child is selected', function(assert) {
    const data = $.extend(true, [], data2);
    data[1].selected = true;

    const treeView = new TreeView(this.$element, {
        dataSource: data,
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal',
        virtualModeEnabled: true
    });

    treeView.expandItem(1);

    const $checkboxes = this.$element.find('.dx-checkbox');

    assert.strictEqual($checkboxes.eq(0).dxCheckBox('instance').option('value'), undefined, 'root checkbox is undetermined');
});

QUnit.test('Check rendered children items if parent item is checked', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal',
        virtualModeEnabled: true
    });

    treeView.expandItem(1);

    const $checkboxes = this.$element.find('.dx-checkbox');

    $checkboxes.eq(0).trigger('dxclick');

    assert.equal($checkboxes.eq(0).dxCheckBox('instance').option('value'), true);
    assert.equal($checkboxes.eq(1).dxCheckBox('instance').option('value'), true);
    assert.equal($checkboxes.eq(2).dxCheckBox('instance').option('value'), true);
    assert.equal($checkboxes.eq(3).dxCheckBox('instance').option('value'), true);
});

QUnit.test('Render checked children items if parent item is checked', function(assert) {
    const data = $.extend(true, [], data2);
    data[0].selected = true;

    const treeView = new TreeView(this.$element, {
        dataSource: data,
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal',
        virtualModeEnabled: true
    });

    treeView.expandItem(1);

    const $checkboxes = this.$element.find('.dx-checkbox');
    assert.equal($checkboxes.eq(0).dxCheckBox('instance').option('value'), true, 'checked');
    assert.equal($checkboxes.eq(1).dxCheckBox('instance').option('value'), true, 'child checked');
    assert.equal($checkboxes.eq(2).dxCheckBox('instance').option('value'), true, 'child checked');
    assert.equal($checkboxes.eq(3).dxCheckBox('instance').option('value'), true, 'child checked');
});

QUnit.test('Change parent check if child item became unselected', function(assert) {
    const data = $.extend(true, [], data2);
    data[0].selected = true;

    const treeView = new TreeView(this.$element, {
        dataSource: data,
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal',
        virtualModeEnabled: true
    });

    treeView.expandItem(1);

    const $checkboxes = this.$element.find('.dx-checkbox');
    $checkboxes.eq(1).trigger('dxclick');

    assert.strictEqual($checkboxes.eq(0).dxCheckBox('instance').option('value'), undefined);
    assert.strictEqual($checkboxes.eq(1).dxCheckBox('instance').option('value'), false);
});

QUnit.test('Check root level rendering with slow dataSource', function(assert) {
    new TreeView(this.$element, {
        dataSource: makeSlowDataSource($.extend(true, [], data2)),
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal',
        virtualModeEnabled: true
    });

    let items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);

    assert.equal(items.length, 0, 'items was not rendered yet because dataSource is slow');

    this.clock.tick(300);
    items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);

    assert.equal(items.length, 3, 'items was rendered');
});

QUnit.test('Check nested level rendering with slow dataSource', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: makeSlowDataSource($.extend(true, [], data2)),
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal',
        virtualModeEnabled: true
    });

    this.clock.tick(300);
    treeView.expandItem(1);

    let items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);
    assert.equal(items.length, 3, 'nested items was not rendered yet because dataSource is slow');

    this.clock.tick(300);
    items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);
    assert.equal(items.length, 6, 'nested items was rendered');
});

QUnit.test('Change root checkbox\'s value if new rendered child is selected with slow dataSource', function(assert) {
    const data = $.extend(true, [], data2);
    data[1].selected = true;

    const ds = makeSlowDataSource(data);
    const $element = this.$element;
    const getCheckbox = function(index) {
        return $element.find('.dx-checkbox').eq(index).dxCheckBox('instance');
    };

    const treeView = new TreeView(this.$element, {
        dataSource: ds,
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal',
        virtualModeEnabled: true
    });

    this.clock.tick(300);
    assert.strictEqual(getCheckbox(0).option('value'), false, 'root checkbox is not checked yet');

    treeView.expandItem(1);
    this.clock.tick(300);

    assert.strictEqual(getCheckbox(0).option('value'), undefined, 'root checkbox is undetermined');
});

QUnit.test('Create error message if dataSource is unavailable', function(assert) {
    let counter = 0;
    const ds = new DataSource({
        paginate: false,
        store: new CustomStore({
            load: function() {
                const d = $.Deferred();
                setTimeout(function() {
                    d.reject();
                }, 300);

                if(counter >= 1) {
                    throw new Error('Infinite treeview data source loading is detected...');
                }

                counter++;

                return d.promise();
            }
        })
    });

    new TreeView(this.$element, {
        dataSource: ds,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    const $element = this.$element;

    ds.on('loadError', function() {
        const items = $element.find(`.${TREEVIEW_ITEM_CLASS}`);

        assert.equal(items.length, 0, 'no items');
        assert.equal($element.text(), 'No data to display', 'error generated');
    });

    this.clock.tick(300);
});

QUnit.test('\'Expanded aria\' attr should be added when all items were rendered', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: makeSlowDataSource($.extend(true, [], data2)),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    this.clock.tick(300);

    treeView.expandItem(1);

    let $firstNode = this.$element.find('.dx-treeview-node').first();

    assert.strictEqual($firstNode.attr('aria-expanded'), undefined);

    this.clock.tick(300);

    $firstNode = this.$element.find('.dx-treeview-node').first();
    assert.strictEqual($firstNode.attr('aria-expanded'), 'true');
});

QUnit.test('\'Expanded aria\' attr should not be added when item does not contain any children', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: makeSlowDataSource([{ id: 1, parentId: 0, text: 'Cow' }]),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    this.clock.tick(300);
    treeView.expandItem(1);
    this.clock.tick(300);

    const $firstNode = this.$element.find('.dx-treeview-node').first();
    assert.strictEqual($firstNode.attr('aria-expanded'), undefined);
});

QUnit.test('Expanded event should be fired when item contain children', function(assert) {
    let counter = 0;
    const treeView = new TreeView(this.$element, {
        dataSource: makeSlowDataSource([{ id: 1, parentId: 0, text: 'Cow' }, { id: 11, parentId: 1, text: 'Calf' }]),
        dataStructure: 'plain',
        virtualModeEnabled: true,
        onItemExpanded: function(e) {
            counter++;
        }
    });

    this.clock.tick(300);
    treeView.expandItem(1);
    assert.strictEqual(counter, 0, 'event was not fired yet');

    this.clock.tick(300);
    assert.strictEqual(counter, 1, 'event fired once');
});

QUnit.test('Expanded event should not be fired when item does not contain any children', function(assert) {
    let counter = 0;
    const treeView = new TreeView(this.$element, {
        dataSource: makeSlowDataSource([{ id: 1, parentId: 0, text: 'Cow' }]),
        dataStructure: 'plain',
        virtualModeEnabled: true,
        onItemExpanded: function(e) {
            counter++;
        }
    });

    this.clock.tick(300);
    treeView.expandItem(1);
    this.clock.tick(300);

    assert.strictEqual(counter, 0, 'event was not fired');
});

QUnit.test('Item should expand correct at the second time', function(assert) {
    const data = $.extend(true, [], data2);
    const treeView = new TreeView(this.$element, {
        dataSource: data,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });
    const toggleIcon = this.$element.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).first();

    treeView.expandItem(1);
    assert.ok(toggleIcon.hasClass(internals.TOGGLE_ITEM_VISIBILITY_OPENED_CLASS), 'expanded icon is correct');
    assert.ok(data[0].expanded, 'item\'s property is correct');

    treeView.collapseItem(1);
    assert.ok(!toggleIcon.hasClass(internals.TOGGLE_ITEM_VISIBILITY_OPENED_CLASS), 'collapsed icon is correct');
    assert.ok(!data[0].expanded, 'item\'s property is correct');

    treeView.expandItem(1);
    assert.ok(toggleIcon.hasClass(internals.TOGGLE_ITEM_VISIBILITY_OPENED_CLASS), 'expanded icon is correct');
    assert.ok(data[0].expanded, 'item\'s property is correct');
});

QUnit.test('SearchValue in virtualMode', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'plain',
        virtualModeEnabled: true,
        searchValue: 'a'
    });
    let $items = treeView.$element().find('.dx-treeview-item');

    assert.equal($items.length, 1, '1 item was rendered after filtration');

    treeView.expandItem(1);

    $items = treeView.$element().find('.dx-treeview-item');
    assert.equal($items.length, 2, '2 items were rendered after filtration');
});

QUnit.test('Clear searchValue in virtualMode', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'plain',
        virtualModeEnabled: true,
        searchValue: 'a'
    });

    treeView.expandItem(1);
    treeView.option('searchValue', '');

    const items = treeView.option('items');
    assert.equal(items.length, 6, '6 items were rendered after filtration');
});

QUnit.test('SearchValue should work after sublevels were expanded', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: $.extend(true, [], data2),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    treeView.expandItem(1);

    treeView.option('searchValue', 'a');

    const $items = treeView.$element().find('.dx-treeview-item');
    assert.equal($items.length, 2, '2 items were rendered after filtration');
});

QUnit.test('Repaint treeView on every dataSource modified - insert', function(assert) {
    const store = new ArrayStore({
        key: 'id',
        data: [
            { id: 1, text: 'Item 1', parentId: 0 },
            { id: 2, text: 'Item 2', parentId: 0 },
            { id: 4, text: 'Item 2-1', parentId: 1 },
            { id: 5, text: 'Item 2-2', parentId: 2 },
            { id: 3, text: 'Item 1-1', parentId: 1 }
        ]
    });
    const dataSource = new DataSource({
        store: new CustomStore({
            load: function(options) {
                return store.load(options);
            },
            insert: function(values) {
                return store.insert(values);
            }
        })
    });

    const treeView = new TreeView(this.$element, {
        dataSource: dataSource,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });
    let items;

    treeView.expandItem(2);

    dataSource.store().insert({
        id: 7,
        text: 'Item 2-3',
        parentId: 2
    });

    items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);
    assert.equal(items.length, 4);

    dataSource.store().insert({
        id: 6,
        text: 'Item 3',
        parentId: 0
    });

    items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);
    assert.equal(items.length, 5);

    treeView.option('searchValue', 'Item 2');
    items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);
    assert.equal(items.length, 3);

    dataSource.store().insert({
        id: 8,
        text: 'item 4',
        parentId: 0
    });

    items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);
    assert.equal(items.length, 3);
});

QUnit.test('Repaint treeView on every dataSource modified - remove', function(assert) {
    const store = new ArrayStore({
        key: 'id',
        data: [
            { id: 1, text: 'Item 1', parentId: '0' },
            { id: 2, text: 'Item 2', parentId: '0' },
            { id: 3, text: 'Item 1-1', parentId: 1 },
            { id: 4, text: 'Item 2-1', parentId: 1 },
            { id: 5, text: 'Item 2-2', parentId: 2 },
            { id: 6, text: 'Item 1-1-1', parentId: 3 }
        ]
    });
    const dataSource = new DataSource({
        store: new CustomStore({
            load: function(options) {
                return store.load(options);
            },
            remove: function(key) {
                return store.remove(key);
            }
        })
    });

    const treeView = new TreeView(this.$element, {
        rootValue: '0',
        dataSource: dataSource,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    treeView.expandItem(1);
    treeView.expandItem(2);
    treeView.expandItem(3);

    dataSource.store().remove(4);

    let items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);
    assert.equal(items.length, 5);

    dataSource.store().remove(1);

    items = this.$element.find(`.${TREEVIEW_ITEM_CLASS}`);
    assert.equal(items.length, 2);
    assert.equal(treeView.option('items').length, 2);
});

QUnit.test('Virtual mode should work with custom dataSource filter', function(assert) {
    const ds = new DataSource({
        store: [
            { text: 'Item 1', category: 1, parentId: 0, id: 1 },
            { text: 'Item 11', category: 1, parentId: 1, id: 11 },
            { text: 'Item 12', category: 2, parentId: 1, id: 12 },
            { text: 'Item 2', category: 2, parentId: 0, id: 2 },
            { text: 'Item 21', category: 2, parentId: 2, id: 21 }
        ],
        filter: ['category', 1]
    });
    const treeView = new TreeView(this.$element, {
        dataSource: ds,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    assert.equal(this.$element.find('.dx-treeview-item').length, 1, 'root nodes should be filtered');

    treeView.expandItem(1);

    assert.equal(this.$element.find('.dx-treeview-item').length, 2, 'child nodes should be filtered');
});

QUnit.test('Filter in virtual mode should not be lost after repaint', function(assert) {
    const ds = new DataSource({
        store: [
            { text: 'Item 1', category: 1, parentId: 0, id: 1 },
            { text: 'Item 11', category: 1, parentId: 1, id: 11 },
            { text: 'Item 12', category: 2, parentId: 1, id: 12 },
            { text: 'Item 2', category: 2, parentId: 0, id: 2 },
            { text: 'Item 3', category: 2, parentId: 0, id: 3 },
            { text: 'Item 21', category: 2, parentId: 2, id: 21 }
        ],
        filter: ['category', 1]
    });
    const treeView = new TreeView(this.$element, {
        dataSource: ds,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    treeView.repaint();

    assert.equal(this.$element.find('.dx-treeview-item').length, 1, 'root nodes should be filtered');
});

QUnit.test('DataSource change should not influence on items', function(assert) {
    const ds = makeSlowDataSource($.extend(true, [], data2));
    const treeView = new TreeView(this.$element, {
        dataSource: ds,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    this.clock.tick(400);
    assert.equal(treeView._dataSource.items().length, 3);
    assert.equal(treeView.option('items').length, 3);

    const $node = this.$element.find(`.${TREEVIEW_NODE_CLASS}`).eq(0);
    $node.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger('dxclick');
    this.clock.tick(400);
    assert.equal(treeView._dataSource.items().length, 3);
    assert.equal(treeView.option('items').length, 6);

    // newData = treeView.option("dataSource");
    // treeView.option("dataSource", newData);
    // this.clock.tick(400);
    // assert.equal(treeView._dataSource.items().length, 3);
    // assert.equal(treeView.option("items").length, 3); // will be fixed in T384846
});

QUnit.test('Reload dataSource', function(assert) {
    const store1 = [
        { text: 'Item 1-1', parentId: 0, id: 1 },
        { text: 'Item 2-1', parentId: 0, id: 2 }
    ];
    const store2 = [
        { text: 'Item 1-2', parentId: 0, id: 1 },
        { text: 'Item 2-2', parentId: 0, id: 2 }
    ];
    let numb = 1;
    const ds = new DataSource({
        load: function(options) {
            if(numb === 1) {
                return store1;
            } else {
                return store2;
            }
        }
    });
    const treeView = new TreeView(this.$element, {
        dataSource: ds,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    assert.equal(treeView.option('items').length, 2);
    assert.equal(treeView.option('items')[0].text, 'Item 1-1');
    numb = 2;
    ds.reload();
    assert.equal(treeView.option('items').length, 2);
    assert.equal(treeView.option('items')[0].text, 'Item 1-2');
    numb = 1;
    ds.reload();
    assert.equal(treeView.option('items').length, 2);
    assert.equal(treeView.option('items')[0].text, 'Item 1-1');
});

QUnit.test('Internal filter in virtual mode should be correct after datasource reloading', function(assert) {
    const ds = new DataSource({
        store: [
            { text: 'Item 1', category: 1, parentId: 0, id: 1 },
            { text: 'Item 11', category: 1, parentId: 1, id: 11 },
            { text: 'Item 12', category: 2, parentId: 1, id: 12 },
            { text: 'Item 2', category: 2, parentId: 0, id: 2 },
            { text: 'Item 3', category: 2, parentId: 0, id: 3 },
            { text: 'Item 21', category: 2, parentId: 2, id: 21 }
        ]
    });
    const treeView = new TreeView(this.$element, {
        dataSource: ds,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    ds.reload();

    assert.deepEqual(ds.filter(), ['parentId', 0], 'duplicate filters should not be added');
    treeView.expandItem(1);
    assert.deepEqual(ds.filter(), ['parentId', 1], 'duplicate filters should not be added');
});

QUnit.test('Internal simple filter in virtual mode should be merged correctly after datasource reloading', function(assert) {
    const ds = new DataSource({
        store: [
            { text: 'Item 1', category: 1, parentId: 0, id: 1 },
            { text: 'Item 11', category: 1, parentId: 1, id: 11 },
            { text: 'Item 12', category: 2, parentId: 1, id: 12 },
            { text: 'Item 2', category: 2, parentId: 0, id: 2 },
            { text: 'Item 3', category: 2, parentId: 0, id: 3 },
            { text: 'Item 21', category: 2, parentId: 2, id: 21 }
        ],
        filter: ['category', 2]
    });

    new TreeView(this.$element, {
        dataSource: ds,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    ds.reload();

    assert.deepEqual(ds.filter(), [['category', 2], ['parentId', 0]], 'duplicate filters should not be added');
});

QUnit.test('Internal complex filter in virtual mode should be merged correctly after datasource reloading', function(assert) {
    const ds = new DataSource({
        store: [
            { text: 'Item 1', category: 1, parentId: 0, id: 1 },
            { text: 'Item 11', category: 1, parentId: 1, id: 11 },
            { text: 'Item 12', category: 2, parentId: 1, id: 12 },
            { text: 'Item 2', category: 2, parentId: 0, id: 2 },
            { text: 'Item 3', category: 2, parentId: 0, id: 3 },
            { text: 'Item 21', category: 2, parentId: 2, id: 21 }
        ],
        filter: [['category', 2], 'or', ['category', '=', 1]]
    });

    new TreeView(this.$element, {
        dataSource: ds,
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    ds.reload();

    assert.deepEqual(ds.filter(), [[['category', 2], 'or', ['category', '=', 1]], ['parentId', 0]], 'duplicate filters should not be added');
});

QUnit.test('Items should update when dataSource changed', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: new DataSource({
            store: new ArrayStore([
                { parentId: 0, text: 'Item 1' }
            ])
        }),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    assert.equal(treeView.option('items')[0].text, 'Item 1');

    treeView.option('dataSource', new DataSource({
        store: new ArrayStore([
            { parentId: 0, text: 'Item 2' }
        ])
    }));

    assert.equal(treeView.option('items')[0].text, 'Item 2');
});

// T480748
QUnit.test('Datasource filter should not be cleared if virtual mode is disabled', function(assert) {
    const data = $.extend(true, [], data2);
    const ds = new DataSource(makeSlowDataSource(data));

    ds.filter('id', '<=', 14);

    new TreeView(this.$element, {
        dataSource: ds,
        dataStructure: 'plain',
        virtualModeEnabled: false
    });

    this.clock.tick(400);

    assert.deepEqual(ds.filter(), ['id', '<=', 14], 'filter was not cleared');
});

QUnit.test('Load indicator should be shown on first loading with slow dataSource', function(assert) {
    new TreeView(this.$element, {
        dataSource: makeSlowDataSource($.extend(true, [], data2)),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    this.clock.tick(200);
    assert.equal(this.$element.find('.dx-treeview-loadindicator-wrapper').length, 1, 'load indicator wrapper was created');
    assert.equal(this.$element.find('.dx-treeview-loadindicator').length, 1, 'load indicator was created');

    this.clock.tick(100);
    assert.equal(this.$element.find('.dx-treeview-loadindicator-wrapper').length, 0, 'load indicator wrapper was removed');
    assert.equal(this.$element.find('.dx-treeview-loadindicator').length, 0, 'load indicator was removed');
});

QUnit.test('load indicator should be removed after datasource is loaded even if init method is not finished yet', function(assert) {
    assert.expect(1);

    new TreeView(this.$element, {
        dataSource: [
            { id: 1, text: 'Item 1', parentId: 0 },
            { id: 11, text: 'Item 11', parentId: 1 }
        ],
        onContentReady: function(e) {
            const $loadIndicator = $(e.element).find('.dx-treeview-loadindicator');
            assert.equal($loadIndicator.length, 0, 'load indicator should be removed');
        },
        dataStructure: 'plain',
        virtualModeEnabled: true
    });
});

QUnit.test('Expand all method with the virtual mode', function(assert) {
    const treeView = new TreeView(this.$element, {
        dataSource: makeSlowDataSource([
            {
                id: 1,
                parentId: 0,
                text: '1'
            },
            {
                id: 11,
                parentId: 1,
                text: '11'
            },
            {
                id: 111,
                parentId: 11,
                text: '111'
            }
        ]),
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    this.clock.tick(300);
    treeView.expandAll();
    this.clock.tick(300);

    const nodes = treeView.getNodes();
    assert.ok(nodes[0].expanded, 'item 1');
    assert.notOk(nodes[0].items[0].expanded, 'item 11');
    assert.equal(nodes[0].items[0].items.length, 0, 'children count of the item 11');
});

QUnit.test('load indicator should be located inside an item', function(assert) {
    const treeView = new TreeView($('#treeView'), {
        virtualModeEnabled: true,
        items: [
            { id: 1, text: 'Item 1', parentId: 0 },
            { id: 2, text: 'Item 2', parentId: 1 }
        ],
        dataStructure: 'plain'
    });

    let itemRect;
    let loadIndicatorRect;
    const createLoadIndicator = treeView._createLoadIndicator;

    treeView._createLoadIndicator = $node => {
        createLoadIndicator.call(treeView, $node);

        itemRect = $node.find(`.${TREEVIEW_ITEM_CLASS}`)[0].getBoundingClientRect();
        loadIndicatorRect = $node.find(`.${NODE_LOAD_INDICATOR_CLASS}`)[0].getBoundingClientRect();
    };

    treeView.expandItem(1);

    assert.ok(itemRect.left < loadIndicatorRect.left && itemRect.right > loadIndicatorRect.right, 'load indicator is located inside an item');
});

QUnit.module('the \'createChildren\' option');

QUnit.test('the passed function is called on widget initialization', function(assert) {
    const spy = sinon.spy();

    $('#treeView').dxTreeView({
        dataStructure: 'plain',
        createChildren: spy
    });

    assert.ok(spy.calledOnce, 'the callback function is called once after widget initialization');
    assert.equal(spy.args[0][0], null, '\'null\' is passed as argument for the root item loading');
});

QUnit.test('\'createChildren\' callback didn\'t called at dblclick on item without children', function(assert) {
    const $treeView = $('#treeView');
    const spy = sinon.spy();
    const treeView = $treeView.dxTreeView({
        dataStructure: 'plain',
        items: [{ id: 1, text: 'one', hasChildren: false }]
    }).dxTreeView('instance');

    treeView.option('createChildren', spy);
    $treeView.find('.dx-treeview-item').trigger('dxdblclick');

    assert.ok(spy.notCalled, 'the callback didn\'t called');
});

QUnit.test('the passed function is called on node expansion', function(assert) {
    const $treeView = $('#treeView');
    const treeView = $treeView.dxTreeView({
        dataStructure: 'plain',
        items: [{ id: 1, text: 'one' }]
    }).dxTreeView('instance');
    const spy = sinon.spy();

    treeView.option('createChildren', spy);
    treeView.expandItem(1);

    assert.ok(spy.calledOnce, 'the callback was fired only once on item expansion');
    assert.equal(spy.args[0][0].itemData.id, 1, 'the correct parentNode is passed to the callback arguments');
});

QUnit.test('the passed function is not called on the node collapsing', function(assert) {
    const $treeView = $('#treeView');
    const treeView = $treeView.dxTreeView({
        dataStructure: 'plain',
        items: [{ id: 1, text: 'one', expanded: true }, { id: 2, text: 'two', parentId: 1 }]
    }).dxTreeView('instance');
    const spy = sinon.spy();

    treeView.option('createChildren', spy);
    treeView.collapseItem(1);

    assert.equal(spy.callCount, 0, 'the callback was not fired');
});

QUnit.test('the passed function is not called on the second expansion of the node', function(assert) {
    const $treeView = $('#treeView');
    const treeView = $treeView.dxTreeView({
        dataStructure: 'plain',
        items: [{ id: 1, text: 'one', expanded: true }, { id: 2, text: 'two', parentId: 1 }]
    }).dxTreeView('instance');
    const spy = sinon.spy();

    treeView.collapseItem(1);
    treeView.option('createChildren', spy);
    treeView.expandItem(1);

    assert.equal(spy.callCount, 0, 'the callback was not fired');
});

QUnit.test('the nodes returned by the callback function should be added to the widget', function(assert) {
    const item = { id: 1, text: 'One' };
    const treeView = $('#treeView').dxTreeView({
        dataStructure: 'plain',
        createChildren: function() {
            return [item];
        }
    }).dxTreeView('instance');

    assert.deepEqual(treeView.option('items'), [item], 'nodes were added to the widget');
});

QUnit.test('widget should support resolving promise if it is returned from the callback function', function(assert) {
    const item = { id: 1, text: 'One' };
    const deferred = $.Deferred();
    const treeView = $('#treeView').dxTreeView({
        dataStructure: 'plain',
        createChildren: function() {
            return deferred.promise();
        }
    }).dxTreeView('instance');

    assert.deepEqual(treeView.option('items'), [], 'widget got no items before deferred is resolved');

    deferred.resolve([item]);
    assert.deepEqual(treeView.option('items'), [item], 'nodes were added after deferred is resolved');
});

QUnit.test('expandItem promise should be resolved if return value is empty array (T1114997)', function(assert) {
    const done = assert.async();
    assert.expect(1);

    const treeView = $('#treeView').dxTreeView({
        dataStructure: 'plain',
        displayExpr: 'name',
        createChildren: (parent) => {
            if(!parent) {
                return [{ id: 1, name: 'root item', expanded: false }];
            }

            return [];
        }
    }).dxTreeView('instance');

    treeView.expandItem(1).then(() => {
        assert.ok(true, 'promise was resolved');

        done();
    });
});

QUnit.test('load indicator should be rendered on node expansion if the \'createChildren\' callback is specified', function(assert) {
    const $treeView = $('#treeView').dxTreeView({
        dataStructure: 'plain',
        items: [{ id: 1, text: 'One' }]
    });
    const treeView = $treeView.dxTreeView('instance');
    const deferred = $.Deferred();

    treeView.option('createChildren', function() {
        return deferred.promise();
    });

    treeView.expandItem(1);
    assert.equal($treeView.find('.dx-treeview-node-loadindicator').length, 1, 'load indicator is created for the node expanding');

    deferred.resolve([{ id: 2, text: 'Two', parentId: 1 }]);
    assert.ok($treeView.find('.dx-treeview-node-loadindicator').is(':hidden'), 'load indicator is removed after data is fetched');
});

QUnit.test('should not fire any errors after promise was resolved on demand (T1114072)', function(assert) {
    const treeView = $('#treeView').dxTreeView({
        dataStructure: 'plain',
        items: [{ id: 1, text: 'One' }],
        expandNodesRecursive: false,
    }).dxTreeView('instance');

    const deferred = $.Deferred();

    treeView.option('createChildren', function() {
        return deferred.promise();
    });

    treeView.expandItem(1);

    try {
        const stub = sinon.stub(LoadIndicator, 'getInstance').callsFake(() => {
            stub.restore();
            return undefined;
        });
        deferred.resolve([{ id: 2, text: 'Two', parentId: 1 }]);
    } catch(e) {
        assert.notOk(true, `Error has been raised: ${e}`);
    } finally {
        assert.ok(true);
    }
});

QUnit.test('fetched nodes should be rendered after asynchronous load via \'createChildren\' is finished', function(assert) {
    const $treeView = $('#treeView').dxTreeView({
        dataStructure: 'plain',
        items: [{ id: 1, text: 'One' }]
    });
    const treeView = $treeView.dxTreeView('instance');
    const deferred = $.Deferred();
    const item = { id: 2, text: 'Two', parentId: 1 };

    treeView.option('createChildren', function() {
        return deferred.promise();
    });

    treeView.expandItem(1);
    assert.equal($treeView.find('.dx-treeview-node').length, 1, 'only root node is present');

    deferred.resolve([item]);
    assert.equal($treeView.find('.dx-treeview-node').length, 2, 'fetched node is rendered');
});

QUnit.test('load indicator should not be rendered on node expansion if the \'createChildren\' callback is specified and hasItems field is false', function(assert) {
    const $treeView = $('#treeView').dxTreeView({
        dataStructure: 'plain',
        items: [{ id: 1, text: 'One', hasItems: false }]
    });
    const treeView = $treeView.dxTreeView('instance');
    const deferred = $.Deferred();

    treeView.option('createChildren', function() {
        return deferred.promise();
    });

    treeView.expandItem(1);
    assert.equal($treeView.find('.dx-treeview-node-loadindicator').length, 0, 'load indicator is created for the node expanding');
});

QUnit.test('fetched nodes should be rendered after asynchronous load via \'createChildren\' on widget init', function(assert) {
    const deferred = $.Deferred();
    const $treeView = $('#treeView').dxTreeView({
        dataStructure: 'plain',
        createChildren: function() {
            return deferred.promise();
        }
    });

    assert.equal($treeView.find('.dx-treeview-node').length, 0, 'no nodes are rendered');

    deferred.resolve([{ id: 1, text: 'One' }]);
    assert.equal($treeView.find('.dx-treeview-node').length, 1, 'fetched node is rendered');
});

QUnit.test('arrow should be rendered for a node if the \'createChildren\' callback is specified', function(assert) {
    const $treeView = $('#treeView').dxTreeView({
        dataStructure: 'plain',
        items: [{ id: 1, text: 'One' }],
        createChildren: noop
    });

    assert.equal($treeView.find('.dx-treeview-toggle-item-visibility').length, 1, 'arrow is rendered');
});

QUnit.test('widget should not be rerendered after data is loaded with the help of \'createChildren\'', function(assert) {
    assert.expect(0);

    const treeView = $('#treeView').dxTreeView({
        dataStructure: 'plain',
        items: [{ id: 1, text: 'One' }],
        onOptionChanged: function(e) {
            if(e.name === 'items') {
                assert.ok(false, 'the \'items\' option changed should not be fired');
            }
        }
    }).dxTreeView('instance');

    treeView.option('createChildren', function() {
        return [{ id: 2, text: 'Two', parentId: 1 }];
    });
    treeView.expandItem(1);
});

QUnit.test('the createChildren is not called if not plain dataStructure is used', function(assert) {
    const spy = sinon.spy();

    $('#treeView').dxTreeView({
        dataStructure: 'tree',
        createChildren: spy
    });

    assert.equal(spy.callCount, 0, 'the \'createChildren\' callback is not called');
});

QUnit.test('data source is ignored if the \'createChildren\' callback is specified', function(assert) {
    const dataSource = new DataSource({
        store: new CustomStore({
            load: noop,
            byKey: noop
        })
    });
    const spy = sinon.spy(dataSource, 'load');

    $('#treeView').dxTreeView({
        dataStructure: 'plain',
        dataSource: dataSource,
        createChildren: noop
    });

    assert.equal(spy.callCount, 0, 'data source is ignored');
});

QUnit.test('arrow should not be rendered for item which is explicitly has \'hasItems\' property set to false', function(assert) {
    const $treeView = $('#treeView').dxTreeView({
        dataStructure: 'plain',
        createChildren: function() {
            return [{ id: 1, text: 'One', hasItems: false }];
        }
    });

    assert.equal($treeView.find('.dx-treeview-toggle-item-visibility').length, 0, 'arrow is not rendered');
});

QUnit.test('the \'createChildren\' callback should not create duplicate items when search is used', function(assert) {
    const $treeView = $('#treeView').dxTreeView({
        dataStructure: 'plain',
        searchEnabled: true,
        createChildren: function(parent) {
            if(!parent) {
                return [{ id: 1, text: 'Root', hasItems: true, expanded: true }];
            } else {
                return [{ id: 2, text: 'Child', parentId: parent.key, hasItems: false }];
            }
        }
    });
    const treeView = $treeView.dxTreeView('instance');

    treeView.option('searchValue', 'Ro');

    assert.equal($treeView.find('.dx-treeview-item').length, 1, 'only one item is rendered');
    assert.equal($treeView.find('.dx-treeview-toggle-item-visibility').length, 0, 'arrow is not rendered');
});

QUnit.test('the \'createChildren\' callback should support native promises', function(assert) {
    const done = assert.async();
    const promise = new Promise(function(resolve) {
        resolve([{ id: 1, text: 'One' }]);
    });
    const treeView = $('#treeView').dxTreeView({
        dataStructure: 'plain',
        createChildren: function() {
            return promise;
        }
    }).dxTreeView('instance');

    promise.then(function() {
        assert.equal(treeView.option('items').length, 1, 'items are loaded after native Promise resolution');
        done();
    });
});

QUnit.test('expand should work with createChildren', function(assert) {
    const $treeView = $('#treeView').dxTreeView({
        createChildren: function(parent) {
            parent = (parent && parent.key) || 0;

            const id = parent + 1;
            const text = 'Item ' + id;

            return [{ id: id, parentId: parent, text: text }];
        },
        parentIdExpr: 'parentId',
        dataStructure: 'plain'
    });
    const $expander = $treeView.find('.dx-treeview-node:eq(0) .dx-treeview-toggle-item-visibility');
    const instance = $treeView.dxTreeView('instance');

    instance.expandItem(1);
    $expander.trigger('dxclick');

    instance.expandItem(1);
    $expander.trigger('dxclick');

    assert.notOk($expander.hasClass('dx-treeview-toggle-item-visibility-opened'), 'node is collapsed');
});

module('Loadindicator', () => {
    [true, false].forEach(selectNodesRecursive => {
        ['none', 'normal', 'selectAll'].forEach((showCheckBoxesMode) => {
            const config = `virtualModeEnabled: true, selectNodesRecursive: ${selectNodesRecursive}, showCheckBoxesMode: ${showCheckBoxesMode}`;

            const checkAsserts = (treeView, contentReadyHandler, expectedArgs) => {
                const $node = treeView.getNodes().eq(0);
                const { toggleItemVisibilityCount, contentReadyCount } = expectedArgs;

                assert.equal(contentReadyHandler.callCount, contentReadyCount, 'contentReady.callCount');

                const $loadIndicator = treeView.getNodeLoadIndicator($node);
                assert.equal($loadIndicator.length, 1, 'loadIndicator count');
                assert.equal(treeView.hasInvisibleClass($loadIndicator), contentReadyCount ? true : false, 'loadIndicator has invisible class');

                const $toggleItem = treeView.getToggleItemVisibility($node);
                assert.equal($toggleItem.length, toggleItemVisibilityCount, 'toggle item count');
                assert.equal($toggleItem.css('display') === 'none', contentReadyCount ? false : true, 'toggle item is hidden');
            };

            test(`Loadindicator: ${config}`, function() {
                const clock = sinon.useFakeTimers();

                try {
                    const items = $.extend(true, [], data2);
                    const contentReadyHandler = sinon.spy();

                    const treeView = createInstance({
                        dataSource: makeSlowDataSource(items),
                        dataStructure: 'plain',
                        virtualModeEnabled: true,
                        selectNodesRecursive: selectNodesRecursive,
                        showCheckBoxesMode: showCheckBoxesMode,
                        onContentReady: contentReadyHandler
                    });

                    clock.tick(400);

                    const $toggleItem = treeView.getToggleItemVisibility(treeView.getNodes().eq(0));
                    contentReadyHandler.resetHistory();

                    eventsEngine.trigger($toggleItem, 'dxclick');
                    eventsEngine.trigger($toggleItem, 'dxclick');
                    eventsEngine.trigger($toggleItem, 'dxclick');
                    eventsEngine.trigger($toggleItem, 'dxclick');

                    checkAsserts(treeView, contentReadyHandler, { toggleItemVisibilityCount: 1, contentReadyCount: 0 });
                    treeView.checkSelected([], items);

                    clock.tick(400);
                    checkAsserts(treeView, contentReadyHandler, { toggleItemVisibilityCount: 4, contentReadyCount: 1 });
                    treeView.checkSelected([], items);
                } finally {
                    clock.restore();
                }
            });
        });
    });
});
