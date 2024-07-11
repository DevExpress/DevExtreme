"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _contants = require("./contants");
var _default = exports.default = {
  sparkline: {
    lineColor: '#666666',
    lineWidth: 2,
    areaOpacity: 0.2,
    minColor: '#e8c267',
    maxColor: '#e55253',
    barPositiveColor: '#a9a9a9',
    barNegativeColor: '#d7d7d7',
    winColor: '#a9a9a9',
    lossColor: '#d7d7d7',
    firstLastColor: '#666666',
    pointSymbol: 'circle',
    pointColor: _contants.WHITE,
    pointSize: 4,
    type: 'line',
    argumentField: 'arg',
    valueField: 'val',
    winlossThreshold: 0,
    showFirstLast: true,
    showMinMax: false,
    tooltip: {
      enabled: true
    }
  }
};