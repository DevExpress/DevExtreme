import $ from 'jquery';

QUnit.testStart(() => {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

import 'generic_light.css!';

import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import devices from '__internal/core/m_devices';

import '__internal/scheduler/m_scheduler';
import { SchedulerTestWrapper, createWrapper } from '../../helpers/scheduler/helpers.js';

const createInstance = options => {
    const instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
    return new SchedulerTestWrapper(instance);
};

QUnit.module('Integration: Timeline', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
        };
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('Special classes should be applied in grouped timeline', function(assert) {
    const $style = $('<style nonce="qunit-test">').text(`
        #scheduler .dx-scheduler-cell-sizes-vertical {
            height: 100px
        }
    `);

    try {
        $('#qunit-fixture').prepend($style);

        const resourcesData = [
            { text: 'One', id: 2 },
            { text: 'Two', id: 3 },
            { text: 'Three', id: 4 },
            { text: 'Four', id: 5 },
            { text: 'Five', id: 6 }
        ];

        const scheduler = createInstance({
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            crossScrollingEnabled: true,
            groups: ['ownerId'],
            resources: [{
                fieldExpr: 'ownerId',
                dataSource: resourcesData
            }],
            height: 500
        });

        assert.roughEqual(scheduler.grouping.getGroupHeaderHeight(), 100, 3.001, 'Cell height is OK');
    } finally {
        $style.remove();
    }
});

QUnit.test('Scheduler should have a right timeline work space', function(assert) {
    const scheduler = createInstance({
        views: ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'],
        currentView: 'timelineDay'
    });

    assert.ok(scheduler.workSpace.getWorkSpace().dxSchedulerTimelineDay('instance'), 'Work space is timelineDay on init');

    scheduler.instance.option('currentView', 'timelineWeek');
    assert.ok(scheduler.workSpace.getWorkSpace().dxSchedulerTimelineWeek('instance'), 'Work space is timelineWeek after change option ');

    scheduler.instance.option('currentView', 'timelineWorkWeek');
    assert.ok(scheduler.workSpace.getWorkSpace().dxSchedulerTimelineWorkWeek('instance'), 'Work space is timelineWorkWeek after change option ');

    scheduler.instance.option('currentView', 'timelineMonth');
    assert.ok(scheduler.workSpace.getWorkSpace().dxSchedulerTimelineMonth('instance'), 'Work space is timelineMonth after change option ');
});

QUnit.test('Scheduler should not update scroll position if appointment is visible, timeline day view ', function(assert) {
    const scheduler = createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: 'timelineDay',
        height: 500,
        width: 1000,
    });

    const appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: 'caption' };
    const workSpace = scheduler.workSpace.getWorkSpace().dxSchedulerTimelineDay('instance');
    const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

    try {
        scheduler.instance.showAppointmentPopup(appointment);
        scheduler.appointmentPopup.clickDoneButton();

        assert.notOk(scrollToSpy.calledOnce, 'scrollTo was not called');
    } finally {
        workSpace.scrollTo.restore();
    }
});

QUnit.test('Scheduler should not update scroll position if appointment is visible, timeline week view ', function(assert) {
    const scheduler = createInstance({
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 2, 2),
        dataSource: new DataSource({
            store: []
        }),
        views: ['timelineWeek', 'timelineWorkWeek'],
        currentView: 'timelineWeek',
        height: 500,
        cellDuration: 120,
        width: 1000,
    });

    const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
    scrollable.scrollTo({ left: 10000 });

    const appointment = { startDate: new Date(2015, 2, 6, 6), endDate: new Date(2015, 2, 6, 8), text: 'caption' };
    const workSpace = scheduler.workSpace.getWorkSpace().dxSchedulerTimelineWeek('instance');
    const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

    try {
        scheduler.instance.showAppointmentPopup(appointment);
        scheduler.appointmentPopup.clickDoneButton();

        assert.notOk(scrollToSpy.calledOnce, 'scrollTo was not called');
    } finally {
        workSpace.scrollTo.restore();
    }
});

QUnit.test('Scheduler should update scroll position if appointment is not visible, timeline week view ', function(assert) {
    const scheduler = createInstance({
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 2, 2),
        dataSource: new DataSource({
            store: []
        }),
        views: ['timelineWeek', 'timelineWorkWeek'],
        currentView: 'timelineWeek',
        height: 500,
        cellDuration: 120
    });

    const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
    scrollable.scrollTo({ left: 2000 });

    const appointment = { startDate: new Date(2015, 2, 6, 6), endDate: new Date(2015, 2, 6, 8), text: 'caption' };
    const workSpace = scheduler.workSpace.getWorkSpace().dxSchedulerTimelineWeek('instance');
    const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

    try {
        scheduler.instance.showAppointmentPopup(appointment);
        scheduler.appointmentPopup.clickDoneButton();

        assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
    } finally {
        workSpace.scrollTo.restore();
    }
});

