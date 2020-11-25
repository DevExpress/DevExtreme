import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';

import { DiagramCommand, DiagramModelOperation, DiagramUnit } from 'devexpress-diagram';
import { Consts } from '../../../helpers/diagramHelpers.js';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram();
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('ClientSideEvents', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach.apply(this, arguments);
    },
    afterEach: function() {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('click on unbound diagram', function(assert) {
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(Consts.SIMPLE_DIAGRAM);
        let clickedItem;
        this.instance.option('onItemClick', function(e) {
            clickedItem = e.item;
        });
        this.instance._diagramInstance.onNativeAction.raise('notifyItemClick', this.instance._diagramInstance.model.findShape('107').toNative(DiagramUnit.In));
        assert.equal(clickedItem.id, '107');
        assert.equal(clickedItem.key, undefined);
        assert.equal(clickedItem.text, 'A new ticket');
        assert.equal(clickedItem.dataItem, undefined);
        assert.equal(clickedItem.position.x, 1);
        assert.equal(clickedItem.position.y, 0.75);
        assert.equal(clickedItem.size.width, 1);
        assert.equal(clickedItem.size.height, 0.5);
        assert.equal(clickedItem.attachedConnectorIds.length, 0);
        let count = 0;
        for(const key in clickedItem) {
            if(Object.prototype.hasOwnProperty.call(clickedItem, key)) count++;
        }
        assert.equal(count, 9);
    });
    test('getItemByKey of unbound diagram', function(assert) {
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(Consts.SIMPLE_DIAGRAM);
        const apiItem = this.instance.getItemByKey('107');
        assert.equal(apiItem, undefined);
    });
    test('getItemById of unbound diagram', function(assert) {
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(Consts.SIMPLE_DIAGRAM);
        const apiItem = this.instance.getItemById('107');
        assert.equal(apiItem.id, '107');
        assert.equal(apiItem.key, undefined);
        assert.equal(apiItem.text, 'A new ticket');
        assert.equal(apiItem.dataItem, undefined);
        assert.equal(apiItem.position.x, 1);
        assert.equal(apiItem.position.y, 0.75);
        assert.equal(apiItem.size.width, 1);
        assert.equal(apiItem.size.height, 0.5);
        assert.equal(apiItem.attachedConnectorIds.length, 0);
        let count = 0;
        for(const key in apiItem) {
            if(Object.prototype.hasOwnProperty.call(apiItem, key)) count++;
        }
        assert.equal(count, 9);
    });
    test('selectionchanged on unbound diagram', function(assert) {
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(Consts.SIMPLE_DIAGRAM);
        let selectedItems;
        this.instance.option('onSelectionChanged', function(e) {
            selectedItems = e.items;
        });
        this.instance._diagramInstance.selection.set([this.instance._diagramInstance.model.findShape('107').key]);
        assert.equal(selectedItems.length, 1);
        assert.equal(selectedItems[0].id, '107');
        assert.equal(selectedItems[0].text, 'A new ticket');
    });
    test('click on bound diagram', function(assert) {
        const nodes = [
            { key: '123', text: 'mytext', foo: 'bar' },
            { key: '345', text: 'myconnector' }
        ];
        const edges = [
            { key: '1', from: '123', to: '345' }
        ];
        this.instance.option('nodes.keyExpr', 'key');
        this.instance.option('nodes.textExpr', 'text');
        this.instance.option('edges.keyExpr', 'key');
        this.instance.option('edges.fromKey', 'from');
        this.instance.option('edges.toKey', 'to');
        this.instance.option('nodes.dataSource', nodes);
        this.instance.option('edges.dataSource', edges);
        let clickedItem;
        let dblClickedItem;
        this.instance.option('onItemClick', function(e) {
            clickedItem = e.item;
        });
        this.instance.option('onItemDblClick', function(e) {
            dblClickedItem = e.item;
        });
        this.instance._diagramInstance.onNativeAction.raise('notifyItemClick', this.instance._diagramInstance.model.findShapeByDataKey('123').toNative(DiagramUnit.In));
        assert.equal(clickedItem.key, '123');
        assert.equal(clickedItem.dataItem.key, '123');
        assert.equal(clickedItem.dataItem.foo, 'bar');
        assert.equal(clickedItem.text, 'mytext');
        assert.equal(clickedItem.dataItem.key, nodes[0].key);
        let count = 0;
        for(const key in clickedItem) {
            if(Object.prototype.hasOwnProperty.call(clickedItem, key)) count++;
        }
        assert.equal(count, 9);
        assert.equal(dblClickedItem, undefined);

        this.instance._diagramInstance.onNativeAction.raise('notifyItemDblClick', this.instance._diagramInstance.model.findShapeByDataKey('123').toNative(DiagramUnit.In));
        assert.equal(dblClickedItem.key, '123');
        assert.equal(dblClickedItem.dataItem.key, '123');
        assert.equal(dblClickedItem.dataItem.foo, 'bar');
        assert.equal(dblClickedItem.text, 'mytext');
        assert.equal(dblClickedItem.dataItem.key, nodes[0].key);

        this.instance._diagramInstance.onNativeAction.raise('notifyItemClick', this.instance._diagramInstance.model.findConnectorByDataKey('1').toNative(DiagramUnit.In));
        assert.equal(clickedItem.dataItem.key, '1');
        assert.equal(clickedItem.fromKey, '123');
        assert.equal(clickedItem.toKey, '345');
        assert.equal(clickedItem.dataItem.key, edges[0].key);
    });
    test('getItemByKey of bound diagram', function(assert) {
        const nodes = [
            { key: '123', text: 'mytext', foo: 'bar' },
            { key: '345', text: 'myconnector' }
        ];
        const edges = [
            { key: '1', from: '123', to: '345' }
        ];
        this.instance.option('nodes.keyExpr', 'key');
        this.instance.option('nodes.textExpr', 'text');
        this.instance.option('edges.keyExpr', 'key');
        this.instance.option('edges.fromKey', 'from');
        this.instance.option('edges.toKey', 'to');
        this.instance.option('nodes.dataSource', nodes);
        this.instance.option('edges.dataSource', edges);

        const apiItem = this.instance.getItemByKey('123');
        assert.equal(apiItem.key, '123');
        assert.equal(apiItem.dataItem.key, '123');
        assert.equal(apiItem.dataItem.foo, 'bar');
        assert.equal(apiItem.text, 'mytext');
        assert.equal(apiItem.dataItem.key, nodes[0].key);
        let count = 0;
        for(const key in apiItem) {
            if(Object.prototype.hasOwnProperty.call(apiItem, key)) count++;
        }
        assert.equal(count, 9);
    });
    test('getItemById of bound diagram', function(assert) {
        const nodes = [
            { key: '123', text: 'mytext', foo: 'bar' },
            { key: '345', text: 'myconnector' }
        ];
        const edges = [
            { key: '1', from: '123', to: '345' }
        ];
        this.instance.option('nodes.keyExpr', 'key');
        this.instance.option('nodes.textExpr', 'text');
        this.instance.option('edges.keyExpr', 'key');
        this.instance.option('edges.fromKey', 'from');
        this.instance.option('edges.toKey', 'to');
        this.instance.option('nodes.dataSource', nodes);
        this.instance.option('edges.dataSource', edges);

        const apiItem = this.instance.getItemById('0');
        assert.equal(apiItem.key, '123');
        assert.equal(apiItem.dataItem.key, '123');
        assert.equal(apiItem.dataItem.foo, 'bar');
        assert.equal(apiItem.text, 'mytext');
        assert.equal(apiItem.dataItem.key, nodes[0].key);
        let count = 0;
        for(const key in apiItem) {
            if(Object.prototype.hasOwnProperty.call(apiItem, key)) count++;
        }
        assert.equal(count, 9);
    });
});

