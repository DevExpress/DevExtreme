import $ from 'jquery';
import 'ui/gantt';
import { Consts, options, data, showTaskEditDialog } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('Repaint', moduleConfig, () => {
    test('should render treeList after repaint()', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        this.clock.tick();
        this.instance.repaint();
        this.clock.tick();
        const treeListElements = this.$element.find(Consts.TREELIST_SELECTOR);
        assert.strictEqual(treeListElements.length, 1);
    });
    test('should render task wrapper for each task after repaint()', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick();
        this.instance.repaint();
        this.clock.tick();
        const elements = this.$element.find(Consts.TASK_WRAPPER_SELECTOR);
        assert.equal(elements.length, data.tasks.length - 1);
    });
    test('should store task changes after repaint() ', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick();
        showTaskEditDialog(this.instance);
        this.clock.tick();
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');

        const $inputs = $dialog.find(Consts.INPUT_TEXT_EDITOR_SELECTOR);
        assert.equal($inputs.eq(0).val(), data.tasks[0].title, 'title text is shown');
        assert.equal((new Date($inputs.eq(1).val())).getTime(), data.tasks[0].start.getTime(), 'start task text is shown');
        assert.equal((new Date($inputs.eq(2).val())).getTime(), data.tasks[0].end.getTime(), 'end task text is shown');
        assert.equal($inputs.eq(3).val(), data.tasks[0].progress + '%', 'progress text is shown');

        const testTitle = 'text';
        const titleTextBox = $dialog.find('.dx-textbox').eq(0).dxTextBox('instance');
        titleTextBox.option('value', testTitle);
        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        this.clock.tick();
        let firstTreeListTitleText = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).first().find('td').eq(2).text();
        assert.equal(firstTreeListTitleText, testTitle, 'title text was modified');

        this.instance.repaint();
        this.clock.tick();
        firstTreeListTitleText = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).first().find('td').eq(2).text();
        assert.equal(firstTreeListTitleText, testTitle, 'title text is the same after repaint()');
    });
});
