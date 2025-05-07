/* global DATA, internals, initTree, makeSlowDataSource, stripFunctions */

import $ from 'jquery';
import commonUtils from 'core/utils/common';
import typeUtils from 'core/utils/type';
import holdEvent from 'common/core/events/hold';
import devices from '__internal/core/m_devices';
import fx from 'common/core/animation/fx';
import contextMenuEvent from 'common/core/events/contextmenu';
import dblclickEvent from 'common/core/events/dblclick';
import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';

const createInstance = (options) => new TreeViewTestWrapper(options);

const checkEventArgs = function(assert, e) {
    assert.ok(e.component);
    assert.ok(e.element);
    assert.ok(e.itemData);
    assert.ok(e.itemElement);
    assert.ok(typeUtils.isDefined(e.itemIndex));
    assert.ok(e.event);
    assert.ok(e.node);
};

QUnit.module('Events', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test('onItemSelectionChanged event with unselected item', function(assert) {
    const handler = sinon.spy(function() { return; });
    const data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;

    const $treeView = initTree({
        items: data,
        showCheckBoxesMode: 'normal',
        onItemSelectionChanged: handler
    });

    const checkboxes = $treeView.find('.dx-checkbox');
    $(checkboxes[4]).trigger('dxclick');

    assert.ok(handler.calledOnce);

    const args = stripFunctions(handler.getCall(0).args[0].itemData);

    assert.equal(handler.getCall(0).args[0].node.text, 'Third level item 2');

    assert.deepEqual(args, {
        id: 122,
        text: 'Third level item 2',
        selected: true,
        expanded: true
    });
});

QUnit.test('onItemSelectionChanged event with selected item', function(assert) {
    const data = $.extend(true, [], DATA[5]);
    const handler = sinon.spy(function() { return; });

    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;
    data[0].items[1].items[1].selected = true;

    const $treeView = initTree({
        items: data,
        showCheckBoxesMode: 'normal',
        onItemSelectionChanged: handler
    });

    const checkboxes = $treeView.find('.dx-checkbox');
    $(checkboxes[4]).trigger('dxclick');

    const args = stripFunctions(handler.getCall(0).args[0].itemData);

    assert.ok(handler.calledOnce);
    assert.deepEqual(args, {
        id: 122,
        text: 'Third level item 2',
        selected: false,
        expanded: true
    });
});

QUnit.test('onItemSelectionChanged should use correct set of arguments when item selected via api', function(assert) {
    const handler = sinon.spy();
    const items = [{ text: 'Item 1' }];
    const $treeView = initTree({
        items: items,
        showCheckBoxesMode: 'normal',
        onItemSelectionChanged: handler
    });
    const instance = $treeView.dxTreeView('instance');
    const nodes = instance.getNodes();

    instance.selectItem(1);

    const args = handler.getCall(0).args[0];

    assert.deepEqual(args.itemData, items[0], 'itemData is correct');
    assert.strictEqual(args.component, instance, 'component is correct');
    assert.ok($(args.element).hasClass('dx-treeview'), 'element is correct');
    assert.strictEqual(args.model, undefined, 'model is not defined in jquery approach');
    assert.deepEqual(args.node, nodes[0], 'node is correct');
    assert.strictEqual(args.event, undefined, 'jquery event is not defined when api used');
});

QUnit.test('onItemSelectionChanged should use correct set of arguments without checkboxes', function(assert) {
    const handler = sinon.spy();
    const items = [{ text: 'Item 1' }];
    const $treeView = initTree({
        items: items,
        showCheckBoxesMode: 'none',
        selectByClick: true,
        onItemSelectionChanged: handler
    });
    const instance = $treeView.dxTreeView('instance');
    const nodes = instance.getNodes();
    const $item = $treeView.find('.dx-treeview-item').eq(0);

    $item.trigger('dxclick');

    const args = handler.getCall(0).args[0];

    assert.deepEqual(args.itemData, items[0], 'itemData is correct');
    assert.strictEqual(args.component, instance, 'component is correct');
    assert.ok($(args.element).hasClass('dx-treeview'), 'element is correct');
    assert.strictEqual(args.model, undefined, 'model is not defined in jquery approach');
    assert.deepEqual(args.node, nodes[0], 'node is correct');
    assert.deepEqual(args.event.target, $item.get(0), 'jquery event has correct target');
});

QUnit.test('onSelectAllValueChanged event should be rised after select by the selectAll method', function(assert) {
    const handler = sinon.spy();
    const treeView = initTree({
        items: [{ text: 'item 1' }],
        showCheckBoxesMode: 'selectAll',
        selectionMode: 'multiple',
        onSelectAllValueChanged: handler
    }).dxTreeView('instance');

    treeView.selectAll();

    assert.equal(handler.callCount, 1, 'event has been rised on select');
    assert.equal(handler.getCall(0).args[0].value, true, 'value is correct on select');

    treeView.unselectAll();
    assert.equal(handler.callCount, 2, 'event has been rised on deselect');
    assert.equal(handler.getCall(1).args[0].value, false, 'value is correct on deselect');
});

QUnit.test('onSelectAllValueChanged event should be rised after all item selected', function(assert) {
    const handler = sinon.spy();
    const treeView = initTree({
        items: [{ text: 'item 1' }],
        showCheckBoxesMode: 'selectAll',
        selectionMode: 'multiple',
        onSelectAllValueChanged: handler
    }).dxTreeView('instance');

    treeView.selectItem(1);

    assert.equal(handler.callCount, 1, 'event has been rised on select');
    assert.equal(handler.getCall(0).args[0].value, true, 'value is correct on select');

    treeView.unselectItem(1);
    assert.equal(handler.callCount, 2, 'event has been rised on deselect');
    assert.equal(handler.getCall(1).args[0].value, false, 'value is correct on deselect');
});

QUnit.test('onSelectAllValueChanged event should not be rised after all item selected without selectAll checkbox', function(assert) {
    const handler = sinon.spy();
    const treeView = initTree({
        items: [{ text: 'item 1' }],
        showCheckBoxesMode: 'normal',
        selectionMode: 'multiple',
        onSelectAllValueChanged: handler
    }).dxTreeView('instance');

    treeView.selectAll();
    treeView.unselectAll();
    treeView.selectItem(1);
    treeView.unselectItem(1);

    assert.equal(handler.callCount, 0, 'event has never been rised');
});

QUnit.test('onSelectAllValueChanged event should be rised after selectAll checked', function(assert) {
    const handler = sinon.spy();
    const $treeView = initTree({
        items: [{ text: 'item 1' }],
        showCheckBoxesMode: 'selectAll',
        selectionMode: 'multiple',
        onSelectAllValueChanged: handler
    });
    const $selectAll = $treeView.find('.dx-treeview-select-all-item');

    $selectAll.trigger('dxclick');

    assert.equal(handler.callCount, 1, 'event has been rised on select');
    assert.equal(handler.getCall(0).args[0].value, true, 'value is correct on select');

    $selectAll.trigger('dxclick');
    assert.equal(handler.callCount, 2, 'event has been rised on deselect');
    assert.equal(handler.getCall(1).args[0].value, false, 'value is correct on deselect');
});

QUnit.test('\'onSelectionChanged\' should be fired when item is selected', function(assert) {
    const onSelectionChangedHandler = sinon.spy(function() { return; });
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }],
        showCheckBoxesMode: 'normal',
        onSelectionChanged: onSelectionChangedHandler
    });
    const $item = $treeView.find('.dx-checkbox').eq(0);

    $item.trigger('dxclick');
    const args = onSelectionChangedHandler.getCall(0).args[0];

    assert.ok(onSelectionChangedHandler.calledOnce);

    const nodes = args.component.getNodes();

    assert.ok(nodes[0].selected);
    assert.ok(!nodes[1].selected);
});

