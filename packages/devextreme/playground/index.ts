import '../js/__internal/integration/jquery';
import $ from 'jquery';
import { setupThemeSelector } from './themeSelector';
import Scheduler from '../js/__internal/scheduler/m_scheduler';

const dataSource = [
    {
        text: 'Meeting',
        startDate: new Date(2024, 0, 10, 9, 0),
        endDate: new Date(2024, 0, 10, 10, 30),
    },
    {
        text: 'Conference Call',
        startDate: new Date(2024, 0, 10, 14, 0),
        endDate: new Date(2024, 0, 10, 15, 0),
    },
    {
        text: 'Team Building',
        startDate: new Date(2024, 0, 11, 10, 0),
        endDate: new Date(2024, 0, 11, 17, 0),
    },
];

window.addEventListener('load', () =>
    setupThemeSelector('theme-selector').then(() => {
        new (Scheduler as any)($('#container'), {
            dataSource,
            views: ['day', 'week', 'workWeek', 'month'],
            currentView: 'week',
            currentDate: new Date(2024, 0, 10),
            startDayHour: 8,
            endDayHour: 18,
            height: 600,
        });
    }));
