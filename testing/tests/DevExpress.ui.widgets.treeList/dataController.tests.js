"use strict";

require("ui/tree_list/ui.tree_list");

var $ = require("jquery"),
    DataSource = require("data/data_source/data_source").DataSource,
    ArrayStore = require("data/array_store"),
    query = require("data/query"),
    treeListMocks = require("../../helpers/treeListMocks.js"),
    setupTreeListModules = treeListMocks.setupTreeListModules;

var createDataSource = function(data, storeOptions, dataSourceOptions) {
    var arrayStore = new ArrayStore(storeOptions ? $.extend(true, { data: data }, storeOptions) : data),
        dataSource = new DataSource($.extend(true, { store: arrayStore, _preferSync: true }, dataSourceOptions));

    return dataSource;
};

var setupModule = function() {
    this.options = {
        keyExpr: "id",
        parentIdExpr: "parentId",
        rootValue: 0,
        expandedRowKeys: []
    };

    setupTreeListModules(this, ["data", "columns", "masterDetail"]);

    this.applyOptions = function(options) {
        $.extend(this.options, options);
        this.columnsController.init();
        this.dataController.init();
    };
};

var teardownModule = function() {
    this.clock && this.clock.restore();
    this.dispose();
};

function foreachNodes(nodes, func) {
    for(var i = 0; i < nodes.length; i++) {
        func(nodes[i]);
        foreachNodes(nodes[i].children, func);
    }
}

QUnit.module("Initialization", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("No initialization", function(assert) {
    assert.deepEqual(this.dataController.items(), []);
    assert.ok(!this.dataController.isLoading());
    assert.ok(this.dataController.isLoaded());
});

QUnit.test("Paginate should be disabled", function(assert) {
    //arrange, act
    this.applyOptions({
        dataSource: []
    });

    //assert
    assert.notOk(this.dataController.dataSource().paginate(), "paginate is disabled");
});

QUnit.test("Paginate should be enabled when virtual scrolling is enabled", function(assert) {
    //arrange, act
    this.applyOptions({
        dataSource: [],
        scrolling: {
            mode: "virtual"
        }
    });

    //assert
    assert.ok(this.dataController.dataSource().paginate(), "paginate is enabled");
});

QUnit.test("Initialize from dataSource with plain structure", function(assert) {
    //arrange
    var items,
        array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 }
        ],
        dataSource = createDataSource(array);

    this.dataController.setDataSource(dataSource);

    //act
    dataSource.load();

    //TODO: remove when implemented expandAllEnabled
    this.expandRow(2);

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 3, "count items");

    assert.equal(items[0].rowType, "data", "rowType of first item");
    assert.equal(items[0].key, 1, "key of first item");
    assert.deepEqual(items[0].data, { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 }, "data of first item");
    assert.deepEqual(items[0].values, ['Category1', '55-55-55', 1, 0], "values of first item");
    assert.equal(items[0].node.children.length, 0, "count children of first item");
    assert.notOk(items[0].node.hasChildren, "first item hasn't children");
    assert.equal(items[0].level, 0, "level of first item");
    assert.equal(items[0].node.parent.key, 0, "first item has root parentKey");

    assert.equal(items[1].rowType, "data", "rowType of second item");
    assert.equal(items[1].key, 2, "key of second item");
    assert.deepEqual(items[1].data, { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 }, "data of second item");
    assert.deepEqual(items[1].values, ['Category2', '98-75-21', 2, 0], "values of second item");
    assert.equal(items[1].node.children.length, 1, "count children of second item");
    assert.ok(items[1].node.hasChildren, "first item has children");
    assert.equal(items[1].node.level, 0, "level of second item");
    assert.equal(items[1].node.parent.key, 0, "second item has root parentKey");
    assert.deepEqual(items[1].node.children[0], items[2].node, "child of second item");

    assert.equal(items[2].rowType, "data", "rowType of second item");
    assert.equal(items[2].key, 3, "key of second item");
    assert.deepEqual(items[2].data, { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 }, "data of second item");
    assert.deepEqual(items[2].values, ['SubCategory1', '55-66-77', 3, 2], "values of second item");
    assert.equal(items[2].node.children.length, 0, "count children of second item");
    assert.notOk(items[2].node.hasChildren, "first item hasn't children");
    assert.equal(items[2].level, 1, "level of second item");
    assert.equal(items[2].node.parent.key, items[1].key, "second item has parentKey");
});

QUnit.test("root node should have correct key and level", function(assert) {
    //arrange
    var array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 }
        ],
        dataSource = createDataSource(array);

    this.dataController.setDataSource(dataSource);

    //act
    dataSource.load();

    //assert
    var rootNode = this.getRootNode();
    assert.strictEqual(rootNode.children.length, 2, "root node children count");
    assert.strictEqual(rootNode.key, 0, "root node key");
    assert.strictEqual(rootNode.level, -1, "root node level");
});

//T514552
QUnit.test("nodes should not be recreated after expand", function(assert) {
    //arrange
    var array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 }
        ],
        dataSource = createDataSource(array);

    var nodesInitialized = sinon.stub();

    this.applyOptions({
        onNodesInitialized: nodesInitialized
    });

    this.dataController.setDataSource(dataSource);

    dataSource.load();
    var rootNode = this.getRootNode();

    //act
    this.expandRow(2);

    //assert
    assert.strictEqual(nodesInitialized.callCount, 1, "nodesInitialized called once on first load");
    assert.strictEqual(this.getRootNode(), rootNode, "root node is not changed");
});

QUnit.test("nodes should be recreated after change sorting", function(assert) {
    //arrange
    var array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 }
        ],
        dataSource = createDataSource(array);

    var nodesInitialized = sinon.stub();

    this.applyOptions({
        onNodesInitialized: nodesInitialized
    });

    this.dataController.setDataSource(dataSource);

    dataSource.load();
    var rootNode = this.getRootNode();

    //act
    dataSource.sort({ selector: "name", desc: false });
    dataSource.load();

    //assert
    assert.strictEqual(nodesInitialized.callCount, 2, "nodesInitialized called after change sorting");
    assert.notStrictEqual(this.getRootNode(), rootNode, "root node is changed");
});

