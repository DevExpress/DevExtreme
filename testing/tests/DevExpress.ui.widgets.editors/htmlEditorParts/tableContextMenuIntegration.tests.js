import $ from 'jquery';
import 'ui/html_editor';

const tableMarkup = '\
    before table text<br>\
    <table>\
        <tr>\
            <td>0_0 content</td>\
            <td>0_1</td>\
            <td>0_2</td>\
            <td style="text-align: right;">0_3</td>\
        </tr>\
        <tr>\
            <td>1_0</td>\
            <td>1_1</td>\
            <td>1_2</td>\
            <td style="text-align: right;">1_3</td>\
        </tr>\
        <tr>\
            <td>2_0</td>\
            <td>2_1</td>\
            <td>2_2</td>\
            <td style="text-align: right;">2_3</td>\
        </tr>\
    </table>\
    <br>after table text<br>';

const { test, module } = QUnit;

const CONTEXT_MENU_OVERLAY_SELECTOR = '.dx-context-menu.dx-overlay-content';
const ITEM_HAS_SUBMENU_CLASS = 'dx-menu-item-has-submenu';
const ITEM_HAS_TEXT_CLASS = 'dx-menu-item-has-text';
const SUBMENU_CLASS = 'dx-submenu';
const SUBMENU_ITEMS_SELECTOR = `.${SUBMENU_CLASS} .${SUBMENU_CLASS} .${ITEM_HAS_TEXT_CLASS}`;

