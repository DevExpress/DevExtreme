import '__internal/grids/tree_list/m_widget';
import $ from 'jquery';
import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';
import Guid from 'core/guid';
import query from 'common/data/query';
import { setupTreeListModules } from '../../helpers/treeListMocks.js';

const createDataSource = function(data, storeOptions, dataSourceOptions) {
    const arrayStore = new ArrayStore(storeOptions ? $.extend(true, { data: data }, storeOptions) : data);
    const dataSource = new DataSource($.extend(true, { store: arrayStore, _preferSync: true }, dataSourceOptions));

    return dataSource;
};

const generateData = function(count) {
    let i = 1;
    const result = [];

    while(i < count * 2) {
        result.push({ id: i, parentId: 0, field: 'a' }, { id: i + 1, parentId: i, field: 'b' });
        i += 2;
    }

    return result;
};

const setupModule = function() {
    this.options = {
        keyExpr: 'id',
        parentIdExpr: 'parentId',
        rootValue: 0,
        expandedRowKeys: [],
        paging: {
            enabled: false
        }
    };

    setupTreeListModules(this, ['data', 'columns', 'keyboardNavigation', 'focus', 'masterDetail', 'virtualScrolling']);

    this.applyOptions = function(options) {
        $.extend(this.options, options);
        this.columnsController.init();
        this.dataController.init();
    };
};

const teardownModule = function() {
    this.clock && this.clock.restore();
    this.dispose();
};

function foreachNodes(nodes, func) {
    for(let i = 0; i < nodes.length; i++) {
        func(nodes[i]);
        foreachNodes(nodes[i].children, func);
    }
}