QUnit.test("Initialize from dataSource with hierarchical structure", function(assert) {
    //arrange
    var items,
        array = [
            { name: "Category1", phone: "55-55-55" },
            { name: "Category2", phone: "98-75-21", items: [
                { name: "SubCategory1", phone: "55-66-77" },
                { name: "SubCategory2", phone: "56-76-79" }]
            }
        ],
        dataSource = createDataSource(array);

    this.applyOptions({
        itemsExpr: "items",
        dataStructure: "tree"
    });
    this.dataController.setDataSource(dataSource);

    //act
    dataSource.load();

    //TODO: remove when implemented expandedRowKeys
    this.expandRow(2);

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 4, "count items");

    assert.equal(items[0].key, 1, "key of first item");
    assert.deepEqual(items[0].data, { name: "Category1", phone: "55-55-55", id: 1, parentId: 0 }, "data of first item");
    assert.equal(items[0].level, 0, "level of first item");

    assert.equal(items[1].key, 2, "key of second item");
    assert.deepEqual(items[1].data, { name: "Category2", phone: "98-75-21", id: 2, parentId: 0 }, "data of second item");
    assert.equal(items[1].level, 0, "level of second item");

    assert.equal(items[2].key, 3, "key of third item");
    assert.deepEqual(items[2].data, { name: "SubCategory1", phone: "55-66-77", id: 3, parentId: 2 }, "data of third item");
    assert.equal(items[2].level, 1, "level of third item");
    assert.equal(items[2].node.parent.key, items[1].key, "third item has parentKey");

    assert.equal(items[3].key, 4, "key of fourth item");
    assert.deepEqual(items[3].data, { name: "SubCategory2", phone: "56-76-79", id: 4, parentId: 2 }, "data of fourth item");
    assert.equal(items[3].level, 1, "level of fourth item");
    assert.equal(items[3].node.parent.key, items[1].key, "fourth item has parentKey");
});

QUnit.test("Initialize from dataSource with hierarchical structure when 'keyExpr' option is specified", function(assert) {
    //arrange
    var items,
        array = [
            { name: "Category1", phone: "55-55-55", key: "key1" },
            { name: "Category2", phone: "98-75-21", key: "key2", items: [
                { name: "SubCategory1", phone: "55-66-77", key: "key3" },
                { name: "SubCategory2", phone: "56-76-79", key: "key4" }]
            }
        ],
        dataSource = createDataSource(array);

    this.applyOptions({
        itemsExpr: "items",
        dataStructure: "tree",
        keyExpr: "key"
    });
    this.dataController.setDataSource(dataSource);

    //act
    dataSource.load();

    //TODO: remove when implemented expandedRowKeys
    this.expandRow("key2");

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 4, "count items");

    assert.equal(items[0].key, "key1", "key of first item");
    assert.deepEqual(items[0].data, { name: "Category1", phone: "55-55-55", key: "key1", parentId: 0 }, "data of first item");
    assert.equal(items[0].level, 0, "level of first item");

    assert.equal(items[1].key, "key2", "key of second item");
    assert.deepEqual(items[1].data, { name: "Category2", phone: "98-75-21", key: "key2", parentId: 0 }, "data of second item");
    assert.equal(items[1].level, 0, "level of second item");

    assert.equal(items[2].key, "key3", "key of third item");
    assert.deepEqual(items[2].data, { name: "SubCategory1", phone: "55-66-77", key: "key3", parentId: "key2" }, "data of third item");
    assert.equal(items[2].level, 1, "level of third item");
    assert.equal(items[2].node.parent.key, items[1].key, "third item has parentKey");

    assert.equal(items[3].key, "key4", "key of fourth item");
    assert.deepEqual(items[3].data, { name: "SubCategory2", phone: "56-76-79", key: "key4", parentId: "key2" }, "data of fourth item");
    assert.equal(items[3].level, 1, "level of fourth item");
    assert.equal(items[3].node.parent.key, items[1].key, "fourth item has parentKey");
});

QUnit.test("Initialize from dataSource when there is key of store (without the specified 'keyEpxr' option)", function(assert) {
    //arrange
    var items,
        array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'Category2', phone: '98-75-21', id: 2 }
        ],
        dataSource = createDataSource(array, { key: "id" });

    this.applyOptions({ keyExpr: null });
    this.dataController.setDataSource(dataSource);

    //act
    dataSource.load();

    //TODO: remove when implemented expandAllEnabled
    this.expandRow(2);

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 3, "count items");

    assert.equal(items[0].key, 1, "key of first item");
    assert.equal(items[0].node.children.length, 0, "count children of first item");
    assert.notOk(items[0].node.parent.key, "first item hasn't parentKey");

    assert.equal(items[1].key, 2, "key of second item");
    assert.equal(items[1].node.children.length, 1, "count children of second item");
    assert.deepEqual(items[1].node.children[0], items[2].node, "child of second item");
    assert.notOk(items[1].node.parent.key, "second item hasn't parentKey");

    assert.equal(items[2].key, 3, "key of second item");
    assert.equal(items[2].node.children.length, 0, "count children of third item");
    assert.equal(items[2].node.parent.key, items[1].key, "third item has parentKey");
});

QUnit.test("Checking key of store when dataSource as array", function(assert) {
    //arrange
    var dataSource,
        array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'Category2', phone: '98-75-21', id: 2 }
        ];

    //act
    this.applyOptions({ dataSource: array });

    //assert
    dataSource = this.getDataSource();
    assert.equal(dataSource.store().key(), "id", "key of store");
});

QUnit.test("Exception when key of store not equal 'keyExpr' option value", function(assert) {
    //arrange
    var array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'Category2', phone: '98-75-21', id: 2 }
        ],
        dataSource = createDataSource(array, { key: "name" });

    //act, assert
    try {
        this.dataController.setDataSource(dataSource);
        assert.ok(false, "exception should be rised");
    } catch(e) {
        assert.ok(e.message.indexOf("E1044") >= 0, "name of error");
    }
});

QUnit.test("Error on loading when key is not specified in data", function(assert) {
    //arrange
    var dataErrors = [],
        array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'Category2', phone: '98-75-21', id: 2 }
        ],
        dataSource = createDataSource(array);

    this.applyOptions({
        keyExpr: "key"
    });
    this.dataController.setDataSource(dataSource);
    this.dataController.dataErrorOccurred.add(function(e) {
        dataErrors.push(e);
    });

    //act
    dataSource.load();

    //assert
    assert.equal(dataErrors.length, 1, "count error");
    assert.equal(dataErrors[0].__id, "E1046", "error id");
});

QUnit.test("Update items", function(assert) {
    //arrange
    var items,
        array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'Category2', phone: '98-75-21', id: 2 }
        ],
        dataSource = createDataSource(array);

    this.dataController.setDataSource(dataSource);
    dataSource.load();
    this.expandRow(2); //TODO: remove when implemented expandAllEnabled

    //act
    this.dataController.updateItems();

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 3, "count items");
});

