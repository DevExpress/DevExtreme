"use strict";

exports.default = void 0;
var _common = require("../../../core/utils/common");
var _extend2 = require("../../../core/utils/extend");
var _bar_point = _interopRequireDefault(require("./bar_point"));
var _range_symbol_point = _interopRequireDefault(require("./range_symbol_point"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const _extend = _extend2.extend;
var _default = exports.default = _extend({}, _bar_point.default, {
  deleteLabel: _range_symbol_point.default.deleteLabel,
  _getFormatObject: _range_symbol_point.default._getFormatObject,
  clearVisibility: function () {
    const graphic = this.graphic;
    if (graphic && graphic.attr('visibility')) {
      graphic.attr({
        visibility: null
      });
    }
  },
  setInvisibility: function () {
    const graphic = this.graphic;
    if (graphic && graphic.attr('visibility') !== 'hidden') {
      graphic.attr({
        visibility: 'hidden'
      });
    }
    this._topLabel.draw(false);
    this._bottomLabel.draw(false);
  },
  getTooltipParams: function (location) {
    const that = this;
    const edgeLocation = location === 'edge';
    let x;
    let y;
    if (that._options.rotated) {
      x = edgeLocation ? that.x + that.width : that.x + that.width / 2;
      y = that.y + that.height / 2;
    } else {
      x = that.x + that.width / 2;
      y = edgeLocation ? that.y : that.y + that.height / 2;
    }
    return {
      x: x,
      y: y,
      offset: 0
    };
  },
  _translate: function () {
    const that = this;
    const barMethods = _bar_point.default;
    barMethods._translate.call(that);
    if (that._options.rotated) {
      that.width = that.width || 1;
    } else {
      that.height = that.height || 1;
    }
  },
  hasCoords: _range_symbol_point.default.hasCoords,
  _updateData: _range_symbol_point.default._updateData,
  _getLabelPosition: _range_symbol_point.default._getLabelPosition,
  _getLabelMinFormatObject: _range_symbol_point.default._getLabelMinFormatObject,
  _updateLabelData: _range_symbol_point.default._updateLabelData,
  _updateLabelOptions: _range_symbol_point.default._updateLabelOptions,
  getCrosshairData: _range_symbol_point.default.getCrosshairData,
  _createLabel: _range_symbol_point.default._createLabel,
  _checkOverlay: _range_symbol_point.default._checkOverlay,
  _checkLabelsOverlay: _range_symbol_point.default._checkLabelsOverlay,
  _getOverlayCorrections: _range_symbol_point.default._getOverlayCorrections,
  _drawLabel: _range_symbol_point.default._drawLabel,
  _getLabelCoords: _range_symbol_point.default._getLabelCoords,
  getLabel: _range_symbol_point.default.getLabel,
  getLabels: _range_symbol_point.default.getLabels,
  getBoundingRect: _common.noop,
  getMinValue: _range_symbol_point.default.getMinValue,
  getMaxValue: _range_symbol_point.default.getMaxValue
});
module.exports = exports.default;
module.exports.default = exports.default;