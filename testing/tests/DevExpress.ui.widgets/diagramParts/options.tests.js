import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';

import DataSource from 'data/data_source';
import ArrayStore from 'data/array_store';
import { DiagramCommand, DataLayoutType } from 'devexpress-diagram';
import { Consts } from '../../../helpers/diagramHelpers.js';

const moduleConfig = {
    beforeEach: function() {
        this.onOptionChanged = sinon.spy();
        this.$element = $('#diagram').dxDiagram({
            onOptionChanged: this.onOptionChanged
        });
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('Options', moduleConfig, () => {
    test('should change readOnly property', function(assert) {
        assert.notOk(this.instance._diagramInstance.settings.readOnly);
        this.instance.option('readOnly', true);
        assert.ok(this.instance._diagramInstance.settings.readOnly);
        this.instance.option('readOnly', false);
        assert.notOk(this.instance._diagramInstance.settings.readOnly);
    });
    test('should change zoomLevel property', function(assert) {
        assert.equal(this.instance._diagramInstance.settings.zoomLevel, 1);
        this.instance.option('zoomLevel', 1.5);
        assert.equal(this.instance._diagramInstance.settings.zoomLevel, 1.5);
        this.instance.option('zoomLevel', 1);
        assert.equal(this.instance._diagramInstance.settings.zoomLevel, 1);
    });
    test('should sync zoomLevel property', function(assert) {
        assert.equal(this.instance.option('zoomLevel'), 1);
        assert.notOk(this.onOptionChanged.called);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ZoomLevel).execute(1.5);
        assert.equal(this.instance.option('zoomLevel'), 1.5);
        assert.ok(this.onOptionChanged.called);
    });
    test('should change zoomLevel object property', function(assert) {
        assert.equal(this.instance._diagramInstance.settings.zoomLevel, 1);
        assert.equal(this.instance._diagramInstance.settings.zoomLevelItems.length, 7);
        this.instance.option('zoomLevel', { value: 1.5, items: [ 1, 1.5 ] });
        assert.equal(this.instance._diagramInstance.settings.zoomLevel, 1.5);
        assert.equal(this.instance._diagramInstance.settings.zoomLevelItems.length, 2);
        this.instance.option('zoomLevel', 1);
        assert.equal(this.instance._diagramInstance.settings.zoomLevel, 1);
        assert.equal(this.instance._diagramInstance.settings.zoomLevelItems.length, 2);
    });
    test('should sync zoomLevel object property', function(assert) {
        assert.notOk(this.onOptionChanged.called);
        this.instance.option('zoomLevel', { value: 1.5, items: [ 1, 1.5, 2 ] });
        assert.equal(this.instance.option('zoomLevel.value'), 1.5);
        assert.ok(this.onOptionChanged.called);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ZoomLevel).execute(2);
        assert.equal(this.instance.option('zoomLevel.value'), 2);
        assert.equal(this.onOptionChanged.getCalls().length, 2);
    });
    test('should change autoZoom property', function(assert) {
        assert.equal(this.instance._diagramInstance.settings.autoZoom, 0);
        this.instance.option('autoZoomMode', 'fitContent');
        assert.equal(this.instance._diagramInstance.settings.autoZoom, 1);
        this.instance.option('autoZoomMode', 'fitWidth');
        assert.equal(this.instance._diagramInstance.settings.autoZoom, 2);
        this.instance.option('autoZoomMode', 'disabled');
        assert.equal(this.instance._diagramInstance.settings.autoZoom, 0);
    });
    test('should sync autoZoom property', function(assert) {
        assert.equal(this.instance.option('autoZoomMode'), 'disabled');
        assert.notOk(this.onOptionChanged.called);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.SwitchAutoZoom).execute(1);
        assert.equal(this.instance.option('autoZoomMode'), 'fitContent');
        assert.ok(this.onOptionChanged.called);
    });
    test('should change fullScreen property', function(assert) {
        assert.notOk(this.instance._diagramInstance.settings.fullscreen);
        this.instance.option('fullScreen', true);
        assert.ok(this.instance._diagramInstance.settings.fullscreen);
        this.instance.option('fullScreen', false);
        assert.notOk(this.instance._diagramInstance.settings.fullscreen);
    });
    test('should sync fullScreen property', function(assert) {
        assert.equal(this.instance.option('fullScreen'), false);
        assert.notOk(this.onOptionChanged.called);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Fullscreen).execute(true);
        assert.equal(this.instance.option('fullScreen'), true);
        assert.ok(this.onOptionChanged.called);
    });
    test('should change showGrid property', function(assert) {
        assert.ok(this.instance._diagramInstance.settings.showGrid);
        this.instance.option('showGrid', false);
        assert.notOk(this.instance._diagramInstance.settings.showGrid);
        this.instance.option('showGrid', true);
        assert.ok(this.instance._diagramInstance.settings.showGrid);
    });
    test('should sync showGrid property', function(assert) {
        assert.equal(this.instance.option('showGrid'), true);
        assert.notOk(this.onOptionChanged.called);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ShowGrid).execute(false);
        assert.equal(this.instance.option('showGrid'), false);
        assert.ok(this.onOptionChanged.called);
    });
    test('should change snapToGrid property', function(assert) {
        assert.ok(this.instance._diagramInstance.settings.snapToGrid);
        this.instance.option('snapToGrid', false);
        assert.notOk(this.instance._diagramInstance.settings.snapToGrid);
        this.instance.option('snapToGrid', true);
        assert.ok(this.instance._diagramInstance.settings.snapToGrid);
    });
    test('should sync snapToGrid property', function(assert) {
        assert.equal(this.instance.option('snapToGrid'), true);
        assert.notOk(this.onOptionChanged.called);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.SnapToGrid).execute(false);
        assert.equal(this.instance.option('snapToGrid'), false);
        assert.ok(this.onOptionChanged.called);
    });
    test('should change gridSize property', function(assert) {
        assert.equal(this.instance._diagramInstance.settings.gridSize, 180);
        this.instance.option('gridSize', 0.25);
        assert.equal(this.instance._diagramInstance.settings.gridSize, 360);
        this.instance.option('gridSize', 0.125);
        assert.equal(this.instance._diagramInstance.settings.gridSize, 180);
    });
    test('should sync gridSize property', function(assert) {
        assert.equal(this.instance.option('gridSize'), 0.125);
        assert.notOk(this.onOptionChanged.called);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.GridSize).execute(0.25);
        assert.equal(this.instance.option('gridSize'), 0.25);
        assert.ok(this.onOptionChanged.called);
    });
    test('should change gridSize object property', function(assert) {
        assert.equal(this.instance._diagramInstance.settings.gridSize, 180);
        assert.equal(this.instance._diagramInstance.settings.gridSizeItems.length, 4);
        this.instance.option('gridSize', { value: 0.25, items: [0.25, 1] });
        assert.equal(this.instance._diagramInstance.settings.gridSize, 360);
        assert.equal(this.instance._diagramInstance.settings.gridSizeItems.length, 2);
        this.instance.option('gridSize', 0.125);
        assert.equal(this.instance._diagramInstance.settings.gridSize, 180);
        assert.equal(this.instance._diagramInstance.settings.gridSizeItems.length, 2);
    });
    test('should sync gridSize object property', function(assert) {
        assert.notOk(this.onOptionChanged.called);
        this.instance.option('gridSize', { value: 0.25, items: [0.125, 0.25, 1] });
        assert.ok(this.onOptionChanged.called);
        assert.equal(this.instance.option('gridSize.value'), 0.25);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.GridSize).execute(1);
        assert.equal(this.instance.option('gridSize.value'), 1);
        assert.equal(this.onOptionChanged.getCalls().length, 2);
    });
    test('should change viewUnits property', function(assert) {
        assert.equal(this.instance._diagramInstance.settings.viewUnits, 0);
        this.instance.option('viewUnits', 'cm');
        assert.equal(this.instance._diagramInstance.settings.viewUnits, 1);
        this.instance.option('viewUnits', 'in');
        assert.equal(this.instance._diagramInstance.settings.viewUnits, 0);
    });
    test('should sync viewUnits property', function(assert) {
        assert.equal(this.instance.option('viewUnits'), 'in');
        assert.notOk(this.onOptionChanged.called);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ViewUnits).execute(1);
        assert.equal(this.instance.option('viewUnits'), 'cm');
        assert.ok(this.onOptionChanged.called);
    });
    test('should change units property', function(assert) {
        assert.equal(this.instance._diagramInstance.model.units, 0);
        this.instance.option('units', 'cm');
        assert.equal(this.instance._diagramInstance.model.units, 1);
        this.instance.option('units', 'in');
        assert.equal(this.instance._diagramInstance.model.units, 0);
    });
    test('should change pageSize property', function(assert) {
        assert.equal(this.instance._diagramInstance.model.pageSize.width, 8391);
        assert.equal(this.instance._diagramInstance.model.pageSize.height, 11906);
        this.instance.option('pageSize', { width: 3, height: 5 });
        assert.equal(this.instance._diagramInstance.model.pageSize.width, 4320);
        assert.equal(this.instance._diagramInstance.model.pageSize.height, 7200);
    });
    test('should sync pageSize property', function(assert) {
        assert.notOk(this.onOptionChanged.called);
        this.instance.option('pageSize', { width: 3, height: 5 });
        assert.equal(this.instance.option('pageSize.width'), 3);
        assert.equal(this.instance.option('pageSize.height'), 5);
        assert.equal(this.onOptionChanged.getCalls().length, 2); // +hasChanges
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageSize).execute({ width: 4, height: 6 });
        assert.equal(this.instance.option('pageSize.width'), 4);
        assert.equal(this.instance.option('pageSize.height'), 6);
        assert.equal(this.onOptionChanged.getCalls().length, 3); // +hasChanges
    });
    test('should change pageSize object property', function(assert) {
        assert.equal(this.instance._diagramInstance.model.pageSize.width, 8391);
        assert.equal(this.instance._diagramInstance.model.pageSize.height, 11906);
        assert.equal(this.instance._diagramInstance.settings.pageSizeItems.length, 11);
        this.instance.option('pageSize', { width: 3, height: 5, items: [{ width: 3, height: 5, text: 'A10' }] });
        assert.equal(this.instance._diagramInstance.model.pageSize.width, 4320);
        assert.equal(this.instance._diagramInstance.model.pageSize.height, 7200);
        assert.equal(this.instance._diagramInstance.settings.pageSizeItems.length, 1);
    });
    test('should sync pageSize object property', function(assert) {
        assert.notOk(this.onOptionChanged.called);
        this.instance.option('pageSize', { width: 3, height: 5, items: [{ width: 3, height: 5, text: 'A10' }, { width: 4, height: 6, text: 'A11' }] });
        assert.equal(this.instance.option('pageSize.width'), 3);
        assert.equal(this.instance.option('pageSize.height'), 5);
        assert.equal(this.onOptionChanged.getCalls().length, 2); // +hasChanges
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageSize).execute({ width: 4, height: 6 });
        assert.equal(this.instance.option('pageSize.width'), 4);
        assert.equal(this.instance.option('pageSize.height'), 6);
        assert.equal(this.onOptionChanged.getCalls().length, 3); // +hasChanges
    });
    test('should change pageOrientation property', function(assert) {
        assert.equal(this.instance._diagramInstance.model.pageLandscape, false);
        this.instance.option('pageOrientation', 'landscape');
        assert.equal(this.instance._diagramInstance.model.pageLandscape, true);
        this.instance.option('pageOrientation', 'portrait');
        assert.equal(this.instance._diagramInstance.model.pageLandscape, false);
    });
    test('should sync pageOrientation property', function(assert) {
        assert.equal(this.instance.option('pageOrientation'), 'portrait');
        assert.notOk(this.onOptionChanged.called);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageLandscape).execute(1);
        assert.equal(this.instance.option('pageOrientation'), 'landscape');
        assert.equal(this.onOptionChanged.getCalls().length, 2); // +hasChanges
    });
    test('should change pageColor property', function(assert) {
        assert.equal(this.instance._diagramInstance.model.pageColor, -1); // FFFFFF
        this.instance.option('pageColor', 'red');
        assert.equal(this.instance._diagramInstance.model.pageColor, -65536); // FF0000
        this.instance.option('pageColor', 'white');
        assert.equal(this.instance._diagramInstance.model.pageColor, -1); // FFFFFF
    });
    test('should sync pageColor property', function(assert) {
        assert.equal(this.instance.option('pageColor'), '#ffffff');
        assert.notOk(this.onOptionChanged.called);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageColor).execute('red');
        assert.equal(this.instance.option('pageColor'), '#ff0000');
        assert.equal(this.onOptionChanged.getCalls().length, 2); // +hasChanges
    });
    test('should change simpleView property', function(assert) {
        assert.equal(this.instance._diagramInstance.settings.simpleView, false);
        this.instance.option('simpleView', true);
        assert.equal(this.instance._diagramInstance.settings.simpleView, true);
        this.instance.option('simpleView', false);
        assert.equal(this.instance._diagramInstance.settings.simpleView, false);
    });
    test('should sync simpleView property', function(assert) {
        assert.equal(this.instance.option('simpleView'), false);
        assert.notOk(this.onOptionChanged.called);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ToggleSimpleView).execute(true);
        assert.equal(this.instance.option('simpleView'), true);
        assert.ok(this.onOptionChanged.called);
    });

    test('should change defaultItemProperties', function(assert) {
        assert.equal(this.instance._diagramInstance.selection.inputPosition.initialProperties.style, undefined);
        assert.equal(this.instance._diagramInstance.selection.inputPosition.initialProperties.textStyle, undefined);
        assert.equal(this.instance._diagramInstance.selection.inputPosition.initialProperties.connectionProperties, undefined);
        this.instance.option('defaultItemProperties.style', { fill: '#ff0000' });
        this.instance.option('defaultItemProperties.textStyle', { fill: '#ff0000' });
        this.instance.option('defaultItemProperties.connectorLineType', 'straight');
        this.instance.option('defaultItemProperties.connectorLineStart', 'filledTriangle');
        this.instance.option('defaultItemProperties.connectorLineEnd', 'filledTriangle');
        assert.equal(this.instance._diagramInstance.selection.inputPosition.initialProperties.style['fill'], '#ff0000');
        assert.equal(this.instance._diagramInstance.selection.inputPosition.initialProperties.textStyle['fill'], '#ff0000');
        assert.equal(this.instance._diagramInstance.selection.inputPosition.initialProperties.connectorProperties.lineOption, 0);
        assert.equal(this.instance._diagramInstance.selection.inputPosition.initialProperties.connectorProperties.startLineEnding, 3);
        assert.equal(this.instance._diagramInstance.selection.inputPosition.initialProperties.connectorProperties.endLineEnding, 3);
        this.instance.option('defaultItemProperties.style', { fill: '#ee0000' });
        this.instance.option('defaultItemProperties.textStyle', { fill: '#ee0000' });
        this.instance.option('defaultItemProperties.connectorLineType', 'orthogonal');
        this.instance.option('defaultItemProperties.connectorLineStart', 'outlinedTriangle');
        this.instance.option('defaultItemProperties.connectorLineEnd', 'outlinedTriangle');
        assert.equal(this.instance._diagramInstance.selection.inputPosition.initialProperties.style['fill'], '#ee0000');
        assert.equal(this.instance._diagramInstance.selection.inputPosition.initialProperties.textStyle['fill'], '#ee0000');
        assert.equal(this.instance._diagramInstance.selection.inputPosition.initialProperties.connectorProperties.lineOption, 1);
        assert.equal(this.instance._diagramInstance.selection.inputPosition.initialProperties.connectorProperties.startLineEnding, 2);
        assert.equal(this.instance._diagramInstance.selection.inputPosition.initialProperties.connectorProperties.endLineEnding, 2);
    });

    test('should change dataSource options', function(assert) {
        assert.equal(this.instance._diagramInstance.documentDataSource, undefined);
        this.instance.option('nodes.dataSource', [
            {
                id: '1',
                text: 'text1'
            },
            {
                id: '2',
                text: 'text2'
            }
        ]);
        assert.notEqual(this.instance._diagramInstance.documentDataSource, undefined);
        assert.equal(this.instance._diagramInstance.documentDataSource.nodes.length, 2);
        assert.equal(this.instance._diagramInstance.documentDataSource.edges.length, 0);

        this.instance.option('edges.dataSource', [
            {
                id: '3',
                from: '1',
                to: '2'
            }
        ]);
        assert.notEqual(this.instance._diagramInstance.documentDataSource, undefined);
        assert.equal(this.instance._diagramInstance.documentDataSource.nodes.length, 2);
        assert.equal(this.instance._diagramInstance.documentDataSource.edges.length, 1);
    });

    test('should change data expression options', function(assert) {
        assert.equal(this.instance._diagramInstance.documentDataSource, undefined);
        this.instance.option('nodes.dataSource', [
            {
                id: '1',
                text: 'text1'
            }
        ]);
        assert.notEqual(this.instance._diagramInstance.documentDataSource, undefined);

        assert.notEqual(this.instance._diagramInstance.documentDataSource.nodeDataImporter.getKey, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.nodeDataImporter.setKey, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.nodeDataImporter.getType, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.nodeDataImporter.setType, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.nodeDataImporter.getText, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.nodeDataImporter.setText, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.nodeDataImporter.getChildren, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.nodeDataImporter.setChildren, undefined);
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataImporter.getContainerKey, undefined);
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataImporter.setContainerKey, undefined);

        assert.notEqual(this.instance._diagramInstance.documentDataSource.edgeDataImporter.getKey, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.edgeDataImporter.setKey, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.edgeDataImporter.getFrom, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.edgeDataImporter.setFrom, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.edgeDataImporter.getTo, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.edgeDataImporter.setTo, undefined);

        this.instance.option('nodes.containerKeyExpr', 'containerKey');
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataImporter.getChildren, undefined);
        assert.equal(this.instance._diagramInstance.documentDataSource.nodeDataImporter.setChildren, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.nodeDataImporter.getContainerKey, undefined);
        assert.notEqual(this.instance._diagramInstance.documentDataSource.nodeDataImporter.setContainerKey, undefined);
    });

    test('should return correct autoLayout parameters based on the nodes.autoLayout option', function(assert) {
        assert.equal(this.instance.option('nodes.autoLayout'), 'auto');
        assert.deepEqual(this.instance._getDataBindingLayoutParameters(), { type: DataLayoutType.Sugiyama });

        this.instance.option('nodes.leftExpr', 'left');
        this.instance.option('nodes.topExpr', 'left');
        assert.equal(this.instance._getDataBindingLayoutParameters(), undefined);
        this.instance.option('nodes.autoLayout', { type: 'auto' });
        assert.equal(this.instance._getDataBindingLayoutParameters(), undefined);

        this.instance.option('nodes.leftExpr', '');
        assert.deepEqual(this.instance._getDataBindingLayoutParameters(), { type: DataLayoutType.Sugiyama });
        this.instance.option('nodes.topExpr', '');
        assert.deepEqual(this.instance._getDataBindingLayoutParameters(), { type: DataLayoutType.Sugiyama });

        this.instance.option('nodes.autoLayout', 'off');
        assert.equal(this.instance._getDataBindingLayoutParameters(), undefined);
        this.instance.option('nodes.autoLayout', { type: 'off' });
        assert.equal(this.instance._getDataBindingLayoutParameters(), undefined);

        this.instance.option('nodes.autoLayout', 'tree');
        assert.deepEqual(this.instance._getDataBindingLayoutParameters(), { type: DataLayoutType.Tree });
        this.instance.option('nodes.autoLayout', { type: 'tree' });
        assert.deepEqual(this.instance._getDataBindingLayoutParameters(), { type: DataLayoutType.Tree });
    });

    test('should change customShapes option', function(assert) {
        const descriptions = this.instance._diagramInstance.shapeDescriptionManager.descriptions;
        assert.equal(Object.keys(descriptions).length, 43);

        this.instance.option('customShapes', [
            {
                type: 'type1',
                title: 'type1'
            },
            {
                type: 'type2',
                title: 'type2'
            }
        ]);
        assert.equal(Object.keys(descriptions).length, 45);

        this.instance.option('customShapes', [
            {
                type: 'type3',
                title: 'type3'
            }
        ]);
        assert.equal(Object.keys(descriptions).length, 44);
    });

    test('hasChanges changes on import or editing of an unbound diagram', function(assert) {
        assert.equal(this.instance.option('hasChanges'), false, 'on init');
        assert.notOk(this.onOptionChanged.called);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(Consts.SIMPLE_DIAGRAM);
        assert.equal(this.instance.option('hasChanges'), true, 'on import');
        assert.ok(this.onOptionChanged.called);
        this.instance.option('hasChanges', false);
        this.instance._diagramInstance.selection.set(['107']);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Bold).execute(true);
        assert.equal(this.instance.option('hasChanges'), true, 'on edit');
    });
    test('hasChanges changes on data bind a diagram', function(assert) {
        assert.equal(this.instance.option('hasChanges'), false, 'on init');
        assert.notOk(this.onOptionChanged.called);
        this.instance.option('nodes.dataSource', [
            {
                id: '1',
                text: 'text1'
            },
            {
                id: '2',
                text: 'text2'
            }
        ]);
        assert.equal(this.instance.option('hasChanges'), true, 'on data bind');
        assert.ok(this.onOptionChanged.called);
        this.instance.option('hasChanges', false);
        this.instance._diagramInstance.selection.set(['1']);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Bold).execute(true);
        assert.equal(this.instance.option('hasChanges'), true, 'on edit');
    });
});

