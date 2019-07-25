import { ClientFunction } from 'testcafe';

import { getContainerFileUrl } from '../../../helpers/testHelper';

import { Appointment } from './lib/helper';
import { createScheduler, scheduler } from './lib/widget.setup';
import { pinkData, blueData } from './lib/appointments.data';


fixture
    `Behaviour dragging between table rows in DayView-mode`
    .page(getContainerFileUrl());

// const compare = async (t, element, row, received, expected) => {
//     await t
//         .dragToElement(element, await scheduler.getDateTableRow(step))
//         .expect(await expected)
//         .eql(await received,
//             `Incorrect [${element}] at row ${step} height`);
// }

test('Appointments should be replaced on the timeline in DayView mode with maintaining their size and duration', async t => {
    for (let id = 0; id < 5; id++) {

        // appointmentwrapper
        const pink = await new Appointment(pinkData, id);
        const blue = await new Appointment(blueData, id);

        // console.log(pink); return;

        for (let step = 0; step < 6; step++) {

            await t
                .dragToElement(pink.element, await scheduler.getDateTableRow(pink.row(step)))
                .dragToElement(blue.element, await scheduler.getDateTableRow(blue.row(step)));

            await t
                .expect(await pink.appointment.height.received)
                .eql(pink.appointment.height.expected,
                    `Incorrect [${pink.appointment.title}] at row ${pink.row(step)} height`)

                .expect(await pink.runTime.expected())
                .eql(await pink.runTime.received(step),
                    `Incorrect [${pink.appointment.title}] at row ${pink.row(step)} begin time`)

                .expect(await pink.endTime.expected())
                .eql(await pink.endTime.received(step),
                    `Incorrect [${pink.appointment.title}] at row ${pink.row(step)} final time`)
                // result
                .expect(await blue.appointment.height.received)
                .eql(blue.appointment.height.expected,
                    `Incorrect [${blue.appointment.title}] at row ${blue.row(step)} height`)

                .expect(await blue.runTime.expected())
                .eql(await blue.runTime.received(step),
                    `Incorrect [${blue.appointment.title}] at row ${blue.row(step)} begin time`)

                .expect(await blue.endTime.expected())
                .eql(await blue.endTime.received(step),
                    `Incorrect [${blue.appointment.title}] at row ${blue.row(step)} final time`);
        }
    }
}).before(async () => { await createScheduler('day') });
