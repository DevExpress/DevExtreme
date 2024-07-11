"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _position = require("../../../core/utils/position");
var _size = require("../../../core/utils/size");
var _m_current_time_shader = _interopRequireDefault(require("./m_current_time_shader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class HorizontalCurrentTimeShader extends _m_current_time_shader.default {
  renderShader() {
    const groupCount = this._workSpace._isHorizontalGroupedWorkSpace() ? this._workSpace._getGroupCount() : 1;
    for (let i = 0; i < groupCount; i += 1) {
      const isFirstShader = i === 0;
      const $shader = isFirstShader ? this._$shader : this.createShader();
      if (this._workSpace.isGroupedByDate()) {
        this._customizeGroupedByDateShader($shader, i);
      } else {
        this._customizeShader($shader, i);
      }
      !isFirstShader && this._shader.push($shader);
    }
  }
  _customizeShader($shader, groupIndex) {
    const shaderWidth = this._workSpace.getIndicationWidth();
    this._applyShaderWidth($shader, shaderWidth);
    if (groupIndex >= 1) {
      const workSpace = this._workSpace;
      const indicationWidth = workSpace._getCellCount() * workSpace.getCellWidth();
      $shader.css('left', indicationWidth);
    } else {
      $shader.css('left', 0);
    }
  }
  _applyShaderWidth($shader, width) {
    const maxWidth = (0, _position.getBoundingRect)(this._$container.get(0)).width;
    if (width > maxWidth) {
      width = maxWidth;
    }
    if (width > 0) {
      (0, _size.setWidth)($shader, width);
    }
  }
  _customizeGroupedByDateShader($shader, groupIndex) {
    const cellCount = this._workSpace.getIndicationCellCount();
    const integerPart = Math.floor(cellCount);
    const fractionPart = cellCount - integerPart;
    const isFirstShaderPart = groupIndex === 0;
    const workSpace = this._workSpace;
    const shaderWidth = isFirstShaderPart ? workSpace.getIndicationWidth() : fractionPart * workSpace.getCellWidth();
    let shaderLeft;
    this._applyShaderWidth($shader, shaderWidth);
    if (isFirstShaderPart) {
      shaderLeft = workSpace._getCellCount() * workSpace.getCellWidth() * groupIndex;
    } else {
      shaderLeft = workSpace.getCellWidth() * integerPart * workSpace._getGroupCount() + groupIndex * workSpace.getCellWidth();
    }
    $shader.css('left', shaderLeft);
  }
}
var _default = exports.default = HorizontalCurrentTimeShader;