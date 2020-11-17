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
    { 'name': 'CCC' },
    { 'name': 'bold' },
    { 'name': 'bold', 'text': 'Custom bold1' },
    { 'name': 'bold', 'icon': 'Custom bold2' },
    { 'name': 'fontName', 'text': 'Custom fontName' },
    { 'xxx': 'DDD' },
    {
        'text': 'EEE',
        'items': [
            'cut',
            'separator',
            'selectAll'
        ]
    },
    'toolbox',
    { name: 'zoomLevel' },
    { name: 'pageSize' }
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
        assert.equal(commands.length, 14);
        assert.equal(commands[6].command, 16);
        assert.equal(commands[6].icon, 'bold');
        assert.equal(commands[6].text, 'Bold');
        assert.equal(commands[7].command, 16);
        assert.equal(commands[7].icon, 'bold');
        assert.equal(commands[7].text, 'Custom bold1');
        assert.equal(commands[8].command, 16);
        assert.equal(commands[8].icon, 'Custom bold2');
        assert.equal(commands[8].text, 'Bold');
        assert.equal(commands[9].command, 19);
        assert.equal(commands[9].text, 'Custom fontName');
        assert.equal(commands[9].widget, 'dxSelectBox');
        assert.equal(commands[9].items.length, 10);
        assert.equal(commands[10].items.length, 2);
        assert.equal(commands[10].items[1].beginGroup, true);
    });
    test('custom history toolbar commands', function(assert) {
        const commands = DiagramCommandsManager.getHistoryToolbarCommands(customCommands);
        assert.equal(commands.length, 14);
        assert.equal(commands[10].items.length, 2);
        assert.equal(commands[10].items[1].beginGroup, true);
    });
    test('custom view toolbar commands', function(assert) {
        const commands = DiagramCommandsManager.getViewToolbarCommands(customCommands);
        assert.equal(commands.length, 14);
        assert.equal(commands[10].items.length, 2);
        assert.equal(commands[10].items[1].beginGroup, true);
        assert.equal(commands[11].command, 'toolbox');
        assert.notEqual(commands[11].iconChecked, undefined);
        assert.notEqual(commands[11].iconUnchecked, undefined);
        assert.equal(commands[12].command, 60);
        assert.equal(commands[12].name, 'zoomLevel');
        assert.notEqual(commands[12].getEditorDisplayValue, undefined);
        assert.equal(commands[13].command, 54);
        assert.equal(commands[13].name, 'pageSize');
        assert.notEqual(commands[13].getCommandValue, undefined);
        assert.notEqual(commands[13].getEditorValue, undefined);
    });
    test('custom view toolbar commands with excludes', function(assert) {
        const commands = DiagramCommandsManager.getViewToolbarCommands(customCommands, ['toolbox']);
        assert.equal(commands.length, 13);
        assert.equal(commands[10].items.length, 2);
        assert.equal(commands[10].items[1].beginGroup, true);
    });
    test('default context menu commands', function(assert) {
        assert.equal(DiagramCommandsManager.getContextMenuCommands().length, 12);
    });
    test('custom context menu commands', function(assert) {
        const commands = DiagramCommandsManager.getContextMenuCommands(customCommands);
        assert.equal(commands.length, 13);
        assert.equal(commands[2].beginGroup, true);
        assert.equal(commands[5].command, 16);
        assert.equal(commands[5].icon, 'bold');
        assert.equal(commands[5].text, 'Bold');
        assert.equal(commands[6].command, 16);
        assert.equal(commands[6].icon, 'bold');
        assert.equal(commands[6].text, 'Custom bold1');
        assert.equal(commands[7].command, 16);
        assert.equal(commands[7].icon, 'Custom bold2');
        assert.equal(commands[7].text, 'Bold');
        assert.equal(commands[8].command, 19);
        assert.equal(commands[8].text, 'Custom fontName');
        assert.equal(commands[8].widget, 'dxSelectBox');
        assert.equal(commands[8].items.length, 10);
        assert.equal(commands[9].items.length, 2);
        assert.equal(commands[9].items[1].beginGroup, true);
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