QUnit.test("Initialize from dataSource with plain structure when virtual scrolling enabled", function(assert) {

    //arrange
    var items,
        array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 5, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 },
            { name: 'Category3', phone: '98-75-22', id: 3, parentId: 0 },
            { name: 'Category4', phone: '98-75-23', id: 4, parentId: 0 }
        ],
        dataSource = createDataSource(array, {}, { pageSize: 3 });

    //act
    this.applyOptions({
        scrolling: {
            mode: "virtual",
            preventPreload: true
        },
        dataSource: dataSource
    });

    //assert
    assert.equal(this.dataController.totalItemsCount(), 4, "totalItemsCount");
    items = this.dataController.items();
    assert.equal(items.length, 3, "count items");

    assert.equal(items[0].key, 1, "key of first item");
    assert.equal(items[1].key, 2, "key of second item");
    assert.equal(items[2].key, 3, "key of third item");
});

QUnit.test("Expand node when virtual scrolling enabled", function(assert) {
    //arrange
    var items,
        array = [
            { name: 'SubCategory1', phone: '55-66-77', id: 5, parentId: 2 },
            { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
            { name: 'Category2', phone: '98-75-21', id: 2, parentId: 0 },
            { name: 'Category3', phone: '98-75-22', id: 3, parentId: 0 },
            { name: 'Category4', phone: '98-75-23', id: 4, parentId: 0 }
        ],
        dataSource = createDataSource(array, {}, { pageSize: 3 });

    this.applyOptions({
        scrolling: {
            mode: "virtual",
            preventPreload: true
        },
        dataSource: dataSource
    });

    //act
    this.expandRow(2);

    //assert
    assert.equal(this.dataController.totalItemsCount(), 5, "totalItemsCount");
    items = this.dataController.items();
    assert.equal(items.length, 3, "count items");

    assert.equal(items[0].key, 1, "key of first item");
    assert.equal(items[1].key, 2, "key of second item");
    assert.equal(items[2].key, 5, "key of third item");
});

QUnit.test("Get total items count", function(assert) {
    //arrange
    this.applyOptions({
        dataSource: [
            { name: "Category1", phone: "55-55-55", id: 1, parentId: 0 },
            { name: "SubCategory1", phone: "35-35-35", id: 2, parentId: 1 },
            { name: "SubCategory2", phone: "45-45-45", id: 3, parentId: 1 }
        ]
    });

    //act
    this.dataController.load();

    //assert
    assert.equal(this.dataController.totalItemsCount(), 1, "count visible items");
    assert.equal(this.dataController.totalCount(), 3, "count all items");
});

QUnit.test("Getting key when there are keyExpr and store hasn't key", function(assert) {
    //arrange
    var array = [
        { name: 'SubCategory1', phone: '55-66-77', id: 3, parentId: 2 },
        { name: 'Category1', phone: '55-55-55', id: 1 },
        { name: 'Category2', phone: '98-75-21', id: 2 }
    ];

    //act
    this.applyOptions({
        dataSource: {
            load: function() {
                return $.Deferred().resolve(array);
            }
        }
    });

    //assert
    assert.equal(this.getDataSource().store().key(), undefined, "store hasn't key");
    assert.equal(this.keyOf(array[0]), 3, "key of first item");
});

//T511779
QUnit.test("The expandRowKeys should be not changed when loading data when there is a filter", function(assert) {
    //arrange
    var that = this,
        expandedRowKeys = [];

    //act
    that.applyOptions({
        dataSource: {
            store: {
                type: "array",
                data: [
                    { name: 'Category1', phone: '55-55-55', id: 1, parentId: 0 },
                    { name: 'SubCategory1', phone: '55-55-55', id: 2, parentId: 1 },
                    { name: 'Category2', phone: '98-75-21', id: 3, parentId: 0 },
                    { name: 'SubCategory2', phone: '55-66-77', id: 4, parentId: 3 },
                ],
                onLoading: function() {
                    expandedRowKeys = that.option("expandedRowKeys").slice(0);
                }
            },
            filter: ["name", "=", "SubCategory2"]
        },
        expandNodesOnFiltering: true,
        expandedRowKeys: [1]
    });

    //assert
    assert.deepEqual(expandedRowKeys, [1], "expandedRowKeys value when data isn't loaded");
    assert.deepEqual(that.option("expandedRowKeys"), [3], "expandedRowKeys value when data is loaded");
});


QUnit.module("Expand/Collapse nodes", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("Expand node (plain structure)", function(assert) {
    //arrange
    var items,
        array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ],
        dataSource = createDataSource(array);

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 1, "count items");
    assert.notOk(items[0].isExpanded, "first item is collapsed");

    //act
    this.expandRow(1);

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 2, "count items");
    assert.ok(items[0].isExpanded, "first item is expanded");
});

QUnit.test("Expand expanded node (plain structure)", function(assert) {
    //arrange
    var items,
        array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ],
        dataSource = createDataSource(array);

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    this.expandRow(1);

    //act
    this.expandRow(1);

    //assert
    items = this.dataController.items();
    assert.ok(this.isRowExpanded(1), "row is expanded");
    assert.equal(items.length, 2, "count items");
    assert.ok(items[0].isExpanded, "first item is expanded");
});

QUnit.test("Collapse node (plain structure)", function(assert) {
    //arrange
    var items,
        array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ],
        dataSource = createDataSource(array);

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 1, "count items");
    assert.notOk(items[0].isExpanded, "first item is collapsed");

    //arrange
    this.expandRow(1);

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 2, "count items");
    assert.ok(items[0].isExpanded, "first item is expanded");

    //act
    this.collapseRow(1);

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 1, "count items");
    assert.notOk(items[0].isExpanded, "first item is collapsed");
});

QUnit.test("Set expanded nodes by expandedRowKeys - first level", function(assert) {
    //arrange
    var items,
        array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ],
        dataSource = createDataSource(array);

    this.applyOptions({ expandedRowKeys: [1] });
    this.dataController.setDataSource(dataSource);
    dataSource.load();

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 2, "count items");
    assert.ok(items[0].isExpanded, "first item is expanded");
});

QUnit.test("Set expanded nodes by expandedRowKeys - internal level", function(assert) {
    //arrange
    var items,
        array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 },
            { name: 'SubCategory1-1', phone: '55-66-77', id: 3, parentId: 2 }
        ],
        dataSource = createDataSource(array);

    this.applyOptions({ expandedRowKeys: [2] });
    this.dataController.setDataSource(dataSource);
    dataSource.load();

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 1, "count items");
    assert.notOk(items[0].isExpanded, "first item is collapsed");

    //act
    this.expandRow(1);

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 3, "count items");
    assert.ok(items[0].isExpanded, "first item is expanded");
});

