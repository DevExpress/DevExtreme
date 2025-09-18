/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { noop } from '@js/core/utils/common';
import dateSerialization from '@js/core/utils/date_serialization';
import { isDefined } from '@js/core/utils/type';

const parsers = {
  string(val) {
    return isDefined(val) ? `${val}` : val;
  },

  numeric(val) {
    if (!isDefined(val)) {
      return val;
    }

    let parsedVal = Number(val);
    if (isNaN(parsedVal)) {
      // @ts-expect-error
      parsedVal = undefined;
    }
    return parsedVal;
  },

  datetime(val) {
    if (!isDefined(val)) {
      return val;
    }

    let parsedVal;
    const numVal = Number(val);
    if (!isNaN(numVal)) {
      parsedVal = new Date(numVal);
    } else {
      parsedVal = dateSerialization.deserializeDate(val);
    }
    if (isNaN(Number(parsedVal))) {
      parsedVal = undefined;
    }
    return parsedVal;
  },
};

export function correctValueType(type) {
  return type === 'numeric' || type === 'datetime' || type === 'string' ? type : '';
}

export const getParser = function (valueType) {
  return parsers[correctValueType(valueType)] || noop;
};

/// #DEBUG
export { parsers };
/// #ENDDEBUG
