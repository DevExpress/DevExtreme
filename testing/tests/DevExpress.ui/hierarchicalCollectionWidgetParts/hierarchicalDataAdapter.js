var $ = require("jquery"),
    HierarchicalDataAdapter = require("ui/hierarchical_collection/ui.data_adapter"),
    dataUtils = require("data/utils"),
    assets = require("./hierarchicalCollectionWidget.testAssets.js"),
    errors = require("ui/widget/ui.errors"),
    initDataAdapter = assets.initDataAdapter;

var moduleConfig = {
    beforeEach: function() {
        this.treeDataWithoutKeys = $.extend(true, [], assets.treeDataWithoutKeys);
        this.treeDataWithKeys = $.extend(true, [], assets.treeDataWithKeys);
        this.plainData = $.extend(true, [], assets.simplePlainData);
        this.randomData = $.extend(true, [], assets.simplePlainData).reverse();
        this.treeNodes = $.extend(true, [], assets.treeNodes);
        this.treeNodesWithoutKeys = $.extend(true, [], assets.treeNodesWithoutKeys);

        var User = function(text, items) {
            this.text = text;
            this.items = items;
        };

        this.treeDataWithObjects = [
            new User("Item 1", [
                new User("Item 11"),
                new User("Item 12")
            ]),
            new User("Item 2")
        ];
    }
};


QUnit.module("plain structure", moduleConfig);

QUnit.test("all items should be converted", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" }),
        data = dataAdapter.getData();

    assert.equal(data.length, 7, "all items was converted");
});

QUnit.test("parent keys should be correct", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" }),
        data = dataAdapter.getData();

    assert.equal(data[0].internalFields.parentKey, 0);
    assert.equal(data[2].internalFields.parentKey, 1);
    assert.equal(data[3].internalFields.parentKey, 2);
});

QUnit.test("children keys should be correct", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" }),
        data = dataAdapter.getData();

    assert.deepEqual(data[0].internalFields.childrenKeys, [2, 3]);
    assert.deepEqual(data[1].internalFields.childrenKeys, [4, 5]);
});

QUnit.test("items should be correct", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" }),
        data = dataAdapter.getData();

    assert.deepEqual(data[0].internalFields.item, this.plainData[0]);
    assert.deepEqual(data[1].internalFields.item, this.plainData[1]);
});

QUnit.test("item fields should exist in the node", function(assert) {
    this.plainData[0].custom = "Custom item field";

    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" }),
        data = dataAdapter.getData();

    assert.equal(data[0].custom, "Custom item field");
});

QUnit.test("data adapter should throw an error when id is not unique", function(assert) {
    assert.throws(
        function() {
            initDataAdapter({
                items: [{ id: 1, text: "Item 1" }, { id: 1, text: "Item 11" }],
                dataType: "plain"
            });
        },
        errors.Error("E1040", "1"),
        "raised error is correct"
    );
});

QUnit.test("assessor fields should exist even they are not exist in the item", function(assert) {
    delete this.plainData[0].selected;
    delete this.plainData[0].expanded;
    delete this.plainData[0].disabled;

    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" }),
        data = dataAdapter.getData();

    assert.strictEqual(data[0].internalFields.selected, false, "selected exist");
    assert.strictEqual(data[0].internalFields.expanded, false, "expanded exist");
    assert.strictEqual(data[0].internalFields.disabled, false, "disabled exist");
});

QUnit.test("public node should exist in internalFields", function(assert) {

    var dataAdapter = initDataAdapter({ items: this.treeDataWithKeys }),
        data = dataAdapter.getData();

    assert.ok(Object.keys(data[0].internalFields.publicNode).length, "publicNode is not empty");
});


QUnit.module("tree structure with keys", moduleConfig);

QUnit.test("all items should be converted", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithKeys }),
        data = dataAdapter.getData();

    assert.equal(data.length, 7, "all items was converted");
});

QUnit.test("parent keys should be correct", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithKeys }),
        data = dataAdapter.getData();

    assert.equal(data[0].internalFields.parentKey, 0);
    assert.equal(data[1].internalFields.parentKey, 1);
    assert.equal(data[2].internalFields.parentKey, 2);
});

QUnit.test("children keys should be correct", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithKeys }),
        data = dataAdapter.getData();

    assert.deepEqual(data[0].internalFields.childrenKeys, [2, 5]);
    assert.deepEqual(data[1].internalFields.childrenKeys, [3, 4]);
});

QUnit.test("items should be correct", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithKeys }),
        data = dataAdapter.getData();

    assert.deepEqual(data[0].internalFields.item, this.treeDataWithKeys[0]);
    assert.deepEqual(data[1].internalFields.item, this.treeDataWithKeys[0].items[0]);
});

QUnit.test("item fields should exist in the node", function(assert) {
    this.treeDataWithKeys[0].custom = "Custom item field";

    var dataAdapter = initDataAdapter({ items: this.treeDataWithKeys }),
        data = dataAdapter.getData();

    assert.equal(data[0].custom, "Custom item field");
});