QUnit.module('Initialization', { beforeEach: setupModule, afterEach: teardownModule }, () => {

    QUnit.test('No initialization', function(assert) {
        assert.deepEqual(this.dataController.items(), []);
        assert.ok(!this.dataController.isLoading());
        assert.ok(this.dataController.isLoaded());
    });

    QUnit.test('Paginate should be disabled', function(assert) {
    // arrange, act
        this.applyOptions({
            dataSource: []
        });

        // assert
        assert.notOk(this.dataController.dataSource().paginate(), 'paginate is disabled');
    });

    QUnit.test('Paginate should be enabled when virtual scrolling is enabled', function(assert) {
    // arrange, act
        this.applyOptions({
            dataSource: [],
            scrolling: {
                mode: 'virtual'
            }
        });

        // assert
        assert.ok(this.dataController.dataSource().paginate(), 'paginate is enabled');
    });

    QUnit.test('Initialize from dataSource with plain structure', function(assert) {
    // arrange
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 }
        ];
        const dataSource = createDataSource(array);

        this.dataController.setDataSource(dataSource);

        // act
        dataSource.load();

        // TODO: remove when implemented expandAllEnabled
        this.expandRow(2);

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');

        assert.equal(items[0].rowType, 'data', 'rowType of first item');
        assert.equal(items[0].key, 1, 'key of first item');
        assert.deepEqual(items[0].data, { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 }, 'data of first item');
        assert.deepEqual(items[0].values, ['Category1', '55-55-55', 1, 0], 'values of first item');
        assert.equal(items[0].node.children.length, 0, 'count children of first item');
        assert.notOk(items[0].node.hasChildren, 'first item hasn\'t children');
        assert.equal(items[0].level, 0, 'level of first item');
        assert.equal(items[0].node.parent.key, 0, 'first item has root parentKey');

        assert.equal(items[1].rowType, 'data', 'rowType of second item');
        assert.equal(items[1].key, 2, 'key of second item');
        assert.deepEqual(items[1].data, { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 }, 'data of second item');
        assert.deepEqual(items[1].values, ['Category2', '98-75-21', 2, 0], 'values of second item');
        assert.equal(items[1].node.children.length, 1, 'count children of second item');
        assert.ok(items[1].node.hasChildren, 'first item has children');
        assert.equal(items[1].node.level, 0, 'level of second item');
        assert.equal(items[1].node.parent.key, 0, 'second item has root parentKey');
        assert.deepEqual(items[1].node.children[0], items[2].node, 'child of second item');

        assert.equal(items[2].rowType, 'data', 'rowType of second item');
        assert.equal(items[2].key, 3, 'key of second item');
        assert.deepEqual(items[2].data, { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 }, 'data of second item');
        assert.deepEqual(items[2].values, ['SubCategory1', '55-66-77', 3, 2], 'values of second item');
        assert.equal(items[2].node.children.length, 0, 'count children of second item');
        assert.notOk(items[2].node.hasChildren, 'first item hasn\'t children');
        assert.equal(items[2].level, 1, 'level of second item');
        assert.equal(items[2].node.parent.key, items[1].key, 'second item has parentKey');
    });

    QUnit.test('root node should have correct key and level', function(assert) {
    // arrange
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 }
        ];
        const dataSource = createDataSource(array);

        this.dataController.setDataSource(dataSource);

        // act
        dataSource.load();

        // assert
        const rootNode = this.getRootNode();
        assert.strictEqual(rootNode.children.length, 2, 'root node children count');
        assert.strictEqual(rootNode.key, 0, 'root node key');
        assert.strictEqual(rootNode.level, -1, 'root node level');
    });

    // T514552
    QUnit.test('nodes should not be recreated after expand', function(assert) {
    // arrange
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 }
        ];
        const dataSource = createDataSource(array);

        const nodesInitialized = sinon.stub();

        this.applyOptions({
            onNodesInitialized: nodesInitialized
        });

        this.dataController.setDataSource(dataSource);

        dataSource.load();
        const rootNode = this.getRootNode();

        // act
        this.expandRow(2);

        // assert
        assert.strictEqual(nodesInitialized.callCount, 1, 'nodesInitialized called once on first load');
        assert.strictEqual(this.getRootNode(), rootNode, 'root node is not changed');
    });

    // T635433
    QUnit.test('sorting should not be reapplied after expand', function(assert) {
    // arrange
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category2', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category1', phone: '98-75-21', id: 2, parentId: 0 }
        ];
        const dataSource = createDataSource(array);

        this.dataController.setDataSource(dataSource);

        dataSource.load();

        let calculateSortValueCalled = false;

        this.columnOption('name', 'calculateSortValue', function(data) {
            calculateSortValueCalled = true;
            return data.name;
        });

        // act
        this.columnOption('name', 'sortOrder', 'asc');

        // assert
        assert.ok(calculateSortValueCalled, 'sorting is applied');


        // act
        calculateSortValueCalled = false;
        this.expandRow(2);

        // assert
        assert.notOk(calculateSortValueCalled, 'sorting is not reapplied');
        assert.equal(this.getVisibleRows()[0].data.name, 'Category1', 'rows are sorted');
    });

    QUnit.test('nodes should be recreated after change sorting', function(assert) {
    // arrange
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 }
        ];
        const dataSource = createDataSource(array);

        const nodesInitialized = sinon.stub();

        this.applyOptions({
            onNodesInitialized: nodesInitialized
        });

        this.dataController.setDataSource(dataSource);

        dataSource.load();
        const rootNode = this.getRootNode();

        // act
        dataSource.sort({ selector: 'name', desc: false });
        dataSource.load();

        // assert
        assert.strictEqual(nodesInitialized.callCount, 2, 'nodesInitialized called after change sorting');
        assert.notStrictEqual(this.getRootNode(), rootNode, 'root node is changed');
    });

    QUnit.test('Initialize from dataSource with hierarchical structure', function(assert) {
        // arrange
        const array = [
            { name: 'Category1', phone: '55-55-55' },
            { name: 'Category2', phone: '98-75-21', items: [
                { name: 'SubCategory1', phone: '55-66-77' },
                { name: 'SubCategory2', phone: '56-76-79' }]
            }
        ];
        const dataSource = createDataSource(array);

        this.applyOptions({
            itemsExpr: 'items',
            dataStructure: 'tree'
        });
        this.dataController.setDataSource(dataSource);

        // act
        dataSource.load();

        // TODO: remove when implemented expandedRowKeys
        this.expandRow(2);

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 4, 'count items');

        assert.equal(items[0].key, 1, 'key of first item');
        assert.deepEqual(items[0].data, { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 }, 'data of first item');
        assert.equal(items[0].level, 0, 'level of first item');

        assert.equal(items[1].key, 2, 'key of second item');
        assert.deepEqual(items[1].data, { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 }, 'data of second item');
        assert.equal(items[1].level, 0, 'level of second item');

        assert.equal(items[2].key, 3, 'key of third item');
        assert.deepEqual(items[2].data, { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 }, 'data of third item');
        assert.equal(items[2].level, 1, 'level of third item');
        assert.equal(items[2].node.parent.key, items[1].key, 'third item has parentKey');

        assert.equal(items[3].key, 4, 'key of fourth item');
        assert.deepEqual(items[3].data, { name: 'SubCategory2', phone: '56-76-79', id: 4, parentId: 2 }, 'data of fourth item');
        assert.equal(items[3].level, 1, 'level of fourth item');
        assert.equal(items[3].node.parent.key, items[1].key, 'fourth item has parentKey');
    });

    QUnit.test('Initialize from dataSource with hierarchical structure when \'keyExpr\' option is specified', function(assert) {
        // arrange
        const array = [
            { name: 'Category1', phone: '55-55-55', key: 'key1' },
            { name: 'Category2', phone: '98-75-21', key: 'key2', items: [
                { name: 'SubCategory1', phone: '55-66-77', key: 'key3' },
                { name: 'SubCategory2', phone: '56-76-79', key: 'key4' }]
            }
        ];
        const dataSource = createDataSource(array);

        this.applyOptions({
            itemsExpr: 'items',
            dataStructure: 'tree',
            keyExpr: 'key'
        });
        this.dataController.setDataSource(dataSource);

        // act
        dataSource.load();

        // TODO: remove when implemented expandedRowKeys
        this.expandRow('key2');

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 4, 'count items');

        assert.equal(items[0].key, 'key1', 'key of first item');
        assert.deepEqual(items[0].data, { name: 'Category1', phone: '55-55-55', key: 'key1', parentId: 0 }, 'data of first item');
        assert.equal(items[0].level, 0, 'level of first item');

        assert.equal(items[1].key, 'key2', 'key of second item');
        assert.deepEqual(items[1].data, { name: 'Category2', phone: '98-75-21', key: 'key2', parentId: 0 }, 'data of second item');
        assert.equal(items[1].level, 0, 'level of second item');

        assert.equal(items[2].key, 'key3', 'key of third item');
        assert.deepEqual(items[2].data, { name: 'SubCategory1', phone: '55-66-77', key: 'key3', parentId: 'key2' }, 'data of third item');
        assert.equal(items[2].level, 1, 'level of third item');
        assert.equal(items[2].node.parent.key, items[1].key, 'third item has parentKey');

        assert.equal(items[3].key, 'key4', 'key of fourth item');
        assert.deepEqual(items[3].data, { name: 'SubCategory2', phone: '56-76-79', key: 'key4', parentId: 'key2' }, 'data of fourth item');
        assert.equal(items[3].level, 1, 'level of fourth item');
        assert.equal(items[3].node.parent.key, items[1].key, 'fourth item has parentKey');
    });

    QUnit.test('Initialize from dataSource when there is key of store (without the specified \'keyEpxr\' option)', function(assert) {
    // arrange
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'Category2', phone: '98-75-21', id: 2 }
        ];
        const dataSource = createDataSource(array, { key: 'id' });

        this.applyOptions({ keyExpr: null });
        this.dataController.setDataSource(dataSource);

        // act
        dataSource.load();

        // TODO: remove when implemented expandAllEnabled
        this.expandRow(2);

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');

        assert.equal(items[0].key, 1, 'key of first item');
        assert.equal(items[0].node.children.length, 0, 'count children of first item');
        assert.notOk(items[0].node.parent.key, 'first item hasn\'t parentKey');

        assert.equal(items[1].key, 2, 'key of second item');
        assert.equal(items[1].node.children.length, 1, 'count children of second item');
        assert.deepEqual(items[1].node.children[0], items[2].node, 'child of second item');
        assert.notOk(items[1].node.parent.key, 'second item hasn\'t parentKey');

        assert.equal(items[2].key, 3, 'key of second item');
        assert.equal(items[2].node.children.length, 0, 'count children of third item');
        assert.equal(items[2].node.parent.key, items[1].key, 'third item has parentKey');
    });

    QUnit.test('Checking key of store when dataSource as array', function(assert) {
    // arrange
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'Category2', phone: '98-75-21', id: 2 }
        ];

        // act
        this.applyOptions({ dataSource: array });

        // assert
        const dataSource = this.getDataSource();
        assert.equal(dataSource.store().key(), 'id', 'key of store');
    });

    QUnit.test('Exception when key of store not equal \'keyExpr\' option value', function(assert) {
    // arrange
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'Category2', phone: '98-75-21', id: 2 }
        ];
        const dataSource = createDataSource(array, { key: 'name' });

        // act, assert
        try {
            this.dataController.setDataSource(dataSource);
            assert.ok(false, 'exception should be rised');
        } catch(e) {
            assert.ok(e.message.indexOf('E1044') >= 0, 'name of error');
        }
    });

    QUnit.test('Error on loading when key is not specified in data', function(assert) {
    // arrange
        const dataErrors = [];
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'Category2', phone: '98-75-21', id: 2 }
        ];
        const dataSource = createDataSource(array);

        this.applyOptions({
            keyExpr: 'key'
        });
        this.dataController.setDataSource(dataSource);
        this.dataController.dataErrorOccurred.add(function(e) {
            dataErrors.push(e);
        });

        // act
        dataSource.load();

        // assert
        assert.equal(dataErrors.length, 1, 'count error');
        assert.equal(dataErrors[0].__id, 'E1046', 'error id');
    });

    QUnit.test('Update items', function(assert) {
    // arrange
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'Category2', phone: '98-75-21', id: 2 }
        ];
        const dataSource = createDataSource(array);

        this.dataController.setDataSource(dataSource);
        dataSource.load();
        this.expandRow(2); // TODO: remove when implemented expandAllEnabled

        // act
        this.dataController.updateItems();

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');
    });

    QUnit.test('Initialize from dataSource with plain structure when virtual scrolling enabled', function(assert) {

        // arrange
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 5, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 },
            { name: 'Category3', phone: '98-75-22', id: 3, parentId: 0 },
            { name: 'Category4', phone: '98-75-23', id: 4, parentId: 0 }
        ];
        const dataSource = createDataSource(array, {}, { pageSize: 3 });

        // act
        this.applyOptions({
            scrolling: {
                mode: 'virtual',
                preventPreload: true
            },
            dataSource: dataSource
        });

        // assert
        assert.equal(this.dataController.totalItemsCount(), 4, 'totalItemsCount');
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');

        assert.equal(items[0].key, 1, 'key of first item');
        assert.equal(items[1].key, 2, 'key of second item');
        assert.equal(items[2].key, 3, 'key of third item');
    });

    QUnit.test('Initialize when remoteOperations and virtual scrolling are enabled and two pages are loaded', function(assert) {
    // arrange
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 5, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 },
            { name: 'Category3', phone: '98-75-22', id: 3, parentId: 0 },
            { name: 'Category4', phone: '98-75-23', id: 4, parentId: 0 }
        ];
        const dataSource = createDataSource(array, {}, { pageSize: 2 });

        // act
        this.applyOptions({
            scrolling: {
                mode: 'virtual'
            },
            remoteOperations: { filtering: true },
            autoExpandAll: true,
            dataSource: dataSource
        });

        // assert
        assert.equal(this.dataController.totalItemsCount(), 5, 'totalItemsCount');
        assert.equal(this.getVisibleRows().length, 2, 'row count');
        assert.strictEqual(this.getVisibleRows()[0].node, this.getNodeByKey(1), 'first node instance is correct');
    });

    QUnit.test('Expand node when virtual scrolling enabled', function(assert) {
    // arrange
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 5, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 },
            { name: 'Category3', phone: '98-75-22', id: 3, parentId: 0 },
            { name: 'Category4', phone: '98-75-23', id: 4, parentId: 0 }
        ];
        const dataSource = createDataSource(array, {}, { pageSize: 3 });

        this.applyOptions({
            scrolling: {
                mode: 'virtual',
                preventPreload: true
            },
            dataSource: dataSource
        });

        // act
        this.expandRow(2);

        // assert
        assert.equal(this.dataController.totalItemsCount(), 5, 'totalItemsCount');
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');

        assert.equal(items[0].key, 1, 'key of first item');
        assert.equal(items[1].key, 2, 'key of second item');
        assert.equal(items[2].key, 5, 'key of third item');
    });

    QUnit.test('Get total items count', function(assert) {
    // arrange
        this.applyOptions({
            dataSource: [
                { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
                { name: 'SubCategory1', phone: '35-35-35', id: 2, parentId: 1 },
                { name: 'SubCategory2', phone: '45-45-45', id: 3, parentId: 1 }
            ]
        });

        // act
        this.dataController.load();

        // assert
        assert.equal(this.dataController.totalItemsCount(), 1, 'count visible items');
        assert.equal(this.dataController.totalCount(), 3, 'count all items');
    });

    QUnit.test('Getting key when there are keyExpr and store hasn\'t key', function(assert) {
    // arrange
        const array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'Category2', phone: '98-75-21', id: 2 }
        ];

        // act
        this.applyOptions({
            dataSource: {
                load: function() {
                    return $.Deferred().resolve(array);
                }
            }
        });

        // assert
        assert.equal(this.getDataSource().store().key(), undefined, 'store hasn\'t key');
        assert.equal(this.keyOf(array[0]), 3, 'key of first item');
    });

    // T511779
    QUnit.test('The expandRowKeys should be not changed when loading data when there is a filter', function(assert) {
    // arrange
        const that = this;
        let expandedRowKeys = [];

        // act
        that.applyOptions({
            dataSource: {
                store: {
                    type: 'array',
                    data: [
                        { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
                        { name: 'SubCategory1', phone: '55-55-55', id: 2, parentId: 1 },
                        { name: 'Category2', phone: '98-75-21', id: 3, parentId: 0 },
                        { name: 'SubCategory2', phone: '55-66-77', id: 4, parentId: 3 },
                    ],
                    onLoading: function() {
                        expandedRowKeys = that.option('expandedRowKeys').slice(0);
                    }
                },
                filter: ['name', '=', 'SubCategory2']
            },
            expandNodesOnFiltering: true,
            expandedRowKeys: [1]
        });

        // assert
        assert.deepEqual(expandedRowKeys, [1], 'expandedRowKeys value when data isn\'t loaded');
        assert.deepEqual(that.option('expandedRowKeys'), [3], 'expandedRowKeys value when data is loaded');
    });

    QUnit.test('TreeList should not throw exception on filtering if focused row is not in filter condition (T724482)', function(assert) {
    // arrange
        const clock = sinon.useFakeTimers();
        this.applyOptions({
            remoteOperations: true,
            dataSource: [
                { id: 1, parentId: 0 },
                { id: 2, parentId: 1 },
                { id: 3, parentId: 0 },
                { id: 4, parentId: 3 }
            ],
            parentIdExpr: 'parentId',
            keyExpr: 'id',
            expandNodesOnFiltering: true,
            focusedRowEnabled: true,
            focusedRowKey: 4,
            loadPanel: {
                enabled: true
            }
        });

        // act, assert
        try {
            this.getDataSource().filter(['id', '=', 2]);
            this.getDataSource().load();
            clock.tick(10);
        } catch(e) {
            assert.ok(false, e);
        }
        // assert
        assert.notOk(this.dataController.isLoading(), 'Is loading');
        assert.equal(this.dataController.getVisibleRows().length, 2, 'Visible rows count');
        clock.restore();
    });

    QUnit.test('Get node by key', function(assert) {
    // arrange

        this.applyOptions({
            dataSource: [
                { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
                { name: 'SubCategory1', phone: '35-35-35', id: 2, parentId: 1 },
                { name: 'SubCategory2', phone: '45-45-45', id: 3, parentId: 1 }
            ]
        });

        // act
        this.dataController.load();

        // assert
        const rows = this.getVisibleRows();
        const node = this.getNodeByKey(1);
        assert.equal(rows.length, 1, 'count row');
        assert.strictEqual(node, rows[0].node, 'equal to the node of a first row');
        assert.deepEqual(node.data, { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 }, 'node by key is \'1\'');
    });

    QUnit.test('Get node by key when node is hidden', function(assert) {
    // arrange

        this.applyOptions({
            dataSource: [
                { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
                { name: 'SubCategory1', phone: '35-35-35', id: 2, parentId: 1 },
                { name: 'SubCategory2', phone: '45-45-45', id: 3, parentId: 1 }
            ]
        });

        // act
        this.dataController.load();

        // assert
        const rows = this.getVisibleRows();
        const node = this.getNodeByKey(3);
        assert.equal(rows.length, 1, 'count row');
        assert.notStrictEqual(node, rows[0].node, 'not equal to the node of a first row');
        assert.deepEqual(node.data, { name: 'SubCategory2', phone: '45-45-45', id: 3, parentId: 1 }, 'node by key is \'3\'');
    });

    QUnit.test('There are no exceptions on getting node when hasn\'t datasource', function(assert) {
    // arrange
        this.dataController.setDataSource(undefined);

        // act, assert
        assert.equal(this.getNodeByKey(1), undefined, 'no exceptions');
    });

    QUnit.test('Call forEachNode method when the first parameter as the array of nodes', function(assert) {
    // arrange
        const array = [
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 },
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 }
        ];
        const dataSource = createDataSource(array);
        const spy = sinon.spy();

        this.dataController.setDataSource(dataSource);
        dataSource.load();
        const rootNode = this.dataController.getRootNode();

        // act
        this.dataController.forEachNode(rootNode.children, spy);

        // assert
        assert.strictEqual(spy.callCount, 3);
        assert.deepEqual(spy.getCall(0).args[0], this.dataController.getNodeByKey(1));
        assert.deepEqual(spy.getCall(1).args[0], this.dataController.getNodeByKey(2));
        assert.deepEqual(spy.getCall(2).args[0], this.dataController.getNodeByKey(3));
    });

    QUnit.test('Call forEachNode method when the first parameter as node', function(assert) {
    // arrange
        const array = [
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 },
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 }
        ];
        const dataSource = createDataSource(array);
        const spy = sinon.spy();

        this.dataController.setDataSource(dataSource);
        dataSource.load();
        const rootNode = this.dataController.getRootNode();

        // act
        this.dataController.forEachNode(rootNode, spy);

        // assert
        assert.strictEqual(spy.callCount, 4);
        assert.deepEqual(spy.getCall(0).args[0], rootNode);
        assert.deepEqual(spy.getCall(1).args[0], this.dataController.getNodeByKey(1));
        assert.deepEqual(spy.getCall(2).args[0], this.dataController.getNodeByKey(2));
        assert.deepEqual(spy.getCall(3).args[0], this.dataController.getNodeByKey(3));
    });

    QUnit.test('Call forEachNode method with one parameter', function(assert) {
    // arrange
        const array = [
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 },
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 }
        ];
        const dataSource = createDataSource(array);
        const spy = sinon.spy();

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // act
        this.dataController.forEachNode(spy);

        // assert
        assert.strictEqual(spy.callCount, 3);
        assert.deepEqual(spy.getCall(0).args[0], this.dataController.getNodeByKey(1));
        assert.deepEqual(spy.getCall(1).args[0], this.dataController.getNodeByKey(2));
        assert.deepEqual(spy.getCall(2).args[0], this.dataController.getNodeByKey(3));
    });

    // T621620
    QUnit.test('Initialize from dataSource with hierarchical structure when \'parentIdExpr\' option is specified', function(assert) {
        // arrange
        const array = [
            { name: 'Category1', phone: '55-55-55', key: 'key1' },
            { name: 'Category2', phone: '98-75-21', key: 'key2', parentId: 'key1', items: [
                { name: 'SubCategory1', phone: '55-66-77', key: 'key3', parentId: 'key2' },
                { name: 'SubCategory2', phone: '56-76-79', key: 'key4', parentId: 'key2' }]
            }
        ];
        const dataSource = createDataSource(array);

        this.applyOptions({
            itemsExpr: 'items',
            dataStructure: 'tree',
            keyExpr: 'key',
            parentIdExpr: 'parentId',
            expandedRowKeys: ['key2']
        });
        this.dataController.setDataSource(dataSource);

        // act
        dataSource.load();

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 4, 'count items');

        assert.equal(items[0].key, 'key1', 'key of first item');
        assert.deepEqual(items[0].data, { name: 'Category1', phone: '55-55-55', key: 'key1', parentId: 0 }, 'data of first item');
        assert.equal(items[0].level, 0, 'level of first item');

        assert.equal(items[1].key, 'key2', 'key of second item');
        assert.deepEqual(items[1].data, { name: 'Category2', phone: '98-75-21', key: 'key2', parentId: 0 }, 'data of second item');
        assert.equal(items[1].level, 0, 'level of second item');

        assert.equal(items[2].key, 'key3', 'key of third item');
        assert.deepEqual(items[2].data, { name: 'SubCategory1', phone: '55-66-77', key: 'key3', parentId: 'key2' }, 'data of third item');
        assert.equal(items[2].level, 1, 'level of third item');
        assert.equal(items[2].node.parent.key, items[1].key, 'third item has parentKey');

        assert.equal(items[3].key, 'key4', 'key of fourth item');
        assert.deepEqual(items[3].data, { name: 'SubCategory2', phone: '56-76-79', key: 'key4', parentId: 'key2' }, 'data of fourth item');
        assert.equal(items[3].level, 1, 'level of fourth item');
        assert.equal(items[3].node.parent.key, items[1].key, 'fourth item has parentKey');
    });

    // T622381
    QUnit.test('Nodes should be expanded after refresh method is called at boot time (when autoExpandAll is true)', function(assert) {
    // arrange
        const array = [
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'SubCategory1', phone: '98-75-21', id: 2, parentId: 1 },
            { name: 'SubCategory2', phone: '55-66-77', id: 3, parentId: 2 },
        ];
        const clock = sinon.useFakeTimers();

        try {
            this.applyOptions({ autoExpandAll: true, dataSource: array, loadingTimeout: 30 });

            // act
            this.refresh();
            clock.tick(60);

            // assert
            const items = this.dataController.items();
            assert.strictEqual(items.length, 3, 'item count');
        } finally {
            clock.restore();
        }
    });

    // T713250
    QUnit.test('Initialize when data as classes with a hierarchical structure', function(assert) {
    // arrange
        function Person(id, items) {
            this._id = id;
            this._items = items;
        }
        Object.defineProperty(Person.prototype, 'ID', {
            configurable: true,
            enumerable: false,
            get: function() { return this._id; },
            set: function(value) { this._id = value; }
        });
        Object.defineProperty(Person.prototype, 'items', {
            configurable: true,
            enumerable: false,
            get: function() { return this._items; },
            set: function(value) { this._items = value; }
        });

        const dataSource = [
            new Person(1, [
                new Person(2, [
                    new Person(3),
                    new Person(4),
                    new Person(5),
                ])
            ])
        ];

        // act
        this.applyOptions({
            autoExpandAll: true,
            dataSource: dataSource,
            dataStructure: 'tree',
            keyExpr: 'ID',
            itemsExpr: 'items'
        });

        // assert
        const rows = this.getVisibleRows();
        assert.strictEqual(rows.length, 5, 'row count');

        assert.strictEqual(rows[0].node.key, 1, 'key of the first node');
        assert.strictEqual(rows[0].node.level, 0, 'level of the first node');

        assert.strictEqual(rows[1].node.key, 2, 'key of the second node');
        assert.strictEqual(rows[1].node.level, 1, 'level of the second node');

        assert.strictEqual(rows[2].node.key, 3, 'key of the third node');
        assert.strictEqual(rows[2].node.level, 2, 'level of the third node');

        assert.strictEqual(rows[3].node.key, 4, 'key of the fourth node');
        assert.strictEqual(rows[3].node.level, 2, 'level of the fourth node');

        assert.strictEqual(rows[4].node.key, 5, 'key of the fifth node');
        assert.strictEqual(rows[4].node.level, 2, 'level of the fifth node');
    });
});

