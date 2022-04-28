import { isDateInRange } from './base';

export const getViewStartByOptions = (startDate, currentDate, intervalCount, startViewDate) => {
    if(!startDate) {
        return new Date(currentDate);
    } else {
        let startDate = new Date(startViewDate);
        const validStartViewDate = new Date(startViewDate);

        const diff = startDate.getTime() <= currentDate.getTime() ? 1 : -1;
        let endDate = new Date(new Date(validStartViewDate.setMonth(validStartViewDate.getMonth() + diff * intervalCount)));

        while(!isDateInRange(currentDate, startDate, endDate, diff)) {
            startDate = new Date(endDate);

            if(diff > 0) {
                startDate.setDate(1);
            }

            endDate = new Date(new Date(endDate.setMonth(endDate.getMonth() + diff * intervalCount)));
        }

        return diff > 0 ? startDate : endDate;
    }
};