QUnit.test("assessor fields should exist even they are not exist in the item", function(assert) {
    delete this.plainData[0].selected;
    delete this.plainData[0].expanded;
    delete this.plainData[0].disabled;

    var dataAdapter = initDataAdapter({ items: this.treeDataWithKeys }),
        data = dataAdapter.getData();

    assert.strictEqual(data[0].internalFields.selected, false, "selected exist");
    assert.strictEqual(data[0].internalFields.expanded, false, "expanded exist");
    assert.strictEqual(data[0].internalFields.disabled, false, "disabled exist");
});

QUnit.test("public node should exist in internalFields", function(assert) {

    var dataAdapter = initDataAdapter({ items: this.treeDataWithKeys }),
        data = dataAdapter.getData();

    assert.ok(Object.keys(data[0].internalFields.publicNode).length, "publicNode is not empty");
});

QUnit.test("dataAdapter should work correct with circular data", function(assert) {
    var parent = {
            id: 1,
            items: []
        },
        child1 = {
            id: 11,
            parent: parent
        };

    parent.items.push(child1);

    var dataAdapter = initDataAdapter({ items: [parent] }),
        data = dataAdapter.getData();

    assert.equal(data.length, 2, "circular items were converted");
});

QUnit.module("tree structure without keys", moduleConfig);

QUnit.test("all items should be converted", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithoutKeys }),
        data = dataAdapter.getData();

    assert.equal(data.length, 7, "all items was converted");
});

QUnit.test("parent keys should be correct", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithoutKeys }),
        data = dataAdapter.getData();

    assert.equal(data[0].internalFields.parentKey, 0);
    assert.equal(data[1].internalFields.parentKey, 1);
    assert.equal(data[2].internalFields.parentKey, 2);
});

QUnit.test("children keys should be correct", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithoutKeys }),
        data = dataAdapter.getData();

    assert.deepEqual(data[0].internalFields.childrenKeys, [2, 5]);
    assert.deepEqual(data[1].internalFields.childrenKeys, [3, 4]);
});

QUnit.test("items should be correct", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithoutKeys }),
        data = dataAdapter.getData();

    assert.deepEqual(data[0].internalFields.item, this.treeDataWithoutKeys[0]);
    assert.deepEqual(data[1].internalFields.item, this.treeDataWithoutKeys[0].items[0]);
});

QUnit.test("item fields should exist in the node", function(assert) {
    this.treeDataWithoutKeys[0].custom = "Custom item field";

    var dataAdapter = initDataAdapter({ items: this.treeDataWithoutKeys }),
        data = dataAdapter.getData();

    assert.equal(data[0].custom, "Custom item field");
});

QUnit.test("assessor fields should exist even they are not exist in the item", function(assert) {
    delete this.treeDataWithoutKeys[0].selected;
    delete this.treeDataWithoutKeys[0].expanded;
    delete this.treeDataWithoutKeys[0].disabled;

    var dataAdapter = initDataAdapter({ items: this.treeDataWithoutKeys }),
        data = dataAdapter.getData();

    assert.strictEqual(data[0].internalFields.selected, false, "selected exist");
    assert.strictEqual(data[0].internalFields.expanded, false, "expanded exist");
    assert.strictEqual(data[0].internalFields.disabled, false, "disabled exist");
});

QUnit.test("public node should exist in internalFields", function(assert) {

    var dataAdapter = initDataAdapter({ items: this.treeDataWithoutKeys }),
        data = dataAdapter.getData();

    assert.ok(Object.keys(data[0].internalFields.publicNode).length, "publicNode is not empty");
});


QUnit.module("tree structure with object instances", moduleConfig);

QUnit.test("all items should be converted", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithObjects }),
        data = dataAdapter.getData();

    assert.equal(data.length, 4, "all items was converted");
});

QUnit.test("parent keys should be correct", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithObjects }),
        data = dataAdapter.getData();

    assert.equal(data[0].internalFields.parentKey, 0);
    assert.equal(data[1].internalFields.parentKey, 1);
    assert.equal(data[2].internalFields.parentKey, 1);
});

QUnit.test("children keys should be correct", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithObjects }),
        data = dataAdapter.getData();

    assert.deepEqual(data[0].internalFields.childrenKeys, [2, 3]);
    assert.deepEqual(data[1].internalFields.childrenKeys, []);
});

QUnit.test("items should be correct", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithObjects }),
        data = dataAdapter.getData();

    assert.deepEqual(data[0].internalFields.item, this.treeDataWithObjects[0]);
    assert.deepEqual(data[1].internalFields.item, this.treeDataWithObjects[0].items[0]);
});

QUnit.test("item fields should exist in the node", function(assert) {
    this.treeDataWithObjects[0].custom = "Custom item field";

    var dataAdapter = initDataAdapter({ items: this.treeDataWithObjects }),
        data = dataAdapter.getData();

    assert.equal(data[0].custom, "Custom item field");
});

