"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _contants = require("./contants");
var _default = exports.default = {
  pie: {
    innerRadius: 0.5,
    minDiameter: 0.5,
    type: 'pie',
    dataPrepareSettings: {
      _skipArgumentSorting: true
    },
    commonSeriesSettings: {
      pie: {
        border: {
          visible: false,
          width: 2,
          color: _contants.WHITE
        },
        hoverStyle: {
          hatching: {
            direction: _contants.RIGHT,
            width: 4,
            step: 10,
            opacity: 0.75
          },
          highlight: true,
          border: {
            visible: false,
            width: 2
          }
        },
        selectionStyle: {
          hatching: {
            direction: _contants.RIGHT,
            width: 4,
            step: 10,
            opacity: 0.5
          },
          highlight: true,
          border: {
            visible: false,
            width: 2
          }
        }
      },
      doughnut: {
        border: {
          visible: false,
          width: 2,
          color: _contants.WHITE
        },
        hoverStyle: {
          hatching: {
            direction: _contants.RIGHT,
            width: 4,
            step: 10,
            opacity: 0.75
          },
          highlight: true,
          border: {
            visible: false,
            width: 2
          }
        },
        selectionStyle: {
          hatching: {
            direction: _contants.RIGHT,
            width: 4,
            step: 10,
            opacity: 0.5
          },
          highlight: true,
          border: {
            visible: false,
            width: 2
          }
        }
      },
      donut: {
        border: {
          visible: false,
          width: 2,
          color: _contants.WHITE
        },
        hoverStyle: {
          hatching: {
            direction: _contants.RIGHT,
            width: 4,
            step: 10,
            opacity: 0.75
          },
          highlight: true,
          border: {
            visible: false,
            width: 2
          }
        },
        selectionStyle: {
          hatching: {
            direction: _contants.RIGHT,
            width: 4,
            step: 10,
            opacity: 0.5
          },
          highlight: true,
          border: {
            visible: false,
            width: 2
          }
        }
      },
      label: {
        textOverflow: 'ellipsis',
        wordWrap: 'normal'
      }
    },
    legend: {
      hoverMode: 'allArgumentPoints',
      backgroundColor: _contants.NONE
    },
    adaptiveLayout: {
      keepLabels: false
    }
  }
};