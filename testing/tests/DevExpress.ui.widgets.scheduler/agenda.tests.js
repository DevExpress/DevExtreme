import $ from 'jquery';
import SchedulerAgenda from 'ui/scheduler/workspaces/ui.scheduler.agenda';
import dateLocalization from 'localization/date';
import ResourceManager from 'ui/scheduler/ui.scheduler.resource_manager';

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const formatDateAndWeekday = function(date) {
    return date.getDate() + ' ' + dateLocalization.getDayNames('abbreviated')[date.getDay()];
};

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler-agenda"></div>');
});

QUnit.module('Agenda', {
    beforeEach: function() {
        this.createInstance = function(options, groupCount) {
            groupCount = groupCount || 1;

            const singleGroup = [1, 0, 3, 0, 0, 2, 1];
            const rows = [];

            for(let i = 0; i < groupCount; i++) {
                rows.push(singleGroup);
            }

            this.instance = $('#scheduler-agenda')
                .dxSchedulerAgenda($.extend(options, {
                    observer: {
                        fire: $.proxy(function(functionName, args) {
                            if(functionName === 'getAgendaRows') {
                                return $.Deferred().resolve(rows).promise();
                            }
                            if(functionName === 'createReducedResourcesTree') {
                                return new ResourceManager().createResourcesTree(options.groups);
                            }
                        }, this)
                    }
                }))
                .dxSchedulerAgenda('instance');
        };
    }
});

QUnit.test('Scheduler agenda should be initialized', function(assert) {
    this.createInstance();
    assert.ok(this.instance instanceof SchedulerAgenda, 'SchedulerAgenda was initialized');
});

QUnit.test('Scheduler agenda should have a right css class', function(assert) {
    this.createInstance();
    const $element = this.instance.$element();
    assert.ok($element.hasClass('dx-scheduler-agenda'), 'SchedulerAgenda has \'dx-scheduler-agenda\' css class');
});

QUnit.test('Scheduler agenda should not have vertical-grouped class', function(assert) {
    this.createInstance({
        groupOrientation: 'vertical',
        crossScrollingEnabled: true,
        groups: [
            { name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] },
            { name: 'ownerId', items: [{ id: 1, text: 'o1' }, { id: 2, text: 'o2' }, { id: 2, text: 'o3' }] }
        ]
    }, 6);

    const $element = this.instance.$element();

    assert.notOk($element.hasClass('dx-scheduler-work-space-vertical-grouped'), 'SchedulerAgenda hasn\'t \'dx-scheduler-work-space-vertical-grouped\' css class');
});

QUnit.test('the getStartViewDate method', function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 17),
        startDayHour: 2
    });

    const firstViewDate = this.instance.getStartViewDate();

    assert.deepEqual(firstViewDate, new Date(2016, 1, 17, 2), 'The first view date is OK');
});

QUnit.test('_removeEmptyRows method', function(assert) {
    const rows = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 1], [0, 0, 0, 0, 0], [1, 1, 1, 0, 1]];
    let resultRows;

    this.createInstance();
    resultRows = this.instance._removeEmptyRows(rows);

    assert.deepEqual(resultRows, [[0, 0, 0, 0, 1], [1, 1, 1, 0, 1]], 'The empty rows was removed');
});

QUnit.test('the getEndViewDate method', function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 17).toString()
    });

    let lastViewDate = this.instance.getEndViewDate();
    assert.deepEqual(lastViewDate, new Date(2016, 1, 23, 23, 59), 'The last view date is OK');


    this.instance.option('agendaDuration', 15);
    lastViewDate = this.instance.getEndViewDate();

    assert.deepEqual(lastViewDate, new Date(2016, 2, 2, 23, 59), 'The last view date is OK');
});

QUnit.test('the getEndViewDate method with endDayHour option', function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 17).toString(),
        endDayHour: 5
    });

    const lastViewDate = this.instance.getEndViewDate();
    assert.deepEqual(lastViewDate, new Date(2016, 1, 23, 4, 59), 'The last view date is OK');
});

QUnit.test('Agenda time panel should contain rows & cells', function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 17).toString()
    });

    const $timePanel = this.instance.$element().find('.dx-scheduler-time-panel');
    const $rows = $timePanel.find('.dx-scheduler-time-panel-row');

    assert.equal($rows.length, 4, 'Row count is OK');
    assert.equal($rows.eq(0).find('.dx-scheduler-time-panel-cell').length, 1, 'Cell count is OK');
});

QUnit.test('Grouped agenda time panel should contain rows & cells', function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 17).toString()
    }, 2);

    const $timePanel = this.instance.$element().find('.dx-scheduler-time-panel');
    const $rows = $timePanel.find('.dx-scheduler-time-panel-row');

    assert.equal($rows.length, 8, 'Row count is OK');
    assert.equal($rows.eq(0).find('.dx-scheduler-time-panel-cell').length, 1, 'Cell count is OK');
});

