import { getViewStartByOptions, setStartDayHour } from './base';

export const getFirstViewDate = (currentDate, startDayHour, startDate, intervalDuration) => {
    const firstViewDate = getViewStartByOptions(
        startDate,
        currentDate,
        intervalDuration,
        startDate,
    );

    return setStartDayHour(firstViewDate, startDayHour);
};