QUnit.test("assessor fields should exist even they are not exist in the item", function(assert) {
    delete this.treeDataWithObjects[0].selected;
    delete this.treeDataWithObjects[0].expanded;
    delete this.treeDataWithObjects[0].disabled;

    var dataAdapter = initDataAdapter({ items: this.treeDataWithObjects }),
        data = dataAdapter.getData();

    assert.strictEqual(data[0].internalFields.selected, false, "selected exist");
    assert.strictEqual(data[0].internalFields.expanded, false, "expanded exist");
    assert.strictEqual(data[0].internalFields.disabled, false, "disabled exist");
});

QUnit.test("public node should exist in internalFields", function(assert) {

    var dataAdapter = initDataAdapter({ items: this.treeDataWithObjects }),
        data = dataAdapter.getData();

    assert.ok(Object.keys(data[0].internalFields.publicNode).length, "publicNode is not empty");
});


QUnit.module("public methods", moduleConfig);

QUnit.test("getTreeNodes", function(assert) {
    this.plainData[3].isSelected = true;
    this.plainData[5].isSelected = true;

    this.plainData[6].isDisabled = true;
    this.plainData[4].isDisabled = true;

    this.plainData[0].isExpanded = true;
    this.plainData[1].isExpanded = true;

    var accessors = {
            getters: {
                selected: function(item) { return item.isSelected; },
                display: function(item) { return item.caption; },
                expanded: function(item) { return item.isExpanded; },
                disabled: function(item) { return item.isDisabled; },
                parentKey: function(item) { return item.parentId; },
                key: function(item) { return item.id; },
                items: function(item) { return item.items; }
            },
            setters: {
                selected: function(item, value) { item.isSelected = value; },
                display: function(item, value) { item.caption = value; },
                expanded: function(item, value) { item.isExpanded = value; },
                disabled: function(item, value) { item.isDisabled = value; },
                parentKey: function(item, value) { item.parentId = value; },
                key: function(item, value) { item.id = value; },
                items: function(item, value) { item.items = value; }
            }
        },
        dataAdapter = initDataAdapter({ items: this.plainData, dataAccessors: accessors, recursiveSelection: true, dataType: "plain" }),
        nodes = dataAdapter.getTreeNodes();

    assert.ok(nodes[0].itemData.isExpanded, "node is expanded");
    assert.ok(nodes[0].children[0].itemData.isExpanded, "node is expanded");

    assert.ok(nodes[0].children[0].children[0].itemData.isSelected, "node is selected");
    assert.strictEqual(nodes[0].children[0].itemData.isSelected, undefined, "node is in undetermined state");
    assert.ok(nodes[1].itemData.isSelected, "node is selected");

    assert.ok(nodes[1].children[0].itemData.isDisabled, "node is disabled");
    assert.ok(nodes[0].children[0].children[1].itemData.isDisabled, "node is disabled");

});

QUnit.test("getTreeNodes if data was without keys", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithoutKeys }),
        treeNodes = dataAdapter.getTreeNodes();

    assert.equal(treeNodes[0].key, 1);
    assert.equal(treeNodes[1].key, 6);
    assert.equal(treeNodes.length, 2);
    assert.equal(treeNodes[0].children[0].children[0].key, 3);
    assert.equal(treeNodes[0].children[0].children.length, 2);
    assert.equal(treeNodes[0].children.length, 2);
});

QUnit.test("getSelectedNodesKeys", function(assert) {
    this.plainData[3].selected = true;
    this.plainData[5].selected = true;

    var dataAdapter = initDataAdapter({
            items: this.plainData,
            recursiveSelection: true,
            dataType: "plain"
        }),
        selectedNodes = [4, 6, 7];

    assert.deepEqual(dataAdapter.getSelectedNodesKeys(), selectedNodes, "selected keys are correct");
});

QUnit.test("getExpandedNodesKeys", function(assert) {
    this.plainData[1].expanded = true;
    this.plainData[2].expanded = true;
    this.plainData[4].expanded = true;

    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" }),
        expandedNodes = [2, 3, 5];

    assert.deepEqual(dataAdapter.getExpandedNodesKeys(), expandedNodes, "expanded keys are correct");
});

QUnit.test("getNodeByItem", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" }),
        node = dataAdapter.getNodeByItem(this.plainData[1]);

    assert.deepEqual(node.text, "Item 11", "node is correct");
});

QUnit.test("getNodesByItems", function(assert) {
    var items = this.plainData,
        dataAdapter = initDataAdapter({ items: items, dataType: "plain" }),
        nodes = dataAdapter.getNodesByItems(this.plainData);

    for(var i = 0, n = this.plainData.length; i < n; i++) {
        assert.deepEqual(nodes[i].internalFields.item, items[i], "nodes[i] is correct");
    }
});

QUnit.test("getNodeByKey", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" }),
        node = dataAdapter.getNodeByKey(2);

    assert.deepEqual(node.text, "Item 11", "node is correct");
});

QUnit.test("getItemsCount", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" });

    assert.equal(dataAdapter.getItemsCount(), this.plainData.length, "items count is correct");
});