QUnit.test('\'onSelectionChanged\' should be fired when item is unselected', function(assert) {
    const onSelectionChangedHandler = sinon.spy(function() { return; });
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', selected: true }, { id: 2, text: 'Item 2' }],
        showCheckBoxesMode: 'normal',
        onSelectionChanged: onSelectionChangedHandler
    });
    const $item = $treeView.find('.dx-checkbox').eq(0);

    $item.trigger('dxclick');
    const args = onSelectionChangedHandler.getCall(0).args[0];

    assert.ok(onSelectionChangedHandler.calledOnce);

    const nodes = args.component.getNodes();

    assert.ok(!nodes[0].selected);
    assert.ok(!nodes[1].selected);
});

QUnit.test('\'onSelectionChanged\' should be fired when item selection is toggled via API', function(assert) {
    let i = 0;
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', selected: true }, { id: 2, text: 'Item 2' }],
        showCheckBoxesMode: 'normal',
        onSelectionChanged: function() { i++; }
    });
    const treeView = $treeView.dxTreeView('instance');
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0).get(0);

    treeView.unselectItem($item);
    assert.equal(i, 1, 'event was fired');

    let nodes = treeView.getNodes();
    assert.ok(!nodes[0].selected);

    treeView.selectItem($item);
    assert.equal(i, 2, 'event was fired');

    nodes = treeView.getNodes();
    assert.ok(nodes[0].selected);
});

