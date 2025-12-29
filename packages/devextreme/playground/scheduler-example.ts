import $ from 'jquery';
import { setupThemeSelector } from './newthemeSelector';
import Scheduler from '../js/__internal/scheduler/m_scheduler';

const dataSource = [
    {
        text: "Monday Meeting",
        startDate: new Date(2025, 11, 29, 9, 0),  // Monday
        endDate: new Date(2025, 11, 29, 10, 30),
        allDay: false
    },
    {
        text: "Tuesday Conference", 
        startDate: new Date(2025, 11, 30, 14, 0),  // Tuesday
        endDate: new Date(2025, 11, 30, 15, 0),
        allDay: false
    },
    {
        text: "Wednesday Team Event",
        startDate: new Date(2025, 11, 31, 10, 0),  // Wednesday
        endDate: new Date(2025, 11, 31, 17, 0),
        allDay: false
    },
    {
        text: "Thursday Planning",
        startDate: new Date(2026, 0, 1, 11, 0),   // Thursday
        endDate: new Date(2026, 0, 1, 12, 0),
        allDay: false
    },
    {
        text: "Friday Presentation",
        startDate: new Date(2026, 0, 2, 15, 0),   // Friday
        endDate: new Date(2026, 0, 2, 16, 30),
        allDay: false
    },
    {
        text: "Saturday Event (Should be hidden)",
        startDate: new Date(2026, 0, 3, 10, 0),   // Saturday
        endDate: new Date(2026, 0, 3, 12, 0),
        allDay: false
    },
    {
        text: "Sunday Event (Should be hidden)",
        startDate: new Date(2026, 0, 4, 14, 0),   // Sunday
        endDate: new Date(2026, 0, 4, 16, 0),
        allDay: false
    },
    {
        text: "Event on 15th (Should be hidden in month view)",
        startDate: new Date(2026, 0, 15, 10, 0),  // January 15th
        endDate: new Date(2026, 0, 15, 12, 0),
        allDay: false
    },
    {
        text: "Event on 13th (Should be hidden in month view)",
        startDate: new Date(2026, 0, 13, 14, 0),
        endDate: new Date(2026, 0, 13, 16, 0),
        allDay: false
    },
    {
        text: "Event on Friday 13th (June)",
        startDate: new Date(2026, 5, 13, 10, 0),
        endDate: new Date(2026, 5, 13, 12, 0),
        allDay: false
    },
    {
        text: "Event on Friday 13th (February)",
        startDate: new Date(2026, 1, 13, 14, 0),
        endDate: new Date(2026, 1, 13, 16, 0),
        allDay: false
    }
];

window.addEventListener('load', () => 
  setupThemeSelector('theme-selector').then(() => {

    console.log('Creating scheduler with views containing skippedDays...');

    const scheduler = new (Scheduler as any)($('#container'), {
        dataSource,
        views: [
            'month',
            { type: 'day' },
            { 
                type: 'week',
                name: 'Week (Hide Weekends)',
                skippedDays: [0, 6]  // Hide Sunday and Saturday
            },
            { 
                type: 'week',
                name: 'Week (Hide Mon & Wed)',
                skippedDays: [1, 3]  // Hide Monday and Wednesday
            },
            { type: 'workWeek' },
            { 
                type: 'month',
                name: 'Month (Hide 13th & 15th)',
                skippedDates: [13, 15]
            },
            {
                type: 'month',
                name: 'Month (Hide Friday 13th)',
                skipDatePredicate: (date) => {
                    return date.getDay() === 5 && date.getDate() === 13;
                }
            },
            { type: 'month' }
        ],
        currentView: 'Month (Hide Friday 13th)',
        currentDate: new Date(2026, 0, 1),
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

    console.log('Scheduler created:', scheduler);
    console.log('Current view:', scheduler.option('currentView'));
}));