QUnit.test("getVisibleItemsCount", function(assert) {
    this.plainData[3].visible = false;
    var dataAdapter = initDataAdapter({ items: this.plainData });

    assert.equal(dataAdapter.getVisibleItemsCount(), this.plainData.length - 1, "items count is correct");
});

QUnit.test("isAllSelected", function(assert) {

    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" });
    assert.strictEqual(dataAdapter.isAllSelected(), false, "nothing is selected");

    $.each(this.plainData, function(_, item) { item.selected = true; });

    dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" });
    assert.strictEqual(dataAdapter.isAllSelected(), true, "all items are selected");

    this.plainData[1].selected = false;
    dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" });
    assert.strictEqual(dataAdapter.isAllSelected(), undefined, "not all items are selected");
});

QUnit.test("selectAll", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" });

    dataAdapter.toggleSelectAll(true);
    assert.ok(dataAdapter.isAllSelected(), "all items are selected");

    dataAdapter.toggleSelectAll(false);
    assert.strictEqual(dataAdapter.isAllSelected(), false, "nothing is selected");

    dataAdapter.toggleSelectAll(undefined);
    assert.strictEqual(this.plainData[1].selected, false, "undefined state change nothing");
});

QUnit.test("toggleSelection", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" });

    dataAdapter.toggleSelection(2, true);
    assert.ok(this.plainData[1].selected, "item was selected");

    dataAdapter.toggleSelection(2, false);
    assert.strictEqual(this.plainData[1].selected, false, "item was unselected");

    dataAdapter.toggleSelection(2, undefined);
    assert.strictEqual(this.plainData[1].selected, undefined, "item was set to undefined state");
});

QUnit.test("toggleNodeDisabledState", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" });

    dataAdapter.toggleNodeDisabledState(2, true);
    assert.ok(this.plainData[1].disabled, "item was disabled");

    dataAdapter.toggleNodeDisabledState(2, false);
    assert.strictEqual(this.plainData[1].disabled, false, "item was enabled");
});

QUnit.test("toggleNodeDisabledState with expressions", function(assert) {
    var dataAdapter = initDataAdapter({
        items: this.plainData,
        dataType: "plain",
        dataAccessors: assets.customAccessors
    });

    dataAdapter.toggleNodeDisabledState(2, true);
    assert.ok(this.plainData[1].disable, "item was disabled");

    dataAdapter.toggleNodeDisabledState(2, false);
    assert.strictEqual(this.plainData[1].disable, false, "item was enabled");
});

QUnit.test("items accessor should be ignored if dataStructure is plain", function(assert) {
    var dataAdapter = initDataAdapter({
        items: [
            { id: 1, parentId: 0, text: "Item 1", items: [{ id: 11, parentId: 1, text: "Item 11" }] },
            { id: 2, parentId: 0, text: "Item 2" }
        ],
        dataType: "plain"
    });

    assert.equal(dataAdapter.getData().length, 2, "inner item should not be converted");
});

QUnit.test("getRootNodes", function(assert) {
    var items = [];

    for(var i = 1; i <= 100; i++) {
        items.push({
            id: i,
            text: i.toString()
        });
    }

    items[0].items = [{ id: 200, text: "child" }];

    var dataAdapter = initDataAdapter({ items: items });

    assert.equal(dataAdapter.getData().length, 101);
    assert.equal(dataAdapter.getRootNodes().length, 100);
});

QUnit.test("getRootNodes with deferred datasource (T310879)", function(assert) {
    var items = [{ id: 1, text: "item 1" }];
    var dataAdapter = initDataAdapter({ items: items });
    try {
        dataUtils.processRequestResultLock.obtain();
        assert.equal(dataAdapter.getRootNodes().length, 1);
    } finally {
        dataUtils.processRequestResultLock.release();
    }
});

QUnit.test("getChildrenNodes", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" }),
        children = dataAdapter.getChildrenNodes(1);

    assert.equal(children.length, 2, "nodes count is correct");
    assert.equal(children[0].internalFields.key, 2, "first node");
    assert.equal(children[1].internalFields.key, 3, "second node");
});

QUnit.test("addItem - root", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" }),
        item = { id: 8, text: "Item 3", parentId: 0 };

    dataAdapter.addItem(item);

    assert.equal(dataAdapter.getData().length, 8, "node was added");
    assert.equal(dataAdapter.getRootNodes().length, 3, "root node was added");
});

QUnit.test("addItem - subLevel", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.plainData, dataType: "plain" }),
        item = { id: 8, text: "Item 1-3", parentId: 1 };

    dataAdapter.addItem(item);

    assert.equal(dataAdapter.getData().length, 8, "node was added");
    assert.equal(dataAdapter.getChildrenNodes(1).length, 3, "node was added at the correct level");
});

QUnit.test("getFullData", function(assert) {
    var dataAdapter = initDataAdapter({
        items: [
            { id: 1, parentId: 0, text: "Cars" },
            { id: 2, parentId: 0, text: "Bikes" },
            { id: 3, parentId: 0, text: "Motobikes" }
        ],
        searchValue: "ike",
    });

    assert.equal(dataAdapter.getData().length, 2, "searched items");
    assert.equal(dataAdapter.getFullData().length, 3, "initial items");
});


