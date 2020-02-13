import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';
import { DiagramCommand } from 'devexpress-diagram';
import { SIMPLE_DIAGRAM } from '../diagram.tests.js';

const CONTEXT_MENU_SELECTOR = 'div:not(.dx-diagram-toolbar-wrapper):not(.dx-diagram-floating-toolbar-container) > .dx-has-context-menu';
const DX_MENU_ITEM_SELECTOR = '.dx-menu-item';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram();
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
        let $contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR);
        assert.equal($contextMenu.length, 1);
        this.instance.option('contextMenu.enabled', false);
        $contextMenu = this.$element.children(CONTEXT_MENU_SELECTOR);
        assert.equal($contextMenu.length, 0);
    });
    test('should load default items', function(assert) {
        const contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR).dxContextMenu('instance');
        assert.ok(contextMenu.option('items').length > 1);
    });
    test('should load custom items', function(assert) {
        this.instance.option('contextMenu.commands', ['copy']);
        const contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR).dxContextMenu('instance');
        assert.equal(contextMenu.option('items').length, 1);
    });
    test('should update items on showing', function(assert) {
        this.instance.option('contextMenu.commands', ['copy', 'selectAll']);
        const contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR).dxContextMenu('instance');
        assert.notOk(contextMenu.option('visible'));
        assert.ok(contextMenu.option('items')[0].text.indexOf('Copy') > -1);
        contextMenu.show();
        assert.ok(contextMenu.option('visible'));
        assert.ok(contextMenu.option('items')[0].text.indexOf('Select All') > -1);
    });
    test('should execute commands on click', function(assert) {
        this.instance.option('contextMenu.commands', ['selectAll']);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(SIMPLE_DIAGRAM);
        const contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR).dxContextMenu('instance');
        contextMenu.show();
        assert.ok(this.instance._diagramInstance.selection.isEmpty());
        $(contextMenu.itemsContainer().find(DX_MENU_ITEM_SELECTOR).eq(0)).trigger('dxclick');
        assert.notOk(this.instance._diagramInstance.selection.isEmpty());
    });
});
