import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture `Resize appointments in the Scheduler basic views`
    .page(url(__dirname, '../../container.html'));

['timelineDay', 'timelineWeek', 'timelineWorkWeek'].forEach(view => test(`Resize in the "${view}" view`, async t => {
    const scheduler = new Scheduler("#container");
    const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

    await t
        .drag(resizableAppointment.resizableHandle.right, 400, 0)
        .expect(resizableAppointment.size.width).eql(`800px`)
        .expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
        .expect(resizableAppointment.date.endTime).eql(`12:00 PM`)

        .drag(resizableAppointment.resizableHandle.left, 400, 0)
        .expect(resizableAppointment.size.width).eql(`400px`)
        .expect(resizableAppointment.date.startTime).eql(`11:00 AM`)
        .expect(resizableAppointment.date.endTime).eql(`12:00 PM`)

        .drag(resizableAppointment.resizableHandle.left, -400, 0)
        .expect(resizableAppointment.size.width).eql(`800px`)
        .expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
        .expect(resizableAppointment.date.endTime).eql(`12:00 PM`)

        .drag(resizableAppointment.resizableHandle.right, -400, 0)
        .expect(resizableAppointment.size.width).eql(`400px`)
        .expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
        .expect(resizableAppointment.date.endTime).eql(`11:00 AM`)

}).before(() => createScheduler({
    views: [view],
    currentView: view,
    dataSource: dataSource
})));

test(`Resize in the "timelineMonth" view`, async t => {
    const scheduler = new Scheduler("#container");
    const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

    await t
        .drag(resizableAppointment.resizableHandle.right, 400, 0)
        .expect(resizableAppointment.size.width).eql(`600px`)
        .expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
        .expect(resizableAppointment.date.endTime).eql(`11:00 AM`)

        .drag(resizableAppointment.resizableHandle.left, 400, 0)
        .expect(resizableAppointment.size.width).eql(`200px`)
        .expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
        .expect(resizableAppointment.date.endTime).eql(`11:00 AM`)

        .drag(resizableAppointment.resizableHandle.left, -400, 0)
        .expect(resizableAppointment.size.width).eql(`600px`)
        .expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
        .expect(resizableAppointment.date.endTime).eql(`11:00 AM`)

        .drag(resizableAppointment.resizableHandle.right, -400, 0)
        .expect(resizableAppointment.size.width).eql(`200px`)
        .expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
        .expect(resizableAppointment.date.endTime).eql(`11:00 AM`);

}).before(() => createScheduler({
    views: ['timelineMonth'],
    currentView: 'timelineMonth',
    dataSource: dataSource
}));

test(`Resize appointment on timelineWeek view with custom startDayHour & endDayHour (T804779)`, async t => {
    const scheduler = new Scheduler("#container");
    const appointment = scheduler.getAppointment('Appointment');

    await t
        .resizeWindow(1400, 800)
        .drag(appointment.resizableHandle.right, -400, 0)
        .expect(appointment.size.width).eql(`200px`)
        .expect(appointment.date.startTime).eql(`2:00 PM`)
        .expect(appointment.date.endTime).eql(`3:00 PM`)

}).before(() => createScheduler({
    views: [{type: 'timelineWeek', startDayHour: 10, endDayHour: 16, cellDuration: 60}],
    currentView: 'timelineWeek',
    currentDate: new Date(2019, 8, 1),
    firstDayOfWeek: 0,
    dataSource: [{
        text: "Appointment",
        startDate: new Date(2019, 8, 1, 14),
        endDate: new Date(2019, 8, 2, 11),
    }]
}));