QUnit.test('Agenda time panel should contain right text inside cells', function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 17).toString()
    });

    const $cells = this.instance.$element().find('.dx-scheduler-time-panel-cell');

    assert.equal($cells.eq(0).text(), dateLocalization.format(new Date(2016, 1, 17), formatDateAndWeekday));
    assert.equal($cells.eq(1).text(), dateLocalization.format(new Date(2016, 1, 19), formatDateAndWeekday));
    assert.equal($cells.eq(2).text(), dateLocalization.format(new Date(2016, 1, 22), formatDateAndWeekday));
    assert.equal($cells.eq(3).text(), dateLocalization.format(new Date(2016, 1, 23), formatDateAndWeekday));
});

QUnit.test('Agenda date table should contain rows & cells', function(assert) {
    const currentDate = new Date(2016, 1, 17).toString();

    this.createInstance({
        currentDate: currentDate
    });

    const $rows = this.instance.$element().find('.dx-scheduler-date-table').find('.dx-scheduler-date-table-row');

    assert.equal($rows.length, 4, 'Row count is OK');
    assert.equal($rows.eq(0).find('.dx-scheduler-date-table-cell').length, 1, 'Cell count is OK');
});

QUnit.test('Grouped agenda date table should contain rows & cells', function(assert) {
    const currentDate = new Date(2016, 1, 17).toString();

    this.createInstance({
        currentDate: currentDate
    }, 2);

    const $rows = this.instance.$element().find('.dx-scheduler-date-table').find('.dx-scheduler-date-table-row');

    assert.equal($rows.length, 8, 'Row count is OK');
    assert.equal($rows.eq(0).find('.dx-scheduler-date-table-cell').length, 1, 'Cell count is OK');
});

QUnit.test('Agenda date table should not contain any content', function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 17).toString()
    });

    this.instance.$element().find('.dx-scheduler-date-table-cell').each(function() {
        assert.notOk($(this).contents().length, 'Cell is empty');
    });
});


QUnit.test('Agenda date table cell should not handle hover', function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 17).toString()
    });

    const $element = this.instance.$element();
    const $cell = $element.find('.dx-scheduler-date-table-cell').first();

    $($element).trigger($.Event('dxhoverstart', { target: $cell.get(0) }));

    assert.notOk($cell.hasClass('dx-state-hover'), 'Cell is not hovered');
});

