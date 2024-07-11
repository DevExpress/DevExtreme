"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _contants = require("./contants");
var _default = exports.default = {
  gauge: {
    scale: {
      tick: {
        visible: true,
        length: 5,
        width: 2,
        opacity: 1
      },
      minorTick: {
        visible: false,
        length: 3,
        width: 1,
        opacity: 1
      },
      label: {
        visible: true,
        alignment: _contants.CENTER,
        hideFirstOrLast: 'last',
        overlappingBehavior: 'hide'
      },
      position: _contants.TOP,
      endOnTick: false
    },
    rangeContainer: {
      offset: 0,
      width: 5,
      backgroundColor: '#808080'
    },
    valueIndicators: {
      _default: {
        color: '#c2c2c2'
      },
      rangebar: {
        space: 2,
        size: 10,
        color: '#cbc5cf',
        backgroundColor: _contants.NONE,
        text: {
          indent: 0,
          font: {
            size: 14,
            color: null
          }
        }
      },
      // eslint-disable-next-line spellcheck/spell-checker
      twocolorneedle: {
        secondColor: '#e18e92'
      },
      // eslint-disable-next-line spellcheck/spell-checker
      trianglemarker: {
        space: 2,
        length: 14,
        width: 13,
        color: '#8798a5'
      },
      // eslint-disable-next-line spellcheck/spell-checker
      textcloud: {
        arrowLength: 5,
        horizontalOffset: 6,
        verticalOffset: 3,
        color: '#679ec5',
        text: {
          font: {
            color: _contants.WHITE,
            size: 18
          }
        }
      }
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
    },
    _circular: {
      scale: {
        scaleDivisionFactor: 17,
        orientation: _contants.OUTSIDE,
        label: {
          indentFromTick: 10
        }
      },
      rangeContainer: {
        orientation: _contants.OUTSIDE
      },
      valueIndicatorType: 'rectangleneedle',
      subvalueIndicatorType: 'trianglemarker',
      valueIndicators: {
        _type: 'rectangleneedle',
        _default: {
          offset: 20,
          indentFromCenter: 0,
          width: 2,
          spindleSize: 14,
          spindleGapSize: 10,
          beginAdaptingAtRadius: 50
        },
        // eslint-disable-next-line spellcheck/spell-checker
        triangleneedle: {
          width: 4
        },
        // eslint-disable-next-line spellcheck/spell-checker
        twocolorneedle: {
          space: 2,
          secondFraction: 0.4
        },
        rangebar: {
          offset: 30
        },
        // eslint-disable-next-line spellcheck/spell-checker
        trianglemarker: {
          offset: 6
        },
        // eslint-disable-next-line spellcheck/spell-checker
        textcloud: {
          offset: -6
        }
      }
    },
    _linear: {
      scale: {
        scaleDivisionFactor: 25,
        horizontalOrientation: _contants.RIGHT,
        verticalOrientation: _contants.BOTTOM,
        label: {
          indentFromTick: -10
        }
      },
      rangeContainer: {
        horizontalOrientation: _contants.RIGHT,
        verticalOrientation: _contants.BOTTOM
      },
      valueIndicatorType: 'rangebar',
      subvalueIndicatorType: 'trianglemarker',
      valueIndicators: {
        _type: 'rectangle',
        _default: {
          offset: 2.5,
          length: 15,
          width: 15
        },
        rectangle: {
          width: 10
        },
        rangebar: {
          offset: 10,
          horizontalOrientation: _contants.RIGHT,
          verticalOrientation: _contants.BOTTOM
        },
        // eslint-disable-next-line spellcheck/spell-checker
        trianglemarker: {
          offset: 10,
          horizontalOrientation: _contants.LEFT,
          verticalOrientation: _contants.TOP
        },
        // eslint-disable-next-line spellcheck/spell-checker
        textcloud: {
          offset: -1,
          horizontalOrientation: _contants.LEFT,
          verticalOrientation: _contants.TOP
        }
      }
    }
  }
};