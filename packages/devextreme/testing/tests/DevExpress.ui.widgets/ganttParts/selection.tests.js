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

const getTasks = (isCorrect = true) => {
    const tasks = [{
        id: 1,
        parentId: -1,
        title: 'Software Development',
        start: new Date('2019-02-21T05:00:00.000Z'),
        end: new Date('2019-07-04T12:00:00.000Z'),
        progress: 31
    },
    {
        id: 2,
        parentId: 1,
        title: 'Secure project sponsorship',
        start: new Date('2019-02-21T05:00:00.000Z'),
        end: new Date('2019-02-26T09:00:00.000Z'),
        progress: 60
    },
    {
        id: 3,
        parentId: 1,
        title: 'Determine project scope',
        start: new Date('2019-02-21T05:00:00.000Z'),
        end: new Date('2019-02-21T09:00:00.000Z'),
        progress: 100
    }];
    if(isCorrect) {
        return tasks;
    } else {
        return tasks.map((item) => {
            return item.id === 2 ? { ...item, start: null, end: null } : item;
        });
    }
};

QUnit.module('Row selection', moduleConfig, () => {
    test('Selection should be correct after change selectedRowKey', function(assert) {
        const tasks = getTasks();
        let selectedRowKey;
        this.createInstance({
            rootValue: -1,
            tasks: { dataSource: tasks },
            columns: [
                { dataField: 'title', caption: 'Subject' },
                { dataField: 'start', caption: 'Start' },
                { dataField: 'end', caption: 'End Date' }
            ],
            onSelectionChanged: function(e) {
                selectedRowKey = e.selectedRowKey;
            }
        });
        this.clock.tick(10);

        this.instance.option('selectedRowKey', 2);
        assert.equal(this.$element.find(Consts.SELECTION_SELECTOR).length, 1);
        assert.equal(selectedRowKey, 2);

        this.instance.option('selectedRowKey', 3);
        assert.equal(this.$element.find(Consts.SELECTION_SELECTOR).length, 1);
        assert.equal(selectedRowKey, 3);
    });

    test('Selection should be correct after change selectedRowKey, items start and end is null', function(assert) {
        const tasks = getTasks(false);
        let selectedRowKey;
        this.createInstance({
            rootValue: -1,
            tasks: { dataSource: tasks },
            columns: [
                { dataField: 'title', caption: 'Subject' },
                { dataField: 'start', caption: 'Start' },
                { dataField: 'end', caption: 'End Date' }
            ],
            onSelectionChanged: function(e) {
                selectedRowKey = e.selectedRowKey;
            }
        });
        this.clock.tick(10);

        this.instance.option('selectedRowKey', 2);
        assert.equal(this.$element.find(Consts.SELECTION_SELECTOR).length, 1);
        assert.equal(selectedRowKey, 2);

        this.instance.option('selectedRowKey', 3);
        assert.equal(this.$element.find(Consts.SELECTION_SELECTOR).length, 1);
        assert.equal(selectedRowKey, 3);
    });

    test('Selection should be correct after change selectedRowKey, with template', function(assert) {
        const tasks = getTasks();
        let selectedRowKey;
        this.createInstance({
            rootValue: -1,
            tasks: { dataSource: tasks },
            columns: [
                { dataField: 'title', caption: 'Subject' },
                { dataField: 'start', caption: 'Start' },
                { dataField: 'end', caption: 'End Date' }
            ],
            taskContentTemplate(item, container) {
                container.append(item.taskHTML);
                return container;
            },
            onSelectionChanged: function(e) {
                selectedRowKey = e.selectedRowKey;
            }
        });
        this.clock.tick(10);

        this.instance.option('selectedRowKey', 2);
        assert.equal(this.$element.find(Consts.SELECTION_SELECTOR).length, 1);
        assert.equal(selectedRowKey, 2);

        this.instance.option('selectedRowKey', 3);
        assert.equal(this.$element.find(Consts.SELECTION_SELECTOR).length, 1);
        assert.equal(selectedRowKey, 3);
    });

    test('Selection should be correct after change selectedRowKey, items start and end is null, with template', function(assert) {
        const tasks = getTasks(false);
        let selectedRowKey;
        this.createInstance({
            rootValue: -1,
            tasks: { dataSource: tasks },
            columns: [
                { dataField: 'title', caption: 'Subject' },
                { dataField: 'start', caption: 'Start' },
                { dataField: 'end', caption: 'End Date' }
            ],
            taskContentTemplate(item, container) {
                container.append(item.taskHTML);
                return container;
            },
            onSelectionChanged: function(e) {
                selectedRowKey = e.selectedRowKey;
            }
        });
        this.clock.tick(10);

        this.instance.option('selectedRowKey', 2);
        assert.equal(this.$element.find(Consts.SELECTION_SELECTOR).length, 1);
        assert.equal(selectedRowKey, 2);

        this.instance.option('selectedRowKey', 3);
        assert.equal(this.$element.find(Consts.SELECTION_SELECTOR).length, 1);
        assert.equal(selectedRowKey, 3);
    });
});
