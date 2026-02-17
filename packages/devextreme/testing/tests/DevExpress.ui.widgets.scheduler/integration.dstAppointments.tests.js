import { initTestMarkup, createWrapper } from '../../helpers/scheduler/helpers.js';
import dateLocalization from 'common/core/localization/date';
import fx from 'common/core/animation/fx';
import { dateToMilliseconds as toMs } from 'core/utils/date';
import '__internal/scheduler/m_scheduler';
import { waitAsync } from '../../helpers/scheduler/waitForAsync.js';

import 'fluent_blue_light.css!';

QUnit.testStart(() => initTestMarkup());

const moduleConfig = {
    beforeEach() {
        fx.off = true;
    },

    afterEach() {
        fx.off = false;
    }
};

QUnit.module('DST/STD for recurrence appointments, T804886 and T856624', moduleConfig, () => {

    QUnit.test('Any recurrence appt part should have correct tooltip and popup if recurrence starts in STD and ends in DST in custom timezone, appointment timezone is set (T804886)', async function(assert) {
        // NOTE: The daylight saving changed in Montreal on 10.03.2019 and in Paris on 31.03.2019
        const scheduler = await createWrapper({
            dataSource: [
                {
                    text: 'Daily meeting',
                    startDate: '2019-03-01T09:00:00+01:00',
                    endDate: '2019-03-01T12:00:00+01:00',
                    recurrenceRule: 'FREQ=DAILY',
                    startDateTimeZone: 'Europe/Paris',
                    endDateTimeZone: 'Europe/Paris'
                }
            ],
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2019, 2, 1), // NOTE: STD Montreal
            startDayHour: 0,
            height: 600,
            timeZone: 'America/Montreal',
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx',
            editing: { legacyForm: true }
        });

        let startDateEditor;
        let endDateEditor;
        let clock;

        clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
        assert.equal(scheduler.tooltip.getDateText(), '3:00 AM - 6:00 AM', 'Dates and time were displayed correctly in tooltip before time changing in custom timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        await waitAsync(0);
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '3/1/2019, 9:00 AM', 'Start Date is displayed correctly in appointment popup form before time changing in custom timezone');
        assert.equal(endDateEditor.option('text'), '3/1/2019, 12:00 PM', 'End Date is displayed correctly in appointment popup form before time changing in custom timezone');
        scheduler.appointmentPopup.clickCancelButton();

        scheduler.instance.option('currentDate', new Date(2019, 2, 14)); // NOTE: DST Montreal, STD Paris
        await waitAsync(0);

        clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
        assert.equal(scheduler.tooltip.getDateText(), '4:00 AM - 7:00 AM', 'Dates and time were displayed correctly in tooltip after time changing in custom timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        await waitAsync(0);
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '3/14/2019, 9:00 AM', 'Start Date is displayed correctly in appointment popup form after time changing in custom timezone');
        assert.equal(endDateEditor.option('text'), '3/14/2019, 12:00 PM', 'End Date is displayed correctly in appointment popup form after time changing in custom timezone');
        scheduler.appointmentPopup.clickCancelButton();

        scheduler.instance.option('currentDate', new Date(2019, 3, 2)); // NOTE: DST Paris
        await waitAsync(0);

        clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
        assert.equal(scheduler.tooltip.getDateText(), '3:00 AM - 6:00 AM', 'Dates and time were displayed correctly in tooltip after time changing in appointment timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        await waitAsync(0);
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '4/2/2019, 9:00 AM', 'Start Date is displayed correctly in appointment popup form after time changing in appointment timezone');
        assert.equal(endDateEditor.option('text'), '4/2/2019, 12:00 PM', 'End Date is displayed correctly in appointment popup form after time changing in appointment timezone');
    });

    QUnit.test('Recurrence appt part at the time of DST should have correct tooltip and popup if recurrence starts in STD and ends in DST in custom timezone, appointment timezone is set (T804886)', async function(assert) {
        // NOTE: The daylight saving changed in Montreal on 10.03.2019 and in Paris on 31.03.2019
        const scheduler = await createWrapper({
            dataSource: [
                {
                    text: 'Daily meeting',
                    startDate: '2019-03-01T09:00:00+01:00',
                    endDate: '2019-03-01T12:00:00+01:00',
                    recurrenceRule: 'FREQ=DAILY',
                    startDateTimeZone: 'Europe/Paris',
                    endDateTimeZone: 'Europe/Paris'
                }
            ],
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2019, 2, 10), // NOTE: DST Montreal, STD Paris
            startDayHour: 0,
            height: 600,
            timeZone: 'America/Montreal',
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx',
            editing: { legacyForm: true }
        });

        let startDateEditor;
        let endDateEditor;
        let clock;

        clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
        assert.equal(scheduler.tooltip.getDateText(), '4:00 AM - 7:00 AM', 'Dates and time were displayed correctly after time changing in custom timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        await waitAsync(0);
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '3/10/2019, 9:00 AM', 'Start Date is displayed correctly in appointment popup form after time changing in custom timezone');
        assert.equal(endDateEditor.option('text'), '3/10/2019, 12:00 PM', 'End Date is displayed correctly in appointment popup form after time changing in custom timezone');
        scheduler.appointmentPopup.clickCancelButton();

        scheduler.instance.option('currentDate', new Date(2019, 2, 31)); // NOTE: DST Paris
        await waitAsync(0);

        clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
        assert.equal(scheduler.tooltip.getDateText(), '3:00 AM - 6:00 AM', 'Dates and time were displayed correctly in tooltip after time changing in appointment timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        await waitAsync(0);
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '3/31/2019, 9:00 AM', 'Start Date is displayed correctly in appointment popup form after time changing in appointment timezone');
        assert.equal(endDateEditor.option('text'), '3/31/2019, 12:00 PM', 'End Date is displayed correctly in appointment popup form after time changing in appointment timezone');
        scheduler.appointmentPopup.clickCancelButton();
    });

    QUnit.test('Recurrence appt part at the time of DST-end should have correct tooltip and popup if recurrence starts in DST and ends in STD in custom timezone, appointment timezone is set (T804886)', async function(assert) {
        // NOTE: The daylight saving changed backward in Montreal on 03.11.2019 and in Paris on 27.10.2019
        const scheduler = await createWrapper({
            dataSource: [
                {
                    text: 'Daily meeting',
                    startDate: '2019-03-01T09:00:00+01:00',
                    endDate: '2019-03-01T12:00:00+01:00',
                    recurrenceRule: 'FREQ=DAILY',
                    startDateTimeZone: 'Europe/Paris',
                    endDateTimeZone: 'Europe/Paris'
                }
            ],
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2019, 9, 27), // NOTE: DST Montreal, STD Paris
            startDayHour: 0,
            height: 600,
            timeZone: 'America/Montreal',
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx',
            editing: { legacyForm: true }
        });

        let startDateEditor;
        let endDateEditor;
        let clock;

        clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
        assert.equal(scheduler.tooltip.getDateText(), '4:00 AM - 7:00 AM', 'Dates and time were displayed correctly after time changing in custom timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        await waitAsync(0);
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '10/27/2019, 9:00 AM', 'Start Date is displayed correctly in appointment popup form after time changing in custom timezone');
        assert.equal(endDateEditor.option('text'), '10/27/2019, 12:00 PM', 'End Date is displayed correctly in appointment popup form after time changing in custom timezone');
        scheduler.appointmentPopup.clickCancelButton();

        scheduler.instance.option('currentDate', new Date(2019, 10, 3)); // NOTE: STD Montreal, STD Paris
        await waitAsync(0);

        clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
        assert.equal(scheduler.tooltip.getDateText(), '3:00 AM - 6:00 AM', 'Dates and time were displayed correctly in tooltip after time changing in appointment timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        await waitAsync(0);
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '11/3/2019, 9:00 AM', 'Start Date is displayed correctly in appointment popup form after time changing in appointment timezone');
        assert.equal(endDateEditor.option('text'), '11/3/2019, 12:00 PM', 'End Date is displayed correctly in appointment popup form after time changing in appointment timezone');
        scheduler.appointmentPopup.clickCancelButton();
    });
});

