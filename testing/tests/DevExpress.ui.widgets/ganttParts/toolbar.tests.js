import $ from 'jquery';
import 'ui/gantt';
import { Consts, data } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('Toolbar', moduleConfig, () => {
    test('common', function(assert) {
        const items = [
            'undo',
            'redo',
            'separator',
            'zoomIn',
            'zoomOut',
            'fullScreen',
            'taskDetails',
            'resourceManager',
            'separator',
            {
                widget: 'dxButton',
                options: {
                    text: 'Custom item',
                    stylingMode: 'text'
                }
            }
        ];
        const options = {
            tasks: { dataSource: data.tasks },
            toolbar: { items: items }
        };
        this.createInstance(options);
        this.clock.tick();

        const $items = this.$element.find(Consts.TOOLBAR_ITEM_SELECTOR);
        assert.equal($items.length, items.length, 'All items were rendered');
        assert.equal($items.find(Consts.TOOLBAR_SEPARATOR_SELECTOR).length, 2, 'Both separators were rendered');
        assert.equal($items.last().text(), 'Custom item', 'Custom item has custom text');
        assert.equal($items.first().children().children().attr('aria-label'), 'dx-gantt-i dx-gantt-i-undo', 'First button is undo button');
    });
    test('changing', function(assert) {
        const items = [
            'undo',
            'redo'
        ];
        const options = {
            tasks: { dataSource: data.tasks },
            toolbar: { items: items }
        };
        this.createInstance(options);
        this.clock.tick();

        let $items = this.$element.find(Consts.TOOLBAR_ITEM_SELECTOR);
        assert.equal($items.length, items.length, 'All items were rendered');

        this.instance.option('toolbar.items', []);
        $items = this.$element.find(Consts.TOOLBAR_ITEM_SELECTOR);
        assert.equal($items.length, 0, 'Toolbar is empty');

        this.instance.option('toolbar.items', ['zoomIn', 'zoomOut']);
        $items = this.$element.find(Consts.TOOLBAR_ITEM_SELECTOR);
        assert.equal($items.length, 2, 'All items were rendered again');
    });
    test('different item types', function(assert) {
        const items = [
            'undo',
            'redo',
            'separator',
            {
                name: 'zoomIn',
                options: {
                    text: 'test'
                }
            },
            'separator',
            {
                widget: 'dxButton',
                options: {
                    text: 'Custom item',
                    stylingMode: 'text'
                }
            }
        ];
        const options = {
            tasks: { dataSource: data.tasks },
            toolbar: { items: items }
        };
        this.createInstance(options);
        this.clock.tick();

        const $items = this.$element.find(Consts.TOOLBAR_ITEM_SELECTOR);
        assert.equal($items.length, items.length, 'All items were rendered');
        assert.equal($items.find(Consts.TOOLBAR_SEPARATOR_SELECTOR).length, 2, 'Both separators were rendered');
        assert.equal($items.last().text(), 'Custom item', 'Custom item has custom text');
        assert.equal($items.eq(3).text(), 'test', 'Custom zoomIn button was rendered with custom text');
    });
    test('add subTask', function(assert) {
        const items = [ 'addSubTask' ];
        const options = {
            tasks: { dataSource: data.tasks },
            toolbar: { items: items }
        };

        this.createInstance(options);
        this.clock.tick();

        const $items = this.$element.find(Consts.TOOLBAR_ITEM_SELECTOR);
        assert.equal($items.length, items.length, 'All items were rendered');
        assert.equal($items.first().children().children().attr('aria-label'), 'dx-gantt-i dx-gantt-i-add-sub-task', 'New Subtask item was rendered');
    });
});
