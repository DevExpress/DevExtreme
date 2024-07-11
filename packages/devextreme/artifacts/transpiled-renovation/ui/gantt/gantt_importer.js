"use strict";

exports.getGanttViewCore = getGanttViewCore;
var _ui = _interopRequireDefault(require("../widget/ui.errors"));
var _devexpressGantt = _interopRequireDefault(require("devexpress-gantt"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getGanttViewCore() {
  if (!_devexpressGantt.default) {
    throw _ui.default.Error('E1041', 'devexpress-gantt');
  }
  return _devexpressGantt.default;
}