QUnit.module('Expand/Collapse nodes', { beforeEach: setupModule, afterEach: teardownModule }, () => {

    QUnit.test('Expand node (plain structure)', function(assert) {
    // arrange
        let items;
        const array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ];
        const dataSource = createDataSource(array);

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // assert
        items = this.dataController.items();
        assert.equal(items.length, 1, 'count items');
        assert.notOk(items[0].isExpanded, 'first item is collapsed');

        // act
        this.expandRow(1);

        // assert
        items = this.dataController.items();
        assert.equal(items.length, 2, 'count items');
        assert.ok(items[0].isExpanded, 'first item is expanded');
    });

    QUnit.test('Expand expanded node (plain structure)', function(assert) {
    // arrange
        const array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ];
        const dataSource = createDataSource(array);

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        this.expandRow(1);

        // act
        this.expandRow(1);

        // assert
        const items = this.dataController.items();
        assert.ok(this.isRowExpanded(1), 'row is expanded');
        assert.equal(items.length, 2, 'count items');
        assert.ok(items[0].isExpanded, 'first item is expanded');
    });

    QUnit.test('Collapse node (plain structure)', function(assert) {
    // arrange
        let items;
        const array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ];
        const dataSource = createDataSource(array);

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // assert
        items = this.dataController.items();
        assert.equal(items.length, 1, 'count items');
        assert.notOk(items[0].isExpanded, 'first item is collapsed');

        // arrange
        this.expandRow(1);

        // assert
        items = this.dataController.items();
        assert.equal(items.length, 2, 'count items');
        assert.ok(items[0].isExpanded, 'first item is expanded');

        // act
        this.collapseRow(1);

        // assert
        items = this.dataController.items();
        assert.equal(items.length, 1, 'count items');
        assert.notOk(items[0].isExpanded, 'first item is collapsed');
    });

    QUnit.test('Set expanded nodes by expandedRowKeys - first level', function(assert) {
    // arrange
        const array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ];
        const dataSource = createDataSource(array);

        this.applyOptions({ expandedRowKeys: [1] });
        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 2, 'count items');
        assert.ok(items[0].isExpanded, 'first item is expanded');
    });

    QUnit.test('Set expanded nodes by expandedRowKeys - internal level', function(assert) {
    // arrange
        let items;
        const array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 },
            { name: 'SubCategory1-1', phone: '55-66-77', id: 3, parentId: 2 }
        ];
        const dataSource = createDataSource(array);

        this.applyOptions({ expandedRowKeys: [2] });
        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // assert
        items = this.dataController.items();
        assert.equal(items.length, 1, 'count items');
        assert.notOk(items[0].isExpanded, 'first item is collapsed');

        // act
        this.expandRow(1);

        // assert
        items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');
        assert.ok(items[0].isExpanded, 'first item is expanded');
    });

    QUnit.test('Update expandedRowKeys', function(assert) {
    // arrange
        const array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ];
        const dataSource = createDataSource(array);

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        let expandedRowKeys = this.dataController.option('expandedRowKeys');

        // act
        this.expandRow(1);

        // assert
        assert.equal(this.dataController.option('expandedRowKeys').length, 1, 'count of expanded items');
        assert.equal(this.dataController.option('expandedRowKeys')[0], 1, 'first item is expanded');
        assert.notStrictEqual(this.dataController.option('expandedRowKeys'), expandedRowKeys, 'expandedRowKeys has a different instance');

        // arrange
        expandedRowKeys = this.dataController.option('expandedRowKeys');

        // act
        this.collapseRow(1);

        // assert
        assert.notOk(this.dataController.option('expandedRowKeys').length, 'count of expanded items');
        assert.notStrictEqual(this.dataController.option('expandedRowKeys'), expandedRowKeys, 'expandedRowKeys has a different instance');
    });

    QUnit.test('Expand/collapse events', function(assert) {
    // arrange
        const that = this;
        let events = [];
        const options = [];
        const array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ];
        const dataSource = createDataSource(array);

        $.each(['onRowExpanding', 'onRowExpanded', 'onRowCollapsing', 'onRowCollapsed'], function(index, name) {
            options[name] = function(e) {
                events.push({ name: name, key: e.key });
            };
        });
        that.applyOptions(options);
        that.dataController.setDataSource(dataSource);
        dataSource.load();

        // act
        that.expandRow(1);

        // assert
        let items = that.dataController.items();
        assert.strictEqual(items.length, 2, 'count item');
        assert.deepEqual(events, [
            { name: 'onRowExpanding', key: 1 },
            { name: 'onRowExpanded', key: 1 }
        ], 'expand events');

        // arrange
        events = [];

        // act
        that.collapseRow(1);

        // assert
        items = that.dataController.items();
        assert.strictEqual(items.length, 1);
        assert.deepEqual(events, [
            { name: 'onRowCollapsing', key: 1 },
            { name: 'onRowCollapsed', key: 1 }
        ], 'collapse events');
    });

    QUnit.test('Cancel expand row on an expanding event', function(assert) {
    // arrange
        const that = this;
        const array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ];
        const dataSource = createDataSource(array);

        that.applyOptions({
            onRowExpanding: function(e) {
                e.cancel = true;
            }
        });
        that.dataController.setDataSource(dataSource);
        dataSource.load();

        // act
        that.expandRow(1);

        // assert
        const items = that.dataController.items();
        assert.equal(items.length, 1, 'count item');
    });

    QUnit.test('Cancel collapse row on a collapsing event', function(assert) {
    // arrange
        const that = this;
        const array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ];
        const dataSource = createDataSource(array);

        that.applyOptions({
            onRowCollapsing: function(e) {
                e.cancel = true;
            }
        });
        that.dataController.setDataSource(dataSource);
        dataSource.load();
        that.expandRow(1);

        // assert
        let items = that.dataController.items();
        assert.equal(items.length, 2, 'count item');

        // act
        that.collapseRow(1);

        // assert
        items = that.dataController.items();
        assert.equal(items.length, 2, 'count item');
    });

    // T819031
    QUnit.test('All nested children should be loaded when expanding nodes with expandRow method', function(assert) {
        // arrange
        const clock = sinon.useFakeTimers();

        const loadSpy = sinon.spy((loadOptions) => {
            let result = [];

            loadOptions.parentIds.forEach(function(parentId) {
                const items = itemsByParentId[parentId];

                if(items) {
                    result = result.concat(items);
                }
            });

            return result;
        });

        const itemsByParentId = {
            '0': [{ id: 1, parentId: 0, name: 'Name 1' }],
            '1': [{ id: 2, parentId: 1, name: 'Name 2' }],
            '2': [{ id: 3, parentId: 2, name: 'Name 3' }],
            '3': [{ id: 4, parentId: 3, name: 'Name 4' }]
        };

        this.applyOptions({
            loadingTimeout: 30,
            remoteOperations: { filtering: true },
            dataSource: {
                load: loadSpy
            }
        });
        clock.tick(30);
        loadSpy.resetHistory();

        // act
        this.expandRow(1);
        this.expandRow(2);
        this.expandRow(3);
        clock.tick(30);

        // assert
        const rows = this.getVisibleRows();
        assert.strictEqual(loadSpy.callCount, 1, 'load call count');
        assert.deepEqual(loadSpy.getCall(0).args[0].parentIds, [1, 2, 3], 'load arg - parentIds');
        assert.strictEqual(rows.length, 4, 'row count');
        assert.strictEqual(rows[0].data.id, 1, 'first node');
        assert.strictEqual(rows[1].data.id, 2, 'second node');
        assert.strictEqual(rows[2].data.id, 3, 'third node');
        assert.strictEqual(rows[3].data.id, 4, 'fourth node');

        clock.restore();
    });
});

