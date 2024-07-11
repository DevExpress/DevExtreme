"use strict";

exports.default = createStrip;
var _type = require("../../core/utils/type");
var _utils = require("../core/utils");
var _extend = require("../../core/utils/extend");
function createStrip(axis, options) {
  let storedCoord;
  let lastStoredCoordinates;
  const labelOptions = options.label || {};
  return {
    options,
    label: null,
    rect: null,
    _getCoord() {
      const canvas = axis._getCanvasStartEnd();
      const range = axis._translator.getBusinessRange();
      return axis._getStripPos(options.startValue, options.endValue, canvas.start, canvas.end, range);
    },
    _drawLabel(coords) {
      return axis._renderer.text(labelOptions.text, coords.x, coords.y).css((0, _utils.patchFontOptions)((0, _extend.extend)({}, axis.getOptions().label.font, labelOptions.font))).attr({
        align: 'center',
        'class': labelOptions.cssClass
      }).append(axis._axisStripLabelGroup);
    },
    draw() {
      if (axis._translator.getBusinessRange().isEmpty()) {
        return;
      }
      if (((0, _type.isDefined)(options.startValue) || (0, _type.isDefined)(options.endValue)) && (0, _type.isDefined)(options.color)) {
        const stripPos = this._getCoord();
        this.labelCoords = labelOptions.text ? axis._getStripLabelCoords(stripPos.from, stripPos.to, labelOptions) : null;
        if (stripPos.outOfCanvas || !(0, _type.isDefined)(stripPos.to) || !(0, _type.isDefined)(stripPos.from)) {
          return;
        }
        this.rect = axis._createStrip(axis._getStripGraphicAttributes(stripPos.from, stripPos.to)).attr({
          fill: options.color
        }).append(axis._axisStripGroup);
        this.label = labelOptions.text ? this._drawLabel(this.labelCoords) : null;
      }
    },
    getContentContainer() {
      return this.label;
    },
    removeLabel() {},
    updatePosition(animate) {
      const stripPos = this._getCoord();
      if (animate && storedCoord) {
        this.label && this.label.attr(axis._getStripLabelCoords(storedCoord.from, storedCoord.to, options.label));
        this.rect && this.rect.attr(axis._getStripGraphicAttributes(storedCoord.from, storedCoord.to));
        this.label && this.label.animate(axis._getStripLabelCoords(stripPos.from, stripPos.to, options.label));
        this.rect && this.rect.animate(axis._getStripGraphicAttributes(stripPos.from, stripPos.to));
      } else {
        this.label && this.label.attr(axis._getStripLabelCoords(stripPos.from, stripPos.to, options.label));
        this.rect && this.rect.attr(axis._getStripGraphicAttributes(stripPos.from, stripPos.to));
      }
    },
    saveCoords() {
      lastStoredCoordinates = storedCoord;
      storedCoord = this._getCoord();
    },
    resetCoordinates() {
      storedCoord = lastStoredCoordinates;
    }
  };
}
module.exports = exports.default;
module.exports.default = exports.default;