QUnit.test("Update expandedRowKeys", function(assert) {
    //arrange
    var array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ],
        dataSource = createDataSource(array);

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    //act
    this.expandRow(1);

    //assert
    assert.equal(this.dataController.option("expandedRowKeys").length, 1, "count of expanded items");
    assert.equal(this.dataController.option("expandedRowKeys")[0], 1, "first item is expanded");

    //act
    this.collapseRow(1);

    //assert
    assert.notOk(this.dataController.option("expandedRowKeys").length, "count of expanded items");
});

QUnit.test("Expand/collapse events", function(assert) {
    //arrange
    var that = this,
        events = [],
        options = [],
        array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ],
        dataSource = createDataSource(array);

    $.each(["onRowExpanding", "onRowExpanded", "onRowCollapsing", "onRowCollapsed"], function(index, name) {
        options[name] = function(e) {
            events.push({ name: name, key: e.key });
        };
    });
    that.applyOptions(options);
    that.dataController.setDataSource(dataSource);
    dataSource.load();

    //act
    that.expandRow(1);

    //assert
    var items = that.dataController.items();
    assert.strictEqual(items.length, 2, "count item");
    assert.deepEqual(events, [
        { name: "onRowExpanding", key: 1 },
        { name: "onRowExpanded", key: 1 }
    ], "expand events");

    //arrange
    events = [];

    //act
    that.collapseRow(1);

    //assert
    items = that.dataController.items();
    assert.strictEqual(items.length, 1);
    assert.deepEqual(events, [
        { name: "onRowCollapsing", key: 1 },
        { name: "onRowCollapsed", key: 1 }
    ], "collapse events");
});

QUnit.test("Cancel expand row on an expanding event", function(assert) {
    //arrange
    var that = this,
        array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ],
        dataSource = createDataSource(array);

    that.applyOptions({
        onRowExpanding: function(e) {
            e.cancel = true;
        }
    });
    that.dataController.setDataSource(dataSource);
    dataSource.load();

    //act
    that.expandRow(1);

    //assert
    var items = that.dataController.items();
    assert.equal(items.length, 1, "count item");
});

QUnit.test("Cancel collapse row on a collapsing event", function(assert) {
    //arrange
    var that = this,
        array = [
            { name: 'Category1', phone: '55-55-55', id: 1 },
            { name: 'SubCategory1', phone: '55-66-77', id: 2, parentId: 1 }
        ],
        dataSource = createDataSource(array);

    that.applyOptions({
        onRowCollapsing: function(e) {
            e.cancel = true;
        }
    });
    that.dataController.setDataSource(dataSource);
    dataSource.load();
    that.expandRow(1);

    //assert
    var items = that.dataController.items();
    assert.equal(items.length, 2, "count item");

    //act
    that.collapseRow(1);

    //assert
    items = that.dataController.items();
    assert.equal(items.length, 2, "count item");
});


QUnit.module("Sorting", { beforeEach: function() {
    this.items = [
        { id: 1, parentId: 0, name: "Name 3", age: 19 },
        { id: 2, parentId: 0, name: "Name 1", age: 19 },
        { id: 3, parentId: 0, name: "Name 2", age: 18 },
        { id: 4, parentId: 1, name: "Name 6", age: 16 },
        { id: 5, parentId: 1, name: "Name 5", age: 15 },
        { id: 6, parentId: 1, name: "Name 4", age: 15 }
    ];
    this.setupTreeList = function(options) {
        if(!("loadingTimeout" in options)) {
            options.loadingTimeout = null;
        }
        setupTreeListModules(this, ["data", "columns", "sorting"], {
            initDefaultOptions: true,
            options: options
        });
    };
}, afterEach: teardownModule });

QUnit.test("Initial sorting should be applied", function(assert) {
    //act
    this.setupTreeList({
        dataSource: this.items,
        columns: [{ dataField: "name", sortOrder: "asc" }, { dataField: "age" }]
    });

    //assert
    var items = this.dataController.items();
    assert.equal(items.length, 3, "count items");
    assert.equal(items[0].data.name, "Name 1", "item 0 name value");
    assert.equal(items[1].data.name, "Name 2", "item 1 name value");
    assert.equal(items[2].data.name, "Name 3", "item 2 name value");
});

QUnit.test("Initial sorting by several columns should be applied", function(assert) {
    //act
    this.setupTreeList({
        dataSource: this.items,
        columns: [{ dataField: "name", sortOrder: "asc", sortIndex: 1 }, { dataField: "age", sortOrder: "asc", sortIndex: 0 }]
    });

    //assert
    var items = this.dataController.items();
    assert.equal(items.length, 3, "count items");
    assert.equal(items[0].data.age, 18, "item 0 age value");
    assert.equal(items[0].data.name, "Name 2", "item 0 name value");
    assert.equal(items[1].data.age, 19, "item 0 age value");
    assert.equal(items[1].data.name, "Name 1", "item 1 name value");
    assert.equal(items[2].data.age, 19, "item 0 age value");
    assert.equal(items[2].data.name, "Name 3", "item 2 name value");
});

QUnit.test("Initial sorting for second level should be applied", function(assert) {
    this.setupTreeList({
        dataSource: this.items,
        columns: [{ dataField: "name", sortOrder: "asc" }, { dataField: "age" }]
    });

    //act
    this.expandRow(1);

    //assert
    var items = this.dataController.items();
    assert.equal(items.length, 6, "count items");
    assert.equal(items[3].data.name, "Name 4", "item 3 name value");
    assert.equal(items[4].data.name, "Name 5", "item 4 name value");
    assert.equal(items[5].data.name, "Name 6", "item 5 name value");
});

QUnit.test("sortOrder changing by columnOption should be applied", function(assert) {
    this.setupTreeList({
        dataSource: this.items
    });

    //act
    this.columnOption("name", "sortOrder", "desc");

    //assert
    var items = this.dataController.items();
    assert.equal(items.length, 3, "count items");
    assert.equal(items[0].data.name, "Name 3", "item 0 name value");
    assert.equal(items[1].data.name, "Name 2", "item 1 name value");
    assert.equal(items[2].data.name, "Name 1", "item 2 name value");
});


