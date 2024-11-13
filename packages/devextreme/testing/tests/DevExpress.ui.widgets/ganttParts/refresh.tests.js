import $ from 'jquery';
import 'ui/gantt';
import { Consts, options, data, showTaskEditDialog } from '../../../helpers/ganttHelpers.js';
import { CustomStore } from 'common/data/custom_store';

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

QUnit.module('Refresh', moduleConfig, () => {
    test('should render treeList after refresh()', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        this.clock.tick(10);
        this.instance.refresh();
        this.clock.tick(10);
        const treeListElements = this.$element.find(Consts.TREELIST_SELECTOR);
        assert.strictEqual(treeListElements.length, 1);
    });
    test('should render task wrapper for each task after refresh()', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);
        this.instance.refresh();
        this.clock.tick(10);
        const elements = this.$element.find(Consts.TASK_WRAPPER_SELECTOR);
        assert.equal(elements.length, data.tasks.length - 1);
    });
    test('should store task changes after refresh() ', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick(10);
        showTaskEditDialog(this.instance);
        this.clock.tick(10);
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
        this.clock.tick(10);
        let firstTreeListTitleText = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).first().find('td').eq(2).text();
        assert.equal(firstTreeListTitleText, testTitle, 'title text was modified');

        this.instance.refresh();
        this.clock.tick(10);
        firstTreeListTitleText = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).first().find('td').eq(2).text();
        assert.equal(firstTreeListTitleText, testTitle, 'title text is the same after repaint()');
    });
    test('check data load on refresh and repaint', function(assert) {
        const task = { 'id': 1, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' };
        let dataLoaded = false;
        this.createInstance({
            tasks: {
                dataSource: new CustomStore({
                    load: function(loadOptions) {
                        dataLoaded = true;
                        return [
                            {
                                id: task.id,
                                title: task.title,
                                start: task.start,
                                end: task.end,
                                progress: task.progress
                            }
                        ];
                    },
                })
            },
            editing: { enabled: true },
            columns: [
                { dataField: 'title', caption: 'Subject' },
                { dataField: 'start', caption: 'Start' },
                { dataField: 'end', caption: 'End Date' }
            ]
        });
        this.clock.tick(10);

        dataLoaded = false;
        const oldTitle = task.title;
        task.title = 'test';
        this.instance.repaint();
        this.clock.tick(10);
        assert.notOk(dataLoaded);
        assert.equal(this.instance.getTaskData(1).title, oldTitle);
        this.instance.refresh();
        this.clock.tick(10);
        assert.ok(dataLoaded);
        assert.equal(this.instance.getTaskData(1).title, 'test');
    });
});
