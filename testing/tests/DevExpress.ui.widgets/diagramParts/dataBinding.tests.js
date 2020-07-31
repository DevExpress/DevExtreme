import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';

import DataSource from 'data/data_source';
import ArrayStore from 'data/array_store';
import { DiagramCommand } from 'devexpress-diagram';
import { Consts } from '../../../helpers/diagramHelpers.js';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram({
            mainToolbar: { visible: true }
        });
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('DataBinding', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach.apply(this, arguments);
    },
    afterEach: function() {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('items_option keys cache must be updated on data source changes', function(assert) {
        const store = new ArrayStore({
            key: 'id',
            data: [
                {
                    id: '1',
                    text: 'text1'
                },
                {
                    id: '2',
                    text: 'text2'
                }
            ],
        });
        const dataSource = new DataSource({
            store
        });
        this.instance.option({
            nodes: { dataSource }
        });

        assert.equal(this.instance._nodesOption._items.length, 2);
        assert.equal(this.instance._nodesOption._getIndexByKey('1'), 0);
        assert.equal(this.instance._nodesOption._getIndexByKey('2'), 1);

        store.insert({
            id: '3',
            text: 'text3'
        });
        dataSource.reload();
        assert.equal(this.instance._nodesOption._items.length, 3);
        assert.equal(this.instance._nodesOption._getIndexByKey('1'), 0);
        assert.equal(this.instance._nodesOption._getIndexByKey('2'), 1);
        assert.equal(this.instance._nodesOption._getIndexByKey('3'), 2);
    });

    test('items_option keys cache must be updated on data source changes (hierarchical data)', function(assert) {
        const store = new ArrayStore({
            key: 'id',
            data: [
                {
                    id: '1',
                    text: 'text1',
                    items: [
                        {
                            id: '3',
                            text: 'text3'
                        }
                    ],
                    children: [
                        {
                            id: '4',
                            text: 'text4'
                        }
                    ]
                },
                {
                    id: '2',
                    text: 'text2'
                }
            ],
        });
        const dataSource = new DataSource({
            store
        });
        this.instance.option({
            nodes: {
                dataSource,
                itemsExpr: 'items'
            }
        });

        assert.equal(this.instance._nodesOption._items.length, 2);
        assert.equal(this.instance._nodesOption._items[0].items.length, 1);
        assert.equal(this.instance._nodesOption._getIndexByKey('1'), 0);
        assert.equal(this.instance._nodesOption._getIndexByKey('2'), 1);
        assert.equal(this.instance._nodesOption._getIndexByKey('3'), 2);
        assert.equal(this.instance._nodesOption._getIndexByKey('4'), 3);

        store.insert({
            id: '5',
            text: 'text5'
        });
        dataSource.reload();
        assert.equal(this.instance._nodesOption._items.length, 3);
        assert.equal(this.instance._nodesOption._getIndexByKey('1'), 0);
        assert.equal(this.instance._nodesOption._getIndexByKey('2'), 1);
        assert.equal(this.instance._nodesOption._getIndexByKey('3'), 3);
        assert.equal(this.instance._nodesOption._getIndexByKey('4'), 4);
        assert.equal(this.instance._nodesOption._getIndexByKey('5'), 2);
    });

    test('values on the updating data store\'s event should not be changed and should be changed on the updated event', function(assert) {
        const nodes = [
            {
                id: '1',
                text: 'text1'
            },
            {
                id: '2',
                text: 'text2'
            }
        ];
        const nodeStore = new ArrayStore({
            key: 'id',
            data: nodes,
            onUpdating: (key, values) => {
                const index = key === '1' ? 0 : 1;
                assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[index].textStyle, 'font-family: Arial Black');
                assert.equal(values.textStyle, 'font-family: Arial Black');
                assert.equal(nodes[index].textStyle, undefined);
            },
            onUpdated: (key, values) => {
                const index = key === '1' ? 0 : 1;
                assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[index].textStyle, 'font-family: Arial Black');
                assert.equal(values.textStyle, 'font-family: Arial Black');
                assert.equal(nodes[index].textStyle, 'font-family: Arial Black');
            }
        });
        const edges = [
            {
                id: '3',
                from: '1',
                to: '2'
            }
        ];
        const edgeStore = new ArrayStore({
            key: 'id',
            data: edges,
            onUpdating: (key, values) => {
                assert.equal(this.instance._diagramInstance.documentDataSource.edgeDataSource[0].textStyle, 'font-family: Arial Black');
                assert.equal(values.textStyle, 'font-family: Arial Black');
                assert.equal(edges[0].textStyle, undefined);
            },
            onUpdated: (key, values) => {
                assert.equal(this.instance._diagramInstance.documentDataSource.edgeDataSource[0].textStyle, 'font-family: Arial Black');
                assert.equal(values.textStyle, 'font-family: Arial Black');
                assert.equal(edges[0].textStyle, 'font-family: Arial Black');
            }
        });

        this.instance.option({
            nodes: {
                dataSource: new DataSource({
                    store: nodeStore
                }),
                textStyleExpr: 'textStyle'
            },
            edges: {
                dataSource: new DataSource({
                    store: edgeStore
                }),
                textStyleExpr: 'textStyle'
            }
        });

        assert.equal(this.instance._diagramInstance.model.items.length, 3);
        assert.equal(this.instance._diagramInstance.model.items[0].styleText['font-family'], 'Arial');
        assert.equal(this.instance._diagramInstance.model.items[1].styleText['font-family'], 'Arial');
        assert.equal(this.instance._diagramInstance.model.items[2].styleText['font-family'], 'Arial');
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[0].textStyle, undefined);
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[1].textStyle, undefined);
        assert.equal(this.instance._diagramInstance.documentDataSource.edgeDataSource[0].textStyle, undefined);

        this.instance._diagramInstance.selection.set(['0', '1', '2']);
        const fontSelectBox = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR).find('.dx-selectbox').eq(0).dxSelectBox('instance');
        fontSelectBox.option('value', 'Arial Black');
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontName).getState().value, 'Arial Black');

        this.clock.tick(100);
        assert.equal(this.instance._diagramInstance.model.items.length, 3);
        assert.equal(this.instance._diagramInstance.model.items[0].styleText['font-family'], 'Arial Black');
        assert.equal(this.instance._diagramInstance.model.items[1].styleText['font-family'], 'Arial Black');
        assert.equal(this.instance._diagramInstance.model.items[2].styleText['font-family'], 'Arial Black');
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[0].textStyle, 'font-family: Arial Black');
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[1].textStyle, 'font-family: Arial Black');
        assert.equal(this.instance._diagramInstance.documentDataSource.edgeDataSource[0].textStyle, 'font-family: Arial Black');
    });

    test('items on the removing data store\'s event should not be changed and should be changed on the removed event', function(assert) {
        let nodeCount = 2;
        const nodes = [
            {
                id: '1',
                text: 'text1'
            },
            {
                id: '2',
                text: 'text2'
            }
        ];
        const nodeStore = new ArrayStore({
            key: 'id',
            data: nodes,
            onRemoving: (key) => {
                assert.equal(nodes.length, nodeCount);
            },
            onRemoved: (key) => {
                assert.equal(nodes.length, --nodeCount);
            }
        });
        const edges = [
            {
                id: '3',
                from: '1',
                to: '2'
            }
        ];
        let edgeCount = 1;
        const edgeStore = new ArrayStore({
            key: 'id',
            data: edges,
            onRemoving: (key) => {
                assert.equal(edges.length, edgeCount);
            },
            onRemoved: (key) => {
                assert.equal(edges.length, --edgeCount);
            }
        });

        this.instance.option({
            nodes: {
                dataSource: new DataSource({
                    store: nodeStore
                })
            },
            edges: {
                dataSource: new DataSource({
                    store: edgeStore
                })
            }
        });

        assert.equal(this.instance._diagramInstance.model.items.length, 3);

        this.instance._diagramInstance.modelManipulator.deleteConnection(this.instance._diagramInstance.model.items[2], 0);
        this.instance._diagramInstance.modelManipulator.deleteConnection(this.instance._diagramInstance.model.items[2], 1);
        this.instance._diagramInstance.modelManipulator.deleteConnector(this.instance._diagramInstance.model.items[2]);
        assert.equal(this.instance._diagramInstance.model.items.length, 2);
        assert.equal(edgeCount, 1);

        this.instance._diagramInstance.documentDataSource.updateItemsByModel(this.instance._diagramInstance.model);
        assert.equal(edgeCount, 0);

        this.instance._diagramInstance.modelManipulator.deleteShape(this.instance._diagramInstance.model.items[1]);
        assert.equal(this.instance._diagramInstance.model.items.length, 1);
        assert.equal(nodeCount, 2);

        this.instance._diagramInstance.documentDataSource.updateItemsByModel(this.instance._diagramInstance.model);
        assert.equal(nodeCount, 1);

        this.instance._diagramInstance.modelManipulator.deleteShape(this.instance._diagramInstance.model.items[0]);
        assert.equal(this.instance._diagramInstance.model.items.length, 0);
        assert.equal(nodeCount, 1);

        this.instance._diagramInstance.documentDataSource.updateItemsByModel(this.instance._diagramInstance.model);
        assert.equal(nodeCount, 0);
    });

    test('reloadContent should update data correctly (update on events)', function(assert) {
        const nodes = [
            {
                id: '1',
                text: 'text1'
            }
        ];
        const nodeStore = new ArrayStore({
            key: 'id',
            data: nodes,
            onUpdating: (key, values) => {
                assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[0].textStyle, 'font-family: Arial Black');
                assert.equal(values.textStyle, 'font-family: Arial Black');
                assert.equal(nodes[0].textStyle, undefined);

                values.textStyle = 'font-family: Arial Black1';
                this.instance.reloadContent(key);

                assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[0].textStyle, 'font-family: Arial Black1');
                assert.equal(values.textStyle, 'font-family: Arial Black1');
                assert.equal(nodes[0].textStyle, undefined);
            },
            onUpdated: (key, values) => {
                assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[0].textStyle, 'font-family: Arial Black1');
                assert.equal(values.textStyle, 'font-family: Arial Black1');
                assert.equal(nodes[0].textStyle, 'font-family: Arial Black1');
            }
        });

        this.instance.option({
            nodes: {
                dataSource: new DataSource({
                    store: nodeStore
                }),
                textStyleExpr: 'textStyle'
            }
        });

        assert.equal(this.instance._diagramInstance.model.items.length, 1);
        assert.equal(this.instance._diagramInstance.model.items[0].styleText['font-family'], 'Arial');
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[0].textStyle, undefined);

        this.instance._diagramInstance.selection.set(['0']);
        const fontSelectBox = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR).find('.dx-selectbox').eq(0).dxSelectBox('instance');
        fontSelectBox.option('value', 'Arial Black');
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontName).getState().value, 'Arial Black');

        assert.equal(this.instance._diagramInstance.model.items[0].styleText['font-family'], 'Arial Black');
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[0].textStyle, 'font-family: Arial Black1');
        assert.equal(nodes[0].textStyle, 'font-family: Arial Black1');

        this.clock.tick(100);
        assert.equal(this.instance._diagramInstance.model.items[0].styleText['font-family'], 'Arial Black1');
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[0].textStyle, 'font-family: Arial Black1');
        assert.equal(nodes[0].textStyle, 'font-family: Arial Black1');
    });

    test('reloadContent should update data correctly (external update)', function(assert) {
        const nodes = [
            {
                id: '1',
                text: 'text1'
            }
        ];
        const nodeStore = new ArrayStore({
            key: 'id',
            data: nodes
        });

        this.instance.option({
            nodes: {
                dataSource: new DataSource({
                    store: nodeStore
                }),
                textStyleExpr: 'textStyle'
            }
        });

        assert.equal(this.instance._diagramInstance.model.items.length, 1);
        assert.equal(this.instance._diagramInstance.model.items[0].styleText['font-family'], 'Arial');
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[0].textStyle, undefined);

        nodes[0].textStyle = 'font-family: Arial Black';
        assert.equal(this.instance._diagramInstance.model.items[0].styleText['font-family'], 'Arial');
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[0].textStyle, undefined);

        this.instance.reloadContent('1');
        assert.equal(this.instance._diagramInstance.model.items[0].styleText['font-family'], 'Arial Black');
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[0].textStyle, 'font-family: Arial Black');
        assert.equal(nodes[0].textStyle, 'font-family: Arial Black');
    });

    test('reloadContent should update data correctly (external insert)', function(assert) {
        const nodes = [
            {
                id: '1',
                text: 'text1'
            }
        ];
        const nodeStore = new ArrayStore({
            key: 'id',
            data: nodes
        });

        this.instance.option({
            nodes: {
                dataSource: new DataSource({
                    store: nodeStore
                }),
                textStyleExpr: 'textStyle'
            }
        });

        assert.equal(this.instance._diagramInstance.model.items.length, 1);

        nodes.push({ id: '2', text: 'text2', textStyle: 'font-family: Arial Black' });
        assert.equal(this.instance._diagramInstance.model.items.length, 1);
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource.length, 1);

        this.instance.reloadContent();
        assert.equal(this.instance._diagramInstance.model.items.length, 2);
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource.length, 2);
        assert.equal(this.instance._diagramInstance.model.items[1].styleText['font-family'], 'Arial Black');
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataSource[1].textStyle, 'font-family: Arial Black');
        assert.equal(nodes[1].textStyle, 'font-family: Arial Black');
    });
});