QUnit.module("Remote Operations", { beforeEach: function() {
    this.items = [
        { id: 1, parentId: 0, name: "Name 3", age: 19 },
        { id: 2, parentId: 0, name: "Name 1", age: 19 },
        { id: 3, parentId: 0, name: "Name 2", age: 18 },
        { id: 4, parentId: 1, name: "Name 6", age: 16 },
        { id: 5, parentId: 1, name: "Name 5", age: 15 },
        { id: 6, parentId: 2, name: "Name 4", age: 15 },
        { id: 7, parentId: 5, name: "Name 7", age: 19 }
    ];
    this.setupTreeList = function(options) {
        if(!("loadingTimeout" in options)) {
            options.loadingTimeout = null;
        }
        if(!("remoteOperations" in options)) {
            options.remoteOperations = true;
        }
        setupTreeListModules(this, ["data", "columns", "sorting"], {
            initDefaultOptions: true,
            options: options
        });
    };
    this.clock = sinon.useFakeTimers();
}, afterEach: teardownModule });

QUnit.test("Initial load with sorting", function(assert) {
    //arrange, act
    var loadingArgs = [];

    this.setupTreeList({
        dataSource: {
            store: {
                type: "array",
                data: this.items,
                onLoading: function(e) {
                    loadingArgs.push(e);
                }
            }
        },
        columns: [{ dataField: "name", sortOrder: "asc" }, { dataField: "age" }]
    });

    //assert
    assert.deepEqual(loadingArgs, [
        {
            filter: ["parentId", "=", 0],
            group: null,
            sort: [
                {
                    desc: false,
                    selector: "name"
                }
            ],
            parentIds: [0],
            userData: {}
        }
    ], "loading arguments");

    var items = this.dataController.items();
    assert.equal(items.length, 3, "count items");
    assert.equal(items[0].data.name, "Name 1", "item 0 name value");
    assert.equal(items[1].data.name, "Name 2", "item 1 name value");
    assert.equal(items[2].data.name, "Name 3", "item 2 name value");
});

QUnit.test("Initial load with second level expanded key when loading data on demand", function(assert) {
    //arrange, act
    var loadingArgs = [];

    var itemsByParentId = {
        "0": [{ id: 1, parentId: 0, name: "Name 1" }],
        "1": [{ id: 2, parentId: 1, name: "Name 2" }],
        "2": [{ id: 3, parentId: 2, name: "Name 3" }]
    };

    this.setupTreeList({
        expandedRowKeys: [2],
        remoteOperations: { filtering: true },
        dataSource: {
            load: function(loadOptions) {
                loadingArgs.push(loadOptions);
                var result = [];
                loadOptions.parentIds.forEach(function(parentId) {
                    var items = itemsByParentId[parentId];
                    if(items) {
                        result = result.concat(items);
                    }
                });

                return result;
            },
            useDefaultSearch: true
        }
    });

    //assert
    assert.deepEqual(loadingArgs, [{
        filter: [["parentId", "=", 0], "or", ["parentId", "=", 2]],
        parentIds: [0, 2],
        userData: {}
    }], "loading arguments");

    var items = this.dataController.items();
    assert.equal(items.length, 1, "count items");
    assert.equal(items[0].data.name, "Name 1", "item 0 name value");
});

QUnit.test("Change sort order if sorting is local", function(assert) {
    //arrange, act
    var loadingArgs = [];

    this.setupTreeList({
        remoteOperations: {
            filtering: true
        },
        dataSource: {
            store: {
                type: "array",
                data: this.items,
                onLoading: function(e) {
                    loadingArgs.push(e);
                }
            }
        },
        columns: [{ dataField: "name", sortOrder: "asc" }, { dataField: "age" }]
    });

    loadingArgs = [];

    //act
    this.columnOption("name", "sortOrder", "desc");

    //assert
    assert.deepEqual(loadingArgs, [], "no loadings during local sorting");

    var items = this.dataController.items();
    assert.equal(items.length, 3, "count items");
    assert.equal(items[0].data.name, "Name 3", "item 0 name value");
    assert.equal(items[1].data.name, "Name 2", "item 1 name value");
    assert.equal(items[2].data.name, "Name 1", "item 2 name value");
});

QUnit.test("Expand first row when there is sorting", function(assert) {
    //arrange
    var loadingArgs = [];

    this.setupTreeList({
        dataSource: {
            store: {
                type: "array",
                data: this.items,
                onLoading: function(e) {
                    loadingArgs.push(e);
                }
            }
        },
        columns: [{ dataField: "name", sortOrder: "asc" }, { dataField: "age" }]
    });
    loadingArgs = [];

    //act
    this.expandRow(1);

    //assert
    assert.deepEqual(loadingArgs, [
        {
            filter: ["parentId", "=", 1],
            group: null,
            sort: [
                {
                    desc: false,
                    selector: "name"
                }
            ],
            parentIds: [1],
            userData: {}
        }
    ], "loading arguments");

    var items = this.dataController.items();
    assert.equal(items.length, 5, "count items");
    assert.equal(items[0].data.name, "Name 1", "item 0 name value");
    assert.equal(items[1].data.name, "Name 2", "item 1 name value");
    assert.equal(items[2].data.name, "Name 3", "item 2 name value");
    assert.equal(items[3].data.name, "Name 5", "item 3 name value");
    assert.equal(items[4].data.name, "Name 6", "item 4 name value");
});

QUnit.test("Initial load when autoExpandAll", function(assert) {
    //arrange, act
    var loadingArgs = [];

    this.setupTreeList({
        autoExpandAll: true,
        dataSource: {
            store: {
                type: "array",
                data: this.items,
                onLoading: function(e) {
                    loadingArgs.push(e);
                }
            }
        }
    });

    //assert
    assert.equal(this.option("expandedRowKeys").length, 3, "expandedRowKeys is assigned");
    assert.deepEqual(loadingArgs, [
        {
            group: null,
            userData: {}
        }
    ], "loading arguments");

    var items = this.dataController.items();
    assert.equal(items.length, 7, "all items are visible");
    assert.equal(items[0].data.name, "Name 3", "item 1 name value");
    assert.equal(items[1].data.name, "Name 6", "item 2 name value");
    assert.equal(items[6].data.name, "Name 2", "item 7 name value");
});

QUnit.test("collapseRow when autoExpandAll", function(assert) {
    //arrange
    this.setupTreeList({
        autoExpandAll: true,
        dataSource: this.items
    });

    //act
    this.collapseRow(1);

    //assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 4, "all items are visible");
    assert.strictEqual(items[0].data.name, "Name 3", "item 1 name value");
    assert.strictEqual(items[0].isExpanded, false, "item 1 is not expanded");
});

