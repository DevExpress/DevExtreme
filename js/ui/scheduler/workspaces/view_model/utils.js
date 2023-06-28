import { VIEWS } from '../../constants';
import { ViewDataGenerator } from './view_data_generator';
import { ViewDataGeneratorDay } from './view_data_generator_day';
import { ViewDataGeneratorMonth } from './view_data_generator_month';
import { ViewDataGeneratorTimelineMonth } from './view_data_generator_timeline_month';
import { ViewDataGeneratorWeek } from './view_data_generator_week';
import { ViewDataGeneratorWorkWeek } from './view_data_generator_work_week';

export const getViewDataGeneratorByViewType = (viewType) => {
    switch(viewType) {
        case VIEWS.MONTH:
            return new ViewDataGeneratorMonth();
        case VIEWS.TIMELINE_MONTH:
            return new ViewDataGeneratorTimelineMonth();
        case VIEWS.DAY:
        case VIEWS.TIMELINE_DAY:
            return new ViewDataGeneratorDay();
        case VIEWS.WEEK:
        case VIEWS.TIMELINE_WEEK:
            return new ViewDataGeneratorWeek();
        case VIEWS.WORK_WEEK:
        case VIEWS.TIMELINE_WORK_WEEK:
            return new ViewDataGeneratorWorkWeek();
        default:
            return new ViewDataGenerator();
    }
};

export function alignToFirstDayOfWeek(date, firstDayOfWeek) {
    const newDate = new Date(date);
    let dayDiff = newDate.getDay() - firstDayOfWeek;

    if(dayDiff < 0) {
        dayDiff += 7;
    }

    newDate.setDate(newDate.getDate() - dayDiff);

    return newDate;
}

export function alignToLastDayOfWeek(date, firstDayOfWeek) {
    const newDate = alignToFirstDayOfWeek(date, firstDayOfWeek);
    newDate.setDate(newDate.getDate() + 6);
    return newDate;
}

export function calculateDaysBetweenDates(fromDate, toDate) {
    const MS_IN_DAY = 24 * 60 * 60 * 1000;
    return Math.floor((toDate.getTime() - fromDate.getTime()) / MS_IN_DAY) + 1;
}

export function calculateAlignedWeeksBetweenDates(fromDate, toDate, firstDayOfWeek) {
    const alignedFromDate = alignToFirstDayOfWeek(fromDate, firstDayOfWeek);
    const alignedToDate = alignToLastDayOfWeek(toDate, firstDayOfWeek);

    const weekCount = calculateDaysBetweenDates(alignedFromDate, alignedToDate) / 7;
    return Math.max(weekCount, 6);
}
