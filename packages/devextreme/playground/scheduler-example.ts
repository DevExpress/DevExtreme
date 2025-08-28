import $ from 'jquery';
import Scheduler from '../js/__internal/scheduler/m_scheduler';
import 'devextreme/dist/css/dx.light.css';

const dataSource = [
    {
        text: "Meeting with John",
        startDate: new Date(2024, 0, 10, 9, 0),
        endDate: new Date(2024, 0, 10, 10, 30),
        allDay: false
    },
    {
        text: "Conference Call", 
        startDate: new Date(2024, 0, 10, 14, 0),
        endDate: new Date(2024, 0, 10, 15, 0),
        allDay: false
    },
    {
        text: "Team Building Event",
        startDate: new Date(2024, 0, 11, 10, 0),
        endDate: new Date(2024, 0, 11, 17, 0),
        allDay: false
    }
];

$(document).ready(() => {
    new (Scheduler as any)($('#container'), {
        dataSource,
        views: ['day', 'week', 'workWeek', 'month'],
        currentView: 'week',
        currentDate: new Date(2024, 0, 10),
        startDayHour: 8,
        endDayHour: 18,
        height: 600,
        editing: {
            allowAdding: true,
            allowDeleting: true,
            allowUpdating: true,
            allowResizing: true,
            allowDragging: true
        },
        onAppointmentAdded: (e) => {
            console.log('Appointment added:', e.appointmentData);
        },
        onAppointmentUpdated: (e) => {
            console.log('Appointment updated:', e.appointmentData);
        },
        onAppointmentDeleted: (e) => {
            console.log('Appointment deleted:', e.appointmentData);
        }
    });

    console.log('Scheduler initialized with HMR support');
});
