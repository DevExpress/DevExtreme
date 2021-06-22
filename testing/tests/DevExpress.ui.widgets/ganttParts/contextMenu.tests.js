import $ from 'jquery';
import { extend } from 'core/utils/extend';
import 'ui/gantt';
import { Consts, options } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('Context Menu', moduleConfig, () => {
    test('showing', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick();

        const getContextMenuElement = () => {
            return $('body').find(Consts.OVERLAY_WRAPPER_SELECTOR).find(Consts.CONTEXT_MENU_SELECTOR);
        };
        assert.equal(getContextMenuElement().length, 0, 'menu is hidden on create');
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        assert.equal(getContextMenuElement().length, 1, 'menu is visible after right click');
    });
    test('tree list context menu', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick();

        const getContextMenuElement = () => {
            return $('body').find(Consts.OVERLAY_WRAPPER_SELECTOR).find(Consts.CONTEXT_MENU_SELECTOR);
        };
        assert.equal(getContextMenuElement().length, 0, 'menu is hidden on create');
        const $cellElement = $(this.instance._treeList.getCellElement(0, 0));
        $cellElement.trigger('contextmenu');
        assert.equal(getContextMenuElement().length, 2, 'menu is visible after right click in tree list');
    });
    test('enabled', function(assert) {
        this.createInstance(extend(options.tasksOnlyOptions, { contextMenu: { enabled: false } }));
        this.clock.tick();

        const getContextMenuElement = () => {
            return $('body').find(Consts.OVERLAY_WRAPPER_SELECTOR).find(Consts.CONTEXT_MENU_SELECTOR);
        };
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        assert.equal(getContextMenuElement().length, 0, 'menu is hidden after right click');
        this.instance.option('contextMenu.enabled', true);
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        assert.equal(getContextMenuElement().length, 1, 'menu is visible after right click');
    });
    test('customization', function(assert) {
        const contextMenuOptions = {
            contextMenu: {
                items: [
                    'undo',
                    'redo',
                    'taskDetails',
                    'zoomIn',
                    'zoomOut',
                    { name: 'custom', text: 'customItem', icon: 'blockquote', beginGroup: true }
                ]
            }
        };
        this.createInstance(extend(options.tasksOnlyOptions, contextMenuOptions));
        this.clock.tick();

        const getContextMenuElement = () => {
            return $('body').find(Consts.OVERLAY_WRAPPER_SELECTOR).find(Consts.CONTEXT_MENU_SELECTOR);
        };
        const getItems = () => {
            return getContextMenuElement().find(Consts.CONTEXT_MENU_ITEM_SELECTOR);
        };
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        const items = getItems();
        assert.equal(items.length, 6, 'there are 6 items');
        assert.equal(items.eq(0).text().toLowerCase(), contextMenuOptions.contextMenu.items[0].toLowerCase(), 'undo item was rendered');
        assert.equal(items.eq(5).text(), contextMenuOptions.contextMenu.items[5].text, 'custom item was rendered');
        this.instance.option('contextMenu.items', []);
        assert.equal(getItems().length, 4, 'there are 4 items by default');
    });
    test('cancel ContextMenuPreparing', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        this.clock.tick();

        const getContextMenuElement = () => {
            return $('body').find(Consts.OVERLAY_WRAPPER_SELECTOR).find(Consts.CONTEXT_MENU_SELECTOR);
        };
        this.instance.option('onContextMenuPreparing', (e) => {
            e.cancel = true;
        });
        this.clock.tick();
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        assert.equal(getContextMenuElement().length, 0, 'menu is hidden after right click');
    });
    test('add item in ContextMenuPreparing', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        this.clock.tick();

        const getContextMenuElement = () => {
            return $('body').find(Consts.OVERLAY_WRAPPER_SELECTOR).find(Consts.CONTEXT_MENU_SELECTOR);
        };
        this.instance.option('onContextMenuPreparing', (e) => {
            e.items.push({ text: 'My Command', name: 'Custom' });
        });
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        const items = getContextMenuElement().find(Consts.CONTEXT_MENU_ITEM_SELECTOR);
        assert.equal(items.eq(items.length - 1).text(), 'My Command', 'custom item was rendered');
    });
    test('add subTask', function(assert) {
        const contextMenuOptions = {
            contextMenu: { items: [ 'addSubTask' ] }
        };
        this.createInstance(extend(options.tasksOnlyOptions, contextMenuOptions));
        this.clock.tick();

        const getContextMenuElement = () => {
            return $('body').find(Consts.OVERLAY_WRAPPER_SELECTOR).find(Consts.CONTEXT_MENU_SELECTOR);
        };
        const getItems = () => {
            return getContextMenuElement().find(Consts.CONTEXT_MENU_ITEM_SELECTOR);
        };
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        const items = getItems();
        assert.equal(items.length, 1, 'there are 1 items');
        assert.equal(items.eq(0).text(), 'New Subtask', 'undo item was rendered');
    });
});
