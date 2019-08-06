import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import { TablePosition, Feature, Size, TimeSpan } from './helpers/appointment.helper';
import { AppointmentModel } from './helpers/appointment.model';

fixture`Rearrange appointments in the Scheduler widget with the drag-and-drop gesture`
    .page(getContainerFileUrl());

test('Drag-and-drop appointments in month', async t => {
    let appointment;
    let appointmentPosition;

    const forComparsion = [
        Feature.height,
        Feature.startTime,
        Feature.endTime
    ];

    appointmentPosition = new TablePosition(0, 3);
    appointment = new AppointmentModel('Appointment #1',
        {
            position: appointmentPosition,
            size: new Size('auto', '19px'),
            duration: new TimeSpan('9:00 AM', '9:30 AM')
        });

    await appointment.dropTo(t, appointmentPosition);
    await appointment.compare(t, forComparsion);

    appointmentPosition = new TablePosition(0, 3);
    appointment = new AppointmentModel('Appointment #2',
        {
            position: appointmentPosition,
            size: new Size('auto', '19px'),
            duration: new TimeSpan('9:00 AM', '10:00 AM')
        });

    await appointment.dropTo(t, appointmentPosition);
    await appointment.compare(t, forComparsion);

    appointmentPosition = new TablePosition(0, 3);
    appointment = new AppointmentModel('Appointment #3',
        {
            position: appointmentPosition,
            size: new Size('auto', '19px'),
            duration: new TimeSpan('9:00 AM', '10:30 AM')
        });

    await appointment.dropTo(t, appointmentPosition);
    await appointment.compare(t, forComparsion);

}).before(async () => { await createScheduler('month', dataSource) });