QUnit.module('Sorting', { beforeEach: function() {
    this.items = [
        { id: 1, parentId: 0, name: 'Name 3', age: 19 },
        { id: 2, parentId: 0, name: 'Name 1', age: 19 },
        { id: 3, parentId: 0, name: 'Name 2', age: 18 },
        { id: 4, parentId: 1, name: 'Name 6', age: 16 },
        { id: 5, parentId: 1, name: 'Name 5', age: 15 },
        { id: 6, parentId: 1, name: 'Name 4', age: 15 }
    ];
    this.setupTreeList = function(options) {
        if(!('loadingTimeout' in options)) {
            options.loadingTimeout = null;
        }
        setupTreeListModules(this, ['data', 'columns', 'sorting', 'filterRow'], {
            initDefaultOptions: true,
            options: options
        });
    };
}, afterEach: teardownModule }, () => {

    QUnit.test('Initial sorting should be applied', function(assert) {
    // act
        this.setupTreeList({
            dataSource: this.items,
            columns: [{ dataField: 'name', sortOrder: 'asc' }, { dataField: 'age' }]
        });

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');
        assert.equal(items[0].data.name, 'Name 1', 'item 0 name value');
        assert.equal(items[1].data.name, 'Name 2', 'item 1 name value');
        assert.equal(items[2].data.name, 'Name 3', 'item 2 name value');
    });

    QUnit.test('Initial sorting by several columns should be applied', function(assert) {
    // act
        this.setupTreeList({
            dataSource: this.items,
            columns: [{ dataField: 'name', sortOrder: 'asc', sortIndex: 1 }, { dataField: 'age', sortOrder: 'asc', sortIndex: 0 }]
        });

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');
        assert.equal(items[0].data.age, 18, 'item 0 age value');
        assert.equal(items[0].data.name, 'Name 2', 'item 0 name value');
        assert.equal(items[1].data.age, 19, 'item 0 age value');
        assert.equal(items[1].data.name, 'Name 1', 'item 1 name value');
        assert.equal(items[2].data.age, 19, 'item 0 age value');
        assert.equal(items[2].data.name, 'Name 3', 'item 2 name value');
    });

    QUnit.test('Initial sorting for second level should be applied', function(assert) {
        this.setupTreeList({
            dataSource: this.items,
            columns: [{ dataField: 'name', sortOrder: 'asc' }, { dataField: 'age' }]
        });

        // act
        this.expandRow(1);

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 6, 'count items');
        assert.equal(items[3].data.name, 'Name 4', 'item 3 name value');
        assert.equal(items[4].data.name, 'Name 5', 'item 4 name value');
        assert.equal(items[5].data.name, 'Name 6', 'item 5 name value');
    });

    QUnit.test('sortOrder changing by columnOption should be applied', function(assert) {
        this.setupTreeList({
            dataSource: this.items
        });

        // act
        this.columnOption('name', 'sortOrder', 'desc');

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');
        assert.equal(items[0].data.name, 'Name 3', 'item 0 name value');
        assert.equal(items[1].data.name, 'Name 2', 'item 1 name value');
        assert.equal(items[2].data.name, 'Name 1', 'item 2 name value');
    });

    QUnit.test('Sorting when there is filter', function(assert) {
    // arrange
        this.setupTreeList({
            dataSource: this.items,
            columns: [{ dataField: 'name' }, { dataField: 'age', filterValue: '19' }]
        });

        // assert
        let items = this.dataController.items();
        assert.equal(items.length, 2, 'count items');
        assert.equal(items[0].data.name, 'Name 3', 'item 0 name value');
        assert.equal(items[1].data.name, 'Name 1', 'item 1 name value');

        // act
        this.columnOption('name', 'sortOrder', 'asc');

        // assert
        items = this.dataController.items();
        assert.equal(items.length, 2, 'count items');
        assert.equal(items[0].data.name, 'Name 1', 'item 0 name value');
        assert.equal(items[1].data.name, 'Name 3', 'item 1 name value');
    });
});

