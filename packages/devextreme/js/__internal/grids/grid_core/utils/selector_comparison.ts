export type WrappedCallback = Function & {
  originalCallback: Function;
  columnIndex?: number;
};
type Callback = Function | WrappedCallback;
type Selector = string | Callback;

export const getNormalizedCallback = (
  callback: Callback,
): Function => ('originalCallback' in callback ? callback.originalCallback : callback);

export const getNormalizedColumnIdx = (
  callback: Callback,
): number | null | undefined => ('columnIndex' in callback ? callback.columnIndex ?? null : undefined);

export const compareCallbacks = (
  callback: Callback,
  callbackToCompare: Callback,
): boolean => {
  const normalizedCallback = getNormalizedCallback(callback);
  const normalizedCallbackToCompare = getNormalizedCallback(callbackToCompare);
  const normalizedColumnIdx = getNormalizedColumnIdx(callback);
  const normalizedColumnIdxToCompare = getNormalizedColumnIdx(callbackToCompare);

  const originalCallbacksEqual = normalizedCallback === normalizedCallbackToCompare;
  const shouldCompareColumnIdx = normalizedColumnIdx !== undefined;
  const columnIdxEqual = normalizedColumnIdx === normalizedColumnIdxToCompare;

  return originalCallbacksEqual && (!shouldCompareColumnIdx || columnIdxEqual);
};

export const isEqualSelectors = (
  selector: Selector | undefined,
  selectorToCompare: Selector | undefined,
): boolean => {
  if (typeof selector === 'string' && typeof selectorToCompare === 'string') {
    return selector === selectorToCompare;
  }

  if (typeof selector === 'function' && typeof selectorToCompare === 'function') {
    return compareCallbacks(selector, selectorToCompare);
  }

  return false;
};

export const isSelectorEqualWithCallback = (
  selector: Selector | undefined,
  callback: Callback | undefined,
): boolean => {
  if (typeof selector === 'function' && typeof callback === 'function') {
    return compareCallbacks(selector, callback);
  }

  return false;
};
