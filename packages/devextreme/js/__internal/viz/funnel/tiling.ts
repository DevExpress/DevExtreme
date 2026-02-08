/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { normalizeEnum as _normalizeEnum } from '../core/utils';

const algorithms = {};
let defaultAlgorithm;

export function getAlgorithm(name) {
  return algorithms[_normalizeEnum(name)] || defaultAlgorithm;
}

export function addAlgorithm(name, callback, setDefault?) {
  algorithms[name] = callback;

  if (setDefault) {
    defaultAlgorithm = algorithms[name];
  }
}