QUnit.module('Remote Operations', { beforeEach: function() {
    this.items = [
        { id: 1, parentId: 0, name: 'Name 3', age: 19 },
        { id: 2, parentId: 0, name: 'Name 1', age: 19 },
        { id: 3, parentId: 0, name: 'Name 2', age: 18 },
        { id: 4, parentId: 1, name: 'Name 6', age: 16 },
        { id: 5, parentId: 1, name: 'Name 5', age: 15 },
        { id: 6, parentId: 2, name: 'Name 4', age: 15 },
        { id: 7, parentId: 5, name: 'Name 7', age: 19 }
    ];
    this.setupTreeList = function(options) {
        if(!('loadingTimeout' in options)) {
            options.loadingTimeout = null;
        }
        if(!('remoteOperations' in options)) {
            options.remoteOperations = true;
        }
        setupTreeListModules(this, ['data', 'columns', 'sorting'], {
            initDefaultOptions: true,
            options: options
        });
    };
    this.clock = sinon.useFakeTimers();
}, afterEach: teardownModule }, () => {

    QUnit.test('Initial load with sorting', function(assert) {
    // arrange, act
        const loadingArgs = [];

        this.setupTreeList({
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items,
                    onLoading: function(e) {
                        loadingArgs.push(e);
                    }
                }
            },
            columns: [{ dataField: 'name', sortOrder: 'asc' }, { dataField: 'age' }]
        });

        // assert
        assert.deepEqual(loadingArgs, [
            {
                filter: ['parentId', '=', 0],
                group: null,
                sort: [
                    {
                        desc: false,
                        selector: 'name'
                    }
                ],
                parentIds: [0],
                userData: {}
            }
        ], 'loading arguments');

        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');
        assert.equal(items[0].data.name, 'Name 1', 'item 0 name value');
        assert.equal(items[1].data.name, 'Name 2', 'item 1 name value');
        assert.equal(items[2].data.name, 'Name 3', 'item 2 name value');
    });

    QUnit.test('Initial load with second level expanded key when loading data on demand', function(assert) {
    // arrange, act
        const loadingArgs = [];

        const itemsByParentId = {
            '0': [{ id: 1, parentId: 0, name: 'Name 1' }],
            '1': [{ id: 2, parentId: 1, name: 'Name 2' }],
            '2': [{ id: 3, parentId: 2, name: 'Name 3' }]
        };

        this.setupTreeList({
            expandedRowKeys: [2],
            remoteOperations: { filtering: true },
            dataSource: {
                load: function(loadOptions) {
                    loadingArgs.push(loadOptions);
                    let result = [];
                    loadOptions.parentIds.forEach(function(parentId) {
                        const items = itemsByParentId[parentId];
                        if(items) {
                            result = result.concat(items);
                        }
                    });

                    return result;
                },
                useDefaultSearch: true
            }
        });

        // assert
        assert.deepEqual(loadingArgs, [{
            filter: [['parentId', '=', 0], 'or', ['parentId', '=', 2]],
            parentIds: [0, 2],
            userData: {}
        }], 'loading arguments');

        const items = this.dataController.items();
        assert.equal(items.length, 1, 'count items');
        assert.equal(items[0].data.name, 'Name 1', 'item 0 name value');
    });

    QUnit.test('Change sort order if sorting is local', function(assert) {
    // arrange, act
        let loadingArgs = [];

        this.setupTreeList({
            remoteOperations: {
                filtering: true
            },
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items,
                    onLoading: function(e) {
                        loadingArgs.push(e);
                    }
                }
            },
            columns: [{ dataField: 'name', sortOrder: 'asc' }, { dataField: 'age' }]
        });

        loadingArgs = [];

        // act
        this.columnOption('name', 'sortOrder', 'desc');

        // assert
        assert.deepEqual(loadingArgs, [], 'no loadings during local sorting');

        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');
        assert.equal(items[0].data.name, 'Name 3', 'item 0 name value');
        assert.equal(items[1].data.name, 'Name 2', 'item 1 name value');
        assert.equal(items[2].data.name, 'Name 1', 'item 2 name value');
    });

    QUnit.test('Expand first row when there is sorting', function(assert) {
    // arrange
        let loadingArgs = [];

        this.setupTreeList({
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items,
                    onLoading: function(e) {
                        loadingArgs.push(e);
                    }
                }
            },
            columns: [{ dataField: 'name', sortOrder: 'asc' }, { dataField: 'age' }]
        });
        loadingArgs = [];

        // act
        this.expandRow(1);

        // assert
        assert.deepEqual(loadingArgs, [
            {
                filter: ['parentId', '=', 1],
                group: null,
                sort: [
                    {
                        desc: false,
                        selector: 'name'
                    }
                ],
                parentIds: [1],
                userData: {}
            }
        ], 'loading arguments');

        const items = this.dataController.items();
        assert.equal(items.length, 5, 'count items');
        assert.equal(items[0].data.name, 'Name 1', 'item 0 name value');
        assert.equal(items[1].data.name, 'Name 2', 'item 1 name value');
        assert.equal(items[2].data.name, 'Name 3', 'item 2 name value');
        assert.equal(items[3].data.name, 'Name 5', 'item 3 name value');
        assert.equal(items[4].data.name, 'Name 6', 'item 4 name value');
    });

    // T547036
    QUnit.test('Change sort order after collapse expanded row', function(assert) {
    // arrange
        this.setupTreeList({
            dataSource: this.items,
            columns: [{ dataField: 'name', sortOrder: 'asc' }, { dataField: 'age' }]
        });

        // act
        this.expandRow(1);
        this.collapseRow(1);
        this.columnOption('name', 'sortOrder', 'desc');
        this.expandRow(1);

        // assert

        const items = this.dataController.items();
        assert.equal(items.length, 5, 'count items');
        assert.equal(items[0].data.name, 'Name 3', 'item 0 name value');
        assert.equal(items[1].data.name, 'Name 6', 'item 1 name value');
        assert.equal(items[2].data.name, 'Name 5', 'item 2 name value');
        assert.equal(items[3].data.name, 'Name 2', 'item 3 name value');
        assert.equal(items[4].data.name, 'Name 1', 'item 4 name value');
    });

    QUnit.test('Initial load when autoExpandAll', function(assert) {
    // arrange, act
        const loadingArgs = [];

        this.setupTreeList({
            autoExpandAll: true,
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items,
                    onLoading: function(e) {
                        loadingArgs.push(e);
                    }
                }
            }
        });

        // assert
        assert.equal(this.option('expandedRowKeys').length, 3, 'expandedRowKeys is assigned');
        assert.deepEqual(loadingArgs, [
            {
                group: null,
                userData: {}
            }
        ], 'loading arguments');

        const items = this.dataController.items();
        assert.equal(items.length, 7, 'all items are visible');
        assert.equal(items[0].data.name, 'Name 3', 'item 1 name value');
        assert.equal(items[1].data.name, 'Name 6', 'item 2 name value');
        assert.equal(items[6].data.name, 'Name 2', 'item 7 name value');
    });

    QUnit.test('collapseRow when autoExpandAll', function(assert) {
    // arrange
        this.setupTreeList({
            autoExpandAll: true,
            dataSource: this.items
        });

        // act
        this.collapseRow(1);

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 4, 'all items are visible');
        assert.strictEqual(items[0].data.name, 'Name 3', 'item 1 name value');
        assert.strictEqual(items[0].isExpanded, false, 'item 1 is not expanded');
    });

    // T554475
    QUnit.test('refresh after collapseRow when autoExpandAll', function(assert) {
    // arrange
        this.setupTreeList({
            autoExpandAll: true,
            dataSource: this.items
        });

        this.collapseRow(1);

        // act
        this.refresh();

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 4, 'all items are visible');
        assert.strictEqual(items[0].data.name, 'Name 3', 'item 1 name value');
        assert.strictEqual(items[0].isExpanded, false, 'item 1 is not expanded');
    });

    QUnit.skip('Initial load when dataSource has filter and filterMode is standard', function(assert) {
    // arrange, act
        const loadingArgs = [];

        this.setupTreeList({
            filterMode: 'standard',
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items,
                    onLoading: function(e) {
                        loadingArgs.push(e);
                    }
                },
                filter: ['age', '=', 19]
            }
        });

        // assert
        assert.deepEqual(loadingArgs, [
            {
                filter: [['parentId', '=', 0], 'and', ['age', '=', 19]],
                group: null,
                sort: null,
                parentIds: [0],
                userData: {}
            }
        ], 'loading arguments');

        const items = this.dataController.items();
        assert.equal(items.length, 2, 'count items');
        assert.equal(items[0].data.name, 'Name 3', 'item 1 name value');
        assert.equal(items[1].data.name, 'Name 1', 'item 2 name value');
    });

    QUnit.test('Initial load when dataSource has filter and filterMode is withAncestors (default)', function(assert) {
    // arrange, act
        const loadingArgs = [];

        const arrayStore = new ArrayStore({
            data: this.items
        });

        this.setupTreeList({
            expandNodesOnFiltering: true,
            dataSource: {
                load: function(loadOptions) {
                    const d = $.Deferred();
                    loadingArgs.push(loadOptions);
                    setTimeout(function() {
                        arrayStore.load(loadOptions).done(function(data) {
                            d.resolve(data);
                        }).fail(d.reject);
                    }, 10);

                    return d;
                },
                useDefaultSearch: true,
                filter: ['age', '=', 19]
            }
        });

        this.clock.tick(10);
        this.clock.tick(10);

        // assert
        assert.equal(this.option('expandedRowKeys').length, 2, 'expandedRowKeys count');
        assert.deepEqual(loadingArgs, [{
            filter: ['age', '=', 19],
            group: null,
            sort: null,
            userData: {}
        }, {
            filter: ['id', '=', 5],
            group: null,
            sort: null,
            userData: {}
        }], 'loading arguments');

        const items = this.dataController.items();
        assert.equal(items.length, 4, 'count items');
        assert.equal(items[0].data.name, 'Name 3', 'item 1 name value');
        assert.equal(items[0].level, 0, 'item 1 level');
        assert.equal(items[1].data.name, 'Name 5', 'item 2 name value');
        assert.equal(items[1].level, 1, 'item 2 level');
        assert.equal(items[2].data.name, 'Name 7', 'item 3 name value');
        assert.equal(items[2].level, 2, 'item 3 level');
        assert.equal(items[3].data.name, 'Name 1', 'item 4 name value');
        assert.strictEqual(items[3].node.hasChildren, false, 'item 4 name hasChildren');
        assert.equal(items[3].node.children.length, 0, 'item 4 name children length');
        assert.equal(items[3].level, 0, 'item 4 level');
    });

    // T698573
    QUnit.test('Collapse node when dataSource has filter and filterMode is withAncestors (default)', function(assert) {
    // arrange, act
        let loadingArgs = [];

        const arrayStore = new ArrayStore({
            data: this.items
        });

        this.setupTreeList({
            expandNodesOnFiltering: true,
            hasItemsExpr: function() {
                return true;
            },
            dataSource: {
                load: function(loadOptions) {
                    const d = $.Deferred();
                    loadingArgs.push(loadOptions);
                    setTimeout(function() {
                        arrayStore.load(loadOptions).done(function(data) {
                            d.resolve(data);
                        }).fail(d.reject);
                    });

                    return d;
                },
                filter: ['age', '=', 19]
            }
        });

        this.clock.tick(10);

        assert.equal(loadingArgs.length, 2, 'two loading on init');

        // act
        loadingArgs = [];
        this.collapseRow(1);
        this.clock.tick(10);

        // assert
        const items = this.dataController.items();
        assert.equal(loadingArgs.length, 0, 'no loadings on collapse row');
        assert.strictEqual(items.length, 2, 'item count');
        assert.strictEqual(this.isRowExpanded(items[0].key), false, 'item 0 is collapsed');
        assert.strictEqual(items[0].node.children.length, 1, 'item 0 children');
        assert.strictEqual(items[0].node.hasChildren, true, 'item 0 hasChildren');
        assert.strictEqual(items[1].node.children.length, 0, 'item 1 children');
        assert.strictEqual(items[1].node.hasChildren, false, 'item 1 hasChildren');
    });

    QUnit.test('Filter changing should expand nodes', function(assert) {
    // arrange, act
        this.setupTreeList({
            expandNodesOnFiltering: true,
            dataSource: this.items
        });

        // act
        const dataSource = this.getDataSource();

        dataSource.filter(['age', '=', 19]);
        dataSource.load();

        // assert
        assert.equal(this.option('expandedRowKeys').length, 2, 'expandedRowKeys count');
        assert.equal(this.dataController.items().length, 4, 'count items');
    });

    QUnit.test('Initial load when dataSource has filter and filterMode is withAncestors (default) when remoteOperations false', function(assert) {
    // arrange, act
        const loadingArgs = [];

        this.setupTreeList({
            expandNodesOnFiltering: true,
            remoteOperations: false,
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items,
                    onLoading: function(e) {
                        loadingArgs.push(e);
                    }
                },
                filter: ['age', '=', 19]
            }
        });

        // assert
        assert.deepEqual(loadingArgs, [{
            userData: {}
        }], 'loading arguments');

        const items = this.dataController.items();
        assert.equal(items.length, 4, 'count items');
        assert.equal(items[0].data.name, 'Name 3', 'item 1 name value');
        assert.equal(items[0].level, 0, 'item 1 level');
        assert.equal(items[1].data.name, 'Name 5', 'item 2 name value');
        assert.equal(items[1].level, 1, 'item 2 level');
        assert.equal(items[2].data.name, 'Name 7', 'item 3 name value');
        assert.equal(items[2].level, 2, 'item 3 level');
        assert.equal(items[3].data.name, 'Name 1', 'item 4 name value');
        assert.strictEqual(items[3].node.hasChildren, false, 'item 4 name hasChildren');
        assert.equal(items[3].node.children.length, 1, 'item 4 name children length');
        assert.strictEqual(items[3].node.children[0].visible, false, 'item 4 name children 0 visible');
        assert.equal(items[3].level, 0, 'item 4 level');
    });

    QUnit.test('Initial load when dataSource has filter and allow expand filtered items in onNodesInitialized', function(assert) {
    // arrange, act
        this.setupTreeList({
            expandNodesOnFiltering: true,
            remoteOperations: false,
            dataSource: {
                store: this.items,
                filter: ['age', '=', 19]
            },
            columns: [{ dataField: 'age', dataType: 'number' }], // TODO
            onNodesInitialized: function(e) {
                foreachNodes(e.root.children, function(node) {
                    if(node.visible && !node.hasChildren && node.children.length) {
                        node.hasChildren = true;
                        node.children.forEach(function(node) {
                            node.visible = true;
                        });
                    }
                });
            }
        });

        // assert
        assert.deepEqual(this.option('expandedRowKeys'), [5, 1], 'expandedRowKeys');
        let items = this.dataController.items();
        assert.equal(items.length, 4, 'count items');
        assert.strictEqual(items[3].node.hasChildren, true, 'item 4 name hasChildren');
        assert.equal(items[3].node.children.length, 1, 'item 4 name children length');
        assert.strictEqual(items[3].node.children[0].visible, true, 'item 4 name children 0 visible');

        // act
        this.expandRow(items[3].key);

        // assert
        assert.deepEqual(this.option('expandedRowKeys'), [5, 1, 2], 'expandedRowKeys');
        items = this.dataController.items();
        assert.equal(items.length, 5, 'count items');
        assert.strictEqual(items[4].node.parent, items[3].node, 'item 5 is child of item 4');
    });

    QUnit.test('Initial load when dataSource has filter and allow expand filtered items and expand they in onNodesInitialized', function(assert) {
    // arrange, act
        let isExpanding = false;
        const that = this;

        this.setupTreeList({
            expandNodesOnFiltering: true,
            remoteOperations: false,
            dataSource: {
                store: this.items,
                filter: ['age', '=', 19]
            },
            columns: [{ dataField: 'age', dataType: 'number' }], // TODO
            onRowExpanding: function(e) {
                isExpanding = true;
            },
            onRowExpanded: function(e) {
                isExpanding = false;
            },
            onRowCollapsing: function(e) {
                isExpanding = true;
            },
            onRowCollapsed: function(e) {
                isExpanding = false;
            },
            onNodesInitialized: function(e) {
                foreachNodes(e.root.children, function(node) {
                    if(node.visible && !node.hasChildren && node.children.length) {
                        if(!isExpanding) {
                            that.expandRow(node.key);
                        }
                        node.hasChildren = true;
                        node.children.forEach(function(node) {
                            node.visible = true;
                        });
                    }
                });
            }
        });

        // assert
        assert.deepEqual(this.option('expandedRowKeys'), [5, 1, 2], 'expandedRowKeys');
        let items = this.dataController.items();
        assert.equal(items.length, 5, 'count items');
        assert.strictEqual(items[4].node.parent, items[3].node, 'item 5 is child of item 4');

        // act
        this.collapseRow(items[3].key);

        // assert
        assert.deepEqual(this.option('expandedRowKeys'), [5, 1], 'expandedRowKeys');
        items = this.dataController.items();
        assert.equal(items.length, 4, 'count items');
        assert.strictEqual(items[3].node.hasChildren, true, 'item 4 name hasChildren');
        assert.equal(items[3].node.children.length, 1, 'item 4 name children length');
        assert.strictEqual(items[3].node.children[0].visible, true, 'item 4 name children 0 visible');
    });

    QUnit.test('Initial load when expandNodesOnFiltering and no filter', function(assert) {
    // arrange, act
        this.setupTreeList({
            expandNodesOnFiltering: true,
            dataSource: this.items
        });

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'only first level items are visible');
    });

    QUnit.test('Initial load when expandNodesOnFiltering and dataSource has filter and filterMode is matchOnly', function(assert) {
    // arrange, act
        this.setupTreeList({
            filterMode: 'matchOnly',
            expandNodesOnFiltering: true,
            dataSource: {
                store: this.items,
                filter: ['age', '=', 19]
            }
        });

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');
        assert.equal(items[0].data.name, 'Name 3', 'item 1 name value');
        assert.equal(items[0].level, 0, 'item 1 level');
        assert.equal(items[1].data.name, 'Name 7', 'item 2 name value');
        assert.equal(items[1].level, 1, 'item 2 level');
        assert.equal(items[1].node.level, 2, 'item 2 node level');
        assert.equal(items[2].data.name, 'Name 1', 'item 3 name value');
        assert.equal(items[2].level, 0, 'item 3 level');
    });

    QUnit.test('Initial load dataSource has filter and filterMode matchOnly is emulated using onNodesInitialized', function(assert) {
    // arrange, act
        const that = this;
        this.setupTreeList({
            onNodesInitialized: function(e) {
                const filter = that.getCombinedFilter();

                if(!filter) return;

                foreachNodes(e.root.children, function(node) {
                    if(node.visible && !query([node.data]).filter(filter).toArray().length) {
                        node.visible = false;
                    }
                });
            },
            expandNodesOnFiltering: true,
            dataSource: {
                store: this.items,
                filter: ['age', '=', 19]
            }
        });

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');
        assert.equal(items[0].data.name, 'Name 3', 'item 1 name value');
        assert.equal(items[0].level, 0, 'item 1 level');
        assert.equal(items[1].data.name, 'Name 7', 'item 2 name value');
        assert.equal(items[1].level, 1, 'item 2 level');
        assert.equal(items[1].node.level, 2, 'item 2 node level');
        assert.equal(items[2].data.name, 'Name 1', 'item 3 name value');
        assert.equal(items[2].level, 0, 'item 3 level');
    });

    QUnit.test('Initial load when expandNodesOnFiltering disabled and dataSource has filter and filterMode is matchOnly', function(assert) {
    // arrange, act
        this.setupTreeList({
            filterMode: 'matchOnly',
            expandNodesOnFiltering: false,
            dataSource: {
                store: this.items,
                filter: ['age', '=', 19]
            }
        });

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 2, 'count items');
        assert.equal(items[0].data.name, 'Name 3', 'item 1 name value');
        assert.equal(items[0].level, 0, 'item 1 level');
        assert.equal(items[1].data.name, 'Name 1', 'item 2 name value');
        assert.equal(items[1].level, 0, 'item 2 level');
    });

    QUnit.test('Initial load when dataSource has filter and filterMode is matchOnly and root nodes area hidden', function(assert) {
    // arrange, act
        this.setupTreeList({
            filterMode: 'matchOnly',
            expandNodesOnFiltering: true,
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items
                },
                filter: ['age', '<', 19]
            }
        });

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 4, 'count items');
        assert.equal(items[0].data.name, 'Name 2', 'item 1 name value');
        assert.equal(items[0].level, 0, 'item 1 level');
        assert.equal(items[1].data.name, 'Name 6', 'item 2 name value');
        assert.equal(items[1].level, 0, 'item 2 level');
        assert.equal(items[2].data.name, 'Name 5', 'item 3 name value');
        assert.equal(items[2].level, 0, 'item 3 level');
        assert.equal(items[3].data.name, 'Name 4', 'item 4 name value');
        assert.equal(items[3].level, 0, 'item 4 level');
    });

    QUnit.test('Initial load when filterMode is matchOnly and remoteOperations is false', function(assert) {
    // arrange, act
        this.setupTreeList({
            filterMode: 'matchOnly',
            expandNodesOnFiltering: true,
            remoteOperations: false,
            dataSource: {
                store: this.items,
                filter: ['age', '=', 19]
            }
        });

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');
        assert.equal(items[0].data.name, 'Name 3', 'item 1 name value');
        assert.equal(items[0].level, 0, 'item 1 level');
        assert.equal(items[1].data.name, 'Name 7', 'item 2 name value');
        assert.equal(items[1].level, 1, 'item 2 level');
        assert.equal(items[2].data.name, 'Name 1', 'item 3 name value');
        assert.equal(items[2].level, 0, 'item 3 level');
    });

    // T515374
    QUnit.test('Initial load when dataSource has filter whose length is more than available (filterMode is withAncestors)', function(assert) {
    // arrange, act
        const loadingArgs = [];

        const arrayStore = new ArrayStore({
            data: this.items
        });

        this.setupTreeList({
            maxFilterLengthInRequest: 0,
            expandNodesOnFiltering: true,
            dataSource: {
                load: function(loadOptions) {
                    const d = $.Deferred();
                    loadingArgs.push(loadOptions);
                    setTimeout(function() {
                        arrayStore.load(loadOptions).done(function(data) {
                            d.resolve(data);
                        }).fail(d.reject);
                    }, 10);

                    return d;
                },
                useDefaultSearch: true,
                filter: ['age', '=', 19]
            }
        });

        this.clock.tick(10);
        this.clock.tick(10);

        // assert
        assert.equal(this.option('expandedRowKeys').length, 2, 'expandedRowKeys count');
        assert.deepEqual(loadingArgs, [{
            filter: ['age', '=', 19],
            group: null,
            sort: null,
            userData: {}
        }, {
            filter: null,
            group: null,
            sort: null,
            userData: {}
        }], 'loading arguments');

        const items = this.dataController.items();
        assert.equal(items.length, 4, 'count items');
        assert.equal(items[0].data.name, 'Name 3', 'item 1 name value');
        assert.equal(items[0].level, 0, 'item 1 level');
        assert.equal(items[1].data.name, 'Name 5', 'item 2 name value');
        assert.equal(items[1].level, 1, 'item 2 level');
        assert.equal(items[2].data.name, 'Name 7', 'item 3 name value');
        assert.equal(items[2].level, 2, 'item 3 level');
        assert.equal(items[3].data.name, 'Name 1', 'item 4 name value');
        assert.strictEqual(items[3].node.hasChildren, false, 'item 4 name hasChildren');
        assert.equal(items[3].node.children.length, 0, 'item 4 name children length');
        assert.equal(items[3].level, 0, 'item 4 level');
    });

    // T515374
    QUnit.test('Initial load when dataSource has filter whose length is more than available when remoteOperations false (filterMode is withAncestors)', function(assert) {
    // arrange, act
        const loadingArgs = [];

        const arrayStore = new ArrayStore({
            data: this.items
        });

        this.setupTreeList({
            maxFilterLengthInRequest: 0,
            remoteOperations: false,
            expandNodesOnFiltering: true,
            dataSource: {
                load: function(loadOptions) {
                    const d = $.Deferred();
                    loadingArgs.push(loadOptions);
                    setTimeout(function() {
                        arrayStore.load(loadOptions).done(function(data) {
                            d.resolve(data);
                        }).fail(d.reject);
                    }, 10);

                    return d;
                },
                useDefaultSearch: true,
                filter: ['age', '=', 19]
            }
        });

        this.clock.tick(10);
        this.clock.tick(10);

        // assert
        assert.equal(this.option('expandedRowKeys').length, 2, 'expandedRowKeys count');
        assert.deepEqual(loadingArgs, [{
            userData: {}
        }], 'loading arguments');

        const items = this.dataController.items();
        assert.equal(items.length, 4, 'count items');
        assert.equal(items[0].data.name, 'Name 3', 'item 1 name value');
        assert.equal(items[0].level, 0, 'item 1 level');
        assert.equal(items[1].data.name, 'Name 5', 'item 2 name value');
        assert.equal(items[1].level, 1, 'item 2 level');
        assert.equal(items[2].data.name, 'Name 7', 'item 3 name value');
        assert.equal(items[2].level, 2, 'item 3 level');
        assert.equal(items[3].data.name, 'Name 1', 'item 4 name value');
        assert.strictEqual(items[3].node.hasChildren, false, 'item 4 name hasChildren');
        assert.equal(items[3].node.children.length, 1, 'item 4 name children length');
        assert.strictEqual(items[3].node.children[0].visible, false, 'item 4 name children 0 visible');
        assert.equal(items[3].level, 0, 'item 4 level');
    });

    QUnit.test('expand -> collapse -> expand row', function(assert) {
    // arrange
        let items;
        let loadingArgs = [];

        this.setupTreeList({
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items,
                    onLoading: function(e) {
                        loadingArgs.push(e);
                    }
                }
            }
        });
        loadingArgs = [];

        // act
        this.expandRow(1);

        // assert
        assert.equal(loadingArgs.length, 1, 'count load');
        assert.deepEqual(loadingArgs, [
            {
                filter: ['parentId', '=', 1],
                group: null,
                sort: null,
                parentIds: [1],
                userData: {}
            }
        ], 'loading arguments');

        items = this.dataController.items();
        assert.equal(items.length, 5, 'count items');

        // act
        this.collapseRow(1);

        // assert
        assert.equal(loadingArgs.length, 1, 'count load');
        items = this.dataController.items();
        assert.equal(items.length, 3, 'count items');

        // act
        this.expandRow(1);

        // assert
        assert.equal(loadingArgs.length, 1, 'count load');
        items = this.dataController.items();
        assert.equal(items.length, 5, 'count items');
    });

    QUnit.test('Checking the \'hasChildren\' property of the node', function(assert) {
    // arrange, act
        this.setupTreeList({
            dataSource: this.items
        });

        // assert
        assert.ok(this.dataController.items()[0].node.hasChildren, 'first item has children');
    });

    QUnit.test('Checking the \'hasChildren\' property of the node after expand', function(assert) {
    // arrange
        this.setupTreeList({
            dataSource: this.items
        });

        // assert
        assert.ok(this.dataController.items()[2].node.hasChildren, 'third item has children');

        // act
        this.expandRow(3);

        // assert
        assert.notOk(this.dataController.items()[2].node.hasChildren, 'third item hasn\'t children');
    });

    QUnit.test('Checking the \'hasChildren\' property of the node when it specified', function(assert) {
    // arrange
        this.items[2].hasItems = false;
        this.setupTreeList({
            dataSource: this.items,
            hasItemsExpr: 'hasItems'
        });

        // assert
        assert.notOk(this.dataController.items()[2].node.hasChildren, 'third item hasn\'t children');
    });

    // T585731
    QUnit.test('Checking the \'hasChildren\' property of the node after expand when key as Guid', function(assert) {
    // arrange
        const keys = [new Guid('26992b5c-7d63-89ec-2138-33dd5d244798'), new Guid('1c88aa8d-eaf7-d7b6-4906-ce07a3bdc1cb')];

        this.setupTreeList({
            dataSource: [
                { id: keys[0], parentId: 0 },
                { id: keys[1], parentId: new Guid(keys[0]) }
            ]
        });

        // act
        this.expandRow(keys[0]);

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 2, 'item count');
        assert.ok(items[0].node.hasChildren, 'fist item has children');
        assert.ok(items[1].node.hasChildren, 'second item has children');
    });

    QUnit.test('loadDescendants', function(assert) {
    // arrange
        const loadingArgs = [];

        this.setupTreeList({
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items,
                    onLoading: function(e) {
                        loadingArgs.push(e);
                    }
                }
            }
        });

        // act
        this.loadDescendants();

        // assert
        assert.strictEqual(loadingArgs.length, 4, 'count of load');
        assert.deepEqual(loadingArgs[0].parentIds, [0], 'parentIds argument of the first load');
        assert.deepEqual(loadingArgs[1].parentIds, [1, 2, 3], 'parentIds argument of the second load');
        assert.deepEqual(loadingArgs[2].parentIds, [4, 5, 6], 'parentIds argument of the third load');
        assert.deepEqual(loadingArgs[3].parentIds, [7], 'parentIds argument of the fourth load');
    });

    QUnit.test('loadDescendants with key', function(assert) {
    // arrange
        const loadingArgs = [];

        this.setupTreeList({
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items,
                    onLoading: function(e) {
                        loadingArgs.push(e);
                    }
                }
            }
        });

        // act
        this.loadDescendants(2);

        // assert
        assert.strictEqual(loadingArgs.length, 3, 'count of load');
        assert.deepEqual(loadingArgs[0].parentIds, [0], 'parentIds argument of the first load');
        assert.deepEqual(loadingArgs[1].parentIds, [2], 'parentIds argument of the second load');
        assert.deepEqual(loadingArgs[2].parentIds, [6], 'parentIds argument of the third load');
    });

    QUnit.test('loadDescendants with several keys', function(assert) {
    // arrange
        const loadingArgs = [];

        this.setupTreeList({
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items,
                    onLoading: function(e) {
                        loadingArgs.push(e);
                    }
                }
            }
        });

        // act
        this.loadDescendants([1, 2]);

        // assert
        assert.strictEqual(loadingArgs.length, 4, 'count of load');
        assert.deepEqual(loadingArgs[0].parentIds, [0], 'parentIds argument of the first load');
        assert.deepEqual(loadingArgs[1].parentIds, [1, 2], 'parentIds argument of the second load');
        assert.deepEqual(loadingArgs[2].parentIds, [4, 5, 6], 'parentIds argument of the third load');
        assert.deepEqual(loadingArgs[3].parentIds, [7], 'parentIds argument of the fourth load');
    });

    QUnit.test('loadDescendants without deep pass', function(assert) {
    // arrange
        const loadingArgs = [];

        this.setupTreeList({
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items,
                    onLoading: function(e) {
                        loadingArgs.push(e);
                    }
                }
            }
        });

        // act
        this.loadDescendants(2, true);

        // assert
        assert.strictEqual(loadingArgs.length, 2, 'count of load');
        assert.deepEqual(loadingArgs[0].parentIds, [0], 'parentIds argument of the first load');
        assert.deepEqual(loadingArgs[1].parentIds, [2], 'parentIds argument of the second load');
    });

    QUnit.test('loadDescendants - the load should not called when expanding row', function(assert) {
    // arrange
        const loadingArgs = [];

        this.setupTreeList({
            expandedRowKeys: [0],
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items,
                    onLoading: function(e) {
                        loadingArgs.push(e);
                    }
                }
            }
        });

        this.loadDescendants(2);

        // assert
        assert.strictEqual(loadingArgs.length, 3, 'count of load');

        // act
        this.expandRow(2);

        // assert
        assert.strictEqual(loadingArgs.length, 3, 'count of load');
    });

    QUnit.test('loadDescendants without args - the load should not called when expanding row', function(assert) {
    // arrange
        const loadingArgs = [];

        this.setupTreeList({
            expandedRowKeys: [0],
            dataSource: {
                store: {
                    type: 'array',
                    data: this.items,
                    onLoading: function(e) {
                        loadingArgs.push(e);
                    }
                }
            }
        });

        this.loadDescendants();

        // assert
        assert.strictEqual(loadingArgs.length, 4, 'count of load');

        // act
        this.expandRow(2);

        // assert
        assert.strictEqual(loadingArgs.length, 4, 'count of load');
    });
});

