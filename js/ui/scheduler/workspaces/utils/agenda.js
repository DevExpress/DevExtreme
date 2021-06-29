import { setOptionHour } from './base';

export const calculateStartViewDate = (currentDate, startDayHour) => {
    const validCurrentDate = new Date(currentDate);

    return setOptionHour(validCurrentDate, startDayHour);
};
