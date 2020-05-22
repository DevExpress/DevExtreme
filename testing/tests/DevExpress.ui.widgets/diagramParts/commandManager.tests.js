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
    'toolbox'
];

const customTabs = [
    {
        title: 'AAA',
        groups: [
            {
                title: 'AAA1',
                commands: ['fontName', 'fontSize']
            },
            {
                title: 'AAA2',
                commands: ['fillColor']
            },
        ]
    },
    {
        title: 'BBB',
        groups: [
            {
                title: 'BBB1',
                commands: ['gridSize']
            },
        ]
    }
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
    test('default main toolbar commands', function(assert) {
        assert.equal(DiagramCommandsManager.getMainToolbarCommands().length, 25);
    });
    test('default history toolbar commands', function(assert) {
        assert.equal(DiagramCommandsManager.getHistoryToolbarCommands().length, 4);
    });
    test('default view toolbar commands', function(assert) {
        const commands = DiagramCommandsManager.getViewToolbarCommands();
        assert.equal(commands.length, 6);
        assert.equal(commands[5].items.length, 6);
    });
    test('default view toolbar commands with excludes', function(assert) {
        const commands = DiagramCommandsManager.getViewToolbarCommands(undefined, ['toolbox']);
        assert.equal(commands.length, 6);
        assert.equal(commands[5].items.length, 5);
    });
    test('custom main toolbar commands', function(assert) {
        const commands = DiagramCommandsManager.getMainToolbarCommands(customCommands);
        assert.equal(commands.length, 7);
        assert.equal(commands[5].items.length, 2);
        assert.equal(commands[5].items[1].beginGroup, true);
    });
    test('custom history toolbar commands', function(assert) {
        const commands = DiagramCommandsManager.getHistoryToolbarCommands(customCommands);
        assert.equal(commands.length, 7);
        assert.equal(commands[5].items.length, 2);
        assert.equal(commands[5].items[1].beginGroup, true);
    });
    test('custom view toolbar commands', function(assert) {
        const commands = DiagramCommandsManager.getViewToolbarCommands(customCommands);
        assert.equal(commands.length, 7);
        assert.equal(commands[5].items.length, 2);
        assert.equal(commands[5].items[1].beginGroup, true);
    });
    test('custom view toolbar commands with excludes', function(assert) {
        const commands = DiagramCommandsManager.getViewToolbarCommands(customCommands, ['toolbox']);
        assert.equal(commands.length, 6);
        assert.equal(commands[5].items.length, 2);
        assert.equal(commands[5].items[1].beginGroup, true);
    });
    test('default context menu commands', function(assert) {
        assert.equal(DiagramCommandsManager.getContextMenuCommands().length, 12);
    });
    test('custom context menu commands', function(assert) {
        const commands = DiagramCommandsManager.getContextMenuCommands(customCommands);
        assert.equal(commands.length, 6);
        assert.equal(commands[2].beginGroup, true);
        assert.equal(commands[4].items.length, 2);
        assert.equal(commands[4].items[1].beginGroup, true);
    });
    test('default properties panel command tabs', function(assert) {
        const groups = DiagramCommandsManager.getPropertyPanelCommandTabs();
        assert.equal(groups.length, 3);
        assert.equal(groups[0].groups.length, 3);
        assert.equal(groups[0].groups[2].commands.length, 3);
    });
    test('custom properties panel command tabs', function(assert) {
        const groups = DiagramCommandsManager.getPropertyPanelCommandTabs(customTabs);
        assert.equal(groups.length, 2);
        assert.equal(groups[0].groups.length, 2);
        assert.equal(groups[0].groups[0].commands.length, 2);
    });
});
