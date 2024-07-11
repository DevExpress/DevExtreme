"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _contants = require("./contants");
var _default = exports.default = {
  rangeSelector: {
    scale: {
      valueMarginsEnabled: true,
      width: 1,
      color: _contants.BLACK,
      opacity: 0.1,
      showCustomBoundaryTicks: true,
      aggregateByCategory: true,
      label: {
        overlappingBehavior: 'hide',
        alignment: _contants.CENTER,
        visible: true,
        topIndent: 7,
        font: {
          size: 11
        }
      },
      tick: {
        width: 1,
        color: _contants.BLACK,
        opacity: 0.17,
        visible: true,
        length: 12
      },
      minorTick: {
        width: 1,
        color: _contants.BLACK,
        opacity: 0.05,
        visible: true,
        length: 12
      },
      marker: {
        width: 1,
        color: '#000000',
        opacity: 0.1,
        visible: true,
        separatorHeight: 33,
        topIndent: 10,
        textLeftIndent: 7,
        textTopIndent: 11,
        label: {}
      },
      logarithmBase: 10,
      workWeek: [1, 2, 3, 4, 5],
      breakStyle: {
        width: 5,
        color: '#ababab',
        line: 'waved'
      },
      endOnTick: false
    },
    selectedRangeColor: '#606060',
    sliderMarker: {
      visible: true,
      paddingTopBottom: 2,
      paddingLeftRight: 4,
      color: '#606060',
      invalidRangeColor: _contants.RED,
      font: {
        color: _contants.WHITE,
        size: 11
      }
    },
    sliderHandle: {
      width: 1,
      color: _contants.BLACK,
      opacity: 0.2
    },
    shutter: {
      opacity: 0.75
    },
    background: {
      color: '#c0bae1',
      visible: true,
      image: {
        location: 'full'
      }
    },
    behavior: {
      snapToTicks: true,
      animationEnabled: true,
      moveSelectedRangeByClick: true,
      manualRangeSelectionEnabled: true,
      allowSlidersSwap: true,
      valueChangeMode: 'onHandleRelease'
    },
    redrawOnResize: true,
    chart: {
      barGroupPadding: 0.3,
      minBubbleSize: 12,
      maxBubbleSize: 0.2,
      topIndent: 0.1,
      bottomIndent: 0,
      valueAxis: {
        inverted: false,
        logarithmBase: 10
      },
      commonSeriesSettings: {
        type: 'area',
        aggregation: {
          enabled: undefined
        },
        point: {
          visible: false
        },
        scatter: {
          point: {
            visible: true
          }
        }
      }
    }
  }
};