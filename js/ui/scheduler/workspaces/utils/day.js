import { getViewStartByOptions, setOptionHour } from './base';

export const calculateStartViewDate = (currentDate, startDayHour, startDate, intervalDuration) => {
    const firstViewDate = getViewStartByOptions(
        startDate,
        currentDate,
        intervalDuration,
        startDate,
    );

    return setOptionHour(firstViewDate, startDayHour);
};