QUnit.module('Load data on demand', { beforeEach: function() {
    this.setupTreeList = function(options) {
        if(!('loadingTimeout' in options)) {
            options.loadingTimeout = null;
        }
        if(!('remoteOperations' in options)) {
            options.remoteOperations = {
                filtering: true
            };
        }
        setupTreeListModules(this, ['data', 'columns'], {
            initDefaultOptions: true,
            options: options
        });
    };
}, afterEach: teardownModule }, () => {

    QUnit.test('Initialize load', function(assert) {
    // arrange, act
        const loadOptions = [];

        this.setupTreeList({
            dataSource: {
                load: function(e) {
                    const d = $.Deferred();
                    const nodes = [];
                    const parentIds = e.parentIds;

                    if(parentIds) {
                        for(let i = 0; i < parentIds.length; i++) {
                            nodes.push({ id: i + 1, parentId: parentIds[i], field1: 'test1', field2: 'test2', field3: 'test3' });
                            nodes.push({ id: i + 2, parentId: parentIds[i], field1: 'test4', field2: 'test5', field3: 'test6' });
                        }
                    }

                    loadOptions.push(e);

                    return d.resolve(nodes);
                }
            }
        });

        // assert
        const items = this.dataController.items();
        assert.deepEqual(loadOptions[0].parentIds, [0], 'parentIds');
        assert.equal(items.length, 2, 'count item');
    });

    QUnit.test('Expand row', function(assert) {
    // arrange
        let items;
        const loadOptions = [];
        const data = {
            0: [
                { id: 1, parentId: 0, field1: 'test1', field2: 'test2', field3: 'test3' },
                { id: 2, parentId: 0, field1: 'test4', field2: 'test5', field3: 'test6' }
            ],
            2: [{ id: 3, parentId: 2, field1: 'test7', field2: 'test8', field3: 'test9' }]
        };

        this.setupTreeList({
            dataSource: {
                load: function(e) {
                    const d = $.Deferred();
                    const result = [];
                    const parentIds = e.parentIds;

                    if(parentIds) {
                        for(let i = 0; i < parentIds.length; i++) {
                            result.push.apply(result, data[parentIds[i]]);
                        }
                    }

                    loadOptions.push(e);

                    return d.resolve(result);
                }
            }
        });

        // assert
        items = this.dataController.items();
        assert.equal(items.length, 2, 'count item');
        assert.deepEqual(loadOptions[0].parentIds, [0], 'parentIds');

        // act
        this.expandRow(2);

        // assert
        items = this.dataController.items();
        assert.equal(items.length, 3, 'count item');
        assert.deepEqual(loadOptions[1].parentIds, [2], 'parentIds');
    });

    // T604935
    QUnit.test('loadOptions.parendIds should be correct when expanding several nodes', function(assert) {
    // arrange
        let items;
        const loadOptions = [];
        const data = {
            0: [
                { id: 1, parentId: 0, field1: 'test1', field2: 'test2', field3: 'test3' },
                { id: 2, parentId: 0, field1: 'test4', field2: 'test5', field3: 'test6' }
            ],
            1: [],
            2: [{ id: 3, parentId: 2, field1: 'test7', field2: 'test8', field3: 'test9' }]
        };

        this.setupTreeList({
            dataSource: {
                load: function(e) {
                    const d = $.Deferred();
                    const result = [];
                    const parentIds = e.parentIds;

                    if(parentIds) {
                        for(let i = 0; i < parentIds.length; i++) {
                            result.push.apply(result, data[parentIds[i]]);
                        }
                    }

                    loadOptions.push(e);

                    return d.resolve(result);
                }
            }
        });

        // act
        this.expandRow(1);

        // assert
        items = this.dataController.items();
        assert.equal(items.length, 2, 'item count');
        assert.deepEqual(loadOptions[1].parentIds, [1], 'parentIds');

        // act
        this.expandRow(2);

        // assert
        items = this.dataController.items();
        assert.equal(items.length, 3, 'item count');
        assert.deepEqual(loadOptions[2].parentIds, [2], 'parentIds');
    });
});

