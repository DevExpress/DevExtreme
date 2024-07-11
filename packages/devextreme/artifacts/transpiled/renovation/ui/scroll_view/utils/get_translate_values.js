"use strict";

exports.getTranslateValues = getTranslateValues;
var _get_element_style = require("./get_element_style");
function getTranslateValues(el) {
  const matrix = (0, _get_element_style.getElementTransform)(el);
  const regex = /matrix.*\((.+)\)/;
  const matrixValues = regex.exec(matrix);
  if (matrixValues) {
    const result = matrixValues[1].split(', ');
    return {
      left: Number(result[4]),
      top: Number(result[5])
    };
  }
  return {
    left: 0,
    top: 0
  };
}