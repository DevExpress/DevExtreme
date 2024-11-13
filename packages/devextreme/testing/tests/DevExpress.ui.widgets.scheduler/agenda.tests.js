import $ from 'jquery';
import SchedulerAgenda from '__internal/scheduler/workspaces/m_agenda';
import dateLocalization from 'common/core/localization/date';
import { AppointmentDataProvider } from '__internal/scheduler/appointments/data_provider/m_appointment_data_provider';

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const HOVER_CLASS = 'dx-state-hover';

const formatDateAndWeekday = function(date) {
    return date.getDate() + ' ' + dateLocalization.getDayNames('abbreviated')[date.getDay()];
};

const {
    module,
    testStart,
    test,
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

        const resources = options && options.groups || [];

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
            },
            getAppointmentDataProvider: () => new AppointmentDataProvider({
                getIsVirtualScrolling: () => false,
                dataAccessors: {},
                resources,
            })
        };

        const $element = $('#scheduler-agenda').dxSchedulerAgenda({
            ...options,
            ...config
        });
        return $element.dxSchedulerAgenda('instance');
    };

    test('Scheduler agenda should be initialized', function(assert) {
        const instance = createInstance();
        assert.ok(instance instanceof SchedulerAgenda, 'SchedulerAgenda was initialized');
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

    test('Agenda should be recalculated after rowHeight changed', function(assert) {
        const instance = createInstance();

        const recalculateStub = sinon.stub(instance, '_recalculateAgenda');

        instance.option('rowHeight', 100);

        assert.ok(recalculateStub.called, 'Agenda was recalculated');
    });

    test('Agenda getEndViewDate should not change \'currentDate\' option value', function(assert) {
        const currentDate = new Date(2016, 1, 17).toString();

        const instance = createInstance({
            currentDate: currentDate
        });

        instance.getEndViewDate();
        assert.equal(currentDate, instance.option('currentDate').toString(), 'Current date is OK');
    });

    test('Agenda dateTable scrollable should not have direction=both if crossScrollingEnabled=true', function(assert) {
        const instance = createInstance({
            crossScrollingEnabled: true
        });

        const $element = instance.$element();
        const dateTableScrollable = $element.find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

        assert.equal(dateTableScrollable.option('direction'), 'vertical', 'Direction is OK');
    });

    test('Cell hover should not work', function(assert) {
        const instance = createInstance();
        const $element = $(instance.$element());

        const cells = $element.find(`.${DATE_TABLE_CELL_CLASS}`);

        $element.trigger($.Event('dxpointerenter', { target: cells.eq(2).get(0), which: 1 }));

        assert.notOk(cells.eq(2).hasClass(HOVER_CLASS), 'onHover event does not work');
    });

    test('Should return correct DOM meta data', function(assert) {
        const instance = createInstance();

        assert.deepEqual(
            instance.getDOMElementsMetaData(),
            {
                dateTableCellsMeta: [[{}]],
                allDayPanelCellsMeta: [{}],
            },
            'Correct DOM meta data',
        );
    });
});