QUnit.module("getPublicNode method", moduleConfig);

QUnit.test("public node should have correct accessor fields", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithoutKeys }),
        data = dataAdapter.getData(),
        publicNode = dataAdapter.getPublicNode(data[2]);

    assert.strictEqual(publicNode.disabled, false);
    assert.strictEqual(publicNode.expanded, false);
    assert.strictEqual(publicNode.selected, false);
    assert.equal(publicNode.items.length, 0);
});

QUnit.test("public node should have correct item field", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithoutKeys }),
        data = dataAdapter.getData(),
        publicNode = dataAdapter.getPublicNode(data[5]);

    assert.deepEqual(publicNode.items[0].itemData, assets.treeDataWithoutKeys[1].items[0]);
});

QUnit.test("public node should have correct hierarchy", function(assert) {
    var dataAdapter = initDataAdapter({ items: this.treeDataWithoutKeys }),
        data = dataAdapter.getData(),
        publicNode = dataAdapter.getPublicNode(data[2]);

    assert.equal(publicNode.key, 3);
    assert.equal(publicNode.parent.key, 2);
    assert.equal(publicNode.parent.parent.key, 1);
    assert.strictEqual(publicNode.parent.parent.parent, null);
    assert.equal(publicNode.parent.children.length, 2);
    assert.equal(publicNode.parent.items.length, 2);
    assert.equal(publicNode.children.length, 0);
});

QUnit.test("public node should depend on original node", function(assert) {
    this.plainData[0].selected = true;

    var dataAdapter = initDataAdapter({ items: this.plainData }),
        data = dataAdapter.getData(),
        publicNode = dataAdapter.getPublicNode(data[0]);

    assert.strictEqual(publicNode.selected, true, "public node is selected");

    dataAdapter.toggleSelection(1, false);

    assert.strictEqual(publicNode.selected, false, "public node became unselected");
});


QUnit.module("selection", moduleConfig);

QUnit.test("set recursive selection", function(assert) {
    this.plainData[3].selected = true;
    this.plainData[4].selected = true;
    this.plainData[5].selected = true;

    var dataAdapter = initDataAdapter({
            items: this.plainData,
            recursiveSelection: true,
            dataType: "plain"
        }),
        nodes = dataAdapter.getTreeNodes();

    assert.strictEqual(nodes[0].selected, undefined, "item 1 is in undetermined state");
    assert.ok(nodes[0].items[0].selected, "item 11 was selected");
    assert.ok(nodes[1].items[0].selected, "item 21 was selected");
});

QUnit.test("set recursive selection with random data", function(assert) {
    this.randomData[1].selected = true;
    this.randomData[2].selected = true;
    this.randomData[3].selected = true;

    var dataAdapter = initDataAdapter({
            items: this.randomData,
            recursiveSelection: true,
            dataType: "plain"
        }),
        nodes = dataAdapter.getTreeNodes();

    assert.strictEqual(nodes[1].selected, undefined, "item 1 is in undetermined state");
    assert.ok(nodes[1].items[1].selected, "item 11 was selected");
    assert.ok(nodes[0].items[0].selected, "item 21 was selected");
});

QUnit.test("set recursiveSelection false", function(assert) {
    this.plainData[0].selected = true;

    initDataAdapter({
        items: this.plainData,
        recursiveSelection: false
    });

    assert.ok(this.plainData[0].selected, "node was selected");
    assert.ok(!this.plainData[1].selected, "child node was not selected");
});

QUnit.test("set multipleSelection false", function(assert) {
    this.plainData[0].selected = true;
    this.plainData[3].selected = true;

    var dataAdapter = initDataAdapter({
        items: this.plainData,
        recursiveSelection: false,
        multipleSelection: false,
        dataType: "plain"
    });

    assert.notOk(dataAdapter.getData()[0].internalFields.selected, "node was unselected");
    assert.ok(dataAdapter.getData()[3].internalFields.selected, "node was selected");
    assert.equal(dataAdapter.getSelectedNodesKeys(), 4, "last item id was selected");
});


QUnit.module("expand", moduleConfig);

QUnit.test("set simple expand", function(assert) {
    this.plainData[1].expanded = true;

    initDataAdapter({
        items: this.plainData,
        recursiveExpansion: false,
        dataType: "plain"
    });

    assert.ok(!this.plainData[0].expanded, "node was not expanded");
    assert.ok(this.plainData[1].expanded, "child node was expanded");
});

QUnit.test("set recursive expand", function(assert) {
    this.plainData[3].expanded = true;

    var dataAdapter = initDataAdapter({
            items: this.plainData,
            recursiveExpansion: true,
            dataType: "plain"
        }),
        nodes = dataAdapter.getTreeNodes();

    assert.ok(nodes[0].expanded, "node was expanded");
    assert.ok(nodes[0].items[0].expanded, "node was expanded");
});


QUnit.module("Item's dependence from nodes", moduleConfig);