QUnit.module('Filtering', { beforeEach: function() {
    this.setupTreeList = function(options) {
        if(!('loadingTimeout' in options)) {
            options.loadingTimeout = null;
        }
        setupTreeListModules(this, ['data', 'columns', 'filterRow', 'search'], {
            initDefaultOptions: true,
            options: options
        });
    };
}, afterEach: teardownModule }, () => {

    QUnit.test('Search should work correctly with hierarchical structure', function(assert) {
        // act
        this.setupTreeList({
            itemsExpr: 'items',
            dataStructure: 'tree',
            dataSource: [
                { name: 'Alex', items: [{ name: 'Bob' }] },
                { name: 'Tom', items: [{ name: 'John' }] }
            ],
            searchPanel: {
                text: 'Bob'
            }
        });

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 2, 'item count');
        assert.deepEqual(items[0].data, { 'id': 1, 'name': 'Alex', 'parentId': 0 }, 'first item');
        assert.deepEqual(items[1].data, { 'id': 2, 'name': 'Bob', 'parentId': 1 }, 'second item');
    });

    QUnit.test('Search when filterMode is \'fullBranch\'', function(assert) {
    // arrange, act
        this.setupTreeList({
            dataSource: [
                { id: 1, parentId: 0, test: 'Test 1' },
                { id: 2, parentId: 0, test: 'Test 2' },
                { id: 3, parentId: 2, test: 'Test 3' },
                { id: 4, parentId: 3, test: 'Test 4' },
                { id: 5, parentId: 3, test: 'Test 5' },
                { id: 6, parentId: 0, test: 'Test 6' }
            ],
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            filterMode: 'fullBranch',
            expandNodesOnFiltering: true,
            searchPanel: {
                text: 'Test 3'
            }
        });

        // assert
        let items = this.dataController.items();
        assert.strictEqual(items.length, 2, 'item count');
        assert.deepEqual(items[0].data, { id: 2, parentId: 0, test: 'Test 2' }, 'first item');
        assert.deepEqual(items[0].level, 0, 'level of the first item');
        assert.deepEqual(items[1].data, { id: 3, parentId: 2, test: 'Test 3' }, 'second item');
        assert.deepEqual(items[1].level, 1, 'level of the second item');
        assert.deepEqual(items[1].level, 1, 'level of the second item');
        assert.ok(items[1].node.hasChildren, 'second item has children');

        // act
        this.expandRow(3);

        // assert
        items = this.dataController.items();
        assert.strictEqual(items.length, 4, 'item count');
        assert.deepEqual(this.option('expandedRowKeys'), [2, 3], 'expandedRowKyes');
        assert.deepEqual(items[0].data, { id: 2, parentId: 0, test: 'Test 2' }, 'first item');
        assert.deepEqual(items[0].level, 0, 'level of the first item');
        assert.deepEqual(items[1].data, { id: 3, parentId: 2, test: 'Test 3' }, 'second item');
        assert.deepEqual(items[1].level, 1, 'level of the second item');
        assert.deepEqual(items[1].level, 1, 'level of the second item');
        assert.ok(items[1].node.hasChildren, 'second item has children');
        assert.deepEqual(items[2].data, { id: 4, parentId: 3, test: 'Test 4' }, 'third item');
        assert.deepEqual(items[2].level, 2, 'level of the third item');
        assert.deepEqual(items[3].data, { id: 5, parentId: 3, test: 'Test 5' }, 'fourth item');
        assert.deepEqual(items[3].level, 2, 'level of the fourth item');
    });

    QUnit.test('Search with filterMode is \'fullBranch\' when remote data source', function(assert) {
    // arrange
        const store = new ArrayStore([
            { id: 1, parentId: 0, test: 'Test 1' },
            { id: 2, parentId: 0, test: 'Test 2' },
            { id: 3, parentId: 2, test: 'Test 3' },
            { id: 4, parentId: 3, test: 'Test 4' },
            { id: 5, parentId: 3, test: 'Test 5' },
            { id: 6, parentId: 0, test: 'Test 6' }
        ]);

        // act
        this.setupTreeList({
            dataSource: {
                load: (loadOptions) => store.load(loadOptions)
            },
            remoteOperations: true,
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            filterMode: 'fullBranch',
            expandNodesOnFiltering: true,
            searchPanel: {
                text: 'Test 3'
            }
        });

        // assert
        let items = this.dataController.items();
        assert.strictEqual(items.length, 2, 'item count');
        assert.deepEqual(items[0].data, { id: 2, parentId: 0, test: 'Test 2' }, 'first item');
        assert.deepEqual(items[0].level, 0, 'level of the first item');
        assert.deepEqual(items[1].data, { id: 3, parentId: 2, test: 'Test 3' }, 'second item');
        assert.deepEqual(items[1].level, 1, 'level of the second item');
        assert.deepEqual(items[1].level, 1, 'level of the second item');
        assert.ok(items[1].node.hasChildren, 'second item has children');

        // act
        this.expandRow(3);

        // assert
        items = this.dataController.items();
        assert.strictEqual(items.length, 4, 'item count');
        assert.deepEqual(this.option('expandedRowKeys'), [2, 3], 'expandedRowKyes');
        assert.deepEqual(items[0].data, { id: 2, parentId: 0, test: 'Test 2' }, 'first item');
        assert.deepEqual(items[0].level, 0, 'level of the first item');
        assert.deepEqual(items[1].data, { id: 3, parentId: 2, test: 'Test 3' }, 'second item');
        assert.deepEqual(items[1].level, 1, 'level of the second item');
        assert.deepEqual(items[1].level, 1, 'level of the second item');
        assert.ok(items[1].node.hasChildren, 'second item has children');
        assert.deepEqual(items[2].data, { id: 4, parentId: 3, test: 'Test 4' }, 'third item');
        assert.deepEqual(items[2].level, 2, 'level of the third item');
        assert.deepEqual(items[3].data, { id: 5, parentId: 3, test: 'Test 5' }, 'fourth item');
        assert.deepEqual(items[3].level, 2, 'level of the fourth item');
    });

    QUnit.test('FullBranch mode. Expansion of the filtered node should work when expandNodesOnFiltering is false', function(assert) {
    // arrange
    /* eslint-disable */
    const data = new ArrayStore([
        { id: 1, parentId: 0, test: "Test 1" },
            { id: 2, parentId: 1, test: "Test 2" },
                { id: 3, parentId: 2, test: "Test 3" },
                { id: 4, parentId: 2, test: "Test 4" }
    ]);
    /* eslint-enable */

        this.setupTreeList({
            dataSource: data,
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            filterMode: 'fullBranch',
            expandNodesOnFiltering: false,
            searchPanel: {
                text: 'Test 2'
            }
        });

        // act
        this.expandRow(1);

        // assert
        let items = this.dataController.items();
        assert.strictEqual(items.length, 2, 'item count');
        assert.deepEqual(items[0].data, { id: 1, parentId: 0, test: 'Test 1' }, 'first item');
        assert.deepEqual(items[1].data, { id: 2, parentId: 1, test: 'Test 2' }, 'second item');

        // act
        this.expandRow(2);

        // assert
        items = this.dataController.items();
        assert.strictEqual(items.length, 4, 'item count');
        assert.deepEqual(items[0].data, { id: 1, parentId: 0, test: 'Test 1' }, 'first item');
        assert.deepEqual(items[1].data, { id: 2, parentId: 1, test: 'Test 2' }, 'second item');
        assert.deepEqual(items[2].data, { id: 3, parentId: 2, test: 'Test 3' }, 'third item');
        assert.deepEqual(items[3].data, { id: 4, parentId: 2, test: 'Test 4' }, 'fourth item');
    });

    QUnit.test('FullBranch mode. The order of nodes should not be changed after expanding nodes when expandNodesOnFiltering is false', function(assert) {
    // arrange
    /* eslint-disable */
    const store = new ArrayStore([
        { id: 1, parentId: 0, test: "Test 1" },
            { id: 2, parentId: 1, test: "Test 2" },
                { id: 3, parentId: 2, test: "Test 3" },
            { id: 4, parentId: 1, test: "Test 3" },
                { id: 5, parentId: 4, test: "Test 4" }
    ]);
    /* eslint-enable */

        this.setupTreeList({
            dataSource: {
                load: (loadOptions) => store.load(loadOptions)
            },
            remoteOperations: true,
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            filterMode: 'fullBranch',
            expandNodesOnFiltering: false,
            searchPanel: {
                text: 'Test 3'
            }
        });

        // act
        this.expandRow(1);

        // assert
        let items = this.dataController.items();
        assert.strictEqual(items.length, 3, 'item count');
        assert.deepEqual(items[0].data, { id: 1, parentId: 0, test: 'Test 1' }, 'first item');
        assert.deepEqual(items[1].data, { id: 4, parentId: 1, test: 'Test 3' }, 'second item');
        assert.deepEqual(items[2].data, { id: 2, parentId: 1, test: 'Test 2' }, 'third item');

        // act
        this.expandRow(4);

        // assert
        items = this.dataController.items();
        assert.strictEqual(items.length, 4, 'item count');
        assert.deepEqual(items[0].data, { id: 1, parentId: 0, test: 'Test 1' }, 'first item');
        assert.deepEqual(items[1].data, { id: 4, parentId: 1, test: 'Test 3' }, 'second item');
        assert.deepEqual(items[2].data, { id: 5, parentId: 4, test: 'Test 4' }, 'third item');
        assert.deepEqual(items[3].data, { id: 2, parentId: 1, test: 'Test 2' }, 'fourth item');
    });

    QUnit.test('FullBranch mode. Children of filtered nodes should not be collapsed after sorting', function(assert) {
    // arrange
    /* eslint-disable */
    const store = new ArrayStore([
        { id: 1, parentId: 0, test: "Test 1" },
            { id: 2, parentId: 1, test: "Test 2" },
                { id: 3, parentId: 2, test: "Test 3" },
                { id: 4, parentId: 2, test: "Test 4", hasChildren: false }
    ]);
    /* eslint-enable */

        this.setupTreeList({
            dataSource: {
                load: (loadOptions) => store.load(loadOptions)
            },
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            hasItemsExpr: 'hasChildren',
            filterMode: 'fullBranch',
            expandNodesOnFiltering: true,
            remoteOperations: true,
            searchPanel: {
                text: 'Test 2'
            }
        });

        this.expandRow(2);

        // assert
        let items = this.dataController.items();
        assert.strictEqual(items.length, 4, 'item count');

        // act
        this.columnOption('test', 'sortOrder', 'asc');

        // assert
        items = this.dataController.items();
        assert.strictEqual(items.length, 4, 'item count');
        assert.strictEqual(items[0].node.hasChildren, true, 'hasChildren of the first node');
        assert.strictEqual(items[1].node.hasChildren, true, 'hasChildren of the second node');
        assert.strictEqual(items[2].node.hasChildren, true, 'hasChildren of the third node');
        assert.strictEqual(items[3].node.hasChildren, false, 'hasChildren of the fourth node');
    });

    // T724827
    QUnit.test('The filter query should be correct after resetting the filter value', function(assert) {
    // arrange
        let items;
        let filter;
        /* eslint-disable */
        const store = new ArrayStore([
            { id: 1, parentId: 0, name: "Name 3", age: 19 },
                { id: 4, parentId: 1, name: "Name 6", age: 16 },
                { id: 5, parentId: 1, name: "Name 5", age: 15 },
                { id: 6, parentId: 1, name: "Name 4", age: 15 },
                    { id: 7, parentId: 6, name: "Name 7", age: 18 },
            { id: 2, parentId: 0, name: "Name 1", age: 19 },
            { id: 3, parentId: 0, name: "Name 2", age: 18 }
        ]);
        /* eslint-enable */

        this.setupTreeList({
            remoteOperations: {
                filtering: true
            },
            dataSource: {
                load: function(loadOptions) {
                    filter = filter || loadOptions.filter;
                    return store.load(loadOptions);
                }
            },
            columns: [{ dataField: 'name', dataType: 'string' }, { dataField: 'age', dataType: 'number', filterValue: 18 }]
        });

        // assert
        items = this.dataController.items();
        assert.strictEqual(items.length, 4, 'item count');
        assert.deepEqual(filter, ['age', '=', 18], 'filter');

        // act
        filter = null;
        this.columnOption('age', 'filterValue', undefined);

        // assert
        items = this.dataController.items();
        assert.strictEqual(items.length, 3, 'item count');
        assert.deepEqual(filter, ['parentId', '=', 0], 'filter');
    });

    // T866113
    QUnit.test('Filtering should work correctly when data is returned as an object', function(assert) {
    // arrange
    /* eslint-disable */
    const store = new ArrayStore([
        { id: 1, parentId: 0, name: "Name 3", age: 19 },
            { id: 4, parentId: 1, name: "Name 6", age: 16 },
            { id: 5, parentId: 1, name: "Name 5", age: 15 },
            { id: 6, parentId: 1, name: "Name 4", age: 15 },
                { id: 7, parentId: 6, name: "Name 7", age: 18 },
        { id: 2, parentId: 0, name: "Name 1", age: 19 },
        { id: 3, parentId: 0, name: "Name 2", age: 18 }
    ]);
    /* eslint-enable */

        this.setupTreeList({
            remoteOperations: {
                filtering: true
            },
            dataSource: {
                load: function(loadOptions) {
                    const d = $.Deferred();

                    store.load(loadOptions).done((items) => {
                        d.resolve({
                            data: items,
                            totalCount: 7
                        });
                    });

                    return d.promise();
                }
            },
            columns: [{ dataField: 'name', dataType: 'string' }, { dataField: 'age', dataType: 'number' }]
        });

        // act
        this.columnOption('name', 'filterValue', 'Name 7');

        // assert
        const rows = this.getVisibleRows();
        assert.strictEqual(rows.length, 3, 'row count');
        assert.strictEqual(rows[0].key, 1, 'first row');
        assert.strictEqual(rows[1].key, 6, 'second row');
        assert.strictEqual(rows[2].key, 7, 'third row');
    });

    // T1087885
    QUnit.test('There should not be looping after search when filterMode is \'fullBranch\' and all nodes are expanded', function(assert) {
        // arrange, act
        const data = generateData(200);

        this.setupTreeList({
            dataSource: data,
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            filterMode: 'fullBranch',
            expandNodesOnFiltering: true,
            searchPanel: {
                text: 'b'
            },
            expandedRowKeys: data.map((item) => item.id)
        });

        // act
        assert.ok(true, 'no looping');
    });

    // T1188243
    QUnit.test('Search with filterMode is \'fullBranch\' when sorting is specified', function(assert) {
        // arrange
        /* eslint-disable */
        const data = [
            { id: 1, parentId: 0, sortOrder: 0, test: 'Test 1' },
            { id: 2, parentId: 0, sortOrder: 1, test: 'Test 2' },
                { id: 3, parentId: 2, sortOrder: 2, test: 'Test 1' },
                    { id: 4, parentId: 3, sortOrder: 3, test: 'Test 3' },
                    { id: 5, parentId: 3, sortOrder: 4, test: 'Test 4' },
                { id: 6, parentId: 2, sortOrder: 5, test: 'Test 1' },
            { id: 7, parentId: 0, sortOrder: 6, test: 'Test 1' }
        ];
        /* eslint-enable */

        // act
        this.setupTreeList({
            dataSource: data,
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            filterMode: 'fullBranch',
            expandNodesOnFiltering: true,
            expandedRowKeys: [2, 3],
            searchPanel: {
                text: 'Test 1'
            },
            columns: ['id', {
                dataField: 'sortOrder',
                sortOrder: 'desc'
            }, 'test'],
        });

        // assert
        const items = this.dataController.items().map((item) => item.data);
        assert.strictEqual(items.length, 7, 'item count');

        /* eslint-disable */
        assert.deepEqual(items, [
            { id: 7, parentId: 0, sortOrder: 6, test: 'Test 1' },
            { id: 2, parentId: 0, sortOrder: 1, test: 'Test 2' },
                { id: 6, parentId: 2, sortOrder: 5, test: 'Test 1' },
                { id: 3, parentId: 2, sortOrder: 2, test: 'Test 1' },
                    { id: 5, parentId: 3, sortOrder: 4, test: 'Test 4' },
                    { id: 4, parentId: 3, sortOrder: 3, test: 'Test 3' },
            { id: 1, parentId: 0, sortOrder: 0, test: 'Test 1' },
        ], 'items');
        /* eslint-enable */
    });

    // T1188243
    QUnit.test('Search with filterMode is \'fullBranch\' when sorting and a remote filtering are specified', function(assert) {
        // arrange
        /* eslint-disable */
        const data = [
            { id: 1, parentId: 0, sortOrder: 0, test: 'Test 1' },
            { id: 2, parentId: 0, sortOrder: 1, test: 'Test 2' },
                { id: 3, parentId: 2, sortOrder: 2, test: 'Test 1' },
                    { id: 4, parentId: 3, sortOrder: 3, test: 'Test 3' },
                    { id: 5, parentId: 3, sortOrder: 4, test: 'Test 4' },
                { id: 6, parentId: 2, sortOrder: 5, test: 'Test 1' },
            { id: 7, parentId: 0, sortOrder: 6, test: 'Test 1' }
        ];
        /* eslint-enable */
        const store = new ArrayStore(data);

        // act
        this.setupTreeList({
            dataSource: {
                load: (loadOptions) => store.load(loadOptions),
                totalCount: () => data.length
            },
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            filterMode: 'fullBranch',
            expandNodesOnFiltering: true,
            expandedRowKeys: [2, 3],
            remoteOperations: {
                filtering: true
            },
            searchPanel: {
                text: 'Test 1'
            },
            columns: ['id', {
                dataField: 'sortOrder',
                sortOrder: 'desc'
            }, 'test'],
        });

        // assert
        const items = this.dataController.items().map((item) => item.data);
        assert.strictEqual(items.length, 7, 'item count');

        /* eslint-disable */
    assert.deepEqual(items, [
        { id: 7, parentId: 0, sortOrder: 6, test: 'Test 1' },
        { id: 2, parentId: 0, sortOrder: 1, test: 'Test 2' },
            { id: 6, parentId: 2, sortOrder: 5, test: 'Test 1' },
            { id: 3, parentId: 2, sortOrder: 2, test: 'Test 1' },
                { id: 5, parentId: 3, sortOrder: 4, test: 'Test 4' },
                { id: 4, parentId: 3, sortOrder: 3, test: 'Test 3' },
        { id: 1, parentId: 0, sortOrder: 0, test: 'Test 1' },
    ], 'items');
    /* eslint-enable */
    });

    // T1188243
    QUnit.test('Search with filterMode is \'fullBranch\' when remote sorting and a remote filtering are specified', function(assert) {
        // arrange
        /* eslint-disable */
        const data = [
            { id: 1, parentId: 0, sortOrder: 0, test: 'Test 1' },
            { id: 2, parentId: 0, sortOrder: 1, test: 'Test 2' },
                { id: 3, parentId: 2, sortOrder: 2, test: 'Test 1' },
                    { id: 4, parentId: 3, sortOrder: 3, test: 'Test 3' },
                    { id: 5, parentId: 3, sortOrder: 4, test: 'Test 4' },
                { id: 6, parentId: 2, sortOrder: 5, test: 'Test 1' },
            { id: 7, parentId: 0, sortOrder: 6, test: 'Test 1' }
        ];
        /* eslint-enable */
        const store = new ArrayStore(data);

        // act
        this.setupTreeList({
            dataSource: {
                load: (loadOptions) => store.load(loadOptions),
                totalCount: () => data.length
            },
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            filterMode: 'fullBranch',
            expandNodesOnFiltering: true,
            expandedRowKeys: [2, 3],
            remoteOperations: {
                sorting: true,
                filtering: true
            },
            searchPanel: {
                text: 'Test 1'
            },
            columns: ['id', {
                dataField: 'sortOrder',
                sortOrder: 'desc'
            }, 'test'],
        });

        // assert
        const items = this.dataController.items().map((item) => item.data);
        assert.strictEqual(items.length, 7, 'item count');

        /* eslint-disable */
    assert.deepEqual(items, [
        { id: 7, parentId: 0, sortOrder: 6, test: 'Test 1' },
        { id: 2, parentId: 0, sortOrder: 1, test: 'Test 2' },
            { id: 6, parentId: 2, sortOrder: 5, test: 'Test 1' },
            { id: 3, parentId: 2, sortOrder: 2, test: 'Test 1' },
                { id: 5, parentId: 3, sortOrder: 4, test: 'Test 4' },
                { id: 4, parentId: 3, sortOrder: 3, test: 'Test 3' },
        { id: 1, parentId: 0, sortOrder: 0, test: 'Test 1' },
    ], 'items');
    /* eslint-enable */
    });
});