QUnit.test('getEndViewDate should return correct value on timelineMonth view DST date (T720694)', function(assert) {
    const scheduler = createInstance({
        currentDate: new Date(2019, 2, 5),
        views: ['timelineMonth'],
        currentView: 'timelineMonth',
        dataSource: []
    });

    const workSpace = scheduler.instance.getWorkSpace();

    assert.deepEqual(workSpace.getEndViewDate(), new Date(2019, 2, 31, 23, 59), 'End view date is OK');
});

QUnit.test('Scheduler should not update scroll position if appointment is visible, timeline month view ', function(assert) {
    const scheduler = createInstance({
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 2, 2),
        dataSource: new DataSource({
            store: []
        }),
        views: ['timelineMonth'],
        currentView: 'timelineMonth',
        height: 500,
        cellDuration: 120,
        width: 1000,
    });

    const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
    scrollable.scrollTo({ left: 12000 });

    const appointment = { startDate: new Date(2015, 2, 29, 6), endDate: new Date(2015, 2, 29, 8), text: 'caption' };
    const workSpace = scheduler.workSpace.getWorkSpace().dxSchedulerTimelineMonth('instance');
    const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

    try {
        scheduler.instance.showAppointmentPopup(appointment);
        scheduler.appointmentPopup.clickDoneButton();

        assert.notOk(scrollToSpy.calledOnce, 'scrollTo was not called');
    } finally {
        workSpace.scrollTo.restore();
    }
});

QUnit.test('Scheduler should update scroll position if appointment is not visible, timeline month view ', function(assert) {
    const scheduler = createInstance({
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 2, 2),
        dataSource: new DataSource({
            store: []
        }),
        views: ['timelineMonth'],
        currentView: 'timelineMonth',
        height: 500,
        cellDuration: 120
    });

    const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
    scrollable.scrollTo({ left: 1000 });

    const appointment = { startDate: new Date(2015, 2, 29, 6), endDate: new Date(2015, 2, 29, 8), text: 'caption' };
    const workSpace = scheduler.workSpace.getWorkSpace().dxSchedulerTimelineMonth('instance');
    const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

    try {
        scheduler.instance.showAppointmentPopup(appointment);
        scheduler.appointmentPopup.clickDoneButton();

        assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
    } finally {
        workSpace.scrollTo.restore();
    }
});

QUnit.test('Appointments should have a right order on timeline month', function(assert) {
    const scheduler = createInstance({
        currentDate: new Date(2016, 1, 2),
        dataSource: new DataSource([
            {
                'text': 'a',
                'startDate': new Date(2016, 1, 1, 11, 30),
                'endDate': new Date(2016, 1, 1, 14, 15)
            }, {
                'text': 'b',
                'startDate': new Date(2016, 1, 1, 9, 0),
                'endDate': new Date(2016, 1, 1, 10, 30)
            },
        ]),
        views: ['timelineMonth'],
        currentView: 'timelineMonth',
        height: 800,
        width: 800
    });

    const $appointments = scheduler.instance.$element().find('.dx-scheduler-appointment');

    assert.equal($appointments.eq(0).data('dxItemData').text, 'b', 'Appointment data is OK');
    assert.equal($appointments.eq(1).data('dxItemData').text, 'a', 'Appointment data is OK');
});

QUnit.test('Scheduler timeline dateTable should have right height after changing size if crossScrollingEnabled = true (T644407)', function(assert) {
    const resourcesData = [
        { text: 'One', id: 2 },
        { text: 'Two', id: 3 },
        { text: 'Three', id: 4 },
        { text: 'Four', id: 5 },
        { text: 'Five', id: 6 }
    ];

    const scheduler = createInstance({
        dataSource: [],
        views: ['timelineDay'],
        currentView: 'timelineDay',
        currentDate: new Date(2017, 4, 1),
        crossScrollingEnabled: true,
        groups: ['ownerId'],
        resources: [{
            fieldExpr: 'ownerId',
            allowMultiple: true,
            dataSource: resourcesData,
            label: 'Owner',
            useColorAsDefault: true
        }]
    });

    const $firstRowCell = scheduler.workSpace.getCell(0); const cellHeight = $firstRowCell.height();

    scheduler.instance.option('width', 500);
    scheduler.instance.option('width', 1000);

    assert.equal(scheduler.workSpace.getCell(0).height(), cellHeight, 'Cells has correct height');
});

