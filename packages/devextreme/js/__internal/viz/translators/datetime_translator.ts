/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { dateUtils } from '@ts/core/utils/m_date';

function parse(value) {
  return value !== null ? new Date(value) : value;
}

export default {
  fromValue: parse,

  toValue: parse,

  _add: dateUtils.addDateInterval,

  convert: dateUtils.dateToMilliseconds,
};
