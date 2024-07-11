"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shallowEquals = void 0;
const shallowEquals = (firstObject, secondObject) => {
  if (Object.keys(firstObject).length !== Object.keys(secondObject).length) {
    return false;
  }
  return Object.keys(firstObject).every(key => firstObject[key] === secondObject[key]);
};
exports.shallowEquals = shallowEquals;