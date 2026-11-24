import { dateUtils } from '@ts/core/utils/date';

function parse(value: Date | number | string | null): Date | null {
  return value !== null ? new Date(value) : value;
}

export default {
  fromValue: parse,

  toValue: parse,

  _add: dateUtils.addDateInterval,

  convert: dateUtils.dateToMilliseconds,
};
