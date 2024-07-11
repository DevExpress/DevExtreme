"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _bar_gauge = _interopRequireDefault(require("./bar_gauge"));
var _bullet = _interopRequireDefault(require("./bullet"));
var _chart = _interopRequireDefault(require("./chart"));
var _contants = require("./contants");
var _funnel = _interopRequireDefault(require("./funnel"));
var _gauge = _interopRequireDefault(require("./gauge"));
var _pie_chart = _interopRequireDefault(require("./pie_chart"));
var _polar_chart = _interopRequireDefault(require("./polar_chart"));
var _range_selector = _interopRequireDefault(require("./range_selector"));
var _sankey = _interopRequireDefault(require("./sankey"));
var _sparkline = _interopRequireDefault(require("./sparkline"));
var _tree_map = _interopRequireDefault(require("./tree_map"));
var _vector_map = _interopRequireDefault(require("./vector_map"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var _default = exports.default = [{
  baseThemeName: undefined,
  theme: _extends({
    name: 'generic.light',
    isDefault: true,
    font: {
      color: _contants.SECONDARY_TITLE_COLOR,
      family: '\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana, sans-serif',
      weight: 400,
      size: 12,
      cursor: 'default'
    },
    redrawOnResize: true,
    backgroundColor: _contants.WHITE,
    primaryTitleColor: _contants.PRIMARY_TITLE_COLOR,
    secondaryTitleColor: _contants.SECONDARY_TITLE_COLOR,
    gridColor: _contants.LIGHT_GREY,
    axisColor: _contants.SECONDARY_TITLE_COLOR,
    title: {
      backgroundColor: _contants.WHITE,
      font: {
        size: 28,
        family: '\'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana, sans-serif',
        weight: 200
      },
      subtitle: {
        font: {
          size: 16
        },
        offset: 0,
        wordWrap: 'normal',
        textOverflow: 'ellipsis'
      },
      wordWrap: 'normal',
      textOverflow: 'ellipsis'
    },
    loadingIndicator: {
      text: 'Loading...'
    },
    export: {
      backgroundColor: _contants.WHITE,
      margin: 10,
      font: {
        size: 14,
        color: _contants.PRIMARY_TITLE_COLOR,
        weight: 400
      },
      button: {
        margin: {
          top: 8,
          left: 10,
          right: 10,
          bottom: 8
        },
        default: {
          color: '#333',
          borderColor: '#ddd',
          backgroundColor: _contants.WHITE
        },
        hover: {
          color: '#333',
          borderColor: '#bebebe',
          backgroundColor: '#e6e6e6'
        },
        focus: {
          color: _contants.BLACK,
          borderColor: '#9d9d9d',
          backgroundColor: '#e6e6e6'
        },
        active: {
          color: '#333',
          borderColor: '#9d9d9d',
          backgroundColor: '#d4d4d4'
        }
      },
      shadowColor: _contants.LIGHT_GREY
    },
    tooltip: {
      enabled: false,
      border: {
        width: 1,
        color: _contants.LIGHT_GREY,
        dashStyle: _contants.SOLID,
        visible: true
      },
      font: {
        color: _contants.PRIMARY_TITLE_COLOR
      },
      color: _contants.WHITE,
      arrowLength: 10,
      paddingLeftRight: 18,
      paddingTopBottom: 15,
      textAlignment: 'center',
      shared: false,
      location: _contants.CENTER,
      shadow: {
        opacity: 0.4,
        offsetX: 0,
        offsetY: 4,
        blur: 2,
        color: _contants.BLACK
      },
      interactive: false
    },
    legend: {
      hoverMode: 'includePoints',
      verticalAlignment: _contants.TOP,
      horizontalAlignment: _contants.RIGHT,
      position: _contants.OUTSIDE,
      visible: true,
      margin: 10,
      markerSize: 12,
      border: {
        visible: false,
        width: 1,
        cornerRadius: 0,
        dashStyle: _contants.SOLID
      },
      paddingLeftRight: 20,
      paddingTopBottom: 15,
      columnCount: 0,
      rowCount: 0,
      columnItemSpacing: 20,
      rowItemSpacing: 8,
      title: {
        backgroundColor: _contants.WHITE,
        margin: {
          left: 0,
          bottom: 9,
          right: 0,
          top: 0
        },
        font: {
          size: 18,
          weight: 200
        },
        subtitle: {
          offset: 0,
          font: {
            size: 14
          },
          wordWrap: 'none',
          textOverflow: 'ellipsis'
        },
        wordWrap: 'none',
        textOverflow: 'ellipsis'
      }
    }
  }, _chart.default, _funnel.default, _gauge.default, _bar_gauge.default, _vector_map.default, _pie_chart.default, _polar_chart.default, _range_selector.default, _sankey.default, _sparkline.default, _bullet.default, _tree_map.default)
}, {
  baseThemeName: 'generic.light',
  theme: {
    name: 'generic.light.compact'
  }
}];