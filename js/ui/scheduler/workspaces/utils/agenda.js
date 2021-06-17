import { setStartDayHour } from './base';

export const getFirstViewDate = (currentDate, startDayHour) => {
    const validCurrentDate = new Date(currentDate);

    return setStartDayHour(validCurrentDate, startDayHour);
};
