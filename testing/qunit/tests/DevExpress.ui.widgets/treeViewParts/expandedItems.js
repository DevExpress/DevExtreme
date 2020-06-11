/* global DATA, internals, initTree, makeSlowDataSource */

import $ from 'jquery';
import { noop } from 'core/utils/common';
import fx from 'animation/fx';
import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';

const TREEVIEW_NODE_CLASS = 'dx-treeview-node';
const TREEVIEW_NODE_CONTAINER_CLASS = `${TREEVIEW_NODE_CLASS}-container`;
const TREEVIEW_NODE_CONTAINER_OPENED_CLASS = `${TREEVIEW_NODE_CLASS}-container-opened`;

const { module, test } = QUnit;

const checkFunctionArguments = (assert, actualArgs, expectedArgs) => {
    assert.strictEqual(actualArgs.event, expectedArgs.event, 'arg is OK');
    assert.deepEqual(actualArgs.itemData, expectedArgs.itemData, 'arg is OK');
    assert.deepEqual(actualArgs.node, expectedArgs.node, 'arg is OK');
    assert.deepEqual($(actualArgs.itemElement).get(0), expectedArgs.itemElement.get(0), 'arg is OK');
};

const isNodeExpanded = $node => $node.find(`.${TREEVIEW_NODE_CONTAINER_OPENED_CLASS}`).length > 0;

const getNodeItemId = $node => $node.data('itemId');

