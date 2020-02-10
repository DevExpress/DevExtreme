import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';
import { DiagramCommand, DataLayoutType } from 'devexpress-diagram';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram();
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
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ZoomLevel).execute(1.5);
        assert.equal(this.instance.option('zoomLevel'), 1.5);
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
        this.instance.option('zoomLevel', { value: 1.5, items: [ 1, 1.5, 2 ] });
        assert.equal(this.instance.option('zoomLevel.value'), 1.5);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ZoomLevel).execute(2);
        assert.equal(this.instance.option('zoomLevel.value'), 2);
    });
    test('should change autoZoom property', function(assert) {
        assert.equal(this.instance._diagramInstance.settings.autoZoom, 0);
        this.instance.option('autoZoom', 'fitContent');
        assert.equal(this.instance._diagramInstance.settings.autoZoom, 1);
        this.instance.option('autoZoom', 'fitWidth');
        assert.equal(this.instance._diagramInstance.settings.autoZoom, 2);
        this.instance.option('autoZoom', 'disabled');
        assert.equal(this.instance._diagramInstance.settings.autoZoom, 0);
    });
    test('should sync autoZoom property', function(assert) {
        assert.equal(this.instance.option('autoZoom'), 'disabled');
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.SwitchAutoZoom).execute(1);
        assert.equal(this.instance.option('autoZoom'), 'fitContent');
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
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Fullscreen).execute(true);
        assert.equal(this.instance.option('fullScreen'), true);
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
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ShowGrid).execute(false);
        assert.equal(this.instance.option('showGrid'), false);
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
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.SnapToGrid).execute(false);
        assert.equal(this.instance.option('snapToGrid'), false);
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
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.GridSize).execute(0.25);
        assert.equal(this.instance.option('gridSize'), 0.25);
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
        this.instance.option('gridSize', { value: 0.25, items: [0.125, 0.25, 1] });
        assert.equal(this.instance.option('gridSize.value'), 0.25);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.GridSize).execute(1);
        assert.equal(this.instance.option('gridSize.value'), 1);
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
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ViewUnits).execute(1);
        assert.equal(this.instance.option('viewUnits'), 'cm');
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
        this.instance.option('pageSize', { width: 3, height: 5 });
        assert.equal(this.instance.option('pageSize.width'), 3);
        assert.equal(this.instance.option('pageSize.height'), 5);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageSize).execute({ width: 4, height: 6 });
        assert.equal(this.instance.option('pageSize.width'), 4);
        assert.equal(this.instance.option('pageSize.height'), 6);
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
        this.instance.option('pageSize', { width: 3, height: 5, items: [{ width: 3, height: 5, text: 'A10' }, { width: 4, height: 6, text: 'A11' }] });
        assert.equal(this.instance.option('pageSize.width'), 3);
        assert.equal(this.instance.option('pageSize.height'), 5);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageSize).execute({ width: 4, height: 6 });
        assert.equal(this.instance.option('pageSize.width'), 4);
        assert.equal(this.instance.option('pageSize.height'), 6);
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
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageLandscape).execute(1);
        assert.equal(this.instance.option('pageOrientation'), 'landscape');
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
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageColor).execute('red');
        assert.equal(this.instance.option('pageColor'), '#ff0000'); // FF0000
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
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ToggleSimpleView).execute(true);
        assert.equal(this.instance.option('simpleView'), true);
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
});
