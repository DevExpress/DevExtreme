"use strict";

exports.addAlgorithm = addAlgorithm;
exports.getAlgorithm = getAlgorithm;
var _utils = require("../core/utils");
const algorithms = {};
let defaultAlgorithm;
function getAlgorithm(name) {
  return algorithms[(0, _utils.normalizeEnum)(name)] || defaultAlgorithm;
}
function addAlgorithm(name, callback, setDefault) {
  algorithms[name] = callback;
  if (setDefault) {
    defaultAlgorithm = algorithms[name];
  }
}