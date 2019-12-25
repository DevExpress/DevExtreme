import $ from 'jquery';
import HierarchicalDataAdapter from 'ui/hierarchical_collection/ui.data_adapter';

class HierarchicalCollectionTestHelper {
    constructor() {
        this.treeDataWithoutKeys = $.extend(true, [], this.getTreeDataWithoutKeys());
        this.treeDataWithKeys = $.extend(true, [], this.getTreeDataWithKeys());
        this.plainData = $.extend(true, [], this.getSimplePlainData());
        this.randomData = $.extend(true, [], this.getSimplePlainData()).reverse();
        this.treeNodes = $.extend(true, [], this.getTreeNodes());
        this.treeNodesWithoutKeys = $.extend(true, [], this.getTreeDataWithoutKeys());
    }

    getAccessors() {
        return {
            getters: {
                items: (item) => item['items'],
                key: (item) => item['id'],
                parentKey: (item) => item['parentId'],
                expanded: (item) => item['expanded'] || false,
                selected: (item) => item['selected'] || false,
                disabled: (item) => item['disabled'] || false,
                display: (item) => item['text'] || ''
            },
            setters: {
                items: (item, value) => item['items'] = value,
                key: (item, value) => item['id'] = value,
                parentKey: (item, value) => item['parentId'] = value,
                expanded: (item, value) => item['expanded'] = value,
                selected: (item, value) => item['selected'] = value,
                disabled: (item, value) => item['disabled'] = value,
                display: (item, value) => item['text'] = value
            }
        };
    }

    getTreeDataWithObjects() {
        let User = function(text, items) {
            this.text = text;
            this.items = items;
        };

        return [
            new User('Item 1', [
                new User('Item 11'),
                new User('Item 12')
            ]),
            new User('Item 2')
        ];
    }

    getTreeDataWithKeys() {
        return [
            {
                text: 'Item 1',
                id: 1,
                items: [
                    {
                        id: 2, text: 'Item 11', items: [
                            { id: 3, text: 'Item 111' },
                            { id: 4, text: 'Item 112' }
                        ]
                    },
                    { id: 5, text: 'Item 12' }
                ]
            },
            {
                id: 6, text: 'Item 2', items: [
                    { id: 7, text: 'Item 21' }
                ]
            }
        ];
    }

    getTreeDataWithoutKeys() {
        return [
            {
                text: 'Item 1',
                items: [
                    {
                        text: 'Item 11', items: [
                            { text: 'Item 111' },
                            { text: 'Item 112' }
                        ]
                    },
                    { text: 'Item 12' }
                ]
            },
            {
                text: 'Item 2', items: [
                    { text: 'Item 21' }
                ]
            }
        ];
    }

    getSimplePlainData() {
        return [
            { id: 1, text: 'Item 1', parentId: 0 },
            { id: 2, text: 'Item 11', parentId: 1 },
            { id: 3, text: 'Item 12', parentId: 1 },
            { id: 4, text: 'Item 111', parentId: 2 },
            { id: 5, text: 'Item 112', parentId: 2 },
            { id: 6, text: 'Item 2', parentId: 0 },
            { id: 7, text: 'Item 21', parentId: 6 }
        ];
    }

    getTreeNodes() {
        return [
            {
                id: 1, parentId: 0, parent: null, text: 'Item 1', expanded: false, selected: false, disabled: false, items: [
                    {
                        id: 2, parentId: 1, text: 'Item 11', expanded: false, selected: false, disabled: false,
                        parent: { id: 1, parentId: 0, parent: null, text: 'Item 1', expanded: false, selected: false, disabled: false, items: null },
                        items: [
                            {
                                id: 4, parentId: 2, text: 'Item 111', expanded: false, selected: false, disabled: false,
                                parent: { id: 2, parentId: 1, text: 'Item 11', expanded: false, selected: false, disabled: false, items: null, parent: null }
                            },
                            {
                                id: 5, parentId: 2, text: 'Item 112', expanded: false, selected: false, disabled: false,
                                parent: { id: 2, parentId: 1, text: 'Item 11', expanded: false, selected: false, disabled: false, items: null, parent: null }
                            }
                        ]
                    },
                    {
                        id: 3, parentId: 1, text: 'Item 12', expanded: false, selected: false, disabled: false,
                        parent: { id: 1, parentId: 0, parent: null, text: 'Item 1', expanded: false, selected: false, disabled: false, items: null },
                    }
                ]
            },
            {
                id: 6, parentId: 0, parent: null, text: 'Item 2', expanded: false, selected: false, disabled: false, items: [
                    {
                        id: 7, parentId: 6, text: 'Item 21', expanded: false, selected: false, disabled: false, parent:
                        { id: 6, parentId: 0, parent: null, items: null, text: 'Item 2', expanded: false, selected: false, disabled: false }
                    }
                ]
            }
        ];
    }

    getTreeNodesWithoutKeys() {
        return [
            {
                id: 1, parentId: 0, parent: null, text: 'Item 1', expanded: false, selected: false, disabled: false, items: [
                    {
                        id: 2, parentId: 1, text: 'Item 11', expanded: false, selected: false, disabled: false,
                        parent: { id: 1, parentId: 0, parent: null, text: 'Item 1', expanded: false, selected: false, disabled: false, items: null },
                        items: [
                            {
                                id: 3, parentId: 2, text: 'Item 111', expanded: false, selected: false, disabled: false,
                                parent: { id: 2, parentId: 1, text: 'Item 11', expanded: false, selected: false, disabled: false, items: null, parent: null }
                            },
                            {
                                id: 4, parentId: 2, text: 'Item 112', expanded: false, selected: false, disabled: false,
                                parent: { id: 2, parentId: 1, text: 'Item 11', expanded: false, selected: false, disabled: false, items: null, parent: null }
                            }
                        ]
                    },
                    {
                        id: 5, parentId: 1, text: 'Item 12', expanded: false, selected: false, disabled: false,
                        parent: { id: 1, parentId: 0, parent: null, text: 'Item 1', expanded: false, selected: false, disabled: false, items: null },
                    }
                ]
            },
            {
                id: 6, parentId: 0, parent: null, text: 'Item 2', expanded: false, selected: false, disabled: false, items: [
                    {
                        id: 7, parentId: 6, text: 'Item 21', expanded: false, selected: false, disabled: false, parent:
                            { id: 6, parentId: 0, parent: null, items: null, text: 'Item 2', expanded: false, selected: false, disabled: false }
                    }
                ]
            }
        ];
    }

    getCustomAccessors() {
        return {
            getters: {
                items: (item) => item['items'],
                key: (item) => item['id'],
                parentKey: (item) => item['pid'],
                expanded: (item) => item['expand'] || false,
                selected: (item) => item['select'] || false,
                disabled: (item) => item['disable'] || false,
                display: (item) => item['caption'] || ''
            },
            setters: {
                items: (item, value) => item['items'] = value,
                key: (item, value) => item['id'] = value,
                parentKey: (item, value) => item['pid'] = value,
                expanded: (item, value) => item['expand'] = value,
                selected: (item, value) => item['select'] = value,
                disabled: (item, value) => item['disable'] = value,
                display: (item, value) => item['caption'] = value
            }
        };
    }

    initDataAdapter(options) {
        return new HierarchicalDataAdapter($.extend({ dataAccessors: this.getAccessors() }, options));
    }
}

export default HierarchicalCollectionTestHelper;