module('Expanded items', {
    beforeEach() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    test('Some item has\'expanded\' field', function(assert) {
        const data = $.extend(true, [], DATA[5]);
        data[0].items[1].expanded = true;
        const $treeView = initTree({
            items: data
        });

        assert.equal($treeView.find('.' + internals.OPENED_NODE_CONTAINER_CLASS).length, 3);
    });

    test('expansion by itemData', function(assert) {
        const data = [
            { id: 1, text: 'Item 1', expanded: false, items: [{ id: 11, text: 'Item 11' }] }, { id: 12, text: 'Item 12' }
        ];
        const treeView = initTree({ items: data }).dxTreeView('instance');

        const done = assert.async(2);
        treeView.expandItem(data[0]).done(() => { assert.ok('expand success'); done(); });
        assert.ok(data[0].expanded, 'item is expanded');

        treeView.collapseItem(data[0]).done(() => { assert.ok('expand success'); done(); });
        assert.notOk(data[0].expanded, 'item is not expanded');
    });

    test('onItemExpanded callback', function(assert) {
        const data = $.extend(true, [], DATA[5]);
        const itemExpandedHandler = sinon.spy(noop);
        const $treeView = initTree({
            items: data,
            onItemExpanded: itemExpandedHandler
        });
        const treeView = $treeView.dxTreeView('instance');

        const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

        const done = assert.async();
        treeView.expandItem($firstItem.get(0)).done(() => { assert.ok('expand is success'); done(); });

        assert.equal($treeView.find('.' + internals.OPENED_NODE_CONTAINER_CLASS).length, 1);
        assert.ok(itemExpandedHandler.calledOnce);

        const args = itemExpandedHandler.getCall(0).args[0];

        checkFunctionArguments(assert, args, {
            event: undefined,
            itemData: data[0],
            node: treeView.getNodes()[0],
            itemElement: $firstItem
        });
    });

    test('hidden items should be rendered when deferRendering is false', function(assert) {
        const $treeView = initTree({
            items: [{ text: 'Item 1', items: [{ text: 'Item 11', items: [{ text: 'Item 111' }] }] }],
            deferRendering: false
        });

        assert.equal($treeView.find('.dx-treeview-node').length, 3, 'all items have been rendered');
    });

    test('onContentReady rises after first expand', function(assert) {
        const data = $.extend(true, [], DATA[5]);
        const onContentReadyHandler = sinon.spy(noop);
        const $treeView = initTree({
            items: data,
            onContentReady: onContentReadyHandler
        });
        const treeView = $treeView.dxTreeView('instance');

        const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

        const done = assert.async(3);
        treeView.expandItem($firstItem.get(0)).done(() => { assert.ok('expand is success'); done(); });
        assert.equal(onContentReadyHandler.callCount, 2);

        treeView.collapseItem($firstItem.get(0)).done(() => { assert.ok('expand is success'); done(); });
        treeView.expandItem($firstItem.get(0)).done(() => { assert.ok('collapse is success'); done(); });
        assert.equal(onContentReadyHandler.callCount, 2);
    });

    test('onItemExpanded callback after click should have correct arguments', function(assert) {
        assert.expect(4);

        const data = $.extend(true, [], DATA[5]);
        const itemExpandedHandler = sinon.spy(noop);
        const $treeView = initTree({
            items: data,
            onItemExpanded: itemExpandedHandler
        });

        const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
        const event = new $.Event('dxclick');
        $firstItem.parent().find('> .' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger(event);

        const args = itemExpandedHandler.getCall(0).args[0];
        checkFunctionArguments(assert, args, {
            event: event,
            itemData: data[0],
            node: $treeView.dxTreeView('instance').getNodes()[0],
            itemElement: $firstItem
        });
    });

    test('onItemCollapsed callback', function(assert) {
        const data = $.extend(true, [], DATA[5]);
        data[0].expanded = true;
        const itemCollapsedHandler = sinon.spy(noop);
        const $treeView = initTree({
            items: data,
            onItemCollapsed: itemCollapsedHandler
        });
        const treeView = $treeView.dxTreeView('instance');

        const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

        const done = assert.async();
        treeView.collapseItem($firstItem).done(() => { assert.ok('expand is success'); done(); });

        assert.equal($treeView.find('.' + internals.OPENED_NODE_CONTAINER_CLASS).length, 1);
        assert.ok(itemCollapsedHandler.calledOnce);

        const args = itemCollapsedHandler.getCall(0).args[0];
        checkFunctionArguments(assert, args, {
            event: undefined,
            itemData: data[0],
            node: treeView.getNodes()[0],
            itemElement: $firstItem
        });
    });

    test('onItemCollapsed callback after click should have correct arguments', function(assert) {
        assert.expect(4);

        const data = $.extend(true, [], DATA[5]);
        data[0].expanded = true;
        const itemCollapsedHandler = sinon.spy(noop);
        const $treeView = initTree({
            items: data,
            onItemCollapsed: itemCollapsedHandler
        });
        const treeView = $treeView.dxTreeView('instance');

        const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
        const event = new $.Event('dxclick');
        $firstItem.parent().find('> .' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger(event);

        const args = itemCollapsedHandler.getCall(0).args[0];
        checkFunctionArguments(assert, args, {
            event: event,
            itemData: data[0],
            node: treeView.getNodes()[0],
            itemElement: $firstItem
        });
    });

    test('disabled item should not expand on click', function(assert) {
        const data = $.extend(true, [], DATA[5]);
        data[0].disabled = true;
        const $treeView = initTree({
            items: data
        });
        const treeView = $treeView.dxTreeView('instance');
        const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
        const $icon = $firstItem.parent().find('> .' + internals.TOGGLE_ITEM_VISIBILITY_CLASS);

        $icon.trigger('dxclick');

        assert.ok(!treeView.option('items')[0].expanded, 'disabled item was not expanded');
    });

    test('expanded disabled item should not collapse on click', function(assert) {
        const data = $.extend(true, [], DATA[5]);
        data[0].expanded = true;
        data[0].disabled = true;
        const $treeView = initTree({
            items: data
        });
        const treeView = $treeView.dxTreeView('instance');
        const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
        const $icon = $firstItem.parent().find('> .' + internals.TOGGLE_ITEM_VISIBILITY_CLASS);

        $icon.trigger('dxclick');

        assert.ok(treeView.option('items')[0].expanded, 'disabled item was not expanded');
    });

    test('expanded item shouldn\'t collapse after setting .disable for it', function(assert) {
        const data = $.extend(true, [], DATA[5]);
        data[0].expanded = true;

        const $treeView = initTree({
            items: data
        });
        const treeView = $treeView.dxTreeView('instance');
        const items = treeView.option('items');

        items[0].disabled = true;
        treeView.option('items', items);

        assert.ok(treeView.option('items')[0].expanded, 'disabled item was not expanded');
    });

    test('ui expand and collapse work correctly', function(assert) {
        const data = $.extend(true, [], DATA[5]);
        data[0].items[1].expanded = true;
        const $treeView = initTree({
            items: data
        });
        const $toggleExpandIcon = $($treeView.find('.dx-treeview-toggle-item-visibility').eq(0));

        $toggleExpandIcon.trigger('dxclick');
        assert.ok(!$toggleExpandIcon.hasClass('dx-treeview-toggle-item-visibility-opened'));

        $toggleExpandIcon.trigger('dxclick');
        this.clock.tick(100);
        assert.ok($toggleExpandIcon.hasClass('dx-treeview-toggle-item-visibility-opened'));
    });

    test('itemExpanded should be fired when expanding item', function(assert) {
        const data = $.extend(true, [], DATA[5]);

        const $treeView = initTree({
            items: data
        });
        const treeView = $treeView.dxTreeView('instance');
        const $toggleExpandIcon = $($treeView.find('.dx-treeview-toggle-item-visibility').eq(0));

        treeView.on('itemExpanded', () => assert.ok(true, 'itemExpanded was fired'));

        $toggleExpandIcon.trigger('dxclick');
    });

    test('itemCollapsed should be fired when collapsing item by click', function(assert) {
        const data = $.extend(true, [], DATA[5]);
        data[0].items[1].expanded = true;
        const $treeView = initTree({
            items: data,
            expandEvent: 'click'
        });
        const treeView = $treeView.dxTreeView('instance');
        const $item = $treeView.find('.dx-treeview-item').eq(0);

        treeView.on('itemCollapsed', () => assert.ok(true, 'itemCollapsed was fired'));

        $item.trigger('dxclick');
    });

    test('item should expand by click when expansion by click enabled', function(assert) {
        const items = [{ text: 'Item 1', items: [{ text: 'Item 11' }] }];
        const $treeView = initTree({
            items: items,
            expandEvent: 'click'
        });
        const $item = $treeView.find('.dx-treeview-item').eq(0);

        $item.trigger('dxclick');
        assert.ok(items[0].expanded, 'item is expanded');
    });

    test('item should collapse by click when expansion by click enabled', function(assert) {
        const items = [{ text: 'Item 1', items: [{ text: 'Item 11' }] }];
        const $treeView = initTree({
            items: items,
            expandEvent: 'click'
        });
        const $item = $treeView.find('.dx-treeview-item').eq(0);

        $item.trigger('dxclick');
        $item.trigger('dxclick');
        assert.notOk(items[0].expanded, 'item is collapsed');
    });

    test('item should not expand by click when expansion by click disabling', function(assert) {
        const items = [{ text: 'Item 1', items: [{ text: 'Item 11' }] }];
        const $treeView = initTree({
            items: items,
            expandEvent: 'click'
        });
        const instance = $treeView.dxTreeView('instance');
        const $item = $treeView.find('.dx-treeview-item').eq(0);

        instance.option('expandEvent', 'dblclick');

        $item.trigger('dxclick');
        assert.notOk(items[0].expanded, 'item is collapsed');
    });

    test('collapseAll method should collapse all expanded items', function(assert) {
        const items = [{ text: 'Item 1', expanded: true, items: [{ text: 'Item 11' }] }];
        const $treeView = initTree({
            items: items
        });
        const instance = $treeView.dxTreeView('instance');

        instance.collapseAll();

        assert.notOk(items[0].expanded, 'item is collapsed');
    });

    test('onItemExpanded should not fire if item is leaf', function(assert) {
        const items = [{ text: 'Item 1' }];
        let itemExpanded = 0;
        const $treeView = initTree({
            items: items,
            expandByClick: true,
            onItemExpanded: () => itemExpanded++
        });
        const $item = $treeView.find('.dx-treeview-item').eq(0);

        $item.trigger('dxclick');

        assert.equal(itemExpanded, 0, 'event was not fired');
    });

    test('not expand parent items in non-recursive case', function(assert) {
        const items = [{ text: '1', id: 1, items: [{ text: '11', id: 11, items: [{ text: '111', id: 111 }] }] }];
        const $treeView = initTree({
            items: items,
            expandNodesRecursive: false
        });
        const treeView = $treeView.dxTreeView('instance');

        const done = assert.async(2);
        treeView.expandItem(11).done(() => { assert.ok('expand is success'); done(); });

        let $items = $treeView.find('.dx-treeview-node');
        assert.equal($items.length, 1, 'root item was expanded');

        const nodes = treeView.getNodes();
        assert.notOk(nodes[0].expanded, 'root node is collapsed');
        assert.ok(nodes[0].children[0].expanded, 'child node is expanded');

        treeView.expandItem(1).done(() => { assert.ok('expand is success'); done(); });
        $items = $treeView.find('.dx-treeview-node');
        assert.equal($items.length, 3, 'root item was expanded');
    });

    test('expand parent items in recursive case', function(assert) {
        const items = [{ text: '1', id: 1, items: [{ text: '11', id: 11, items: [{ text: '111', id: 111 }] }] }];
        const $treeView = initTree({
            items: items
        });
        const treeView = $treeView.dxTreeView('instance');

        const done = assert.async();
        treeView.expandItem(11).done(() => { assert.ok('expand is success'); done(); });

        const $items = $treeView.find('.dx-treeview-node');
        assert.equal($items.length, 3, 'root item was expanded');

        const nodes = treeView.getNodes();
        assert.ok(nodes[0].expanded, 'root node is expanded');
        assert.ok(nodes[0].children[0].expanded, 'child node is expanded');
    });

    test('Expand parent items in markup after expand of rendered nested child (T671960)', function(assert) {
        const items = [{
            text: '1',
            id: 1,
            items: [{
                text: '11',
                id: 11,
                items: [{
                    text: '111',
                    id: 111
                }]
            }]
        }];
        const $treeView = initTree({
            items: items
        });
        const treeView = $treeView.dxTreeView('instance');

        treeView.expandAll();
        treeView.collapseAll();

        const done = assert.async();
        treeView.expandItem(111).done(() => { assert.ok('expand is success'); done(); });

        const nodeElements = $treeView.find('.' + TREEVIEW_NODE_CONTAINER_CLASS);
        assert.ok(nodeElements.eq(1).hasClass(TREEVIEW_NODE_CONTAINER_OPENED_CLASS), 'item 11');
        assert.ok(nodeElements.eq(2).hasClass(TREEVIEW_NODE_CONTAINER_OPENED_CLASS), 'item 111');
    });

    test('expand childless item in recursive case', function(assert) {
        const items = [{ text: '1', id: 1, items: [{ text: '11', id: 11 }] }];
        const $treeView = initTree({
            items: items
        });
        const treeView = $treeView.dxTreeView('instance');

        const done = assert.async();
        treeView.expandItem(11).done(() => { assert.ok('expand is success'); done(); });

        const $items = $treeView.find('.dx-treeview-node');
        assert.equal($items.length, 2, 'root item was expanded');

        const nodes = treeView.getNodes();
        assert.ok(nodes[0].expanded, 'root node is expanded');
        assert.ok(nodes[0].children[0].expanded, 'child node is expanded');
    });

    test('expandItem(arg for not found node), collapseItem(arg for not found node)', function(assert) {
        const $treeView = initTree({
            items: [{ text: '1', id: 1, items: [{ text: '11', id: 11, items: [{ text: '111', id: 111 }] }] }]
        });

        const treeView = $treeView.dxTreeView('instance');

        const done = assert.async(6);
        treeView.expandItem('key not exist').fail(() => { assert.ok('expand fail, node not found by key'); done(); });
        treeView.expandItem($('<div/>').get(0)).fail(() => { assert.ok('expand fail, node not found by itemElement'); done(); });
        treeView.expandItem({}).fail(() => { assert.ok('expand fail, node not found by itemData'); done(); });

        treeView.collapseItem('key not exist').fail(() => { assert.ok('collapse fail, node not found by key'); done(); });
        treeView.collapseItem($('<div/>').get(0)).fail(() => { assert.ok('collapse fail, node not found by itemElement'); done(); });
        treeView.collapseItem({}).fail(() => { assert.ok('collapse fail, node not found by itemData'); done(); });
    });


    test('Expand all method', function(assert) {
        const items = [{
            text: '1',
            id: 1,
            items: [{
                text: '11',
                id: 11,
                items: [{
                    text: '111',
                    id: 111
                }]
            }]
        }];
        const $treeView = initTree({
            items: items
        });
        const treeView = $treeView.dxTreeView('instance');

        treeView.expandAll();

        const nodes = treeView.getNodes();
        assert.ok(nodes[0].expanded, 'item 1');
        assert.ok(nodes[0].items[0].expanded, 'item 11');
        assert.ok(nodes[0].items[0].items[0].expanded, 'item 111');
    });

    test('Collapse all method', function(assert) {
        const items = [{
            text: '1',
            id: 1,
            items: [{
                text: '11',
                id: 11,
                items: [{
                    text: '111',
                    id: 111
                }]
            }]
        }];
        const $treeView = initTree({
            items: items
        });
        const treeView = $treeView.dxTreeView('instance');

        treeView.expandAll();
        treeView.collapseAll();

        const nodes = treeView.getNodes();
        assert.notOk(nodes[0].expanded, 'item 1');
        assert.notOk(nodes[0].items[0].expanded, 'item 11');
        assert.notOk(nodes[0].items[0].items[0].expanded, 'item 111');
    });

    test('Disabled item doesn\'t expand when using the expandAll method', function(assert) {
        const $treeView = initTree({
            items: [{
                text: '1',
                id: 1,
                items: [{
                    text: '11',
                    id: 11,
                    disabled: true,
                    items: [{
                        text: '111',
                        id: 111
                    }]
                }]
            }]
        });
        const treeView = $treeView.dxTreeView('instance');

        treeView.expandAll();

        const $nodes = $treeView.find(`.${TREEVIEW_NODE_CLASS}`);
        const $node1 = $nodes.eq(0);
        const $node2 = $nodes.eq(1);
        const $node3 = $nodes.eq(2);

        assert.equal($nodes.length, 3, 'nodes count');
        assert.ok(isNodeExpanded($node1), 'first node is expanded');
        assert.equal(getNodeItemId($node1), 1, 'id for first node');

        assert.ok(isNodeExpanded($node2), 'second node is expanded');
        assert.equal(getNodeItemId($node2), 11, 'id for second node');

        assert.notOk(isNodeExpanded($node3), 'third node is expanded');
        assert.equal(getNodeItemId($node3), 111, 'id for third node');
    });

    test('Disabled item doesn\'t expand when using the expandAll method and the expandNodesRecursive is enabled', function(assert) {
        const $treeView = initTree({
            expandNodesRecursive: true,
            items: [{
                text: '1',
                id: 1,
                items: [{
                    text: '11',
                    id: 11,
                    disabled: true,
                    items: [{
                        text: '111',
                        id: 111
                    }]
                }]
            }]
        });
        const treeView = $treeView.dxTreeView('instance');

        treeView.expandAll();

        const $nodes = $treeView.find(`.${TREEVIEW_NODE_CLASS}`);
        const $node1 = $nodes.eq(0);
        const $node2 = $nodes.eq(1);
        const $node3 = $nodes.eq(2);

        assert.equal($nodes.length, 3, 'nodes count');
        assert.ok(isNodeExpanded($node1), 'first node is expanded');
        assert.equal(getNodeItemId($node1), 1, 'id for first node');

        assert.ok(isNodeExpanded($node2), 'second node is expanded');
        assert.equal(getNodeItemId($node2), 11, 'id for second node');

        assert.notOk(isNodeExpanded($node3), 'third node is expanded');
        assert.equal(getNodeItemId($node3), 111, 'id for third node');
    });

    test('Expand all items when the expandNodesRecursive is enabled', function(assert) {
        const $treeView = initTree({
            expandNodesRecursive: true,
            items: [{
                text: '1',
                id: 1,
                items: [{
                    text: '11',
                    id: 11,
                    items: [{
                        text: '111',
                        id: 111
                    }]
                }]
            }]
        });
        const treeView = $treeView.dxTreeView('instance');

        treeView.expandAll();

        const $nodes = $treeView.find(`.${TREEVIEW_NODE_CLASS}`);
        const $node1 = $nodes.eq(0);
        const $node2 = $nodes.eq(1);
        const $node3 = $nodes.eq(2);

        assert.equal($nodes.length, 3, 'nodes count');
        assert.ok(isNodeExpanded($node1), 'first node is expanded');
        assert.equal(getNodeItemId($node1), 1, 'id for first node');

        assert.ok(isNodeExpanded($node2), 'second node is expanded');
        assert.equal(getNodeItemId($node2), 11, 'id for second node');

        assert.notOk(isNodeExpanded($node3), 'third node is expanded');
        assert.equal(getNodeItemId($node3), 111, 'id for third node');
    });

    test('Content ready event is thrown once when the expandAll is called', function(assert) {
        const contentReadyStub = sinon.stub();
        const $treeView = initTree({
            items: [{
                text: '1',
                id: 1,
                items: [{
                    text: '11',
                    id: 11,
                    items: [{
                        text: '111',
                        id: 111
                    }]
                }]
            }],
            onContentReady: contentReadyStub
        });
        const treeView = $treeView.dxTreeView('instance');

        treeView.expandAll();

        assert.equal(contentReadyStub.callCount, 2, 'event is thrown twice');
    });

    test('Content ready event is thrown once when the expandAll is called with the slow data source', function(assert) {
        const contentReadyStub = sinon.stub();
        const $treeView = initTree({
            dataSource: makeSlowDataSource($.extend(true, [],
                [
                    { id: 1, parentId: 0, text: 'Animals' },
                    { id: 2, parentId: 1, text: 'Cat' },
                    { id: 3, parentId: 2, text: 'Dog' },
                    { id: 4, parentId: 3, text: 'Cow' }
                ]
            )),
            dataStructure: 'plain',
            onContentReady: contentReadyStub
        });
        const treeView = $treeView.dxTreeView('instance');

        this.clock.tick(400);

        treeView.expandAll();

        this.clock.tick(400);

        assert.equal(contentReadyStub.callCount, 2, 'event is thrown twice');
    });

    test('Content ready event is thrown once when the expandAll is called with the slow data source and the virtual mode', function(assert) {
        const contentReadyStub = sinon.stub();
        const $treeView = initTree({
            dataSource: makeSlowDataSource($.extend(true, [],
                [
                    { id: 1, parentId: 0, text: 'Animals' },
                    { id: 2, parentId: 1, text: 'Cat' },
                    { id: 3, parentId: 2, text: 'Dog' },
                    { id: 4, parentId: 3, text: 'Cow' }
                ]
            )),
            dataStructure: 'plain',
            virtualModeEnabled: true,
            onContentReady: contentReadyStub
        });
        const treeView = $treeView.dxTreeView('instance');

        this.clock.tick(400);

        treeView.expandAll();

        this.clock.tick(400);

        assert.equal(contentReadyStub.callCount, 2, 'event is thrown once');
    });

    test('Content ready event is thrown once when the expandAll is called with load data on demand', function(assert) {
        const contentReadyStub = sinon.stub();
        const data = [
            { id: 1, parentID: 0, text: 'Animals' },
            { id: 2, parentID: 1, text: 'Cat' },
            { id: 21, parentID: 1, text: 'Pussy Cat', hasItems: false },
            { id: 3, parentID: 2, text: 'Dog' },
            { id: 4, parentID: 3, text: 'Cow', hasItems: false }
        ];
        const $treeView = initTree({
            createChildren: parent => {
                const parentID = parent ? parent.itemData.id : 0;
                return data.filter(item => item.parentID === parentID);
            },
            rootValue: 1,
            dataStructure: 'plain',
            onContentReady: contentReadyStub
        });
        const treeView = $treeView.dxTreeView('instance');

        this.clock.tick(400);

        treeView.expandAll();

        this.clock.tick(400);

        assert.equal(contentReadyStub.callCount, 2, 'event is thrown twice');
    });


    ['items', 'dataSource', 'createChildren'].forEach((dataSourceOption) => {
        [false, true].forEach((virtualModeEnabled) => {
            QUnit.module(`DataSource: ${dataSourceOption}. VirtualModeEnabled: ${virtualModeEnabled} (T832760)`, () => {
                [false, true].forEach((expanded) => {
                    QUnit.test('Initialization', function(assert) {
                        const options = createOptions(
                            { virtualModeEnabled, dataSourceOption },
                            [{ id: 1, text: 'item1', parentId: 2, expanded }, { id: 2, text: 'item1_1', parentId: 1, expanded }]
                        );

                        const wrapper = new TreeViewTestWrapper(options);
                        const $item1 = wrapper.getElement().find('[aria-level="1"]');
                        const $item2 = wrapper.getElement().find('[aria-level="2"]');

                        assert.notEqual(wrapper.instance, undefined);
                        assert.equal($item1.is(':visible'), true);
                        assert.equal($item2.is(':visible'), expanded);
                        wrapper.instance.dispose();
                    });
                });


                function runExpandItemTest(assert, expanded, argumentGetter) {
                    const options = createOptions(
                        { dataSourceOption, virtualModeEnabled },
                        [ { id: 1, text: 'item1', parentId: 2, expanded }, { id: 2, text: 'item1_1', parentId: 1, expanded }]);
                    const wrapper = new TreeViewTestWrapper(options);
                    const $item1 = wrapper.getElement().find('[aria-level="1"]');

                    const done = assert.async();
                    wrapper.instance.expandItem(argumentGetter($item1)).done(() => { assert.ok('expand is success'); done(); });

                    const $item1_1 = wrapper.getElement().find('[aria-level="2"]');
                    assert.equal($item1_1.is(':visible'), true);
                    wrapper.instance.dispose();
                }

                [false, true].forEach((isExpanded) => {
                    QUnit.test('expandItem($node)', function(assert) {
                        runExpandItemTest(assert, isExpanded, $parent => $parent);
                    });
                    QUnit.test('expandItem(DOMElement)', function(assert) {
                        runExpandItemTest(assert, isExpanded, $parent => $parent.get(0));
                    });
                    QUnit.test('expandItem(Key)', function(assert) {
                        runExpandItemTest(assert, isExpanded, _ => 2);
                    });
                });

                QUnit.test('ExpandAll', function(assert) {
                    const options = createOptions({ dataSourceOption, virtualModeEnabled }, [
                        { id: 1, text: 'item1', parentId: 2, expanded: false },
                        { id: 2, text: 'item1_1', parentId: 1, expanded: false }]);
                    const wrapper = new TreeViewTestWrapper(options);

                    wrapper.instance.expandAll();

                    const $item1_1 = wrapper.getElement().find('[aria-level="2"]');
                    assert.equal($item1_1.length, 1);
                    assert.equal($item1_1.is(':visible'), true);
                    wrapper.instance.dispose();
                });

                function runCollapseItemTest(assert, expanded, argumentGetter) {
                    const options = createOptions({ dataSourceOption, virtualModeEnabled }, [
                        { id: 1, text: 'item1', parentId: 2, expanded },
                        { id: 2, text: 'item1_1', parentId: 1, expanded }]);
                    const wrapper = new TreeViewTestWrapper(options);
                    const $item1 = wrapper.getElement().find('[aria-level="1"]');

                    const done = assert.async();
                    wrapper.instance.collapseItem(argumentGetter($item1)).done(() => { assert.ok('collapse is success'); done(); });

                    const $item1_1 = wrapper.getElement().find('[aria-level="2"]');
                    if(expanded) {
                        assert.equal($item1_1.is(':hidden'), true);
                    } else {
                        assert.equal($item1_1.length, 0);
                    }
                    wrapper.instance.dispose();
                }

                [false, true].forEach((expanded) => {
                    QUnit.test('collapseItem($node)', function(assert) {
                        runCollapseItemTest(assert, expanded, $parent => $parent);
                    });
                    QUnit.test('collapseItem(DOMElement)', function(assert) {
                        runCollapseItemTest(assert, expanded, $parent => $parent.get(0));
                    });
                    QUnit.test('collapseItem(Key)', function(assert) {
                        runCollapseItemTest(assert, expanded, _ => 2);
                    });
                });

                QUnit.test('CollapseAll', function(assert) {
                    const options = createOptions({ dataSourceOption, virtualModeEnabled }, [
                        { id: 1, text: 'item1', parentId: 2, expanded: true },
                        { id: 2, text: 'item1_1', parentId: 1, expanded: true }]);
                    const wrapper = new TreeViewTestWrapper(options);

                    wrapper.instance.collapseAll();

                    const $item1_1 = wrapper.getElement().find('[aria-level="2"]');
                    assert.equal($item1_1.length, 1);
                    assert.equal($item1_1.is(':hidden'), true);
                    wrapper.instance.dispose();
                });
            });

            function createOptions(options, items) {
                const result = $.extend({ dataStructure: 'plain', rootValue: 1 }, options);
                if(result.dataSourceOption === 'createChildren') {
                    const createChildFunction = (parent) => {
                        return parent == null
                            ? [ items[1] ]
                            : items.filter(function(item) { return parent.itemData.id === item.parentId; });
                    };
                    result.createChildren = createChildFunction;
                } else {
                    result[options.dataSourceOption] = items;
                }
                return result;
            }
        });
    });
});
