/* global DATA, internals, initTree */

import $ from 'jquery';
import commonUtils from 'core/utils/common';
import { isFunction } from 'core/utils/type';
import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';
import { CustomStore } from 'common/data/custom_store';
import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';

const NODE_LOAD_INDICATOR_CLASS = 'dx-treeview-node-loadindicator';
const TREEVIEW_ITEM_WITH_CHECKBOX_CLASS = 'dx-treeview-item-with-checkbox';
const DX_LOAD_INDICATOR_CLASS = 'dx-loadindicator';
const CHECK_BOX_CLASS = 'dx-checkbox';

QUnit.module('Rendering', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('Scrollable container should be updated after collapse/expand treeView item', function(assert) {
    const $treeView = initTree({
        items: $.extend(true, [], DATA[1]),
        keyExpr: 'key'
    });
    const treeView = $treeView.dxTreeView('instance');

    treeView.getScrollable().update = sinon.spy(commonUtils.noop);

    $treeView
        .find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS + ':first')
        .trigger('dxclick');

    assert.equal(treeView.getScrollable().update.callCount, 3); // 1 before content ready, 1 after content ready and 1 after node expanding animation (_animateNodeContainer)
});

QUnit.test('updateDimensions method should update scrollable container', function(assert) {
    const $treeView = initTree({
        items: $.extend(true, [], DATA[1]),
        keyExpr: 'key'
    });
    const treeView = $treeView.dxTreeView('instance');

    treeView.getScrollable().update = sinon.spy(function() {
        return $.Deferred().resolve();
    });

    assert.ok(isFunction(treeView.updateDimensions));
    const result = treeView.updateDimensions();
    assert.ok(treeView.getScrollable().update.calledOnce);
    assert.ok(result.promise);
});

QUnit.test('Scrollable container should be updated if height of widget content is less than height of scrollable content', function(assert) {
    const data = $.extend(true, [], DATA[5]);
    data[0].items[1].expanded = true;

    initTree({
        items: data,
        height: 100,
        onContentReady: function() {
            $('#treeView').children().first().dxScrollable('instance').update = sinon.spy(commonUtils.noop);
        }
    }).dxTreeView('instance');

    assert.ok($('#treeView').children().first().dxScrollable('instance').update.calledOnce);
});

QUnit.test('Toggle visibility action', function(assert) {
    const $treeView = initTree({
        items: $.extend(true, [], DATA[5])
    });
    const treeView = $treeView.dxTreeView('instance');
    const items = treeView.option('items');


    const $toggleVisibilityIcon = $treeView.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS);

    $toggleVisibilityIcon.trigger('dxclick');

    const $nestedNode = $treeView.find('.' + internals.NODE_CONTAINER_CLASS + ':last-child');
    assert.ok($nestedNode.hasClass(internals.OPENED_NODE_CONTAINER_CLASS));
    assert.ok($toggleVisibilityIcon.hasClass(internals.TOGGLE_ITEM_VISIBILITY_OPENED_CLASS));
    assert.ok(items[0].expanded);

    let nodes = treeView.getNodes();
    assert.ok(nodes[0].expanded);

    $toggleVisibilityIcon.trigger('dxclick');
    assert.ok(!$nestedNode.hasClass(internals.OPENED_NODE_CONTAINER_CLASS));
    assert.ok(!$toggleVisibilityIcon.hasClass(internals.TOGGLE_ITEM_VISIBILITY_OPENED_CLASS));
    assert.ok(!items[0].expanded);

    nodes = treeView.getNodes();
    assert.ok(!nodes[0].expanded);
});

QUnit.test('Correct loadIndicator is hidden after expanding node (T955388)', function(assert) {
    const wrapper = new TreeViewTestWrapper({
        items: [{ id: '1', items: [{ id: '1_1' }] }],
        itemTemplate: function(itemData, itemIndex, itemElement) {
            const loadIndicator = $('<div />').addClass(DX_LOAD_INDICATOR_CLASS);
            $(itemElement).append(loadIndicator);
        }
    });

    wrapper.instance.expandItem('1');

    const treeViewLoadIndicator = wrapper.getNodeLoadIndicator(wrapper.getElement());
    assert.ok(wrapper.hasInvisibleClass(treeViewLoadIndicator));

    const loadIndicators = wrapper.getElement().find(`.${DX_LOAD_INDICATOR_CLASS}:not(.${NODE_LOAD_INDICATOR_CLASS})`);
    assert.notOk(wrapper.hasInvisibleClass(loadIndicators.eq(0)));
    assert.notOk(wrapper.hasInvisibleClass(loadIndicators.eq(1)));
});