QUnit.module('ClientSideEvents.requestOperation', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('requestOperation arguments', function(assert) {
        const $element = $('#diagram').dxDiagram({});
        const instance = $element.dxDiagram('instance');
        const operationCount = 12;
        let count = 0;
        for(const key in DiagramModelOperation) {
            if(Object.prototype.hasOwnProperty.call(DiagramModelOperation, key)) { count++; }
        }
        assert.equal(count, operationCount * 2);

        for(let i = 0; i < operationCount - 1; i++) {
            const e = instance._getRequestEditOperationEventArgs(i, { allowed: true });
            assert.notEqual(e.operation, undefined);
            assert.notEqual(e.args, undefined);
            assert.notEqual(e.allowed, undefined);
        }
    });
    test('requestOperation on bound diagram', function(assert) {
        const onRequestEditOperation = sinon.spy(function(e) { e.allowed = false; });
        const nodes = [
            { key: '123', text: 'mytext', foo: 'bar' },
            { key: '345', text: 'myconnector' }
        ];
        const edges = [
            { key: '1', from: '123', to: '345' }
        ];
        const $element = $('#diagram').dxDiagram({
            onRequestEditOperation: onRequestEditOperation,
            nodes: {
                dataSource: nodes,
                keyExpr: 'key',
                textExpr: 'text'
            },
            edges: {
                dataSource: edges,
                keyExpr: 'key',
                fromKey: 'from',
                toKey: 'to'
            },
            contextMenu: {
                enabled: false
            }
        });
        const instance = $element.dxDiagram('instance');
        let callCount = 17; // Shapes in general category
        assert.equal(instance._diagramInstance.model.items.length, 3);
        assert.equal(onRequestEditOperation.getCalls().length, callCount);

        instance._diagramInstance.selection.set(['0']);
        instance._diagramInstance.commandManager.getCommand(DiagramCommand.Delete).execute();
        callCount += 2;
        assert.equal(onRequestEditOperation.getCalls().length, callCount);
        assert.equal(onRequestEditOperation.getCall(callCount - 2).args[0]['operation'], 'changeConnection');
        assert.equal(onRequestEditOperation.getCall(callCount - 2).args[0]['args'].connector.id, '2');
        assert.equal(onRequestEditOperation.getCall(callCount - 2).args[0]['args'].shape, undefined);
        assert.equal(onRequestEditOperation.getCall(callCount - 2).args[0]['allowed'], false);
        assert.equal(onRequestEditOperation.getCall(callCount - 1).args[0]['operation'], 'deleteShape');
        assert.equal(onRequestEditOperation.getCall(callCount - 1).args[0]['args'].shape.id, '0');
        assert.equal(onRequestEditOperation.getCall(callCount - 1).args[0]['allowed'], false);
        assert.equal(instance._diagramInstance.model.items.length, 3);

        instance._diagramInstance.selection.set(['2']);
        instance._diagramInstance.commandManager.getCommand(DiagramCommand.Delete).execute();
        callCount += 1;
        assert.equal(onRequestEditOperation.getCalls().length, callCount);
        assert.equal(onRequestEditOperation.getCall(callCount - 1).args[0]['operation'], 'deleteConnector');
        assert.equal(onRequestEditOperation.getCall(callCount - 1).args[0]['args'].connector.id, '2');
        assert.equal(onRequestEditOperation.getCall(callCount - 1).args[0]['allowed'], false);
        assert.equal(instance._diagramInstance.model.items.length, 3);
    });
});