QUnit.module('Options (initially set)', {}, () => {
    test('hasChanges changes on a data bound diagram', function(assert) {
        const onOptionChanged = sinon.spy();
        const $element = $('#diagram').dxDiagram({
            onOptionChanged: onOptionChanged,
            nodes: {
                dataSource: [
                    {
                        id: '1',
                        text: 'text1'
                    },
                    {
                        id: '2',
                        text: 'text2'
                    }
                ]
            }
        });
        const instance = $element.dxDiagram('instance');

        assert.equal(instance.option('hasChanges'), false, 'on init');
        assert.notOk(onOptionChanged.called);
        instance._diagramInstance.selection.set(['1']);
        instance._diagramInstance.commandManager.getCommand(DiagramCommand.Bold).execute(true);
        assert.equal(instance.option('hasChanges'), true, 'on edit');
        assert.ok(onOptionChanged.called);
    });

    test('should has non-default options', function(assert) {
        const onOptionChanged = sinon.spy();
        const $element = $('#diagram').dxDiagram({
            onOptionChanged: onOptionChanged,
            simpleView: true,
            zoomLevel: 2,
            fullScreen: true,
            showGrid: false,
            snapToGrid: false,
            gridSize: 0.25,
            viewUnits: 'cm',
            units: 'cm',
            pageColor: '#ff0000',
            pageSize: { width: 3, height: 5 }
        });
        const instance = $element.dxDiagram('instance');

        assert.ok(instance._diagramInstance.settings.simpleView);
        assert.equal(instance._diagramInstance.settings.zoomLevel, 2);
        assert.ok(instance._diagramInstance.settings.fullscreen);
        assert.notOk(instance._diagramInstance.settings.showGrid);
        assert.notOk(instance._diagramInstance.settings.snapToGrid);
        assert.equal(instance._diagramInstance.settings.gridSize, 142);
        assert.equal(instance._diagramInstance.settings.viewUnits, 1);
        assert.equal(instance._diagramInstance.model.units, 1);
        assert.equal(instance._diagramInstance.model.pageColor, -65536); // FF0000
        assert.equal(instance._diagramInstance.model.pageSize.width, 1701);
        assert.equal(instance._diagramInstance.model.pageSize.height, 2835);
        assert.notOk(onOptionChanged.called);
    });

    test('should has non-default autoZoomMode option', function(assert) {
        const onOptionChanged = sinon.spy();
        const $element = $('#diagram').dxDiagram({
            onOptionChanged: onOptionChanged,
            autoZoomMode: 'fitContent',
        });
        const instance = $element.dxDiagram('instance');

        assert.equal(instance._diagramInstance.settings.autoZoom, 1);
        assert.equal(onOptionChanged.getCalls().length, 1);
        assert.equal(onOptionChanged.getCall(0).args[0]['name'], 'zoomLevel');
    });

    test('should not change model options if readOnly=true', function(assert) {
        const $element = $('#diagram').dxDiagram({
            readOnly: true,
            pageColor: '#ff0000',
            pageSize: { width: 3, height: 5 },
            snapToGrid: false
        });
        const instance = $element.dxDiagram('instance');

        assert.ok(instance._diagramInstance.settings.readOnly);
        assert.equal(instance._diagramInstance.model.pageColor, -1); // FFFFFF
        assert.equal(instance._diagramInstance.model.pageSize.width, 8391);
        assert.equal(instance._diagramInstance.model.pageSize.height, 11906);
        assert.ok(instance._diagramInstance.settings.snapToGrid);
    });

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
        const $element = $('#diagram').dxDiagram({
            nodes: {
                dataSource
            }
        });
        const instance = $element.dxDiagram('instance');

        assert.equal(instance._nodesOption._items.length, 2);
        assert.equal(instance._nodesOption._getIndexByKey('1'), 0);
        assert.equal(instance._nodesOption._getIndexByKey('2'), 1);

        store.insert({
            id: '3',
            text: 'text3'
        });
        dataSource.reload();
        assert.equal(instance._nodesOption._items.length, 3);
        assert.equal(instance._nodesOption._getIndexByKey('1'), 0);
        assert.equal(instance._nodesOption._getIndexByKey('2'), 1);
        assert.equal(instance._nodesOption._getIndexByKey('3'), 2);
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
        const $element = $('#diagram').dxDiagram({
            nodes: {
                dataSource,
                itemsExpr: 'items'
            }
        });
        const instance = $element.dxDiagram('instance');

        assert.equal(instance._nodesOption._items.length, 2);
        assert.equal(instance._nodesOption._items[0].items.length, 1);
        assert.equal(instance._nodesOption._getIndexByKey('1'), 0);
        assert.equal(instance._nodesOption._getIndexByKey('2'), 1);
        assert.equal(instance._nodesOption._getIndexByKey('3'), 2);
        assert.equal(instance._nodesOption._getIndexByKey('4'), 3);

        store.insert({
            id: '5',
            text: 'text5'
        });
        dataSource.reload();
        assert.equal(instance._nodesOption._items.length, 3);
        assert.equal(instance._nodesOption._getIndexByKey('1'), 0);
        assert.equal(instance._nodesOption._getIndexByKey('2'), 1);
        assert.equal(instance._nodesOption._getIndexByKey('3'), 3);
        assert.equal(instance._nodesOption._getIndexByKey('4'), 4);
        assert.equal(instance._nodesOption._getIndexByKey('5'), 2);
    });

});
