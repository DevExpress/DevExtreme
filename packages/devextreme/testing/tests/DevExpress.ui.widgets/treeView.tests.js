/* global stripFunctions */

import $ from 'jquery';
import { CustomStore } from 'common/data/custom_store';
import ArrayStore from 'common/data/array_store';

import 'ui/tree_view';

const { testStart } = QUnit;

testStart(function() {
    const markup = '<div id="treeView"></div>';

    $('#qunit-fixture').html(markup);
});

window.internals = {
    NODE_CONTAINER_CLASS: 'dx-treeview-node-container',
    OPENED_NODE_CONTAINER_CLASS: 'dx-treeview-node-container-opened',
    NODE_CLASS: 'dx-treeview-node',
    ITEM_CLASS: 'dx-treeview-item',
    TOGGLE_ITEM_VISIBILITY_CLASS: 'dx-treeview-toggle-item-visibility',
    TOGGLE_ITEM_VISIBILITY_OPENED_CLASS: 'dx-treeview-toggle-item-visibility-opened',
};

window.DATA = (function() {
    return [
        // 0
        [
            { key: 1, text: 'Item 1' },
            { key: 2, text: 'Item 2' },
            { key: 3, text: 'Item 3' }
        ],
        // 1
        [
            {
                key: 1, text: 'Item 1', items: [
                    { key: 12, text: 'Nested item 1' },
                    {
                        key: 13, text: 'Nested item 2', items: [
                            { key: 131, text: 'Last item' }
                        ]
                    }
                ]
            },
            { key: 2, text: 'Item 2' }
        ],
        // 2
        [
            {
                key: 1, text: 'Item 1', items: [
                    { key: 12, text: 'Nested item 1' },
                    { key: 13, text: 'Nested item 2' }
                ]
            },
            { key: 2, text: 'Item 2' }
        ],
        // 3
        [
            {
                itemId: 1,
                itemName: 'Item 1',
                children: [
                    { itemId: 11, itemName: 'Nested Item 1' }
                ]
            },
            { itemId: 2, itemName: 'Item 2' }
        ],
        // 4
        [
            { 'Id': 1, 'ParentId': 0, 'Name': 'Animals' },
            { 'Id': 2, 'ParentId': 1, 'Name': 'Cat' },
            { 'Id': 3, 'ParentId': 1, 'Name': 'Dog' },
            { 'Id': 5, 'ParentId': 2, 'Name': 'Abyssinian' },
            { 'Id': 8, 'ParentId': 3, 'Name': 'Affenpinscher' },
            { 'Id': 9, 'ParentId': 3, 'Name': 'Afghan Hound' },
            { 'Id': 12, 'ParentId': 0, 'Name': 'Birds' },
            { 'Id': 13, 'ParentId': 12, 'Name': 'Akekee' }
        ],
        // 5
        [
            {
                // id: "!/#$%&'()*+,./:;<=>?@[\]^`{|}~",
                id: 1,
                text: 'Item 1',
                items: [
                    { id: 11, text: 'Nested Item 1' },
                    {
                        id: 12, text: 'Nested Item 2', items: [
                            { id: 121, text: 'Third level item 1' },
                            { id: 122, text: 'Third level item 2' }
                        ]
                    }
                ]
            },
            { id: 2, text: 'Item 2' }
        ],
        [
            {
                id: 1,
                text: 'Item 1',
                items: [
                    {
                        id: 12, text: 'Nested Item 2', items: [
                            { id: 121, text: 'Third level item 1' },
                            { id: 122, text: 'Third level item 2' }
                        ]
                    }
                ]
            },
            {
                id: 2,
                text: 'Item 2',
                items: [
                    {
                        id: 22, text: 'Nested Item 2', items: [
                            { id: 221, text: 'Third level item 1' },
                            { id: 222, text: 'Third level item 2' }
                        ]
                    }
                ]
            }
        ]
    ];
})();

window.data2 = [
    { id: 1, parentId: 0, text: 'Animals' },
    { id: 2, parentId: 1, text: 'Cat' },
    { id: 3, parentId: 1, text: 'Dog' },
    { id: 4, parentId: 1, text: 'Cow' },
    { id: 5, parentId: 2, text: 'Abyssinian' },
    { id: 6, parentId: 2, text: 'Aegean cat' },
    { id: 7, parentId: 2, text: 'Australian Mist' },
    { id: 8, parentId: 3, text: 'Affenpinscher' },
    { id: 9, parentId: 3, text: 'Afghan Hound' },
    { id: 10, parentId: 3, text: 'Airedale Terrier' },
    { id: 11, parentId: 3, text: 'Akita Inu' },
    { id: 12, parentId: 0, text: 'Birds' },
    { id: 13, parentId: 12, text: 'Akekee' },
    { id: 14, parentId: 12, text: 'Arizona Woodpecker' },
    { id: 15, parentId: 12, text: 'Black-chinned Sparrow' },
    { id: 16, parentId: 0, text: 'Others' }
];

window.dataID = [
    { id: 1, 'elternId': 0, text: 'Animals' },
    { id: 2, 'elternId': 1, text: 'Cat' },
    { id: 3, 'elternId': 2, text: 'Abyssinian' },
    { id: 4, 'elternId': 0, text: 'Birds' },
    { id: 5, 'elternId': 4, text: 'Akekee' }
];

window.initTree = function(options) {
    return $('#treeView').dxTreeView(options);
};

window.stripFunctions = function(obj) {
    const result = $.extend(true, {}, obj);
    $.each(result, function(field, value) {
        if($.isFunction(value)) {
            delete result[field];
        }

        if(field === 'parent' && result.parent) {
            result.parent = stripFunctions(result.parent);
        }

    });

    return result;
};

window.makeSlowDataSource = function(data) {
    return {
        store: new CustomStore({
            load: function(loadOptions) {
                return $.Deferred(function(d) {
                    setTimeout(function() {
                        new ArrayStore(data).load(loadOptions).done(function() {
                            d.resolve.apply(d, arguments);
                        });
                    }, 300);
                }).promise();
            }
        })
    };
};

import 'generic_light.css!';

import './treeViewParts/accessibility.js';
import './treeViewParts/animation.js';
import './treeViewParts/events.js';
import './treeViewParts/expresions.js';
import './treeViewParts/focusing.js';
import './treeViewParts/initialization.js';
import './treeViewParts/keyboardNavigation.js';
import './treeViewParts/lazyRendering.js';
import './treeViewParts/optionChanged.js';
import './treeViewParts/regression.js';
import './treeViewParts/rendering.js';
import './treeViewParts/selection.js';
import './treeViewParts/searching.js';
import './treeViewParts/selectAllMode.js';
import './treeViewParts/selectAllWithSelectNodesRecursiveFalse.js';
import './treeViewParts/selectNodesRecursiveTrue.js';
import './treeViewParts/treeview.size.tests.js';
import './treeViewParts/usageWithoutKeys.js';
import './treeViewParts/virtualMode.js';
