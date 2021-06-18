import dateUtils from '../../../../core/utils/date';

export const getIntervalDuration = (intervalCount) => {
    return dateUtils.dateToMilliseconds('day') * 7 * intervalCount;
};