QUnit.test('Date table rows should have a right height', function(assert) {
    const currentDate = new Date(2016, 1, 17).toString();
    const rowHeight = 70;

    this.createInstance({
        currentDate: currentDate,
        rowHeight: rowHeight
    });

    const $dateTableRows = this.instance.$element().find('.dx-scheduler-date-table').find('.dx-scheduler-date-table-row');

    assert.roughEqual($dateTableRows.eq(0).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
    assert.roughEqual($dateTableRows.eq(1).outerHeight(), (rowHeight + 5) * 2 + (rowHeight + 20), 2.001, 'Row height is OK');
    assert.roughEqual($dateTableRows.eq(2).outerHeight(), (rowHeight + 5) + (rowHeight + 20), 2.001, 'Row height is OK');
    assert.roughEqual($dateTableRows.eq(3).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
});

QUnit.test('Agenda date table should not handle any events', function(assert) {
    const currentDate = new Date(2016, 1, 17).toString();

    this.createInstance({
        currentDate: currentDate
    });

    const dateTable = this.instance.$element().find('.dx-scheduler-date-table').get(0);

    assert.strictEqual($._data(dateTable, 'events'), undefined, 'Date table doesn\'t handle any events');
});

QUnit.test('Agenda element should not handle click event', function(assert) {
    const currentDate = new Date(2016, 1, 17).toString();

    this.createInstance({
        currentDate: currentDate,
        focusStateEnabled: true,
        onCellClick: function(e) {
            assert.ok(false);
        }
    });


    const $element = $(this.instance.$element());
    $element.find('.' + DATE_TABLE_CELL_CLASS).eq(0).trigger('dxclick');
    assert.ok(true);
});

QUnit.test('Time panel rows should have a right height', function(assert) {
    const currentDate = new Date(2016, 1, 17).toString();
    const rowHeight = 117;

    this.createInstance({
        currentDate: currentDate,
        rowHeight: rowHeight
    });

    const $timePanelRows = this.instance.$element().find('.dx-scheduler-time-panel .dx-scheduler-time-panel-row');

    assert.roughEqual($timePanelRows.eq(0).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
    assert.roughEqual($timePanelRows.eq(1).outerHeight(), (rowHeight + 5) * 2 + (rowHeight + 20), 2.001, 'Row height is OK');
    assert.roughEqual($timePanelRows.eq(2).outerHeight(), (rowHeight + 5) + (rowHeight + 20), 2.001, 'Row height is OK');
    assert.roughEqual($timePanelRows.eq(3).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
});

QUnit.test('Date table rows should have a right height when rowHeight is changed', function(assert) {
    const currentDate = new Date(2016, 1, 17).toString();
    const rowHeight = 117;

    this.createInstance({
        currentDate: currentDate
    });

    this.instance.option('rowHeight', rowHeight);

    const $dateTableRows = this.instance.$element().find('.dx-scheduler-date-table').find('.dx-scheduler-date-table-row');

    assert.equal($dateTableRows.length, 4, 'Row count is OK');
    assert.roughEqual($dateTableRows.eq(0).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
    assert.roughEqual($dateTableRows.eq(1).outerHeight(), (rowHeight + 5) * 2 + (rowHeight + 20), 2.001, 'Row height is OK');
    assert.roughEqual($dateTableRows.eq(2).outerHeight(), (rowHeight + 5) + (rowHeight + 20), 2.001, 'Row height is OK');
    assert.roughEqual($dateTableRows.eq(3).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
});

QUnit.test('Time panel rows should have a right height when rowHeight is changed', function(assert) {
    const currentDate = new Date(2016, 1, 17).toString();
    const rowHeight = 117;

    this.createInstance({
        currentDate: currentDate
    });

    this.instance.option('rowHeight', rowHeight);

    const $timePanelRows = this.instance.$element().find('.dx-scheduler-time-panel .dx-scheduler-time-panel-row');

    assert.equal($timePanelRows.length, 4, 'Row count is OK');
    assert.roughEqual($timePanelRows.eq(0).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
    assert.roughEqual($timePanelRows.eq(1).outerHeight(), (rowHeight + 5) * 2 + (rowHeight + 20), 2.001, 'Row height is OK');
    assert.roughEqual($timePanelRows.eq(2).outerHeight(), (rowHeight + 5) + (rowHeight + 20), 2.001, 'Row height is OK');
    assert.roughEqual($timePanelRows.eq(3).outerHeight(), rowHeight + 20, 2.001, 'Row height is OK');
});

QUnit.test('Agenda should be recalculated after rowHeight changed', function(assert) {
    this.createInstance();

    const recalculateStub = sinon.stub(this.instance, '_recalculateAgenda');

    this.instance.option('rowHeight', 100);

    assert.ok(recalculateStub.called, 'Agenda was recalculated');
});

QUnit.test('Agenda should not contain all-day stuff', function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 17).toString()
    });

    const $element = this.instance.$element();

    assert.equal($element.find('.dx-scheduler-all-day-title').length, 0, 'There is not all-day title');
    assert.equal($element.find('.dx-scheduler-all-day-appointments').length, 0, 'There are not all-day appts');
    assert.equal($element.find('.dx-scheduler-all-day-panel').length, 0, 'There is not all-day panel');
});

QUnit.test('Agenda should not contain all-day stuff after option change', function(assert) {
    assert.expect(1);

    this.createInstance({
        currentDate: new Date(2016, 1, 17).toString(),
        showAllDayPanel: false
    });

    this.instance.option('showAllDayPanel', true);

    const $element = this.instance.$element();

    assert.equal($element.find('.dx-scheduler-all-day-panel').length, 0, 'There is not all-day panel');
});

QUnit.test('Agenda should not contain fixed appts and header panel', function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 17).toString()
    });

    const $element = this.instance.$element();

    assert.equal($element.find('.dx-scheduler-fixed-appointments').length, 0, 'There are not fixed appts');
    assert.equal($element.find('.dx-scheduler-header-panel').length, 0, 'There is not header panel');
});

QUnit.test('Agenda getEndViewDate should not change \'currentDate\' option value', function(assert) {
    const currentDate = new Date(2016, 1, 17).toString();

    this.createInstance({
        currentDate: currentDate
    });

    this.instance.getEndViewDate();
    assert.equal(currentDate, this.instance.option('currentDate').toString(), 'Current date is OK');
});

QUnit.test('Grouped agenda should contain the group table', function(assert) {
    this.createInstance({
        groups: [
            { name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] },
            { name: 'ownerId', items: [{ id: 1, text: 'o1' }, { id: 2, text: 'o2' }, { id: 2, text: 'o3' }] }
        ]
    }, 6);

    assert.equal(this.instance.$element().find('.dx-scheduler-group-table').length, 1, 'Group table is rendered');

    this.instance.option('groups', []);

    assert.equal(this.instance.$element().find('.dx-scheduler-group-table').length, 0, 'Group table isn\'t rendered');

    this.instance.option('groups', [{ name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] }]);

    assert.equal(this.instance.$element().find('.dx-scheduler-group-table').length, 1, 'Group table is rendered');
});

