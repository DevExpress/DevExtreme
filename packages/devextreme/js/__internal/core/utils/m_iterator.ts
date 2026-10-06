// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the callers are not typed
type MapValues = (values: any, callback: (value: any, key: any, array?: any) => any) => any[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the callers are not typed
type Each = (values: any, callback: (this: any, key: any, value: any) => unknown) => any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the callers are not typed
type ReverseEach = (array: any, callback: (this: any, key: any, value: any) => unknown) => void;

const map: MapValues = (values, callback) => {
  if (Array.isArray(values)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- the callers are not typed
    return values.map(callback);
  }

  const result: unknown[] = [];

  // eslint-disable-next-line no-restricted-syntax, guard-for-in -- inherited keys are mapped too
  for (const key in values) {
    result.push(callback(values[key], key));
  }

  return result;
};

const each: Each = (values, callback) => {
  if (!values) return undefined;

  if ('length' in values) {
    for (let i = 0; i < values.length; i += 1) {
      if (callback.call(values[i], i, values[i]) === false) {
        break;
      }
    }
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in values) {
      if (callback.call(values[key], key, values[key]) === false) {
        break;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- the callers are not typed
  return values;
};

const reverseEach: ReverseEach = (array, callback) => {
  if (!array || !('length' in array) || array.length === 0) return;

  for (let i = array.length - 1; i >= 0; i -= 1) {
    if (callback.call(array[i], i, array[i]) === false) {
      break;
    }
  }
};

export {
  each,
  map,
  reverseEach,
};