QUnit.test('\'onSelectionChanged\' should be fired when \'selectAll\' item is selected', function(assert) {
    const onSelectionChangedHandler = sinon.spy(function() { return; });
    const treeView = initTree({
        items: [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }],
        showCheckBoxesMode: 'selectAll',
        onSelectionChanged: onSelectionChangedHandler
    }).dxTreeView('instance');

    $(treeView._$selectAllItem).trigger('dxclick');
    const args = onSelectionChangedHandler.getCall(0).args[0];

    assert.ok(onSelectionChangedHandler.calledOnce);

    const nodes = args.component.getNodes();

    assert.ok(nodes[0].selected);
    assert.ok(nodes[1].selected);
});

QUnit.test('\'onSelectionChanged\' should be fired when \'selectAll\' item is unselected', function(assert) {
    const onSelectionChangedHandler = sinon.spy(function() { return; });
    const treeView = initTree({
        items: [{ id: 1, text: 'Item 1', selected: true }, { id: 2, text: 'Item 2', selected: true }],
        showCheckBoxesMode: 'selectAll',
        onSelectionChanged: onSelectionChangedHandler
    }).dxTreeView('instance');

    $(treeView._$selectAllItem).trigger('dxclick');
    const args = onSelectionChangedHandler.getCall(0).args[0];

    assert.ok(onSelectionChangedHandler.calledOnce);

    const nodes = args.component.getNodes();

    assert.ok(!nodes[0].selected);
    assert.ok(!nodes[1].selected);
});

QUnit.test('\'onSelectionChanged\' should be fired once for children selection', function(assert) {
    const onSelectionChangedHandler = sinon.spy(function() { return; });
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', expanded: true, items: [{ id: 3, text: 'Nested item' }] }, { id: 2, text: 'Item 2' }],
        showCheckBoxesMode: 'normal',
        onSelectionChanged: onSelectionChangedHandler
    });
    const $item = $treeView.find('.dx-checkbox').eq(0);

    $item.trigger('dxclick');
    const args = onSelectionChangedHandler.getCall(0).args[0];

    assert.ok(onSelectionChangedHandler.calledOnce);

    const nodes = args.component.getNodes();

    assert.ok(nodes[0].selected);
    assert.ok(nodes[0].items[0].selected);
    assert.ok(nodes[0].items[0].parent.selected);
    assert.ok(!nodes[1].selected);
});

QUnit.test('\'onSelectionChanged\' should be fired once for children unselection', function(assert) {
    const onSelectionChangedHandler = sinon.spy(function() { return; });
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', selected: true, expanded: true, items: [{ id: 3, text: 'Nested item', selected: true }] }, { id: 2, text: 'Item 2' }],
        showCheckBoxesMode: 'normal',
        onSelectionChanged: onSelectionChangedHandler
    });
    const $item = $treeView.find('.dx-checkbox').eq(0);

    $item.trigger('dxclick');
    const args = onSelectionChangedHandler.getCall(0).args[0];
    assert.ok(onSelectionChangedHandler.calledOnce);

    const nodes = args.component.getNodes();

    assert.ok(!nodes[0].selected);
    assert.ok(!nodes[0].items[0].selected);
    assert.ok(!nodes[0].items[0].parent.selected);
    assert.ok(!nodes[1].selected);
});

