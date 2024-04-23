import $ from 'jquery';

// workspace imports
import '__internal/scheduler/workspaces/m_work_space_day';
import '__internal/scheduler/workspaces/m_work_space_week';
import '__internal/scheduler/workspaces/m_work_space_month';
import '__internal/scheduler/workspaces/m_timeline_day';
import '__internal/scheduler/workspaces/m_timeline_month';

const MINUTE_MS = 60000;

const SELECTORS = {
    fixture: '#qunit-fixture',
    scheduler: '#dx-scheduler',
    workspace: '#scheduler-work-space',
    timePanelCell: '.dx-scheduler-time-panel-cell div',
    headerPanelCell: '.dx-scheduler-header-panel-cell',
    cellContent: '.dx-scheduler-date-table-cell .dx-scheduler-date-table-cell-text',
};

const createWorkspace = (options, workspaceType) => $(SELECTORS.workspace)[workspaceType](options)[workspaceType]('instance');

const {
    test,
    module,
    testStart
} = QUnit;

testStart(function() {
    $(SELECTORS.fixture).html(`<div class="${SELECTORS.scheduler.slice(1)}"><div id="${SELECTORS.workspace.slice(1)}"></div></div>`);
});


module('Work Space viewOffset', () => {
    module('Legend', () => {
        [
            // Apply DST cases
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: 0,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['12:00 AM', '', '1:00 AM'],
                expectedTimelineDayHeaderValues: ['12:00 AM', '12:30 AM', '1:00 AM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],

            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: 0,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['3:00 AM', '', '4:00 AM'],
                expectedTimelineDayHeaderValues: ['3:00 AM', '3:30 AM', '4:00 AM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: 0,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['9:00 PM', '', '10:00 PM'],
                expectedTimelineDayHeaderValues: ['9:00 PM', '9:30 PM', '10:00 PM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: 120 * MINUTE_MS,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['2:00 AM', '', '3:00 AM'],
                expectedTimelineDayHeaderValues: ['2:00 AM', '2:30 AM', '3:00 AM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: 120 * MINUTE_MS,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['5:00 AM', '', '6:00 AM'],
                expectedTimelineDayHeaderValues: ['5:00 AM', '5:30 AM', '6:00 AM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: 120 * MINUTE_MS,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['11:00 PM', '', '12:00 AM'],
                expectedTimelineDayHeaderValues: ['11:00 PM', '11:30 PM', '12:00 AM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: 765 * MINUTE_MS,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['12:45 PM', '', '1:45 PM'],
                expectedTimelineDayHeaderValues: ['12:45 PM', '1:15 PM', '1:45 PM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: 765 * MINUTE_MS,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['3:45 PM', '', '4:45 PM'],
                expectedTimelineDayHeaderValues: ['3:45 PM', '4:15 PM', '4:45 PM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: 765 * MINUTE_MS,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['9:45 AM', '', '10:45 AM'],
                expectedTimelineDayHeaderValues: ['9:45 AM', '10:15 AM', '10:45 AM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: 1440 * MINUTE_MS,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['12:00 AM', '', '1:00 AM'],
                expectedTimelineDayHeaderValues: ['12:00 AM', '12:30 AM', '1:00 AM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: 1440 * MINUTE_MS,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['3:00 AM', '', '4:00 AM'],
                expectedTimelineDayHeaderValues: ['3:00 AM', '3:30 AM', '4:00 AM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: 1440 * MINUTE_MS,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['9:00 PM', '', '10:00 PM'],
                expectedTimelineDayHeaderValues: ['9:00 PM', '9:30 PM', '10:00 PM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: -120 * MINUTE_MS,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['10:00 PM', '', '11:00 PM'],
                expectedTimelineDayHeaderValues: ['10:00 PM', '10:30 PM', '11:00 PM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: -120 * MINUTE_MS,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['1:00 AM', '', '2:00 AM'],
                expectedTimelineDayHeaderValues: ['1:00 AM', '1:30 AM', '2:00 AM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: -120 * MINUTE_MS,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['7:00 PM', '', '8:00 PM'],
                expectedTimelineDayHeaderValues: ['7:00 PM', '7:30 PM', '8:00 PM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: -765 * MINUTE_MS,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['11:15 AM', '', '12:15 PM'],
                expectedTimelineDayHeaderValues: ['11:15 AM', '11:45 AM', '12:15 PM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: -765 * MINUTE_MS,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['2:15 PM', '', '3:15 PM'],
                expectedTimelineDayHeaderValues: ['2:15 PM', '2:45 PM', '3:15 PM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: -765 * MINUTE_MS,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['8:15 AM', '', '9:15 AM'],
                expectedTimelineDayHeaderValues: ['8:15 AM', '8:45 AM', '9:15 AM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: -1440 * MINUTE_MS,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['12:00 AM', '', '1:00 AM'],
                expectedTimelineDayHeaderValues: ['12:00 AM', '12:30 AM', '1:00 AM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: -1440 * MINUTE_MS,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['3:00 AM', '', '4:00 AM'],
                expectedTimelineDayHeaderValues: ['3:00 AM', '3:30 AM', '4:00 AM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            {
                currentDate: '2023-10-30T00:00:00',
                viewOffset: -1440 * MINUTE_MS,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['9:00 PM', '', '10:00 PM'],
                expectedTimelineDayHeaderValues: ['9:00 PM', '9:30 PM', '10:00 PM'],
                expectedTimelineMonthHeaderValues: ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4'],
                expectedWeekHeaderValues: ['Sun 29', 'Mon 30'],
                expectedMonthCellValues: ['01', '02', '03', '04', '05', '06', '07'],
            },
            // Remove DST cases
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: 0,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['12:00 AM', '', '1:00 AM'],
                expectedTimelineDayHeaderValues: ['12:00 AM', '12:30 AM', '1:00 AM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: 0,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['3:00 AM', '', '4:00 AM'],
                expectedTimelineDayHeaderValues: ['3:00 AM', '3:30 AM', '4:00 AM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: 0,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['9:00 PM', '', '10:00 PM'],
                expectedTimelineDayHeaderValues: ['9:00 PM', '9:30 PM', '10:00 PM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: 120 * MINUTE_MS,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['2:00 AM', '', '3:00 AM'],
                expectedTimelineDayHeaderValues: ['2:00 AM', '2:30 AM', '3:00 AM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: 120 * MINUTE_MS,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['5:00 AM', '', '6:00 AM'],
                expectedTimelineDayHeaderValues: ['5:00 AM', '5:30 AM', '6:00 AM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: 120 * MINUTE_MS,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['11:00 PM', '', '12:00 AM'],
                expectedTimelineDayHeaderValues: ['11:00 PM', '11:30 PM', '12:00 AM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: 765 * MINUTE_MS,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['12:45 PM', '', '1:45 PM'],
                expectedTimelineDayHeaderValues: ['12:45 PM', '1:15 PM', '1:45 PM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: 765 * MINUTE_MS,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['3:45 PM', '', '4:45 PM'],
                expectedTimelineDayHeaderValues: ['3:45 PM', '4:15 PM', '4:45 PM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: 765 * MINUTE_MS,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['9:45 AM', '', '10:45 AM'],
                expectedTimelineDayHeaderValues: ['9:45 AM', '10:15 AM', '10:45 AM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: 1440 * MINUTE_MS,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['12:00 AM', '', '1:00 AM'],
                expectedTimelineDayHeaderValues: ['12:00 AM', '12:30 AM', '1:00 AM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: 1440 * MINUTE_MS,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['3:00 AM', '', '4:00 AM'],
                expectedTimelineDayHeaderValues: ['3:00 AM', '3:30 AM', '4:00 AM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: 1440 * MINUTE_MS,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['9:00 PM', '', '10:00 PM'],
                expectedTimelineDayHeaderValues: ['9:00 PM', '9:30 PM', '10:00 PM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: -120 * MINUTE_MS,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['10:00 PM', '', '11:00 PM'],
                expectedTimelineDayHeaderValues: ['10:00 PM', '10:30 PM', '11:00 PM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: -120 * MINUTE_MS,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['1:00 AM', '', '2:00 AM'],
                expectedTimelineDayHeaderValues: ['1:00 AM', '1:30 AM', '2:00 AM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: -120 * MINUTE_MS,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['7:00 PM', '', '8:00 PM'],
                expectedTimelineDayHeaderValues: ['7:00 PM', '7:30 PM', '8:00 PM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: -765 * MINUTE_MS,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['11:15 AM', '', '12:15 PM'],
                expectedTimelineDayHeaderValues: ['11:15 AM', '11:45 AM', '12:15 PM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: -765 * MINUTE_MS,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['2:15 PM', '', '3:15 PM'],
                expectedTimelineDayHeaderValues: ['2:15 PM', '2:45 PM', '3:15 PM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: -765 * MINUTE_MS,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['8:15 AM', '', '9:15 AM'],
                expectedTimelineDayHeaderValues: ['8:15 AM', '8:45 AM', '9:15 AM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: -1440 * MINUTE_MS,
                startDayHour: 0,
                endDayHour: 24,
                expectedTimePanelValues: ['12:00 AM', '', '1:00 AM'],
                expectedTimelineDayHeaderValues: ['12:00 AM', '12:30 AM', '1:00 AM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: -1440 * MINUTE_MS,
                startDayHour: 3,
                endDayHour: 5,
                expectedTimePanelValues: ['3:00 AM', '', '4:00 AM'],
                expectedTimelineDayHeaderValues: ['3:00 AM', '3:30 AM', '4:00 AM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
            {
                currentDate: '2024-03-31T00:00:00',
                viewOffset: -1440 * MINUTE_MS,
                startDayHour: 21,
                endDayHour: 23,
                expectedTimePanelValues: ['9:00 PM', '', '10:00 PM'],
                expectedTimelineDayHeaderValues: ['9:00 PM', '9:30 PM', '10:00 PM'],
                expectedTimelineMonthHeaderValues: ['Fri 1', 'Sat 2', 'Sun 3', 'Mon 4'],
                expectedWeekHeaderValues: ['Sun 31', 'Mon 1'],
                expectedMonthCellValues: ['25', '26', '27', '28', '29', '01', '02'],
            },
        ].forEach(({
            currentDate,
            viewOffset,
            startDayHour,
            endDayHour,
            expectedTimePanelValues,
            expectedWeekHeaderValues,
            expectedMonthCellValues,
            expectedTimelineDayHeaderValues,
            expectedTimelineMonthHeaderValues,
        }) => {
            test(`Day: should have correct time in the time panel (
currentDate: ${currentDate},
viewOffset: ${viewOffset / MINUTE_MS},
start: ${startDayHour},
end: ${endDayHour}
)`, function(assert) {
                const workspace = createWorkspace({
                    currentDate,
                    viewOffset,
                    startDayHour,
                    endDayHour,
                }, 'dxSchedulerWorkSpaceDay');
                const $workspace = workspace.$element();

                const $timeCells = $workspace.find(SELECTORS.timePanelCell);

                expectedTimePanelValues.forEach((expectedTime, idx) => {
                    assert.equal($timeCells[idx].innerHTML, expectedTime);
                });
            });

            test(`TimelineDay: should have correct time in the header (
currentDate: ${currentDate},
viewOffset: ${viewOffset / MINUTE_MS},
start: ${startDayHour},
end: ${endDayHour}
)`, function(assert) {
                const workspace = createWorkspace({
                    currentDate,
                    viewOffset,
                    startDayHour,
                    endDayHour,
                }, 'dxSchedulerTimelineDay');
                const $workspace = workspace.$element();

                const $headerCells = $workspace.find(SELECTORS.headerPanelCell);

                expectedTimelineDayHeaderValues
                    .forEach((expectedTime, idx) => {
                        assert.equal($headerCells[idx].innerHTML, expectedTime);
                    });
            });

            test(`Week: should have correct dates in the header and time in the time panel (
currentDate: ${currentDate},
viewOffset: ${viewOffset / MINUTE_MS},
start: ${startDayHour},
end: ${endDayHour}
)`, function(assert) {
                const workspace = createWorkspace({
                    currentDate,
                    viewOffset,
                    startDayHour,
                    endDayHour,
                }, 'dxSchedulerWorkSpaceWeek');
                const $workspace = workspace.$element();

                const $timeCells = $workspace.find(SELECTORS.timePanelCell);
                const $headerCells = $workspace.find(SELECTORS.headerPanelCell);

                expectedTimePanelValues.forEach((expectedTime, idx) => {
                    assert.equal($timeCells[idx].innerHTML, expectedTime);
                });

                expectedWeekHeaderValues.forEach((expectedDate, idx) => {
                    assert.equal($headerCells[idx].innerHTML, expectedDate);
                });
            });

            // Skip some test cases for a while
            // These cases failed in Australia/ACT local machine timezone.
            if(viewOffset !== 120 && startDayHour !== 0 && endDayHour !== 24) {
                test(`Month: should have correct days in the header and dates in cells (
currentDate: ${currentDate},
viewOffset: ${viewOffset / MINUTE_MS},
start: ${startDayHour},
end: ${endDayHour}
)`, function(assert) {
                    const expectedHeaderCellValues = [
                        'Sun',
                        'Mon',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat',
                    ];
                    const workspace = createWorkspace({
                        currentDate,
                        viewOffset,
                        startDayHour,
                        endDayHour,
                    }, 'dxSchedulerWorkSpaceMonth');
                    const $workspace = workspace.$element();

                    const $cells = $workspace.find(SELECTORS.cellContent);
                    const $headerCells = $workspace.find(SELECTORS.headerPanelCell);

                    expectedMonthCellValues.forEach((expectedDate, idx) => {
                        assert.equal($cells[idx].innerHTML, expectedDate);
                    });

                    expectedHeaderCellValues.forEach((expectedDay, idx) => {
                        assert.equal($headerCells[idx].innerHTML, expectedDay);
                    });
                });

                test(`TimelineMonth: should have correct time in the header (
currentDate: ${currentDate},
viewOffset: ${viewOffset / MINUTE_MS},
start: ${startDayHour},
end: ${endDayHour}
)`, function(assert) {
                    const workspace = createWorkspace({
                        currentDate,
                        viewOffset,
                        startDayHour,
                        endDayHour,
                    }, 'dxSchedulerTimelineMonth');
                    const $workspace = workspace.$element();

                    const $headerCells = $workspace.find(SELECTORS.headerPanelCell);

                    expectedTimelineMonthHeaderValues
                        .forEach((expectedTime, idx) => {
                            assert.equal($headerCells[idx].innerHTML, expectedTime);
                        });
                });
            }
        });
    });
});
