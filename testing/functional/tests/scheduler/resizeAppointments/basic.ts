import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture `Resize appointments in the Scheduler basic mode`
	.page(url(__dirname, '../../container.html'));

['day', 'week', 'workWeek'].forEach((mode) => test(`Resize in the "${mode}" mode`, async t => {
	const scheduler = new Scheduler("#container");
	const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

	await t
		.drag(resizableAppointment.resizableHandle.bottom, 0, 100)
		.expect(resizableAppointment.size.height).eql(`200px`)
		.expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
		.expect(resizableAppointment.date.endTime).eql(`12:00 PM`)

		.drag(resizableAppointment.resizableHandle.top, 0, 100)
		.expect(resizableAppointment.size.height).eql(`100px`)
		.expect(resizableAppointment.date.startTime).eql(`11:00 AM`)
		.expect(resizableAppointment.date.endTime).eql(`12:00 PM`)

		.drag(resizableAppointment.resizableHandle.top, 0, -100)
		.expect(resizableAppointment.size.height).eql(`200px`)
		.expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
		.expect(resizableAppointment.date.endTime).eql(`12:00 PM`)

		.drag(resizableAppointment.resizableHandle.bottom, 0, -100)
		.expect(resizableAppointment.size.height).eql(`100px`)
		.expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
		.expect(resizableAppointment.date.endTime).eql(`11:00 AM`);

}).before(() => createScheduler(mode, dataSource)));

test(`Resize in the "month" mode`, async t => {
	const scheduler = new Scheduler("#container");
	const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

	await t
		.drag(resizableAppointment.resizableHandle.right, 100, 0)
		.expect(resizableAppointment.size.width).eql(`400px`)
		.expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
		.expect(resizableAppointment.date.endTime).eql(`11:00 PM`)

		.drag(resizableAppointment.resizableHandle.left, 100, 0)
		.expect(resizableAppointment.size.width).eql(`200px`)
		.expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
		.expect(resizableAppointment.date.endTime).eql(`11:00 PM`)

		.drag(resizableAppointment.resizableHandle.left, -100, 0)
		.expect(resizableAppointment.size.width).eql(`400px`)
		.expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
		.expect(resizableAppointment.date.endTime).eql(`11:00 PM`)

		.drag(resizableAppointment.resizableHandle.left, -100, 0)
		.expect(resizableAppointment.size.width).eql(`200px`)
		.expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
		.expect(resizableAppointment.date.endTime).eql(`11:00 PM`);

}).before(() => createScheduler('month', dataSource));
