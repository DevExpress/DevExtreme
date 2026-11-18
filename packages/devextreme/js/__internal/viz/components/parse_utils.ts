/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { noop } from '@ts/core/utils/common';
import { dateSerialization } from '@ts/core/utils/date_serialization';
import { isDefined } from '@ts/core/utils/type';

const parsers = {
  string(val): string | null | undefined {
    return isDefined(val) ? `${val}` : val;
  },

  numeric(val): number | null | undefined {
    if (!isDefined(val)) {
      return val;
    }

    let parsedVal: number | undefined = Number(val);
    if (isNaN(parsedVal)) {
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