QUnit.test('\'onSelectionChanged\' should have right arguments for nested items (unselect)', function(assert) {
    const items = [{
        'id': 1,
        'text': 'Autos',
        'items': [{
            'id': 12,
            'text': 'Nissan',
            'items': [{
                'id': 121,
                'text': 'Almera',
                'expanded': true,
                'items': [{
                    'id': 1211,
                    'selected': true,
                    'text': 'Welcome'
                }, {
                    'id': 1212,
                    'selected': true,
                    'text': 'Comfort'
                }, {
                    'id': 1213,
                    'selected': true,
                    'text': 'Comfort Plus'
                }
                ]
            },
            {
                'id': 122,
                'text': 'Tiida'
            }
            ]
        }
        ]
    }
    ];
    const onSelectionChangedHandler = sinon.spy(function() { return; });
    const $treeView = initTree({
        items: items,
        showCheckBoxesMode: 'normal',
        onSelectionChanged: onSelectionChangedHandler
    });
    const $item = $treeView.find('.dx-checkbox').eq(2);

    $item.trigger('dxclick');
    const args = onSelectionChangedHandler.getCall(0).args[0];
    assert.ok(onSelectionChangedHandler.calledOnce);

    const nodes = args.component.getNodes();

    assert.ok(!nodes[0].selected);

    assert.ok(!nodes[0].items[0].selected);
    assert.ok(!nodes[0].items[0].parent.selected);

    assert.ok(!nodes[0].items[0].items[0].selected);
    assert.ok(!nodes[0].items[0].items[0].parent.selected);

    assert.ok(!nodes[0].items[0].items[1].selected);
    assert.ok(!nodes[0].items[0].items[1].parent.selected);

    assert.ok(!nodes[0].items[0].items[0].items[0].selected);
    assert.ok(!nodes[0].items[0].items[0].items[0].parent.selected);

    assert.ok(!nodes[0].items[0].items[0].items[1].selected);
    assert.ok(!nodes[0].items[0].items[0].items[1].parent.selected);

    assert.ok(!nodes[0].items[0].items[0].items[2].selected);
    assert.ok(!nodes[0].items[0].items[0].items[2].parent.selected);
});

QUnit.test('\'onSelectionChanged\' should have right arguments for nested items (select)', function(assert) {
    const items = [{
        'id': 1,
        'text': 'Autos',
        'items': [{
            'id': 12,
            'text': 'Nissan',
            'items': [{
                'id': 121,
                'text': 'Almera',
                'expanded': true,
                'items': [{
                    'id': 1211,
                    'text': 'Welcome'
                }, {
                    'id': 1212,
                    'text': 'Comfort'
                }, {
                    'id': 1213,
                    'text': 'Comfort Plus'
                }
                ]
            },
            {
                'id': 122,
                'text': 'Tiida'
            }
            ]
        }
        ]
    }
    ];
    const onSelectionChangedHandler = sinon.spy(function() { return; });
    const $treeView = initTree({
        items: items,
        showCheckBoxesMode: 'normal',
        onSelectionChanged: onSelectionChangedHandler
    });
    const $item = $treeView.find('.dx-checkbox').eq(2);

    $item.trigger('dxclick');
    const args = onSelectionChangedHandler.getCall(0).args[0];
    assert.ok(onSelectionChangedHandler.calledOnce);

    const nodes = args.component.getNodes();

    assert.ok(Object.prototype.hasOwnProperty.call(nodes[0], 'selected'));
    assert.strictEqual(nodes[0].selected, undefined);

    assert.ok(Object.prototype.hasOwnProperty.call(nodes[0].items[0], 'selected'));
    assert.strictEqual(nodes[0].items[0].selected, undefined);
    assert.ok(Object.prototype.hasOwnProperty.call(nodes[0].items[0].parent, 'selected'));
    assert.strictEqual(nodes[0].items[0].parent.selected, undefined);

    assert.ok(nodes[0].items[0].items[0].selected);
    assert.ok(Object.prototype.hasOwnProperty.call(nodes[0].items[0].items[0].parent, 'selected'));

    assert.ok(!nodes[0].items[0].items[1].selected);
    assert.ok(Object.prototype.hasOwnProperty.call(nodes[0].items[0].items[1].parent, 'selected'));

    assert.ok(nodes[0].items[0].items[0].items[0].selected);
    assert.ok(nodes[0].items[0].items[0].items[0].parent.selected);
    assert.ok(nodes[0].items[0].items[0].items[1].selected);
    assert.ok(nodes[0].items[0].items[0].items[1].parent.selected);
    assert.ok(nodes[0].items[0].items[0].items[2].selected);
    assert.ok(nodes[0].items[0].items[0].items[2].parent.selected);
});

QUnit.test('\'onSelectionChanged\' should be fired if selectNodesRecursive = false', function(assert) {
    const handler = sinon.spy(commonUtils.noop);
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }],
        onSelectionChanged: handler,
        selectNodesRecursive: false,
        showCheckBoxesMode: 'normal'
    });
    const $checkBox = $treeView.find('.dx-checkbox').eq(0);

    $checkBox.trigger('dxclick');

    assert.ok(handler.calledOnce);
});

