import $ from 'jquery';
import SchedulerAgenda from 'ui/scheduler/workspaces/ui.scheduler.agenda';
import dateLocalization from 'localization/date';
import { getInstanceFactory } from 'ui/scheduler/instanceFactory';

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const HOVER_CLASS = 'dx-state-hover';

const formatDateAndWeekday = function(date) {
    return date.getDate() + ' ' + dateLocalization.getDayNames('abbreviated')[date.getDay()];
};

const {
    module,
    testStart,
    test
} = QUnit;

testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler-agenda"></div>');
});

module('Agenda', {}, () => {
    const createInstance = (options, groupCount = 1) => {
        const singleGroup = [1, 0, 3, 0, 0, 2, 1];
        const rows = [];

        for(let i = 0; i < groupCount; i++) {
            rows.push(singleGroup);
        }

        const config = {
            onContentReady: e => {
                e.component.onDataSourceChanged(rows);
            },
            observer: {
                fire: (functionName) => {
                    if(functionName === 'getLayoutManager') {
                        return {
                            getRenderingStrategyInstance: () => {
                                return { calculateRows: () => rows };
                            }
                        };
                    }
                }
            }
        };
        const resources = options && options.groups || { };
        getInstanceFactory().create({ resources });

        const { resourceManager } = getInstanceFactory();
        resourceManager.createReducedResourcesTree = () => resourceManager.createResourcesTree(options.groups);

        const $element = $('#scheduler-agenda').dxSchedulerAgenda({ ...options, ...config });
        return $element.dxSchedulerAgenda('instance');
    };

    test('Scheduler agenda should be initialized', function(assert) {
        const instance = createInstance();
        assert.ok(instance instanceof SchedulerAgenda, 'SchedulerAgenda was initialized');
    });

    test('Scheduler agenda should have a right css class', function(assert) {
        const instance = createInstance();
        const $element = instance.$element();
        assert.ok($element.hasClass('dx-scheduler-agenda'), 'SchedulerAgenda has \'dx-scheduler-agenda\' css class');
    });

    test('Scheduler agenda should not have vertical-grouped class', function(assert) {
        const instance = createInstance({
            groupOrientation: 'vertical',
            crossScrollingEnabled: true,
            groups: [
                { name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] },
                { name: 'ownerId', items: [{ id: 1, text: 'o1' }, { id: 2, text: 'o2' }, { id: 2, text: 'o3' }] }
            ]
        }, 6);

        const $element = instance.$element();

        assert.notOk($element.hasClass('dx-scheduler-work-space-vertical-grouped'), 'SchedulerAgenda hasn\'t \'dx-scheduler-work-space-vertical-grouped\' css class');
    });

    test('the getStartViewDate method', function(assert) {
        const instance = createInstance({
            currentDate: new Date(2016, 1, 17),
            startDayHour: 2
        });

        const firstViewDate = instance.getStartViewDate();

        assert.deepEqual(firstViewDate, new Date(2016, 1, 17, 2), 'The first view date is OK');
    });

    test('_removeEmptyRows method', function(assert) {
        const rows = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 1], [0, 0, 0, 0, 0], [1, 1, 1, 0, 1]];

        const instance = createInstance();
        const resultRows = instance._removeEmptyRows(rows);

        assert.deepEqual(resultRows, [[0, 0, 0, 0, 1], [1, 1, 1, 0, 1]], 'The empty rows was removed');
    });

    test('the getEndViewDate method', function(assert) {
        const instance = createInstance({
            currentDate: new Date(2016, 1, 17).toString()
        });

        let lastViewDate = instance.getEndViewDate();
        assert.deepEqual(lastViewDate, new Date(2016, 1, 23, 23, 59), 'The last view date is OK');


        instance.option('agendaDuration', 15);
        lastViewDate = instance.getEndViewDate();

        assert.deepEqual(lastViewDate, new Date(2016, 2, 2, 23, 59), 'The last view date is OK');
    });

    test('the getEndViewDate method with endDayHour option', function(assert) {
        const instance = createInstance({
            currentDate: new Date(2016, 1, 17).toString(),
            endDayHour: 5
        });

        const lastViewDate = instance.getEndViewDate();
        assert.deepEqual(lastViewDate, new Date(2016, 1, 23, 4, 59), 'The last view date is OK');
    });

    test('Agenda time panel should contain rows & cells', function(assert) {
        const instance = createInstance({
            currentDate: new Date(2016, 1, 17).toString()
        });

        const $timePanel = instance.$element().find('.dx-scheduler-time-panel');
        const $rows = $timePanel.find('.dx-scheduler-time-panel-row');

        assert.equal($rows.length, 4, 'Row count is OK');
        assert.equal($rows.eq(0).find('.dx-scheduler-time-panel-cell').length, 1, 'Cell count is OK');
    });

    test('Grouped agenda time panel should contain rows & cells', function(assert) {
        const instance = createInstance({
            currentDate: new Date(2016, 1, 17).toString()
        }, 2);

        const $timePanel = instance.$element().find('.dx-scheduler-time-panel');
        const $rows = $timePanel.find('.dx-scheduler-time-panel-row');

        assert.equal($rows.length, 8, 'Row count is OK');
        assert.equal($rows.eq(0).find('.dx-scheduler-time-panel-cell').length, 1, 'Cell count is OK');
    });

    test('Agenda time panel should contain right text inside cells', function(assert) {
        const instance = createInstance({
            currentDate: new Date(2016, 1, 17).toString()
        });

        const $cells = instance.$element().find('.dx-scheduler-time-panel-cell');

        assert.equal($cells.eq(0).text(), dateLocalization.format(new Date(2016, 1, 17), formatDateAndWeekday));
        assert.equal($cells.eq(1).text(), dateLocalization.format(new Date(2016, 1, 19), formatDateAndWeekday));
        assert.equal($cells.eq(2).text(), dateLocalization.format(new Date(2016, 1, 22), formatDateAndWeekday));
        assert.equal($cells.eq(3).text(), dateLocalization.format(new Date(2016, 1, 23), formatDateAndWeekday));
    });

    test('Agenda date table should contain rows & cells', function(assert) {
        const currentDate = new Date(2016, 1, 17).toString();

        const instance = createInstance({
            currentDate: currentDate
        });

        const $rows = instance.$element().find('.dx-scheduler-date-table').find('.dx-scheduler-date-table-row');

        assert.equal($rows.length, 4, 'Row count is OK');
        assert.equal($rows.eq(0).find('.dx-scheduler-date-table-cell').length, 1, 'Cell count is OK');
    });

    test('Grouped agenda date table should contain rows & cells', function(assert) {
        const currentDate = new Date(2016, 1, 17).toString();

        const instance = createInstance({
            currentDate: currentDate
        }, 2);

        const $rows = instance.$element().find('.dx-scheduler-date-table').find('.dx-scheduler-date-table-row');

        assert.equal($rows.length, 8, 'Row count is OK');
        assert.equal($rows.eq(0).find('.dx-scheduler-date-table-cell').length, 1, 'Cell count is OK');
    });

    test('Agenda date table should not contain any content', function(assert) {
        const instance = createInstance({
            currentDate: new Date(2016, 1, 17).toString()
        });

        instance.$element().find('.dx-scheduler-date-table-cell').each(function() {
            assert.notOk($(this).contents().length, 'Cell is empty');
        });
    });


    test('Agenda date table cell should not handle hover', function(assert) {
        const instance = createInstance({
            currentDate: new Date(2016, 1, 17).toString()
        });

        const $element = instance.$element();
        const $cell = $element.find('.dx-scheduler-date-table-cell').first();

        $($element).trigger($.Event('dxhoverstart', { target: $cell.get(0) }));

        assert.notOk($cell.hasClass('dx-state-hover'), 'Cell is not hovered');
    });

    test('Date table rows should have a right height', function(assert) {
        const currentDate = new Date(2016, 1, 17).toString();
        const rowHeight = 70;

        const instance = createInstance({
            currentDate: currentDate,
            rowHeight: rowHeight
        });

        const $dateTableRows = instance.$element().find('.dx-scheduler-date-table').find('.dx-scheduler-date-table-row');

        assert.roughEqual($dateTableRows.eq(0).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
        assert.roughEqual($dateTableRows.eq(1).outerHeight(), (rowHeight + 5) * 2 + (rowHeight + 20), 2.001, 'Row height is OK');
        assert.roughEqual($dateTableRows.eq(2).outerHeight(), (rowHeight + 5) + (rowHeight + 20), 2.001, 'Row height is OK');
        assert.roughEqual($dateTableRows.eq(3).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
    });

    test('Agenda date table should not handle any events', function(assert) {
        const currentDate = new Date(2016, 1, 17).toString();

        const instance = createInstance({
            currentDate: currentDate
        });

        const dateTable = instance.$element().find('.dx-scheduler-date-table').get(0);

        assert.strictEqual($._data(dateTable, 'events'), undefined, 'Date table doesn\'t handle any events');
    });

    test('Agenda element should not handle click event', function(assert) {
        const currentDate = new Date(2016, 1, 17).toString();

        const instance = createInstance({
            currentDate: currentDate,
            focusStateEnabled: true,
            onCellClick: function(e) {
                assert.ok(false);
            }
        });


        const $element = $(instance.$element());
        $element.find('.' + DATE_TABLE_CELL_CLASS).eq(0).trigger('dxclick');
        assert.ok(true);
    });

    test('Time panel rows should have a right height', function(assert) {
        const currentDate = new Date(2016, 1, 17).toString();
        const rowHeight = 117;

        const instance = createInstance({
            currentDate: currentDate,
            rowHeight: rowHeight
        });

        const $timePanelRows = instance.$element().find('.dx-scheduler-time-panel .dx-scheduler-time-panel-row');

        assert.roughEqual($timePanelRows.eq(0).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
        assert.roughEqual($timePanelRows.eq(1).outerHeight(), (rowHeight + 5) * 2 + (rowHeight + 20), 2.001, 'Row height is OK');
        assert.roughEqual($timePanelRows.eq(2).outerHeight(), (rowHeight + 5) + (rowHeight + 20), 2.001, 'Row height is OK');
        assert.roughEqual($timePanelRows.eq(3).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
    });

    test('Date table rows should have a right height when rowHeight is changed', function(assert) {
        const currentDate = new Date(2016, 1, 17).toString();
        const rowHeight = 117;

        const instance = createInstance({
            currentDate: currentDate
        });

        instance.option('rowHeight', rowHeight);

        const $dateTableRows = instance.$element().find('.dx-scheduler-date-table').find('.dx-scheduler-date-table-row');

        assert.equal($dateTableRows.length, 4, 'Row count is OK');
        assert.roughEqual($dateTableRows.eq(0).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
        assert.roughEqual($dateTableRows.eq(1).outerHeight(), (rowHeight + 5) * 2 + (rowHeight + 20), 2.001, 'Row height is OK');
        assert.roughEqual($dateTableRows.eq(2).outerHeight(), (rowHeight + 5) + (rowHeight + 20), 2.001, 'Row height is OK');
        assert.roughEqual($dateTableRows.eq(3).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
    });

    test('Time panel rows should have a right height when rowHeight is changed', function(assert) {
        const currentDate = new Date(2016, 1, 17).toString();
        const rowHeight = 117;

        const instance = createInstance({
            currentDate: currentDate
        });

        instance.option('rowHeight', rowHeight);

        const $timePanelRows = instance.$element().find('.dx-scheduler-time-panel .dx-scheduler-time-panel-row');

        assert.equal($timePanelRows.length, 4, 'Row count is OK');
        assert.roughEqual($timePanelRows.eq(0).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
        assert.roughEqual($timePanelRows.eq(1).outerHeight(), (rowHeight + 5) * 2 + (rowHeight + 20), 2.001, 'Row height is OK');
        assert.roughEqual($timePanelRows.eq(2).outerHeight(), (rowHeight + 5) + (rowHeight + 20), 2.001, 'Row height is OK');
        assert.roughEqual($timePanelRows.eq(3).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
    });

    test('Agenda should be recalculated after rowHeight changed', function(assert) {
        const instance = createInstance();

        const recalculateStub = sinon.stub(instance, '_recalculateAgenda');

        instance.option('rowHeight', 100);

        assert.ok(recalculateStub.called, 'Agenda was recalculated');
    });

    test('Agenda should not contain all-day stuff', function(assert) {
        const instance = createInstance({
            currentDate: new Date(2016, 1, 17).toString()
        });

        const $element = instance.$element();

        assert.equal($element.find('.dx-scheduler-all-day-title').length, 0, 'There is not all-day title');
        assert.equal($element.find('.dx-scheduler-all-day-appointments').length, 0, 'There are not all-day appts');
        assert.equal($element.find('.dx-scheduler-all-day-panel').length, 0, 'There is not all-day panel');
    });

    test('Agenda should not contain all-day stuff after option change', function(assert) {
        assert.expect(1);

        const instance = createInstance({
            currentDate: new Date(2016, 1, 17).toString(),
            showAllDayPanel: false
        });

        instance.option('showAllDayPanel', true);

        const $element = instance.$element();

        assert.equal($element.find('.dx-scheduler-all-day-panel').length, 0, 'There is not all-day panel');
    });

    test('Agenda should not contain fixed appts and header panel', function(assert) {
        const instance = createInstance({
            currentDate: new Date(2016, 1, 17).toString()
        });

        const $element = instance.$element();

        assert.equal($element.find('.dx-scheduler-fixed-appointments').length, 0, 'There are not fixed appts');
        assert.equal($element.find('.dx-scheduler-header-panel').length, 0, 'There is not header panel');
    });

    test('Agenda getEndViewDate should not change \'currentDate\' option value', function(assert) {
        const currentDate = new Date(2016, 1, 17).toString();

        const instance = createInstance({
            currentDate: currentDate
        });

        instance.getEndViewDate();
        assert.equal(currentDate, instance.option('currentDate').toString(), 'Current date is OK');
    });

    test('Grouped agenda should contain the group table', function(assert) {
        const instance = createInstance({
            groups: [
                { name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] },
                { name: 'ownerId', items: [{ id: 1, text: 'o1' }, { id: 2, text: 'o2' }, { id: 2, text: 'o3' }] }
            ]
        }, 6);

        assert.equal(instance.$element().find('.dx-scheduler-group-table').length, 1, 'Group table is rendered');

        instance.option('groups', []);

        assert.equal(instance.$element().find('.dx-scheduler-group-table').length, 0, 'Group table isn\'t rendered');

        instance.option('groups', [{ name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] }]);

        assert.equal(instance.$element().find('.dx-scheduler-group-table').length, 1, 'Group table is rendered');
    });

    test('Grouped agenda dateTable rows should have last-row class if needed', function(assert) {
        const instance = createInstance({
            groups: [
                { name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] },
                { name: 'ownerId', items: [{ id: 1, text: 'o1' }, { id: 2, text: 'o2' }, { id: 2, text: 'o3' }] }
            ]
        }, 6);

        const $dateTableRows = instance.$element().find('.dx-scheduler-date-table').find('.dx-scheduler-date-table-row');

        assert.ok($dateTableRows.eq(3).hasClass('dx-scheduler-date-table-last-row'), 'Last row in group has right class');
        assert.ok($dateTableRows.eq(7).hasClass('dx-scheduler-date-table-last-row'), 'Last row in group has right class');
        assert.ok($dateTableRows.eq(23).hasClass('dx-scheduler-date-table-last-row'), 'Last row in group has right class');
    });

    test('Grouped agenda should contain group rows', function(assert) {
        const instance = createInstance({
            groups: [
                { name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] },
                { name: 'ownerId', items: [{ id: 1, text: 'o1' }, { id: 2, text: 'o2' }, { id: 2, text: 'o3' }] }
            ]
        }, 6);

        assert.equal(instance.$element().find('.dx-scheduler-group-table .dx-scheduler-group-row').length, 6, 'Group rows are rendered');
    });

    test('Group table rows should have a right height', function(assert) {
        const currentDate = new Date(2016, 1, 17).toString();
        const rowHeight = 117;

        const instance = createInstance({
            currentDate: currentDate,
            rowHeight: rowHeight,
            groups: [
                { name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] },
                { name: 'ownerId', items: [{ id: 1, text: 'o1' }, { id: 2, text: 'o2' }] }
            ]
        }, 4);

        const $groupTableRows = instance.$element().find('.dx-scheduler-group-header-content');

        assert.roughEqual($groupTableRows.eq(1).outerHeight(), 914, 3.001, 'Row height is OK');
        assert.roughEqual($groupTableRows.eq(2).outerHeight(), 914, 3.001, 'Row height is OK');
        assert.roughEqual($groupTableRows.eq(4).outerHeight(), 914, 3.001, 'Row height is OK');
        assert.roughEqual($groupTableRows.eq(5).outerHeight(), 914, 3.001, 'Row height is OK');
    });

    test('Agenda should have the right \'dx-group-column-count\' attr depend on group count', function(assert) {
        const instance = createInstance({
            groups: [
                { name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] },
                { name: 'ownerId', items: [{ id: 1, text: 'o1' }, { id: 2, text: 'o2' }, { id: 3, text: 'o3' }] }
            ]
        }, 6);

        const $element = instance.$element();

        assert.equal($element.attr('dx-group-column-count'), '2', 'Attr is OK');
        assert.notOk($element.attr('dx-group-row-count'), 'row-count attr is not applied');

        instance.option('groups', []);

        assert.notOk($element.attr('dx-group-column-count'), 'column-count attr is not applied');
    });

    test('Agenda should not create scrollable elements, if crossSCrollingEnabled=true ', function(assert) {
        const instance = createInstance({
            crossScrollingEnabled: true
        });

        const $element = instance.$element();
        const $groupPanelScrollable = $element.find('.dx-scheduler-sidebar-scrollable');

        assert.equal($groupPanelScrollable.length, 0, 'Group panel scrollable wasn\'t rendered');
    });

    test('Agenda should not have both-scrollbar class if crossScrollingEnabled=true', function(assert) {
        const instance = createInstance({
            crossScrollingEnabled: true
        });

        assert.notOk(instance.$element().hasClass('dx-scheduler-work-space-both-scrollbar'), 'CSS class is OK');
    });

    test('Agenda dateTable scrollable should not have direction=both if crossScrollingEnabled=true', function(assert) {
        const instance = createInstance({
            crossScrollingEnabled: true
        });

        const $element = instance.$element();
        const dateTableScrollable = $element.find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

        assert.equal(dateTableScrollable.option('direction'), 'vertical', 'Direction is OK');
    });

    test('Agenda should not have tabIndex', function(assert) {
        const instance = createInstance({
            focusStateEnabled: true
        });

        assert.equal(instance.$element().attr('tabindex'), null, 'tabindex is not set');
    });

    test('Cell hover should not work', function(assert) {
        const instance = createInstance();
        const $element = $(instance.$element());

        const cells = $element.find(`.${DATE_TABLE_CELL_CLASS}`);

        $element.trigger($.Event('dxpointerenter', { target: cells.eq(2).get(0), which: 1 }));

        assert.notOk(cells.eq(2).hasClass(HOVER_CLASS), 'onHover event does not work');
    });
});