QUnit.test("Initial load when dataSource has filter and filterMode is standard", function(assert) {
    //arrange, act
    var loadingArgs = [];

    this.setupTreeList({
        filterMode: "standard",
        dataSource: {
            store: {
                type: "array",
                data: this.items,
                onLoading: function(e) {
                    loadingArgs.push(e);
                }
            },
            filter: ["age", "=", 19]
        }
    });

    //assert
    assert.deepEqual(loadingArgs, [
        {
            filter: [["parentId", "=", 0], "and", ["age", "=", 19]],
            group: null,
            sort: null,
            parentIds: [0],
            userData: {}
        }
    ], "loading arguments");

    var items = this.dataController.items();
    assert.equal(items.length, 2, "count items");
    assert.equal(items[0].data.name, "Name 3", "item 1 name value");
    assert.equal(items[1].data.name, "Name 1", "item 2 name value");
});

QUnit.test("Initial load when dataSource has filter and filterMode is extended (default)", function(assert) {
    //arrange, act
    var loadingArgs = [];

    var arrayStore = new ArrayStore({
        data: this.items
    });

    this.setupTreeList({
        expandNodesOnFiltering: true,
        dataSource: {
            load: function(loadOptions) {
                var d = $.Deferred();
                loadingArgs.push(loadOptions);
                setTimeout(function() {
                    arrayStore.load(loadOptions).done(function(data) {
                        d.resolve(data);
                    }).fail(d.reject);
                }, 10);

                return d;
            },
            useDefaultSearch: true,
            filter: ["age", "=", 19]
        }
    });

    this.clock.tick(10);
    this.clock.tick(10);

    //assert
    assert.equal(this.option("expandedRowKeys").length, 2, "expandedRowKeys count");
    assert.deepEqual(loadingArgs, [{
        filter: ["age", "=", 19],
        group: null,
        sort: null,
        userData: {}
    }, {
        filter: ["id", "=", 5],
        group: null,
        sort: null,
        userData: {}
    }], "loading arguments");

    var items = this.dataController.items();
    assert.equal(items.length, 4, "count items");
    assert.equal(items[0].data.name, "Name 3", "item 1 name value");
    assert.equal(items[0].level, 0, "item 1 level");
    assert.equal(items[1].data.name, "Name 5", "item 2 name value");
    assert.equal(items[1].level, 1, "item 2 level");
    assert.equal(items[2].data.name, "Name 7", "item 3 name value");
    assert.equal(items[2].level, 2, "item 3 level");
    assert.equal(items[3].data.name, "Name 1", "item 4 name value");
    assert.strictEqual(items[3].node.hasChildren, false, "item 4 name hasChildren");
    assert.equal(items[3].node.children.length, 0, "item 4 name children length");
    assert.equal(items[3].level, 0, "item 4 level");
});

QUnit.test("Filter changing should expand nodes", function(assert) {
    //arrange, act
    this.setupTreeList({
        expandNodesOnFiltering: true,
        dataSource: this.items
    });

    //act
    var dataSource = this.getDataSource();

    dataSource.filter(["age", "=", 19]);
    dataSource.load();

    //assert
    assert.equal(this.option("expandedRowKeys").length, 2, "expandedRowKeys count");
    assert.equal(this.dataController.items().length, 4, "count items");
});

QUnit.test("Initial load when dataSource has filter and filterMode is extended (default) when remoteOperations false", function(assert) {
    //arrange, act
    var loadingArgs = [];

    this.setupTreeList({
        expandNodesOnFiltering: true,
        remoteOperations: false,
        dataSource: {
            store: {
                type: "array",
                data: this.items,
                onLoading: function(e) {
                    loadingArgs.push(e);
                }
            },
            filter: ["age", "=", 19]
        }
    });

    //assert
    assert.deepEqual(loadingArgs, [{
        userData: {}
    }], "loading arguments");

    var items = this.dataController.items();
    assert.equal(items.length, 4, "count items");
    assert.equal(items[0].data.name, "Name 3", "item 1 name value");
    assert.equal(items[0].level, 0, "item 1 level");
    assert.equal(items[1].data.name, "Name 5", "item 2 name value");
    assert.equal(items[1].level, 1, "item 2 level");
    assert.equal(items[2].data.name, "Name 7", "item 3 name value");
    assert.equal(items[2].level, 2, "item 3 level");
    assert.equal(items[3].data.name, "Name 1", "item 4 name value");
    assert.strictEqual(items[3].node.hasChildren, false, "item 4 name hasChildren");
    assert.equal(items[3].node.children.length, 1, "item 4 name children length");
    assert.strictEqual(items[3].node.children[0].visible, false, "item 4 name children 0 visible");
    assert.equal(items[3].level, 0, "item 4 level");
});

