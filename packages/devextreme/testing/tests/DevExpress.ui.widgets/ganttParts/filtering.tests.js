import $ from 'jquery';
import 'ui/gantt';
import { Consts } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('Filtering', moduleConfig, () => {
    test('filterRow', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: tasks },
            validation: { autoUpdateParentTasks: false },
            columns:
            [
                {
                    dataField: 'id',
                    sortOrder: 'desc'
                },
                {
                    dataField: 'title'
                },
            ],
            filterRow: {
                visible: true
            }

        };

        this.createInstance(options);
        this.clock.tick(10);

        const $filterRow = this.$element.find(Consts.TREELIST_FILTER_ROW_SELECTOR);
        assert.equal($filterRow.length, 1);

        const $filterRowInput = $filterRow.find('.dx-texteditor-input').eq(1);
        assert.equal(this.$element.find(Consts.TASK_SELECTOR).length, 3);
        $filterRowInput.val('project');
        $filterRowInput.trigger('keyup');
        this.clock.tick(1000);
        assert.equal(this.$element.find(Consts.TASK_SELECTOR).length, 2);
        $filterRowInput.val('');
        $filterRowInput.trigger('keyup');
        this.clock.tick(1000);
        assert.equal(this.$element.find(Consts.TASK_SELECTOR).length, 3);
    });
    test('headerFilter', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: tasks },
            validation: { autoUpdateParentTasks: false },
            columns:
            [
                {
                    dataField: 'id',
                    sortOrder: 'desc',
                },
                {
                    dataField: 'title',
                    filterValues: ['Determine project scope']
                },
            ],
            headerFilter: {
                visible: true
            }

        };

        this.createInstance(options);
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_SELECTOR).length, 2);
        this.instance._treeList.clearFilter();
        this.clock.tick(300);
        assert.equal(this.$element.find(Consts.TASK_SELECTOR).length, 3);
    });
    test('clear sorting when filtered', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: tasks },
            validation: { autoUpdateParentTasks: false },
            columns:
            [
                {
                    dataField: 'id',
                    sortOrder: 'desc'
                },
                {
                    dataField: 'title'
                },
            ],
            filterRow: {
                visible: true
            },
            headerFilter: {
                visible: true
            },

        };

        this.createInstance(options);
        this.clock.tick(10);

        const treeListIdText1 = $(this.instance._treeList.getCellElement(0, 0)).text();
        const treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        const treeListIdText2 = $(this.instance._treeList.getCellElement(1, 0)).text();
        const treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        const treeListIdText3 = $(this.instance._treeList.getCellElement(2, 0)).text();
        const treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();

        const taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        const taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        const taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;

        assert.equal(treeListIdText1, '1');
        assert.equal(treeListIdText2, '3');
        assert.equal(treeListIdText3, '2');

        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText3);

        const $filterRow = this.$element.find(Consts.TREELIST_FILTER_ROW_SELECTOR);
        assert.equal($filterRow.length, 1);

        const $filterRowInput = $filterRow.find('.dx-texteditor-input').eq(1);
        assert.equal(this.$element.find(Consts.TASK_SELECTOR).length, 3);
        $filterRowInput.val('project');
        $filterRowInput.trigger('keyup');
        this.clock.tick(1000);
        assert.equal(this.$element.find(Consts.TASK_SELECTOR).length, 2);

        this.instance._treeList.clearSorting();
        this.clock.tick(500);

        assert.equal(this.$element.find(Consts.TASK_SELECTOR).length, 2);
    });

    test('clear in autoUpdateParentTasks == true', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: tasks },
            validation: { autoUpdateParentTasks: true },
            columns:
            [
                {
                    dataField: 'id',
                    sortOrder: 'desc'
                },
                {
                    dataField: 'title'
                },
            ],
            filterRow: {
                visible: true
            },
            headerFilter: {
                visible: true
            },
        };

        this.createInstance(options);
        this.clock.tick(500);

        const treeListIdText1 = $(this.instance._treeList.getCellElement(0, 0)).text();
        const treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        const treeListIdText2 = $(this.instance._treeList.getCellElement(1, 0)).text();
        const treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        const treeListIdText3 = $(this.instance._treeList.getCellElement(2, 0)).text();
        const treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();

        const taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        const taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        const taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;

        assert.equal(treeListIdText1, '1');
        assert.equal(treeListIdText2, '3');
        assert.equal(treeListIdText3, '2');

        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText3);

        const $filterRow = this.$element.find(Consts.TREELIST_FILTER_ROW_SELECTOR);
        assert.equal($filterRow.length, 1);

        const $filterRowInput = $filterRow.find('.dx-texteditor-input').eq(1);
        assert.equal(this.$element.find(Consts.TASK_SELECTOR).length, 3);
        $filterRowInput.val('project');
        $filterRowInput.trigger('keyup');
        this.clock.tick(1000);
        assert.equal(this.$element.find(Consts.TASK_SELECTOR).length, 2);

        this.instance._treeList.clearSorting();
        this.clock.tick(500);

        assert.equal(this.$element.find(Consts.TASK_SELECTOR).length, 2);
    });
    test('check expand state after filter (T1118628)', function(assert) {
        const tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': new Date('2019-02-19'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: tasks },
            validation: { autoUpdateParentTasks: false },
            columns:
            [
                {
                    dataField: 'id',
                    sortOrder: 'desc'
                },
                {
                    dataField: 'title'
                },
            ],
            filterRow: {
                visible: true
            }

        };

        this.createInstance(options);
        this.clock.tick(10);

        let expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);

        const $filterRow = this.$element.find(Consts.TREELIST_FILTER_ROW_SELECTOR);
        assert.equal($filterRow.length, 1);

        const $filterRowInput = $filterRow.find('.dx-texteditor-input').eq(1);
        $filterRowInput.val('project');
        $filterRowInput.trigger('keyup');
        this.clock.tick(1000);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);
        assert.equal(this.instance._treeList.getVisibleRows().length, 2);

        expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);

        const $treeListIdHeader = this.$element.find(Consts.TREELIST_HEADER_ROW_SELECTOR).children().eq(0);
        $treeListIdHeader.trigger('dxclick');
        this.clock.tick(500);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);
        assert.equal(this.instance._treeList.getVisibleRows().length, 2);
    });
});