QUnit.test('onItemClick', function(assert) {
    const clickHandler = sinon.spy();
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }],
        showCheckBoxesMode: 'normal',
        onItemClick: clickHandler
    });
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    $item.trigger('dxclick');
    const args = clickHandler.getCall(0).args[0];

    assert.ok(clickHandler.calledOnce);
    assert.equal(args.node.key, 1);
    assert.equal(args.node.text, 'Item 1');
    assert.strictEqual(args.node.parent, null);
});

QUnit.test('onItemClick should not be fired when clicking on expander icon', function(assert) {
    const clickHandler = sinon.spy();
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 11, text: 'Item 11' }] }],
        showCheckBoxesMode: 'normal',
        onItemClick: clickHandler
    });
    const $expander = $treeView.find('.dx-treeview-toggle-item-visibility').eq(0);

    $expander.trigger('dxclick');

    assert.equal(clickHandler.callCount, 0, 'onItemClick was not fired');
});

QUnit.test('onItemClick should work correct with string keys including several underscore symbols', function(assert) {
    const clickHandler = sinon.spy();
    const $treeView = initTree({
        items: [{ id: '1', expanded: true, text: 'Item 1', items: [{ id: '1_1_1_2', text: 'Item 11' }] }],
        onItemClick: clickHandler
    });
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(1);

    $item.trigger('dxclick');

    assert.equal(clickHandler.callCount, 1, 'onItemClick was fired once');
});

QUnit.test('onItemClick should not be fired when clicking on the checkbox', function(assert) {
    const clickHandler = sinon.spy(commonUtils.noop);
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 11, text: 'Item 11' }] }],
        showCheckBoxesMode: 'normal',
        onItemClick: clickHandler
    });
    const $checkBox = $treeView.find('.dx-checkbox').eq(0);

    $checkBox.trigger('dxclick');

    assert.equal(clickHandler.callCount, 0, 'onItemClick was not fired');
});

QUnit.test('onItemClick should not be fired when clicking on the checkbox icon', function(assert) {
    const clickHandler = sinon.spy(commonUtils.noop);
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 11, text: 'Item 11' }] }],
        showCheckBoxesMode: 'normal',
        onItemClick: clickHandler
    });
    const $checkBox = $treeView.find('.dx-checkbox-icon').eq(0);

    $checkBox.trigger('dxclick');

    assert.equal(clickHandler.callCount, 0, 'onItemClick was not fired');
});

QUnit.test('T177595', function(assert) {
    const handle = sinon.spy(commonUtils.noop);
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }],
        showCheckBoxesMode: 'normal',
        selectNodesRecursive: false,
        onItemSelectionChanged: handle
    });

    $treeView.find('.dx-checkbox').eq(0).trigger('dxclick');

    const args = handle.getCall(0).args[0];

    assert.ok(args.itemData.selected);
    assert.ok(args.node.selected);
});

QUnit.test('T184799: expand item', function(assert) {
    const currentDevice = devices.current();
    if(currentDevice.phone || currentDevice.tablet) {
        assert.ok(true);
    } else {
        const handler = sinon.spy(commonUtils.noop);
        const treeView = initTree({
            items: [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Nested items' }] }, { id: 2, text: 'Item 2' }],
            onItemExpanded: handler
        }).dxTreeView('instance');

        const $rootItem = $(treeView.$element()).find('.' + internals.ITEM_CLASS).eq(0);

        $rootItem.trigger(dblclickEvent.name);
        this.clock.tick(0);

        const args = handler.getCall(0).args[0];

        assert.ok(treeView.option('items')[0].expanded);
        assert.ok(treeView.getNodes()[0].expanded);
        assert.ok($rootItem.parent().find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).hasClass(internals.TOGGLE_ITEM_VISIBILITY_OPENED_CLASS));
        assert.ok(handler.calledOnce);
        assert.ok(args.itemData.expanded);
        assert.ok(args.node.expanded);
        assert.equal(args.itemData.text, 'Item 1');
        assert.equal(args.node.text, 'Item 1');
        assert.equal(treeView.$element().find('.' + internals.ITEM_CLASS).length, 3);
    }
});

