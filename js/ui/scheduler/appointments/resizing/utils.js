import timeZoneUtils from '../../utils.timeZone';
import { createAppointmentAdapter } from '../../appointmentAdapter';
import { getRecurrenceProcessor } from '../../recurrence';

const normalizeDate = (options, date, sourceDate, isStartDate) => {
    if(!options.considerTime) {
        return date;
    }

    let result = new Date(date);

    result.setHours(
        sourceDate.getHours(),
        sourceDate.getMinutes(),
        sourceDate.getSeconds()
    );

    const {
        startDayHour,
        endDayHour,
        appointmentSettings: {
            allDay
        }
    } = options;

    const minDate = new Date(date);
    const maxDate = new Date(date);

    minDate.setHours(startDayHour, 0, 0, 0);
    maxDate.setHours(endDayHour, 0, 0, 0);

    const isDateOutInterval = isStartDate
        ? result < minDate.getTime() || result >= maxDate.getTime()
        : result <= minDate.getTime() || result > maxDate.getTime();

    if(isDateOutInterval) {
        result = !allDay
            ? maxDate
            : minDate;
    }

    return result;
};

const applyTimeZone = (sourceAppointment, startDate, endDate) => {
    return timeZoneUtils.getTimezoneOffsetChangeInMs(
        sourceAppointment.startDate,
        sourceAppointment.endDate,
        startDate,
        endDate,
    );
};

export const getEndResizeAppointmentStartDate = (options, startDate) => {
    let result = startDate;
    const {
        appointmentSettings: {
            allDay,
            info: {
                sourceAppointment,
            },
        },
        timeZoneCalculator,
        dataAccessors,
        handles
    } = options;
    const appointmentAdapter = createAppointmentAdapter(
        sourceAppointment,
        dataAccessors,
        timeZoneCalculator,
    );

    const recurrenceProcessor = getRecurrenceProcessor();
    const {
        recurrenceRule,
        startDateTimeZone
    } = appointmentAdapter;
    const isRecurrent = recurrenceProcessor.isValidRecurrenceRule(recurrenceRule);

    if(!handles.top && !isRecurrent && !allDay) {
        result = timeZoneCalculator.createDate(
            startDate,
            {
                appointmentTimeZone: startDateTimeZone,
                path: 'toGrid'
            },
        );
    }

    return result;
};

export const normalizeStartDate = (options, startDate, sourceStartDate) => {
    const {
        appointmentSettings: {
            info: {
                sourceAppointment,
            }
        }
    } = options;

    const normalizedStartDate = normalizeDate(options, startDate, sourceStartDate, true);
    const timeZoneOffset = applyTimeZone(
        sourceAppointment,
        normalizedStartDate,
        sourceAppointment.endDate,
    );

    return new Date(normalizedStartDate.getTime() + timeZoneOffset);
};

export const normalizeEndDate = (options, endDate, sourceEndDate) => {
    const {
        appointmentSettings: {
            info: {
                sourceAppointment,
            }
        }
    } = options;

    const normalizedEndDate = normalizeDate(options, endDate, sourceEndDate, false);
    const timeZoneOffset = applyTimeZone(
        sourceAppointment,
        sourceAppointment.startDate,
        normalizedEndDate,
    );

    return new Date(normalizedEndDate.getTime() + timeZoneOffset);
};
