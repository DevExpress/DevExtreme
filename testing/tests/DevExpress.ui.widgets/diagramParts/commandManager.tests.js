import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';
import DiagramCommandsManager from 'ui/diagram/diagram.commands_manager.js';

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
        assert.equal(DiagramCommandsManager.getMainToolbarCommands().length, 27);
        assert.equal(DiagramCommandsManager.getHistoryToolbarCommands().length, 3);
        assert.equal(DiagramCommandsManager.getViewToolbarCommands().length, 6);
        assert.equal(DiagramCommandsManager.getContextMenuCommands().length, 12);
    });
    test('custom toolbar commands', function(assert) {
        const commands = DiagramCommandsManager.getMainToolbarCommands([
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
        ]);
        assert.equal(commands.length, 6);
        assert.equal(commands[5].items.length, 2);
        assert.equal(commands[5].items[1].beginGroup, true);
    });
    test('custom context menu commands', function(assert) {
        const commands = DiagramCommandsManager.getContextMenuCommands([
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
        ]);
        assert.equal(commands.length, 5);
        assert.equal(commands[2].beginGroup, true);
        assert.equal(commands[5].items.length, 2);
        assert.equal(commands[5].items[1].beginGroup, true);
    });
});
