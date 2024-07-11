"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dateUtilsTs = void 0;
// TODO Vinogradov: Refactor offsets: number[] -> ...offsets: number[]
const addOffsets = (date, offsets) => {
  const newDateMs = offsets.reduce((result, offset) => result + offset, date.getTime());
  return new Date(newDateMs);
};
const dateUtilsTs = exports.dateUtilsTs = {
  addOffsets
};