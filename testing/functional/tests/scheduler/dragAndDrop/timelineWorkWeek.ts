import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import { TablePosition, Feature, Size, TimeSpan } from './helpers/appointment.helper';
import { AppointmentModel } from './helpers/appointment.model';

fixture`Rearrange appointments in the Scheduler widget with the drag-and-drop gesture`
    .page(getContainerFileUrl());

test('Drag-and-drop appointments in timelineWorkWeek', async t => {
    let appointment;
    let appointmentPosition;

    const forComparsion = [
        Feature.width,
        Feature.height,
        Feature.startTime,
        Feature.endTime
    ];

    appointmentPosition = new TablePosition(0, 1);
    appointment = new AppointmentModel('Appointment #1',
        {
            position: appointmentPosition,
            size: new Size('200px', '132px'),
            duration: new TimeSpan('9:30 AM', '10:00 AM')
        });

    await appointment.dropTo(t, appointmentPosition);
    await appointment.compare(t, forComparsion);

    appointmentPosition = new TablePosition(0, 3);
    appointment = new AppointmentModel('Appointment #1',
        {
            position: appointmentPosition,
            size: new Size('200px', '132px'),
            duration: new TimeSpan('10:30 AM', '11:00 AM')
        });

    await appointment.dropTo(t, appointmentPosition);
    await appointment.compare(t, forComparsion);

    appointmentPosition = new TablePosition(0, 1);
    appointment = new AppointmentModel('Appointment #2',
        {
            position: appointmentPosition,
            size: new Size('400px', '132px'),
            duration: new TimeSpan('9:30 AM', '10:30 AM')
        });

    await appointment.dropTo(t, appointmentPosition);
    await appointment.compare(t, forComparsion);

    appointmentPosition = new TablePosition(0, 3);
    appointment = new AppointmentModel('Appointment #2',
        {
            position: appointmentPosition,
            size: new Size('400px', '132px'),
            duration: new TimeSpan('10:30 AM', '11:30 AM')
        });

    await appointment.dropTo(t, appointmentPosition);
    await appointment.compare(t, forComparsion);

    appointmentPosition = new TablePosition(0, 1);
    appointment = new AppointmentModel('Appointment #3',
        {
            position: appointmentPosition,
            size: new Size('600px', '132px'),
            duration: new TimeSpan('9:30 AM', '11:00 AM')
        });

    await appointment.dropTo(t, appointmentPosition);
    await appointment.compare(t, forComparsion);

    appointmentPosition = new TablePosition(0, 3);
    appointment = new AppointmentModel('Appointment #3',
        {
            position: appointmentPosition,
            size: new Size('600px', '132px'),
            duration: new TimeSpan('10:30 AM', '12:00 PM')
        });

    await appointment.dropTo(t, appointmentPosition);
    await appointment.compare(t, forComparsion);

    appointmentPosition = new TablePosition(0, 1);
    appointment = new AppointmentModel('Appointment #2',
        {
            position: appointmentPosition,
            size: new Size('400px', '132px'),
            duration: new TimeSpan('9:30 AM', '10:30 AM')
        });

    await appointment.dropTo(t, appointmentPosition);
    await appointment.compare(t, forComparsion);

    appointmentPosition = new TablePosition(0, 0);
    appointment = new AppointmentModel('Appointment #1',
        {
            position: appointmentPosition,
            size: new Size('200px', '132px'),
            duration: new TimeSpan('9:00 AM', '9:30 AM')
        });

    await appointment.dropTo(t, appointmentPosition);
    await appointment.compare(t, forComparsion);


}).before(async () => { await createScheduler('timelineWorkWeek', dataSource) });
