import { ClientFunction } from 'testcafe';

import { getContainerFileUrl } from '../../../helpers/testHelper';

import { Appointment } from './lib/helper';
import { pinkData, blueData } from './lib/appointments.data';
import { createScheduler, scheduler } from './lib/widget.setup';


fixture
    `Behaviour dragging between table rows in DayView-mode`
    .page(getContainerFileUrl());

test('Appointments should be replaced on the timeline in DayView mode with maintaining their size and duration', async t => {
    for (let id = 0; id < 5; id++) {

        const pink = await new Appointment(pinkData, id);
        const blue = await new Appointment(blueData, id);

        for (let step = 0; step < 6; step++) {
            await t
                .dragToElement(pink.element, await scheduler.getDateTableRow(pink.movementMap[step].row))
                .dragToElement(blue.element, await scheduler.getDateTableRow(blue.movementMap[step].row));

            await t
                .expect(await pink.appointment.height.received).eql(pink.appointment.height.expected)
                .expect(await blue.appointment.height.received).eql(blue.appointment.height.expected);
        }
    }
}).before(async () => { await createScheduler('day') });
