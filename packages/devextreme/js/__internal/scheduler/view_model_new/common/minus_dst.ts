import dateUtils from '@js/core/utils/date';

const toMs = dateUtils.dateToMilliseconds;
export const minusDST = (date: number): number => date - new Date(date).getTimezoneOffset() * toMs('minute');
