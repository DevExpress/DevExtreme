let nextDataKey = 1;

export function generateDataKey(): string {
  const dataKey = `vectormap-data-${nextDataKey}`;
  nextDataKey += 1;
  return dataKey;
}

/// #DEBUG
exports._TESTS_resetDataKey = function (): void {
  nextDataKey = 1;
};
/// #ENDDEBUG
