/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

let nextDataKey = 1;

export function generateDataKey() {
  return `vectormap-data-${nextDataKey++}`;
}

/// #DEBUG
export function _TESTS_resetDataKey() {
  nextDataKey = 1;
}
/// #ENDDEBUG