module('Table context menu integration', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor');
        this.options = {
            tableContextMenu: { enabled: true },
            value: tableMarkup
        };

        this.createWidget = (options) => {
            const newOptions = $.extend({}, this.options, options);
            this.instance = this.$element
                .dxHtmlEditor(newOptions)
                .dxHtmlEditor('instance');

            this.quillInstance = this.instance.getQuillInstance();
        };

        this.getSubmenuItems = (firstMenuItemIndex) => {
            this.quillInstance.setSelection(50, 1);
            const $tableElement = this.$element.find('td').eq(5);
            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);
            const $ItemsHasSubmenu = $contextMenu.find(`.${ITEM_HAS_SUBMENU_CLASS}`);
            $ItemsHasSubmenu.eq(firstMenuItemIndex).trigger('dxclick');
            this.clock.tick();
            return $contextMenu.find(SUBMENU_ITEMS_SELECTOR);
        };
    },
    afterEach: function() {
        this.instance.dispose();
        this.clock.restore();
    }
}, () => {
    module('Default context menu', {}, () => {
        test('Context menu should be created on table click', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('td').eq(0);
            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();
            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);

            assert.ok($contextMenu.length);
        });

        test('Context menu should not be created on click out of the table', function(assert) {
            this.createWidget();

            this.$element.find('p').eq(0).trigger('dxcontextmenu');
            this.clock.tick();
            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);

            assert.strictEqual($contextMenu.length, 0);
        });

        test('Context menu should be only one', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('td').eq(0);

            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            this.$element.trigger('dxclick');

            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);

            assert.strictEqual($contextMenu.length, 1);
        });


        test('Context menu should have some items and submenu', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('td').eq(0);

            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);

            const $textItems = $contextMenu.find(`.${ITEM_HAS_TEXT_CLASS}`);

            const $ItemsHasSubmenu = $contextMenu.find(`.${ITEM_HAS_SUBMENU_CLASS}`);

            assert.strictEqual($textItems.length, 4, 'text items count is correct');
            assert.strictEqual($ItemsHasSubmenu.length, 2, 'submenu items count is correct');
        });

        test('Context menu Insert submenu should have some items', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('td').eq(0);

            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);

            const $ItemsHasSubmenu = $contextMenu.find(`.${ITEM_HAS_SUBMENU_CLASS}`);

            $ItemsHasSubmenu.eq(0).trigger('dxclick');
            this.clock.tick();

            const $submenuItems = $contextMenu.find(SUBMENU_ITEMS_SELECTOR);

            assert.strictEqual($submenuItems.length, 5);
        });

        test('Context menu Delete submenu should have some items', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('td').eq(0);

            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);

            const $ItemsHasSubmenu = $contextMenu.find(`.${ITEM_HAS_SUBMENU_CLASS}`);

            $ItemsHasSubmenu.eq(1).trigger('dxclick');
            this.clock.tick();

            const $submenuItems = $contextMenu.find(SUBMENU_ITEMS_SELECTOR);

            assert.strictEqual($submenuItems.length, 3);
        });

        test('Context menu Table Properties should open the Form', function(assert) {
            this.createWidget();

            const $tableElement = this.$element.find('td').eq(0);

            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);

            const $textItems = $contextMenu.find(`.${ITEM_HAS_TEXT_CLASS}`);

            $textItems.eq(2).trigger('dxclick');
            this.clock.tick(500);

            const $form = $('.dx-form:not(.dx-formdialog-form)');

            assert.strictEqual($form.length, 1);
            assert.ok($form.eq(0).is(':visible'));
        });

        test('Check context menu Insert Header Row action', function(assert) {
            this.createWidget();

            const $submenuItems = this.getSubmenuItems(0);

            $submenuItems.eq(0).trigger('dxclick');

            const $table = this.$element.find('table');

            assert.strictEqual($table.find('tr').length, 4, 'Row is added');
            assert.strictEqual($table.find('th').length, 4, 'Header row elements is added');
        });

        test('Check context menu Insert Row Above action', function(assert) {
            this.createWidget();

            const $submenuItems = this.getSubmenuItems(0);

            $submenuItems.eq(1).trigger('dxclick');

            const $table = this.$element.find('table');

            assert.strictEqual($table.find('tr').length, 4, 'Row is added');
            assert.strictEqual($table.find('td').eq(5).text(), '', 'Row is added to the correct place');
        });

        test('Check context menu Insert Row Below action', function(assert) {
            this.createWidget();

            const $submenuItems = this.getSubmenuItems(0);

            $submenuItems.eq(2).trigger('dxclick');

            const $table = this.$element.find('table');

            assert.strictEqual($table.find('tr').length, 4, 'Row is added');
            assert.strictEqual($table.find('td').eq(9).text(), '', 'Row is added to the correct place');
        });

        test('Check context menu Insert Column Left action', function(assert) {
            this.createWidget();

            const $submenuItems = this.getSubmenuItems(0);

            $submenuItems.eq(3).trigger('dxclick');

            const $table = this.$element.find('table');

            assert.strictEqual($table.find('tr').eq(0).find('td').length, 5, 'Column is added');
            assert.strictEqual($table.find('td').eq(2).text(), '', 'Row is added to the correct place');
        });

        test('Check context menu Insert Column Right action', function(assert) {
            this.createWidget();

            const $submenuItems = this.getSubmenuItems(0);

            $submenuItems.eq(4).trigger('dxclick');

            const $table = this.$element.find('table');

            assert.strictEqual($table.find('tr').eq(0).find('td').length, 5, 'Column is added');
            assert.strictEqual($table.find('td').eq(3).text(), '', 'Row is added to the correct place');
        });

        test('Check context menu Delete Column action', function(assert) {
            this.createWidget();

            const $submenuItems = this.getSubmenuItems(1);

            $submenuItems.eq(0).trigger('dxclick');

            const $table = this.$element.find('table');

            assert.strictEqual($table.find('tr').eq(0).find('td').length, 3, 'Column is deleted');
        });

        test('Check context menu Delete Row action', function(assert) {
            this.createWidget();

            const $submenuItems = this.getSubmenuItems(1);

            $submenuItems.eq(1).trigger('dxclick');

            const $table = this.$element.find('table');

            assert.strictEqual($table.find('tr').length, 2, 'Row is deleted');
        });

        test('Check context menu Delete Table action', function(assert) {
            this.createWidget();

            const $submenuItems = this.getSubmenuItems(1);

            $submenuItems.eq(2).trigger('dxclick');

            const $table = this.$element.find('table');

            assert.strictEqual($table.length, 0, 'Table is deleted');
        });
    });

    module('Custom context menu', {}, () => {
        test('empty items array', function(assert) {
            this.createWidget({ tableContextMenu: {
                enabled: true,
                items: []
            }
            });

            this.quillInstance.setSelection(50, 1);
            const $tableElement = this.$element.find('td').eq(5);
            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);
            const $menuItems = $contextMenu.find(`.${ITEM_HAS_TEXT_CLASS}`);

            assert.strictEqual($menuItems.length, 4, 'default items is used');
        });

        test('array of custom objects', function(assert) {
            this.createWidget({ tableContextMenu: {
                enabled: true,
                items: [{
                    text: 'test item 1'
                }, {
                    text: 'test item 2'
                }]
            } });

            this.quillInstance.setSelection(50, 1);
            const $tableElement = this.$element.find('td').eq(5);
            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);
            const $menuItems = $contextMenu.find(`.${ITEM_HAS_TEXT_CLASS}`);

            assert.strictEqual($menuItems.length, 2, 'all items are rendered');
            assert.strictEqual($menuItems.eq(0).text(), 'test item 1', 'first item is correct');
            assert.strictEqual($menuItems.eq(1).text(), 'test item 2', 'second item is correct');
        });

        test('custom items handler', function(assert) {
            assert.expect(1);
            this.createWidget({ tableContextMenu: {
                enabled: true,
                items: [{
                    text: 'test item 1'
                }, {
                    text: 'test item 2',
                    onClick: () => {
                        assert.ok(true, 'click handler is applied');
                    }
                }]
            } });

            this.quillInstance.setSelection(50, 1);
            const $tableElement = this.$element.find('td').eq(5);
            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);
            const $menuItems = $contextMenu.find(`.${ITEM_HAS_TEXT_CLASS}`);

            $menuItems.eq(1).trigger('dxclick');
        });

        test('array of predefined strings is rendered', function(assert) {
            this.createWidget({ tableContextMenu: {
                enabled: true,
                items: ['insertTable', 'tableProperties']
            } });

            this.quillInstance.setSelection(50, 1);
            const $tableElement = this.$element.find('td').eq(5);
            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);
            const $menuItems = $contextMenu.find(`.${ITEM_HAS_TEXT_CLASS}`);

            assert.strictEqual($menuItems.length, 2, 'all items are rendered');
            assert.strictEqual($menuItems.eq(0).text(), 'Insert Table', 'first item is correct');
            assert.strictEqual($menuItems.eq(1).text(), 'Table Properties', 'second item is correct');
        });

        test('array of predefined strings is usable', function(assert) {
            this.createWidget({ tableContextMenu: {
                enabled: true,
                items: ['insertHeaderRow', 'tableProperties']
            } });

            this.quillInstance.setSelection(50, 1);
            const $tableElement = this.$element.find('td').eq(5);
            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);
            const $menuItems = $contextMenu.find(`.${ITEM_HAS_TEXT_CLASS}`);

            $menuItems.eq(0).trigger('dxclick');
            this.clock.tick();

            const $table = this.$element.find('table');

            assert.strictEqual($table.find('thead').length, 1, 'predefined item works correct');
        });

        test('array of predefined strings and custom objects', function(assert) {
            this.createWidget({ tableContextMenu: {
                enabled: true,
                items: ['insertTable', {
                    text: 'test item 1'
                }]
            } });

            this.quillInstance.setSelection(50, 1);
            const $tableElement = this.$element.find('td').eq(5);
            $tableElement.trigger('dxcontextmenu');
            this.clock.tick();

            const $contextMenu = $(CONTEXT_MENU_OVERLAY_SELECTOR);
            const $menuItems = $contextMenu.find(`.${ITEM_HAS_TEXT_CLASS}`);

            assert.strictEqual($menuItems.length, 2, 'all items are rendered');
            assert.strictEqual($menuItems.eq(0).text(), 'Insert Table', 'first item is correct');
            assert.strictEqual($menuItems.eq(1).text(), 'test item 1', 'second item is correct');
        });


        test('array of predefined strings and custom objects with submenus', function(assert) {
            this.createWidget({ tableContextMenu: {
                enabled: true,
                items: ['tableProperties', {
                    text: 'Custom group',
                    items: [
                        'deleteColumn', {
                            text: 'test item 1'
                        }
                    ]
                }]
            } });

            const $submenuItems = this.getSubmenuItems(0);

            assert.strictEqual($submenuItems.length, 2, 'all items are rendered');
            assert.strictEqual($submenuItems.eq(0).text(), 'Insert Table', 'first item is correct');
            assert.strictEqual($submenuItems.eq(1).text(), 'test item 1', 'second item is correct');
        });

        test('array of predefined strings and custom objects with submenus', function(assert) {
            this.createWidget({ tableContextMenu: {
                enabled: true,
                items: ['insertTable', 'deleteColumn', 'cellProperties', 'undo', 'bold',
                    'alignLeft', 'link', 'color', 'image'
                ]
            } });

            const $submenuItems = this.getSubmenuItems(0);

            assert.strictEqual($submenuItems.length, 2, 'all items are rendered');
            assert.strictEqual($submenuItems.eq(0).text(), 'Insert Table', 'first item is correct');
            assert.strictEqual($submenuItems.eq(1).text(), 'test item 1', 'second item is correct');
        });

        // 'check all available item types in context menu'
    });
});