QUnit.test("Initial load when dataSource has filter and allow expand filtered items in onNodesInitialized", function(assert) {
    //arrange, act
    this.setupTreeList({
        expandNodesOnFiltering: true,
        remoteOperations: false,
        dataSource: {
            store: this.items,
            filter: ["age", "=", 19]
        },
        columns: [{ dataField: "age", dataType: "number" }], //TODO
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

    //assert
    assert.deepEqual(this.option("expandedRowKeys"), [5, 1], "expandedRowKeys");
    var items = this.dataController.items();
    assert.equal(items.length, 4, "count items");
    assert.strictEqual(items[3].node.hasChildren, true, "item 4 name hasChildren");
    assert.equal(items[3].node.children.length, 1, "item 4 name children length");
    assert.strictEqual(items[3].node.children[0].visible, true, "item 4 name children 0 visible");

    //act
    this.expandRow(items[3].key);

    //assert
    assert.deepEqual(this.option("expandedRowKeys"), [5, 1, 2], "expandedRowKeys");
    items = this.dataController.items();
    assert.equal(items.length, 5, "count items");
    assert.strictEqual(items[4].node.parent, items[3].node, "item 5 is child of item 4");
});

QUnit.test("Initial load when dataSource has filter and allow expand filtered items and expand they in onNodesInitialized", function(assert) {
    //arrange, act
    var isExpanding = false,
        that = this;

    this.setupTreeList({
        expandNodesOnFiltering: true,
        remoteOperations: false,
        dataSource: {
            store: this.items,
            filter: ["age", "=", 19]
        },
        columns: [{ dataField: "age", dataType: "number" }], //TODO
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

    //assert
    assert.deepEqual(this.option("expandedRowKeys"), [5, 1, 2], "expandedRowKeys");
    var items = this.dataController.items();
    assert.equal(items.length, 5, "count items");
    assert.strictEqual(items[4].node.parent, items[3].node, "item 5 is child of item 4");

    //act
    this.collapseRow(items[3].key);

    //assert
    assert.deepEqual(this.option("expandedRowKeys"), [5, 1], "expandedRowKeys");
    items = this.dataController.items();
    assert.equal(items.length, 4, "count items");
    assert.strictEqual(items[3].node.hasChildren, true, "item 4 name hasChildren");
    assert.equal(items[3].node.children.length, 1, "item 4 name children length");
    assert.strictEqual(items[3].node.children[0].visible, true, "item 4 name children 0 visible");
});

QUnit.test("Initial load when expandNodesOnFiltering and no filter", function(assert) {
    //arrange, act
    this.setupTreeList({
        expandNodesOnFiltering: true,
        dataSource: this.items
    });

    //assert
    var items = this.dataController.items();
    assert.equal(items.length, 3, "only first level items are visible");
});

QUnit.test("Initial load when expandNodesOnFiltering and dataSource has filter and filterMode is smart", function(assert) {
    //arrange, act
    this.setupTreeList({
        filterMode: "smart",
        expandNodesOnFiltering: true,
        dataSource: {
            store: this.items,
            filter: ["age", "=", 19]
        }
    });

    //assert
    var items = this.dataController.items();
    assert.equal(items.length, 3, "count items");
    assert.equal(items[0].data.name, "Name 3", "item 1 name value");
    assert.equal(items[0].level, 0, "item 1 level");
    assert.equal(items[1].data.name, "Name 7", "item 2 name value");
    assert.equal(items[1].level, 1, "item 2 level");
    assert.equal(items[1].node.level, 2, "item 2 node level");
    assert.equal(items[2].data.name, "Name 1", "item 3 name value");
    assert.equal(items[2].level, 0, "item 3 level");
});

QUnit.test("Initial load dataSource has filter and filterMode smart is emulated using onNodesInitialized", function(assert) {
    //arrange, act
    var that = this;
    this.setupTreeList({
        onNodesInitialized: function(e) {
            var filter = that.getCombinedFilter();

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
            filter: ["age", "=", 19]
        }
    });

    //assert
    var items = this.dataController.items();
    assert.equal(items.length, 3, "count items");
    assert.equal(items[0].data.name, "Name 3", "item 1 name value");
    assert.equal(items[0].level, 0, "item 1 level");
    assert.equal(items[1].data.name, "Name 7", "item 2 name value");
    assert.equal(items[1].level, 1, "item 2 level");
    assert.equal(items[1].node.level, 2, "item 2 node level");
    assert.equal(items[2].data.name, "Name 1", "item 3 name value");
    assert.equal(items[2].level, 0, "item 3 level");
});

QUnit.test("Initial load when expandNodesOnFiltering disabled and dataSource has filter and filterMode is smart", function(assert) {
    //arrange, act
    this.setupTreeList({
        filterMode: "smart",
        expandNodesOnFiltering: false,
        dataSource: {
            store: this.items,
            filter: ["age", "=", 19]
        }
    });

    //assert
    var items = this.dataController.items();
    assert.equal(items.length, 2, "count items");
    assert.equal(items[0].data.name, "Name 3", "item 1 name value");
    assert.equal(items[0].level, 0, "item 1 level");
    assert.equal(items[1].data.name, "Name 1", "item 2 name value");
    assert.equal(items[1].level, 0, "item 2 level");
});

QUnit.test("Initial load when dataSource has filter and filterMode is smart and root nodes area hidden", function(assert) {
    //arrange, act
    this.setupTreeList({
        filterMode: "smart",
        expandNodesOnFiltering: true,
        dataSource: {
            store: {
                type: "array",
                data: this.items
            },
            filter: ["age", "<", 19]
        }
    });

    //assert
    var items = this.dataController.items();
    assert.equal(items.length, 4, "count items");
    assert.equal(items[0].data.name, "Name 2", "item 1 name value");
    assert.equal(items[0].level, 0, "item 1 level");
    assert.equal(items[1].data.name, "Name 6", "item 2 name value");
    assert.equal(items[1].level, 0, "item 2 level");
    assert.equal(items[2].data.name, "Name 5", "item 3 name value");
    assert.equal(items[2].level, 0, "item 3 level");
    assert.equal(items[3].data.name, "Name 4", "item 4 name value");
    assert.equal(items[3].level, 0, "item 4 level");
});

QUnit.test("Initial load when filterMode is smart and remoteOperations is false", function(assert) {
    //arrange, act
    this.setupTreeList({
        filterMode: "smart",
        expandNodesOnFiltering: true,
        remoteOperations: false,
        dataSource: {
            store: this.items,
            filter: ["age", "=", 19]
        }
    });

    //assert
    var items = this.dataController.items();
    assert.equal(items.length, 3, "count items");
    assert.equal(items[0].data.name, "Name 3", "item 1 name value");
    assert.equal(items[0].level, 0, "item 1 level");
    assert.equal(items[1].data.name, "Name 7", "item 2 name value");
    assert.equal(items[1].level, 1, "item 2 level");
    assert.equal(items[2].data.name, "Name 1", "item 3 name value");
    assert.equal(items[2].level, 0, "item 3 level");
});

//T515374
QUnit.test("Initial load when dataSource has filter whose length is more than available (filterMode is extended)", function(assert) {
    //arrange, act
    var loadingArgs = [];

    var arrayStore = new ArrayStore({
        data: this.items
    });

    this.setupTreeList({
        maxFilterLengthInRequest: 0,
        expandNodesOnFiltering: true,
        dataSource: {
            load: function(loadOptions) {
                var d = $.Deferred();
                loadingArgs.push(loadOptions);
                setTimeout(function() {
                    arrayStore.load(loadOptions).done(function(data) {
                        d.resolve(data);
                    }).fail(d.reject);
                }, 10);

                return d;
            },
            useDefaultSearch: true,
            filter: ["age", "=", 19]
        }
    });

    this.clock.tick(10);
    this.clock.tick(10);

    //assert
    assert.equal(this.option("expandedRowKeys").length, 2, "expandedRowKeys count");
    assert.deepEqual(loadingArgs, [{
        filter: ["age", "=", 19],
        group: null,
        sort: null,
        userData: {}
    }, {
        filter: null,
        group: null,
        sort: null,
        userData: {}
    }], "loading arguments");

    var items = this.dataController.items();
    assert.equal(items.length, 4, "count items");
    assert.equal(items[0].data.name, "Name 3", "item 1 name value");
    assert.equal(items[0].level, 0, "item 1 level");
    assert.equal(items[1].data.name, "Name 5", "item 2 name value");
    assert.equal(items[1].level, 1, "item 2 level");
    assert.equal(items[2].data.name, "Name 7", "item 3 name value");
    assert.equal(items[2].level, 2, "item 3 level");
    assert.equal(items[3].data.name, "Name 1", "item 4 name value");
    assert.strictEqual(items[3].node.hasChildren, false, "item 4 name hasChildren");
    assert.equal(items[3].node.children.length, 0, "item 4 name children length");
    assert.equal(items[3].level, 0, "item 4 level");
});

//T515374
QUnit.test("Initial load when dataSource has filter whose length is more than available when remoteOperations false (filterMode is extended)", function(assert) {
    //arrange, act
    var loadingArgs = [];

    var arrayStore = new ArrayStore({
        data: this.items
    });

    this.setupTreeList({
        maxFilterLengthInRequest: 0,
        remoteOperations: false,
        expandNodesOnFiltering: true,
        dataSource: {
            load: function(loadOptions) {
                var d = $.Deferred();
                loadingArgs.push(loadOptions);
                setTimeout(function() {
                    arrayStore.load(loadOptions).done(function(data) {
                        d.resolve(data);
                    }).fail(d.reject);
                }, 10);

                return d;
            },
            useDefaultSearch: true,
            filter: ["age", "=", 19]
        }
    });

    this.clock.tick(10);
    this.clock.tick(10);

    //assert
    assert.equal(this.option("expandedRowKeys").length, 2, "expandedRowKeys count");
    assert.deepEqual(loadingArgs, [{
        userData: {}
    }], "loading arguments");

    var items = this.dataController.items();
    assert.equal(items.length, 4, "count items");
    assert.equal(items[0].data.name, "Name 3", "item 1 name value");
    assert.equal(items[0].level, 0, "item 1 level");
    assert.equal(items[1].data.name, "Name 5", "item 2 name value");
    assert.equal(items[1].level, 1, "item 2 level");
    assert.equal(items[2].data.name, "Name 7", "item 3 name value");
    assert.equal(items[2].level, 2, "item 3 level");
    assert.equal(items[3].data.name, "Name 1", "item 4 name value");
    assert.strictEqual(items[3].node.hasChildren, false, "item 4 name hasChildren");
    assert.equal(items[3].node.children.length, 1, "item 4 name children length");
    assert.strictEqual(items[3].node.children[0].visible, false, "item 4 name children 0 visible");
    assert.equal(items[3].level, 0, "item 4 level");
});

QUnit.test("expand -> collapse -> expand row", function(assert) {
    //arrange
    var items,
        loadingArgs = [];

    this.setupTreeList({
        dataSource: {
            store: {
                type: "array",
                data: this.items,
                onLoading: function(e) {
                    loadingArgs.push(e);
                }
            }
        }
    });
    loadingArgs = [];

    //act
    this.expandRow(1);

    //assert
    assert.equal(loadingArgs.length, 1, "count load");
    assert.deepEqual(loadingArgs, [
        {
            filter: ["parentId", "=", 1],
            group: null,
            sort: null,
            parentIds: [1],
            userData: {}
        }
    ], "loading arguments");

    items = this.dataController.items();
    assert.equal(items.length, 5, "count items");

    //act
    this.collapseRow(1);

    //assert
    assert.equal(loadingArgs.length, 1, "count load");
    items = this.dataController.items();
    assert.equal(items.length, 3, "count items");

    //act
    this.expandRow(1);

    //assert
    assert.equal(loadingArgs.length, 1, "count load");
    items = this.dataController.items();
    assert.equal(items.length, 5, "count items");
});

QUnit.test("Checking the 'hasChildren' property of the node", function(assert) {
    //arrange, act
    this.setupTreeList({
        dataSource: this.items
    });

    //assert
    assert.ok(this.dataController.items()[0].node.hasChildren, "first item has children");
});

QUnit.test("Checking the 'hasChildren' property of the node after expand", function(assert) {
    //arrange
    this.setupTreeList({
        dataSource: this.items
    });

    //assert
    assert.ok(this.dataController.items()[2].node.hasChildren, "third item has children");

    //act
    this.expandRow(3);

    //assert
    assert.notOk(this.dataController.items()[2].node.hasChildren, "third item hasn't children");
});

QUnit.test("Checking the 'hasChildren' property of the node when it specified", function(assert) {
    //arrange
    this.items[2].hasItems = false;
    this.setupTreeList({
        dataSource: this.items,
        hasItemsExpr: "hasItems"
    });

    //assert
    assert.notOk(this.dataController.items()[2].node.hasChildren, "third item hasn't children");
});


QUnit.module("Load data on demand", { beforeEach: function() {
    this.setupTreeList = function(options) {
        if(!("loadingTimeout" in options)) {
            options.loadingTimeout = null;
        }
        if(!("remoteOperations" in options)) {
            options.remoteOperations = {
                filtering: true
            };
        }
        setupTreeListModules(this, ["data", "columns"], {
            initDefaultOptions: true,
            options: options
        });
    };
}, afterEach: teardownModule });

QUnit.test("Initialize load", function(assert) {
    //arrange, act
    var loadOptions = [];

    this.setupTreeList({
        dataSource: {
            load: function(e) {
                var d = $.Deferred(),
                    nodes = [],
                    parentIds = e.parentIds;

                if(parentIds) {
                    for(var i = 0; i < parentIds.length; i++) {
                        nodes.push({ id: i + 1, parentId: parentIds[i], field1: "test1", field2: "test2", field3: "test3" });
                        nodes.push({ id: i + 2, parentId: parentIds[i], field1: "test4", field2: "test5", field3: "test6" });
                    }
                }

                loadOptions.push(e);

                return d.resolve(nodes);
            }
        }
    });

    //assert
    var items = this.dataController.items();
    assert.deepEqual(loadOptions[0].parentIds, [0], "parentIds");
    assert.equal(items.length, 2, "count item");
});

QUnit.test("Expand row", function(assert) {
    //arrange
    var items,
        loadOptions = [],
        data = {
            0: [
                { id: 1, parentId: 0, field1: "test1", field2: "test2", field3: "test3" },
                { id: 2, parentId: 0, field1: "test4", field2: "test5", field3: "test6" }
            ],
            2: [{ id: 3, parentId: 2, field1: "test7", field2: "test8", field3: "test9" }]
        };

    this.setupTreeList({
        dataSource: {
            load: function(e) {
                var d = $.Deferred(),
                    result = [],
                    parentIds = e.parentIds;

                if(parentIds) {
                    for(var i = 0; i < parentIds.length; i++) {
                        result.push.apply(result, data[parentIds[i]]);
                    }
                }

                loadOptions.push(e);

                return d.resolve(result);
            }
        }
    });

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 2, "count item");
    assert.deepEqual(loadOptions[0].parentIds, [0], "parentIds");

    //act
    this.expandRow(2);

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 3, "count item");
    assert.deepEqual(loadOptions[1].parentIds, [2], "parentIds");
});
