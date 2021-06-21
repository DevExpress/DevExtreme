import { setStartDayHour } from './base';

export const calculateStartViewDate = (currentDate, startDayHour) => {
    const validCurrentDate = new Date(currentDate);

    return setStartDayHour(validCurrentDate, startDayHour);
};
