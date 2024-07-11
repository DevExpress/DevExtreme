"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _contants = require("./contants");
var _default = exports.default = {
  sankey: {
    sourceField: 'source',
    targetField: 'target',
    weightField: 'weight',
    hoverEnabled: true,
    alignment: _contants.CENTER,
    adaptiveLayout: {
      width: 80,
      height: 80,
      keepLabels: true
    },
    label: {
      visible: true,
      horizontalOffset: 8,
      verticalOffset: 0,
      overlappingBehavior: 'ellipsis',
      useNodeColors: false,
      font: {
        color: _contants.BLACK,
        weight: 500
      },
      border: {
        visible: false,
        width: 2,
        color: _contants.WHITE
      },
      customizeText(info) {
        return info.title;
      },
      shadow: {
        opacity: 0.2,
        offsetX: 0,
        offsetY: 1,
        blur: 1,
        color: _contants.WHITE
      }
    },
    title: {
      margin: 10,
      font: {
        size: 28,
        weight: 200
      },
      subtitle: {
        font: {
          size: 16
        }
      }
    },
    tooltip: {
      enabled: true
    },
    node: {
      padding: 30,
      width: 8,
      opacity: 1,
      border: {
        color: _contants.WHITE,
        width: 1,
        visible: false
      },
      hoverStyle: {
        hatching: {
          opacity: 0.75,
          step: 6,
          width: 2,
          direction: _contants.RIGHT
        },
        border: {}
      }
    },
    link: {
      color: '#888888',
      colorMode: 'none',
      opacity: 0.3,
      border: {
        color: _contants.WHITE,
        width: 1,
        visible: false
      },
      hoverStyle: {
        opacity: 0.5,
        hatching: {
          opacity: 0.75,
          step: 6,
          width: 2,
          direction: _contants.RIGHT
        },
        border: {}
      }
    }
  }
};