QUnit.test('Grouped agenda dateTable rows should have last-row class if needed', function(assert) {
    this.createInstance({
        groups: [
            { name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] },
            { name: 'ownerId', items: [{ id: 1, text: 'o1' }, { id: 2, text: 'o2' }, { id: 2, text: 'o3' }] }
        ]
    }, 6);

    const $dateTableRows = this.instance.$element().find('.dx-scheduler-date-table').find('.dx-scheduler-date-table-row');

    assert.ok($dateTableRows.eq(3).hasClass('dx-scheduler-date-table-last-row'), 'Last row in group has right class');
    assert.ok($dateTableRows.eq(7).hasClass('dx-scheduler-date-table-last-row'), 'Last row in group has right class');
    assert.ok($dateTableRows.eq(23).hasClass('dx-scheduler-date-table-last-row'), 'Last row in group has right class');
});

QUnit.test('Grouped agenda should contain group rows', function(assert) {
    this.createInstance({
        groups: [
            { name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] },
            { name: 'ownerId', items: [{ id: 1, text: 'o1' }, { id: 2, text: 'o2' }, { id: 2, text: 'o3' }] }
        ]
    }, 6);

    assert.equal(this.instance.$element().find('.dx-scheduler-group-table .dx-scheduler-group-row').length, 6, 'Group rows are rendered');
});

QUnit.test('Group table rows should have a right height', function(assert) {
    const currentDate = new Date(2016, 1, 17).toString();
    const rowHeight = 117;

    this.createInstance({
        currentDate: currentDate,
        rowHeight: rowHeight,
        groups: [
            { name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] },
            { name: 'ownerId', items: [{ id: 1, text: 'o1' }, { id: 2, text: 'o2' }] }
        ]
    }, 4);

    const $groupTableRows = this.instance.$element().find('.dx-scheduler-group-header-content');

    assert.roughEqual($groupTableRows.eq(1).outerHeight(), 914, 3.001, 'Row height is OK');
    assert.roughEqual($groupTableRows.eq(2).outerHeight(), 914, 3.001, 'Row height is OK');
    assert.roughEqual($groupTableRows.eq(4).outerHeight(), 914, 3.001, 'Row height is OK');
    assert.roughEqual($groupTableRows.eq(5).outerHeight(), 914, 3.001, 'Row height is OK');
});

QUnit.test('Agenda should have the right \'dx-group-column-count\' attr depend on group count', function(assert) {
    this.createInstance({
        groups: [
            { name: 'roomId', items: [{ id: 1, text: 'r1' }, { id: 2, text: 'r2' }] },
            { name: 'ownerId', items: [{ id: 1, text: 'o1' }, { id: 2, text: 'o2' }, { id: 3, text: 'o3' }] }
        ]
    }, 6);

    const $element = this.instance.$element();

    assert.equal($element.attr('dx-group-column-count'), '2', 'Attr is OK');
    assert.notOk($element.attr('dx-group-row-count'), 'row-count attr is not applied');

    this.instance.option('groups', []);

    assert.notOk($element.attr('dx-group-column-count'), 'column-count attr is not applied');
});

QUnit.test('Agenda should not create scrollable elements, if crossSCrollingEnabled=true ', function(assert) {
    this.createInstance({
        crossScrollingEnabled: true
    });

    const $element = this.instance.$element();
    const $groupPanelScrollable = $element.find('.dx-scheduler-sidebar-scrollable');

    assert.equal($groupPanelScrollable.length, 0, 'Group panel scrollable wasn\'t rendered');
});

QUnit.test('Agenda should not have both-scrollbar class if crossScrollingEnabled=true', function(assert) {
    this.createInstance({
        crossScrollingEnabled: true
    });

    assert.notOk(this.instance.$element().hasClass('dx-scheduler-work-space-both-scrollbar'), 'CSS class is OK');
});

QUnit.test('Agenda dateTable scrollable should not have direction=both if crossScrollingEnabled=true', function(assert) {
    this.createInstance({
        crossScrollingEnabled: true
    });

    const $element = this.instance.$element();
    const dateTableScrollable = $element.find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

    assert.equal(dateTableScrollable.option('direction'), 'vertical', 'Direction is OK');
});

QUnit.test('Agenda should not have tabIndex', function(assert) {
    this.createInstance({
        focusStateEnabled: true
    });

    assert.equal(this.instance.$element().attr('tabindex'), null, 'tabindex is not set');
});
