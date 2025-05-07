import $ from 'jquery';
import CollectionWidget from 'ui/collection/ui.collection_widget.live_update';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';

const { module, test } = QUnit;

const generateData = (count) => {
    const items = [];
    for(let i = 0; i < count; i++) {
        items.push({ id: i, text: 'text ' + i, index: i + 10 });
    }
    return items;
};

class TestComponent extends CollectionWidget {
    constructor(element, options) {
        super(element, options);
        this.NAME = 'TestComponent';
        this._activeStateUnit = '.item';
    }

    _itemClass() { return 'item'; }
    _itemDataKey() { return '123'; }
    _itemContainer() { return this.$element(); }
    _shouldAppendItems() { return true; }

    reload() {
        super.reload();
        this.option('items', []);
        this._dataSource.pageIndex(0);
        this._dataSource.reload();
    }

    loadNextPage() {
        const dataSource = this._dataSource;
        dataSource.pageIndex(1 + dataSource.pageIndex());
        dataSource.load();
    }
}

class LiveUpdateTestHelper {
    constructor() {
        this.$element = $('#cmp');
        this.data = generateData(10);
        this.instance = this.getInstance();
        this.store = this.instance.getDataSource().store();
    }

    getItems() {
        return this.instance.option('items');
    }

    getItemElements() {
        return this.instance.itemElements();
    }

    getInstance(options) {
        this.onItemDeletingSpy = sinon.spy();

        return new TestComponent(this.$element, options || {
            dataSource: new DataSource({
                load: (e) => this.data.sort((a, b) => a.index - b.index),
                loadMode: 'raw',
                pageSize: 2,
                pushAggregationTimeout: 0,
                key: 'id'
            }),
            onItemDeleting: this.onItemDeletingSpy
        });
    }

    reinitializeWithOptions(options) {
        this.instance.dispose();
        this.instance = this.getInstance(options);
    }
}

let helper;