QUnit.module('Appointments with DST/STD cases', moduleConfig, () => {
    const getDeltaTz = (schedulerTz, date) => schedulerTz * toMs('hour') + date.getTimezoneOffset() * toMs('minute');

    QUnit.test('Appointment wich started in DST and ended in STD time should have correct start & end dates', async function(assert) {
        const startDate = new Date(1541311200000);
        const endDate = new Date(1541319000000);

        const scheduler = await createWrapper({
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

    QUnit.test('Appointment wich started in STD and ended in DST time should have correct start & end dates', async function(assert) {
        const startDate = new Date(1520748000000);
        const endDate = new Date(1520751600000);

        const scheduler = await createWrapper({
            currentDate: new Date(2018, 2, 11),
            views: ['timelineDay'],
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

    QUnit.test('Second recurring appointment wich started in STD and ended in DST time should have correct start & end dates & position', async function(assert) {
        const startDate = new Date(1520748000000);
        const endDate = new Date(1520751600000);

        const scheduler = await createWrapper({
            currentDate: new Date(2018, 2, 12),
            views: ['timelineDay'],
            currentView: 'timelineDay',
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

    // NOTE: Timezone-sensitive test, use US/Pacific for proper testing
    QUnit.test('Appointment which started in DST and ended in STD time should have right width, timeline view', async function(assert) {
        const startDate = new Date(2018, 10, 4, 1);
        const endDate = new Date(2018, 10, 4, 3);
        const currentDate = new Date(2018, 10, 4);

        const scheduler = await createWrapper({
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            cellDuration: 60,
            currentDate: currentDate,
            dataSource: [{
                text: 'DST',
                startDate: startDate,
                endDate: endDate
            }]
        });

        const duration = (endDate - startDate) / toMs('hour');
        const tzDiff = (startDate.getTimezoneOffset() - endDate.getTimezoneOffset()) / 60;

        assert.roughEqual(scheduler.appointments.getAppointment(0).outerWidth(), scheduler.workSpace.getCellWidth() * (duration + tzDiff), 2.001, 'Appt width is correct on the day of the time ajusting');
    });

    QUnit.test('Appointment should be rendered correctly if end date appointment coincided translation on STD', async function(assert) {
        const scheduler = await createWrapper({
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

        assert.roughEqual(scheduler.appointments.getAppointment(0).outerWidth(), scheduler.workSpace.getCellWidth(), 2.001, 'Appointment width is correct after translation from STD');
    });

    QUnit.test('Recurrence exception should not be rendered if exception goes after adjusting AEST-> AEDT (T619455)', async function(assert) {
        const scheduler = await createWrapper({
            dataSource: [{
                text: 'Recruiting students',
                startDate: '2018-03-30T10:00:00+11:00',
                endDate: '2018-03-30T11:00:00+11:00',
                recurrenceRule: 'FREQ=DAILY',
                recurrenceException: '20180401T000000Z',
                startDateTimeZone: 'Australia/Sydney',
                endDateTimeZone: 'Australia/Sydney'
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
        await waitAsync(0);

        assert.equal(scheduler.appointments.getAppointmentCount(), 0, 'Appointment was deleted');
    });

    QUnit.test('Recurrence exception should be adjusted by appointment timezone after deleting of the single appt', async function(assert) {
        const scheduler = await createWrapper({
            dataSource: [{
                text: 'Recruiting students',
                startDate: new Date(2018, 2, 26, 10, 0),
                endDate: new Date(2018, 2, 26, 11, 0),
                recurrenceRule: 'FREQ=DAILY',
                startDateTimeZone: 'Australia/Canberra',
                endDateTimeZone: 'Australia/Canberra'
            }],
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2018, 3, 1),
            recurrenceEditMode: 'occurrence'
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
        scheduler.tooltip.clickOnDeleteButton();

        assert.equal(scheduler.appointments.getAppointmentCount(), 0, 'Appointment was deleted');
    });
});
