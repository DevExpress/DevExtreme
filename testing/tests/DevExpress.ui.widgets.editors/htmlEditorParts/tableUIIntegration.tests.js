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
    <br>after table text';

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

    test('Context menu should be one', function(assert) {
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

        const $subMenuItems = $contextMenu.find('.dx-menu-item-has-text');

        assert.strictEqual($textItems.length, 2);
        assert.strictEqual($subMenuItems.length, 2);
    });

    test('Check context menu item actions', function(assert) {
        this.createWidget();
        assert.ok(true);
    });
});
