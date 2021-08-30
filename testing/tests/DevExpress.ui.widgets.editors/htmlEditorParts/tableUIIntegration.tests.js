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

module('Table resizing integration', {
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

            const $contextMenu = $('.dx-context-menu.dx-overlay-content');
            const $ItemsHasSubmenu = $contextMenu.find('.dx-menu-item-has-submenu');
            $ItemsHasSubmenu.eq(firstMenuItemIndex).trigger('dxclick');
            this.clock.tick();
            return $contextMenu.find('.dx-submenu .dx-submenu .dx-menu-item-has-text');
        };
    },
    afterEach: function() {
        this.instance.dispose();
        this.clock.restore();
    }
}, () => {
    test('Context menu should be created on table click', function(assert) {
        this.createWidget();

        const $tableElement = this.$element.find('td').eq(0);
        $tableElement.trigger('dxcontextmenu');
        this.clock.tick();
        const $contextMenu = $('.dx-context-menu.dx-overlay-content');

        assert.ok($contextMenu.length);
    });

    test('Context menu should not be created on click out of the table', function(assert) {
        this.createWidget();

        this.$element.find('p').eq(0).trigger('dxcontextmenu');
        this.clock.tick();
        const $contextMenu = $('.dx-context-menu.dx-overlay-content');

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

        const $contextMenu = $('.dx-context-menu.dx-overlay-content');

        assert.strictEqual($contextMenu.length, 1);
    });


    test('Context menu should have some items and submenu', function(assert) {
        this.createWidget();

        const $tableElement = this.$element.find('td').eq(0);

        $tableElement.trigger('dxcontextmenu');
        this.clock.tick();

        const $contextMenu = $('.dx-context-menu.dx-overlay-content');

        const $textItems = $contextMenu.find('.dx-menu-item-has-text');

        const $ItemsHasSubmenu = $contextMenu.find('.dx-menu-item-has-submenu');

        assert.strictEqual($textItems.length, 2, 'text items count is correct');
        assert.strictEqual($ItemsHasSubmenu.length, 2, 'submenu items count is correct');
    });

    test('Context menu Insert submenu should have some items', function(assert) {
        this.createWidget();

        const $tableElement = this.$element.find('td').eq(0);

        $tableElement.trigger('dxcontextmenu');
        this.clock.tick();

        const $contextMenu = $('.dx-context-menu.dx-overlay-content');

        const $ItemsHasSubmenu = $contextMenu.find('.dx-menu-item-has-submenu');

        $ItemsHasSubmenu.eq(0).trigger('dxclick');
        this.clock.tick();

        const $submenuItems = $contextMenu.find('.dx-submenu .dx-submenu .dx-menu-item-has-text');

        assert.strictEqual($submenuItems.length, 4);
    });

    test('Context menu Delete submenu should have some items', function(assert) {
        this.createWidget();

        const $tableElement = this.$element.find('td').eq(0);

        $tableElement.trigger('dxcontextmenu');
        this.clock.tick();

        const $contextMenu = $('.dx-context-menu.dx-overlay-content');

        const $ItemsHasSubmenu = $contextMenu.find('.dx-menu-item-has-submenu');

        $ItemsHasSubmenu.eq(1).trigger('dxclick');
        this.clock.tick();

        const $submenuItems = $contextMenu.find('.dx-submenu .dx-submenu .dx-menu-item-has-text');

        assert.strictEqual($submenuItems.length, 3);
    });

    test('Check context menu Insert Row Above action', function(assert) {
        this.createWidget();

        const $submenuItems = this.getSubmenuItems(0);

        $submenuItems.eq(0).trigger('dxclick');

        const $table = this.$element.find('table');

        assert.strictEqual($table.find('tr').length, 4, 'Row is added');
        assert.strictEqual($table.find('td').eq(5).text(), '', 'Row is added to the correct place');
    });

    test('Check context menu Insert Row Below action', function(assert) {
        this.createWidget();

        const $submenuItems = this.getSubmenuItems(0);

        $submenuItems.eq(1).trigger('dxclick');

        const $table = this.$element.find('table');

        assert.strictEqual($table.find('tr').length, 4, 'Row is added');
        assert.strictEqual($table.find('td').eq(9).text(), '', 'Row is added to the correct place');
    });

    test('Check context menu Insert Column Left action', function(assert) {
        this.createWidget();

        const $submenuItems = this.getSubmenuItems(0);

        $submenuItems.eq(2).trigger('dxclick');

        const $table = this.$element.find('table');

        assert.strictEqual($table.find('tr').eq(0).find('td').length, 5, 'Column is added');
        assert.strictEqual($table.find('td').eq(2).text(), '', 'Row is added to the correct place');
    });

    test('Check context menu Insert Column Right action', function(assert) {
        this.createWidget();

        const $submenuItems = this.getSubmenuItems(0);

        $submenuItems.eq(3).trigger('dxclick');

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
