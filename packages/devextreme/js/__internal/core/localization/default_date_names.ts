import type { Format } from '@ts/core/localization/date';
import { map } from '@ts/core/utils/m_iterator';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['AM', 'PM'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

// TODO: optimize
const cutCaptions = (captions: string[], format: Format): string[] => {
  const lengthByFormat = {
    abbreviated: 3,
    short: 2,
    narrow: 1,
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return map(captions, (caption: string): string => caption.substr(0, lengthByFormat[format]));
};

export default {
  getMonthNames(format: Format): string[] {
    return cutCaptions(MONTHS, format);
  },
  getDayNames(format: Format): string[] {
    return cutCaptions(DAYS, format);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getQuarterNames(_format: Format): string[] {
    return QUARTERS;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPeriodNames(_format: Format): string[] {
    return PERIODS;
  },
};
