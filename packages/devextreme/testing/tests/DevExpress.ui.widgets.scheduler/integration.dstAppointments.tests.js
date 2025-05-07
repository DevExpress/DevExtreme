import { initTestMarkup, createWrapper } from '../../helpers/scheduler/helpers.js';
import dateLocalization from 'common/core/localization/date';
import fx from 'common/core/animation/fx';
import { dateToMilliseconds as toMs } from 'core/utils/date';
import timeZoneUtils from '__internal/scheduler/m_utils_time_zone';
import '__internal/scheduler/m_scheduler';

import 'generic_light.css!';
import devices from '__internal/core/m_devices';

QUnit.testStart(() => initTestMarkup());
const isDeviceDesktop = function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'skip this test on mobile devices');
        return false;
    }
    return true;
};

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

QUnit.skip('DST/STD for recurrence appointments, T804886 and T856624', moduleConfig, () => {
    QUnit.test('Any recurrence appt part should be rendered correctly if recurrence starts in STD and ends in DST in custom timezone, appointment timezone is set (T804886)', function(assert) {
        // NOTE: The daylight saving changed in Montreal on 10.03.2019 and in Paris on 31.03.2019
        const scheduler = createWrapper({
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
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx'
        });

        let targetCell = scheduler.workSpace.getCell(6);
        let appointment = scheduler.appointments.getAppointment(0);

        assert.equal(appointment.position().top, targetCell.position().top, 'Recurrence appointment part is rendered in right cell');
        assert.equal(appointment.outerHeight(), targetCell.outerHeight() * 6, 'Recurrence appointment part has right size');
        assert.equal(scheduler.appointments.getDateText(0), '3:00 AM - 6:00 AM', 'Dates and time were displayed correctly in appointment before time changing in custom timezone');

        scheduler.instance.option('currentDate', new Date(2019, 2, 14)); // NOTE: DST Montreal, STD Paris

        targetCell = scheduler.workSpace.getCell(8);
        appointment = scheduler.appointments.getAppointment(0);

        assert.equal(appointment.position().top, targetCell.position().top, 'Recurrence appointment part is rendered in right cell');
        assert.equal(appointment.outerHeight(), targetCell.outerHeight() * 6, 'Recurrence appointment part has right size');
        assert.equal(scheduler.appointments.getDateText(0), '4:00 AM - 7:00 AM', 'Dates and time were displayed correctly in appointment after time changing in custom timezone');

        scheduler.instance.option('currentDate', new Date(2019, 3, 2)); // NOTE: DST Paris

        targetCell = scheduler.workSpace.getCell(6);
        appointment = scheduler.appointments.getAppointment(0);

        assert.equal(appointment.position().top, targetCell.position().top, 'Recurrence appointment part is rendered in right cell');
        assert.equal(appointment.outerHeight(), targetCell.outerHeight() * 6, 'Recurrence appointment part has right size');
        assert.equal(scheduler.appointments.getDateText(0), '3:00 AM - 6:00 AM', 'Dates and time were displayed correctly in appointment after time changing in appointment timezone');
    });

    QUnit.test('Any recurrence appt part should have correct tooltip and popup if recurrence starts in STD and ends in DST in custom timezone, appointment timezone is set (T804886)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }
        // NOTE: The daylight saving changed in Montreal on 10.03.2019 and in Paris on 31.03.2019
        const scheduler = createWrapper({
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
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx'
        });

        let startDateEditor;
        let endDateEditor;

        scheduler.appointments.click(0);
        assert.equal(scheduler.tooltip.getDateText(), '3:00 AM - 6:00 AM', 'Dates and time were displayed correctly in tooltip before time changing in custom timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '3/1/2019, 3:00 AM', 'Start Date is displayed correctly in appointment popup form before time changing in custom timezone');
        assert.equal(endDateEditor.option('text'), '3/1/2019, 6:00 AM', 'End Date is displayed correctly in appointment popup form before time changing in custom timezone');
        scheduler.appointmentPopup.clickCancelButton();

        scheduler.instance.option('currentDate', new Date(2019, 2, 14)); // NOTE: DST Montreal, STD Paris

        scheduler.appointments.click(0);
        assert.equal(scheduler.tooltip.getDateText(), '4:00 AM - 7:00 AM', 'Dates and time were displayed correctly in tooltip after time changing in custom timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '3/14/2019, 4:00 AM', 'Start Date is displayed correctly in appointment popup form before time changing in custom timezone');
        assert.equal(endDateEditor.option('text'), '3/14/2019, 7:00 AM', 'End Date is displayed correctly in appointment popup form before time changing in custom timezone');
        scheduler.appointmentPopup.clickCancelButton();

        scheduler.instance.option('currentDate', new Date(2019, 3, 2)); // NOTE: DST Paris

        scheduler.appointments.click(0);
        assert.equal(scheduler.tooltip.getDateText(), '3:00 AM - 6:00 AM', 'Dates and time were displayed correctly in tooltip after time changing in appointment timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '4/2/2019, 3:00 AM', 'Start Date is displayed correctly in appointment popup form before time changing in custom timezone');
        assert.equal(endDateEditor.option('text'), '4/2/2019, 6:00 AM', 'End Date is displayed correctly in appointment popup form before time changing in custom timezone');
    });

    QUnit.test('Recurrence appt part at the time of DST should be rendered correctly if recurrence starts in STD and ends in DST in custom timezone, appointment timezone is set (T804886)', function(assert) {
        // NOTE: The daylight saving changed in Montreal on 10.03.2019 and in Paris on 31.03.2019
        const scheduler = createWrapper({
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
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx'
        });

        let targetCell = scheduler.workSpace.getCell(8);
        let appointment = scheduler.appointments.getAppointment(0);

        assert.equal(appointment.position().top, targetCell.position().top, 'Recurrence appointment part is rendered in right cell');
        assert.equal(appointment.outerHeight(), targetCell.outerHeight() * 6, 'Recurrence appointment part has right size');
        assert.equal(scheduler.appointments.getDateText(0), '4:00 AM - 7:00 AM', 'Dates and time were displayed correctly in appointment after time changing in custom timezone');

        scheduler.instance.option('currentDate', new Date(2019, 2, 31)); // NOTE: DST Paris

        targetCell = scheduler.workSpace.getCell(6);
        appointment = scheduler.appointments.getAppointment(0);

        assert.equal(appointment.position().top, targetCell.position().top, 'Recurrence appointment part is rendered in right cell');
        assert.equal(appointment.outerHeight(), targetCell.outerHeight() * 6, 'Recurrence appointment part has right size');
        assert.equal(scheduler.appointments.getDateText(0), '3:00 AM - 6:00 AM', 'Dates and time were displayed correctly in appointment after time changing in appointment timezone');

        scheduler.appointments.click(0);

        assert.equal(scheduler.tooltip.getDateText(), '3:00 AM - 6:00 AM', 'Dates and time were displayed correctly in tooltip after time changing in appointment timezone');
    });

    QUnit.test('Recurrence appt part at the time of DST should have correct tooltip and popup if recurrence starts in STD and ends in DST in custom timezone, appointment timezone is set (T804886)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        // NOTE: The daylight saving changed in Montreal on 10.03.2019 and in Paris on 31.03.2019
        const scheduler = createWrapper({
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
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx'
        });

        let startDateEditor;
        let endDateEditor;

        scheduler.appointments.click(0);
        assert.equal(scheduler.tooltip.getDateText(), '4:00 AM - 7:00 AM', 'Dates and time were displayed correctly after time changing in custom timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '3/10/2019, 4:00 AM', 'Start Date is displayed correctly in appointment popup form after time changing in custom timezone');
        assert.equal(endDateEditor.option('text'), '3/10/2019, 7:00 AM', 'End Date is displayed correctly in appointment popup form after time changing in custom timezone');
        scheduler.appointmentPopup.clickCancelButton();

        scheduler.instance.option('currentDate', new Date(2019, 2, 31)); // NOTE: DST Paris

        scheduler.appointments.click(0);
        assert.equal(scheduler.tooltip.getDateText(), '3:00 AM - 6:00 AM', 'Dates and time were displayed correctly in tooltip after time changing in appointment timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '3/31/2019, 3:00 AM', 'Start Date is displayed correctly in appointment popup form before time changing in appointment timezone');
        assert.equal(endDateEditor.option('text'), '3/31/2019, 6:00 AM', 'End Date is displayed correctly in appointment popup form before time changing in appointment timezone');
        scheduler.appointmentPopup.clickCancelButton();
    });

    QUnit.test('Recurrence appt part should be rendered correctly if recurrence starts in STD and ends in DST in custom timezone', function(assert) {
        // NOTE: The daylight saving changed in Montreal on 10.03.2019
        const scheduler = createWrapper({
            dataSource: [
                {
                    text: 'Daily meeting',
                    startDate: '2019-03-01T09:00:00+01:00',
                    endDate: '2019-03-01T12:00:00+01:00',
                    recurrenceRule: 'FREQ=DAILY'
                }
            ],
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2019, 2, 5), // NOTE: STD Montreal
            startDayHour: 0,
            height: 600,
            timeZone: 'America/Montreal',
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx'
        });

        let targetCell = scheduler.workSpace.getCell(6);
        let appointment = scheduler.appointments.getAppointment(0);

        assert.equal(appointment.position().top, targetCell.position().top, 'Recurrence appointment part is rendered in right cell');
        assert.equal(appointment.outerHeight(), targetCell.outerHeight() * 6, 'Recurrence appointment part has right size');

        scheduler.instance.option('currentDate', new Date(2019, 3, 1)); // NOTE: DST Montreal

        targetCell = scheduler.workSpace.getCell(6);
        appointment = scheduler.appointments.getAppointment(0);

        assert.equal(appointment.position().top, targetCell.position().top, 'Recurrence appointment part is rendered in right cell');
        assert.equal(appointment.outerHeight(), targetCell.outerHeight() * 6, 'Recurrence appointment part has right size');
    });

    QUnit.test('Recurrence appt part should be rendered correctly if recurrence starts in STD and ends in DST, appointment timezone is set', function(assert) {
        // NOTE: The daylight saving changed in Paris on 31.03.2019
        const scheduler = createWrapper({
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
            currentDate: new Date(2019, 2, 30), // NOTE: STD Paris
            startDayHour: 0,
            height: 600,
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx'
        });

        const appointmentPosition = scheduler.appointments.getAppointment(0).position().top;

        scheduler.instance.option('currentDate', new Date(2019, 3, 1)); // NOTE: DST Paris

        const appointment = scheduler.appointments.getAppointment(0);
        assert.equal(appointment.position().top, appointmentPosition, 'Recurrence appointment part positions are the same and independent of time changing');
    });

    QUnit.test('Recurrence appt part at the time of DST-end should be rendered correctly if recurrence starts in DST and ends in STD in custom timezone, appointment timezone is set (T804886)', function(assert) {
        // NOTE: The daylight saving changed backward in Montreal on 03.11.2019 and in Paris on 27.10.2019
        const scheduler = createWrapper({
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
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx'
        });

        let targetCell = scheduler.workSpace.getCell(8);
        let appointment = scheduler.appointments.getAppointment(0);

        assert.equal(appointment.position().top, targetCell.position().top, 'Recurrence appointment part is rendered in right cell');
        assert.equal(appointment.outerHeight(), targetCell.outerHeight() * 6, 'Recurrence appointment part has right size');
        assert.equal(scheduler.appointments.getDateText(0), '4:00 AM - 7:00 AM', 'Dates and time were displayed correctly in appointment after time changing in custom timezone');

        scheduler.instance.option('currentDate', new Date(2019, 10, 3)); // NOTE: STD Montreal, STD Paris

        targetCell = scheduler.workSpace.getCell(6);
        appointment = scheduler.appointments.getAppointment(0);

        assert.equal(appointment.position().top, targetCell.position().top, 'Recurrence appointment part is rendered in right cell');
        assert.equal(appointment.outerHeight(), targetCell.outerHeight() * 6, 'Recurrence appointment part has right size');
        assert.equal(scheduler.appointments.getDateText(0), '3:00 AM - 6:00 AM', 'Dates and time were displayed correctly in appointment after time changing in appointment timezone');
    });

    QUnit.test('Recurrence appt part at the time of DST-end should have correct tooltip and popup if recurrence starts in DST and ends in STD in custom timezone, appointment timezone is set (T804886)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        // NOTE: The daylight saving changed backward in Montreal on 03.11.2019 and in Paris on 27.10.2019
        const scheduler = createWrapper({
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
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx'
        });

        let startDateEditor;
        let endDateEditor;

        scheduler.appointments.click(0);
        assert.equal(scheduler.tooltip.getDateText(), '4:00 AM - 7:00 AM', 'Dates and time were displayed correctly after time changing in custom timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '10/27/2019, 4:00 AM', 'Start Date is displayed correctly in appointment popup form after time changing in custom timezone');
        assert.equal(endDateEditor.option('text'), '10/27/2019, 7:00 AM', 'End Date is displayed correctly in appointment popup form after time changing in custom timezone');
        scheduler.appointmentPopup.clickCancelButton();

        scheduler.instance.option('currentDate', new Date(2019, 10, 3)); // NOTE: STD Montreal, STD Paris

        scheduler.appointments.click(0);
        assert.equal(scheduler.tooltip.getDateText(), '3:00 AM - 6:00 AM', 'Dates and time were displayed correctly in tooltip after time changing in appointment timezone');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
        startDateEditor = scheduler.appointmentForm.getEditor('startDate');
        endDateEditor = scheduler.appointmentForm.getEditor('endDate');
        assert.equal(startDateEditor.option('text'), '11/3/2019, 3:00 AM', 'Start Date is displayed correctly in appointment popup form before time changing in appointment timezone');
        assert.equal(endDateEditor.option('text'), '11/3/2019, 6:00 AM', 'End Date is displayed correctly in appointment popup form before time changing in appointment timezone');
        scheduler.appointmentPopup.clickCancelButton();
    });

    QUnit.test('Scheduler - Fix - Recurrent appointment settings generator should consider daylight saving time (T985142)', function(assert) {
        // NOTE: The daylight saving changed in Pacific/Tahiti on 28.03.2021
        let scheduler;
        try {
            scheduler = createWrapper({
                dataSource: [{
                    startDate: '2021-03-28T10:00:00.000Z',
                    endDate: '2021-03-29T10:00:00.000Z',
                    startDateTimeZone: 'Europe/Paris',
                    endDateTimeZone: 'Europe/Paris',
                    recurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=1'
                }],
                views: ['day'],
                currentView: 'day',
                currentDate: new Date(2021, 2, 27),
                height: 600,
                timeZone: 'Pacific/Tahiti'
            });

            assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'Appoitment count is correct');

            const appointmentSettings = scheduler.instance.getAppointmentsInstance().option('items')[0];

            assert.deepEqual({
                appointment: {
                    startDate: new Date('2021-03-27T22:00:00.000Z'),
                    endDate: new Date('2021-03-28T22:00:00.000Z'),
                    source: {
                        startDate: new Date('2021-03-28T10:00:00.000Z'),
                        endDate: new Date('2021-03-29T10:00:00.000Z')
                    }
                },
                sourceAppointment: {
                    startDate: new Date('2021-03-28T10:00:00.000Z'),
                    endDate: new Date('2021-03-29T10:00:00.000Z')
                }
            },
            appointmentSettings.settings[0].info,
            'Appoitment settings is correct');
        } catch(e) {
            assert.ok(false, e.Message);
        }
    });
});

QUnit.skip('Appointments with DST/STD cases', moduleConfig, () => {
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
    QUnit.test('Appointment which started in DST and ended in STD time should have right width, timeline view', function(assert) {
        const startDate = new Date(2018, 10, 4, 1);
        const endDate = new Date(2018, 10, 4, 3);
        const currentDate = new Date(2018, 10, 4);

        const scheduler = createWrapper({
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

    QUnit.test('Second recurring appointment should have right width if previous appt started in STD and ended in DST, timeline view', function(assert) {
        const startDate = new Date(1520758800000);
        const endDate = new Date(1520762400000);
        const currentDate = new Date(2018, 2, 12);

        const scheduler = createWrapper({
            currentDate: currentDate,
            views: ['timelineDay'],
            currentView: 'timelineDay',
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

    QUnit.test('Appointment should be rendered correctly if end date appointment coincided translation on STD', function(assert) {
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

        assert.roughEqual(scheduler.appointments.getAppointment(0).outerWidth(), scheduler.workSpace.getCellWidth(), 2.001, 'Appointment width is correct after translation from STD');
    });

    QUnit.test('Recurrence exception should not be rendered if exception goes after adjusting AEST-> AEDT (T619455)', function(assert) {
        const tzOffsetStub = sinon.stub(timeZoneUtils, 'getClientTimezoneOffset').returns(-39600000);
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

    QUnit.test('Recurrence exception should be adjusted by scheduler timezone after deleting of the single appt', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'Recruiting students',
                startDate: new Date(2018, 2, 26, 10, 0),
                endDate: new Date(2018, 2, 26, 11, 0),
                recurrenceRule: 'FREQ=DAILY'
            }],
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2018, 3, 1),
            timeZone: 'Australia/Sydney',
            recurrenceEditMode: 'occurrence'
        });

        scheduler.appointments.click();
        this.clock.tick(300);
        scheduler.tooltip.clickOnDeleteButton();

        assert.equal(scheduler.appointments.getAppointmentCount(), 0, 'Appointment was deleted');
    });

    QUnit.test('Recurrence exception should be adjusted by appointment timezone after deleting of the single appt', function(assert) {
        const scheduler = createWrapper({
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

        scheduler.appointments.click();
        this.clock.tick(300);
        scheduler.tooltip.clickOnDeleteButton();

        assert.equal(scheduler.appointments.getAppointmentCount(), 0, 'Appointment was deleted');
    });
});
