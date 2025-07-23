export type WrappedCallback = Function & {
  originalCallback: Function;
};
type Callback = Function | WrappedCallback;
type Selector = string | Callback;

export const getNormalizedCallback = (
  callback: Callback,
): Function => ('originalCallback' in callback ? callback.originalCallback : callback);

export const compareCallbacks = (
  callback: Callback,
  callbackToCompare: Callback,
): boolean => {
  const normalizedCallback = getNormalizedCallback(callback);
  const normalizedCallbackToCompare = getNormalizedCallback(callbackToCompare);

  return normalizedCallback === normalizedCallbackToCompare;
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
