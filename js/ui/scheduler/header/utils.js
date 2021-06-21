import dateUtils from '../../../core/utils/date';
import dateLocalization from '../../../localization/date';
import { isFunction } from '../../../core/utils/type';

const DAY_FORMAT = 'd';

const DAYS_IN_WORK_WEEK = 5;

const {
    correctDateWithUnitBeginning: getPeriodStart,
    getFirstWeekDate: getWeekStart,
    getLastMonthDay,
    addDateInterval
} = dateUtils;

const {
    format: dateFormat
} = dateLocalization;

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

const getInterval = (options) => {
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

const getDateMonthFormat = function(short) {
    const monthType = short ? 'abbreviated' : 'wide';
    const months = dateLocalization.getMonthNames(monthType);

    return function(date) {
        const day = dateFormat(date, 'day');

        const month = months[date.getMonth()];

        return `${day} ${month}`;
    };
};

const monthYearFormat = function(date) {
    const months = dateLocalization.getMonthNames('abbreviated');
    const month = months[date.getMonth()];

    const year = dateFormat(date, 'year');

    return `${month} ${year}`;
};

const getDateMonthYearFormat = (short) => {
    return (date) => {
        const dateMonthFormat = getDateMonthFormat(short);
        const dateMonth = dateMonthFormat(date);

        const year = dateFormat(date, 'year');

        return `${dateMonth} ${year}`;
    };
};

const getDifferentYearCaption = (startDate, endDate) => {
    const firstDateText = dateFormat(startDate, getDateMonthYearFormat(true));
    const lastDateDateText = dateFormat(endDate, getDateMonthYearFormat(true));

    return `${firstDateText}-${lastDateDateText}`;
};

const getSameYearCaption = (startDate, endDate, isShort) => {
    const isDifferentMonthDates = startDate.getMonth() !== endDate.getMonth();
    const useShortFormat = isDifferentMonthDates || isShort;

    const firstDateFormat = isDifferentMonthDates
        ? getDateMonthFormat(useShortFormat)
        : DAY_FORMAT;

    const firstDateText = dateFormat(startDate, firstDateFormat);
    const lastDateText = dateFormat(endDate, getDateMonthYearFormat(useShortFormat));

    return `${firstDateText}-${lastDateText}`;
};

const getSameDateCaption = (date, step, isShort) => {
    const short = step === 'agenda' ? isShort : false;

    const dateMonthFormat = getDateMonthFormat(short);

    return [dateMonthFormat(date), dateFormat(date, 'year')].join(' ');
};

const formatCaptionByMonths = function(startDate, endDate, isShort) {
    const isDifferentYears = startDate.getFullYear() !== endDate.getFullYear();

    if(isDifferentYears) {
        return getDifferentYearCaption(startDate, endDate);
    }

    return getSameYearCaption(startDate, endDate, isShort);
};

const formatMonthViewCaption = (startDate, endDate) => {
    if(dateUtils.sameMonth(startDate, endDate)) {
        return dateFormat(startDate, 'monthandyear');
    } else {
        const isSameYear = dateUtils.sameYear(startDate, endDate);
        const lastDateText = monthYearFormat(endDate);
        const firstDateText = isSameYear
            ? dateLocalization.getMonthNames('abbreviated')[startDate.getMonth()]
            : monthYearFormat(startDate);

        return firstDateText + '-' + lastDateText;
    }
};

const getCaptionText = (startDate, endDate, isShort, options) => {
    const { step } = options;

    if(dateUtils.sameDate(startDate, endDate)) {
        return getSameDateCaption(startDate, step, isShort);
    }

    if(step === 'month') {
        return formatMonthViewCaption(startDate, endDate);
    }

    return formatCaptionByMonths(startDate, endDate, isShort);
};

export const getCaption = (options, customizationFunction, useShortDateFormat) => {
    const { startDate, endDate } = getInterval(options);

    let text = getCaptionText(startDate, endDate, useShortDateFormat, options);

    if(isFunction(customizationFunction)) {
        text = customizationFunction({ startDate, endDate, text });
    }

    return { startDate, endDate, text };
};
