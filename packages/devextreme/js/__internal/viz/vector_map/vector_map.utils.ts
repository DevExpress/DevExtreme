/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

let nextDataKey = 1;

export function generateDataKey() {
  return `vectormap-data-${nextDataKey++}`;
}

/// #DEBUG
exports._TESTS_resetDataKey = function () {
  nextDataKey = 1;
};
/// #ENDDEBUG