QUnit.test('double click should be detached if expand by click is enabled', function(assert) {
    const items = [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Nested items' }] }, { id: 2, text: 'Item 2' }];
    const $treeView = initTree({
        items: items,
        expandEvent: 'click'
    });
    const $rootItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    $rootItem.trigger(dblclickEvent.name);

    assert.notOk(items[0].expanded, 'item is still collapsed');
});

QUnit.test('double click should be attached again if expand by click is disabled', function(assert) {
    const items = [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Nested items' }] }, { id: 2, text: 'Item 2' }];
    const $treeView = initTree({
        items: items,
        expandEvent: 'click'
    });
    const instance = $treeView.dxTreeView('instance');
    const $rootItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    instance.option('expandEvent', 'dblclick');

    $rootItem.trigger(dblclickEvent.name);

    assert.ok(items[0].expanded, 'item is expanded');
});

QUnit.test('double click should be detached if expand by click is enabling dynamically', function(assert) {
    const items = [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Nested items' }] }, { id: 2, text: 'Item 2' }];
    const $treeView = initTree({
        items: items,
        expandEvent: 'dblclick'
    });
    const instance = $treeView.dxTreeView('instance');
    const $rootItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    instance.option('expandEvent', 'click');

    $rootItem.trigger(dblclickEvent.name);

    assert.notOk(items[0].expanded, 'item is collapsed');
});

QUnit.test('dblclick should be used as expand event if unclear value is specified', function(assert) {
    const items = [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Nested items' }] }, { id: 2, text: 'Item 2' }];
    const $treeView = initTree({
        items: items,
        expandEvent: 'dblclick'
    });
    const instance = $treeView.dxTreeView('instance');
    const $rootItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    instance.option('expandEvent', 'undefinedEvent');

    $rootItem.trigger(dblclickEvent.name);

    assert.ok(items[0].expanded, 'item is expanded');
});

QUnit.test('double click should expand an item after widget repainted', function(assert) {
    const items = [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Nested items' }] }];
    const $treeView = initTree({
        items: items,
        expandEvent: 'dblclick'
    });
    const instance = $treeView.dxTreeView('instance');

    instance.repaint();

    const $rootItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
    $rootItem.trigger(dblclickEvent.name);

    assert.ok(items[0].expanded, 'item is expanded');
});

QUnit.test('T184799: collapse item', function(assert) {
    const currentDevice = devices.current();
    if(currentDevice.phone || currentDevice.tablet) {
        assert.ok(true);
    } else {
        const handler = sinon.spy(commonUtils.noop);
        const treeView = initTree({
            items: [{ id: 1, text: 'Item 1', expanded: true, items: [{ id: 3, text: 'Nested items' }] }, { id: 2, text: 'Item 2' }],
            onItemCollapsed: handler
        }).dxTreeView('instance');

        const $rootItem = $(treeView.$element()).find('.' + internals.ITEM_CLASS).eq(0);

        $rootItem.trigger(dblclickEvent.name);

        const args = handler.getCall(0).args[0];

        assert.ok(!treeView.option('items')[0].expanded);
        assert.ok(!treeView.getNodes()[0].expanded);
        assert.ok(!$rootItem.parent().find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).hasClass(internals.TOGGLE_ITEM_VISIBILITY_OPENED_CLASS));
        assert.ok(handler.calledOnce);
        assert.ok(!args.itemData.expanded);
        assert.ok(!args.node.expanded);
        assert.equal(args.itemData.text, 'Item 1');
        assert.equal(args.node.text, 'Item 1');
        assert.equal(treeView.$element().find('.' + internals.ITEM_CLASS).length, 3);
    }
});

QUnit.test('Select event handler has correct arguments', function(assert) {
    const treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 2, text: 'Nested items' }] }],
        showCheckBoxesMode: 'normal',
        onItemSelectionChanged: function(e) {
            checkEventArgs(assert, e);
        }
    });
    const $item = treeView.find('.dx-checkbox').eq(0);

    assert.ok(treeView);
    $item.trigger('dxclick');
});

QUnit.test('Click event handler has correct arguments', function(assert) {
    const treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 2, text: 'Nested items' }] }],
        onItemClick: function(e) {
            checkEventArgs(assert, e);
        }
    });
    const $item = treeView.find('.' + internals.ITEM_CLASS).eq(0);

    assert.ok(treeView);
    $item.trigger('dxclick');
});

QUnit.test('Collapse event handler has correct arguments', function(assert) {
    const treeView = initTree({
        items: [{ id: 1, text: 'Item 1', expanded: true, items: [{ id: 2, text: 'Nested items' }] }],
        onItemCollapsed: function(e) {
            checkEventArgs(assert, e);
        }
    });
    const $icon = treeView.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(0);

    assert.ok(treeView);
    $icon.trigger('dxclick');
});