QUnit.module('Push API', {
    beforeEach: function() {
        this.items = [
            { id: 1, parentId: 0, name: 'Name 1' },
            { id: 2, parentId: 0, name: 'Name 2' },
            { id: 3, parentId: 0, name: 'Name 3' },
            { id: 4, parentId: 1, name: 'Name 4' },
            { id: 5, parentId: 1, name: 'Name 5' },
            { id: 6, parentId: 1, name: 'Name 6' }
        ];

        this.setupTreeList = function(options) {
            if(!('loadingTimeout' in options)) {
                options.loadingTimeout = null;
            }
            setupTreeListModules(this, ['data', 'columns'], {
                initDefaultOptions: true,
                options: options
            });
        };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: teardownModule
}, () => {
    // T1113826
    QUnit.test('Update the node using the push method of the store when changes have the \'data\' property', function(assert) {
        // arrange
        this.setupTreeList({
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            dataSource: this.items,
            columns: ['name', 'age']
        });
        const store = this.getDataSource().store();

        // act
        store.push([{
            type: 'update',
            key: 1,
            data: {
                name: 'Root name 1',
                data: {
                    name: 'Inner name 1'
                }
            }
        }]);
        this.clock.tick(100);

        // assert
        const firstNode = this.getVisibleRows()[0];
        assert.deepEqual(firstNode.data, {
            id: 1,
            parentId: 0,
            name: 'Root name 1',
            data: {
                name: 'Inner name 1'
            }
        }, 'node data is correct');
    });
});
