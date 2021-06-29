import $ from 'jquery';
import 'ui/gantt';
import { Consts, showTaskEditDialog, data, getGanttViewCore } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('Parent auto calculation', moduleConfig, () => {
    test('render', function(assert) {
        const options = {
            tasks: { dataSource: data.tasks },
            validation: { autoUpdateParentTasks: true }
        };
        this.createInstance(options);
        this.clock.tick();

        const $stripLines = this.$element.find(Consts.PARENT_TASK_SELECTOR);
        assert.ok($stripLines.length > 0, 'parent tasks has className');
    });

    test('first load data', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: tasks },
            validation: { autoUpdateParentTasks: true }
        };
        this.createInstance(options);
        this.clock.tick();

        let dataToCheck = [];
        this.instance._onParentTasksRecalculated = (data) => {
            dataToCheck = data;
        };
        getGanttViewCore(this.instance).viewModel.updateModel();
        this.clock.tick();

        assert.equal(dataToCheck.length, 3, 'length');
        assert.equal(dataToCheck[0].start, start, 'parent 0 start date');
        assert.equal(dataToCheck[0].end, end, 'parent 0 end date');
        assert.ok(dataToCheck[0].progress > 0, 'parent 0 progress eq 0');
        assert.equal(dataToCheck[1].start, start, 'parent 1 start date');
        assert.equal(dataToCheck[1].end, end, 'parent 1 end date');
        assert.ok(dataToCheck[1].progress > 0, 'parent 1 progress eq 0');
        assert.equal(dataToCheck[2].start, start, 'child start date');
        assert.equal(dataToCheck[2].end, end, 'child 1 end date');
        assert.equal(dataToCheck[2].progress, 50, 'child progress');
    });

    test('mode changing', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: tasks }
        };
        this.createInstance(options);
        let dataToCheck = [];
        this.instance._onParentTasksRecalculated = (data) => {
            dataToCheck = data;
        };
        this.clock.tick();
        let $parentTasks = this.$element.find(Consts.PARENT_TASK_SELECTOR);
        assert.equal(dataToCheck.length, 0, 'length');
        assert.equal($parentTasks.length, 0, 'parent tasks exists');

        this.instance.option('validation.autoUpdateParentTasks', true);
        this.clock.tick();
        $parentTasks = this.$element.find(Consts.PARENT_TASK_SELECTOR);
        assert.equal($parentTasks.length, 2, 'parent tasks not exists');
        assert.equal(dataToCheck.length, 3, 'length');
        assert.equal(dataToCheck[0].start, start, 'parent 0 start date');
        assert.equal(dataToCheck[0].end, end, 'parent 0 end date');
        assert.ok(dataToCheck[0].progress > 0, 'parent 0 progress eq 0');
        assert.equal(dataToCheck[1].start, start, 'parent 1 start date');
        assert.equal(dataToCheck[1].end, end, 'parent 1 end date');
        assert.ok(dataToCheck[1].progress > 0, 'parent 1 progress eq 0');
        assert.equal(dataToCheck[2].start, start, 'child start date');
        assert.equal(dataToCheck[2].end, end, 'child 1 end date');
        assert.equal(dataToCheck[2].progress, 50, 'child progress');

        dataToCheck = [];
        this.instance.option('validation.autoUpdateParentTasks', false);
        this.clock.tick();
        $parentTasks = this.$element.find(Consts.PARENT_TASK_SELECTOR);
        assert.equal(dataToCheck.length, 0, 'length');
        assert.equal($parentTasks.length, 0, 'parent tasks exists');
    });

    test('custom fields load', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'idKey': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0, 'customField': 'test0' },
            { 'idKey': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0, 'customField': 'test1' },
            { 'idKey': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50, 'customField': 'test2' }
        ];
        const options = {
            tasks: { dataSource: tasks, keyExpr: 'idKey', },
            validation: { autoUpdateParentTasks: true },
            columns: [{
                dataField: 'customField',
                caption: 'custom'
            }]
        };
        this.createInstance(options);
        this.clock.tick();

        const customCellText0 = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).first().find('td').first().text();
        const customCellText1 = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).eq(1).find('td').first().text();
        const customCellText2 = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).last().find('td').first().text();
        assert.equal(customCellText0, 'test0', 'custom fields text not shown');
        assert.equal(customCellText1, 'test1', 'custom fields text not shown');
        assert.equal(customCellText2, 'test2', 'custom fields text not shown');
    });

    test('edit title (T891411)', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'idKey': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0, 'customField': 'test0' },
            { 'idKey': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0, 'customField': 'test1' },
            { 'idKey': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50, 'customField': 'test2' }
        ];
        const options = {
            tasks: { dataSource: tasks, keyExpr: 'idKey', },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true }
        };
        this.createInstance(options);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick();

        showTaskEditDialog(this.instance);
        this.clock.tick();
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        const $inputs = $dialog.find(Consts.INPUT_TEXT_EDITOR_SELECTOR);
        assert.equal($inputs.eq(0).val(), tasks[0].title, 'title text is shown');
        const testTitle = 'text';
        const titleTextBox = $dialog.find('.dx-textbox').eq(0).dxTextBox('instance');
        titleTextBox.option('value', testTitle);
        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        this.clock.tick();
        const firstTreeListTitleText = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).first().find('td').eq(2).text();
        assert.equal(firstTreeListTitleText, testTitle, 'title text was modified');
    });
    test('onTaskUpdated is triggered when auto update parents on', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        let values;
        const tasks = [
            { 'my_id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 10 },
            { 'my_id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 20 },
            { 'my_id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 40 },
            { 'my_id': 4, 'parentId': 2, 'title': 'Determine project scope 2', 'start': start, 'end': end, 'progress': 80 },

        ];
        const tasksCount = tasks.length;
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskUpdated', (e) => { values = e.values; });
        this.clock.tick();
        this.instance.deleteTask(4);
        this.clock.tick();

        assert.equal(tasks.length, tasksCount - 1, 'task was deleted');
        assert.equal(tasks[2].progress, values.progress, 'onTaskUpdated is triggrered');
    });
});
