import { initTestMarkup, createWrapper } from './helpers.js';
import dateLocalization from 'localization/date';
import fx from 'animation/fx';
import subscribes from 'ui/scheduler/ui.scheduler.subscribes';
import { dateToMilliseconds as toMs } from 'core/utils/date';

import 'ui/scheduler/ui.scheduler';
import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(() => initTestMarkup());
const moduleConfig = {
    beforeEach() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach() {
        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module('Appointments with DST/STD cases', moduleConfig, () => {
    const getDeltaTz = (schedulerTz, date) => schedulerTz * toMs('hour') + date.getTimezoneOffset() * toMs('minute');

    QUnit.test('Appointment wich started in DST and ended in STD time should have correct start & end dates', function(assert) {
        const startDate = new Date(1541311200000);
        const endDate = new Date(1541319000000);

        const scheduler = createWrapper({
            currentDate: new Date(2018, 10, 4),
            views: ['week'],
            currentView: 'week',
            dataSource: [{
                text: 'DST',
                startDate: startDate,
                endDate: endDate
            }],
            timeZone: 'America/Chicago'
        });

        const deltaTzStart = getDeltaTz(-5, startDate);
        const deltaTzEnd = getDeltaTz(-6, endDate);
        const startDateByTz = new Date(startDate.setHours(startDate.getHours() + deltaTzStart / toMs('hour')));
        const endDateByTz = new Date(endDate.setHours(endDate.getHours() + deltaTzEnd / toMs('hour')));
        const resultDateText = `${dateLocalization.format(startDateByTz, 'shorttime')} - ${dateLocalization.format(endDateByTz, 'shorttime')}`;

        assert.equal(scheduler.appointments.getTitleText(), 'DST', 'Text is correct on init');
        assert.equal(scheduler.appointments.getDateText(), resultDateText, 'Date is correct on init');
    });

    QUnit.test('Appointment wich started in STD and ended in DST time should have correct start & end dates', function(assert) {
        const startDate = new Date(1520748000000);
        const endDate = new Date(1520751600000);

        const scheduler = createWrapper({
            currentDate: new Date(2018, 2, 11),
            views: ['timelineDay'],
            maxAppointmentsPerCell: null,
            currentView: 'timelineDay',
            dataSource: [{
                text: 'DST',
                startDate: startDate,
                endDate: endDate
            }],
            timeZone: 'America/New_York'
        });

        const deltaTzStart = getDeltaTz(-5, startDate);
        const deltaTzEnd = getDeltaTz(-4, endDate);
        const startDateByTz = new Date(startDate.setHours(startDate.getHours() + deltaTzStart / toMs('hour')));
        const endDateByTz = new Date(endDate.setHours(endDate.getHours() + deltaTzEnd / toMs('hour')));
        const resultDateText = `${dateLocalization.format(startDateByTz, 'shorttime')} - ${dateLocalization.format(endDateByTz, 'shorttime')}`;

        assert.equal(scheduler.appointments.getTitleText(), 'DST', 'Text is correct on init');
        assert.equal(scheduler.appointments.getDateText(), resultDateText, 'Date is correct on init');
    });

    QUnit.test('Second recurring appointment wich started in STD and ended in DST time should have correct start & end dates & position', function(assert) {
        const startDate = new Date(1520748000000);
        const endDate = new Date(1520751600000);

        const scheduler = createWrapper({
            currentDate: new Date(2018, 2, 12),
            views: ['timelineDay'],
            currentView: 'timelineDay',
            maxAppointmentsPerCell: null,
            dataSource: [{
                text: 'DST',
                startDate: startDate,
                endDate: endDate,
                recurrenceRule: 'FREQ=DAILY'
            }],
            timeZone: 'America/New_York'
        });

        assert.equal(scheduler.appointments.getTitleText(), 'DST', 'Text is correct on init');
        assert.equal(scheduler.appointments.getDateText(), '1:00 AM - 2:00 AM', 'Start Date is correct on init');
        assert.roughEqual(scheduler.appointments.getAppointment(0).outerWidth(), scheduler.workSpace.getCellWidth() * 2, 2, 'Appointment width is correct');
    });

    QUnit.test('Appointment which started in DST and ended in STD time should have right width, timeline view', function(assert) {
        const startDate = new Date(2018, 10, 4, 1);
        const endDate = new Date(2018, 10, 4, 3);
        const currentDate = new Date(2018, 10, 4);

        const scheduler = createWrapper({
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            cellDuration: 60,
            currentDate: currentDate,
            maxAppointmentsPerCell: null,
            dataSource: [{
                text: 'DST',
                startDate: startDate,
                endDate: endDate
            }]
        });

        const duration = (endDate - startDate) / toMs('hour');
        const tzDiff = (startDate.getTimezoneOffset() - endDate.getTimezoneOffset()) / toMs('second');

        assert.roughEqual(scheduler.appointments.getAppointment(0).outerWidth(), scheduler.workSpace.getCellWidth() * (duration + tzDiff), 2.001, 'Appt width is correct on the day of the time ajusting');
    });

    QUnit.test('Second recurring appointment should have right width if previous appt started in STD and ended in DST, timeline view', function(assert) {
        const startDate = new Date(1520758800000);
        const endDate = new Date(1520762400000);
        const currentDate = new Date(2018, 2, 12);

        const scheduler = createWrapper({
            currentDate: currentDate,
            views: ['timelineDay'],
            currentView: 'timelineDay',
            maxAppointmentsPerCell: null,
            dataSource: [{
                text: 'DST',
                startDate: startDate,
                endDate: endDate,
                recurrenceRule: 'FREQ=DAILY'
            }],
            cellDuration: 60,
            timeZone: 'America/New_York'
        });

        scheduler.instance.option('currentDate', scheduler.instance.fire('convertDateByTimezone', currentDate, -5));
        const duration = (endDate - startDate) / toMs('hour');

        assert.roughEqual(scheduler.appointments.getAppointment(0).outerWidth(), scheduler.workSpace.getCellWidth() * duration, 2.001, 'Appt width is correct after the day of the time ajusting');
    });

    QUnit.test('Recurrence exception should not be rendered if exception goes after adjusting AEST-> AEDT (T619455)', function(assert) {
        const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-39600000);
        try {
            const scheduler = createWrapper({
                dataSource: [{
                    text: 'Recruiting students',
                    startDate: new Date(2018, 2, 30, 10, 0),
                    endDate: new Date(2018, 2, 30, 11, 0),
                    recurrenceRule: 'FREQ=DAILY',
                    recurrenceException: '20180401T100000'
                }],
                views: ['month'],
                currentView: 'month',
                currentDate: new Date(2018, 2, 30),
                timeZone: 'Australia/Sydney',
                height: 600
            });
            assert.equal(scheduler.appointments.getAppointmentCount(), 8, 'correct number of the events');

            scheduler.instance.option('currentView', 'day');
            scheduler.instance.option('currentDate', new Date(2018, 3, 1));

            assert.notOk(scheduler.appointments.getAppointmentCount(), 'event is an exception');
        } finally {
            tzOffsetStub.restore();
        }
    });

    QUnit.test('Appointment should rendered correctly if end date appointment coincided translation oт STD', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'November 4',
                startDate: new Date(2018, 10, 4, 18, 0),
                endDate: new Date(2018, 10, 5, 0, 0),
            }],
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2018, 10, 1),
            firstDayOfWeek: 0,
            cellDuration: 60,
            height: 800
        });

        assert.roughEqual(scheduler.appointments.getAppointment(0).outerWidth(), scheduler.workSpace.getCellWidth(), 2.001, 'Appointment width is correct after translation oт STD');
    });
});