QUnit.test('onItemExpanded should be called after animation completed', function(assert) {
    try {
        fx.off = false;
        const onItemExpanded = sinon.stub();
        const treeView = initTree({
            items: [{ id: 1, text: 'Item 1', items: [{ id: 2, text: 'Nested items' }] }],
            onItemExpanded: onItemExpanded
        }).dxTreeView('instance');

        treeView.expandItem(1);
        this.clock.tick(50);
        assert.equal(onItemExpanded.callCount, 0, 'handler was not called yet');

        this.clock.tick(450);
        assert.equal(onItemExpanded.callCount, 1, 'handler was called after animation completed');
    } finally {
        fx.off = true;
    }
});

QUnit.test('onItemExpanded event should not be called when the expandAll is called', function(assert) {
    const itemExpandedHandler = sinon.stub();
    const treeView = initTree({
        items: [{
            id: 1,
            text: 'Item 1',
            items: [{
                id: 2,
                text: 'Nested items'
            }]
        }],
        onItemExpanded: itemExpandedHandler
    }).dxTreeView('instance');

    treeView.expandAll();

    assert.equal(itemExpandedHandler.callCount, 0, 'the expandItem event never called');
});

QUnit.test('Expand event handler has correct arguments', function(assert) {
    const treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 2, text: 'Nested items' }] }],
        onItemExpanded: function(e) {
            checkEventArgs(assert, e);
        }
    });
    const $icon = treeView.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(0);

    assert.ok(treeView);
    $icon.trigger('dxclick');
});

QUnit.test('ContextMenu event handler has correct arguments', function(assert) {
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 2, text: 'Nested items' }] }],
        onItemContextMenu: function(e) {
            checkEventArgs(assert, e);
        }
    });
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    assert.ok($treeView);
    $item.trigger(contextMenuEvent.name);
});

QUnit.test('itemContextMenu should be fired when showing contextMenu', function(assert) {
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 2, text: 'Nested items' }] }]
    });
    const treeView = $treeView.dxTreeView('instance');
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    treeView.on('itemContextMenu', function() {
        assert.ok(true, 'onItemContextMenu was fired');
    });

    $item.trigger(contextMenuEvent.name);
});

QUnit.test('Hold event handler has correct arguments', function(assert) {
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 2, text: 'Nested items' }] }],
        onItemHold: function(e) {
            checkEventArgs(assert, e);
        }
    });
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    assert.ok($treeView);
    $item.trigger(holdEvent.name);
});

QUnit.test('itemHold should be fired when holding item', function(assert) {
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 2, text: 'Nested items' }] }]
    });
    const treeView = $treeView.dxTreeView('instance');
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    treeView.on('itemHold', function() {
        assert.ok(true, 'onItemHold was fired');
    });

    $item.trigger(holdEvent.name);
});

QUnit.test('Rendered event handler has correct arguments', function(assert) {
    const treeView = initTree({
        items: [{ id: 1, text: 'Item 1', expanded: true, items: [{ id: 3, text: 'Nested item' }] }, { id: 2, text: 'Item 2' }],
        onItemRendered: function(e) {
            assert.ok(e.component);
            assert.ok(e.element);
            assert.ok(e.itemData);
            assert.ok(e.itemElement);
            assert.ok(typeUtils.isDefined(e.itemIndex));
            assert.ok(e.node);
        }
    });

    assert.ok(treeView);
});

