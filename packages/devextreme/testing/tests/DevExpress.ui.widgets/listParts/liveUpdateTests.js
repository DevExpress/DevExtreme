import $ from 'jquery';
import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';

import 'ui/list';

const LIST_ITEM_CLASS = 'dx-list-item';
const LIST_GROUP_CLASS = 'dx-list-group';

QUnit.module('live update', {
    beforeEach: function() {
        this.itemRenderedSpy = sinon.spy();
        this.itemDeletedSpy = sinon.spy();
        this.createList = (options) => {
            return $('#templated-list').dxList($.extend(true, {
                dataSource: {
                    paginate: false,
                    pushAggregationTimeout: 0,
                    load: () => [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }],
                    key: 'id'
                },
                onContentReady: (e) => {
                    e.component.option('onItemRendered', this.itemRenderedSpy);
                    e.component.option('onItemDeleted', this.itemDeletedSpy);
                }
            }, options)).dxList('instance');
        };

        this.createGroupedList = () => {
            return this.createList({
                repaintChangesOnly: true,
                grouped: true,
                displayExpr: 'id',
                keyExpr: 'id',
                dataSource: new DataSource({
                    paginate: false,
                    pushAggregationTimeout: 0,
                    store: new ArrayStore([{ key: 'Item 0', id: '0' }, { key: 'Item 1', id: '1' }]),
                    key: 'id',
                    group: 'key',
                    reshapeOnPush: true
                })
            });
        };
    }
}, function() {
    QUnit.test('update item', function(assert) {
        const list = this.createList();
        const store = list.getDataSource().store();

        const pushData = [{ type: 'update', data: { a: 'Item 0 Updated', id: 0 }, key: 0 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.equal(list.itemElements().length, 2, 'check items elements count');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check updated item');
    });

    QUnit.test('insert item', function(assert) {
        const store = this.createList().getDataSource().store();

        const pushData = [{ type: 'insert', data: { a: 'Item 2 Inserted', id: 2 } }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check added item');
    });

    QUnit.test('insert item should not work if paginate', function(assert) {
        const store = this.createList({ dataSource: { paginate: true } }).getDataSource().store();

        const pushData = [{ type: 'insert', data: { a: 'Item 2 Inserted', id: 2 } }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 0, 'item is not inserted after push');
    });

    QUnit.test('insert item should not work if grouping', function(assert) {
        const store = this.createList({ dataSource: { group: 'a' } }).getDataSource().store();

        const pushData = [{ type: 'insert', data: { a: 'Item 2 Inserted', id: 2 } }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 0, 'item is inserted after push');
    });


    QUnit.test('insert item should work correct if grouping and repaintChangesOnly (T993317)', function(assert) {
        const listInstance = this.createGroupedList();

        const store = listInstance.getDataSource().store();
        store.push([{ type: 'insert', data: { key: 'Item 1', id: '2' } }]);

        const listItems = $(listInstance.element()).find(`.${LIST_ITEM_CLASS}`);

        assert.strictEqual(this.itemRenderedSpy.callCount, 1, 'item is inserted after push');
        assert.strictEqual(listItems.length, 3, 'new item is added');
    });

    QUnit.test('insert item should work correct if grouping and repaintChangesOnly (new group) (T993317)', function(assert) {
        const listInstance = this.createGroupedList();

        const store = listInstance.getDataSource().store();
        store.push([{ type: 'insert', data: { key: 'Item New', id: '2' } }]);

        const $list = $(listInstance.element());
        const listGroups = $list.find(`.${LIST_GROUP_CLASS}`);
        const listItems = $list.find(`.${LIST_ITEM_CLASS}`);

        assert.strictEqual(this.itemRenderedSpy.callCount, 3, 'all items is rerendered');
        assert.strictEqual(listItems.length, 3, 'new item is added');
        assert.strictEqual(listGroups.length, 3, 'new group is added');
    });

    QUnit.test('insert new group with empty items array should work correct if grouping and repaintChangesOnly (T1035520)', function(assert) {
        const listInstance = $('#templated-list').dxList({
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ key: 1, items: ['1'] }],
                    key: 'key'
                }
            },
            grouped: true,
            repaintChangesOnly: true
        }).dxList('instance');

        listInstance.getDataSource().store().insert({
            key: 2,
            items: []
        });
        listInstance.getDataSource().reload();

        const $list = $(listInstance.element());
        const listGroups = $list.find(`.${LIST_GROUP_CLASS}`);

        assert.strictEqual(listGroups.length, 2, 'new group is added');
    });

    QUnit.test('insert new group should work correct if grouping and repaintChangesOnly and store has no key (T1035520)', function(assert) {
        const listInstance = $('#templated-list').dxList({
            dataSource: {
                store: new ArrayStore(['1', '2'])
            },
            grouped: true,
            repaintChangesOnly: true
        }).dxList('instance');

        listInstance.getDataSource().store().insert('3');
        listInstance.getDataSource().reload();

        const $list = $(listInstance.element());
        const listGroups = $list.find(`.${LIST_GROUP_CLASS}`);

        assert.strictEqual(listGroups.length, 3, 'new group is added');
    });

    QUnit.test('insert item to specific position', function(assert) {
        const store = this.createList().getDataSource().store();

        const pushData = [{ type: 'insert', data: { a: 'Item 2 Inserted', id: 2 }, index: 1 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check added item');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemIndex, pushData[0].index, 'check added index');
    });

    QUnit.test('insert item to specific position if paginate', function(assert) {
        const store = this.createList().getDataSource({ dataSource: { paginate: true } }).store();

        const pushData = [{ type: 'insert', data: { a: 'Item 2 Inserted', id: 2 }, index: 1 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check added item');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemIndex, pushData[0].index, 'check added index');
    });

    QUnit.test('insert item to specific position and update', function(assert) {
        const list = this.createList();
        const store = list.getDataSource().store();

        const pushData = [{ type: 'insert', data: { a: 'Item 2 Inserted', id: 2 }, index: 0 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.firstCall.args[0].itemIndex, 0, 'index');
        assert.equal($(this.itemRenderedSpy.firstCall.args[0].itemElement).get(0), list.itemElements()[0]);

        store.push([{ type: 'update', data: { a: 'Item 2 Updated', id: 2 }, key: 2 }]);

        assert.equal(this.itemRenderedSpy.callCount, 2, 'insert & update');
        assert.equal(this.itemRenderedSpy.lastCall.args[0].itemIndex, 0, 'index');
        assert.equal($(this.itemRenderedSpy.lastCall.args[0].itemElement).get(0), list.itemElements()[0]);
        assert.equal(list.itemElements().length, 3, 'check items elements count');
    });

    QUnit.test('remove one item', function(assert) {
        const list = this.createList();
        const store = list.getDataSource().store();

        const pushData = [{ type: 'remove', key: 0 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 0, 'items are not refreshed after remove');
        assert.equal(list.option('items').length, 1);
        assert.deepEqual(this.itemDeletedSpy.callCount, 1, 'check removed items count');
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData.id, pushData[0].key, 'check removed item key');
    });

    QUnit.test('remove two items', function(assert) {
        const store = this.createList({
            dataSource: {
                paginate: false,
                pushAggregationTimeout: 0,
                load: () => [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }, { a: 'Item 3', id: 2 }],
                key: 'id'
            }
        }).getDataSource().store();

        const pushData = [{ type: 'remove', key: 0 }, { type: 'update', data: { a: 'Item 2 Updated', id: 2 }, key: 2 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'items are not refreshed after remove');
        assert.deepEqual(this.itemDeletedSpy.callCount, 1, 'check removed items count');
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData.id, pushData[0].key, 'check removed item key');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.id, pushData[1].key, 'check updated item key');
    });

    QUnit.test('update item when grouping is enabled', function(assert) {
        const store = this.createList({
            dataSource: {
                load: () => [{
                    key: 'a',
                    items: [{ a: 'Item 0', id: 0, type: 'a' }, { a: 'Item 2', id: 0, type: 'a' }]
                }, {
                    key: 'b',
                    items: [{ a: 'Item 1', id: 1, type: 'b' }]
                }],
                pushAggregationTimeout: 0,
                key: 'id',
                group: 'type'
            },
            grouped: true
        }).getDataSource().store();

        const pushData = [{ type: 'update', data: { a: 'Item 0 Updated', id: 0, type: 'a' }, key: 0 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check updated item');
    });

    QUnit.test('update item when paging is enabled', function(assert) {
        const list = this.createList({
            pageLoadMode: 'nextButton',
            dataSource: {
                paginate: true,
                pageSize: 2,
                pushAggregationTimeout: 0,
                key: 'id',
                load: (loadOptions) => {
                    if(loadOptions.skip > 0) {
                        return [{ a: 'Item 2', id: 2 }, { a: 'Item 3', id: 3 }];
                    }
                    return [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];
                }
            }
        });
        const store = list.getDataSource().store();

        const $moreButton = $('#templated-list .dx-list-next-button > .dx-button').eq(0);
        $moreButton.trigger('dxclick');

        this.itemRenderedSpy.resetHistory();
        const pushData = [
            { type: 'update', data: { a: 'Item 0 Updated', id: 0 }, key: 0 },
            { type: 'update', data: { a: 'Item 2 Updated', id: 2 }, key: 2 },
        ];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 2, 'items from different pages are updated after push');
        assert.equal(list.itemElements().length, 4, 'check items elements count');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check first updated item');
        assert.deepEqual(this.itemRenderedSpy.lastCall.args[0].itemData, pushData[1].data, 'check last updated item');
    });

    QUnit.test('load new page by scrolling after updating an item (T937825)', function(assert) {
        const list = this.createList({
            pageLoadMode: 'scrollBottom',
            height: 40,
            displayExpr: 'text',
            useNativeScrolling: false,
            dataSource: {
                paginate: true,
                pageSize: 2,
                pushAggregationTimeout: 0,
                key: 'id',
                store: [
                    { id: 1, text: 'item1' },
                    { id: 2, text: 'item2' },
                    { id: 3, text: 'item3' },
                    { id: 4, text: 'item4' },
                    { id: 5, text: 'item5' }
                ]
            }
        });
        const store = list.getDataSource().store();

        store.push([
            {
                type: 'update',
                data: { text: 'itemN' },
                key: 1
            }
        ]);

        list.scrollTo(100);
        assert.strictEqual(list.itemElements().length, 4, '2nd page is loaded');
    });

    QUnit.test('push & repaintChangesOnly', function(assert) {
        const data = [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];
        const list = this.createList({
            dataSource: {
                paginate: false,
                load: () => data,
                pushAggregationTimeout: 0,
                key: 'id'
            },
            repaintChangesOnly: true
        });
        const dataSource = list.getDataSource();

        const pushData = [
            { type: 'insert', data: { a: 'Item Inserted', id: 2 }, index: 1 },
        ];
        dataSource.store().push(pushData);
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item Inserted');

        data[0] = { a: 'Item Updated', id: 0 };
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 2);
        assert.equal(list.itemElements().length, 3, 'check items elements count');
        assert.deepEqual(this.itemRenderedSpy.lastCall.args[0].itemData.a, 'Item Updated');
    });

    QUnit.test('repaintChangesOnly, update item instance', function(assert) {
        const data = [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];
        const dataSource = this.createList({
            dataSource: {
                load: () => data,
                key: 'id'
            },
            repaintChangesOnly: true
        }).getDataSource();

        data[0] = { a: 'Item Updated', id: 0 };
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after reload');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item Updated', 'check updated item');
    });

    QUnit.test('repaintChangesOnly, update item field', function(assert) {
        const data = [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];
        const dataSource = this.createList({
            dataSource: {
                load: () => data,
                key: 'id'
            },
            repaintChangesOnly: true
        }).getDataSource();

        data[0].a = 'Item Updated';
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after reload');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item Updated', 'check updated item');
    });

    QUnit.test('repaintChangesOnly, update field in circular item', function(assert) {
        const data = [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];

        data[0].ref = data[0];
        data[1].ref = data[1];

        const dataSource = this.createList({
            dataSource: {
                load: () => data,
                key: 'id'
            },
            repaintChangesOnly: true
        }).getDataSource();

        data[0] = $.extend({}, data[0], { a: 'Item Updated' });
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after reload');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item Updated', 'check updated item');
    });

    QUnit.test('repaintChangesOnly, grouping, update', function(assert) {
        const data = [{
            key: 'a',
            items: [{ a: 'Item 0', id: 0, type: 'a' }, { a: 'Item 2', id: 1, type: 'a' }]
        }, {
            key: 'b',
            items: [{ a: 'Item 1', id: 2, type: 'b' }]
        }];
        const dataSource = this.createList({
            dataSource: {
                load: () => data,
                key: 'id',
                group: 'type'
            },
            grouped: true,
            repaintChangesOnly: true
        }).getDataSource();

        data[0].items[0].a = 'Item Updated';
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after reload');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item Updated', 'check updated item');
    });

    QUnit.test('repaintChangesOnly, update dataSource', function(assert) {
        const data = [{ a: 'Item 0', id: 0 }, { a: 'Item Updated', id: 1 }];
        const list = this.createList({
            dataSource: {
                load: () => [data[0]],
                key: 'id'
            },
            repaintChangesOnly: true
        });

        const dataSource = new DataSource({
            paginate: false,
            load: () => data,
            key: 'id'
        });
        list.option('dataSource', dataSource);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after reload');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item Updated', 'check updated item');
    });

    QUnit.test('repaintChangesOnly, remove dataSource', function(assert) {
        const data = [{ a: 'Item 0', id: 0 }, { a: 'Item Updated', id: 1 }];
        const list = this.createList({
            dataSource: {
                load: () => [data[0]],
                key: 'id'
            },
            repaintChangesOnly: true
        });

        list.option('dataSource', null);

        assert.equal(list.option('items').length, 0, 'items are cleared');
    });

    QUnit.test('repaintChangesOnly, update store item', function(assert) {
        const data = [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];
        const dataSource = this.createList({
            dataSource: {
                load: () => data,
                key: 'id',
                update: (key, value) => data[0].a = value.a
            },
            repaintChangesOnly: true
        }).getDataSource();

        dataSource.store().update(0, { a: 'Item Updated', id: 0 });
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after reload');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item Updated', 'check updated item');
    });

    QUnit.test('repaintChangesOnly, update item', function(assert) {
        const data = [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];
        const list = this.createList({
            dataSource: null,
            items: data,
            keyExpr: 'id',
            repaintChangesOnly: true
        });

        data[0] = { a: 'Item Updated', id: 0 };
        list.option('items', data);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after reload');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item Updated', 'check updated item');
    });

    QUnit.test('repaintChangesOnly, insert item without key', function(assert) {
        const data = [{ a: 'Item 0' }, { a: 'Item 1' }];
        const list = this.createList({
            dataSource: null,
            items: data,
            repaintChangesOnly: true
        });

        data.push({ a: 'Item Inserted' });
        list.option('items', data);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after insert');
        assert.equal(list.itemElements().length, 3, 'check items elements count');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item Inserted', 'check inserted item');
    });

    QUnit.test('repaintChangesOnly, add item without key', function(assert) {
        const data = [{ a: 'Item 0' }, { a: 'Item 1' }];
        const list = this.createList({
            dataSource: null,
            items: data,
            repaintChangesOnly: true
        });

        data.push({ a: 'Item Added' });
        list.option('items', data);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after reload');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item Added', 'check added item');
    });

    QUnit.test('repaintChangesOnly, add item to specific position', function(assert) {
        const data = [{ a: 'Item 0' }, { a: 'Item 1' }];

        const list = this.createList({
            dataSource: null,
            items: data,
            repaintChangesOnly: true
        });

        data.splice(1, 0, { a: 'Item Added' });
        list.option('items', data);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, data[1], 'check added item');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemIndex, 1, 'check added index');
    });

    QUnit.test('repaintChangesOnly, delete item', function(assert) {
        const data = [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];
        const dataSource = this.createList({
            dataSource: {
                load: () => data,
                key: 'id'
            },
            repaintChangesOnly: true
        }).getDataSource();

        data.splice(0, 1);
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 0, 'no updated items');
        assert.equal(this.itemDeletedSpy.callCount, 1, 'one item is deleted');
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData.a, 'Item 0', 'check deleted item');
    });

    QUnit.test('repaintChangesOnly, add item', function(assert) {
        const data = [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];
        const dataSource = this.createList({
            dataSource: {
                load: () => data,
                key: 'id',
                pushAggregationTimeout: 0
            },
            repaintChangesOnly: true
        }).getDataSource();

        data.push({ a: 'Item 2', id: 2 });
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is rendered after append');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item 2', 'check appended item');
    });

    QUnit.test('repaintChangesOnly, add item in the beginning (dataSource)', function(assert) {
        const data = [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];
        const dataSource = this.createList({
            dataSource: {
                load: () => data,
                key: 'id',
                pushAggregationTimeout: 0
            },
            repaintChangesOnly: true
        }).getDataSource();

        data.unshift({ a: 'Item 2', id: 2 });
        dataSource.load();

        assert.equal(this.itemDeletedSpy.callCount, 0, 'only one item is rendered after append');
        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is rendered after append');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item 2', 'check appended item');
    });

    QUnit.test('repaintChangesOnly, add item in the beginning (items)', function(assert) {
        const data = [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];
        const list = this.createList({
            items: data,
            keyExpr: 'id',
            repaintChangesOnly: true
        });

        data.unshift({ a: 'Item 2', id: 2 });
        list.option('items', data);

        assert.equal(this.itemDeletedSpy.callCount, 0, 'only one item is rendered after append');
        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is rendered after append');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item 2', 'check appended item');
    });

    QUnit.test('repaintChangesOnly, update item instance with composite key', function(assert) {
        const data = [{ a: 'Item 0', id: 0, key: 1 }, { a: 'Item 1', id: 0, key: 0 }];
        const dataSource = this.createList({
            dataSource: {
                load: () => data,
                key: ['id', 'key']
            },
            repaintChangesOnly: true
        }).getDataSource();

        data[0] = { a: 'Item Updated', id: 0, key: 1 };
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after reload');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Item Updated', 'check updated item');
    });

    QUnit.test('repaintChangesOnly, circular item is inserted if there is no key', function(assert) {
        const store = this.createList({
            repaintChangesOnly: true,
            dataSource: {
                paginate: false,
                pushAggregationTimeout: 0,
                load: () => [{ id: 1, text: 'text 1' }],
                key: null
            },
        }).getDataSource().store();

        const circularItem = { id: 200, text: 'text ' + 200 };
        circularItem.child = circularItem;
        store.push([{ type: 'insert', data: circularItem, index: 0 }]);
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, circularItem, 'check inserted item');
    });

    QUnit.test('repaintChangesOnly, circular item is updated if there is no key', function(assert) {
        const items = [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];

        items[0].ref = items[0];
        items[1].ref = items[1];

        const store = this.createList({
            repaintChangesOnly: true,
            dataSource: {
                paginate: false,
                pushAggregationTimeout: 0,
                load: () => items,
                key: null
            }
        }).getDataSource().store();

        store.push([{ type: 'update', key: items[1], data: { a: 'Updated' }, index: 0 }]);
        assert.equal(this.itemRenderedSpy.firstCall.args[0].itemData.a, 'Updated', 'check updated item');
    });

    QUnit.test('onContentReady called after push', function(assert) {
        const contentReadySpy = sinon.spy();
        const list = this.createList({
            onContentReady: contentReadySpy
        });
        const store = list.getDataSource().store();

        const pushData = [{ type: 'insert', data: { a: 'Item 2 Inserted', id: 2 } }];
        store.push(pushData);

        assert.equal(contentReadySpy.callCount, 2);
    });

    QUnit.test('repaintChangesOnly, item selection after selected item removing (T821093)', function(assert) {
        const list = this.createList({
            repaintChangesOnly: true,
            selectionMode: 'single',
            selectedItemKeys: [0]
        });
        const store = list.getDataSource().store();

        store.push([{
            type: 'remove',
            key: 0
        }]);

        $('.dx-list-item').eq(0).trigger('dxclick');
        assert.deepEqual(list.option('selectedItemKeys'), [1]);
    });

    QUnit.test('repaintChangesOnly, clear item selection after reload if key is not defined (T944954)', function(assert) {
        const selectedItemSelector = '.dx-list-item-selected';

        const list = this.createList({
            dataSource: {
                load: () => ([{ id: 1 }, { id: 2 }]),
                key: null
            },
            repaintChangesOnly: true,
            selectionMode: 'single'
        });

        list.selectItem(1);

        assert.strictEqual(list.itemElements().filter(selectedItemSelector).length, 1, 'one selected item');
        const $itemElements = list.itemElements();

        list.getDataSource().reload();

        assert.equal(list.itemElements().length, 2, 'item element count');
        assert.strictEqual(list.itemElements().filter(selectedItemSelector).length, 0, 'no selected items');
        assert.equal(list.itemElements().get(0), $itemElements.get(0), 'item element 0 is not rerenderd');
        assert.notEqual(list.itemElements().get(1), $itemElements.get(1), 'item element 1 is rerenderd');
    });
});
