"use strict";

exports.reverseEach = exports.map = exports.each = void 0;
const map = (values, callback) => {
  if (Array.isArray(values)) {
    return values.map(callback);
  }
  const result = [];
  for (const key in values) {
    result.push(callback(values[key], key));
  }
  return result;
};

/**
 * @type {{
 *   <T>(values: readonly T[], callback: (this: T,          index: number,  value: T)          => void | boolean): T[],
 *   <T>(values: T,            callback: (this: T[keyof T], index: keyof T, value: T[keyof T]) => void | boolean): T,
 * }}
 */
exports.map = map;
const each = (values, callback) => {
  if (!values) return;
  if ('length' in values) {
    for (let i = 0; i < values.length; i++) {
      if (callback.call(values[i], i, values[i]) === false) {
        break;
      }
    }
  } else {
    for (const key in values) {
      if (callback.call(values[key], key, values[key]) === false) {
        break;
      }
    }
  }
  return values;
};
exports.each = each;
const reverseEach = (array, callback) => {
  if (!array || !('length' in array) || array.length === 0) return;
  for (let i = array.length - 1; i >= 0; i--) {
    if (callback.call(array[i], i, array[i]) === false) {
      break;
    }
  }
};
exports.reverseEach = reverseEach;