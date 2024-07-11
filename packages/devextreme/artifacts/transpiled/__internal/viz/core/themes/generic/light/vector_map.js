"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _contants = require("./contants");
var _default = exports.default = {
  map: {
    title: {
      margin: 10
    },
    background: {
      borderWidth: 1,
      borderColor: '#cacaca'
    },
    layer: {
      label: {
        enabled: false,
        stroke: _contants.WHITE,
        'stroke-width': 1,
        'stroke-opacity': 0.7,
        font: {
          color: _contants.SOME_GREY,
          size: 12
        }
      }
    },
    'layer:area': {
      borderWidth: 1,
      borderColor: _contants.WHITE,
      color: '#d2d2d2',
      hoveredBorderColor: _contants.GREY_GREEN,
      selectedBorderWidth: 2,
      selectedBorderColor: _contants.GREY_GREEN,
      label: {
        'stroke-width': 2,
        font: {
          size: 16
        }
      }
    },
    'layer:line': {
      borderWidth: 2,
      color: '#ba8365',
      hoveredColor: '#a94813',
      selectedBorderWidth: 3,
      selectedColor: '#e55100',
      label: {
        'stroke-width': 2,
        font: {
          size: 16
        }
      }
    },
    'layer:marker': {
      label: {
        enabled: true,
        'stroke-width': 1,
        font: {
          size: 12
        }
      }
    },
    'layer:marker:dot': {
      borderWidth: 2,
      borderColor: _contants.WHITE,
      size: 8,
      selectedStep: 2,
      backStep: 18,
      backColor: _contants.WHITE,
      backOpacity: 0.32,
      shadow: true
    },
    'layer:marker:bubble': {
      minSize: 20,
      maxSize: 50,
      hoveredBorderWidth: 1,
      hoveredBorderColor: _contants.GREY_GREEN,
      selectedBorderWidth: 2,
      selectedBorderColor: _contants.GREY_GREEN
    },
    'layer:marker:pie': {
      size: 50,
      hoveredBorderWidth: 1,
      hoveredBorderColor: _contants.GREY_GREEN,
      selectedBorderWidth: 2,
      selectedBorderColor: _contants.GREY_GREEN
    },
    'layer:marker:image': {
      size: 20
    },
    legend: {
      verticalAlignment: _contants.BOTTOM,
      horizontalAlignment: _contants.RIGHT,
      position: _contants.INSIDE,
      backgroundOpacity: 0.65,
      border: {
        visible: true
      },
      paddingLeftRight: 16,
      paddingTopBottom: 12
    },
    controlBar: {
      borderColor: '#5d5d5d',
      borderWidth: 3,
      color: _contants.WHITE,
      margin: 20,
      opacity: 0.3
    },
    _rtl: {
      legend: {
        itemTextPosition: _contants.LEFT
      }
    }
  }
};