QUnit.test('\'getNodes\' method', function(assert) {
    const treeView = initTree({
        items: [
            { id: 1, text: 'Item 1' },
            {
                id: 2, text: 'Item 2',
                items: [
                    { id: 3, text: 'Nested item 1' },
                    { id: 4, text: 'Nested item 2' }
                ]
            }
        ]
    }).dxTreeView('instance');

    const nodes = treeView.getNodes();

    assert.equal(nodes[0].itemData.id, 1);
    assert.equal(nodes[0].itemData.text, 'Item 1');
    assert.equal(nodes[0].parent, null);

    assert.equal(nodes[1].itemData.id, 2);
    assert.equal(nodes[1].itemData.text, 'Item 2');
    assert.equal(nodes[1].parent, null);
    assert.equal(nodes[1].children.length, 2);

    assert.equal(nodes[1].children[0].itemData.id, 3);
    assert.equal(nodes[1].children[0].itemData.text, 'Nested item 1');
    assert.equal(nodes[1].children[0].parent.itemData.text, 'Item 2');

    assert.equal(nodes[1].children[1].itemData.id, 4);
    assert.equal(nodes[1].children[1].itemData.text, 'Nested item 2');
    assert.equal(nodes[1].children[1].parent.itemData.text, 'Item 2');
});

QUnit.test('\'getNodes\' method with selectedItems', function(assert) {
    const treeView = initTree({
        items: [
            { id: 1, text: 'Item 1' },
            {
                id: 2, text: 'Item 2',
                items: [
                    { id: 3, text: 'Nested item 1', selected: true },
                    { id: 4, text: 'Nested item 2' }
                ]
            }
        ],
        showCheckBoxesMode: 'normal'
    }).dxTreeView('instance');

    const nodes = treeView.getNodes();

    assert.equal(nodes[0].itemData.id, 1);
    assert.equal(nodes[0].itemData.text, 'Item 1');
    assert.equal(nodes[0].parent, null);

    assert.equal(nodes[1].itemData.id, 2);
    assert.equal(nodes[1].itemData.text, 'Item 2');
    assert.equal(nodes[1].parent, null);

    assert.ok(Object.prototype.hasOwnProperty.call(nodes[1], 'selected'));
    assert.strictEqual(nodes[1].selected, undefined);
    assert.equal(nodes[1].children.length, 2);

    assert.equal(nodes[1].children[0].itemData.id, 3);
    assert.equal(nodes[1].children[0].itemData.text, 'Nested item 1');
    assert.equal(nodes[1].children[0].parent.text, 'Item 2');
    assert.strictEqual(nodes[1].children[0].selected, true);

    assert.equal(nodes[1].children[1].itemData.id, 4);
    assert.equal(nodes[1].children[1].itemData.text, 'Nested item 2');
    assert.equal(nodes[1].children[1].parent.text, 'Item 2');
});

QUnit.test('\'getNodes\' method should return right result when some item was selected', function(assert) {
    const $treeView = initTree({
        items: [
            { id: 1, text: 'Item 1' },
            {
                id: 2, text: 'Item 2', expanded: true,
                items: [
                    { id: 3, text: 'Nested item 1' },
                    { id: 4, text: 'Nested item 2' }
                ]
            }
        ],
        showCheckBoxesMode: 'normal'
    });

    const treeView = $treeView.dxTreeView('instance');
    const $checkbox = $treeView.find(`.${CHECK_BOX_CLASS}`).eq(2);

    $checkbox.trigger('dxclick');

    const nodes = treeView.getNodes();

    assert.equal(nodes[0].itemData.id, 1);
    assert.equal(nodes[0].itemData.text, 'Item 1');
    assert.equal(nodes[0].parent, null);

    assert.equal(nodes[1].itemData.id, 2);
    assert.equal(nodes[1].itemData.text, 'Item 2');
    assert.equal(nodes[1].parent, null);

    assert.ok(Object.prototype.hasOwnProperty.call(nodes[1], 'selected'));
    assert.strictEqual(nodes[1].selected, undefined);
    assert.equal(nodes[1].children.length, 2);

    assert.equal(nodes[1].children[0].itemData.id, 3);
    assert.equal(nodes[1].children[0].itemData.text, 'Nested item 1');
    assert.equal(nodes[1].children[0].parent.text, 'Item 2');
    assert.strictEqual(nodes[1].children[0].selected, true);

    assert.equal(nodes[1].children[1].itemData.id, 4);
    assert.equal(nodes[1].children[1].itemData.text, 'Nested item 2');
    assert.equal(nodes[1].children[1].parent.text, 'Item 2');
});

