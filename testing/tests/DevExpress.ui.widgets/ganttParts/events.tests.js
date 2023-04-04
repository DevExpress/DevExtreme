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
        this.clock.tick(10);

        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        const popupItem = $('body').find(Consts.OVERLAY_WRAPPER_SELECTOR).find(Consts.CONTEXT_MENU_SELECTOR).find(Consts.CONTEXT_MENU_ITEM_SELECTOR).eq(0);
        popupItem.trigger('dxclick');

        this.clock.tick(10);
        assert.equal(executedCommandName, eventsOptions.contextMenu.items[0].name, 'onCustomCommand was raised');
    });
    test('selection changed', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);

        const key = 2;
        let keyFromEvent;
        this.instance.option('onSelectionChanged', (e) => {
            keyFromEvent = e.selectedRowKey;
        });
        this.instance.option('selectedRowKey', key);
        this.clock.tick(10);
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
        this.clock.tick(10);

        assert.equal(onContentReadyHandler.callCount, 1, 'onContentReadyHandler was called 1 times');
    });
    test('task click', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);

        const key = 2;
        let keyFromEvent;
        this.instance.option('onTaskClick', (e) => {
            keyFromEvent = e.key;
        });
        const $cellElement = $(this.instance._treeList.getCellElement(key - 1, 0));
        $cellElement.trigger('dxclick');
        this.clock.tick(10);
        assert.equal(keyFromEvent, key);
    });

    test('task double click', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);

        const key = 2;
        let keyFromEvent;
        this.instance.option('onTaskDblClick', (e) => {
            keyFromEvent = e.key;
            e.cancel = true;
        });
        const $cellElement = $(this.instance._treeList.getCellElement(key - 1, 0));
        $cellElement.trigger('dxdblclick');
        this.clock.tick(10);
        assert.equal(keyFromEvent, key);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 0, 'dialog is not shown');
    });

    test('scale cell prepared', function(assert) {
        const my_options = {
            tasks: { dataSource: data.tasks },
            onScaleCellPrepared: (e) => {
                const scaleElement = $(e.scaleElement);
                const line = $(e.separatorElement);
                if(e.scaleIndex === 0) {
                    line.addClass('gsb_separator');
                    scaleElement.addClass('gsb_item');
                } else {
                    line.addClass('gst_separator');
                    scaleElement.addClass('gst_item');
                }
            }
        };
        this.createInstance(my_options);
        this.clock.tick(10);

        const $top_item = $('body').find('.gst_item');
        assert.ok($top_item.length > 0, 'top items customized');
        const $top_separator = $('body').find('.gst_separator');
        assert.ok($top_separator.length > 0, 'top separators customized');

        const $bottom_item = $('body').find('.gsb_item');
        assert.ok($bottom_item.length > 0, 'bottom items customized');
        const $bottom_separator = $('body').find('.gsb_separator');
        assert.ok($bottom_separator.length > 0, 'bottom separators customized');
    });
});
