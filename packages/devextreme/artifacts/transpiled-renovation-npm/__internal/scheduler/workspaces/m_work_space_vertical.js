"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _index = require("../../scheduler/r1/utils/index");
var _m_work_space_indicator = _interopRequireDefault(require("./m_work_space_indicator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class SchedulerWorkspaceVertical extends _m_work_space_indicator.default {
  _getFormat() {
    return _index.formatWeekdayAndDay;
  }
  generateRenderOptions() {
    const options = super.generateRenderOptions();
    return _extends({}, options, {
      isGenerateTimePanelData: true
    });
  }
  _isRenderHeaderPanelEmptyCell() {
    return true;
  }
}
var _default = exports.default = SchedulerWorkspaceVertical;