QUnit.test('\'getNodes\' method should return right result when selectAll was changed', function(assert) {
    const $treeView = initTree({
        items: [
            { id: 1, text: 'Item 1' },
            {
                id: 2, text: 'Item 2',
                items: [
                    { id: 3, text: 'Nested item 1' },
                    {
                        id: 4, text: 'Nested item 2', expanded: true,
                        items: [
                            { id: 5, text: 'Nested item 3' }
                        ]
                    }
                ]
            }
        ],
        showCheckBoxesMode: 'selectAll'
    });

    const $selectAllItem = $treeView.find('.dx-treeview-select-all-item');
    const treeView = $treeView.dxTreeView('instance');
    let nodes;

    $selectAllItem.trigger('dxclick');
    nodes = treeView.getNodes();

    assert.strictEqual(nodes[0].selected, true);
    assert.strictEqual(nodes[1].selected, true);
    assert.strictEqual(nodes[1].children[0].selected, true);
    assert.strictEqual(nodes[1].children[1].selected, true);
    assert.strictEqual(nodes[1].children[1].children[0].selected, true);

    $selectAllItem.trigger('dxclick');
    nodes = treeView.getNodes();

    assert.strictEqual(nodes[0].selected, false);
    assert.strictEqual(nodes[1].selected, false);
    assert.strictEqual(nodes[1].children[0].selected, false);
    assert.strictEqual(nodes[1].children[1].selected, false);
    assert.strictEqual(nodes[1].children[1].children[0].selected, false);
});

QUnit.test('\'getNodes\' method should return hierarchical structure if widget was initialized with plain data', function(assert) {
    const treeView = initTree({
        items: [
            { id: 1, text: 'Item 1', parentId: 0 },
            { id: 2, text: 'Item 2', parentId: 0 },
            { id: 3, text: 'Item 2.1', parentId: 2 },
            { id: 4, text: 'Item 2.2', parentId: 2 }
        ],
        dataStructure: 'plain'
    }).dxTreeView('instance');

    const nodes = treeView.getNodes();

    assert.equal(nodes.length, 2);

    assert.ok(!nodes[0].children.length);
    assert.equal(nodes[0].itemData.text, 'Item 1');

    assert.equal(nodes[1].itemData.text, 'Item 2');
    assert.equal(nodes[1].items.length, 2);

    assert.equal(nodes[1].items[0].itemData.text, 'Item 2.1');
    assert.equal(nodes[1].items[1].itemData.text, 'Item 2.2');

    assert.equal(nodes[1].items[0].parent.itemData.text, 'Item 2');
    assert.equal(nodes[1].items[1].parent.itemData.text, 'Item 2');
});

QUnit.test('Render checkbox before itemRendered is fired', function(assert) {
    let i = 0;
    const data = $.extend(true, [], DATA[5]);
    data[0].items[0].expanded = true;
    const $treeView = initTree({
        items: data,
        showCheckBoxesMode: 'normal',
        onItemRendered: function(e) {
            i++;
            assert.equal($(e.element).find(`.${internals.NODE_CLASS}`).find(`.${internals.ITEM_CLASS}`).find(`.${CHECK_BOX_CLASS}`).length, i);
            assert.equal($(e.element).find(`.${internals.NODE_CLASS}.${TREEVIEW_ITEM_WITH_CHECKBOX_CLASS}`).length, i);
        }
    });

    assert.ok($treeView);
    assert.equal(i, 4, 'itemRendered event is fired 3 times');

});

QUnit.test('onItemRendered should have correct node if key is string', function(assert) {
    const itemRenderedHandler = sinon.spy();

    initTree({
        items: [{ id: '1_0', text: 'String id' }],
        onItemRendered: itemRenderedHandler
    });

    assert.equal(itemRenderedHandler.getCall(0).args[0].node.key, '1_0', 'node.key');
});