QUnit.test("tree items with keys", function(assert) {
    this.treeDataWithKeys[0].items[0].selected = true;
    this.treeDataWithKeys[0].items[0].expanded = true;

    initDataAdapter({
        items: this.treeDataWithKeys,
        recursiveSelection: true,
        recursiveExpansion: true
    });

    assert.strictEqual(this.treeDataWithKeys[0].selected, undefined, "node was not selected");
    assert.ok(this.treeDataWithKeys[0].items[0].items[0].selected, "node was selected");
    assert.ok(this.treeDataWithKeys[0].items[0].items[1].selected, "node was selected");
    assert.ok(this.treeDataWithKeys[0].items[0].expanded, "node was expanded");
    assert.ok(this.treeDataWithKeys[0].expanded, "node was expanded");
});

QUnit.test("tree items without keys", function(assert) {
    this.treeDataWithoutKeys[0].items[0].selected = true;
    this.treeDataWithoutKeys[0].items[0].expanded = true;

    initDataAdapter({
        items: this.treeDataWithoutKeys,
        recursiveSelection: true,
        recursiveExpansion: true
    });

    assert.strictEqual(this.treeDataWithoutKeys[0].selected, undefined, "node was not selected");
    assert.ok(this.treeDataWithoutKeys[0].items[0].items[0].selected, "node was selected");
    assert.ok(this.treeDataWithoutKeys[0].items[0].items[1].selected, "node was selected");
    assert.ok(this.treeDataWithoutKeys[0].items[0].expanded, "node was expanded");
    assert.ok(this.treeDataWithoutKeys[0].expanded, "node was expanded");
});

QUnit.test("plain items", function(assert) {
    this.plainData[1].selected = true;
    this.plainData[1].expanded = true;

    initDataAdapter({
        items: this.plainData,
        recursiveSelection: true,
        recursiveExpansion: true,
        dataType: "plain"
    });

    assert.strictEqual(this.plainData[0].selected, undefined, "node was not selected");
    assert.ok(this.plainData[3].selected, "node was selected");
    assert.ok(this.plainData[4].selected, "node was selected");
    assert.ok(this.plainData[0].expanded, "node was expanded");
});


QUnit.module("Expansion changing", moduleConfig);

QUnit.test("collapse item", function(assert) {

    this.plainData[1].expanded = true;

    var dataAdapter = initDataAdapter({
        items: this.plainData,
        recursiveExpansion: true,
        dataType: "plain"
    });

    dataAdapter.toggleExpansion(1, false);

    assert.ok(!this.plainData[0].expanded, "node was collapsed");
    assert.deepEqual(dataAdapter.getExpandedNodesKeys(), [2], "expanded array was updated");
});

QUnit.test("expand item (recursive expansion)", function(assert) {
    var dataAdapter = initDataAdapter({
        items: this.plainData,
        recursiveExpansion: true,
        dataType: "plain"
    });

    dataAdapter.toggleExpansion(4, true);

    assert.ok(this.plainData[0].expanded, "node was expanded");
    assert.ok(this.plainData[1].expanded, "node was expanded");
    assert.deepEqual(dataAdapter.getExpandedNodesKeys(), [1, 2, 4], "expanded array was updated");
});

QUnit.test("expand item (simple expansion)", function(assert) {
    var dataAdapter = initDataAdapter({
        items: this.plainData,
        recursiveExpansion: false,
        dataType: "plain"
    });

    dataAdapter.toggleExpansion(2, true);

    assert.ok(!this.plainData[0].expanded, "node was not expanded");
    assert.ok(this.plainData[1].expanded, "child node was expanded");
    assert.deepEqual(dataAdapter.getExpandedNodesKeys(), [2], "expanded array was updated");
});


QUnit.module("Search operation");

QUnit.test("It should be possible to find items that contain some substring", function(assert) {
    var dataAdapter = initDataAdapter({
        items: [
            { id: 1, parentId: 0, text: "Cars" },
            { id: 2, parentId: 0, text: "Bikes" },
            { id: 3, parentId: 0, text: "Motobikes" }
        ]
    });

    var result = dataAdapter.search("ike");

    assert.equal(result.length, 2, "Two entries were found");
    assert.equal(result[0].internalFields.key, 2, "The first entry is OK");
    assert.equal(result[1].internalFields.key, 3, "The second entry is OK");
});

QUnit.test("It should be possible to find items if text is set via expression", function(assert) {
    var accessors = {
            getters: {
                items: function(item) { return item["items"]; },
                key: function(item) { return item["id"]; },
                parentKey: function(item) { return item["parentId"]; },
                expanded: function(item) { return item["expanded"] || false; },
                selected: function(item) { return item["selected"] || false; },
                disabled: function(item) { return item["disabled"] || false; },
                display: function(item) { return item["name"] || ""; }
            },
            setters: {
                items: function(item, value) { item["items"] = value; },
                key: function(item, value) { item["id"] = value; },
                parentKey: function(item, value) { item["parentId"] = value; },
                expanded: function(item, value) { item["expanded"] = value; },
                selected: function(item, value) { item["selected"] = value; },
                disabled: function(item, value) { item["disabled"] = value; },
                display: function(item, value) { item["name"] = value; }
            }
        },
        items = [
            { id: 1, parentId: 0, name: "Cars" },
            { id: 2, parentId: 0, name: "Bikes" },
            { id: 3, parentId: 0, name: "Motobikes" }
        ],
        dataAdapter = new HierarchicalDataAdapter({ dataAccessors: accessors, items: items, dataType: "plain" });

    var result = dataAdapter.search("ike");

    assert.equal(result.length, 2, "Two entries were found");
    assert.equal(result[0].internalFields.key, 2, "The first entry is OK");
    assert.equal(result[1].internalFields.key, 3, "The second entry is OK");
});

