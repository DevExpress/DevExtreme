import { ClientFunction } from 'testcafe';

import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import { AppointmentModel, Property } from './helpers/appointment.helper';

import { TablePosition } from './helpers/props/tablePosition';
import { Size } from './helpers/props/size';
import { TimeSpan } from './helpers/props/timeSpan';

import { dropTo, compare } from './helpers/actions.helper';

fixture`Rearrange appointments in the Scheduler widget with the drag-and-drop gesture`
    .page(getContainerFileUrl());

test('Drag-and-drop appointments in workWeek', async t => {
    let appointment;
    const comparsionProperties = [
        Property.height,
        Property.startTime,
        Property.endTime
    ];

    appointment = new AppointmentModel('Appointment #1',
        {
            position: new TablePosition(1, 0),
            size: new Size('auto', '50px'),
            duration: new TimeSpan('9:30 AM', '10:00 AM')
        });

    await dropTo(t, appointment.title, appointment.properties.position);
    await compare(t, appointment.title, appointment.properties, comparsionProperties);

    appointment = new AppointmentModel('Appointment #1',
        {
            position: new TablePosition(3, 0),
            size: new Size('auto', '50px'),
            duration: new TimeSpan('10:30 AM', '11:00 AM')
        });

    await dropTo(t, appointment.title, appointment.properties.position);
    await compare(t, appointment.title, appointment.properties, comparsionProperties);

    appointment = new AppointmentModel('Appointment #2',
        {
            position: new TablePosition(1, 0),
            size: new Size('auto', '100px'),
            duration: new TimeSpan('9:30 AM', '10:30 AM')
        });

    await dropTo(t, appointment.title, appointment.properties.position);
    await compare(t, appointment.title, appointment.properties, comparsionProperties);

    appointment = new AppointmentModel('Appointment #2',
        {
            position: new TablePosition(3, 0),
            size: new Size('auto', '100px'),
            duration: new TimeSpan('10:30 AM', '11:30 AM')
        });

    await dropTo(t, appointment.title, appointment.properties.position);
    await compare(t, appointment.title, appointment.properties, comparsionProperties);

    appointment = new AppointmentModel('Appointment #3',
        {
            position: new TablePosition(1, 0),
            size: new Size('auto', '150px'),
            duration: new TimeSpan('9:30 AM', '11:00 AM')
        });

    await dropTo(t, appointment.title, appointment.properties.position);
    await compare(t, appointment.title, appointment.properties, comparsionProperties);

    appointment = new AppointmentModel('Appointment #3',
        {
            position: new TablePosition(3, 0),
            size: new Size('auto', '150px'),
            duration: new TimeSpan('10:30 AM', '12:00 PM')
        });

    await dropTo(t, appointment.title, appointment.properties.position);
    await compare(t, appointment.title, appointment.properties, comparsionProperties);

    appointment = new AppointmentModel('Appointment #2',
        {
            position: new TablePosition(1, 0),
            size: new Size('auto', '100px'),
            duration: new TimeSpan('9:30 AM', '10:30 AM')
        });

    await dropTo(t, appointment.title, appointment.properties.position);
    await compare(t, appointment.title, appointment.properties, comparsionProperties);

    appointment = new AppointmentModel('Appointment #1',
        {
            position: new TablePosition(0, 0),
            size: new Size('auto', '50px'),
            duration: new TimeSpan('9:00 AM', '9:30 AM')
        });

    await dropTo(t, appointment.title, appointment.properties.position);
    await compare(t, appointment.title, appointment.properties, comparsionProperties);

    appointment = new AppointmentModel('Appointment #2',
        {
            position: new TablePosition(0, 1),
            size: new Size('auto', '100px'),
            duration: new TimeSpan('9:00 AM', '10:00 AM')
        });

    await dropTo(t, appointment.title, appointment.properties.position);
    await compare(t, appointment.title, appointment.properties, comparsionProperties);

    appointment = new AppointmentModel('Appointment #3',
        {
            position: new TablePosition(0, 2),
            size: new Size('auto', '150px'),
            duration: new TimeSpan('9:00 AM', '10:30 AM')
        });

    await dropTo(t, appointment.title, appointment.properties.position);
    await compare(t, appointment.title, appointment.properties, comparsionProperties);

}).before(async () => { await createScheduler('workWeek', dataSource) });
