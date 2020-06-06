import { dataSource } from './init/widget.data';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture `Drag-and-drop appointments in the Scheduler basic views`
    .page(url(__dirname, '../../container.html'));

['day', 'week', 'workWeek'].forEach(view => test(`Drag-n-drop in the "${view}" view`, async t => {
    const scheduler = new Scheduler('#container');
    const draggableAppointment = scheduler.getAppointment('Brochure Design Review');

    await t
        .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(4, 0))
        .expect(draggableAppointment.size.height).eql('50px')
        .expect(draggableAppointment.date.time).eql('11:00 AM - 11:30 AM');

}).before(() => createScheduler({
    views: [view],
    currentView: view,
    dataSource: dataSource
})));

test('Drag-n-drop in the "month" view', async t => {
    const scheduler = new Scheduler('#container');
    const draggableAppointment = scheduler.getAppointment('Brochure Design Review');

    await t
        .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 4))
        .expect(draggableAppointment.size.height).eql('19px')
        .expect(draggableAppointment.date.time).eql('9:00 AM - 9:30 AM');

}).before(() => createScheduler({
    views: ['month'],
    currentView: 'month',
    dataSource: dataSource
}));

test('Drag recurrent appointment occurrence from collector (T832887)', async t => {
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Recurrence two');
    const collector = scheduler.getAppointmentCollector('2');
    const appointmentTooltip = scheduler.appointmentTooltip;
    const appointmentTooltipItem = appointmentTooltip.getListItem('Recurrence two');
    const popup = Scheduler.getDialog();

    await t
        .click(collector.element)
        .expect(appointmentTooltip.isVisible()).ok()
        .dragToElement(appointmentTooltipItem.element, scheduler.getDateTableCell(2, 2))
        .expect(appointmentTooltipItem.element.exists).notOk()
        .click(popup.appointment)
        .expect(appointment.element.exists).ok()
        .expect(appointment.date.time).eql('5:00 AM - 7:00 AM')
        .expect(collector.element.exists).notOk();

}).before(() => createScheduler({
    views: ['week'],
    currentView: 'week',
    firstDayOfWeek: 2,
    startDayHour: 4,
    maxAppointmentsPerCell: 1,
    dataSource: [{
        text: 'Recurrence one',
        startDate: new Date(2019, 2, 26, 8, 0),
        endDate: new Date(2019, 2, 26, 10, 0),
        recurrenceException: '',
        recurrenceRule: 'FREQ=DAILY'
    }, {
        text: 'Non-recurrent appointment',
        startDate: new Date(2019, 2, 26, 7, 0),
        endDate: new Date(2019, 2, 26, 11, 0),
    }, {
        text: 'Recurrence two',
        startDate: new Date(2019, 2, 26, 8, 0),
        endDate: new Date(2019, 2, 26, 10, 0),
        recurrenceException: '',
        recurrenceRule: 'FREQ=DAILY'
    }],
    currentDate: new Date(2019, 2, 26),
}));
