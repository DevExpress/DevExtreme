import dateUtils from '@js/core/utils/date';
import dateSerialization from '@js/core/utils/date_serialization';

export const getDeserializedDate = (value) => dateSerialization.deserializeDate(value);

export const isSameDates = (date1, date2): boolean => {
  if (!date1 && !date2) {
    return true;
  }

  return dateUtils.sameDate(getDeserializedDate(date1), getDeserializedDate(date2));
};

export const isSameDateArrays = (value, previousValue): boolean => {
  const [startDate, endDate] = value;
  const [previousStartDate, previousEndDate] = previousValue;

  return isSameDates(startDate, previousStartDate) && isSameDates(endDate, previousEndDate);
};

export const sortDatesArray = (value) => {
  const [startDate, endDate] = value;
  if (startDate && endDate && getDeserializedDate(startDate) > getDeserializedDate(endDate)) {
    return [endDate, startDate];
  }
  return value;
};

export const monthDifference = (date1, date2): number => (date2.getFullYear() - date1.getFullYear()) * 12 - date1.getMonth() + date2.getMonth();
