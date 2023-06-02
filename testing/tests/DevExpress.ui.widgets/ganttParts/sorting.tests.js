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

QUnit.module('Sorting', moduleConfig, () => {
    test('clear sorting', function(assert) {
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
            ]
        };

        this.createInstance(options);
        this.clock.tick(10);

        let treeListIdText1 = $(this.instance._treeList.getCellElement(0, 0)).text();
        let treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        let treeListIdText2 = $(this.instance._treeList.getCellElement(1, 0)).text();
        let treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        let treeListIdText3 = $(this.instance._treeList.getCellElement(2, 0)).text();
        let treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();

        let taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        let taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        let taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;

        assert.equal(treeListIdText1, '1');
        assert.equal(treeListIdText2, '3');
        assert.equal(treeListIdText3, '2');

        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText3);

        this.instance._treeList.clearSorting();
        this.clock.tick(500);

        treeListIdText1 = $(this.instance._treeList.getCellElement(0, 0)).text();
        treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        treeListIdText2 = $(this.instance._treeList.getCellElement(1, 0)).text();
        treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        treeListIdText3 = $(this.instance._treeList.getCellElement(2, 0)).text();
        treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();

        taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;

        assert.equal(treeListIdText1, '1');
        assert.equal(treeListIdText2, '2');
        assert.equal(treeListIdText3, '3');

        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText3);
    });

    test('clear sorting in autoUpdateParentTasks == true', function(assert) {
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
            ]
        };

        this.createInstance(options);
        this.clock.tick(500);

        let treeListIdText1 = $(this.instance._treeList.getCellElement(0, 0)).text();
        let treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        let treeListIdText2 = $(this.instance._treeList.getCellElement(1, 0)).text();
        let treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        let treeListIdText3 = $(this.instance._treeList.getCellElement(2, 0)).text();
        let treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();

        let taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        let taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        let taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;

        assert.equal(treeListIdText1, '1');
        assert.equal(treeListIdText2, '3');
        assert.equal(treeListIdText3, '2');

        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText3);

        this.instance._treeList.clearSorting();
        this.clock.tick(500);

        treeListIdText1 = $(this.instance._treeList.getCellElement(0, 0)).text();
        treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        treeListIdText2 = $(this.instance._treeList.getCellElement(1, 0)).text();
        treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        treeListIdText3 = $(this.instance._treeList.getCellElement(2, 0)).text();
        treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();

        taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;

        assert.equal(treeListIdText1, '1');
        assert.equal(treeListIdText2, '2');
        assert.equal(treeListIdText3, '3');

        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText3);
    });

    test('insert new task and update', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0, 'index': 1 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-22'), 'progress': 0, 'index': 3 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50, 'index': 5 }
        ];
        const options = {
            tasks: { dataSource: tasks },
            validation: { autoUpdateParentTasks: false },
            editing: { enabled: true },
            columns:
                [
                    {
                        dataField: 'id'
                    },
                    {
                        dataField: 'title'
                    },
                    {
                        dataField: 'index',
                        sortOrder: 'desc'
                    },
                ]
        };

        const task1 = {
            'id': 1000,
            'parentId': 1,
            'title': 'Task New',
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100,
            'index': 4
        };

        this.createInstance(options);
        this.clock.tick(10);

        this.instance.insertTask(task1);
        this.clock.tick(500);


        let treeListIndexText1 = $(this.instance._treeList.getCellElement(0, 2)).text();
        let treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        let treeListIndexText2 = $(this.instance._treeList.getCellElement(1, 2)).text();
        let treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        let treeListIndexText3 = $(this.instance._treeList.getCellElement(2, 2)).text();
        let treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();
        let treeListIndexText4 = $(this.instance._treeList.getCellElement(3, 2)).text();
        let treeListTitleText4 = $(this.instance._treeList.getCellElement(3, 1)).text();

        let taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        let taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        let taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;
        let taskText4 = this.$element.find(Consts.TASK_SELECTOR)[3].textContent;


        assert.equal(treeListIndexText1, '1');
        assert.equal(treeListIndexText2, '5');
        assert.equal(treeListIndexText3, '4');
        assert.equal(treeListIndexText4, '3');


        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText4);
        assert.equal(treeListTitleText4, taskText3);


        this.instance.updateTask(2, { 'index': 10 });
        this.clock.tick(500);

        treeListIndexText1 = $(this.instance._treeList.getCellElement(0, 2)).text();
        treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        treeListIndexText2 = $(this.instance._treeList.getCellElement(1, 2)).text();
        treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        treeListIndexText3 = $(this.instance._treeList.getCellElement(2, 2)).text();
        treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();
        treeListIndexText4 = $(this.instance._treeList.getCellElement(3, 2)).text();
        treeListTitleText4 = $(this.instance._treeList.getCellElement(3, 1)).text();

        taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;
        taskText4 = this.$element.find(Consts.TASK_SELECTOR)[3].textContent;


        assert.equal(treeListIndexText1, '1');
        assert.equal(treeListIndexText2, '10');
        assert.equal(treeListIndexText3, '5');
        assert.equal(treeListIndexText4, '4');


        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText3);
        assert.equal(treeListTitleText4, taskText4);


        this.instance._treeList.clearSorting();
        this.clock.tick(500);

        treeListIndexText1 = $(this.instance._treeList.getCellElement(0, 2)).text();
        treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        treeListIndexText2 = $(this.instance._treeList.getCellElement(1, 2)).text();
        treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        treeListIndexText3 = $(this.instance._treeList.getCellElement(2, 2)).text();
        treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();
        treeListIndexText4 = $(this.instance._treeList.getCellElement(3, 2)).text();
        treeListTitleText4 = $(this.instance._treeList.getCellElement(3, 1)).text();

        taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;
        taskText4 = this.$element.find(Consts.TASK_SELECTOR)[3].textContent;


        assert.equal(treeListIndexText1, '1');
        assert.equal(treeListIndexText2, '10');
        assert.equal(treeListIndexText3, '5');
        assert.equal(treeListIndexText4, '4');


        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText3);
        assert.equal(treeListTitleText4, taskText4);

    });

    test('insert new task and update in autoUpdateParentTasks == true', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0, 'index': 1 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-22'), 'progress': 0, 'index': 3 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50, 'index': 5 }
        ];
        const options = {
            tasks: { dataSource: tasks },
            validation: { autoUpdateParentTasks: true },
            editing: { enabled: true },
            columns:
                [
                    {
                        dataField: 'id'
                    },
                    {
                        dataField: 'title'
                    },
                    {
                        dataField: 'index',
                        sortOrder: 'desc'
                    },
                ]
        };

        const task1 = {
            'id': 1000,
            'parentId': 1,
            'title': 'Task New',
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100,
            'index': 4
        };

        this.createInstance(options);
        this.clock.tick(10);

        this.instance.insertTask(task1);
        this.clock.tick(500);


        let treeListIndexText1 = $(this.instance._treeList.getCellElement(0, 2)).text();
        let treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        let treeListIndexText2 = $(this.instance._treeList.getCellElement(1, 2)).text();
        let treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        let treeListIndexText3 = $(this.instance._treeList.getCellElement(2, 2)).text();
        let treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();
        let treeListIndexText4 = $(this.instance._treeList.getCellElement(3, 2)).text();
        let treeListTitleText4 = $(this.instance._treeList.getCellElement(3, 1)).text();

        let taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        let taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        let taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;
        let taskText4 = this.$element.find(Consts.TASK_SELECTOR)[3].textContent;


        assert.equal(treeListIndexText1, '1');
        assert.equal(treeListIndexText2, '5');
        assert.equal(treeListIndexText3, '4');
        assert.equal(treeListIndexText4, '3');


        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText4);
        assert.equal(treeListTitleText4, taskText3);


        this.instance.updateTask(2, { 'index': 10 });
        this.clock.tick(500);

        treeListIndexText1 = $(this.instance._treeList.getCellElement(0, 2)).text();
        treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        treeListIndexText2 = $(this.instance._treeList.getCellElement(1, 2)).text();
        treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        treeListIndexText3 = $(this.instance._treeList.getCellElement(2, 2)).text();
        treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();
        treeListIndexText4 = $(this.instance._treeList.getCellElement(3, 2)).text();
        treeListTitleText4 = $(this.instance._treeList.getCellElement(3, 1)).text();

        taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;
        taskText4 = this.$element.find(Consts.TASK_SELECTOR)[3].textContent;


        assert.equal(treeListIndexText1, '1');
        assert.equal(treeListIndexText2, '10');
        assert.equal(treeListIndexText3, '5');
        assert.equal(treeListIndexText4, '4');


        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText3);
        assert.equal(treeListTitleText4, taskText4);


        this.instance._treeList.clearSorting();
        this.clock.tick(500);

        treeListIndexText1 = $(this.instance._treeList.getCellElement(0, 2)).text();
        treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        treeListIndexText2 = $(this.instance._treeList.getCellElement(1, 2)).text();
        treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        treeListIndexText3 = $(this.instance._treeList.getCellElement(2, 2)).text();
        treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();
        treeListIndexText4 = $(this.instance._treeList.getCellElement(3, 2)).text();
        treeListTitleText4 = $(this.instance._treeList.getCellElement(3, 1)).text();

        taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;
        taskText4 = this.$element.find(Consts.TASK_SELECTOR)[3].textContent;


        assert.equal(treeListIndexText1, '1');
        assert.equal(treeListIndexText2, '10');
        assert.equal(treeListIndexText3, '5');
        assert.equal(treeListIndexText4, '4');


        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText3);
        assert.equal(treeListTitleText4, taskText4);

    });


    test('change sorting', function(assert) {
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
            sorting: { mode: 'single' },
            columns:
            [
                {
                    dataField: 'id',
                    sortOrder: 'desc'
                },
                {
                    dataField: 'title'
                },
            ]
        };

        this.createInstance(options);
        this.clock.tick(10);

        let treeListIdText1 = $(this.instance._treeList.getCellElement(0, 0)).text();
        let treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        let treeListIdText2 = $(this.instance._treeList.getCellElement(1, 0)).text();
        let treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        let treeListIdText3 = $(this.instance._treeList.getCellElement(2, 0)).text();
        let treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();

        let taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        let taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        let taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;

        assert.equal(treeListIdText1, '1');
        assert.equal(treeListIdText2, '3');
        assert.equal(treeListIdText3, '2');

        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText3);

        const $treeListIdHeader = this.$element.find(Consts.TREELIST_HEADER_ROW_SELECTOR).children().eq(0);
        $treeListIdHeader.trigger('dxclick');

        this.clock.tick(500);

        treeListIdText1 = $(this.instance._treeList.getCellElement(0, 0)).text();
        treeListTitleText1 = $(this.instance._treeList.getCellElement(0, 1)).text();
        treeListIdText2 = $(this.instance._treeList.getCellElement(1, 0)).text();
        treeListTitleText2 = $(this.instance._treeList.getCellElement(1, 1)).text();
        treeListIdText3 = $(this.instance._treeList.getCellElement(2, 0)).text();
        treeListTitleText3 = $(this.instance._treeList.getCellElement(2, 1)).text();

        taskText1 = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        taskText2 = this.$element.find(Consts.TASK_SELECTOR)[1].textContent;
        taskText3 = this.$element.find(Consts.TASK_SELECTOR)[2].textContent;

        assert.equal(treeListIdText1, '1');
        assert.equal(treeListIdText2, '2');
        assert.equal(treeListIdText3, '3');

        assert.equal(treeListTitleText1, taskText1);
        assert.equal(treeListTitleText2, taskText2);
        assert.equal(treeListTitleText3, taskText3);
    });

    test('check task count after sorting (T1118628)', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: tasks },
            sorting: { mode: 'single' },
            columns:
            [
                { dataField: 'id', },
                { dataField: 'title' }
            ]
        };

        this.createInstance(options);
        this.clock.tick(10);

        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 3);
        assert.equal(this.instance._treeList.getVisibleRows().length, 3);

        const $treeListIdHeader = this.$element.find(Consts.TREELIST_HEADER_ROW_SELECTOR).children().eq(0);
        $treeListIdHeader.trigger('dxclick');
        this.clock.tick(500);

        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 3);
        assert.equal(this.instance._treeList.getVisibleRows().length, 3);
    });

});