QUnit.test('Items change correct on option change', function(assert) {
    const data = $.extend(true, [], DATA[5]);
    data[0].expanded = true;
    const $treeView = initTree({
        items: [{
            text: 'item1',
            selected: true,
            expanded: true,
            items: [ { text: 'item1-1' } ]
        }],
        showCheckBoxesMode: 'normal'
    });
    const treeView = $treeView.dxTreeView('instance');

    assert.ok(treeView.option('items')[0].selected);
    assert.ok(treeView.option('items')[0].expanded);

    treeView.option('items', [{ text: 'a' }, { text: 'b' }]);

    assert.ok(!treeView.option('items')[0].selected);
    assert.ok(!treeView.option('items')[0].expanded);
});

QUnit.test('DataSource change correct on option change', function(assert) {
    const data = $.extend(true, [], DATA[5]);
    data[0].expanded = true;
    const $treeView = initTree({
        dataSource: [{
            text: 'item1',
            selected: true,
            expanded: true,
            items: [{ text: 'item1-1' }]
        }],
        showCheckBoxesMode: 'normal'
    });
    const treeView = $treeView.dxTreeView('instance');

    assert.ok(treeView.option('items')[0].selected);
    assert.ok(treeView.option('items')[0].expanded);

    treeView.option('dataSource', [{ text: 'a' }, { text: 'b' }]);

    assert.ok(!treeView.option('items')[0].selected);
    assert.ok(!treeView.option('items')[0].expanded);
});

QUnit.test('showCheckBoxesMode option', function(assert) {
    const $treeView = initTree({
        items: [{ id: 1, html: '<b>Hello</b>' }]
    });
    const instance = $treeView.dxTreeView('instance');

    assert.notOk($treeView.find(`.${CHECK_BOX_CLASS}`).length, 'there are no checkboxes');

    instance.option('showCheckBoxesMode', 'selectAll');
    assert.ok($treeView.find(`.${CHECK_BOX_CLASS}`).length, 'checkboxes was rendered');
    assert.ok($treeView.find('.dx-treeview-select-all-item').length, 'selectAll item was rendered');

    instance.option('showCheckBoxesMode', 'normal');
    assert.ok($treeView.find(`.${CHECK_BOX_CLASS}`).length, 'checkboxes was rendered');
    assert.notOk($treeView.find('.dx-treeview-select-all-item').length, 'selectAll item was not rendered');
});