QUnit.test("Search should be case insensitive", function(assert) {
    var dataAdapter = initDataAdapter({
        items: [
            { id: 1, parentId: 0, text: "Cars" },
            { id: 2, parentId: 0, text: "Bikes" },
            { id: 3, parentId: 0, text: "Motobikes" }
        ],
        dataType: "plain"
    });

    var result = dataAdapter.search("bike");

    assert.equal(result.length, 2, "Two entries were found");
    assert.equal(result[0].internalFields.key, 2, "The first entry is OK");
    assert.equal(result[1].internalFields.key, 3, "The second entry is OK");
});

QUnit.test("Empty array should be returned if the search isn't successful", function(assert) {
    var dataAdapter = initDataAdapter({
        items: [
            { id: 1, parentId: 0, text: "Cars" }
        ]
    });

    var result = dataAdapter.search("bla-bla-bla");

    assert.ok($.isArray(result), "The result is array");
    assert.equal(result.length, 0, "The result is empty");
});

QUnit.test("Entry parents should be added to the search result", function(assert) {
    var dataAdapter = initDataAdapter({
        items: [
            { id: 1, parentId: 0, text: "Cars" },
            { id: 2, parentId: 0, text: "Bikes" },
            { id: 3, parentId: 0, text: "Motobikes" },
            { id: 4, parentId: 1, text: "BMW" },
            { id: 5, parentId: 4, text: "X1" },
            { id: 6, parentId: 4, text: "X5" },
            { id: 7, parentId: 4, text: "X6" },
            { id: 8, parentId: 2, text: "Stels" },
            { id: 9, parentId: 3, text: "Honda" },
            { id: 10, parentId: 3, text: "Yamaha" },
            { id: 11, parentId: 10, text: "YX 1" },
            { id: 12, parentId: 10, text: "YX 2" }
        ],
        dataType: "plain"
    });

    var result = dataAdapter.search("X");

    assert.equal(result.length, 9, "Nine entries were found");
    assert.equal(result[0].text, "Cars", "The entry is OK");
    assert.equal(result[1].text, "BMW", "The entry is OK");
    assert.equal(result[2].text, "X1", "The entry is OK");
    assert.equal(result[3].text, "X5", "The entry is OK");
    assert.equal(result[4].text, "X6", "The entry is OK");
    assert.equal(result[5].text, "Motobikes", "The entry is OK");
    assert.equal(result[6].text, "Yamaha", "The entry is OK");
    assert.equal(result[7].text, "YX 1", "The entry is OK");
    assert.equal(result[8].text, "YX 2", "The entry is OK");
});

QUnit.test("Parent nodes should be expanded", function(assert) {
    var dataAdapter = initDataAdapter({
        items: [
            { id: 1, parentId: 0, text: "Cars" },
            { id: 2, parentId: 0, text: "Bikes" },
            { id: 3, parentId: 0, text: "Motobikes" },
            { id: 4, parentId: 1, text: "BMWX" },
            { id: 5, parentId: 4, text: "X1" },
            { id: 6, parentId: 4, text: "X5" },
            { id: 7, parentId: 4, text: "X6" },
            { id: 8, parentId: 2, text: "Stels" },
            { id: 9, parentId: 3, text: "Honda" },
            { id: 10, parentId: 3, text: "Yamaha" },
            { id: 11, parentId: 10, text: "YX 1" },
            { id: 12, parentId: 10, text: "YX 2" }
        ],
        dataType: "plain"
    });

    var result = dataAdapter.search("X");

    assert.ok(result[0].internalFields.expanded, "Cars", "The entry is OK");
    assert.ok(result[1].internalFields.expanded, "BMWX", "The entry is OK");
    assert.ok(!result[2].internalFields.expanded, "X1", "The entry is OK");
    assert.ok(!result[3].internalFields.expanded, "X5", "The entry is OK");
    assert.ok(!result[4].internalFields.expanded, "X6", "The entry is OK");
    assert.ok(result[5].internalFields.expanded, "Motobikes", "The entry is OK");
    assert.ok(result[6].internalFields.expanded, "Yamaha", "The entry is OK");
    assert.ok(!result[7].internalFields.expanded, "YX 1", "The entry is OK");
    assert.ok(!result[8].internalFields.expanded, "YX 2", "The entry is OK");
});

