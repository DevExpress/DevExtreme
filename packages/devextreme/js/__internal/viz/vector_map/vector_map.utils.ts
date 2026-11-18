/* eslint-disable no-plusplus */

let nextDataKey = 1;

export function generateDataKey(): string {
  return `vectormap-data-${nextDataKey++}`;
}

/// #DEBUG
exports._TESTS_resetDataKey = function (): void {
  nextDataKey = 1;
};
/// #ENDDEBUG
