import $ from 'jquery';
import { extend } from 'core/utils/extend';
import 'ui/gantt';
import { Consts, data, options } from '../../../helpers/ganttHelpers.js';
const { test } = QUnit;

const moduleConfig = {
    beforeEach: function() {
        this.createInstance = (settings) => {
            this.instance = this.$element.dxGantt(settings).dxGantt('instance');
        };

        this.$element = $('#gantt');
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};

QUnit.module('Events', moduleConfig, () => {
    test('onCustomCommand', function(assert) {
        let executedCommandName;
        const eventsOptions = {
            contextMenu: {
                items: [{ name: 'custom', text: 'customItem' }]
            },
            onCustomCommand: (e) => {
                executedCommandName = e.name;
            }
        };
        this.createInstance(extend(options.tasksOnlyOptions, eventsOptions));
        this.clock.tick();

        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        const popupItem = $('body').find(Consts.OVERLAY_WRAPPER_SELECTOR).find(Consts.CONTEXT_MENU_SELECTOR).find(Consts.CONTEXT_MENU_ITEM_SELECTOR).eq(0);
        popupItem.trigger('dxclick');

        this.clock.tick();
        assert.equal(executedCommandName, eventsOptions.contextMenu.items[0].name, 'onCustomCommand was raised');
    });
    test('selection changed', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick();

        const key = 2;
        let keyFromEvent;
        this.instance.option('onSelectionChanged', (e) => {
            keyFromEvent = e.selectedRowKey;
        });
        this.instance.option('selectedRowKey', key);
        this.clock.tick();
        assert.equal(keyFromEvent, key);
    });
    test('onContentReady', function(assert) {
        const onContentReadyHandler = sinon.stub();
        const eventsOptions = {
            tasks: {
                dataSource: data.tasks
            },
            onContentReady: onContentReadyHandler
        };
        this.createInstance(eventsOptions);
        this.clock.tick();

        assert.equal(onContentReadyHandler.callCount, 1, 'onContentReadyHandler was called 1 times');
    });
    test('task click', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick();

        const key = 2;
        let keyFromEvent;
        this.instance.option('onTaskClick', (e) => {
            keyFromEvent = e.key;
        });
        const $cellElement = $(this.instance._treeList.getCellElement(key - 1, 0));
        $cellElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(keyFromEvent, key);
    });

    test('task double click', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick();

        const key = 2;
        let keyFromEvent;
        this.instance.option('onTaskDblClick', (e) => {
            keyFromEvent = e.key;
            e.cancel = true;
        });
        const $cellElement = $(this.instance._treeList.getCellElement(key - 1, 0));
        $cellElement.trigger('dxdblclick');
        this.clock.tick();
        assert.equal(keyFromEvent, key);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 0, 'dialog is not shown');
    });
});