QUnit.test('onItemRendered event arguments', function(assert) {
    const checkOnItemRenderedEventArgs = (assert, eventArgs, expectedArgs) => {
        const { component, element, itemData, itemElement, itemIndex, node } = expectedArgs;

        assert.deepEqual(eventArgs.component, component, 'component');
        assert.ok(element.is(eventArgs.element), 'element');
        assert.deepEqual(eventArgs.itemData, itemData, 'itemData');
        assert.ok(itemElement.is(eventArgs.itemElement), 'itemElement');
        assert.strictEqual(eventArgs.itemIndex, itemIndex, 'itemIndex');
        assert.deepEqual(eventArgs.node, node, 'node');

        // node arguments
        assert.deepEqual(eventArgs.node.children, node.children, 'children');
        assert.strictEqual(eventArgs.node.disabled, node.disabled, 'disabled');
        assert.strictEqual(eventArgs.node.expanded, node.expanded, 'expanded');
        assert.strictEqual(eventArgs.node.itemData, node.itemData, 'itemData');
        assert.strictEqual(eventArgs.node.key, node.key, 'key');
        assert.deepEqual(eventArgs.node.parent, node.parent, 'parent');
        assert.strictEqual(eventArgs.node.selected, node.selected, 'selected');
        assert.strictEqual(eventArgs.node.text, node.text, 'text');
    };

    const onItemRenderedHandler = sinon.spy();
    const items = [
        {
            key: '1', text: 'Item 1', items: [
                { key: '1_1', text: 'Nested item 1' },
                { key: '1_2', text: 'Nested item 2' }
            ]
        },
        { key: '2', text: 'Item 2' }
    ];
    const treeView = createInstance({
        items: items,
        keyExpr: 'key',
        showCheckBoxesMode: 'none',
        selectByClick: true,
        onItemRendered: onItemRenderedHandler
    });

    assert.strictEqual(onItemRenderedHandler.callCount, 2);
    checkOnItemRenderedEventArgs(assert, onItemRenderedHandler.getCall(0).args[0], {
        component: treeView.instance,
        element: treeView.instance.$element(),
        itemData: items[1],
        itemElement: treeView.getItems().eq(1),
        itemIndex: 1,
        node: treeView.instance.getNodes()[1]
    });

    checkOnItemRenderedEventArgs(assert, onItemRenderedHandler.getCall(1).args[0], {
        component: treeView.instance,
        element: treeView.instance.$element(),
        itemData: items[0],
        itemElement: treeView.getItems().eq(0),
        itemIndex: 0,
        node: treeView.instance.getNodes()[0]
    });

    onItemRenderedHandler.resetHistory();
    treeView.instance.expandItem('1');

    assert.strictEqual(onItemRenderedHandler.callCount, 2);

    checkOnItemRenderedEventArgs(assert, onItemRenderedHandler.getCall(0).args[0], {
        component: treeView.instance,
        element: treeView.instance.$element(),
        itemData: items[0].items[1],
        itemElement: treeView.getItems().eq(2),
        itemIndex: 3,
        node: treeView.instance.getNodes()[0].children[1]
    });

    checkOnItemRenderedEventArgs(assert, onItemRenderedHandler.getCall(1).args[0], {
        component: treeView.instance,
        element: treeView.instance.$element(),
        itemData: items[0].items[0],
        itemElement: treeView.getItems().eq(1),
        itemIndex: 2,
        node: treeView.instance.getNodes()[0].children[0]
    });
});

QUnit.test('Fire contentReady event if new dataSource is empty', function(assert) {
    const contentReadyHandler = sinon.stub();

    initTree({
        dataSource: [],
        onContentReady: contentReadyHandler
    }).dxTreeView('instance');

    assert.ok(contentReadyHandler.calledOnce);
});

QUnit.test('Fire contentReady event when search', function(assert) {
    const contentReadyHandler = sinon.spy();
    const instance = initTree({
        items: $.extend(true, [], DATA[0]),
        onContentReady: contentReadyHandler
    }).dxTreeView('instance');

    assert.strictEqual(contentReadyHandler.callCount, 1, 'onContentReady was first time');

    instance.option('searchValue', '2');

    assert.strictEqual(contentReadyHandler.callCount, 2, 'onContentReady was second time');
});

QUnit.test('ContentReady event rise once when the data source is remote by first rendering', function(assert) {
    const contentReadyHandler = sinon.spy();

    initTree({
        dataSource: makeSlowDataSource([{
            id: 1,
            text: 'Item 1',
            parentId: 0
        }]),
        onContentReady: contentReadyHandler
    }).dxTreeView('instance');

    this.clock.tick(300);

    assert.strictEqual(contentReadyHandler.callCount, 1, 'onContentReady was first time');
});

QUnit.test('Should not throw error if event does not have the \'originalEvent\' property', function(assert) {
    // NOTE: skip test execution in the `noquery` mode
    // this is specific only of the `mouseenter` event triggering
    // the cause of the problem is the `_cursorEnterHandler` method: .\js\ui\scroll_view\ui.scrollable.simulated.js
    // Check it to fix the initial issue
    if(QUnit.urlParams['nojquery']) {
        assert.ok(true);
    } else {
        const onItemRenderedHandler = sinon.spy();

        const $treeView = initTree({
            dataSource: window.dataID,
            onItemRendered: onItemRenderedHandler
        });

        $treeView.find('.dx-treeview-item').eq(0).trigger('mouseenter');

        assert.strictEqual(onItemRenderedHandler.callCount, 5);
    }
});
