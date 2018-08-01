var $ = require("jquery"),
    HierarchicalDataAdapter = require("ui/hierarchical_collection/ui.data_adapter");


var accessors = {
    getters: {
        items: function(item) { return item["items"]; },
        key: function(item) { return item["id"]; },
        parentKey: function(item) { return item["parentId"]; },
        expanded: function(item) { return item["expanded"] || false; },
        selected: function(item) { return item["selected"] || false; },
        disabled: function(item) { return item["disabled"] || false; },
        display: function(item) { return item["text"] || ""; }
    },
    setters: {
        items: function(item, value) { item["items"] = value; },
        key: function(item, value) { item["id"] = value; },
        parentKey: function(item, value) { item["parentId"] = value; },
        expanded: function(item, value) { item["expanded"] = value; },
        selected: function(item, value) { item["selected"] = value; },
        disabled: function(item, value) { item["disabled"] = value; },
        display: function(item, value) { item["text"] = value; }
    }
};


var assets = {
    treeDataWithKeys: [
        {
            text: "Item 1",
            id: 1,
            items: [
                {
                    id: 2, text: "Item 11", items: [
                        { id: 3, text: "Item 111" },
                        { id: 4, text: "Item 112" }
                    ]
                },
                { id: 5, text: "Item 12" }
            ]
        },
        {
            id: 6, text: "Item 2", items: [
                { id: 7, text: "Item 21" }
            ]
        }
    ],

    treeDataWithoutKeys: [
        {
            text: "Item 1",
            items: [
                {
                    text: "Item 11", items: [
                        { text: "Item 111" },
                        { text: "Item 112" }
                    ]
                },
                { text: "Item 12" }
            ]
        },
        {
            text: "Item 2", items: [
                { text: "Item 21" }
            ]
        }
    ],

    simplePlainData: [
        { id: 1, text: "Item 1", parentId: 0 },
        { id: 2, text: "Item 11", parentId: 1 },
        { id: 3, text: "Item 12", parentId: 1 },
        { id: 4, text: "Item 111", parentId: 2 },
        { id: 5, text: "Item 112", parentId: 2 },
        { id: 6, text: "Item 2", parentId: 0 },
        { id: 7, text: "Item 21", parentId: 6 }
    ],

    treeNodes: [
        {
            id: 1, parentId: 0, parent: null, text: "Item 1", expanded: false, selected: false, disabled: false, items: [
                {
                    id: 2, parentId: 1, text: "Item 11", expanded: false, selected: false, disabled: false,
                    parent: { id: 1, parentId: 0, parent: null, text: "Item 1", expanded: false, selected: false, disabled: false, items: null },
                    items: [
                        {
                            id: 4, parentId: 2, text: "Item 111", expanded: false, selected: false, disabled: false,
                            parent: { id: 2, parentId: 1, text: "Item 11", expanded: false, selected: false, disabled: false, items: null, parent: null }
                        },
                        {
                            id: 5, parentId: 2, text: "Item 112", expanded: false, selected: false, disabled: false,
                            parent: { id: 2, parentId: 1, text: "Item 11", expanded: false, selected: false, disabled: false, items: null, parent: null }
                        }
                    ]
                },
                {
                    id: 3, parentId: 1, text: "Item 12", expanded: false, selected: false, disabled: false,
                    parent: { id: 1, parentId: 0, parent: null, text: "Item 1", expanded: false, selected: false, disabled: false, items: null },
                }
            ]
        },
        {
            id: 6, parentId: 0, parent: null, text: "Item 2", expanded: false, selected: false, disabled: false, items: [
                {
                    id: 7, parentId: 6, text: "Item 21", expanded: false, selected: false, disabled: false, parent:
                    { id: 6, parentId: 0, parent: null, items: null, text: "Item 2", expanded: false, selected: false, disabled: false }
                }
            ]
        }
    ],

    treeNodesWithoutKeys: [
        {
            id: 1, parentId: 0, parent: null, text: "Item 1", expanded: false, selected: false, disabled: false, items: [
                {
                    id: 2, parentId: 1, text: "Item 11", expanded: false, selected: false, disabled: false,
                    parent: { id: 1, parentId: 0, parent: null, text: "Item 1", expanded: false, selected: false, disabled: false, items: null },
                    items: [
                        {
                            id: 3, parentId: 2, text: "Item 111", expanded: false, selected: false, disabled: false,
                            parent: { id: 2, parentId: 1, text: "Item 11", expanded: false, selected: false, disabled: false, items: null, parent: null }
                        },
                        {
                            id: 4, parentId: 2, text: "Item 112", expanded: false, selected: false, disabled: false,
                            parent: { id: 2, parentId: 1, text: "Item 11", expanded: false, selected: false, disabled: false, items: null, parent: null }
                        }
                    ]
                },
                {
                    id: 5, parentId: 1, text: "Item 12", expanded: false, selected: false, disabled: false,
                    parent: { id: 1, parentId: 0, parent: null, text: "Item 1", expanded: false, selected: false, disabled: false, items: null },
                }
            ]
        },
        {
            id: 6, parentId: 0, parent: null, text: "Item 2", expanded: false, selected: false, disabled: false, items: [
                {
                    id: 7, parentId: 6, text: "Item 21", expanded: false, selected: false, disabled: false, parent:
                        { id: 6, parentId: 0, parent: null, items: null, text: "Item 2", expanded: false, selected: false, disabled: false }
                }
            ]
        }
    ],

    customAccessors: {
        getters: {
            items: function(item) { return item["items"]; },
            key: function(item) { return item["id"]; },
            parentKey: function(item) { return item["pid"]; },
            expanded: function(item) { return item["expand"] || false; },
            selected: function(item) { return item["select"] || false; },
            disabled: function(item) { return item["disable"] || false; },
            display: function(item) { return item["caption"] || ""; }
        },
        setters: {
            items: function(item, value) { item["items"] = value; },
            key: function(item, value) { item["id"] = value; },
            parentKey: function(item, value) { item["pid"] = value; },
            expanded: function(item, value) { item["expand"] = value; },
            selected: function(item, value) { item["select"] = value; },
            disabled: function(item, value) { item["disable"] = value; },
            display: function(item, value) { item["caption"] = value; }
        }
    },

    initDataAdapter: function(options) {
        return new HierarchicalDataAdapter($.extend({ dataAccessors: accessors }, options));
    }
};

module.exports = assets;
