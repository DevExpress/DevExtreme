import dateUtils from '../../core/utils/date';
import dateSerialization from '../../core/utils/date_serialization';

const getDeserializedDate = (value) => {
    return dateSerialization.deserializeDate(value);
};

export const isSameDates = (date1, date2) => {
    if(!date1 && !date2) {
        return true;
    }

    return dateUtils.sameDate(getDeserializedDate(date1), getDeserializedDate(date2));
};

export const isSameDateArrays = (value, previousValue) => {
    const [startDate, endDate] = value;
    const [previousStartDate, previousEndDate] = previousValue;

    return isSameDates(startDate, previousStartDate) && isSameDates(endDate, previousEndDate);
};

export const sortDatesArray = (value) => {
    const [startDate, endDate] = value;
    if(startDate && endDate && getDeserializedDate(startDate) > getDeserializedDate(endDate)) {
        return [endDate, startDate];
    } else {
        return value;
    }
};