QUnit.test('Scheduler timeline groupTable should have right height if widget has auto-height', function(assert) {
    const resourcesData = [
        { text: 'One', id: 2 },
        { text: 'Two', id: 3 },
        { text: 'Three', id: 4 },
        { text: 'Four', id: 5 },
        { text: 'Five', id: 6 }
    ];

    const scheduler = createInstance({
        dataSource: [],
        views: ['timelineDay'],
        currentView: 'timelineDay',
        currentDate: new Date(2017, 4, 1),
        crossScrollingEnabled: false,
        groups: ['ownerId'],
        resources: [{
            fieldExpr: 'ownerId',
            allowMultiple: true,
            dataSource: resourcesData,
            label: 'Owner',
            useColorAsDefault: true
        }]
    });

    const groupHeight = scheduler.grouping.getGroupTableHeight();
    const dateTableHeight = scheduler.workSpace.getDateTableHeight();

    assert.roughEqual(groupHeight, dateTableHeight, 1.5, 'Group table has correct height');
});

QUnit.test('Appointment has correct render with timelineWeek view & endHour outside of view bounds (T754362)', function(assert) {
    const data = [{
        startDate: new Date('2014-07-14T09:00:00.000Z'),
        endDate: new Date('2014-07-14T23:01:00.000Z'),
        text: 'blah',
    }];

    const scheduler = createInstance({
        dataSource: data,
        views: [{
            type: 'timelineWeek',
            cellDuration: 660,
            startDayHour: 7,
            endDayHour: 18
        }],
        currentView: 'timelineWeek',
        firstDayOfWeek: 1,
        currentDate: new Date(2014, 6, 14),
        crossScrollingEnabled: true,
        width: 1500,
        timeZone: 'Etc/UTC'
    });

    assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'Appointment is rendered');

    const appointment = scheduler.appointments.getAppointment();
    assert.roughEqual(appointment.outerWidth(), 175, 1, 'Appointment width is OK');
});
if(devices.real().deviceType === 'desktop') {
    QUnit.module('Integration: Work space: Multiple selection when dragging is not enabled', {
        beforeEach: function() {
            fx.off = true;
        },
        afterEach: function() {
            fx.off = false;
        }
    }, () => {
        [{
            view: 'timelineDay',
            startCell: {
                index: 0, startDate: new Date(2018, 3, 8, 0, 0), endDate: new Date(2018, 3, 8, 0, 30), allDay: false,
            },
            endCell: {
                index: 1, startDate: new Date(2018, 3, 8, 0, 30), endDate: new Date(2018, 3, 8, 1, 0), allDay: false,
            },
        }, {
            view: 'timelineWeek',
            startCell: {
                index: 0, startDate: new Date(2018, 3, 8, 0, 0), endDate: new Date(2018, 3, 8, 0, 30), allDay: false,
            },
            endCell: {
                index: 1, startDate: new Date(2018, 3, 8, 0, 30), endDate: new Date(2018, 3, 8, 1, 0), allDay: false,
            },
        }, {
            view: 'timelineMonth',
            startCell: {
                index: 0, startDate: new Date(2018, 3, 1), endDate: new Date(2018, 3, 2), allDay: false,
            },
            endCell: {
                index: 1, startDate: new Date(2018, 3, 2), endDate: new Date(2018, 3, 3), allDay: false,
            },
        }].forEach((config) => {
            const { view, startCell, endCell } = config;
            QUnit.test(`Multiple selection should work in ${view} when dragging is not enabled`, function(assert) {
                const instance = createWrapper({
                    dataSource: [],
                    views: [view],
                    currentView: view,
                    currentDate: new Date(2018, 3, 8),
                    height: 600,
                    editing: { allowDragging: false },
                });

                const $cells = instance.workSpace.getCells();
                const $table = instance.workSpace.getDateTable();

                $($table).trigger(
                    $.Event('dxpointerdown', { target: $cells.eq(startCell.index).get(0), which: 1, pointerType: 'mouse' }),
                );
                $($table).trigger($.Event('dxpointermove', { target: $cells.eq(endCell.index).get(0), which: 1 }));

                assert.deepEqual(
                    instance.option('selectedCellData'),
                    [
                        {
                            startDate: startCell.startDate,
                            endDate: startCell.endDate,
                            allDay: startCell.allDay,
                            groups: undefined,
                            groupIndex: 0,
                        },
                        {
                            startDate: endCell.startDate,
                            endDate: endCell.endDate,
                            allDay: endCell.allDay,
                            groups: undefined,
                            groupIndex: 0,
                        },
                    ], 'correct cells have been selected');
            });
        });
    });
}
