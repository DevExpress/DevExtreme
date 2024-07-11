"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _contants = require("./contants");
var _default = exports.default = {
  barGauge: {
    backgroundColor: '#e0e0e0',
    relativeInnerRadius: 0.3,
    barSpacing: 4,
    resolveLabelOverlapping: 'hide',
    label: {
      indent: 20,
      connectorWidth: 2,
      font: {
        size: 16
      }
    },
    legend: {
      visible: false
    },
    indicator: {
      hasPositiveMeaning: true,
      layout: {
        horizontalAlignment: _contants.CENTER,
        verticalAlignment: _contants.BOTTOM
      },
      text: {
        font: {
          size: 18
        }
      }
    }
  }
};