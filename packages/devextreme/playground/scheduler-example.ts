import '../js/integration/jquery';
import $ from 'jquery';
import { setupThemeSelector } from './newthemeSelector';

const dataSource = [
    {
        text: "Meeting with John",
        startDate: new Date(2024, 0, 10, 9, 0),
        endDate: new Date(2024, 0, 10, 10, 30),
    },
    {
        text: "Conference Call",
        startDate: new Date(2024, 0, 10, 14, 0),
        endDate: new Date(2024, 0, 10, 15, 0),
    },
    {
        text: "Team Building Event",
        startDate: new Date(2024, 0, 11, 10, 0),
        endDate: new Date(2024, 0, 11, 17, 0),
    },
];

window.addEventListener('load', () =>
  setupThemeSelector('theme-selector').then(() => {
    $('#container').dxScheduler({
        dataSource,
        views: ['day', 'week', 'workWeek', 'month'],
        currentView: 'week',
        currentDate: new Date(2024, 0, 10),
        startDayHour: 8,
        endDayHour: 18,
        height: 600,
    });
}));
