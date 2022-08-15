import $ from 'jquery';
const { test } = QUnit;
import 'ui/diagram';

import { DiagramCommand } from 'devexpress-diagram';
import { Consts, getContextMenuInstance, findContextMenuItem } from '../../../helpers/diagramHelpers.js';

const moduleConfig = {
    beforeEach: function() {
        this.onCustomCommand = sinon.spy();
        this.$element = $('#diagram').dxDiagram({
            onCustomCommand: this.onCustomCommand
        });
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('Context Menu', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach.apply(this, arguments);
    },
    afterEach: function() {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('should not render if contextMenu.enabled is false', function(assert) {
        let $contextMenu = this.$element.find(Consts.CONTEXT_MENU_SELECTOR);
        assert.equal($contextMenu.length, 1);
        this.instance.option('contextMenu.enabled', false);
        $contextMenu = this.$element.children(Consts.CONTEXT_MENU_SELECTOR);
        assert.equal($contextMenu.length, 0);
    });
    test('should load default items', function(assert) {
        const contextMenu = getContextMenuInstance(this.$element);
        assert.ok(contextMenu.option('items').length > 1);
    });
    test('should load custom items', function(assert) {
        this.instance.option('contextMenu.commands', ['copy']);
        const contextMenu = getContextMenuInstance(this.$element);
        assert.equal(contextMenu.option('items').length, 1);
    });
    test('should update items on showing', function(assert) {
        this.instance.option('contextMenu.commands', ['copy', 'selectAll']);
        const contextMenu = getContextMenuInstance(this.$element);
        assert.notOk(contextMenu.option('visible'));
        assert.equal(contextMenu.option('items')[0].visible, undefined);
        assert.equal(contextMenu.option('items')[1].visible, undefined);
        contextMenu.show();
        assert.ok(contextMenu.option('visible'));
        assert.equal(contextMenu.option('items')[0].visible, false);
        assert.equal(contextMenu.option('items')[1].visible, true);
    });
    test('should execute commands on click', function(assert) {
        this.instance.option('contextMenu.commands', ['selectAll']);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(Consts.SIMPLE_DIAGRAM);
        const contextMenu = getContextMenuInstance(this.$element);
        contextMenu.show();
        assert.ok(this.instance._diagramInstance.selection.isEmpty());
        findContextMenuItem(this.$element, 'select all').trigger('dxclick');
        assert.notOk(this.instance._diagramInstance.selection.isEmpty());
    });
    test('diagram should be focused after menu item click', function(assert) {
        this.instance.option('contextMenu.commands', ['selectAll']);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(Consts.SIMPLE_DIAGRAM);
        const contextMenu = getContextMenuInstance(this.$element);
        assert.notEqual(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
        contextMenu.show();
        findContextMenuItem(this.$element, 'select all').trigger('dxclick');
        this.clock.tick(200);
        assert.equal(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
    });
    test('should execute custom commands on click', function(assert) {
        this.instance.option('contextMenu.commands', [
            {
                name: 'custom1',
                text: 'custom1',
            },
            {
                name: 'bold',
                text: 'custom bold',
            },
            {
                text: 'sub menu',
                items: [{
                    name: 'custom2',
                    text: 'custom2'
                }, {
                    name: 'italic',
                    text: 'custom italic'
                }]
            }
        ]);

        assert.notOk(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Bold).getState().value);
        assert.notOk(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Italic).getState().value);

        const contextMenu = getContextMenuInstance(this.$element);
        contextMenu.show();
        findContextMenuItem(this.$element, 'custom1').trigger('dxclick');
        findContextMenuItem(this.$element, 'custom bold').trigger('dxclick');
        findContextMenuItem(this.$element, 'sub menu').trigger('dxclick');
        findContextMenuItem(this.$element, 'custom2').trigger('dxclick');
        findContextMenuItem(this.$element, 'sub menu').trigger('dxclick');
        findContextMenuItem(this.$element, 'custom italic').trigger('dxclick');
        assert.ok(this.onCustomCommand.called);
        assert.equal(this.onCustomCommand.getCalls().length, 4);
        assert.equal(this.onCustomCommand.getCall(0).args[0]['name'], 'custom1');
        assert.equal(this.onCustomCommand.getCall(1).args[0]['name'], 'bold');
        assert.equal(this.onCustomCommand.getCall(2).args[0]['name'], 'custom2');
        assert.equal(this.onCustomCommand.getCall(3).args[0]['name'], 'italic');

        assert.ok(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Bold).getState().value);
        assert.ok(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Italic).getState().value);
    });
});