module('live update', {
    beforeEach: function() {
        helper = new LiveUpdateTestHelper();
    }
}, () => {
    test('check load next page', function(assert) {
        assert.equal(helper.getItems().length, 2);
        helper.instance.loadNextPage();
        assert.equal(helper.getItems()[2], helper.data[2]);
        assert.equal(helper.getItems().length, 4);
    });

    test('correct index after push insert', function(assert) {
        helper.store.push([{ type: 'insert', data: { id: 200, text: 'text ' + 200, index: 0 }, index: 0 }]);
        helper.instance.loadNextPage();
        assert.equal(helper.getItems().length, 5);
        assert.equal(helper.getItems()[0].id, 200);
        assert.equal(helper.getItems()[4].id, 4);
    });

    test('correct index after push \'remove\'', function(assert) {
        helper.store.push([{ type: 'remove', key: 0 }]);
        helper.instance.loadNextPage();
        assert.equal(helper.getItems().length, 3);
        assert.equal(helper.getItems()[0].id, 1);
        assert.equal(helper.getItems()[2].id, 3);
    });

    // T723520
    test('correct index after push \'remove\' and dataSource reload', function(assert) {
        helper.instance._shouldAppendItems = () => false;
        helper.instance.getDataSource().pageSize(20);
        helper.instance.reload();

        helper.store.push([{ type: 'remove', key: 0 }]);

        const loadingSpy = sinon.spy();
        helper.store.on('loading', loadingSpy);
        helper.instance.getDataSource().reload();

        assert.equal(helper.getItems().length, 9);
        assert.equal(loadingSpy.callCount, 1);
        const { skip, take } = loadingSpy.getCall(0).args[0];
        assert.equal(skip, 0);
        assert.equal(take, 20);
    });

    test('fire deleting event after push \'remove\'', function(assert) {
        assert.equal(helper.onItemDeletingSpy.callCount, 0);
        helper.store.push([{ type: 'remove', key: 0 }]);
        assert.equal(helper.onItemDeletingSpy.callCount, 1);
    });

    test('fire dxremove event after push \'remove\'', function(assert) {
        const removeSpy = sinon.spy();

        $('.dx-item').on('dxremove', removeSpy);
        helper.store.push([{ type: 'remove', key: 0 }]);

        assert.equal(removeSpy.callCount, 1, 'should trigger dxremove event');
    });

    test('refresh correct index after reload', function(assert) {
        helper.store.push([{ type: 'insert', data: { id: 200, text: 'text ' + 200, index: 0 }, index: 0 }]);
        assert.equal(helper.getItems().length, 3);
        helper.instance.reload();
        assert.equal(helper.getItems()[0].id, 200);
        assert.equal(helper.getItems()[1].id, 0);
        assert.equal(helper.getItems().length, 2);
        assert.equal(helper.instance.itemElements().length, 2);
    });

    test('item is pushed to the end of store\'s array', function(assert) {
        helper.store.push([{ type: 'insert', data: { id: 200, text: 'text ' + 200, index: 0 }, index: 0 }]);
        assert.equal(helper.data.pop().id, 200);
    });

    test('next page items should be correctly updated with "repaintChangesOnly" mode when dataSource reloaded(T950597)', function(assert) {
        let isMarked = false;
        const store = new CustomStore({
            load: () => generateData(25),
            onLoaded: function(result) {
                result.forEach((entry) => {
                    entry.text = isMarked ? `${entry.text} mark` : entry.text;
                });
            }
        });
        helper.reinitializeWithOptions({
            dataSource: {
                store,
                paginate: true
            },
            displayExpr: 'text',
            repaintChangesOnly: true
        });

        helper.instance.loadNextPage();
        isMarked = true;
        helper.instance.reload();
        helper.instance.loadNextPage();

        const $items = helper.getItemElements();
        assert.strictEqual($items.first().text(), 'text 0 mark', 'the first item correctly updated');
        assert.strictEqual($items.last().text(), 'text 24 mark', 'the last item correctly updated');
    });

    test('next page items should not be excessive skipped after dataSource runtime change and push remove (T1250900)', function(assert) {
        const newDataSource = new DataSource({
            load: () => helper.data.sort((a, b) => a.index - b.index),
            loadMode: 'raw',
            pageSize: 2,
            pushAggregationTimeout: 0,
            key: 'id'
        });
        helper.instance.option('dataSource', newDataSource);

        let items = helper.getItems();
        assert.strictEqual(items.length, 2, '2 items on the first page');
        assert.strictEqual(items[0].id, 0, '0 item');
        assert.strictEqual(items[1].id, 1, '1st item');

        newDataSource.store().push([{ type: 'remove', key: 0 }]);

        items = helper.getItems();
        assert.strictEqual(items.length, 1, '1 item on the first page after remove');
        assert.strictEqual(items[0].id, 1, '1 item');

        helper.instance.loadNextPage();

        items = helper.getItems();
        assert.strictEqual(items.length, 3, '2 pages are loaded');
        assert.strictEqual(items[0].id, 1, '1 item');
        assert.strictEqual(items[1].id, 2, '2 item');
        assert.strictEqual(items[2].id, 3, '3 item');
    });

    test('dataSource runtime change should be correct even if remove was pushed to the previous dataSource', function(assert) {
        const data = [...helper.data];
        helper.store.push([{ type: 'remove', key: 0 }]);

        const newDataSource = new DataSource({
            load: (e) => data.sort((a, b) => a.index - b.index),
            loadMode: 'raw',
            pageSize: 2,
            pushAggregationTimeout: 0,
            key: 'id'
        });
        helper.instance.option('dataSource', newDataSource);

        let items = helper.getItems();
        assert.strictEqual(items[0].id, 0, '0 item');
        assert.strictEqual(items[1].id, 1, '1 item');

        helper.instance.loadNextPage();

        items = helper.getItems();
        assert.strictEqual(items[2].id, 2, '2 item');
        assert.strictEqual(items[3].id, 3, '3 item');
    });
});
