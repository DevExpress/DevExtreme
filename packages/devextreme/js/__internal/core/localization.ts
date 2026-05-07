import '@ts/core/localization/currency';

import core from '@ts/core/localization/core';
import date from '@ts/core/localization/date';
import message from '@ts/core/localization/message';
import number from '@ts/core/localization/number';

export const locale = core.locale.bind(core);

export const loadMessages = message.load.bind(message);
export const formatMessage = message.format.bind(message);
export const formatNumber = number.format.bind(number);
export const parseNumber = number.parse.bind(number);
export const formatDate = date.format.bind(date);
export const parseDate = date.parse.bind(date);
export {
  date,
  message,
  number,
};

export function disableIntl(): void {
  if (number.engine() === 'intl') {
    number.resetInjection();
  }
  if (date.engine() === 'intl') {
    date.resetInjection();
  }
}
