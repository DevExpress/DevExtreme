/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import graphModule from './graph';

const validator = {
  validate(data, incidentOccurred): string | null {
    let result: string | null = null;
    if (this._hasCycle(data)) {
      result = 'E2006';
      incidentOccurred('E2006');
    }
    return result;
  },
  _hasCycle(data) {
    return graphModule.struct.hasCycle(data);
  },
};

export default validator;
