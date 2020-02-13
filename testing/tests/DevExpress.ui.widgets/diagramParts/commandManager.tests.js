import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';

import DiagramCommandsManager from 'ui/diagram/diagram.commands_manager.js';

const customCommands = [
    'copy',
    'paste',
    'separator',
    { 'text': 'AAA' },
    { 'icon': 'BBB' },
    { 'xxx': 'CCC' },
    {
        'text': 'DDD',
        'items': [
            'cut',
            'separator',
            'selectAll'
        ]
    },
    'showToolbox'
];

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram();
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('CommandManager', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach.apply(this, arguments);
    },
    afterEach: function() {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('default commands', function(assert) {
        assert.equal(DiagramCommandsManager.getMainToolbarCommands().length, 23);
        assert.equal(DiagramCommandsManager.getHistoryToolbarCommands().length, 3);
        assert.equal(DiagramCommandsManager.getViewToolbarCommands().length, 6);
        assert.equal(DiagramCommandsManager.getViewToolbarCommands()[5].items.length, 6);
        assert.equal(DiagramCommandsManager.getContextMenuCommands().length, 12);
        assert.equal(DiagramCommandsManager.getPropertyPanelCommands().length, 3);
    });
    test('default commands with excludes', function(assert) {
        assert.equal(DiagramCommandsManager.getMainToolbarCommands(undefined, [1]).length, 22);
        assert.equal(DiagramCommandsManager.getViewToolbarCommands(undefined, ['toolbox']).length, 6);
        assert.equal(DiagramCommandsManager.getViewToolbarCommands(undefined, ['toolbox'])[5].items.length, 5);
    });
    test('custom toolbar commands', function(assert) {
        const commands = DiagramCommandsManager.getMainToolbarCommands(customCommands);
        assert.equal(commands.length, 7);
        assert.equal(commands[5].items.length, 2);
        assert.equal(commands[5].items[1].beginGroup, true);
    });
    test('custom toolbar commands with excludes', function(assert) {
        const commands = DiagramCommandsManager.getMainToolbarCommands(customCommands, ['toolbox']);
        assert.equal(commands.length, 6);
    });
    test('custom context menu commands', function(assert) {
        const commands = DiagramCommandsManager.getContextMenuCommands(customCommands);
        assert.equal(commands.length, 6);
        assert.equal(commands[2].beginGroup, true);
        assert.equal(commands[4].items.length, 2);
        assert.equal(commands[4].items[1].beginGroup, true);
    });
    test('custom properties panel commands', function(assert) {
        const commands = DiagramCommandsManager.getPropertyPanelCommands([
            { commands: [ 'gridSize', 'showGrid' ] },
            { commands: [ 'pageSize', 'pageColor' ] }
        ]);
        assert.equal(commands.length, 4);
        assert.equal(commands[2].beginGroup, true);
    });
});
