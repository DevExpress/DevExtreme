import dateUtils from '../../../core/utils/date';

const DAYS_IN_WORK_WEEK = 5;

const {
    correctDateWithUnitBeginning: getPeriodStart,
    getFirstWeekDate: getWeekStart,
    getLastMonthDay,
    addDateInterval
} = dateUtils;

const MS_DURATION = { milliseconds: 1 };
const DAY_DURATION = { days: 1 };
const WEEK_DURATION = { days: 7 };

const SATURDAY_INDEX = 6;
const SUNDAY_INDEX = 0;

const subMS = (date) => {
    return addDateInterval(date, MS_DURATION, -1);
};

const addMS = (date) => {
    return addDateInterval(date, MS_DURATION, 1);
};

const nextDay = (date) => {
    return addDateInterval(date, DAY_DURATION, 1);
};

const nextWeek = (date) => {
    return addDateInterval(date, WEEK_DURATION, 1);
};

const nextMonth = (date) => {
    const days = getLastMonthDay(date);

    return addDateInterval(date, { days }, 1);
};

const isWeekend = (date) => {
    return date.getDay() === SATURDAY_INDEX || date.getDay() === SUNDAY_INDEX;
};

const getWorkWeekStart = (firstDayOfWeek) => {
    let date = new Date(firstDayOfWeek);
    while(isWeekend(date)) {
        date = nextDay(date);
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

        date = nextDay(date);
    }

    return date;
};

const nextAgendaStart = (date, agendaDuration) => {
    return addDateInterval(date, { days: agendaDuration }, 1);
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
            date = nextDay(currentPeriodStartDate);
            break;
        case 'week':
            date = nextWeek(currentPeriodStartDate);
            break;
        case 'month':
            date = nextMonth(currentPeriodStartDate);
            break;
        case 'workWeek':
            date = getDateAfterWorkWeek(currentPeriodStartDate);
            break;
        case 'agenda':
            date = nextAgendaStart(currentPeriodStartDate, agendaDuration);
            break;
    }

    return subMS(date);
};

const getNextPeriodStartDate = (currentPeriodEndDate, step) => {
    let date = addMS(currentPeriodEndDate);

    if(step === 'workWeek') {
        while(isWeekend(date)) {
            date = nextDay(date);
        }
    }

    return date;
};

export const getNextIntervalDate = (options, direction) => {
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
            return getNextMonthDate(date, intervalCount, direction);
    }

    return addDateInterval(date, { days: dayDuration }, direction);
};

const getNextMonthDate = (date, intervalCount, direction) => {
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
