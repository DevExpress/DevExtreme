import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';

import { DiagramCommand } from 'devexpress-diagram';
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
        this.instance._diagramInstance.onNativeAction.raise('notifyItemClick', this.instance._diagramInstance.model.findShape('107').toNative());
        assert.equal(clickedItem.id, '107');
        assert.equal(clickedItem.text, 'A new ticket');
        assert.equal(clickedItem.dataItem, undefined);
        let count = 0;
        for(const key in clickedItem) {
            if(Object.prototype.hasOwnProperty.call(clickedItem, key)) count++;
        }
        assert.equal(count, 5);
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
        this.instance._diagramInstance.onNativeAction.raise('notifyItemClick', this.instance._diagramInstance.model.findShapeByDataKey('123').toNative());
        assert.equal(clickedItem.dataItem.key, '123');
        assert.equal(clickedItem.dataItem.foo, 'bar');
        assert.equal(clickedItem.text, 'mytext');
        assert.equal(clickedItem.dataItem.key, nodes[0].key);
        let count = 0;
        for(const key in clickedItem) {
            if(Object.prototype.hasOwnProperty.call(clickedItem, key)) count++;
        }
        assert.equal(count, 5);
        assert.equal(dblClickedItem, undefined);

        this.instance._diagramInstance.onNativeAction.raise('notifyItemDblClick', this.instance._diagramInstance.model.findShapeByDataKey('123').toNative());
        assert.equal(dblClickedItem.dataItem.key, '123');
        assert.equal(dblClickedItem.dataItem.foo, 'bar');
        assert.equal(dblClickedItem.text, 'mytext');
        assert.equal(dblClickedItem.dataItem.key, nodes[0].key);

        this.instance._diagramInstance.onNativeAction.raise('notifyItemClick', this.instance._diagramInstance.model.findConnectorByDataKey('1').toNative());
        assert.equal(clickedItem.dataItem.key, '1');
        assert.equal(clickedItem.fromKey, '123');
        assert.equal(clickedItem.toKey, '345');
        assert.equal(clickedItem.dataItem.key, edges[0].key);
    });
});
