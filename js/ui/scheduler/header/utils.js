import dateUtils from '../../../core/utils/date';

const DAYS_IN_WORK_WEEK = 5;

const {
    correctDateWithUnitBeginning: getPeriodStart,
    getFirstWeekDate: getWeekStart,
    getLastMonthDate,
    getFirstMonthDate,
    getLastMonthDay
} = dateUtils;

const DAY_DURATION = dateUtils.dateToMilliseconds('day');
const WEEK_DURATION = dateUtils.dateToMilliseconds('week');

const SATURDAY_INDEX = 6;
const SUNDAY_INDEX = 0;

const nextDayStart = (date) => {
    return new Date(date.getTime() + DAY_DURATION);
};

const nextWeekStart = (date) => {
    return new Date(date.getTime() + WEEK_DURATION);
};

const nextMonthStart = (date) => {
    const monthDuration =
        getLastMonthDate(date).getTime()
        - getFirstMonthDate(date).getTime()
        + DAY_DURATION;

    return new Date(date.getTime() + monthDuration);
};

const isWeekend = (date) => {
    return date.getDay() === SATURDAY_INDEX || date.getDay() === SUNDAY_INDEX;
};

const getWorkWeekStart = (firstDayOfWeek) => {
    let date = new Date(firstDayOfWeek);
    while(isWeekend(date)) {
        date = nextDayStart(date);
    }

    return date;
};

const getDateAfterWorkWeek = (workWeekStart) => {
    let date = new Date(workWeekStart);

    let workedDays = 0;
    while(workedDays < DAYS_IN_WORK_WEEK) {
        if(!isWeekend(date)) {
            workedDays++;
        }

        date = nextDayStart(date);
    }

    return date;
};

const nextAgendaStart = (currentAgendaStartDate, agendaDuration) => {
    return new Date(
        currentAgendaStartDate.getTime()
        + (agendaDuration * DAY_DURATION)
    );
};

export const getInterval = (options) => {
    const startDate = getIntervalStartDate(options);
    const endDate = getIntervalEndDate(startDate, options);

    return {
        startDate,
        endDate,
    };
};

const getIntervalStartDate = (options) => {
    const { date, step, firstDayOfWeek } = options;

    switch(step) {
        case 'day':
        case 'week':
        case 'month':
            return getPeriodStart(date, step, false, firstDayOfWeek);
        case 'workWeek':
            // eslint-disable-next-line no-case-declarations
            const firstWeekDay = getWeekStart(date, firstDayOfWeek);
            return getWorkWeekStart(firstWeekDay);
        case 'agenda':
            return new Date(date);
    }
};

const getIntervalEndDate = (startDate, options) => {
    const { intervalCount, step, agendaDuration } = options;

    let periodStartDate;
    let periodEndDate;
    let nextPeriodStartDate = new Date(startDate);

    for(let i = 0; i < intervalCount; i++) {
        periodStartDate = nextPeriodStartDate;

        periodEndDate = getPeriodEndDate(periodStartDate, step, agendaDuration);

        nextPeriodStartDate = getNextPeriodStartDate(periodEndDate, step);
    }

    return periodEndDate;
};

const getPeriodEndDate = (currentPeriodStartDate, step, agendaDuration) => {
    let date;

    switch(step) {
        case 'day':
            date = nextDayStart(currentPeriodStartDate);
            break;
        case 'week':
            date = nextWeekStart(currentPeriodStartDate);
            break;
        case 'month':
            date = nextMonthStart(currentPeriodStartDate);
            break;
        case 'workWeek':
            date = getDateAfterWorkWeek(currentPeriodStartDate);
            break;
        case 'agenda':
            date = nextAgendaStart(currentPeriodStartDate, agendaDuration);
            break;
    }

    return new Date(date.getTime() - 1);
};

const getNextPeriodStartDate = (currentPeriodEndDate, step) => {
    let date = new Date(currentPeriodEndDate.getTime() + 1);

    if(step === 'workWeek') {
        while(isWeekend(date)) {
            date = nextDayStart(date);
        }
    }

    return date;
};

export const getNextDate = (options, direction) => {
    const { date, step, intervalCount, agendaDuration } = options;

    let dayDuration;
    switch(step) {
        case 'day':
            dayDuration = 1 * intervalCount;
            break;
        case 'week':
        case 'workWeek':
            dayDuration = 7 * intervalCount;
            break;
        case 'agenda':
            dayDuration = agendaDuration;
            break;
        case 'month':
            return getNextDateMonth(date, intervalCount, direction);
    }

    const duration = dayDuration * direction * DAY_DURATION;
    return new Date(date.getTime() + duration);
};

const getNextDateMonth = (date, intervalCount, direction) => {
    const currentDate = date.getDate();

    const currentMonthFirstDate = new Date(new Date(date.getTime()).setDate(1));
    const thatMonthFirstDate = new Date(
        currentMonthFirstDate
            .setMonth(currentMonthFirstDate.getMonth() + intervalCount * direction)
    );
    const thatMonthDuration = getLastMonthDay(thatMonthFirstDate);

    const minDate = currentDate < thatMonthDuration ? currentDate : thatMonthDuration;

    const currentMonthMinDate = new Date(new Date(date.getTime()).setDate(minDate));
    const thatMonthMinDate = new Date(
        currentMonthMinDate
            .setMonth(currentMonthMinDate.getMonth() + intervalCount * direction)
    );

    return thatMonthMinDate;
};

export const getDuration = (options) => {
    const { intervalCount, agendaDuration, step } = options;

    switch(step) {
        case 'day':
            return 1 * intervalCount;
        case 'week':
        case 'workWeek':
            return 7 * intervalCount;
        case 'month':
            return 1 * intervalCount;
        case agendaDuration:
            return agendaDuration;
    }
};