QUnit.test('Repaint treeView on every dataSource modified - insert', function(assert) {
    const store = new ArrayStore({
        key: 'id',
        data: [{
            id: 1,
            text: 'Item 1',
            parentId: 0
        }, {
            id: 2,
            text: 'Item 2',
            parentId: 0
        }, {
            id: 4,
            text: 'Item 2-1',
            parentId: 1
        }, {
            id: 5,
            text: 'Item 2-2',
            parentId: 2
        }, {
            id: 3,
            text: 'Item 1-1',
            parentId: 1
        }]
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

    const treeView = initTree({
        dataSource: dataSource,
        dataStructure: 'plain'
    }).dxTreeView('instance');
    const toggleIcon = $(treeView.$element()).find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(1);
    let items;

    dataSource.store().insert({
        id: 7,
        text: 'Item 2-3',
        parentId: 2
    });

    toggleIcon.trigger('dxclick');
    items = $(treeView.$element()).find('.' + internals.ITEM_CLASS);
    assert.equal(items.length, 4);

    dataSource.store().insert({
        id: 6,
        text: 'Item 3',
        parentId: 0
    });

    items = $(treeView.$element()).find('.' + internals.ITEM_CLASS);
    assert.equal(items.length, 5);

    treeView.option('searchValue', 'Item 2');
    items = $(treeView.$element()).find('.' + internals.ITEM_CLASS);
    assert.equal(items.length, 5);

    dataSource.store().insert({
        id: 8,
        text: 'item 4',
        parentId: 0
    });

    items = $(treeView.$element()).find('.' + internals.ITEM_CLASS);
    assert.equal(items.length, 5);
});

QUnit.test('Repaint treeView on every dataSource modified - remove', function(assert) {
    const store = new ArrayStore({
        key: 'id',
        data: [{
            id: 1,
            text: 'Item 1',
            parentId: 0
        }, {
            id: 2,
            text: 'Item 2',
            parentId: 0
        }, {
            id: 3,
            text: 'Item 1-1',
            parentId: 1
        }, {
            id: 4,
            text: 'Item 2-1',
            parentId: 1
        }, {
            id: 5,
            text: 'Item 2-2',
            parentId: 2
        }, {
            id: 6,
            text: 'Item 1-1-1',
            parentId: 3
        }]
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

    const treeView = initTree({
        dataSource: dataSource,
        dataStructure: 'plain'
    }).dxTreeView('instance');
    let toggleIcon = $(treeView.$element()).find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS);
    let items;

    toggleIcon.eq(0).trigger('dxclick');

    toggleIcon.eq(1).trigger('dxclick');

    toggleIcon = $(treeView.$element()).find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS);
    toggleIcon.eq(1).trigger('dxclick');

    items = $(treeView.$element()).find('.' + internals.ITEM_CLASS);
    assert.equal(items.length, 6);

    dataSource.store().remove(4);

    items = $(treeView.$element()).find('.' + internals.ITEM_CLASS);
    assert.equal(items.length, 5);

    dataSource.store().remove(1);

    items = $(treeView.$element()).find('.' + internals.ITEM_CLASS);
    assert.equal(items.length, 2);
    assert.equal(treeView.option('items').length, 2);
});

QUnit.test('Dynamic dataSource filter should work correctly', function(assert) {
    const data = $.extend(true, [], DATA[4]);
    const dataSource = new DataSource({
        store: data
    });

    const $treeView = initTree({
        dataStructure: 'plain',
        keyExpr: 'Id',
        displayExpr: 'Name',
        parentIdExpr: 'ParentId',
        dataSource: dataSource
    }).dxTreeView('instance');

    assert.equal($treeView.option('items').length, 8, 'all items were loaded');

    dataSource.filter(['ParentId', '=', 3]);
    dataSource.load();
    assert.equal($treeView.option('items').length, 2, 'only dog\'s children were loaded');

    dataSource.filter(['ParentId', '=', 12]);
    dataSource.load();
    assert.equal($treeView.option('items').length, 1, 'only birds\'s children were loaded');
});

QUnit.test('existed items didn\'t append twice', function(assert) {
    const dataSource = new DataSource({
        store: new CustomStore({
            load: function(options) {
                return $.extend(true, [], DATA[4]);
            }
        })
    });

    const treeView = initTree({
        dataStructure: 'plain',
        keyExpr: 'Id',
        displayExpr: 'Name',
        parentIdExpr: 'ParentId',
        dataSource: dataSource,
        virtualModeEnabled: true
    }).dxTreeView('instance');

    treeView.expandItem(1);
    assert.equal(treeView.option('items').length, 8, 'all items were loaded');
});

QUnit.test('TreeView with empty dataSource should updates after item inserted in the Store', function(assert) {
    const dataSource = new DataSource({
        store: new ArrayStore([])
    });
    const treeView = initTree({
        dataStructure: 'plain',
        dataSource: dataSource
    }).dxTreeView('instance');

    dataSource.store().insert({
        id: 1,
        parentId: 0,
        text: 'Item 1'
    });
    dataSource.load();

    assert.equal(treeView.option('items').length, 1, 'item was inserted');
});


QUnit.test('Render Search editor with default options', function(assert) {
    const treeViewInstance = initTree({
        items: $.extend(true, [], DATA[1]),
        keyExpr: 'key',
        searchEnabled: true
    }).dxTreeView('instance');

    const searchEditorInstance = treeViewInstance.$element().children().first().dxTextBox('instance');
    assert.equal(searchEditorInstance.option('placeholder'), 'Search');
    assert.equal(searchEditorInstance.option('value'), '');
    assert.equal(searchEditorInstance.option('valueChangeEvent'), 'input');
    assert.equal(searchEditorInstance.option('mode'), 'search');
    assert.equal(searchEditorInstance.option('tabIndex'), 0);
});

QUnit.test('Render nodata message if filter has no matches', function(assert) {
    const treeViewInstance = initTree({
        items: [{ id: 1, text: '1' }, { id: 2, text: '1' }, { id: 3, text: '1' }]
    }).dxTreeView('instance');

    treeViewInstance.option('searchValue', '2');
    const noData = treeViewInstance.$element().find('.dx-empty-message');

    assert.ok(noData.length, 'no data is rendered');
    assert.ok(noData.is(':visible'), 'nodata is visible');
});

QUnit.test('Remove nodata message after clear searchValue', function(assert) {
    const treeViewInstance = initTree({
        items: [{ id: 1, text: '1' }, { id: 2, text: '1' }, { id: 3, text: '1' }],
        searchValue: '2'
    }).dxTreeView('instance');

    treeViewInstance.option('searchValue', '');
    const noData = treeViewInstance.$element().find('.dx-empty-message');

    assert.notOk(noData.length, 'no data is removed');
});

QUnit.test('searchMode equals', function(assert) {
    const $treeView = initTree({
        searchValue: '1',
        searchMode: 'equals',
        items: [{ id: 1, text: '1' }, { id: 2, text: '11' }, { id: 3, text: '111' }]
    });

    assert.equal($treeView.find('.dx-item').length, 1, 'one item is rendered');
});

QUnit.module('Visibility data source property', () => {
    QUnit.test('Render items with default visibility', function(assert) {
        const wrapper = new TreeViewTestWrapper({ items: [
            { text: 'item1' },
            { text: 'item2' }
        ] });
        const $nodes = wrapper.getNodes();
        assert.strictEqual(wrapper.hasInvisibleClass($nodes.eq(0)), false, '0 node has no invisible class');
        assert.strictEqual(wrapper.hasInvisibleClass($nodes.eq(1)), false, '1 node has no invisible class');
    });

    [true, false].forEach(visible => {
        // (T888410)
        QUnit.test(`Render items with visibility: ${visible}`, function(assert) {
            const wrapper = new TreeViewTestWrapper({ items: [
                { text: 'item1', visible: visible },
                { text: 'item2', visible: visible }
            ] });
            const $nodes = wrapper.getNodes();
            assert.strictEqual(wrapper.hasInvisibleClass($nodes.eq(0)), !visible, '0 node has correct visible class');
            assert.strictEqual(wrapper.hasInvisibleClass($nodes.eq(1)), !visible, '1 node has correct visible class');
        });
    });

    QUnit.test('Change item1 visibility: true -> false (via item visibility option and repaint)', function(assert) {
        const items = [ { text: 'item1' }, { text: 'item2' } ];
        const wrapper = new TreeViewTestWrapper({ items: items });
        wrapper.instance.option('items[0].visible', false);
        wrapper.instance.repaint();

        const $nodes = wrapper.getNodes();
        assert.strictEqual(wrapper.hasInvisibleClass($nodes.eq(0)), true, '0 node has invisible class');
        assert.strictEqual(wrapper.hasInvisibleClass($nodes.eq(1)), false, '1 node has no invisible class');
    });

    QUnit.test('Change item1 visibility: false -> true (via item visibility option and repaint)', function(assert) {
        const items = [ { text: 'item1', visible: false }, { text: 'item2' } ];
        const wrapper = new TreeViewTestWrapper({ items: items });
        wrapper.instance.option('items[0].visible', true);
        wrapper.instance.repaint();

        const $nodes = wrapper.getNodes();
        assert.strictEqual(wrapper.hasInvisibleClass($nodes.eq(0)), false, '0 node has no invisible class');
        assert.strictEqual(wrapper.hasInvisibleClass($nodes.eq(1)), false, '1 node has no invisible class');
    });

    QUnit.test('Change item1 visibility: true -> false (via refreshing data source)', function(assert) {
        const items = [ { text: 'item1' }, { text: 'item2' } ];
        const wrapper = new TreeViewTestWrapper({ items: items });
        items[0].visible = false;
        wrapper.instance.option('items', items);

        const $nodes = wrapper.getNodes();
        assert.strictEqual(wrapper.hasInvisibleClass($nodes.eq(0)), true, '0 node has invisible class');
        assert.strictEqual(wrapper.hasInvisibleClass($nodes.eq(1)), false, '1 node has no invisible class');
    });

    QUnit.test('Change item1 visibility: false -> true (via refreshing data source)', function(assert) {
        const items = [ { text: 'item1', visible: false }, { text: 'item2' } ];
        const wrapper = new TreeViewTestWrapper({ items: items });
        items[0].visible = true;
        wrapper.instance.option('items', items);

        const $nodes = wrapper.getNodes();
        assert.strictEqual(wrapper.hasInvisibleClass($nodes.eq(0)), false, '0 node has no invisible class');
        assert.strictEqual(wrapper.hasInvisibleClass($nodes.eq(1)), false, '1 node has no invisible class');
    });
});