QUnit.test("Search should work with warning when the parent node is lost", function(assert) {
    var items = [
            { id: 1, parentId: 0, text: "Cars" },
            { id: 5, parentId: 154, text: "X1" },
            { id: 6, parentId: 1, text: "X5" }
        ],
        warningHandler = sinon.spy(errors, "log");

    try {
        var dataAdapter = initDataAdapter({
            dataType: "plain",
            items: items
        });

        dataAdapter.search("X");

        assert.equal(warningHandler.callCount, 1, "warning has been called once");
        assert.equal(warningHandler.getCall(0).args[0], "W1007", "warning has correct error id");
        assert.equal(warningHandler.getCall(0).args[1], 154, "warning has correct parentId");
        assert.equal(warningHandler.getCall(0).args[2], 5, "warning has correct id");
    } finally {
        warningHandler.restore();
    }
});

QUnit.test("Node changed should fire if any node was changed", function(assert) {
    var handler = sinon.spy(),
        dataAdapter = initDataAdapter({
            items: [{ text: "item 1", expanded: true, items: [{ text: "item 11" }] }],
            dataType: "tree",
            onNodeChanged: handler
        }),
        nodes = dataAdapter.getData();

    dataAdapter.toggleExpansion(1, false);

    assert.ok(handler.calledOnce, "nodechanged was fired once");
    assert.ok(handler.calledWith(nodes[0]), "node is correct");
});

QUnit.test("Searching with special symbols should not crash the regular expression", function(assert) {
    var symbols = "[]{}()-+?*,.\\^$|#".split(""),

        dataAdapter = initDataAdapter({
            items: [{ text: "item 1", expanded: true, items: [{ text: "item 11" }] }],
            dataType: "tree"
        }), breakingSymbols = [];

    $.each(symbols, function(_, symbol) {
        try {
            dataAdapter.search(symbol);
        } catch(e) {
            breakingSymbols.push(symbol);
        }
    });

    assert.deepEqual(breakingSymbols, [], "breaking symbols array should be empty");
});

QUnit.test("searchExpr is array", function(assert) {
    var items = [
            { key: 1, text: "Item 1", value: "test 3" },
            { key: 2, text: "Item 2", value: "test 3" },
            { key: 3, text: "Item 3", value: "test 1" }],
        dataAdapter = initDataAdapter({
            items: items,
            dataType: "plain",
            searchExpr: ["value", "text"]
        }),
        result = dataAdapter.search("1");

    assert.equal(result.length, 2, "count item");
});

QUnit.test("search should consider simple sorting", function(assert) {
    var items = [
            { id: 1, parentId: 0, text: "Bikes" },
            { id: 4, parentId: 3, text: "BMW" },
            { id: 3, parentId: 0, text: "Cars" },
            { id: 11, parentId: 10, text: "YX 1" },
            { id: 12, parentId: 10, text: "YX 2" },
            { id: 2, parentId: 0, text: "Motobikes" },
            { id: 5, parentId: 4, text: "X1" },
            { id: 6, parentId: 4, text: "X5" },
            { id: 7, parentId: 4, text: "X6" },
            { id: 10, parentId: 2, text: "Yamaha" },
            { id: 8, parentId: 1, text: "Stels" },
            { id: 9, parentId: 2, text: "Honda" }
        ],
        dataAdapter = initDataAdapter({
            items: items,
            dataType: "plain",
            sort: "text",
            searchExpr: ["value", "text"]
        }),
        result = dataAdapter.search("1"),
        expectedValues = ["BMW", "Cars", "Motobikes", "X1", "Yamaha", "YX 1"];

    $.each(result, function(index, item) {
        assert.equal(item.text, expectedValues[index], "Correct item");
    });
});

QUnit.test("search should consider sorting expression", function(assert) {
    var items = [
            { id: 1, parentId: 0, text: "Bikes" },
            { id: 4, parentId: 3, text: "BMW" },
            { id: 13, parentId: 3, text: "Audi" },
            { id: 3, parentId: 0, text: "Cars" },
            { id: 11, parentId: 10, text: "YX 1" },
            { id: 12, parentId: 10, text: "YX 2" },
            { id: 14, parentId: 13, text: "A1" },
            { id: 15, parentId: 13, text: "A5" },
            { id: 2, parentId: 0, text: "Motobikes" },
            { id: 5, parentId: 4, text: "X1" },
            { id: 6, parentId: 4, text: "X5" },
            { id: 7, parentId: 4, text: "X6" },
            { id: 10, parentId: 2, text: "Yamaha" },
            { id: 8, parentId: 1, text: "Stels" },
            { id: 9, parentId: 2, text: "Honda" }
        ],
        dataAdapter = initDataAdapter({
            items: items,
            dataType: "plain",
            sort: { field: "text", desc: true },
            searchExpr: ["value", "text"]
        }),
        result = dataAdapter.search("1"),
        expectedValues = ["YX 1", "Yamaha", "X1", "Motobikes", "Cars", "BMW", "Audi", "A1"];

    $.each(result, function(index, item) {
        assert.equal(item.text, expectedValues[index], "Correct item");
    });
});
